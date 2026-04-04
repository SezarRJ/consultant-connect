/**
 * EngagementHub.tsx — Full Engagement Workspace
 */
import { useState } from "react";
import {
  useEngagementStore,
  buildEngagementContext,
  Engagement,
  EngagementPhase,
  HealthStatus,
  Stakeholder,
} from "@/store/engagementStore";
import RequirementsPanel from "@/components/engagement/RequirementsPanel";
import { useClaudeAnalysis } from "@/hooks/useClaudeAnalysis";
import {
  Briefcase, Users, Activity, FolderOpen, ClipboardList,
  Plus, Trash2, Loader2, FileText, Copy, Check,
  AlertTriangle, Save, X,
} from "lucide-react";

type Tab = "overview"|"stakeholders"|"tracker"|"documents"|"log";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "overview",     label: "Overview",     icon: Briefcase    },
  { id: "stakeholders", label: "Stakeholders", icon: Users        },
  { id: "tracker",      label: "Tracker",      icon: Activity     },
  { id: "documents",    label: "Documents",    icon: FolderOpen   },
  { id: "log",          label: "Activity Log", icon: ClipboardList},
];

const PHASES: EngagementPhase[] = ["Discovery","Analysis","Strategy","Deliverables","Follow-up","Closed"];
const HEALTH_OPTIONS: HealthStatus[] = ["On Track","At Risk","Delayed","Waiting on Client","Closed"];

const PHASE_COLOR: Record<string, string> = {
  Discovery:    "hsl(38 95% 52%)",
  Analysis:     "hsl(200 80% 55%)",
  Strategy:     "hsl(270 70% 60%)",
  Deliverables: "hsl(145 65% 45%)",
  "Follow-up":  "hsl(30 90% 55%)",
  Closed:       "hsl(215 25% 45%)",
};
const HEALTH_COLOR: Record<string, string> = {
  "On Track":       "hsl(145 65% 45%)",
  "At Risk":        "hsl(38 85% 52%)",
  "Delayed":        "hsl(0 72% 60%)",
  "Waiting on Client": "hsl(200 80% 55%)",
  Closed:           "hsl(215 25% 45%)",
};

// ── Helpers ───────────────────────────────────────────────────────
function NoEngagement() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <AlertTriangle className="h-8 w-8" style={{ color: "hsl(38 85% 52%)" }} />
      <p className="text-sm font-medium" style={{ color: "hsl(215 25% 55%)" }}>No active engagement.</p>
      <p className="text-xs" style={{ color: "hsl(215 25% 40%)" }}>
        Go to CRM → qualify a lead → Convert to Engagement.
      </p>
    </div>
  );
}

