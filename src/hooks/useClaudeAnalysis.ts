// ─────────────────────────────────────────────────────────────────────────────
// useClaudeAnalysis.ts  –  Core AI hook with config-aware model, key, streaming
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useCallback } from "react";
import { loadAIConfig } from "@/lib/aiConfig";

interface UseClaudeAnalysisOptions {
  systemPrompt: string;
  agentId?: string;
}

export function useClaudeAnalysis({ systemPrompt, agentId }: UseClaudeAnalysisOptions) {
  const [result, setResult]   = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [rawText, setRawText] = useState<string>("");
  const [streaming, setStreaming] = useState(false);
  const [tokensUsed, setTokensUsed] = useState<number>(0);

  const analyze = useCallback(async (userPrompt: string) => {
    const cfg = loadAIConfig();

    // Resolve per-agent override or fall back to global config
    const override = agentId ? cfg.agentOverrides[agentId] : undefined;
    const model = override?.model ?? cfg.anthropicModel;
    const maxTokens = cfg.maxTokens;
    const apiKey = cfg.anthropicKey;

    if (!apiKey) {
      setError("No Anthropic API key configured. Please go to Settings → AI Configuration to add your key.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setRawText("");
    setTokensUsed(0);

    const useStream = cfg.streamingEnabled;

    try {
      const body = {
        model,
        max_tokens: maxTokens,
        stream: useStream,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      };

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const msg = (errData as any)?.error?.message || `API error ${response.status}`;
        throw new Error(msg);
      }

      if (useStream) {
        setStreaming(true);
        let fullText = "";
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n").filter(Boolean);

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6).trim();
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.type === "content_block_delta" && parsed.delta?.text) {
                fullText += parsed.delta.text;
                setRawText(fullText);
              }
              if (parsed.type === "message_delta" && parsed.usage?.output_tokens) {
                setTokensUsed(parsed.usage.output_tokens);
              }
            } catch { /* skip malformed SSE lines */ }
          }
        }

        setStreaming(false);
        parseAndSetResult(fullText, setResult);
      } else {
        const data = await response.json();
        const text = data.content?.map((b: any) => b.text || "").join("") || "";
        setRawText(text);
        setTokensUsed(data.usage?.output_tokens ?? 0);
        parseAndSetResult(text, setResult);
      }
    } catch (err: any) {
      setError(err.message || "Analysis failed. Please check your API key in Settings.");
    } finally {
      setLoading(false);
      setStreaming(false);
    }
  }, [systemPrompt, agentId]);

  return { result, loading, error, rawText, streaming, tokensUsed, analyze };
}

// ── helpers ───────────────────────────────────────────────────────────────────
function parseAndSetResult(text: string, setter: (v: any) => void) {
  const jsonMatch =
    text.match(/```json\s*([\s\S]*?)\s*```/) ||
    text.match(/(\{[\s\S]*\})/);
  if (jsonMatch) {
    try { setter(JSON.parse(jsonMatch[1])); return; } catch { /* fall through */ }
  }
  setter({ raw: text });
}
