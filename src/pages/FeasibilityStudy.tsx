import { useState } from "react";
import {
  FileBarChart2, RefreshCw, TrendingUp, CheckCircle2, AlertTriangle,
  DollarSign, Shield, Target, Zap, Star, BarChart2, MapPin, Truck,
  Users, Globe, Building2, FileText
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
      <I className="h-4 w-4" style={{ color: accent }} /><h3 className="text-sm font-bold" style={{ color: "hsl(210 40% 92%)" }}>{title}</h3>
    </div>
    <div className="p-5">{children}</div>
  </div>
);
const Row = ({ label, value, highlight }: { label: string; value?: string; highlight?: boolean }) => value ? (
  <div className="flex items-start justify-between gap-4 py-2" style={{ borderBottom: "1px solid hsl(var(--border)/0.5)" }}>
    <span className="text-xs shrink-0" style={{ color: "hsl(215 25% 50%)" }}>{label}</span>
    <span className="text-xs text-right font-semibold" style={{ color: highlight ? "hsl(38 95% 60%)" : "hsl(210 40% 85%)" }}>{value}</span>
  </div>
) : null;

const SYSTEM_PROMPT = `You are a senior Iraq market feasibility consultant with 20+ years experience. Generate the most comprehensive feasibility study possible for exporting/entering the Iraqi market. Respond ONLY with valid JSON:
{
  "executiveSummary": {
    "verdict": "Highly Recommended|Recommended|Conditional|Not Recommended",
    "score": "number 0-100",
    "summary": "string — 4-5 sentences",
    "keyFindings": ["5-6 key findings"],
    "dealBreakers": ["any conditions that make this not viable"],
    "whyIraqNow": "string — specific reasons Iraq is a good market right now"
  },
  "productSuitability": {
    "suitable": true,
    "suitabilityScore": "number 0-100",
    "reasons": ["5-6 reasons why suitable/not suitable"],
    "adjustmentsNeeded": ["3-4 specific product adaptations for Iraq"],
    "certificationGaps": ["certifications needed to enter Iraq market"]
  },
  "marketAnalysis": {
    "totalMarketSizeUSD": "string",
    "addressableMarketUSD": "string",
    "growthRate": "string — % CAGR",
    "demandForecast": "string — trajectory",
    "seasonality": "string — peak/off-peak periods",
    "keyTrends": ["5-6 market trends affecting this product"],
    "marketMaturity": "Emerging|Growing|Maturing|Saturated"
  },
  "pricingStrategy": {
    "optimalRetailUSD": "string",
    "optimalRetailIQD": "string",
    "optimalWholesaleUSD": "string",
    "cfr": "string — cost freight insurance to port",
    "customsDuty": "string — rate and HS code",
    "totalLandedCost": "string — multiplier from FOB",
    "distributorMargin": "string — %",
    "retailerMargin": "string — %",
    "pricingModel": "string — penetration/skimming/value",
    "justification": "string",
    "competitorPriceComparison": "string"
  },
  "distributionPlan": {
    "primaryChannels": ["prioritized list of channels"],
    "channelDetails": [
      { "channel": "string", "priority": "Primary|Secondary", "reach": "string", "margin": "string", "notes": "string" }
    ],
    "targetCities": [
      { "city": "string", "region": "string", "priority": "1st|2nd|3rd", "demandLevel": "High|Medium|Low", "competition": "High|Medium|Low" }
    ],
    "distributorProfile": "string",
    "wholesaleMarkets": ["key wholesale hubs in Iraq"],
    "logisticsRoute": "string",
    "timeline": "string"
  },
  "competitorLandscape": {
    "mainCompetitors": [
      { "brand": "string", "origin": "string", "priceRange": "string", "marketShare": "string", "strength": "Dominant|Strong|Medium|Weak" }
    ],
    "yourAdvantages": ["5-6 competitive advantages"],
    "achievableMarketShare1yr": "string — realistic %",
    "achievableMarketShare3yr": "string",
    "positioningStrategy": "string"
  },
  "importCompliance": {
    "allowedToImport": true,
    "requiredCertifications": ["list all certifications"],
    "labelingRequirements": ["Arabic labeling, nutritional, expiry etc."],
    "portOfEntry": ["Umm Qasr|Erbil Airport|Trebil"],
    "customsClearanceDays": "string",
    "shelfLifeMinimum": "string",
    "regulatoryBody": "string",
    "commonIssues": ["typical customs/compliance problems"]
  },
  "financialProjections": {
    "year1RevenueUSD": "string",
    "year2RevenueUSD": "string",
    "year3RevenueUSD": "string",
    "year1Units": "string",
    "year3Units": "string",
    "breakEvenMonths": "string",
    "initialInvestmentUSD": "string",
    "grossMargin": "string — %",
    "netMargin": "string — %",
    "roi12months": "string — %",
    "roi36months": "string — %",
    "cashFlowNote": "string",
    "paymentTerms": "string — LC, TT, etc.",
    "assumptions": ["key assumptions in the model"]
  },
  "implementationRoadmap": [
    {
      "phase": "string — e.g. Phase 1: Market Preparation",
      "duration": "string — e.g. Month 1-3",
      "activities": ["4-5 specific activities"],
      "milestone": "string — what success looks like",
      "budget": "string — approximate cost",
      "critical": true
    }
  ],
  "riskMatrix": [
    {
      "risk": "string",
      "category": "Regulatory|Market|Financial|Operational|Political",
      "probability": "High|Medium|Low",
      "impact": "High|Medium|Low",
      "mitigation": "string",
      "contingency": "string"
    }
  ],
  "quickWins": [
    { "action": "string", "timeline": "string", "cost": "string", "expectedResult": "string" }
  ],
  "successFactors": ["6-7 critical success factors"],
  "recommendation": "string — detailed final recommendation"
}`;

