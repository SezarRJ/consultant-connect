/**
 * StrategyHub.tsx
 * ─────────────────────────────────────────────────────────────────
 * Hub C: Strategy
 * Sub-services: Strategy Workshop | Benchmarking | Sales Strategy |
 *               Partner Matchmaking | Playbooks
 * ─────────────────────────────────────────────────────────────────
 */
import { useState } from "react";
import { useEngagementStore, buildEngagementContext } from "@/store/engagementStore";
import { useClaudeAnalysis } from "@/hooks/useClaudeAnalysis";
import {
  Lightbulb, BarChart2, Zap, Handshake, BookOpen,
  Loader2, AlertTriangle
} from "lucide-react";

type StrategySub = "workshop" | "benchmarking" | "sales" | "partner" | "playbooks";

const SUBS = [
  { id: "workshop" as const,     label: "Strategy Workshop",   icon: Lightbulb,  tier: "flash" as const,
    description: "Run SWOT, Porter's Five Forces, Ansoff Matrix, or PESTLE for the active engagement.",
    prompt: "strategy workshop and framework analysis" },
  { id: "benchmarking" as const, label: "Benchmarking",        icon: BarChart2,  tier: "flash" as const,
    description: "Compare the client's performance against industry benchmarks and top quartile.",
    prompt: "industry benchmarking analysis" },
  { id: "sales" as const,        label: "Sales Strategy",      icon: Zap,        tier: "flash" as const,
    description: "Design a go-to-market sales strategy, route-to-market, and commercial model.",
    prompt: "sales and go-to-market strategy" },
  { id: "partner" as const,      label: "Partner Matchmaking", icon: Handshake,  tier: "flash-lite" as const,
    description: "Profile ideal partner criteria and recommend partner sourcing strategy.",
    prompt: "partner matchmaking and alliance strategy" },
  { id: "playbooks" as const,    label: "Playbooks",           icon: BookOpen,   tier: "flash" as const,
    description: "Generate a step-by-step playbook tailored to the engagement type and phase.",
    prompt: "consulting playbook" },
];

const WORKSHOP_FRAMEWORKS = [
  "SWOT Analysis", "Porter's Five Forces", "Ansoff Matrix", "BCG Matrix", "PESTLE Analysis", "VRIO Framework"
];

function NoEngagement() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <AlertTriangle className="h-7 w-7" style={{ color: "hsl(38 85% 52%)" }} />
      <p className="text-sm" style={{ color: "hsl(215 25% 50%)" }}>Select an active engagement to run strategy tools.</p>
    </div>
  );
}

function SubRunner({ sub }: { sub: typeof SUBS[0] }) {
  const eng = useEngagementStore((s) => s.getActiveEngagement)();
  const [extra, setExtra] = useState("");
  const [framework, setFramework] = useState(WORKSHOP_FRAMEWORKS[0]);

  const { analyze, loading, rawText } = useClaudeAnalysis({
    modelTier: sub.tier,
    systemPrompt: `You are a senior management consultant specializing in ${sub.label.toLowerCase()}.
${buildEngagementContext(eng)}
Provide a thorough, structured ${sub.prompt}. Use clear headers and be specific to the engagement.`,
  });

  if (!eng) return <NoEngagement />;

  const run = () => {
    const fw = sub.id === "workshop" ? `Use the ${framework} framework. ` : "";
    analyze(`${fw}${sub.prompt} for this engagement. ${extra}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
        style={{ background: "hsl(38 95% 52% / 0.08)", border: "1px solid hsl(38 95% 52% / 0.2)", color: "hsl(38 95% 60%)" }}>
        Using context: <strong>{eng.clientName}</strong> · {eng.industry} · {eng.market}
      </div>

      <div className="rounded-xl p-4 space-y-3" style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 18%)" }}>
        {sub.id === "workshop" && (
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-semibold mb-1" style={{ color: "hsl(215 25% 48%)" }}>Framework</label>
            <div className="flex flex-wrap gap-1.5">
              {WORKSHOP_FRAMEWORKS.map((f) => (
                <button key={f} onClick={() => setFramework(f)}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: framework === f ? "hsl(38 95% 52% / 0.15)" : "hsl(216 45% 15%)",
                    color: framework === f ? "hsl(38 95% 60%)" : "hsl(215 25% 55%)",
                    border: framework === f ? "1px solid hsl(38 95% 52% / 0.35)" : "1px solid hsl(216 45% 20%)",
                  }}>
                  {f}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-[10px] uppercase tracking-wider font-semibold mb-1" style={{ color: "hsl(215 25% 48%)" }}>
            Additional Instructions (optional)
          </label>
          <textarea rows={2} value={extra} onChange={(e) => setExtra(e.target.value)}
            placeholder="Specific focus, constraints, or questions…"
            className="w-full rounded-md px-3 py-2 text-sm resize-none"
            style={{ background: "hsl(216 45% 14%)", color: "hsl(210 40% 88%)", border: "1px solid hsl(216 45% 22%)" }} />
        </div>

        <button onClick={run} disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
          style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <sub.icon className="h-4 w-4" />}
          Run {sub.id === "workshop" ? framework : sub.label}
        </button>
      </div>

      {rawText && (
        <div className="rounded-xl p-5" style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 18%)" }}>
          <p className="text-[10px] uppercase tracking-widest font-semibold mb-3" style={{ color: "hsl(215 25% 45%)" }}>
            {sub.label} — {eng.clientName}
          </p>
          <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "hsl(210 40% 80%)" }}>
            {rawText}
          </div>
        </div>
      )}
    </div>
  );
}

export default function StrategyHub() {
  const [active, setActive] = useState<StrategySub>("workshop");
  const current = SUBS.find((s) => s.id === active)!;

  return (
    <div className="space-y-5 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold" style={{ color: "hsl(210 40% 92%)" }}>Strategy</h1>
        <p className="text-sm mt-0.5" style={{ color: "hsl(215 25% 48%)" }}>
          Turn analysis into actionable strategies and frameworks.
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
      </div>

      <SubRunner sub={current} />
    </div>
  );
}
