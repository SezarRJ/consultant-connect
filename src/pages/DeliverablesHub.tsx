/**
 * DeliverablesHub.tsx — Uses ALL prior outputs from analysis + strategy
 */
import { useState } from "react";
import { useEngagementStore, buildFullContext } from "@/store/engagementStore";
import { useClaudeAnalysis } from "@/hooks/useClaudeAnalysis";
import { FileText, FileOutput, ClipboardList, Presentation, Loader2, AlertTriangle, Save, Check, Copy } from "lucide-react";

type SubId = "proposal"|"report"|"tracker"|"executive";

const SUBS = [
  { id:"proposal" as SubId, label:"Proposal Builder",   icon:FileText,      tier:"flash" as const,
    description:"Full consulting proposal with scope, approach, fees, and timeline.",
    priorTools:["briefing","market-entry","competitor","risk","workshop","sales"] },
  { id:"report" as SubId,   label:"Report Generator",   icon:FileOutput,    tier:"pro" as const,
    description:"Comprehensive engagement report synthesizing all findings and recommendations.",
    priorTools:["market-entry","competitor","pricing","risk","workshop","benchmarking","sales"] },
  { id:"tracker" as SubId,  label:"Deliverables Tracker",icon:ClipboardList, tier:"flash-lite" as const,
    description:"Structured list of all deliverables with owners, formats, and due dates.",
    priorTools:["briefing"] },
  { id:"executive" as SubId,label:"Executive Summary",  icon:FileOutput,    tier:"flash" as const,
    description:"Concise C-suite summary for client presentation.",
    priorTools:["market-entry","competitor","risk","workshop","sales","benchmarking"] },
];

const PROPOSAL_TYPES = ["Initial Engagement Proposal","Phase 2 Extension","Advisory Retainer","Project-Based Fixed Fee"];
const REPORT_TYPES   = ["Findings & Recommendations","Market Assessment","Feasibility Report","Exit Report"];

