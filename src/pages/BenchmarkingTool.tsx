import { useState } from "react";
import { BarChart2, RefreshCw, Sparkles, TrendingUp, TrendingDown, Minus, Target, ArrowRight } from "lucide-react";
import { useClaudeAnalysis } from "@/hooks/useClaudeAnalysis";
import { toast } from "sonner";

const SYSTEM_PROMPT = `You are a senior management consultant specializing in performance benchmarking for MENA/Iraq markets. Generate a comprehensive benchmarking analysis. Respond ONLY with valid JSON:
{
  "overallPerformance": "Top Quartile|Above Average|Average|Below Average|Bottom Quartile",
  "performanceScore": "number 0-100",
  "executiveSummary": "string",
  "benchmarks": [
    {
      "metric": "string",
      "clientValue": "string",
      "industryMedian": "string",
      "topQuartile": "string",
      "gap": "string",
      "rating": "Excellent|Good|Average|Below Average|Poor",
      "trend": "improving|stable|declining",
      "commentary": "string"
    }
  ],
  "strengthAreas": ["string"],
  "improvementAreas": ["string"],
  "quickWins": [{ "action": "string", "impact": "High|Medium|Low", "effort": "High|Medium|Low", "timeline": "string" }],
  "strategicPriorities": ["string"],
  "peerComparison": "string"
}`;

const INDUSTRIES = ["FMCG", "Food & Beverage", "Manufacturing", "Retail", "Healthcare", "Technology", "Logistics", "Construction", "Energy", "Telecom"];
const COMPANY_SIZES = ["Micro (< 10 staff)", "Small (10-50 staff)", "Medium (50-200 staff)", "Large (200-1000 staff)", "Enterprise (1000+)"];

const METRIC_TEMPLATES: Record<string, Array<{ label: string; placeholder: string; unit: string }>> = {
  "FMCG": [
    { label: "Gross Margin %",        placeholder: "e.g. 32",  unit: "%" },
    { label: "Inventory Turnover",    placeholder: "e.g. 8",   unit: "x/yr" },
    { label: "Sales per Employee",    placeholder: "e.g. 85",  unit: "$K" },
    { label: "Distribution Coverage",placeholder: "e.g. 60",  unit: "%" },
    { label: "Marketing Spend %",     placeholder: "e.g. 4",   unit: "%" },
    { label: "Customer Return Rate",  placeholder: "e.g. 72",  unit: "%" },
  ],
  "Manufacturing": [
    { label: "OEE (Overall Equipment Effectiveness)", placeholder: "e.g. 72", unit: "%" },
    { label: "Defect Rate",           placeholder: "e.g. 2.1", unit: "%" },
    { label: "On-Time Delivery",      placeholder: "e.g. 85",  unit: "%" },
    { label: "Inventory Turnover",    placeholder: "e.g. 6",   unit: "x/yr" },
    { label: "Labor Productivity",    placeholder: "e.g. 45",  unit: "$K/head" },
    { label: "Energy Cost % of COGS", placeholder: "e.g. 8",   unit: "%" },
  ],
  "Retail": [
    { label: "Sales per Sq Meter",    placeholder: "e.g. 420", unit: "$" },
    { label: "Gross Margin %",        placeholder: "e.g. 38",  unit: "%" },
    { label: "Inventory Turnover",    placeholder: "e.g. 12",  unit: "x/yr" },
    { label: "Shrinkage Rate",        placeholder: "e.g. 1.8", unit: "%" },
    { label: "Conversion Rate",       placeholder: "e.g. 22",  unit: "%" },
    { label: "Average Transaction",   placeholder: "e.g. 35",  unit: "$" },
  ],
};

const DEFAULT_METRICS = [
  { label: "Revenue Growth %",   placeholder: "e.g. 15", unit: "%"   },
  { label: "EBITDA Margin %",    placeholder: "e.g. 12", unit: "%"   },
  { label: "Net Profit Margin %",placeholder: "e.g. 7",  unit: "%"   },
  { label: "Employee Turnover %",placeholder: "e.g. 22", unit: "%"   },
  { label: "Customer Satisfaction (NPS)", placeholder: "e.g. 42", unit: "pts" },
  { label: "Revenue per Employee", placeholder: "e.g. 95", unit: "$K" },
];

const RATING_COLORS: Record<string, string> = {
  "Excellent": "hsl(158 64% 55%)", "Good": "hsl(158 64% 55%)", "Average": "hsl(38 95% 60%)",
  "Below Average": "hsl(0 72% 68%)", "Poor": "hsl(0 72% 68%)"
};

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend === "improving")  return <TrendingUp  className="h-3.5 w-3.5" style={{ color: "hsl(158 64% 55%)" }} />;
  if (trend === "declining")  return <TrendingDown className="h-3.5 w-3.5" style={{ color: "hsl(0 72% 68%)" }} />;
  return <Minus className="h-3.5 w-3.5" style={{ color: "hsl(215 25% 50%)" }} />;
};

