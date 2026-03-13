import { useState } from "react";
import { FileBarChart2, RefreshCw, Download, TrendingUp, CheckCircle2 } from "lucide-react";
import { useClaudeAnalysis } from "@/hooks/useClaudeAnalysis";
import { OutputCard, DataRow, TagList, LoadingState, EmptyState } from "@/components/analysis/OutputCard";

const SYSTEM_PROMPT = `You are a senior Iraq market feasibility consultant. Generate a comprehensive market feasibility study and business plan. Respond ONLY with valid JSON:
{
  "executiveSummary": {
    "verdict": "Highly Recommended|Recommended|Conditional|Not Recommended",
    "score": "number 0-100",
    "summary": "string - 3-4 sentences comprehensive summary",
    "keyFindings": ["array of 5 key findings"]
  },
  "productSuitability": {
    "suitable": true,
    "score": "number 0-100",
    "reasons": ["array of reasons why/why not suitable"],
    "adjustmentsNeeded": ["array of adjustments needed for Iraq market"]
  },
  "marketAnalysis": {
    "totalMarketSize": "string USD",
    "growthRate": "string %",
    "demandForecast": "string",
    "seasonality": "string",
    "keyTrends": ["array of 4-5 trends"]
  },
  "pricingStrategy": {
    "optimalRetailPrice": "string USD",
    "optimalWholesalePrice": "string USD",
    "pricingModel": "string",
    "justification": "string"
  },
  "distributionPlan": {
    "primaryChannels": ["array"],
    "cities": ["priority cities in order"],
    "partnerProfile": "string",
    "timeline": "string"
  },
  "competitorLandscape": {
    "mainCompetitors": ["array of top 3-4 competitors"],
    "yourAdvantage": ["array of competitive advantages"],
    "marketShare": "string - realistic achievable share in 2 years"
  },
  "financialProjections": {
    "year1Revenue": "string USD",
    "year2Revenue": "string USD", 
    "year3Revenue": "string USD",
    "breakEvenMonths": "string",
    "initialInvestment": "string USD",
    "roi12months": "string %",
    "roi36months": "string %"
  },
  "distributorDatabase": {
    "certifiedDistributors": [
      {"name":"string","city":"string","specialization":"string","contactMethod":"string","tier":"Tier 1|Tier 2"}
    ],
    "wholesalers": [
      {"name":"string","market":"string","city":"string","focus":"string"}
    ]
  },
  "implementationRoadmap": [
    {"phase":"string","duration":"string","activities":["array"],"milestone":"string"}
  ],
  "riskMatrix": [
    {"risk":"string","probability":"High|Medium|Low","impact":"High|Medium|Low","mitigation":"string"}
  ],
  "recommendation": "string - final recommendation paragraph"
}`;