function SubRunner({ sub }: { sub: typeof SUBS[0] }) {
  const { getActiveEngagement, saveOutput, getAllOutputs } = useEngagementStore();
  const eng = getActiveEngagement();
  const [extra, setExtra] = useState("");
  const [docType, setDocType] = useState(sub.id==="proposal"?PROPOSAL_TYPES[0]:sub.id==="report"?REPORT_TYPES[0]:"");
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const allOutputs = eng ? getAllOutputs(eng.id) : [];
  const priorAvailable = eng ? sub.priorTools.filter((id) => !!eng.outputs?.[id]) : [];
  const existing = eng?.outputs?.[sub.id];

  const { analyze, loading, rawText } = useClaudeAnalysis({
    modelTier: sub.tier,
    systemPrompt: `You are a senior management consultant creating professional client-facing deliverables.
${buildFullContext(eng, sub.priorTools)}
Produce a polished, structured ${sub.label} suitable for a professional consulting firm.
Use clear sections, professional language, and be specific to the engagement context.
Format:
## Title & Executive Summary
## Background & Context
## Findings
## Recommendations & Action Plan
## Appendix / Supporting Data`,
  });

  if (!eng) return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <AlertTriangle className="h-7 w-7" style={{ color:"hsl(38 85% 52%)" }} />
      <p className="text-sm" style={{ color:"hsl(215 25% 50%)" }}>Select an active engagement first.</p>
    </div>
  );

  const run = () => {
    const tstr = docType ? `Document type: ${docType}. ` : "";
    analyze(`${sub.label}: ${tstr}${extra}`);
    setSaved(false);
  };
  const handleSave = () => {
    if (rawText) { saveOutput(eng.id, sub.id, sub.label, rawText, "Deliverables"); setSaved(true); }
  };
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text); setCopied(true); setTimeout(()=>setCopied(false),1500);
  };

  const content = rawText || existing?.content || "";
  const typeOpts = sub.id==="proposal"?PROPOSAL_TYPES:sub.id==="report"?REPORT_TYPES:null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
        style={{ background:"hsl(38 95% 52%/0.08)", border:"1px solid hsl(38 95% 52%/0.2)", color:"hsl(38 95% 60%)" }}>
        Using: <strong>{eng.companyName||eng.clientName}</strong>
        {priorAvailable.length>0 && (
          <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full"
            style={{ background:"hsl(145 65% 40%/0.15)", color:"hsl(145 65% 55%)" }}>
            + {priorAvailable.length} prior output{priorAvailable.length>1?"s":""} loaded
          </span>
        )}
        {allOutputs.length===0 && (
          <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full"
            style={{ background:"hsl(38 85% 52%/0.15)", color:"hsl(38 85% 60%)" }}>
            Tip: run Analysis + Strategy first for richer deliverables
          </span>
        )}
      </div>

      <div className="rounded-xl p-4 space-y-3" style={{ background:"hsl(216 45% 10%)", border:"1px solid hsl(216 45% 18%)" }}>
        {typeOpts && (
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-semibold mb-1.5" style={{ color:"hsl(215 25% 48%)" }}>Document Type</label>
            <div className="flex flex-wrap gap-1.5">
              {typeOpts.map((t) => (
                <button key={t} onClick={() => setDocType(t)}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium"
                  style={{
                    background: docType===t ? "hsl(38 95% 52%/0.15)" : "hsl(216 45% 15%)",
                    color: docType===t ? "hsl(38 95% 60%)" : "hsl(215 25% 55%)",
                    border: docType===t ? "1px solid hsl(38 95% 52%/0.35)" : "1px solid hsl(216 45% 20%)",
                  }}>{t}</button>
              ))}
            </div>
          </div>
        )}
        <div>
          <label className="block text-[10px] uppercase tracking-wider font-semibold mb-1" style={{ color:"hsl(215 25% 48%)" }}>Additional Instructions</label>
          <textarea rows={2} value={extra} onChange={(e) => setExtra(e.target.value)}
            placeholder="Special requirements, tone, sections to include…"
            className="w-full rounded-md px-3 py-2 text-sm resize-none"
            style={{ background:"hsl(216 45% 14%)", color:"hsl(210 40% 88%)", border:"1px solid hsl(216 45% 22%)" }} />
        </div>
        <div className="flex gap-2">
          <button onClick={run} disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
            style={{ background:"hsl(38 95% 52%)", color:"hsl(216 58% 6%)" }}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <sub.icon className="h-4 w-4" />}
            Generate {sub.label}
          </button>
          {rawText && (
            <>
              <button onClick={handleSave}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold"
                style={{ background:saved?"hsl(145 65% 40%/0.15)":"hsl(216 45% 18%)", color:saved?"hsl(145 65% 55%)":"hsl(38 95% 55%)" }}>
                {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                {saved ? "Saved!" : "Save"}
              </button>
              <button onClick={() => handleCopy(rawText)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold"
                style={{ background:"hsl(216 45% 18%)", color:"hsl(215 25% 55%)" }}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </>
          )}
        </div>
      </div>

      {content && (
        <div className="rounded-xl p-5" style={{ background:"hsl(216 45% 10%)", border:"1px solid hsl(216 45% 18%)" }}>
          <p className="text-[10px] uppercase tracking-widest font-semibold mb-3" style={{ color:"hsl(215 25% 45%)" }}>
            {sub.label} — {eng.companyName||eng.clientName}
            {existing && !rawText && <span className="ml-2 text-[9px]">(saved)</span>}
          </p>
          <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color:"hsl(210 40% 80%)" }}>{content}</div>
        </div>
      )}
    </div>
  );
}

export default function DeliverablesHub() {
  const [active, setActive] = useState<SubId>("proposal");
  const current = SUBS.find((s) => s.id===active)!;

  return (
    <div className="space-y-5 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold" style={{ color:"hsl(210 40% 92%)" }}>Deliverables</h1>
        <p className="text-sm mt-0.5" style={{ color:"hsl(215 25% 48%)" }}>
          Generate polished client outputs. All deliverables are enriched by your saved analysis and strategy.
        </p>
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {SUBS.map(({ id, label, icon:Icon }) => (
          <button key={id} onClick={() => setActive(id)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: active===id ? "hsl(38 95% 52%/0.15)" : "hsl(216 45% 12%)",
              color: active===id ? "hsl(38 95% 60%)" : "hsl(215 25% 55%)",
              border: active===id ? "1px solid hsl(38 95% 52%/0.35)" : "1px solid hsl(216 45% 18%)",
            }}>
            <Icon className="h-3.5 w-3.5" />{label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
        style={{ background:"hsl(216 45% 11%)", border:"1px solid hsl(216 45% 20%)" }}>
        <current.icon className="h-5 w-5" style={{ color:"hsl(38 95% 52%)" }} />
        <div>
          <p className="text-sm font-semibold" style={{ color:"hsl(210 40% 90%)" }}>{current.label}</p>
          <p className="text-xs" style={{ color:"hsl(215 25% 48%)" }}>{current.description}</p>
        </div>
        <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full shrink-0"
          style={{ background:"hsl(216 45% 18%)", color:"hsl(215 25% 55%)" }}>{current.tier}</span>
      </div>

      <SubRunner sub={current} />
    </div>
  );
}
