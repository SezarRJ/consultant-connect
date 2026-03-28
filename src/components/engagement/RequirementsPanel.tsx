import { useState } from "react";
import { AlertTriangle, CheckCircle2, ChevronRight, ClipboardList, FileText, Plus, Upload } from "lucide-react";
import {
  Engagement,
  EngagementPhase,
  getEngagementReadiness,
  getMissingRequestedOutputs,
  getPhaseRequirement,
  useEngagementStore,
} from "@/store/engagementStore";

function readinessColor(status: string) {
  if (status === "Ready") return { fg: "hsl(145 65% 55%)", bg: "hsl(145 65% 40%/0.15)" };
  if (status === "Partially Ready") return { fg: "hsl(38 95% 60%)", bg: "hsl(38 95% 52%/0.15)" };
  return { fg: "hsl(0 72% 65%)", bg: "hsl(0 72% 51%/0.14)" };
}

export default function RequirementsPanel({ eng, phase, compact = false }: { eng: Engagement; phase?: EngagementPhase; compact?: boolean }) {
  const activePhase = phase || eng.phase;
  const req = getPhaseRequirement(eng, activePhase)!;
  const readiness = getEngagementReadiness(eng, activePhase);
  const missingOutputs = getMissingRequestedOutputs(eng);
  const { addResource, addRequestedOutput, setPhaseRequirement, completePhase } = useEngagementStore();
  const [resourceName, setResourceName] = useState("");
  const [requestedOutput, setRequestedOutput] = useState("");
  const [notes, setNotes] = useState(req.notes || "");
  const colors = readinessColor(readiness);

  const uploadedResourceNames = eng.resources.filter((r) => r.status === "Uploaded").map((r) => r.name.toLowerCase());
  const missingDocs = req.requiredDocuments.filter((doc) => !uploadedResourceNames.some((name) => name.includes(doc.toLowerCase()) || doc.toLowerCase().includes(name)));

  const addQuickResource = () => {
    const name = resourceName.trim();
    if (!name) return;
    addResource(eng.id, { name, category: "Document", status: "Uploaded", notes: `Added for ${activePhase}` });
    setResourceName("");
  };

  const addRequested = () => {
    const value = requestedOutput.trim();
    if (!value) return;
    addRequestedOutput(eng.id, value);
    setRequestedOutput("");
  };

  const saveNotes = () => {
    setPhaseRequirement(eng.id, activePhase, { notes });
  };

  return (
    <div className="rounded-xl p-4 space-y-4" style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 18%)" }}>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4" style={{ color: colors.fg }} />
          <p className="text-sm font-semibold" style={{ color: "hsl(210 40% 90%)" }}>
            {activePhase} Requirements
          </p>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: colors.bg, color: colors.fg }}>
          {readiness}
        </span>
        {missingOutputs.length > 0 && (
          <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "hsl(0 72% 51%/0.14)", color: "hsl(0 72% 65%)" }}>
            {missingOutputs.length} requested output{missingOutputs.length > 1 ? "s" : ""} still missing
          </span>
        )}
      </div>

      <div className={`grid ${compact ? "grid-cols-1" : "grid-cols-2"} gap-3`}>
        <div className="rounded-lg p-3" style={{ background: "hsl(216 45% 12%)", border: "1px solid hsl(216 45% 18%)" }}>
          <p className="text-[10px] uppercase tracking-wider font-semibold mb-2" style={{ color: "hsl(215 25% 45%)" }}>Required information</p>
          <div className="space-y-1.5">
            {req.requiredInfo.map((item) => (
              <div key={item} className="flex items-start gap-2 text-xs" style={{ color: "hsl(210 40% 78%)" }}>
                <ChevronRight className="h-3.5 w-3.5 mt-0.5" style={{ color: "hsl(38 95% 55%)" }} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg p-3" style={{ background: "hsl(216 45% 12%)", border: "1px solid hsl(216 45% 18%)" }}>
          <p className="text-[10px] uppercase tracking-wider font-semibold mb-2" style={{ color: "hsl(215 25% 45%)" }}>Required documents</p>
          <div className="space-y-1.5">
            {req.requiredDocuments.map((item) => {
              const uploaded = !missingDocs.includes(item);
              return (
                <div key={item} className="flex items-start gap-2 text-xs" style={{ color: uploaded ? "hsl(145 65% 55%)" : "hsl(210 40% 78%)" }}>
                  {uploaded ? <CheckCircle2 className="h-3.5 w-3.5 mt-0.5" /> : <FileText className="h-3.5 w-3.5 mt-0.5" style={{ color: "hsl(38 95% 55%)" }} />}
                  <span>{item}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {missingOutputs.length > 0 && (
        <div className="rounded-lg p-3" style={{ background: "hsl(0 72% 51%/0.08)", border: "1px solid hsl(0 72% 51%/0.18)" }}>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4" style={{ color: "hsl(0 72% 65%)" }} />
            <p className="text-xs font-semibold" style={{ color: "hsl(0 72% 65%)" }}>Missing requested outputs from customer request</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {missingOutputs.map((item) => (
              <span key={item} className="text-[10px] px-2 py-1 rounded-full" style={{ background: "hsl(216 45% 12%)", color: "hsl(210 40% 80%)" }}>{item}</span>
            ))}
          </div>
        </div>
      )}

      <div className={`grid ${compact ? "grid-cols-1" : "grid-cols-2"} gap-3`}>
        <div className="space-y-2">
          <label className="block text-[10px] uppercase tracking-wider font-semibold" style={{ color: "hsl(215 25% 45%)" }}>Add uploaded resource</label>
          <div className="flex gap-2">
            <input value={resourceName} onChange={(e) => setResourceName(e.target.value)} placeholder="e.g. client brief, pricing sheet" className="flex-1 rounded-md px-3 py-2 text-sm" style={{ background: "hsl(216 45% 14%)", color: "hsl(210 40% 88%)", border: "1px solid hsl(216 45% 22%)" }} />
            <button onClick={addQuickResource} className="px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5" style={{ background: "hsl(216 45% 18%)", color: "hsl(145 65% 55%)" }}>
              <Upload className="h-3.5 w-3.5" /> Add
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-[10px] uppercase tracking-wider font-semibold" style={{ color: "hsl(215 25% 45%)" }}>Track requested report</label>
          <div className="flex gap-2">
            <input value={requestedOutput} onChange={(e) => setRequestedOutput(e.target.value)} placeholder="e.g. pricing report" className="flex-1 rounded-md px-3 py-2 text-sm" style={{ background: "hsl(216 45% 14%)", color: "hsl(210 40% 88%)", border: "1px solid hsl(216 45% 22%)" }} />
            <button onClick={addRequested} className="px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5" style={{ background: "hsl(216 45% 18%)", color: "hsl(38 95% 55%)" }}>
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-[10px] uppercase tracking-wider font-semibold mb-1.5" style={{ color: "hsl(215 25% 45%)" }}>Phase notes / requirement notes</label>
        <textarea rows={compact ? 2 : 3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Capture missing items, assumptions, and customer-specific requirements…" className="w-full rounded-md px-3 py-2 text-sm resize-none" style={{ background: "hsl(216 45% 14%)", color: "hsl(210 40% 88%)", border: "1px solid hsl(216 45% 22%)" }} />
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={saveNotes} className="px-3 py-2 rounded-lg text-xs font-semibold" style={{ background: "hsl(216 45% 18%)", color: "hsl(210 40% 82%)" }}>
          Save requirements
        </button>
        <button onClick={() => completePhase(eng.id, activePhase)} className="px-3 py-2 rounded-lg text-xs font-semibold" style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
          Complete {activePhase} and open next step
        </button>
      </div>
    </div>
  );
}
