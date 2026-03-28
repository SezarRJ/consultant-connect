/**
 * StrategyHub.tsx — Strategy tools that consume Analysis outputs
 */
import { useState } from "react";
import { useEngagementStore, buildFullContext } from "@/store/engagementStore";
import { useClaudeAnalysis } from "@/hooks/useClaudeAnalysis";
import {
  Lightbulb, BarChart2, Zap, Handshake, BookOpen,
  Loader2, AlertTriangle, Save, Check,
} from "lucide-react";

type SubId = "workshop"|"benchmarking"|"sales"|"partner"|"playbooks";

const SUBS = [
  {
    id: "workshop" as SubId, label: "Strategy Workshop", icon: Lightbulb, tier: "flash" as const,
    description: "SWOT, Porter's Five Forces, Ansoff, BCG, PESTLE, VRIO — powered by prior analysis.",
    priorTools: ["market-entry","competitor","risk","pricing","intelligence"],
  },
  {
    id: "benchmarking" as SubId, label: "Benchmarking", icon: BarChart2, tier: "flash" as const,
    description: "Compare client performance against industry benchmarks and top quartile.",
    priorTools: ["market-entry","competitor","intelligence"],
  },
  {
    id: "sales" as SubId, label: "Sales Strategy", icon: Zap, tier: "flash" as const,
    description: "Go-to-market sales strategy, route-to-market, and commercial model.",
    priorTools: ["market-entry","distributor","pricing"],
  },
  {
    id: "partner" as SubId, label: "Partner Matchmaking", icon: Handshake, tier: "flash-lite" as const,
    description: "Ideal partner criteria and sourcing strategy using market findings.",
    priorTools: ["market-entry","distributor"],
  },
  {
    id: "playbooks" as SubId, label: "Playbooks", icon: BookOpen, tier: "flash" as const,
    description: "Step-by-step engagement playbook using analysis outputs and objectives.",
    priorTools: ["market-entry","risk","competitor","workshop"],
  },
];

const FRAMEWORKS = [
  "SWOT Analysis","Porter's Five Forces","Ansoff Matrix",
  "BCG Matrix","PESTLE Analysis","VRIO Framework",
];

