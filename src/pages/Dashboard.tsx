/**
 * Dashboard.tsx v3 — Engagement-centered command center
 * Shows active engagement status, workflow progress, quick actions
 */
import { Link } from "react-router-dom";
import {
  Users, Briefcase, BarChart2, Lightbulb, FileOutput,
  Building2, ShoppingCart, Coffee, Radio, Truck,
  TrendingUp, Megaphone, Network, Globe2, ArrowRight,
  Plus, AlertTriangle, CheckCircle2, Activity, ChevronRight,
  FolderKanban, CheckSquare, PieChart, UserCheck, Clock,
  Bot, MessageSquare, FolderOpen, Factory, DollarSign,
  Database, Layers, Lock, Star, Target, ShieldAlert,
  PackageCheck, FileBarChart2, FileText, Settings,
} from "lucide-react";
import { useEngagementStore, PHASES, getEngagementReadiness, getMissingRequestedOutputs, type EngagementPhase } from "@/store/engagementStore";
import { useI18n } from "@/lib/i18n";

const PHASE_COLORS: Record<string, string> = {
  Discovery: "hsl(38 95% 52%)", "Data Collection": "hsl(200 80% 55%)",
  Analysis: "hsl(270 70% 60%)", Strategy: "hsl(145 65% 45%)",
  Deliverables: "hsl(30 90% 55%)", Review: "hsl(217 91% 68%)", Closed: "hsl(215 25% 45%)",
};

const WORKFLOW_STEPS = [
  { step:"1", label:"CRM",           url:"/crm",               icon:Users,      color:"hsl(38 95% 52%)",  desc:"Record client" },
  { step:"2", label:"Engagement",    url:"/engagement",        icon:Briefcase,  color:"hsl(200 80% 55%)", desc:"Create engagement" },
  { step:"3", label:"Data",          url:"/data-collection",   icon:Database,   color:"hsl(270 70% 65%)", desc:"Upload client data" },
  { step:"4", label:"Analysis",      url:"/analysis",          icon:BarChart2,  color:"hsl(145 65% 48%)", desc:"Run AI tools" },
  { step:"5", label:"Strategy",      url:"/strategy",          icon:Lightbulb,  color:"hsl(30 90% 55%)",  desc:"Build strategy" },
  { step:"6", label:"Deliverables",  url:"/deliverables",      icon:FileOutput, color:"hsl(217 91% 68%)", desc:"Create outputs" },
];

const DOMAINS = [
  { url:"/domain/real-estate",   label:"Real Estate",    icon:Building2,   color:"hsl(38 95% 52%)"  },
  { url:"/domain/fmcg",          label:"FMCG",           icon:ShoppingCart, color:"hsl(145 65% 48%)" },
  { url:"/domain/fnb",           label:"F&B",            icon:Coffee,       color:"hsl(30 90% 55%)"  },
  { url:"/domain/telecom",       label:"Telecom",        icon:Radio,        color:"hsl(200 80% 55%)" },
  { url:"/domain/distribution",  label:"Distribution",   icon:Truck,        color:"hsl(280 70% 65%)" },
  { url:"/domain/sales",         label:"Sales",          icon:TrendingUp,   color:"hsl(158 64% 48%)" },
  { url:"/domain/marketing",     label:"Marketing",      icon:Megaphone,    color:"hsl(340 80% 60%)" },
  { url:"/domain/bizdev",        label:"Biz Dev",        icon:Network,      color:"hsl(217 91% 68%)" },
  { url:"/domain/manufacturing", label:"Manufacturing",  icon:Factory,      color:"hsl(263 70% 60%)" },
];

const ANALYSIS_TOOLS = [
  { label:"Market Entry",       url:"/analysis", icon:TrendingUp,   color:"hsl(38 95% 52%)"  },
  { label:"Competitor Analysis",url:"/analysis", icon:BarChart2,    color:"hsl(200 80% 55%)" },
  { label:"Pricing Intel",      url:"/analysis", icon:DollarSign,   color:"hsl(145 65% 48%)" },
  { label:"Risk Assessment",    url:"/analysis", icon:ShieldAlert,  color:"hsl(0 72% 60%)"   },
  { label:"Distributor Finder", url:"/analysis", icon:Users,        color:"hsl(270 70% 65%)" },
  { label:"Export Readiness",   url:"/analysis", icon:PackageCheck, color:"hsl(30 90% 55%)"  },
  { label:"Feasibility Study",  url:"/analysis", icon:FileBarChart2,color:"hsl(217 91% 68%)" },
  { label:"Market Intelligence",url:"/analysis", icon:Globe2,       color:"hsl(158 64% 48%)" },
];

