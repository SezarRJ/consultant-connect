/**
 * Dashboard.tsx  — redesigned for engagement-centered architecture
 * ─────────────────────────────────────────────────────────────────
 * Shows: active engagement summary, workflow steps, portfolio KPIs,
 * quick-launch for the 5 service hubs, and recent activity feed.
 * All data is pulled from the engagement store, not static mocks.
 * ─────────────────────────────────────────────────────────────────
 */
import { Link } from "react-router-dom";
import {
  Briefcase, BarChart2, Lightbulb, FileOutput, Building2,
  Globe2, ArrowRight, Plus, AlertTriangle, CheckCircle2,
  TrendingUp, Clock, Activity, ChevronRight, Zap,
  Users, FolderKanban, MessageSquare
} from "lucide-react";
import { useEngagementStore } from "@/store/engagementStore";
import { useI18n } from "@/lib/i18n";

// ── The 5 service hubs ─────────────────────────────────────────────
const HUBS = [
  {
    url: "/engagement",
    label: "Engagement",
    labelAr: "إدارة المشروع",
    icon: Briefcase,
    color: "hsl(38 95% 52%)",
    bg: "hsl(38 95% 52% / 0.08)",
    border: "hsl(38 95% 52% / 0.22)",
    sub: "Briefing · Stakeholders · Tracker",
    step: "A",
  },
  {
    url: "/analysis",
    label: "Analysis",
    labelAr: "التحليل",
    icon: BarChart2,
    color: "hsl(200 80% 55%)",
    bg: "hsl(200 80% 55% / 0.08)",
    border: "hsl(200 80% 55% / 0.22)",
    sub: "Market · Competitor · Risk · 5 more",
    step: "B",
  },
  {
    url: "/strategy",
    label: "Strategy",
    labelAr: "الاستراتيجية",
    icon: Lightbulb,
    color: "hsl(270 70% 65%)",
    bg: "hsl(270 70% 65% / 0.08)",
    border: "hsl(270 70% 65% / 0.22)",
    sub: "Workshop · Benchmarking · Playbooks",
    step: "C",
  },
  {
    url: "/deliverables",
    label: "Deliverables",
    labelAr: "المخرجات",
    icon: FileOutput,
    color: "hsl(145 65% 48%)",
    bg: "hsl(145 65% 48% / 0.08)",
    border: "hsl(145 65% 48% / 0.22)",
    sub: "Proposal · Report · Exec Summary",
    step: "D",
  },
  {
    url: "/practice-ops",
    label: "Practice Ops",
    labelAr: "إدارة المكتب",
    icon: Building2,
    color: "hsl(217 91% 68%)",
    bg: "hsl(217 91% 68% / 0.08)",
    border: "hsl(217 91% 68% / 0.22)",
    sub: "CRM · Projects · Tasks · Financial",
    step: "E",
  },
];

// ── Workflow steps ─────────────────────────────────────────────────
const WORKFLOW = [
  { step: "1", label: "Open Engagement",  url: "/engagement",    icon: Briefcase  },
  { step: "2", label: "Run Analysis",     url: "/analysis",      icon: BarChart2  },
  { step: "3", label: "Build Strategy",   url: "/strategy",      icon: Lightbulb  },
  { step: "4", label: "Generate Output",  url: "/deliverables",  icon: FileOutput },
  { step: "5", label: "Track Execution",  url: "/practice-ops",  icon: Activity   },
];

// ── Optional specialist modules ────────────────────────────────────
const SPECIALIST = [
  { label: "Real Estate Intel",  url: "/real-estate-intelligence", icon: Building2    },
  { label: "ISO Preparation",    url: "/iso-preparation",          icon: CheckCircle2 },
  { label: "Company Development",url: "/company-development",      icon: TrendingUp   },
  { label: "AI Assistant",       url: "/ai-assistant",             icon: MessageSquare},
  { label: "AI Agents",          url: "/agents",                   icon: Zap          },
  { label: "Service Modules",    url: "/service-modules",          icon: Users        },
];

// ── Phase badge color ──────────────────────────────────────────────
const phaseColor: Record<string, string> = {
  Discovery: "hsl(38 95% 52%)",
  Analysis:  "hsl(200 80% 55%)",
  Strategy:  "hsl(270 70% 65%)",
  Delivery:  "hsl(145 65% 48%)",
  Review:    "hsl(30 90% 55%)",
  Closed:    "hsl(215 25% 45%)",
};

