"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { Mic, Sparkles } from "lucide-react";
import type { VoiceConversation } from "@elevenlabs/client";
import { startElevenLabsVoiceSession, type ElevenLabsClientTools } from "@/lib/elevenlabs-session";

type TranscriptMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

export default function GlobalVoiceAgent({
  isActive,
  onClose,
  cartSummary,
  agentContext,
  clientTools,
  onAction,
}: {
  isActive: boolean;
  onClose: () => void;
  cartSummary: string;
  agentContext: string;
  clientTools: ElevenLabsClientTools;
  onAction: (action: string) => void;
}) {
  const [phase, setPhase] = useState<"connecting" | "listening" | "speaking">("connecting");
  const [messages, setMessages] = useState<TranscriptMessage[]>([]);
  const [inputLevel, setInputLevel] = useState(0.18);
  const conversationRef = useRef<VoiceConversation | null>(null);
  const pendingActionRef = useRef<string | null>(null);
  const handledAgentReplyRef = useRef(false);
  const closingForActionRef = useRef(false);
  const cancelledRef = useRef(false);
  const phaseRef = useRef<"connecting" | "listening" | "speaking">("connecting");
  const cartSummaryRef = useRef(cartSummary);
  const agentContextRef = useRef(agentContext);
  const onActionRef = useRef(onAction);
  const onCloseRef = useRef(onClose);
  const levelAnimationFrameRef = useRef<number | null>(null);
  const levelStreamRef = useRef<MediaStream | null>(null);
  const levelAudioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    cartSummaryRef.current = cartSummary;
    agentContextRef.current = agentContext;
    onActionRef.current = onAction;
    onCloseRef.current = onClose;
  }, [agentContext, cartSummary, onAction, onClose]);

  useEffect(() => {
    const conversation = conversationRef.current;
    if (!conversation) {
      return;
    }
    conversation.sendContextualUpdate(agentContext);
  }, [agentContext]);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    let timer: ReturnType<typeof setTimeout> | null = null;
    cancelledRef.current = false;
    pendingActionRef.current = null;
    handledAgentReplyRef.current = false;
    closingForActionRef.current = false;
    setPhase("connecting");
    phaseRef.current = "connecting";
    setMessages([]);
    setInputLevel(0.18);

    const appendMessage = (role: TranscriptMessage["role"], text: string) => {
      setMessages((current) => {
        const trimmedText = text.trim();
        if (!trimmedText) {
          return current;
        }
        const last = current.at(-1);
        if (last?.role === role && last.text === trimmedText) {
          return current;
        }
        const next = [...current, { id: `${role}-${Date.now()}-${current.length}`, role, text: trimmedText }];
        return next.slice(-3);
      });
    };

    const stopLevelTracking = () => {
      if (levelAnimationFrameRef.current) {
        cancelAnimationFrame(levelAnimationFrameRef.current);
        levelAnimationFrameRef.current = null;
      }
      levelStreamRef.current?.getTracks().forEach((track) => track.stop());
      levelStreamRef.current = null;
      void levelAudioContextRef.current?.close().catch(() => undefined);
      levelAudioContextRef.current = null;
    };

    const startLevelTracking = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AudioContextCtor) {
          return;
        }

        const context = new AudioContextCtor();
        const analyser = context.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;
        const source = context.createMediaStreamSource(stream);
        source.connect(analyser);

        levelStreamRef.current = stream;
        levelAudioContextRef.current = context;

        const samples = new Uint8Array(analyser.frequencyBinCount);
        const updateLevel = () => {
          analyser.getByteFrequencyData(samples);
          const average = samples.reduce((sum, value) => sum + value, 0) / (samples.length * 255);
          setInputLevel((current) => current * 0.55 + Math.max(average, 0.04) * 0.45);
          levelAnimationFrameRef.current = requestAnimationFrame(updateLevel);
        };

        updateLevel();
      } catch (error) {
        console.error("Failed to track microphone level:", error);
      }
    };

    const detectAction = async (message: string) => {
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, cartSummary: cartSummaryRef.current }),
        });
        if (!res.ok) {
          return;
        }
        const data = await res.json();
        if (data.action) {
          pendingActionRef.current = data.action;
          if (handledAgentReplyRef.current && phaseRef.current !== "speaking") {
            finishPendingAction();
          }
        }
      } catch (error) {
        console.error("Failed to infer cart action:", error);
      }
    };

    const finishPendingAction = () => {
      const action = pendingActionRef.current;
      if (!action || closingForActionRef.current) {
        return;
      }
      closingForActionRef.current = true;
      pendingActionRef.current = null;
      const conversation = conversationRef.current;
      conversationRef.current = null;
      stopLevelTracking();
      void conversation?.endSession();
      onCloseRef.current();
      onActionRef.current(action);
    };

    void startLevelTracking();

    timer = setTimeout(() => {
      void (async () => {
        try {
          const conversation = (await startElevenLabsVoiceSession({
            clientTools,
            onConnect: () => {
              if (!cancelledRef.current) {
                phaseRef.current = "listening";
                setPhase("listening");
              }
            },
            onDisconnect: () => {
              stopLevelTracking();
              if (!cancelledRef.current && !closingForActionRef.current) {
                onCloseRef.current();
              }
            },
            onModeChange: ({ mode }) => {
              if (cancelledRef.current) {
                return;
              }
              const nextPhase = mode === "speaking" ? "speaking" : "listening";
              phaseRef.current = nextPhase;
              setPhase(nextPhase);
              if (mode !== "speaking" && handledAgentReplyRef.current && pendingActionRef.current) {
                finishPendingAction();
              }
            },
            onMessage: ({ message, role }) => {
              if (cancelledRef.current) {
                return;
              }
              if (role === "user") {
                handledAgentReplyRef.current = false;
                appendMessage("user", message);
                void detectAction(message);
              }
              if (role === "agent") {
                handledAgentReplyRef.current = true;
                appendMessage("assistant", message);
              }
            },
            onError: (message) => {
              console.error("ElevenLabs error:", message);
              stopLevelTracking();
              if (!cancelledRef.current) {
                onCloseRef.current();
              }
            },
          })) as VoiceConversation;

          if (cancelledRef.current) {
            await conversation.endSession();
          } else {
            conversationRef.current = conversation;
            conversation.sendContextualUpdate(agentContextRef.current);
          }
        } catch (error) {
          console.error("Failed to start ElevenLabs session:", error);
          stopLevelTracking();
          if (!cancelledRef.current) {
            onCloseRef.current();
          }
        }
      })();
    }, 50);

    return () => {
      cancelledRef.current = true;
      if (timer) {
        clearTimeout(timer);
      }
      if (levelAnimationFrameRef.current) {
        cancelAnimationFrame(levelAnimationFrameRef.current);
        levelAnimationFrameRef.current = null;
      }
      levelStreamRef.current?.getTracks().forEach((track) => track.stop());
      levelStreamRef.current = null;
      void levelAudioContextRef.current?.close().catch(() => undefined);
      levelAudioContextRef.current = null;
      conversationRef.current?.endSession();
      conversationRef.current = null;
    };
  }, [clientTools, isActive]);

  const handleStop = () => {
    conversationRef.current?.endSession();
    conversationRef.current = null;
    onClose();
  };

  const visibleMessages = useMemo(() => messages.slice(-2).reverse(), [messages]);
  const pulseStrength = phase === "speaking" ? 0.82 : inputLevel;
  const pulseScale = 1 + pulseStrength * 0.42;
  const glowOpacity = 0.18 + pulseStrength * 0.4;

  if (!isActive) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-[80] mx-auto flex max-w-md flex-col items-center px-5">
      <div className="mb-4 flex w-full flex-col items-center gap-2">
        {visibleMessages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`pointer-events-none max-w-[85%] rounded-[22px] px-4 py-3 shadow-[0_10px_24px_rgba(0,0,0,0.12)] backdrop-blur ${
              message.role === "assistant" ? "self-start bg-white/92" : "self-end bg-[#fff1f3]/96"
            } ${index === 0 ? "" : "opacity-85"}`}
          >
            <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8b8b8b]">
              {message.role === "assistant" ? <Sparkles size={12} className="text-[#d40c2f]" /> : <Mic size={12} className="text-[#7b7b7b]" />}
              {message.role === "assistant" ? "Nici" : "You"}
            </div>
            <p className="text-sm font-medium leading-5 text-[#2c2c2c]">{message.text}</p>
          </motion.div>
        ))}

        {visibleMessages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#7d7d7d] shadow-[0_8px_18px_rgba(0,0,0,0.08)] backdrop-blur"
          >
            {phase === "connecting" ? "Connecting" : phase === "speaking" ? "Nici is speaking" : "Listening"}
          </motion.div>
        )}
      </div>

      <div className="pointer-events-auto relative">
        <motion.div
          animate={{
            scale: [pulseScale * 0.96, pulseScale, pulseScale * 0.98],
            opacity: [glowOpacity * 0.6, glowOpacity, glowOpacity * 0.7],
          }}
          transition={{ repeat: Infinity, duration: 0.9, ease: "easeInOut" }}
          className="absolute inset-[-18px] rounded-full bg-[radial-gradient(circle,rgba(212,12,47,0.28)_0%,rgba(212,12,47,0.14)_45%,rgba(212,12,47,0.03)_72%,rgba(212,12,47,0)_100%)] blur-xl"
        />
        <motion.div
          animate={{
            scale: [pulseScale * 0.88, pulseScale * 0.94, pulseScale * 0.9],
            opacity: [0.2, 0.34, 0.24],
          }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-[-8px] rounded-full border border-white/70 bg-white/18 backdrop-blur-md"
        />
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleStop}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#d40c2f] text-white shadow-[0_12px_26px_rgba(212,12,47,0.34)]"
          aria-label="Stop voice session"
        >
          <Mic size={22} />
        </motion.button>
      </div>
    </div>
  );
}
