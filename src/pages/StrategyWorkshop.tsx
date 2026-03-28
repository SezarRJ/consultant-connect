import { useState } from "react";
import {
  Target, RefreshCw, ChevronRight, BarChart2, Grid,
  TrendingUp, Shield, Zap, Globe, Copy, CheckCircle2, Sparkles, Info
} from "lucide-react";
import { useClaudeAnalysis } from "@/hooks/useClaudeAnalysis";
import { toast } from "sonner";

// ── Frameworks ────────────────────────────────────────────────────────────────
const FRAMEWORKS = [
  {
    id: "swot", name: "SWOT Analysis", icon: Grid, color: "hsl(217 91% 70%)",
    desc: "Internal Strengths & Weaknesses + External Opportunities & Threats",
    prompt: `Run a thorough SWOT analysis. Respond ONLY with valid JSON:
{ "strengths": [{"point":"string","detail":"string"}], "weaknesses": [{"point":"string","detail":"string"}], "opportunities": [{"point":"string","detail":"string"}], "threats": [{"point":"string","detail":"string"}], "strategicImplications": "string", "priorityActions": ["string"] }`
  },
  {
    id: "porter", name: "Porter's Five Forces", icon: Shield, color: "hsl(0 72% 68%)",
    desc: "Industry attractiveness via competitive rivalry, buyers, suppliers, substitutes & new entrants",
    prompt: `Conduct a Porter's Five Forces analysis. Respond ONLY with valid JSON:
{ "overallAttractiveness": "High|Medium|Low", "competitiveRivalry": {"level":"High|Medium|Low","score":0,"description":"string","keyFactors":["string"]}, "buyerPower": {"level":"High|Medium|Low","score":0,"description":"string","keyFactors":["string"]}, "supplierPower": {"level":"High|Medium|Low","score":0,"description":"string","keyFactors":["string"]}, "threatOfSubstitutes": {"level":"High|Medium|Low","score":0,"description":"string","keyFactors":["string"]}, "threatOfNewEntrants": {"level":"High|Medium|Low","score":0,"description":"string","keyFactors":["string"]}, "strategicConclusion": "string", "recommendations": ["string"] }`
  },
  {
    id: "bcg", name: "BCG Matrix", icon: Grid, color: "hsl(38 95% 60%)",
    desc: "Portfolio analysis: Stars, Cash Cows, Question Marks, Dogs",
    prompt: `Conduct a BCG Matrix analysis for the product/business units described. Respond ONLY with valid JSON:
{ "portfolioSummary": "string", "stars": [{"name":"string","rationale":"string","action":"string"}], "cashCows": [{"name":"string","rationale":"string","action":"string"}], "questionMarks": [{"name":"string","rationale":"string","action":"string"}], "dogs": [{"name":"string","rationale":"string","action":"string"}], "investmentPriority": ["string"], "strategicRecommendation": "string" }`
  },
  {
    id: "ansoff", name: "Ansoff Matrix", icon: TrendingUp, color: "hsl(158 64% 55%)",
    desc: "Growth strategy: Market Penetration, Development, Product Development, Diversification",
    prompt: `Conduct an Ansoff Matrix growth strategy analysis. Respond ONLY with valid JSON:
{ "currentPosition": "string", "marketPenetration": {"riskLevel":"Low|Medium|High","potential":"string","tactics":["string"]}, "marketDevelopment": {"riskLevel":"Low|Medium|High","potential":"string","tactics":["string"]}, "productDevelopment": {"riskLevel":"Low|Medium|High","potential":"string","tactics":["string"]}, "diversification": {"riskLevel":"Low|Medium|High","potential":"string","tactics":["string"]}, "recommendedPath": "string", "rationale": "string", "nextSteps": ["string"] }`
  },
  {
    id: "vrio", name: "VRIO Framework", icon: Zap, color: "hsl(280 80% 70%)",
    desc: "Resource-based view: Value, Rarity, Imitability, Organization",
    prompt: `Conduct a VRIO analysis to identify sustainable competitive advantages. Respond ONLY with valid JSON:
{ "resourcesAnalyzed": [{"resource":"string","valuable":true,"rare":true,"inimitable":true,"organized":true,"competitiveImplication":"Sustained Advantage|Temporary Advantage|Competitive Parity|Competitive Disadvantage","notes":"string"}], "sustainableAdvantages": ["string"], "vulnerabilities": ["string"], "strategicRecommendations": ["string"], "overallCompetitivePosition": "string" }`
  },
  {
    id: "pestle", name: "PESTLE Analysis", icon: Globe, color: "hsl(38 95% 60%)",
    desc: "Macro-environment: Political, Economic, Social, Technological, Legal, Environmental",
    prompt: `Conduct a PESTLE analysis focused on MENA/Iraq market context. Respond ONLY with valid JSON:
{ "political": {"impact":"High|Medium|Low","factors":["string"],"implications":"string"}, "economic": {"impact":"High|Medium|Low","factors":["string"],"implications":"string"}, "social": {"impact":"High|Medium|Low","factors":["string"],"implications":"string"}, "technological": {"impact":"High|Medium|Low","factors":["string"],"implications":"string"}, "legal": {"impact":"High|Medium|Low","factors":["string"],"implications":"string"}, "environmental": {"impact":"High|Medium|Low","factors":["string"],"implications":"string"}, "keyRisks": ["string"], "keyOpportunities": ["string"], "overallImpact": "Favorable|Mixed|Challenging" }`
  },
];

