import { useState } from "react";
import {
  TrendingUp, MapPin, Package, Users, BarChart2, Target, ArrowRight,
  RefreshCw, Download, DollarSign, Shield, Zap, AlertTriangle,
  CheckCircle2, Globe, Building2, Truck, FileText, Star, Info
} from "lucide-react";
import { useClaudeAnalysis } from "@/hooks/useClaudeAnalysis";
import { LoadingState, EmptyState } from "@/components/analysis/OutputCard";
import { AIStatusBar } from "@/components/ai/AIStatusBar";
import { AIDisclaimer } from "@/components/ai/AIDisclaimer";

// ─── Helpers ───────────────────────────────────────────────────────────────────
const Badge = ({ v, c = "hsl(38 95% 60%)" }: { v: string; c?: string }) => (
  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
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
const Row = ({ label, value, highlight }: { label: string; value?: string; highlight?: boolean }) => (
  value ? (
    <div className="flex items-start justify-between gap-4 py-2" style={{ borderBottom: "1px solid hsl(var(--border)/0.5)" }}>
      <span className="text-xs shrink-0" style={{ color: "hsl(215 25% 50%)" }}>{label}</span>
      <span className="text-xs text-right font-semibold" style={{ color: highlight ? "hsl(38 95% 60%)" : "hsl(210 40% 85%)" }}>{value}</span>
    </div>
  ) : null
);

// ─── System Prompt ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a senior Iraq market entry consultant with 20+ years experience in Iraq, KRG, and MENA markets. You have deep knowledge of Iraqi customs, regulations, distribution networks, trade finance, and consumer behavior.

Respond ONLY with a valid JSON object. Be highly specific to Iraq — use real city names, real regulatory bodies, real distributor types, realistic prices in USD and IQD, and real-world trade conditions as of 2025-2026.

{
  "productCategory": "string",
  "productDescription": "string",
  "executiveSummary": {
    "verdict": "Strong GO|GO|Conditional GO|NO GO",
    "confidenceScore": "number 0-100",
    "summary": "string — 3-4 sentences",
    "whyNow": "string — why this is the right timing for Iraq entry"
  },
  "marketSizing": {
    "totalMarketUSD": "string — e.g. $180M",
    "addressableMarketUSD": "string",
    "captureableYear1USD": "string",
    "unitVolumePerYear": "string",
    "cagr5yr": "string — %",
    "marketMaturity": "Emerging|Growing|Maturing|Saturated",
    "methodology": "string — how you estimated this"
  },
  "demandProfile": {
    "level": "Very High|High|Medium|Low|Very Low",
    "score": "number 1-10",
    "description": "string",
    "seasonality": "string — when demand peaks/dips and why",
    "primaryDrivers": ["4-5 specific demand drivers in Iraq"],
    "demandBarriers": ["3-4 things suppressing demand"],
    "targetSegments": ["5-6 specific buyer profiles with income/location details"]
  },
  "pricing": {
    "recommendedRetailIQD": "string — IQD per unit",
    "recommendedRetailUSD": "string — USD per unit",
    "recommendedWholesaleUSD": "string",
    "cfr": "string — Cost + Freight + Insurance to Umm Qasr or Erbil",
    "distributorMargin": "string — %",
    "retailerMargin": "string — %",
    "vat": "string — Iraqi VAT applicable",
    "customsDutyRate": "string — % plus HS code if known",
    "totalLandedCostMultiplier": "string — e.g. 1.35x of FOB",
    "positioningAdvice": "string",
    "notes": "string"
  },
  "importRegulations": {
    "allowedToImport": true,
    "restrictions": ["any import restrictions or banned categories"],
    "requiredCertifications": ["Iraqi standards body certs, COSQC, MoH approvals etc."],
    "labelingRequirements": ["Arabic labeling, nutritional info, expiry etc."],
    "shelfLifeMinimum": "string — months remaining on arrival",
    "portOfEntry": ["Umm Qasr, Erbil Airport, or land borders"],
    "estimatedCustomsClearanceDays": "string",
    "commonComplianceIssues": ["3-4 common problems at Iraqi customs"],
    "regulatoryBody": "string — Ministry responsible",
    "cosqcRequired": true
  },
  "competition": [
    {
      "brand": "string",
      "company": "string — parent company",
      "countryOfOrigin": "string",
      "priceRangeUSD": "string",
      "marketShareEstimate": "string — %",
      "distributionStrength": "Dominant|Strong|Medium|Weak",
      "primaryMarkets": ["Baghdad|Erbil|Basra etc."],
      "mainDistributor": "string — if known",
      "weaknesses": ["2-3 exploitable weaknesses"],
      "yearsInIraq": "string"
    }
  ],
  "competitiveMatrix": {
    "priceLeader": "string brand",
    "qualityLeader": "string brand",
    "distributionLeader": "string brand",
    "marketShareLeader": "string brand",
    "yourPositioning": "string — where you fit in the matrix"
  },
  "marketGaps": [
    { "gap": "string", "size": "Large|Medium|Small", "timeToCapture": "string", "howToCapture": "string" }
  ],
  "swot": {
    "strengths": ["5-6 strengths of entering Iraq now"],
    "weaknesses": ["4-5 weaknesses/disadvantages"],
    "opportunities": ["5-6 specific market opportunities"],
    "threats": ["4-5 real threats to watch"]
  },
  "entryStrategy": {
    "recommended": "string — primary strategy name",
    "rationale": "string",
    "alternativeStrategy": "string",
    "steps": [
      { "step": "string", "owner": "string", "timeframe": "string", "cost": "string", "critical": true }
    ],
    "timeline": "string — total timeline",
    "investmentLevel": "Low (<$50K)|Medium ($50-200K)|High (>$200K)",
    "minViableInvestment": "string USD"
  },
  "distribution": {
    "primaryChannel": "string",
    "channels": [
      { "channel": "string", "coverage": "string", "margin": "string", "pros": "string", "cons": "string", "priority": "Primary|Secondary|Optional" }
    ],
    "distributorProfile": "string — detailed ideal distributor description",
    "topDistributorMarkets": ["Baghdad","Erbil","Basra","Sulaymaniyah"],
    "wholesaleMarkets": ["Jamila Baghdad","Bab Al-Agha Erbil","Al-Ashar Basra","Shorja"],
    "logisticsNotes": "string"
  },
  "cities": [
    {
      "city": "string",
      "region": "Federal Iraq|KRG|Disputed",
      "population": "string",
      "priority": "Primary|Secondary|Tertiary",
      "demandStrength": "Very High|High|Medium|Low",
      "competition": "Intense|Moderate|Low",
      "entryDifficulty": "Easy|Moderate|Hard",
      "notes": "string — what makes this city unique",
      "timeToEnter": "string"
    }
  ],
  "financials": {
    "year1RevenueUSD": "string",
    "year2RevenueUSD": "string",
    "year3RevenueUSD": "string",
    "breakEvenMonths": "string",
    "grossMarginEstimate": "string — %",
    "initialInvestment": "string USD",
    "cashFlowNotes": "string",
    "paymentTermsInIraq": "string — LC, TT, 30/60/90 days etc.",
    "currencyRiskNote": "string"
  },
  "riskMatrix": [
    {
      "risk": "string",
      "category": "Regulatory|Market|Financial|Operational|Political",
      "probability": "High|Medium|Low",
      "impact": "High|Medium|Low",
      "mitigation": "string — specific action to take",
      "residualRisk": "High|Medium|Low"
    }
  ],
  "quickWins": [
    { "action": "string", "timeline": "string", "cost": "string", "expectedResult": "string", "difficulty": "Easy|Medium|Hard" }
  ],
  "redFlags": ["any critical issues that would make entry inadvisable or very difficult"],
  "successFactors": ["5-6 things that will determine success or failure"],
  "exportDocumentation": {
    "required": ["list of export documents needed"],
    "iraqiSideRequired": ["documents Iraqi importer needs"],
    "tradeLicenseType": "string",
    "notes": "string"
  }
}`;

const CATEGORIES = [
  "Food & Beverages","FMCG / Consumer Goods","Healthcare & Pharmaceuticals",
  "Construction Materials","Electronics & Technology","Clothing & Textiles",
  "Agricultural Products","Cosmetics & Personal Care","Industrial Equipment",
  "Household Products","Children & Baby Products","Automotive Parts",
  "Medical Devices","Furniture & Decor","Chemicals & Raw Materials","Other",
];
const BIZ_TYPES = ["Manufacturer","Distributor","Brand Owner","Trader / Broker","Startup"];

export default function MarketEntry() {
  const [form, setForm] = useState({
    product: "", category: "", countryOfOrigin: "", description: "",
    targetPrice: "", businessType: "Manufacturer", annualCapacity: "", budget: "",
  });
  const { result, loading, error, analyze, tokensUsed, responseTime, jsonValid, modelUsed } = useClaudeAnalysis({
    systemPrompt: SYSTEM_PROMPT, agentId: "market-entry-v2", modelTier: "flash", reasoningEffort: "medium",
  });

  const run = () => {
    if (!form.product.trim()) return;
    analyze(`Perform a full Iraq Market Entry Analysis for:

Product: ${form.product}
Category: ${form.category || "General"}
Country of Origin: ${form.countryOfOrigin || "Not specified"}
Description: ${form.description || "Not provided"}
Target FOB / Export Price: ${form.targetPrice || "Not specified"}
Business Type: ${form.businessType}
Annual Production Capacity: ${form.annualCapacity || "Not specified"}
Available Entry Budget: ${form.budget || "Not specified"}

Cover all sections thoroughly. Use realistic 2025-2026 Iraq market data. Be specific about cities, prices in both USD and IQD, distributor types, customs duties, certification requirements (COSQC, MoH, etc.), and real competitive brands active in Iraq.`);
  };

  const d = result;
  const inp = "w-full px-3 py-2.5 rounded-lg text-sm";
  const IS = { background: "hsl(216 45% 12%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" };

  const verdictColor = (v?: string) => {
    if (!v) return "hsl(215 25% 55%)";
    if (v.includes("Strong GO")) return "hsl(158 64% 55%)";
    if (v.includes("Conditional")) return "hsl(38 95% 60%)";
    if (v.includes("NO GO")) return "hsl(0 72% 68%)";
    return "hsl(158 64% 55%)";
  };
  const vc = verdictColor(d?.executiveSummary?.verdict);
  const probColor = (v: string) => v === "High" ? "hsl(0 72% 68%)" : v === "Medium" ? "hsl(38 95% 60%)" : "hsl(158 64% 55%)";

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <TrendingUp className="h-6 w-6" style={{ color: "hsl(38 95% 52%)" }} />
        <div>
          <h1 className="text-xl font-bold font-display" style={{ color: "hsl(210 40% 92%)" }}>Iraq Market Entry Analysis</h1>
          <p className="text-sm" style={{ color: "hsl(215 25% 55%)" }}>Deep-dive feasibility · pricing · compliance · strategy · distribution</p>
        </div>
      </div>

      {/* Input form */}
      <div className="rounded-2xl p-6 space-y-4" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "hsl(215 25% 45%)" }}>Product & Company Details</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "hsl(215 25% 45%)" }}>Product Name / Brand *</label>
            <input value={form.product} onChange={e => setForm(f => ({ ...f, product: e.target.value }))}
              placeholder="e.g. Oat Milk 1L Tetra Pak, Industrial Water Pump, Baby Formula..."
              className={inp} style={IS} />
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "hsl(215 25% 45%)" }}>Category</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={inp} style={IS}>
              <option value="">Select category...</option>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "hsl(215 25% 45%)" }}>Country of Origin</label>
            <input value={form.countryOfOrigin} onChange={e => setForm(f => ({ ...f, countryOfOrigin: e.target.value }))}
              placeholder="e.g. Turkey, UAE, Netherlands..." className={inp} style={IS} />
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "hsl(215 25% 45%)" }}>Target Export Price (FOB)</label>
            <input value={form.targetPrice} onChange={e => setForm(f => ({ ...f, targetPrice: e.target.value }))}
              placeholder="e.g. $2.50/unit, $800/MT..." className={inp} style={IS} />
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "hsl(215 25% 45%)" }}>Business Type</label>
            <select value={form.businessType} onChange={e => setForm(f => ({ ...f, businessType: e.target.value }))} className={inp} style={IS}>
              {BIZ_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "hsl(215 25% 45%)" }}>Annual Production Capacity</label>
            <input value={form.annualCapacity} onChange={e => setForm(f => ({ ...f, annualCapacity: e.target.value }))}
              placeholder="e.g. 500,000 units/year, 2,000 MT..." className={inp} style={IS} />
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "hsl(215 25% 45%)" }}>Entry Budget</label>
            <input value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}
              placeholder="e.g. $50,000, $200,000..." className={inp} style={IS} />
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "hsl(215 25% 45%)" }}>Product Description / USP</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Describe your product, its key features, target use case, certifications, unique selling points..."
              rows={2} className={`${inp} resize-none`} style={IS} />
          </div>
        </div>
        <button onClick={run} disabled={loading || !form.product.trim()}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold disabled:opacity-50"
          style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
          {loading ? <><RefreshCw className="h-4 w-4 animate-spin" /> Analyzing Iraq market...</> : <><TrendingUp className="h-4 w-4" /> Run Full Market Entry Analysis</>}
        </button>
      </div>

      {error && <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: "hsl(0 72% 51%/0.08)", border: "1px solid hsl(0 72% 51%/0.3)" }}>
        <AlertTriangle className="h-4 w-4 shrink-0" style={{ color: "hsl(0 72% 68%)" }} />
        <p className="text-sm" style={{ color: "hsl(0 72% 68%)" }}>{error}</p>
      </div>}
      {loading && <div className="rounded-xl p-10 text-center" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <RefreshCw className="h-10 w-10 mx-auto mb-4 animate-spin" style={{ color: "hsl(38 95% 52%)" }} />
        <p className="font-semibold" style={{ color: "hsl(210 40% 82%)" }}>Analyzing Iraq market entry potential...</p>
        <p className="text-xs mt-1" style={{ color: "hsl(215 25% 50%)" }}>Pricing · regulations · competition · distribution · risk matrix</p>
      </div>}

      {!loading && !result && !error && (
        <div className="rounded-xl p-14 text-center" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
          <TrendingUp className="h-14 w-14 mx-auto mb-4 opacity-15" style={{ color: "hsl(38 95% 52%)" }} />
          <p className="font-semibold" style={{ color: "hsl(215 25% 55%)" }}>Enter your product details above to get a full Iraq market entry report</p>
          <p className="text-xs mt-2" style={{ color: "hsl(215 25% 40%)" }}>Covers demand · pricing · regulations · competitors · cities · distribution · financials · risks</p>
        </div>
      )}

      {d && !loading && (
        <>
          <AIDisclaimer compact />
        <div className="space-y-5">

          {/* Verdict banner */}
          <div className="rounded-2xl p-6 flex items-start gap-6 flex-wrap" style={{ background: "hsl(var(--card))", border: `2px solid ${vc}40` }}>
            <div className="text-center shrink-0">
              <p className="text-5xl font-black" style={{ color: vc }}>{d.executiveSummary?.confidenceScore ?? d.executiveSummary?.score ?? "—"}</p>
              <p className="text-[10px] mt-1 font-bold uppercase tracking-wider" style={{ color: "hsl(215 25% 50%)" }}>Confidence</p>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="text-xl font-black" style={{ color: vc }}>{d.executiveSummary?.verdict}</span>
                <Badge v={d.productCategory || ""} c="hsl(217 91% 70%)" />
              </div>
              <p className="text-sm" style={{ color: "hsl(210 40% 80%)" }}>{d.executiveSummary?.summary}</p>
              {d.executiveSummary?.whyNow && (
                <p className="text-xs mt-2 italic" style={{ color: "hsl(38 95% 55%)" }}>
                  <span style={{ color: "hsl(215 25% 45%)" }}>Why now: </span>{d.executiveSummary.whyNow}
                </p>
              )}
            </div>
            {d.marketSizing && (
              <div className="grid grid-cols-2 gap-3 shrink-0">
                {[
                  { l: "Total Market", v: d.marketSizing.totalMarketUSD, c: "hsl(38 95% 60%)" },
                  { l: "Addressable", v: d.marketSizing.addressableMarketUSD, c: "hsl(158 64% 55%)" },
                  { l: "5-yr CAGR", v: d.marketSizing.cagr5yr, c: "hsl(217 91% 70%)" },
                  { l: "Maturity", v: d.marketSizing.marketMaturity, c: "hsl(280 80% 70%)" },
                ].map((m, i) => m.v && (
                  <div key={i} className="rounded-lg p-2.5 text-center" style={{ background: "hsl(216 45% 11%)" }}>
                    <p className="text-sm font-bold" style={{ color: m.c }}>{m.v}</p>
                    <p className="text-[9px]" style={{ color: "hsl(215 25% 45%)" }}>{m.l}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Red Flags */}
          {d.redFlags?.length > 0 && (
            <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: "hsl(0 72% 51%/0.06)", border: "1px solid hsl(0 72% 51%/0.3)" }}>
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "hsl(0 72% 68%)" }} />
              <div>
                <p className="text-xs font-bold uppercase mb-2" style={{ color: "hsl(0 72% 68%)" }}>⚠ Critical Issues to Address</p>
                <div className="space-y-1">
                  {d.redFlags.map((f: string, i: number) => (
                    <p key={i} className="text-xs" style={{ color: "hsl(0 72% 75%)" }}>• {f}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Quick Wins */}
          {d.quickWins?.length > 0 && (
            <div className="rounded-xl p-4" style={{ background: "hsl(158 64% 40%/0.05)", border: "1px solid hsl(158 64% 40%/0.25)" }}>
              <p className="text-xs font-bold uppercase mb-3" style={{ color: "hsl(158 64% 55%)" }}>⚡ Quick Wins — First 90 Days</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {d.quickWins.map((q: any, i: number) => {
                  const dc = q.difficulty === "Easy" ? "hsl(158 64% 55%)" : q.difficulty === "Medium" ? "hsl(38 95% 60%)" : "hsl(0 72% 68%)";
                  return (
                    <div key={i} className="flex items-start gap-2.5 p-3 rounded-lg" style={{ background: "hsl(158 64% 40%/0.08)" }}>
                      <div className="h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0" style={{ background: "hsl(158 64% 55%/0.2)", color: "hsl(158 64% 55%)" }}>{i + 1}</div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold" style={{ color: "hsl(210 40% 88%)" }}>{q.action}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-[10px]" style={{ color: "hsl(215 25% 50%)" }}>{q.timeline}</span>
                          <span className="text-[10px]" style={{ color: "hsl(38 95% 55%)" }}>{q.cost}</span>
                          <Badge v={q.difficulty} c={dc} />
                        </div>
                        {q.expectedResult && <p className="text-[11px] mt-0.5" style={{ color: "hsl(215 25% 55%)" }}>{q.expectedResult}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Demand Profile */}
            {d.demandProfile && (
              <Section title="Demand Profile" icon={TrendingUp}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-4xl font-black" style={{ color: d.demandProfile.level?.includes("High") ? "hsl(158 64% 55%)" : d.demandProfile.level?.includes("Low") ? "hsl(0 72% 68%)" : "hsl(38 95% 60%)" }}>
                    {d.demandProfile.score ?? "—"}
                  </div>
                  <div>
                    <Badge v={d.demandProfile.level ?? ""} c={d.demandProfile.level?.includes("High") ? "hsl(158 64% 55%)" : "hsl(38 95% 60%)"} />
                    <p className="text-xs mt-1" style={{ color: "hsl(215 25% 55%)" }}>{d.demandProfile.description}</p>
                  </div>
                </div>
                {d.demandProfile.seasonality && <p className="text-xs mb-3 italic" style={{ color: "hsl(215 25% 55%)" }}><span style={{ color: "hsl(215 25% 40%)" }}>Seasonality:</span> {d.demandProfile.seasonality}</p>}
                {d.demandProfile.primaryDrivers?.length > 0 && (
                  <div className="mb-3">
                    <p className="text-[10px] font-bold uppercase mb-1.5" style={{ color: "hsl(158 64% 55%)" }}>Demand Drivers</p>
                    <div className="space-y-1">{d.demandProfile.primaryDrivers.map((dr: string, i: number) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs"><CheckCircle2 className="h-3 w-3 shrink-0 mt-0.5" style={{ color: "hsl(158 64% 55%)" }} /><span style={{ color: "hsl(210 40% 80%)" }}>{dr}</span></div>
                    ))}</div>
                  </div>
                )}
                {d.demandProfile.demandBarriers?.length > 0 && (
                  <div className="mb-3">
                    <p className="text-[10px] font-bold uppercase mb-1.5" style={{ color: "hsl(0 72% 68%)" }}>Barriers</p>
                    <div className="space-y-1">{d.demandProfile.demandBarriers.map((b: string, i: number) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs"><AlertTriangle className="h-3 w-3 shrink-0 mt-0.5" style={{ color: "hsl(0 72% 68%)" }} /><span style={{ color: "hsl(210 40% 80%)" }}>{b}</span></div>
                    ))}</div>
                  </div>
                )}
                {d.demandProfile.targetSegments?.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold uppercase mb-1.5" style={{ color: "hsl(217 91% 70%)" }}>Target Segments</p>
                    <div className="flex flex-wrap gap-1">{d.demandProfile.targetSegments.map((s: string, i: number) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "hsl(217 91% 53%/0.1)", color: "hsl(217 91% 70%)" }}>{s}</span>
                    ))}</div>
                  </div>
                )}
              </Section>
            )}

            {/* Pricing & Landed Cost */}
            {d.pricing && (
              <Section title="Pricing Intelligence & Landed Cost" icon={DollarSign} accent="hsl(38 95% 52%)">
                <Row label="Recommended Retail (USD)" value={d.pricing.recommendedRetailUSD} highlight />
                <Row label="Recommended Retail (IQD)" value={d.pricing.recommendedRetailIQD} />
                <Row label="Wholesale Price (USD)" value={d.pricing.recommendedWholesaleUSD} />
                <Row label="CFR to Iraq Port" value={d.pricing.cfr} />
                <Row label="Customs Duty Rate" value={d.pricing.customsDutyRate} />
                <Row label="VAT" value={d.pricing.vat} />
                <Row label="Total Landed Cost Multiplier" value={d.pricing.totalLandedCostMultiplier} highlight />
                <Row label="Distributor Margin" value={d.pricing.distributorMargin} />
                <Row label="Retailer Margin" value={d.pricing.retailerMargin} />
                {d.pricing.positioningAdvice && (
                  <div className="mt-3 p-3 rounded-lg" style={{ background: "hsl(38 95% 52%/0.06)", border: "1px solid hsl(38 95% 52%/0.2)" }}>
                    <p className="text-xs" style={{ color: "hsl(215 25% 60%)" }}>{d.pricing.positioningAdvice}</p>
                  </div>
                )}
              </Section>
            )}
          </div>

          {/* Import Regulations */}
          {d.importRegulations && (
            <Section title={`Import Regulations & Compliance — Iraq`} icon={Shield} accent="hsl(38 95% 52%)">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  {d.importRegulations.requiredCertifications?.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold uppercase mb-2" style={{ color: "hsl(0 72% 68%)" }}>Required Certifications</p>
                      <div className="space-y-1">{d.importRegulations.requiredCertifications.map((c: string, i: number) => (
                        <div key={i} className="flex items-start gap-1.5 text-xs"><Shield className="h-3 w-3 shrink-0 mt-0.5" style={{ color: "hsl(38 95% 60%)" }} /><span style={{ color: "hsl(210 40% 80%)" }}>{c}</span></div>
                      ))}</div>
                    </div>
                  )}
                  {d.importRegulations.labelingRequirements?.length > 0 && (
                    <div className="mt-3">
                      <p className="text-[10px] font-bold uppercase mb-2" style={{ color: "hsl(217 91% 70%)" }}>Labeling Requirements</p>
                      <div className="space-y-1">{d.importRegulations.labelingRequirements.map((l: string, i: number) => (
                        <div key={i} className="flex items-start gap-1.5 text-xs"><FileText className="h-3 w-3 shrink-0 mt-0.5" style={{ color: "hsl(217 91% 70%)" }} /><span style={{ color: "hsl(210 40% 80%)" }}>{l}</span></div>
                      ))}</div>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Row label="Regulatory Body" value={d.importRegulations.regulatoryBody} />
                  <Row label="Port of Entry" value={d.importRegulations.portOfEntry?.join(", ")} />
                  <Row label="Customs Clearance" value={d.importRegulations.estimatedCustomsClearanceDays} />
                  <Row label="Min Shelf Life on Arrival" value={d.importRegulations.shelfLifeMinimum} />
                  <Row label="COSQC Required" value={d.importRegulations.cosqcRequired ? "Yes — mandatory" : "Not required"} />
                  {d.importRegulations.commonComplianceIssues?.length > 0 && (
                    <div className="mt-3">
                      <p className="text-[10px] font-bold uppercase mb-2" style={{ color: "hsl(0 72% 68%)" }}>Common Compliance Issues</p>
                      {d.importRegulations.commonComplianceIssues.map((c: string, i: number) => (
                        <p key={i} className="text-xs flex items-start gap-1.5 mb-1"><AlertTriangle className="h-3 w-3 shrink-0 mt-0.5" style={{ color: "hsl(0 72% 68%)" }} /><span style={{ color: "hsl(215 25% 60%)" }}>{c}</span></p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Section>
          )}

          {/* Competition */}
          {d.competition?.length > 0 && (
            <Section title="Competitive Landscape" icon={BarChart2} accent="hsl(0 72% 68%)">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead><tr style={{ background: "hsl(216 45% 11%)" }}>
                    {["Brand","Origin","Price (USD)","Market Share","Distribution","Markets","In Iraq Since","Weaknesses"].map(h => (
                      <th key={h} className="px-3 py-2.5 text-left font-semibold whitespace-nowrap" style={{ color: "hsl(215 25% 45%)" }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>{d.competition.map((c: any, i: number) => {
                    const dc = c.distributionStrength === "Dominant" ? "hsl(0 72% 68%)" : c.distributionStrength === "Strong" ? "hsl(38 95% 60%)" : c.distributionStrength === "Medium" ? "hsl(217 91% 70%)" : "hsl(158 64% 55%)";
                    return (
                      <tr key={i} style={{ borderTop: "1px solid hsl(var(--border))", background: i % 2 === 0 ? "transparent" : "hsl(216 45% 8%/0.5)" }}>
                        <td className="px-3 py-2.5 font-semibold" style={{ color: "hsl(210 40% 88%)" }}>{c.brand}</td>
                        <td className="px-3 py-2.5" style={{ color: "hsl(215 25% 55%)" }}>{c.countryOfOrigin}</td>
                        <td className="px-3 py-2.5 font-semibold" style={{ color: "hsl(38 95% 60%)" }}>{c.priceRangeUSD}</td>
                        <td className="px-3 py-2.5" style={{ color: "hsl(215 25% 55%)" }}>{c.marketShareEstimate}</td>
                        <td className="px-3 py-2.5"><Badge v={c.distributionStrength ?? ""} c={dc} /></td>
                        <td className="px-3 py-2.5" style={{ color: "hsl(215 25% 55%)" }}>{c.primaryMarkets?.join(", ")}</td>
                        <td className="px-3 py-2.5" style={{ color: "hsl(215 25% 55%)" }}>{c.yearsInIraq}</td>
                        <td className="px-3 py-2.5 max-w-40">
                          {c.weaknesses?.map((w: string, j: number) => <p key={j} className="text-[10px]" style={{ color: "hsl(158 64% 55%)" }}>• {w}</p>)}
                        </td>
                      </tr>
                    );
                  })}</tbody>
                </table>
              </div>
              {d.competitiveMatrix && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-4">
                  {[
                    { l: "Price Leader", v: d.competitiveMatrix.priceLeader },
                    { l: "Quality Leader", v: d.competitiveMatrix.qualityLeader },
                    { l: "Distribution Leader", v: d.competitiveMatrix.distributionLeader },
                    { l: "Market Share Leader", v: d.competitiveMatrix.marketShareLeader },
                    { l: "Your Position", v: d.competitiveMatrix.yourPositioning },
                  ].map((m, i) => m.v && (
                    <div key={i} className="rounded-lg p-2.5 text-center" style={{ background: "hsl(216 45% 11%)" }}>
                      <p className="text-[9px] uppercase font-bold mb-1" style={{ color: "hsl(215 25% 45%)" }}>{m.l}</p>
                      <p className="text-xs font-semibold" style={{ color: i === 4 ? "hsl(38 95% 60%)" : "hsl(210 40% 85%)" }}>{m.v}</p>
                    </div>
                  ))}
                </div>
              )}
            </Section>
          )}

          {/* Market Gaps */}
          {d.marketGaps?.length > 0 && (
            <div className="rounded-xl p-5" style={{ background: "hsl(158 64% 40%/0.05)", border: "1px solid hsl(158 64% 40%/0.2)" }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "hsl(158 64% 55%)" }}>Market Gaps You Can Fill</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {d.marketGaps.map((g: any, i: number) => {
                  const sc = g.size === "Large" ? "hsl(158 64% 55%)" : g.size === "Medium" ? "hsl(38 95% 60%)" : "hsl(217 91% 70%)";
                  return (
                    <div key={i} className="rounded-lg p-3" style={{ background: "hsl(158 64% 40%/0.08)" }}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <Star className="h-3.5 w-3.5" style={{ color: sc }} />
                        <span className="text-xs font-semibold" style={{ color: "hsl(210 40% 88%)" }}>{g.gap}</span>
                        <Badge v={g.size} c={sc} />
                      </div>
                      <p className="text-[11px]" style={{ color: "hsl(215 25% 55%)" }}><span style={{ color: "hsl(215 25% 40%)" }}>Time to capture:</span> {g.timeToCapture}</p>
                      <p className="text-[11px]" style={{ color: "hsl(215 25% 55%)" }}><span style={{ color: "hsl(215 25% 40%)" }}>How:</span> {g.howToCapture}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SWOT */}
          {d.swot && (
            <Section title="SWOT Analysis" icon={Target}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { k: "strengths",     label: "Strengths",     c: "hsl(158 64% 55%)", bg: "hsl(158 64% 40%/0.06)" },
                  { k: "weaknesses",    label: "Weaknesses",    c: "hsl(0 72% 68%)",   bg: "hsl(0 72% 51%/0.06)"   },
                  { k: "opportunities", label: "Opportunities", c: "hsl(217 91% 70%)", bg: "hsl(217 91% 53%/0.06)" },
                  { k: "threats",       label: "Threats",       c: "hsl(38 95% 60%)",  bg: "hsl(38 95% 52%/0.06)"  },
                ].map(q => (
                  <div key={q.k} className="rounded-xl p-4" style={{ background: q.bg, border: `1px solid ${q.c}20` }}>
                    <p className="text-[11px] font-bold uppercase mb-3" style={{ color: q.c }}>{q.label}</p>
                    <div className="space-y-1.5">
                      {((d.swot as any)[q.k] || []).map((item: string, i: number) => (
                        <p key={i} className="text-xs flex items-start gap-1.5"><span style={{ color: q.c }}>•</span><span style={{ color: "hsl(210 40% 80%)" }}>{item}</span></p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Entry Strategy */}
          {d.entryStrategy && (
            <Section title="Market Entry Strategy" icon={Zap} accent="hsl(38 95% 52%)">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="font-bold text-base" style={{ color: "hsl(38 95% 60%)" }}>{d.entryStrategy.recommended}</span>
                <Badge v={d.entryStrategy.investmentLevel ?? ""} c="hsl(38 95% 60%)" />
                {d.entryStrategy.timeline && <span className="text-xs" style={{ color: "hsl(215 25% 55%)" }}>{d.entryStrategy.timeline}</span>}
              </div>
              {d.entryStrategy.rationale && <p className="text-sm mb-4" style={{ color: "hsl(215 25% 60%)" }}>{d.entryStrategy.rationale}</p>}
              {d.entryStrategy.steps?.length > 0 && (
                <div className="space-y-2">
                  {d.entryStrategy.steps.map((s: any, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "hsl(216 45% 12%)" }}>
                      <div className="h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-black shrink-0" style={{ background: "hsl(38 95% 52%/0.2)", color: "hsl(38 95% 60%)" }}>{i + 1}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold" style={{ color: "hsl(210 40% 88%)" }}>{s.step || s}</span>
                          {s.critical && <Badge v="Critical" c="hsl(0 72% 68%)" />}
                        </div>
                        {s.timeframe && <div className="flex gap-3 mt-1 text-[10px]" style={{ color: "hsl(215 25% 50%)" }}>
                          <span>{s.timeframe}</span>
                          {s.cost && <span style={{ color: "hsl(38 95% 55%)" }}>{s.cost}</span>}
                          {s.owner && <span>{s.owner}</span>}
                        </div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {d.entryStrategy.minViableInvestment && <p className="text-xs mt-3" style={{ color: "hsl(215 25% 50%)" }}>Minimum viable investment: <span style={{ color: "hsl(38 95% 60%)" }}>{d.entryStrategy.minViableInvestment}</span></p>}
            </Section>
          )}

          {/* Distribution */}
          {d.distribution && (
            <Section title="Distribution Strategy" icon={Truck} accent="hsl(217 91% 70%)">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2">
                  {d.distribution.channels?.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {d.distribution.channels.map((c: any, i: number) => {
                        const pc = c.priority === "Primary" ? "hsl(38 95% 60%)" : c.priority === "Secondary" ? "hsl(217 91% 70%)" : "hsl(215 25% 50%)";
                        return (
                          <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "hsl(216 45% 12%)" }}>
                            <Badge v={c.priority ?? "Secondary"} c={pc} />
                            <div className="flex-1">
                              <span className="text-xs font-semibold" style={{ color: "hsl(210 40% 88%)" }}>{c.channel}</span>
                              <div className="flex gap-3 mt-1 text-[10px]" style={{ color: "hsl(215 25% 50%)" }}>
                                <span>{c.coverage}</span>
                                <span style={{ color: "hsl(38 95% 55%)" }}>Margin: {c.margin}</span>
                              </div>
                              {(c.pros || c.cons) && (
                                <div className="flex gap-4 mt-1 text-[10px]">
                                  {c.pros && <span style={{ color: "hsl(158 64% 55%)" }}>✓ {c.pros}</span>}
                                  {c.cons && <span style={{ color: "hsl(0 72% 68%)" }}>✗ {c.cons}</span>}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {d.distribution.logisticsNotes && <p className="text-xs" style={{ color: "hsl(215 25% 55%)" }}><span style={{ color: "hsl(215 25% 40%)" }}>Logistics: </span>{d.distribution.logisticsNotes}</p>}
                </div>
                <div className="space-y-3">
                  {d.distribution.distributorProfile && (
                    <div className="rounded-xl p-4" style={{ background: "hsl(217 91% 53%/0.06)", border: "1px solid hsl(217 91% 53%/0.2)" }}>
                      <p className="text-[10px] font-bold uppercase mb-2" style={{ color: "hsl(217 91% 70%)" }}>Ideal Distributor Profile</p>
                      <p className="text-xs" style={{ color: "hsl(215 25% 60%)" }}>{d.distribution.distributorProfile}</p>
                    </div>
                  )}
                  {d.distribution.wholesaleMarkets?.length > 0 && (
                    <div className="rounded-xl p-4" style={{ background: "hsl(216 45% 12%)" }}>
                      <p className="text-[10px] font-bold uppercase mb-2" style={{ color: "hsl(215 25% 45%)" }}>Key Wholesale Markets</p>
                      {d.distribution.wholesaleMarkets.map((m: string, i: number) => (
                        <p key={i} className="text-xs" style={{ color: "hsl(210 40% 75%)" }}>• {m}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Section>
          )}

          {/* Cities */}
          {d.cities?.length > 0 && (
            <Section title="Priority Cities" icon={MapPin} accent="hsl(158 64% 55%)">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {d.cities.map((c: any, i: number) => {
                  const pc = c.priority === "Primary" ? "hsl(38 95% 60%)" : c.priority === "Secondary" ? "hsl(217 91% 70%)" : "hsl(215 25% 55%)";
                  const dc = c.demandStrength?.includes("High") ? "hsl(158 64% 55%)" : c.demandStrength === "Medium" ? "hsl(38 95% 60%)" : "hsl(0 72% 68%)";
                  return (
                    <div key={i} className="rounded-xl p-4" style={{ background: "hsl(216 45% 12%)", border: `1px solid ${pc}30` }}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5" style={{ color: pc }} />
                          <span className="text-sm font-bold" style={{ color: "hsl(210 40% 92%)" }}>{c.city}</span>
                        </div>
                        <Badge v={c.priority ?? ""} c={pc} />
                      </div>
                      <p className="text-[10px] mb-2" style={{ color: "hsl(215 25% 50%)" }}>{c.region} · Pop. {c.population}</p>
                      <div className="flex gap-2 mb-2 flex-wrap">
                        {c.demandStrength && <Badge v={`Demand: ${c.demandStrength}`} c={dc} />}
                        {c.competition && <Badge v={`Comp: ${c.competition}`} c={c.competition === "Intense" ? "hsl(0 72% 68%)" : c.competition === "Moderate" ? "hsl(38 95% 60%)" : "hsl(158 64% 55%)"} />}
                      </div>
                      {c.notes && <p className="text-[10px]" style={{ color: "hsl(215 25% 55%)" }}>{c.notes}</p>}
                      {c.timeToEnter && <p className="text-[10px] mt-1" style={{ color: "hsl(215 25% 45%)" }}>Entry timeline: {c.timeToEnter}</p>}
                    </div>
                  );
                })}
              </div>
            </Section>
          )}

          {/* Financials */}
          {d.financials && (
            <Section title="Financial Projections" icon={DollarSign} accent="hsl(38 95% 52%)">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {[
                  { l: "Year 1 Revenue",   v: d.financials.year1RevenueUSD, c: "hsl(38 95% 60%)" },
                  { l: "Year 2 Revenue",   v: d.financials.year2RevenueUSD, c: "hsl(38 95% 60%)" },
                  { l: "Year 3 Revenue",   v: d.financials.year3RevenueUSD, c: "hsl(38 95% 60%)" },
                  { l: "Break-even",       v: d.financials.breakEvenMonths, c: "hsl(158 64% 55%)" },
                  { l: "Initial Investment", v: d.financials.initialInvestment, c: "hsl(0 72% 68%)" },
                  { l: "Gross Margin",     v: d.financials.grossMarginEstimate, c: "hsl(217 91% 70%)" },
                ].filter(m => m.v).map((m, i) => (
                  <div key={i} className="rounded-xl p-3 text-center" style={{ background: "hsl(216 45% 12%)" }}>
                    <p className="text-sm font-bold" style={{ color: m.c }}>{m.v}</p>
                    <p className="text-[9px] mt-0.5" style={{ color: "hsl(215 25% 45%)" }}>{m.l}</p>
                  </div>
                ))}
              </div>
              {d.financials.paymentTermsInIraq && <p className="text-xs mb-1" style={{ color: "hsl(215 25% 55%)" }}><span style={{ color: "hsl(215 25% 40%)" }}>Payment terms in Iraq:</span> {d.financials.paymentTermsInIraq}</p>}
              {d.financials.currencyRiskNote && <p className="text-xs" style={{ color: "hsl(215 25% 55%)" }}><span style={{ color: "hsl(215 25% 40%)" }}>Currency risk:</span> {d.financials.currencyRiskNote}</p>}
            </Section>
          )}

          {/* Risk Matrix */}
          {d.riskMatrix?.length > 0 && (
            <Section title="Risk Matrix" icon={AlertTriangle} accent="hsl(0 72% 68%)">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead><tr style={{ background: "hsl(216 45% 11%)" }}>
                    {["Risk","Category","Probability","Impact","Mitigation","Residual"].map(h => (
                      <th key={h} className="px-3 py-2.5 text-left font-semibold whitespace-nowrap" style={{ color: "hsl(215 25% 45%)" }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>{d.riskMatrix.map((r: any, i: number) => {
                    const pc = probColor(r.probability); const ic = probColor(r.impact);
                    return (
                      <tr key={i} style={{ borderTop: "1px solid hsl(var(--border))", background: i % 2 === 0 ? "transparent" : "hsl(216 45% 8%/0.5)" }}>
                        <td className="px-3 py-2.5 font-medium" style={{ color: "hsl(210 40% 85%)" }}>{r.risk}</td>
                        <td className="px-3 py-2.5"><Badge v={r.category ?? ""} c="hsl(217 91% 70%)" /></td>
                        <td className="px-3 py-2.5"><Badge v={r.probability ?? ""} c={pc} /></td>
                        <td className="px-3 py-2.5"><Badge v={r.impact ?? ""} c={ic} /></td>
                        <td className="px-3 py-2.5 max-w-56" style={{ color: "hsl(215 25% 55%)" }}>{r.mitigation}</td>
                        <td className="px-3 py-2.5"><Badge v={r.residualRisk ?? ""} c={probColor(r.residualRisk ?? "")} /></td>
                      </tr>
                    );
                  })}</tbody>
                </table>
              </div>
            </Section>
          )}

          {/* Success Factors */}
          {d.successFactors?.length > 0 && (
            <div className="rounded-xl p-5" style={{ background: "hsl(38 95% 52%/0.05)", border: "1px solid hsl(38 95% 52%/0.2)" }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "hsl(38 95% 60%)" }}>Critical Success Factors</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {d.successFactors.map((s: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <Star className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: "hsl(38 95% 60%)" }} />
                    <span style={{ color: "hsl(210 40% 80%)" }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tokensUsed && <AIStatusBar tokensUsed={tokensUsed} responseTime={responseTime} jsonValid={jsonValid} modelUsed={modelUsed} />}
        </div>
      )}
    </div>
  );
}
