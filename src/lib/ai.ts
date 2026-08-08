/**
 * Cliente mínimo OpenAI-compatible para el gateway LLM (DeepSeek).
 * Sin AI_BASE_URL/AI_API_KEY configurados queda deshabilitado y los
 * consumidores deben usar su camino determinístico.
 */

const DEFAULT_MODEL = "deepseek-r1:8b";

function timeoutMs(): number {
  const n = Number(process.env.AI_TIMEOUT_MS);
  return Number.isFinite(n) && n > 0 ? n : 60_000;
}

export function aiEnabled(): boolean {
  return Boolean(process.env.AI_BASE_URL && process.env.AI_API_KEY);
}

export async function chatCompletion(params: {
  system: string;
  user: string;
  jsonMode?: boolean;
}): Promise<string> {
  const baseUrl = process.env.AI_BASE_URL;
  const apiKey = process.env.AI_API_KEY;
  if (!baseUrl || !apiKey) {
    throw new Error("Gateway LLM no configurado (AI_BASE_URL/AI_API_KEY)");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs());
  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL || DEFAULT_MODEL,
        // DeepSeek no acepta el rol "developer": solo system/user.
        messages: [
          { role: "system", content: params.system },
          { role: "user", content: params.user },
        ],
        temperature: 0.4,
        ...(params.jsonMode ? { response_format: { type: "json_object" } } : {}),
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`Gateway LLM respondió ${res.status}`);
    }
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("Respuesta del gateway LLM sin contenido");
    return content;
  } finally {
    clearTimeout(timer);
  }
}
