import { useState } from "react";
import {
  Activity, Clock, DollarSign, CheckCircle2, AlertTriangle,
  Plus, X, Edit3, TrendingUp, Calendar, Flag, FileText, Loader2, Trash2
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  useTrackerEngagements, useCreateTrackerEngagement,
  useUpdateTrackerEngagement, useDeleteTrackerEngagement,
  type TrackerEngagement, type HealthStatus, type Phase,
} from "@/hooks/useEngagementTracker";

// ─── Config ───────────────────────────────────────────────────────────────────
const H_CFG: Record<HealthStatus, { label: string; color: string; bg: string; icon: any }> = {
  on_track:  { label: "On Track",  color: "hsl(158 64% 55%)", bg: "hsl(158 64% 40%/0.12)", icon: CheckCircle2  },
  at_risk:   { label: "At Risk",   color: "hsl(38 95% 60%)",  bg: "hsl(38 95% 52%/0.12)",  icon: AlertTriangle },
  critical:  { label: "Critical",  color: "hsl(0 72% 68%)",   bg: "hsl(0 72% 51%/0.12)",   icon: AlertTriangle },
  completed: { label: "Completed", color: "hsl(215 25% 55%)", bg: "hsl(215 25% 40%/0.12)", icon: CheckCircle2  },
};
const PHASES: Phase[] = ["discovery", "analysis", "strategy", "delivery", "review"];
const PHASE_LABELS: Record<Phase, string> = {
  discovery: "Discovery", analysis: "Analysis", strategy: "Strategy",
  delivery: "Delivery", review: "Review & Close",
};
const IS = { background: "hsl(216 45% 12%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" };

const BLANK: Omit<TrackerEngagement, "id" | "createdAt"> = {
  projectName: "", client: "", lead: "", health: "on_track", currentPhase: "discovery",
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10),
  contractValue: 0, billedToDate: 0, budgetBurned: 0,
  hoursLogged: 0, hoursTotal: 0, npsScore: null,
  lastClientContact: "", nextMilestone: "", nextMilestoneDate: "",
  risks: [], notes: "", billableEntries: [],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
const daysUntil = (d: string) => d ? Math.ceil((new Date(d).getTime() - Date.now()) / 86400000) : 0;
const daysSince = (d: string) => d ? Math.ceil((Date.now() - new Date(d).getTime()) / 86400000) : 0;

// ─── Phase Bar ────────────────────────────────────────────────────────────────
function PhaseBar({ current }: { current: Phase }) {
  const idx = PHASES.indexOf(current);
  return (
    <div className="flex items-center gap-1">
      {PHASES.map((p, i) => (
        <div key={p} className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full" style={{
            background: i < idx ? "hsl(158 64% 50%)" : i === idx ? "hsl(38 95% 52%)" : "hsl(216 45% 22%)"
          }} />
          {i < PHASES.length - 1 && <div className="h-px w-4" style={{ background: i < idx ? "hsl(158 64% 50%)" : "hsl(216 45% 22%)" }} />}
        </div>
      ))}
      <span className="ml-2 text-[10px] font-semibold" style={{ color: "hsl(38 95% 60%)" }}>
        {PHASE_LABELS[current]}
      </span>
    </div>
  );
}

