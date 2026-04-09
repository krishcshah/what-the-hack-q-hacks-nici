"use client";

import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { ConversationProvider } from "@elevenlabs/react";
import { motion } from "motion/react";
import { Mic, MicOff, X } from "lucide-react";
import { type ElevenLabsClientTools, type VoicePhase } from "@/lib/elevenlabs-session";
import { usePicnicVoiceConversation } from "./usePicnicVoiceConversation";

export type ChatMessage = { role: "assistant" | "user"; text: string };

const DEFAULT_AGENT_GREETING = "Hi! I'm your Picnic assistant. How can I help with your cart today?";

function getStatusLabel(phase: VoicePhase, isMuted: boolean) {
  if (phase === "bootstrapping") {
    return "Preparing voice...";
  }
  if (phase === "connecting") {
    return "Connecting...";
  }
  if (phase === "speaking") {
    return "Nici is speaking";
  }
  if (phase === "error") {
    return "Connection failed";
  }
  return isMuted ? "Mic muted" : "Listening";
}

function VoiceChatViewInner({
  messages,
  setMessages,
  onClose,
  cartSummary,
  agentContext,
  clientTools,
  onAction,
}: {
  messages: ChatMessage[];
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  onClose: () => void;
  cartSummary: string;
  agentContext: string;
  clientTools: ElevenLabsClientTools;
  onAction: (action: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef(messages);

  useEffect(() => {
    messagesRef.current = messages;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const appendMessage = useCallback((role: ChatMessage["role"], text: string) => {
    setMessages((prev) => {
      const last = prev.at(-1);
      if (last?.role === role && last.text === text) {
        return prev;
      }
      return [...prev, { role, text }];
    });
  }, [setMessages]);

  const { phase, errorMessage, isMuted, setMuted, retryVoiceSession, stopVoiceSession } = usePicnicVoiceConversation({
    cartSummary,
    agentContext,
    clientTools,
    appendMessage,
    onAction,
    shouldIgnoreAgentMessage: (message) =>
      message === DEFAULT_AGENT_GREETING && messagesRef.current.some((entry) => entry.role === "assistant"),
  });

  const handleClose = () => {
    stopVoiceSession();
    onClose();
  };

  const handleMicTap = () => {
    if (phase === "error") {
      void retryVoiceSession();
      return;
    }

    if (phase === "bootstrapping" || phase === "connecting") {
      return;
    }

    setMuted(!isMuted);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-pink-100 via-white to-pink-50">
      <div className="relative px-6 pt-6 pb-4 flex items-center justify-center">
        <h1 className="text-base font-bold text-red-700 text-center">Let&apos;s get to know each other</h1>
        <button onClick={handleClose} className="absolute right-4 top-5 text-gray-500 hover:text-gray-800" aria-label="Close">
          <X size={22} />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 pb-40 scrollbar-hide">
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className="mb-6">
            {message.role === "assistant" ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 bg-red-500 rounded-full flex items-center justify-center shadow-md shadow-red-500/20">
                    <div className="relative w-4 h-4">
                      <div className="absolute top-1 left-0.5 w-1 h-1 bg-white rounded-full"></div>
                      <div className="absolute top-1 right-0.5 w-1 h-1 bg-white rounded-full"></div>
                      <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-2.5 h-1.5 border-b border-white rounded-b-full"></div>
                    </div>
                  </div>
                  <span className="text-red-700 font-semibold text-sm">Nici</span>
                </div>
                <p className="text-gray-900 text-[15px] leading-snug whitespace-pre-line">{message.text}</p>
              </div>
            ) : (
              <div className="flex justify-end">
                <div className="max-w-[75%] bg-gray-200/80 rounded-2xl px-4 py-3">
                  <div className="text-xs text-gray-500 font-medium mb-1">You</div>
                  <p className="text-gray-900 text-[15px] leading-snug">{message.text}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto pb-10 pt-4 flex flex-col items-center bg-gradient-to-t from-pink-100 via-pink-50/80 to-transparent pointer-events-none">
        <div className="mb-3 text-xs font-medium uppercase tracking-wider text-red-700/80 pointer-events-none">
          {getStatusLabel(phase, isMuted)}
        </div>
        <div className="relative pointer-events-auto">
          <motion.div
            animate={
              phase === "listening" && !isMuted
                ? { scale: [1, 1.25, 1], opacity: [0.4, 0.7, 0.4] }
                : phase === "bootstrapping" || phase === "connecting"
                  ? { rotate: 360 }
                  : phase === "error"
                    ? { scale: 1, opacity: 0.25 }
                    : { scale: [1, 1.08, 1] }
            }
            transition={{
              repeat: Infinity,
              duration: phase === "bootstrapping" || phase === "connecting" ? 1.5 : 2,
              ease: phase === "bootstrapping" || phase === "connecting" ? "linear" : "easeInOut",
            }}
            className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-50"
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleMicTap}
            className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-xl border-4 border-white ${
              phase === "error" ? "bg-red-700" : isMuted ? "bg-gray-500" : "bg-red-500"
            }`}
            aria-label={phase === "error" ? "Retry voice session" : isMuted ? "Unmute microphone" : "Mute microphone"}
          >
            {phase === "error" ? (
              <Mic size={26} className="text-white" />
            ) : isMuted ? (
              <MicOff size={26} className="text-white" />
            ) : (
              <Mic size={26} className="text-white" />
            )}
          </motion.button>
        </div>
        {phase === "error" && errorMessage && (
          <button
            onClick={() => void retryVoiceSession()}
            className="pointer-events-auto mt-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-red-700 shadow-sm"
          >
            Retry voice
          </button>
        )}
      </div>
    </div>
  );
}

export default function VoiceChatView(props: {
  messages: ChatMessage[];
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  onClose: () => void;
  cartSummary: string;
  agentContext: string;
  clientTools: ElevenLabsClientTools;
  onAction: (action: string) => void;
}) {
  return (
    <ConversationProvider>
      <VoiceChatViewInner {...props} />
    </ConversationProvider>
  );
}
