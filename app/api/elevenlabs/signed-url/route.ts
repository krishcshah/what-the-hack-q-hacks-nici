import { NextResponse } from "next/server";
import { getElevenLabsAgentId } from "@/lib/elevenlabs-agent";

export async function GET() {
  const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;
  const elevenLabsAgentId = process.env.ELEVENLABS_AGENT_ID;

  if (!elevenLabsApiKey) {
    return NextResponse.json(
      { error: "ElevenLabs not configured. Set ELEVENLABS_API_KEY." },
      { status: 500 }
    );
  }

  try {
    const agentId = await getElevenLabsAgentId({
      apiKey: elevenLabsApiKey,
      configuredAgentId: elevenLabsAgentId,
    });

    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${encodeURIComponent(agentId)}`,
      {
        headers: {
          "xi-api-key": elevenLabsApiKey,
        },
      }
    );

    const bodyText = await response.text();
    if (!response.ok) {
      return NextResponse.json(
        { error: bodyText || "Failed to get signed URL" },
        { status: response.status }
      );
    }

    const body = JSON.parse(bodyText) as { signed_url: string };
    return NextResponse.json({ signedUrl: body.signed_url });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message ?? "Failed to get signed URL" },
      { status: 500 }
    );
  }
}
