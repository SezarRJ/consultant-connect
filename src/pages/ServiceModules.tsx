import { useState } from "react";
import {
  TrendingUp, ShoppingCart, Utensils, Megaphone, Briefcase,
  Radio, Building2, RefreshCw, CheckCircle2, AlertTriangle,
  BarChart2, DollarSign, Target, Zap, Users, PieChart,
  ArrowUpRight, Play, Map, Package, Tag, Star, Layers
} from "lucide-react";
import { useClaudeAnalysis } from "@/hooks/useClaudeAnalysis";

type Module = "sales" | "fmcg" | "fb" | "marketing" | "bizdev" | "telecom" | "realestate";

const MODULES = [
  {
    key: "sales" as Module,
    label: "Sales & Distribution",
    labelAr: "المبيعات والتوزيع",
    icon: TrendingUp,
    color: "hsl(158 64% 55%)",
    bg: "hsl(158 64% 40% / 0.08)",
    border: "hsl(158 64% 40% / 0.25)",
    features: ["RTM Design Engine", "Territory Optimization", "KPI Dashboard", "Incentive Calculator", "Van Sales Optimizer", "Coverage Heatmaps"],
    prompt: `You are a senior Sales & Distribution consultant for MENA markets. Analyze and respond ONLY with valid JSON:
{
  "rtmDesign": { "channels": ["string"], "channelPriority": [{"channel":"string","priority":"High|Medium|Low","coverage":"string"}], "recommendation": "string" },
  "territoryOptimization": { "zones": [{"name":"string","outlets":"string","coverage":"string","potential":"string"}], "optimizationOpportunity": "string" },
  "kpiFramework": [{ "kpi": "string", "target": "string", "frequency": "string" }],
  "incentiveStructure": { "basePay": "string", "variableComponents": ["string"], "totalOTE": "string" },
  "vanSalesConfig": { "vehicleCount": "string", "routesPerDay": "string", "dropsPerRoute": "string", "dailyTarget": "string" },
  "coverageGaps": ["string"],
  "quickWins": ["string"]
}`,
    placeholder: "e.g. Design RTM for FMCG brand in Baghdad covering 5 governorates, 2,400 retail outlets"
  },
  {
    key: "fmcg" as Module,
    label: "FMCG Intelligence",
    labelAr: "استخبارات السلع الاستهلاكية",
    icon: ShoppingCart,
    color: "hsl(38 95% 60%)",
    bg: "hsl(38 95% 52% / 0.08)",
    border: "hsl(38 95% 52% / 0.25)",
    features: ["SKU Optimization", "Pricing Simulator", "Competitor Benchmarking", "Trade Strategy Engine", "Promotion Planner"],
    prompt: `You are a senior FMCG consultant. Analyze this FMCG challenge and respond ONLY with valid JSON:
{
  "skuOptimization": { "currentPortfolio": "string", "recommended": [{"sku":"string","priority":"Core|Support|Niche","rationale":"string"}], "rationalizationOpportunity": "string" },
  "pricingSimulation": { "recommendedRSP": "string", "wholesalePrice": "string", "distributor_margin": "string", "retailer_margin": "string", "pricePositioning": "string" },
  "competitorBenchmark": [{ "brand": "string", "rsp": "string", "distribution": "string", "strength": "string" }],
  "tradeStrategy": { "modernTrade": "string", "generalTrade": "string", "ecommerce": "string", "keyAccounts": ["string"] },
  "promotionCalendar": [{ "month": "string", "mechanic": "string", "channel": "string", "expectedROI": "string" }],
  "opportunities": ["string"]
}`,
    placeholder: "e.g. Optimize SKU portfolio for juice brand in Iraq, 5 SKUs, competing with Rani & Vimto"
  },
  {
    key: "fb" as Module,
    label: "F&B Consulting",
    labelAr: "استشارات المطاعم",
    icon: Utensils,
    color: "hsl(0 72% 68%)",
    bg: "hsl(0 72% 51% / 0.08)",
    border: "hsl(0 72% 51% / 0.25)",
    features: ["Concept Generator", "Menu Engineering", "Cost Calculator", "Kitchen Workflow", "Expansion Simulator"],
    prompt: `You are a senior F&B consultant for MENA markets. Analyze and respond ONLY with valid JSON:
{
  "conceptRecommendation": { "concept": "string", "positioning": "string", "targetSegment": "string", "pricePoint": "string", "rationale": "string" },
  "menuEngineering": { "categories": [{"name":"string","items":"string","avgPrice":"string","foodCostPct":"string","classification":"Star|Plow Horse|Puzzle|Dog"}], "recommendation": "string" },
  "unitEconomics": { "avgCheck": "string", "seatingCapacity": "string", "turnsPerDay": "string", "dailyRevenue": "string", "foodCostPct": "string", "laborPct": "string", "rentPct": "string", "ebitdaMargin": "string" },
  "kitchenLayout": { "stations": ["string"], "workflow": "string", "equipmentList": ["string"] },
  "expansionPlan": { "model": "string", "timeline": "string", "investmentPerUnit": "string", "breakEvenMonths": "string", "targetLocations": ["string"] },
  "risks": ["string"]
}`,
    placeholder: "e.g. Premium casual dining concept in Erbil, 120 seats, Iraqi-international fusion menu"
  },
  {
    key: "marketing" as Module,
    label: "Marketing Intelligence",
    labelAr: "استخبارات التسويق",
    icon: Megaphone,
    color: "hsl(280 80% 70%)",
    bg: "hsl(280 80% 50% / 0.08)",
    border: "hsl(280 80% 50% / 0.25)",
    features: ["Brand Positioning Engine", "Funnel Builder", "Campaign Planner", "ROI Tracker", "Customer Segmentation"],
    prompt: `You are a senior marketing strategist for MENA markets. Analyze and respond ONLY with valid JSON:
{
  "brandPositioning": { "currentPosition": "string", "recommendedPosition": "string", "tagline": "string", "brandPillars": ["string"], "differentiators": ["string"] },
  "customerSegmentation": [{ "segment": "string", "size": "string", "characteristics": "string", "value": "High|Medium|Low" }],
  "funnelStrategy": { "awareness": [{"tactic":"string","channel":"string","budget_allocation":"string"}], "consideration": [{"tactic":"string","channel":"string","budget_allocation":"string"}], "conversion": [{"tactic":"string","channel":"string","budget_allocation":"string"}], "retention": ["string"] },
  "campaignPlan": [{ "campaign": "string", "objective": "string", "channel": "string", "duration": "string", "estimatedROI": "string" }],
  "budgetAllocation": { "digital": "string", "traditional": "string", "events": "string", "promotions": "string", "total": "string" },
  "kpis": ["string"]
}`,
    placeholder: "e.g. Build brand strategy for Turkish FMCG brand entering Iraq, $500K marketing budget"
  },
  {
    key: "bizdev" as Module,
    label: "Business Development",
    labelAr: "تطوير الأعمال",
    icon: Briefcase,
    color: "hsl(217 91% 70%)",
    bg: "hsl(217 91% 53% / 0.08)",
    border: "hsl(217 91% 53% / 0.25)",
    features: ["Business Model Generator", "Expansion Planner", "Proposal Generator", "Investment Analysis"],
    prompt: `You are a senior business development consultant. Analyze and respond ONLY with valid JSON:
{
  "businessModel": { "model": "string", "revenueStreams": ["string"], "keyPartners": ["string"], "valueProposition": "string", "costStructure": "string" },
  "expansionStrategy": { "targetMarkets": [{"market":"string","priority":"string","approach":"string","timeline":"string"}], "modes": ["string"], "investmentRequired": "string" },
  "investmentAnalysis": { "requiredCapital": "string", "expectedROI": "string", "paybackPeriod": "string", "irr": "string", "riskLevel": "Low|Medium|High" },
  "partnershipOpportunities": [{ "partnerType": "string", "rationale": "string", "expectedValue": "string" }],
  "milestones": [{ "milestone": "string", "timeline": "string", "owner": "string" }],
  "recommendation": "string"
}`,
    placeholder: "e.g. Business development strategy for logistics startup targeting Iraq e-commerce market"
  },
  {
    key: "telecom" as Module,
    label: "Telecom Module",
    labelAr: "وحدة الاتصالات",
    icon: Radio,
    color: "hsl(200 80% 65%)",
    bg: "hsl(200 80% 45% / 0.08)",
    border: "hsl(200 80% 45% / 0.25)",
    features: ["Pricing Simulator", "Bundle Optimization", "Channel Performance", "CRM Strategy Builder"],
    prompt: `You are a senior telecom consultant. Analyze and respond ONLY with valid JSON:
{
  "pricingSimulation": { "currentARPU": "string", "targetARPU": "string", "pricingLadder": [{"tier":"string","price":"string","included":"string","margin":"string"}], "recommendation": "string" },
  "bundleOptimization": { "recommendedBundles": [{"name":"string","price":"string","data":"string","voice":"string","targetSegment":"string","expectedUptake":"string"}], "upsellOpportunity": "string" },
  "channelPerformance": [{ "channel": "string", "revShare": "string", "cac": "string", "performance": "High|Medium|Low", "recommendation": "string" }],
  "crmStrategy": { "segmentation": ["string"], "retentionProgram": "string", "churnPredictors": ["string"], "lifecycleActions": ["string"] },
  "revenueOpportunities": ["string"]
}`,
    placeholder: "e.g. Bundle strategy optimization for Iraqi telecom operator, 5M subscribers, prepaid market"
  },
  {
    key: "realestate" as Module,
    label: "Real Estate Module",
    labelAr: "وحدة العقارات",
    icon: Building2,
    color: "hsl(38 95% 60%)",
    bg: "hsl(38 95% 52% / 0.08)",
    border: "hsl(38 95% 52% / 0.25)",
    features: ["Location Intelligence", "Feasibility Engine", "Investment Decision", "Sensitivity Analysis", "Comparable Analysis"],
    prompt: `You are a senior real estate consultant for MENA markets. Analyze and respond ONLY with valid JSON:
{
  "locationIntelligence": { "catchment": "string", "demographics": "string", "accessibility": "string", "competition": "string", "developmentPotential": "string" },
  "feasibility": { "marketDemand": "string", "financialViability": "string", "phasing": "string", "recommendation": "Go|No-Go|Conditional" },
  "investmentDecision": { "irr": "string", "npv": "string", "paybackPeriod": "string", "riskLevel": "Low|Medium|High", "recommendation": "string" },
  "sensitivityAnalysis": { "scenarios": [{"variable":"string","base":"string","upside":"string","downside":"string","impact":"string"}] },
  "comparableAnalysis": [{"asset":"string","price":"string","size":"string","location":"string","benchmark":"string"}],
  "recommendations": ["string"]
}`,
    placeholder: "e.g. Feasibility analysis for mixed-use development in Erbil, 50,000 sqm site near Empire World"
  },
];


