/**
 * ActiveEngagementBanner.tsx
 * Persistent top bar — shows active client, phase, health, and quick nav.
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEngagementStore, Engagement, EngagementPhase, type ServiceCategory } from "@/store/engagementStore";
import { Briefcase, ChevronDown, Plus, Check, AlertTriangle, Activity, X } from "lucide-react";

const PHASES: EngagementPhase[] = ["Discovery","Data Collection","Analysis","Strategy","Deliverables","Review","Closed"];
const PHASE_COLOR: Record<string, string> = {
  Discovery:"hsl(38 95% 52%)", "Data Collection":"hsl(200 80% 55%)", Analysis:"hsl(270 70% 60%)",
  Strategy:"hsl(145 65% 45%)", Deliverables:"hsl(30 90% 55%)", Review:"hsl(217 91% 68%)", Closed:"hsl(215 25% 45%)",
};
const HEALTH_COLOR: Record<string, string> = {
  "On Track":"hsl(145 65% 45%)", "At Risk":"hsl(38 85% 52%)",
  "Delayed":"hsl(0 72% 60%)", "Waiting on Client":"hsl(200 80% 55%)", Closed:"hsl(215 25% 45%)",
};

function NewEngagementModal({ onClose }: { onClose: () => void }) {
  const { createEngagement } = useEngagementStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name:"", clientName:"", companyName:"", industry:"", sector:"", market:"Iraq",
    serviceType:"", budget:"", timeline:"6 months", objectives:"", scope:"",
    constraints:"", risks:"", internalNotes:"", priority:"Medium" as const,
    phase:"Discovery" as EngagementPhase, status:"Active" as const, health:"On Track" as const,
    progress:0, stakeholders:[], outputs:{}, contactId:null,
    startDate:new Date().toISOString().slice(0,10), endDate:"",
    requestSummary:{ serviceRequest:"", serviceCategory:"Strategic Management" as ServiceCategory, expectedOutputs:[], requestedReports:[], summary:"" },
    resources:[], phaseRequirements:{ Discovery:{ phase:"Discovery", requiredInfo:["Customer objectives","Scope","Stakeholders"], requiredDocuments:["Briefing note","Company profile","Meeting notes"], notes:"" } }, requestedOutputs:[],
  });
  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background:"rgba(0,0,0,0.72)" }}>
      <div className="w-full max-w-lg rounded-xl p-6 space-y-4 overflow-y-auto max-h-[90vh]"
        style={{ background:"hsl(216 58% 8%)", border:"1px solid hsl(216 45% 20%)" }}>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold" style={{ color:"hsl(210 40% 92%)" }}>New Engagement</h2>
          <button onClick={onClose}><X className="h-4 w-4" style={{ color:"hsl(215 25% 50%)" }} /></button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {([
            ["Engagement Name","name"],["Client Name","clientName"],
            ["Company","companyName"],["Industry","industry"],
            ["Market/Country","market"],["Service Type","serviceType"],
            ["Budget","budget"],["Timeline","timeline"],
          ] as [string,string][]).map(([label,key]) => (
            <div key={key}>
              <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color:"hsl(215 25% 48%)" }}>{label}</label>
              <input type="text" value={(form as any)[key]} onChange={f(key as any)}
                className="w-full rounded-md px-3 py-1.5 text-sm"
                style={{ background:"hsl(216 45% 12%)", color:"hsl(210 40% 88%)", border:"1px solid hsl(216 45% 22%)" }} />
            </div>
          ))}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color:"hsl(215 25% 48%)" }}>Priority</label>
            <select value={form.priority} onChange={f("priority")} className="w-full rounded-md px-3 py-1.5 text-sm"
              style={{ background:"hsl(216 45% 12%)", color:"hsl(210 40% 88%)", border:"1px solid hsl(216 45% 22%)" }}>
              {["High","Medium","Low"].map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color:"hsl(215 25% 48%)" }}>Phase</label>
            <select value={form.phase} onChange={f("phase")} className="w-full rounded-md px-3 py-1.5 text-sm"
              style={{ background:"hsl(216 45% 12%)", color:"hsl(210 40% 88%)", border:"1px solid hsl(216 45% 22%)" }}>
              {PHASES.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color:"hsl(215 25% 48%)" }}>Objectives</label>
          <textarea rows={2} value={form.objectives} onChange={f("objectives")} className="w-full rounded-md px-3 py-2 text-sm resize-none"
            style={{ background:"hsl(216 45% 12%)", color:"hsl(210 40% 88%)", border:"1px solid hsl(216 45% 22%)" }} />
        </div>
        <div className="flex gap-2 pt-1">
          <button onClick={() => { if (form.clientName||form.name) { createEngagement(form); onClose(); navigate("/engagement"); } }}
            className="flex-1 py-2 rounded-lg text-sm font-semibold"
            style={{ background:"hsl(38 95% 52%)", color:"hsl(216 58% 6%)" }}>
            Create & Set Active
          </button>
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm"
            style={{ background:"hsl(216 45% 18%)", color:"hsl(210 40% 72%)" }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export function ActiveEngagementBanner() {
  const { engagements, activeEngagementId, setActiveEngagement, getActiveEngagement } = useEngagementStore();
  const active = getActiveEngagement();
  const [open, setOpen] = useState(false);
  const [showNew, setShowNew] = useState(false);

  return (
    <>
      <div className="flex items-center gap-3 px-4 py-2.5 border-b shrink-0"
        style={{ background:"hsl(216 58% 7%)", borderColor:"hsl(216 45% 18%)", minHeight:50 }}>
        <Briefcase className="h-4 w-4 shrink-0" style={{ color:"hsl(38 95% 52%)" }} />

        {active ? (
          <>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
              style={{ background:`${PHASE_COLOR[active.phase]}18`, color:PHASE_COLOR[active.phase], border:`1px solid ${PHASE_COLOR[active.phase]}30` }}>
              {active.phase}
            </span>
            <span className="text-sm font-semibold truncate" style={{ color:"hsl(210 40% 92%)" }}>
              {active.companyName||active.clientName}
            </span>
            <span className="text-xs truncate hidden sm:block" style={{ color:"hsl(215 25% 50%)" }}>
              {active.serviceType} · {active.market}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 hidden md:block"
              style={{ background:`${HEALTH_COLOR[active.health]}18`, color:HEALTH_COLOR[active.health] }}>
              <Activity className="h-2.5 w-2.5 inline mr-0.5" />{active.health}
            </span>
          </>
        ) : (
          <span className="flex items-center gap-1.5 text-sm" style={{ color:"hsl(215 25% 50%)" }}>
            <AlertTriangle className="h-3.5 w-3.5" style={{ color:"hsl(38 85% 50%)" }} />
            No active engagement
          </span>
        )}

        {/* Switcher */}
        <div className="relative ml-auto shrink-0">
          <button onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg"
            style={{ background:"hsl(216 45% 16%)", color:"hsl(38 95% 55%)" }}>
            Switch <ChevronDown className="h-3 w-3" />
          </button>
          {open && (
            <div className="absolute right-0 top-9 z-40 w-64 rounded-xl py-2 shadow-2xl"
              style={{ background:"hsl(216 58% 8%)", border:"1px solid hsl(216 45% 20%)" }}>
              {engagements.length === 0
                ? <p className="px-4 py-3 text-xs" style={{ color:"hsl(215 25% 45%)" }}>No engagements yet.</p>
                : engagements.map((e) => (
                  <button key={e.id} onClick={() => { setActiveEngagement(e.id); setOpen(false); }}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-xs transition-all hover:opacity-80"
                    style={{ background:e.id===activeEngagementId?"hsl(38 95% 52%/0.1)":"transparent", color:"hsl(210 40% 82%)" }}>
                    {e.id===activeEngagementId && <Check className="h-3 w-3 shrink-0" style={{ color:"hsl(38 95% 52%)" }} />}
                    <span className="flex-1 truncate font-medium">{e.companyName||e.clientName}</span>
                    <span style={{ color:"hsl(215 25% 45%)" }}>{e.phase}</span>
                  </button>
                ))
              }
              <div className="border-t mt-1 pt-1" style={{ borderColor:"hsl(216 45% 18%)" }}>
                <button onClick={() => { setOpen(false); setShowNew(true); }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-xs font-semibold"
                  style={{ color:"hsl(38 95% 52%)" }}>
                  <Plus className="h-3.5 w-3.5" /> New Engagement
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {showNew && <NewEngagementModal onClose={() => setShowNew(false)} />}
    </>
  );
}
