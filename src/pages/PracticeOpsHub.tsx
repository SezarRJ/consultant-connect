/**
 * PracticeOpsHub.tsx
 * ─────────────────────────────────────────────────────────────────
 * Hub E: Practice Ops
 * Sub-services: CRM | Projects | Tasks | Financial Overview
 *
 * Ops tools link into the full existing pages for deep functionality.
 * This hub provides quick-access summaries and jump links.
 * ─────────────────────────────────────────────────────────────────
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { useEngagementStore } from "@/store/engagementStore";
import {
  UserCheck, FolderKanban, CheckSquare, PieChart,
  ArrowRight, Briefcase, Clock, DollarSign, TrendingUp
} from "lucide-react";

type OpsSub = "crm" | "projects" | "tasks" | "financial";

const SUBS = [
  { id: "crm"       as const, label: "CRM",               icon: UserCheck,    url: "/crm",      description: "Manage clients, contacts, and pipeline." },
  { id: "projects"  as const, label: "Projects",          icon: FolderKanban, url: "/projects", description: "Track deliverable milestones and workstreams." },
  { id: "tasks"     as const, label: "Tasks",             icon: CheckSquare,  url: "/tasks",    description: "Day-level execution and task management." },
  { id: "financial" as const, label: "Financial Overview",icon: PieChart,     url: "/financial",description: "Revenue, billing, and practice financials." },
];

function QuickStats() {
  const { engagements } = useEngagementStore();
  const active   = engagements.filter((e) => e.status === "Active").length;
  const total    = engagements.length;
  const phases   = ["Discovery", "Analysis", "Strategy", "Delivery", "Review"];
  const inFlight = engagements.filter((e) => phases.includes(e.phase)).length;

  const stats = [
    { label: "Total Engagements",    value: total,    icon: Briefcase,    color: "hsl(38 95% 52%)" },
    { label: "Active",               value: active,   icon: Clock,        color: "hsl(145 65% 45%)" },
    { label: "In Flight (Phase)",    value: inFlight, icon: TrendingUp,   color: "hsl(200 80% 55%)" },
    { label: "Completed",            value: engagements.filter((e) => e.status === "Completed").length,
      icon: DollarSign, color: "hsl(270 70% 60%)" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="rounded-xl p-4 space-y-2"
          style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 18%)" }}>
          <Icon className="h-4 w-4" style={{ color }} />
          <p className="text-2xl font-bold" style={{ color: "hsl(210 40% 92%)" }}>{value}</p>
          <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "hsl(215 25% 45%)" }}>{label}</p>
        </div>
      ))}
    </div>
  );
}

function SubPanel({ sub }: { sub: typeof SUBS[0] }) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl p-6 flex flex-col items-center gap-4 text-center"
        style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 18%)" }}>
        <sub.icon className="h-10 w-10" style={{ color: "hsl(38 95% 52%)" }} />
        <div>
          <p className="text-base font-semibold" style={{ color: "hsl(210 40% 90%)" }}>{sub.label}</p>
          <p className="text-sm mt-1" style={{ color: "hsl(215 25% 48%)" }}>{sub.description}</p>
        </div>
        <Link
          to={sub.url}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all"
          style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}
        >
          Open {sub.label} <ArrowRight className="h-4 w-4" />
        </Link>
        <p className="text-xs" style={{ color: "hsl(215 25% 38%)" }}>
          Full {sub.label.toLowerCase()} functionality is available in the dedicated module.
        </p>
      </div>
    </div>
  );
}

export default function PracticeOpsHub() {
  const [active, setActive] = useState<OpsSub>("crm");
  const current = SUBS.find((s) => s.id === active)!;

  return (
    <div className="space-y-5 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold" style={{ color: "hsl(210 40% 92%)" }}>Practice Ops</h1>
        <p className="text-sm mt-0.5" style={{ color: "hsl(215 25% 48%)" }}>
          Manage your consultancy — clients, projects, tasks, and financials.
        </p>
      </div>

      <QuickStats />

      <div className="flex gap-1.5 flex-wrap">
        {SUBS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActive(id)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: active === id ? "hsl(38 95% 52% / 0.15)" : "hsl(216 45% 12%)",
              color: active === id ? "hsl(38 95% 60%)" : "hsl(215 25% 55%)",
              border: active === id ? "1px solid hsl(38 95% 52% / 0.35)" : "1px solid hsl(216 45% 18%)",
            }}>
            <Icon className="h-3.5 w-3.5" />{label}
          </button>
        ))}
      </div>

      <SubPanel sub={current} />
    </div>
  );
}
