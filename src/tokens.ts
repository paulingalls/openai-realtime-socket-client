import {
  ClientSecret,
  RealtimeModel,
  RealtimeSession,
  RealtimeSessionConfig,
  RealtimeTranscriptionSession,
  RealtimeTranscriptionSessionConfig
} from "./realtimeTypes";

export async function createSessionWithEphemeralToken(
  model: RealtimeModel,
  sessionConfig: Partial<RealtimeSessionConfig>,
  apiKey: string = process.env.OPENAI_API_KEY ?? ''
): Promise<RealtimeSession & { client_secret: ClientSecret }> {
  const r = await fetch("https://api.openai.com/v1/realtime/sessions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      ...sessionConfig,
    }),
  });
  return await r.json();
}

export async function createTranscriptionSessionWithEphemeralToken(
  sessionConfig: Partial<RealtimeTranscriptionSessionConfig>,
  apiKey: string = process.env.OPENAI_API_KEY ?? ''
): Promise<RealtimeTranscriptionSession & { client_secret: ClientSecret }> {
  const r = await fetch("https://api.openai.com/v1/realtime/transcription_sessions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sessionConfig),
  });
  return await r.json();
}
