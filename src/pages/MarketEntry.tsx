import { useState } from "react";
import { TrendingUp, MapPin, Package, Users, BarChart2, Target, ArrowRight, RefreshCw, Download } from "lucide-react";
import { useClaudeAnalysis } from "@/hooks/useClaudeAnalysis";
import { OutputCard, DataRow, TagList, LoadingState, EmptyState } from "@/components/analysis/OutputCard";

const SYSTEM_PROMPT = `You are an expert Iraq market entry consultant with 20 years of experience in the Iraqi, Kurdish Regional Government (KRG), and Middle East markets. You provide detailed, data-driven market intelligence.

When analyzing a product for Iraq market entry, respond ONLY with a valid JSON object (no markdown, no explanation) in this exact structure:
{
  "productCategory": "string - the specific product category",
  "productDescription": "string - brief product overview",
  "marketPricing": {
    "wholesalePrice": "string - USD range e.g. $X - $Y per unit/kg/case",
    "retailPrice": "string - USD range",
    "distributorMargin": "string - percentage range e.g. 15-20%",
    "retailerMargin": "string - percentage range",
    "pricePositioning": "string - Budget/Mid-Range/Premium",
    "notes": "string - pricing notes"
  },
  "targetCustomers": ["array of 4-6 specific customer segments in Iraq"],
  "productionCountry": "string - recommended production/sourcing country",
  "marketOpportunity": {
    "overview": "string - 2-3 sentences",
    "keyDrivers": ["array of 4-5 market drivers"],
    "growthRate": "string - estimated annual growth %",
    "opportunities": ["3-4 specific opportunities"]
  },
  "demandLevel": {
    "level": "High|Medium|Low",
    "score": "number 1-10",
    "description": "string",
    "seasonality": "string"
  },
  "competitionOverview": [
    {
      "brand": "string",
      "countryOfOrigin": "string",
      "priceRange": "string",
      "distributionStrength": "Strong|Medium|Weak",
      "marketingStrategy": "string"
    }
  ],
  "marketEntryStrategy": {
    "recommended": "string - primary strategy",
    "steps": ["array of 5-6 actionable steps"],
    "timeline": "string - e.g. 6-12 months",
    "investmentLevel": "Low|Medium|High",
    "channelPriority": ["ordered list of distribution channels"]
  },
  "marketSizeEstimate": {
    "total": "string - USD estimate",
    "addressable": "string - USD estimate",
    "unitVolume": "string - estimated units/year",
    "projection5yr": "string - 5 year projection"
  },
  "recommendedCities": [
    {
      "city": "string",
      "region": "string e.g. KRG/Federal Iraq",
      "priority": "Primary|Secondary",
      "reason": "string - why this city",
      "population": "string"
    }
  ],
  "distributionModel": {
    "primary": "string - primary channel",
    "channels": ["array of distribution channels"],
    "partnerProfile": "string - ideal partner description",
    "logistics": "string - logistics recommendations"
  }
}`;

const categories = [
  "Food & Beverages", "FMCG / Consumer Goods", "Healthcare & Pharmaceuticals",
  "Construction Materials", "Electronics & Technology", "Clothing & Textiles",
  "Agricultural Products", "Cosmetics & Personal Care", "Industrial Equipment",
  "Household Products", "Children & Baby Products", "Automotive Parts",
];

