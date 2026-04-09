"use client";

import { useRouter } from "next/navigation";
import HomeView from "@/components/HomeView";
import VoiceChatView from "@/components/VoiceChatView";
import { useCart } from "@/components/CartProvider";

export default function HomePage() {
  const router = useRouter();
  const {
    cartState,
    cartSummary,
    voiceAgentContext,
    voiceClientTools,
    handleAdjust,
    openHomeVoice,
    closeHomeVoice,
    isHomeVoiceActive,
    messages,
    setMessages,
  } =
    useCart();

  if (isHomeVoiceActive) {
    return (
      <VoiceChatView
        messages={messages}
        setMessages={setMessages}
        onClose={closeHomeVoice}
        cartSummary={cartSummary}
        agentContext={voiceAgentContext}
        clientTools={voiceClientTools}
        onAction={handleAdjust}
      />
    );
  }

  return <HomeView cartState={cartState} onGoToCart={() => router.push("/cart")} onMicClick={openHomeVoice} />;
}
