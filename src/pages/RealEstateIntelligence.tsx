import { useState } from "react";
import {
  Building2, MapPin, BarChart2, DollarSign, TrendingUp, Target,
  RefreshCw, Download, CheckCircle2, AlertTriangle, Star, Layers,
  PieChart, Activity, Zap, Shield, FileText, ChevronRight,
  Hotel, ShoppingBag, Home, LayoutGrid, Briefcase, ArrowUpRight
} from "lucide-react";
import { useClaudeAnalysis } from "@/hooks/useClaudeAnalysis";
import { AIDisclaimer } from "@/components/ai/AIDisclaimer";

// ── Types ─────────────────────────────────────────────────────────────────────
type Scenario = "Hotel" | "Mall" | "Residential" | "Mixed-use" | "Office";
type Tab = "location" | "scenario" | "feasibility" | "validation" | "decision" | "sensitivity" | "report";

const SCENARIO_ICONS: Record<Scenario, any> = {
  Hotel: Hotel, Mall: ShoppingBag, Residential: Home, "Mixed-use": LayoutGrid, Office: Briefcase,
};

const TABS: { key: Tab; label: string; labelAr: string; icon: any }[] = [
  { key: "location",    label: "Location Intelligence", labelAr: "استخبارات الموقع",    icon: MapPin      },
  { key: "scenario",    label: "Scenario Generator",    labelAr: "مولّد السيناريوهات",   icon: Layers      },
  { key: "feasibility", label: "Feasibility Engine",    labelAr: "محرك الجدوى",          icon: PieChart    },
  { key: "validation",  label: "Multi-AI Validation",   labelAr: "التحقق المتعدد",       icon: Shield      },
  { key: "decision",    label: "Decision Engine",       labelAr: "محرك القرار",          icon: Target      },
  { key: "sensitivity", label: "Sensitivity Analysis",  labelAr: "تحليل الحساسية",       icon: Activity    },
  { key: "report",      label: "Final Report",          labelAr: "التقرير النهائي",       icon: FileText    },
];

// ── System prompts ────────────────────────────────────────────────────────────
const LOCATION_PROMPT = `You are a senior real estate intelligence analyst for MENA markets. Analyze this location and respond ONLY with valid JSON:
{
  "locationScore": "number 0-100",
  "demandAnalysis": { "score": "number", "summary": "string", "drivers": ["string"], "peakPeriods": "string" },
  "competitorMapping": [{ "name": "string", "type": "string", "distance": "string", "occupancy": "string", "pricePoint": "string" }],
  "priceBenchmarking": { "landCostPerSqm": "string", "constructionCostPerSqm": "string", "rentalYield": "string", "capitalValues": "string" },
  "infrastructure": { "accessibility": "string", "utilities": "string", "footTraffic": "string" },
  "zoning": { "status": "string", "approvalDifficulty": "Low|Medium|High", "notes": "string" },
  "recommendation": "string"
}`;

const FEASIBILITY_PROMPT = `You are a real estate financial analyst. Generate a comprehensive feasibility study. Respond ONLY with valid JSON:
{
  "projectSummary": { "totalArea": "string", "floors": "string", "units": "string", "landCost": "string", "constructionCost": "string", "totalInvestment": "string" },
  "revenueProjections": { "year1": "string", "year2": "string", "year3": "string", "year5": "string", "stabilizedRevenue": "string" },
  "costModeling": { "hardCosts": "string", "softCosts": "string", "landAcquisition": "string", "contingency": "string", "totalDevelopmentCost": "string" },
  "returns": { "roi": "string", "irr": "string", "npv": "string", "paybackPeriod": "string", "capRate": "string", "equityMultiple": "string" },
  "breakEven": { "occupancyNeeded": "string", "monthsToBreakEven": "string", "minimumRevenue": "string" },
  "fundingStructure": { "equityRequired": "string", "debtFacility": "string", "debtServiceCoverage": "string" },
  "verdict": "Highly Recommended|Recommended|Conditional|Not Recommended",
  "verdictReason": "string"
}`;

const SENSITIVITY_PROMPT = `You are a real estate risk analyst. Run sensitivity analysis. Respond ONLY with valid JSON:
{
  "baseCase": { "revenue": "string", "roi": "string", "irr": "string", "npv": "string" },
  "costIncrease10": { "revenue": "string", "roi": "string", "irr": "string", "npv": "string", "impact": "string" },
  "costIncrease20": { "revenue": "string", "roi": "string", "irr": "string", "npv": "string", "impact": "string" },
  "revenueDecrease10": { "revenue": "string", "roi": "string", "irr": "string", "npv": "string", "impact": "string" },
  "revenueDecrease20": { "revenue": "string", "roi": "string", "irr": "string", "npv": "string", "impact": "string" },
  "marketDownturn": { "revenue": "string", "roi": "string", "irr": "string", "npv": "string", "impact": "string" },
  "breakEvenSensitivity": "string",
  "mostSensitiveFactor": "string",
  "riskLevel": "Low|Medium|High|Critical",
  "mitigationStrategies": ["string"]
}`;

const DECISION_PROMPT = `You are a real estate investment decision advisor. Analyze all factors and provide final decision. Respond ONLY with valid JSON:
{
  "overallScore": "number 0-100",
  "confidenceLevel": "Very High|High|Medium|Low",
  "goNoGo": "GO|CONDITIONAL GO|NO GO",
  "reasoning": "string (2-3 sentences)",
  "keyStrengths": ["string"],
  "keyRisks": ["string"],
  "criticalSuccessFactors": ["string"],
  "recommendedScenario": "string",
  "nextSteps": [{ "step": "string", "timeline": "string", "owner": "string" }],
  "alternativeOptions": ["string"]
}`;

