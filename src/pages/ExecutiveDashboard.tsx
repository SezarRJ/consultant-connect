import { Link } from "react-router-dom";
import {
  DollarSign, TrendingUp, Users, Clock, CheckCircle2,
  AlertTriangle, Activity, Target, ArrowRight, BarChart2,
  Star, Calendar, Briefcase, PieChart, Zap, Globe2
} from "lucide-react";

// ── Empty state — real data comes from the database / stores ─────────────────
const PORTFOLIO = {
  totalRevenue:    0,
  collected:       0,
  pipeline:        0,
  activeProjects:  0,
  completedYTD:    0,
  avgNPS:          0,
  utilization:     0,
  teamSize:        0,
};

const ENGAGEMENTS: any[] = [];
const PIPELINE: any[] = [];
const TEAM: any[] = [];
const RECENT_WINS: any[] = [];

const H_COLORS: Record<string, string> = {
  on_track: "hsl(158 64% 55%)", at_risk: "hsl(38 95% 60%)", critical: "hsl(0 72% 68%)", pipeline: "hsl(217 91% 70%)"
};
const H_LABELS: Record<string, string> = {
  on_track: "On Track", at_risk: "At Risk", critical: "Critical", pipeline: "Pipeline"
};

const Stat = ({ label, value, sub, color, icon: Icon }: any) => (
  <div className="rounded-xl p-4 bg-card border border-border">
    <div className="flex items-center gap-2 mb-2">
      <Icon className="h-4 w-4" style={{ color }} />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
    <p className="text-2xl font-bold" style={{ color }}>{value}</p>
    {sub && <p className="text-[11px] mt-0.5 text-muted-foreground">{sub}</p>}
  </div>
);

const SectionHeader = ({ title, link, linkLabel }: { title: string; link?: string; linkLabel?: string }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-base font-semibold text-foreground">{title}</h2>
    {link && (
      <Link to={link} className="inline-flex items-center gap-1 text-xs font-semibold text-accent-foreground hover:text-accent">
        {linkLabel} <ArrowRight className="h-3 w-3" />
      </Link>
    )}
  </div>
);

const EmptyState = ({ message }: { message: string }) => (
  <div className="rounded-xl p-8 bg-card border border-border text-center">
    <p className="text-sm text-muted-foreground">{message}</p>
  </div>
);

export default function ExecutiveDashboard() {
  const collectionRate = PORTFOLIO.totalRevenue > 0 ? Math.round(PORTFOLIO.collected / PORTFOLIO.totalRevenue * 100) : 0;
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
                EXECUTIVE VIEW
              </span>
            </div>
            <h1 className="text-2xl font-bold font-display" style={{ color: "hsl(210 40% 94%)" }}>
              Consultancy Performance Summary
            </h1>
            <p className="text-sm mt-1 max-w-xl text-muted-foreground">
              Portfolio health, revenue tracking, team utilization, and pipeline — all at a glance.
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <p className="text-3xl font-bold" style={{ color: "hsl(38 95% 60%)" }}>
              ${(PORTFOLIO.totalRevenue / 1000).toFixed(0)}K
            </p>
            <p className="text-xs text-muted-foreground">Total Active Portfolio</p>
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
        <Stat label="Avg Billing Rate" value="—"    sub="No data yet"            color="hsl(38 95% 60%)"  icon={Clock}       />
        <Stat label="Win Rate"        value="—"        sub="No data yet"     color="hsl(158 64% 55%)" icon={Target}       />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Active Engagements */}
        <div className="lg:col-span-2">
          <SectionHeader title="Active Engagement Portfolio" link="/engagement-tracker" linkLabel="Full Tracker" />
          {ENGAGEMENTS.length === 0 ? (
            <EmptyState message="No active engagements yet. Create one to get started." />
          ) : (
            <div className="space-y-3">
              {ENGAGEMENTS.map((e, i) => (
                <div key={i} className="rounded-xl p-4 bg-card border border-border">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">{e.name}</p>
                      <p className="text-xs text-muted-foreground">{e.client} · Lead: {e.lead}</p>
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
                      <div className="flex justify-between text-[10px] mb-1 text-muted-foreground">
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
                      <p className="text-[10px] text-muted-foreground">{e.phase}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pipeline + Team */}
        <div className="space-y-6">

          {/* Pipeline */}
          <div>
            <SectionHeader title="Sales Pipeline" link="/crm" linkLabel="Open CRM" />
            {PIPELINE.length === 0 ? (
              <EmptyState message="No pipeline deals yet." />
            ) : (
              <div className="rounded-xl overflow-hidden bg-card border border-border">
                {PIPELINE.map((p, i) => (
                  <div key={i} className="px-4 py-3" style={{ borderTop: i > 0 ? "1px solid hsl(var(--border))" : "none" }}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate text-foreground">{p.name}</p>
                        <p className="text-[10px] text-muted-foreground">{p.stage}</p>
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
            )}
          </div>

          {/* Team Utilization */}
          <div>
            <SectionHeader title="Team Utilization" />
            {TEAM.length === 0 ? (
              <EmptyState message="No team data yet." />
            ) : (
              <div className="rounded-xl overflow-hidden bg-card border border-border">
                {TEAM.slice(0, 4).map((m, i) => (
                  <div key={i} className="px-4 py-3" style={{ borderTop: i > 0 ? "1px solid hsl(var(--border))" : "none" }}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div>
                        <p className="text-xs font-semibold text-foreground">{m.name.split(" ")[0]}</p>
                        <p className="text-[9px] text-muted-foreground">{m.role} · {m.hours}h/wk</p>
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
            )}
          </div>

          {/* Recent Wins */}
          <div>
            <SectionHeader title="Recent Wins" />
            {RECENT_WINS.length === 0 ? (
              <EmptyState message="No completed engagements yet." />
            ) : (
              <div className="rounded-xl overflow-hidden bg-card border border-border">
                {RECENT_WINS.map((w, i) => (
                  <div key={i} className="px-4 py-3 flex items-start gap-3"
                    style={{ borderTop: i > 0 ? "1px solid hsl(var(--border))" : "none" }}>
                    <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "hsl(158 64% 55%)" }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground">{w.title}</p>
                      <p className="text-[10px] text-muted-foreground">{w.date}</p>
                    </div>
                    <p className="text-xs font-bold shrink-0" style={{ color: "hsl(158 64% 55%)" }}>
                      ${(w.value / 1000).toFixed(0)}K
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl p-5 bg-card border border-border">
        <h2 className="text-sm font-semibold mb-4 text-foreground">Quick Actions</h2>
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
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90 ${
                a.primary ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground border border-border"
              }`}>
              <a.icon className="h-4 w-4" />{a.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