// ── Client Briefing ───────────────────────────────────────────────
function ClientBriefing({ eng }: { eng: Engagement }) {
  const { saveOutput } = useEngagementStore();
  const [extra,  setExtra]  = useState("");
  const [copied, setCopied] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const existing = eng.outputs["briefing"];

  const { analyze, loading, rawText } = useClaudeAnalysis({
    modelTier: "flash",
    systemPrompt: `You are a senior consultant producing a structured engagement brief.
${buildEngagementContext(eng)}
Produce a structured engagement brief with these sections:
## Executive Summary
## Client Profile
## Engagement Scope
## Key Deliverables
## Risk Register
## Questions for Client
## Recommended Next Steps`,
  });

  const content = rawText || existing?.content || "";

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4 space-y-3"
        style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 18%)" }}>
        <p className="text-xs font-semibold" style={{ color: "hsl(210 40% 85%)" }}>
          Generate Client Briefing Document
        </p>
        <textarea rows={2} value={extra} onChange={(e) => setExtra(e.target.value)}
          placeholder="Additional context or special requirements…"
          className="w-full rounded-md px-3 py-2 text-sm resize-none"
          style={{ background: "hsl(216 45% 14%)", color: "hsl(210 40% 88%)", border: "1px solid hsl(216 45% 22%)" }} />
        <div className="flex gap-2">
          <button onClick={() => { analyze(`Generate engagement brief. ${extra}`); setSaved(false); }}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
            style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
            Generate Brief
          </button>
          {rawText && (
            <button onClick={() => { saveOutput(eng.id, "briefing", "Client Briefing", rawText, "Discovery"); setSaved(true); }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold"
              style={{
                background: saved ? "hsl(145 65% 40%/0.15)" : "hsl(216 45% 18%)",
                color:      saved ? "hsl(145 65% 55%)"      : "hsl(38 95% 55%)",
              }}>
              {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
              {saved ? "Saved!" : "Save to Engagement"}
            </button>
          )}
        </div>
      </div>

      {content && (
        <div className="rounded-xl p-5" style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 18%)" }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: "hsl(215 25% 45%)" }}>
              Client Brief
            </p>
            <button onClick={() => { navigator.clipboard.writeText(content); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md"
              style={{ background: "hsl(216 45% 18%)", color: "hsl(215 25% 55%)" }}>
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />} Copy
            </button>
          </div>
          <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "hsl(210 40% 80%)" }}>
            {content}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Overview Tab ──────────────────────────────────────────────────
function OverviewTab({ eng }: { eng: Engagement }) {
  const { updateEngagement, completePhase } = useEngagementStore();
  const [showBrief, setShowBrief] = useState(false);
  const phaseIdx = PHASES.indexOf(eng.phase);

  return (
    <div className="space-y-5">
      {/* Phase tracker */}
      <div className="rounded-xl p-5" style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 18%)" }}>
        <p className="text-[10px] uppercase tracking-widest font-semibold mb-4" style={{ color: "hsl(215 25% 40%)" }}>
          Engagement Phase
        </p>
        <div className="flex items-center">
          {PHASES.map((phase, i) => {
            const done = i < phaseIdx;
            const cur  = i === phaseIdx;
            return (
              <div key={phase} className="flex items-center flex-1">
                <button onClick={() => updateEngagement(eng.id, { phase })}
                  className="flex flex-col items-center gap-1.5 flex-1 transition-all">
                  <div className="h-3 w-3 rounded-full border-2 transition-all"
                    style={{
                      background:  done || cur ? "hsl(38 95% 52%)" : "hsl(216 45% 20%)",
                      borderColor: done || cur ? "hsl(38 95% 52%)" : "hsl(216 45% 28%)",
                      transform:   cur ? "scale(1.5)" : "scale(1)",
                    }} />
                  <span className="text-[9px] font-medium hidden sm:block"
                    style={{ color: cur ? "hsl(38 95% 55%)" : done ? "hsl(215 25% 55%)" : "hsl(215 25% 35%)" }}>
                    {phase}
                  </span>
                </button>
                {i < PHASES.length - 1 && (
                  <div className="h-0.5 flex-1 -mx-1"
                    style={{ background: i < phaseIdx ? "hsl(38 95% 52%)" : "hsl(216 45% 20%)" }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Meta grid */}
      <div className="grid grid-cols-3 gap-3">
        {([
          ["Client",   eng.clientName],
          ["Company",  eng.companyName],
          ["Industry", eng.industry],
          ["Market",   eng.market],
          ["Service",  eng.serviceType],
          ["Budget",   eng.budget],
          ["Timeline", eng.timeline],
          ["Priority", eng.priority],
          ["Progress", `${eng.progress}%`],
        ] as [string, string][]).map(([label, value]) => (
          <div key={label} className="rounded-lg p-3"
            style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 18%)" }}>
            <p className="text-[9px] uppercase tracking-wider font-semibold mb-0.5"
              style={{ color: "hsl(215 25% 42%)" }}>{label}</p>
            <p className="text-xs font-medium" style={{ color: "hsl(210 40% 85%)" }}>{value || "—"}</p>
          </div>
        ))}
      </div>

      <RequirementsPanel eng={eng} />

      <div className="flex justify-end">
        <button onClick={() => completePhase(eng.id, eng.phase)} className="px-4 py-2 rounded-lg text-sm font-semibold"
          style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
          Complete {eng.phase} and move forward
        </button>
      </div>

      {/* Health + progress */}
      <div className="flex gap-3">
        <div className="rounded-xl p-4 flex-1" style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 18%)" }}>
          <p className="text-[10px] uppercase tracking-wider font-semibold mb-2" style={{ color: "hsl(215 25% 42%)" }}>
            Health Status
          </p>
          <select value={eng.health}
            onChange={(e) => updateEngagement(eng.id, { health: e.target.value as HealthStatus })}
            className="w-full rounded-md px-3 py-1.5 text-sm"
            style={{ background: "hsl(216 45% 14%)", color: HEALTH_COLOR[eng.health], border: "1px solid hsl(216 45% 22%)" }}>
            {HEALTH_OPTIONS.map((h) => <option key={h}>{h}</option>)}
          </select>
        </div>
        <div className="rounded-xl p-4 flex-1" style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 18%)" }}>
          <p className="text-[10px] uppercase tracking-wider font-semibold mb-2" style={{ color: "hsl(215 25% 42%)" }}>
            Progress
          </p>
          <input type="range" min={0} max={100} value={eng.progress}
            onChange={(e) => updateEngagement(eng.id, { progress: Number(e.target.value) })}
            className="w-full" />
          <p className="text-xs mt-1 text-right font-semibold" style={{ color: "hsl(38 95% 52%)" }}>
            {eng.progress}%
          </p>
        </div>
      </div>

      {/* Objectives / Risks */}
      {([["Objectives", eng.objectives], ["Key Risks", eng.risks], ["Scope", eng.scope]] as [string, string][]).map(
        ([l, v]) => v ? (
          <div key={l} className="rounded-xl p-4" style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 18%)" }}>
            <p className="text-[10px] uppercase tracking-wider font-semibold mb-1.5"
              style={{ color: "hsl(215 25% 42%)" }}>{l}</p>
            <p className="text-sm leading-relaxed" style={{ color: "hsl(210 40% 75%)" }}>{v}</p>
          </div>
        ) : null
      )}

      <button onClick={() => setShowBrief((v) => !v)}
        className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg"
        style={{ background: "hsl(216 45% 16%)", color: "hsl(38 95% 55%)" }}>
        <FileText className="h-4 w-4" />
        {showBrief ? "Hide" : "Generate"} Client Briefing
      </button>
      {showBrief && <ClientBriefing eng={eng} />}
    </div>
  );
}

// ── Stakeholders Tab ──────────────────────────────────────────────
function StakeholdersTab({ eng }: { eng: Engagement }) {
  const { addStakeholder, removeStakeholder } = useEngagementStore();
  const blank: Omit<Stakeholder, "id"> = {
    name: "", position: "", company: eng.companyName,
    role: "Influencer", influence: "Medium", stance: "Neutral",
    contactDetails: "", notes: "", nextStep: "",
  };
  const [form,     setForm]     = useState(blank);
  const [showForm, setShowForm] = useState(false);

  const STANCE_COLOR: Record<string, string> = {
    Champion: "hsl(145 65% 48%)", Supporter: "hsl(200 80% 55%)", Neutral: "hsl(215 25% 55%)",
    Skeptic:  "hsl(38 85% 52%)",  Blocker:   "hsl(0 72% 60%)",
  };

  const sf = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold" style={{ color: "hsl(210 40% 88%)" }}>
          {eng.stakeholders.length} Stakeholder{eng.stakeholders.length !== 1 ? "s" : ""}
        </p>
        <button onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold"
          style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
          <Plus className="h-3.5 w-3.5" /> Add Stakeholder
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl p-4 space-y-3"
          style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 18%)" }}>
          <div className="grid grid-cols-2 gap-3">
            {([["Name","name"],["Position","position"],["Contact","contactDetails"]] as [string, keyof typeof form][]).map(([l,k]) => (
              <div key={k}>
                <label className="block text-[10px] uppercase tracking-wider font-semibold mb-1"
                  style={{ color: "hsl(215 25% 48%)" }}>{l}</label>
                <input type="text" value={form[k] as string} onChange={sf(k)}
                  className="w-full rounded-md px-3 py-1.5 text-sm"
                  style={{ background: "hsl(216 45% 14%)", color: "hsl(210 40% 88%)", border: "1px solid hsl(216 45% 22%)" }} />
              </div>
            ))}
            {([
              ["Role",      "role",      ["Decision Maker","Champion","Influencer","End User","Gatekeeper"]],
              ["Influence", "influence", ["High","Medium","Low"]],
              ["Stance",    "stance",    ["Champion","Supporter","Neutral","Skeptic","Blocker"]],
            ] as [string, keyof typeof form, string[]][]).map(([l,k,opts]) => (
              <div key={k}>
                <label className="block text-[10px] uppercase tracking-wider font-semibold mb-1"
                  style={{ color: "hsl(215 25% 48%)" }}>{l}</label>
                <select value={form[k] as string} onChange={sf(k)}
                  className="w-full rounded-md px-3 py-1.5 text-sm"
                  style={{ background: "hsl(216 45% 14%)", color: "hsl(210 40% 88%)", border: "1px solid hsl(216 45% 22%)" }}>
                  {opts.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => { if (form.name) { addStakeholder(eng.id, form); setForm(blank); setShowForm(false); } }}
              className="px-4 py-2 rounded-lg text-sm font-semibold"
              style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>Add</button>
            <button onClick={() => setShowForm(false)}
              className="px-3 py-2 rounded-lg text-sm"
              style={{ background: "hsl(216 45% 18%)", color: "hsl(215 25% 55%)" }}>Cancel</button>
          </div>
        </div>
      )}

      {eng.stakeholders.length === 0
        ? <p className="text-sm text-center py-8" style={{ color: "hsl(215 25% 42%)" }}>No stakeholders added yet.</p>
        : (
          <div className="space-y-2">
            {eng.stakeholders.map((s) => (
              <div key={s.id} className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 18%)" }}>
                <div className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ background: "hsl(216 45% 18%)", color: "hsl(210 40% 72%)" }}>
                  {s.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: "hsl(210 40% 88%)" }}>{s.name}</p>
                  <p className="text-xs" style={{ color: "hsl(215 25% 48%)" }}>{s.position} · {s.role}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ color: STANCE_COLOR[s.stance], background: `${STANCE_COLOR[s.stance]}18` }}>
                  {s.stance}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "hsl(216 45% 18%)", color: "hsl(215 25% 55%)" }}>
                  {s.influence}
                </span>
                <button onClick={() => removeStakeholder(eng.id, s.id)}>
                  <Trash2 className="h-3.5 w-3.5" style={{ color: "hsl(215 25% 40%)" }} />
                </button>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}

