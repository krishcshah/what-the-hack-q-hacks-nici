"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ConversationProvider } from "@elevenlabs/react";
import { motion } from "motion/react";
import { Mic, Sparkles } from "lucide-react";
import { type ElevenLabsClientTools, type VoicePhase } from "@/lib/elevenlabs-session";
import { usePicnicVoiceConversation } from "./usePicnicVoiceConversation";

type TranscriptMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

function getStatusLabel(phase: VoicePhase) {
  if (phase === "bootstrapping") {
    return "Preparing voice";
  }
  if (phase === "connecting") {
    return "Connecting";
  }
  if (phase === "speaking") {
    return "Nici is speaking";
  }
  if (phase === "error") {
    return "Connection failed";
  }
  return "Listening";
}

function GlobalVoiceAgentInner({
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
  const [messages, setMessages] = useState<TranscriptMessage[]>([]);
  const [inputLevel, setInputLevel] = useState(0.18);
  const levelAnimationFrameRef = useRef<number | null>(null);

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

  const { phase, errorMessage, getInputVolume, retryVoiceSession, stopVoiceSession } = usePicnicVoiceConversation({
    cartSummary,
    agentContext,
    clientTools,
    appendMessage,
    onAction,
    closeAfterAction: true,
    onCloseAfterAction: onClose,
  });

  useEffect(() => {
    if (!isActive) {
      return;
    }

    const stopLevelTracking = () => {
      if (levelAnimationFrameRef.current) {
        cancelAnimationFrame(levelAnimationFrameRef.current);
        levelAnimationFrameRef.current = null;
      }
    };

    const updateLevel = () => {
      const volume = Math.max(getInputVolume(), 0.04);
      setInputLevel((current) => current * 0.55 + volume * 0.45);
      levelAnimationFrameRef.current = requestAnimationFrame(updateLevel);
    };

    updateLevel();
    return () => stopLevelTracking();
  }, [getInputVolume, isActive]);

  const handleStop = () => {
    if (phase === "error") {
      void retryVoiceSession();
      return;
    }

    stopVoiceSession();
    onClose();
  };

  const visibleMessages = useMemo(() => messages.slice(-2).reverse(), [messages]);
  const pulseStrength = phase === "speaking" ? 0.82 : phase === "error" ? 0.1 : inputLevel;
  const pulseScale = 1 + pulseStrength * 0.42;
  const glowOpacity = phase === "error" ? 0.12 : 0.18 + pulseStrength * 0.4;

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
            {getStatusLabel(phase)}
          </motion.div>
        )}
      </div>

      <div className="pointer-events-auto relative">
        <motion.div
          animate={{
            scale: phase === "error" ? 1 : [pulseScale * 0.96, pulseScale, pulseScale * 0.98],
            opacity: phase === "error" ? 0.18 : [glowOpacity * 0.6, glowOpacity, glowOpacity * 0.7],
          }}
          transition={{ repeat: Infinity, duration: 0.9, ease: "easeInOut" }}
          className="absolute inset-[-18px] rounded-full bg-[radial-gradient(circle,rgba(212,12,47,0.28)_0%,rgba(212,12,47,0.14)_45%,rgba(212,12,47,0.03)_72%,rgba(212,12,47,0)_100%)] blur-xl"
        />
        <motion.div
          animate={{
            scale: phase === "error" ? 1 : [pulseScale * 0.88, pulseScale * 0.94, pulseScale * 0.9],
            opacity: phase === "error" ? 0.12 : [0.2, 0.34, 0.24],
          }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-[-8px] rounded-full border border-white/70 bg-white/18 backdrop-blur-md"
        />
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleStop}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#d40c2f] text-white shadow-[0_12px_26px_rgba(212,12,47,0.34)]"
          aria-label={phase === "error" ? "Retry voice session" : "Stop voice session"}
        >
          <Mic size={22} />
        </motion.button>
      </div>

      {phase === "error" && errorMessage && (
        <button
          onClick={() => void retryVoiceSession()}
          className="pointer-events-auto mt-4 rounded-full bg-white/92 px-4 py-2 text-sm font-semibold text-[#d40c2f] shadow-[0_10px_24px_rgba(0,0,0,0.12)]"
        >
          Retry voice
        </button>
      )}
    </div>
  );
}

export default function GlobalVoiceAgent(props: {
  isActive: boolean;
  onClose: () => void;
  cartSummary: string;
  agentContext: string;
  clientTools: ElevenLabsClientTools;
  onAction: (action: string) => void;
}) {
  return (
    <ConversationProvider>
      <GlobalVoiceAgentInner {...props} />
    </ConversationProvider>
  );
}