// ── Color helpers ─────────────────────────────────────────────────────────────
const scoreColor = (s: number) =>
  s >= 80 ? "hsl(158 64% 55%)" : s >= 60 ? "hsl(38 95% 60%)" : "hsl(0 72% 68%)";

const verdictColor: Record<string, { bg: string; text: string }> = {
  "Highly Recommended": { bg: "hsl(158 64% 40% / 0.15)", text: "hsl(158 64% 55%)" },
  "Recommended":        { bg: "hsl(38 95% 52% / 0.15)",  text: "hsl(38 95% 60%)"  },
  "Conditional":        { bg: "hsl(38 95% 52% / 0.15)",  text: "hsl(38 95% 60%)"  },
  "Not Recommended":    { bg: "hsl(0 72% 51% / 0.15)",   text: "hsl(0 72% 68%)"   },
  "GO":                 { bg: "hsl(158 64% 40% / 0.15)", text: "hsl(158 64% 55%)" },
  "CONDITIONAL GO":     { bg: "hsl(38 95% 52% / 0.15)",  text: "hsl(38 95% 60%)"  },
  "NO GO":              { bg: "hsl(0 72% 51% / 0.15)",   text: "hsl(0 72% 68%)"   },
};

// ── Sub-components ────────────────────────────────────────────────────────────
function DataRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: "hsl(var(--border))" }}>
      <span className="text-xs" style={{ color: "hsl(215 25% 55%)" }}>{label}</span>
      <span className="text-xs font-semibold" style={{ color: highlight ? "hsl(38 95% 60%)" : "hsl(210 40% 85%)" }}>{value}</span>
    </div>
  );
}

function Section({ title, color = "hsl(38 95% 60%)", children }: { title: string; color?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-5" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
      <h3 className="text-sm font-semibold mb-4" style={{ color }}>{title}</h3>
      {children}
    </div>
  );
}

