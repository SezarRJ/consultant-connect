import { useState } from "react";
import { ShieldAlert, RefreshCw, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useClaudeAnalysis } from "@/hooks/useClaudeAnalysis";
import { OutputCard, DataRow, LoadingState, EmptyState } from "@/components/analysis/OutputCard";

const SYSTEM_PROMPT = `You are an Iraq market risk analyst. Respond ONLY with valid JSON:
{
  "overallRisk": "High|Medium|Low",
  "riskScore": "number 1-10",
  "summary": "string - 2 sentences",
  "paymentRisk": {
    "level": "High|Medium|Low",
    "issues": ["array of risks"],
    "mitigation": ["array of solutions"],
    "recommendedTerms": "string"
  },
  "logisticsRisk": {
    "level": "High|Medium|Low",
    "issues": ["array of risks"],
    "mitigation": ["array of solutions"],
    "bestRoutes": ["array of recommended shipping routes/methods"]
  },
  "legalBarriers": {
    "level": "High|Medium|Low",
    "issues": ["array"],
    "requiredDocuments": ["array of required documents"],
    "mitigation": ["array"]
  },
  "customsIssues": {
    "level": "High|Medium|Low",
    "dutyRate": "string %",
    "commonIssues": ["array"],
    "mitigation": ["array"],
    "tips": "string"
  },
  "politicalRisk": {
    "level": "High|Medium|Low",
    "description": "string",
    "affectedRegions": ["array"]
  },
  "currencyRisk": {
    "level": "High|Medium|Low",
    "description": "string",
    "recommendation": "string"
  },
  "mitigationPlan": ["array of 5-6 overall risk mitigation actions"],
  "doNotDo": ["array of 4-5 critical mistakes to avoid in Iraq"],
  "insuranceRecommendations": ["array of 3 insurance types recommended"]
}`;

const riskColor = (level: string) => level === "High" ? "data-pill-red" : level === "Medium" ? "data-pill-amber" : "data-pill-green";
const riskBg = (level: string) => level === "High" ? "red" : level === "Medium" ? "amber" : "green";