export default function BenchmarkingTool() {
  const [industry, setIndustry]   = useState("FMCG");
  const [size, setSize]           = useState(COMPANY_SIZES[2]);
  const [company, setCompany]     = useState("");
  const [market, setMarket]       = useState("Iraq");
  const [context, setContext]     = useState("");
  const [metrics, setMetrics]     = useState<Record<string, string>>({});

  const { result, loading, error, analyze, responseTime, tokensUsed } = useClaudeAnalysis({
    systemPrompt: SYSTEM_PROMPT, agentId: "benchmarking", modelTier: "flash"
  });

  const IS = { background: "hsl(216 45% 12%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" };
  const metricList = METRIC_TEMPLATES[industry] || DEFAULT_METRICS;

  const run = () => {
    if (!company) { toast.error("Company name is required"); return; }
    const metricLines = metricList.map(m => `${m.label}: ${metrics[m.label] || "Not provided"} ${m.unit}`).join("\n");
    const prompt = `Benchmark the following company:\n\nCompany: ${company}\nIndustry: ${industry}\nCompany Size: ${size}\nMarket: ${market}\n\nProvided Metrics:\n${metricLines}\n\nAdditional Context: ${context || "None"}`;
    analyze(prompt);
  };

  const r = result;

  const perfColor = (p: string) => {
    if (p === "Top Quartile" || p === "Above Average") return "hsl(158 64% 55%)";
    if (p === "Average") return "hsl(38 95% 60%)";
    return "hsl(0 72% 68%)";
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-display" style={{ color: "hsl(210 40% 94%)" }}>Benchmarking Tool</h1>
        <p className="text-sm mt-1" style={{ color: "hsl(215 25% 55%)" }}>
          Compare your client's performance against industry benchmarks and identify priority improvement areas
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Form */}
        <div className="space-y-4">
          <div className="rounded-xl p-5 space-y-4" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "hsl(38 95% 52%)" }}>Company Profile</p>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] mb-1 block" style={{ color: "hsl(215 25% 50%)" }}>Company Name *</label>
                <input value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. Al Manar Foods"
                  className="w-full px-3 py-2 rounded-lg text-sm" style={IS} />
              </div>
              <div>
                <label className="text-[10px] mb-1 block" style={{ color: "hsl(215 25% 50%)" }}>Industry</label>
                <select value={industry} onChange={e => { setIndustry(e.target.value); setMetrics({}); }}
                  className="w-full px-3 py-2 rounded-lg text-sm" style={IS}>
                  {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] mb-1 block" style={{ color: "hsl(215 25% 50%)" }}>Company Size</label>
                <select value={size} onChange={e => setSize(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm" style={IS}>
                  {COMPANY_SIZES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] mb-1 block" style={{ color: "hsl(215 25% 50%)" }}>Market</label>
                <input value={market} onChange={e => setMarket(e.target.value)} placeholder="e.g. Iraq, GCC, MENA"
                  className="w-full px-3 py-2 rounded-lg text-sm" style={IS} />
              </div>
            </div>
          </div>

          <div className="rounded-xl p-5 space-y-3" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "hsl(38 95% 52%)" }}>
              Key Metrics (enter what you have)
            </p>
            {metricList.map(m => (
              <div key={m.label}>
                <label className="text-[10px] mb-1 block" style={{ color: "hsl(215 25% 50%)" }}>
                  {m.label} <span style={{ color: "hsl(215 25% 38%)" }}>({m.unit})</span>
                </label>
                <input value={metrics[m.label] || ""} placeholder={m.placeholder}
                  onChange={e => setMetrics(v => ({ ...v, [m.label]: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-sm" style={IS} />
              </div>
            ))}
          </div>

          <div className="rounded-xl p-4 space-y-2" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <label className="text-[10px] mb-1 block" style={{ color: "hsl(215 25% 50%)" }}>Additional Context</label>
            <textarea value={context} onChange={e => setContext(e.target.value)} rows={3}
              placeholder="Business model, challenges, recent changes..."
              className="w-full px-3 py-2 rounded-lg text-sm resize-none" style={IS} />
          </div>

          <button onClick={run} disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold"
            style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)", opacity: loading ? 0.7 : 1 }}>
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <BarChart2 className="h-4 w-4" />}
            {loading ? "Benchmarking..." : "Run Benchmark Analysis"}
          </button>
          {error && <p className="text-xs text-center" style={{ color: "hsl(0 72% 68%)" }}>{error}</p>}
          {r && <p className="text-[10px] text-center" style={{ color: "hsl(215 25% 40%)" }}>
            {(responseTime / 1000).toFixed(1)}s · {tokensUsed} tokens
          </p>}
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          {!r && !loading && (
            <div className="flex flex-col items-center justify-center h-64 rounded-xl"
              style={{ background: "hsl(var(--card))", border: "1px dashed hsl(var(--border))" }}>
              <BarChart2 className="h-10 w-10 mb-3" style={{ color: "hsl(215 25% 35%)" }} />
              <p className="text-sm font-semibold" style={{ color: "hsl(215 25% 45%)" }}>Enter metrics and run benchmark</p>
            </div>
          )}
          {loading && (
            <div className="flex flex-col items-center justify-center h-64 rounded-xl"
              style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
              <RefreshCw className="h-8 w-8 animate-spin mb-3" style={{ color: "hsl(38 95% 52%)" }} />
              <p className="text-sm" style={{ color: "hsl(215 25% 55%)" }}>Comparing against industry benchmarks...</p>
            </div>
          )}

          {r && (
            <>
              {/* Score Banner */}
              <div className="rounded-xl p-5 flex items-center justify-between"
                style={{ background: "hsl(216 45% 12%)", border: "1px solid hsl(var(--border))" }}>
                <div>
                  <p className="text-xs mb-1" style={{ color: "hsl(215 25% 50%)" }}>Overall Performance</p>
                  <p className="text-xl font-bold" style={{ color: perfColor(r.overallPerformance) }}>
                    {r.overallPerformance}
                  </p>
                  <p className="text-xs mt-2 max-w-md" style={{ color: "hsl(215 25% 60%)" }}>{r.executiveSummary}</p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold" style={{ color: perfColor(r.overallPerformance) }}>
                    {r.performanceScore}
                  </p>
                  <p className="text-[10px]" style={{ color: "hsl(215 25% 40%)" }}>/ 100</p>
                </div>
              </div>

              {/* Benchmark Table */}
              <div className="rounded-xl overflow-hidden" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
                <div className="px-5 py-3 flex items-center gap-2" style={{ background: "hsl(216 45% 11%)", borderBottom: "1px solid hsl(var(--border))" }}>
                  <BarChart2 className="h-4 w-4" style={{ color: "hsl(38 95% 52%)" }} />
                  <p className="text-sm font-bold" style={{ color: "hsl(210 40% 92%)" }}>Metric Benchmarks</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr style={{ borderBottom: "1px solid hsl(var(--border))" }}>
                        {["Metric", "Your Value", "Industry Median", "Top Quartile", "Gap", "Rating", "Trend"].map(h => (
                          <th key={h} className="px-4 py-2.5 text-left font-semibold"
                            style={{ color: "hsl(215 25% 45%)" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(r.benchmarks || []).map((b: any, i: number) => (
                        <tr key={i} style={{ borderBottom: "1px solid hsl(var(--border)/0.5)" }}>
                          <td className="px-4 py-3 font-medium" style={{ color: "hsl(210 40% 82%)" }}>{b.metric}</td>
                          <td className="px-4 py-3 font-bold" style={{ color: "hsl(38 95% 60%)" }}>{b.clientValue}</td>
                          <td className="px-4 py-3" style={{ color: "hsl(215 25% 55%)" }}>{b.industryMedian}</td>
                          <td className="px-4 py-3" style={{ color: "hsl(158 64% 55%)" }}>{b.topQuartile}</td>
                          <td className="px-4 py-3" style={{ color: "hsl(215 25% 55%)" }}>{b.gap}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                              style={{ background: `${RATING_COLORS[b.rating] || "hsl(215 25% 45%)"}20`, color: RATING_COLORS[b.rating] || "hsl(215 25% 55%)" }}>
                              {b.rating}
                            </span>
                          </td>
                          <td className="px-4 py-3"><TrendIcon trend={b.trend} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick Wins */}
              {r.quickWins?.length > 0 && (
                <div className="rounded-xl p-5" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
                  <p className="text-xs font-bold mb-3 uppercase tracking-widest" style={{ color: "hsl(38 95% 52%)" }}>Quick Wins</p>
                  <div className="space-y-2">
                    {r.quickWins.map((w: any, i: number) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: "hsl(216 45% 11%)" }}>
                        <ArrowRight className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: "hsl(38 95% 52%)" }} />
                        <div className="flex-1">
                          <p className="text-xs font-medium" style={{ color: "hsl(210 40% 85%)" }}>{w.action}</p>
                          <p className="text-[10px]" style={{ color: "hsl(215 25% 50%)" }}>{w.timeline}</p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          {[{ label: `Impact: ${w.impact}`, c: w.impact === "High" ? "hsl(158 64% 55%)" : "hsl(38 95% 60%)" },
                            { label: `Effort: ${w.effort}`, c: w.effort === "Low" ? "hsl(158 64% 55%)" : "hsl(38 95% 60%)" }
                          ].map((b, j) => (
                            <span key={j} className="text-[9px] px-1.5 py-0.5 rounded-full font-bold"
                              style={{ background: `${b.c}20`, color: b.c }}>{b.label}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
