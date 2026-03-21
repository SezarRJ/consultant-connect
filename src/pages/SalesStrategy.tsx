import { useState } from "react";
import { Zap, RefreshCw, ShoppingCart, Truck, Monitor, Store } from "lucide-react";
import { useClaudeAnalysis } from "@/hooks/useClaudeAnalysis";
import { OutputCard, DataRow, TagList, LoadingState, EmptyState } from "@/components/analysis/OutputCard";
import { AIStatusBar } from "@/components/ai/AIStatusBar";
import { WebSearchPanel } from "@/components/ai/WebSearchPanel";


const SYSTEM_PROMPT = `You are an Iraq sales strategy expert specializing in FMCG, retail, wholesale, and e-commerce. Respond ONLY with valid JSON:
{
  "summary": "string",
  "primaryChannel": "string",
  "channelStrategy": {
    "supermarketChains": {
      "priority": "High|Medium|Low",
      "keyChains": ["names of major Iraq/KRG supermarket chains"],
      "listingRequirements": ["array"],
      "marginExpected": "string",
      "approach": "string",
      "timeline": "string"
    },
    "wholesalers": {
      "priority": "High|Medium|Low",
      "keyMarkets": ["major wholesale markets in Iraq"],
      "minOrderValue": "string",
      "paymentTerms": "string",
      "approach": "string"
    },
    "cashVanDistribution": {
      "priority": "High|Medium|Low",
      "description": "string",
      "coverage": ["cities where cash van works best"],
      "requirements": ["array"],
      "dailySalesTarget": "string"
    },
    "ecommerce": {
      "priority": "High|Medium|Low",
      "platforms": ["Iraq e-commerce platforms"],
      "marketSize": "string",
      "challenges": ["array"],
      "opportunities": ["array"]
    }
  },
  "salesProcess": ["array of 6 steps for B2B sales in Iraq"],
  "pricingForChannels": [
    {"channel":"string","recommendedMargin":"string","notes":"string"}
  ],
  "marketingTactics": {
    "digital": ["array of digital marketing tactics for Iraq"],
    "traditional": ["array of traditional marketing tactics"],
    "tradeMarketing": ["array of in-store/trade tactics"]
  },
  "kpis": [{"metric":"string","target":"string","timeline":"string"}],
  "salesTeamStructure": "string - recommended team structure",
  "quickWins": ["array of 4-5 quick wins to get first sales fast"]
}`;

