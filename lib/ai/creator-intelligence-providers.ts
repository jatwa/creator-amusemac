export type CreatorIntelligenceProviderResult = {
  text: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  provider: "openai" | "gemini";
  model: string;
};

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured.`);
  return value;
}

export async function runOpenAITextIntelligence(args: {
  system: string;
  prompt: string;
  model?: string;
}): Promise<CreatorIntelligenceProviderResult> {
  const apiKey = requireEnv("OPENAI_API_KEY");
  const model = args.model || process.env.OPENAI_CREATOR_MODEL || "gpt-5.6-luna";

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      instructions: args.system,
      input: args.prompt,
      max_output_tokens: 16000,
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.error?.message || `OpenAI request failed (${response.status}).`);
  }

  const usage = data?.usage || {};
  const inputTokens = Number(usage.input_tokens || 0);
  const outputTokens = Number(usage.output_tokens || 0);

  return {
    text: String(data?.output_text || ""),
    inputTokens,
    outputTokens,
    totalTokens: Number(usage.total_tokens || inputTokens + outputTokens),
    provider: "openai",
    model,
  };
}

export async function runGeminiDocumentIntelligence(args: {
  bytes: Buffer;
  mimeType: string;
  prompt: string;
  model?: string;
}): Promise<CreatorIntelligenceProviderResult> {
  const apiKey = requireEnv("GEMINI_API_KEY");
  const model = args.model || process.env.GEMINI_CREATOR_MODEL || "gemini-3.8-flash";

  if (args.bytes.length > 50 * 1024 * 1024 && args.mimeType === "application/pdf") {
    throw new Error("PDFs above 50 MB require the Gemini Files API path; reduce the file or use a processed source.");
  }

  const data = args.bytes.toString("base64");
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: args.prompt },
            { inline_data: { mime_type: args.mimeType, data } },
          ],
        }],
      }),
    }
  );

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result?.error?.message || `Gemini request failed (${response.status}).`);
  }

  const text = result?.candidates?.[0]?.content?.parts
    ?.map((part: { text?: string }) => part.text || "")
    .join("") || "";
  const usage = result?.usageMetadata || {};
  const inputTokens = Number(usage.promptTokenCount || 0);
  const outputTokens = Number(usage.candidatesTokenCount || 0);

  return {
    text,
    inputTokens,
    outputTokens,
    totalTokens: Number(usage.totalTokenCount || inputTokens + outputTokens),
    provider: "gemini",
    model,
  };
}
