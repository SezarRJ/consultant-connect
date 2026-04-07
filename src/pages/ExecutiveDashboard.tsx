import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  DollarSign, TrendingUp, Users, Clock, CheckCircle2,
  AlertTriangle, Activity, Target, ArrowRight, BarChart2,
  Star, Calendar, Briefcase, PieChart, Zap, Globe2, Loader2
} from "lucide-react";

// ── Live data hooks ──────────────────────────────────────────────────────────

function useExecutiveDashboardData() {
  const clients = useQuery({
    queryKey: ["exec-clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("id, name, industry, revenue, health_score, location");
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 2 * 60 * 1000,
  });

  const engagements = useQuery({
    queryKey: ["exec-engagements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("engagements")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 2 * 60 * 1000,
  });

  return {
    clients,
    engagements,
    isLoading: clients.isLoading || engagements.isLoading,
    isError: clients.isError || engagements.isError,
  };
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const H_COLORS: Record<string, string> = {
  on_track:          "hsl(158 64% 55%)",
  "On Track":        "hsl(158 64% 55%)",
  at_risk:           "hsl(38 95% 60%)",
  "Needs Attention": "hsl(38 95% 60%)",
  critical:          "hsl(0 72% 68%)",
  pipeline:          "hsl(217 91% 70%)",
};
const H_LABELS: Record<string, string> = {
  on_track:          "On Track",
  "On Track":        "On Track",
  at_risk:           "At Risk",
  "Needs Attention": "At Risk",
  critical:          "Critical",
  pipeline:          "Pipeline",
};

function statusKey(s: string) {
  if (s === "On Track")       return "on_track";
  if (s === "Needs Attention") return "at_risk";
  return s.toLowerCase().replace(/ /g, "_");
}

// ── Sub-components ───────────────────────────────────────────────────────────

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

// ── Main component ────────────────────────────────────────────────────────────

export default function ExecutiveDashboard() {
  const { clients, engagements, isLoading, isError } = useExecutiveDashboardData();

  const portfolio = useMemo(() => {
    const allEngagements = engagements.data ?? [];
    const allClients     = clients.data     ?? [];

    const currentYear = new Date().getFullYear();
    const active    = allEngagements.filter(e => e.status !== "Complete" && e.status !== "complete");
    const completed = allEngagements.filter(e => {
      const isComplete = e.status === "Complete" || e.status === "complete";
      if (!isComplete) return false;
      const closeDate = e.completed_at || e.due_date;
      if (!closeDate) return true;
      return new Date(closeDate).getFullYear() === currentYear;
    });

    const activeClientIds = new Set(active.map(e => e.client_id));
    const totalRevenue = allClients
      .filter(c => activeClientIds.has(c.id))
      .reduce((sum, c) => {
        const r = parseFloat(String(c.revenue ?? "0").replace(/[^0-9.]/g, ""));
        return sum + (isNaN(r) ? 0 : r);
      }, 0);

    const healthScores = allClients.map(c => c.health_score ?? 0).filter(Boolean);
    const avgHealthRaw = healthScores.length
      ? healthScores.reduce((a, b) => a + b, 0) / healthScores.length
      : 0;
    const avgNPS = (avgHealthRaw / 10).toFixed(1);

    const progresses = active.map(e => e.progress ?? 0);
    const utilization = progresses.length
      ? Math.round(progresses.reduce((a, b) => a + b, 0) / progresses.length)
      : 0;

    return {
      totalRevenue,
      activeProjects: active.length,
      completedYTD:   completed.length,
      clientCount:    allClients.length,
      avgNPS,
      utilization,
    };
  }, [clients.data, engagements.data]);

  const activeEngagements = useMemo(() =>
    (engagements.data ?? [])
      .filter(e => e.status !== "Complete" && e.status !== "complete")
      .sort((a, b) => {
        const order: Record<string, number> = { critical: 0, at_risk: 1, on_track: 2, pipeline: 3 };
        return (order[statusKey(a.status)] ?? 4) - (order[statusKey(b.status)] ?? 4);
      })
      .slice(0, 6)
      .map(e => ({
        name:   e.type,
        client: e.client_name,
        health: statusKey(e.status),
        burned: e.progress ?? 0,
        phase:  e.phase,
      })),
    [engagements.data]
  );

  const recentWins = useMemo(() =>
    (engagements.data ?? [])
      .filter(e => e.status === "Complete" || e.status === "complete")
      .slice(0, 5)
      .map(e => ({
        title: `${e.type} — ${e.client_name}`,
        date:  (e.completed_at || e.due_date)
          ? new Date(e.completed_at || e.due_date).toLocaleDateString()
          : "—",
      })),
    [engagements.data]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">Loading dashboard…</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64 gap-2" style={{ color: "hsl(0 72% 68%)" }}>
        <AlertTriangle className="h-5 w-5" />
        <span className="text-sm">Failed to load dashboard data. Check your Supabase connection.</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, hsl(216 52% 9%), hsl(216 52% 12%))", border: "1px solid hsl(38 95% 52% / 0.2)" }}>
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle at 80% 20%, hsl(38 95% 52%), transparent 60%)" }} />
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
              Portfolio health, revenue tracking, team utilization, and pipeline — live from your database.
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <p className="text-3xl font-bold" style={{ color: "hsl(38 95% 60%)" }}>
              {portfolio.totalRevenue > 0
                ? `$${(portfolio.totalRevenue / 1000).toFixed(0)}K`
                : `${portfolio.activeProjects} Active`}
            </p>
            <p className="text-xs text-muted-foreground">
              {portfolio.totalRevenue > 0 ? "Total Active Portfolio" : "Engagements"}
            </p>
          </div>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Active Projects"
          value={`${portfolio.activeProjects}`}
          sub="Live engagements"
          color="hsl(38 95% 60%)" icon={Briefcase} />
        <Stat label="Collected YTD"
          value="—"
          sub="No billing data yet"
          color="hsl(158 64% 55%)" icon={DollarSign} />
        <Stat label="Pipeline (Weighted)"
          value="—"
          sub="Add CRM deals to track"
          color="hsl(217 91% 70%)" icon={TrendingUp} />
        <Stat label="Avg Progress"
          value={`${portfolio.utilization}%`}
          sub={`Across ${portfolio.activeProjects} engagements`}
          color="hsl(38 95% 60%)" icon={Users} />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Avg Client Health"
          value={`${portfolio.avgNPS}/10`}
          sub="From health score data"
          color="hsl(158 64% 55%)" icon={Star} />
        <Stat label="Completed YTD"
          value={`${portfolio.completedYTD}`}
          sub="Engagements closed"
          color="hsl(217 91% 70%)" icon={CheckCircle2} />
        <Stat label="Clients Served"
          value={`${portfolio.clientCount}`}
          sub="Active client accounts"
          color="hsl(38 95% 60%)" icon={Clock} />
        <Stat label="Win Rate"
          value="—"
          sub="No pipeline data yet"
          color="hsl(158 64% 55%)" icon={Target} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Active Engagements */}
        <div className="lg:col-span-2">
          <SectionHeader title="Active Engagement Portfolio" link="/engagement-tracker" linkLabel="Full Tracker" />
          {activeEngagements.length === 0 ? (
            <EmptyState message="No active engagements yet. Create one to get started." />
          ) : (
            <div className="space-y-3">
              {activeEngagements.map((e, i) => (
                <div key={i} className="rounded-xl p-4 bg-card border border-border">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">{e.name}</p>
                      <p className="text-xs text-muted-foreground">{e.client}</p>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded-full font-bold"
                      style={{
                        background: `${H_COLORS[e.health] ?? "hsl(215 25% 45%)"}20`,
                        color: H_COLORS[e.health] ?? "hsl(215 25% 45%)"
                      }}>
                      {H_LABELS[e.health] ?? e.health}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-[10px] mb-1 text-muted-foreground">
                        <span>Progress</span><span>{e.burned}%</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "hsl(216 45% 20%)" }}>
                        <div className="h-full rounded-full" style={{
                          width: `${e.burned}%`,
                          background: e.burned > 85 ? "hsl(0 72% 60%)" : e.burned > 65 ? "hsl(38 95% 52%)" : "hsl(158 64% 50%)"
                        }} />
                      </div>
                    </div>
                    <p className="text-xs font-bold shrink-0" style={{ color: "hsl(38 95% 60%)" }}>
                      {e.phase}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">

          {/* Pipeline placeholder */}
          <div>
            <SectionHeader title="Sales Pipeline" link="/crm" linkLabel="Open CRM" />
            <EmptyState message="No pipeline deals yet. Add deals in the CRM." />
          </div>

          {/* Recent Wins */}
          <div>
            <SectionHeader title="Recent Wins" />
            {recentWins.length === 0 ? (
              <EmptyState message="No completed engagements yet." />
            ) : (
              <div className="rounded-xl overflow-hidden bg-card border border-border">
                {recentWins.map((w, i) => (
                  <div key={i} className="px-4 py-3 flex items-start gap-3"
                    style={{ borderTop: i > 0 ? "1px solid hsl(var(--border))" : "none" }}>
                    <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "hsl(158 64% 55%)" }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground">{w.title}</p>
                      <p className="text-[10px] text-muted-foreground">{w.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Client Health */}
          <div>
            <SectionHeader title="Client Health" link="/clients" linkLabel="All Clients" />
            {(clients.data ?? []).length === 0 ? (
              <EmptyState message="No clients yet." />
            ) : (
              <div className="rounded-xl overflow-hidden bg-card border border-border">
                {(clients.data ?? []).slice(0, 5).map((c: any, i: number) => (
                  <div key={c.id} className="px-4 py-3 flex items-center justify-between"
                    style={{ borderTop: i > 0 ? "1px solid hsl(var(--border))" : "none" }}>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{c.name}</p>
                      <p className="text-[10px] text-muted-foreground">{c.industry}</p>
                    </div>
                    <span className="text-xs font-bold" style={{
                      color: (c.health_score ?? 0) >= 70
                        ? "hsl(158 64% 55%)"
                        : (c.health_score ?? 0) >= 40
                        ? "hsl(38 95% 60%)"
                        : "hsl(0 72% 68%)"
                    }}>
                      {c.health_score ?? 0}/100
                    </span>
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
            { label: "New Engagement",    url: "/engagement-tracker", icon: Briefcase, primary: true  },
            { label: "Client Brief",      url: "/client-briefing",    icon: Users,     primary: false },
            { label: "Strategy Workshop", url: "/strategy-workshop",  icon: Target,    primary: false },
            { label: "Generate Proposal", url: "/proposals",          icon: BarChart2, primary: false },
            { label: "Run Benchmark",     url: "/benchmarking",       icon: Activity,  primary: false },
            { label: "Stakeholder Map",   url: "/stakeholder-mapper", icon: Globe2,    primary: false },
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
