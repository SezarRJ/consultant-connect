// Live web search results panel used inside service pages
import { useState } from "react";
import { Globe, Search, ExternalLink, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { useWebSearch } from "@/hooks/useWebSearch";
import { loadAIConfig } from "@/lib/aiConfig";

interface Props { defaultQuery?: string; label?: string; }

export function WebSearchPanel({ defaultQuery = "", label = "Live Market Research" }: Props) {
  const cfg = loadAIConfig();
  const { data, loading, error, search } = useWebSearch();
  const [query, setQuery] = useState(defaultQuery);
  const [expanded, setExpanded] = useState(false);

  if (!cfg.webSearchEnabled) return null;

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid hsl(217 91% 53% / 0.3)", background: "hsl(217 91% 53% / 0.04)" }}>
      <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: data ? "1px solid hsl(217 91% 53% / 0.2)" : "none" }}>
        <Globe className="h-4 w-4 shrink-0" style={{ color: "hsl(217 91% 70%)" }} />
        <span className="text-xs font-semibold" style={{ color: "hsl(217 91% 70%)" }}>{label}</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "hsl(217 91% 53% / 0.15)", color: "hsl(217 91% 70%)" }}>
          via {cfg.webSearchProvider}
        </span>
        <div className="flex-1 flex items-center gap-2">
          <input value={query} onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && query && search(query)}
            placeholder="Search live market data..."
            className="flex-1 px-3 py-1.5 rounded-lg text-xs"
            style={{ background: "hsl(216 45% 14%)", border: "1px solid hsl(217 91% 53% / 0.3)", color: "hsl(210 40% 85%)" }} />
          <button onClick={() => query && search(query)} disabled={loading || !query}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
            style={{ background: "hsl(217 91% 53%)", color: "white" }}>
            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Search className="h-3 w-3" />}
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {error && <div className="px-4 py-3 text-xs" style={{ color: "hsl(0 72% 68%)" }}>⚠ {error}</div>}

      {data && (
        <div className="px-4 py-3 space-y-3">
          {data.answer && (
            <div className="text-sm leading-relaxed" style={{ color: "hsl(215 25% 72%)" }}>
              {data.answer}
            </div>
          )}
          {data.results.length > 0 && (
            <>
              <button onClick={() => setExpanded(p => !p)}
                className="flex items-center gap-1.5 text-[11px]" style={{ color: "hsl(217 91% 65%)" }}>
                {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                {expanded ? "Hide" : "Show"} {data.results.length} sources
              </button>
              {expanded && (
                <div className="space-y-2">
                  {data.results.map((r, i) => (
                    <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted/20 transition-colors block">
                      <ExternalLink className="h-3 w-3 mt-0.5 shrink-0" style={{ color: "hsl(217 91% 65%)" }} />
                      <div>
                        <p className="text-xs font-medium" style={{ color: "hsl(217 91% 75%)" }}>{r.title}</p>
                        <p className="text-[11px] mt-0.5 line-clamp-2" style={{ color: "hsl(215 25% 55%)" }}>{r.snippet}</p>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </>
          )}
          <p className="text-[10px]" style={{ color: "hsl(215 25% 40%)" }}>
            Source: {data.provider} · {new Date(data.timestamp).toLocaleTimeString()}
          </p>
        </div>
      )}
    </div>
  );
}
