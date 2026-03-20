// ─────────────────────────────────────────────────────────────────────────────
// useClaudeAnalysis.ts  –  AI hook using Lovable AI Gateway (no external keys needed)
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

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
    setLoading(true);
    setError(null);
    setResult(null);
    setRawText("");
    setTokensUsed(0);

    try {
      // Use streaming via fetch for SSE support
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          system: systemPrompt,
          messages: [{ role: "user", content: userPrompt }],
          stream: true,
          maxTokens: 4000,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const msg = (errData as any)?.error || `Service error ${response.status}`;
        throw new Error(msg);
      }

      // Stream response
      setStreaming(true);
      let fullText = "";
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullText += content;
              setRawText(fullText);
            }
            if (parsed.usage?.total_tokens) {
              setTokensUsed(parsed.usage.total_tokens);
            }
          } catch {
            // partial JSON, put back
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      setStreaming(false);
      setTokensUsed(prev => prev || fullText.split(/\s+/).length); // rough estimate if not provided
      parseAndSetResult(fullText, setResult);
    } catch (err: any) {
      setError(err.message || "Analysis failed. Please try again.");
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
