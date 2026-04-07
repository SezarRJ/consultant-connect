import { useState } from "react";
import { Bot, TrendingUp, Users, BarChart2, DollarSign, ShieldAlert, Handshake, Zap, PackageCheck, FileBarChart2, Play, CheckCircle2, Clock, Cpu, Activity, RefreshCw } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useClaudeAnalysis } from "@/hooks/useClaudeAnalysis";
import { Link } from "react-router-dom";

const AGENTS = [
  { id: "market-entry",  name: "Market Entry Agent",    icon: TrendingUp,    url: "/analysis",        color: "amber", model: "claude-sonnet-4-20250514",
    task: "Analyzes market conditions, demand, pricing and entry strategy for new markets.",
    specialization: "Market sizing, demand forecasting, competitive landscapes, entry barriers",
    accuracy: 94, runs: 847, avgTime: "22s" },
  { id: "distributor",   name: "Distributor Agent",      icon: Users,         url: "/analysis",  color: "green", model: "claude-sonnet-4-20250514",
    task: "Finds and vets distributors, wholesalers and logistics partners globally.",
    specialization: "Channel mapping, partner vetting, wholesale networks, regional coverage",
    accuracy: 91, runs: 623, avgTime: "18s" },
  { id: "competitor",    name: "Competitor Agent",        icon: BarChart2,     url: "/analysis", color: "blue",  model: "claude-sonnet-4-20250514",
    task: "Maps competitive landscape including brands, pricing and distribution strength.",
    specialization: "Competitor mapping, SWOT analysis, price benchmarking, market share",
    accuracy: 92, runs: 751, avgTime: "25s" },
  { id: "pricing",       name: "Pricing Agent",           icon: DollarSign,    url: "/analysis",color: "amber", model: "claude-sonnet-4-20250514",
    task: "Benchmarks wholesale, retail, and margin structures across market channels.",
    specialization: "Price modeling, margin analysis, channel economics, price positioning",
    accuracy: 96, runs: 912, avgTime: "15s" },
  { id: "risk",          name: "Risk Assessment Agent",   icon: ShieldAlert,   url: "/analysis",     color: "red",   model: "claude-sonnet-4-20250514",
    task: "Assesses payment, logistics, legal and regulatory risks with mitigation plans.",
    specialization: "Risk scoring, regulatory compliance, payment terms, contingency planning",
    accuracy: 93, runs: 689, avgTime: "20s" },
  { id: "partner",       name: "Partner Matchmaking Agent",icon: Handshake,    url: "/strategy", color: "green", model: "claude-sonnet-4-20250514",
    task: "Matches businesses with verified partners, agents and distributors.",
    specialization: "Partner profiling, compatibility scoring, due diligence criteria",
    accuracy: 89, runs: 445, avgTime: "28s" },
  { id: "sales",         name: "Sales Strategy Agent",    icon: Zap,           url: "/strategy",      color: "blue",  model: "claude-sonnet-4-20250514",
    task: "Designs channel strategies across retail, wholesale and e-commerce.",
    specialization: "Channel prioritization, GTM planning, sales force structure, KPIs",
    accuracy: 90, runs: 567, avgTime: "24s" },
  { id: "export",        name: "Export Readiness Agent",  icon: PackageCheck,  url: "/analysis",    color: "amber", model: "claude-sonnet-4-20250514",
    task: "Reviews packaging, labeling compliance, and export documentation needs.",
    specialization: "Export regulations, labeling requirements, logistics optimization",
    accuracy: 95, runs: 734, avgTime: "19s" },
  { id: "feasibility",   name: "Feasibility Study Agent", icon: FileBarChart2, url: "/analysis",   color: "green", model: "claude-sonnet-4-20250514",
    task: "Produces full financial feasibility studies with ROI and go/no-go recommendation.",
    specialization: "Financial modeling, NPV/IRR, scenario analysis, investment appraisal",
    accuracy: 91, runs: 312, avgTime: "35s" },
];

const colorMap: Record<string, { text: string; bg: string; border: string; pill: string }> = {
  amber: { text: "hsl(38 95% 60%)",   bg: "hsl(38 95% 52% / 0.08)",  border: "hsl(38 95% 52% / 0.3)",  pill: "data-pill-amber" },
  green: { text: "hsl(158 64% 55%)",  bg: "hsl(158 64% 40% / 0.08)", border: "hsl(158 64% 40% / 0.3)", pill: "data-pill-green" },
  blue:  { text: "hsl(217 91% 70%)",  bg: "hsl(217 91% 53% / 0.08)", border: "hsl(217 91% 53% / 0.3)", pill: "data-pill-blue" },
  red:   { text: "hsl(0 72% 68%)",    bg: "hsl(0 72% 51% / 0.08)",   border: "hsl(0 72% 51% / 0.3)",   pill: "data-pill-red" },
};

