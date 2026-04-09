export class ElevenLabsBootstrapError extends Error {
  readonly stage = "bootstrap_failed";

  constructor(message: string, readonly detailStage: string) {
    super(message);
    this.name = "ElevenLabsBootstrapError";
  }
}

export async function getElevenLabsAgentId({
  configuredAgentId,
}: {
  configuredAgentId?: string;
}) {
  const agentId = configuredAgentId?.trim();
  if (!agentId) {
    throw new ElevenLabsBootstrapError(
      "ELEVENLABS_AGENT_ID is required for the ElevenLabs signed-url flow.",
      "resolving ElevenLabs agent ID"
    );
  }

  return agentId;
}