const FINANCIAL_TOOLS = [
  { label:"Financial Analysis", url:"/financial-consultancy", icon:BarChart2,  color:"hsl(145 65% 48%)" },
  { label:"Valuation",          url:"/financial-consultancy", icon:Target,     color:"hsl(38 95% 52%)"  },
  { label:"Investment Appraisal",url:"/financial-consultancy",icon:TrendingUp, color:"hsl(200 80% 55%)" },
  { label:"Financial Modeling", url:"/financial-consultancy", icon:PieChart,   color:"hsl(270 70% 65%)" },
  { label:"Budget & Forecast",  url:"/financial-consultancy", icon:Clock,      color:"hsl(30 90% 55%)"  },
  { label:"Cost Reduction",     url:"/financial-consultancy", icon:DollarSign, color:"hsl(158 64% 48%)" },
  { label:"Profitability",      url:"/financial-consultancy", icon:TrendingUp, color:"hsl(217 91% 68%)" },
  { label:"Financial Report",   url:"/financial-consultancy", icon:FileText,   color:"hsl(145 65% 48%)" },
];

export default function Dashboard() {
  const { lang } = useI18n();
  const { engagements, activeEngagementId, setActiveEngagement, getActiveEngagement } = useEngagementStore();
  const active = getActiveEngagement();
  const activeCount    = engagements.filter(e => e.status === "Active").length;
  const completedCount = engagements.filter(e => e.status === "Completed").length;
  const activePhaseIdx = active ? PHASES.indexOf(active.phase) : -1;
  const missing = active ? getMissingRequestedOutputs(active) : [];
  const phaseColor = active ? (PHASE_COLORS[active.phase] || "hsl(215 25% 45%)") : "hsl(215 25% 45%)";

  return (
    <div className="space-y-7 max-w-6xl mx-auto">

      {/* Hero / Active Engagement */}
      {active ? (
        <div className="rounded-2xl p-6 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, hsl(216 52% 9%), hsl(216 52% 12%))", border: `1px solid ${phaseColor}25` }}>
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: `radial-gradient(circle at 80% 20%, ${phaseColor}, transparent 55%)` }} />
          <div className="relative">
            <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Star className="h-3.5 w-3.5" style={{ color: phaseColor }} />
                  <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
                    style={{ background: `${phaseColor}15`, color: phaseColor }}>ACTIVE ENGAGEMENT</span>
                </div>
                <h1 className="text-2xl font-bold mb-0.5" style={{ color: "hsl(210 40% 94%)" }}>
                  {active.companyName}
                </h1>
                <p className="text-sm" style={{ color: "hsl(215 25% 55%)" }}>
                  {active.serviceType} · {active.market} · {active.industry}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link to="/data-collection"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold"
                  style={{ background: "hsl(200 80% 55%/0.12)", color: "hsl(200 80% 65%)", border: "1px solid hsl(200 80% 55%/0.25)" }}>
                  <Database className="h-3.5 w-3.5" /> Data
                </Link>
                <Link to="/engagement"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold"
                  style={{ background: phaseColor, color: "hsl(216 58% 6%)" }}>
                  Open <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Phase progress bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "hsl(215 25% 45%)" }}>
                  PHASE {activePhaseIdx + 1} of {PHASES.length}
                </span>
                <span className="text-[11px] font-bold" style={{ color: phaseColor }}>{active.phase}</span>
              </div>
              <div className="flex gap-1">
                {PHASES.map((ph, i) => (
                  <div key={ph} className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "hsl(216 45% 18%)" }}>
                    <div className="h-full rounded-full transition-all" style={{
                      width: i < activePhaseIdx ? "100%" : i === activePhaseIdx ? "50%" : "0%",
                      background: i <= activePhaseIdx ? phaseColor : "transparent"
                    }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="flex gap-2 flex-wrap">
              {[
                { label:"Analysis",    url:"/analysis",     color:"hsl(270 70% 65%)" },
                { label:"Strategy",    url:"/strategy",     color:"hsl(145 65% 48%)" },
                { label:"Deliverables",url:"/deliverables", color:"hsl(30 90% 55%)"  },
                { label:"Financial",   url:"/financial-consultancy", color:"hsl(145 65% 48%)" },
              ].map(a => (
                <Link key={a.url+a.label} to={a.url}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium"
                  style={{ background:`${a.color}10`, color:a.color, border:`1px solid ${a.color}22` }}>
                  {a.label} <ArrowRight className="h-3 w-3" />
                </Link>
              ))}
              {missing.length > 0 && (
                <span className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg"
                  style={{ background:"hsl(38 85% 52%/0.1)", color:"hsl(38 85% 60%)", border:"1px solid hsl(38 85% 52%/0.25)" }}>
                  <AlertTriangle className="h-3 w-3" /> {missing.length} pending output{missing.length > 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl p-7 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, hsl(216 52% 9%), hsl(216 52% 12%))", border: "1px solid hsl(38 95% 52%/0.18)" }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Globe2 className="h-4 w-4" style={{ color: "hsl(38 95% 52%)" }} />
                <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
                  style={{ background: "hsl(38 95% 52%/0.12)", color: "hsl(38 95% 60%)" }}>Engagement OS</span>
              </div>
              <h1 className="text-2xl font-bold" style={{ color: "hsl(210 40% 94%)" }}>ConsultAI Pro</h1>
              <p className="text-sm mt-1" style={{ color: "hsl(215 25% 55%)" }}>
                Record client → upload data once → run all tools → deliver outputs.
              </p>
            </div>
            <Link to="/crm" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shrink-0"
              style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
              <Plus className="h-4 w-4" /> New Client
            </Link>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {[
          { label:"Active",       value:activeCount,    icon:Activity,     color:"hsl(145 65% 48%)" },
          { label:"Completed",    value:completedCount, icon:CheckCircle2, color:"hsl(38 95% 52%)"  },
          { label:"Total",        value:engagements.length, icon:Briefcase,color:"hsl(200 80% 55%)" },
          { label:"Outputs",      value:active?Object.keys(active.outputs).length:0, icon:FileOutput,color:"hsl(270 70% 65%)" },
          { label:"Data Points",  value:active?(active.dataInputs||[]).length:0, icon:Database, color:"hsl(30 90% 55%)" },
        ].map(({ label, value, icon:Icon, color }) => (
          <div key={label} className="rounded-xl p-4"
            style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 18%)" }}>
            <Icon className="h-4 w-4 mb-2" style={{ color }} />
            <p className="text-2xl font-bold" style={{ color }}>{value}</p>
            <p className="text-[10px] uppercase tracking-wider font-semibold mt-0.5"
              style={{ color: "hsl(215 25% 42%)" }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Workflow Steps */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: "hsl(215 25% 38%)" }}>
            GUIDED WORKFLOW
          </p>
          <Link to="/workflow" className="text-[11px] font-semibold" style={{ color: "hsl(38 95% 55%)" }}>
            Full Guide →
          </Link>
        </div>
        <div className="flex items-stretch gap-1">
          {WORKFLOW_STEPS.map((w, i) => (
            <div key={w.url+w.step} className="flex items-center flex-1">
              <Link to={w.url}
                className="flex flex-col items-center gap-1.5 flex-1 px-2 py-4 rounded-xl text-center transition-all hover:opacity-80"
                style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 17%)" }}>
                <div className="h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: `${w.color}15`, color: w.color }}>{w.step}</div>
                <w.icon className="h-4 w-4" style={{ color: w.color }} />
                <span className="text-[9px] font-semibold" style={{ color: "hsl(215 25% 52%)" }}>{w.label}</span>
              </Link>
              {i < WORKFLOW_STEPS.length - 1 && (
                <ChevronRight className="h-3.5 w-3.5 shrink-0 mx-0.5" style={{ color: "hsl(216 45% 22%)" }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Engagement list + Domains */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Engagements */}
        <div className="lg:col-span-1">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: "hsl(215 25% 38%)" }}>ENGAGEMENTS</p>
            <Link to="/engagement" className="text-[10px]" style={{ color: "hsl(38 95% 55%)" }}>Manage →</Link>
          </div>
          <div className="space-y-1.5">
            {engagements.length === 0 ? (
              <div className="rounded-xl p-6 flex flex-col items-center gap-2"
                style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 18%)" }}>
                <Briefcase className="h-8 w-8" style={{ color: "hsl(216 45% 25%)" }} />
                <p className="text-xs" style={{ color: "hsl(215 25% 45%)" }}>No engagements yet.</p>
                <Link to="/crm" className="text-xs font-semibold" style={{ color: "hsl(38 95% 52%)" }}>Start in CRM →</Link>
              </div>
            ) : engagements.slice(0, 6).map(e => {
              const pc = PHASE_COLORS[e.phase] || "hsl(215 25% 45%)";
              return (
                <button key={e.id} onClick={() => setActiveEngagement(e.id)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all hover:opacity-80"
                  style={{ background: e.id === activeEngagementId ? `${pc}08` : "hsl(216 45% 10%)", border: e.id === activeEngagementId ? `1px solid ${pc}30` : "1px solid hsl(216 45% 18%)" }}>
                  <div className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ background: "hsl(216 45% 18%)", color: "hsl(210 40% 72%)" }}>
                    {(e.companyName || e.clientName)[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate" style={{ color: "hsl(210 40% 88%)" }}>{e.companyName || e.clientName}</p>
                    <p className="text-[10px] truncate" style={{ color: "hsl(215 25% 48%)" }}>{e.serviceType}</p>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                    style={{ background: `${pc}18`, color: pc }}>{e.phase}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Domain modules */}
        <div className="lg:col-span-2">
          <p className="text-[10px] uppercase tracking-widest font-semibold mb-3" style={{ color: "hsl(215 25% 38%)" }}>
            INDUSTRY DOMAINS
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {DOMAINS.map(d => (
              <Link key={d.url} to={d.url}
                className="flex flex-col items-center gap-2 p-3 rounded-xl text-center transition-all hover:scale-[1.03]"
                style={{ background: `${d.color}08`, border: `1px solid ${d.color}20` }}>
                <d.icon className="h-5 w-5" style={{ color: d.color }} />
                <span className="text-[10px] font-semibold leading-tight" style={{ color: "hsl(210 40% 78%)" }}>{d.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Analysis + Financial tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: "hsl(215 25% 38%)" }}>ANALYSIS SERVICES</p>
            <Link to="/analysis" className="text-[10px]" style={{ color: "hsl(38 95% 55%)" }}>Open Hub →</Link>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {ANALYSIS_TOOLS.map(({ label, url, icon:Icon, color }) => (
              <Link key={label} to={url}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all hover:opacity-80"
                style={{ background: `${color}08`, border: `1px solid ${color}18`, color: "hsl(210 40% 78%)" }}>
                <Icon className="h-3.5 w-3.5 shrink-0" style={{ color }} />{label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: "hsl(215 25% 38%)" }}>FINANCIAL CONSULTANCY</p>
            <Link to="/financial-consultancy" className="text-[10px]" style={{ color: "hsl(145 65% 52%)" }}>Open Module →</Link>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {FINANCIAL_TOOLS.map(({ label, url, icon:Icon, color }) => (
              <Link key={label} to={url}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all hover:opacity-80"
                style={{ background: `${color}08`, border: `1px solid ${color}18`, color: "hsl(210 40% 78%)" }}>
                <Icon className="h-3.5 w-3.5 shrink-0" style={{ color }} />{label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Intelligence + Specialist */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { url:"/ai-assistant",        label:"AI Assistant",    icon:MessageSquare, color:"hsl(200 80% 55%)", desc:"Chat" },
          { url:"/agents",              label:"AI Agents",       icon:Bot,           color:"hsl(270 70% 65%)", desc:"9 specialists" },
          { url:"/company-development", label:"Company Dev",     icon:Building2,     color:"hsl(38 95% 52%)",  desc:"Corporate" },
          { url:"/iso-preparation",     label:"ISO Prep",        icon:Settings,      color:"hsl(145 65% 48%)", desc:"Compliance" },
        ].map(({ url, label, icon:Icon, color, desc }) => (
          <Link key={url} to={url}
            className="flex flex-col items-center gap-2 p-4 rounded-xl text-center transition-all hover:scale-[1.02]"
            style={{ background: `${color}08`, border: `1px solid ${color}20` }}>
            <Icon className="h-5 w-5" style={{ color }} />
            <p className="text-xs font-semibold" style={{ color: "hsl(210 40% 85%)" }}>{label}</p>
            <p className="text-[10px]" style={{ color: "hsl(215 25% 42%)" }}>{desc}</p>
          </Link>
        ))}
      </div>

    </div>
  );
}
