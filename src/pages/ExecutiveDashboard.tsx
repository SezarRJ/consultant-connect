import { Link } from "react-router-dom";
import {
  DollarSign, TrendingUp, Users, Clock, CheckCircle2,
  AlertTriangle, Activity, Target, ArrowRight, BarChart2,
  Star, Calendar, Briefcase, PieChart, Zap, Globe2
} from "lucide-react";

// ── Mock data — in production this would come from your stores ────────────────
const PORTFOLIO = {
  totalRevenue:    247000,
  collected:       189000,
  pipeline:        185000,
  activeProjects:  4,
  completedYTD:    3,
  avgNPS:          8.4,
  utilization:     78,
  teamSize:        6,
};

const ENGAGEMENTS = [
  { name: "Baghdad FMCG — Unilever",       client: "Unilever Iraq",     health: "on_track", phase: "Analysis",  value: 42000, billed: 22000, burned: 52, nps: 9,    lead: "Ahmad" },
  { name: "Erbil Tower Feasibility",        client: "Kurdistan Group",   health: "at_risk",  phase: "Delivery",  value: 85000, billed: 68000, burned: 88, nps: 7,    lead: "Nour"  },
  { name: "ISO 9001 — Basra Oil",           client: "Gulf Oil Services", health: "on_track", phase: "Discovery", value: 28000, billed: 5600,  burned: 20, nps: null, lead: "Sara"  },
  { name: "Jordan Pharma Export",           client: "Hikma Pharma",      health: "pipeline", phase: "Pipeline",  value: 35000, billed: 0,     burned: 0,  nps: null, lead: "Omar"  },
];

const PIPELINE = [
  { name: "UAE F&B Market Entry",     value: 38000, stage: "Proposal Sent",     prob: 70, close: "Apr 2026" },
  { name: "KSA Retail Expansion",     value: 55000, stage: "Discovery",         prob: 40, close: "May 2026" },
  { name: "Iraq Telecom Strategy",    value: 42000, stage: "Proposal Sent",     prob: 60, close: "Apr 2026" },
  { name: "Bahrain Fintech Entry",    value: 32000, stage: "Initial Contact",   prob: 25, close: "Jun 2026" },
  { name: "Iraq Healthcare Study",    value: 18000, stage: "Needs Assessment",  prob: 55, close: "Apr 2026" },
];

const TEAM = [
  { name: "Ahmad Al-Rashidi", role: "Senior Consultant", active: 2, hours: 42, util: 85 },
  { name: "Sara Khalil",       role: "Consultant",        active: 1, hours: 36, util: 72 },
  { name: "Nour Mahmoud",      role: "Senior Consultant", active: 1, hours: 44, util: 88 },
  { name: "Omar Hassan",       role: "Consultant",        active: 1, hours: 28, util: 56 },
  { name: "Layla Ibrahim",     role: "Analyst",           active: 0, hours: 20, util: 40 },
  { name: "Karim Jaber",       role: "Consultant",        active: 1, hours: 38, util: 76 },
];

const RECENT_WINS = [
  { title: "UAE F&B Brand Expansion delivered",       date: "Jan 2026", value: 22000 },
  { title: "Jordan Distribution Strategy completed",  date: "Dec 2025", value: 31000 },
  { title: "Baghdad Real Estate Feasibility closed",  date: "Nov 2025", value: 48000 },
];

const H_COLORS: Record<string, string> = {
  on_track: "hsl(158 64% 55%)", at_risk: "hsl(38 95% 60%)", critical: "hsl(0 72% 68%)", pipeline: "hsl(217 91% 70%)"
};
const H_LABELS: Record<string, string> = {
  on_track: "On Track", at_risk: "At Risk", critical: "Critical", pipeline: "Pipeline"
};

const Stat = ({ label, value, sub, color, icon: Icon }: any) => (
  <div className="rounded-xl p-4" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
    <div className="flex items-center gap-2 mb-2">
      <Icon className="h-4 w-4" style={{ color }} />
      <span className="text-xs" style={{ color: "hsl(215 25% 50%)" }}>{label}</span>
    </div>
    <p className="text-2xl font-bold" style={{ color }}>{value}</p>
    {sub && <p className="text-[11px] mt-0.5" style={{ color: "hsl(215 25% 40%)" }}>{sub}</p>}
  </div>
);

