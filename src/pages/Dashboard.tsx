import { Link } from "react-router-dom";
import {
  TrendingUp, Users, BarChart2, DollarSign, ShieldAlert,
  Handshake, Zap, PackageCheck, FileBarChart2, ArrowRight,
  Globe2, Activity, Bot, FolderOpen, Cpu, CheckCircle2, AlertTriangle
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

const services = [
  { num: "01", title: "Market Entry Analysis",    url: "/market-entry",        icon: TrendingUp,    color: "amber",
    desc: "Comprehensive market opportunity assessment with pricing, demand forecasting, and entry strategy.",
    agent: "MarketEntry Agent", tags: ["Market Size", "Entry Strategy", "Cities"] },
  { num: "02", title: "Distributor Finder",        url: "/distributor-finder",  icon: Users,         color: "green",
    desc: "Locate certified distributors and reliable wholesalers across all major markets.",
    agent: "Distributor Agent", tags: ["Wholesale", "B2B", "Networks"] },
  { num: "03", title: "Competitor Analysis",       url: "/competitor-analysis",  icon: BarChart2,     color: "blue",
    desc: "Competing brands, country of origin, price ranges, distribution strength and market share.",
    agent: "Competitor Agent", tags: ["Brands", "Pricing", "Strategy"] },
  { num: "04", title: "Pricing Intelligence",      url: "/pricing-intelligence", icon: DollarSign,    color: "amber",
    desc: "Wholesale price, retail price, distributor margin & retailer margin benchmarking.",
    agent: "Pricing Agent", tags: ["Wholesale", "Retail", "Margins"] },
  { num: "05", title: "Risk Assessment",           url: "/risk-assessment",      icon: ShieldAlert,   color: "red",
    desc: "Payment risk, logistics, legal barriers, customs issues & mitigation strategies.",
    agent: "Risk Agent", tags: ["Customs", "Legal", "Payment"] },
  { num: "06", title: "Partner Matchmaking",       url: "/partner-matchmaking",  icon: Handshake,     color: "green",
    desc: "Match with verified distributors, agents, and logistics providers worldwide.",
    agent: "Partner Agent", tags: ["Distributors", "Agents", "Logistics"] },
  { num: "07", title: "Sales Strategy",            url: "/sales-strategy",       icon: Zap,           color: "blue",
    desc: "Supermarket chains, wholesalers, cash van distribution & e-commerce channel strategy.",
    agent: "Sales Agent", tags: ["Supermarkets", "Wholesale", "E-comm"] },
  { num: "08", title: "Export Readiness",          url: "/export-readiness",     icon: PackageCheck,  color: "amber",
    desc: "Packaging compliance, labeling requirements, pricing competitiveness & logistics check.",
    agent: "Export Agent", tags: ["Labeling", "Packaging", "Logistics"] },
  { num: "09", title: "Feasibility Study",         url: "/feasibility-study",    icon: FileBarChart2, color: "green",
    desc: "Full business feasibility with financial projections, ROI analysis and go/no-go recommendation.",
    agent: "Feasibility Agent", tags: ["ROI", "Financials", "Projections"] },
];

const colorMap: Record<string, { bg: string; text: string; border: string; pill: string }> = {
  amber: { bg: "hsl(38 95% 52% / 0.08)", text: "hsl(38 95% 60%)", border: "hsl(38 95% 52% / 0.25)", pill: "data-pill-amber" },
  green: { bg: "hsl(158 64% 40% / 0.08)", text: "hsl(158 64% 55%)", border: "hsl(158 64% 40% / 0.25)", pill: "data-pill-green" },
  blue:  { bg: "hsl(217 91% 53% / 0.08)", text: "hsl(217 91% 70%)", border: "hsl(217 91% 53% / 0.25)", pill: "data-pill-blue" },
  red:   { bg: "hsl(0 72% 51% / 0.08)",   text: "hsl(0 72% 68%)",   border: "hsl(0 72% 51% / 0.25)",   pill: "data-pill-red" },
};

const stats = [
  { label: "Advisory Services", value: "9", icon: Activity, sub: "AI-powered agents", positive: true },
  { label: "AI Agents Active",  value: "9", icon: Bot,      sub: "Always available",  positive: true },
  { label: "Markets Covered",   value: "50+", icon: Globe2, sub: "Global coverage",   positive: true },
  { label: "Avg Analysis Time", value: "<30s", icon: Cpu,   sub: "Per service",       positive: true },
];

export default function Dashboard() {
  const { t } = useI18n();
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero */}
      <div className="rounded-2xl p-8 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, hsl(216 52% 10%), hsl(216 52% 13%))", border: "1px solid hsl(38 95% 52% / 0.2)" }}>
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle at 80% 20%, hsl(38 95% 52%), transparent 60%)" }} />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Globe2 className="h-5 w-5" style={{ color: "hsl(38 95% 52%)" }} />
            <span className="data-pill-amber">AI-Powered Consultancy Platform</span>
          </div>
          <h1 className="text-3xl font-bold font-display mb-2" style={{ color: "hsl(210 40% 94%)" }}>
            {t.dash_title}
          </h1>
          <p className="text-base max-w-2xl" style={{ color: "hsl(215 25% 60%)" }}>
            {t.dash_subtitle}
          </p>
          <div className="flex items-center gap-3 mt-5 flex-wrap">
            <Link to="/market-entry"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
              Start Market Analysis <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/feasibility-study"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold"
              style={{ background: "hsl(216 45% 18%)", color: "hsl(210 40% 85%)", border: "1px solid hsl(var(--border))" }}>
              Full Feasibility Study
            </Link>
            <Link to="/agents"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold"
              style={{ background: "hsl(216 45% 18%)", color: "hsl(210 40% 85%)", border: "1px solid hsl(var(--border))" }}>
              <Bot className="h-4 w-4" /> AI Agents
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="rounded-xl p-4" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <div className="flex items-center gap-2 mb-2">
              <s.icon className="h-4 w-4" style={{ color: "hsl(38 95% 52%)" }} />
              <span className="text-xs" style={{ color: "hsl(215 25% 55%)" }}>{s.label}</span>
            </div>
            <p className="text-2xl font-bold font-display" style={{ color: "hsl(38 95% 60%)" }}>{s.value}</p>
            <p className="text-xs mt-0.5" style={{ color: "hsl(215 25% 48%)" }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Services Grid */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold font-display" style={{ color: "hsl(210 40% 90%)" }}>{t.dash_services}</h2>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4" style={{ color: "hsl(158 64% 55%)" }} />
            <span className="text-xs" style={{ color: "hsl(215 25% 55%)" }}>Each service has a dedicated AI agent</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {services.map(s => {
            const c = colorMap[s.color];
            return (
              <Link key={s.url} to={s.url}
                className="rounded-xl p-5 flex flex-col gap-3 transition-all hover:scale-[1.01] hover:shadow-lg group"
                style={{ background: c.bg, border: `1px solid ${c.border}` }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold font-mono-data" style={{ color: c.text }}>{s.num}</span>
                    <s.icon className="h-4 w-4" style={{ color: c.text }} />
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Bot className="h-3 w-3" style={{ color: c.text }} />
                    <span className="text-[10px]" style={{ color: c.text }}>{s.agent}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold font-display mb-1" style={{ color: "hsl(210 40% 90%)" }}>{s.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: "hsl(215 25% 58%)" }}>{s.desc}</p>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {s.tags.map(tag => <span key={tag} className={s.color === "amber" ? "data-pill-amber" : s.color === "green" ? "data-pill-green" : s.color === "blue" ? "data-pill-blue" : "data-pill-red"} style={{ fontSize: "10px", padding: "1px 8px" }}>{tag}</span>)}
                </div>
                <div className="flex items-center gap-1 pt-1 border-t" style={{ borderColor: c.border }}>
                  <span className="text-xs font-medium flex-1" style={{ color: c.text }}>Open Service</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" style={{ color: c.text }} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick links row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/agents" className="rounded-xl p-5 flex items-center gap-4 transition-all hover:opacity-90"
          style={{ background: "hsl(217 91% 53% / 0.08)", border: "1px solid hsl(217 91% 53% / 0.25)" }}>
          <div className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "hsl(217 91% 53% / 0.15)" }}>
            <Bot className="h-5 w-5" style={{ color: "hsl(217 91% 70%)" }} />
          </div>
          <div>
            <p className="font-semibold text-sm font-display" style={{ color: "hsl(217 91% 70%)" }}>AI Agent Workspace</p>
            <p className="text-xs" style={{ color: "hsl(215 25% 55%)" }}>Monitor all 9 active advisory agents, view run history & accuracy scores</p>
          </div>
          <ArrowRight className="h-4 w-4 ms-auto shrink-0" style={{ color: "hsl(217 91% 70%)" }} />
        </Link>
        <Link to="/documents" className="rounded-xl p-5 flex items-center gap-4 transition-all hover:opacity-90"
          style={{ background: "hsl(158 64% 40% / 0.08)", border: "1px solid hsl(158 64% 40% / 0.25)" }}>
          <div className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "hsl(158 64% 40% / 0.15)" }}>
            <FolderOpen className="h-5 w-5" style={{ color: "hsl(158 64% 55%)" }} />
          </div>
          <div>
            <p className="font-semibold text-sm font-display" style={{ color: "hsl(158 64% 55%)" }}>Document Hub</p>
            <p className="text-xs" style={{ color: "hsl(215 25% 55%)" }}>Upload, manage and analyse all client documents — PDF, Excel, Word, CSV</p>
          </div>
          <ArrowRight className="h-4 w-4 ms-auto shrink-0" style={{ color: "hsl(158 64% 55%)" }} />
        </Link>
      </div>
    </div>
  );
}
