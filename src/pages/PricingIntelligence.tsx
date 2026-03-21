import { useState } from "react";
import { DollarSign, RefreshCw, TrendingUp, TrendingDown } from "lucide-react";
import { useClaudeAnalysis } from "@/hooks/useClaudeAnalysis";
import { OutputCard, DataRow, LoadingState, EmptyState } from "@/components/analysis/OutputCard";
import { AIStatusBar } from "@/components/ai/AIStatusBar";
import { WebSearchPanel } from "@/components/ai/WebSearchPanel";


const SYSTEM_PROMPT = `You are an Iraq market pricing expert. Respond ONLY with a valid JSON object:
{
  "productCategory": "string",
  "importedWholesalePrice": "string USD range",
  "localWholesalePrice": "string USD range",
  "retailPrice": "string USD range",
  "distributorMargin": "string percentage",
  "retailerMargin": "string percentage",
  "importerMargin": "string percentage",
  "recommendedRetailPrice": "string USD",
  "recommendedWholesalePrice": "string USD",
  "priceElasticity": "High|Medium|Low",
  "pricingStrategy": "string - e.g. Penetration/Premium/Competitive",
  "competitors": [{"brand":"string","price":"string","origin":"string","share":"string"}],
  "pricingFactors": ["array of 4-5 factors affecting price in Iraq"],
  "customsDuty": "string percentage",
  "vatRate": "string",
  "landedCostBreakdown": {"product":"string%","shipping":"string%","customs":"string%","handling":"string%"},
  "cityVariations": [{"city":"string","priceMultiplier":"string","notes":"string"}],
  "recommendation": "string - 2-3 sentence pricing recommendation"
}`;