function ErrorBanner({ msg }: { msg: string }) {
  return (
    <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: "hsl(0 72% 51% / 0.08)", border: "1px solid hsl(0 72% 51% / 0.3)" }}>
      <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "hsl(0 72% 68%)" }} />
      <div>
        <p className="text-sm font-medium" style={{ color: "hsl(0 72% 68%)" }}>Analysis Error</p>
        <p className="text-xs mt-1" style={{ color: "hsl(215 25% 55%)" }}>{msg}</p>
        {msg.toLowerCase().includes("credit") && (
          <a href="https://console.anthropic.com/" target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs mt-2 underline" style={{ color: "hsl(38 95% 60%)" }}>
            Go to Anthropic Console → Plans & Billing <ArrowUpRight className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
}

function LoadingState({ label }: { label: string }) {
  return (
    <div className="rounded-xl p-10 text-center" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
      <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-3" style={{ color: "hsl(38 95% 52%)" }} />
      <p className="font-medium" style={{ color: "hsl(210 40% 75%)" }}>{label}</p>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function RealEstateIntelligence() {
  const [activeTab, setActiveTab] = useState<Tab>("location");
  const [selectedScenario, setSelectedScenario] = useState<Scenario>("Mixed-use");

  // Input state
  const [locationInput, setLocationInput] = useState("");
  const [projectInput, setProjectInput] = useState({ location: "", size: "", budget: "", scenario: "Mixed-use" as Scenario });

  // AI hooks for each engine
  const locationAI    = useClaudeAnalysis({ systemPrompt: LOCATION_PROMPT,    agentId: "re-location",    modelTier: "flash-lite" });
  const feasibilityAI = useClaudeAnalysis({ systemPrompt: FEASIBILITY_PROMPT, agentId: "re-feasibility", modelTier: "flash", reasoningEffort: "medium" });
  const sensitivityAI = useClaudeAnalysis({ systemPrompt: SENSITIVITY_PROMPT, agentId: "re-sensitivity", modelTier: "flash" });
  const decisionAI    = useClaudeAnalysis({ systemPrompt: DECISION_PROMPT,    agentId: "re-decision",    modelTier: "flash", reasoningEffort: "medium" });

  const runLocation = () => {
    if (!locationInput.trim()) return;
    locationAI.analyze(`Analyze this real estate location for investment potential: ${locationInput}. Provide demand analysis, competitor mapping, and price benchmarking for Iraq/MENA market.`);
  };

  const runFeasibility = () => {
    const { location, size, budget, scenario } = projectInput;
    if (!location || !size) return;
    feasibilityAI.analyze(`Run a comprehensive real estate feasibility study for: Location: ${location}, Project Type: ${scenario}, Total Area: ${size} sqm, Budget: ${budget || "market rate"}, Market: Iraq/MENA. Provide full financial model with ROI/IRR.`);
  };

  const runSensitivity = () => {
    const { location, size, budget, scenario } = projectInput;
    if (feasibilityAI.result) {
          <AIDisclaimer compact />
      sensitivityAI.analyze(`Run sensitivity analysis on this real estate project: ${scenario} in ${location || "Iraq"}, ${size || "10,000"} sqm, budget ${budget || "market rate"}. Base case ROI ${feasibilityAI.result?.returns?.roi || "unknown"}. Test ±10%, ±20% cost and revenue scenarios plus market downturn.`);
    } else {
      sensitivityAI.analyze(`Run sensitivity analysis for a ${scenario} project in ${location || "Baghdad, Iraq"} with area ${size || "10,000"} sqm and budget ${budget || "market rate"}.`);
    }
  };

  const runDecision = () => {
    const hasData = locationAI.result || feasibilityAI.result;
    decisionAI.analyze(`Make a final investment decision for this real estate project:
Project: ${projectInput.scenario || selectedScenario} in ${projectInput.location || locationInput || "Baghdad, Iraq"}
Location Score: ${locationAI.result?.locationScore || "not analyzed"}
Feasibility ROI: ${feasibilityAI.result?.returns?.roi || "not analyzed"}
IRR: ${feasibilityAI.result?.returns?.irr || "not analyzed"}
Sensitivity Risk Level: ${sensitivityAI.result?.riskLevel || "not analyzed"}
Provide final GO/NO-GO recommendation with confidence level and next steps.`);
  };

  const lr = locationAI.result;
  const fr = feasibilityAI.result;
  const sr = sensitivityAI.result;
  const dr = decisionAI.result;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, hsl(216 52% 10%), hsl(216 52% 13%))", border: "1px solid hsl(38 95% 52% / 0.2)" }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 70% 30%, hsl(38 95% 52%), transparent 60%)" }} />
        <div className="relative flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="h-5 w-5" style={{ color: "hsl(38 95% 52%)" }} />
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "hsl(38 95% 52% / 0.15)", color: "hsl(38 95% 60%)" }}>PREMIUM MODULE</span>
            </div>
            <h1 className="text-2xl font-bold font-display" style={{ color: "hsl(210 40% 94%)" }}>Real Estate Intelligence</h1>
            <p className="text-sm mt-1" style={{ color: "hsl(215 25% 60%)" }}>Portfolio strategy, transactions, property management, ESG, feasibility, and project controls</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {dr?.goNoGo && (
              <span className="px-3 py-1.5 rounded-lg text-sm font-bold" style={{ background: verdictColor[dr.goNoGo]?.bg, color: verdictColor[dr.goNoGo]?.text }}>
                {dr.goNoGo}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {[
          ["Portfolio Strategy & Capital Planning","Hold/sell decisions, sector mix, debt/equity options, capital timing"],
          ["Transaction Support","Buy/sell advisory, underwriting, due diligence lists, data rooms"],
          ["Property Management Consulting","Service standards, vendor governance, CMMS, maintenance KPIs"],
          ["Lease, ESG & Project Controls","Lease optimization, retro-commissioning, feasibility, handover to ops"],
        ].map(([title, desc]) => (
          <div key={title} className="rounded-xl p-4" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <p className="text-sm font-semibold mb-1" style={{ color: "hsl(210 40% 90%)" }}>{title}</p>
            <p className="text-xs leading-relaxed" style={{ color: "hsl(215 25% 55%)" }}>{desc}</p>
          </div>
        ))}
      </div>

      {/* Tab Nav */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all"
            style={{
              background: activeTab === tab.key ? "hsl(38 95% 52% / 0.15)" : "hsl(var(--card))",
              color: activeTab === tab.key ? "hsl(38 95% 60%)" : "hsl(215 25% 55%)",
              border: `1px solid ${activeTab === tab.key ? "hsl(38 95% 52% / 0.35)" : "hsl(var(--border))"}`,
            }}>
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══ TAB: LOCATION INTELLIGENCE ═══ */}
      {activeTab === "location" && (
        <div className="space-y-4">
          <div className="rounded-xl p-5" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <h2 className="text-sm font-semibold mb-3" style={{ color: "hsl(210 40% 92%)" }}>Location Analysis Input</h2>
            <div className="flex gap-3">
              <input value={locationInput} onChange={e => setLocationInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && runLocation()}
                placeholder="Enter location — e.g. Karrada district Baghdad, Erbil city center, Basra corniche..."
                className="flex-1 px-4 py-3 rounded-lg text-sm"
                style={{ background: "hsl(216 45% 12%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }} />
              <button onClick={runLocation} disabled={locationAI.loading || !locationInput.trim()}
                className="px-6 py-3 rounded-lg text-sm font-semibold disabled:opacity-50 inline-flex items-center gap-2"
                style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
                {locationAI.loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
                {locationAI.loading ? "Analyzing..." : "Analyze Location"}
              </button>
            </div>
            <div className="flex gap-2 mt-3 flex-wrap">
              {["Karrada, Baghdad", "Erbil City Center", "Sulaymaniyah Downtown", "Basra Corniche", "Najaf Old City", "Mosul Left Bank"].map(loc => (
                <button key={loc} onClick={() => setLocationInput(loc)}
                  className="text-xs px-3 py-1.5 rounded-full"
                  style={{ background: "hsl(216 45% 14%)", color: "hsl(215 25% 60%)", border: "1px solid hsl(var(--border))" }}>
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {locationAI.error && <ErrorBanner msg={locationAI.error} />}
          {locationAI.loading && <LoadingState label="Analyzing location — demand, competitors, pricing..." />}

          {lr && !locationAI.loading && (
            <div className="space-y-4">
              {/* Score Banner */}
              <div className="rounded-xl p-5 flex items-center gap-6 flex-wrap" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
                <div className="text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: "hsl(215 25% 45%)" }}>Location Score</p>
                  <p className="text-4xl font-bold" style={{ color: scoreColor(Number(lr.locationScore)) }}>{lr.locationScore}</p>
                  <p className="text-xs mt-0.5" style={{ color: "hsl(215 25% 45%)" }}>/100</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm" style={{ color: "hsl(210 40% 80%)" }}>{lr.recommendation}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Demand Analysis */}
                {lr.demandAnalysis && (
                  <Section title="Demand Analysis" color="hsl(38 95% 60%)">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-2xl font-bold" style={{ color: scoreColor(Number(lr.demandAnalysis.score)) }}>{lr.demandAnalysis.score}/100</div>
                      <p className="text-xs" style={{ color: "hsl(210 40% 75%)" }}>{lr.demandAnalysis.summary}</p>
                    </div>
                    <p className="text-xs mb-2 font-semibold" style={{ color: "hsl(215 25% 50%)" }}>Demand Drivers</p>
                    <div className="space-y-1">
                      {lr.demandAnalysis.drivers?.map((d: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <CheckCircle2 className="h-3 w-3 shrink-0" style={{ color: "hsl(38 95% 60%)" }} />
                          <span style={{ color: "hsl(210 40% 75%)" }}>{d}</span>
                        </div>
                      ))}
                    </div>
                    {lr.demandAnalysis.peakPeriods && <DataRow label="Peak Periods" value={lr.demandAnalysis.peakPeriods} />}
                  </Section>
                )}

                {/* Price Benchmarking */}
                {lr.priceBenchmarking && (
                  <Section title="Price Benchmarking" color="hsl(158 64% 55%)">
                    <DataRow label="Land Cost / sqm" value={lr.priceBenchmarking.landCostPerSqm} highlight />
                    <DataRow label="Construction / sqm" value={lr.priceBenchmarking.constructionCostPerSqm} />
                    <DataRow label="Rental Yield" value={lr.priceBenchmarking.rentalYield} highlight />
                    <DataRow label="Capital Values" value={lr.priceBenchmarking.capitalValues} />
                  </Section>
                )}
              </div>

              {/* Competitor Mapping */}
              {lr.competitorMapping?.length > 0 && (
                <Section title="Competitor Mapping" color="hsl(217 91% 70%)">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr style={{ background: "hsl(216 45% 12%)" }}>
                          {["Property", "Type", "Distance", "Occupancy", "Price Point"].map(h => (
                            <th key={h} className="px-3 py-2 text-left font-semibold" style={{ color: "hsl(215 25% 45%)" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {lr.competitorMapping.map((c: any, i: number) => (
                          <tr key={i} style={{ borderTop: "1px solid hsl(var(--border))" }}>
                            <td className="px-3 py-2 font-medium" style={{ color: "hsl(210 40% 85%)" }}>{c.name}</td>
                            <td className="px-3 py-2" style={{ color: "hsl(215 25% 60%)" }}>{c.type}</td>
                            <td className="px-3 py-2" style={{ color: "hsl(215 25% 60%)" }}>{c.distance}</td>
                            <td className="px-3 py-2" style={{ color: "hsl(38 95% 60%)" }}>{c.occupancy}</td>
                            <td className="px-3 py-2" style={{ color: "hsl(158 64% 55%)" }}>{c.pricePoint}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Section>
              )}
            </div>
          )}

          {!lr && !locationAI.loading && !locationAI.error && (
            <div className="rounded-xl p-10 text-center" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
              <MapPin className="h-12 w-12 mx-auto mb-4 opacity-20" style={{ color: "hsl(38 95% 52%)" }} />
              <p className="font-medium" style={{ color: "hsl(215 25% 50%)" }}>Enter a location to start demand & competitor analysis</p>
            </div>
          )}
        </div>
      )}

      {/* ═══ TAB: SCENARIO GENERATOR ═══ */}
      {activeTab === "scenario" && (
        <div className="space-y-4">
          <div className="rounded-xl p-5" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <h2 className="text-sm font-semibold mb-4" style={{ color: "hsl(210 40% 92%)" }}>Project Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "hsl(215 25% 45%)" }}>Location</label>
                <input value={projectInput.location} onChange={e => setProjectInput(p => ({ ...p, location: e.target.value }))}
                  placeholder="e.g. Karrada, Baghdad"
                  className="w-full px-3 py-2.5 rounded-lg text-sm"
                  style={{ background: "hsl(216 45% 12%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }} />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "hsl(215 25% 45%)" }}>Total Area (sqm)</label>
                <input value={projectInput.size} onChange={e => setProjectInput(p => ({ ...p, size: e.target.value }))}
                  placeholder="e.g. 12,000"
                  className="w-full px-3 py-2.5 rounded-lg text-sm"
                  style={{ background: "hsl(216 45% 12%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }} />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "hsl(215 25% 45%)" }}>Investment Budget (USD)</label>
                <input value={projectInput.budget} onChange={e => setProjectInput(p => ({ ...p, budget: e.target.value }))}
                  placeholder="e.g. $5,000,000"
                  className="w-full px-3 py-2.5 rounded-lg text-sm"
                  style={{ background: "hsl(216 45% 12%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }} />
              </div>
            </div>

            <p className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: "hsl(215 25% 45%)" }}>Select Development Scenario</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {(["Hotel", "Mall", "Residential", "Mixed-use", "Office"] as Scenario[]).map(s => {
                const Icon = SCENARIO_ICONS[s];
                const active = selectedScenario === s;
                return (
                  <button key={s} onClick={() => { setSelectedScenario(s); setProjectInput(p => ({ ...p, scenario: s })); }}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all"
                    style={{
                      background: active ? "hsl(38 95% 52% / 0.15)" : "hsl(216 45% 12%)",
                      border: `1px solid ${active ? "hsl(38 95% 52% / 0.4)" : "hsl(var(--border))"}`,
                    }}>
                    <Icon className="h-6 w-6" style={{ color: active ? "hsl(38 95% 60%)" : "hsl(215 25% 55%)" }} />
                    <span className="text-xs font-semibold" style={{ color: active ? "hsl(38 95% 60%)" : "hsl(215 25% 55%)" }}>{s}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {(["Hotel", "Mall", "Residential", "Mixed-use", "Office"] as Scenario[]).map(s => {
              const Icon = SCENARIO_ICONS[s];
              const SCENARIO_DATA: Record<Scenario, { yield: string; capRate: string; risk: string; payback: string; color: string }> = {
                Hotel:       { yield: "8–12%", capRate: "7–9%",  risk: "High",   payback: "8–12 yrs", color: "hsl(38 95% 60%)"  },
                Mall:        { yield: "9–14%", capRate: "8–10%", risk: "High",   payback: "7–10 yrs", color: "hsl(217 91% 70%)" },
                Residential: { yield: "5–8%",  capRate: "5–7%",  risk: "Low",    payback: "12–18 yrs",color: "hsl(158 64% 55%)" },
                "Mixed-use": { yield: "10–15%",capRate: "8–11%", risk: "Medium", payback: "6–9 yrs",  color: "hsl(38 95% 60%)"  },
                Office:      { yield: "7–11%", capRate: "6–8%",  risk: "Medium", payback: "9–13 yrs", color: "hsl(217 91% 70%)" },
              };
              const d = SCENARIO_DATA[s];
              return (
                <div key={s} className="rounded-xl p-4" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="h-4 w-4" style={{ color: d.color }} />
                    <span className="text-xs font-bold" style={{ color: d.color }}>{s}</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between"><span style={{ color: "hsl(215 25% 50%)" }}>Yield</span><span className="font-semibold" style={{ color: d.color }}>{d.yield}</span></div>
                    <div className="flex justify-between"><span style={{ color: "hsl(215 25% 50%)" }}>Cap Rate</span><span style={{ color: "hsl(210 40% 80%)" }}>{d.capRate}</span></div>
                    <div className="flex justify-between"><span style={{ color: "hsl(215 25% 50%)" }}>Risk</span><span style={{ color: "hsl(210 40% 80%)" }}>{d.risk}</span></div>
                    <div className="flex justify-between"><span style={{ color: "hsl(215 25% 50%)" }}>Payback</span><span style={{ color: "hsl(210 40% 80%)" }}>{d.payback}</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ TAB: FEASIBILITY ENGINE ═══ */}
      {activeTab === "feasibility" && (
        <div className="space-y-4">
          <div className="rounded-xl p-5" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold" style={{ color: "hsl(210 40% 92%)" }}>Financial Feasibility Engine</h2>
              <span className="text-xs px-2 py-1 rounded" style={{ background: "hsl(38 95% 52% / 0.1)", color: "hsl(38 95% 60%)" }}>
                {projectInput.scenario || selectedScenario} · {projectInput.location || "Location TBD"}
              </span>
            </div>
            <p className="text-xs mb-3" style={{ color: "hsl(215 25% 50%)" }}>
              Configure project in Scenario tab first, then run feasibility analysis.
            </p>
            <button onClick={runFeasibility} disabled={feasibilityAI.loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50"
              style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
              {feasibilityAI.loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <PieChart className="h-4 w-4" />}
              {feasibilityAI.loading ? "Running Feasibility..." : "Run Feasibility Analysis"}
            </button>
          </div>

          {feasibilityAI.error && <ErrorBanner msg={feasibilityAI.error} />}
          {feasibilityAI.loading && <LoadingState label="Building financial model — revenues, costs, ROI/IRR..." />}

          {fr && !feasibilityAI.loading && (
            <div className="space-y-4">
              {/* Verdict Banner */}
              {fr.verdict && (
                <div className="rounded-xl p-5 flex items-center gap-4" style={{ background: verdictColor[fr.verdict]?.bg, border: `1px solid ${verdictColor[fr.verdict]?.text}44` }}>
                  <div className="text-3xl font-bold" style={{ color: verdictColor[fr.verdict]?.text }}>{fr.verdict}</div>
                  <p className="text-sm" style={{ color: "hsl(210 40% 80%)" }}>{fr.verdictReason}</p>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {fr.returns && (
                  <Section title="Investment Returns" color="hsl(158 64% 55%)">
                    <DataRow label="ROI"           value={fr.returns.roi}           highlight />
                    <DataRow label="IRR"           value={fr.returns.irr}           highlight />
                    <DataRow label="NPV"           value={fr.returns.npv}           />
                    <DataRow label="Payback Period" value={fr.returns.paybackPeriod} />
                    <DataRow label="Cap Rate"      value={fr.returns.capRate}       />
                    <DataRow label="Equity Multiple" value={fr.returns.equityMultiple} />
                  </Section>
                )}
                {fr.revenueProjections && (
                  <Section title="Revenue Projections" color="hsl(38 95% 60%)">
                    <DataRow label="Year 1"  value={fr.revenueProjections.year1} highlight />
                    <DataRow label="Year 2"  value={fr.revenueProjections.year2} />
                    <DataRow label="Year 3"  value={fr.revenueProjections.year3} />
                    <DataRow label="Year 5"  value={fr.revenueProjections.year5} />
                    <DataRow label="Stabilized" value={fr.revenueProjections.stabilizedRevenue} highlight />
                  </Section>
                )}
                {fr.costModeling && (
                  <Section title="Cost Modeling" color="hsl(217 91% 70%)">
                    <DataRow label="Hard Costs"    value={fr.costModeling.hardCosts}           />
                    <DataRow label="Soft Costs"    value={fr.costModeling.softCosts}           />
                    <DataRow label="Land"          value={fr.costModeling.landAcquisition}     />
                    <DataRow label="Contingency"   value={fr.costModeling.contingency}         />
                    <DataRow label="Total Dev Cost" value={fr.costModeling.totalDevelopmentCost} highlight />
                  </Section>
                )}
              </div>

              {fr.breakEven && (
                <Section title="Break-Even Analysis" color="hsl(0 72% 68%)">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 rounded-lg" style={{ background: "hsl(216 45% 12%)" }}>
                      <p className="text-[10px] mb-1" style={{ color: "hsl(215 25% 45%)" }}>Occupancy Needed</p>
                      <p className="text-xl font-bold" style={{ color: "hsl(38 95% 60%)" }}>{fr.breakEven.occupancyNeeded}</p>
                    </div>
                    <div className="text-center p-3 rounded-lg" style={{ background: "hsl(216 45% 12%)" }}>
                      <p className="text-[10px] mb-1" style={{ color: "hsl(215 25% 45%)" }}>Months to Break-Even</p>
                      <p className="text-xl font-bold" style={{ color: "hsl(38 95% 60%)" }}>{fr.breakEven.monthsToBreakEven}</p>
                    </div>
                    <div className="text-center p-3 rounded-lg" style={{ background: "hsl(216 45% 12%)" }}>
                      <p className="text-[10px] mb-1" style={{ color: "hsl(215 25% 45%)" }}>Min Revenue</p>
                      <p className="text-xl font-bold" style={{ color: "hsl(38 95% 60%)" }}>{fr.breakEven.minimumRevenue}</p>
                    </div>
                  </div>
                </Section>
              )}
            </div>
          )}

          {!fr && !feasibilityAI.loading && !feasibilityAI.error && (
            <div className="rounded-xl p-10 text-center" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
              <PieChart className="h-12 w-12 mx-auto mb-4 opacity-20" style={{ color: "hsl(38 95% 52%)" }} />
              <p className="font-medium" style={{ color: "hsl(215 25% 50%)" }}>Configure your project scenario, then run feasibility</p>
            </div>
          )}
        </div>
      )}

      {/* ═══ TAB: MULTI-AI VALIDATION ═══ */}
      {activeTab === "validation" && (
        <div className="space-y-4">
          <div className="rounded-xl p-5" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <h2 className="text-sm font-semibold mb-2" style={{ color: "hsl(210 40% 92%)" }}>Multi-AI Output Validation</h2>
            <p className="text-xs mb-4" style={{ color: "hsl(215 25% 55%)" }}>
              Compare outputs from Location Intelligence, Feasibility Engine, and Sensitivity Analysis. Normalized scoring applied across all three engines.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Location Intelligence", result: lr, score: lr?.locationScore, icon: MapPin, color: "hsl(38 95% 60%)", status: lr ? "Complete" : "Pending" },
                { label: "Feasibility Engine",    result: fr, score: fr ? (fr.verdict === "Highly Recommended" ? 90 : fr.verdict === "Recommended" ? 75 : fr.verdict === "Conditional" ? 55 : 30) : null, icon: PieChart, color: "hsl(158 64% 55%)", status: fr ? "Complete" : "Pending" },
                { label: "Sensitivity Analysis",  result: sr, score: sr ? (sr.riskLevel === "Low" ? 85 : sr.riskLevel === "Medium" ? 65 : sr.riskLevel === "High" ? 40 : 20) : null, icon: Activity, color: "hsl(217 91% 70%)", status: sr ? "Complete" : "Pending" },
              ].map((item, i) => (
                <div key={i} className="rounded-xl p-4" style={{ background: "hsl(216 45% 12%)", border: "1px solid hsl(var(--border))" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <item.icon className="h-4 w-4" style={{ color: item.color }} />
                    <span className="text-xs font-semibold" style={{ color: item.color }}>{item.label}</span>
                  </div>
                  <div className="text-center py-4">
                    {item.score !== null && item.score !== undefined ? (
                      <>
                        <p className="text-3xl font-bold" style={{ color: scoreColor(Number(item.score)) }}>{item.score}</p>
                        <p className="text-[10px] mt-0.5" style={{ color: "hsl(215 25% 45%)" }}>/100 score</p>
                      </>
                    ) : (
                      <p className="text-sm" style={{ color: "hsl(215 25% 40%)" }}>Run analysis first</p>
                    )}
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                      style={{ background: item.status === "Complete" ? "hsl(158 64% 40% / 0.15)" : "hsl(215 25% 20%)", color: item.status === "Complete" ? "hsl(158 64% 55%)" : "hsl(215 25% 45%)" }}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Composite Score */}
            {lr && fr && (
              <div className="mt-4 rounded-xl p-4" style={{ background: "hsl(38 95% 52% / 0.08)", border: "1px solid hsl(38 95% 52% / 0.25)" }}>
                <p className="text-xs font-semibold mb-2" style={{ color: "hsl(38 95% 60%)" }}>Composite Validation Score</p>
                <div className="flex items-center gap-4">
                  <p className="text-3xl font-bold" style={{ color: "hsl(38 95% 60%)" }}>
                    {Math.round(((Number(lr?.locationScore) || 0) + (fr?.verdict === "Highly Recommended" ? 90 : fr?.verdict === "Recommended" ? 75 : 55)) / 2)}
                  </p>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: "hsl(210 40% 85%)" }}>Normalized composite from {lr && fr ? "2" : "1"} engine{lr && fr ? "s" : ""}</p>
                    <p className="text-[11px]" style={{ color: "hsl(215 25% 50%)" }}>Run all 3 engines for full validation</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ TAB: DECISION ENGINE ═══ */}
      {activeTab === "decision" && (
        <div className="space-y-4">
          <div className="rounded-xl p-5" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <h2 className="text-sm font-semibold mb-2" style={{ color: "hsl(210 40% 92%)" }}>Investment Decision Engine</h2>
            <p className="text-xs mb-4" style={{ color: "hsl(215 25% 55%)" }}>
              Synthesizes all analysis layers to produce a final GO / NO-GO recommendation with confidence scoring.
            </p>
            <button onClick={runDecision} disabled={decisionAI.loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50"
              style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
              {decisionAI.loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Target className="h-4 w-4" />}
              {decisionAI.loading ? "Processing Decision..." : "Generate Decision"}
            </button>
          </div>

          {decisionAI.error && <ErrorBanner msg={decisionAI.error} />}
          {decisionAI.loading && <LoadingState label="Synthesizing all data points — generating final recommendation..." />}

          {dr && !decisionAI.loading && (
            <div className="space-y-4">
              <div className="rounded-xl p-6 flex items-center gap-6 flex-wrap" style={{ background: verdictColor[dr.goNoGo]?.bg, border: `1px solid ${verdictColor[dr.goNoGo]?.text}44` }}>
                <div>
                  <p className="text-4xl font-black" style={{ color: verdictColor[dr.goNoGo]?.text }}>{dr.goNoGo}</p>
                  <p className="text-xs mt-1" style={{ color: "hsl(215 25% 55%)" }}>Decision</p>
                </div>
                <div>
                  <p className="text-2xl font-bold" style={{ color: "hsl(38 95% 60%)" }}>{dr.overallScore}/100</p>
                  <p className="text-xs mt-0.5" style={{ color: "hsl(215 25% 55%)" }}>Score</p>
                </div>
                <div>
                  <p className="text-lg font-semibold" style={{ color: "hsl(158 64% 55%)" }}>{dr.confidenceLevel}</p>
                  <p className="text-xs mt-0.5" style={{ color: "hsl(215 25% 55%)" }}>Confidence</p>
                </div>
                <p className="flex-1 text-sm" style={{ color: "hsl(210 40% 78%)" }}>{dr.reasoning}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dr.keyStrengths?.length > 0 && (
                  <Section title="Key Strengths" color="hsl(158 64% 55%)">
                    {dr.keyStrengths.map((s: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-xs py-1">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{ color: "hsl(158 64% 55%)" }} />
                        <span style={{ color: "hsl(210 40% 78%)" }}>{s}</span>
                      </div>
                    ))}
                  </Section>
                )}
                {dr.keyRisks?.length > 0 && (
                  <Section title="Key Risks" color="hsl(0 72% 68%)">
                    {dr.keyRisks.map((r: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-xs py-1">
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0" style={{ color: "hsl(0 72% 68%)" }} />
                        <span style={{ color: "hsl(210 40% 78%)" }}>{r}</span>
                      </div>
                    ))}
                  </Section>
                )}
              </div>

              {dr.nextSteps?.length > 0 && (
                <Section title="Next Steps" color="hsl(38 95% 60%)">
                  <div className="space-y-2">
                    {dr.nextSteps.map((step: any, i: number) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: "hsl(216 45% 12%)" }}>
                        <span className="flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold shrink-0" style={{ background: "hsl(38 95% 52% / 0.2)", color: "hsl(38 95% 60%)" }}>{i + 1}</span>
                        <div className="flex-1">
                          <p className="text-xs font-semibold" style={{ color: "hsl(210 40% 88%)" }}>{step.step}</p>
                          <div className="flex gap-4 mt-0.5">
                            <span className="text-[10px]" style={{ color: "hsl(217 91% 65%)" }}>{step.timeline}</span>
                            <span className="text-[10px]" style={{ color: "hsl(215 25% 50%)" }}>{step.owner}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              )}
            </div>
          )}
        </div>
      )}

      {/* ═══ TAB: SENSITIVITY ANALYSIS ═══ */}
      {activeTab === "sensitivity" && (
        <div className="space-y-4">
          <div className="rounded-xl p-5" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-semibold" style={{ color: "hsl(210 40% 92%)" }}>Sensitivity Analysis</h2>
                <p className="text-xs mt-1" style={{ color: "hsl(215 25% 55%)" }}>Cost ↑ / Revenue ↓ / Market change scenario testing</p>
              </div>
              <button onClick={runSensitivity} disabled={sensitivityAI.loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50"
                style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
                {sensitivityAI.loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Activity className="h-4 w-4" />}
                {sensitivityAI.loading ? "Running..." : "Run Sensitivity"}
              </button>
            </div>
          </div>

          {sensitivityAI.error && <ErrorBanner msg={sensitivityAI.error} />}
          {sensitivityAI.loading && <LoadingState label="Testing cost/revenue scenarios..." />}

          {sr && !sensitivityAI.loading && (
            <div className="space-y-4">
              <div className="rounded-xl overflow-hidden" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
                <div className="px-5 py-3 flex items-center justify-between" style={{ background: "hsl(216 45% 12%)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "hsl(210 40% 92%)" }}>Scenario Comparison</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: sr.riskLevel === "Low" ? "hsl(158 64% 40% / 0.15)" : sr.riskLevel === "Medium" ? "hsl(38 95% 52% / 0.15)" : "hsl(0 72% 51% / 0.15)", color: sr.riskLevel === "Low" ? "hsl(158 64% 55%)" : sr.riskLevel === "Medium" ? "hsl(38 95% 60%)" : "hsl(0 72% 68%)" }}>
                    {sr.riskLevel} Risk
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr style={{ background: "hsl(216 45% 10%)" }}>
                        {["Scenario", "Revenue", "ROI", "IRR", "NPV", "Impact"].map(h => (
                          <th key={h} className="px-4 py-2.5 text-left font-semibold" style={{ color: "hsl(215 25% 45%)" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: "Base Case",         data: sr.baseCase,          color: "hsl(158 64% 55%)" },
                        { label: "Cost +10%",          data: sr.costIncrease10,    color: "hsl(38 95% 60%)"  },
                        { label: "Cost +20%",          data: sr.costIncrease20,    color: "hsl(0 72% 68%)"   },
                        { label: "Revenue −10%",       data: sr.revenueDecrease10, color: "hsl(38 95% 60%)"  },
                        { label: "Revenue −20%",       data: sr.revenueDecrease20, color: "hsl(0 72% 68%)"   },
                        { label: "Market Downturn",    data: sr.marketDownturn,    color: "hsl(0 72% 68%)"   },
                      ].map((row, i) => (
                        <tr key={i} style={{ borderTop: "1px solid hsl(var(--border))" }}>
                          <td className="px-4 py-2.5 font-semibold" style={{ color: row.color }}>{row.label}</td>
                          <td className="px-4 py-2.5" style={{ color: "hsl(210 40% 80%)" }}>{row.data?.revenue}</td>
                          <td className="px-4 py-2.5 font-semibold" style={{ color: row.color }}>{row.data?.roi}</td>
                          <td className="px-4 py-2.5" style={{ color: "hsl(210 40% 80%)" }}>{row.data?.irr}</td>
                          <td className="px-4 py-2.5" style={{ color: "hsl(210 40% 80%)" }}>{row.data?.npv}</td>
                          <td className="px-4 py-2.5 text-[11px]" style={{ color: "hsl(215 25% 55%)" }}>{row.data?.impact}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {sr.mitigationStrategies?.length > 0 && (
                <Section title="Mitigation Strategies" color="hsl(158 64% 55%)">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {sr.mitigationStrategies.map((m: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <Shield className="h-3.5 w-3.5 shrink-0" style={{ color: "hsl(158 64% 55%)" }} />
                        <span style={{ color: "hsl(210 40% 78%)" }}>{m}</span>
                      </div>
                    ))}
                  </div>
                </Section>
              )}
            </div>
          )}
        </div>
      )}

      {/* ═══ TAB: FINAL REPORT ═══ */}
      {activeTab === "report" && (
        <div className="space-y-4">
          <div className="rounded-xl p-5" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <h2 className="text-sm font-semibold mb-2" style={{ color: "hsl(210 40% 92%)" }}>Professional Report Generator</h2>
            <p className="text-xs mb-4" style={{ color: "hsl(215 25% 55%)" }}>
              Compiles all analysis into a consulting-grade PDF report. Run Location Intelligence, Feasibility Engine, and Decision Engine first.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              {[
                { label: "Location Analysis",  done: !!lr, icon: MapPin  },
                { label: "Feasibility Model",  done: !!fr, icon: PieChart },
                { label: "Decision Engine",    done: !!dr, icon: Target   },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: "hsl(216 45% 12%)" }}>
                  <item.icon className="h-4 w-4" style={{ color: item.done ? "hsl(158 64% 55%)" : "hsl(215 25% 40%)" }} />
                  <span className="text-xs font-medium" style={{ color: item.done ? "hsl(210 40% 85%)" : "hsl(215 25% 45%)" }}>{item.label}</span>
                  {item.done
                    ? <CheckCircle2 className="h-4 w-4 ml-auto" style={{ color: "hsl(158 64% 55%)" }} />
                    : <AlertTriangle className="h-4 w-4 ml-auto" style={{ color: "hsl(215 25% 35%)" }} />}
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold"
                style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
                <Download className="h-4 w-4" /> Export PDF Report
              </button>
              <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold"
                style={{ background: "hsl(216 45% 18%)", color: "hsl(210 40% 80%)", border: "1px solid hsl(var(--border))" }}>
                <FileText className="h-4 w-4" /> Export to Word
              </button>
            </div>
          </div>

          {(lr || fr || dr) && (
            <div className="rounded-xl p-5 space-y-3" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
              <h3 className="text-sm font-semibold" style={{ color: "hsl(210 40% 92%)" }}>Report Preview</h3>
              {lr && <div className="p-3 rounded-lg" style={{ background: "hsl(216 45% 12%)" }}><p className="text-xs font-semibold mb-1" style={{ color: "hsl(38 95% 60%)" }}>§1 Location Intelligence</p><p className="text-xs" style={{ color: "hsl(210 40% 72%)" }}>Score: {lr.locationScore}/100 · {lr.recommendation}</p></div>}
              {fr && <div className="p-3 rounded-lg" style={{ background: "hsl(216 45% 12%)" }}><p className="text-xs font-semibold mb-1" style={{ color: "hsl(158 64% 55%)" }}>§2 Feasibility Study</p><p className="text-xs" style={{ color: "hsl(210 40% 72%)" }}>Verdict: {fr.verdict} · ROI {fr.returns?.roi} · IRR {fr.returns?.irr}</p></div>}
              {sr && <div className="p-3 rounded-lg" style={{ background: "hsl(216 45% 12%)" }}><p className="text-xs font-semibold mb-1" style={{ color: "hsl(217 91% 70%)" }}>§3 Sensitivity Analysis</p><p className="text-xs" style={{ color: "hsl(210 40% 72%)" }}>Risk Level: {sr.riskLevel} · {sr.mostSensitiveFactor}</p></div>}
              {dr && <div className="p-3 rounded-lg" style={{ background: "hsl(216 45% 12%)" }}><p className="text-xs font-semibold mb-1" style={{ color: "hsl(0 72% 68%)" }}>§4 Investment Decision</p><p className="text-xs" style={{ color: "hsl(210 40% 72%)" }}>{dr.goNoGo} · Score {dr.overallScore}/100 · Confidence: {dr.confidenceLevel}</p></div>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
