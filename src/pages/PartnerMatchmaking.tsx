import { useState } from "react";
import { Handshake, RefreshCw, Star, MapPin, Phone } from "lucide-react";
import { useClaudeAnalysis } from "@/hooks/useClaudeAnalysis";
import { OutputCard, LoadingState, EmptyState } from "@/components/analysis/OutputCard";
import { AIStatusBar } from "@/components/ai/AIStatusBar";
import { WebSearchPanel } from "@/components/ai/WebSearchPanel";
import { AIDisclaimer } from "@/components/ai/AIDisclaimer";


const SYSTEM_PROMPT = `You are an Iraq business matchmaking expert. Respond ONLY with valid JSON:
{
  "summary": "string",
  "distributorMatches": [
    {
      "name": "string",
      "type": "string",
      "city": "string",
      "region": "string",
      "established": "string year",
      "employees": "string",
      "revenue": "string annual USD estimate",
      "coverage": ["cities/areas covered"],
      "specialization": ["product categories"],
      "matchScore": "number 70-98",
      "reasons": ["why this is a good match"],
      "contactApproach": "string - how to reach them",
      "requirements": ["what they expect from supplier"]
    }
  ],
  "agentMatches": [
    {
      "name": "string",
      "city": "string",
      "expertise": "string",
      "commission": "string %",
      "languages": ["Arabic","English","Kurdish"],
      "network": "string",
      "matchScore": "number"
    }
  ],
  "logisticsPartners": [
    {
      "name": "string",
      "type": "Freight Forwarder|Customs Broker|3PL|Trucking",
      "cities": ["string"],
      "services": ["string"],
      "strength": "string"
    }
  ],
  "negotiationTips": ["array of 5 Iraq-specific negotiation tips"],
  "contractEssentials": ["array of 5 must-have contract clauses for Iraq"]
}`;

