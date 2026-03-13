import { useState } from "react";
import { Users, RefreshCw, MapPin, Phone, Star, Building2 } from "lucide-react";
import { useClaudeAnalysis } from "@/hooks/useClaudeAnalysis";
import { OutputCard, LoadingState, EmptyState } from "@/components/analysis/OutputCard";
import { AIStatusBar } from "@/components/ai/AIStatusBar";
import { WebSearchPanel } from "@/components/ai/WebSearchPanel";


const SYSTEM_PROMPT = `You are an Iraq market distribution expert with deep knowledge of Iraqi distributors, wholesalers, and logistics companies. Respond ONLY with a valid JSON object:
{
  "summary": "string - 2 sentences about distribution landscape for this product",
  "distributors": [
    {
      "name": "string",
      "type": "Certified Distributor|Wholesaler|Agent|Logistics Partner",
      "city": "string",
      "region": "string e.g. Baghdad/KRG/Basra",
      "specialization": "string - what they distribute",
      "coverage": ["array of areas they cover"],
      "reliability": "High|Medium",
      "minOrder": "string - minimum order value",
      "paymentTerms": "string",
      "contactNotes": "string - how to approach",
      "rating": "number 3.5-5.0"
    }
  ],
  "wholesalers": [
    {
      "name": "string",
      "market": "string - e.g. Al-Shorja Market Baghdad",
      "city": "string",
      "specialization": "string",
      "volume": "string - estimated monthly volume",
      "approach": "string - how to engage"
    }
  ],
  "distributionHubs": [
    {"city":"string","marketName":"string","description":"string","bestFor":["array"]}
  ],
  "approachStrategy": "string - 3-4 sentences on how to find and approach distributors",
  "redFlags": ["array of 3-4 warning signs when selecting distributors in Iraq"],
  "dueDiligenceChecklist": ["array of 5 due diligence steps"]
}`;

const cities = ["All Iraq", "Baghdad", "Erbil (KRG)", "Sulaymaniyah (KRG)", "Basra", "Najaf", "Mosul", "Kirkuk"];
const productCategories = ["Food & Beverages", "FMCG", "Healthcare", "Construction", "Electronics", "Clothing", "Cosmetics", "Industrial"];

