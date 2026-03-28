// ─────────────────────────────────────────────────────────────────────────────
// useClaudeAnalysis.ts  –  AI hook using Lovable AI Gateway with model tiers
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useCallback } from "react";

/** Model tiers mapped on the backend:
 *  "flash-lite"  → gemini-2.5-flash-lite  (standard advisory agents)
 *  "flash"       → gemini-2.5-flash       (complex analyses)
 *  "pro"         → gemini-2.5-pro         (premium / heavy reasoning)
 */
export type ModelTier = "flash-lite" | "flash" | "pro";

interface UseClaudeAnalysisOptions {
  systemPrompt: string;
  agentId?: string;
  /** Which model tier to use. Default: "flash-lite" */
  modelTier?: ModelTier;
  /** For complex analyses – adds a thinking budget via reasoning.effort */
  reasoningEffort?: "low" | "medium" | "high";
  /** JSON schema for tool-calling based structured output */
  outputSchema?: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}

export function useClaudeAnalysis({
  systemPrompt,
  agentId,
  modelTier = "flash-lite",
  reasoningEffort,
  outputSchema,
}: UseClaudeAnalysisOptions) {
  const [result, setResult]   = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [rawText, setRawText] = useState<string>("");
  const [streaming, setStreaming] = useState(false);
  const [tokensUsed, setTokensUsed] = useState<number>(0);
  const [responseTime, setResponseTime] = useState<number>(0);
  const [jsonValid, setJsonValid] = useState<boolean | null>(null);
  const [modelUsed, setModelUsed] = useState<string>("");

  const analyze = useCallback(async (userPrompt: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setRawText("");
    setTokensUsed(0);
    setResponseTime(0);
    setJsonValid(null);
    setModelUsed("");

    const startTime = performance.now();

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;
      const languageInstruction = getPreferredLanguageInstruction();

      // Build request body
      const body: Record<string, unknown> = {
        system: `${systemPrompt}

${languageInstruction}`.trim(),
        messages: [{ role: "user", content: `${userPrompt}

${languageInstruction}`.trim() }],
        maxTokens: 4000,
        modelTier,
        stream: !outputSchema, // don't stream when using tool calling
      };

      // Add reasoning for complex analyses
      if (reasoningEffort) {
        body.reasoning = { effort: reasoningEffort };
      }

      // Add tool calling for structured JSON output
      if (outputSchema) {
        body.tools = [{
          type: "function",
          function: {
            name: outputSchema.name,
            description: outputSchema.description,
            parameters: outputSchema.parameters,
          },
        }];
        body.tool_choice = { type: "function", function: { name: outputSchema.name } };
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const msg = (errData as any)?.error || `Service error ${response.status}`;
        throw new Error(msg);
      }

      // Non-streaming path (tool calling)
      if (outputSchema) {
        const data = await response.json();
        const elapsed = Math.round(performance.now() - startTime);
        setResponseTime(elapsed);
        setModelUsed(data._meta?.model || modelTier);

        // Extract tool call result
        const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
        if (toolCall?.function?.arguments) {
          try {
            const parsed = JSON.parse(toolCall.function.arguments);
            setResult(parsed);
            setJsonValid(true);
            setRawText(toolCall.function.arguments);
          } catch {
            setJsonValid(false);
            setRawText(toolCall.function.arguments);
            setResult({ raw: toolCall.function.arguments });
          }
        } else {
          // Fallback to content
          const content = data.choices?.[0]?.message?.content || "";
          setRawText(content);
          parseAndSetResult(content, setResult, setJsonValid);
        }

        if (data.usage?.total_tokens) setTokensUsed(data.usage.total_tokens);
        return;
      }

      // Streaming path
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
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      const elapsed = Math.round(performance.now() - startTime);
      setResponseTime(elapsed);
      setStreaming(false);
      setTokensUsed(prev => prev || fullText.split(/\s+/).length);
      setModelUsed(modelTier);
      parseAndSetResult(fullText, setResult, setJsonValid);
    } catch (err: any) {
      setError(err.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
      setStreaming(false);
    }
  }, [systemPrompt, agentId, modelTier, reasoningEffort, outputSchema]);

  return {
    result, loading, error, rawText, streaming,
    tokensUsed, responseTime, jsonValid, modelUsed,
    analyze,
  };
}

// ── helpers ───────────────────────────────────────────────────────────────────
function parseAndSetResult(
  text: string,
  setter: (v: any) => void,
  setValid: (v: boolean) => void,
) {
  const jsonMatch =
    text.match(/```json\s*([\s\S]*?)\s*```/) ||
    text.match(/(\{[\s\S]*\})/);
  if (jsonMatch) {
    try {
      setter(JSON.parse(jsonMatch[1]));
      setValid(true);
      return;
    } catch { /* fall through */ }
  }
  setValid(false);
  setter({ raw: text });
}


function getPreferredLanguageInstruction(): string {
  if (typeof window === "undefined") return "Respond in professional English unless the request explicitly asks for another language.";
  const lang = window.localStorage.getItem("lang") || document.documentElement.getAttribute("lang") || "en";
  if (lang === "ar") {
    return "Respond fully in Arabic. Write all headings, bullet points, tables, recommendations, and analytical explanations in Arabic. Keep brand names, model names, and unavoidable technical terms in their original language only when needed for clarity.";
  }
  return "Respond in professional English unless the request explicitly asks for another language.";
}