export default function PricingIntelligence() {
  const [form, setForm] = useState({ product: "", category: "", currentPrice: "", origin: "" });
  const { result, loading, error, analyze, tokensUsed, responseTime, jsonValid, modelUsed } = useClaudeAnalysis({ systemPrompt: SYSTEM_PROMPT, agentId: "pricing", modelTier: "flash-lite" });

  const handleSubmit = () => {
    if (!form.product) return;
    analyze(`Provide detailed Iraq market pricing intelligence for:
Product: ${form.product}
Category: ${form.category}
Current/Target Price: ${form.currentPrice}
Country of Origin: ${form.origin}
Provide real-world accurate pricing data for Iraq market in 2025-2026.`);
  };

  const d = result;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-5 w-5" style={{ color: "hsl(38 95% 52%)" }} />
            <h1 className="text-xl font-bold font-display" style={{ color: "hsl(210 40% 92%)" }}>Pricing Intelligence</h1>
          </div>
          <p className="text-sm" style={{ color: "hsl(215 25% 55%)" }}>Wholesale, retail & margin benchmarking for Iraq market</p>
        </div>
        <span className="data-pill-amber">Service 04</span>
      </div>


      <AIStatusBar agentName="Pricing Agent" tokensUsed={tokensUsed} responseTime={responseTime} jsonValid={jsonValid} modelUsed={modelUsed} />
      <WebSearchPanel label="Live pricing & market rates" />
      {/* Form */}
      <div className="rounded-xl p-6" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Product Name *", key: "product", placeholder: "e.g. Olive Oil 500ml" },
            { label: "Category", key: "category", placeholder: "e.g. Food & Beverages" },
            { label: "Your Target Price (USD)", key: "currentPrice", placeholder: "e.g. $3 per bottle" },
            { label: "Country of Origin", key: "origin", placeholder: "e.g. Spain, Turkey" },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="section-label">{label}</label>
              <input
                className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
                style={{ background: "hsl(216 45% 14%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }}
                placeholder={placeholder}
                value={(form as any)[key]}
                onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
              />
            </div>
          ))}
        </div>
        <button onClick={handleSubmit} disabled={loading || !form.product}
          className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50"
          style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
          {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <DollarSign className="h-4 w-4" />}
          {loading ? "Fetching Prices..." : "Get Pricing Intelligence"}
        </button>
      </div>

      {error && <div className="rounded-xl p-4" style={{ background: "hsl(0 72% 51% / 0.1)", border: "1px solid hsl(0 72% 51% / 0.3)" }}><p className="text-sm" style={{ color: "hsl(0 72% 68%)" }}>⚠ {error}</p></div>}
      {loading && <LoadingState message="Fetching Iraq market pricing data and margins..." />}
      {!loading && !d && !error && <EmptyState icon={<DollarSign className="h-12 w-12" />} title="Ready for Pricing Analysis" description="Enter product details to get wholesale price, retail price, and margin intelligence for Iraq." />}

      {d && !loading && (
        <div className="space-y-5">
          {/* Price Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Wholesale Price", value: d.importedWholesalePrice, color: "amber" },
              { label: "Retail Price", value: d.retailPrice, color: "green" },
              { label: "Distributor Margin", value: d.distributorMargin, color: "blue" },
              { label: "Retailer Margin", value: d.retailerMargin, color: "blue" },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-xl p-4 text-center"
                style={{ background: "hsl(var(--card))", border: `1px solid hsl(${color === "amber" ? "38 95% 52%" : color === "green" ? "158 64% 40%" : "217 91% 53%"} / 0.3)` }}>
                <p className="section-label text-center">{label}</p>
                <p className="text-lg font-bold font-display font-mono-data mt-1"
                  style={{ color: color === "amber" ? "hsl(38 95% 60%)" : color === "green" ? "hsl(158 64% 55%)" : "hsl(217 91% 70%)" }}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <OutputCard title="Recommended Pricing" variant="amber" icon={<TrendingUp className="h-4 w-4" />}>
              <DataRow label="Recommended Retail Price" value={d.recommendedRetailPrice} highlight />
              <DataRow label="Recommended Wholesale" value={d.recommendedWholesalePrice} highlight />
              <DataRow label="Importer Margin" value={d.importerMargin} />
              <DataRow label="Pricing Strategy" value={<span className="data-pill-amber">{d.pricingStrategy}</span>} />
              <DataRow label="Price Elasticity" value={<span className={d.priceElasticity === "Low" ? "data-pill-green" : "data-pill-amber"}>{d.priceElasticity}</span>} />
              {d.recommendation && <p className="text-xs pt-2" style={{ color: "hsl(215 25% 58%)" }}>{d.recommendation}</p>}
            </OutputCard>

            <OutputCard title="Landed Cost Breakdown" variant="default" icon={<DollarSign className="h-4 w-4" />}>
              <DataRow label="Customs Duty" value={d.customsDuty} />
              <DataRow label="VAT Rate" value={d.vatRate} />
              {d.landedCostBreakdown && Object.entries(d.landedCostBreakdown).map(([k, v]: any) => (
                <DataRow key={k} label={k.charAt(0).toUpperCase() + k.slice(1)} value={v} />
              ))}
              {d.pricingFactors && (
                <div className="mt-3 pt-3 border-t" style={{ borderColor: "hsl(var(--border))" }}>
                  <p className="section-label mb-2">Key Pricing Factors</p>
                  {d.pricingFactors.map((f: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 mb-1.5">
                      <span style={{ color: "hsl(38 95% 52%)" }}>›</span>
                      <p className="text-xs" style={{ color: "hsl(215 25% 62%)" }}>{f}</p>
                    </div>
                  ))}
                </div>
              )}
            </OutputCard>
          </div>

          {/* Competitors */}
          {d.competitors?.length > 0 && (
            <OutputCard title="Competitor Pricing" variant="red" icon={<TrendingDown className="h-4 w-4" />}>
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    {["Brand", "Origin", "Price", "Market Share"].map(h => (
                      <th key={h} className="text-left pb-3 pr-6 text-xs font-semibold uppercase tracking-wider" style={{ color: "hsl(215 25% 50%)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {d.competitors.map((c: any, i: number) => (
                    <tr key={i} style={{ borderTop: "1px solid hsl(var(--border))" }}>
                      <td className="py-2.5 pr-6 font-semibold text-xs" style={{ color: "hsl(210 40% 85%)" }}>{c.brand}</td>
                      <td className="py-2.5 pr-6"><span className="data-pill-muted">{c.origin}</span></td>
                      <td className="py-2.5 pr-6 font-mono-data text-xs" style={{ color: "hsl(38 95% 60%)" }}>{c.price}</td>
                      <td className="py-2.5 text-xs" style={{ color: "hsl(215 25% 62%)" }}>{c.share}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </OutputCard>
          )}

          {/* City Variations */}
          {d.cityVariations?.length > 0 && (
            <OutputCard title="Price Variation by City" variant="blue">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {d.cityVariations.map((c: any, i: number) => (
                  <div key={i} className="p-3 rounded-lg" style={{ background: "hsl(216 45% 14%)" }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold" style={{ color: "hsl(210 40% 85%)" }}>{c.city}</span>
                      <span className="font-mono-data text-xs" style={{ color: "hsl(38 95% 60%)" }}>{c.priceMultiplier}</span>
                    </div>
                    <p className="text-xs" style={{ color: "hsl(215 25% 55%)" }}>{c.notes}</p>
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
