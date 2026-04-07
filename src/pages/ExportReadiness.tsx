import { useState } from "react";
import { PackageCheck, RefreshCw, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { useClaudeAnalysis } from "@/hooks/useClaudeAnalysis";
import { OutputCard, DataRow, LoadingState, EmptyState } from "@/components/analysis/OutputCard";
import { AIStatusBar } from "@/components/ai/AIStatusBar";
import { WebSearchPanel } from "@/components/ai/WebSearchPanel";
import { AIDisclaimer } from "@/components/ai/AIDisclaimer";


const SYSTEM_PROMPT = `You are an Iraq export compliance and market readiness expert. Respond ONLY with valid JSON:
{
  "overallScore": "number 0-100",
  "readinessLevel": "Export Ready|Needs Minor Adjustments|Needs Major Work|Not Ready",
  "summary": "string - 2 sentences",
  "packagingCompliance": {
    "score": "number 0-100",
    "status": "Pass|Fail|Partial",
    "requirements": [{"requirement":"string","status":"Pass|Fail|Required","details":"string"}],
    "recommendations": ["array"]
  },
  "arabicLabeling": {
    "score": "number 0-100",
    "status": "Pass|Fail|Partial",
    "mandatoryElements": [{"element":"string","required":true,"details":"string"}],
    "recommendations": ["array"]
  },
  "pricingCompetitiveness": {
    "score": "number 0-100",
    "status": "Competitive|Slightly High|Too High|Very Competitive",
    "analysis": "string",
    "adjustmentNeeded": "string"
  },
  "logisticsReadiness": {
    "score": "number 0-100",
    "status": "Pass|Fail|Partial",
    "shippingOptions": [{"method":"string","cost":"string","transitTime":"string","reliability":"string"}],
    "recommendations": ["array"]
  },
  "regulatoryCompliance": {
    "score": "number 0-100",
    "requiredCertifications": [{"cert":"string","mandatory":true,"issuer":"string"}],
    "bannedProducts": "string - any restrictions for this category",
    "importPermits": "string"
  },
  "actionPlan": [
    {"priority":"High|Medium|Low","action":"string","timeline":"string","cost":"string"}
  ],
  "estimatedReadinessTimeline": "string"
}`;

const statusIcon = (status: string) => {
  if (status === "Pass" || status === "Export Ready") return <CheckCircle2 className="h-4 w-4" style={{ color: "hsl(158 64% 50%)" }} />;
  if (status === "Fail" || status === "Not Ready") return <XCircle className="h-4 w-4" style={{ color: "hsl(0 72% 65%)" }} />;
  return <AlertTriangle className="h-4 w-4" style={{ color: "hsl(38 95% 52%)" }} />;
};

const scoreColor = (score: number) => score >= 80 ? "hsl(158 64% 55%)" : score >= 60 ? "hsl(38 95% 60%)" : "hsl(0 72% 65%)";
const scoreBg = (score: number) => score >= 80 ? "hsl(158 64% 40% / 0.15)" : score >= 60 ? "hsl(38 95% 52% / 0.15)" : "hsl(0 72% 51% / 0.15)";

export default function ExportReadiness() {
  const [form, setForm] = useState({
    product: "", category: "", origin: "",
    hasArabicLabel: "No", targetPrice: "", packaging: ""
  });
  const { result, loading, error, analyze, tokensUsed, responseTime, jsonValid, modelUsed } = useClaudeAnalysis({ systemPrompt: SYSTEM_PROMPT, agentId: "export", modelTier: "flash-lite" });

  const handleSubmit = () => {
    if (!form.product) return;
    analyze(`Assess export readiness for Iraq market:
Product: ${form.product}
Category: ${form.category}
Country of Origin: ${form.origin}
Has Arabic Label: ${form.hasArabicLabel}
Target Price: ${form.targetPrice}
Packaging Description: ${form.packaging}

Check packaging compliance, Arabic labeling requirements, pricing competitiveness, logistics readiness, and regulatory compliance for Iraq import in 2025-2026.`);
  };

  const d = result;
  const readinessColor = (l: string) => l === "Export Ready" ? "green" : l === "Needs Minor Adjustments" ? "amber" : "red";

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <PackageCheck className="h-5 w-5" style={{ color: "hsl(38 95% 52%)" }} />
            <h1 className="text-xl font-bold font-display" style={{ color: "hsl(210 40% 92%)" }}>Export Readiness Check</h1>
          </div>
          <p className="text-sm" style={{ color: "hsl(215 25% 55%)" }}>Packaging, Arabic labeling, pricing & logistics compliance for Iraq</p>
        </div>
        <span className="data-pill-amber">Service 08</span>
      </div>


      <AIStatusBar agentName="Export Readiness Agent" tokensUsed={tokensUsed} responseTime={responseTime} jsonValid={jsonValid} modelUsed={modelUsed} />
      <WebSearchPanel label="Export regulations & compliance" />

      <div className="rounded-xl p-6" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Product *", key: "product", placeholder: "e.g. Energy Drink" },
            { label: "Category", key: "category", placeholder: "e.g. Food & Beverages" },
            { label: "Country of Origin", key: "origin", placeholder: "e.g. UAE, Turkey" },
            { label: "Target Price (USD)", key: "targetPrice", placeholder: "e.g. $1.50 per can" },
            { label: "Packaging Description", key: "packaging", placeholder: "e.g. 250ml can, English label" },
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
            <label className="section-label">Has Arabic Label?</label>
            <select className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
              style={{ background: "hsl(216 45% 14%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }}
              value={form.hasArabicLabel} onChange={e => setForm(p => ({ ...p, hasArabicLabel: e.target.value }))}>
              {["No", "Yes — Full Arabic", "Yes — Partial", "Sticker Available"].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>
        <button onClick={handleSubmit} disabled={loading || !form.product}
          className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50"
          style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
          {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <PackageCheck className="h-4 w-4" />}
          {loading ? "Checking Readiness..." : "Check Export Readiness"}
        </button>
      </div>

      {error && <div className="rounded-xl p-4" style={{ background: "hsl(0 72% 51% / 0.1)", border: "1px solid hsl(0 72% 51% / 0.3)" }}><p className="text-sm" style={{ color: "hsl(0 72% 68%)" }}>⚠ {error}</p></div>}
      {loading && <LoadingState message="Checking export compliance for Iraq market..." />}
      {!loading && !d && !error && <EmptyState icon={<PackageCheck className="h-12 w-12" />} title="Export Readiness Check" description="Verify your packaging, Arabic labeling, pricing, and logistics readiness before entering Iraq." />}

      {d && !loading && (
        <div className="space-y-5">
          {/* Overall Score */}
          <div className="rounded-xl p-6 flex items-center gap-6"
            style={{
              background: `hsl(${d.readinessLevel === "Export Ready" ? "158 64% 40%" : d.readinessLevel?.includes("Minor") ? "38 95% 52%" : "0 72% 51%"} / 0.08)`,
              border: `1px solid hsl(${d.readinessLevel === "Export Ready" ? "158 64% 40%" : d.readinessLevel?.includes("Minor") ? "38 95% 52%" : "0 72% 51%"} / 0.3)`,
            }}>
            <div className="flex items-center justify-center h-20 w-20 rounded-full shrink-0"
              style={{ background: scoreBg(d.overallScore), border: `3px solid ${scoreColor(d.overallScore)}` }}>
              <span className="text-2xl font-bold font-display font-mono-data" style={{ color: scoreColor(d.overallScore) }}>{d.overallScore}</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                {statusIcon(d.readinessLevel)}
                <h2 className="text-base font-bold font-display" style={{ color: "hsl(210 40% 92%)" }}>{d.readinessLevel}</h2>
              </div>
              <p className="text-sm" style={{ color: "hsl(215 25% 65%)" }}>{d.summary}</p>
              {d.estimatedReadinessTimeline && (
                <p className="text-xs mt-2" style={{ color: "hsl(215 25% 55%)" }}>⏱ Estimated to be fully ready: <strong style={{ color: "hsl(38 95% 60%)" }}>{d.estimatedReadinessTimeline}</strong></p>
              )}
            </div>
          </div>

          {/* Four Compliance Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { key: "packagingCompliance", title: "Packaging Compliance", reqKey: "requirements" },
              { key: "arabicLabeling", title: "Arabic Labeling", reqKey: "mandatoryElements" },
            ].map(({ key, title, reqKey }) => {
              const area = (d as any)[key];
              if (!area) return null;
              return (
                <OutputCard key={key} title={title} icon={statusIcon(area.status)} variant={area.status === "Pass" ? "green" : area.status === "Fail" ? "red" : "amber"}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full" style={{ background: scoreBg(area.score) }}>
                      <span className="text-sm font-bold font-mono-data" style={{ color: scoreColor(area.score) }}>{area.score}</span>
                    </div>
                    <span className={area.status === "Pass" ? "data-pill-green" : area.status === "Fail" ? "data-pill-red" : "data-pill-amber"}>{area.status}</span>
                  </div>
                  <div className="space-y-2">
                    {area[reqKey]?.map((req: any, i: number) => (
                      <div key={i} className="flex items-start gap-2 p-2 rounded-lg" style={{ background: "hsl(216 45% 13%)" }}>
                        {statusIcon(req.status || (req.required ? "Required" : "Pass"))}
                        <div>
                          <p className="text-xs font-semibold" style={{ color: "hsl(210 40% 82%)" }}>{req.requirement || req.element}</p>
                          {req.details && <p className="text-xs mt-0.5" style={{ color: "hsl(215 25% 58%)" }}>{req.details}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                  {area.recommendations?.length > 0 && (
                    <div className="mt-3 pt-3 border-t" style={{ borderColor: "hsl(var(--border))" }}>
                      {area.recommendations.map((r: string, i: number) => (
                        <div key={i} className="flex items-start gap-1.5 mb-1.5">
                          <span style={{ color: "hsl(38 95% 52%)" }}>›</span>
                          <p className="text-xs" style={{ color: "hsl(215 25% 62%)" }}>{r}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </OutputCard>
              );
            })}

            {/* Pricing & Logistics */}
            {d.pricingCompetitiveness && (
              <OutputCard title="Pricing Competitiveness" icon={<PackageCheck className="h-4 w-4" />}
                variant={d.pricingCompetitiveness.status === "Very Competitive" || d.pricingCompetitiveness.status === "Competitive" ? "green" : d.pricingCompetitiveness.status === "Slightly High" ? "amber" : "red"}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full" style={{ background: scoreBg(d.pricingCompetitiveness.score) }}>
                    <span className="text-sm font-bold font-mono-data" style={{ color: scoreColor(d.pricingCompetitiveness.score) }}>{d.pricingCompetitiveness.score}</span>
                  </div>
                  <span className={d.pricingCompetitiveness.status?.includes("High") ? "data-pill-red" : "data-pill-green"}>
                    {d.pricingCompetitiveness.status}
                  </span>
                </div>
                <p className="text-sm mb-2" style={{ color: "hsl(215 25% 65%)" }}>{d.pricingCompetitiveness.analysis}</p>
                {d.pricingCompetitiveness.adjustmentNeeded && (
                  <p className="text-xs italic" style={{ color: "hsl(38 95% 52%)" }}>💡 {d.pricingCompetitiveness.adjustmentNeeded}</p>
                )}
              </OutputCard>
            )}

            {d.logisticsReadiness && (
              <OutputCard title="Logistics Readiness" variant={d.logisticsReadiness.status === "Pass" ? "green" : "amber"}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full" style={{ background: scoreBg(d.logisticsReadiness.score) }}>
                    <span className="text-sm font-bold font-mono-data" style={{ color: scoreColor(d.logisticsReadiness.score) }}>{d.logisticsReadiness.score}</span>
                  </div>
                  <span className={d.logisticsReadiness.status === "Pass" ? "data-pill-green" : "data-pill-amber"}>{d.logisticsReadiness.status}</span>
                </div>
                {d.logisticsReadiness.shippingOptions?.map((opt: any, i: number) => (
                  <div key={i} className="p-2 rounded-lg mb-2" style={{ background: "hsl(216 45% 13%)" }}>
                    <div className="flex justify-between mb-0.5">
                      <span className="text-xs font-semibold" style={{ color: "hsl(210 40% 82%)" }}>{opt.method}</span>
                      <span className="text-xs font-mono-data" style={{ color: "hsl(38 95% 60%)" }}>{opt.cost}</span>
                    </div>
                    <div className="flex gap-2 text-xs" style={{ color: "hsl(215 25% 58%)" }}>
                      <span>⏱ {opt.transitTime}</span>
                      <span>· {opt.reliability}</span>
                    </div>
                  </div>
                ))}
              </OutputCard>
            )}
          </div>

          {/* Regulatory */}
          {d.regulatoryCompliance && (
            <OutputCard title="Regulatory Compliance" icon={<CheckCircle2 className="h-4 w-4" />} variant="default">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="section-label mb-2">Required Certifications</p>
                  <div className="space-y-2">
                    {d.regulatoryCompliance.requiredCertifications?.map((cert: any, i: number) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: "hsl(216 45% 13%)" }}>
                        {cert.mandatory ? <AlertTriangle className="h-3.5 w-3.5 shrink-0" style={{ color: "hsl(38 95% 52%)" }} /> : <CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{ color: "hsl(158 64% 50%)" }} />}
                        <div>
                          <p className="text-xs font-semibold" style={{ color: "hsl(210 40% 82%)" }}>{cert.cert}</p>
                          <p className="text-xs" style={{ color: "hsl(215 25% 55%)" }}>{cert.issuer}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <DataRow label="Import Permits" value={d.regulatoryCompliance.importPermits} />
                  {d.regulatoryCompliance.bannedProducts && (
                    <div className="mt-2 p-3 rounded-lg" style={{ background: "hsl(0 72% 51% / 0.08)", border: "1px solid hsl(0 72% 51% / 0.25)" }}>
                      <p className="text-xs font-semibold mb-1" style={{ color: "hsl(0 72% 68%)" }}>Restrictions</p>
                      <p className="text-xs" style={{ color: "hsl(215 25% 62%)" }}>{d.regulatoryCompliance.bannedProducts}</p>
                    </div>
                  )}
                </div>
              </div>
            </OutputCard>
          )}

          {/* Action Plan */}
          {d.actionPlan?.length > 0 && (
            <OutputCard title="Action Plan" icon={<CheckCircle2 className="h-4 w-4" />} variant="amber">
              <div className="space-y-2">
                {d.actionPlan.map((item: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: "hsl(216 45% 13%)" }}>
                    <span className={item.priority === "High" ? "data-pill-red" : item.priority === "Medium" ? "data-pill-amber" : "data-pill-muted"} style={{ fontSize: "10px", marginTop: "2px", flexShrink: 0 }}>
                      {item.priority}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: "hsl(210 40% 85%)" }}>{item.action}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-semibold" style={{ color: "hsl(38 95% 60%)" }}>{item.cost}</p>
                      <p className="text-xs" style={{ color: "hsl(215 25% 55%)" }}>{item.timeline}</p>
                    </div>
                  </div>
                ))}
              </div>
            </OutputCard>
          )}
        </div>
      )}
    </div>
  );
}
