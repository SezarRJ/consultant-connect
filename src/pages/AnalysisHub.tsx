/**
 * AnalysisHub.tsx — 8 analysis tools with output chaining
 * Each tool: loads engagement context + prior outputs → runs AI → saves result
 */
import { useState } from "react";
import { useEngagementStore, buildFullContext, buildEngagementContext } from "@/store/engagementStore";
import { useClaudeAnalysis } from "@/hooks/useClaudeAnalysis";
import {
  TrendingUp, BarChart2, DollarSign, ShieldAlert, Users,
  PackageCheck, FileBarChart2, Globe, Loader2, AlertTriangle, Save, Check
} from "lucide-react";

type SubId = "market-entry"|"competitor"|"pricing"|"risk"|"distributor"|"export"|"feasibility"|"intelligence";

interface Sub {
  id: SubId; label: string; icon: React.ElementType;
  tier: "flash-lite"|"flash"|"pro"; phase: "Analysis" as const;
  description: string;
  // IDs of prior tools whose outputs feed into this one
  priorTools: string[];
  extraFields?: { key:string; label:string; placeholder:string }[];
}

const SUBS: Sub[] = [
  { id:"market-entry",   label:"Market Entry",        icon:TrendingUp,   tier:"flash",      phase:"Analysis",
    description:"Assess market attractiveness, entry barriers, and recommended entry strategy.",
    priorTools:["briefing","intelligence"],
    extraFields:[{ key:"targetSegment", label:"Target Segment", placeholder:"e.g. FMCG retail, B2B…" }] },
  { id:"competitor",     label:"Competitor Analysis", icon:BarChart2,    tier:"flash",      phase:"Analysis",
    description:"Map the competitive landscape, key players, and differentiation opportunities.",
    priorTools:["market-entry","intelligence"],
    extraFields:[{ key:"knownCompetitors", label:"Known Competitors", placeholder:"Company A, Company B…" }] },
  { id:"pricing",        label:"Pricing Intelligence",icon:DollarSign,   tier:"flash-lite", phase:"Analysis",
    description:"Benchmark pricing, willingness-to-pay, and recommended pricing architecture.",
    priorTools:["market-entry","competitor"],
    extraFields:[{ key:"productType", label:"Product/Service Type", placeholder:"e.g. SaaS, FMCG…" }] },
  { id:"risk",           label:"Risk Assessment",     icon:ShieldAlert,  tier:"flash",      phase:"Analysis",
    description:"Identify, score, and mitigate operational, financial, and market risks.",
    priorTools:["market-entry","competitor","pricing"] },
  { id:"distributor",    label:"Distributor Finder",  icon:Users,        tier:"flash-lite", phase:"Analysis",
    description:"Profile ideal distributor criteria and identify candidate partner types.",
    priorTools:["market-entry"],
    extraFields:[{ key:"channels", label:"Preferred Channels", placeholder:"Modern trade, wholesale…" }] },
  { id:"export",         label:"Export Readiness",    icon:PackageCheck, tier:"flash",      phase:"Analysis",
    description:"Evaluate export readiness across regulatory, logistics, and capacity dimensions.",
    priorTools:["risk","market-entry"] },
  { id:"feasibility",    label:"Feasibility Study",   icon:FileBarChart2,tier:"pro",        phase:"Analysis",
    description:"Full feasibility covering technical, financial, and market viability.",
    priorTools:["market-entry","competitor","risk","pricing"],
    extraFields:[{ key:"investmentSize", label:"Estimated Investment", placeholder:"e.g. $2M USD" }] },
  { id:"intelligence",   label:"Market Intelligence", icon:Globe,        tier:"flash",      phase:"Analysis",
    description:"Macro trends, sector dynamics, and intelligence brief for the target market.",
    priorTools:[] },
];

