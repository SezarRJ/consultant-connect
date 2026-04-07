/**
 * FinancialConsultancy.tsx — Full financial consultancy module
 * Financial Analysis, Valuation, Modeling, Forecasts, Reports
 * Auto-uses financial data entered in DataCollection
 */
import { useState } from "react";
import {
  useEngagementStore, buildFullContext, getEngagementReadiness,
} from "@/store/engagementStore";
import { useClaudeAnalysis } from "@/hooks/useClaudeAnalysis";
import { AIDisclaimer } from "@/components/ai/AIDisclaimer";
import {
  DollarSign, TrendingUp, BarChart2, FileText, PieChart,
  Calculator, AlertTriangle, Loader2, Save, Check,
  ArrowRight, Info, Target, Shield,
} from "lucide-react";

type FinSubId =
  | "financial-analysis"
  | "valuation"
  | "investment-appraisal"
  | "financial-modeling"
  | "budget-forecast"
  | "cash-flow"
  | "cost-reduction"
  | "profitability"
  | "due-diligence"
  | "financial-report";

interface FinSub {
  id: FinSubId;
  label: string;
  icon: React.ElementType;
  tier: "flash-lite"|"flash"|"pro";
  description: string;
  priorTools: string[];
  usesFinancialData: boolean;
  extraFields?: { key: string; label: string; placeholder: string }[];
}

const SUBS: FinSub[] = [
  {
    id: "financial-analysis",
    label: "Financial Analysis",
    icon: BarChart2,
    tier: "flash",
    description: "Comprehensive analysis of financials: ratios, trends, performance vs benchmarks, and key insights.",
    priorTools: [],
    usesFinancialData: true,
  },
  {
    id: "valuation",
    label: "Business Valuation",
    icon: Target,
    tier: "pro",
    description: "DCF, comparable company, and asset-based valuation with justified enterprise value range.",
    priorTools: ["financial-analysis"],
    usesFinancialData: true,
    extraFields: [{ key: "valuationPurpose", label: "Valuation Purpose", placeholder: "e.g. M&A, fundraising, buy-out, dispute resolution" }],
  },
  {
    id: "investment-appraisal",
    label: "Investment Appraisal",
    icon: TrendingUp,
    tier: "pro",
    description: "NPV, IRR, payback period, and go/no-go recommendation for proposed investment.",
    priorTools: ["financial-analysis"],
    usesFinancialData: true,
    extraFields: [
      { key: "investmentAmount", label: "Investment Amount", placeholder: "e.g. $5M USD" },
      { key: "investmentType", label: "Investment Type", placeholder: "e.g. capex, acquisition, greenfield" },
    ],
  },
  {
    id: "financial-modeling",
    label: "Financial Modeling",
    icon: Calculator,
    tier: "pro",
    description: "3-statement model (P&L, Balance Sheet, Cash Flow) with scenarios and key drivers.",
    priorTools: ["financial-analysis"],
    usesFinancialData: true,
    extraFields: [
      { key: "projectionYears", label: "Projection Period", placeholder: "e.g. 5 years" },
      { key: "growthAssumption", label: "Revenue Growth Assumption", placeholder: "e.g. 15% Year 1, 20% Year 2" },
    ],
  },
  {
    id: "budget-forecast",
    label: "Budget & Forecast",
    icon: PieChart,
    tier: "flash",
    description: "Annual budget framework, rolling forecast, and variance analysis recommendations.",
    priorTools: ["financial-analysis"],
    usesFinancialData: true,
    extraFields: [{ key: "forecastPeriod", label: "Forecast Period", placeholder: "e.g. Q1-Q4 2026, or 3-year rolling" }],
  },
  {
    id: "cash-flow",
    label: "Cash Flow Analysis",
    icon: ArrowRight,
    tier: "flash",
    description: "Operating, investing, and financing cash flow analysis with liquidity assessment.",
    priorTools: ["financial-analysis"],
    usesFinancialData: true,
  },
  {
    id: "cost-reduction",
    label: "Cost Reduction",
    icon: Shield,
    tier: "flash",
    description: "Cost structure analysis, benchmarking, and structured savings roadmap with ROI.",
    priorTools: ["financial-analysis"],
    usesFinancialData: true,
    extraFields: [{ key: "targetSaving", label: "Target Saving", placeholder: "e.g. 15% overhead reduction" }],
  },
  {
    id: "profitability",
    label: "Profitability Analysis",
    icon: DollarSign,
    tier: "flash",
    description: "Product, segment, and channel profitability with margin improvement opportunities.",
    priorTools: ["financial-analysis"],
    usesFinancialData: true,
    extraFields: [{ key: "segmentation", label: "Segment / Product Focus", placeholder: "e.g. by product line, by geography" }],
  },
  {
    id: "due-diligence",
    label: "Financial Due Diligence",
    icon: Shield,
    tier: "pro",
    description: "Quality of earnings, working capital, debt, and off-balance-sheet risk review.",
    priorTools: ["financial-analysis","valuation"],
    usesFinancialData: true,
    extraFields: [{ key: "ddPurpose", label: "DD Purpose", placeholder: "e.g. buy-side acquisition, PE investment" }],
  },
  {
    id: "financial-report",
    label: "Financial Report",
    icon: FileText,
    tier: "pro",
    description: "Comprehensive client-facing financial report synthesising all financial analyses.",
    priorTools: ["financial-analysis","valuation","financial-modeling","profitability"],
    usesFinancialData: true,
    extraFields: [{ key: "reportAudience", label: "Report Audience", placeholder: "e.g. Board, investors, bank, management" }],
  },
];

