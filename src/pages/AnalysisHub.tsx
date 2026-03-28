/**
 * AnalysisHub.tsx
 * ─────────────────────────────────────────────────────────────────
 * Hub B: Analysis
 * Sub-services: Market Entry | Competitor Analysis | Pricing Intelligence |
 *               Risk Assessment | Distributor Finder | Export Readiness |
 *               Feasibility Study | Market Intelligence
 *
 * All AI calls inherit the active engagement context automatically.
 * ─────────────────────────────────────────────────────────────────
 */
import { useState } from "react";
import { useEngagementStore, buildEngagementContext } from "@/store/engagementStore";
import { useClaudeAnalysis } from "@/hooks/useClaudeAnalysis";
import {
  TrendingUp, BarChart2, DollarSign, ShieldAlert,
  Users, PackageCheck, FileBarChart2, Globe,
  Loader2, AlertTriangle, ChevronDown
} from "lucide-react";

// ── Sub-service definition ─────────────────────────────────────────
type AnalysisSub =
  | "market-entry" | "competitor" | "pricing" | "risk"
  | "distributor" | "export" | "feasibility" | "intelligence";

interface SubService {
  id: AnalysisSub;
  label: string;
  icon: React.ElementType;
  tier: "flash-lite" | "flash" | "pro";
  description: string;
  promptKey: string;
  extraFields?: { key: string; label: string; placeholder: string }[];
}

const SUB_SERVICES: SubService[] = [
  {
    id: "market-entry", label: "Market Entry", icon: TrendingUp, tier: "flash",
    description: "Assess market attractiveness, entry barriers, and recommended entry strategy.",
    promptKey: "market entry analysis",
    extraFields: [{ key: "targetSegment", label: "Target Segment", placeholder: "e.g. FMCG retail, B2B manufacturing…" }],
  },
  {
    id: "competitor", label: "Competitor Analysis", icon: BarChart2, tier: "flash",
    description: "Map the competitive landscape, key players, and differentiation opportunities.",
    promptKey: "competitor analysis",
    extraFields: [{ key: "knownCompetitors", label: "Known Competitors (optional)", placeholder: "Company A, Company B…" }],
  },
  {
    id: "pricing", label: "Pricing Intelligence", icon: DollarSign, tier: "flash-lite",
    description: "Benchmark pricing, willingness-to-pay, and recommended pricing architecture.",
    promptKey: "pricing intelligence",
    extraFields: [{ key: "productType", label: "Product / Service Type", placeholder: "e.g. SaaS, FMCG product…" }],
  },
  {
    id: "risk", label: "Risk Assessment", icon: ShieldAlert, tier: "flash",
    description: "Identify, score, and mitigate operational, financial, and market risks.",
    promptKey: "risk assessment",
  },
  {
    id: "distributor", label: "Distributor Finder", icon: Users, tier: "flash-lite",
    description: "Profile ideal distributor criteria and identify candidate partner types.",
    promptKey: "distributor finder analysis",
    extraFields: [{ key: "channels", label: "Preferred Channels", placeholder: "e.g. modern trade, wholesale, e-commerce…" }],
  },
  {
    id: "export", label: "Export Readiness", icon: PackageCheck, tier: "flash",
    description: "Evaluate export readiness across regulatory, logistics, and capacity dimensions.",
    promptKey: "export readiness assessment",
  },
  {
    id: "feasibility", label: "Feasibility Study", icon: FileBarChart2, tier: "pro",
    description: "Full feasibility assessment covering technical, financial, and market viability.",
    promptKey: "feasibility study",
    extraFields: [{ key: "investmentSize", label: "Estimated Investment", placeholder: "e.g. $2M USD" }],
  },
  {
    id: "intelligence", label: "Market Intelligence", icon: Globe, tier: "flash",
    description: "Macro trends, sector dynamics, and intelligence brief for the target market.",
    promptKey: "market intelligence report",
  },
];

