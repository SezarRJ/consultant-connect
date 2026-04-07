import { useState } from "react";
import {
  FileText, Download, RefreshCw, CheckCircle2, AlertTriangle, Copy,
  BarChart2, PieChart, TrendingUp, ShieldAlert, Globe2, DollarSign,
  FileBarChart2, Briefcase, Zap, ArrowUpRight, Layers, Star
} from "lucide-react";
import { useClaudeAnalysis } from "@/hooks/useClaudeAnalysis";
import { toast } from "sonner";
import { AIDisclaimer } from "@/components/ai/AIDisclaimer";

type ReportType = "feasibility" | "strategy" | "market" | "sales_audit" | "business_plan";
type OutputFormat = "pdf" | "excel" | "presentation";

const REPORT_TYPES = [
  {
    key: "feasibility" as ReportType,
    label: "Feasibility Study",
    labelAr: "دراسة الجدوى",
    icon: PieChart,
    color: "hsl(38 95% 60%)",
    bg: "hsl(38 95% 52% / 0.08)",
    desc: "Full business feasibility with financial projections, ROI and go/no-go recommendation",
    sections: ["Executive Summary", "Market Analysis", "Financial Projections", "Risk Assessment", "Go/No-Go Decision"],
    prompt: `You are a senior business feasibility consultant. Write a comprehensive feasibility study report. Respond ONLY with valid JSON:
{
  "reportTitle": "string",
  "executiveSummary": { "verdict": "Recommended|Conditional|Not Recommended", "score": "number 0-100", "summary": "string", "keyFindings": ["string"] },
  "businessConcept": { "description": "string", "valueProposition": "string", "targetMarket": "string", "revenueModel": "string" },
  "marketAnalysis": { "marketSize": "string", "growthRate": "string", "targetSegment": "string", "competitivePosition": "string", "keyTrends": ["string"] },
  "financialProjections": { "startupCost": "string", "year1Revenue": "string", "year2Revenue": "string", "year3Revenue": "string", "breakEven": "string", "roi": "string", "irr": "string", "npv": "string" },
  "operationalPlan": { "teamRequired": ["string"], "keyProcesses": ["string"], "criticalSuccessFactors": ["string"] },
  "riskMatrix": [{ "risk": "string", "probability": "High|Medium|Low", "impact": "High|Medium|Low", "mitigation": "string" }],
  "conclusion": { "goNoGo": "GO|CONDITIONAL GO|NO GO", "rationale": "string", "nextSteps": ["string"] }
}`
  },
  {
    key: "strategy" as ReportType,
    label: "Strategy Report",
    labelAr: "تقرير الاستراتيجية",
    icon: Layers,
    color: "hsl(217 91% 70%)",
    bg: "hsl(217 91% 53% / 0.08)",
    desc: "Strategic analysis with competitive positioning, growth roadmap and action plan",
    sections: ["Situation Analysis", "Strategic Options", "Recommended Strategy", "Roadmap", "KPIs"],
    prompt: `You are a McKinsey-level strategy consultant. Write a comprehensive strategy report. Respond ONLY with valid JSON:
{
  "reportTitle": "string",
  "situationAnalysis": { "currentState": "string", "swot": { "strengths": ["string"], "weaknesses": ["string"], "opportunities": ["string"], "threats": ["string"] } },
  "strategicOptions": [{ "option": "string", "pros": ["string"], "cons": ["string"], "feasibility": "High|Medium|Low" }],
  "recommendedStrategy": { "strategy": "string", "rationale": "string", "pillars": ["string"], "differentiators": ["string"] },
  "implementation": { "phase1": { "name": "string", "timeline": "string", "actions": ["string"] }, "phase2": { "name": "string", "timeline": "string", "actions": ["string"] }, "phase3": { "name": "string", "timeline": "string", "actions": ["string"] } },
  "resourceRequirements": { "investment": "string", "headcount": "string", "technology": ["string"], "partnerships": ["string"] },
  "kpis": [{ "kpi": "string", "target": "string", "timeline": "string" }],
  "conclusion": "string"
}`
  },
  {
    key: "market" as ReportType,
    label: "Market Report",
    labelAr: "تقرير السوق",
    icon: Globe2,
    color: "hsl(158 64% 55%)",
    bg: "hsl(158 64% 40% / 0.08)",
    desc: "Comprehensive market intelligence with sizing, trends, competition and entry strategy",
    sections: ["Market Overview", "Demand Analysis", "Competitive Landscape", "Price Intelligence", "Entry Recommendations"],
    prompt: `You are a senior market research analyst. Write a comprehensive market intelligence report. Respond ONLY with valid JSON:
{
  "reportTitle": "string",
  "marketOverview": { "marketName": "string", "totalSize": "string", "growthRate": "string", "maturity": "string", "geography": "string", "keyTrends": ["string"] },
  "demandAnalysis": { "currentDemand": "string", "forecast3yr": "string", "demandDrivers": ["string"], "seasonality": "string", "segments": [{"segment":"string","size":"string","growth":"string"}] },
  "competitiveLandscape": { "marketStructure": "string", "topPlayers": [{"company":"string","share":"string","strengths":"string","strategy":"string"}], "competitiveIntensity": "High|Medium|Low" },
  "priceIntelligence": { "priceRanges": [{"tier":"string","range":"string","positioning":"string"}], "pricingDynamics": "string", "marginStructure": "string" },
  "entryStrategy": { "recommendedApproach": "string", "keySuccessFactors": ["string"], "barriers": ["string"], "timeline": "string", "investmentRequired": "string" },
  "conclusion": { "attractiveness": "High|Medium|Low", "recommendation": "string", "topOpportunities": ["string"] }
}`
  },
  {
    key: "sales_audit" as ReportType,
    label: "Sales Audit",
    labelAr: "تدقيق المبيعات",
    icon: BarChart2,
    color: "hsl(0 72% 68%)",
    bg: "hsl(0 72% 51% / 0.08)",
    desc: "Sales performance audit with gap analysis, benchmarks and improvement roadmap",
    sections: ["Performance Scorecard", "Distribution Audit", "Team Assessment", "Gap Analysis", "Action Plan"],
    prompt: `You are a senior sales performance auditor. Write a comprehensive sales audit report. Respond ONLY with valid JSON:
{
  "reportTitle": "string",
  "performanceScorecard": { "overallScore": "number 0-100", "revenueVsTarget": "string", "distributionCoverage": "string", "outletProductivity": "string", "teamPerformance": "string" },
  "distributionAudit": { "totalOutlets": "string", "activeOutlets": "string", "coverageRate": "string", "outOfStockRate": "string", "shelfShare": "string", "gapsByCity": [{"city":"string","coverage":"string","gap":"string"}] },
  "teamAssessment": { "teamSize": "string", "productivityPerRep": "string", "callsPerDay": "string", "strikerate": "string", "topPerformers": "string", "underperformers": "string" },
  "gapAnalysis": [{ "area": "string", "current": "string", "benchmark": "string", "gap": "string", "priority": "High|Medium|Low" }],
  "rootCauses": ["string"],
  "actionPlan": [{ "action": "string", "owner": "string", "timeline": "string", "expectedImpact": "string" }],
  "expectedOutcome": { "revenueUplift": "string", "coverageImprovement": "string", "timeframe": "string" }
}`
  },
  {
    key: "business_plan" as ReportType,
    label: "Business Plan",
    labelAr: "خطة العمل",
    icon: Briefcase,
    color: "hsl(280 80% 70%)",
    bg: "hsl(280 80% 50% / 0.08)",
    desc: "Complete business plan with vision, strategy, operations, financials and funding ask",
    sections: ["Executive Summary", "Business Model", "Market Strategy", "Operations Plan", "Financial Plan"],
    prompt: `You are a senior business plan writer and startup advisor. Write a comprehensive business plan. Respond ONLY with valid JSON:
{
  "reportTitle": "string",
  "executiveSummary": { "mission": "string", "vision": "string", "problem": "string", "solution": "string", "traction": "string", "ask": "string" },
  "businessModel": { "revenueStreams": ["string"], "valueProposition": "string", "customerSegments": ["string"], "channels": ["string"], "costStructure": "string", "unitEconomics": { "cac": "string", "ltv": "string", "payback": "string", "margin": "string" } },
  "marketStrategy": { "tam": "string", "sam": "string", "som": "string", "gtmStrategy": "string", "customerAcquisition": ["string"], "partnerships": ["string"] },
  "operationsPlan": { "team": [{"role":"string","responsibility":"string"}], "technology": ["string"], "processes": ["string"], "timeline": "string" },
  "financialPlan": { "fundingRequired": "string", "useOfFunds": [{"item":"string","amount":"string"}], "projections": {"year1Revenue":"string","year2Revenue":"string","year3Revenue":"string","breakEven":"string"}, "exitStrategy": "string" },
  "risks": [{ "risk": "string", "mitigation": "string" }]
}`
  },
];

