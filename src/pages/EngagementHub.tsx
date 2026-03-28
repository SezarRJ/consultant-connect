/**
 * EngagementHub.tsx
 * ─────────────────────────────────────────────────────────────────
 * Hub A: Engagement
 * Sub-services: Client Briefing | Stakeholder Mapper | Tracker |
 *               Documents | Activity Log
 * All AI calls auto-inject the active engagement context.
 * ─────────────────────────────────────────────────────────────────
 */
import { useState } from "react";
import { useEngagementStore, buildEngagementContext } from "@/store/engagementStore";
import { useClaudeAnalysis } from "@/hooks/useClaudeAnalysis";
import {
  FileText, Users, Activity, FolderOpen, ClipboardList,
  Loader2, Copy, Check, Plus, Trash2, AlertTriangle
} from "lucide-react";

// ── Shared sub-nav types ───────────────────────────────────────────
type Tab = "briefing" | "stakeholders" | "tracker" | "documents" | "log";
const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "briefing",     label: "Client Briefing",     icon: FileText       },
  { id: "stakeholders", label: "Stakeholder Mapper",   icon: Users          },
  { id: "tracker",      label: "Engagement Tracker",   icon: Activity       },
  { id: "documents",    label: "Documents",            icon: FolderOpen     },
  { id: "log",          label: "Activity Log",         icon: ClipboardList  },
];

// ── Helper ─────────────────────────────────────────────────────────
function NoEngagement() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <AlertTriangle className="h-8 w-8" style={{ color: "hsl(38 85% 52%)" }} />
      <p className="text-sm font-medium" style={{ color: "hsl(215 25% 55%)" }}>
        No active engagement selected.
      </p>
      <p className="text-xs" style={{ color: "hsl(215 25% 40%)" }}>
        Use the banner above to create or select an engagement.
      </p>
    </div>
  );
}