// ─── Stat ─────────────────────────────────────────────────────────────────────
const Stat = ({ label, value, sub, color }: { label: string; value: string; sub?: string; color: string }) => (
  <div className="rounded-xl p-4 bg-card border border-border">
    <p className="text-xs mb-1" style={{ color: "hsl(215 25% 50%)" }}>{label}</p>
    <p className="text-2xl font-bold" style={{ color }}>{value}</p>
    {sub && <p className="text-[11px] mt-0.5" style={{ color: "hsl(215 25% 45%)" }}>{sub}</p>}
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function EngagementTracker() {
  const { data: engagements = [], isLoading, isError } = useTrackerEngagements();
  const create = useCreateTrackerEngagement();
  const update = useUpdateTrackerEngagement();
  const del    = useDeleteTrackerEngagement();

  const [selId,    setSelId]    = useState<string | null>(null);
  const [filter,   setFilter]   = useState<HealthStatus | "all">("all");
  const [showForm, setShowForm] = useState(false);
  const [editId,   setEditId]   = useState<string | null>(null);
  const [form,     setForm]     = useState<Omit<TrackerEngagement, "id" | "createdAt">>(BLANK);
  const [showLog,  setShowLog]  = useState(false);
  const [logEntry, setLogEntry] = useState({ date: new Date().toISOString().slice(0, 10), hours: 4, activity: "", consultant: "", billable: true });
  const [newRisk,  setNewRisk]  = useState("");

  const filtered = engagements.filter(e => filter === "all" || e.health === filter);
  const sel = engagements.find(e => e.id === selId) ?? filtered[0] ?? null;

  const totalRevenue = engagements.reduce((s, e) => s + e.contractValue, 0);
  const totalBilled  = engagements.reduce((s, e) => s + e.billedToDate, 0);
  const totalHours   = engagements.reduce((s, e) => s + e.hoursLogged, 0);
  const activeCount  = engagements.filter(e => e.health !== "completed").length;

  const openNew = () => {
    setEditId(null); setForm(BLANK); setShowForm(true);
  };
  const openEdit = (e: TrackerEngagement) => {
    setEditId(e.id);
    setForm({ projectName: e.projectName, client: e.client, lead: e.lead, health: e.health,
      currentPhase: e.currentPhase, startDate: e.startDate, endDate: e.endDate,
      contractValue: e.contractValue, billedToDate: e.billedToDate, budgetBurned: e.budgetBurned,
      hoursLogged: e.hoursLogged, hoursTotal: e.hoursTotal, npsScore: e.npsScore,
      lastClientContact: e.lastClientContact, nextMilestone: e.nextMilestone,
      nextMilestoneDate: e.nextMilestoneDate, risks: [...e.risks], notes: e.notes,
      billableEntries: [...e.billableEntries] });
    setShowForm(true);
  };

  const save = async () => {
    if (!form.projectName.trim() || !form.client.trim()) { toast.error("Project name and client required"); return; }
    if (editId) { await update.mutateAsync({ id: editId, ...form }); toast.success("Engagement updated"); }
    else        { const eng = await create.mutateAsync(form); setSelId(eng.id); toast.success("Engagement created"); }
    setShowForm(false);
  };

  const logHours = async () => {
    if (!sel) return;
    if (!logEntry.activity.trim()) { toast.error("Activity description required"); return; }
    const entry = { ...logEntry, id: `b_${Date.now()}` };
    const newEntries = [entry, ...sel.billableEntries];
    const newHours = sel.hoursLogged + (logEntry.billable ? logEntry.hours : 0);
    await update.mutateAsync({ id: sel.id, billableEntries: newEntries, hoursLogged: newHours });
    setLogEntry({ date: new Date().toISOString().slice(0, 10), hours: 4, activity: "", consultant: "", billable: true });
    setShowLog(false);
    toast.success("Hours logged");
  };

  const updateHealth = async (id: string, health: HealthStatus) => {
    await update.mutateAsync({ id, health });
    toast.success("Health updated");
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-64 gap-2 text-muted-foreground">
      <Loader2 className="h-5 w-5 animate-spin" /><span className="text-sm">Loading engagements…</span>
    </div>
  );
  if (isError) return (
    <div className="flex items-center justify-center h-64 gap-2" style={{ color: "hsl(0 72% 68%)" }}>
      <AlertTriangle className="h-5 w-5" /><span className="text-sm">Failed to load. Check Supabase.</span>
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display" style={{ color: "hsl(210 40% 94%)" }}>Engagement Tracker</h1>
          <p className="text-sm mt-1" style={{ color: "hsl(215 25% 55%)" }}>
            Health monitoring, billable hours & milestones — live from your database
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/projects" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
            style={{ background: "hsl(216 45% 18%)", color: "hsl(210 40% 80%)", border: "1px solid hsl(var(--border))" }}>
            <FileText className="h-4 w-4" /> Projects
          </Link>
          <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
            style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
            <Plus className="h-4 w-4" /> New Engagement
          </button>
        </div>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Active Engagements" value={`${activeCount}`}                     sub="Ongoing"              color="hsl(38 95% 60%)"  />
        <Stat label="Total Portfolio"    value={fmt(totalRevenue)}                    sub="Contract value"       color="hsl(158 64% 55%)" />
        <Stat label="Billed to Date"     value={fmt(totalBilled)}                     sub={totalRevenue > 0 ? `${Math.round(totalBilled / totalRevenue * 100)}% collected` : ""}  color="hsl(217 91% 70%)" />
        <Stat label="Hours Logged"       value={`${totalHours.toFixed(0)}h`}          sub="Across all projects"  color="hsl(38 95% 60%)"  />
      </div>

      {/* Empty state */}
      {engagements.length === 0 && (
        <div className="rounded-xl p-16 text-center bg-card border border-border">
          <Activity className="h-12 w-12 mx-auto mb-4 opacity-20" style={{ color: "hsl(38 95% 52%)" }} />
          <p className="text-base font-semibold mb-1" style={{ color: "hsl(215 25% 50%)" }}>No engagements yet</p>
          <p className="text-sm mb-6" style={{ color: "hsl(215 25% 38%)" }}>Create your first engagement to start tracking billable hours and milestones</p>
          <button onClick={openNew} className="px-6 py-3 rounded-lg text-sm font-semibold"
            style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
            <Plus className="h-4 w-4 inline mr-2" />Create First Engagement
          </button>
        </div>
      )}

      {engagements.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left — Engagement List */}
          <div className="space-y-3">
            {/* Filters */}
            <div className="flex gap-1 flex-wrap">
              {(["all", "on_track", "at_risk", "critical"] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className="px-3 py-1 rounded-lg text-[11px] font-semibold transition-all"
                  style={{ background: filter === f ? "hsl(38 95% 52%)" : "hsl(216 45% 18%)", color: filter === f ? "hsl(216 58% 6%)" : "hsl(215 25% 55%)" }}>
                  {f === "all" ? "All" : H_CFG[f].label}
                </button>
              ))}
            </div>

            {filtered.length === 0 && <p className="text-sm text-center py-6" style={{ color: "hsl(215 25% 40%)" }}>No engagements match this filter</p>}

            {filtered.map(eng => {
              const h = H_CFG[eng.health]; const HIcon = h.icon;
              const daysLeft = daysUntil(eng.endDate);
              const isSel = eng.id === selId;
              return (
                <div key={eng.id} onClick={() => setSelId(eng.id)}
                  className="rounded-xl p-4 cursor-pointer transition-all"
                  style={{ background: "hsl(var(--card))", border: `1px solid ${isSel ? "hsl(38 95% 52% / 0.5)" : "hsl(var(--border))"}` }}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-xs font-semibold leading-tight flex-1" style={{ color: "hsl(210 40% 88%)" }}>{eng.projectName}</p>
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full shrink-0" style={{ background: h.bg }}>
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
                        width: `${Math.min(100, eng.budgetBurned)}%`,
                        background: eng.budgetBurned > 85 ? "hsl(0 72% 60%)" : eng.budgetBurned > 65 ? "hsl(38 95% 52%)" : "hsl(158 64% 50%)"
                      }} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px]" style={{ color: daysLeft < 0 ? "hsl(0 72% 68%)" : "hsl(215 25% 45%)" }}>
                      {daysLeft > 0 ? `${daysLeft}d remaining` : daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : "Due today"}
                    </span>
                    <span className="text-[10px] font-semibold" style={{ color: "hsl(38 95% 60%)" }}>
                      {fmt(eng.billedToDate)} / {fmt(eng.contractValue)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right — Detail */}
          {sel ? (
            <div className="lg:col-span-2 space-y-4">
              {/* Header Card */}
              <div className="rounded-xl p-5 bg-card border border-border">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-lg font-bold" style={{ color: "hsl(210 40% 94%)" }}>{sel.projectName}</h2>
                    <p className="text-sm" style={{ color: "hsl(215 25% 55%)" }}>{sel.client}{sel.lead ? ` · Lead: ${sel.lead}` : ""}</p>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {(["on_track", "at_risk", "critical", "completed"] as HealthStatus[]).map(h => (
                      <button key={h} onClick={() => updateHealth(sel.id, h)}
                        className="px-2 py-1 rounded-lg text-[10px] font-bold transition-all"
                        style={{
                          background: sel.health === h ? H_CFG[h].bg : "hsl(216 45% 16%)",
                          color: sel.health === h ? H_CFG[h].color : "hsl(215 25% 45%)",
                          border: `1px solid ${sel.health === h ? H_CFG[h].color + "40" : "transparent"}`,
                        }}>{H_CFG[h].label}</button>
                    ))}
                    <button onClick={() => openEdit(sel)} className="p-1.5 rounded-lg" style={{ background: "hsl(216 45% 18%)" }}>
                      <Edit3 className="h-3.5 w-3.5" style={{ color: "hsl(215 25% 55%)" }} />
                    </button>
                    <button onClick={async () => { if (confirm("Delete this engagement?")) { await del.mutateAsync(sel.id); setSelId(null); toast.success("Deleted"); } }}
                      className="p-1.5 rounded-lg" style={{ background: "hsl(0 72% 51%/0.1)" }}>
                      <Trash2 className="h-3.5 w-3.5" style={{ color: "hsl(0 72% 68%)" }} />
                    </button>
                  </div>
                </div>

                {/* Phase bar */}
                <div className="mb-4">
                  <p className="text-[10px] mb-2 font-semibold tracking-widest uppercase" style={{ color: "hsl(215 25% 40%)" }}>Phase</p>
                  <div className="flex items-center gap-0">
                    {PHASES.map((p, i) => {
                      const idx = PHASES.indexOf(sel.currentPhase);
                      const done = i < idx; const active = i === idx;
                      return (
                        <div key={p} className="flex items-center flex-1">
                          <div className="h-8 w-full flex items-center justify-center rounded text-[9px] font-bold transition-all"
                            style={{
                              background: done ? "hsl(158 64% 40%/0.2)" : active ? "hsl(38 95% 52%/0.2)" : "hsl(216 45% 18%)",
                              color: done ? "hsl(158 64% 55%)" : active ? "hsl(38 95% 60%)" : "hsl(215 25% 40%)",
                              border: `1px solid ${done ? "hsl(158 64% 40%/0.4)" : active ? "hsl(38 95% 52%/0.4)" : "hsl(216 45% 25%)"}`,
                            }}>
                            {PHASE_LABELS[p].split(" ")[0]}
                          </div>
                          {i < PHASES.length - 1 && <div className="h-px w-1 shrink-0" style={{ background: done ? "hsl(158 64% 50%)" : "hsl(216 45% 25%)" }} />}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Contract Value", value: fmt(sel.contractValue), color: "hsl(38 95% 60%)"  },
                    { label: "Billed to Date", value: fmt(sel.billedToDate),  color: "hsl(158 64% 55%)" },
                    { label: "Hours",          value: `${sel.hoursLogged}h / ${sel.hoursTotal}h`, color: "hsl(217 91% 70%)" },
                  ].map((m, i) => (
                    <div key={i} className="rounded-lg p-3" style={{ background: "hsl(216 45% 12%)" }}>
                      <p className="text-[10px] mb-1" style={{ color: "hsl(215 25% 45%)" }}>{m.label}</p>
                      <p className="text-sm font-bold" style={{ color: m.color }}>{m.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestone + Risks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl p-4 bg-card border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <Flag className="h-4 w-4" style={{ color: "hsl(38 95% 52%)" }} />
                    <p className="text-xs font-semibold" style={{ color: "hsl(210 40% 88%)" }}>Next Milestone</p>
                  </div>
                  {sel.nextMilestone ? (
                    <>
                      <p className="text-sm font-semibold mb-1" style={{ color: "hsl(210 40% 94%)" }}>{sel.nextMilestone}</p>
                      {sel.nextMilestoneDate && (
                        <p className="text-xs" style={{ color: "hsl(38 95% 60%)" }}>
                          Due: {sel.nextMilestoneDate} ({daysUntil(sel.nextMilestoneDate)}d)
                        </p>
                      )}
                    </>
                  ) : <p className="text-xs" style={{ color: "hsl(215 25% 45%)" }}>No milestone set</p>}
                  {sel.lastClientContact && (
                    <div className="mt-3 pt-3" style={{ borderTop: "1px solid hsl(var(--border))" }}>
                      <p className="text-[10px] mb-1" style={{ color: "hsl(215 25% 45%)" }}>Last client contact</p>
                      <p className="text-xs" style={{ color: "hsl(215 25% 65%)" }}>
                        {daysSince(sel.lastClientContact)}d ago · {sel.lastClientContact}
                      </p>
                    </div>
                  )}
                  {sel.npsScore !== null && (
                    <div className="mt-3 pt-3" style={{ borderTop: "1px solid hsl(var(--border))" }}>
                      <p className="text-[10px] mb-1" style={{ color: "hsl(215 25% 45%)" }}>Client NPS</p>
                      <p className="text-lg font-bold" style={{
                        color: sel.npsScore >= 9 ? "hsl(158 64% 55%)" : sel.npsScore >= 7 ? "hsl(38 95% 60%)" : "hsl(0 72% 68%)"
                      }}>{sel.npsScore}/10</p>
                    </div>
                  )}
                </div>

                <div className="rounded-xl p-4 bg-card border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-4 w-4" style={{ color: "hsl(38 95% 52%)" }} />
                    <p className="text-xs font-semibold" style={{ color: "hsl(210 40% 88%)" }}>Active Risks</p>
                  </div>
                  {sel.risks.length === 0 ? (
                    <p className="text-xs" style={{ color: "hsl(215 25% 40%)" }}>No risks recorded</p>
                  ) : (
                    <div className="space-y-2">
                      {sel.risks.map((r, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "hsl(38 95% 52%)" }} />
                          <p className="text-xs" style={{ color: "hsl(215 25% 65%)" }}>{r}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {sel.notes && (
                    <div className="mt-3 pt-3" style={{ borderTop: "1px solid hsl(var(--border))" }}>
                      <p className="text-[10px] mb-1" style={{ color: "hsl(215 25% 45%)" }}>Notes</p>
                      <p className="text-[11px]" style={{ color: "hsl(215 25% 60%)" }}>{sel.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Billable Hours Log */}
              <div className="rounded-xl p-4 bg-card border border-border">
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
                        <input type="date" value={logEntry.date} onChange={e => setLogEntry(l => ({ ...l, date: e.target.value }))}
                          className="w-full px-3 py-2 rounded-lg text-sm" style={IS} />
                      </div>
                      <div>
                        <label className="text-[10px] mb-1 block" style={{ color: "hsl(215 25% 50%)" }}>Hours</label>
                        <input type="number" min={0.5} max={16} step={0.5} value={logEntry.hours}
                          onChange={e => setLogEntry(l => ({ ...l, hours: parseFloat(e.target.value) }))}
                          className="w-full px-3 py-2 rounded-lg text-sm" style={IS} />
                      </div>
                      <div className="col-span-2">
                        <label className="text-[10px] mb-1 block" style={{ color: "hsl(215 25% 50%)" }}>Activity</label>
                        <input placeholder="e.g. Competitor mapping, client call, report drafting…"
                          value={logEntry.activity} onChange={e => setLogEntry(l => ({ ...l, activity: e.target.value }))}
                          className="w-full px-3 py-2 rounded-lg text-sm" style={IS} />
                      </div>
                      <div>
                        <label className="text-[10px] mb-1 block" style={{ color: "hsl(215 25% 50%)" }}>Consultant</label>
                        <input value={logEntry.consultant} onChange={e => setLogEntry(l => ({ ...l, consultant: e.target.value }))}
                          className="w-full px-3 py-2 rounded-lg text-sm" style={IS} placeholder="Name…" />
                      </div>
                      <div className="flex items-end">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={logEntry.billable} onChange={e => setLogEntry(l => ({ ...l, billable: e.target.checked }))} />
                          <span className="text-xs" style={{ color: "hsl(215 25% 65%)" }}>Billable to client</span>
                        </label>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={logHours} className="px-4 py-2 rounded-lg text-xs font-semibold"
                        style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>Save Entry</button>
                      <button onClick={() => setShowLog(false)} className="px-4 py-2 rounded-lg text-xs font-semibold"
                        style={{ background: "hsl(216 45% 18%)", color: "hsl(215 25% 55%)" }}>Cancel</button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {sel.billableEntries.slice(0, 8).map(entry => (
                    <div key={entry.id} className="flex items-center gap-3 py-2"
                      style={{ borderBottom: "1px solid hsl(var(--border)/0.5)" }}>
                      <div className="flex items-center justify-center h-7 w-7 rounded-lg shrink-0"
                        style={{ background: entry.billable ? "hsl(158 64% 40%/0.15)" : "hsl(216 45% 18%)" }}>
                        <Clock className="h-3.5 w-3.5" style={{ color: entry.billable ? "hsl(158 64% 55%)" : "hsl(215 25% 45%)" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate" style={{ color: "hsl(210 40% 82%)" }}>{entry.activity}</p>
                        <p className="text-[10px]" style={{ color: "hsl(215 25% 45%)" }}>{entry.consultant}{entry.consultant ? " · " : ""}{entry.date}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold" style={{ color: entry.billable ? "hsl(38 95% 60%)" : "hsl(215 25% 50%)" }}>{entry.hours}h</p>
                        <p className="text-[9px]" style={{ color: "hsl(215 25% 40%)" }}>{entry.billable ? "Billable" : "Non-billable"}</p>
                      </div>
                    </div>
                  ))}
                  {sel.billableEntries.length === 0 && (
                    <p className="text-xs text-center py-4" style={{ color: "hsl(215 25% 40%)" }}>No hours logged yet</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-2 flex items-center justify-center h-48 rounded-xl bg-card border border-border">
              <p className="text-sm" style={{ color: "hsl(215 25% 45%)" }}>Select an engagement to view details</p>
            </div>
          )}
        </div>
      )}

      {/* Create / Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="w-full max-w-2xl rounded-2xl p-6 space-y-4 max-h-[92vh] overflow-y-auto"
            style={{ background: "hsl(216 52% 10%)", border: "1px solid hsl(var(--border))" }}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm" style={{ color: "hsl(210 40% 90%)" }}>
                {editId ? "Edit Engagement" : "New Engagement"}
              </h3>
              <button onClick={() => setShowForm(false)}><X className="h-4 w-4" style={{ color: "hsl(215 25% 50%)" }} /></button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color: "hsl(215 25% 45%)" }}>Project Name *</label>
                <input value={form.projectName} onChange={e => setForm(f => ({ ...f, projectName: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-sm" style={IS} placeholder="e.g. Baghdad FMCG Market Entry" />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color: "hsl(215 25% 45%)" }}>Client *</label>
                <input value={form.client} onChange={e => setForm(f => ({ ...f, client: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-sm" style={IS} />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color: "hsl(215 25% 45%)" }}>Lead Consultant</label>
                <input value={form.lead} onChange={e => setForm(f => ({ ...f, lead: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-sm" style={IS} />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color: "hsl(215 25% 45%)" }}>Health</label>
                <select value={form.health} onChange={e => setForm(f => ({ ...f, health: e.target.value as HealthStatus }))}
                  className="w-full px-3 py-2 rounded-lg text-sm" style={IS}>
                  {(Object.keys(H_CFG) as HealthStatus[]).map(h => <option key={h} value={h}>{H_CFG[h].label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color: "hsl(215 25% 45%)" }}>Phase</label>
                <select value={form.currentPhase} onChange={e => setForm(f => ({ ...f, currentPhase: e.target.value as Phase }))}
                  className="w-full px-3 py-2 rounded-lg text-sm" style={IS}>
                  {PHASES.map(p => <option key={p} value={p}>{PHASE_LABELS[p]}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color: "hsl(215 25% 45%)" }}>Start Date</label>
                <input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-sm" style={IS} />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color: "hsl(215 25% 45%)" }}>End Date</label>
                <input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-sm" style={IS} />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color: "hsl(215 25% 45%)" }}>Contract Value (USD)</label>
                <input type="number" min={0} value={form.contractValue} onChange={e => setForm(f => ({ ...f, contractValue: Number(e.target.value) }))}
                  className="w-full px-3 py-2 rounded-lg text-sm" style={IS} />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color: "hsl(215 25% 45%)" }}>Billed to Date (USD)</label>
                <input type="number" min={0} value={form.billedToDate} onChange={e => setForm(f => ({ ...f, billedToDate: Number(e.target.value) }))}
                  className="w-full px-3 py-2 rounded-lg text-sm" style={IS} />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color: "hsl(215 25% 45%)" }}>Budget Burned %</label>
                <input type="number" min={0} max={100} value={form.budgetBurned} onChange={e => setForm(f => ({ ...f, budgetBurned: Number(e.target.value) }))}
                  className="w-full px-3 py-2 rounded-lg text-sm" style={IS} />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color: "hsl(215 25% 45%)" }}>Total Hours Budget</label>
                <input type="number" min={0} value={form.hoursTotal} onChange={e => setForm(f => ({ ...f, hoursTotal: Number(e.target.value) }))}
                  className="w-full px-3 py-2 rounded-lg text-sm" style={IS} />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color: "hsl(215 25% 45%)" }}>Client NPS (1-10)</label>
                <input type="number" min={1} max={10} value={form.npsScore ?? ""} onChange={e => setForm(f => ({ ...f, npsScore: e.target.value ? Number(e.target.value) : null }))}
                  className="w-full px-3 py-2 rounded-lg text-sm" style={IS} placeholder="Optional" />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color: "hsl(215 25% 45%)" }}>Last Client Contact</label>
                <input type="date" value={form.lastClientContact} onChange={e => setForm(f => ({ ...f, lastClientContact: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-sm" style={IS} />
              </div>
              <div className="col-span-2">
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color: "hsl(215 25% 45%)" }}>Next Milestone</label>
                <input value={form.nextMilestone} onChange={e => setForm(f => ({ ...f, nextMilestone: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-sm" style={IS} placeholder="e.g. Distributor Shortlist Report" />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color: "hsl(215 25% 45%)" }}>Milestone Due Date</label>
                <input type="date" value={form.nextMilestoneDate} onChange={e => setForm(f => ({ ...f, nextMilestoneDate: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-sm" style={IS} />
              </div>
            </div>

            {/* Risks */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider block mb-2" style={{ color: "hsl(215 25% 45%)" }}>Risks</label>
              <div className="space-y-1 mb-2">
                {form.risks.map((r, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="flex-1 text-xs px-3 py-1.5 rounded-lg" style={{ background: "hsl(216 45% 14%)", color: "hsl(210 40% 80%)" }}>{r}</span>
                    <button onClick={() => setForm(f => ({ ...f, risks: f.risks.filter((_, j) => j !== i) }))} style={{ color: "hsl(0 72% 68%)" }}>×</button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={newRisk} onChange={e => setNewRisk(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && newRisk.trim()) { setForm(f => ({ ...f, risks: [...f.risks, newRisk.trim()] })); setNewRisk(""); } }}
                  className="flex-1 px-3 py-2 rounded-lg text-sm" style={IS} placeholder="Add risk + Enter" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color: "hsl(215 25% 45%)" }}>Notes</label>
              <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2}
                className="w-full px-3 py-2 rounded-lg text-sm resize-none" style={IS} />
            </div>

            <div className="flex gap-3 pt-1">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold"
                style={{ background: "hsl(216 45% 18%)", color: "hsl(210 40% 75%)" }}>Cancel</button>
              <button onClick={save} disabled={create.isPending || update.isPending}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-60"
                style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
                {create.isPending || update.isPending ? "Saving…" : (editId ? "Update" : "Create")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
