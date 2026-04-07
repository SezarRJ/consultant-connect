import { useState } from "react";
import {
  Library, Search, ChevronRight, Download, BookOpen, Target,
  TrendingUp, Shield, Users, Globe, Zap, Star, Clock, Tag,
  CheckSquare, ArrowRight, Sparkles, RefreshCw
} from "lucide-react";
import { useClaudeAnalysis } from "@/hooks/useClaudeAnalysis";
import { toast } from "sonner";
import { AIDisclaimer } from "@/components/ai/AIDisclaimer";

const SYSTEM_PROMPT = `You are a senior management consultant with 20+ years MENA experience. Generate a detailed consulting playbook for the selected topic. Respond ONLY with valid JSON:
{
  "playbookTitle": "string",
  "objective": "string",
  "whenToUse": "string",
  "estimatedDuration": "string",
  "teamRequired": ["string"],
  "phases": [
    {
      "phase": "string",
      "duration": "string",
      "objective": "string",
      "activities": ["string"],
      "deliverables": ["string"],
      "tools": ["string"]
    }
  ],
  "keyQuestions": ["string"],
  "commonPitfalls": ["string"],
  "successMetrics": ["string"],
  "clientCommunication": "string",
  "typicalCost": "string",
  "referenceCases": ["string"]
}`;

interface Playbook {
  id: string;
  title: string;
  category: string;
  icon: any;
  color: string;
  desc: string;
  duration: string;
  complexity: "Low" | "Medium" | "High";
  tags: string[];
  uses: number;
}

const PLAYBOOKS: Playbook[] = [
  {
    id: "market-entry", title: "Market Entry — Iraq/MENA", category: "Strategy",
    icon: Globe, color: "hsl(217 91% 70%)", desc: "Full-cycle market entry for Iraq: sizing, competition, distribution, RTM and regulatory pathway",
    duration: "4–8 weeks", complexity: "High", tags: ["Iraq", "MENA", "Distribution", "Regulatory"], uses: 24
  },
  {
    id: "feasibility", title: "Business Feasibility Study", category: "Analysis",
    icon: Target, color: "hsl(38 95% 60%)", desc: "Financial modeling, market validation, operational assumptions and GO/NO-GO decision framework",
    duration: "3–6 weeks", complexity: "High", tags: ["Finance", "Investment", "IRR", "Real Estate"], uses: 18
  },
  {
    id: "distributor-onboard", title: "Distributor Assessment & Onboarding", category: "Commercial",
    icon: Users, color: "hsl(158 64% 55%)", desc: "Score, select, negotiate with and onboard distribution partners across Iraqi governorates",
    duration: "2–4 weeks", complexity: "Medium", tags: ["FMCG", "Distribution", "Partners", "Iraq"], uses: 31
  },
  {
    id: "sales-rtm", title: "Sales & Route-to-Market Design", category: "Commercial",
    icon: Zap, color: "hsl(38 95% 60%)", desc: "Design territory coverage, van sales structure, incentives, and outlet universe for Iraq/MENA markets",
    duration: "3–5 weeks", complexity: "High", tags: ["Sales", "RTM", "FMCG", "Field Force"], uses: 19
  },
  {
    id: "competitor-deep", title: "Competitor Intelligence Deep Dive", category: "Research",
    icon: TrendingUp, color: "hsl(280 80% 70%)", desc: "Systematic primary and secondary competitive analysis: pricing, coverage, strengths, vulnerabilities",
    duration: "2–3 weeks", complexity: "Medium", tags: ["Research", "Competition", "Pricing"], uses: 27
  },
  {
    id: "iso-prep", title: "ISO Certification Preparation", category: "Compliance",
    icon: Shield, color: "hsl(158 64% 55%)", desc: "Gap analysis to certification: ISO 9001, 14001, 45001, 27001 — full documentation and audit readiness",
    duration: "3–9 months", complexity: "High", tags: ["ISO", "Quality", "Compliance", "Documentation"], uses: 12
  },
  {
    id: "company-dev", title: "Company Development & Structure", category: "Organization",
    icon: Users, color: "hsl(217 91% 70%)", desc: "Design org structure, job architecture, salary bands, HR policies and governance framework",
    duration: "4–8 weeks", complexity: "Medium", tags: ["HR", "Organization", "Leadership", "Structure"], uses: 9
  },
  {
    id: "risk-register", title: "Risk Assessment & Mitigation", category: "Risk",
    icon: Shield, color: "hsl(0 72% 68%)", desc: "Build risk registers, score impact/likelihood, design controls and contingency plans for Iraq market",
    duration: "1–2 weeks", complexity: "Low", tags: ["Risk", "Iraq", "Regulatory", "Operational"], uses: 22
  },
  {
    id: "export-readiness", title: "Export Readiness Assessment", category: "Trade",
    icon: Globe, color: "hsl(38 95% 60%)", desc: "Evaluate product compliance, documentation, logistics, payment terms and market fit for export markets",
    duration: "2–3 weeks", complexity: "Medium", tags: ["Export", "Trade", "Compliance", "Logistics"], uses: 14
  },
];