function buildFinancialContext(eng: any): string {
  if (!eng?.financialData) return "";
  const f = eng.financialData;
  const pairs = [
    ["Revenue", f.revenue], ["COGS", f.cogs], ["Gross Profit", f.grossProfit],
    ["Operating Expenses", f.operatingExpenses], ["EBITDA", f.ebitda], ["Net Profit", f.netProfit],
    ["Total Assets", f.totalAssets], ["Total Liabilities", f.totalLiabilities],
    ["Equity", f.equity], ["Cash", f.cash], ["Receivables", f.receivables],
    ["Inventory", f.inventory], ["Debt", f.debt], ["Currency", f.currency], ["Fiscal Year", f.fiscalYear],
  ].filter(([,v]) => v).map(([k,v]) => `  ${k}: ${v}`).join("\n");
  return pairs ? `FINANCIAL STATEMENTS (${f.currency || "USD"}, FY${f.fiscalYear || "N/A"}):\n${pairs}\n${f.notes ? `Notes: ${f.notes}` : ""}` : "";
}

function FinSubRunner({ sub }: { sub: FinSub }) {
  const { getActiveEngagement, saveOutput } = useEngagementStore();
  const eng = getActiveEngagement();
  const [extras, setExtras] = useState<Record<string, string>>({});
  const [customCtx, setCustomCtx] = useState("");
  const [saved, setSaved] = useState(false);

  const hasFinancialData = !!eng?.financialData && Object.values(eng.financialData).some(v => v);
  const existing = eng?.outputs?.[sub.id];
  const readiness = getEngagementReadiness(eng, eng?.phase);
  const priorAvailable = eng ? sub.priorTools.filter(id => !!eng.outputs?.[id]) : [];

  const finCtx = buildFinancialContext(eng);
  const systemPrompt = `You are a senior financial consultant specialising in MENA markets with CFA-level expertise.
${buildFullContext(eng, sub.priorTools)}
${finCtx}
CLIENT-PROVIDED DATA:
${(eng?.dataInputs || []).map((d: any) => `- ${d.label}: ${d.value}`).join("\n") || "None"}

Produce a professional ${sub.label} with:
## Executive Summary
## Key Findings & Analysis
## Ratios & Benchmarks (where applicable)
## Risks & Opportunities
## Recommendations
## Action Plan
## Appendix / Supporting Calculations

All numbers must reference the provided financial data. State any assumptions clearly. Benchmark against industry standards for ${eng?.industry || "the sector"}.`;

  const { analyze, loading, rawText } = useClaudeAnalysis({ modelTier: sub.tier, systemPrompt });

  if (!eng) return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <AlertTriangle className="h-7 w-7" style={{ color: "hsl(38 85% 52%)" }} />
      <p className="text-sm" style={{ color: "hsl(215 25% 50%)" }}>Select an active engagement first.</p>
    </div>
  );

  const run = () => {
    const extrasStr = Object.entries(extras).map(([k,v]) => v ? `${k}: ${v}` : "").filter(Boolean).join(". ");
    analyze(`Run ${sub.label}. ${extrasStr} ${customCtx}`);
    setSaved(false);
  };

  const content = rawText || existing?.content || "";

  return (
    <div className="space-y-4">
      {/* Context banner */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
        style={{ background: "hsl(38 95% 52%/0.08)", border: "1px solid hsl(38 95% 52%/0.2)", color: "hsl(38 95% 60%)" }}>
        Using: <strong>{eng.companyName}</strong> · {eng.industry} · {eng.market}
        {hasFinancialData && (
          <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full"
            style={{ background: "hsl(145 65% 40%/0.15)", color: "hsl(145 65% 55%)" }}>
            ✓ Financial data loaded
          </span>
        )}
        {!hasFinancialData && (
          <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full"
            style={{ background: "hsl(38 85% 52%/0.15)", color: "hsl(38 85% 60%)" }}>
            ⚠ No financial data — go to Data Collection first
          </span>
        )}
        {priorAvailable.length > 0 && (
          <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full"
            style={{ background: "hsl(200 80% 55%/0.12)", color: "hsl(200 80% 65%)" }}>
            + {priorAvailable.length} prior output{priorAvailable.length > 1 ? "s" : ""} chained
          </span>
        )}
      </div>

      {!hasFinancialData && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{ background: "hsl(38 85% 52%/0.08)", border: "1px solid hsl(38 85% 52%/0.2)" }}>
          <Info className="h-4 w-4 shrink-0" style={{ color: "hsl(38 85% 55%)" }} />
          <p className="text-xs" style={{ color: "hsl(215 25% 55%)" }}>
            For best results, enter client financial data in <strong>Data Collection → Financial Data</strong> tab first.
            The AI will still run with available context.
          </p>
        </div>
      )}

      <div className="rounded-xl p-4 space-y-3" style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 18%)" }}>
        {sub.extraFields?.map(f => (
          <div key={f.key}>
            <label className="block text-[10px] uppercase tracking-wider font-semibold mb-1" style={{ color: "hsl(215 25% 48%)" }}>{f.label}</label>
            <input type="text" placeholder={f.placeholder} value={extras[f.key] ?? ""}
              onChange={e => setExtras(x => ({ ...x, [f.key]: e.target.value }))}
              className="w-full rounded-md px-3 py-2 text-sm"
              style={{ background: "hsl(216 45% 14%)", color: "hsl(210 40% 88%)", border: "1px solid hsl(216 45% 22%)" }} />
          </div>
        ))}
        <div>
          <label className="block text-[10px] uppercase tracking-wider font-semibold mb-1" style={{ color: "hsl(215 25% 48%)" }}>Additional Instructions</label>
          <textarea rows={2} value={customCtx} onChange={e => setCustomCtx(e.target.value)}
            placeholder="Specific focus areas, benchmarks to compare, or questions…"
            className="w-full rounded-md px-3 py-2 text-sm resize-none"
            style={{ background: "hsl(216 45% 14%)", color: "hsl(210 40% 88%)", border: "1px solid hsl(216 45% 22%)" }} />
        </div>
        <div className="flex gap-2">
          <button onClick={run} disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
            style={{ background: "hsl(145 65% 48%)", color: "hsl(216 58% 6%)" }}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <sub.icon className="h-4 w-4" />}
            Run {sub.label}
          </button>
          {rawText && (
            <button onClick={() => { saveOutput(eng.id, sub.id, sub.label, rawText, eng.phase, "Financial Consultancy"); setSaved(true); }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold"
              style={{ background: saved ? "hsl(145 65% 40%/0.15)" : "hsl(216 45% 18%)", color: saved ? "hsl(145 65% 55%)" : "hsl(38 95% 55%)" }}>
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
              {sub.label} — {eng.companyName}
              {existing && !rawText && <span className="ml-2 text-[9px]">(saved)</span>}
            </p>
            <span className="text-[10px] px-2 py-0.5 rounded-full"
              style={{ background: "hsl(216 45% 18%)", color: "hsl(215 25% 55%)" }}>{sub.tier}</span>
          </div>
          <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "hsl(210 40% 80%)" }}>
            {content}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FinancialConsultancy() {
  const [active, setActive] = useState<FinSubId>("financial-analysis");
  const current = SUBS.find(s => s.id === active)!;

  return (
    <div className="space-y-5 max-w-4xl">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <DollarSign className="h-5 w-5" style={{ color: "hsl(145 65% 48%)" }} />
          <h1 className="text-xl font-bold" style={{ color: "hsl(210 40% 92%)" }}>Financial Consultancy</h1>
        </div>
        <p className="text-sm mt-0.5" style={{ color: "hsl(215 25% 48%)" }}>
          10 financial tools — all automatically use financial data entered for the active engagement.
        </p>
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {SUBS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActive(id)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: active === id ? "hsl(145 65% 40%/0.15)" : "hsl(216 45% 12%)",
              color:      active === id ? "hsl(145 65% 58%)"      : "hsl(215 25% 55%)",
              border:     active === id ? "1px solid hsl(145 65% 40%/0.35)" : "1px solid hsl(216 45% 18%)",
            }}>
            <Icon className="h-3.5 w-3.5" />{label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
        style={{ background: "hsl(216 45% 11%)", border: "1px solid hsl(216 45% 20%)" }}>
        <current.icon className="h-5 w-5" style={{ color: "hsl(145 65% 48%)" }} />
        <div className="flex-1">
          <p className="text-sm font-semibold" style={{ color: "hsl(210 40% 90%)" }}>{current.label}</p>
          <p className="text-xs" style={{ color: "hsl(215 25% 48%)" }}>{current.description}</p>
        </div>
        {current.priorTools.length > 0 && (
          <span className="text-[10px] px-2 py-0.5 rounded-full shrink-0"
            style={{ background: "hsl(145 65% 40%/0.12)", color: "hsl(145 65% 55%)" }}>
            Chains {current.priorTools.length} prior tool{current.priorTools.length > 1 ? "s" : ""}
          </span>
        )}
      </div>

      <FinSubRunner sub={current} />
    </div>
  );
}
