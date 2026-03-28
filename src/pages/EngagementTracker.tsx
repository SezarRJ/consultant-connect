import { useState, useEffect } from "react";
import {
  Activity, Clock, DollarSign, Target, CheckCircle2, AlertTriangle,
  Circle, Plus, X, Edit3, TrendingUp, Users, Calendar, Zap,
  ChevronRight, BarChart2, Flag, ArrowRight, FileText
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────
type HealthStatus = "on_track" | "at_risk" | "critical" | "completed";
type Phase = "discovery" | "analysis" | "strategy" | "delivery" | "review";

interface BillableEntry {
  id: string;
  date: string;
  hours: number;
  activity: string;
  consultant: string;
  billable: boolean;
}

interface Engagement {
  id: string;
  projectName: string;
  client: string;
  lead: string;
  health: HealthStatus;
  currentPhase: Phase;
  startDate: string;
  endDate: string;
  contractValue: number;
  billedToDate: number;
  budgetBurned: number; // %
  hoursLogged: number;
  hoursTotal: number;
  npsScore: number | null;
  lastClientContact: string;
  nextMilestone: string;
  nextMilestoneDate: string;
  risks: string[];
  notes: string;
  billableEntries: BillableEntry[];
  createdAt: string;
}

const LS_KEY = "consultai_engagements_v1";

const H_CFG: Record<HealthStatus, { label: string; color: string; bg: string; icon: any }> = {
  on_track:  { label: "On Track",  color: "hsl(158 64% 55%)", bg: "hsl(158 64% 40%/0.12)", icon: CheckCircle2  },
  at_risk:   { label: "At Risk",   color: "hsl(38 95% 60%)",  bg: "hsl(38 95% 52%/0.12)",  icon: AlertTriangle },
  critical:  { label: "Critical",  color: "hsl(0 72% 68%)",   bg: "hsl(0 72% 51%/0.12)",   icon: AlertTriangle },
  completed: { label: "Completed", color: "hsl(215 25% 55%)", bg: "hsl(215 25% 40%/0.12)", icon: CheckCircle2  },
};

const PHASES: Phase[] = ["discovery", "analysis", "strategy", "delivery", "review"];
const PHASE_LABELS: Record<Phase, string> = {
  discovery: "Discovery", analysis: "Analysis", strategy: "Strategy",
  delivery: "Delivery", review: "Review & Close"
};

const CONSULTANTS = ["Ahmad Al-Rashidi", "Sara Khalil", "Omar Hassan", "Nour Mahmoud", "Layla Ibrahim", "Karim Jaber"];

const SAMPLE: Engagement[] = [
  {
    id: "e1", projectName: "Baghdad FMCG Market Entry", client: "Unilever Iraq", lead: "Ahmad Al-Rashidi",
    health: "on_track", currentPhase: "analysis", startDate: "2026-02-01", endDate: "2026-05-31",
    contractValue: 42000, billedToDate: 22000, budgetBurned: 52, hoursLogged: 148, hoursTotal: 280,
    npsScore: 9, lastClientContact: "2026-03-24", nextMilestone: "Distributor Shortlist Report",
    nextMilestoneDate: "2026-04-01", risks: ["Client delays on approvals", "Data gaps in Mosul region"],
    notes: "Weekly calls every Monday 3pm. Key contact: VP Sales MENA — Mohammed Al-Fahad.",
    billableEntries: [
      { id: "b1", date: "2026-03-20", hours: 6, activity: "Competitor mapping deep dive", consultant: "Ahmad Al-Rashidi", billable: true },
      { id: "b2", date: "2026-03-21", hours: 4, activity: "Distributor interviews (x3)", consultant: "Sara Khalil", billable: true },
      { id: "b3", date: "2026-03-22", hours: 2, activity: "Internal review call", consultant: "Ahmad Al-Rashidi", billable: false },
    ],
    createdAt: "2026-01-20"
  },
  {
    id: "e2", projectName: "Erbil Tower Feasibility Study", client: "Kurdistan Group for Investment", lead: "Nour Mahmoud",
    health: "at_risk", currentPhase: "delivery", startDate: "2026-01-15", endDate: "2026-04-30",
    contractValue: 85000, billedToDate: 68000, budgetBurned: 88, hoursLogged: 312, hoursTotal: 350,
    npsScore: 7, lastClientContact: "2026-03-20", nextMilestone: "Final Feasibility Report",
    nextMilestoneDate: "2026-04-15", risks: ["Scope creep on financial model", "Client awaiting board approval"],
    notes: "Awaiting client sign-off on IRR assumptions. May need 1-week extension.",
    billableEntries: [
      { id: "b4", date: "2026-03-18", hours: 8, activity: "Financial model v3 revisions", consultant: "Nour Mahmoud", billable: true },
      { id: "b5", date: "2026-03-19", hours: 3, activity: "Site visit documentation", consultant: "Karim Jaber", billable: true },
    ],
    createdAt: "2026-01-10"
  },
  {
    id: "e3", projectName: "ISO 9001 — Basra Oil Services", client: "Gulf Oil Services Co.", lead: "Sara Khalil",
    health: "on_track", currentPhase: "discovery", startDate: "2026-03-01", endDate: "2026-09-30",
    contractValue: 28000, billedToDate: 5600, budgetBurned: 20, hoursLogged: 44, hoursTotal: 220,
    npsScore: null, lastClientContact: "2026-03-22", nextMilestone: "Gap Analysis Report",
    nextMilestoneDate: "2026-03-31", risks: ["ATEX documentation incomplete", "Key staff availability"],
    notes: "Factory walkthrough scheduled for March 28. Strong executive buy-in.",
    billableEntries: [
      { id: "b6", date: "2026-03-15", hours: 12, activity: "Initial gap analysis interviews", consultant: "Sara Khalil", billable: true },
    ],
    createdAt: "2026-02-20"
  },
];

const BLANK_ENTRY: Omit<BillableEntry, "id"> = {
  date: new Date().toISOString().slice(0, 10), hours: 4,
  activity: "", consultant: CONSULTANTS[0], billable: true
};

function load(): Engagement[] {
  try { const d = JSON.parse(localStorage.getItem(LS_KEY) || "null"); return d || SAMPLE; }
  catch { return SAMPLE; }
}

function daysUntil(d: string) { return Math.ceil((new Date(d).getTime() - Date.now()) / 86400000); }
function daysSince(d: string) { return Math.ceil((Date.now() - new Date(d).getTime()) / 86400000); }

// ─── Stat Box ─────────────────────────────────────────────────────────────────
const Stat = ({ label, value, sub, color }: { label: string; value: string; sub?: string; color: string }) => (
  <div className="rounded-xl p-4" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
    <p className="text-xs mb-1" style={{ color: "hsl(215 25% 50%)" }}>{label}</p>
    <p className="text-2xl font-bold" style={{ color }}>{value}</p>
    {sub && <p className="text-[11px] mt-0.5" style={{ color: "hsl(215 25% 45%)" }}>{sub}</p>}
  </div>
);

// ─── Phase Bar ────────────────────────────────────────────────────────────────
function PhaseBar({ current }: { current: Phase }) {
  const idx = PHASES.indexOf(current);
  return (
    <div className="flex items-center gap-1">
      {PHASES.map((p, i) => (
        <div key={p} className="flex items-center gap-1">
          <div className="flex flex-col items-center">
            <div className="h-2 w-2 rounded-full" style={{
              background: i < idx ? "hsl(158 64% 50%)" : i === idx ? "hsl(38 95% 52%)" : "hsl(216 45% 22%)"
            }} />
          </div>
          {i < PHASES.length - 1 && (
            <div className="h-px w-4" style={{ background: i < idx ? "hsl(158 64% 50%)" : "hsl(216 45% 22%)" }} />
          )}
        </div>
      ))}
      <span className="ml-2 text-[10px] font-semibold" style={{ color: "hsl(38 95% 60%)" }}>
        {PHASE_LABELS[current]}
      </span>
    </div>
  );
}

export default function EngagementTracker() {
  const [engagements, setEngagements] = useState<Engagement[]>(load);
  const [selId, setSelId] = useState<string>(SAMPLE[0].id);
  const [logForm, setLogForm] = useState<Omit<BillableEntry, "id">>(BLANK_ENTRY);
  const [showLog, setShowLog] = useState(false);
  const [filter, setFilter] = useState<HealthStatus | "all">("all");

  useEffect(() => { localStorage.setItem(LS_KEY, JSON.stringify(engagements)); }, [engagements]);

  const sel = engagements.find(e => e.id === selId) || engagements[0];
  const filtered = engagements.filter(e => filter === "all" || e.health === filter);

  const totalRevenue = engagements.reduce((s, e) => s + e.contractValue, 0);
  const totalBilled  = engagements.reduce((s, e) => s + e.billedToDate, 0);
  const totalHours   = engagements.reduce((s, e) => s + e.hoursLogged, 0);
  const activeCount  = engagements.filter(e => e.health !== "completed").length;

  const logHours = () => {
    if (!logForm.activity.trim()) { toast.error("Activity description required"); return; }
    const entry: BillableEntry = { ...logForm, id: `b_${Date.now()}` };
    setEngagements(es => es.map(e => e.id === selId
      ? { ...e, hoursLogged: e.hoursLogged + (logForm.billable ? logForm.hours : 0), billableEntries: [entry, ...e.billableEntries] }
      : e
    ));
    setLogForm(BLANK_ENTRY);
    setShowLog(false);
    toast.success("Hours logged successfully");
  };

  const updateHealth = (id: string, health: HealthStatus) => {
    setEngagements(es => es.map(e => e.id === id ? { ...e, health } : e));
    toast.success("Health status updated");
  };

  const IS = { background: "hsl(216 45% 12%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display" style={{ color: "hsl(210 40% 94%)" }}>Engagement Tracker</h1>
          <p className="text-sm mt-1" style={{ color: "hsl(215 25% 55%)" }}>
            Real-time health monitoring, billable hours & milestone tracking for all active engagements
          </p>
        </div>
        <Link to="/projects"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
          style={{ background: "hsl(216 45% 18%)", color: "hsl(210 40% 80%)", border: "1px solid hsl(var(--border))" }}>
          <FileText className="h-4 w-4" /> View Projects
        </Link>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Active Engagements"  value={`${activeCount}`}              sub="Ongoing"                color="hsl(38 95% 60%)"  />
        <Stat label="Total Portfolio"     value={`$${(totalRevenue/1000).toFixed(0)}K`} sub="Contract value" color="hsl(158 64% 55%)" />
        <Stat label="Billed to Date"      value={`$${(totalBilled/1000).toFixed(0)}K`} sub={`${Math.round(totalBilled/totalRevenue*100)}% collected`} color="hsl(217 91% 70%)" />
        <Stat label="Hours This Month"    value={`${totalHours}`}               sub="Across all projects"   color="hsl(38 95% 60%)"  />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Engagement List */}
        <div className="space-y-3">
          {/* Filter */}
          <div className="flex gap-1 flex-wrap">
            {(["all", "on_track", "at_risk", "critical"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-3 py-1 rounded-lg text-[11px] font-semibold transition-all"
                style={{
                  background: filter === f ? "hsl(38 95% 52%)" : "hsl(216 45% 18%)",
                  color: filter === f ? "hsl(216 58% 6%)" : "hsl(215 25% 55%)",
                }}>
                {f === "all" ? "All" : H_CFG[f].label}
              </button>
            ))}
          </div>

          {filtered.map(eng => {
            const h = H_CFG[eng.health];
            const HIcon = h.icon;
            const daysLeft = daysUntil(eng.endDate);
            const isSel = eng.id === selId;
            return (
              <div key={eng.id} onClick={() => setSelId(eng.id)}
                className="rounded-xl p-4 cursor-pointer transition-all"
                style={{
                  background: "hsl(var(--card))",
                  border: `1px solid ${isSel ? "hsl(38 95% 52% / 0.5)" : "hsl(var(--border))"}`,
                }}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-xs font-semibold leading-tight flex-1" style={{ color: "hsl(210 40% 88%)" }}>
                    {eng.projectName}
                  </p>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full shrink-0"
                    style={{ background: h.bg }}>
                    <HIcon className="h-3 w-3" style={{ color: h.color }} />
                    <span className="text-[9px] font-bold" style={{ color: h.color }}>{h.label}</span>
                  </div>
                </div>
                <p className="text-[10px] mb-2" style={{ color: "hsl(215 25% 50%)" }}>{eng.client}</p>
                <PhaseBar current={eng.currentPhase} />

                <div className="mt-3">
                  <div className="flex justify-between text-[10px] mb-1" style={{ color: "hsl(215 25% 45%)" }}>
                    <span>Budget</span><span>{eng.budgetBurned}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "hsl(216 45% 20%)" }}>
                    <div className="h-full rounded-full transition-all" style={{
                      width: `${eng.budgetBurned}%`,
                      background: eng.budgetBurned > 85 ? "hsl(0 72% 60%)" : eng.budgetBurned > 65 ? "hsl(38 95% 52%)" : "hsl(158 64% 50%)"
                    }} />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px]" style={{ color: "hsl(215 25% 45%)" }}>
                    {daysLeft > 0 ? `${daysLeft}d remaining` : `${Math.abs(daysLeft)}d overdue`}
                  </span>
                  <span className="text-[10px] font-semibold" style={{ color: "hsl(38 95% 60%)" }}>
                    ${(eng.billedToDate / 1000).toFixed(0)}K / ${(eng.contractValue / 1000).toFixed(0)}K
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Engagement Detail */}
        {sel && (
          <div className="lg:col-span-2 space-y-4">
            {/* Header Card */}
            <div className="rounded-xl p-5" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-lg font-bold" style={{ color: "hsl(210 40% 94%)" }}>{sel.projectName}</h2>
                  <p className="text-sm" style={{ color: "hsl(215 25% 55%)" }}>{sel.client} · Lead: {sel.lead}</p>
                </div>
                <div className="flex gap-1">
                  {(["on_track", "at_risk", "critical"] as HealthStatus[]).map(h => (
                    <button key={h} onClick={() => updateHealth(sel.id, h)}
                      className="px-2 py-1 rounded-lg text-[10px] font-bold transition-all"
                      style={{
                        background: sel.health === h ? H_CFG[h].bg : "hsl(216 45% 16%)",
                        color: sel.health === h ? H_CFG[h].color : "hsl(215 25% 45%)",
                        border: `1px solid ${sel.health === h ? H_CFG[h].color + "40" : "transparent"}`
                      }}>
                      {H_CFG[h].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Phase progress */}
              <div className="mb-4">
                <p className="text-[10px] mb-2 font-semibold tracking-widest uppercase" style={{ color: "hsl(215 25% 40%)" }}>Engagement Phase</p>
                <div className="flex items-center gap-0">
                  {PHASES.map((p, i) => {
                    const idx = PHASES.indexOf(sel.currentPhase);
                    const done = i < idx; const active = i === idx;
                    return (
                      <div key={p} className="flex items-center flex-1">
                        <div className="flex flex-col items-center flex-1">
                          <div className="h-8 w-full flex items-center justify-center rounded text-[9px] font-bold transition-all"
                            style={{
                              background: done ? "hsl(158 64% 40%/0.2)" : active ? "hsl(38 95% 52%/0.2)" : "hsl(216 45% 18%)",
                              color: done ? "hsl(158 64% 55%)" : active ? "hsl(38 95% 60%)" : "hsl(215 25% 40%)",
                              border: `1px solid ${done ? "hsl(158 64% 40%/0.4)" : active ? "hsl(38 95% 52%/0.4)" : "hsl(216 45% 25%)"}`
                            }}>
                            {PHASE_LABELS[p].split(" ")[0]}
                          </div>
                        </div>
                        {i < PHASES.length - 1 && (
                          <div className="h-px w-1 shrink-0"
                            style={{ background: done ? "hsl(158 64% 50%)" : "hsl(216 45% 25%)" }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Key metrics */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Contract Value",    value: `$${sel.contractValue.toLocaleString()}`,  color: "hsl(38 95% 60%)"  },
                  { label: "Billed to Date",    value: `$${sel.billedToDate.toLocaleString()}`,   color: "hsl(158 64% 55%)" },
                  { label: "Hours Logged",      value: `${sel.hoursLogged}h / ${sel.hoursTotal}h`, color: "hsl(217 91% 70%)" },
                ].map((m, i) => (
                  <div key={i} className="rounded-lg p-3" style={{ background: "hsl(216 45% 12%)" }}>
                    <p className="text-[10px] mb-1" style={{ color: "hsl(215 25% 45%)" }}>{m.label}</p>
                    <p className="text-sm font-bold" style={{ color: m.color }}>{m.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Milestone + Risks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl p-4" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
                <div className="flex items-center gap-2 mb-3">
                  <Flag className="h-4 w-4" style={{ color: "hsl(38 95% 52%)" }} />
                  <p className="text-xs font-semibold" style={{ color: "hsl(210 40% 88%)" }}>Next Milestone</p>
                </div>
                <p className="text-sm font-semibold mb-1" style={{ color: "hsl(210 40% 94%)" }}>{sel.nextMilestone}</p>
                <p className="text-xs" style={{ color: "hsl(38 95% 60%)" }}>
                  Due: {sel.nextMilestoneDate} ({daysUntil(sel.nextMilestoneDate)}d)
                </p>
                <div className="mt-3 pt-3" style={{ borderTop: "1px solid hsl(var(--border))" }}>
                  <p className="text-[10px] mb-1" style={{ color: "hsl(215 25% 45%)" }}>Last client contact</p>
                  <p className="text-xs" style={{ color: "hsl(215 25% 65%)" }}>
                    {daysSince(sel.lastClientContact)}d ago · {sel.lastClientContact}
                  </p>
                </div>
                {sel.npsScore !== null && (
                  <div className="mt-3 pt-3" style={{ borderTop: "1px solid hsl(var(--border))" }}>
                    <p className="text-[10px] mb-1" style={{ color: "hsl(215 25% 45%)" }}>Client NPS Score</p>
                    <p className="text-lg font-bold" style={{
                      color: sel.npsScore >= 9 ? "hsl(158 64% 55%)" : sel.npsScore >= 7 ? "hsl(38 95% 60%)" : "hsl(0 72% 68%)"
                    }}>{sel.npsScore}/10</p>
                  </div>
                )}
              </div>

              <div className="rounded-xl p-4" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-4 w-4" style={{ color: "hsl(38 95% 52%)" }} />
                  <p className="text-xs font-semibold" style={{ color: "hsl(210 40% 88%)" }}>Active Risks</p>
                </div>
                <div className="space-y-2">
                  {sel.risks.map((r, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "hsl(38 95% 52%)" }} />
                      <p className="text-xs" style={{ color: "hsl(215 25% 65%)" }}>{r}</p>
                    </div>
                  ))}
                </div>
                {sel.notes && (
                  <div className="mt-3 pt-3" style={{ borderTop: "1px solid hsl(var(--border))" }}>
                    <p className="text-[10px] mb-1" style={{ color: "hsl(215 25% 45%)" }}>Notes</p>
                    <p className="text-[11px]" style={{ color: "hsl(215 25% 60%)" }}>{sel.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Billable Hours Log */}
            <div className="rounded-xl p-4" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" style={{ color: "hsl(38 95% 52%)" }} />
                  <p className="text-xs font-semibold" style={{ color: "hsl(210 40% 88%)" }}>Billable Hours Log</p>
                </div>
                <button onClick={() => setShowLog(!showLog)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold"
                  style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
                  <Plus className="h-3.5 w-3.5" /> Log Hours
                </button>
              </div>

              {showLog && (
                <div className="mb-4 p-4 rounded-xl space-y-3" style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(var(--border))" }}>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] mb-1 block" style={{ color: "hsl(215 25% 50%)" }}>Date</label>
                      <input type="date" value={logForm.date} onChange={e => setLogForm(f => ({ ...f, date: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg text-sm" style={IS} />
                    </div>
                    <div>
                      <label className="text-[10px] mb-1 block" style={{ color: "hsl(215 25% 50%)" }}>Hours</label>
                      <input type="number" min={0.5} max={16} step={0.5} value={logForm.hours}
                        onChange={e => setLogForm(f => ({ ...f, hours: parseFloat(e.target.value) }))}
                        className="w-full px-3 py-2 rounded-lg text-sm" style={IS} />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10px] mb-1 block" style={{ color: "hsl(215 25% 50%)" }}>Activity Description</label>
                      <input type="text" placeholder="e.g. Competitor mapping, client call, report drafting..."
                        value={logForm.activity} onChange={e => setLogForm(f => ({ ...f, activity: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg text-sm" style={IS} />
                    </div>
                    <div>
                      <label className="text-[10px] mb-1 block" style={{ color: "hsl(215 25% 50%)" }}>Consultant</label>
                      <select value={logForm.consultant} onChange={e => setLogForm(f => ({ ...f, consultant: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg text-sm" style={IS}>
                        {CONSULTANTS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={logForm.billable}
                          onChange={e => setLogForm(f => ({ ...f, billable: e.target.checked }))} />
                        <span className="text-xs" style={{ color: "hsl(215 25% 65%)" }}>Billable to client</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={logHours}
                      className="px-4 py-2 rounded-lg text-xs font-semibold"
                      style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
                      Save Entry
                    </button>
                    <button onClick={() => setShowLog(false)}
                      className="px-4 py-2 rounded-lg text-xs font-semibold"
                      style={{ background: "hsl(216 45% 18%)", color: "hsl(215 25% 55%)" }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {sel.billableEntries.slice(0, 6).map(entry => (
                  <div key={entry.id} className="flex items-center gap-3 py-2"
                    style={{ borderBottom: "1px solid hsl(var(--border)/0.5)" }}>
                    <div className="flex items-center justify-center h-7 w-7 rounded-lg shrink-0"
                      style={{ background: entry.billable ? "hsl(158 64% 40%/0.15)" : "hsl(216 45% 18%)" }}>
                      <Clock className="h-3.5 w-3.5" style={{ color: entry.billable ? "hsl(158 64% 55%)" : "hsl(215 25% 45%)" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate" style={{ color: "hsl(210 40% 82%)" }}>{entry.activity}</p>
                      <p className="text-[10px]" style={{ color: "hsl(215 25% 45%)" }}>
                        {entry.consultant} · {entry.date}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold" style={{ color: entry.billable ? "hsl(38 95% 60%)" : "hsl(215 25% 50%)" }}>
                        {entry.hours}h
                      </p>
                      <p className="text-[9px]" style={{ color: "hsl(215 25% 40%)" }}>
                        {entry.billable ? "Billable" : "Non-billable"}
                      </p>
                    </div>
                  </div>
                ))}
                {sel.billableEntries.length === 0 && (
                  <p className="text-xs text-center py-4" style={{ color: "hsl(215 25% 40%)" }}>No hours logged yet</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
