"use client";

import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { motion } from "motion/react";
import { Mic, MicOff, X } from "lucide-react";
import type { VoiceConversation } from "@elevenlabs/client";
import { startElevenLabsVoiceSession, type ElevenLabsClientTools } from "@/lib/elevenlabs-session";

export type ChatMessage = { role: "assistant" | "user"; text: string };

const DEFAULT_AGENT_GREETING = "Hi! I'm your Picnic assistant. How can I help with your cart today?";

export default function VoiceChatView({
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
  const [phase, setPhase] = useState<"connecting" | "listening" | "speaking">("connecting");
  const [isMuted, setIsMuted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const conversationRef = useRef<VoiceConversation | null>(null);
  const cancelledRef = useRef(false);
  const connectingRef = useRef(false);
  const manualCloseRef = useRef(false);
  const phaseRef = useRef<"connecting" | "listening" | "speaking">("connecting");
  const pendingActionRef = useRef<string | null>(null);
  const handledAgentReplyRef = useRef(false);
  const skippedGreetingRef = useRef(false);
  const messagesRef = useRef(messages);
  const onActionRef = useRef(onAction);
  const cartSummaryRef = useRef(cartSummary);
  const agentContextRef = useRef(agentContext);
  const startConversationRef = useRef<(() => Promise<void>) | null>(null);

  useEffect(() => {
    messagesRef.current = messages;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    onActionRef.current = onAction;
    cartSummaryRef.current = cartSummary;
    agentContextRef.current = agentContext;
  }, [agentContext, onAction, cartSummary]);

  useEffect(() => {
    const conversation = conversationRef.current;
    if (!conversation) {
      return;
    }
    conversation.sendContextualUpdate(agentContext);
  }, [agentContext]);

  const appendMessage = useCallback((next: ChatMessage) => {
    setMessages((prev) => {
      const last = prev.at(-1);
      if (last?.role === next.role && last.text === next.text) {
        return prev;
      }
      return [...prev, next];
    });
  }, [setMessages]);

  const endConversation = useCallback(async () => {
    const conversation = conversationRef.current;
    conversationRef.current = null;
    connectingRef.current = false;
    if (!conversation) {
      return;
    }
    try {
      await conversation.endSession();
    } catch (error) {
      console.error("Failed to end ElevenLabs session:", error);
    }
  }, []);

  useEffect(() => {
    cancelledRef.current = false;
    manualCloseRef.current = false;
    connectingRef.current = false;
    pendingActionRef.current = null;
    handledAgentReplyRef.current = false;
    skippedGreetingRef.current = false;
    setIsMuted(false);

    const finishPendingAction = () => {
      const action = pendingActionRef.current;
      if (!action) {
        return;
      }
      pendingActionRef.current = null;
      onActionRef.current(action);
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

    const startConversation = async () => {
      if (cancelledRef.current || connectingRef.current || conversationRef.current) {
        return;
      }

      connectingRef.current = true;
      setPhase("connecting");
      phaseRef.current = "connecting";

      try {
        const conversation = (await startElevenLabsVoiceSession({
          clientTools,
          onConnect: () => {
            if (cancelledRef.current) {
              return;
            }
            connectingRef.current = false;
            phaseRef.current = "listening";
            setPhase("listening");
          },
          onDisconnect: () => {
            conversationRef.current = null;
            connectingRef.current = false;
            if (!cancelledRef.current && !manualCloseRef.current) {
              phaseRef.current = "connecting";
              setPhase("connecting");
              appendMessage({
                role: "assistant",
                text: "The voice session ended. Tap the mic to reconnect.",
              });
            }
            manualCloseRef.current = false;
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
              appendMessage({ role: "user", text: message });
              void detectAction(message);
              return;
            }

            if (
              role === "agent" &&
              !skippedGreetingRef.current &&
              message === DEFAULT_AGENT_GREETING &&
              messagesRef.current.some((entry) => entry.role === "assistant")
            ) {
              skippedGreetingRef.current = true;
              return;
            }

            if (role === "agent") {
              handledAgentReplyRef.current = true;
              appendMessage({ role: "assistant", text: message });
            }
          },
          onError: (message) => {
            console.error("ElevenLabs error:", message);
            if (!cancelledRef.current) {
              appendMessage({
                role: "assistant",
                text: "I couldn't start the voice session. Tap the mic to try again.",
              });
              phaseRef.current = "connecting";
              setPhase("connecting");
            }
          },
        })) as VoiceConversation;

        if (cancelledRef.current) {
          connectingRef.current = false;
          try {
            await conversation.endSession();
          } catch (error) {
            console.error("Failed to close cancelled ElevenLabs session:", error);
          }
          return;
        }

        conversationRef.current = conversation;
        conversation.sendContextualUpdate(agentContextRef.current);
        conversation.setMicMuted(false);
      } catch (error) {
        connectingRef.current = false;
        console.error("Failed to start ElevenLabs session:", error);
        if (!cancelledRef.current) {
          appendMessage({
            role: "assistant",
            text: "I couldn't start the voice session. Tap the mic to try again.",
          });
          phaseRef.current = "connecting";
          setPhase("connecting");
        }
      }
    };

    startConversationRef.current = startConversation;
    const timer = setTimeout(() => {
      void startConversation();
    }, 50);

    return () => {
      cancelledRef.current = true;
      startConversationRef.current = null;
      clearTimeout(timer);
      manualCloseRef.current = true;
      void endConversation();
    };
  }, [appendMessage, clientTools, endConversation]);

  const handleClose = () => {
    cancelledRef.current = true;
    manualCloseRef.current = true;
    void endConversation();
    onClose();
  };

  const handleMicTap = () => {
    if (!conversationRef.current) {
      void startConversationRef.current?.();
      return;
    }

    const nextMuted = !isMuted;
    try {
      conversationRef.current.setMicMuted(nextMuted);
    } catch (error) {
      console.error("Failed to update mic mute state:", error);
    }
    setIsMuted(nextMuted);
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
          {phase === "connecting" ? "Connecting..." : phase === "speaking" ? "Nici is speaking" : isMuted ? "Mic muted" : "Listening"}
        </div>
        <div className="relative pointer-events-auto">
          <motion.div
            animate={
              phase === "listening" && !isMuted
                ? { scale: [1, 1.25, 1], opacity: [0.4, 0.7, 0.4] }
                : phase === "connecting"
                  ? { rotate: 360 }
                  : { scale: [1, 1.08, 1] }
            }
            transition={{
              repeat: Infinity,
              duration: phase === "connecting" ? 1.5 : 2,
              ease: phase === "connecting" ? "linear" : "easeInOut",
            }}
            className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-50"
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleMicTap}
            className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-xl border-4 border-white ${
              isMuted ? "bg-gray-500" : "bg-red-500"
            }`}
            aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
          >
            {isMuted ? <MicOff size={26} className="text-white" /> : <Mic size={26} className="text-white" />}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