export default function RiskAssessment() {
  const [form, setForm] = useState({ product: "", origin: "", volume: "", paymentMethod: "Open Account" });
  const { result, loading, error, analyze } = useClaudeAnalysis({ systemPrompt: SYSTEM_PROMPT });

  const handleSubmit = () => {
    if (!form.product) return;
    analyze(`Assess Iraqi market entry risks for:
Product: ${form.product}
Country of Origin: ${form.origin}
Monthly Volume: ${form.volume}
Payment Method: ${form.paymentMethod}

Provide realistic 2025-2026 Iraq risk assessment covering payment risk, logistics, legal barriers, customs issues.`);
  };

  const d = result;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="h-5 w-5" style={{ color: "hsl(38 95% 52%)" }} />
            <h1 className="text-xl font-bold font-display" style={{ color: "hsl(210 40% 92%)" }}>Iraq Market Risk Assessment</h1>
          </div>
          <p className="text-sm" style={{ color: "hsl(215 25% 55%)" }}>Payment risk, logistics, legal barriers & customs issues</p>
        </div>
        <span className="data-pill-red">Service 05</span>
      </div>

      <div className="rounded-xl p-6" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Product *", key: "product", placeholder: "e.g. Electrical Equipment" },
            { label: "Country of Origin", key: "origin", placeholder: "e.g. China, Germany" },
            { label: "Monthly Export Volume", key: "volume", placeholder: "e.g. $50,000 / 10 containers" },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="section-label">{label}</label>
              <input className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
                style={{ background: "hsl(216 45% 14%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }}
                placeholder={placeholder} value={(form as any)[key]}
                onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
            </div>
          ))}
          <div>
            <label className="section-label">Planned Payment Method</label>
            <select className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
              style={{ background: "hsl(216 45% 14%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }}
              value={form.paymentMethod} onChange={e => setForm(p => ({ ...p, paymentMethod: e.target.value }))}>
              {["Open Account", "Letter of Credit (L/C)", "Cash in Advance", "Documentary Collection", "Consignment"].map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <button onClick={handleSubmit} disabled={loading || !form.product}
          className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50"
          style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
          {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ShieldAlert className="h-4 w-4" />}
          {loading ? "Assessing Risks..." : "Assess Iraq Market Risks"}
        </button>
      </div>

      {error && <div className="rounded-xl p-4" style={{ background: "hsl(0 72% 51% / 0.1)", border: "1px solid hsl(0 72% 51% / 0.3)" }}><p className="text-sm" style={{ color: "hsl(0 72% 68%)" }}>⚠ {error}</p></div>}
      {loading && <LoadingState message="Evaluating Iraq market risks and mitigation strategies..." />}
      {!loading && !d && !error && <EmptyState icon={<ShieldAlert className="h-12 w-12" />} title="Risk Assessment Ready" description="Get a comprehensive risk report covering payment, logistics, legal, and customs challenges in Iraq." />}

      {d && !loading && (
        <div className="space-y-5">
          {/* Overall Risk Banner */}
          <div className="rounded-xl p-5 flex items-center justify-between"
            style={{
              background: d.overallRisk === "High" ? "hsl(0 72% 51% / 0.08)" : d.overallRisk === "Medium" ? "hsl(38 95% 52% / 0.08)" : "hsl(158 64% 40% / 0.08)",
              border: `1px solid ${d.overallRisk === "High" ? "hsl(0 72% 51% / 0.3)" : d.overallRisk === "Medium" ? "hsl(38 95% 52% / 0.3)" : "hsl(158 64% 40% / 0.3)"}`,
            }}>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <AlertTriangle className="h-5 w-5" style={{ color: d.overallRisk === "High" ? "hsl(0 72% 65%)" : d.overallRisk === "Medium" ? "hsl(38 95% 60%)" : "hsl(158 64% 55%)" }} />
                <h2 className="text-base font-bold font-display" style={{ color: "hsl(210 40% 90%)" }}>
                  Overall Risk Level: <span className={riskColor(d.overallRisk)}>{d.overallRisk}</span>
                </h2>
                <span className="font-mono-data text-lg font-bold" style={{ color: "hsl(38 95% 60%)" }}>{d.riskScore}/10</span>
              </div>
              <p className="text-sm" style={{ color: "hsl(215 25% 65%)" }}>{d.summary}</p>
            </div>
          </div>

          {/* Risk Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { key: "paymentRisk", title: "Payment Risk", icon: "💳", extraField: "recommendedTerms", extraLabel: "Recommended Terms" },
              { key: "logisticsRisk", title: "Logistics Risk", icon: "🚢", extraField: "bestRoutes", extraLabel: "Best Routes" },
              { key: "legalBarriers", title: "Legal Barriers", icon: "⚖️", extraField: "requiredDocuments", extraLabel: "Required Documents" },
              { key: "customsIssues", title: "Customs Issues", icon: "🏛️", extraField: "dutyRate", extraLabel: "Duty Rate" },
            ].map(({ key, title, icon, extraField, extraLabel }) => {
              const risk = (d as any)[key];
              if (!risk) return null;
              return (
                <OutputCard key={key} title={`${icon} ${title}`} variant={riskBg(risk.level) as any}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={riskColor(risk.level)}>{risk.level} Risk</span>
                    {risk[extraField] && typeof risk[extraField] === "string" && (
                      <span className="text-xs" style={{ color: "hsl(215 25% 58%)" }}>· {extraLabel}: <strong style={{ color: "hsl(38 95% 60%)" }}>{risk[extraField]}</strong></span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="section-label mb-1.5">Issues</p>
                      {risk.issues?.map((issue: string, i: number) => (
                        <div key={i} className="flex items-start gap-1.5 mb-1.5">
                          <span className="text-xs shrink-0" style={{ color: "hsl(0 72% 65%)" }}>▸</span>
                          <p className="text-xs" style={{ color: "hsl(215 25% 65%)" }}>{issue}</p>
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="section-label mb-1.5">Mitigation</p>
                      {risk.mitigation?.map((m: string, i: number) => (
                        <div key={i} className="flex items-start gap-1.5 mb-1.5">
                          <span className="text-xs shrink-0" style={{ color: "hsl(158 64% 50%)" }}>✓</span>
                          <p className="text-xs" style={{ color: "hsl(215 25% 65%)" }}>{m}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  {extraField === "requiredDocuments" && risk.requiredDocuments && (
                    <div className="mt-3 pt-3 border-t" style={{ borderColor: "hsl(var(--border))" }}>
                      <p className="section-label mb-2">Required Documents</p>
                      <div className="flex flex-wrap gap-1.5">
                        {risk.requiredDocuments.map((doc: string) => <span key={doc} className="data-pill-muted" style={{ fontSize: "10px" }}>{doc}</span>)}
                      </div>
                    </div>
                  )}
                  {key === "customsIssues" && risk.tips && <p className="text-xs mt-2 italic" style={{ color: "hsl(215 25% 58%)" }}>💡 {risk.tips}</p>}
                </OutputCard>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Political & Currency Risk */}
            {d.politicalRisk && (
              <OutputCard title="Political Risk" variant="red">
                <span className={riskColor(d.politicalRisk.level)}>{d.politicalRisk.level}</span>
                <p className="text-sm mt-2" style={{ color: "hsl(215 25% 65%)" }}>{d.politicalRisk.description}</p>
                {d.politicalRisk.affectedRegions?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {d.politicalRisk.affectedRegions.map((r: string) => <span key={r} className="data-pill-muted" style={{ fontSize: "10px" }}>{r}</span>)}
                  </div>
                )}
              </OutputCard>
            )}
            {d.currencyRisk && (
              <OutputCard title="Currency Risk" variant="amber">
                <span className={riskColor(d.currencyRisk.level)}>{d.currencyRisk.level}</span>
                <p className="text-sm mt-2" style={{ color: "hsl(215 25% 65%)" }}>{d.currencyRisk.description}</p>
                <p className="text-xs mt-2 italic" style={{ color: "hsl(38 95% 52%)" }}>💡 {d.currencyRisk.recommendation}</p>
              </OutputCard>
            )}
            {d.insuranceRecommendations?.length > 0 && (
              <OutputCard title="Insurance Recommendations" variant="green">
                {d.insuranceRecommendations.map((ins: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 mb-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "hsl(158 64% 50%)" }} />
                    <p className="text-sm" style={{ color: "hsl(215 25% 68%)" }}>{ins}</p>
                  </div>
                ))}
              </OutputCard>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <OutputCard title="Risk Mitigation Plan" icon={<CheckCircle2 className="h-4 w-4" />} variant="green">
              {d.mitigationPlan?.map((action: string, i: number) => (
                <div key={i} className="flex items-start gap-2.5 mb-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                    style={{ background: "hsl(158 64% 40% / 0.15)", color: "hsl(158 64% 55%)" }}>{i + 1}</span>
                  <p className="text-sm" style={{ color: "hsl(215 25% 68%)" }}>{action}</p>
                </div>
              ))}
            </OutputCard>
            <OutputCard title="Critical Mistakes to Avoid" icon={<AlertTriangle className="h-4 w-4" />} variant="red">
              {d.doNotDo?.map((item: string, i: number) => (
                <div key={i} className="flex items-start gap-2 mb-2">
                  <span style={{ color: "hsl(0 72% 65%)" }}>✕</span>
                  <p className="text-sm" style={{ color: "hsl(215 25% 68%)" }}>{item}</p>
                </div>
              ))}
            </OutputCard>
          </div>
        </div>
      )}
    </div>
  );
}
