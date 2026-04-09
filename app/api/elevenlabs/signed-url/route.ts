import { NextResponse } from "next/server";
import { ElevenLabsBootstrapError, getElevenLabsAgentId } from "@/lib/elevenlabs-agent";

const SIGNED_URL_TIMEOUT_MS = 8000;

export async function GET() {
  const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;
  const elevenLabsAgentId = process.env.ELEVENLABS_AGENT_ID;

  if (!elevenLabsApiKey) {
    return NextResponse.json(
      { error: "ElevenLabs not configured. Set ELEVENLABS_API_KEY." },
      { status: 500 }
    );
  }

  if (!elevenLabsAgentId) {
    return NextResponse.json(
      { error: "ElevenLabs not configured. Set ELEVENLABS_AGENT_ID.", stage: "bootstrap_failed" },
      { status: 500 }
    );
  }

  try {
    const agentId = await getElevenLabsAgentId({
      configuredAgentId: elevenLabsAgentId,
    });

    console.info("[elevenlabs] requesting signed url", agentId);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), SIGNED_URL_TIMEOUT_MS);
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${encodeURIComponent(agentId)}`,
      {
        headers: {
          "xi-api-key": elevenLabsApiKey,
        },
        signal: controller.signal,
      }
    ).finally(() => clearTimeout(timeoutId));

    const bodyText = await response.text();
    if (!response.ok) {
      console.error("[elevenlabs] signed url request failed", response.status, bodyText);
      return NextResponse.json(
        { error: bodyText || "Failed to get signed URL", stage: "signed_url_failed" },
        { status: response.status }
      );
    }

    const body = JSON.parse(bodyText) as { signed_url: string };
    return NextResponse.json({ signedUrl: body.signed_url });
  } catch (error: any) {
    if (error instanceof ElevenLabsBootstrapError) {
      console.error("[elevenlabs] bootstrap failed", error.detailStage, error.message);
      return NextResponse.json(
        { error: error.message, stage: "bootstrap_failed" },
        { status: 500 }
      );
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      console.error("[elevenlabs] signed url timed out");
      return NextResponse.json(
        { error: "Timed out while requesting a signed URL from ElevenLabs.", stage: "signed_url_failed" },
        { status: 504 }
      );
    }

    console.error("[elevenlabs] unexpected signed url failure", error);
    return NextResponse.json(
      { error: error.message ?? "Failed to get signed URL", stage: "signed_url_failed" },
      { status: 500 }
    );
  }
}
