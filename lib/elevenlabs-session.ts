"use client";

const SIGNED_URL_ROUTE = "/api/elevenlabs/signed-url";

export type ElevenLabsClientTools = {
  search_products: (parameters: { query?: string }) => string;
  add_product_to_cart: (parameters: { productId?: string }) => string;
  remove_product_from_cart: (parameters: { productId?: string }) => string;
  schedule_delivery: (parameters: {
    dateLabel?: string;
    windowStart?: string;
    windowEnd?: string;
  }) => string;
};

export type VoicePhase = "bootstrapping" | "connecting" | "listening" | "speaking" | "error";
export type SignedUrlErrorStage = "bootstrap_failed" | "signed_url_failed";

type SignedUrlSuccess = {
  signedUrl: string;
};

type SignedUrlFailure = {
  error?: string;
  stage?: SignedUrlErrorStage;
};

export class VoiceSessionStartError extends Error {
  constructor(
    message: string,
    readonly stage: "bootstrapping" | "connecting" | "unknown",
    readonly serverStage?: SignedUrlErrorStage
  ) {
    super(message);
    this.name = "VoiceSessionStartError";
  }
}

export async function requestMicrophoneAccess() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  stream.getTracks().forEach((track) => track.stop());
}

export async function getElevenLabsSignedUrl() {
  const response = await fetch(SIGNED_URL_ROUTE);
  if (response.ok) {
    const body = (await response.json()) as SignedUrlSuccess;
    return body.signedUrl;
  }

  const body = (await response.json().catch(async () => ({ error: await response.text() }))) as SignedUrlFailure;
  throw new VoiceSessionStartError(
    body.error ?? "Failed to get a signed ElevenLabs URL.",
    "bootstrapping",
    body.stage
  );
}

export function getVoiceSessionErrorMessage(error: unknown, fallback: string) {
  if (error instanceof VoiceSessionStartError) {
    return error.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