const SectionHeader = ({ title, link, linkLabel }: { title: string; link?: string; linkLabel?: string }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-base font-semibold" style={{ color: "hsl(210 40% 88%)" }}>{title}</h2>
    {link && (
      <Link to={link} className="inline-flex items-center gap-1 text-xs font-semibold"
        style={{ color: "hsl(38 95% 60%)" }}>
        {linkLabel} <ArrowRight className="h-3 w-3" />
      </Link>
    )}
  </div>
);

export default function ExecutiveDashboard() {
  const collectionRate = Math.round(PORTFOLIO.collected / PORTFOLIO.totalRevenue * 100);
  const weightedPipeline = PIPELINE.reduce((s, p) => s + p.value * p.prob / 100, 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, hsl(216 52% 9%), hsl(216 52% 12%))", border: "1px solid hsl(38 95% 52% / 0.2)" }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, hsl(38 95% 52%), transparent 60%)" }} />
        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Globe2 className="h-4 w-4" style={{ color: "hsl(38 95% 52%)" }} />
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: "hsl(38 95% 52%/0.15)", color: "hsl(38 95% 60%)" }}>
                EXECUTIVE VIEW — Q1 2026
              </span>
            </div>
            <h1 className="text-2xl font-bold font-display" style={{ color: "hsl(210 40% 94%)" }}>
              Consultancy Performance Summary
            </h1>
            <p className="text-sm mt-1 max-w-xl" style={{ color: "hsl(215 25% 60%)" }}>
              Portfolio health, revenue tracking, team utilization, and pipeline — all at a glance.
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <p className="text-3xl font-bold" style={{ color: "hsl(38 95% 60%)" }}>
              ${(PORTFOLIO.totalRevenue / 1000).toFixed(0)}K
            </p>
            <p className="text-xs" style={{ color: "hsl(215 25% 50%)" }}>Total Active Portfolio</p>
          </div>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Active Projects"   value={`${PORTFOLIO.activeProjects}`}  sub="Live engagements"          color="hsl(38 95% 60%)"  icon={Briefcase}   />
        <Stat label="Collected YTD"     value={`$${(PORTFOLIO.collected/1000).toFixed(0)}K`} sub={`${collectionRate}% of invoiced`} color="hsl(158 64% 55%)" icon={DollarSign} />
        <Stat label="Pipeline (Weighted)" value={`$${(weightedPipeline/1000).toFixed(0)}K`} sub="Probability-adjusted"       color="hsl(217 91% 70%)" icon={TrendingUp}  />
        <Stat label="Team Utilization"  value={`${PORTFOLIO.utilization}%`}    sub={`${PORTFOLIO.teamSize} consultants`} color="hsl(38 95% 60%)" icon={Users}       />
      </div>

      {/* Additional KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Avg Client NPS"  value={`${PORTFOLIO.avgNPS}/10`} sub="Across active projects"  color="hsl(158 64% 55%)" icon={Star}         />
        <Stat label="Completed YTD"   value={`${PORTFOLIO.completedYTD}`}     sub="Engagements closed"      color="hsl(217 91% 70%)" icon={CheckCircle2} />
        <Stat label="Avg Billing Rate" value="$215/hr"    sub="Blended rate"            color="hsl(38 95% 60%)"  icon={Clock}       />
        <Stat label="Win Rate"        value="62%"        sub="Proposals to closed"     color="hsl(158 64% 55%)" icon={Target}       />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Active Engagements */}
        <div className="lg:col-span-2">
          <SectionHeader title="Active Engagement Portfolio" link="/engagement-tracker" linkLabel="Full Tracker" />
          <div className="space-y-3">
            {ENGAGEMENTS.map((e, i) => (
              <div key={i} className="rounded-xl p-4" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: "hsl(210 40% 90%)" }}>{e.name}</p>
                    <p className="text-xs" style={{ color: "hsl(215 25% 50%)" }}>{e.client} · Lead: {e.lead}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {e.nps !== null && (
                      <span className="text-[10px] font-bold" style={{
                        color: e.nps >= 9 ? "hsl(158 64% 55%)" : e.nps >= 7 ? "hsl(38 95% 60%)" : "hsl(0 72% 68%)"
                      }}>NPS {e.nps}</span>
                    )}
                    <span className="text-[9px] px-2 py-0.5 rounded-full font-bold"
                      style={{ background: `${H_COLORS[e.health]}20`, color: H_COLORS[e.health] }}>
                      {H_LABELS[e.health]}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-[10px] mb-1" style={{ color: "hsl(215 25% 45%)" }}>
                      <span>Budget burned</span><span>{e.burned}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "hsl(216 45% 20%)" }}>
                      <div className="h-full rounded-full" style={{
                        width: `${e.burned}%`,
                        background: e.burned > 85 ? "hsl(0 72% 60%)" : e.burned > 65 ? "hsl(38 95% 52%)" : "hsl(158 64% 50%)"
                      }} />
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold" style={{ color: "hsl(38 95% 60%)" }}>
                      ${(e.billed / 1000).toFixed(0)}K / ${(e.value / 1000).toFixed(0)}K
                    </p>
                    <p className="text-[10px]" style={{ color: "hsl(215 25% 45%)" }}>{e.phase}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline + Team */}
        <div className="space-y-6">

          {/* Pipeline */}
          <div>
            <SectionHeader title="Sales Pipeline" link="/crm" linkLabel="Open CRM" />
            <div className="rounded-xl overflow-hidden" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
              {PIPELINE.map((p, i) => (
                <div key={i} className="px-4 py-3" style={{ borderTop: i > 0 ? "1px solid hsl(var(--border))" : "none" }}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: "hsl(210 40% 85%)" }}>{p.name}</p>
                      <p className="text-[10px]" style={{ color: "hsl(215 25% 45%)" }}>{p.stage}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold" style={{ color: "hsl(38 95% 60%)" }}>
                        ${(p.value / 1000).toFixed(0)}K
                      </p>
                      <p className="text-[9px]" style={{ color: p.prob >= 60 ? "hsl(158 64% 55%)" : "hsl(215 25% 45%)" }}>
                        {p.prob}% · {p.close}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Utilization */}
          <div>
            <SectionHeader title="Team Utilization" />
            <div className="rounded-xl overflow-hidden" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
              {TEAM.slice(0, 4).map((m, i) => (
                <div key={i} className="px-4 py-3" style={{ borderTop: i > 0 ? "1px solid hsl(var(--border))" : "none" }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <p className="text-xs font-semibold" style={{ color: "hsl(210 40% 85%)" }}>{m.name.split(" ")[0]}</p>
                      <p className="text-[9px]" style={{ color: "hsl(215 25% 45%)" }}>{m.role} · {m.hours}h/wk</p>
                    </div>
                    <span className="text-xs font-bold" style={{
                      color: m.util >= 80 ? "hsl(38 95% 60%)" : m.util >= 60 ? "hsl(158 64% 55%)" : "hsl(215 25% 50%)"
                    }}>{m.util}%</span>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: "hsl(216 45% 20%)" }}>
                    <div className="h-full rounded-full transition-all" style={{
                      width: `${m.util}%`,
                      background: m.util >= 85 ? "hsl(38 95% 52%)" : m.util >= 60 ? "hsl(158 64% 50%)" : "hsl(215 25% 45%)"
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Wins */}
          <div>
            <SectionHeader title="Recent Wins" />
            <div className="rounded-xl overflow-hidden" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
              {RECENT_WINS.map((w, i) => (
                <div key={i} className="px-4 py-3 flex items-start gap-3"
                  style={{ borderTop: i > 0 ? "1px solid hsl(var(--border))" : "none" }}>
                  <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "hsl(158 64% 55%)" }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium" style={{ color: "hsl(210 40% 82%)" }}>{w.title}</p>
                    <p className="text-[10px]" style={{ color: "hsl(215 25% 45%)" }}>{w.date}</p>
                  </div>
                  <p className="text-xs font-bold shrink-0" style={{ color: "hsl(158 64% 55%)" }}>
                    ${(w.value / 1000).toFixed(0)}K
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl p-5" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: "hsl(210 40% 88%)" }}>Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { label: "New Engagement",       url: "/engagement-tracker",  icon: Briefcase,  primary: true  },
            { label: "Client Brief",         url: "/client-briefing",     icon: Users,      primary: false },
            { label: "Strategy Workshop",    url: "/strategy-workshop",   icon: Target,     primary: false },
            { label: "Generate Proposal",    url: "/proposals",           icon: BarChart2,  primary: false },
            { label: "Run Benchmark",        url: "/benchmarking",        icon: Activity,   primary: false },
            { label: "Stakeholder Map",      url: "/stakeholder-mapper",  icon: Globe2,     primary: false },
          ].map((a, i) => (
            <Link key={i} to={a.url}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
              style={a.primary
                ? { background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }
                : { background: "hsl(216 45% 18%)", color: "hsl(210 40% 80%)", border: "1px solid hsl(var(--border))" }}>
              <a.icon className="h-4 w-4" />{a.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
