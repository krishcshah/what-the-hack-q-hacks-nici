"use client";

import { Conversation, type PartialOptions, type VoiceConversation } from "@elevenlabs/client";

const publicAgentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
export type ElevenLabsClientTools = NonNullable<PartialOptions["clientTools"]>;

async function preflightMicrophoneAccess() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  stream.getTracks().forEach((track) => track.stop());
}

async function getSessionAuth():
  Promise<{ agentId: string; connectionType: "websocket" } | { signedUrl: string; connectionType: "websocket" }> {
  if (publicAgentId) {
    return { agentId: publicAgentId, connectionType: "websocket" };
  }

  const response = await fetch("/api/elevenlabs/signed-url");
  if (!response.ok) {
    const body = await response.json().catch(async () => ({ error: await response.text() }));
    throw new Error(body.error ?? "Failed to get signed URL");
  }

  const body = (await response.json()) as { signedUrl: string };
  return { signedUrl: body.signedUrl, connectionType: "websocket" };
}

export async function startElevenLabsVoiceSession(
  options: Omit<PartialOptions, "agentId" | "conversationToken" | "signedUrl" | "textOnly" | "connectionType">
): Promise<VoiceConversation> {
  await preflightMicrophoneAccess();
  const auth = await getSessionAuth();
  return (await Conversation.startSession({
    ...auth,
    ...options,
  })) as VoiceConversation;
}