function SubRunner({ sub }: { sub: typeof SUBS[0] }) {
  const { getActiveEngagement, saveOutput } = useEngagementStore();
  const eng = getActiveEngagement();
  const [extra,     setExtra]     = useState("");
  const [framework, setFramework] = useState(FRAMEWORKS[0]);
  const [saved,     setSaved]     = useState(false);

  const priorAvailable = eng ? sub.priorTools.filter((id) => !!eng.outputs?.[id]) : [];
  const existing = eng?.outputs?.[sub.id];

  const { analyze, loading, rawText } = useClaudeAnalysis({
    modelTier: sub.tier,
    systemPrompt: `You are a senior management consultant specialising in ${sub.label}.
${buildFullContext(eng, sub.priorTools)}
Produce a structured strategic output with:
## Strategic Objective
## Key Recommendations (prioritised)
## Priority Action Plan
## Timeline & Resource Needs
## Risk Mitigation
## Success Metrics
## Suggested Next Step`,
  });

  if (!eng) return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <AlertTriangle className="h-7 w-7" style={{ color: "hsl(38 85% 52%)" }} />
      <p className="text-sm" style={{ color: "hsl(215 25% 50%)" }}>Select an active engagement first.</p>
    </div>
  );

  const run = () => {
    const fw = sub.id === "workshop" ? `Use the ${framework} framework. ` : "";
    analyze(`${fw}${sub.label} for this engagement. ${extra}`);
    setSaved(false);
  };

  const content = rawText || existing?.content || "";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
        style={{ background: "hsl(38 95% 52%/0.08)", border: "1px solid hsl(38 95% 52%/0.2)", color: "hsl(38 95% 60%)" }}>
        Using: <strong>{eng.companyName || eng.clientName}</strong> · {eng.market}
        {priorAvailable.length > 0 && (
          <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full"
            style={{ background: "hsl(145 65% 40%/0.15)", color: "hsl(145 65% 55%)" }}>
            + {priorAvailable.length} analysis output{priorAvailable.length > 1 ? "s" : ""} loaded
          </span>
        )}
        {priorAvailable.length === 0 && sub.priorTools.length > 0 && (
          <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full"
            style={{ background: "hsl(38 85% 52%/0.15)", color: "hsl(38 85% 60%)" }}>
            Tip: run Analysis tools first for richer output
          </span>
        )}
      </div>

      <div className="rounded-xl p-4 space-y-3"
        style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 18%)" }}>
        {sub.id === "workshop" && (
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-semibold mb-1.5"
              style={{ color: "hsl(215 25% 48%)" }}>Framework</label>
            <div className="flex flex-wrap gap-1.5">
              {FRAMEWORKS.map((fw) => (
                <button key={fw} onClick={() => setFramework(fw)}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium"
                  style={{
                    background: framework === fw ? "hsl(38 95% 52%/0.15)" : "hsl(216 45% 15%)",
                    color:      framework === fw ? "hsl(38 95% 60%)"      : "hsl(215 25% 55%)",
                    border:     framework === fw ? "1px solid hsl(38 95% 52%/0.35)" : "1px solid hsl(216 45% 20%)",
                  }}>{fw}</button>
              ))}
            </div>
          </div>
        )}
        <div>
          <label className="block text-[10px] uppercase tracking-wider font-semibold mb-1"
            style={{ color: "hsl(215 25% 48%)" }}>Additional Instructions</label>
          <textarea rows={2} value={extra} onChange={(e) => setExtra(e.target.value)}
            placeholder="Specific constraints, objectives, or questions…"
            className="w-full rounded-md px-3 py-2 text-sm resize-none"
            style={{ background: "hsl(216 45% 14%)", color: "hsl(210 40% 88%)", border: "1px solid hsl(216 45% 22%)" }} />
        </div>
        <div className="flex gap-2">
          <button onClick={run} disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
            style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <sub.icon className="h-4 w-4" />}
            Run {sub.id === "workshop" ? framework : sub.label}
          </button>
          {rawText && (
            <button onClick={() => { saveOutput(eng.id, sub.id, sub.label, rawText, "Strategy"); setSaved(true); }}
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
          <p className="text-[10px] uppercase tracking-widest font-semibold mb-3" style={{ color: "hsl(215 25% 45%)" }}>
            {sub.label} — {eng.companyName || eng.clientName}
            {existing && !rawText && <span className="ml-2 text-[9px]">(saved)</span>}
          </p>
          <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "hsl(210 40% 80%)" }}>
            {content}
          </div>
        </div>
      )}
    </div>
  );
}

export default function StrategyHub() {
  const [active, setActive] = useState<SubId>("workshop");
  const current = SUBS.find((s) => s.id === active)!;

  return (
    <div className="space-y-5 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold" style={{ color: "hsl(210 40% 92%)" }}>Strategy</h1>
        <p className="text-sm mt-0.5" style={{ color: "hsl(215 25% 48%)" }}>
          Turn analysis into decisions. All strategy tools read your saved analysis outputs automatically.
        </p>
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {SUBS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActive(id)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: active === id ? "hsl(38 95% 52%/0.15)" : "hsl(216 45% 12%)",
              color:      active === id ? "hsl(38 95% 60%)"      : "hsl(215 25% 55%)",
              border:     active === id ? "1px solid hsl(38 95% 52%/0.35)" : "1px solid hsl(216 45% 18%)",
            }}>
            <Icon className="h-3.5 w-3.5" />{label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
        style={{ background: "hsl(216 45% 11%)", border: "1px solid hsl(216 45% 20%)" }}>
        <current.icon className="h-5 w-5" style={{ color: "hsl(38 95% 52%)" }} />
        <div className="flex-1">
          <p className="text-sm font-semibold" style={{ color: "hsl(210 40% 90%)" }}>{current.label}</p>
          <p className="text-xs" style={{ color: "hsl(215 25% 48%)" }}>{current.description}</p>
        </div>
      </div>

      <SubRunner sub={current} />
    </div>
  );
}