function SubRunner({ sub }: { sub: Sub }) {
  const { getActiveEngagement, saveOutput, getAllOutputs } = useEngagementStore();
  const eng = getActiveEngagement();
  const [extras, setExtras] = useState<Record<string,string>>({});
  const [customCtx, setCustomCtx] = useState("");
  const [saved, setSaved] = useState(false);

  const existing = eng?.outputs?.[sub.id];

  const { analyze, loading, rawText } = useClaudeAnalysis({
    modelTier: sub.tier,
    systemPrompt: `You are a senior management consultant specializing in ${sub.label} for the MENA region with deep Iraq expertise.
${buildFullContext(eng, sub.priorTools)}
Provide a structured, professional ${sub.label} report with clear sections and headers.
Format:
## Summary
## Key Findings
## Risks & Opportunities  
## Recommendations
## Suggested Next Action`,
  });

  if (!eng) return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <AlertTriangle className="h-7 w-7" style={{ color:"hsl(38 85% 52%)" }} />
      <p className="text-sm" style={{ color:"hsl(215 25% 50%)" }}>Select an active engagement first.</p>
    </div>
  );

  const priorAvailable = sub.priorTools.filter((id) => !!eng.outputs?.[id]);

  const run = () => {
    const extrasStr = Object.entries(extras).map(([k,v]) => v?`${k}: ${v}`:"").filter(Boolean).join(". ");
    analyze(`Run ${sub.label} for this engagement. ${extrasStr} ${customCtx}`);
    setSaved(false);
  };

  const handleSave = () => {
    const content = rawText || "";
    if (content && eng) { saveOutput(eng.id, sub.id, sub.label, content, "Analysis"); setSaved(true); }
  };

  const content = rawText || existing?.content || "";

  return (
    <div className="space-y-4">
      {/* Context pill */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
        style={{ background:"hsl(38 95% 52%/0.08)", border:"1px solid hsl(38 95% 52%/0.2)", color:"hsl(38 95% 60%)" }}>
        Using: <strong>{eng.companyName||eng.clientName}</strong> · {eng.industry} · {eng.market}
        {priorAvailable.length>0 && (
          <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full"
            style={{ background:"hsl(145 65% 40%/0.15)", color:"hsl(145 65% 55%)" }}>
            + {priorAvailable.length} prior output{priorAvailable.length>1?"s":""} loaded
          </span>
        )}
      </div>

      {/* Inputs */}
      <div className="rounded-xl p-4 space-y-3" style={{ background:"hsl(216 45% 10%)", border:"1px solid hsl(216 45% 18%)" }}>
        {sub.extraFields?.map((f) => (
          <div key={f.key}>
            <label className="block text-[10px] uppercase tracking-wider font-semibold mb-1" style={{ color:"hsl(215 25% 48%)" }}>{f.label}</label>
            <input type="text" placeholder={f.placeholder} value={extras[f.key]??""} onChange={(e) => setExtras((x) => ({ ...x,[f.key]:e.target.value }))}
              className="w-full rounded-md px-3 py-2 text-sm"
              style={{ background:"hsl(216 45% 14%)", color:"hsl(210 40% 88%)", border:"1px solid hsl(216 45% 22%)" }} />
          </div>
        ))}
        <div>
          <label className="block text-[10px] uppercase tracking-wider font-semibold mb-1" style={{ color:"hsl(215 25% 48%)" }}>Additional Instructions</label>
          <textarea rows={2} value={customCtx} onChange={(e) => setCustomCtx(e.target.value)}
            placeholder="Any specific focus areas…" className="w-full rounded-md px-3 py-2 text-sm resize-none"
            style={{ background:"hsl(216 45% 14%)", color:"hsl(210 40% 88%)", border:"1px solid hsl(216 45% 22%)" }} />
        </div>
        <div className="flex gap-2">
          <button onClick={run} disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
            style={{ background:"hsl(38 95% 52%)", color:"hsl(216 58% 6%)" }}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <sub.icon className="h-4 w-4" />}
            Run {sub.label}
          </button>
          {rawText && (
            <button onClick={handleSave}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold"
              style={{ background:saved?"hsl(145 65% 40%/0.15)":"hsl(216 45% 18%)", color:saved?"hsl(145 65% 55%)":"hsl(38 95% 55%)" }}>
              {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
              {saved ? "Saved!" : "Save to Engagement"}
            </button>
          )}
        </div>
      </div>

      {/* Output */}
      {content && (
        <div className="rounded-xl p-5" style={{ background:"hsl(216 45% 10%)", border:"1px solid hsl(216 45% 18%)" }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color:"hsl(215 25% 45%)" }}>
              {sub.label} — {eng.companyName||eng.clientName}
              {existing && !rawText && <span className="ml-2 text-[9px]">(saved)</span>}
            </p>
            <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background:"hsl(216 45% 18%)", color:"hsl(215 25% 55%)" }}>{sub.tier}</span>
          </div>
          <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color:"hsl(210 40% 80%)" }}>{content}</div>
        </div>
      )}
    </div>
  );
}

export default function AnalysisHub() {
  const [active, setActive] = useState<SubId>("market-entry");
  const current = SUBS.find((s) => s.id===active)!;

  return (
    <div className="space-y-5 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold" style={{ color:"hsl(210 40% 92%)" }}>Analysis</h1>
        <p className="text-sm mt-0.5" style={{ color:"hsl(215 25% 48%)" }}>
          8 analysis tools — each automatically uses the active engagement context and prior outputs.
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
        <div className="flex-1">
          <p className="text-sm font-semibold" style={{ color:"hsl(210 40% 90%)" }}>{current.label}</p>
          <p className="text-xs" style={{ color:"hsl(215 25% 48%)" }}>{current.description}</p>
        </div>
        {current.priorTools.length>0 && (
          <span className="text-[10px] px-2 py-0.5 rounded-full shrink-0"
            style={{ background:"hsl(200 80% 55%/0.12)", color:"hsl(200 80% 65%)" }}>
            Uses {current.priorTools.length} prior tool{current.priorTools.length>1?"s":""}
          </span>
        )}
      </div>

      <SubRunner sub={current} />
    </div>
  );
}