// ── Generic sub-service runner ─────────────────────────────────────
function SubServiceRunner({ sub }: { sub: SubService }) {
  const eng = useEngagementStore((s) => s.getActiveEngagement)();
  const [extras, setExtras] = useState<Record<string, string>>({});
  const [customContext, setCustomContext] = useState("");

  const { analyze, loading, rawText } = useClaudeAnalysis({
    modelTier: sub.tier,
    systemPrompt: `You are a senior management consultant specializing in ${sub.label.toLowerCase()} for the MENA region with deep Iraq expertise.
${buildEngagementContext(eng)}
Provide a structured, professional ${sub.promptKey}. Use clear sections with headers. Be specific to the engagement context.`,
  });

  if (!eng) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <AlertTriangle className="h-7 w-7" style={{ color: "hsl(38 85% 52%)" }} />
        <p className="text-sm" style={{ color: "hsl(215 25% 50%)" }}>Select an active engagement to run analysis.</p>
      </div>
    );
  }

  const run = () => {
    const extrasStr = Object.entries(extras).map(([k, v]) => v ? `${k}: ${v}` : "").filter(Boolean).join(". ");
    analyze(`Run ${sub.promptKey} for this engagement. ${extrasStr} ${customContext}`);
  };

  return (
    <div className="space-y-4">
      {/* Engagement context pill */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
        style={{ background: "hsl(38 95% 52% / 0.08)", border: "1px solid hsl(38 95% 52% / 0.2)", color: "hsl(38 95% 60%)" }}>
        Using context: <strong>{eng.clientName}</strong> · {eng.industry} · {eng.market}
      </div>

      <div className="rounded-xl p-4 space-y-3" style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 18%)" }}>
        {sub.extraFields?.map((f) => (
          <div key={f.key}>
            <label className="block text-[10px] uppercase tracking-wider font-semibold mb-1" style={{ color: "hsl(215 25% 48%)" }}>{f.label}</label>
            <input type="text" placeholder={f.placeholder} value={extras[f.key] ?? ""}
              onChange={(e) => setExtras((x) => ({ ...x, [f.key]: e.target.value }))}
              className="w-full rounded-md px-3 py-2 text-sm"
              style={{ background: "hsl(216 45% 14%)", color: "hsl(210 40% 88%)", border: "1px solid hsl(216 45% 22%)" }} />
          </div>
        ))}

        <div>
          <label className="block text-[10px] uppercase tracking-wider font-semibold mb-1" style={{ color: "hsl(215 25% 48%)" }}>
            Additional Instructions (optional)
          </label>
          <textarea rows={2} value={customContext} onChange={(e) => setCustomContext(e.target.value)}
            placeholder="Any specific focus areas or questions…"
            className="w-full rounded-md px-3 py-2 text-sm resize-none"
            style={{ background: "hsl(216 45% 14%)", color: "hsl(210 40% 88%)", border: "1px solid hsl(216 45% 22%)" }} />
        </div>

        <button onClick={run} disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
          style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <sub.icon className="h-4 w-4" />}
          Run {sub.label}
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

// ── Main Hub ───────────────────────────────────────────────────────
export default function AnalysisHub() {
  const [active, setActive] = useState<AnalysisSub>("market-entry");
  const current = SUB_SERVICES.find((s) => s.id === active)!;

  return (
    <div className="space-y-5 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold" style={{ color: "hsl(210 40% 92%)" }}>Analysis</h1>
        <p className="text-sm mt-0.5" style={{ color: "hsl(215 25% 48%)" }}>
          Eight analysis tools, all powered by the active engagement context.
        </p>
      </div>

      {/* Sub-service tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {SUB_SERVICES.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: active === id ? "hsl(38 95% 52% / 0.15)" : "hsl(216 45% 12%)",
              color: active === id ? "hsl(38 95% 60%)" : "hsl(215 25% 55%)",
              border: active === id ? "1px solid hsl(38 95% 52% / 0.35)" : "1px solid hsl(216 45% 18%)",
            }}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Current tool header */}
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

      <SubServiceRunner sub={current} />
    </div>
  );
}
