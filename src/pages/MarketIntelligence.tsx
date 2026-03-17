import { useState } from "react";
import { Globe2, TrendingUp, BarChart2, Search, RefreshCw, DollarSign, Users, Activity, Target, ArrowUpRight, ArrowDownRight, Zap } from "lucide-react";
import { useClaudeAnalysis } from "@/hooks/useClaudeAnalysis";

const SYSTEM_PROMPT = `You are a senior market intelligence analyst specializing in MENA markets, Iraq, and emerging economies. Analyze the given topic and respond ONLY with valid JSON:
{
  "overview": { "summary": "string", "marketSize": "string", "growthRate": "string", "maturity": "Emerging|Growing|Mature|Declining" },
  "keyTrends": [{ "trend": "string", "impact": "High|Medium|Low", "timeframe": "string" }],
  "demandDrivers": ["string"],
  "topPlayers": [{ "name": "string", "share": "string", "strength": "string" }],
  "priceBenchmarks": { "low": "string", "mid": "string", "premium": "string", "currency": "USD" },
  "geography": [{ "city": "string", "demand": "High|Medium|Low", "note": "string" }],
  "opportunities": [{ "title": "string", "potential": "string", "timeToCapture": "string" }],
  "risks": [{ "risk": "string", "severity": "High|Medium|Low" }]
}`;

const QUICK_TOPICS = [
  "FMCG retail market in Baghdad 2026",
  "Real estate demand in Erbil Kurdistan",
  "F&B restaurant sector Iraq",
  "Telecom market Iraq competitive landscape",
  "Manufacturing opportunities in Basra industrial zone",
  "E-commerce growth in Iraq 2026",
];