export default function SalesStrategy() {
  const [form, setForm] = useState({ product: "", category: "", budget: "Medium", existingChannels: "" });
  const { result, loading, error, analyze, tokensUsed, responseTime, jsonValid, modelUsed } = useClaudeAnalysis({ systemPrompt: SYSTEM_PROMPT, agentId: "sales", modelTier: "flash-lite" });

  const handleSubmit = () => {
    if (!form.product) return;
    analyze(`Generate a comprehensive Iraq sales strategy for:
Product/Category: ${form.product} / ${form.category}
Budget Level: ${form.budget}
Existing Channels: ${form.existingChannels || "None yet"}

Focus on supermarket chains, wholesalers, cash van distribution, and e-commerce in Iraq and KRG.`);
  };

  const d = result;
  const channelIcons: Record<string, any> = {
    supermarketChains: Store,
    wholesalers: ShoppingCart,
    cashVanDistribution: Truck,
    ecommerce: Monitor,
  };
  const channelTitles: Record<string, string> = {
    supermarketChains: "Supermarket Chains",
    wholesalers: "Wholesale Markets",
    cashVanDistribution: "Cash Van Distribution",
    ecommerce: "E-Commerce",
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-5 w-5" style={{ color: "hsl(38 95% 52%)" }} />
            <h1 className="text-xl font-bold font-display" style={{ color: "hsl(210 40% 92%)" }}>Sales Strategy Generator</h1>
          </div>
          <p className="text-sm" style={{ color: "hsl(215 25% 55%)" }}>Supermarket chains, wholesalers, cash van distribution & e-commerce strategy</p>
        </div>
        <span className="data-pill-blue">Service 07</span>
      </div>


      <AIStatusBar agentName="Sales Strategy Agent" tokensUsed={tokensUsed} responseTime={responseTime} jsonValid={jsonValid} modelUsed={modelUsed} />
      <WebSearchPanel label="Sales channels & distribution trends" />

      <div className="rounded-xl p-6" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="section-label">Product *</label>
            <input className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
              style={{ background: "hsl(216 45% 14%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }}
              placeholder="e.g. Fruit Juices, Snack Foods" value={form.product}
              onChange={e => setForm(p => ({ ...p, product: e.target.value }))} />
          </div>
          <div>
            <label className="section-label">Category</label>
            <input className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
              style={{ background: "hsl(216 45% 14%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }}
              placeholder="e.g. FMCG / Food & Beverages" value={form.category}
              onChange={e => setForm(p => ({ ...p, category: e.target.value }))} />
          </div>
          <div>
            <label className="section-label">Sales & Marketing Budget</label>
            <select className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
              style={{ background: "hsl(216 45% 14%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }}
              value={form.budget} onChange={e => setForm(p => ({ ...p, budget: e.target.value }))}>
              {["Low (<$10k/yr)", "Medium ($10k-$50k/yr)", "High ($50k+/yr)"].map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="section-label">Existing Sales Channels</label>
            <input className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
              style={{ background: "hsl(216 45% 14%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }}
              placeholder="e.g. None / Some wholesalers" value={form.existingChannels}
              onChange={e => setForm(p => ({ ...p, existingChannels: e.target.value }))} />
          </div>
        </div>
        <button onClick={handleSubmit} disabled={loading || !form.product}
          className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50"
          style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
          {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
          {loading ? "Building Strategy..." : "Generate Sales Strategy"}
        </button>
      </div>

      {error && <div className="rounded-xl p-4" style={{ background: "hsl(0 72% 51% / 0.1)", border: "1px solid hsl(0 72% 51% / 0.3)" }}><p className="text-sm" style={{ color: "hsl(0 72% 68%)" }}>⚠ {error}</p></div>}
      {loading && <LoadingState message="Building your Iraq sales strategy..." />}
      {!loading && !d && !error && <EmptyState icon={<Zap className="h-12 w-12" />} title="Sales Strategy Generator" description="Get a tailored sales strategy covering supermarkets, wholesalers, cash van and e-commerce for Iraq." />}

      {d && !loading && (
        <div className="space-y-5">
          {d.summary && (
            <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: "hsl(38 95% 52% / 0.06)", border: "1px solid hsl(38 95% 52% / 0.2)" }}>
              <Zap className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "hsl(38 95% 52%)" }} />
              <p className="text-sm" style={{ color: "hsl(215 25% 70%)" }}>{d.summary}</p>
            </div>
          )}

          {/* Channel Strategy */}
          {d.channelStrategy && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(d.channelStrategy).map(([key, channel]: [string, any]) => {
                if (!channel) return null;
                const Icon = channelIcons[key] || Store;
                const priorityColor = channel.priority === "High" ? "green" : channel.priority === "Medium" ? "amber" : "default";
                return (
                  <OutputCard key={key} title={channelTitles[key] || key} icon={<Icon className="h-4 w-4" />} variant={priorityColor as any}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`data-pill-${channel.priority === "High" ? "green" : channel.priority === "Medium" ? "amber" : "muted"}`}>
                        {channel.priority} Priority
                      </span>
                    </div>

                    {channel.keyChains && (
                      <div className="mb-3">
                        <p className="section-label mb-1.5">Key Chains</p>
                        <TagList items={channel.keyChains} variant="green" />
                      </div>
                    )}
                    {channel.keyMarkets && (
                      <div className="mb-3">
                        <p className="section-label mb-1.5">Key Markets</p>
                        <TagList items={channel.keyMarkets} variant="amber" />
                      </div>
                    )}
                    {channel.platforms && (
                      <div className="mb-3">
                        <p className="section-label mb-1.5">Platforms</p>
                        <TagList items={channel.platforms} variant="blue" />
                      </div>
                    )}
                    {channel.coverage && (
                      <div className="mb-3">
                        <p className="section-label mb-1.5">Best Cities</p>
                        <TagList items={channel.coverage} variant="muted" />
                      </div>
                    )}
                    {channel.approach && <p className="text-xs italic" style={{ color: "hsl(215 25% 58%)" }}>💡 {channel.approach}</p>}
                    {channel.marginExpected && <DataRow label="Expected Margin" value={channel.marginExpected} />}
                    {channel.minOrderValue && <DataRow label="Min Order" value={channel.minOrderValue} />}
                    {channel.dailySalesTarget && <DataRow label="Daily Target" value={channel.dailySalesTarget} />}
                    {channel.timeline && <DataRow label="Timeline" value={channel.timeline} />}
                  </OutputCard>
                );
              })}
            </div>
          )}

          {/* Quick Wins */}
          {d.quickWins?.length > 0 && (
            <OutputCard title="⚡ Quick Wins — First Sales Fast" variant="amber">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {d.quickWins.map((win: string, i: number) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                      style={{ background: "hsl(38 95% 52% / 0.15)", color: "hsl(38 95% 60%)" }}>{i + 1}</span>
                    <p className="text-sm" style={{ color: "hsl(215 25% 68%)" }}>{win}</p>
                  </div>
                ))}
              </div>
            </OutputCard>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Sales Process */}
            {d.salesProcess?.length > 0 && (
              <OutputCard title="B2B Sales Process in Iraq" variant="blue">
                {d.salesProcess.map((step: string, i: number) => (
                  <div key={i} className="flex items-start gap-2.5 mb-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                      style={{ background: "hsl(217 91% 53% / 0.15)", color: "hsl(217 91% 70%)" }}>{i + 1}</span>
                    <p className="text-sm" style={{ color: "hsl(215 25% 68%)" }}>{step}</p>
                  </div>
                ))}
              </OutputCard>
            )}

            {/* Marketing Tactics */}
            {d.marketingTactics && (
              <OutputCard title="Marketing Tactics" variant="default">
                {d.marketingTactics.digital?.length > 0 && (
                  <div className="mb-3">
                    <p className="section-label mb-1.5">Digital</p>
                    <TagList items={d.marketingTactics.digital} variant="blue" />
                  </div>
                )}
                {d.marketingTactics.traditional?.length > 0 && (
                  <div className="mb-3">
                    <p className="section-label mb-1.5">Traditional</p>
                    <TagList items={d.marketingTactics.traditional} variant="amber" />
                  </div>
                )}
                {d.marketingTactics.tradeMarketing?.length > 0 && (
                  <div>
                    <p className="section-label mb-1.5">Trade Marketing</p>
                    <TagList items={d.marketingTactics.tradeMarketing} variant="green" />
                  </div>
                )}
              </OutputCard>
            )}
          </div>

          {/* Channel Pricing & KPIs */}
          {d.pricingForChannels?.length > 0 && (
            <OutputCard title="Channel Pricing Guide" variant="amber">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    {["Channel", "Recommended Margin", "Notes"].map(h => (
                      <th key={h} className="text-left pb-3 pr-6 text-xs font-semibold uppercase tracking-wider" style={{ color: "hsl(215 25% 50%)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {d.pricingForChannels.map((row: any, i: number) => (
                    <tr key={i} style={{ borderTop: "1px solid hsl(var(--border))" }}>
                      <td className="py-2.5 pr-6 font-medium text-xs" style={{ color: "hsl(210 40% 85%)" }}>{row.channel}</td>
                      <td className="py-2.5 pr-6 font-mono-data text-xs" style={{ color: "hsl(38 95% 60%)" }}>{row.recommendedMargin}</td>
                      <td className="py-2.5 text-xs" style={{ color: "hsl(215 25% 60%)" }}>{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </OutputCard>
          )}
        </div>
      )}
    </div>
  );
}
