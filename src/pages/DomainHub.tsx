/**
 * DomainHub.tsx v2 — Industry domain intelligence modules
 * Route: /domain/:domain
 * Domains: real-estate, fmcg, fnb, telecom, distribution, sales, marketing, bizdev
 * Full module features per domain
 */
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useEngagementStore, buildFullContext } from "@/store/engagementStore";
import { useClaudeAnalysis } from "@/hooks/useClaudeAnalysis";
import { AIDisclaimer } from "@/components/ai/AIDisclaimer";
import {
  Building2, ShoppingCart, Coffee, Radio, Truck,
  TrendingUp, Megaphone, Network, Loader2, Save, Check,
  AlertTriangle,
} from "lucide-react";

interface DomainTool {
  id: string;
  label: string;
  prompt: string;
  fields?: { key: string; label: string; placeholder: string }[];
}

interface DomainConfig {
  label: string;
  icon: React.ElementType;
  color: string;
  description: string;
  tier: "flash-lite" | "flash" | "pro";
  subTools: DomainTool[];
}

const DOMAINS: Record<string, DomainConfig> = {
  "real-estate": {
    label: "Real Estate Intelligence", icon: Building2, color: "hsl(38 95% 52%)",
    description: "Location intelligence, feasibility, scenario analysis, and investment decision engine for MENA real estate.",
    tier: "flash",
    subTools: [
      { id: "location",     label: "Location Intelligence",  prompt: "Analyse this real estate location — catchment, demographics, access, competition, and development potential.",
        fields: [{ key: "location", label: "Location / Area", placeholder: "e.g. Erbil — Empire World district" }] },
      { id: "feasibility",  label: "Feasibility Engine",     prompt: "Run a full feasibility analysis — market demand, financial viability, phasing, and go/no-go recommendation.",
        fields: [{ key: "scenario", label: "Asset Type", placeholder: "Hotel, Mall, Residential, Office, Mixed-use" }] },
      { id: "decision",     label: "Investment Decision",    prompt: "Produce an investment decision memo with IRR, NPV, risk matrix, and final GO/NO-GO recommendation." },
      { id: "sensitivity",  label: "Sensitivity Analysis",   prompt: "Run sensitivity analysis varying occupancy, pricing, and construction cost assumptions." },
      { id: "comp-analysis",label: "Comparable Analysis",    prompt: "Analyse comparable real estate transactions, pricing benchmarks, and market positioning for this asset type.",
        fields: [{ key: "assetType", label: "Asset Type", placeholder: "e.g. Grade A office, retail mall, hotel" }] },
      { id: "scenario",     label: "Scenario Planning",      prompt: "Develop best/base/worst case scenarios for this real estate project with financial projections for each." },
    ],
  },
  "fmcg": {
    label: "FMCG Intelligence", icon: ShoppingCart, color: "hsl(145 65% 48%)",
    description: "Route-to-market, distribution, shelf analysis, SKU optimisation, and FMCG competitive intelligence.",
    tier: "flash",
    subTools: [
      { id: "rtm",          label: "RTM Design Engine",      prompt: "Design a full Route-to-Market strategy — channels, coverage model, distributor structure, territory splits, and KPIs.",
        fields: [{ key: "category", label: "Category", placeholder: "e.g. beverages, snacks, personal care" }] },
      { id: "territory",    label: "Territory Optimisation", prompt: "Optimise territory design — geographic coverage, call frequency, outlet universe segmentation, and rep productivity targets." },
      { id: "kpi",          label: "KPI Dashboard Design",   prompt: "Design a comprehensive FMCG field force KPI dashboard — numeric distribution, weighted distribution, strike rate, productivity, and shelf metrics." },
      { id: "incentive",    label: "Incentive Calculator",   prompt: "Design a distributor and field force incentive scheme — targets, thresholds, accelerators, bonus pools, and payout models." },
      { id: "van-sales",    label: "Van Sales Optimiser",    prompt: "Optimise van sales operations — route planning, load optimisation, cash collection, outlet coverage, and productivity benchmarks." },
      { id: "coverage",     label: "Coverage Heatmaps",      prompt: "Analyse and design outlet coverage — white space identification, outlet segmentation, call cycle recommendations, and penetration targets." },
      { id: "sku",          label: "SKU Optimisation",       prompt: "SKU portfolio optimisation — prioritisation matrix, sku rationalisation, must-stock-list, and range by channel.",
        fields: [{ key: "portfolio", label: "Product Portfolio", placeholder: "e.g. 40 SKUs across 5 categories" }] },
      { id: "pricing-sim",  label: "Pricing Simulator",      prompt: "FMCG pricing simulation — NPI pricing, promotional pricing, price elasticity, channel margin waterfall, and competitive price positioning." },
      { id: "competitor-bm",label: "Competitor Benchmarking",prompt: "Benchmark this FMCG brand against key competitors — distribution breadth, shelf presence, pricing, promotions, and innovation pipeline." },
      { id: "trade",        label: "Trade Strategy Engine",  prompt: "Trade strategy — shopper marketing plan, category captain approach, visibility investment, and trading terms design." },
      { id: "promo",        label: "Promotion Planner",      prompt: "Trade promotion strategy — promotional calendar, mechanic design, budget allocation, retailer sell-in approach, and ROI framework." },
      { id: "shelf",        label: "Shelf Strategy",         prompt: "Shelf space strategy, planogram approach, and visibility tactics for this FMCG brand in the target market." },
    ],
  },
  "fnb": {
    label: "Food & Beverage", icon: Coffee, color: "hsl(30 90% 55%)",
    description: "F&B market entry, menu strategy, operations, kitchen workflow, and expansion planning for MENA.",
    tier: "flash",
    subTools: [
      { id: "market",       label: "F&B Market Analysis",   prompt: "F&B market analysis — size, segments, consumer trends, and key competitors.",
        fields: [{ key: "concept", label: "F&B Concept", placeholder: "e.g. fast casual, QSR, fine dining, cafe" }] },
      { id: "concept",      label: "Concept Generator",     prompt: "Generate F&B concept ideas — positioning, target audience, menu direction, price points, and differentiation strategy for this market.",
        fields: [{ key: "brief", label: "Concept Brief", placeholder: "e.g. modern Iraqi cuisine, Erbil family casual" }] },
      { id: "menu",         label: "Menu Engineering",      prompt: "Menu engineering — star/plowhorses/puzzles/dogs analysis, pricing strategy, localisation, and margin optimisation for this market." },
      { id: "cost",         label: "Cost Calculator",       prompt: "F&B cost model — food cost %, beverage cost %, labour cost %, occupancy, and target EBITDA margin with recommendations." },
      { id: "kitchen",      label: "Kitchen Workflow",      prompt: "Kitchen layout and workflow design — equipment specification, station design, prep flow, capacity planning, and efficiency recommendations." },
      { id: "expand",       label: "Expansion Simulator",   prompt: "Franchise/expansion simulation — rollout plan, investment per unit, payback period, and multi-unit economics." },
      { id: "ops",          label: "Operations Blueprint",  prompt: "F&B operations blueprint — staffing, kitchen layout, supply chain, and cost model." },
      { id: "brand",        label: "Brand Positioning",     prompt: "F&B brand positioning — identity, target guest, competitive differentiation, and communication strategy." },
    ],
  },
  "telecom": {
    label: "Telecom Intelligence", icon: Radio, color: "hsl(200 80% 55%)",
    description: "Telecom market sizing, B2B strategy, product-market fit, and competitive analysis.",
    tier: "flash",
    subTools: [
      { id: "market",       label: "Market Sizing",          prompt: "Telecom market sizing — subscribers, revenue pools, ARPU, and growth trajectory.",
        fields: [{ key: "segment", label: "Segment", placeholder: "B2B enterprise, consumer, IoT, wholesale" }] },
      { id: "b2b",          label: "B2B Go-to-Market",       prompt: "B2B telecom go-to-market strategy — sales approach, product bundling, and key verticals." },
      { id: "compete",      label: "Competitive Intelligence",prompt: "Telecom competitive landscape — market share, pricing, product comparison, and white spaces." },
      { id: "product",      label: "Product-Market Fit",     prompt: "Product-market fit analysis for this telecom offering in the target segment." },
      { id: "bundle",       label: "Bundle Optimisation",    prompt: "Telecom bundle design and optimisation — package tiers, add-on strategy, upsell paths, and retention mechanics.",
        fields: [{ key: "productType", label: "Product Type", placeholder: "e.g. mobile, fixed broadband, converged" }] },
      { id: "channel-perf", label: "Channel Performance",   prompt: "Telecom channel performance analysis — dealer network health, channel mix optimisation, commission structure, and activation rates." },
    ],
  },
  "distribution": {
    label: "Distribution Intelligence", icon: Truck, color: "hsl(280 70% 65%)",
    description: "Supply chain design, logistics optimisation, distribution network strategy, and procurement.",
    tier: "flash",
    subTools: [
      { id: "network",      label: "Network Design",         prompt: "Distribution network design — warehouse locations, transport modes, coverage, and cost model.",
        fields: [{ key: "product", label: "Product Type", placeholder: "e.g. FMCG, pharma, industrial goods" }] },
      { id: "logistics",    label: "Logistics Optimisation", prompt: "Logistics optimisation — routing, lead times, 3PL vs own fleet, and KPIs." },
      { id: "supply-chain", label: "Supply Chain Design",    prompt: "End-to-end supply chain design — sourcing, manufacturing, warehousing, transport, and last-mile delivery strategy." },
      { id: "procurement",  label: "Procurement Optimiser",  prompt: "Procurement strategy — supplier rationalisation, tender process, price benchmarking, payment terms, and risk management." },
      { id: "cost",         label: "Cost-to-Serve",          prompt: "Cost-to-serve analysis by channel and customer segment — activity-based costing, profitability by route, and improvement levers." },
      { id: "cold",         label: "Cold Chain",             prompt: "Cold chain requirements, gaps, and investment plan for this product category." },
    ],
  },
  "sales": {
    label: "Sales Intelligence", icon: TrendingUp, color: "hsl(158 64% 48%)",
    description: "Sales team design, incentive structures, territory planning, CRM strategy, and revenue forecasting.",
    tier: "flash",
    subTools: [
      { id: "team",         label: "Sales Team Design",      prompt: "Sales team structure — roles, headcount, reporting lines, and capability requirements.",
        fields: [{ key: "model", label: "Sales Model", placeholder: "Direct, through partners, inside sales, field" }] },
      { id: "incentive",    label: "Incentive Structure",    prompt: "Sales incentive and compensation plan — base, variable, accelerators, and targets." },
      { id: "crm-strategy", label: "CRM Strategy Builder",  prompt: "CRM strategy — system requirements, pipeline stages, data model, activity cadence, reporting, and adoption plan." },
      { id: "process",      label: "Process Optimisation",  prompt: "Sales process optimisation — lead management, qualification framework, proposal process, negotiation, and close rate improvement." },
      { id: "forecast",     label: "Revenue Forecast",       prompt: "12-month revenue forecast with assumptions, scenarios, and pipeline model." },
      { id: "pipeline",     label: "Pipeline Management",    prompt: "Sales pipeline management framework — stages, conversion rates, activities, and CRM setup." },
    ],
  },
  "marketing": {
    label: "Marketing Intelligence", icon: Megaphone, color: "hsl(340 80% 60%)",
    description: "Brand positioning, campaign strategy, funnel building, ROI tracking, and customer segmentation.",
    tier: "flash",
    subTools: [
      { id: "brand",        label: "Brand Positioning Engine",prompt: "Brand positioning strategy — target audience, value proposition, messaging pillars, and competitive differentiation.",
        fields: [{ key: "brandName", label: "Brand Name", placeholder: "e.g. Brand X" }] },
      { id: "funnel",       label: "Funnel Builder",         prompt: "Marketing funnel design — awareness, interest, consideration, intent, and purchase stages with tactics and KPIs for each." },
      { id: "campaign",     label: "Campaign Planner",       prompt: "Integrated marketing campaign strategy — channels, budget allocation, KPIs, timeline, and creative direction." },
      { id: "roi",          label: "ROI Tracker",            prompt: "Marketing ROI framework — channel attribution model, CAC/LTV analysis, campaign ROI benchmarks, and budget optimisation recommendations." },
      { id: "segment",      label: "Customer Segmentation",  prompt: "Customer segmentation — demographic, psychographic, behavioural segmentation with persona profiles and targeting recommendations.",
        fields: [{ key: "product", label: "Product/Service", placeholder: "e.g. premium F&B brand, B2B SaaS" }] },
      { id: "digital",      label: "Digital Marketing",      prompt: "Digital marketing strategy — SEO, social, paid, email, and content plan for this market." },
      { id: "sizing",       label: "Market Sizing",          prompt: "Total addressable market (TAM/SAM/SOM) for this product/brand in the target market." },
    ],
  },
  "bizdev": {
    label: "Business Development", icon: Network, color: "hsl(217 91% 68%)",
    description: "Business model design, expansion planning, investment analysis, and partnership strategy.",
    tier: "flash",
    subTools: [
      { id: "model",        label: "Business Model Generator",prompt: "Business model design — value proposition, revenue streams, cost structure, key activities, and competitive moat.",
        fields: [{ key: "idea", label: "Business Idea", placeholder: "Describe the business concept" }] },
      { id: "expansion",    label: "Expansion Planner",      prompt: "Market expansion plan — target markets, entry sequence, investment phasing, capability requirements, and risk mitigation." },
      { id: "proposal",     label: "Proposal Generator",     prompt: "Business development proposal — value proposition, offering, commercial model, and next steps." },
      { id: "investment",   label: "Investment Analysis",    prompt: "Investment analysis — market opportunity, financial projections, return scenarios, and investment thesis.",
        fields: [{ key: "amount", label: "Investment Amount", placeholder: "e.g. $5M Series A" }] },
      { id: "opp",          label: "Opportunity Assessment", prompt: "Business opportunity assessment — market size, feasibility, competitive position, and recommended approach.",
        fields: [{ key: "opportunity", label: "Opportunity", placeholder: "Describe the business opportunity" }] },
      { id: "partner",      label: "Partnership Strategy",   prompt: "Partnership and alliance strategy — partner criteria, deal structure, and engagement roadmap." },
      { id: "pipeline",     label: "BD Pipeline",            prompt: "Business development pipeline framework — target segments, outreach strategy, and conversion approach." },
      { id: "cost-reduction",label: "Cost Reduction Engine", prompt: "Cost reduction analysis — overhead mapping, benchmarking, quick wins, structural savings opportunities, and implementation roadmap." },
    ],
  },
};

