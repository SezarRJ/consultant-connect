/**
 * WorkflowGuide.tsx — The main workflow hub that guides users step by step
 * Replaces scattered navigation with a clear guided process
 */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useEngagementStore, PHASES, getEngagementReadiness, getMissingRequestedOutputs,
  SERVICE_CATEGORIES, CATEGORY_SERVICES, type ServiceCategory,
} from "@/store/engagementStore";
import {
  Users, Briefcase, Database, BarChart2, Lightbulb, FileOutput,
  CheckCircle2, Clock, AlertTriangle, ChevronRight, ArrowRight,
  Plus, Layers, Target, TrendingUp, DollarSign, Building2,
  Settings, Network, Globe2, Lock, Unlock, Star, RefreshCw,
  FolderOpen, Activity, X, Check,
} from "lucide-react";

const PHASE_ICONS = {
  "Discovery":       Users,
  "Data Collection": Database,
  "Analysis":        BarChart2,
  "Strategy":        Lightbulb,
  "Deliverables":    FileOutput,
  "Review":          CheckCircle2,
  "Closed":          Lock,
};

const PHASE_COLORS = {
  "Discovery":       "hsl(38 95% 52%)",
  "Data Collection": "hsl(200 80% 55%)",
  "Analysis":        "hsl(270 70% 65%)",
  "Strategy":        "hsl(145 65% 48%)",
  "Deliverables":    "hsl(30 90% 55%)",
  "Review":          "hsl(217 91% 68%)",
  "Closed":          "hsl(215 25% 45%)",
};

const PHASE_ACTIONS: Record<string, { label: string; url: string; desc: string }[]> = {
  "Discovery":       [{ label: "Open CRM", url: "/crm", desc: "Record client & qualify lead" }, { label: "Open Engagement", url: "/engagement", desc: "Create engagement record" }],
  "Data Collection": [{ label: "Upload Data", url: "/engagement", desc: "Upload documents & enter client data" }],
  "Analysis":        [{ label: "Run Analysis", url: "/analysis", desc: "8 AI analysis tools" }, { label: "Domain Intelligence", url: "/domain/fmcg", desc: "Industry-specific tools" }],
  "Strategy":        [{ label: "Build Strategy", url: "/strategy", desc: "5 strategy frameworks" }],
  "Deliverables":    [{ label: "Create Outputs", url: "/deliverables", desc: "Proposals, reports, summaries" }, { label: "Proposal Builder", url: "/proposal-builder", desc: "Build proposal" }, { label: "Report Generator", url: "/report-generator", desc: "Generate full report" }],
  "Review":          [{ label: "Review & Finalise", url: "/engagement", desc: "Client review & revisions" }],
  "Closed":          [{ label: "View Archive", url: "/engagement", desc: "All outputs & documents" }],
};

const CATEGORY_ICONS: Record<ServiceCategory, React.ElementType> = {
  "Market & Commercial": TrendingUp,
  "Financial Consultancy": DollarSign,
  "Real Estate": Building2,
  "Operations": Settings,
  "Company Development": Target,
  "ISO & Compliance": CheckCircle2,
  "Domain Intelligence": Globe2,
};

const CATEGORY_COLORS: Record<ServiceCategory, string> = {
  "Market & Commercial": "hsl(38 95% 52%)",
  "Financial Consultancy": "hsl(145 65% 48%)",
  "Real Estate": "hsl(30 90% 55%)",
  "Operations": "hsl(200 80% 55%)",
  "Company Development": "hsl(270 70% 65%)",
  "ISO & Compliance": "hsl(217 91% 68%)",
  "Domain Intelligence": "hsl(280 70% 65%)",
};