const CATEGORIES = [
  "Food & Beverages","FMCG / Consumer Goods","Healthcare & Pharmaceuticals",
  "Construction Materials","Electronics & Technology","Clothing & Textiles",
  "Agricultural Products","Cosmetics & Personal Care","Industrial Equipment",
  "Household Products","Children & Baby Products","Automotive Parts","Other",
];

export default function FeasibilityStudy() {
  const [form, setForm] = useState({
    company:"", product:"", category:"", origin:"",
    targetPrice:"", annualCapacity:"", budget:"", timeline:"6 months", description:"",
  });
  const { result, loading, error, analyze, tokensUsed, responseTime, jsonValid, modelUsed } = useClaudeAnalysis({ systemPrompt: SYSTEM_PROMPT, agentId: "feasibility-v2", modelTier: "flash", reasoningEffort: "high" });

  const run = () => {
    if (!form.product.trim()) return;
    analyze(`Generate a full Iraq Market Feasibility Study for:
Company: ${form.company || "Confidential"}
Product: ${form.product}
Category: ${form.category || "Not specified"}
Country of Origin: ${form.origin || "Not specified"}
Target Export Price (FOB): ${form.targetPrice || "Not specified"}
Annual Production Capacity: ${form.annualCapacity || "Not specified"}
Entry Budget: ${form.budget || "Not specified"}
Desired Timeline: ${form.timeline}
Product Description: ${form.description || "Not provided"}

Be specific to Iraq market 2025-2026. Include real prices in USD and IQD, realistic financial projections, actual regulatory requirements, competitor brand names, and specific Iraqi distribution channels and cities.`);
  };

  const d = result;
  const inp = "w-full px-3 py-2.5 rounded-lg text-sm";
  const IS = { background: "hsl(216 45% 12%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" };
  const vc = d?.executiveSummary?.verdict?.includes("Highly") ? "hsl(158 64% 55%)" : d?.executiveSummary?.verdict?.includes("Not") ? "hsl(0 72% 68%)" : d?.executiveSummary?.verdict?.includes("Conditional") ? "hsl(38 95% 60%)" : "hsl(158 64% 55%)";
  const probColor = (v: string) => v === "High" ? "hsl(0 72% 68%)" : v === "Medium" ? "hsl(38 95% 60%)" : "hsl(158 64% 55%)";

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <FileBarChart2 className="h-6 w-6" style={{ color: "hsl(38 95% 52%)" }} />
        <div>
          <h1 className="text-xl font-bold font-display" style={{ color: "hsl(210 40% 92%)" }}>Iraq Market Feasibility Study</h1>
          <p className="text-sm" style={{ color: "hsl(215 25% 55%)" }}>Full business case · compliance · financials · roadmap · risk matrix</p>
        </div>
      </div>

      <div className="rounded-2xl p-6 space-y-4" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "hsl(215 25% 45%)" }}>Company Name</label>
            <input value={form.company} onChange={e => setForm(f => ({...f, company:e.target.value}))} placeholder="Your company name" className={inp} style={IS}/>
          </div>
          <div className="lg:col-span-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "hsl(215 25% 45%)" }}>Product Name *</label>
            <input value={form.product} onChange={e => setForm(f => ({...f, product:e.target.value}))} placeholder="e.g. Organic Honey 500g, Steel Pipes, Baby Formula..." className={inp} style={IS}/>
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "hsl(215 25% 45%)" }}>Category</label>
            <select value={form.category} onChange={e => setForm(f => ({...f, category:e.target.value}))} className={inp} style={IS}>
              <option value="">Select...</option>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "hsl(215 25% 45%)" }}>Country of Origin</label>
            <input value={form.origin} onChange={e => setForm(f => ({...f, origin:e.target.value}))} placeholder="e.g. Turkey, Iran, Italy..." className={inp} style={IS}/>
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "hsl(215 25% 45%)" }}>Target Export Price (FOB)</label>
            <input value={form.targetPrice} onChange={e => setForm(f => ({...f, targetPrice:e.target.value}))} placeholder="e.g. $3.50/unit..." className={inp} style={IS}/>
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "hsl(215 25% 45%)" }}>Annual Production Capacity</label>
            <input value={form.annualCapacity} onChange={e => setForm(f => ({...f, annualCapacity:e.target.value}))} placeholder="e.g. 1,000,000 units/year" className={inp} style={IS}/>
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "hsl(215 25% 45%)" }}>Entry Budget</label>
            <input value={form.budget} onChange={e => setForm(f => ({...f, budget:e.target.value}))} placeholder="e.g. $100,000..." className={inp} style={IS}/>
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "hsl(215 25% 45%)" }}>Timeline</label>
            <select value={form.timeline} onChange={e => setForm(f => ({...f, timeline:e.target.value}))} className={inp} style={IS}>
              {["3 months","6 months","12 months","18 months","24 months"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "hsl(215 25% 45%)" }}>Product Description / USP</label>
            <textarea value={form.description} onChange={e => setForm(f => ({...f, description:e.target.value}))} rows={2} placeholder="Certifications, shelf life, special features, target consumer..." className={`${inp} resize-none`} style={IS}/>
          </div>
        </div>
        <button onClick={run} disabled={loading || !form.product.trim()}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold disabled:opacity-50"
          style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
          {loading ? <><RefreshCw className="h-4 w-4 animate-spin"/>Generating feasibility study...</> : <><FileBarChart2 className="h-4 w-4"/>Generate Full Feasibility Study</>}
        </button>
      </div>

      {error && <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: "hsl(0 72% 51%/0.08)", border: "1px solid hsl(0 72% 51%/0.3)" }}>
        <AlertTriangle className="h-4 w-4 shrink-0" style={{ color: "hsl(0 72% 68%)" }}/><p className="text-sm" style={{ color: "hsl(0 72% 68%)" }}>{error}</p></div>}
      {loading && <div className="rounded-xl p-10 text-center" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <RefreshCw className="h-10 w-10 mx-auto mb-4 animate-spin" style={{ color: "hsl(38 95% 52%)" }}/>
        <p className="font-semibold" style={{ color: "hsl(210 40% 82%)" }}>Building your Iraq market feasibility study...</p>
        <p className="text-xs mt-1" style={{ color: "hsl(215 25% 50%)" }}>Market sizing · pricing · compliance · financials · roadmap · risks</p>
      </div>}
      {!loading && !d && !error && <div className="rounded-xl p-14 text-center" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <FileBarChart2 className="h-14 w-14 mx-auto mb-4 opacity-15" style={{ color: "hsl(38 95% 52%)" }}/>
        <p className="font-semibold" style={{ color: "hsl(215 25% 55%)" }}>Complete the form above to generate a full feasibility study</p>
        <p className="text-xs mt-2" style={{ color: "hsl(215 25% 40%)" }}>Market · pricing · compliance · distribution · financials · roadmap · risk matrix</p>
      </div>}

      {d && !loading && (
        <div className="space-y-5">
          {/* Verdict */}
          <div className="rounded-2xl p-6 flex items-start gap-6 flex-wrap" style={{ background: "hsl(var(--card))", border: `2px solid ${vc}40` }}>
            <div className="text-center shrink-0">
              <p className="text-6xl font-black" style={{ color: vc }}>{d.executiveSummary?.score ?? "—"}</p>
              <p className="text-[10px] mt-1 font-bold uppercase" style={{ color: "hsl(215 25% 45%)" }}>Score /100</p>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="text-lg font-black" style={{ color: vc }}>{d.executiveSummary?.verdict}</span>
              </div>
              <p className="text-sm mb-3" style={{ color: "hsl(210 40% 80%)" }}>{d.executiveSummary?.summary}</p>
              {d.executiveSummary?.whyIraqNow && <p className="text-xs italic" style={{ color: "hsl(38 95% 55%)" }}><span style={{ color: "hsl(215 25% 40%)" }}>Why Iraq now: </span>{d.executiveSummary.whyIraqNow}</p>}
              {d.executiveSummary?.dealBreakers?.length > 0 && (
                <div className="mt-3 p-3 rounded-lg" style={{ background: "hsl(0 72% 51%/0.08)", border: "1px solid hsl(0 72% 51%/0.25)" }}>
                  <p className="text-[10px] font-bold uppercase mb-1" style={{ color: "hsl(0 72% 68%)" }}>⚠ Deal Breakers</p>
                  {d.executiveSummary.dealBreakers.map((b: string, i: number) => <p key={i} className="text-xs" style={{ color: "hsl(0 72% 75%)" }}>• {b}</p>)}
                </div>
              )}
            </div>
            {d.executiveSummary?.keyFindings?.length > 0 && (
              <div className="shrink-0 min-w-48">
                <p className="text-[10px] font-bold uppercase mb-2" style={{ color: "hsl(215 25% 45%)" }}>Key Findings</p>
                {d.executiveSummary.keyFindings.map((f: string, i: number) => (
                  <p key={i} className="text-xs flex items-start gap-1.5 mb-1">
                    <CheckCircle2 className="h-3 w-3 shrink-0 mt-0.5" style={{ color: vc }}/><span style={{ color: "hsl(210 40% 78%)" }}>{f}</span>
                  </p>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Market Analysis */}
            {d.marketAnalysis && (
              <Section title="Market Analysis" icon={TrendingUp}>
                <Row label="Total Market Size" value={d.marketAnalysis.totalMarketSizeUSD} highlight/>
                <Row label="Addressable Market" value={d.marketAnalysis.addressableMarketUSD}/>
                <Row label="Growth Rate (CAGR)" value={d.marketAnalysis.growthRate} highlight/>
                <Row label="Market Maturity" value={d.marketAnalysis.marketMaturity}/>
                <Row label="Demand Forecast" value={d.marketAnalysis.demandForecast}/>
                <Row label="Seasonality" value={d.marketAnalysis.seasonality}/>
                {d.marketAnalysis.keyTrends?.length > 0 && (
                  <div className="mt-3">
                    <p className="text-[10px] font-bold uppercase mb-2" style={{ color: "hsl(217 91% 70%)" }}>Key Trends</p>
                    {d.marketAnalysis.keyTrends.map((t: string, i: number) => (
                      <p key={i} className="text-xs flex items-start gap-1.5 mb-1"><Zap className="h-3 w-3 shrink-0 mt-0.5" style={{ color: "hsl(217 91% 70%)" }}/><span style={{ color: "hsl(210 40% 78%)" }}>{t}</span></p>
                    ))}
                  </div>
                )}
              </Section>
            )}
            {/* Pricing */}
            {d.pricingStrategy && (
              <Section title="Pricing Strategy & Landed Cost" icon={DollarSign} accent="hsl(38 95% 52%)">
                <Row label="Optimal Retail Price (USD)" value={d.pricingStrategy.optimalRetailUSD} highlight/>
                <Row label="Optimal Retail (IQD)" value={d.pricingStrategy.optimalRetailIQD}/>
                <Row label="Wholesale Price (USD)" value={d.pricingStrategy.optimalWholesaleUSD}/>
                <Row label="CFR to Iraq" value={d.pricingStrategy.cfr}/>
                <Row label="Customs Duty" value={d.pricingStrategy.customsDuty}/>
                <Row label="Total Landed Cost" value={d.pricingStrategy.totalLandedCost} highlight/>
                <Row label="Distributor Margin" value={d.pricingStrategy.distributorMargin}/>
                <Row label="Retailer Margin" value={d.pricingStrategy.retailerMargin}/>
                {d.pricingStrategy.justification && (
                  <div className="mt-3 p-3 rounded-lg" style={{ background: "hsl(38 95% 52%/0.06)", border: "1px solid hsl(38 95% 52%/0.2)" }}>
                    <p className="text-xs" style={{ color: "hsl(215 25% 60%)" }}>{d.pricingStrategy.justification}</p>
                  </div>
                )}
              </Section>
            )}
          </div>

          {/* Import Compliance */}
          {d.importCompliance && (
            <Section title="Import Compliance & Regulations" icon={Shield} accent="hsl(38 95% 52%)">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {d.importCompliance.requiredCertifications?.length > 0 && <>
                    <p className="text-[10px] font-bold uppercase mb-2" style={{ color: "hsl(0 72% 68%)" }}>Required Certifications</p>
                    {d.importCompliance.requiredCertifications.map((c: string, i: number) => (
                      <p key={i} className="text-xs flex items-start gap-1.5 mb-1"><Shield className="h-3 w-3 shrink-0 mt-0.5" style={{ color: "hsl(38 95% 60%)" }}/><span style={{ color: "hsl(210 40% 78%)" }}>{c}</span></p>
                    ))}
                  </>}
                  {d.importCompliance.labelingRequirements?.length > 0 && (
                    <div className="mt-3">
                      <p className="text-[10px] font-bold uppercase mb-2" style={{ color: "hsl(217 91% 70%)" }}>Labeling Requirements</p>
                      {d.importCompliance.labelingRequirements.map((l: string, i: number) => (
                        <p key={i} className="text-xs flex items-start gap-1.5 mb-1"><FileText className="h-3 w-3 shrink-0 mt-0.5" style={{ color: "hsl(217 91% 70%)" }}/><span style={{ color: "hsl(210 40% 78%)" }}>{l}</span></p>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <Row label="Regulatory Body" value={d.importCompliance.regulatoryBody}/>
                  <Row label="Port of Entry" value={d.importCompliance.portOfEntry?.join(", ")}/>
                  <Row label="Customs Clearance" value={d.importCompliance.customsClearanceDays}/>
                  <Row label="Min Shelf Life" value={d.importCompliance.shelfLifeMinimum}/>
                  {d.importCompliance.commonIssues?.length > 0 && (
                    <div className="mt-3">
                      <p className="text-[10px] font-bold uppercase mb-2" style={{ color: "hsl(0 72% 68%)" }}>Common Issues</p>
                      {d.importCompliance.commonIssues.map((c: string, i: number) => (
                        <p key={i} className="text-xs flex items-start gap-1.5 mb-1"><AlertTriangle className="h-3 w-3 shrink-0 mt-0.5" style={{ color: "hsl(0 72% 68%)" }}/><span style={{ color: "hsl(215 25% 60%)" }}>{c}</span></p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Section>
          )}

          {/* Distribution */}
          {d.distributionPlan && (
            <Section title="Distribution Plan" icon={Truck} accent="hsl(217 91% 70%)">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 space-y-2">
                  {d.distributionPlan.channelDetails?.map((c: any, i: number) => {
                    const pc = c.priority === "Primary" ? "hsl(38 95% 60%)" : "hsl(217 91% 70%)";
                    return (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "hsl(216 45% 12%)" }}>
                        <Badge v={c.priority ?? "Secondary"} c={pc}/>
                        <div className="flex-1">
                          <span className="text-xs font-semibold" style={{ color: "hsl(210 40% 88%)" }}>{c.channel}</span>
                          <div className="flex gap-3 mt-0.5 text-[10px]" style={{ color: "hsl(215 25% 50%)" }}>
                            <span>{c.reach}</span><span style={{ color: "hsl(38 95% 55%)" }}>Margin: {c.margin}</span>
                          </div>
                          {c.notes && <p className="text-[10px] mt-0.5" style={{ color: "hsl(215 25% 45%)" }}>{c.notes}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="space-y-3">
                  {d.distributionPlan.targetCities?.length > 0 && (
                    <div className="rounded-xl p-4" style={{ background: "hsl(216 45% 12%)" }}>
                      <p className="text-[10px] font-bold uppercase mb-2" style={{ color: "hsl(215 25% 45%)" }}>Priority Cities</p>
                      {d.distributionPlan.targetCities.map((c: any, i: number) => (
                        <div key={i} className="flex items-center gap-2 mb-1">
                          <MapPin className="h-3 w-3 shrink-0" style={{ color: i === 0 ? "hsl(38 95% 60%)" : "hsl(217 91% 70%)" }}/>
                          <span className="text-xs" style={{ color: "hsl(210 40% 82%)" }}>{c.city}</span>
                          <span className="text-[9px] ml-auto" style={{ color: "hsl(215 25% 45%)" }}>{c.priority}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {d.distributionPlan.wholesaleMarkets?.length > 0 && (
                    <div className="rounded-xl p-4" style={{ background: "hsl(216 45% 12%)" }}>
                      <p className="text-[10px] font-bold uppercase mb-2" style={{ color: "hsl(215 25% 45%)" }}>Key Wholesale Hubs</p>
                      {d.distributionPlan.wholesaleMarkets.map((m: string, i: number) => (
                        <p key={i} className="text-xs mb-0.5" style={{ color: "hsl(210 40% 75%)" }}>• {m}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Section>
          )}

          {/* Financial Projections */}
          {d.financialProjections && (
            <Section title="Financial Projections" icon={DollarSign} accent="hsl(38 95% 52%)">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {[
                  { l: "Year 1 Revenue", v: d.financialProjections.year1RevenueUSD, c: "hsl(38 95% 60%)" },
                  { l: "Year 2 Revenue", v: d.financialProjections.year2RevenueUSD, c: "hsl(38 95% 60%)" },
                  { l: "Year 3 Revenue", v: d.financialProjections.year3RevenueUSD, c: "hsl(38 95% 60%)" },
                  { l: "Break-even",     v: d.financialProjections.breakEvenMonths, c: "hsl(158 64% 55%)" },
                  { l: "Investment",     v: d.financialProjections.initialInvestmentUSD, c: "hsl(0 72% 68%)" },
                  { l: "Gross Margin",   v: d.financialProjections.grossMargin, c: "hsl(217 91% 70%)" },
                  { l: "ROI @ 12mo",     v: d.financialProjections.roi12months, c: "hsl(158 64% 55%)" },
                  { l: "ROI @ 36mo",     v: d.financialProjections.roi36months, c: "hsl(158 64% 55%)" },
                ].filter(m => m.v).map((m, i) => (
                  <div key={i} className="rounded-xl p-3 text-center" style={{ background: "hsl(216 45% 12%)" }}>
                    <p className="text-sm font-bold" style={{ color: m.c }}>{m.v}</p>
                    <p className="text-[9px] mt-0.5" style={{ color: "hsl(215 25% 45%)" }}>{m.l}</p>
                  </div>
                ))}
              </div>
              {d.financialProjections.paymentTerms && <p className="text-xs mb-1" style={{ color: "hsl(215 25% 55%)" }}><span style={{ color: "hsl(215 25% 40%)" }}>Payment terms in Iraq: </span>{d.financialProjections.paymentTerms}</p>}
              {d.financialProjections.assumptions?.length > 0 && (
                <div className="mt-3 p-3 rounded-lg" style={{ background: "hsl(216 45% 12%)" }}>
                  <p className="text-[10px] font-bold uppercase mb-2" style={{ color: "hsl(215 25% 45%)" }}>Assumptions</p>
                  {d.financialProjections.assumptions.map((a: string, i: number) => <p key={i} className="text-xs mb-0.5" style={{ color: "hsl(215 25% 55%)" }}>• {a}</p>)}
                </div>
              )}
            </Section>
          )}

          {/* Roadmap */}
          {d.implementationRoadmap?.length > 0 && (
            <Section title="Implementation Roadmap" icon={Zap} accent="hsl(38 95% 52%)">
              <div className="space-y-3">
                {d.implementationRoadmap.map((p: any, i: number) => (
                  <div key={i} className="rounded-xl p-4" style={{ background: "hsl(216 45% 12%)", border: p.critical ? "1px solid hsl(38 95% 52%/0.3)" : "1px solid hsl(var(--border))" }}>
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <div className="h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-black shrink-0" style={{ background: "hsl(38 95% 52%/0.2)", color: "hsl(38 95% 60%)" }}>{i + 1}</div>
                      <span className="text-sm font-bold" style={{ color: "hsl(210 40% 92%)" }}>{p.phase}</span>
                      <Badge v={p.duration} c="hsl(217 91% 70%)"/>
                      {p.budget && <span className="text-xs" style={{ color: "hsl(38 95% 55%)" }}>{p.budget}</span>}
                    </div>
                    <div className="ml-9 space-y-1 mb-2">
                      {p.activities?.map((a: string, j: number) => (
                        <p key={j} className="text-xs flex items-start gap-1.5"><span style={{ color: "hsl(38 95% 60%)" }}>→</span><span style={{ color: "hsl(210 40% 78%)" }}>{a}</span></p>
                      ))}
                    </div>
                    {p.milestone && <p className="ml-9 text-xs font-semibold" style={{ color: "hsl(158 64% 55%)" }}>✓ Milestone: {p.milestone}</p>}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Risk Matrix */}
          {d.riskMatrix?.length > 0 && (
            <Section title="Risk Matrix" icon={AlertTriangle} accent="hsl(0 72% 68%)">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead><tr style={{ background: "hsl(216 45% 11%)" }}>
                    {["Risk","Category","Probability","Impact","Mitigation","Contingency"].map(h => (
                      <th key={h} className="px-3 py-2.5 text-left font-semibold whitespace-nowrap" style={{ color: "hsl(215 25% 45%)" }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>{d.riskMatrix.map((r: any, i: number) => (
                    <tr key={i} style={{ borderTop: "1px solid hsl(var(--border))", background: i % 2 === 0 ? "transparent" : "hsl(216 45% 8%/0.5)" }}>
                      <td className="px-3 py-2.5 font-medium" style={{ color: "hsl(210 40% 85%)" }}>{r.risk}</td>
                      <td className="px-3 py-2.5"><Badge v={r.category ?? ""} c="hsl(217 91% 70%)"/></td>
                      <td className="px-3 py-2.5"><Badge v={r.probability ?? ""} c={probColor(r.probability ?? "")}/></td>
                      <td className="px-3 py-2.5"><Badge v={r.impact ?? ""} c={probColor(r.impact ?? "")}/></td>
                      <td className="px-3 py-2.5 max-w-48" style={{ color: "hsl(215 25% 55%)" }}>{r.mitigation}</td>
                      <td className="px-3 py-2.5 max-w-48" style={{ color: "hsl(215 25% 50%)" }}>{r.contingency}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </Section>
          )}

          {/* Quick wins + success factors */}
          {(d.quickWins?.length > 0 || d.successFactors?.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {d.quickWins?.length > 0 && (
                <div className="rounded-xl p-5" style={{ background: "hsl(158 64% 40%/0.05)", border: "1px solid hsl(158 64% 40%/0.2)" }}>
                  <p className="text-xs font-bold uppercase mb-3" style={{ color: "hsl(158 64% 55%)" }}>⚡ Quick Wins</p>
                  {d.quickWins.map((q: any, i: number) => (
                    <div key={i} className="mb-3">
                      <p className="text-xs font-semibold" style={{ color: "hsl(210 40% 85%)" }}>{q.action}</p>
                      <div className="flex gap-3 text-[10px]" style={{ color: "hsl(215 25% 50%)" }}>
                        <span>{q.timeline}</span><span style={{ color: "hsl(38 95% 55%)" }}>{q.cost}</span>
                      </div>
                      {q.expectedResult && <p className="text-[11px]" style={{ color: "hsl(215 25% 55%)" }}>{q.expectedResult}</p>}
                    </div>
                  ))}
                </div>
              )}
              {d.successFactors?.length > 0 && (
                <div className="rounded-xl p-5" style={{ background: "hsl(38 95% 52%/0.05)", border: "1px solid hsl(38 95% 52%/0.2)" }}>
                  <p className="text-xs font-bold uppercase mb-3" style={{ color: "hsl(38 95% 60%)" }}>★ Critical Success Factors</p>
                  {d.successFactors.map((s: string, i: number) => (
                    <p key={i} className="text-xs flex items-start gap-1.5 mb-2"><Star className="h-3 w-3 shrink-0 mt-0.5" style={{ color: "hsl(38 95% 60%)" }}/><span style={{ color: "hsl(210 40% 80%)" }}>{s}</span></p>
                  ))}
                </div>
              )}
            </div>
          )}

          {d.recommendation && (
            <div className="rounded-xl p-5" style={{ background: "hsl(216 45% 11%)", border: "1px solid hsl(var(--border))" }}>
              <p className="text-xs font-bold uppercase mb-2" style={{ color: "hsl(215 25% 45%)" }}>Final Recommendation</p>
              <p className="text-sm" style={{ color: "hsl(210 40% 82%)" }}>{d.recommendation}</p>
            </div>
          )}

          {tokensUsed && <AIStatusBar tokensUsed={tokensUsed} responseTime={responseTime} jsonValid={jsonValid} modelUsed={modelUsed} />}
        </div>
      )}
    </div>
  );
}