function ToolRunner({ cfg, tool }: { cfg: DomainConfig; tool: DomainTool }) {
  const { getActiveEngagement, saveOutput } = useEngagementStore();
  const eng = getActiveEngagement();
  const [fields, setFields] = useState<Record<string, string>>({});
  const [extra,  setExtra]  = useState("");
  const [saved,  setSaved]  = useState(false);

  const { analyze, loading, rawText } = useClaudeAnalysis({
    modelTier: cfg.tier,
    systemPrompt: `You are a senior ${cfg.label} consultant for MENA markets with deep Iraq expertise.
${buildFullContext(eng)}
Provide a structured, professional ${tool.label} analysis with clear sections and actionable recommendations.`,
  });

  const run = () => {
    const fstr = Object.entries(fields).map(([k, v]) => v ? `${k}: ${v}` : "").filter(Boolean).join(". ");
    analyze(`${tool.prompt} ${fstr} ${extra}`);
    setSaved(false);
  };

  return (
    <div className="space-y-4">
      {!eng && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
          style={{ background: "hsl(38 85% 52%/0.1)", border: "1px solid hsl(38 85% 52%/0.25)", color: "hsl(38 85% 60%)" }}>
          <AlertTriangle className="h-3.5 w-3.5" />
          No active engagement — results won't be saved automatically.
        </div>
      )}
      {eng && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
          style={{ background: "hsl(38 95% 52%/0.08)", border: "1px solid hsl(38 95% 52%/0.2)", color: "hsl(38 95% 60%)" }}>
          Using: <strong>{eng.companyName || eng.clientName}</strong> · {eng.industry} · {eng.market}
        </div>
      )}

      <div className="rounded-xl p-4 space-y-3" style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 18%)" }}>
        {tool.fields?.map((f) => (
          <div key={f.key}>
            <label className="block text-[10px] uppercase tracking-wider font-semibold mb-1"
              style={{ color: "hsl(215 25% 48%)" }}>{f.label}</label>
            <input type="text" placeholder={f.placeholder} value={fields[f.key] ?? ""}
              onChange={(e) => setFields((x) => ({ ...x, [f.key]: e.target.value }))}
              className="w-full rounded-md px-3 py-2 text-sm"
              style={{ background: "hsl(216 45% 14%)", color: "hsl(210 40% 88%)", border: "1px solid hsl(216 45% 22%)" }} />
          </div>
        ))}
        <div>
          <label className="block text-[10px] uppercase tracking-wider font-semibold mb-1"
            style={{ color: "hsl(215 25% 48%)" }}>Additional Instructions</label>
          <textarea rows={2} value={extra} onChange={(e) => setExtra(e.target.value)}
            placeholder="Specific focus areas, constraints, or questions…"
            className="w-full rounded-md px-3 py-2 text-sm resize-none"
            style={{ background: "hsl(216 45% 14%)", color: "hsl(210 40% 88%)", border: "1px solid hsl(216 45% 22%)" }} />
        </div>
        <div className="flex gap-2">
          <button onClick={run} disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
            style={{ background: cfg.color, color: "hsl(216 58% 6%)" }}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <cfg.icon className="h-4 w-4" />}
            Run {tool.label}
          </button>
          {rawText && eng && (
            <button onClick={() => { saveOutput(eng.id, tool.id, tool.label, rawText, "Analysis"); setSaved(true); }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold"
              style={{
                background: saved ? "hsl(145 65% 40%/0.15)" : "hsl(216 45% 18%)",
                color:      saved ? "hsl(145 65% 55%)"      : "hsl(38 95% 55%)",
              }}>
              {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
              {saved ? "Saved!" : "Save to Engagement"}
            </button>
          )}
        </div>
      </div>

      {rawText && (
        <div className="rounded-xl p-5" style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 18%)" }}>
          <p className="text-[10px] uppercase tracking-widest font-semibold mb-3" style={{ color: "hsl(215 25% 45%)" }}>
            {tool.label} {eng ? `— ${eng.companyName || eng.clientName}` : ""}
          </p>
          <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "hsl(210 40% 80%)" }}>
            {rawText}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DomainHub() {
  const { domain } = useParams<{ domain: string }>();
  const cfg = DOMAINS[domain || ""];
  const [activeTool, setActiveTool] = useState(0);

  if (!cfg) return (
    <div className="flex items-center justify-center h-64">
      <p style={{ color: "hsl(215 25% 45%)" }}>Domain not found.</p>
    </div>
  );

  const tool = cfg.subTools[activeTool];

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl flex items-center justify-center"
          style={{ background: `${cfg.color}18` }}>
          <cfg.icon className="h-5 w-5" style={{ color: cfg.color }} />
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ color: "hsl(210 40% 92%)" }}>{cfg.label}</h1>
          <p className="text-sm mt-0.5" style={{ color: "hsl(215 25% 48%)" }}>{cfg.description}</p>
        </div>
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {cfg.subTools.map((t, i) => (
          <button key={t.id} onClick={() => setActiveTool(i)}
            className="px-3 py-2 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: activeTool === i ? `${cfg.color}18` : "hsl(216 45% 12%)",
              color:      activeTool === i ? cfg.color         : "hsl(215 25% 55%)",
              border:     activeTool === i ? `1px solid ${cfg.color}35` : "1px solid hsl(216 45% 18%)",
            }}>{t.label}</button>
        ))}
      </div>

      <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
        style={{ background: "hsl(216 45% 11%)", border: "1px solid hsl(216 45% 20%)" }}>
        <cfg.icon className="h-5 w-5" style={{ color: cfg.color }} />
        <div>
          <p className="text-sm font-semibold" style={{ color: "hsl(210 40% 90%)" }}>{tool.label}</p>
          <p className="text-xs" style={{ color: "hsl(215 25% 48%)" }}>
            {tool.prompt.slice(0, 100)}{tool.prompt.length > 100 ? "…" : ""}
          </p>
        </div>
      </div>

      <ToolRunner cfg={cfg} tool={tool} />
    </div>
  );
}
