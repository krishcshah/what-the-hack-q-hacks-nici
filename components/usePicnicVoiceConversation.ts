"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useConversation } from "@elevenlabs/react";
import {
  getElevenLabsSignedUrl,
  getVoiceSessionErrorMessage,
  type ElevenLabsClientTools,
  type VoicePhase,
} from "@/lib/elevenlabs-session";

const CONNECT_TIMEOUT_MS = 15000;

type AppendMessage = (role: "user" | "assistant", text: string) => void;

type UsePicnicVoiceConversationOptions = {
  cartSummary: string;
  agentContext: string;
  clientTools: ElevenLabsClientTools;
  appendMessage: AppendMessage;
  onAction: (action: string) => void;
  closeAfterAction?: boolean;
  onCloseAfterAction?: () => void;
  shouldIgnoreAgentMessage?: (message: string) => boolean;
};

export function usePicnicVoiceConversation({
  cartSummary,
  agentContext,
  clientTools,
  appendMessage,
  onAction,
  closeAfterAction = false,
  onCloseAfterAction,
  shouldIgnoreAgentMessage,
}: UsePicnicVoiceConversationOptions) {
  const [bootstrapping, setBootstrapping] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const manualCloseRef = useRef(false);
  const cancelledRef = useRef(false);
  const handledAgentReplyRef = useRef(false);
  const pendingActionRef = useRef<string | null>(null);
  const closingForActionRef = useRef(false);
  const connectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const appendMessageRef = useRef(appendMessage);
  const cartSummaryRef = useRef(cartSummary);
  const agentContextRef = useRef(agentContext);
  const onActionRef = useRef(onAction);
  const onCloseAfterActionRef = useRef(onCloseAfterAction);
  const shouldIgnoreAgentMessageRef = useRef(shouldIgnoreAgentMessage);

  appendMessageRef.current = appendMessage;
  cartSummaryRef.current = cartSummary;
  agentContextRef.current = agentContext;
  onActionRef.current = onAction;
  onCloseAfterActionRef.current = onCloseAfterAction;
  shouldIgnoreAgentMessageRef.current = shouldIgnoreAgentMessage;

  const { startSession, endSession, sendContextualUpdate, status, mode, isMuted, setMuted, getInputVolume } = useConversation({
    clientTools,
    onConnect: () => {
      setConnecting(false);
      setErrorMessage(null);
    },
    onDisconnect: () => {
      setConnecting(false);
      if (manualCloseRef.current) {
        return;
      }
      if (closingForActionRef.current) {
        return;
      }
      setErrorMessage("The voice session ended. Tap retry to reconnect.");
    },
    onError: (message) => {
      setConnecting(false);
      setErrorMessage(message || "I couldn't start the voice session. Tap retry to try again.");
    },
    onMessage: ({ message, role }) => {
      if (cancelledRef.current) {
        return;
      }

      if (role === "user") {
        handledAgentReplyRef.current = false;
        appendMessageRef.current("user", message);
        void detectAction(message);
        return;
      }

      if (role === "agent") {
        if (shouldIgnoreAgentMessageRef.current?.(message)) {
          return;
        }
        handledAgentReplyRef.current = true;
        appendMessageRef.current("assistant", message);
      }
    },
  });

  const clearConnectTimeout = useCallback(() => {
    if (connectTimeoutRef.current) {
      clearTimeout(connectTimeoutRef.current);
      connectTimeoutRef.current = null;
    }
  }, []);

  const detectAction = useCallback(async (message: string) => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, cartSummary: cartSummaryRef.current }),
      });
      if (!res.ok) {
        return;
      }
      const data = (await res.json()) as { action?: string };
      if (data.action) {
        pendingActionRef.current = data.action;
      }
    } catch (error) {
      console.error("Failed to infer cart action:", error);
    }
  }, []);

  const finishPendingAction = useCallback(() => {
    const action = pendingActionRef.current;
    if (!action || closingForActionRef.current) {
      return;
    }

    pendingActionRef.current = null;
    if (closeAfterAction) {
      closingForActionRef.current = true;
      manualCloseRef.current = true;
      endSession();
      onCloseAfterActionRef.current?.();
    }
    onActionRef.current(action);
  }, [closeAfterAction, endSession]);

  const startVoiceSession = useCallback(async () => {
    manualCloseRef.current = false;
    closingForActionRef.current = false;
    handledAgentReplyRef.current = false;
    setErrorMessage(null);
    setBootstrapping(true);
    setConnecting(false);
    clearConnectTimeout();

    try {
      const signedUrl = await getElevenLabsSignedUrl();
      if (cancelledRef.current) {
        return;
      }
      setBootstrapping(false);
      setConnecting(true);
      startSession({
        signedUrl,
        connectionType: "websocket",
      });
    } catch (error) {
      if (cancelledRef.current) {
        return;
      }
      setBootstrapping(false);
      setConnecting(false);
      setErrorMessage(getVoiceSessionErrorMessage(error, "I couldn't start the voice session. Tap retry to try again."));
    }
  }, [clearConnectTimeout, startSession]);

  const stopVoiceSession = useCallback(() => {
    manualCloseRef.current = true;
    setConnecting(false);
    clearConnectTimeout();
    endSession();
  }, [clearConnectTimeout, endSession]);

  useEffect(() => {
    cancelledRef.current = false;
    void startVoiceSession();

    return () => {
      cancelledRef.current = true;
      clearConnectTimeout();
      manualCloseRef.current = true;
      endSession();
    };
  }, [clearConnectTimeout, endSession, startVoiceSession]);

  useEffect(() => {
    if (status === "connected") {
      clearConnectTimeout();
      setConnecting(false);
      closingForActionRef.current = false;
      sendContextualUpdate(agentContextRef.current);
    }
  }, [clearConnectTimeout, sendContextualUpdate, status]);

  useEffect(() => {
    if (!connecting && status !== "connecting") {
      clearConnectTimeout();
      return;
    }

    clearConnectTimeout();
    connectTimeoutRef.current = setTimeout(() => {
      manualCloseRef.current = true;
      setConnecting(false);
      endSession();
      setErrorMessage("Timed out while connecting to ElevenLabs.");
    }, CONNECT_TIMEOUT_MS);

    return () => clearConnectTimeout();
  }, [clearConnectTimeout, connecting, endSession, status]);

  useEffect(() => {
    if (bootstrapping) {
      return;
    }

    if (status === "connected" && mode !== "speaking" && handledAgentReplyRef.current && pendingActionRef.current) {
      finishPendingAction();
    }
  }, [bootstrapping, finishPendingAction, mode, status]);

  const phase: VoicePhase = bootstrapping
    ? "bootstrapping"
    : errorMessage || status === "error"
      ? "error"
      : connecting || status === "connecting"
        ? "connecting"
        : mode === "speaking"
          ? "speaking"
          : "listening";

  return {
    phase,
    errorMessage,
    isMuted,
    setMuted,
    getInputVolume,
    retryVoiceSession: startVoiceSession,
    stopVoiceSession,
  };
}
