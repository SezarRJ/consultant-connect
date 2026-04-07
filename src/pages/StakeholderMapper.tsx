import { useState } from "react";
import { Map, Plus, X, Users, RefreshCw, Sparkles, TrendingUp, Shield, ArrowRight, Edit3 } from "lucide-react";
import { useClaudeAnalysis } from "@/hooks/useClaudeAnalysis";
import { toast } from "sonner";
import { AIDisclaimer } from "@/components/ai/AIDisclaimer";

const SYSTEM_PROMPT = `You are an expert management consultant building a stakeholder analysis for a consulting engagement. Based on the stakeholders listed, generate detailed engagement strategies. Respond ONLY with valid JSON:
{
  "summary": "string",
  "powerDynamics": "string",
  "stakeholders": [
    {
      "name": "string",
      "role": "string",
      "influence": "High|Medium|Low",
      "interest": "High|Medium|Low",
      "stance": "Champion|Supporter|Neutral|Skeptic|Blocker",
      "quadrant": "Manage Closely|Keep Satisfied|Keep Informed|Monitor",
      "motivations": ["string"],
      "concerns": ["string"],
      "engagementStrategy": "string",
      "communicationPreference": "string",
      "keyMessage": "string"
    }
  ],
  "coalitionBuilding": "string",
  "changeResistance": "string",
  "criticalRelationships": ["string"],
  "engagementPlan": [{ "week": "string", "action": "string", "owner": "string" }]
}`;

type Influence = "High" | "Medium" | "Low";
type Stance = "Champion" | "Supporter" | "Neutral" | "Skeptic" | "Blocker";

interface RawStakeholder {
  id: string;
  name: string;
  role: string;
  department: string;
  influence: Influence;
  interest: Influence;
  stance: Stance;
  notes: string;
}

const STANCES: Stance[] = ["Champion", "Supporter", "Neutral", "Skeptic", "Blocker"];
const INFLUENCE_LEVELS: Influence[] = ["High", "Medium", "Low"];

const STANCE_COLORS: Record<Stance, string> = {
  Champion: "hsl(158 64% 55%)", Supporter: "hsl(158 64% 45%)", Neutral: "hsl(215 25% 55%)",
  Skeptic: "hsl(38 95% 60%)", Blocker: "hsl(0 72% 68%)"
};

const BLANK: Omit<RawStakeholder, "id"> = {
  name: "", role: "", department: "", influence: "Medium", interest: "Medium", stance: "Neutral", notes: ""
};

const QLabel: Record<string, { label: string; color: string; desc: string }> = {
  "Manage Closely":  { label: "Manage Closely",  color: "hsl(38 95% 60%)",  desc: "High influence, High interest" },
  "Keep Satisfied":  { label: "Keep Satisfied",  color: "hsl(217 91% 70%)", desc: "High influence, Low interest"  },
  "Keep Informed":   { label: "Keep Informed",   color: "hsl(158 64% 55%)", desc: "Low influence, High interest"  },
  "Monitor":         { label: "Monitor",         color: "hsl(215 25% 55%)", desc: "Low influence, Low interest"   },
};