function PhaseStep({ phase, isActive, isCompleted, isLocked, eng }: {
  phase: string; isActive: boolean; isCompleted: boolean; isLocked: boolean; eng: any;
}) {
  const Icon = PHASE_ICONS[phase as keyof typeof PHASE_ICONS] || Clock;
  const color = PHASE_COLORS[phase as keyof typeof PHASE_COLORS] || "hsl(215 25% 45%)";
  const actions = PHASE_ACTIONS[phase] || [];

  return (
    <div className={`rounded-2xl p-5 transition-all border ${isActive ? "shadow-lg" : ""}`}
      style={{
        background: isActive ? `${color}10` : isCompleted ? "hsl(145 65% 40%/0.06)" : "hsl(216 45% 9%)",
        borderColor: isActive ? `${color}40` : isCompleted ? "hsl(145 65% 40%/0.25)" : "hsl(216 45% 16%)",
      }}>
      <div className="flex items-start gap-3 mb-3">
        <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
          style={{ background: isCompleted ? "hsl(145 65% 40%/0.15)" : isActive ? `${color}18` : "hsl(216 45% 14%)" }}>
          {isCompleted
            ? <CheckCircle2 className="h-4.5 w-4.5" style={{ color: "hsl(145 65% 52%)" }} />
            : isLocked
            ? <Lock className="h-4 w-4" style={{ color: "hsl(215 25% 38%)" }} />
            : <Icon className="h-4.5 w-4.5" style={{ color }} />
          }
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-sm font-bold" style={{ color: isLocked ? "hsl(215 25% 40%)" : isCompleted ? "hsl(145 65% 55%)" : "hsl(210 40% 90%)" }}>
              {phase}
            </p>
            {isCompleted && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: "hsl(145 65% 40%/0.15)", color: "hsl(145 65% 55%)" }}>DONE</span>}
            {isActive && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${color}18`, color }}>ACTIVE</span>}
          </div>
        </div>
      </div>
      {!isLocked && actions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {actions.map(a => (
            <Link key={a.url + a.label} to={a.url}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all hover:opacity-80"
              style={{ background: isActive ? `${color}18` : "hsl(216 45% 14%)", color: isActive ? color : "hsl(215 25% 55%)", border: `1px solid ${isActive ? `${color}30` : "hsl(216 45% 20%)"}` }}>
              {a.label} <ChevronRight className="h-3 w-3" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function EngagementCard({ eng, isActive, onSelect }: { eng: any; isActive: boolean; onSelect: () => void }) {
  const missing = getMissingRequestedOutputs(eng);
  const phaseIdx = PHASES.indexOf(eng.phase);
  const progress = Math.round((phaseIdx / (PHASES.length - 1)) * 100);
  const color = PHASE_COLORS[eng.phase as keyof typeof PHASE_COLORS] || "hsl(215 25% 45%)";

  return (
    <button onClick={onSelect} className="w-full text-left rounded-xl p-4 transition-all border"
      style={{
        background: isActive ? `${color}08` : "hsl(216 45% 9%)",
        borderColor: isActive ? `${color}35` : "hsl(216 45% 16%)",
      }}>
      <div className="flex items-start gap-2.5 mb-2.5">
        <div className="h-8 w-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
          style={{ background: "hsl(216 45% 16%)", color: "hsl(210 40% 72%)" }}>
          {(eng.companyName || eng.clientName)[0]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold truncate" style={{ color: "hsl(210 40% 90%)" }}>{eng.companyName}</p>
          <p className="text-[11px] truncate" style={{ color: "hsl(215 25% 48%)" }}>{eng.serviceType}</p>
        </div>
        {isActive && <Star className="h-3.5 w-3.5 shrink-0" style={{ color: "hsl(38 95% 52%)" }} />}
      </div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
          style={{ background: `${color}15`, color }}>{eng.phase}</span>
        <span className="text-[10px]" style={{ color: "hsl(215 25% 45%)" }}>{progress}%</span>
      </div>
      <div className="h-1 rounded-full overflow-hidden" style={{ background: "hsl(216 45% 16%)" }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: color }} />
      </div>
      {missing.length > 0 && (
        <p className="text-[10px] mt-1.5" style={{ color: "hsl(38 85% 55%)" }}>
          {missing.length} output{missing.length > 1 ? "s" : ""} pending
        </p>
      )}
    </button>
  );
}

export default function WorkflowGuide() {
  const {
    engagements, activeEngagementId, setActiveEngagement, getActiveEngagement,
    completePhase,
  } = useEngagementStore();
  const eng = getActiveEngagement();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);

  const activePhaseIdx = eng ? PHASES.indexOf(eng.phase) : -1;

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="h-5 w-5" style={{ color: "hsl(38 95% 52%)" }} />
            <h1 className="text-xl font-bold" style={{ color: "hsl(210 40% 94%)" }}>Engagement Workflow</h1>
          </div>
          <p className="text-sm" style={{ color: "hsl(215 25% 52%)" }}>
            One guided process — from first contact to final report. All services share the same client context.
          </p>
        </div>
        <Link to="/crm"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
          <Plus className="h-4 w-4" /> New Client
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Left: engagement list */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: "hsl(215 25% 38%)" }}>
              ACTIVE ENGAGEMENTS ({engagements.filter(e => e.status === "Active").length})
            </p>
            <Link to="/engagement" className="text-[11px] font-semibold" style={{ color: "hsl(38 95% 55%)" }}>
              Manage All →
            </Link>
          </div>
          <div className="space-y-2">
            {engagements.filter(e => e.status !== "Cancelled").slice(0, 8).map(e => (
              <EngagementCard key={e.id} eng={e}
                isActive={e.id === activeEngagementId}
                onSelect={() => setActiveEngagement(e.id)} />
            ))}
            {engagements.length === 0 && (
              <div className="rounded-xl p-8 flex flex-col items-center gap-3 text-center"
                style={{ background: "hsl(216 45% 9%)", border: "1px solid hsl(216 45% 16%)" }}>
                <Briefcase className="h-8 w-8" style={{ color: "hsl(216 45% 25%)" }} />
                <p className="text-sm font-medium" style={{ color: "hsl(215 25% 48%)" }}>No engagements yet</p>
                <Link to="/crm" className="text-xs font-semibold" style={{ color: "hsl(38 95% 52%)" }}>
                  Start in CRM →
                </Link>
              </div>
            )}
          </div>

          {/* Closed/Archive */}
          {engagements.filter(e => e.status === "Completed").length > 0 && (
            <div className="pt-2">
              <p className="text-[10px] uppercase tracking-widest font-bold mb-2" style={{ color: "hsl(215 25% 35%)" }}>
                COMPLETED ({engagements.filter(e => e.status === "Completed").length})
              </p>
              <div className="space-y-1.5">
                {engagements.filter(e => e.status === "Completed").slice(0, 3).map(e => (
                  <button key={e.id} onClick={() => setActiveEngagement(e.id)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left"
                    style={{ background: "hsl(216 45% 8%)", border: "1px solid hsl(216 45% 14%)" }}>
                    <Lock className="h-3.5 w-3.5 shrink-0" style={{ color: "hsl(215 25% 40%)" }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium truncate" style={{ color: "hsl(215 25% 55%)" }}>{e.companyName}</p>
                    </div>
                    <RefreshCw className="h-3 w-3 shrink-0" style={{ color: "hsl(215 25% 38%)" }} title="Reuse data" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Center: Phase workflow */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: "hsl(215 25% 38%)" }}>
              WORKFLOW PHASES
              {eng && <span className="ml-2 normal-case text-[9px]" style={{ color: "hsl(215 25% 45%)" }}>— {eng.companyName}</span>}
            </p>
            {eng && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                style={{ background: "hsl(38 95% 52%/0.12)", color: "hsl(38 95% 60%)" }}>
                {Math.round((activePhaseIdx / (PHASES.length - 1)) * 100)}% complete
              </span>
            )}
          </div>

          {!eng ? (
            <div className="rounded-xl p-8 flex flex-col items-center gap-3 text-center"
              style={{ background: "hsl(216 45% 9%)", border: "1px solid hsl(38 85% 45%/0.2)" }}>
              <AlertTriangle className="h-7 w-7" style={{ color: "hsl(38 85% 52%)" }} />
              <p className="text-sm font-medium" style={{ color: "hsl(210 40% 80%)" }}>Select an engagement</p>
              <p className="text-xs" style={{ color: "hsl(215 25% 45%)" }}>or create a new one from CRM</p>
              <Link to="/crm" className="mt-1 flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold"
                style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
                <Plus className="h-4 w-4" /> Start New Client
              </Link>
            </div>
          ) : (
            <div className="space-y-2.5">
              {PHASES.map((phase, idx) => (
                <PhaseStep key={phase}
                  phase={phase}
                  isActive={eng.phase === phase}
                  isCompleted={idx < activePhaseIdx}
                  isLocked={idx > activePhaseIdx + 1}
                  eng={eng} />
              ))}
              {eng.phase !== "Closed" && (
                <button onClick={() => completePhase(eng.id, eng.phase)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                  style={{ background: "hsl(145 65% 40%/0.12)", color: "hsl(145 65% 55%)", border: "1px solid hsl(145 65% 40%/0.3)" }}>
                  <Check className="h-4 w-4" />
                  Complete "{eng.phase}" → Move to Next Phase
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right: service categories */}
        <div className="space-y-4">
          <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: "hsl(215 25% 38%)" }}>
            SERVICE CATALOGUE
          </p>
          <div className="space-y-2">
            {SERVICE_CATEGORIES.map(cat => {
              const Icon = CATEGORY_ICONS[cat];
              const color = CATEGORY_COLORS[cat];
              const isOpen = selectedCategory === cat;
              const services = CATEGORY_SERVICES[cat];
              return (
                <div key={cat} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${isOpen ? `${color}30` : "hsl(216 45% 16%)"}` }}>
                  <button onClick={() => setSelectedCategory(isOpen ? null : cat)}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-left"
                    style={{ background: isOpen ? `${color}08` : "hsl(216 45% 9%)" }}>
                    <Icon className="h-4 w-4 shrink-0" style={{ color }} />
                    <span className="flex-1 text-[13px] font-semibold" style={{ color: "hsl(210 40% 85%)" }}>{cat}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                      style={{ background: `${color}12`, color }}>{services.length}</span>
                    <ChevronRight className="h-3.5 w-3.5 transition-transform shrink-0"
                      style={{ color: "hsl(215 25% 40%)", transform: isOpen ? "rotate(90deg)" : "none" }} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-3 pt-1 space-y-1" style={{ background: `${color}04` }}>
                      {services.map(svc => (
                        <div key={svc} className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: color }} />
                          <span className="text-[12px]" style={{ color: "hsl(215 25% 58%)" }}>{svc}</span>
                          {eng && !eng.requestedOutputs.includes(svc) && (
                            <button
                              onClick={() => useEngagementStore.getState().addRequestedOutput(eng.id, svc)}
                              className="ml-auto text-[10px] px-1.5 py-0.5 rounded font-semibold"
                              style={{ background: `${color}12`, color }}>
                              + Add
                            </button>
                          )}
                          {eng && eng.requestedOutputs.includes(svc) && (
                            <Check className="ml-auto h-3 w-3 shrink-0" style={{ color: "hsl(145 65% 52%)" }} />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Output progress for active engagement */}
          {eng && eng.requestedOutputs.length > 0 && (
            <div className="rounded-xl p-4 space-y-2" style={{ background: "hsl(216 45% 9%)", border: "1px solid hsl(216 45% 16%)" }}>
              <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: "hsl(215 25% 38%)" }}>OUTPUT PROGRESS</p>
              <div className="space-y-1.5">
                {eng.requestedOutputs.map(output => {
                  const done = !!eng.outputs[output.toLowerCase().replace(/\s+/g, "-")] ||
                    Object.values(eng.outputs).some(o => o.toolLabel.toLowerCase().includes(output.toLowerCase()));
                  return (
                    <div key={output} className="flex items-center gap-2">
                      {done
                        ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{ color: "hsl(145 65% 52%)" }} />
                        : <Clock className="h-3.5 w-3.5 shrink-0" style={{ color: "hsl(38 85% 52%)" }} />
                      }
                      <span className="text-[12px]" style={{ color: done ? "hsl(145 65% 55%)" : "hsl(215 25% 55%)" }}>{output}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px]" style={{ color: "hsl(215 25% 45%)" }}>Outputs delivered</span>
                  <span className="text-[10px] font-bold" style={{ color: "hsl(145 65% 52%)" }}>
                    {Object.keys(eng.outputs).length} / {eng.requestedOutputs.length}
                  </span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: "hsl(216 45% 16%)" }}>
                  <div className="h-full rounded-full" style={{
                    width: `${Math.min(100, (Object.keys(eng.outputs).length / Math.max(1, eng.requestedOutputs.length)) * 100)}%`,
                    background: "hsl(145 65% 48%)"
                  }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