function ErrorBanner({ msg }: { msg: string }) {
  return (
    <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: "hsl(0 72% 51% / 0.08)", border: "1px solid hsl(0 72% 51% / 0.3)" }}>
      <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "hsl(0 72% 68%)" }} />
      <div>
        <p className="text-sm" style={{ color: "hsl(0 72% 68%)" }}>{msg}</p>
        {msg.toLowerCase().includes("credit") && (
          <a href="https://console.anthropic.com/" target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs mt-2 underline" style={{ color: "hsl(38 95% 60%)" }}>
            Top up credits at console.anthropic.com <ArrowUpRight className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
}

function ReportSection({ title, data, color }: { title: string; data: any; color: string }) {
  if (!data) return null;
  return (
    <div className="rounded-xl p-5" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
      <h3 className="text-sm font-bold mb-4 pb-2 border-b" style={{ color, borderColor: "hsl(var(--border))" }}>{title}</h3>
      <div className="space-y-2">
        {Object.entries(data).map(([key, val]) => {
          const label = key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).trim();
          if (Array.isArray(val)) {
            return (
              <div key={key}>
                <p className="text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: "hsl(215 25% 45%)" }}>{label}</p>
                <div className="space-y-1.5">
                  {val.map((item, i) => (
                    <div key={i}>
                      {typeof item === "object" ? (
                        <div className="rounded-lg p-2.5" style={{ background: "hsl(216 45% 12%)" }}>
                          {Object.entries(item).map(([k, v]) => (
                            <div key={k} className="flex items-start gap-2 text-xs py-0.5">
                              <span className="shrink-0 font-semibold min-w-[90px]" style={{ color: "hsl(217 91% 65%)" }}>{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                              <span style={{ color: "hsl(210 40% 78%)" }}>{String(v)}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-start gap-2 text-xs">
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color }} />
                          <span style={{ color: "hsl(210 40% 78%)" }}>{String(item)}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          if (typeof val === "object" && val !== null) {
            return (
              <div key={key}>
                <p className="text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: "hsl(215 25% 45%)" }}>{label}</p>
                <div className="rounded-lg p-3" style={{ background: "hsl(216 45% 12%)" }}>
                  {Object.entries(val).map(([k, v]) => (
                    <div key={k} className="flex justify-between text-xs py-0.5">
                      <span style={{ color: "hsl(215 25% 55%)" }}>{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="font-semibold ml-4 text-right" style={{ color: "hsl(210 40% 82%)" }}>{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          return (
            <div key={key} className="flex justify-between items-start py-1.5 border-b last:border-0 text-xs" style={{ borderColor: "hsl(var(--border))" }}>
              <span style={{ color: "hsl(215 25% 55%)" }}>{label}</span>
              <span className="font-semibold ml-4 text-right max-w-[60%]" style={{ color: "hsl(210 40% 85%)" }}>{String(val)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ReportGenerator() {
  const [reportType, setReportType] = useState<ReportType>("feasibility");
  const [format, setFormat] = useState<OutputFormat>("pdf");
  const [subject, setSubject] = useState("");
  const [context, setContext] = useState("");
  const [geography, setGeography] = useState("Iraq");

  const rt = REPORT_TYPES.find(r => r.key === reportType)!;
  const { result, loading, error, analyze } = useClaudeAnalysis({ systemPrompt: rt.prompt, agentId: `report-${reportType}`, modelTier: "flash-lite" });

  const handleGenerate = () => {
    if (!subject.trim()) { toast.error("Please enter a report subject"); return; }
    analyze(`Generate a ${rt.label} for: ${subject}. Geography: ${geography}. Additional context: ${context || "Standard analysis for MENA/Iraq market."}`);
  };

  const handleCopy = () => {
    if (result) { navigator.clipboard.writeText(JSON.stringify(result, null, 2)); toast.success("Report data copied!"); }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display" style={{ color: "hsl(210 40% 94%)" }}>Report Generator</h1>
          <p className="text-sm mt-1" style={{ color: "hsl(215 25% 55%)" }}>AI-powered professional consulting reports — feasibility, strategy, market, sales audit, business plans</p>
        </div>
        {result && (
          <AIDisclaimer compact />
          <div className="flex gap-2">
            <button onClick={handleCopy} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold"
              style={{ background: "hsl(216 45% 18%)", color: "hsl(210 40% 75%)", border: "1px solid hsl(var(--border))" }}>
              <Copy className="h-3.5 w-3.5" /> Copy Data
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold"
              style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
              <Download className="h-3.5 w-3.5" /> Export {format.toUpperCase()}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Config Panel */}
        <div className="space-y-4">
          {/* Report Type */}
          <div className="rounded-xl p-5" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <p className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: "hsl(215 25% 45%)" }}>Report Type</p>
            <div className="space-y-2">
              {REPORT_TYPES.map(rt => (
                <button key={rt.key} onClick={() => setReportType(rt.key)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all"
                  style={{
                    background: reportType === rt.key ? rt.bg : "hsl(216 45% 12%)",
                    border: `1px solid ${reportType === rt.key ? rt.color + "44" : "transparent"}`,
                  }}>
                  <rt.icon className="h-4 w-4 shrink-0" style={{ color: reportType === rt.key ? rt.color : "hsl(215 25% 50%)" }} />
                  <div>
                    <p className="text-xs font-semibold" style={{ color: reportType === rt.key ? rt.color : "hsl(210 40% 80%)" }}>{rt.label}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: "hsl(215 25% 45%)" }}>{rt.labelAr}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Output Format */}
          <div className="rounded-xl p-4" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <p className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: "hsl(215 25% 45%)" }}>Output Format</p>
            <div className="grid grid-cols-3 gap-2">
              {(["pdf", "excel", "presentation"] as OutputFormat[]).map(f => (
                <button key={f} onClick={() => setFormat(f)}
                  className="py-2 rounded-lg text-xs font-semibold capitalize"
                  style={{
                    background: format === f ? "hsl(38 95% 52% / 0.15)" : "hsl(216 45% 12%)",
                    color: format === f ? "hsl(38 95% 60%)" : "hsl(215 25% 55%)",
                    border: `1px solid ${format === f ? "hsl(38 95% 52% / 0.35)" : "transparent"}`,
                  }}>
                  {f === "presentation" ? "PPT" : f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Report Sections Preview */}
          <div className="rounded-xl p-4" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <p className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: "hsl(215 25% 45%)" }}>Report Sections</p>
            {REPORT_TYPES.find(r => r.key === reportType)?.sections.map((s, i) => (
              <div key={i} className="flex items-center gap-2 py-1.5 text-xs">
                <span className="flex h-4 w-4 items-center justify-center rounded text-[10px] font-bold shrink-0"
                  style={{ background: "hsl(38 95% 52% / 0.15)", color: "hsl(38 95% 60%)" }}>{i + 1}</span>
                <span style={{ color: "hsl(210 40% 78%)" }}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Input + Output */}
        <div className="lg:col-span-2 space-y-4">
          {/* Input Form */}
          <div className="rounded-xl p-5 space-y-4" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: rt.bg }}>
                <rt.icon className="h-5 w-5" style={{ color: rt.color }} />
              </div>
              <div>
                <h2 className="text-sm font-semibold" style={{ color: "hsl(210 40% 92%)" }}>{rt.label}</h2>
                <p className="text-xs" style={{ color: "hsl(215 25% 50%)" }}>{rt.desc}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "hsl(215 25% 45%)" }}>Report Subject *</label>
                <input value={subject} onChange={e => setSubject(e.target.value)}
                  placeholder={`e.g. ${rt.key === "feasibility" ? "Feasibility study for premium hotel in Baghdad" : rt.key === "strategy" ? "3-year growth strategy for FMCG distribution company" : rt.key === "market" ? "Iraq electronics import market analysis" : rt.key === "sales_audit" ? "Sales performance audit for beverage brand in Iraq" : "Business plan for logistics startup in Iraq"}`}
                  className="w-full px-3 py-2.5 rounded-lg text-sm"
                  style={{ background: "hsl(216 45% 12%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }} />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "hsl(215 25% 45%)" }}>Geography / Market</label>
                <input value={geography} onChange={e => setGeography(e.target.value)}
                  placeholder="e.g. Iraq, Baghdad, KRG, MENA"
                  className="w-full px-3 py-2.5 rounded-lg text-sm"
                  style={{ background: "hsl(216 45% 12%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }} />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "hsl(215 25% 45%)" }}>Additional Context</label>
                <textarea value={context} onChange={e => setContext(e.target.value)}
                  placeholder="Investment size, timeline, specific requirements, target audience..."
                  rows={3} className="w-full px-3 py-2.5 rounded-lg text-sm resize-none"
                  style={{ background: "hsl(216 45% 12%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }} />
              </div>
            </div>
            <button onClick={handleGenerate} disabled={loading || !subject.trim()}
              className="w-full py-3 rounded-lg text-sm font-semibold disabled:opacity-50 inline-flex items-center justify-center gap-2"
              style={{ background: rt.color, color: "hsl(216 58% 6%)" }}>
              {loading ? <><RefreshCw className="h-4 w-4 animate-spin" />Generating Report...</> : <><FileText className="h-4 w-4" />Generate {rt.label}</>}
            </button>
          </div>

          {error && <ErrorBanner msg={error} />}

          {loading && (
            <div className="rounded-xl p-10 text-center" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-3" style={{ color: rt.color }} />
              <p className="font-medium" style={{ color: "hsl(210 40% 75%)" }}>Generating {rt.label}...</p>
              <p className="text-xs mt-1" style={{ color: "hsl(215 25% 45%)" }}>Building all {rt.sections.length} sections with consulting-grade analysis</p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <CheckCircle2 className="h-4 w-4" style={{ color: rt.color }} />
                <span className="text-sm font-semibold" style={{ color: rt.color }}>
                  {result.reportTitle || rt.label} — Generated
                </span>
              </div>
              {Object.entries(result).filter(([k]) => k !== "reportTitle").map(([section, data]) => (
                <ReportSection
                  key={section}
                  title={section.replace(/([A-Z])/g, ' $1').replace(/\b\w/g, c => c.toUpperCase()).trim()}
                  data={data}
                  color={rt.color}
                />
              ))}
            </div>
          )}

          {!result && !loading && !error && (
            <div className="rounded-xl p-10 text-center" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" style={{ color: rt.color }} />
              <p className="font-medium" style={{ color: "hsl(215 25% 50%)" }}>Select report type and enter subject to generate</p>
              <p className="text-sm mt-1" style={{ color: "hsl(215 25% 38%)" }}>Professional consulting-grade reports in seconds</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