export default function FeasibilityStudy() {
  const [form, setForm] = useState({
    company: "", product: "", category: "", origin: "",
    targetPrice: "", annualCapacity: "", budget: "", timeline: "6 months"
  });
  const { result, loading, error, analyze } = useClaudeAnalysis({ systemPrompt: SYSTEM_PROMPT });

  const handleSubmit = () => {
    if (!form.product) return;
    analyze(`Generate a full Iraq Market Feasibility Study and Business Plan for:

Company: ${form.company || "Confidential"}
Product: ${form.product}
Category: ${form.category}
Country of Origin: ${form.origin}
Target Export Price: ${form.targetPrice}
Annual Production Capacity: ${form.annualCapacity}
Available Budget for Market Entry: ${form.budget}
Target Entry Timeline: ${form.timeline}

Provide a comprehensive feasibility study covering: Is the product suitable? What is the right price? Where should it be sold? Who are the competitors? Distributor database. Financial projections. Implementation roadmap. Full business plan for Iraq 2025-2026.`);
  };

  const d = result;
  const verdictColor = (v: string) => {
    if (v === "Highly Recommended") return { pill: "data-pill-green", text: "hsl(158 64% 55%)", bg: "hsl(158 64% 40% / 0.1)", border: "hsl(158 64% 40% / 0.3)" };
    if (v === "Recommended") return { pill: "data-pill-green", text: "hsl(158 64% 55%)", bg: "hsl(158 64% 40% / 0.08)", border: "hsl(158 64% 40% / 0.25)" };
    if (v === "Conditional") return { pill: "data-pill-amber", text: "hsl(38 95% 60%)", bg: "hsl(38 95% 52% / 0.08)", border: "hsl(38 95% 52% / 0.25)" };
    return { pill: "data-pill-red", text: "hsl(0 72% 65%)", bg: "hsl(0 72% 51% / 0.08)", border: "hsl(0 72% 51% / 0.25)" };
  };

  const vc = d ? verdictColor(d.executiveSummary?.verdict) : null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileBarChart2 className="h-5 w-5" style={{ color: "hsl(38 95% 52%)" }} />
            <h1 className="text-xl font-bold font-display" style={{ color: "hsl(210 40% 92%)" }}>Full Market Feasibility Study</h1>
          </div>
          <p className="text-sm" style={{ color: "hsl(215 25% 55%)" }}>
            Complete Iraq market feasibility study, business plan & distributor database
          </p>
        </div>
        <span className="data-pill-amber">Comprehensive Report</span>
      </div>

      {/* Description */}
      <div className="rounded-xl p-4 flex items-start gap-3"
        style={{ background: "hsl(158 64% 40% / 0.06)", border: "1px solid hsl(158 64% 40% / 0.2)" }}>
        <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "hsl(158 64% 50%)" }} />
        <p className="text-sm" style={{ color: "hsl(215 25% 68%)" }}>
          This comprehensive report answers: <strong style={{ color: "hsl(210 40% 85%)" }}>Is your product suitable for Iraq?</strong> What is the right price? Where should it be sold? Who are the competitors? Find certified distributors. Financial projections and implementation roadmap included.
        </p>
      </div>

      {/* Form */}
      <div className="rounded-xl p-6" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Company Name", key: "company", placeholder: "Your company name" },
            { label: "Product Name *", key: "product", placeholder: "e.g. Premium Olive Oil" },
            { label: "Product Category", key: "category", placeholder: "e.g. Food & Beverages" },
            { label: "Country of Origin", key: "origin", placeholder: "e.g. Greece, Turkey" },
            { label: "Target Export Price (USD)", key: "targetPrice", placeholder: "e.g. $5 per bottle" },
            { label: "Annual Production Capacity", key: "annualCapacity", placeholder: "e.g. 500,000 units/yr" },
            { label: "Available Entry Budget", key: "budget", placeholder: "e.g. $50,000" },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="section-label">{label}</label>
              <input className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
                style={{ background: "hsl(216 45% 14%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }}
                placeholder={placeholder} value={(form as any)[key]}
                onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
            </div>
          ))}
          <div>
            <label className="section-label">Target Entry Timeline</label>
            <select className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
              style={{ background: "hsl(216 45% 14%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }}
              value={form.timeline} onChange={e => setForm(p => ({ ...p, timeline: e.target.value }))}>
              {["3 months", "6 months", "12 months", "18+ months"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <button onClick={handleSubmit} disabled={loading || !form.product}
          className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50"
          style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
          {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <FileBarChart2 className="h-4 w-4" />}
          {loading ? "Generating Feasibility Study..." : "Generate Full Feasibility Study"}
        </button>
      </div>

      {error && <div className="rounded-xl p-4" style={{ background: "hsl(0 72% 51% / 0.1)", border: "1px solid hsl(0 72% 51% / 0.3)" }}><p className="text-sm" style={{ color: "hsl(0 72% 68%)" }}>⚠ {error}</p></div>}
      {loading && <LoadingState message="Generating comprehensive Iraq market feasibility study..." />}
      {!loading && !d && !error && <EmptyState icon={<FileBarChart2 className="h-12 w-12" />} title="Full Market Feasibility Study" description="Fill in your product details above to generate a comprehensive Iraq market feasibility study and business plan." />}

      {d && !loading && (
        <div className="space-y-5">
          {/* Executive Summary */}
          {d.executiveSummary && vc && (
            <div className="rounded-xl p-6" style={{ background: vc.bg, border: `1px solid ${vc.border}` }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="section-label">Executive Summary</p>
                  <div className="flex items-center gap-3 mt-1">
                    <h2 className="text-xl font-bold font-display" style={{ color: vc.text }}>{d.executiveSummary.verdict}</h2>
                    <span className="font-mono-data text-2xl font-bold" style={{ color: "hsl(38 95% 60%)" }}>{d.executiveSummary.score}/100</span>
                  </div>
                </div>
                <Download className="h-5 w-5 cursor-pointer opacity-50 hover:opacity-100 transition" style={{ color: "hsl(215 25% 60%)" }} />
              </div>
              <p className="text-sm mb-4" style={{ color: "hsl(215 25% 68%)" }}>{d.executiveSummary.summary}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {d.executiveSummary.keyFindings?.map((f: string, i: number) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                      style={{ background: `${vc.text}22`, color: vc.text }}>{i + 1}</span>
                    <p className="text-sm" style={{ color: "hsl(215 25% 68%)" }}>{f}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Product Suitability */}
            {d.productSuitability && (
              <OutputCard title="Product Suitability" icon={<CheckCircle2 className="h-4 w-4" />}
                variant={d.productSuitability.suitable ? "green" : "red"}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold font-mono-data"
                    style={{ background: d.productSuitability.suitable ? "hsl(158 64% 40% / 0.15)" : "hsl(0 72% 51% / 0.15)", color: d.productSuitability.suitable ? "hsl(158 64% 55%)" : "hsl(0 72% 68%)" }}>
                    {d.productSuitability.score}
                  </div>
                  <span className={d.productSuitability.suitable ? "data-pill-green" : "data-pill-red"}>
                    {d.productSuitability.suitable ? "Suitable for Iraq" : "Needs Adjustments"}
                  </span>
                </div>
                {d.productSuitability.reasons?.map((r: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 mb-1.5">
                    <span style={{ color: d.productSuitability.suitable ? "hsl(158 64% 50%)" : "hsl(38 95% 52%)" }}>›</span>
                    <p className="text-xs" style={{ color: "hsl(215 25% 65%)" }}>{r}</p>
                  </div>
                ))}
              </OutputCard>
            )}

            {/* Market Analysis */}
            {d.marketAnalysis && (
              <OutputCard title="Market Analysis" icon={<TrendingUp className="h-4 w-4" />} variant="amber">
                <DataRow label="Market Size" value={d.marketAnalysis.totalMarketSize} highlight />
                <DataRow label="Growth Rate" value={d.marketAnalysis.growthRate} />
                <DataRow label="Demand Forecast" value={d.marketAnalysis.demandForecast} />
                <DataRow label="Seasonality" value={d.marketAnalysis.seasonality} />
                <div className="mt-2 pt-2 border-t" style={{ borderColor: "hsl(var(--border))" }}>
                  <TagList items={d.marketAnalysis.keyTrends} variant="amber" />
                </div>
              </OutputCard>
            )}

            {/* Financial Projections */}
            {d.financialProjections && (
              <OutputCard title="Financial Projections" variant="green">
                <DataRow label="Year 1 Revenue" value={d.financialProjections.year1Revenue} highlight />
                <DataRow label="Year 2 Revenue" value={d.financialProjections.year2Revenue} />
                <DataRow label="Year 3 Revenue" value={d.financialProjections.year3Revenue} />
                <DataRow label="Initial Investment" value={d.financialProjections.initialInvestment} />
                <DataRow label="Break-even" value={d.financialProjections.breakEvenMonths} />
                <DataRow label="ROI (12 months)" value={d.financialProjections.roi12months} highlight />
                <DataRow label="ROI (36 months)" value={d.financialProjections.roi36months} />
              </OutputCard>
            )}
          </div>

          {/* Pricing Strategy */}
          {d.pricingStrategy && (
            <OutputCard title="Recommended Pricing Strategy" variant="amber">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <DataRow label="Optimal Retail Price" value={d.pricingStrategy.optimalRetailPrice} highlight />
                <DataRow label="Optimal Wholesale" value={d.pricingStrategy.optimalWholesalePrice} highlight />
                <DataRow label="Pricing Model" value={<span className="data-pill-amber">{d.pricingStrategy.pricingModel}</span>} />
              </div>
              <p className="text-sm mt-3" style={{ color: "hsl(215 25% 62%)" }}>{d.pricingStrategy.justification}</p>
            </OutputCard>
          )}

          {/* Distribution Plan & Competitors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {d.distributionPlan && (
              <OutputCard title="Distribution Plan" variant="blue">
                <div className="mb-3">
                  <p className="section-label mb-1.5">Priority Cities</p>
                  <TagList items={d.distributionPlan.cities} variant="blue" />
                </div>
                <div className="mb-3">
                  <p className="section-label mb-1.5">Channels</p>
                  <TagList items={d.distributionPlan.primaryChannels} variant="muted" />
                </div>
                <DataRow label="Timeline" value={d.distributionPlan.timeline} />
                <p className="text-xs mt-2 italic" style={{ color: "hsl(215 25% 58%)" }}>{d.distributionPlan.partnerProfile}</p>
              </OutputCard>
            )}
            {d.competitorLandscape && (
              <OutputCard title="Competitive Landscape" variant="red">
                <div className="mb-3">
                  <p className="section-label mb-1.5">Main Competitors</p>
                  <TagList items={d.competitorLandscape.mainCompetitors} variant="red" />
                </div>
                <div className="mb-3">
                  <p className="section-label mb-1.5">Your Advantages</p>
                  {d.competitorLandscape.yourAdvantage?.map((a: string, i: number) => (
                    <div key={i} className="flex items-start gap-1.5 mb-1">
                      <span style={{ color: "hsl(158 64% 50%)" }}>✓</span>
                      <p className="text-xs" style={{ color: "hsl(215 25% 65%)" }}>{a}</p>
                    </div>
                  ))}
                </div>
                <DataRow label="Achievable Market Share" value={d.competitorLandscape.marketShare} highlight />
              </OutputCard>
            )}
          </div>

          {/* Distributor Database */}
          {d.distributorDatabase && (
            <div className="rounded-xl p-5" style={{ background: "hsl(var(--card))", border: "1px solid hsl(38 95% 52% / 0.25)" }}>
              <h3 className="text-sm font-semibold font-display mb-4 flex items-center gap-2" style={{ color: "hsl(38 95% 60%)" }}>
                <span>📋</span> Distributor & Wholesaler Database
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {d.distributorDatabase.certifiedDistributors?.length > 0 && (
                  <div>
                    <p className="section-label mb-2">Certified Distributors</p>
                    <div className="space-y-2">
                      {d.distributorDatabase.certifiedDistributors.map((dist: any, i: number) => (
                        <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg" style={{ background: "hsl(216 45% 13%)" }}>
                          <span className={dist.tier === "Tier 1" ? "data-pill-green" : "data-pill-muted"} style={{ fontSize: "10px", flexShrink: 0, marginTop: "2px" }}>{dist.tier}</span>
                          <div>
                            <p className="text-xs font-semibold" style={{ color: "hsl(210 40% 85%)" }}>{dist.name}</p>
                            <p className="text-xs" style={{ color: "hsl(215 25% 58%)" }}>{dist.city} · {dist.specialization}</p>
                            <p className="text-xs italic mt-0.5" style={{ color: "hsl(215 25% 52%)" }}>📨 {dist.contactMethod}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {d.distributorDatabase.wholesalers?.length > 0 && (
                  <div>
                    <p className="section-label mb-2">Wholesalers</p>
                    <div className="space-y-2">
                      {d.distributorDatabase.wholesalers.map((w: any, i: number) => (
                        <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg" style={{ background: "hsl(216 45% 13%)" }}>
                          <div>
                            <p className="text-xs font-semibold" style={{ color: "hsl(210 40% 85%)" }}>{w.name}</p>
                            <p className="text-xs" style={{ color: "hsl(215 25% 58%)" }}>{w.city} · {w.market}</p>
                            <p className="text-xs" style={{ color: "hsl(215 25% 52%)" }}>Focus: {w.focus}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Implementation Roadmap */}
          {d.implementationRoadmap?.length > 0 && (
            <OutputCard title="Implementation Roadmap" icon={<TrendingUp className="h-4 w-4" />} variant="green">
              <div className="space-y-3">
                {d.implementationRoadmap.map((phase: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: "hsl(216 45% 13%)" }}>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                      style={{ background: "hsl(158 64% 40% / 0.15)", color: "hsl(158 64% 55%)" }}>P{i + 1}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-semibold" style={{ color: "hsl(210 40% 88%)" }}>{phase.phase}</h4>
                        <span className="text-xs font-mono-data" style={{ color: "hsl(38 95% 60%)" }}>{phase.duration}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-1.5">
                        {phase.activities?.map((a: string, j: number) => <span key={j} className="data-pill-muted" style={{ fontSize: "10px" }}>{a}</span>)}
                      </div>
                      <p className="text-xs font-medium" style={{ color: "hsl(158 64% 50%)" }}>✓ Milestone: {phase.milestone}</p>
                    </div>
                  </div>
                ))}
              </div>
            </OutputCard>
          )}

          {/* Risk Matrix */}
          {d.riskMatrix?.length > 0 && (
            <OutputCard title="Risk Matrix" variant="red">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    {["Risk", "Probability", "Impact", "Mitigation"].map(h => (
                      <th key={h} className="text-left pb-3 pr-4 text-xs font-semibold uppercase tracking-wider" style={{ color: "hsl(215 25% 50%)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {d.riskMatrix.map((row: any, i: number) => (
                    <tr key={i} style={{ borderTop: "1px solid hsl(var(--border))" }}>
                      <td className="py-2.5 pr-4 text-xs font-medium" style={{ color: "hsl(210 40% 82%)" }}>{row.risk}</td>
                      <td className="py-2.5 pr-4">
                        <span className={row.probability === "High" ? "data-pill-red" : row.probability === "Medium" ? "data-pill-amber" : "data-pill-green"} style={{ fontSize: "10px" }}>{row.probability}</span>
                      </td>
                      <td className="py-2.5 pr-4">
                        <span className={row.impact === "High" ? "data-pill-red" : row.impact === "Medium" ? "data-pill-amber" : "data-pill-green"} style={{ fontSize: "10px" }}>{row.impact}</span>
                      </td>
                      <td className="py-2.5 text-xs" style={{ color: "hsl(215 25% 62%)" }}>{row.mitigation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </OutputCard>
          )}

          {/* Final Recommendation */}
          {d.recommendation && (
            <div className="rounded-xl p-5" style={{ background: "hsl(158 64% 40% / 0.06)", border: "1px solid hsl(158 64% 40% / 0.25)" }}>
              <h3 className="text-sm font-semibold font-display mb-2 flex items-center gap-2" style={{ color: "hsl(158 64% 55%)" }}>
                <CheckCircle2 className="h-4 w-4" /> Final Recommendation
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "hsl(215 25% 70%)" }}>{d.recommendation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
