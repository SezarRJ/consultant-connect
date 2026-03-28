import { useState } from "react";
import {
  Briefcase, Sparkles, RefreshCw, Copy, CheckCircle2, Target,
  Globe, DollarSign, Users, AlertTriangle, Layers, ArrowRight,
  Building2, TrendingUp, FileText, Calendar, Clock
} from "lucide-react";
import { useClaudeAnalysis } from "@/hooks/useClaudeAnalysis";
import { toast } from "sonner";

const SYSTEM_PROMPT = `You are a senior management consultant conducting a structured client intake. Based on the provided information, generate a comprehensive client briefing document. Respond ONLY with valid JSON:
{
  "executiveSummary": "string — 4 sentences capturing the core ask, context, and urgency",
  "clientProfile": {
    "businessDescription": "string",
    "marketPosition": "Leader|Challenger|Follower|Niche Player",
    "maturityStage": "Startup|Growth|Mature|Turnaround",
    "keyStrengths": ["string"],
    "keyWeaknesses": ["string"]
  },
  "engagementScope": {
    "primaryObjective": "string",
    "secondaryObjectives": ["string"],
    "outOfScope": ["string"],
    "criticalSuccessFactors": ["string"]
  },
  "stakeholders": [
    { "role": "string", "influence": "High|Medium|Low", "stance": "Champion|Neutral|Skeptic", "engagement": "string" }
  ],
  "marketContext": {
    "industry": "string",
    "marketDynamic": "string",
    "competitivePressure": "High|Medium|Low",
    "keyTrends": ["string"]
  },
  "deliverables": [
    { "name": "string", "format": "string", "timeline": "string", "owner": "string" }
  ],
  "timeline": {
    "totalDuration": "string",
    "kickoffDate": "string",
    "keyDates": [{ "event": "string", "date": "string" }]
  },
  "budget": {
    "range": "string",
    "paymentStructure": "string",
    "contingencyNote": "string"
  },
  "risks": [
    { "risk": "string", "likelihood": "High|Medium|Low", "impact": "High|Medium|Low", "mitigation": "string" }
  ],
  "recommendedApproach": "string — 3-4 sentences on the consulting methodology",
  "nextSteps": ["string"],
  "questionsForClient": ["string — 5 clarifying questions to ask in kickoff"]
}`;

const INDUSTRIES = ["FMCG", "Food & Beverage", "Real Estate", "Manufacturing", "Healthcare", "Technology",
  "Retail", "Energy", "Telecom", "Logistics", "Finance", "Agriculture", "Construction", "Education"];
const SERVICE_TYPES = ["Market Entry", "Feasibility Study", "Distribution Strategy", "Sales RTM Design",
  "ISO Certification", "Company Development", "Competitor Analysis", "Risk Assessment", "Partner Matchmaking",
  "Business Turnaround", "Export Strategy", "Brand Strategy", "Financial Advisory"];
const MARKETS = ["Iraq (Baghdad)", "Iraq (KRG/Erbil)", "Iraq (Basra)", "Iraq (National)", "UAE", "Saudi Arabia",
  "Jordan", "Kuwait", "Qatar", "Bahrain", "Egypt", "MENA Region", "GCC Region"];
const BUDGETS = ["< $10,000", "$10K – $25K", "$25K – $50K", "$50K – $100K", "$100K – $250K", "> $250K", "To be discussed"];
const DURATIONS = ["2 weeks", "4 weeks", 6 + " weeks", "2 months", "3 months", "6 months", "12 months", "Ongoing"];
const URGENCIES = ["Immediate (< 2 weeks)", "Urgent (2–4 weeks)", "Standard (1–2 months)", "Flexible (> 2 months)"];

