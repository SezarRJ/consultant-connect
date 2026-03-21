import { useState } from "react";
import {
  Globe, TrendingUp, BarChart2, Search, RefreshCw, DollarSign, Users,
  Activity, Target, ArrowUpRight, ArrowDownRight, Zap, AlertTriangle,
  MapPin, Building2, ShoppingBag, Star, CheckCircle2, Clock
} from "lucide-react";
import { useClaudeAnalysis } from "@/hooks/useClaudeAnalysis";
import { AIStatusBar } from "@/components/ai/AIStatusBar";

const Badge = ({ v, c = "hsl(38 95% 60%)" }: { v: string; c?: string }) => (
  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold whitespace-nowrap"
    style={{ background: `${c}20`, color: c, border: `1px solid ${c}30` }}>{v}</span>
);
const Section = ({ title, icon: I, children, accent = "hsl(38 95% 52%)" }: any) => (
  <div className="rounded-2xl overflow-hidden" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
    <div className="px-5 py-3.5 flex items-center gap-2" style={{ background: "hsl(216 45% 11%)", borderBottom: "1px solid hsl(var(--border))" }}>
      <I className="h-4 w-4" style={{ color: accent }}/><h3 className="text-sm font-bold" style={{ color: "hsl(210 40% 92%)" }}>{title}</h3>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const SYSTEM_PROMPT = `You are a senior market intelligence analyst specializing in Iraq, MENA and emerging economies. Generate a comprehensive market intelligence brief. Respond ONLY with valid JSON:
{
  "topic": "string",
  "asOf": "string — e.g. Q1 2026",
  "overview": {
    "summary": "string — 4-5 sentences",
    "marketSize": "string — USD estimate",
    "growthRate": "string — CAGR %",
    "maturity": "Emerging|Growing|Maturing|Saturated|Declining",
    "sentiment": "Very Bullish|Bullish|Neutral|Bearish|Very Bearish",
    "confidenceScore": "number 0-100"
  },
  "keyMetrics": [
    { "label": "string", "value": "string", "change": "string — e.g. +12% YoY", "direction": "up|down|flat" }
  ],
  "keyTrends": [
    { "trend": "string", "impact": "High|Medium|Low", "timeframe": "string — near/mid/long-term", "detail": "string — 1-2 sentences" }
  ],
  "demandDrivers": [
    { "driver": "string", "strength": "Strong|Moderate|Weak", "detail": "string" }
  ],
  "supplyFactors": [
    { "factor": "string", "impact": "Positive|Negative|Neutral", "detail": "string" }
  ],
  "topPlayers": [
    {
      "name": "string",
      "type": "Local|Regional|Multinational",
      "share": "string — % estimate",
      "strength": "string — one phrase",
      "recentMoves": "string"
    }
  ],
  "priceBenchmarks": {
    "lowEnd": "string — USD",
    "midRange": "string — USD",
    "premium": "string — USD",
    "currency": "USD",
    "iqd": "string — IQD equivalent for mid-range",
    "priceDirection": "Rising|Stable|Falling",
    "notes": "string"
  },
  "geography": [
    {
      "city": "string",
      "region": "Federal Iraq|KRG|Southern Iraq",
      "demand": "Very High|High|Medium|Low",
      "competition": "Intense|Moderate|Light",
      "growth": "string — % or direction",
      "note": "string — what's unique about this market"
    }
  ],
  "opportunities": [
    {
      "title": "string",
      "potential": "string — revenue or market size",
      "timeToCapture": "string",
      "difficulty": "Easy|Medium|Hard",
      "detail": "string"
    }
  ],
  "risks": [
    {
      "risk": "string",
      "severity": "High|Medium|Low",
      "probability": "High|Medium|Low",
      "mitigation": "string"
    }
  ],
  "regulatoryEnvironment": {
    "overallRating": "Favorable|Neutral|Challenging|Very Challenging",
    "recentChanges": ["any recent regulatory changes affecting this market"],
    "comingChanges": ["anticipated changes"],
    "keyRegulators": ["government bodies to watch"],
    "notes": "string"
  },
  "investmentIntelligence": {
    "attractivenessScore": "number 0-100",
    "recommendedAction": "Enter Now|Enter With Caution|Wait 6 Months|Wait 12+ Months|Avoid",
    "rationale": "string",
    "quickWins": ["3-4 things that could generate revenue quickly"],
    "avoidPitfalls": ["3-4 common mistakes in this market"]
  },
  "dataPoints": [
    { "stat": "string — interesting/useful data point", "source": "string — e.g. MoT Iraq 2025, industry estimate" }
  ]
}`;

const QUICK_TOPICS = [
  "FMCG retail market Baghdad 2026",
  "Real estate residential Erbil KRG",
  "F&B restaurant sector Iraq",
  "Telecom 5G Iraq competitive landscape",
  "Manufacturing opportunities Basra industrial",
  "E-commerce growth Iraq 2026",
  "Healthcare pharmaceuticals Iraq market",
  "Construction materials demand Iraq",
  "Agricultural exports Iraq imports",
  "Cosmetics beauty personal care Iraq",
];

export default function MarketIntelligence() {
  const [query, setQuery] = useState("");
  const { result, loading, error, analyze, tokensUsed, responseTime, jsonValid, modelUsed } = useClaudeAnalysis({ systemPrompt: SYSTEM_PROMPT, agentId: "market-intel-v2", modelTier: "flash-lite" });

  const run = (q?: string) => { const topic = q || query; if (topic.trim()) { setQuery(topic); analyze(`Generate a comprehensive Iraq market intelligence brief for the following topic:\n\n${topic}\n\nBe highly specific to Iraq 2025-2026. Include real market sizes in USD, price benchmarks in both USD and IQD, actual player names, city-by-city demand analysis, and actionable investment intelligence.`); } };

  const d = result;
  const impactColor = (v: string) => v === "High" ? "hsl(0 72% 68%)" : v === "Medium" ? "hsl(38 95% 60%)" : "hsl(158 64% 55%)";
  const demandColor = (v: string) => v?.includes("High") ? "hsl(38 95% 60%)" : v === "Medium" ? "hsl(217 91% 70%)" : "hsl(215 25% 50%)";
  const maturityColor: Record<string, string> = { Emerging: "hsl(38 95% 60%)", Growing: "hsl(158 64% 55%)", Maturing: "hsl(217 91% 70%)", Saturated: "hsl(0 72% 68%)", Declining: "hsl(0 72% 68%)" };
  const sentimentColor = (s?: string) => s?.includes("Bullish") ? "hsl(158 64% 55%)" : s?.includes("Bearish") ? "hsl(0 72% 68%)" : "hsl(38 95% 60%)";
  const actionColor = (s?: string) => s === "Enter Now" ? "hsl(158 64% 55%)" : s?.includes("Caution") ? "hsl(38 95% 60%)" : s?.includes("Wait") ? "hsl(217 91% 70%)" : "hsl(0 72% 68%)";

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Globe className="h-6 w-6" style={{ color: "hsl(38 95% 52%)" }} />
        <div>
          <h1 className="text-xl font-bold font-display" style={{ color: "hsl(210 40% 92%)" }}>Market Intelligence</h1>
          <p className="text-sm" style={{ color: "hsl(215 25% 55%)" }}>Real-time Iraq market analysis · trends · players · opportunities · risks</p>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-2xl p-6 space-y-4" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "hsl(215 25% 45%)" }} />
            <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && run()}
              placeholder="e.g. FMCG retail Baghdad, construction materials Iraq, KRG real estate..."
              className="w-full pl-10 pr-3 py-3 rounded-xl text-sm"
              style={{ background: "hsl(216 45% 12%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }} />
          </div>
          <button onClick={() => run()} disabled={loading || !query.trim()}
            className="px-6 py-3 rounded-xl text-sm font-bold disabled:opacity-50 flex items-center gap-2 shrink-0"
            style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
            {loading ? <><RefreshCw className="h-4 w-4 animate-spin" />Analyzing...</> : <><Globe className="h-4 w-4" />Analyze Market</>}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {QUICK_TOPICS.map(t => (
            <button key={t} onClick={() => run(t)}
              className="text-[11px] px-3 py-1.5 rounded-full transition-colors hover:opacity-80"
              style={{ background: "hsl(216 45% 14%)", color: "hsl(215 25% 60%)", border: "1px solid hsl(var(--border))" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: "hsl(0 72% 51%/0.08)", border: "1px solid hsl(0 72% 51%/0.3)" }}>
        <AlertTriangle className="h-4 w-4 shrink-0" style={{ color: "hsl(0 72% 68%)" }}/><p className="text-sm" style={{ color: "hsl(0 72% 68%)" }}>{error}</p></div>}
      {loading && <div className="rounded-xl p-10 text-center" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <Globe className="h-10 w-10 mx-auto mb-4 animate-pulse" style={{ color: "hsl(38 95% 52%)" }}/>
        <p className="font-semibold" style={{ color: "hsl(210 40% 82%)" }}>Generating market intelligence brief...</p>
        <p className="text-xs mt-1 italic" style={{ color: "hsl(215 25% 50%)" }}>{query}</p>
      </div>}
      {!loading && !d && !error && <div className="rounded-xl p-14 text-center" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <Globe className="h-14 w-14 mx-auto mb-4 opacity-15" style={{ color: "hsl(38 95% 52%)" }}/>
        <p className="font-semibold" style={{ color: "hsl(215 25% 55%)" }}>Enter any market, sector, or topic to generate a full intelligence brief</p>
        <p className="text-xs mt-2" style={{ color: "hsl(215 25% 40%)" }}>Market size · trends · players · pricing · geography · opportunities · risks · investment signal</p>
      </div>}

      {d && !loading && (
        <div className="space-y-5">
          {/* Overview hero */}
          <div className="rounded-2xl p-6 flex flex-col md:flex-row items-start gap-6" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h2 className="text-base font-bold" style={{ color: "hsl(210 40% 92%)" }}>{d.topic}</h2>
                {d.overview?.maturity && <Badge v={d.overview.maturity} c={maturityColor[d.overview.maturity] ?? "hsl(38 95% 60%)"}/>}
                {d.overview?.sentiment && <Badge v={d.overview.sentiment} c={sentimentColor(d.overview.sentiment)}/>}
                {d.asOf && <span className="text-[10px]" style={{ color: "hsl(215 25% 45%)" }}>{d.asOf}</span>}
              </div>
              <p className="text-sm" style={{ color: "hsl(210 40% 80%)" }}>{d.overview?.summary}</p>
              {d.investmentIntelligence?.recommendedAction && (
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-xs font-bold uppercase" style={{ color: "hsl(215 25% 45%)" }}>Signal:</span>
                  <Badge v={d.investmentIntelligence.recommendedAction} c={actionColor(d.investmentIntelligence.recommendedAction)}/>
                  {d.investmentIntelligence.attractivenessScore && (
                    <span className="text-xs font-bold" style={{ color: "hsl(38 95% 60%)" }}>Attractiveness: {d.investmentIntelligence.attractivenessScore}/100</span>
                  )}
                </div>
              )}
            </div>
            {d.keyMetrics?.length > 0 && (
              <div className="grid grid-cols-2 gap-2 shrink-0">
                {d.keyMetrics.slice(0, 6).map((m: any, i: number) => {
                  const dc = m.direction === "up" ? "hsl(158 64% 55%)" : m.direction === "down" ? "hsl(0 72% 68%)" : "hsl(38 95% 60%)";
                  const DI = m.direction === "up" ? ArrowUpRight : m.direction === "down" ? ArrowDownRight : Activity;
                  return (
                    <div key={i} className="rounded-xl p-3" style={{ background: "hsl(216 45% 12%)", minWidth: "130px" }}>
                      <p className="text-[9px] uppercase font-bold mb-0.5" style={{ color: "hsl(215 25% 45%)" }}>{m.label}</p>
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-bold" style={{ color: dc }}>{m.value}</p>
                        {m.change && <span className="text-[9px]" style={{ color: dc }}>{m.change}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Key Trends + Demand Drivers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {d.keyTrends?.length > 0 && (
              <Section title="Key Market Trends" icon={TrendingUp}>
                <div className="space-y-3">
                  {d.keyTrends.map((t: any, i: number) => {
                    const ic = impactColor(t.impact);
                    return (
                      <div key={i} className="rounded-xl p-3" style={{ background: "hsl(216 45% 12%)" }}>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-xs font-semibold" style={{ color: "hsl(210 40% 88%)" }}>{t.trend}</span>
                          <Badge v={t.impact} c={ic}/>
                          {t.timeframe && <span className="text-[10px]" style={{ color: "hsl(215 25% 45%)" }}>{t.timeframe}</span>}
                        </div>
                        {t.detail && <p className="text-[11px]" style={{ color: "hsl(215 25% 55%)" }}>{t.detail}</p>}
                      </div>
                    );
                  })}
                </div>
              </Section>
            )}

            <div className="space-y-5">
              {d.demandDrivers?.length > 0 && (
                <Section title="Demand Drivers" icon={Zap}>
                  <div className="space-y-2">
                    {d.demandDrivers.map((dd: any, i: number) => {
                      const sc = dd.strength === "Strong" ? "hsl(158 64% 55%)" : dd.strength === "Moderate" ? "hsl(38 95% 60%)" : "hsl(217 91% 70%)";
                      return (
                        <div key={i} className="flex items-start gap-2.5">
                          <Badge v={dd.strength} c={sc}/>
                          <div>
                            <p className="text-xs font-semibold" style={{ color: "hsl(210 40% 85%)" }}>{dd.driver}</p>
                            {dd.detail && <p className="text-[11px]" style={{ color: "hsl(215 25% 55%)" }}>{dd.detail}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Section>
              )}

              {d.supplyFactors?.length > 0 && (
                <Section title="Supply Factors" icon={Building2} accent="hsl(217 91% 70%)">
                  <div className="space-y-2">
                    {d.supplyFactors.map((sf: any, i: number) => {
                      const ic = sf.impact === "Positive" ? "hsl(158 64% 55%)" : sf.impact === "Negative" ? "hsl(0 72% 68%)" : "hsl(217 91% 70%)";
                      return (
                        <div key={i} className="flex items-start gap-2.5">
                          <Badge v={sf.impact} c={ic}/>
                          <div>
                            <p className="text-xs font-semibold" style={{ color: "hsl(210 40% 85%)" }}>{sf.factor}</p>
                            {sf.detail && <p className="text-[11px]" style={{ color: "hsl(215 25% 55%)" }}>{sf.detail}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Section>
              )}
            </div>
          </div>

          {/* Price Benchmarks */}
          {d.priceBenchmarks && (
            <div className="rounded-xl p-5" style={{ background: "hsl(38 95% 52%/0.05)", border: "1px solid hsl(38 95% 52%/0.2)" }}>
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <p className="text-xs font-bold uppercase" style={{ color: "hsl(38 95% 60%)" }}>Price Benchmarks</p>
                {d.priceBenchmarks.priceDirection && <Badge v={`Prices: ${d.priceBenchmarks.priceDirection}`} c={d.priceBenchmarks.priceDirection === "Rising" ? "hsl(0 72% 68%)" : d.priceBenchmarks.priceDirection === "Falling" ? "hsl(158 64% 55%)" : "hsl(38 95% 60%)"}/>}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { l: "Low End",   v: d.priceBenchmarks.lowEnd,  c: "hsl(158 64% 55%)" },
                  { l: "Mid Range", v: d.priceBenchmarks.midRange, c: "hsl(38 95% 60%)" },
                  { l: "Premium",   v: d.priceBenchmarks.premium,  c: "hsl(217 91% 70%)" },
                  { l: "Mid (IQD)", v: d.priceBenchmarks.iqd,      c: "hsl(280 80% 70%)" },
                ].filter(m => m.v).map((m, i) => (
                  <div key={i} className="rounded-xl p-3 text-center" style={{ background: "hsl(38 95% 52%/0.08)" }}>
                    <p className="text-sm font-bold" style={{ color: m.c }}>{m.v}</p>
                    <p className="text-[9px]" style={{ color: "hsl(215 25% 45%)" }}>{m.l}</p>
                  </div>
                ))}
              </div>
              {d.priceBenchmarks.notes && <p className="text-xs mt-3" style={{ color: "hsl(215 25% 55%)" }}>{d.priceBenchmarks.notes}</p>}
            </div>
          )}

          {/* Top Players */}
          {d.topPlayers?.length > 0 && (
            <Section title="Market Players" icon={Users} accent="hsl(0 72% 68%)">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead><tr style={{ background: "hsl(216 45% 11%)" }}>
                    {["Player","Type","Est. Share","Strength","Recent Moves"].map(h => (
                      <th key={h} className="px-3 py-2.5 text-left font-semibold whitespace-nowrap" style={{ color: "hsl(215 25% 45%)" }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>{d.topPlayers.map((p: any, i: number) => {
                    const tc = p.type === "Local" ? "hsl(158 64% 55%)" : p.type === "Multinational" ? "hsl(0 72% 68%)" : "hsl(38 95% 60%)";
                    return (
                      <tr key={i} style={{ borderTop: "1px solid hsl(var(--border))", background: i % 2 === 0 ? "transparent" : "hsl(216 45% 8%/0.5)" }}>
                        <td className="px-3 py-2.5 font-semibold" style={{ color: "hsl(210 40% 88%)" }}>{p.name}</td>
                        <td className="px-3 py-2.5"><Badge v={p.type ?? ""} c={tc}/></td>
                        <td className="px-3 py-2.5 font-semibold" style={{ color: "hsl(38 95% 60%)" }}>{p.share}</td>
                        <td className="px-3 py-2.5" style={{ color: "hsl(215 25% 55%)" }}>{p.strength}</td>
                        <td className="px-3 py-2.5 max-w-48" style={{ color: "hsl(215 25% 50%)" }}>{p.recentMoves}</td>
                      </tr>
                    );
                  })}</tbody>
                </table>
              </div>
            </Section>
          )}

          {/* Geography */}
          {d.geography?.length > 0 && (
            <Section title="Geographic Demand Map" icon={MapPin} accent="hsl(158 64% 55%)">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {d.geography.map((c: any, i: number) => {
                  const dc = demandColor(c.demand);
                  const cc = c.competition === "Intense" ? "hsl(0 72% 68%)" : c.competition === "Moderate" ? "hsl(38 95% 60%)" : "hsl(158 64% 55%)";
                  return (
                    <div key={i} className="rounded-xl p-4" style={{ background: "hsl(216 45% 12%)" }}>
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-3.5 w-3.5" style={{ color: dc }}/>
                        <span className="text-sm font-bold" style={{ color: "hsl(210 40% 92%)" }}>{c.city}</span>
                        {c.region && <span className="text-[10px]" style={{ color: "hsl(215 25% 45%)" }}>{c.region}</span>}
                      </div>
                      <div className="flex gap-2 mb-2 flex-wrap">
                        <Badge v={`Demand: ${c.demand}`} c={dc}/>
                        <Badge v={`Comp: ${c.competition}`} c={cc}/>
                        {c.growth && <Badge v={c.growth} c="hsl(217 91% 70%)"/>}
                      </div>
                      {c.note && <p className="text-[11px]" style={{ color: "hsl(215 25% 55%)" }}>{c.note}</p>}
                    </div>
                  );
                })}
              </div>
            </Section>
          )}

          {/* Opportunities + Risks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {d.opportunities?.length > 0 && (
              <Section title="Opportunities" icon={Target} accent="hsl(158 64% 55%)">
                <div className="space-y-3">
                  {d.opportunities.map((o: any, i: number) => {
                    const dc = o.difficulty === "Easy" ? "hsl(158 64% 55%)" : o.difficulty === "Medium" ? "hsl(38 95% 60%)" : "hsl(0 72% 68%)";
                    return (
                      <div key={i} className="p-3 rounded-xl" style={{ background: "hsl(158 64% 40%/0.06)", border: "1px solid hsl(158 64% 40%/0.15)" }}>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Star className="h-3.5 w-3.5" style={{ color: "hsl(158 64% 55%)" }}/>
                          <span className="text-xs font-semibold" style={{ color: "hsl(210 40% 88%)" }}>{o.title}</span>
                          <Badge v={o.difficulty} c={dc}/>
                        </div>
                        <div className="flex gap-3 text-[10px]" style={{ color: "hsl(215 25% 50%)" }}>
                          <span style={{ color: "hsl(38 95% 55%)" }}>{o.potential}</span>
                          {o.timeToCapture && <span><Clock className="h-2.5 w-2.5 inline mr-0.5"/>{o.timeToCapture}</span>}
                        </div>
                        {o.detail && <p className="text-[11px] mt-1" style={{ color: "hsl(215 25% 55%)" }}>{o.detail}</p>}
                      </div>
                    );
                  })}
                </div>
              </Section>
            )}

            {d.risks?.length > 0 && (
              <Section title="Risks to Monitor" icon={AlertTriangle} accent="hsl(0 72% 68%)">
                <div className="space-y-3">
                  {d.risks.map((r: any, i: number) => {
                    const sc = impactColor(r.severity); const pc = impactColor(r.probability);
                    return (
                      <div key={i} className="p-3 rounded-xl" style={{ background: "hsl(0 72% 51%/0.04)", border: "1px solid hsl(0 72% 51%/0.1)" }}>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-xs font-semibold" style={{ color: "hsl(210 40% 85%)" }}>{r.risk}</span>
                          <Badge v={`Severity: ${r.severity}`} c={sc}/>
                          <Badge v={`Prob: ${r.probability}`} c={pc}/>
                        </div>
                        {r.mitigation && <p className="text-[11px]" style={{ color: "hsl(158 64% 55%)" }}>→ {r.mitigation}</p>}
                      </div>
                    );
                  })}
                </div>
              </Section>
            )}
          </div>

          {/* Investment Intelligence */}
          {d.investmentIntelligence && (
            <Section title="Investment Intelligence" icon={DollarSign} accent="hsl(38 95% 52%)">
              <div className="flex items-start gap-5 flex-wrap">
                <div className="text-center shrink-0">
                  <p className="text-5xl font-black" style={{ color: actionColor(d.investmentIntelligence.recommendedAction) }}>{d.investmentIntelligence.attractivenessScore ?? "—"}</p>
                  <p className="text-[10px] uppercase font-bold" style={{ color: "hsl(215 25% 45%)" }}>Attractiveness</p>
                  <Badge v={d.investmentIntelligence.recommendedAction ?? ""} c={actionColor(d.investmentIntelligence.recommendedAction)}/>
                </div>
                <div className="flex-1">
                  {d.investmentIntelligence.rationale && <p className="text-sm mb-4" style={{ color: "hsl(210 40% 80%)" }}>{d.investmentIntelligence.rationale}</p>}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {d.investmentIntelligence.quickWins?.length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold uppercase mb-2" style={{ color: "hsl(158 64% 55%)" }}>Quick Wins</p>
                        {d.investmentIntelligence.quickWins.map((w: string, i: number) => (
                          <p key={i} className="text-xs flex items-start gap-1.5 mb-1"><CheckCircle2 className="h-3 w-3 shrink-0 mt-0.5" style={{ color: "hsl(158 64% 55%)" }}/><span style={{ color: "hsl(210 40% 78%)" }}>{w}</span></p>
                        ))}
                      </div>
                    )}
                    {d.investmentIntelligence.avoidPitfalls?.length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold uppercase mb-2" style={{ color: "hsl(0 72% 68%)" }}>Pitfalls to Avoid</p>
                        {d.investmentIntelligence.avoidPitfalls.map((p: string, i: number) => (
                          <p key={i} className="text-xs flex items-start gap-1.5 mb-1"><AlertTriangle className="h-3 w-3 shrink-0 mt-0.5" style={{ color: "hsl(0 72% 68%)" }}/><span style={{ color: "hsl(210 40% 78%)" }}>{p}</span></p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Section>
          )}

          {/* Data Points */}
          {d.dataPoints?.length > 0 && (
            <div className="rounded-xl p-5" style={{ background: "hsl(216 45% 11%)", border: "1px solid hsl(var(--border))" }}>
              <p className="text-[10px] font-bold uppercase mb-3" style={{ color: "hsl(215 25% 45%)" }}>Key Data Points</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {d.dataPoints.map((p: any, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <span style={{ color: "hsl(38 95% 60%)" }}>•</span>
                    <span style={{ color: "hsl(210 40% 75%)" }}>{p.stat}</span>
                    {p.source && <span className="shrink-0 ml-auto" style={{ color: "hsl(215 25% 38%)" }}>[{p.source}]</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {tokensUsed && <AIStatusBar tokensUsed={tokensUsed}/>}
        </div>
      )}
    </div>
  );
}