export default function Dashboard() {
  const { lang } = useI18n();
  const { engagements, activeEngagementId, setActiveEngagement, getActiveEngagement } =
    useEngagementStore();
  const active = getActiveEngagement();

  const activeCount    = engagements.filter((e) => e.status === "Active").length;
  const completedCount = engagements.filter((e) => e.status === "Completed").length;
  const phases = ["Discovery","Analysis","Strategy","Delivery","Review"];
  const inFlightCount  = engagements.filter((e) => phases.includes(e.phase)).length;

  return (
    <div className="space-y-7 max-w-6xl mx-auto">

      {/* ── Hero ── */}
      <div className="rounded-2xl p-7 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, hsl(216 52% 9%), hsl(216 52% 12%))", border: "1px solid hsl(38 95% 52% / 0.18)" }}>
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle at 85% 15%, hsl(38 95% 52%), transparent 55%)" }} />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Globe2 className="h-4 w-4" style={{ color: "hsl(38 95% 52%)" }} />
              <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
                style={{ background: "hsl(38 95% 52% / 0.12)", color: "hsl(38 95% 60%)" }}>
                {lang === "ar" ? "نظام الاستشارات" : "Engagement OS"}
              </span>
            </div>
            <h1 className="text-2xl font-bold" style={{ color: "hsl(210 40% 94%)" }}>
              {lang === "ar" ? "مرحباً بك في ConsultAI" : "ConsultAI Pro"}
            </h1>
            <p className="text-sm mt-1" style={{ color: "hsl(215 25% 55%)" }}>
              {lang === "ar"
                ? "منصة الاستشارات المتكاملة — من التعاقد إلى التسليم"
                : "One workspace for the full consulting engagement — from brief to delivery."}
            </p>
          </div>

          <Link to="/engagement"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shrink-0 transition-all hover:opacity-90"
            style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
            <Plus className="h-4 w-4" />
            {lang === "ar" ? "مشروع جديد" : "New Engagement"}
          </Link>
        </div>
      </div>

      {/* ── Active engagement card ── */}
      {active ? (
        <div className="rounded-xl p-5"
          style={{ background: "hsl(216 45% 10%)", border: `1px solid ${phaseColor[active.phase]}40` }}>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: `${phaseColor[active.phase]}18`, color: phaseColor[active.phase], border: `1px solid ${phaseColor[active.phase]}35` }}>
                  {active.phase}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full"
                  style={{ background: "hsl(216 45% 18%)", color: "hsl(215 25% 55%)" }}>
                  {active.status}
                </span>
              </div>
              <h2 className="text-lg font-bold" style={{ color: "hsl(210 40% 92%)" }}>{active.clientName}</h2>
              <p className="text-sm" style={{ color: "hsl(215 25% 52%)" }}>
                {active.serviceType} · {active.market} · {active.industry}
              </p>
              {active.objectives && (
                <p className="text-xs mt-1 max-w-lg" style={{ color: "hsl(215 25% 45%)" }}>
                  {active.objectives.slice(0, 120)}{active.objectives.length > 120 ? "…" : ""}
                </p>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              <Link to="/engagement"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
                Open <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Quick-launch tools in context */}
          <div className="flex gap-2 mt-4 flex-wrap">
            {[
              { label: "Run Analysis",  url: "/analysis",     color: "hsl(200 80% 55%)" },
              { label: "Strategy",      url: "/strategy",     color: "hsl(270 70% 65%)" },
              { label: "Deliverables",  url: "/deliverables", color: "hsl(145 65% 48%)" },
            ].map((a) => (
              <Link key={a.url} to={a.url}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
                style={{ background: `${a.color}12`, color: a.color, border: `1px solid ${a.color}25` }}>
                {a.label} <ArrowRight className="h-3 w-3" />
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl p-5 flex items-center gap-4"
          style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(38 85% 45% / 0.25)" }}>
          <AlertTriangle className="h-6 w-6 shrink-0" style={{ color: "hsl(38 85% 52%)" }} />
          <div className="flex-1">
            <p className="text-sm font-semibold" style={{ color: "hsl(210 40% 85%)" }}>No active engagement</p>
            <p className="text-xs mt-0.5" style={{ color: "hsl(215 25% 48%)" }}>
              Create or select an engagement to unlock context-aware AI tools.
            </p>
          </div>
          <Link to="/engagement"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold shrink-0"
            style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
            <Plus className="h-4 w-4" /> Create
          </Link>
        </div>
      )}

      {/* ── Portfolio KPIs ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: lang === "ar" ? "نشط" : "Active",    value: activeCount,    icon: Clock,        color: "hsl(145 65% 48%)" },
          { label: lang === "ar" ? "جارٍ" : "In Flight", value: inFlightCount,  icon: Activity,     color: "hsl(38 95% 52%)"  },
          { label: lang === "ar" ? "مكتمل" : "Completed",value: completedCount, icon: CheckCircle2, color: "hsl(217 91% 68%)" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-xl p-4"
            style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 18%)" }}>
            <Icon className="h-4 w-4 mb-2" style={{ color }} />
            <p className="text-2xl font-bold" style={{ color }}>{value}</p>
            <p className="text-[10px] uppercase tracking-wider font-semibold mt-0.5"
              style={{ color: "hsl(215 25% 42%)" }}>{label}</p>
          </div>
        ))}
      </div>

      {/* ── Recommended workflow ── */}
      <div>
        <p className="text-[10px] uppercase tracking-widest font-semibold mb-3"
          style={{ color: "hsl(215 25% 40%)" }}>
          {lang === "ar" ? "مسار العمل الموصى به" : "Recommended Workflow"}
        </p>
        <div className="flex items-stretch gap-0">
          {WORKFLOW.map((w, i) => (
            <div key={w.step} className="flex items-center flex-1">
              <Link to={w.url}
                className="flex flex-col items-center gap-2 flex-1 px-2 py-4 rounded-xl text-center transition-all hover:opacity-80 group"
                style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 17%)" }}>
                <div className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: "hsl(38 95% 52% / 0.12)", color: "hsl(38 95% 55%)" }}>
                  {w.step}
                </div>
                <w.icon className="h-4 w-4" style={{ color: "hsl(215 25% 52%)" }} />
                <span className="text-[10px] font-semibold leading-tight"
                  style={{ color: "hsl(215 25% 50%)" }}>{w.label}</span>
              </Link>
              {i < WORKFLOW.length - 1 && (
                <ChevronRight className="h-4 w-4 shrink-0 mx-1" style={{ color: "hsl(216 45% 25%)" }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── 5 Hub cards ── */}
      <div>
        <p className="text-[10px] uppercase tracking-widest font-semibold mb-3"
          style={{ color: "hsl(215 25% 40%)" }}>
          {lang === "ar" ? "الخدمات الخمسة" : "Five Service Hubs"}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
          {HUBS.map((hub) => (
            <Link key={hub.url} to={hub.url}
              className="group rounded-xl p-4 transition-all hover:scale-[1.02] block"
              style={{ background: hub.bg, border: `1px solid ${hub.border}` }}>
              <div className="flex items-center justify-between mb-3">
                <div className="h-8 w-8 rounded-lg flex items-center justify-center"
                  style={{ background: `${hub.color}18` }}>
                  <hub.icon className="h-4 w-4" style={{ color: hub.color }} />
                </div>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                  style={{ background: `${hub.color}18`, color: hub.color }}>{hub.step}</span>
              </div>
              <p className="text-sm font-semibold mb-0.5" style={{ color: "hsl(210 40% 90%)" }}>
                {lang === "ar" ? hub.labelAr : hub.label}
              </p>
              <p className="text-[10px]" style={{ color: "hsl(215 25% 48%)" }}>{hub.sub}</p>
              <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[11px] font-semibold" style={{ color: hub.color }}>Open</span>
                <ArrowRight className="h-3 w-3" style={{ color: hub.color }} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Engagement list + Specialist modules ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Recent engagements */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] uppercase tracking-widest font-semibold"
              style={{ color: "hsl(215 25% 40%)" }}>
              {lang === "ar" ? "المشاريع" : "Engagements"}
            </p>
            <Link to="/engagement" className="text-xs" style={{ color: "hsl(38 95% 55%)" }}>
              Manage →
            </Link>
          </div>
          {engagements.length === 0 ? (
            <div className="rounded-xl p-8 flex flex-col items-center gap-3"
              style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 18%)" }}>
              <FolderKanban className="h-8 w-8" style={{ color: "hsl(216 45% 25%)" }} />
              <p className="text-sm" style={{ color: "hsl(215 25% 45%)" }}>No engagements yet.</p>
              <Link to="/engagement"
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold"
                style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
                <Plus className="h-3 w-3" /> Create First Engagement
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {engagements.slice(0, 5).map((e) => (
                <button key={e.id} onClick={() => setActiveEngagement(e.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all hover:opacity-80"
                  style={{
                    background: e.id === activeEngagementId ? "hsl(38 95% 52% / 0.08)" : "hsl(216 45% 10%)",
                    border: e.id === activeEngagementId ? "1px solid hsl(38 95% 52% / 0.3)" : "1px solid hsl(216 45% 18%)",
                  }}>
                  <div className="h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                    style={{ background: "hsl(216 45% 18%)", color: "hsl(210 40% 70%)" }}>
                    {e.clientName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: "hsl(210 40% 88%)" }}>{e.clientName}</p>
                    <p className="text-xs truncate" style={{ color: "hsl(215 25% 48%)" }}>{e.serviceType} · {e.market}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                    style={{ background: `${phaseColor[e.phase]}18`, color: phaseColor[e.phase] }}>
                    {e.phase}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Specialist modules */}
        <div>
          <p className="text-[10px] uppercase tracking-widest font-semibold mb-3"
            style={{ color: "hsl(215 25% 40%)" }}>
            {lang === "ar" ? "وحدات متخصصة" : "Specialist Modules"}
          </p>
          <div className="space-y-1.5">
            {SPECIALIST.map((s) => (
              <Link key={s.url} to={s.url}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all hover:opacity-80"
                style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 17%)" }}>
                <s.icon className="h-4 w-4 shrink-0" style={{ color: "hsl(215 25% 48%)" }} />
                <span className="text-xs font-medium" style={{ color: "hsl(210 40% 72%)" }}>{s.label}</span>
                <ChevronRight className="h-3 w-3 ml-auto" style={{ color: "hsl(216 45% 28%)" }} />
              </Link>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
