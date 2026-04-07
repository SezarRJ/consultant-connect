import { useState } from "react";
import {
  Radio, Sparkles, RefreshCw, TrendingUp, Globe, AlertTriangle,
  Lightbulb, BarChart2, ArrowRight, Clock, Star, Filter
} from "lucide-react";
import { useClaudeAnalysis } from "@/hooks/useClaudeAnalysis";
import { toast } from "sonner";
import { AIDisclaimer } from "@/components/ai/AIDisclaimer";

const SYSTEM_PROMPT = `You are a senior MENA business intelligence analyst. Generate a curated insights briefing for a consultancy team focused on Iraq and MENA markets. Respond ONLY with valid JSON:
{
  "generatedAt": "string — today's date",
  "headline": "string — one punchy market headline",
  "marketPulse": "string — 2-3 sentence overview of current MENA market conditions",
  "insights": [
    {
      "category": "Market Trend|Risk Alert|Opportunity|Regulatory|Economic|Sector Watch",
      "title": "string",
      "summary": "string — 2-3 sentences",
      "implication": "string — what this means for consultancy clients",
      "urgency": "High|Medium|Low",
      "sectors": ["string"],
      "markets": ["string"]
    }
  ],
  "sectorSpotlight": {
    "sector": "string",
    "insight": "string",
    "keyData": "string",
    "consultancyAngle": "string"
  },
  "clientAlerts": [
    { "alert": "string", "action": "string" }
  ],
  "weeklyFocus": "string — one strategic priority for the consulting team this week"
}`;

const FOCUS_TOPICS = [
  "Iraq Economy & Business Environment",
  "FMCG & Consumer Markets",
  "Real Estate & Construction",
  "Energy & Oil Sector",
  "Regulatory & Trade Policy",
  "GCC Market Dynamics",
  "Investment Climate MENA",
];

const CATEGORY_COLORS: Record<string, string> = {
  "Market Trend":  "hsl(217 91% 70%)",
  "Risk Alert":    "hsl(0 72% 68%)",
  "Opportunity":   "hsl(158 64% 55%)",
  "Regulatory":    "hsl(280 80% 70%)",
  "Economic":      "hsl(38 95% 60%)",
  "Sector Watch":  "hsl(38 95% 60%)",
};

const URGENCY_COLORS: Record<string, string> = {
  High: "hsl(0 72% 68%)", Medium: "hsl(38 95% 60%)", Low: "hsl(215 25% 55%)"
};

const SAVED_KEY = "consultai_saved_insights";

