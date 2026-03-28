/**
 * DeliverablesHub.tsx
 * ─────────────────────────────────────────────────────────────────
 * Hub D: Deliverables
 * Sub-services: Proposal Builder | Report Generator |
 *               Deliverables Tracker | Executive Summary
 * ─────────────────────────────────────────────────────────────────
 */
import { useState } from "react";
import { useEngagementStore, buildEngagementContext } from "@/store/engagementStore";
import { useClaudeAnalysis } from "@/hooks/useClaudeAnalysis";
import {
  FileText, FileOutput, ClipboardList, Presentation,
  Loader2, AlertTriangle, Copy, Check
} from "lucide-react";

type DeliverableSub = "proposal" | "report" | "tracker" | "executive";

const SUBS = [
  { id: "proposal" as const,   label: "Proposal Builder",   icon: FileText,      tier: "flash" as const,
    description: "Generate a structured consulting proposal with scope, fees, and timeline.",
    prompt: "Generate a professional consulting proposal." },
  { id: "report" as const,     label: "Report Generator",   icon: FileOutput,    tier: "pro" as const,
    description: "Produce a full engagement report synthesizing findings and recommendations.",
    prompt: "Generate a comprehensive consulting engagement report." },
  { id: "tracker" as const,    label: "Deliverables Tracker", icon: ClipboardList, tier: "flash-lite" as const,
    description: "Define and track all deliverables with owners, formats, and due dates.",
    prompt: "Create a detailed deliverables tracker and schedule." },
  { id: "executive" as const,  label: "Executive Summary",  icon: Presentation,  tier: "flash" as const,
    description: "Concise C-suite summary for client presentation or internal leadership.",
    prompt: "Create a crisp executive summary suitable for C-suite presentation." },
];

const PROPOSAL_TYPES = ["Initial Engagement Proposal", "Phase 2 Extension", "Advisory Retainer", "Project-Based Fixed Fee"];
const REPORT_TYPES   = ["Findings & Recommendations", "Market Assessment", "Feasibility Report", "Exit Report"];

function NoEngagement() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <AlertTriangle className="h-7 w-7" style={{ color: "hsl(38 85% 52%)" }} />
      <p className="text-sm" style={{ color: "hsl(215 25% 50%)" }}>Select an active engagement to generate deliverables.</p>
    </div>
  );
}

function SubRunner({ sub }: { sub: typeof SUBS[0] }) {
  const eng = useEngagementStore((s) => s.getActiveEngagement)();
  const [extra, setExtra] = useState("");
  const [docType, setDocType] = useState<string>(
    sub.id === "proposal" ? PROPOSAL_TYPES[0] :
    sub.id === "report"   ? REPORT_TYPES[0] : ""
  );
  const [copied, setCopied] = useState(false);

  const { analyze, loading, rawText } = useClaudeAnalysis({
    modelTier: sub.tier,
    systemPrompt: `You are a senior management consultant generating professional client-facing deliverables.
${buildEngagementContext(eng)}
Produce a polished, structured ${sub.label.toLowerCase()} suitable for a professional consulting firm. Use clear sections.`,
  });

  if (!eng) return <NoEngagement />;

  const run = () => {
    const typeStr = docType ? `Document type: ${docType}. ` : "";
    analyze(`${sub.prompt} ${typeStr} ${extra}`);
  };

  const copy = () => {
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const typeOptions = sub.id === "proposal" ? PROPOSAL_TYPES : sub.id === "report" ? REPORT_TYPES : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
        style={{ background: "hsl(38 95% 52% / 0.08)", border: "1px solid hsl(38 95% 52% / 0.2)", color: "hsl(38 95% 60%)" }}>
        Using context: <strong>{eng.clientName}</strong> · {eng.serviceType} · {eng.phase} phase
      </div>

      <div className="rounded-xl p-4 space-y-3" style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 18%)" }}>
        {typeOptions && (
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-semibold mb-1" style={{ color: "hsl(215 25% 48%)" }}>Document Type</label>
            <div className="flex flex-wrap gap-1.5">
              {typeOptions.map((t) => (
                <button key={t} onClick={() => setDocType(t)}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: docType === t ? "hsl(38 95% 52% / 0.15)" : "hsl(216 45% 15%)",
                    color: docType === t ? "hsl(38 95% 60%)" : "hsl(215 25% 55%)",
                    border: docType === t ? "1px solid hsl(38 95% 52% / 0.35)" : "1px solid hsl(216 45% 20%)",
                  }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-[10px] uppercase tracking-wider font-semibold mb-1" style={{ color: "hsl(215 25% 48%)" }}>
            Additional Instructions
          </label>
          <textarea rows={2} value={extra} onChange={(e) => setExtra(e.target.value)}
            placeholder="Special requirements, tone, or sections to include…"
            className="w-full rounded-md px-3 py-2 text-sm resize-none"
            style={{ background: "hsl(216 45% 14%)", color: "hsl(210 40% 88%)", border: "1px solid hsl(216 45% 22%)" }} />
        </div>

        <button onClick={run} disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
          style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <sub.icon className="h-4 w-4" />}
          Generate {sub.label}
        </button>
      </div>

      {rawText && (
        <div className="rounded-xl p-5 space-y-3" style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 18%)" }}>
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: "hsl(215 25% 45%)" }}>
              {sub.label} — {eng.clientName}
            </p>
            <button onClick={copy}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md"
              style={{ background: "hsl(216 45% 18%)", color: "hsl(215 25% 60%)" }}>
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "hsl(210 40% 80%)" }}>
            {rawText}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DeliverablesHub() {
  const [active, setActive] = useState<DeliverableSub>("proposal");
  const current = SUBS.find((s) => s.id === active)!;

  return (
    <div className="space-y-5 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold" style={{ color: "hsl(210 40% 92%)" }}>Deliverables</h1>
        <p className="text-sm mt-0.5" style={{ color: "hsl(215 25% 48%)" }}>
          Generate professional client-facing outputs powered by engagement context.
        </p>
      </div>

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

      <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
        style={{ background: "hsl(216 45% 11%)", border: "1px solid hsl(216 45% 20%)" }}>
        <current.icon className="h-5 w-5" style={{ color: "hsl(38 95% 52%)" }} />
        <div>
          <p className="text-sm font-semibold" style={{ color: "hsl(210 40% 90%)" }}>{current.label}</p>
          <p className="text-xs" style={{ color: "hsl(215 25% 48%)" }}>{current.description}</p>
        </div>
        <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: "hsl(216 45% 18%)", color: "hsl(215 25% 55%)" }}>
          {current.tier}
        </span>
      </div>

      <SubRunner sub={current} />
    </div>
  );
}