export default function PartnerMatchmaking() {
  const [form, setForm] = useState({ product: "", category: "", city: "All Iraq", companySize: "SME", partnerType: "Distributor" });
  const { result, loading, error, analyze, tokensUsed, responseTime, jsonValid, modelUsed } = useClaudeAnalysis({ systemPrompt: SYSTEM_PROMPT, agentId: "partner", modelTier: "flash-lite" });

  const handleSubmit = () => {
    if (!form.product) return;
    analyze(`Find business partners in Iraq for:
Product/Category: ${form.product} / ${form.category}
Preferred City: ${form.city}
My Company Size: ${form.companySize}
Partner Type Needed: ${form.partnerType}

Match with verified Iraqi distributors, agents, and logistics providers. Provide realistic profiles.`);
  };

  const d = result;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Handshake className="h-5 w-5" style={{ color: "hsl(38 95% 52%)" }} />
            <h1 className="text-xl font-bold font-display" style={{ color: "hsl(210 40% 92%)" }}>Partner Matchmaking</h1>
          </div>
          <p className="text-sm" style={{ color: "hsl(215 25% 55%)" }}>Match with verified Iraqi distributors, agents & logistics providers</p>
        </div>
        <span className="data-pill-green">Service 06</span>
      </div>


      <AIStatusBar agentName="Partner Matchmaking Agent" tokensUsed={tokensUsed} responseTime={responseTime} jsonValid={jsonValid} modelUsed={modelUsed} />
      <WebSearchPanel label="Partner & distributor networks" />

      <div className="rounded-xl p-6" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="section-label">Your Product *</label>
            <input className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
              style={{ background: "hsl(216 45% 14%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }}
              placeholder="e.g. Dairy Products" value={form.product}
              onChange={e => setForm(p => ({ ...p, product: e.target.value }))} />
          </div>
          <div>
            <label className="section-label">Category</label>
            <input className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
              style={{ background: "hsl(216 45% 14%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }}
              placeholder="e.g. Food & Beverages" value={form.category}
              onChange={e => setForm(p => ({ ...p, category: e.target.value }))} />
          </div>
          <div>
            <label className="section-label">Target City</label>
            <select className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
              style={{ background: "hsl(216 45% 14%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }}
              value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))}>
              {["All Iraq", "Baghdad", "Erbil", "Sulaymaniyah", "Basra", "Najaf", "Mosul"].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="section-label">Company Size</label>
            <select className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
              style={{ background: "hsl(216 45% 14%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }}
              value={form.companySize} onChange={e => setForm(p => ({ ...p, companySize: e.target.value }))}>
              {["SME", "Mid-size", "Large Enterprise", "Startup"].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="section-label">Partner Type Needed</label>
            <select className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
              style={{ background: "hsl(216 45% 14%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }}
              value={form.partnerType} onChange={e => setForm(p => ({ ...p, partnerType: e.target.value }))}>
              {["Distributor", "Agent", "Wholesaler", "Logistics Partner", "All Types"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <button onClick={handleSubmit} disabled={loading || !form.product}
          className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50"
          style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
          {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Handshake className="h-4 w-4" />}
          {loading ? "Finding Partners..." : "Find Partners"}
        </button>
      </div>

      {error && <div className="rounded-xl p-4" style={{ background: "hsl(0 72% 51% / 0.1)", border: "1px solid hsl(0 72% 51% / 0.3)" }}><p className="text-sm" style={{ color: "hsl(0 72% 68%)" }}>⚠ {error}</p></div>}
      {loading && <LoadingState message="Matching you with verified Iraqi partners..." />}
      {!loading && !d && !error && <EmptyState icon={<Handshake className="h-12 w-12" />} title="Partner Matchmaking" description="Find verified distributors, agents and logistics partners tailored to your product and target regions in Iraq." />}

      {d && !loading && (
          <AIDisclaimer compact />
        <div className="space-y-5">
          {d.summary && <div className="rounded-xl p-4" style={{ background: "hsl(38 95% 52% / 0.06)", border: "1px solid hsl(38 95% 52% / 0.2)" }}><p className="text-sm" style={{ color: "hsl(215 25% 70%)" }}>{d.summary}</p></div>}

          {d.distributorMatches?.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold font-display mb-3" style={{ color: "hsl(210 40% 85%)" }}>Top Distributor Matches</h2>
              <div className="space-y-4">
                {d.distributorMatches.map((p: any, i: number) => (
                  <div key={i} className="rounded-xl p-5" style={{ background: "hsl(var(--card))", border: "1px solid hsl(158 64% 40% / 0.2)" }}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-sm font-bold font-display" style={{ color: "hsl(210 40% 92%)" }}>{p.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="data-pill-green" style={{ fontSize: "10px" }}>{p.type}</span>
                          <span className="flex items-center gap-1 text-xs" style={{ color: "hsl(215 25% 60%)" }}>
                            <MapPin className="h-3 w-3" />{p.city}, {p.region}
                          </span>
                          <span className="text-xs" style={{ color: "hsl(215 25% 55%)" }}>Est. {p.established} · {p.employees} staff</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1 justify-center">
                          <Star className="h-3.5 w-3.5" style={{ color: "hsl(38 95% 52%)" }} />
                          <span className="font-mono-data font-bold text-lg" style={{ color: "hsl(38 95% 60%)" }}>{p.matchScore}%</span>
                        </div>
                        <span className="text-xs" style={{ color: "hsl(215 25% 50%)" }}>Match</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="section-label mb-1">Why It's a Match</p>
                        {p.reasons?.map((r: string, j: number) => (
                          <div key={j} className="flex items-start gap-1.5 mb-1"><span style={{ color: "hsl(158 64% 50%)" }}>✓</span><p className="text-xs" style={{ color: "hsl(215 25% 65%)" }}>{r}</p></div>
                        ))}
                      </div>
                      <div>
                        <p className="section-label mb-1">Their Requirements</p>
                        {p.requirements?.map((r: string, j: number) => (
                          <div key={j} className="flex items-start gap-1.5 mb-1"><span style={{ color: "hsl(38 95% 52%)" }}>›</span><p className="text-xs" style={{ color: "hsl(215 25% 65%)" }}>{r}</p></div>
                        ))}
                      </div>
                      <div>
                        <p className="section-label mb-1">How to Approach</p>
                        <p className="text-xs italic" style={{ color: "hsl(215 25% 62%)" }}>{p.contactApproach}</p>
                        {p.revenue && <p className="text-xs mt-2" style={{ color: "hsl(215 25% 52%)" }}>Revenue: {p.revenue}/yr</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {d.agentMatches?.length > 0 && (
              <OutputCard title="Commercial Agents" icon={<Phone className="h-4 w-4" />} variant="blue">
                {d.agentMatches.map((a: any, i: number) => (
                  <div key={i} className="p-3 rounded-lg mb-2" style={{ background: "hsl(216 45% 13%)" }}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "hsl(210 40% 88%)" }}>{a.name}</p>
                        <p className="text-xs" style={{ color: "hsl(215 25% 58%)" }}>{a.city} · {a.expertise}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-mono-data font-bold" style={{ color: "hsl(38 95% 60%)" }}>{a.matchScore}%</p>
                        <p className="text-xs" style={{ color: "hsl(215 25% 55%)" }}>Commission: {a.commission}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 mt-2">{a.languages?.map((l: string) => <span key={l} className="data-pill-muted" style={{ fontSize: "10px" }}>{l}</span>)}</div>
                  </div>
                ))}
              </OutputCard>
            )}

            {d.logisticsPartners?.length > 0 && (
              <OutputCard title="Logistics Partners" icon={<Handshake className="h-4 w-4" />} variant="default">
                {d.logisticsPartners.map((lp: any, i: number) => (
                  <div key={i} className="p-3 rounded-lg mb-2" style={{ background: "hsl(216 45% 13%)" }}>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm font-semibold" style={{ color: "hsl(210 40% 88%)" }}>{lp.name}</p>
                      <span className="data-pill-muted" style={{ fontSize: "10px" }}>{lp.type}</span>
                    </div>
                    <p className="text-xs mb-1.5" style={{ color: "hsl(215 25% 60%)" }}>{lp.strength}</p>
                    <div className="flex flex-wrap gap-1">{lp.services?.map((s: string) => <span key={s} className="data-pill-muted" style={{ fontSize: "10px" }}>{s}</span>)}</div>
                  </div>
                ))}
              </OutputCard>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {d.negotiationTips?.length > 0 && (
              <OutputCard title="Iraq Negotiation Tips" variant="amber">
                {d.negotiationTips.map((tip: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 mb-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold" style={{ background: "hsl(38 95% 52% / 0.15)", color: "hsl(38 95% 60%)" }}>{i + 1}</span>
                    <p className="text-sm" style={{ color: "hsl(215 25% 68%)" }}>{tip}</p>
                  </div>
                ))}
              </OutputCard>
            )}
            {d.contractEssentials?.length > 0 && (
              <OutputCard title="Contract Must-Haves" variant="green">
                {d.contractEssentials.map((clause: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 mb-2">
                    <span style={{ color: "hsl(158 64% 50%)" }}>§</span>
                    <p className="text-sm" style={{ color: "hsl(215 25% 68%)" }}>{clause}</p>
                  </div>
                ))}
              </OutputCard>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