const SERVICE_FAMILIES = [
  {
    title: "Performance Improvement Services",
    steps: ["Diagnose", "Prioritize", "Pilot", "Scale", "Track & Adapt"],
    items: ["Cost & Productivity", "Throughput & Cycle Time", "Quality & First-Pass Yield", "Pricing & Margin", "Procurement & Vendor Value", "Working Capital", "Analytics & KPI"],
  },
  {
    title: "Customer Experience Consulting",
    steps: ["Discover", "Map Journeys", "Redesign Service", "Measure Loyalty", "Improve Cost-to-Serve"],
    items: ["Revenue, Loyalty & Lower Cost-to-Serve", "Journeys, Service and Loyalty"],
  },
  {
    title: "Real Estate Consulting Services",
    steps: ["Baseline", "Choices", "Plan", "Execute", "Tune", "Review"],
    items: ["Portfolio Strategy & Capital Planning", "Transaction Support", "Property Management Consulting", "Lease & Occupier Optimization", "Energy, Retro-commissioning & ESG", "Development & Project Controls", "Data & Reporting", "Property Management Consultants"],
  },
  {
    title: "Consumer Products Consulting",
    steps: ["Baseline", "Design", "Pilots", "Scale"],
    items: ["Category & Portfolio Strategy", "Brand, Shopper & Retail Media", "Pricing & Trade Promotion", "Sales Operations & Route to Market", "Supply Chain & Digital Shelf", "Managed Services & Outsourcing"],
  },
  {
    title: "Marketing Consulting Services",
    steps: ["Diagnose", "Choices", "Plan", "Launch", "Optimize", "Scale"],
    items: ["Growth Strategy & Segmentation", "Brand & Positioning", "Advertising Consulting", "Demand Generation & Content", "Sales & Marketing Consulting", "Pricing & Sales Consulting", "Analytics & Marketing Ops", "Customer Experience & Retention", "Product Marketing", "Go-to-Market for New Regions"],
  },
  {
    title: "Strategic Management Consulting",
    steps: ["Scan", "Choose", "Align", "Execute", "Track Benefits"],
    items: ["Corporate Strategy", "Growth & Market Entry", "Operating Model & Governance", "Pricing & Profitability", "Performance & PMO", "Digital & Data for Strategy", "M&A Strategy", "Change & Activation", "Management Consulting Solutions", "Business Strategy Consulting"],
  },
];
function ErrorBanner({ msg }: { msg: string }) {
  return (
    <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: "hsl(0 72% 51% / 0.08)", border: "1px solid hsl(0 72% 51% / 0.3)" }}>
      <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "hsl(0 72% 68%)" }} />
      <div>
        <p className="text-sm" style={{ color: "hsl(0 72% 68%)" }}>{msg}</p>
        {msg.toLowerCase().includes("credit") && (
          <a href="https://console.anthropic.com/" target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs mt-1 underline" style={{ color: "hsl(38 95% 60%)" }}>
            Top up credits at console.anthropic.com <ArrowUpRight className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
}

function JsonDisplay({ data, depth = 0 }: { data: any; depth?: number }) {
  if (!data || typeof data !== "object") {
    return <span style={{ color: typeof data === "string" ? "hsl(158 64% 60%)" : "hsl(38 95% 60%)" }}>{String(data)}</span>;
  }
  if (Array.isArray(data)) {
    return (
      <div className="space-y-1.5">
        {data.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="text-[10px] shrink-0 mt-0.5 font-bold" style={{ color: "hsl(215 25% 40%)" }}>{i + 1}.</span>
            <div className="flex-1">
              {typeof item === "object" ? (
                <div className="rounded-lg p-3" style={{ background: "hsl(216 45% 10%)" }}>
                  {Object.entries(item).map(([k, v]) => (
                    <div key={k} className="flex items-start gap-2 py-0.5">
                      <span className="text-[10px] font-semibold shrink-0 min-w-[100px]" style={{ color: "hsl(217 91% 65%)" }}>{k}</span>
                      <span className="text-xs" style={{ color: "hsl(210 40% 78%)" }}>{String(v)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-xs" style={{ color: "hsl(210 40% 78%)" }}>{String(item)}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {Object.entries(data).map(([key, val]) => (
        <div key={key} className="rounded-xl p-4" style={{ background: "hsl(216 45% 11%)", border: "1px solid hsl(var(--border))" }}>
          <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: "hsl(38 95% 60%)" }}>
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </p>
          <div className="text-xs">
            <JsonDisplay data={val} depth={depth + 1} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ServiceModules() {
  const [activeModule, setActiveModule] = useState<Module>("sales");
  const [inputs, setInputs] = useState<Record<Module, string>>({
    sales: "", fmcg: "", fb: "", marketing: "", bizdev: "", telecom: "", realestate: ""
  });

  const mod = MODULES.find(m => m.key === activeModule)!;
  const { result, loading, error, analyze } = useClaudeAnalysis({ systemPrompt: mod.prompt, agentId: `module-${activeModule}` });

  const handleRun = () => {
    const input = inputs[activeModule];
    if (!input.trim()) return;
    analyze(input);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-display" style={{ color: "hsl(210 40% 94%)" }}>Service Modules</h1>
        <p className="text-sm mt-1" style={{ color: "hsl(215 25% 55%)" }}>Service families, typical steps, and AI-powered specialist modules for Iraq / MENA consulting engagements</p>
      </div>

      {/* Service Catalog */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {SERVICE_FAMILIES.map((family) => (
          <div key={family.title} className="rounded-xl p-4" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-4 w-4" style={{ color: "hsl(38 95% 60%)" }} />
              <p className="text-sm font-semibold" style={{ color: "hsl(210 40% 90%)" }}>{family.title}</p>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {family.steps.map((step) => (
                <span key={step} className="text-[10px] px-2 py-1 rounded-full" style={{ background: "hsl(216 45% 12%)", color: "hsl(215 25% 55%)" }}>{step}</span>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {family.items.slice(0, 6).map((item) => (
                <span key={item} className="text-[10px] px-2 py-1 rounded-full" style={{ background: "hsl(38 95% 52%/0.10)", color: "hsl(38 95% 60%)" }}>{item}</span>
              ))}
              {family.items.length > 6 && (
                <span className="text-[10px] px-2 py-1 rounded-full" style={{ background: "hsl(216 45% 12%)", color: "hsl(215 25% 55%)" }}>+{family.items.length - 6} more</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Module Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
        {MODULES.map(m => (
          <button key={m.key} onClick={() => setActiveModule(m.key)}
            className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all text-center"
            style={{
              background: activeModule === m.key ? m.bg : "hsl(var(--card))",
              border: `1px solid ${activeModule === m.key ? m.border : "hsl(var(--border))"}`,
            }}>
            <m.icon className="h-5 w-5" style={{ color: activeModule === m.key ? m.color : "hsl(215 25% 50%)" }} />
            <span className="text-[11px] font-semibold leading-tight" style={{ color: activeModule === m.key ? m.color : "hsl(215 25% 55%)" }}>
              {m.label}
            </span>
          </button>
        ))}
      </div>

      {/* Active Module Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">

        {/* Left: Features + Input */}
        <div className="space-y-4">
          {/* Module Info */}
          <div className="rounded-xl p-5" style={{ background: mod.bg, border: `1px solid ${mod.border}` }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${mod.color}22` }}>
                <mod.icon className="h-5 w-5" style={{ color: mod.color }} />
              </div>
              <div>
                <h2 className="text-sm font-bold" style={{ color: "hsl(210 40% 94%)" }}>{mod.label}</h2>
                <p className="text-[11px]" style={{ color: mod.color }}>{mod.labelAr}</p>
              </div>
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: "hsl(215 25% 45%)" }}>Module Features</p>
            <div className="space-y-1.5">
              {mod.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <CheckCircle2 className="h-3 w-3 shrink-0" style={{ color: mod.color }} />
                  <span style={{ color: "hsl(210 40% 78%)" }}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="rounded-xl p-4 space-y-3" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "hsl(215 25% 45%)" }}>Describe Your Challenge</p>
            <textarea
              value={inputs[activeModule]}
              onChange={e => setInputs(prev => ({ ...prev, [activeModule]: e.target.value }))}
              placeholder={mod.placeholder}
              rows={5}
              className="w-full px-3 py-2.5 rounded-lg text-xs resize-none"
              style={{ background: "hsl(216 45% 12%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }}
            />
            <button onClick={handleRun} disabled={loading || !inputs[activeModule].trim()}
              className="w-full py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 inline-flex items-center justify-center gap-2"
              style={{ background: mod.color, color: "hsl(216 58% 6%)" }}>
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              {loading ? "Analyzing..." : `Run ${mod.label}`}
            </button>
          </div>
        </div>

        {/* Right: Output */}
        <div className="lg:col-span-3">
          {error && <ErrorBanner msg={error} />}

          {loading && (
            <div className="rounded-xl p-10 text-center" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-3" style={{ color: mod.color }} />
              <p className="font-medium" style={{ color: "hsl(210 40% 75%)" }}>Running {mod.label} analysis...</p>
              <p className="text-xs mt-1" style={{ color: "hsl(215 25% 45%)" }}>Generating structured consulting output</p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="h-4 w-4" style={{ color: mod.color }} />
                <span className="text-sm font-semibold" style={{ color: mod.color }}>{mod.label} Analysis Complete</span>
              </div>
              <JsonDisplay data={result} />
            </div>
          )}

          {!result && !loading && !error && (
            <div className="rounded-xl p-10 text-center h-full flex flex-col items-center justify-center" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
              <mod.icon className="h-14 w-14 mx-auto mb-4 opacity-15" style={{ color: mod.color }} />
              <p className="font-semibold" style={{ color: "hsl(215 25% 50%)" }}>{mod.label}</p>
              <p className="text-sm mt-1 max-w-xs" style={{ color: "hsl(215 25% 40%)" }}>
                Describe your challenge in the input panel and run the AI analysis engine
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
