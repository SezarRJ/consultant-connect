import { useState } from "react";

interface UseClaudeAnalysisOptions {
  systemPrompt: string;
}

export function useClaudeAnalysis({ systemPrompt }: UseClaudeAnalysisOptions) {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawText, setRawText] = useState<string>("");

  const analyze = async (userPrompt: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setRawText("");

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          system: systemPrompt,
          messages: [{ role: "user", content: userPrompt }],
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.content?.map((b: any) => b.text || "").join("") || "";
      setRawText(text);

      // Try to parse JSON from response
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/(\{[\s\S]*\})/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[1]);
          setResult(parsed);
        } catch {
          setResult({ raw: text });
        }
      } else {
        setResult({ raw: text });
      }
    } catch (err: any) {
      setError(err.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, error, rawText, analyze };
}