export default function MarketIntelligence() {
  const [query, setQuery] = useState("");
  const { result, loading, error, analyze } = useClaudeAnalysis({ systemPrompt: SYSTEM_PROMPT, agentId: "market-intel" });

  const run = (q?: string) => { const topic = q || query; if (topic.trim()) { setQuery(topic); analyze(topic); } };

  const r = result;

  const maturityColor: Record<string, string> = {
    Emerging: "hsl(38 95% 60%)", Growing: "hsl(158 64% 55%)",
    Mature: "hsl(217 91% 70%)", Declining: "hsl(0 72% 68%)"
  };
  const impactColor = (v: string) => v==="High"?"hsl(0 72% 68%)":v==="Medium"?"hsl(38 95% 60%)":"hsl(158 64% 55%)";
  const demandColor = (v: string) => v==="High"?"hsl(38 95% 60%)":v==="Medium"?"hsl(217 91% 70%)":"hsl(215 25% 50%)";

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-display" style={{ color:"hsl(210 40% 94%)" }}>Market Intelligence</h1>
        <p className="text-sm mt-1" style={{ color:"hsl(215 25% 55%)" }}>Market sizing, demand forecasting, competitor tracking & trend analysis</p>
      </div>

      {/* Input */}
      <div className="rounded-xl p-5" style={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))" }}>
        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color:"hsl(215 25% 45%)" }}>Market Query</p>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color:"hsl(215 25% 45%)" }} />
            <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key==="Enter" && run()}
              placeholder="e.g. FMCG market in Baghdad, Real estate demand in Erbil..."
              className="w-full pl-10 pr-3 py-3 rounded-lg text-sm"
              style={{ background:"hsl(216 45% 12%)", border:"1px solid hsl(var(--border))", color:"hsl(210 40% 85%)" }} />
          </div>
          <button onClick={() => run()} disabled={loading || !query.trim()}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold disabled:opacity-50"
            style={{ background:"hsl(38 95% 52%)", color:"hsl(216 58% 6%)" }}>
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Globe2 className="h-4 w-4" />}
            {loading ? "Analyzing..." : "Analyze Market"}
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {QUICK_TOPICS.map((t, i) => (
            <button key={i} onClick={() => run(t)}
              className="text-xs px-3 py-1.5 rounded-full transition-all hover:opacity-80"
              style={{ background:"hsl(216 45% 14%)", color:"hsl(215 25% 60%)", border:"1px solid hsl(var(--border))" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-xl p-4" style={{ background:"hsl(0 72% 51% / 0.1)", border:"1px solid hsl(0 72% 51% / 0.3)" }}>
          <p className="text-sm" style={{ color:"hsl(0 72% 68%)" }}>{error}</p>
        </div>
      )}

      {loading && (
        <div className="rounded-xl p-8 text-center" style={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))" }}>
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-3" style={{ color:"hsl(38 95% 52%)" }} />
          <p className="text-sm font-medium" style={{ color:"hsl(210 40% 75%)" }}>Running market intelligence analysis...</p>
          <p className="text-xs mt-1" style={{ color:"hsl(215 25% 45%)" }}>Sizing market, identifying trends, mapping competitors</p>
        </div>
      )}

      {r && !loading && (
        <div className="space-y-4">
          {/* Overview */}
          {r.overview && (
            <div className="rounded-xl p-5" style={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))" }}>
              <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                <h2 className="text-sm font-semibold" style={{ color:"hsl(210 40% 92%)" }}>Market Overview</h2>
                {r.overview.maturity && (
                  <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                    style={{ background:`${maturityColor[r.overview.maturity]}22`, color:maturityColor[r.overview.maturity] }}>
                    {r.overview.maturity}
                  </span>
                )}
              </div>
              <p className="text-sm mb-4" style={{ color:"hsl(210 40% 75%)" }}>{r.overview.summary}</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg p-3" style={{ background:"hsl(216 45% 12%)" }}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color:"hsl(215 25% 45%)" }}>Market Size</p>
                  <p className="text-lg font-bold" style={{ color:"hsl(38 95% 60%)" }}>{r.overview.marketSize}</p>
                </div>
                <div className="rounded-lg p-3" style={{ background:"hsl(216 45% 12%)" }}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color:"hsl(215 25% 45%)" }}>Growth Rate</p>
                  <p className="text-lg font-bold" style={{ color:"hsl(158 64% 55%)" }}>{r.overview.growthRate}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Key Trends */}
            {r.keyTrends?.length > 0 && (
              <div className="rounded-xl p-5" style={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))" }}>
                <h2 className="text-sm font-semibold mb-3" style={{ color:"hsl(210 40% 92%)" }}>Key Trends</h2>
                <div className="space-y-2.5">
                  {r.keyTrends.map((t: any, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background:"hsl(216 45% 12%)" }}>
                      <div className="h-2 w-2 rounded-full mt-1.5 shrink-0" style={{ background:impactColor(t.impact) }} />
                      <div className="flex-1">
                        <p className="text-xs font-medium" style={{ color:"hsl(210 40% 85%)" }}>{t.trend}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px]" style={{ color:impactColor(t.impact) }}>{t.impact} Impact</span>
                          <span className="text-[10px]" style={{ color:"hsl(215 25% 45%)" }}>{t.timeframe}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Players */}
            {r.topPlayers?.length > 0 && (
              <div className="rounded-xl p-5" style={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))" }}>
                <h2 className="text-sm font-semibold mb-3" style={{ color:"hsl(210 40% 92%)" }}>Market Players</h2>
                <div className="space-y-2.5">
                  {r.topPlayers.map((p: any, i: number) => (
                    <div key={i} className="p-3 rounded-lg" style={{ background:"hsl(216 45% 12%)" }}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold" style={{ color:"hsl(210 40% 88%)" }}>{p.name}</span>
                        <span className="text-xs font-bold" style={{ color:"hsl(38 95% 60%)" }}>{p.share}</span>
                      </div>
                      <p className="text-[11px]" style={{ color:"hsl(215 25% 50%)" }}>{p.strength}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Geography */}
            {r.geography?.length > 0 && (
              <div className="rounded-xl p-5" style={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))" }}>
                <h2 className="text-sm font-semibold mb-3" style={{ color:"hsl(210 40% 92%)" }}>Geographic Demand</h2>
                <div className="space-y-2">
                  {r.geography.map((g: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-lg" style={{ background:"hsl(216 45% 12%)" }}>
                      <div>
                        <span className="text-xs font-medium" style={{ color:"hsl(210 40% 85%)" }}>{g.city}</span>
                        {g.note && <p className="text-[10px] mt-0.5" style={{ color:"hsl(215 25% 50%)" }}>{g.note}</p>}
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                        style={{ background:`${demandColor(g.demand)}22`, color:demandColor(g.demand) }}>
                        {g.demand}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Opportunities */}
            {r.opportunities?.length > 0 && (
              <div className="rounded-xl p-5" style={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))" }}>
                <h2 className="text-sm font-semibold mb-3" style={{ color:"hsl(210 40% 92%)" }}>Opportunities</h2>
                <div className="space-y-2.5">
                  {r.opportunities.map((o: any, i: number) => (
                    <div key={i} className="p-3 rounded-lg" style={{ background:"hsl(158 64% 40% / 0.08)", border:"1px solid hsl(158 64% 40% / 0.2)" }}>
                      <p className="text-xs font-semibold mb-1" style={{ color:"hsl(158 64% 55%)" }}>{o.title}</p>
                      <div className="flex items-center gap-3 text-[11px]">
                        <span style={{ color:"hsl(215 25% 55%)" }}>Potential: {o.potential}</span>
                        <span style={{ color:"hsl(215 25% 45%)" }}>⏱ {o.timeToCapture}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Price Benchmarks */}
          {r.priceBenchmarks && (
            <div className="rounded-xl p-5" style={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))" }}>
              <h2 className="text-sm font-semibold mb-3" style={{ color:"hsl(210 40% 92%)" }}>Price Benchmarks</h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label:"Entry / Low", value:r.priceBenchmarks.low, color:"hsl(217 91% 70%)" },
                  { label:"Mid Market",  value:r.priceBenchmarks.mid, color:"hsl(38 95% 60%)"  },
                  { label:"Premium",     value:r.priceBenchmarks.premium, color:"hsl(158 64% 55%)" },
                ].map((p,i) => (
                  <div key={i} className="rounded-lg p-3 text-center" style={{ background:"hsl(216 45% 12%)" }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color:"hsl(215 25% 45%)" }}>{p.label}</p>
                    <p className="text-base font-bold" style={{ color:p.color }}>{p.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!result && !loading && !error && (
        <div className="rounded-xl p-10 text-center" style={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))" }}>
          <Globe2 className="h-12 w-12 mx-auto mb-4 opacity-20" style={{ color:"hsl(38 95% 52%)" }} />
          <p className="font-medium" style={{ color:"hsl(215 25% 50%)" }}>Enter a market topic to start intelligence analysis</p>
          <p className="text-sm mt-1" style={{ color:"hsl(215 25% 38%)" }}>Try a quick topic above or type your own query</p>
        </div>
      )}
    </div>
  );
}