// ── Tracker Tab ───────────────────────────────────────────────────
function TrackerTab({ eng }: { eng: Engagement }) {
  const { updateEngagement, completePhase } = useEngagementStore();
  return (
    <div className="grid grid-cols-2 gap-4">
      {([
        ["Engagement Name", "name"],
        ["Client Name",     "clientName"],
        ["Company",         "companyName"],
        ["Market",          "market"],
        ["Budget",          "budget"],
        ["Timeline",        "timeline"],
        ["Start Date",      "startDate"],
        ["End Date",        "endDate"],
      ] as [string, keyof Engagement][]).map(([label, key]) => (
        <div key={key} className="rounded-lg p-3"
          style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 18%)" }}>
          <p className="text-[9px] uppercase tracking-wider font-semibold mb-1"
            style={{ color: "hsl(215 25% 42%)" }}>{label}</p>
          <input type="text" value={(eng[key] as string) || ""}
            onChange={(e) => updateEngagement(eng.id, { [key]: e.target.value } as Partial<Engagement>)}
            className="w-full bg-transparent text-sm font-medium"
            style={{ color: "hsl(210 40% 85%)" }} />
        </div>
      ))}
    </div>
  );
}

// ── Activity Log Tab ──────────────────────────────────────────────
function ActivityLogTab({ eng }: { eng: Engagement }) {
  const outputs = Object.values(eng.outputs).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold" style={{ color: "hsl(210 40% 85%)" }}>
        {outputs.length} saved output{outputs.length !== 1 ? "s" : ""}
      </p>
      {outputs.length === 0 ? (
        <p className="text-sm text-center py-8" style={{ color: "hsl(215 25% 42%)" }}>
          No outputs saved yet. Run Analysis, Strategy, or Deliverables tools and click "Save to Engagement".
        </p>
      ) : (
        outputs.map((o) => (
          <div key={o.toolId} className="rounded-xl p-4"
            style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 18%)" }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{
                    background: `${PHASE_COLOR[o.phase] || "hsl(215 25% 45%)"}18`,
                    color: PHASE_COLOR[o.phase] || "hsl(215 25% 45%)",
                  }}>{o.phase}</span>
                <span className="text-xs font-semibold" style={{ color: "hsl(210 40% 85%)" }}>{o.toolLabel}</span>
              </div>
              <span className="text-[10px]" style={{ color: "hsl(215 25% 40%)" }}>
                {new Date(o.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-xs leading-relaxed line-clamp-3" style={{ color: "hsl(210 40% 68%)" }}>
              {o.content.slice(0, 200)}{o.content.length > 200 ? "…" : ""}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────
export default function EngagementHub() {
  const { getActiveEngagement } = useEngagementStore();
  const eng = getActiveEngagement();
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <div className="space-y-5 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold" style={{ color: "hsl(210 40% 92%)" }}>Engagement</h1>
        <p className="text-sm mt-0.5" style={{ color: "hsl(215 25% 48%)" }}>
          Full workspace for the active client engagement.
        </p>
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: tab === id ? "hsl(38 95% 52%/0.15)" : "hsl(216 45% 12%)",
              color:      tab === id ? "hsl(38 95% 60%)"      : "hsl(215 25% 55%)",
              border:     tab === id ? "1px solid hsl(38 95% 52%/0.35)" : "1px solid hsl(216 45% 18%)",
            }}>
            <Icon className="h-3.5 w-3.5" />{label}
          </button>
        ))}
      </div>

      {!eng ? <NoEngagement /> : (
        <>
          {tab === "overview"     && <OverviewTab     eng={eng} />}
          {tab === "stakeholders" && <StakeholdersTab eng={eng} />}
          {tab === "tracker"      && <TrackerTab      eng={eng} />}
          {tab === "documents"    && (
            <div className="rounded-xl p-8 text-center"
              style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 18%)" }}>
              <FolderOpen className="h-10 w-10 mx-auto mb-3" style={{ color: "hsl(216 45% 28%)" }} />
              <p className="text-sm" style={{ color: "hsl(215 25% 48%)" }}>
                Document storage for <strong style={{ color: "hsl(210 40% 82%)" }}>{eng.companyName}</strong>.
              </p>
              <p className="text-xs mt-1" style={{ color: "hsl(215 25% 38%)" }}>
                Connect your document backend to load files here.
              </p>
            </div>
          )}
          {tab === "log" && <ActivityLogTab eng={eng} />}
        </>
      )}
    </div>
  );
}