// ── Tab: Client Briefing ───────────────────────────────────────────
function ClientBriefingTab() {
  const eng = useEngagementStore((s) => s.getActiveEngagement)();
  const [extra, setExtra]   = useState("");
  const [copied, setCopied] = useState(false);

  const { analyze, loading, result } = useClaudeAnalysis({
    modelTier: "flash",
    systemPrompt: `You are a senior consultant producing a structured engagement brief.
${buildEngagementContext(eng)}
Respond ONLY with valid JSON matching this schema exactly:
{
  "executiveSummary": "string",
  "clientProfile": { "background": "string", "decisionMakers": ["string"], "culture": "string" },
  "engagementScope": { "inScope": ["string"], "outOfScope": ["string"] },
  "deliverables": [{ "name": "string", "format": "string", "dueWeek": number }],
  "timeline": [{ "phase": "string", "weeks": "string", "activities": ["string"] }],
  "risks": [{ "risk": "string", "likelihood": "High|Medium|Low", "mitigation": "string" }],
  "questionsForClient": ["string"],
  "nextSteps": ["string"]
}`,
  });

  if (!eng) return <NoEngagement />;

  const run = () =>
    analyze(`Generate a comprehensive engagement brief. ${extra ? "Additional context: " + extra : ""}`);

  const copy = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4 space-y-3" style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 18%)" }}>
        <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: "hsl(215 25% 50%)" }}>
          Additional Context (optional)
        </label>
        <textarea
          rows={2}
          value={extra}
          onChange={(e) => setExtra(e.target.value)}
          placeholder="Any extra notes, constraints, or requests for this brief…"
          className="w-full rounded-lg px-3 py-2 text-sm resize-none"
          style={{ background: "hsl(216 45% 14%)", color: "hsl(210 40% 88%)", border: "1px solid hsl(216 45% 22%)" }}
        />
        <button
          onClick={run}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
          style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
          Generate Engagement Brief
        </button>
      </div>

      {result && !result.raw && (
        <div className="rounded-xl p-5 space-y-5" style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 18%)" }}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold" style={{ color: "hsl(210 40% 90%)" }}>Engagement Brief</h3>
            <button onClick={copy} className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md"
              style={{ background: "hsl(216 45% 18%)", color: "hsl(215 25% 60%)" }}>
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied" : "Copy JSON"}
            </button>
          </div>

          {result.executiveSummary && (
            <Section title="Executive Summary">
              <p className="text-sm leading-relaxed" style={{ color: "hsl(210 40% 78%)" }}>{result.executiveSummary}</p>
            </Section>
          )}
          {result.deliverables?.length > 0 && (
            <Section title="Deliverables">
              {result.deliverables.map((d: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-1.5 border-b" style={{ borderColor: "hsl(216 45% 16%)" }}>
                  <span className="text-sm" style={{ color: "hsl(210 40% 80%)" }}>{d.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded" style={{ background: "hsl(216 45% 16%)", color: "hsl(215 25% 55%)" }}>Week {d.dueWeek} · {d.format}</span>
                </div>
              ))}
            </Section>
          )}
          {result.risks?.length > 0 && (
            <Section title="Key Risks">
              {result.risks.map((r: any, i: number) => (
                <div key={i} className="py-1.5 border-b" style={{ borderColor: "hsl(216 45% 16%)" }}>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.likelihood === "High" ? "bg-red-900/40 text-red-400" : r.likelihood === "Medium" ? "bg-yellow-900/40 text-yellow-400" : "bg-green-900/40 text-green-400"}`}>{r.likelihood}</span>
                    <span className="text-sm font-medium" style={{ color: "hsl(210 40% 82%)" }}>{r.risk}</span>
                  </div>
                  <p className="text-xs mt-0.5 ml-14" style={{ color: "hsl(215 25% 50%)" }}>{r.mitigation}</p>
                </div>
              ))}
            </Section>
          )}
          {result.nextSteps?.length > 0 && (
            <Section title="Next Steps">
              <ol className="space-y-1 list-decimal list-inside">
                {result.nextSteps.map((s: string, i: number) => (
                  <li key={i} className="text-sm" style={{ color: "hsl(210 40% 78%)" }}>{s}</li>
                ))}
              </ol>
            </Section>
          )}
        </div>
      )}
    </div>
  );
}

// ── Tab: Stakeholder Mapper ────────────────────────────────────────
function StakeholderTab() {
  const { getActiveEngagement, addStakeholder, removeStakeholder } = useEngagementStore();
  const eng = getActiveEngagement();
  const [form, setForm] = useState({ name: "", role: "", influence: "Medium" as const, stance: "Neutral" as const });

  if (!eng) return <NoEngagement />;

  const INFLUENCE_COLOR: Record<string, string> = { High: "#ef4444", Medium: "#f59e0b", Low: "#22c55e" };
  const STANCE_COLOR:   Record<string, string> = { Champion: "#22c55e", Supporter: "#3b82f6", Neutral: "#94a3b8", Skeptic: "#f59e0b", Blocker: "#ef4444" };

  return (
    <div className="space-y-4">
      {/* Add form */}
      <div className="rounded-xl p-4 grid grid-cols-2 gap-3" style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 18%)" }}>
        <h3 className="col-span-2 text-sm font-semibold" style={{ color: "hsl(210 40% 88%)" }}>Add Stakeholder</h3>
        {([
          ["Name", "name", "text"],
          ["Role / Title", "role", "text"],
        ] as [string, keyof typeof form, string][]).map(([label, key, type]) => (
          <div key={key}>
            <label className="block text-[10px] uppercase tracking-wider mb-1 font-semibold" style={{ color: "hsl(215 25% 48%)" }}>{label}</label>
            <input type={type} value={form[key] as string} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              className="w-full rounded-md px-3 py-1.5 text-sm"
              style={{ background: "hsl(216 45% 14%)", color: "hsl(210 40% 88%)", border: "1px solid hsl(216 45% 22%)" }} />
          </div>
        ))}
        <div>
          <label className="block text-[10px] uppercase tracking-wider mb-1 font-semibold" style={{ color: "hsl(215 25% 48%)" }}>Influence</label>
          <select value={form.influence} onChange={(e) => setForm((f) => ({ ...f, influence: e.target.value as any }))}
            className="w-full rounded-md px-3 py-1.5 text-sm"
            style={{ background: "hsl(216 45% 14%)", color: "hsl(210 40% 88%)", border: "1px solid hsl(216 45% 22%)" }}>
            {["High", "Medium", "Low"].map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-wider mb-1 font-semibold" style={{ color: "hsl(215 25% 48%)" }}>Stance</label>
          <select value={form.stance} onChange={(e) => setForm((f) => ({ ...f, stance: e.target.value as any }))}
            className="w-full rounded-md px-3 py-1.5 text-sm"
            style={{ background: "hsl(216 45% 14%)", color: "hsl(210 40% 88%)", border: "1px solid hsl(216 45% 22%)" }}>
            {["Champion", "Supporter", "Neutral", "Skeptic", "Blocker"].map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div className="col-span-2">
          <button onClick={() => { if (form.name) { addStakeholder(eng.id, form); setForm({ name: "", role: "", influence: "Medium", stance: "Neutral" }); } }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
            style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </div>
      </div>

      {/* Stakeholder list */}
      {eng.stakeholders.length === 0 ? (
        <p className="text-sm text-center py-8" style={{ color: "hsl(215 25% 42%)" }}>No stakeholders added yet.</p>
      ) : (
        <div className="space-y-2">
          {eng.stakeholders.map((s) => (
            <div key={s.id} className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 18%)" }}>
              <div className="h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                style={{ background: "hsl(216 45% 18%)", color: "hsl(210 40% 72%)" }}>
                {s.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: "hsl(210 40% 88%)" }}>{s.name}</p>
                <p className="text-xs truncate" style={{ color: "hsl(215 25% 48%)" }}>{s.role}</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color: INFLUENCE_COLOR[s.influence], background: `${INFLUENCE_COLOR[s.influence]}18` }}>
                {s.influence}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color: STANCE_COLOR[s.stance], background: `${STANCE_COLOR[s.stance]}18` }}>
                {s.stance}
              </span>
              <button onClick={() => removeStakeholder(eng.id, s.id)}>
                <Trash2 className="h-3.5 w-3.5" style={{ color: "hsl(215 25% 40%)" }} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Tab: Engagement Tracker ────────────────────────────────────────
function TrackerTab() {
  const { getActiveEngagement, updateEngagement } = useEngagementStore();
  const eng = getActiveEngagement();

  if (!eng) return <NoEngagement />;

  const PHASES = ["Discovery", "Analysis", "Strategy", "Delivery", "Review", "Closed"] as const;
  const phaseIndex = PHASES.indexOf(eng.phase as any);

  return (
    <div className="space-y-5">
      {/* Phase progress */}
      <div className="rounded-xl p-5 space-y-4" style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 18%)" }}>
        <h3 className="text-sm font-semibold" style={{ color: "hsl(210 40% 88%)" }}>Engagement Phase</h3>
        <div className="flex items-center gap-0">
          {PHASES.map((phase, i) => {
            const done = i < phaseIndex;
            const current = i === phaseIndex;
            return (
              <div key={phase} className="flex items-center flex-1">
                <button
                  onClick={() => updateEngagement(eng.id, { phase })}
                  className="flex flex-col items-center gap-1 flex-1 transition-all"
                >
                  <div className="h-3 w-3 rounded-full border-2 transition-all"
                    style={{
                      background: done || current ? "hsl(38 95% 52%)" : "hsl(216 45% 20%)",
                      borderColor: done || current ? "hsl(38 95% 52%)" : "hsl(216 45% 28%)",
                      transform: current ? "scale(1.4)" : "scale(1)",
                    }} />
                  <span className="text-[9px] font-medium hidden sm:block"
                    style={{ color: current ? "hsl(38 95% 55%)" : done ? "hsl(215 25% 55%)" : "hsl(215 25% 38%)" }}>
                    {phase}
                  </span>
                </button>
                {i < PHASES.length - 1 && (
                  <div className="h-0.5 flex-1 -mx-1"
                    style={{ background: i < phaseIndex ? "hsl(38 95% 52%)" : "hsl(216 45% 20%)" }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Status + meta */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Client",       value: eng.clientName  },
          { label: "Market",       value: eng.market      },
          { label: "Service Type", value: eng.serviceType },
          { label: "Budget",       value: eng.budget      },
          { label: "Timeline",     value: eng.timeline    },
          { label: "Status",       value: eng.status      },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-lg p-3" style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 18%)" }}>
            <p className="text-[10px] uppercase tracking-wider font-semibold mb-1" style={{ color: "hsl(215 25% 45%)" }}>{label}</p>
            <p className="text-sm font-medium" style={{ color: "hsl(210 40% 85%)" }}>{value || "—"}</p>
          </div>
        ))}
      </div>

      {/* Objectives & Risks */}
      <div className="grid grid-cols-1 gap-3">
        {[
          { label: "Objectives", value: eng.objectives },
          { label: "Key Risks",  value: eng.risks      },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl p-4" style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 18%)" }}>
            <p className="text-[10px] uppercase tracking-wider font-semibold mb-2" style={{ color: "hsl(215 25% 45%)" }}>{label}</p>
            <p className="text-sm leading-relaxed" style={{ color: "hsl(210 40% 75%)" }}>{value || "—"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tab: Documents (placeholder) ──────────────────────────────────
function DocumentsTab() {
  const eng = useEngagementStore((s) => s.getActiveEngagement)();
  if (!eng) return <NoEngagement />;
  return (
    <div className="rounded-xl p-8 flex flex-col items-center gap-3"
      style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 18%)" }}>
      <FolderOpen className="h-10 w-10" style={{ color: "hsl(216 45% 28%)" }} />
      <p className="text-sm font-medium" style={{ color: "hsl(215 25% 50%)" }}>
        Documents for <span style={{ color: "hsl(210 40% 82%)" }}>{eng.clientName}</span>
      </p>
      <p className="text-xs" style={{ color: "hsl(215 25% 38%)" }}>
        Connect your Document Hub (see Documents page) to load files here.
      </p>
    </div>
  );
}

// ── Tab: Activity Log (placeholder) ───────────────────────────────
function ActivityLogTab() {
  const eng = useEngagementStore((s) => s.getActiveEngagement)();
  if (!eng) return <NoEngagement />;
  return (
    <div className="rounded-xl p-8 flex flex-col items-center gap-3"
      style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 18%)" }}>
      <ClipboardList className="h-10 w-10" style={{ color: "hsl(216 45% 28%)" }} />
      <p className="text-sm font-medium" style={{ color: "hsl(215 25% 50%)" }}>
        Activity log is saved per engagement.
      </p>
      <p className="text-xs" style={{ color: "hsl(215 25% 38%)" }}>
        AI outputs, notes, and phase changes will appear here once wired to your backend.
      </p>
    </div>
  );
}

// ── Section helper ─────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest font-semibold mb-2"
        style={{ color: "hsl(215 25% 45%)" }}>{title}</p>
      {children}
    </div>
  );
}

// ── Main Hub ───────────────────────────────────────────────────────
export default function EngagementHub() {
  const [tab, setTab] = useState<Tab>("briefing");

  return (
    <div className="space-y-5 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold" style={{ color: "hsl(210 40% 92%)" }}>Engagement</h1>
        <p className="text-sm mt-0.5" style={{ color: "hsl(215 25% 48%)" }}>
          Manage every aspect of your client engagement in one place.
        </p>
      </div>

      {/* Sub-nav tabs */}
      <div className="flex gap-1 flex-wrap">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: tab === id ? "hsl(38 95% 52% / 0.15)" : "hsl(216 45% 12%)",
              color: tab === id ? "hsl(38 95% 60%)" : "hsl(215 25% 55%)",
              border: tab === id ? "1px solid hsl(38 95% 52% / 0.35)" : "1px solid hsl(216 45% 18%)",
            }}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "briefing"     && <ClientBriefingTab />}
      {tab === "stakeholders" && <StakeholderTab />}
      {tab === "tracker"      && <TrackerTab />}
      {tab === "documents"    && <DocumentsTab />}
      {tab === "log"          && <ActivityLogTab />}
    </div>
  );
}
