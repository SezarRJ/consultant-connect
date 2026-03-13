import { Link } from "react-router-dom";
import {
  TrendingUp, Users, BarChart2, DollarSign, ShieldAlert,
  Handshake, Zap, PackageCheck, FileBarChart2, ArrowRight,
  Globe2, Activity, CheckCircle2, AlertTriangle
} from "lucide-react";

const services = [
  {
    num: "01", title: "Market Entry Analysis", url: "/market-entry", icon: TrendingUp,
    desc: "Comprehensive Iraq market opportunity assessment with pricing, demand, and entry strategy.",
    color: "amber", tags: ["Market Size", "Entry Strategy", "Cities"],
  },
  {
    num: "02", title: "Distributor Finder", url: "/distributor-finder", icon: Users,
    desc: "Locate certified distributors and reliable wholesalers in Erbil, Baghdad & Basra.",
    color: "green", tags: ["Baghdad", "Erbil", "Basra"],
  },
  {
    num: "03", title: "Competitor Analysis", url: "/competitor-analysis", icon: BarChart2,
    desc: "Competing brands, country of origin, price ranges, and distribution strength.",
    color: "blue", tags: ["Brands", "Pricing", "Strategy"],
  },
  {
    num: "04", title: "Pricing Intelligence", url: "/pricing-intelligence", icon: DollarSign,
    desc: "Wholesale price, retail price, distributor margin & retailer margin benchmarking.",
    color: "amber", tags: ["Wholesale", "Retail", "Margins"],
  },
  {
    num: "05", title: "Risk Assessment", url: "/risk-assessment", icon: ShieldAlert,
    desc: "Payment risk, logistics, legal barriers, customs issues & mitigation strategies.",
    color: "red", tags: ["Customs", "Legal", "Payment"],
  },
  {
    num: "06", title: "Partner Matchmaking", url: "/partner-matchmaking", icon: Handshake,
    desc: "Match with verified Iraqi distributors, agents, and logistics providers.",
    color: "green", tags: ["Distributors", "Agents", "Logistics"],
  },
  {
    num: "07", title: "Sales Strategy", url: "/sales-strategy", icon: Zap,
    desc: "Supermarket chains, wholesalers, cash van distribution & e-commerce strategy.",
    color: "blue", tags: ["Supermarkets", "Wholesale", "E-comm"],
  },
  {
    num: "08", title: "Export Readiness", url: "/export-readiness", icon: PackageCheck,
    desc: "Packaging compliance, Arabic labeling, pricing competitiveness & logistics check.",
    color: "amber", tags: ["Labeling", "Packaging", "Logistics"],
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  amber: {
    bg: "hsl(38 95% 52% / 0.08)",
    text: "hsl(38 95% 60%)",
    border: "hsl(38 95% 52% / 0.25)",
    icon: "hsl(38 95% 52% / 0.15)",
  },
  green: {
    bg: "hsl(158 64% 40% / 0.08)",
    text: "hsl(158 64% 55%)",
    border: "hsl(158 64% 40% / 0.25)",
    icon: "hsl(158 64% 40% / 0.15)",
  },
  blue: {
    bg: "hsl(217 91% 53% / 0.08)",
    text: "hsl(217 91% 70%)",
    border: "hsl(217 91% 53% / 0.25)",
    icon: "hsl(217 91% 53% / 0.15)",
  },
  red: {
    bg: "hsl(0 72% 51% / 0.08)",
    text: "hsl(0 72% 68%)",
    border: "hsl(0 72% 51% / 0.25)",
    icon: "hsl(0 72% 51% / 0.15)",
  },
};

const stats = [
  { label: "Iraq GDP (2024)", value: "$264B", icon: Activity, sub: "+3.4% growth", positive: true },
  { label: "Import Market Size", value: "$40B+", icon: Globe2, sub: "Annual imports", positive: true },
  { label: "Consumer Base", value: "42M+", icon: Users, sub: "Population", positive: true },
  { label: "Market Risk Level", value: "Medium", icon: AlertTriangle, sub: "Manageable risk", positive: false },
];

const highlights = [
  { icon: CheckCircle2, text: "Iraq is the 2nd largest Arab economy with growing consumer demand", color: "green" },
  { icon: CheckCircle2, text: "Food, FMCG, healthcare & construction lead import categories", color: "green" },
  { icon: CheckCircle2, text: "Erbil (KRG) offers most business-friendly environment in Iraq", color: "green" },
  { icon: AlertTriangle, text: "USD cash economy — plan for payment risk & letter of credit", color: "amber" },
];

export default function Dashboard() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero */}
      <div className="rounded-2xl p-8 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, hsl(216 52% 10%), hsl(216 52% 13%))", border: "1px solid hsl(38 95% 52% / 0.2)" }}>
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle at 80% 20%, hsl(38 95% 52%), transparent 60%)" }} />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🇮🇶</span>
            <span className="data-pill-amber">Iraq Market Intelligence Platform</span>
          </div>
          <h1 className="text-3xl font-bold font-display mb-2" style={{ color: "hsl(210 40% 94%)" }}>
            Iraq Market Entry & Business<br />Intelligence Platform
          </h1>
          <p className="text-base max-w-2xl" style={{ color: "hsl(215 25% 60%)" }}>
            Your AI-powered advisor for entering and scaling in the Iraqi market. From pricing intelligence to distributor matchmaking — every tool you need for success in Iraq.
          </p>
          <div className="flex items-center gap-3 mt-5">
            <Link to="/market-entry"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
              Start Market Analysis <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/feasibility-study"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all"
              style={{ background: "hsl(216 45% 18%)", color: "hsl(210 40% 85%)", border: "1px solid hsl(var(--border))" }}>
              Full Feasibility Study
            </Link>
          </div>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, sub, positive }) => (
          <div key={label} className="rounded-xl p-4" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium" style={{ color: "hsl(215 25% 55%)" }}>{label}</span>
              <div className="h-7 w-7 rounded-lg flex items-center justify-center"
                style={{ background: "hsl(38 95% 52% / 0.1)" }}>
                <Icon className="h-3.5 w-3.5" style={{ color: "hsl(38 95% 52%)" }} />
              </div>
            </div>
            <p className="text-xl font-bold font-display" style={{ color: "hsl(38 95% 60%)" }}>{value}</p>
            <p className="text-xs mt-0.5" style={{ color: positive ? "hsl(158 64% 50%)" : "hsl(38 95% 52%)" }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Market Highlights */}
      <div className="rounded-xl p-5" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <h2 className="text-sm font-semibold font-display mb-4" style={{ color: "hsl(210 40% 85%)" }}>Iraq Market Snapshot</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {highlights.map(({ icon: Icon, text, color }) => (
            <div key={text} className="flex items-start gap-2.5">
              <Icon className="h-4 w-4 mt-0.5 shrink-0"
                style={{ color: color === "green" ? "hsl(158 64% 50%)" : "hsl(38 95% 52%)" }} />
              <p className="text-sm" style={{ color: "hsl(215 25% 65%)" }}>{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div>
        <div className="flex items-center gap-2 mb-5">
          <div className="h-1 w-6 rounded-full" style={{ background: "hsl(38 95% 52%)" }} />
          <h2 className="text-lg font-bold font-display" style={{ color: "hsl(210 40% 92%)" }}>Advisory Services</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {services.map((s) => {
            const c = colorMap[s.color];
            const Icon = s.icon;
            return (
              <Link key={s.url} to={s.url}
                className="rounded-xl p-5 group transition-all hover:scale-[1.02] hover:shadow-lg cursor-pointer"
                style={{ background: c.bg, border: `1px solid ${c.border}` }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="h-9 w-9 rounded-lg flex items-center justify-center"
                    style={{ background: c.icon }}>
                    <Icon className="h-4.5 w-4.5" style={{ color: c.text }} />
                  </div>
                  <span className="font-mono-data text-xs font-bold opacity-40">{s.num}</span>
                </div>
                <h3 className="text-sm font-semibold font-display mb-1.5" style={{ color: c.text }}>{s.title}</h3>
                <p className="text-xs leading-relaxed mb-3" style={{ color: "hsl(215 25% 58%)" }}>{s.desc}</p>
                <div className="flex flex-wrap gap-1">
                  {s.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                      style={{ background: "hsl(216 45% 15%)", color: "hsl(215 25% 55%)", border: "1px solid hsl(var(--border))" }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1 mt-3 group-hover:gap-2 transition-all"
                  style={{ color: c.text }}>
                  <span className="text-xs font-medium">Launch Tool</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Feasibility CTA */}
      <div className="rounded-xl p-6 flex items-center justify-between"
        style={{ background: "hsl(158 64% 40% / 0.08)", border: "1px solid hsl(158 64% 40% / 0.25)" }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileBarChart2 className="h-4 w-4" style={{ color: "hsl(158 64% 55%)" }} />
            <span className="text-sm font-semibold font-display" style={{ color: "hsl(158 64% 55%)" }}>Full Market Feasibility Study & Business Plan</span>
          </div>
          <p className="text-sm" style={{ color: "hsl(215 25% 58%)" }}>
            Get a complete detailed report: Is your product suitable? Right price? Where to sell? Who are competitors? Find certified distributors.
          </p>
        </div>
        <Link to="/feasibility-study"
          className="ml-6 shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: "hsl(158 64% 40%)", color: "#fff" }}>
          Generate Report <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
