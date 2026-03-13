import { useState } from "react";
import { BarChart2, RefreshCw, TrendingUp, Shield } from "lucide-react";
import { useClaudeAnalysis } from "@/hooks/useClaudeAnalysis";
import { OutputCard, TagList, LoadingState, EmptyState } from "@/components/analysis/OutputCard";
import { AIStatusBar } from "@/components/ai/AIStatusBar";
import { WebSearchPanel } from "@/components/ai/WebSearchPanel";


const SYSTEM_PROMPT = `You are an Iraq market competitive intelligence expert. Respond ONLY with valid JSON:
{
  "category": "string",
  "marketOverview": "string - 2 sentences",
  "competitors": [
    {
      "brand": "string",
      "company": "string - parent company",
      "countryOfOrigin": "string",
      "priceRange": "string USD",
      "marketShare": "string %",
      "distributionStrength": "Strong|Medium|Weak",
      "distributionChannels": ["array"],
      "marketingStrategy": "string",
      "strengths": ["2-3 strengths"],
      "weaknesses": ["2-3 weaknesses"],
      "targetSegment": "string",
      "presenceInIraq": "string e.g. 5+ years"
    }
  ],
  "marketGaps": ["array of 4-5 gaps your product can fill"],
  "competitiveAdvantages": ["array of advantages you can leverage"],
  "topThreats": ["array of 3-4 competitive threats"],
  "positioningRecommendation": "string - 2-3 sentences",
  "differentiationStrategy": ["array of 4-5 differentiation tactics"],
  "competitiveMatrix": {
    "priceLeader": "string brand name",
    "qualityLeader": "string brand name",
    "distributionLeader": "string brand name",
    "marketShareLeader": "string brand name"
  }
}`;