const CATEGORIES = ["All", "Strategy", "Analysis", "Commercial", "Research", "Compliance", "Organization", "Risk", "Trade"];

const COMPLEXITY_COLORS = {
  Low: "hsl(158 64% 55%)", Medium: "hsl(38 95% 60%)", High: "hsl(0 72% 68%)"
};

export default function PlaybookLibrary() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | null>(null);
  const [customContext, setCustomContext] = useState("");

  const { result, loading, error, analyze, responseTime } = useClaudeAnalysis({
    systemPrompt: SYSTEM_PROMPT, agentId: "playbook", modelTier: "flash"
  });

  const filtered = PLAYBOOKS.filter(p =>
    (category === "All" || p.category === category) &&
    (search === "" || p.title.toLowerCase().includes(search.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(search.toLowerCase())))
  );

  const generatePlaybook = (pb: Playbook) => {
    setSelectedPlaybook(pb);
    const prompt = `Generate a detailed consulting playbook for: ${pb.title}\n\nContext: ${pb.desc}\nExpected Duration: ${pb.duration}\nComplexity: ${pb.complexity}\n\nSpecific Context / Customization: ${customContext || "Standard engagement, Iraq/MENA market focus"}\n\nMake this highly practical and specific to MENA/Iraq market realities.`;
    analyze(prompt);
  };

  const IS = { background: "hsl(216 45% 12%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" };
  const r = result;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-display" style={{ color: "hsl(210 40% 94%)" }}>Playbook Library</h1>
        <p className="text-sm mt-1" style={{ color: "hsl(215 25% 55%)" }}>
          Pre-built consulting methodologies — generate customized playbooks for any engagement type
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Library Browser */}
        <div className="lg:col-span-2 space-y-4">

          {/* Search + Filter */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "hsl(215 25% 40%)" }} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search playbooks..." className="w-full pl-8 pr-3 py-2 rounded-lg text-sm" style={IS} />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-1">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all"
                style={{
                  background: category === c ? "hsl(38 95% 52%)" : "hsl(216 45% 18%)",
                  color: category === c ? "hsl(216 58% 6%)" : "hsl(215 25% 55%)",
                }}>
                {c}
              </button>
            ))}
          </div>

          {/* Playbook Cards */}
          <div className="space-y-2">
            {filtered.map(pb => {
              const isSel = selectedPlaybook?.id === pb.id;
              return (
                <div key={pb.id} onClick={() => setSelectedPlaybook(pb)}
                  className="rounded-xl p-4 cursor-pointer transition-all"
                  style={{
                    background: "hsl(var(--card))",
                    border: `1px solid ${isSel ? "hsl(38 95% 52%/0.5)" : "hsl(var(--border))"}`,
                  }}>
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
                      style={{ background: `${pb.color}15`, border: `1px solid ${pb.color}30` }}>
                      <pb.icon className="h-4.5 w-4.5" style={{ color: pb.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <p className="text-xs font-semibold leading-tight" style={{ color: "hsl(210 40% 88%)" }}>{pb.title}</p>
                        <ChevronRight className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: "hsl(215 25% 40%)" }} />
                      </div>
                      <p className="text-[10px] mt-0.5" style={{ color: "hsl(215 25% 50%)" }}>{pb.category} · {pb.duration}</p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold"
                          style={{ background: `${COMPLEXITY_COLORS[pb.complexity]}20`, color: COMPLEXITY_COLORS[pb.complexity] }}>
                          {pb.complexity}
                        </span>
                        <span className="text-[9px]" style={{ color: "hsl(215 25% 40%)" }}>· {pb.uses} uses</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Playbook Detail & Generator */}
        <div className="lg:col-span-3 space-y-4">

          {!selectedPlaybook && (
            <div className="flex flex-col items-center justify-center h-64 rounded-xl"
              style={{ background: "hsl(var(--card))", border: "1px dashed hsl(var(--border))" }}>
              <Library className="h-10 w-10 mb-3" style={{ color: "hsl(215 25% 35%)" }} />
              <p className="text-sm font-semibold" style={{ color: "hsl(215 25% 45%)" }}>Select a playbook to view and customize</p>
            </div>
          )}

          {selectedPlaybook && !r && (
            <div className="rounded-xl p-5 space-y-5" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
              {/* Playbook Header */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ background: `${selectedPlaybook.color}15`, border: `1px solid ${selectedPlaybook.color}30` }}>
                  <selectedPlaybook.icon className="h-6 w-6" style={{ color: selectedPlaybook.color }} />
                </div>
                <div>
                  <h2 className="text-lg font-bold" style={{ color: "hsl(210 40% 94%)" }}>{selectedPlaybook.title}</h2>
                  <p className="text-xs" style={{ color: "hsl(215 25% 55%)" }}>
                    {selectedPlaybook.category} · {selectedPlaybook.duration} · {selectedPlaybook.complexity} Complexity
                  </p>
                </div>
              </div>

              <p className="text-sm" style={{ color: "hsl(215 25% 65%)" }}>{selectedPlaybook.desc}</p>

              <div className="flex flex-wrap gap-1">
                {selectedPlaybook.tags.map(t => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: "hsl(216 45% 18%)", color: "hsl(215 25% 55%)" }}>{t}</span>
                ))}
              </div>

              {/* Custom Context */}
              <div>
                <label className="text-[10px] mb-1 block font-semibold uppercase tracking-wide" style={{ color: "hsl(215 25% 45%)" }}>
                  Customize for your engagement
                </label>
                <textarea value={customContext} onChange={e => setCustomContext(e.target.value)} rows={3}
                  placeholder="Describe your specific client, industry, market, and any unique constraints..."
                  className="w-full px-3 py-2 rounded-lg text-sm resize-none" style={IS} />
              </div>

              <button onClick={() => generatePlaybook(selectedPlaybook)} disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold"
                style={{ background: selectedPlaybook.color, color: "hsl(216 58% 6%)", opacity: loading ? 0.7 : 1 }}>
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {loading ? "Generating Playbook..." : "Generate Custom Playbook"}
              </button>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center h-64 rounded-xl"
              style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
              <RefreshCw className="h-8 w-8 animate-spin mb-3" style={{ color: selectedPlaybook?.color || "hsl(38 95% 52%)" }} />
              <p className="text-sm" style={{ color: "hsl(215 25% 55%)" }}>Building your playbook...</p>
            </div>
          )}

          {r && !loading && (
          <>
          <AIDisclaimer compact />
            <div className="space-y-4">
              {/* Header */}
              <div className="rounded-xl p-5" style={{ background: "hsl(216 45% 12%)" }}>
                <h2 className="text-lg font-bold mb-1" style={{ color: "hsl(210 40% 94%)" }}>{r.playbookTitle}</h2>
                <p className="text-sm mb-3" style={{ color: "hsl(215 25% 65%)" }}>{r.objective}</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Duration",    value: r.estimatedDuration, color: "hsl(38 95% 60%)"  },
                    { label: "When to Use", value: r.whenToUse?.slice(0, 40) + "...", color: "hsl(217 91% 70%)" },
                    { label: "Typical Cost", value: r.typicalCost, color: "hsl(158 64% 55%)" },
                  ].map((m, i) => (
                    <div key={i}>
                      <p className="text-[9px] mb-0.5 uppercase" style={{ color: "hsl(215 25% 40%)" }}>{m.label}</p>
                      <p className="text-xs font-bold" style={{ color: m.color }}>{m.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Phases */}
              {r.phases?.map((phase: any, i: number) => (
                <div key={i} className="rounded-xl overflow-hidden" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
                  <div className="px-5 py-3 flex items-center justify-between" style={{ background: "hsl(216 45% 11%)", borderBottom: "1px solid hsl(var(--border))" }}>
                    <div className="flex items-center gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
                        style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>{i + 1}</div>
                      <div>
                        <p className="text-sm font-bold" style={{ color: "hsl(210 40% 92%)" }}>{phase.phase}</p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full"
                      style={{ background: "hsl(216 45% 18%)", color: "hsl(38 95% 60%)" }}>{phase.duration}</span>
                  </div>
                  <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-[9px] mb-2 font-semibold uppercase tracking-wide" style={{ color: "hsl(38 95% 52%)" }}>Activities</p>
                      <div className="space-y-1">
                        {phase.activities?.slice(0, 4).map((a: string, j: number) => (
                          <div key={j} className="flex items-start gap-1.5">
                            <CheckSquare className="h-3 w-3 mt-0.5 shrink-0" style={{ color: "hsl(38 95% 52%)" }} />
                            <p className="text-[10px]" style={{ color: "hsl(215 25% 65%)" }}>{a}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[9px] mb-2 font-semibold uppercase tracking-wide" style={{ color: "hsl(158 64% 50%)" }}>Deliverables</p>
                      <div className="space-y-1">
                        {phase.deliverables?.map((d: string, j: number) => (
                          <div key={j} className="flex items-start gap-1.5">
                            <ArrowRight className="h-3 w-3 mt-0.5 shrink-0" style={{ color: "hsl(158 64% 55%)" }} />
                            <p className="text-[10px]" style={{ color: "hsl(215 25% 65%)" }}>{d}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[9px] mb-2 font-semibold uppercase tracking-wide" style={{ color: "hsl(217 91% 70%)" }}>Tools & Frameworks</p>
                      <div className="flex flex-wrap gap-1">
                        {phase.tools?.map((t: string, j: number) => (
                          <span key={j} className="text-[9px] px-1.5 py-0.5 rounded"
                            style={{ background: "hsl(216 45% 18%)", color: "hsl(215 25% 55%)" }}>{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Pitfalls & Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {r.commonPitfalls?.length > 0 && (
                  <div className="rounded-xl p-4" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
                    <p className="text-xs font-bold mb-3" style={{ color: "hsl(0 72% 68%)" }}>⚠ Common Pitfalls</p>
                    {r.commonPitfalls.map((p: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 mb-1.5">
                        <div className="h-1.5 w-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "hsl(0 72% 68%)" }} />
                        <p className="text-[10px]" style={{ color: "hsl(215 25% 60%)" }}>{p}</p>
                      </div>
                    ))}
                  </div>
                )}
                {r.successMetrics?.length > 0 && (
                  <div className="rounded-xl p-4" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
                    <p className="text-xs font-bold mb-3" style={{ color: "hsl(158 64% 55%)" }}>✓ Success Metrics</p>
                    {r.successMetrics.map((m: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 mb-1.5">
                        <div className="h-1.5 w-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "hsl(158 64% 55%)" }} />
                        <p className="text-[10px]" style={{ color: "hsl(215 25% 60%)" }}>{m}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Regenerate */}
              <button onClick={() => generatePlaybook(selectedPlaybook!)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold"
                style={{ background: "hsl(216 45% 18%)", color: "hsl(215 25% 65%)", border: "1px solid hsl(var(--border))" }}>
                <RefreshCw className="h-3.5 w-3.5" /> Regenerate
              </button>
            </div>
          </>
          )}
        </div>
      </div>
    </div>
  );
}