function AgentTestPanel({ agent }: { agent: typeof AGENTS[0] }) {
  const [prompt, setPrompt] = useState("");
  const { result, loading, error, analyze, rawText } = useClaudeAnalysis({
    systemPrompt: `You are the ${agent.name} for a consultancy platform. Specialization: ${agent.specialization}. Respond with structured JSON analysis.`,
    agentId: agent.id,
    modelTier: "flash-lite",
  });

  const run = () => { if (prompt.trim()) analyze(prompt); };
  const c = colorMap[agent.color];

  return (
    <div className="mt-4 rounded-xl p-4 space-y-3" style={{ background: "hsl(216 52% 8%)", border: `1px solid ${c.border}` }}>
      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: c.text }}>Live Agent Test</p>
      <textarea
        rows={2}
        className="w-full rounded-lg px-3 py-2 text-sm resize-none"
        style={{ background: "hsl(216 45% 12%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }}
        placeholder={`Ask the ${agent.name} anything...`}
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
      />
      <button onClick={run} disabled={loading || !prompt.trim()}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold disabled:opacity-50 transition-all"
        style={{ background: loading ? "hsl(216 45% 18%)" : c.bg, color: c.text, border: `1px solid ${c.border}` }}>
        {loading ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />}
        {loading ? "Agent Running..." : "Run Agent"}
      </button>
      {error && <p className="text-xs" style={{ color: "hsl(0 72% 68%)" }}>⚠ {error}</p>}
      {(result || rawText) && !loading && (
        <div className="rounded-lg p-3 text-xs font-mono overflow-auto max-h-40"
          style={{ background: "hsl(216 45% 10%)", color: "hsl(210 40% 75%)", border: "1px solid hsl(var(--border))" }}>
          <pre className="whitespace-pre-wrap">{JSON.stringify(result, null, 2) || rawText}</pre>
        </div>
      )}
    </div>
  );
}

export default function Agents() {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState<string | null>(null);
  const totalRuns = AGENTS.reduce((s, a) => s + a.runs, 0);
  const avgAcc = Math.round(AGENTS.reduce((s, a) => s + a.accuracy, 0) / AGENTS.length);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bot className="h-5 w-5" style={{ color: "hsl(38 95% 52%)" }} />
            <h1 className="text-xl font-bold font-display" style={{ color: "hsl(210 40% 92%)" }}>{t.agents_title}</h1>
          </div>
          <p className="text-sm" style={{ color: "hsl(215 25% 55%)" }}>{t.agents_subtitle}</p>
        </div>
        <div className="flex gap-3">
          {[
            { label: "Total Agents", value: AGENTS.length.toString() },
            { label: "Total Runs", value: totalRuns.toLocaleString() },
            { label: "Avg Accuracy", value: `${avgAcc}%` },
          ].map(stat => (
            <div key={stat.label} className="rounded-lg px-4 py-2 text-center"
              style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
              <p className="text-lg font-bold font-display" style={{ color: "hsl(38 95% 60%)" }}>{stat.value}</p>
              <p className="text-[10px] uppercase tracking-wider" style={{ color: "hsl(215 25% 50%)" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Agent cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {AGENTS.map((agent, i) => {
          const c = colorMap[agent.color];
          const isExpanded = expanded === agent.id;
          return (
            <div key={agent.id} className="rounded-xl p-5 flex flex-col gap-4 transition-all"
              style={{ background: "hsl(var(--card))", border: `1px solid ${isExpanded ? c.border : "hsl(var(--border))"}` }}>
              {/* Header */}
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: c.bg }}>
                  <agent.icon className="h-5 w-5" style={{ color: c.text }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-bold font-mono-data" style={{ color: c.text }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-sm font-bold font-display truncate" style={{ color: "hsl(210 40% 90%)" }}>{agent.name}</h3>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "hsl(215 25% 58%)" }}>{agent.task}</p>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Accuracy", value: `${agent.accuracy}%`, icon: CheckCircle2 },
                  { label: "Runs",     value: agent.runs.toLocaleString(), icon: Activity },
                  { label: "Avg Time", value: agent.avgTime, icon: Clock },
                ].map(m => (
                  <div key={m.label} className="rounded-lg p-2 text-center"
                    style={{ background: "hsl(216 45% 14%)" }}>
                    <p className="text-sm font-bold font-mono-data" style={{ color: c.text }}>{m.value}</p>
                    <p className="text-[10px]" style={{ color: "hsl(215 25% 48%)" }}>{m.label}</p>
                  </div>
                ))}
              </div>

              {/* Accuracy bar */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[10px]" style={{ color: "hsl(215 25% 50%)" }}>Agent accuracy</span>
                  <span className="text-[10px] font-bold" style={{ color: c.text }}>{agent.accuracy}%</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: "hsl(216 45% 18%)" }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${agent.accuracy}%`, background: c.text }} />
                </div>
              </div>

              {/* Specialization */}
              <div className="rounded-lg p-2.5" style={{ background: "hsl(216 45% 12%)" }}>
                <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "hsl(215 25% 45%)" }}>Specialization</p>
                <p className="text-xs" style={{ color: "hsl(215 25% 65%)" }}>{agent.specialization}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Link to={agent.url} className="flex-1 text-center py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
                  style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
                  Open Service
                </Link>
                <button onClick={() => setExpanded(isExpanded ? null : agent.id)}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
                  style={{ background: "hsl(216 45% 18%)", color: "hsl(210 40% 75%)", border: "1px solid hsl(var(--border))" }}>
                  {isExpanded ? "Close Test" : "Test Agent"}
                </button>
              </div>

              {/* Expandable test panel */}
              {isExpanded && <AgentTestPanel agent={agent} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