export default function InsightsFeed() {
  const [topics, setTopics] = useState<string[]>(["Iraq Economy & Business Environment", "FMCG & Consumer Markets"]);
  const [customContext, setCustomContext] = useState("");
  const [savedInsights, setSavedInsights] = useState<any[]>(() => {
    try { return JSON.parse(localStorage.getItem(SAVED_KEY) || "[]"); } catch { return []; }
  });

  const { result, loading, error, analyze } = useClaudeAnalysis({
    systemPrompt: SYSTEM_PROMPT, agentId: "insights-feed", modelTier: "flash"
  });

  const toggleTopic = (t: string) => {
    setTopics(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  };

  const generate = () => {
    if (topics.length === 0) { toast.error("Select at least one focus topic"); return; }
    const prompt = `Generate a comprehensive insights briefing for a consultancy team.\n\nFocus Topics: ${topics.join(", ")}\nDate: ${new Date().toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}\nAdditional Context: ${customContext || "General MENA consultancy focus"}\n\nProvide 6-8 insights covering the selected topics, current market conditions, risks, and opportunities.`;
    analyze(prompt);
  };

  const saveInsight = (insight: any) => {
    const updated = [{ ...insight, savedAt: new Date().toISOString() }, ...savedInsights];
    setSavedInsights(updated);
    localStorage.setItem(SAVED_KEY, JSON.stringify(updated));
    toast.success("Insight saved to your library");
  };

  const IS = { background: "hsl(216 45% 12%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" };
  const r = result;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display" style={{ color: "hsl(210 40% 94%)" }}>Insights Feed</h1>
          <p className="text-sm mt-1" style={{ color: "hsl(215 25% 55%)" }}>
            AI-curated market intelligence briefings for your consulting team — tailored to MENA & Iraq
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" style={{ color: "hsl(215 25% 45%)" }} />
          <span className="text-xs" style={{ color: "hsl(215 25% 45%)" }}>
            {new Date().toLocaleDateString("en-GB", { weekday: "long", month: "long", day: "numeric" })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Controls */}
        <div className="space-y-4">
          <div className="rounded-xl p-4 space-y-3" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "hsl(38 95% 52%)" }}>Focus Topics</p>
            <div className="space-y-1.5">
              {FOCUS_TOPICS.map(t => (
                <button key={t} onClick={() => toggleTopic(t)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all"
                  style={{
                    background: topics.includes(t) ? "hsl(38 95% 52%/0.12)" : "transparent",
                    border: `1px solid ${topics.includes(t) ? "hsl(38 95% 52%/0.3)" : "transparent"}`,
                  }}>
                  <div className="h-2 w-2 rounded-full shrink-0" style={{
                    background: topics.includes(t) ? "hsl(38 95% 52%)" : "hsl(216 45% 25%)"
                  }} />
                  <span className="text-xs" style={{ color: topics.includes(t) ? "hsl(38 95% 65%)" : "hsl(215 25% 60%)" }}>{t}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-4 space-y-3" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "hsl(38 95% 52%)" }}>Custom Context</p>
            <textarea value={customContext} onChange={e => setCustomContext(e.target.value)} rows={3}
              placeholder="Specific client industries, active projects, recent news to incorporate..."
              className="w-full px-3 py-2 rounded-lg text-sm resize-none" style={IS} />
          </div>

          <button onClick={generate} disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold"
            style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)", opacity: loading ? 0.7 : 1 }}>
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Radio className="h-4 w-4" />}
            {loading ? "Generating..." : "Generate Briefing"}
          </button>

          {/* Saved */}
          {savedInsights.length > 0 && (
            <div className="rounded-xl p-4" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
              <p className="text-xs font-bold mb-3 uppercase tracking-widest" style={{ color: "hsl(215 25% 45%)" }}>
                Saved ({savedInsights.length})
              </p>
              <div className="space-y-2">
                {savedInsights.slice(0, 3).map((s, i) => (
                  <div key={i} className="rounded-lg p-2" style={{ background: "hsl(216 45% 12%)" }}>
                    <p className="text-[10px] font-semibold" style={{ color: "hsl(210 40% 80%)" }}>{s.title}</p>
                    <p className="text-[9px] mt-0.5" style={{ color: "hsl(215 25% 40%)" }}>{s.category}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Insights Feed */}
        <div className="lg:col-span-3 space-y-4">

          {!r && !loading && (
            <div className="flex flex-col items-center justify-center h-64 rounded-xl"
              style={{ background: "hsl(var(--card))", border: "1px dashed hsl(var(--border))" }}>
              <Radio className="h-10 w-10 mb-3" style={{ color: "hsl(215 25% 35%)" }} />
              <p className="text-sm font-semibold" style={{ color: "hsl(215 25% 45%)" }}>Select topics and generate your briefing</p>
              <p className="text-xs mt-1" style={{ color: "hsl(215 25% 35%)" }}>AI-curated insights will appear here</p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center h-64 rounded-xl"
              style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
              <RefreshCw className="h-8 w-8 animate-spin mb-3" style={{ color: "hsl(38 95% 52%)" }} />
              <p className="text-sm" style={{ color: "hsl(215 25% 55%)" }}>Scanning MENA markets...</p>
            </div>
          )}

          {r && !loading && (
          <>
            <AIDisclaimer compact />
              {/* Headline Banner */}
              <div className="rounded-xl p-5"
                style={{ background: "linear-gradient(135deg, hsl(216 52% 10%), hsl(216 52% 13%))", border: "1px solid hsl(38 95% 52%/0.25)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4" style={{ color: "hsl(38 95% 52%)" }} />
                  <span className="text-[10px] font-bold" style={{ color: "hsl(38 95% 52%)" }}>TODAY'S MARKET HEADLINE</span>
                </div>
                <h2 className="text-lg font-bold mb-2" style={{ color: "hsl(210 40% 94%)" }}>{r.headline}</h2>
                <p className="text-sm" style={{ color: "hsl(215 25% 65%)" }}>{r.marketPulse}</p>
              </div>

              {/* Weekly Focus */}
              {r.weeklyFocus && (
                <div className="rounded-xl p-4 flex items-start gap-3"
                  style={{ background: "hsl(217 91% 53%/0.1)", border: "1px solid hsl(217 91% 53%/0.25)" }}>
                  <Star className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "hsl(217 91% 70%)" }} />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: "hsl(217 91% 70%)" }}>
                      Team Focus This Week
                    </p>
                    <p className="text-sm" style={{ color: "hsl(215 25% 70%)" }}>{r.weeklyFocus}</p>
                  </div>
                </div>
              )}

              {/* Client Alerts */}
              {r.clientAlerts?.length > 0 && (
                <div className="rounded-xl p-4" style={{ background: "hsl(0 72% 51%/0.08)", border: "1px solid hsl(0 72% 51%/0.25)" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-4 w-4" style={{ color: "hsl(0 72% 68%)" }} />
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "hsl(0 72% 68%)" }}>Client Alerts</p>
                  </div>
                  <div className="space-y-2">
                    {r.clientAlerts.map((a: any, i: number) => (
                      <div key={i} className="flex items-start gap-2">
                        <ArrowRight className="h-3 w-3 mt-0.5 shrink-0" style={{ color: "hsl(0 72% 68%)" }} />
                        <div>
                          <p className="text-xs font-medium" style={{ color: "hsl(210 40% 82%)" }}>{a.alert}</p>
                          <p className="text-[10px]" style={{ color: "hsl(215 25% 55%)" }}>Action: {a.action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Insights Grid */}
              <div className="space-y-3">
                {(r.insights || []).map((insight: any, i: number) => {
                  const catColor = CATEGORY_COLORS[insight.category] || "hsl(38 95% 60%)";
                  const urgColor = URGENCY_COLORS[insight.urgency] || "hsl(215 25% 55%)";
                  return (
                    <div key={i} className="rounded-xl p-4"
                      style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className="text-[9px] px-2 py-0.5 rounded-full font-bold"
                              style={{ background: `${catColor}20`, color: catColor, border: `1px solid ${catColor}30` }}>
                              {insight.category}
                            </span>
                            <span className="text-[9px] px-2 py-0.5 rounded-full font-bold"
                              style={{ background: `${urgColor}20`, color: urgColor }}>
                              {insight.urgency} Urgency
                            </span>
                            {(insight.markets || []).slice(0, 2).map((m: string) => (
                              <span key={m} className="text-[9px] px-2 py-0.5 rounded-full"
                                style={{ background: "hsl(216 45% 18%)", color: "hsl(215 25% 55%)" }}>{m}</span>
                            ))}
                          </div>
                          <h3 className="text-sm font-semibold" style={{ color: "hsl(210 40% 92%)" }}>{insight.title}</h3>
                        </div>
                        <button onClick={() => saveInsight(insight)}
                          className="p-1.5 rounded-lg hover:bg-white/5 transition-all shrink-0">
                          <Star className="h-3.5 w-3.5" style={{ color: "hsl(215 25% 40%)" }} />
                        </button>
                      </div>
                      <p className="text-xs mb-3" style={{ color: "hsl(215 25% 65%)" }}>{insight.summary}</p>
                      <div className="rounded-lg p-3" style={{ background: "hsl(216 45% 11%)" }}>
                        <p className="text-[9px] font-bold mb-1 uppercase tracking-wide" style={{ color: "hsl(38 95% 52%)" }}>
                          Consultancy Implication
                        </p>
                        <p className="text-[11px]" style={{ color: "hsl(215 25% 65%)" }}>{insight.implication}</p>
                      </div>
                      {insight.sectors?.length > 0 && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {insight.sectors.map((s: string) => (
                            <span key={s} className="text-[9px] px-1.5 py-0.5 rounded"
                              style={{ background: "hsl(216 45% 16%)", color: "hsl(215 25% 50%)" }}>{s}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Sector Spotlight */}
              {r.sectorSpotlight && (
                <div className="rounded-xl p-5"
                  style={{ background: "hsl(158 64% 40%/0.08)", border: "1px solid hsl(158 64% 40%/0.25)" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="h-4 w-4" style={{ color: "hsl(158 64% 55%)" }} />
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "hsl(158 64% 55%)" }}>
                      Sector Spotlight: {r.sectorSpotlight.sector}
                    </span>
                  </div>
                  <p className="text-sm mb-2" style={{ color: "hsl(215 25% 70%)" }}>{r.sectorSpotlight.insight}</p>
                  {r.sectorSpotlight.keyData && (
                    <p className="text-xs mb-2 font-semibold" style={{ color: "hsl(38 95% 60%)" }}>{r.sectorSpotlight.keyData}</p>
                  )}
                  <p className="text-xs" style={{ color: "hsl(215 25% 60%)" }}>
                    <span className="font-semibold" style={{ color: "hsl(158 64% 55%)" }}>For your practice: </span>
                    {r.sectorSpotlight.consultancyAngle}
                  </p>
                </div>
              )}
            </>
          </>
          )}
        </div>
      </div>
    </div>
  );
}