export default function CompetitorAnalysis() {
  const [form, setForm] = useState({ product: "", category: "", origin: "", yourPrice: "" });
  const { result, loading, error, analyze, tokensUsed } = useClaudeAnalysis({ systemPrompt: SYSTEM_PROMPT, agentId: "competitor" });

  const handleSubmit = () => {
    if (!form.product) return;
    analyze(`Analyze competitors in Iraq for:
Product: ${form.product}
Category: ${form.category}
My Country of Origin: ${form.origin}
My Target Price: ${form.yourPrice}

Identify all competing brands, their country of origin, price ranges, distribution strength, and marketing strategies in Iraq 2025-2026. Be specific and realistic.`);
  };

  const d = result;
  const strengthColor = (s: string) => s === "Strong" ? "data-pill-red" : s === "Medium" ? "data-pill-amber" : "data-pill-green";

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart2 className="h-5 w-5" style={{ color: "hsl(38 95% 52%)" }} />
            <h1 className="text-xl font-bold font-display" style={{ color: "hsl(210 40% 92%)" }}>Competitor Analysis</h1>
          </div>
          <p className="text-sm" style={{ color: "hsl(215 25% 55%)" }}>Competing brands, pricing, distribution & marketing strategies in Iraq</p>
        </div>
        <span className="data-pill-blue">Service 03</span>
      </div>


      <AIStatusBar agentName="Competitor Agent" tokensUsed={tokensUsed} />
      <WebSearchPanel label="Market competitor intelligence" />

      <div className="rounded-xl p-6" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Your Product *", key: "product", placeholder: "e.g. Instant Noodles" },
            { label: "Category", key: "category", placeholder: "e.g. Food & Beverages" },
            { label: "Your Country of Origin", key: "origin", placeholder: "e.g. Malaysia, Turkey" },
            { label: "Your Target Price (USD)", key: "yourPrice", placeholder: "e.g. $0.50 per pack" },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="section-label">{label}</label>
              <input className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
                style={{ background: "hsl(216 45% 14%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }}
                placeholder={placeholder} value={(form as any)[key]}
                onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
            </div>
          ))}
        </div>
        <button onClick={handleSubmit} disabled={loading || !form.product}
          className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50"
          style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
          {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <BarChart2 className="h-4 w-4" />}
          {loading ? "Analyzing Competitors..." : "Analyze Competitors"}
        </button>
      </div>

      {error && <div className="rounded-xl p-4" style={{ background: "hsl(0 72% 51% / 0.1)", border: "1px solid hsl(0 72% 51% / 0.3)" }}><p className="text-sm" style={{ color: "hsl(0 72% 68%)" }}>⚠ {error}</p></div>}
      {loading && <LoadingState message="Scanning Iraq market for competing brands..." />}
      {!loading && !d && !error && <EmptyState icon={<BarChart2 className="h-12 w-12" />} title="Competitive Landscape Analysis" description="Identify all competing brands in Iraq, their pricing, distribution channels, and marketing strategies." />}

      {d && !loading && (
        <div className="space-y-5">
          {d.marketOverview && (
            <div className="rounded-xl p-4" style={{ background: "hsl(38 95% 52% / 0.06)", border: "1px solid hsl(38 95% 52% / 0.2)" }}>
              <p className="text-sm" style={{ color: "hsl(215 25% 70%)" }}>{d.marketOverview}</p>
            </div>
          )}

          {/* Competitor Cards */}
          {d.competitors?.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold font-display mb-3" style={{ color: "hsl(210 40% 85%)" }}>Competing Brands ({d.competitors.length})</h2>
              <div className="space-y-4">
                {d.competitors.map((c: any, i: number) => (
                  <div key={i} className="rounded-xl p-5" style={{ background: "hsl(var(--card))", border: "1px solid hsl(217 91% 53% / 0.2)" }}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base font-bold font-display" style={{ color: "hsl(210 40% 92%)" }}>{c.brand}</h3>
                          <span className="data-pill-muted" style={{ fontSize: "10px" }}>{c.countryOfOrigin}</span>
                          <span className={strengthColor(c.distributionStrength)}>{c.distributionStrength}</span>
                        </div>
                        <p className="text-xs" style={{ color: "hsl(215 25% 55%)" }}>{c.company} · {c.presenceInIraq} in Iraq</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono-data text-lg font-bold" style={{ color: "hsl(38 95% 60%)" }}>{c.priceRange}</p>
                        <p className="text-xs" style={{ color: "hsl(215 25% 55%)" }}>Market Share: {c.marketShare}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="section-label mb-1.5">Distribution Channels</p>
                        <TagList items={c.distributionChannels} variant="blue" />
                      </div>
                      <div>
                        <p className="section-label mb-1">Strengths</p>
                        {c.strengths?.map((s: string, j: number) => (
                          <div key={j} className="flex items-start gap-1.5 mb-1">
                            <span style={{ color: "hsl(158 64% 50%)" }}>✓</span>
                            <p className="text-xs" style={{ color: "hsl(215 25% 65%)" }}>{s}</p>
                          </div>
                        ))}
                      </div>
                      <div>
                        <p className="section-label mb-1">Weaknesses</p>
                        {c.weaknesses?.map((w: string, j: number) => (
                          <div key={j} className="flex items-start gap-1.5 mb-1">
                            <span style={{ color: "hsl(0 72% 60%)" }}>✗</span>
                            <p className="text-xs" style={{ color: "hsl(215 25% 65%)" }}>{w}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t text-xs" style={{ borderColor: "hsl(var(--border))", color: "hsl(215 25% 58%)" }}>
                      <strong style={{ color: "hsl(215 25% 70%)" }}>Marketing Strategy: </strong>{c.marketingStrategy}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Competitive Matrix */}
          {d.competitiveMatrix && (
            <OutputCard title="Competitive Matrix" icon={<Shield className="h-4 w-4" />} variant="amber">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Price Leader", value: d.competitiveMatrix.priceLeader },
                  { label: "Quality Leader", value: d.competitiveMatrix.qualityLeader },
                  { label: "Distribution Leader", value: d.competitiveMatrix.distributionLeader },
                  { label: "Market Share Leader", value: d.competitiveMatrix.marketShareLeader },
                ].map(({ label, value }) => (
                  <div key={label} className="p-3 rounded-lg text-center" style={{ background: "hsl(216 45% 13%)" }}>
                    <p className="section-label text-center">{label}</p>
                    <p className="text-sm font-bold" style={{ color: "hsl(38 95% 60%)" }}>{value}</p>
                  </div>
                ))}
              </div>
            </OutputCard>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <OutputCard title="Market Gaps & Opportunities" icon={<TrendingUp className="h-4 w-4" />} variant="green">
              {d.marketGaps?.map((gap: string, i: number) => (
                <div key={i} className="flex items-start gap-2 mb-2">
                  <span style={{ color: "hsl(158 64% 50%)" }}>◆</span>
                  <p className="text-sm" style={{ color: "hsl(215 25% 68%)" }}>{gap}</p>
                </div>
              ))}
            </OutputCard>
            <OutputCard title="Differentiation Strategy" icon={<Shield className="h-4 w-4" />} variant="blue">
              <p className="text-sm mb-3" style={{ color: "hsl(215 25% 62%)" }}>{d.positioningRecommendation}</p>
              {d.differentiationStrategy?.map((s: string, i: number) => (
                <div key={i} className="flex items-start gap-2 mb-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold"
                    style={{ background: "hsl(217 91% 53% / 0.15)", color: "hsl(217 91% 70%)" }}>{i + 1}</span>
                  <p className="text-sm" style={{ color: "hsl(215 25% 68%)" }}>{s}</p>
                </div>
              ))}
            </OutputCard>
          </div>
        </div>
      )}
    </div>
  );
}
