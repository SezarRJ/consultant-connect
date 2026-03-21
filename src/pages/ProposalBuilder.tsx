import { useState } from "react";
import { FileText, Plus, RefreshCw, Download, Copy, CheckCircle2, DollarSign, Clock, Target, Layers, Building2, Briefcase } from "lucide-react";
import { useClaudeAnalysis } from "@/hooks/useClaudeAnalysis";
import { toast } from "sonner";

const SYSTEM_PROMPT = `You are a senior consulting proposal writer specializing in MENA markets. Generate a professional consulting proposal. Respond ONLY with valid JSON:
{
  "title": "string",
  "executiveSummary": "string (3 sentences)",
  "scopeOfWork": [{ "phase": "string", "deliverable": "string", "duration": "string" }],
  "methodology": ["string"],
  "teamStructure": [{ "role": "string", "responsibility": "string" }],
  "timeline": { "totalDuration": "string", "phases": [{ "name": "string", "weeks": "string" }] },
  "pricing": { "totalFee": "string", "breakdown": [{ "item": "string", "amount": "string" }], "paymentTerms": "string" },
  "valueProposition": ["string"],
  "termsAndConditions": ["string"]
}`;

const SERVICE_TYPES = ["Market Entry Analysis","Feasibility Study","Distribution Strategy","Sales RTM Design","F&B Concept","Manufacturing Setup","Brand Strategy","Business Development","Telecom Strategy","Real Estate Feasibility"];
const INDUSTRIES = ["FMCG","Real Estate","F&B","Manufacturing","Telecom","Retail","Healthcare","Agriculture","Energy","Technology"];
const DURATIONS = ["2 weeks","4 weeks","6 weeks","8 weeks","3 months","6 months"];

