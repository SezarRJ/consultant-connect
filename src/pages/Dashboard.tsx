/**
 * Dashboard.tsx — engagement-centered home, Practice Ops at bottom
 */
import { Link } from "react-router-dom";
import {
  Users, Briefcase, BarChart2, Lightbulb, FileOutput,
  Building2, ShoppingCart, Coffee, Radio, Truck,
  TrendingUp, Megaphone, Network, Globe2, ArrowRight,
  Plus, AlertTriangle, CheckCircle2, Activity, ChevronRight,
  FolderKanban, CheckSquare, PieChart, UserCheck, Clock,
} from "lucide-react";
import { useEngagementStore } from "@/store/engagementStore";
import { useI18n } from "@/lib/i18n";

const WORKFLOW = [
  { url: "/crm",          label: "CRM",          labelAr: "إدارة العملاء", icon: Users,      color: "hsl(215 25% 55%)", step: "1" },
  { url: "/engagement",   label: "Engagement",   labelAr: "المشروع",       icon: Briefcase,  color: "hsl(38 95% 52%)",  step: "2" },
  { url: "/analysis",     label: "Analysis",     labelAr: "التحليل",       icon: BarChart2,  color: "hsl(200 80% 55%)", step: "3" },
  { url: "/strategy",     label: "Strategy",     labelAr: "الاستراتيجية",  icon: Lightbulb,  color: "hsl(270 70% 65%)", step: "4" },
  { url: "/deliverables", label: "Deliverables", labelAr: "المخرجات",      icon: FileOutput, color: "hsl(145 65% 48%)", step: "5" },
];

const DOMAINS = [
  { url: "/domain/real-estate",  label: "Real Estate",     icon: Building2,   color: "hsl(38 95% 52%)"  },
  { url: "/domain/fmcg",         label: "FMCG",            icon: ShoppingCart, color: "hsl(145 65% 48%)" },
  { url: "/domain/fnb",          label: "Food & Beverage", icon: Coffee,       color: "hsl(30 90% 55%)"  },
  { url: "/domain/telecom",      label: "Telecom",         icon: Radio,        color: "hsl(200 80% 55%)" },
  { url: "/domain/distribution", label: "Distribution",    icon: Truck,        color: "hsl(280 70% 65%)" },
  { url: "/domain/sales",        label: "Sales",           icon: TrendingUp,   color: "hsl(158 64% 48%)" },
  { url: "/domain/marketing",    label: "Marketing",       icon: Megaphone,    color: "hsl(340 80% 60%)" },
  { url: "/domain/bizdev",       label: "Business Dev",    icon: Network,      color: "hsl(217 91% 68%)" },
];

const PRACTICE_OPS = [
  { url: "/crm",       label: "CRM",               labelAr: "إدارة العملاء", icon: UserCheck,    desc: "Contacts & pipeline"  },
  { url: "/projects",  label: "Projects",          labelAr: "المشاريع",      icon: FolderKanban, desc: "Case management"      },
  { url: "/tasks",     label: "Tasks",             labelAr: "المهام",         icon: CheckSquare,  desc: "Execution & tracking" },
  { url: "/financial", label: "Financial Overview",labelAr: "المالية",        icon: PieChart,     desc: "Revenue & billing"    },
];

const PHASE_COLOR: Record<string, string> = {
  Discovery: "hsl(38 95% 52%)", Analysis: "hsl(200 80% 55%)", Strategy: "hsl(270 70% 60%)",
  Deliverables: "hsl(145 65% 45%)", "Follow-up": "hsl(30 90% 55%)", Closed: "hsl(215 25% 45%)",
};

