/**
 * DomainHub.tsx — Industry domain intelligence modules
 * Route: /domain/:domain
 */
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useEngagementStore, buildFullContext } from "@/store/engagementStore";
import { useClaudeAnalysis } from "@/hooks/useClaudeAnalysis";
import {
  Building2, ShoppingCart, Coffee, Radio, Truck,
  TrendingUp, Megaphone, Network, Loader2, Save, Check, AlertTriangle,
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
  tier: "flash-lite"|"flash"|"pro";
  subTools: DomainTool[];
}

const DOMAINS: Record<string, DomainConfig> = {
  "real-estate": {
    label: "Real Estate Intelligence", icon: Building2, color: "hsl(38 95% 52%)",
    description: "Location intelligence, feasibility, scenario analysis, and investment decision engine for MENA real estate.",
    tier: "flash",
    subTools: [
      { id: "location",    label: "Location Intelligence",   prompt: "Analyse this real estate location — catchment, demographics, access, competition, and development potential.",
        fields: [{ key: "location", label: "Location / Area", placeholder: "e.g. Erbil — Empire World district" }] },
      { id: "feasibility", label: "Feasibility Engine",      prompt: "Run a full feasibility analysis — market demand, financial viability, phasing, and go/no-go recommendation.",
        fields: [{ key: "scenario", label: "Asset Type", placeholder: "Hotel, Mall, Residential, Office, Mixed-use" }] },
      { id: "decision",    label: "Investment Decision",     prompt: "Produce an investment decision memo with IRR, NPV, risk matrix, and final GO/NO-GO recommendation." },
      { id: "sensitivity", label: "Sensitivity Analysis",    prompt: "Run sensitivity analysis varying occupancy, pricing, and construction cost assumptions." },
    ],
  },
  "fmcg": {
    label: "FMCG Intelligence", icon: ShoppingCart, color: "hsl(145 65% 48%)",
    description: "Route-to-market, distribution, shelf analysis, and FMCG competitive intelligence for MENA markets.",
    tier: "flash",
    subTools: [
      { id: "rtm",      label: "Route to Market Design",  prompt: "Design a full RTM strategy — channels, coverage model, distributor structure, KPIs.",
        fields: [{ key: "category", label: "Category", placeholder: "e.g. beverages, snacks, personal care" }] },
      { id: "shelf",    label: "Shelf Strategy",          prompt: "Shelf space strategy, planogram approach, and visibility tactics for this FMCG brand." },
      { id: "promo",    label: "Promo & Trade",           prompt: "Trade promotion strategy, budget allocation, and ROI framework for this market." },
      { id: "distrib",  label: "Distribution Network",    prompt: "Distributor network design — coverage gaps, partner criteria, territory split, performance KPIs." },
    ],
  },
  "fnb": {
    label: "Food & Beverage", icon: Coffee, color: "hsl(30 90% 55%)",
    description: "F&B market entry, menu strategy, operations, and expansion planning for the MENA region.",
    tier: "flash",
    subTools: [
      { id: "market",   label: "F&B Market Analysis",    prompt: "F&B market analysis — size, segments, consumer trends, and key competitors.",
        fields: [{ key: "concept", label: "F&B Concept", placeholder: "e.g. fast casual, QSR, fine dining, cafe" }] },
      { id: "ops",      label: "Operations Blueprint",   prompt: "F&B operations blueprint — staffing, kitchen layout, supply chain, and cost model." },
      { id: "expand",   label: "Expansion Strategy",     prompt: "Franchise/expansion strategy for this F&B brand in the target market." },
      { id: "menu",     label: "Menu Strategy",          prompt: "Menu strategy — localisation, pricing, margin optimisation for this market." },
    ],
  },
  "telecom": {
    label: "Telecom Intelligence", icon: Radio, color: "hsl(200 80% 55%)",
    description: "Telecom market sizing, B2B strategy, product-market fit, and competitive analysis.",
    tier: "flash",
    subTools: [
      { id: "market",   label: "Market Sizing",           prompt: "Telecom market sizing — subscribers, revenue pools, ARPU, and growth trajectory.",
        fields: [{ key: "segment", label: "Segment", placeholder: "B2B enterprise, consumer, IoT, wholesale" }] },
      { id: "b2b",      label: "B2B Go-to-Market",        prompt: "B2B telecom go-to-market strategy — sales approach, product bundling, and key verticals." },
      { id: "compete",  label: "Competitive Intelligence",prompt: "Telecom competitive landscape — market share, pricing, product comparison, and white spaces." },
      { id: "product",  label: "Product-Market Fit",      prompt: "Product-market fit analysis for this telecom offering in the target segment." },
    ],
  },
  "distribution": {
    label: "Distribution Intelligence", icon: Truck, color: "hsl(280 70% 65%)",
    description: "Supply chain design, logistics optimisation, and distribution network strategy.",
    tier: "flash",
    subTools: [
      { id: "network",  label: "Network Design",          prompt: "Distribution network design — warehouse locations, transport modes, coverage, and cost model.",
        fields: [{ key: "product", label: "Product Type", placeholder: "e.g. FMCG, pharma, industrial goods" }] },
      { id: "logistics",label: "Logistics Optimisation",  prompt: "Logistics optimisation — routing, lead times, 3PL vs own fleet, and KPIs." },
      { id: "cost",     label: "Cost-to-Serve",           prompt: "Cost-to-serve analysis by channel and customer segment." },
      { id: "cold",     label: "Cold Chain",              prompt: "Cold chain requirements, gaps, and investment plan for this product category." },
    ],
  },
  "sales": {
    label: "Sales Intelligence", icon: TrendingUp, color: "hsl(158 64% 48%)",
    description: "Sales team design, incentive structures, territory planning, and revenue forecasting.",
    tier: "flash",
    subTools: [
      { id: "team",     label: "Sales Team Design",       prompt: "Sales team structure — roles, headcount, reporting lines, and capability requirements.",
        fields: [{ key: "model", label: "Sales Model", placeholder: "Direct, through partners, inside sales, field" }] },
      { id: "incentive",label: "Incentive Structure",     prompt: "Sales incentive and compensation plan — base, variable, accelerators, and targets." },
      { id: "forecast", label: "Revenue Forecast",        prompt: "12-month revenue forecast with assumptions, scenarios, and pipeline model." },
      { id: "pipeline", label: "Pipeline Management",     prompt: "Sales pipeline management framework — stages, conversion rates, activities, and CRM setup." },
    ],
  },
  "marketing": {
    label: "Marketing Intelligence", icon: Megaphone, color: "hsl(340 80% 60%)",
    description: "Brand positioning, campaign strategy, digital marketing, and market sizing for MENA.",
    tier: "flash",
    subTools: [
      { id: "brand",    label: "Brand Positioning",       prompt: "Brand positioning strategy — target audience, value proposition, messaging pillars, and competitive differentiation.",
        fields: [{ key: "brandName", label: "Brand Name", placeholder: "e.g. Brand X" }] },
      { id: "campaign", label: "Campaign Strategy",       prompt: "Integrated marketing campaign strategy — channels, budget allocation, KPIs, and creative direction." },
      { id: "digital",  label: "Digital Marketing",       prompt: "Digital marketing strategy — SEO, social, paid, email, and content plan for this market." },
      { id: "sizing",   label: "Market Sizing",           prompt: "Total addressable market (TAM/SAM/SOM) for this product/brand in the target market." },
    ],
  },
  "bizdev": {
    label: "Business Development", icon: Network, color: "hsl(217 91% 68%)",
    description: "Business development, partnerships, new market entry strategy, and opportunity assessment.",
    tier: "flash",
    subTools: [
      { id: "opp",      label: "Opportunity Assessment",  prompt: "Business opportunity assessment — market size, feasibility, competitive position, and recommended approach.",
        fields: [{ key: "opportunity", label: "Opportunity", placeholder: "Describe the business opportunity" }] },
      { id: "partner",  label: "Partnership Strategy",    prompt: "Partnership and alliance strategy — partner criteria, deal structure, and engagement roadmap." },
      { id: "pipeline", label: "BD Pipeline",             prompt: "Business development pipeline framework — target segments, outreach strategy, and conversion approach." },
      { id: "proposal", label: "BD Proposal",             prompt: "Business development proposal — value proposition, offering, commercial model, and next steps." },
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

      <div className="rounded-xl p-4 space-y-3"
        style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 18%)" }}>
        {tool.fields?.map((f) => (
          <div key={f.key}>
            <label className="block text-[10px] uppercase tracking-wider font-semibold mb-1"
              style={{ color: "hsl(215 25% 48%)" }}>{f.label}</label>
            <input type="text" placeholder={f.placeholder} value={fields[f.key] ?? ""}
              onChange={(e) => setFields((p) => ({ ...p, [f.key]: e.target.value }))}
              className="w-full rounded-md px-3 py-2 text-sm"
              style={{ background: "hsl(216 45% 14%)", color: "hsl(210 40% 88%)", border: "1px solid hsl(216 45% 22%)" }} />
          </div>
        ))}
        <div>
          <label className="block text-[10px] uppercase tracking-wider font-semibold mb-1"
            style={{ color: "hsl(215 25% 48%)" }}>Additional Instructions</label>
          <textarea rows={2} value={extra} onChange={(e) => setExtra(e.target.value)}
            placeholder="Specific focus areas or questions…"
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
            <button onClick={() => {
              saveOutput(eng.id, `${cfg.label}-${tool.id}`, `${cfg.label}: ${tool.label}`, rawText, "Analysis");
              setSaved(true);
            }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold"
              style={{
                background: saved ? "hsl(145 65% 40%/0.15)" : "hsl(216 45% 18%)",
                color:      saved ? "hsl(145 65% 55%)"      : "hsl(38 95% 55%)",
              }}>
              {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
              {saved ? "Saved!" : "Save"}
            </button>
          )}
        </div>
      </div>

      {rawText && (
        <div className="rounded-xl p-5" style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 18%)" }}>
          <p className="text-[10px] uppercase tracking-widest font-semibold mb-3" style={{ color: "hsl(215 25% 45%)" }}>
            {tool.label}
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
            {tool.prompt.slice(0, 90)}{tool.prompt.length > 90 ? "…" : ""}
          </p>
        </div>
      </div>

      <ToolRunner cfg={cfg} tool={tool} />
    </div>
  );
}