export default function ProposalBuilder() {
  const [form, setForm] = useState({
    client: "", contact: "", service: "Market Entry Analysis", industry: "FMCG",
    scope: "", duration: "4 weeks", budget: "", geography: "Iraq", objectives: ""
  });
  const { result, loading, error, analyze } = useClaudeAnalysis({ systemPrompt: SYSTEM_PROMPT, agentId: "proposal", modelTier: "flash-lite" });
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!form.client || !form.service) { toast.error("Client name and service type are required"); return; }
    const prompt = `Generate a consulting proposal for:
Client: ${form.client} (Contact: ${form.contact})
Service: ${form.service}
Industry: ${form.industry}
Geography: ${form.geography}
Duration: ${form.duration}
Budget Range: ${form.budget || "Flexible"}
Scope: ${form.scope || "Full consulting engagement"}
Client Objectives: ${form.objectives || "Improve business performance and growth"}`;
    analyze(prompt);
  };

  const handleCopy = () => {
    if (!result) return;
    const text = JSON.stringify(result, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Proposal copied to clipboard!");
  };

  const r = result;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display" style={{ color:"hsl(210 40% 94%)" }}>Proposal Builder</h1>
          <p className="text-sm mt-1" style={{ color:"hsl(215 25% 55%)" }}>Auto-generate professional consulting proposals with AI</p>
        </div>
        {r && (
          <div className="flex gap-2">
            <button onClick={handleCopy} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
              style={{ background:"hsl(216 45% 18%)", color:"hsl(210 40% 75%)", border:"1px solid hsl(var(--border))" }}>
              {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy"}
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
              style={{ background:"hsl(38 95% 52%)", color:"hsl(216 58% 6%)" }}>
              <Download className="h-4 w-4" /> Export PDF
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="rounded-xl p-5 space-y-4" style={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))" }}>
          <h2 className="text-sm font-semibold" style={{ color:"hsl(210 40% 92%)" }}>Proposal Details</h2>
          {[
            { label:"Client Name *", key:"client", placeholder:"e.g. Al-Mansour Trading Co." },
            { label:"Contact Person", key:"contact", placeholder:"e.g. Ahmad Al-Rashidi, CEO" },
            { label:"Geography", key:"geography", placeholder:"e.g. Iraq, Baghdad" },
            { label:"Budget Range", key:"budget", placeholder:"e.g. $50,000–$100,000" },
          ].map(f => (
            <div key={f.key}>
              <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color:"hsl(215 25% 45%)" }}>{f.label}</label>
              <input value={(form as any)[f.key]} onChange={e => setForm(prev => ({...prev, [f.key]: e.target.value}))}
                placeholder={f.placeholder} className="w-full px-3 py-2.5 rounded-lg text-sm"
                style={{ background:"hsl(216 45% 12%)", border:"1px solid hsl(var(--border))", color:"hsl(210 40% 85%)" }} />
            </div>
          ))}

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color:"hsl(215 25% 45%)" }}>Service Type</label>
            <select value={form.service} onChange={e => setForm(f => ({...f, service:e.target.value}))}
              className="w-full px-3 py-2.5 rounded-lg text-sm"
              style={{ background:"hsl(216 45% 12%)", border:"1px solid hsl(var(--border))", color:"hsl(210 40% 85%)" }}>
              {SERVICE_TYPES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color:"hsl(215 25% 45%)" }}>Industry</label>
            <select value={form.industry} onChange={e => setForm(f => ({...f, industry:e.target.value}))}
              className="w-full px-3 py-2.5 rounded-lg text-sm"
              style={{ background:"hsl(216 45% 12%)", border:"1px solid hsl(var(--border))", color:"hsl(210 40% 85%)" }}>
              {INDUSTRIES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color:"hsl(215 25% 45%)" }}>Duration</label>
            <select value={form.duration} onChange={e => setForm(f => ({...f, duration:e.target.value}))}
              className="w-full px-3 py-2.5 rounded-lg text-sm"
              style={{ background:"hsl(216 45% 12%)", border:"1px solid hsl(var(--border))", color:"hsl(210 40% 85%)" }}>
              {DURATIONS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color:"hsl(215 25% 45%)" }}>Scope Notes</label>
            <textarea value={form.scope} onChange={e => setForm(f => ({...f, scope:e.target.value}))}
              placeholder="Describe specific scope or requirements..."
              rows={3} className="w-full px-3 py-2.5 rounded-lg text-sm resize-none"
              style={{ background:"hsl(216 45% 12%)", border:"1px solid hsl(var(--border))", color:"hsl(210 40% 85%)" }} />
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color:"hsl(215 25% 45%)" }}>Client Objectives</label>
            <textarea value={form.objectives} onChange={e => setForm(f => ({...f, objectives:e.target.value}))}
              placeholder="What does the client want to achieve?"
              rows={2} className="w-full px-3 py-2.5 rounded-lg text-sm resize-none"
              style={{ background:"hsl(216 45% 12%)", border:"1px solid hsl(var(--border))", color:"hsl(210 40% 85%)" }} />
          </div>

          <button onClick={handleGenerate} disabled={loading}
            className="w-full py-3 rounded-lg text-sm font-semibold disabled:opacity-50 inline-flex items-center justify-center gap-2"
            style={{ background:"hsl(38 95% 52%)", color:"hsl(216 58% 6%)" }}>
            {loading ? <><RefreshCw className="h-4 w-4 animate-spin" />Generating...</> : <><FileText className="h-4 w-4" />Generate Proposal</>}
          </button>
        </div>

        {/* Output */}
        <div className="lg:col-span-2 space-y-4">
          {error && (
            <div className="rounded-xl p-4" style={{ background:"hsl(0 72% 51% / 0.1)", border:"1px solid hsl(0 72% 51% / 0.3)" }}>
              <p className="text-sm" style={{ color:"hsl(0 72% 68%)" }}>{error}</p>
            </div>
          )}

          {loading && (
            <div className="rounded-xl p-10 text-center" style={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))" }}>
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-3" style={{ color:"hsl(38 95% 52%)" }} />
              <p className="font-medium" style={{ color:"hsl(210 40% 75%)" }}>Building your proposal...</p>
            </div>
          )}

          {r && !loading && (
            <div className="space-y-4">
              {/* Title & Summary */}
              <div className="rounded-xl p-5" style={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))" }}>
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-5 w-5" style={{ color:"hsl(38 95% 52%)" }} />
                  <h2 className="text-base font-bold" style={{ color:"hsl(210 40% 94%)" }}>{r.title || "Consulting Proposal"}</h2>
                </div>
                <p className="text-sm" style={{ color:"hsl(210 40% 75%)" }}>{r.executiveSummary}</p>
              </div>

              {/* Scope */}
              {r.scopeOfWork?.length > 0 && (
                <div className="rounded-xl p-5" style={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))" }}>
                  <h3 className="text-sm font-semibold mb-3" style={{ color:"hsl(38 95% 60%)" }}>Scope of Work</h3>
                  <div className="space-y-2">
                    {r.scopeOfWork.map((s: any, i: number) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background:"hsl(216 45% 12%)" }}>
                        <span className="flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold shrink-0" style={{ background:"hsl(38 95% 52% / 0.2)", color:"hsl(38 95% 60%)" }}>{i+1}</span>
                        <div className="flex-1">
                          <p className="text-xs font-semibold" style={{ color:"hsl(210 40% 88%)" }}>{s.phase}</p>
                          <p className="text-[11px] mt-0.5" style={{ color:"hsl(215 25% 55%)" }}>{s.deliverable}</p>
                        </div>
                        <span className="text-[10px] shrink-0" style={{ color:"hsl(217 91% 70%)" }}>{s.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Timeline */}
                {r.timeline && (
                  <div className="rounded-xl p-5" style={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))" }}>
                    <h3 className="text-sm font-semibold mb-3" style={{ color:"hsl(217 91% 70%)" }}>Timeline — {r.timeline.totalDuration}</h3>
                    <div className="space-y-2">
                      {r.timeline.phases?.map((p: any, i: number) => (
                        <div key={i} className="flex justify-between items-center text-xs p-2 rounded" style={{ background:"hsl(216 45% 12%)" }}>
                          <span style={{ color:"hsl(210 40% 80%)" }}>{p.name}</span>
                          <span style={{ color:"hsl(217 91% 70%)" }}>{p.weeks}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pricing */}
                {r.pricing && (
                  <div className="rounded-xl p-5" style={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))" }}>
                    <h3 className="text-sm font-semibold mb-3" style={{ color:"hsl(38 95% 60%)" }}>Pricing</h3>
                    <div className="space-y-2">
                      {r.pricing.breakdown?.map((b: any, i: number) => (
                        <div key={i} className="flex justify-between text-xs">
                          <span style={{ color:"hsl(215 25% 60%)" }}>{b.item}</span>
                          <span style={{ color:"hsl(210 40% 80%)" }}>{b.amount}</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-sm font-bold pt-2 border-t" style={{ borderColor:"hsl(var(--border))", color:"hsl(38 95% 60%)" }}>
                        <span>Total Fee</span><span>{r.pricing.totalFee}</span>
                      </div>
                      <p className="text-[11px] mt-1" style={{ color:"hsl(215 25% 50%)" }}>{r.pricing.paymentTerms}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Value Proposition */}
              {r.valueProposition?.length > 0 && (
                <div className="rounded-xl p-5" style={{ background:"hsl(158 64% 40% / 0.05)", border:"1px solid hsl(158 64% 40% / 0.2)" }}>
                  <h3 className="text-sm font-semibold mb-3" style={{ color:"hsl(158 64% 55%)" }}>Value Proposition</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {r.valueProposition.map((v: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{ color:"hsl(158 64% 55%)" }} />
                        <span style={{ color:"hsl(210 40% 75%)" }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!r && !loading && !error && (
            <div className="rounded-xl p-10 text-center" style={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))" }}>
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" style={{ color:"hsl(38 95% 52%)" }} />
              <p className="font-medium" style={{ color:"hsl(215 25% 50%)" }}>Fill in the details and generate your proposal</p>
              <p className="text-sm mt-1" style={{ color:"hsl(215 25% 38%)" }}>AI will create a complete, professional consulting proposal</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