export default function DistributorFinder() {
  const [form, setForm] = useState({ product: "", category: "", city: "All Iraq", volume: "" });
  const { result, loading, error, analyze, tokensUsed } = useClaudeAnalysis({ systemPrompt: SYSTEM_PROMPT, agentId: "distributor" });

  const handleSubmit = () => {
    if (!form.product) return;
    analyze(`Find certified distributors and reliable wholesalers for:
Product/Category: ${form.product} - ${form.category}
Target City/Region: ${form.city}
Monthly Volume: ${form.volume}

Provide realistic Iraqi distributor profiles for Erbil, Baghdad, Basra. Include actual market names (Al-Shorja, Nakheel Mall area, etc.). Focus on 2025-2026 Iraq market.`);
  };

  const d = result;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-5 w-5" style={{ color: "hsl(38 95% 52%)" }} />
            <h1 className="text-xl font-bold font-display" style={{ color: "hsl(210 40% 92%)" }}>Distributor Finder</h1>
          </div>
          <p className="text-sm" style={{ color: "hsl(215 25% 55%)" }}>Find certified distributors & wholesalers in Erbil, Baghdad & Basra</p>
        </div>
        <span className="data-pill-green">Service 02</span>
      </div>


      <AIStatusBar agentName="Distributor Agent" tokensUsed={tokensUsed} />
      <WebSearchPanel label="Iraq distributors & wholesalers" />

      <div className="rounded-xl p-6" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="section-label">Product / Category *</label>
            <input className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
              style={{ background: "hsl(216 45% 14%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }}
              placeholder="e.g. Turkish Chocolate, FMCG goods" value={form.product}
              onChange={e => setForm(p => ({ ...p, product: e.target.value }))} />
          </div>
          <div>
            <label className="section-label">Category</label>
            <select className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
              style={{ background: "hsl(216 45% 14%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }}
              value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
              <option value="">Select...</option>
              {productCategories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="section-label">Target City / Region</label>
            <select className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
              style={{ background: "hsl(216 45% 14%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }}
              value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))}>
              {cities.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="section-label">Expected Monthly Volume</label>
            <input className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
              style={{ background: "hsl(216 45% 14%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }}
              placeholder="e.g. $20,000 / 5 tons" value={form.volume}
              onChange={e => setForm(p => ({ ...p, volume: e.target.value }))} />
          </div>
        </div>
        <button onClick={handleSubmit} disabled={loading || !form.product}
          className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50"
          style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
          {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Users className="h-4 w-4" />}
          {loading ? "Searching Distributors..." : "Find Distributors"}
        </button>
      </div>

      {error && <div className="rounded-xl p-4" style={{ background: "hsl(0 72% 51% / 0.1)", border: "1px solid hsl(0 72% 51% / 0.3)" }}><p className="text-sm" style={{ color: "hsl(0 72% 68%)" }}>⚠ {error}</p></div>}
      {loading && <LoadingState message="Searching Iraqi distributor database..." />}
      {!loading && !d && !error && <EmptyState icon={<Users className="h-12 w-12" />} title="Find Your Distribution Partner" description="Search for certified distributors and reliable wholesalers across Iraq's key commercial cities." />}

      {d && !loading && (
        <div className="space-y-5">
          {d.summary && (
            <div className="rounded-xl p-4" style={{ background: "hsl(38 95% 52% / 0.06)", border: "1px solid hsl(38 95% 52% / 0.2)" }}>
              <p className="text-sm" style={{ color: "hsl(215 25% 70%)" }}>{d.summary}</p>
            </div>
          )}

          {/* Distributors */}
          {d.distributors?.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold font-display mb-3" style={{ color: "hsl(210 40% 85%)" }}>
                Certified Distributors ({d.distributors.length} found)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {d.distributors.map((dist: any, i: number) => (
                  <div key={i} className="rounded-xl p-5 space-y-3"
                    style={{ background: "hsl(var(--card))", border: "1px solid hsl(158 64% 40% / 0.25)" }}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-bold font-display" style={{ color: "hsl(210 40% 90%)" }}>{dist.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="data-pill-green" style={{ fontSize: "10px" }}>{dist.type}</span>
                          <span className="flex items-center gap-1 text-xs" style={{ color: "hsl(38 95% 52%)" }}>
                            <MapPin className="h-3 w-3" />{dist.city}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5" style={{ color: "hsl(38 95% 52%)" }} />
                        <span className="text-xs font-bold font-mono-data" style={{ color: "hsl(38 95% 60%)" }}>{dist.rating}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                      <div><p className="section-label">Specialization</p><p className="text-xs" style={{ color: "hsl(215 25% 65%)" }}>{dist.specialization}</p></div>
                      <div><p className="section-label">Min Order</p><p className="text-xs font-semibold" style={{ color: "hsl(38 95% 60%)" }}>{dist.minOrder}</p></div>
                      <div><p className="section-label">Payment Terms</p><p className="text-xs" style={{ color: "hsl(215 25% 65%)" }}>{dist.paymentTerms}</p></div>
                      <div><p className="section-label">Reliability</p>
                        <span className={dist.reliability === "High" ? "data-pill-green" : "data-pill-amber"} style={{ fontSize: "10px" }}>{dist.reliability}</span>
                      </div>
                    </div>
                    {dist.coverage?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {dist.coverage.map((area: string) => <span key={area} className="data-pill-muted" style={{ fontSize: "10px" }}>{area}</span>)}
                      </div>
                    )}
                    {dist.contactNotes && <p className="text-xs italic" style={{ color: "hsl(215 25% 55%)" }}>💡 {dist.contactNotes}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Wholesalers */}
          {d.wholesalers?.length > 0 && (
            <OutputCard title="Reliable Wholesalers" icon={<Building2 className="h-4 w-4" />} variant="amber">
              <div className="space-y-3">
                {d.wholesalers.map((w: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: "hsl(216 45% 14%)" }}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold" style={{ color: "hsl(210 40% 88%)" }}>{w.name}</span>
                        <span className="data-pill-muted" style={{ fontSize: "10px" }}>{w.city}</span>
                      </div>
                      <p className="text-xs mb-1" style={{ color: "hsl(215 25% 60%)" }}>📍 {w.market}</p>
                      <p className="text-xs" style={{ color: "hsl(215 25% 58%)" }}>{w.approach}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="section-label">Volume</p>
                      <p className="text-xs font-semibold font-mono-data" style={{ color: "hsl(38 95% 60%)" }}>{w.volume}</p>
                    </div>
                  </div>
                ))}
              </div>
            </OutputCard>
          )}

          {/* Distribution Hubs */}
          {d.distributionHubs?.length > 0 && (
            <OutputCard title="Key Distribution Hubs" icon={<MapPin className="h-4 w-4" />} variant="blue">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {d.distributionHubs.map((hub: any, i: number) => (
                  <div key={i} className="p-4 rounded-lg" style={{ background: "hsl(216 45% 13%)" }}>
                    <h4 className="text-sm font-semibold mb-0.5" style={{ color: "hsl(217 91% 70%)" }}>{hub.city}</h4>
                    <p className="text-xs mb-2" style={{ color: "hsl(38 95% 52%)" }}>{hub.marketName}</p>
                    <p className="text-xs mb-2" style={{ color: "hsl(215 25% 58%)" }}>{hub.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {hub.bestFor?.map((b: string) => <span key={b} className="data-pill-muted" style={{ fontSize: "10px" }}>{b}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </OutputCard>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {d.dueDiligenceChecklist?.length > 0 && (
              <OutputCard title="Due Diligence Checklist" variant="green">
                {d.dueDiligenceChecklist.map((item: string, i: number) => (
                  <div key={i} className="flex items-start gap-2.5 mb-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                      style={{ background: "hsl(158 64% 40% / 0.15)", color: "hsl(158 64% 55%)" }}>{i + 1}</span>
                    <p className="text-sm" style={{ color: "hsl(215 25% 68%)" }}>{item}</p>
                  </div>
                ))}
              </OutputCard>
            )}

            {d.redFlags?.length > 0 && (
              <OutputCard title="Red Flags to Watch" variant="red">
                {d.redFlags.map((flag: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 mb-2">
                    <span style={{ color: "hsl(0 72% 68%)" }}>⚠</span>
                    <p className="text-sm" style={{ color: "hsl(215 25% 68%)" }}>{flag}</p>
                  </div>
                ))}
                {d.approachStrategy && (
                  <div className="mt-3 pt-3 border-t" style={{ borderColor: "hsl(var(--border))" }}>
                    <p className="text-xs" style={{ color: "hsl(215 25% 60%)" }}>{d.approachStrategy}</p>
                  </div>
                )}
              </OutputCard>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