export default function StakeholderMapper() {
  const [stakeholders, setStakeholders] = useState<RawStakeholder[]>([
    { id: "s1", name: "CEO", role: "Chief Executive Officer", department: "Executive", influence: "High", interest: "High", stance: "Champion", notes: "Key decision maker" },
    { id: "s2", name: "CFO", role: "Chief Financial Officer", department: "Finance", influence: "High", interest: "Medium", stance: "Skeptic", notes: "Concerned about budget" },
    { id: "s3", name: "Head of Operations", role: "VP Operations", department: "Operations", influence: "Medium", interest: "High", stance: "Supporter", notes: "Operational impact owner" },
  ]);
  const [form, setForm] = useState<Omit<RawStakeholder, "id">>(BLANK);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [context, setContext] = useState("");
  const [projectName, setProjectName] = useState("");

  const { result, loading, error, analyze, responseTime } = useClaudeAnalysis({
    systemPrompt: SYSTEM_PROMPT, agentId: "stakeholder", modelTier: "flash"
  });

  const IS = { background: "hsl(216 45% 12%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" };

  const save = () => {
    if (!form.name || !form.role) { toast.error("Name and role are required"); return; }
    if (editId) {
      setStakeholders(ss => ss.map(s => s.id === editId ? { ...s, ...form } : s));
      setEditId(null);
    } else {
      setStakeholders(ss => [...ss, { ...form, id: `s_${Date.now()}` }]);
    }
    setForm(BLANK); setShowForm(false);
    toast.success(editId ? "Stakeholder updated" : "Stakeholder added");
  };

  const del = (id: string) => { setStakeholders(ss => ss.filter(s => s.id !== id)); toast.success("Removed"); };
  const edit = (s: RawStakeholder) => { const { id, ...rest } = s; setForm(rest); setEditId(id); setShowForm(true); };

  const runAnalysis = () => {
    if (stakeholders.length === 0) { toast.error("Add at least one stakeholder"); return; }
    const list = stakeholders.map(s =>
      `- ${s.name} (${s.role}, ${s.department}): Influence=${s.influence}, Interest=${s.interest}, Stance=${s.stance}. Notes: ${s.notes || "None"}`
    ).join("\n");
    analyze(`Project: ${projectName || "Consulting Engagement"}\nContext: ${context || "Strategic transformation initiative"}\n\nStakeholders:\n${list}`);
  };

  const r = result;

  // Group stakeholders into quadrants for visualization
  const quadrants: Record<string, RawStakeholder[]> = {
    "Manage Closely": stakeholders.filter(s => s.influence === "High" && s.interest === "High"),
    "Keep Satisfied": stakeholders.filter(s => s.influence === "High" && s.interest !== "High"),
    "Keep Informed":  stakeholders.filter(s => s.influence !== "High" && s.interest === "High"),
    "Monitor":        stakeholders.filter(s => s.influence !== "High" && s.interest !== "High"),
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display" style={{ color: "hsl(210 40% 94%)" }}>Stakeholder Mapper</h1>
          <p className="text-sm mt-1" style={{ color: "hsl(215 25% 55%)" }}>
            Map, analyze, and plan engagement strategies for all project stakeholders
          </p>
        </div>
        <button onClick={() => { setForm(BLANK); setEditId(null); setShowForm(true); }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
          style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
          <Plus className="h-4 w-4" /> Add Stakeholder
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left — Stakeholder list + inputs */}
        <div className="space-y-4">
          {/* Project context */}
          <div className="rounded-xl p-4 space-y-3" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "hsl(38 95% 52%)" }}>Engagement Context</p>
            <div>
              <label className="text-[10px] mb-1 block" style={{ color: "hsl(215 25% 50%)" }}>Project Name</label>
              <input value={projectName} onChange={e => setProjectName(e.target.value)}
                placeholder="e.g. ERP Implementation" className="w-full px-3 py-2 rounded-lg text-sm" style={IS} />
            </div>
            <div>
              <label className="text-[10px] mb-1 block" style={{ color: "hsl(215 25% 50%)" }}>Initiative Context</label>
              <textarea value={context} onChange={e => setContext(e.target.value)} rows={2}
                placeholder="What change/project are you managing stakeholders for?"
                className="w-full px-3 py-2 rounded-lg text-sm resize-none" style={IS} />
            </div>
          </div>

          {/* Add/Edit form */}
          {showForm && (
            <div className="rounded-xl p-4 space-y-3" style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(38 95% 52%/0.3)" }}>
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold" style={{ color: "hsl(38 95% 60%)" }}>
                  {editId ? "Edit Stakeholder" : "New Stakeholder"}
                </p>
                <button onClick={() => setShowForm(false)}><X className="h-4 w-4" style={{ color: "hsl(215 25% 45%)" }} /></button>
              </div>
              <div className="space-y-2">
                <input value={form.name} onChange={e => setForm(v => ({ ...v, name: e.target.value }))}
                  placeholder="Name / Title *" className="w-full px-3 py-2 rounded-lg text-sm" style={IS} />
                <input value={form.role} onChange={e => setForm(v => ({ ...v, role: e.target.value }))}
                  placeholder="Role / Position *" className="w-full px-3 py-2 rounded-lg text-sm" style={IS} />
                <input value={form.department} onChange={e => setForm(v => ({ ...v, department: e.target.value }))}
                  placeholder="Department" className="w-full px-3 py-2 rounded-lg text-sm" style={IS} />
                <div className="grid grid-cols-3 gap-2">
                  {(["influence", "interest"] as const).map(key => (
                    <div key={key}>
                      <label className="text-[9px] mb-1 block capitalize" style={{ color: "hsl(215 25% 45%)" }}>{key}</label>
                      <select value={form[key]} onChange={e => setForm(v => ({ ...v, [key]: e.target.value as Influence }))}
                        className="w-full px-2 py-1.5 rounded-lg text-xs" style={IS}>
                        {INFLUENCE_LEVELS.map(l => <option key={l}>{l}</option>)}
                      </select>
                    </div>
                  ))}
                  <div>
                    <label className="text-[9px] mb-1 block" style={{ color: "hsl(215 25% 45%)" }}>Stance</label>
                    <select value={form.stance} onChange={e => setForm(v => ({ ...v, stance: e.target.value as Stance }))}
                      className="w-full px-2 py-1.5 rounded-lg text-xs" style={IS}>
                      {STANCES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <textarea value={form.notes} onChange={e => setForm(v => ({ ...v, notes: e.target.value }))} rows={2}
                  placeholder="Key notes, motivations, concerns..." className="w-full px-3 py-2 rounded-lg text-xs resize-none" style={IS} />
                <div className="flex gap-2">
                  <button onClick={save}
                    className="flex-1 py-2 rounded-lg text-xs font-semibold"
                    style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
                    {editId ? "Update" : "Add"}
                  </button>
                  <button onClick={() => setShowForm(false)}
                    className="flex-1 py-2 rounded-lg text-xs font-semibold"
                    style={{ background: "hsl(216 45% 18%)", color: "hsl(215 25% 55%)" }}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Stakeholder List */}
          <div className="space-y-2">
            {stakeholders.map(s => (
              <div key={s.id} className="rounded-xl p-3" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold" style={{ color: "hsl(210 40% 88%)" }}>{s.name}</p>
                    <p className="text-[10px]" style={{ color: "hsl(215 25% 50%)" }}>{s.role}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => edit(s)} className="p-1 rounded hover:bg-white/5">
                      <Edit3 className="h-3 w-3" style={{ color: "hsl(215 25% 45%)" }} />
                    </button>
                    <button onClick={() => del(s.id)} className="p-1 rounded hover:bg-white/5">
                      <X className="h-3 w-3" style={{ color: "hsl(215 25% 45%)" }} />
                    </button>
                  </div>
                </div>
                <div className="flex gap-1 mt-2 flex-wrap">
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold"
                    style={{ background: `${STANCE_COLORS[s.stance]}20`, color: STANCE_COLORS[s.stance] }}>
                    {s.stance}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full"
                    style={{ background: "hsl(216 45% 18%)", color: "hsl(215 25% 55%)" }}>
                    Influence: {s.influence}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full"
                    style={{ background: "hsl(216 45% 18%)", color: "hsl(215 25% 55%)" }}>
                    Interest: {s.interest}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button onClick={runAnalysis} disabled={loading || stakeholders.length === 0}
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold"
            style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)", opacity: loading || stakeholders.length === 0 ? 0.6 : 1 }}>
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "Analyzing..." : "Generate Engagement Strategy"}
          </button>
        </div>

        {/* Right — Quadrant map + analysis */}
        <div className="lg:col-span-2 space-y-4">

          {/* Power/Interest Matrix */}
          <div className="rounded-xl p-5" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <p className="text-xs font-bold mb-4 uppercase tracking-widest" style={{ color: "hsl(38 95% 52%)" }}>
              Power / Interest Matrix
            </p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(quadrants).map(([qName, stakers]) => {
                const q = QLabel[qName];
                return (
                  <div key={qName} className="rounded-xl p-3 min-h-[100px]"
                    style={{ background: `${q.color}0A`, border: `1px solid ${q.color}25` }}>
                    <p className="text-[10px] font-bold mb-1" style={{ color: q.color }}>{q.label}</p>
                    <p className="text-[9px] mb-2" style={{ color: "hsl(215 25% 40%)" }}>{q.desc}</p>
                    <div className="space-y-1">
                      {stakers.map(s => (
                        <div key={s.id} className="flex items-center gap-1.5">
                          <div className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: STANCE_COLORS[s.stance] }} />
                          <p className="text-[10px] font-medium" style={{ color: "hsl(210 40% 80%)" }}>{s.name}</p>
                        </div>
                      ))}
                      {stakers.length === 0 && (
                        <p className="text-[10px]" style={{ color: "hsl(215 25% 30%)" }}>None assigned</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-2">
            {STANCES.map(s => (
              <div key={s} className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full" style={{ background: STANCE_COLORS[s] }} />
                <span className="text-[10px]" style={{ color: "hsl(215 25% 50%)" }}>{s}</span>
              </div>
            ))}
          </div>

          {/* AI Analysis */}
          {loading && (
            <div className="flex flex-col items-center justify-center h-48 rounded-xl"
              style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
              <RefreshCw className="h-8 w-8 animate-spin mb-3" style={{ color: "hsl(38 95% 52%)" }} />
              <p className="text-sm" style={{ color: "hsl(215 25% 55%)" }}>Analyzing stakeholder dynamics...</p>
            </div>
          )}

          {r && !loading && (
          <>
            <AIDisclaimer compact />
              {/* Summary */}
              <div className="rounded-xl p-4" style={{ background: "hsl(216 45% 12%)" }}>
                <p className="text-xs font-bold mb-2" style={{ color: "hsl(38 95% 60%)" }}>Stakeholder Landscape Summary</p>
                <p className="text-sm" style={{ color: "hsl(215 25% 68%)" }}>{r.summary}</p>
              </div>

              {/* Individual strategies */}
              <div className="space-y-3">
                {(r.stakeholders || []).map((s: any, i: number) => (
                  <div key={i} className="rounded-xl p-4" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <p className="text-sm font-bold" style={{ color: "hsl(210 40% 92%)" }}>{s.name}</p>
                        <p className="text-xs" style={{ color: "hsl(215 25% 55%)" }}>{s.role}</p>
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold"
                          style={{ background: `${STANCE_COLORS[s.stance as Stance] || "hsl(215 25% 55%)"}20`, color: STANCE_COLORS[s.stance as Stance] || "hsl(215 25% 55%)" }}>
                          {s.stance}
                        </span>
                        {s.quadrant && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full"
                            style={{ background: "hsl(216 45% 18%)", color: "hsl(215 25% 55%)" }}>
                            {s.quadrant}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      {s.motivations?.length > 0 && (
                        <div>
                          <p className="text-[9px] mb-1 font-semibold" style={{ color: "hsl(158 64% 50%)" }}>Motivations</p>
                          {s.motivations.slice(0, 2).map((m: string, j: number) => (
                            <p key={j} className="text-[10px]" style={{ color: "hsl(215 25% 60%)" }}>• {m}</p>
                          ))}
                        </div>
                      )}
                      {s.concerns?.length > 0 && (
                        <div>
                          <p className="text-[9px] mb-1 font-semibold" style={{ color: "hsl(38 95% 60%)" }}>Concerns</p>
                          {s.concerns.slice(0, 2).map((c: string, j: number) => (
                            <p key={j} className="text-[10px]" style={{ color: "hsl(215 25% 60%)" }}>• {c}</p>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="rounded-lg p-3" style={{ background: "hsl(216 45% 11%)" }}>
                      <p className="text-[9px] mb-1 font-semibold uppercase" style={{ color: "hsl(38 95% 52%)" }}>Engagement Strategy</p>
                      <p className="text-xs" style={{ color: "hsl(215 25% 65%)" }}>{s.engagementStrategy}</p>
                      {s.keyMessage && (
                        <p className="text-[10px] mt-2 italic" style={{ color: "hsl(217 91% 70%)" }}>
                          Key Message: "{s.keyMessage}"
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
