// ─────────────────────────────────────────────────────────────────────────────
// useWebSearch.ts  –  Live web search via Perplexity / Tavily / SerpAPI
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useCallback } from "react";
import { loadAIConfig } from "@/lib/aiConfig";

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  publishedDate?: string;
}

export interface SearchResponse {
  query: string;
  answer?: string;
  results: SearchResult[];
  provider: string;
  timestamp: string;
}

export function useWebSearch() {
  const [data, setData]     = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);

  const search = useCallback(async (query: string): Promise<SearchResponse | null> => {
    const cfg = loadAIConfig();
    if (!cfg.webSearchEnabled) {
      setError("Web search is disabled. Enable it in Settings → AI Configuration.");
      return null;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      let result: SearchResponse;

      if (cfg.webSearchProvider === "perplexity" && cfg.perplexityKey) {
        result = await searchPerplexity(query, cfg.perplexityKey, cfg.perplexityModel);
      } else if (cfg.webSearchProvider === "tavily" && cfg.tavilyKey) {
        result = await searchTavily(query, cfg.tavilyKey);
      } else {
        throw new Error(`Web search provider "${cfg.webSearchProvider}" is not configured. Add an API key in Settings.`);
      }

      setData(result);
      return result;
    } catch (err: any) {
      setError(err.message || "Web search failed.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, search };
}

// ── Perplexity ────────────────────────────────────────────────────────────────
async function searchPerplexity(query: string, apiKey: string, model: string): Promise<SearchResponse> {
  const res = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: "You are a market research assistant. Provide a concise answer with key facts and cite sources." },
        { role: "user", content: query },
      ],
      return_citations: true,
      return_related_questions: false,
    }),
  });
  if (!res.ok) throw new Error(`Perplexity error: ${res.status}`);
  const data = await res.json();
  const answer = data.choices?.[0]?.message?.content || "";
  const citations: any[] = data.citations || [];
  return {
    query, answer,
    results: citations.map((c: any, i: number) => ({
      title: c.title || `Source ${i + 1}`,
      url: c.url || "",
      snippet: c.snippet || "",
      publishedDate: c.date,
    })),
    provider: "Perplexity AI",
    timestamp: new Date().toISOString(),
  };
}

// ── Tavily ────────────────────────────────────────────────────────────────────
async function searchTavily(query: string, apiKey: string): Promise<SearchResponse> {
  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: apiKey, query, search_depth: "advanced", max_results: 8, include_answer: true }),
  });
  if (!res.ok) throw new Error(`Tavily error: ${res.status}`);
  const data = await res.json();
  return {
    query,
    answer: data.answer || "",
    results: (data.results || []).map((r: any) => ({
      title: r.title, url: r.url, snippet: r.content, publishedDate: r.published_date,
    })),
    provider: "Tavily Search",
    timestamp: new Date().toISOString(),
  };
}