const Section = ({ title, icon: Icon, children, color = "hsl(38 95% 52%)" }: any) => (
  <div className="rounded-2xl overflow-hidden" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
    <div className="px-5 py-3.5 flex items-center gap-2" style={{ background: "hsl(216 45% 11%)", borderBottom: "1px solid hsl(var(--border))" }}>
      <Icon className="h-4 w-4" style={{ color }} />
      <h3 className="text-sm font-bold" style={{ color: "hsl(210 40% 92%)" }}>{title}</h3>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const Pill = ({ v, color = "hsl(38 95% 60%)" }: { v: string; color?: string }) => (
  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold inline-block"
    style={{ background: `${color}20`, color, border: `1px solid ${color}30` }}>{v}</span>
);

const RiskBadge = ({ level }: { level: string }) => {
  const c = level === "High" ? "hsl(0 72% 68%)" : level === "Medium" ? "hsl(38 95% 60%)" : "hsl(158 64% 55%)";
  return <Pill v={level} color={c} />;
};

export default function ClientBriefing() {
  const [form, setForm] = useState({
    clientName: "", clientContact: "", industry: "FMCG", market: "Iraq (Baghdad)",
    serviceType: "Market Entry", budget: "$25K – $50K", duration: "4 weeks",
    urgency: "Standard (1–2 months)", businessDescription: "",
    primaryChallenge: "", desiredOutcome: "", additionalContext: ""
  });
  const [copied, setCopied] = useState(false);

  const { result, loading, error, analyze, tokensUsed, responseTime } = useClaudeAnalysis({
    systemPrompt: SYSTEM_PROMPT, agentId: "client-brief", modelTier: "flash"
  });

  const IS = { background: "hsl(216 45% 12%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" };

  const f = (k: keyof typeof form) => (e: any) => setForm(v => ({ ...v, [k]: e.target.value }));

  const generate = () => {
    if (!form.clientName || !form.primaryChallenge) {
      toast.error("Client name and primary challenge are required");
      return;
    }
    const prompt = `Generate a structured client briefing for:\n\nClient: ${form.clientName}\nContact: ${form.clientContact}\nIndustry: ${form.industry}\nTarget Market: ${form.market}\nService Required: ${form.serviceType}\nBudget: ${form.budget}\nTimeline: ${form.duration} (Urgency: ${form.urgency})\n\nBusiness Description: ${form.businessDescription || "Not provided"}\n\nPrimary Challenge: ${form.primaryChallenge}\n\nDesired Outcome: ${form.desiredOutcome || "Not specified"}\n\nAdditional Context: ${form.additionalContext || "None"}`;
    analyze(prompt);
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true); setTimeout(() => setCopied(false), 2000);
    toast.success("Brief copied to clipboard!");
  };

  const r = result;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display" style={{ color: "hsl(210 40% 94%)" }}>Client Briefing Generator</h1>
          <p className="text-sm mt-1" style={{ color: "hsl(215 25% 55%)" }}>
            Structured AI-powered intake — turn a client conversation into a full engagement brief
          </p>
        </div>
        {r && (
          <button onClick={handleCopy}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
            style={{ background: "hsl(216 45% 18%)", color: "hsl(210 40% 80%)", border: "1px solid hsl(var(--border))" }}>
            {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied!" : "Copy Brief"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Intake Form */}
        <div className="space-y-4">
          <div className="rounded-xl p-5 space-y-4" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "hsl(38 95% 52%)" }}>
              Client Information
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] mb-1 block" style={{ color: "hsl(215 25% 50%)" }}>Client / Company Name *</label>
                <input value={form.clientName} onChange={f("clientName")} placeholder="e.g. Hikma Pharmaceuticals"
                  className="w-full px-3 py-2 rounded-lg text-sm" style={IS} />
              </div>
              <div>
                <label className="text-[10px] mb-1 block" style={{ color: "hsl(215 25% 50%)" }}>Primary Contact</label>
                <input value={form.clientContact} onChange={f("clientContact")} placeholder="Name & Title"
                  className="w-full px-3 py-2 rounded-lg text-sm" style={IS} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] mb-1 block" style={{ color: "hsl(215 25% 50%)" }}>Industry</label>
                  <select value={form.industry} onChange={f("industry")} className="w-full px-3 py-2 rounded-lg text-sm" style={IS}>
                    {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] mb-1 block" style={{ color: "hsl(215 25% 50%)" }}>Target Market</label>
                  <select value={form.market} onChange={f("market")} className="w-full px-3 py-2 rounded-lg text-sm" style={IS}>
                    {MARKETS.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl p-5 space-y-4" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "hsl(38 95% 52%)" }}>
              Engagement Parameters
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] mb-1 block" style={{ color: "hsl(215 25% 50%)" }}>Service Type</label>
                <select value={form.serviceType} onChange={f("serviceType")} className="w-full px-3 py-2 rounded-lg text-sm" style={IS}>
                  {SERVICE_TYPES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] mb-1 block" style={{ color: "hsl(215 25% 50%)" }}>Budget Range</label>
                  <select value={form.budget} onChange={f("budget")} className="w-full px-3 py-2 rounded-lg text-sm" style={IS}>
                    {BUDGETS.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] mb-1 block" style={{ color: "hsl(215 25% 50%)" }}>Duration</label>
                  <select value={form.duration} onChange={f("duration")} className="w-full px-3 py-2 rounded-lg text-sm" style={IS}>
                    {DURATIONS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] mb-1 block" style={{ color: "hsl(215 25% 50%)" }}>Urgency</label>
                <select value={form.urgency} onChange={f("urgency")} className="w-full px-3 py-2 rounded-lg text-sm" style={IS}>
                  {URGENCIES.map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-xl p-5 space-y-4" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "hsl(38 95% 52%)" }}>
              Client Context
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] mb-1 block" style={{ color: "hsl(215 25% 50%)" }}>Business Description</label>
                <textarea value={form.businessDescription} onChange={f("businessDescription")} rows={2}
                  placeholder="What does the client do? Size, structure, history..."
                  className="w-full px-3 py-2 rounded-lg text-sm resize-none" style={IS} />
              </div>
              <div>
                <label className="text-[10px] mb-1 block" style={{ color: "hsl(215 25% 50%)" }}>Primary Challenge *</label>
                <textarea value={form.primaryChallenge} onChange={f("primaryChallenge")} rows={3}
                  placeholder="What problem are they trying to solve? What keeps them up at night?"
                  className="w-full px-3 py-2 rounded-lg text-sm resize-none" style={IS} />
              </div>
              <div>
                <label className="text-[10px] mb-1 block" style={{ color: "hsl(215 25% 50%)" }}>Desired Outcome</label>
                <textarea value={form.desiredOutcome} onChange={f("desiredOutcome")} rows={2}
                  placeholder="What does success look like for the client?"
                  className="w-full px-3 py-2 rounded-lg text-sm resize-none" style={IS} />
              </div>
              <div>
                <label className="text-[10px] mb-1 block" style={{ color: "hsl(215 25% 50%)" }}>Additional Context</label>
                <textarea value={form.additionalContext} onChange={f("additionalContext")} rows={2}
                  placeholder="Political dynamics, prior consultants, constraints, opportunities..."
                  className="w-full px-3 py-2 rounded-lg text-sm resize-none" style={IS} />
              </div>
            </div>
          </div>

          <button onClick={generate} disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all"
            style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)", opacity: loading ? 0.7 : 1 }}>
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "Generating Brief..." : "Generate Client Brief"}
          </button>

          {error && <p className="text-xs text-center" style={{ color: "hsl(0 72% 68%)" }}>{error}</p>}
          {r && (
            <p className="text-[10px] text-center" style={{ color: "hsl(215 25% 40%)" }}>
              Generated in {(responseTime / 1000).toFixed(1)}s · {tokensUsed} tokens
            </p>
          )}
        </div>

        {/* Brief Output */}
        <div className="lg:col-span-2">
          {!r && !loading && (
            <div className="flex flex-col items-center justify-center h-64 rounded-xl"
              style={{ background: "hsl(var(--card))", border: "1px dashed hsl(var(--border))" }}>
              <Briefcase className="h-10 w-10 mb-3" style={{ color: "hsl(215 25% 35%)" }} />
              <p className="text-sm font-semibold" style={{ color: "hsl(215 25% 45%)" }}>Fill in client details and generate</p>
              <p className="text-xs mt-1" style={{ color: "hsl(215 25% 35%)" }}>
                A complete engagement brief will appear here
              </p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center h-64 rounded-xl"
              style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
              <RefreshCw className="h-8 w-8 animate-spin mb-3" style={{ color: "hsl(38 95% 52%)" }} />
              <p className="text-sm" style={{ color: "hsl(215 25% 55%)" }}>Building engagement brief...</p>
            </div>
          )}

          {r && (
            <div className="space-y-4">

              {/* Executive Summary */}
              <Section title="Executive Summary" icon={FileText}>
                <p className="text-sm leading-relaxed" style={{ color: "hsl(215 25% 70%)" }}>{r.executiveSummary}</p>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {r.clientProfile?.marketPosition && <Pill v={r.clientProfile.marketPosition} color="hsl(217 91% 70%)" />}
                  {r.clientProfile?.maturityStage && <Pill v={r.clientProfile.maturityStage} color="hsl(38 95% 60%)" />}
                  {r.marketContext?.competitivePressure && <Pill v={`Competitive Pressure: ${r.marketContext.competitivePressure}`} color="hsl(0 72% 68%)" />}
                </div>
              </Section>

              {/* Scope */}
              <Section title="Engagement Scope" icon={Target} color="hsl(158 64% 55%)">
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] mb-1 font-semibold uppercase tracking-wide" style={{ color: "hsl(38 95% 52%)" }}>Primary Objective</p>
                    <p className="text-sm" style={{ color: "hsl(210 40% 85%)" }}>{r.engagementScope?.primaryObjective}</p>
                  </div>
                  {r.engagementScope?.secondaryObjectives?.length > 0 && (
                    <div>
                      <p className="text-[10px] mb-2 font-semibold uppercase tracking-wide" style={{ color: "hsl(215 25% 45%)" }}>Secondary Objectives</p>
                      <div className="space-y-1">
                        {r.engagementScope.secondaryObjectives.map((o: string, i: number) => (
                          <div key={i} className="flex items-start gap-2">
                            <ArrowRight className="h-3 w-3 mt-0.5 shrink-0" style={{ color: "hsl(158 64% 55%)" }} />
                            <p className="text-xs" style={{ color: "hsl(215 25% 65%)" }}>{o}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {r.engagementScope?.criticalSuccessFactors?.length > 0 && (
                    <div>
                      <p className="text-[10px] mb-2 font-semibold uppercase tracking-wide" style={{ color: "hsl(215 25% 45%)" }}>Critical Success Factors</p>
                      <div className="flex flex-wrap gap-1">
                        {r.engagementScope.criticalSuccessFactors.map((f: string, i: number) => (
                          <Pill key={i} v={f} color="hsl(158 64% 55%)" />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Section>

              {/* Stakeholders */}
              {r.stakeholders?.length > 0 && (
                <Section title="Stakeholder Map" icon={Users} color="hsl(217 91% 70%)">
                  <div className="space-y-2">
                    {r.stakeholders.map((s: any, i: number) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: "hsl(216 45% 11%)" }}>
                        <div className="flex-1">
                          <p className="text-xs font-semibold" style={{ color: "hsl(210 40% 88%)" }}>{s.role}</p>
                          <p className="text-[10px] mt-0.5" style={{ color: "hsl(215 25% 55%)" }}>{s.engagement}</p>
                        </div>
                        <div className="flex gap-1">
                          <Pill v={s.influence} color={s.influence === "High" ? "hsl(38 95% 60%)" : "hsl(217 91% 70%)"} />
                          <Pill v={s.stance} color={s.stance === "Champion" ? "hsl(158 64% 55%)" : s.stance === "Skeptic" ? "hsl(0 72% 68%)" : "hsl(215 25% 55%)"} />
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Deliverables & Timeline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {r.deliverables?.length > 0 && (
                  <Section title="Deliverables" icon={FileText}>
                    <div className="space-y-2">
                      {r.deliverables.map((d: any, i: number) => (
                        <div key={i} className="flex items-start justify-between gap-2 py-1.5"
                          style={{ borderBottom: "1px solid hsl(var(--border)/0.5)" }}>
                          <div>
                            <p className="text-xs font-semibold" style={{ color: "hsl(210 40% 85%)" }}>{d.name}</p>
                            <p className="text-[10px]" style={{ color: "hsl(215 25% 50%)" }}>{d.format}</p>
                          </div>
                          <span className="text-[10px] shrink-0" style={{ color: "hsl(38 95% 60%)" }}>{d.timeline}</span>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}
                {r.timeline && (
                  <Section title="Timeline" icon={Calendar} color="hsl(280 80% 70%)">
                    <p className="text-lg font-bold mb-3" style={{ color: "hsl(280 80% 70%)" }}>{r.timeline.totalDuration}</p>
                    {r.timeline.keyDates?.map((d: any, i: number) => (
                      <div key={i} className="flex items-center justify-between py-1.5"
                        style={{ borderBottom: "1px solid hsl(var(--border)/0.5)" }}>
                        <p className="text-xs" style={{ color: "hsl(215 25% 65%)" }}>{d.event}</p>
                        <p className="text-[10px] font-semibold" style={{ color: "hsl(38 95% 60%)" }}>{d.date}</p>
                      </div>
                    ))}
                  </Section>
                )}
              </div>

              {/* Risks */}
              {r.risks?.length > 0 && (
                <Section title="Risk Register" icon={AlertTriangle} color="hsl(0 72% 68%)">
                  <div className="space-y-3">
                    {r.risks.map((risk: any, i: number) => (
                      <div key={i} className="rounded-lg p-3" style={{ background: "hsl(216 45% 11%)" }}>
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-xs font-semibold" style={{ color: "hsl(210 40% 88%)" }}>{risk.risk}</p>
                          <div className="flex gap-1 shrink-0">
                            <RiskBadge level={risk.likelihood} />
                            <RiskBadge level={risk.impact} />
                          </div>
                        </div>
                        <p className="text-[10px]" style={{ color: "hsl(215 25% 55%)" }}>{risk.mitigation}</p>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Questions for Client */}
              {r.questionsForClient?.length > 0 && (
                <Section title="Kickoff Questions for Client" icon={Globe} color="hsl(158 64% 55%)">
                  <div className="space-y-2">
                    {r.questionsForClient.map((q: string, i: number) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-xs font-bold shrink-0 w-5 text-right" style={{ color: "hsl(38 95% 52%)" }}>{i + 1}.</span>
                        <p className="text-xs" style={{ color: "hsl(215 25% 68%)" }}>{q}</p>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Next Steps */}
              {r.nextSteps?.length > 0 && (
                <div className="rounded-xl p-5" style={{ background: "hsl(38 95% 52% / 0.08)", border: "1px solid hsl(38 95% 52% / 0.25)" }}>
                  <p className="text-xs font-bold mb-3 uppercase tracking-widest" style={{ color: "hsl(38 95% 60%)" }}>Next Steps</p>
                  <div className="space-y-1.5">
                    {r.nextSteps.map((step: string, i: number) => (
                      <div key={i} className="flex items-start gap-2">
                        <ArrowRight className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: "hsl(38 95% 52%)" }} />
                        <p className="text-xs" style={{ color: "hsl(210 40% 80%)" }}>{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