export default function Dashboard() {
  const { lang } = useI18n();
  const { engagements, activeEngagementId, setActiveEngagement, getActiveEngagement } = useEngagementStore();
  const active         = getActiveEngagement();
  const activeCount    = engagements.filter((e) => e.status === "Active").length;
  const inFlightCount  = engagements.filter((e) => !["Closed"].includes(e.phase)).length;
  const completedCount = engagements.filter((e) => e.status === "Completed").length;

  return (
    <div className="space-y-7 max-w-6xl mx-auto">

      {/* Hero */}
      <div className="rounded-2xl p-7 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, hsl(216 52% 9%), hsl(216 52% 12%))", border: "1px solid hsl(38 95% 52%/0.18)" }}>
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle at 85% 15%, hsl(38 95% 52%), transparent 55%)" }} />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Globe2 className="h-4 w-4" style={{ color: "hsl(38 95% 52%)" }} />
              <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
                style={{ background: "hsl(38 95% 52%/0.12)", color: "hsl(38 95% 60%)" }}>
                Engagement OS
              </span>
            </div>
            <h1 className="text-2xl font-bold" style={{ color: "hsl(210 40% 94%)" }}>ConsultAI Pro</h1>
            <p className="text-sm mt-1" style={{ color: "hsl(215 25% 55%)" }}>
              One workspace for the full consulting engagement — CRM to delivery.
            </p>
          </div>
          <Link to="/crm"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shrink-0 hover:opacity-90 transition-all"
            style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
            <Plus className="h-4 w-4" /> New Lead / Contact
          </Link>
        </div>
      </div>

      {/* Active Engagement */}
      {active ? (
        <div className="rounded-xl p-5"
          style={{ background: "hsl(216 45% 10%)", border: `1px solid ${PHASE_COLOR[active.phase]}35` }}>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: `${PHASE_COLOR[active.phase]}18`, color: PHASE_COLOR[active.phase] }}>
                  {active.phase}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full"
                  style={{ background: "hsl(216 45% 18%)", color: "hsl(215 25% 55%)" }}>
                  {active.status}
                </span>
              </div>
              <h2 className="text-lg font-bold" style={{ color: "hsl(210 40% 92%)" }}>
                {active.companyName || active.clientName}
              </h2>
              <p className="text-sm" style={{ color: "hsl(215 25% 52%)" }}>
                {active.serviceType} · {active.market} · {active.industry}
              </p>
            </div>
            <Link to="/engagement"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0"
              style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
              Open <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          {Object.keys(active.outputs).length > 0 && (
            <div className="flex items-center gap-2 mb-3 text-xs" style={{ color: "hsl(145 65% 48%)" }}>
              <CheckCircle2 className="h-3.5 w-3.5" />
              {Object.keys(active.outputs).length} saved output{Object.keys(active.outputs).length > 1 ? "s" : ""} · chain active
            </div>
          )}
          <div className="flex gap-2 flex-wrap">
            {[
              { label: "Analysis",     url: "/analysis",     color: "hsl(200 80% 55%)" },
              { label: "Strategy",     url: "/strategy",     color: "hsl(270 70% 65%)" },
              { label: "Deliverables", url: "/deliverables", color: "hsl(145 65% 48%)" },
            ].map((a) => (
              <Link key={a.url} to={a.url}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium"
                style={{ background: `${a.color}12`, color: a.color, border: `1px solid ${a.color}25` }}>
                {a.label} <ArrowRight className="h-3 w-3" />
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl p-5 flex items-center gap-4"
          style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(38 85% 45%/0.25)" }}>
          <AlertTriangle className="h-6 w-6 shrink-0" style={{ color: "hsl(38 85% 52%)" }} />
          <div className="flex-1">
            <p className="text-sm font-semibold" style={{ color: "hsl(210 40% 85%)" }}>No active engagement</p>
            <p className="text-xs mt-0.5" style={{ color: "hsl(215 25% 48%)" }}>
              Start in CRM → qualify a lead → convert to engagement.
            </p>
          </div>
          <Link to="/crm"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold shrink-0"
            style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
            <Plus className="h-4 w-4" /> Go to CRM
          </Link>
        </div>
      )}

      {/* Portfolio KPIs */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Active",    value: activeCount,    icon: Clock,        color: "hsl(145 65% 48%)" },
          { label: "In Flight", value: inFlightCount,  icon: Activity,     color: "hsl(38 95% 52%)"  },
          { label: "Completed", value: completedCount, icon: CheckCircle2, color: "hsl(217 91% 68%)" },
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

      {/* Workflow steps */}
      <div>
        <p className="text-[10px] uppercase tracking-widest font-semibold mb-3" style={{ color: "hsl(215 25% 38%)" }}>
          RECOMMENDED WORKFLOW
        </p>
        <div className="flex items-stretch">
          {WORKFLOW.map((w, i) => (
            <div key={w.url} className="flex items-center flex-1">
              <Link to={w.url}
                className="flex flex-col items-center gap-2 flex-1 px-2 py-4 rounded-xl text-center transition-all hover:opacity-80"
                style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 17%)" }}>
                <div className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: `${w.color}15`, color: w.color }}>{w.step}</div>
                <w.icon className="h-4 w-4" style={{ color: w.color }} />
                <span className="text-[10px] font-semibold" style={{ color: "hsl(215 25% 52%)" }}>
                  {lang === "ar" ? w.labelAr : w.label}
                </span>
              </Link>
              {i < WORKFLOW.length - 1 && (
                <ChevronRight className="h-4 w-4 shrink-0 mx-1" style={{ color: "hsl(216 45% 25%)" }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Domains + Engagements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <p className="text-[10px] uppercase tracking-widest font-semibold mb-3" style={{ color: "hsl(215 25% 38%)" }}>
            INDUSTRY DOMAINS
          </p>
          <div className="grid grid-cols-4 gap-2">
            {DOMAINS.map((d) => (
              <Link key={d.url} to={d.url}
                className="flex flex-col items-center gap-2 p-3 rounded-xl text-center transition-all hover:scale-[1.03]"
                style={{ background: `${d.color}08`, border: `1px solid ${d.color}20` }}>
                <d.icon className="h-5 w-5" style={{ color: d.color }} />
                <span className="text-[10px] font-semibold leading-tight" style={{ color: "hsl(210 40% 78%)" }}>
                  {d.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: "hsl(215 25% 38%)" }}>
              ENGAGEMENTS
            </p>
            <Link to="/engagement" className="text-[10px]" style={{ color: "hsl(38 95% 55%)" }}>Manage →</Link>
          </div>
          {engagements.length === 0 ? (
            <div className="rounded-xl p-6 flex flex-col items-center gap-2"
              style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 18%)" }}>
              <Briefcase className="h-8 w-8" style={{ color: "hsl(216 45% 25%)" }} />
              <p className="text-xs" style={{ color: "hsl(215 25% 45%)" }}>No engagements yet.</p>
              <Link to="/crm" className="text-xs font-semibold" style={{ color: "hsl(38 95% 52%)" }}>
                Start in CRM →
              </Link>
            </div>
          ) : (
            <div className="space-y-1.5">
              {engagements.slice(0, 5).map((e) => (
                <button key={e.id} onClick={() => setActiveEngagement(e.id)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all hover:opacity-80"
                  style={{
                    background: e.id === activeEngagementId ? "hsl(38 95% 52%/0.08)" : "hsl(216 45% 10%)",
                    border:     e.id === activeEngagementId ? "1px solid hsl(38 95% 52%/0.3)" : "1px solid hsl(216 45% 18%)",
                  }}>
                  <div className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ background: "hsl(216 45% 18%)", color: "hsl(210 40% 72%)" }}>
                    {(e.companyName || e.clientName)[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate" style={{ color: "hsl(210 40% 88%)" }}>
                      {e.companyName || e.clientName}
                    </p>
                    <p className="text-[10px] truncate" style={{ color: "hsl(215 25% 48%)" }}>{e.serviceType}</p>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                    style={{ background: `${PHASE_COLOR[e.phase]}18`, color: PHASE_COLOR[e.phase] }}>
                    {e.phase}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Practice Ops */}
      <div>
        <p className="text-[10px] uppercase tracking-widest font-semibold mb-3" style={{ color: "hsl(215 25% 38%)" }}>
          PRACTICE OPS
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PRACTICE_OPS.map(({ url, label, labelAr, icon: Icon, desc }) => (
            <Link key={url} to={url}
              className="flex flex-col items-center gap-2 p-4 rounded-xl text-center transition-all hover:scale-[1.02]"
              style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 18%)" }}>
              <Icon className="h-5 w-5" style={{ color: "hsl(38 95% 52%)" }} />
              <p className="text-xs font-semibold" style={{ color: "hsl(210 40% 85%)" }}>
                {lang === "ar" ? labelAr : label}
              </p>
              <p className="text-[10px]" style={{ color: "hsl(215 25% 42%)" }}>{desc}</p>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
