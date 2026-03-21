import { useState } from "react";
import {
  BarChart2, RefreshCw, TrendingUp, Shield, Target, AlertTriangle,
  CheckCircle2, DollarSign, Globe, Zap, Star, Users, ArrowRight
} from "lucide-react";
import { useClaudeAnalysis } from "@/hooks/useClaudeAnalysis";
import { AIStatusBar } from "@/components/ai/AIStatusBar";

const Badge = ({ v, c = "hsl(38 95% 60%)" }: { v: string; c?: string }) => (
  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold whitespace-nowrap"
    style={{ background: `${c}20`, color: c, border: `1px solid ${c}30` }}>{v}</span>
);
const Section = ({ title, icon: Icon, children, accent = "hsl(38 95% 52%)" }: any) => (
  <div className="rounded-2xl overflow-hidden" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
    <div className="px-5 py-3.5 flex items-center gap-2" style={{ background: "hsl(216 45% 11%)", borderBottom: "1px solid hsl(var(--border))" }}>
      <Icon className="h-4 w-4" style={{ color: accent }} />
      <h3 className="text-sm font-bold" style={{ color: "hsl(210 40% 92%)" }}>{title}</h3>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const SYSTEM_PROMPT = `You are a senior competitive intelligence analyst for Iraq, MENA and emerging markets. Generate a comprehensive competitive landscape analysis. Respond ONLY with valid JSON:
{
  "category": "string",
  "marketOverview": "string — 3-4 sentences about the competitive landscape in Iraq 2025-2026",
  "competitiveIntensity": "Very High|High|Medium|Low",
  "totalBrandsInMarket": "string — estimated number",
  "competitors": [
    {
      "brand": "string",
      "company": "string — parent company",
      "countryOfOrigin": "string",
      "yearEnteredIraq": "string",
      "priceRangeUSD": "string — per unit/kg/pack",
      "priceRangeIQD": "string — IQD equivalent",
      "marketShareEstimate": "string — %",
      "distributionStrength": "Dominant|Strong|Medium|Weak",
      "distributionReach": "string — which cities/regions",
      "mainDistributor": "string — if known",
      "targetSegment": "string — who buys this",
      "primaryChannels": ["Modern Trade|Traditional Trade|HORECA|Online|Direct"],
      "marketingStrategy": "string — how they market",
      "strengths": ["3-4 strengths"],
      "weaknesses": ["3-4 exploitable weaknesses"],
      "pricingStrategy": "Premium|Mid|Value|Budget",
      "brandAwareness": "Very High|High|Medium|Low",
      "loyaltyLevel": "High|Medium|Low",
      "recentMoves": "string — any recent news/changes"
    }
  ],
  "competitiveMatrix": {
    "priceLeader": "string brand",
    "qualityLeader": "string brand",
    "distributionLeader": "string brand",
    "marketShareLeader": "string brand",
    "innovationLeader": "string brand",
    "valueForMoneyLeader": "string brand"
  },
  "marketGaps": [
    { "gap": "string", "size": "Large|Medium|Small", "difficulty": "Easy|Medium|Hard", "howToCapture": "string" }
  ],
  "differentiationStrategies": [
    { "strategy": "string", "rationale": "string", "difficulty": "Easy|Medium|Hard", "timeToSeeResult": "string" }
  ],
  "competitiveAdvantagesAvailable": ["5-6 advantages an entrant can leverage"],
  "topThreats": [
    { "threat": "string", "from": "string — which competitor/factor", "severity": "High|Medium|Low", "mitigation": "string" }
  ],
  "positioningRecommendation": "string — 2-3 paragraph positioning strategy",
  "pricingPositionAdvice": "string — where to price relative to competition",
  "distributionAdvice": "string — how to win distribution",
  "marketEntryTiming": "string — now|wait|urgent",
  "marketEntryTimingRationale": "string",
  "winScenarios": ["3-4 scenarios where you can win market share"],
  "loseScenarios": ["2-3 scenarios where you would fail"],
  "competitorWeaknessSummary": "string — the single biggest opportunity from all competitor weaknesses"
}`;

const CATEGORIES = [
  "Food & Beverages","FMCG / Consumer Goods","Healthcare & Pharmaceuticals",
  "Construction Materials","Electronics & Technology","Clothing & Textiles",
  "Agricultural Products","Cosmetics & Personal Care","Industrial Equipment",
  "Household Products","Children & Baby Products","Automotive Parts","Other",
];

export default function CompetitorAnalysis() {
  const [form, setForm] = useState({ product: "", category: "", origin: "", targetPrice: "", yourAdvantage: "" });
  const { result, loading, error, analyze, tokensUsed, responseTime, jsonValid, modelUsed } = useClaudeAnalysis({ systemPrompt: SYSTEM_PROMPT, agentId: "competitor-v2", modelTier: "flash-lite" });

  const run = () => {
    if (!form.product.trim()) return;
    analyze(`Analyze the competitive landscape in Iraq for:
Product/Category: ${form.product}
Category: ${form.category || "Not specified"}
My Country of Origin: ${form.origin || "Not specified"}
My Target Price Range: ${form.targetPrice || "Not specified"}
My Main Competitive Advantage: ${form.yourAdvantage || "Not specified"}

Identify ALL competing brands with their strengths, weaknesses, pricing, distribution, market share. Suggest specific differentiation strategies. Be specific to Iraq market 2025-2026.`);
  };

  const d = result;
  const probColor = (v: string) => v === "High" ? "hsl(0 72% 68%)" : v === "Medium" ? "hsl(38 95% 60%)" : "hsl(158 64% 55%)";
  const distColor = (v: string) => v === "Dominant" ? "hsl(0 72% 68%)" : v === "Strong" ? "hsl(38 95% 60%)" : v === "Medium" ? "hsl(217 91% 70%)" : "hsl(158 64% 55%)";
  const inp = "w-full px-3 py-2.5 rounded-lg text-sm";
  const IS = { background: "hsl(216 45% 12%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <BarChart2 className="h-6 w-6" style={{ color: "hsl(38 95% 52%)" }} />
        <div>
          <h1 className="text-xl font-bold font-display" style={{ color: "hsl(210 40% 92%)" }}>Competitor Analysis</h1>
          <p className="text-sm" style={{ color: "hsl(215 25% 55%)" }}>Full competitive landscape · differentiation · positioning · win strategy</p>
        </div>
      </div>

      <div className="rounded-2xl p-6 space-y-4" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "hsl(215 25% 45%)" }}>Product / Category to Analyze *</label>
            <input value={form.product} onChange={e => setForm(f => ({ ...f, product: e.target.value }))} placeholder="e.g. Instant Noodles, Water Pumps, Baby Diapers..." className={inp} style={IS} />
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "hsl(215 25% 45%)" }}>Category</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={inp} style={IS}>
              <option value="">Select...</option>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "hsl(215 25% 45%)" }}>My Country of Origin</label>
            <input value={form.origin} onChange={e => setForm(f => ({ ...f, origin: e.target.value }))} placeholder="e.g. Turkey, UAE..." className={inp} style={IS} />
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "hsl(215 25% 45%)" }}>My Target Price Range</label>
            <input value={form.targetPrice} onChange={e => setForm(f => ({ ...f, targetPrice: e.target.value }))} placeholder="e.g. $1.50-2.00/unit..." className={inp} style={IS} />
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "hsl(215 25% 45%)" }}>My Main Advantage</label>
            <input value={form.yourAdvantage} onChange={e => setForm(f => ({ ...f, yourAdvantage: e.target.value }))} placeholder="e.g. lower price, better quality, halal cert..." className={inp} style={IS} />
          </div>
        </div>
        <button onClick={run} disabled={loading || !form.product.trim()}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold disabled:opacity-50"
          style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
          {loading ? <><RefreshCw className="h-4 w-4 animate-spin" /> Analyzing competitors...</> : <><BarChart2 className="h-4 w-4" /> Run Competitor Analysis</>}
        </button>
      </div>

      {error && <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: "hsl(0 72% 51%/0.08)", border: "1px solid hsl(0 72% 51%/0.3)" }}>
        <AlertTriangle className="h-4 w-4 shrink-0" style={{ color: "hsl(0 72% 68%)" }} />
        <p className="text-sm" style={{ color: "hsl(0 72% 68%)" }}>{error}</p>
      </div>}
      {loading && <div className="rounded-xl p-10 text-center" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <RefreshCw className="h-10 w-10 mx-auto mb-4 animate-spin" style={{ color: "hsl(38 95% 52%)" }} />
        <p className="font-semibold" style={{ color: "hsl(210 40% 82%)" }}>Mapping competitive landscape in Iraq...</p>
      </div>}
      {!loading && !d && !error && <div className="rounded-xl p-14 text-center" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <BarChart2 className="h-14 w-14 mx-auto mb-4 opacity-15" style={{ color: "hsl(38 95% 52%)" }} />
        <p className="font-semibold" style={{ color: "hsl(215 25% 55%)" }}>Enter your product to map the full competitive landscape in Iraq</p>
      </div>}

      {d && !loading && (
        <div className="space-y-5">
          {/* Overview banner */}
          <div className="rounded-2xl p-5" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <Badge v={d.competitiveIntensity ?? ""} c={probColor(d.competitiveIntensity === "Very High" ? "High" : d.competitiveIntensity ?? "")} />
              <span className="text-xs" style={{ color: "hsl(215 25% 55%)" }}>Intensity</span>
              {d.totalBrandsInMarket && <span className="text-xs" style={{ color: "hsl(215 25% 50%)" }}>~{d.totalBrandsInMarket} brands active</span>}
              <Badge v={d.marketEntryTiming ?? ""} c={d.marketEntryTiming === "urgent" ? "hsl(158 64% 55%)" : d.marketEntryTiming === "now" ? "hsl(38 95% 60%)" : "hsl(0 72% 68%)"} />
            </div>
            <p className="text-sm" style={{ color: "hsl(210 40% 80%)" }}>{d.marketOverview}</p>
            {d.competitorWeaknessSummary && (
              <div className="mt-3 p-3 rounded-lg" style={{ background: "hsl(158 64% 40%/0.08)", border: "1px solid hsl(158 64% 40%/0.2)" }}>
                <p className="text-xs font-bold mb-1" style={{ color: "hsl(158 64% 55%)" }}>🎯 Biggest Opportunity</p>
                <p className="text-xs" style={{ color: "hsl(215 25% 62%)" }}>{d.competitorWeaknessSummary}</p>
              </div>
            )}
          </div>

          {/* Competitor table */}
          {d.competitors?.length > 0 && (
            <Section title={`Competitors (${d.competitors.length} brands)`} icon={Users} accent="hsl(0 72% 68%)">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead><tr style={{ background: "hsl(216 45% 11%)" }}>
                    {["Brand","Origin","Price (USD)","Share","Distribution","Channels","Awareness","Strategy","Strengths","Weaknesses"].map(h => (
                      <th key={h} className="px-3 py-2.5 text-left font-semibold whitespace-nowrap" style={{ color: "hsl(215 25% 45%)" }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>{d.competitors.map((c: any, i: number) => (
                    <tr key={i} style={{ borderTop: "1px solid hsl(var(--border))", background: i % 2 === 0 ? "transparent" : "hsl(216 45% 8%/0.5)" }}>
                      <td className="px-3 py-2.5">
                        <p className="font-bold" style={{ color: "hsl(210 40% 88%)" }}>{c.brand}</p>
                        <p className="text-[10px]" style={{ color: "hsl(215 25% 45%)" }}>{c.company}</p>
                      </td>
                      <td className="px-3 py-2.5" style={{ color: "hsl(215 25% 55%)" }}>{c.countryOfOrigin}</td>
                      <td className="px-3 py-2.5 font-semibold" style={{ color: "hsl(38 95% 60%)" }}>{c.priceRangeUSD}</td>
                      <td className="px-3 py-2.5" style={{ color: "hsl(215 25% 55%)" }}>{c.marketShareEstimate}</td>
                      <td className="px-3 py-2.5"><Badge v={c.distributionStrength ?? ""} c={distColor(c.distributionStrength ?? "")} /></td>
                      <td className="px-3 py-2.5 max-w-32" style={{ color: "hsl(215 25% 50%)" }}>{c.primaryChannels?.join(", ")}</td>
                      <td className="px-3 py-2.5"><Badge v={c.brandAwareness ?? ""} c="hsl(217 91% 70%)" /></td>
                      <td className="px-3 py-2.5 max-w-40" style={{ color: "hsl(215 25% 50%)" }}>{c.marketingStrategy}</td>
                      <td className="px-3 py-2.5 max-w-48">
                        {c.strengths?.map((s: string, j: number) => <p key={j} className="text-[10px]" style={{ color: "hsl(0 72% 68%)" }}>• {s}</p>)}
                      </td>
                      <td className="px-3 py-2.5 max-w-48">
                        {c.weaknesses?.map((w: string, j: number) => <p key={j} className="text-[10px]" style={{ color: "hsl(158 64% 55%)" }}>✓ {w}</p>)}
                      </td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
              {d.competitiveMatrix && (
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-4">
                  {[
                    { l: "Price Leader",       v: d.competitiveMatrix.priceLeader },
                    { l: "Quality Leader",     v: d.competitiveMatrix.qualityLeader },
                    { l: "Distribution",       v: d.competitiveMatrix.distributionLeader },
                    { l: "Market Share",       v: d.competitiveMatrix.marketShareLeader },
                    { l: "Innovation",         v: d.competitiveMatrix.innovationLeader },
                    { l: "Value for Money",    v: d.competitiveMatrix.valueForMoneyLeader },
                  ].map((m, i) => m.v && (
                    <div key={i} className="rounded-lg p-2 text-center" style={{ background: "hsl(216 45% 11%)" }}>
                      <p className="text-[9px] uppercase font-bold mb-0.5" style={{ color: "hsl(215 25% 45%)" }}>{m.l}</p>
                      <p className="text-xs font-semibold" style={{ color: "hsl(210 40% 82%)" }}>{m.v}</p>
                    </div>
                  ))}
                </div>
              )}
            </Section>
          )}

          {/* Market Gaps */}
          {d.marketGaps?.length > 0 && (
            <div className="rounded-xl p-5" style={{ background: "hsl(158 64% 40%/0.05)", border: "1px solid hsl(158 64% 40%/0.2)" }}>
              <p className="text-xs font-bold uppercase mb-3" style={{ color: "hsl(158 64% 55%)" }}>Market Gaps to Exploit</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {d.marketGaps.map((g: any, i: number) => {
                  const sc = g.size === "Large" ? "hsl(158 64% 55%)" : g.size === "Medium" ? "hsl(38 95% 60%)" : "hsl(217 91% 70%)";
                  const dc = g.difficulty === "Easy" ? "hsl(158 64% 55%)" : g.difficulty === "Medium" ? "hsl(38 95% 60%)" : "hsl(0 72% 68%)";
                  return (
                    <div key={i} className="rounded-lg p-3" style={{ background: "hsl(158 64% 40%/0.08)" }}>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Star className="h-3.5 w-3.5" style={{ color: sc }} />
                        <span className="text-xs font-semibold" style={{ color: "hsl(210 40% 88%)" }}>{g.gap}</span>
                        <Badge v={g.size} c={sc} />
                        <Badge v={g.difficulty} c={dc} />
                      </div>
                      <p className="text-[11px]" style={{ color: "hsl(215 25% 55%)" }}>{g.howToCapture}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Differentiation strategies */}
            {d.differentiationStrategies?.length > 0 && (
              <Section title="Differentiation Strategies" icon={Zap}>
                <div className="space-y-2">
                  {d.differentiationStrategies.map((s: any, i: number) => {
                    const dc = s.difficulty === "Easy" ? "hsl(158 64% 55%)" : s.difficulty === "Medium" ? "hsl(38 95% 60%)" : "hsl(0 72% 68%)";
                    return (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "hsl(216 45% 12%)" }}>
                        <div className="h-5 w-5 rounded flex items-center justify-center text-[10px] font-black shrink-0" style={{ background: "hsl(38 95% 52%/0.2)", color: "hsl(38 95% 60%)" }}>{i + 1}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-semibold" style={{ color: "hsl(210 40% 88%)" }}>{s.strategy}</span>
                            <Badge v={s.difficulty} c={dc} />
                          </div>
                          <p className="text-[11px] mt-0.5" style={{ color: "hsl(215 25% 55%)" }}>{s.rationale}</p>
                          {s.timeToSeeResult && <p className="text-[10px] mt-0.5" style={{ color: "hsl(215 25% 45%)" }}>Result in: {s.timeToSeeResult}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Section>
            )}

            {/* Threats */}
            {d.topThreats?.length > 0 && (
              <Section title="Top Threats" icon={AlertTriangle} accent="hsl(0 72% 68%)">
                <div className="space-y-2">
                  {d.topThreats.map((t: any, i: number) => (
                    <div key={i} className="p-3 rounded-xl" style={{ background: "hsl(216 45% 12%)" }}>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-semibold" style={{ color: "hsl(210 40% 88%)" }}>{t.threat}</span>
                        <Badge v={t.severity ?? ""} c={probColor(t.severity ?? "")} />
                      </div>
                      {t.from && <p className="text-[10px] mb-1" style={{ color: "hsl(215 25% 50%)" }}>Source: {t.from}</p>}
                      {t.mitigation && <p className="text-[11px]" style={{ color: "hsl(158 64% 55%)" }}>→ {t.mitigation}</p>}
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>

          {/* Positioning + Win/Lose */}
          {d.positioningRecommendation && (
            <Section title="Positioning Recommendation" icon={Target} accent="hsl(38 95% 52%)">
              <p className="text-sm mb-4" style={{ color: "hsl(210 40% 80%)" }}>{d.positioningRecommendation}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {d.pricingPositionAdvice && <div className="rounded-lg p-3" style={{ background: "hsl(38 95% 52%/0.06)", border: "1px solid hsl(38 95% 52%/0.2)" }}>
                  <p className="text-[10px] font-bold uppercase mb-1" style={{ color: "hsl(38 95% 60%)" }}>Pricing Position</p>
                  <p className="text-xs" style={{ color: "hsl(215 25% 60%)" }}>{d.pricingPositionAdvice}</p>
                </div>}
                {d.distributionAdvice && <div className="rounded-lg p-3" style={{ background: "hsl(217 91% 53%/0.06)", border: "1px solid hsl(217 91% 53%/0.2)" }}>
                  <p className="text-[10px] font-bold uppercase mb-1" style={{ color: "hsl(217 91% 70%)" }}>Distribution Strategy</p>
                  <p className="text-xs" style={{ color: "hsl(215 25% 60%)" }}>{d.distributionAdvice}</p>
                </div>}
              </div>
            </Section>
          )}

          {/* Win / Lose scenarios */}
          {(d.winScenarios?.length > 0 || d.loseScenarios?.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {d.winScenarios?.length > 0 && (
                <div className="rounded-xl p-5" style={{ background: "hsl(158 64% 40%/0.05)", border: "1px solid hsl(158 64% 40%/0.2)" }}>
                  <p className="text-xs font-bold uppercase mb-3" style={{ color: "hsl(158 64% 55%)" }}>✓ Win Scenarios</p>
                  <div className="space-y-1.5">{d.winScenarios.map((s: string, i: number) => (
                    <p key={i} className="text-xs flex items-start gap-1.5"><CheckCircle2 className="h-3 w-3 shrink-0 mt-0.5" style={{ color: "hsl(158 64% 55%)" }} /><span style={{ color: "hsl(210 40% 78%)" }}>{s}</span></p>
                  ))}</div>
                </div>
              )}
              {d.loseScenarios?.length > 0 && (
                <div className="rounded-xl p-5" style={{ background: "hsl(0 72% 51%/0.05)", border: "1px solid hsl(0 72% 51%/0.2)" }}>
                  <p className="text-xs font-bold uppercase mb-3" style={{ color: "hsl(0 72% 68%)" }}>✗ Lose Scenarios</p>
                  <div className="space-y-1.5">{d.loseScenarios.map((s: string, i: number) => (
                    <p key={i} className="text-xs flex items-start gap-1.5"><AlertTriangle className="h-3 w-3 shrink-0 mt-0.5" style={{ color: "hsl(0 72% 68%)" }} /><span style={{ color: "hsl(210 40% 78%)" }}>{s}</span></p>
                  ))}</div>
                </div>
              )}
            </div>
          )}

          {tokensUsed && <AIStatusBar tokensUsed={tokensUsed} />}
        </div>
      )}
    </div>
  );
}