export default function MarketEntry() {
  const [form, setForm] = useState({
    product: "", category: "", countryOfOrigin: "", description: "",
    targetPrice: "", businessType: "Manufacturer",
  });
  const { result, loading, error, analyze } = useClaudeAnalysis({ systemPrompt: SYSTEM_PROMPT });

  const handleSubmit = () => {
    if (!form.product) return;
    const prompt = `Analyze the Iraq market entry potential for the following product:

Product Name: ${form.product}
Category: ${form.category || "Not specified"}
Country of Origin: ${form.countryOfOrigin || "Not specified"}
Description: ${form.description || "Not provided"}
Target Price Range: ${form.targetPrice || "Not specified"}
Business Type: ${form.businessType}

Provide a comprehensive Iraq market entry analysis covering all fields in the required JSON format. Be specific to Iraq's market conditions in 2025-2026, including cities like Baghdad, Erbil, Basra, Najaf, Mosul, and Sulaymaniyah.`;
    analyze(prompt);
  };

  const d = result;
  const demandColor = d?.demandLevel?.level === "High" ? "green" : d?.demandLevel?.level === "Medium" ? "amber" : "red";
  const demandPill = d?.demandLevel?.level === "High" ? "data-pill-green" : d?.demandLevel?.level === "Medium" ? "data-pill-amber" : "data-pill-red";

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-5 w-5" style={{ color: "hsl(38 95% 52%)" }} />
            <h1 className="text-xl font-bold font-display" style={{ color: "hsl(210 40% 92%)" }}>Iraq Market Entry Advisor</h1>
          </div>
          <p className="text-sm" style={{ color: "hsl(215 25% 55%)" }}>
            AI-powered market intelligence for entering and scaling in Iraq
          </p>
        </div>
        <span className="data-pill-amber">🇮🇶 Iraq Market</span>
      </div>

      {/* Input Form */}
      <div className="rounded-xl p-6" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <h2 className="text-sm font-semibold font-display mb-4" style={{ color: "hsl(210 40% 85%)" }}>Product Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <label className="section-label">Product Name *</label>
            <input
              className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
              style={{ background: "hsl(216 45% 14%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }}
              placeholder="e.g. Turkish Tomato Paste"
              value={form.product}
              onChange={e => setForm(p => ({ ...p, product: e.target.value }))}
            />
          </div>
          <div>
            <label className="section-label">Product Category</label>
            <select
              className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
              style={{ background: "hsl(216 45% 14%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }}
              value={form.category}
              onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
            >
              <option value="">Select category...</option>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="section-label">Country of Origin</label>
            <input
              className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
              style={{ background: "hsl(216 45% 14%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }}
              placeholder="e.g. Turkey, Jordan, UAE"
              value={form.countryOfOrigin}
              onChange={e => setForm(p => ({ ...p, countryOfOrigin: e.target.value }))}
            />
          </div>
          <div>
            <label className="section-label">Target Price Range (USD)</label>
            <input
              className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
              style={{ background: "hsl(216 45% 14%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }}
              placeholder="e.g. $2-5 per unit"
              value={form.targetPrice}
              onChange={e => setForm(p => ({ ...p, targetPrice: e.target.value }))}
            />
          </div>
          <div>
            <label className="section-label">Business Type</label>
            <select
              className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
              style={{ background: "hsl(216 45% 14%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }}
              value={form.businessType}
              onChange={e => setForm(p => ({ ...p, businessType: e.target.value }))}
            >
              {["Manufacturer", "Exporter / Trading Company", "Brand Owner", "Importer", "Distributor"].map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="section-label">Product Description</label>
            <input
              className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
              style={{ background: "hsl(216 45% 14%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }}
              placeholder="Brief description..."
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            />
          </div>
        </div>
        <div className="flex items-center gap-3 mt-5">
          <button
            onClick={handleSubmit}
            disabled={loading || !form.product}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
            style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <TrendingUp className="h-4 w-4" />}
            {loading ? "Analyzing Iraq Market..." : "Generate Market Analysis"}
          </button>
          {d && (
            <button onClick={handleSubmit}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium"
              style={{ background: "hsl(216 45% 15%)", color: "hsl(210 40% 75%)", border: "1px solid hsl(var(--border))" }}>
              <RefreshCw className="h-4 w-4" /> Re-analyze
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl p-4" style={{ background: "hsl(0 72% 51% / 0.1)", border: "1px solid hsl(0 72% 51% / 0.3)" }}>
          <p className="text-sm" style={{ color: "hsl(0 72% 68%)" }}>⚠ {error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && <LoadingState message="Analyzing Iraq market conditions, pricing data, and competitors..." />}

      {/* No results yet */}
      {!loading && !d && !error && (
        <EmptyState
          icon={<TrendingUp className="h-12 w-12" />}
          title="Ready to Analyze Your Product"
          description="Enter your product details above and click 'Generate Market Analysis' to receive a comprehensive Iraq market entry report."
        />
      )}

      {/* RESULTS */}
      {d && !loading && (
        <div className="space-y-5">
          {/* Top summary strip */}
          <div className="rounded-xl p-5 grid grid-cols-2 md:grid-cols-4 gap-4"
            style={{ background: "hsl(var(--card))", border: "1px solid hsl(38 95% 52% / 0.3)" }}>
            <div>
              <p className="section-label">Product Category</p>
              <p className="text-sm font-semibold" style={{ color: "hsl(38 95% 60%)" }}>{d.productCategory}</p>
            </div>
            <div>
              <p className="section-label">Demand Level</p>
              <span className={demandPill}>{d.demandLevel?.level} ({d.demandLevel?.score}/10)</span>
            </div>
            <div>
              <p className="section-label">Market Size</p>
              <p className="text-sm font-semibold" style={{ color: "hsl(158 64% 55%)" }}>{d.marketSizeEstimate?.total}</p>
            </div>
            <div>
              <p className="section-label">Entry Timeline</p>
              <p className="text-sm font-semibold" style={{ color: "hsl(210 40% 85%)" }}>{d.marketEntryStrategy?.timeline}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Market Pricing Intelligence */}
            <OutputCard title="Market Pricing Intelligence" icon={<Package className="h-4 w-4" />} variant="amber">
              <DataRow label="Wholesale Price" value={d.marketPricing?.wholesalePrice} highlight />
              <DataRow label="Retail Price" value={d.marketPricing?.retailPrice} highlight />
              <DataRow label="Distributor Margin" value={d.marketPricing?.distributorMargin} />
              <DataRow label="Retailer Margin" value={d.marketPricing?.retailerMargin} />
              <DataRow label="Price Positioning" value={d.marketPricing?.pricePositioning} />
              {d.marketPricing?.notes && (
                <p className="text-xs pt-2" style={{ color: "hsl(215 25% 55%)" }}>{d.marketPricing.notes}</p>
              )}
            </OutputCard>

            {/* Target Customers */}
            <OutputCard title="Target Customers" icon={<Users className="h-4 w-4" />} variant="blue">
              <TagList items={d.targetCustomers} variant="blue" />
              {d.demandLevel && (
                <div className="mt-3 pt-3 border-t" style={{ borderColor: "hsl(var(--border))" }}>
                  <DataRow label="Seasonality" value={d.demandLevel.seasonality} />
                  <p className="text-xs mt-2" style={{ color: "hsl(215 25% 55%)" }}>{d.demandLevel.description}</p>
                </div>
              )}
            </OutputCard>

            {/* Market Opportunity */}
            <OutputCard title="Market Opportunity Analysis" icon={<TrendingUp className="h-4 w-4" />} variant="green">
              <p className="text-sm leading-relaxed" style={{ color: "hsl(215 25% 65%)" }}>{d.marketOpportunity?.overview}</p>
              <div className="mt-3">
                <p className="section-label mb-2">Key Market Drivers</p>
                <TagList items={d.marketOpportunity?.keyDrivers} variant="green" />
              </div>
              {d.marketOpportunity?.growthRate && (
                <DataRow label="Annual Growth Rate" value={d.marketOpportunity.growthRate} highlight />
              )}
            </OutputCard>

            {/* Market Size */}
            <OutputCard title="Market Size Estimate" icon={<BarChart2 className="h-4 w-4" />} variant="default">
              <DataRow label="Total Market" value={d.marketSizeEstimate?.total} highlight />
              <DataRow label="Addressable Market" value={d.marketSizeEstimate?.addressable} />
              <DataRow label="Volume Estimate" value={d.marketSizeEstimate?.unitVolume} />
              <DataRow label="5-Year Projection" value={d.marketSizeEstimate?.projection5yr} />
            </OutputCard>
          </div>

          {/* Competition Overview */}
          {d.competitionOverview?.length > 0 && (
            <OutputCard title="Competition Overview" icon={<BarChart2 className="h-4 w-4" />} variant="red">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: "1px solid hsl(var(--border))" }}>
                      {["Brand", "Country of Origin", "Price Range", "Distribution Strength", "Marketing Strategy"].map(h => (
                        <th key={h} className="text-left pb-3 pr-4 text-xs font-semibold uppercase tracking-wider"
                          style={{ color: "hsl(215 25% 50%)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {d.competitionOverview.map((c: any, i: number) => (
                      <tr key={i} style={{ borderBottom: i < d.competitionOverview.length - 1 ? "1px solid hsl(var(--border))" : "none" }}>
                        <td className="py-2.5 pr-4 font-semibold text-xs" style={{ color: "hsl(210 40% 85%)" }}>{c.brand}</td>
                        <td className="py-2.5 pr-4 text-xs" style={{ color: "hsl(215 25% 65%)" }}>
                          <span className="data-pill-muted">{c.countryOfOrigin}</span>
                        </td>
                        <td className="py-2.5 pr-4 text-xs font-mono-data" style={{ color: "hsl(38 95% 60%)" }}>{c.priceRange}</td>
                        <td className="py-2.5 pr-4">
                          <span className={c.distributionStrength === "Strong" ? "data-pill-red" : c.distributionStrength === "Medium" ? "data-pill-amber" : "data-pill-green"}>
                            {c.distributionStrength}
                          </span>
                        </td>
                        <td className="py-2.5 text-xs" style={{ color: "hsl(215 25% 60%)" }}>{c.marketingStrategy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </OutputCard>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Market Entry Strategy */}
            <OutputCard title="Market Entry Strategy" icon={<Target className="h-4 w-4" />} variant="amber">
              <div className="mb-3">
                <p className="section-label">Recommended Strategy</p>
                <p className="text-sm font-semibold" style={{ color: "hsl(38 95% 60%)" }}>{d.marketEntryStrategy?.recommended}</p>
              </div>
              <div className="space-y-2">
                {d.marketEntryStrategy?.steps?.map((step: string, i: number) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold mt-0.5"
                      style={{ background: "hsl(38 95% 52% / 0.15)", color: "hsl(38 95% 60%)" }}>{i + 1}</span>
                    <p className="text-sm" style={{ color: "hsl(215 25% 68%)" }}>{step}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-2 flex-wrap">
                <DataRow label="Investment Level" value={
                  <span className={d.marketEntryStrategy?.investmentLevel === "Low" ? "data-pill-green" : d.marketEntryStrategy?.investmentLevel === "High" ? "data-pill-red" : "data-pill-amber"}>
                    {d.marketEntryStrategy?.investmentLevel}
                  </span>
                } />
              </div>
            </OutputCard>

            {/* Recommended Cities */}
            <OutputCard title="Recommended Cities" icon={<MapPin className="h-4 w-4" />} variant="green">
              <div className="space-y-3">
                {d.recommendedCities?.map((city: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg"
                    style={{ background: "hsl(216 45% 14%)" }}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold" style={{ color: "hsl(210 40% 85%)" }}>{city.city}</span>
                        <span className={city.priority === "Primary" ? "data-pill-green" : "data-pill-muted"} style={{ fontSize: "10px", padding: "1px 6px" }}>
                          {city.priority}
                        </span>
                        <span className="text-xs" style={{ color: "hsl(215 25% 50%)" }}>{city.region}</span>
                      </div>
                      <p className="text-xs" style={{ color: "hsl(215 25% 58%)" }}>{city.reason}</p>
                    </div>
                    <p className="text-xs shrink-0 font-mono-data" style={{ color: "hsl(215 25% 50%)" }}>{city.population}</p>
                  </div>
                ))}
              </div>
            </OutputCard>
          </div>

          {/* Distribution Model */}
          <OutputCard title="Distribution Model" icon={<ArrowRight className="h-4 w-4" />} variant="blue">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <p className="section-label">Primary Channel</p>
                <p className="text-sm font-semibold" style={{ color: "hsl(217 91% 70%)" }}>{d.distributionModel?.primary}</p>
              </div>
              <div>
                <p className="section-label">Distribution Channels</p>
                <TagList items={d.distributionModel?.channels} variant="blue" />
              </div>
              <div>
                <p className="section-label">Logistics</p>
                <p className="text-xs" style={{ color: "hsl(215 25% 62%)" }}>{d.distributionModel?.logistics}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t" style={{ borderColor: "hsl(var(--border))" }}>
              <p className="section-label">Ideal Partner Profile</p>
              <p className="text-sm" style={{ color: "hsl(215 25% 65%)" }}>{d.distributionModel?.partnerProfile}</p>
            </div>
          </OutputCard>
        </div>
      )}
    </div>
  );
}