const INDUSTRIES = ["FMCG", "Food & Beverage", "Real Estate", "Manufacturing", "Healthcare", "Retail", "Energy", "Technology", "Telecom", "Logistics"];
const MARKETS = ["Iraq (National)", "Iraq (Baghdad)", "Iraq (KRG)", "Iraq (Basra)", "GCC Region", "UAE", "Saudi Arabia", "Jordan", "MENA Region"];

const ImpactBadge = ({ level }: { level: string }) => {
  const c = level === "High" ? "hsl(0 72% 68%)" : level === "Medium" ? "hsl(38 95% 60%)" : "hsl(158 64% 55%)";
  return (
    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
      style={{ background: `${c}20`, color: c, border: `1px solid ${c}30` }}>{level}</span>
  );
};

const ScoreBar = ({ score, color }: { score: number; color: string }) => (
  <div className="flex items-center gap-2">
    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "hsl(216 45% 20%)" }}>
      <div className="h-full rounded-full" style={{ width: `${score * 10}%`, background: color }} />
    </div>
    <span className="text-[10px] font-bold w-4" style={{ color }}>{score}</span>
  </div>
);

export default function StrategyWorkshop() {
  const [selectedFw, setSelectedFw] = useState(FRAMEWORKS[0]);
  const [form, setForm] = useState({
    company: "", industry: "FMCG", market: "Iraq (National)",
    description: "", objective: ""
  });
  const [copied, setCopied] = useState(false);

  const { result, loading, error, analyze, responseTime, tokensUsed } = useClaudeAnalysis({
    systemPrompt: `You are a McKinsey/BCG senior strategy consultant with deep MENA expertise. ${selectedFw.prompt}`,
    agentId: "strategy-workshop", modelTier: "flash"
  });

  const IS = { background: "hsl(216 45% 12%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" };

  const run = () => {
    if (!form.company || !form.description) { toast.error("Company name and description are required"); return; }
    const prompt = `Apply the ${selectedFw.name} framework to the following:\n\nCompany: ${form.company}\nIndustry: ${form.industry}\nTarget Market: ${form.market}\nBusiness Description: ${form.description}\nStrategic Objective: ${form.objective || "Improve competitive position and drive profitable growth"}`;
    analyze(prompt);
  };

  const copy = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true); setTimeout(() => setCopied(false), 2000);
    toast.success("Analysis copied!");
  };

  const r = result;

  // ── Renderers per framework ─────────────────────────────────────────────────
  const renderSWOT = () => r && (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {[
          { key: "strengths",    label: "Strengths",    color: "hsl(158 64% 55%)" },
          { key: "weaknesses",   label: "Weaknesses",   color: "hsl(0 72% 68%)"   },
          { key: "opportunities",label: "Opportunities",color: "hsl(217 91% 70%)" },
          { key: "threats",      label: "Threats",      color: "hsl(38 95% 60%)"  },
        ].map(({ key, label, color }) => (
          <div key={key} className="rounded-xl p-4" style={{ background: `${color}0D`, border: `1px solid ${color}30` }}>
            <p className="text-xs font-bold mb-2" style={{ color }}>{label}</p>
            <div className="space-y-2">
              {(r[key] || []).map((item: any, i: number) => (
                <div key={i}>
                  <p className="text-xs font-semibold" style={{ color: "hsl(210 40% 85%)" }}>{item.point}</p>
                  <p className="text-[10px]" style={{ color: "hsl(215 25% 55%)" }}>{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {r.strategicImplications && (
        <div className="rounded-xl p-4" style={{ background: "hsl(216 45% 12%)" }}>
          <p className="text-xs font-semibold mb-1" style={{ color: "hsl(38 95% 60%)" }}>Strategic Implications</p>
          <p className="text-sm" style={{ color: "hsl(215 25% 68%)" }}>{r.strategicImplications}</p>
        </div>
      )}
    </div>
  );

  const renderPorter = () => r && (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold" style={{ color: "hsl(210 40% 88%)" }}>Industry Attractiveness</p>
        <ImpactBadge level={r.overallAttractiveness || "Medium"} />
      </div>
      {["competitiveRivalry", "buyerPower", "supplierPower", "threatOfSubstitutes", "threatOfNewEntrants"].map(key => {
        const force = r[key]; if (!force) return null;
        const labels: Record<string, string> = {
          competitiveRivalry: "Competitive Rivalry", buyerPower: "Buyer Power",
          supplierPower: "Supplier Power", threatOfSubstitutes: "Threat of Substitutes",
          threatOfNewEntrants: "Threat of New Entrants"
        };
        const color = force.level === "High" ? "hsl(0 72% 68%)" : force.level === "Medium" ? "hsl(38 95% 60%)" : "hsl(158 64% 55%)";
        return (
          <div key={key} className="rounded-xl p-4" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold" style={{ color: "hsl(210 40% 85%)" }}>{labels[key]}</p>
              <ImpactBadge level={force.level} />
            </div>
            <ScoreBar score={force.score || 5} color={color} />
            <p className="text-[11px] mt-2" style={{ color: "hsl(215 25% 60%)" }}>{force.description}</p>
          </div>
        );
      })}
      {r.strategicConclusion && (
        <div className="rounded-xl p-4" style={{ background: "hsl(216 45% 12%)" }}>
          <p className="text-xs font-semibold mb-1" style={{ color: "hsl(38 95% 60%)" }}>Strategic Conclusion</p>
          <p className="text-sm" style={{ color: "hsl(215 25% 68%)" }}>{r.strategicConclusion}</p>
        </div>
      )}
    </div>
  );

  const renderGeneric = () => r && (
    <div className="rounded-xl p-5" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
      <pre className="text-xs overflow-auto" style={{ color: "hsl(215 25% 65%)", whiteSpace: "pre-wrap" }}>
        {JSON.stringify(r, null, 2)}
      </pre>
    </div>
  );

  const renderResult = () => {
    if (selectedFw.id === "swot")   return renderSWOT();
    if (selectedFw.id === "porter") return renderPorter();
    return renderGeneric();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display" style={{ color: "hsl(210 40% 94%)" }}>Strategy Workshop</h1>
          <p className="text-sm mt-1" style={{ color: "hsl(215 25% 55%)" }}>
            Apply world-class strategic frameworks powered by AI — SWOT, Porter's, BCG, Ansoff, VRIO, PESTLE
          </p>
        </div>
        {r && (
          <button onClick={copy}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
            style={{ background: "hsl(216 45% 18%)", color: "hsl(210 40% 80%)", border: "1px solid hsl(var(--border))" }}>
            {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied!" : "Copy Analysis"}
          </button>
        )}
      </div>

      {/* Framework Selector */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {FRAMEWORKS.map(fw => {
          const active = selectedFw.id === fw.id;
          return (
            <button key={fw.id} onClick={() => setSelectedFw(fw)}
              className="rounded-xl p-3 text-left transition-all"
              style={{
                background: active ? `${fw.color}15` : "hsl(var(--card))",
                border: `1px solid ${active ? fw.color + "50" : "hsl(var(--border))"}`,
              }}>
              <fw.icon className="h-5 w-5 mb-2" style={{ color: active ? fw.color : "hsl(215 25% 45%)" }} />
              <p className="text-xs font-bold" style={{ color: active ? fw.color : "hsl(210 40% 75%)" }}>{fw.name}</p>
            </button>
          );
        })}
      </div>

      {/* Selected Framework Info */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl"
        style={{ background: `${selectedFw.color}10`, border: `1px solid ${selectedFw.color}30` }}>
        <Info className="h-4 w-4 mt-0.5 shrink-0" style={{ color: selectedFw.color }} />
        <p className="text-xs" style={{ color: "hsl(215 25% 68%)" }}>{selectedFw.desc}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Input Form */}
        <div className="rounded-xl p-5 space-y-4" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: selectedFw.color }}>
            {selectedFw.name} — Inputs
          </p>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] mb-1 block" style={{ color: "hsl(215 25% 50%)" }}>Company / Product Name *</label>
              <input value={form.company} onChange={e => setForm(v => ({ ...v, company: e.target.value }))}
                placeholder="e.g. Al Manar Foods" className="w-full px-3 py-2 rounded-lg text-sm" style={IS} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] mb-1 block" style={{ color: "hsl(215 25% 50%)" }}>Industry</label>
                <select value={form.industry} onChange={e => setForm(v => ({ ...v, industry: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-sm" style={IS}>
                  {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] mb-1 block" style={{ color: "hsl(215 25% 50%)" }}>Market</label>
                <select value={form.market} onChange={e => setForm(v => ({ ...v, market: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-sm" style={IS}>
                  {MARKETS.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-[10px] mb-1 block" style={{ color: "hsl(215 25% 50%)" }}>Business Description *</label>
              <textarea value={form.description} onChange={e => setForm(v => ({ ...v, description: e.target.value }))}
                rows={4} placeholder="Describe the business, product/service, and current situation..."
                className="w-full px-3 py-2 rounded-lg text-sm resize-none" style={IS} />
            </div>
            <div>
              <label className="text-[10px] mb-1 block" style={{ color: "hsl(215 25% 50%)" }}>Strategic Objective</label>
              <input value={form.objective} onChange={e => setForm(v => ({ ...v, objective: e.target.value }))}
                placeholder="What decision does this analysis support?"
                className="w-full px-3 py-2 rounded-lg text-sm" style={IS} />
            </div>
          </div>
          <button onClick={run} disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold"
            style={{ background: selectedFw.color, color: "hsl(216 58% 6%)", opacity: loading ? 0.7 : 1 }}>
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? `Running ${selectedFw.name}...` : `Run ${selectedFw.name}`}
          </button>
          {error && <p className="text-xs text-center" style={{ color: "hsl(0 72% 68%)" }}>{error}</p>}
          {r && <p className="text-[10px] text-center" style={{ color: "hsl(215 25% 40%)" }}>
            {(responseTime / 1000).toFixed(1)}s · {tokensUsed} tokens
          </p>}
        </div>

        {/* Result */}
        <div className="lg:col-span-2">
          {!r && !loading && (
            <div className="flex flex-col items-center justify-center h-64 rounded-xl"
              style={{ background: "hsl(var(--card))", border: "1px dashed hsl(var(--border))" }}>
              <Target className="h-10 w-10 mb-3" style={{ color: "hsl(215 25% 35%)" }} />
              <p className="text-sm font-semibold" style={{ color: "hsl(215 25% 45%)" }}>Select a framework and run analysis</p>
              <p className="text-xs mt-1" style={{ color: "hsl(215 25% 35%)" }}>AI-powered strategic analysis will appear here</p>
            </div>
          )}
          {loading && (
            <div className="flex flex-col items-center justify-center h-64 rounded-xl"
              style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
              <RefreshCw className="h-8 w-8 animate-spin mb-3" style={{ color: selectedFw.color }} />
              <p className="text-sm" style={{ color: "hsl(215 25% 55%)" }}>Applying {selectedFw.name}...</p>
            </div>
          )}
          {r && !loading && renderResult()}
        </div>
      </div>
    </div>
  );
}
