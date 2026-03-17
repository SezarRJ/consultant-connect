import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FolderOpen, Plus, Search, Building2, TrendingUp, ShoppingCart, Utensils,
  Megaphone, Factory, Radio, Briefcase, BarChart2, ChevronRight, Calendar,
  DollarSign, Target, Clock, CheckCircle2, AlertTriangle, Play, MoreHorizontal,
  Filter, Grid3x3, List, Star, ArrowRight, Layers, Cpu, ExternalLink
} from "lucide-react";
import { toast } from "sonner";

type ProjectType = "Real Estate" | "FMCG" | "Sales & Distribution" | "F&B" | "Marketing" | "Manufacturing" | "Telecom" | "Business Development";
type ProjectStatus = "Active" | "In Progress" | "Completed" | "On Hold";
type ProjectPhase = "Analysis" | "Scenario Planning" | "Decision" | "Financial Model" | "Risk Review" | "Delivery";

interface Project {
  id: string;
  name: string;
  client: string;
  type: ProjectType;
  status: ProjectStatus;
  phase: ProjectPhase;
  value: string;
  progress: number;
  deadline: string;
  createdAt: string;
  description: string;
  objectives: string[];
  priority: "High" | "Medium" | "Low";
}

const TYPE_ICONS: Record<ProjectType, any> = {
  "Real Estate": Building2,
  "FMCG": ShoppingCart,
  "Sales & Distribution": TrendingUp,
  "F&B": Utensils,
  "Marketing": Megaphone,
  "Manufacturing": Factory,
  "Telecom": Radio,
  "Business Development": Briefcase,
};

const TYPE_COLORS: Record<ProjectType, { bg: string; text: string; border: string }> = {
  "Real Estate":        { bg: "hsl(38 95% 52% / 0.1)",  text: "hsl(38 95% 60%)",   border: "hsl(38 95% 52% / 0.3)" },
  "FMCG":               { bg: "hsl(158 64% 40% / 0.1)", text: "hsl(158 64% 55%)",  border: "hsl(158 64% 40% / 0.3)" },
  "Sales & Distribution":{ bg: "hsl(217 91% 53% / 0.1)", text: "hsl(217 91% 70%)", border: "hsl(217 91% 53% / 0.3)" },
  "F&B":                { bg: "hsl(0 72% 51% / 0.1)",   text: "hsl(0 72% 68%)",    border: "hsl(0 72% 51% / 0.3)" },
  "Marketing":          { bg: "hsl(280 80% 50% / 0.1)", text: "hsl(280 80% 70%)",  border: "hsl(280 80% 50% / 0.3)" },
  "Manufacturing":      { bg: "hsl(200 80% 45% / 0.1)", text: "hsl(200 80% 65%)",  border: "hsl(200 80% 45% / 0.3)" },
  "Telecom":            { bg: "hsl(38 95% 52% / 0.1)",  text: "hsl(38 95% 60%)",   border: "hsl(38 95% 52% / 0.3)" },
  "Business Development":{ bg: "hsl(158 64% 40% / 0.1)",text: "hsl(158 64% 55%)",  border: "hsl(158 64% 40% / 0.3)" },
};

const STATUS_COLORS: Record<ProjectStatus, { bg: string; text: string }> = {
  "Active":      { bg: "hsl(158 64% 40% / 0.15)", text: "hsl(158 64% 55%)" },
  "In Progress": { bg: "hsl(38 95% 52% / 0.15)",  text: "hsl(38 95% 60%)" },
  "Completed":   { bg: "hsl(217 91% 53% / 0.15)", text: "hsl(217 91% 70%)" },
  "On Hold":     { bg: "hsl(0 72% 51% / 0.15)",   text: "hsl(0 72% 68%)" },
};

const PHASE_STEPS: ProjectPhase[] = ["Analysis", "Scenario Planning", "Decision", "Financial Model", "Risk Review", "Delivery"];

const SEED_PROJECTS: Project[] = [
  { id:"p1", name:"Baghdad Mixed-Use Tower", client:"Al-Rafidain Investments", type:"Real Estate", status:"Active", phase:"Financial Model", value:"$4.2M", progress:65, deadline:"2026-06-30", createdAt:"2026-01-15", description:"Feasibility for 18-floor mixed-use development in central Baghdad.", objectives:["ROI Analysis","Market Demand Study","Competitor Mapping"], priority:"High" },
  { id:"p2", name:"Iraq FMCG Distribution Overhaul", client:"Gulf Foods Group", type:"FMCG", status:"In Progress", phase:"Scenario Planning", value:"$320K", progress:42, deadline:"2026-05-15", createdAt:"2026-02-01", description:"Full RTM redesign for 5 governorates covering 2,400+ retail outlets.", objectives:["RTM Redesign","Territory Mapping","KPI Framework"], priority:"High" },
  { id:"p3", name:"Erbil F&B Concept Launch", client:"Nouri Hospitality Group", type:"F&B", status:"Active", phase:"Decision", value:"$180K", progress:58, deadline:"2026-07-01", createdAt:"2026-02-20", description:"Restaurant concept development and feasibility for premium dining in Erbil.", objectives:["Concept Selection","Menu Engineering","Cost Model"], priority:"Medium" },
  { id:"p4", name:"Telecom Bundle Optimization", client:"IraqCell Ltd.", type:"Telecom", status:"In Progress", phase:"Analysis", value:"$95K", progress:25, deadline:"2026-08-01", createdAt:"2026-03-01", description:"Pricing bundle strategy and channel optimization for consumer segment.", objectives:["Bundle Design","Channel Analysis","CRM Strategy"], priority:"Medium" },
  { id:"p5", name:"Mosul Manufacturing Setup", client:"Al-Jazeera Industries", type:"Manufacturing", status:"On Hold", phase:"Risk Review", value:"$2.1M", progress:80, deadline:"2026-09-30", createdAt:"2025-11-10", description:"Greenfield manufacturing plant feasibility including supply chain design.", objectives:["Process Design","Cost Reduction","Supply Chain"], priority:"High" },
  { id:"p6", name:"Jordan FMCG Iraq Entry", client:"Jordan Foods Export", type:"Sales & Distribution", status:"Active", phase:"Delivery", value:"$75K", progress:92, deadline:"2026-03-31", createdAt:"2025-12-01", description:"Full market entry strategy and distributor matchmaking for Jordan FMCG brands.", objectives:["Market Entry","Distributor Selection","GTM Plan"], priority:"Low" },
];

const ALL_TYPES: ProjectType[] = ["Real Estate","FMCG","Sales & Distribution","F&B","Marketing","Manufacturing","Telecom","Business Development"];

export default function Projects() {
// ── Workspace route map by project type ────────────────────────────────────
const WORKSPACE_ROUTES: Record<ProjectType, string> = {
  "Real Estate":          "/real-estate-intelligence",
  "FMCG":                 "/fmcg-intelligence",
  "Sales & Distribution": "/sales-distribution",
  "F&B":                  "/fb-consulting",
  "Marketing":            "/marketing-intelligence",
  "Manufacturing":        "/manufacturing-module",
  "Telecom":              "/telecom-module",
  "Business Development": "/business-development",
};

export default function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>(SEED_PROJECTS);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<ProjectType | "All">("All");
  const [filterStatus, setFilterStatus] = useState<ProjectStatus | "All">("All");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showNew, setShowNew] = useState(false);
  const [selected, setSelected] = useState<Project | null>(null);

  // New project form state
  const [form, setForm] = useState({ name: "", client: "", type: "Real Estate" as ProjectType, description: "", value: "", deadline: "" });

  const filtered = projects.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.client.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "All" || p.type === filterType;
    const matchStatus = filterStatus === "All" || p.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === "Active" || p.status === "In Progress").length,
    value: "$7.0M",
    completed: projects.filter(p => p.status === "Completed").length,
  };

  const handleCreate = () => {
    if (!form.name || !form.client) { toast.error("Name and client are required."); return; }
    const np: Project = {
      id: `p${Date.now()}`, name: form.name, client: form.client, type: form.type,
      status: "Active", phase: "Analysis", value: form.value || "TBD",
      progress: 0, deadline: form.deadline || "TBD", createdAt: new Date().toISOString().split("T")[0],
      description: form.description, objectives: [], priority: "Medium",
    };
    setProjects(prev => [np, ...prev]);
    setShowNew(false);
    setForm({ name: "", client: "", type: "Real Estate", description: "", value: "", deadline: "" });
    toast.success("Project created successfully!");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold font-display" style={{ color: "hsl(210 40% 94%)" }}>
            Projects
          </h1>
          <p className="text-sm mt-1" style={{ color: "hsl(215 25% 55%)" }}>
            Client case management — from analysis to delivery
          </p>
        </div>
        <button onClick={() => setShowNew(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold"
          style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
          <Plus className="h-4 w-4" /> New Project
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Projects", value: stats.total, icon: FolderOpen, color: "hsl(38 95% 60%)" },
          { label: "Active Cases", value: stats.active, icon: Play, color: "hsl(158 64% 55%)" },
          { label: "Total Value", value: stats.value, icon: DollarSign, color: "hsl(217 91% 70%)" },
          { label: "Completed", value: stats.completed, icon: CheckCircle2, color: "hsl(158 64% 55%)" },
        ].map((s, i) => (
          <div key={i} className="rounded-xl p-4" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <div className="flex items-center gap-2 mb-2">
              <s.icon className="h-4 w-4" style={{ color: s.color }} />
              <span className="text-xs" style={{ color: "hsl(215 25% 55%)" }}>{s.label}</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: "hsl(210 40% 94%)" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: "hsl(215 25% 45%)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects or clients..."
            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm"
            style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }} />
        </div>
        <select value={filterType} onChange={e => setFilterType(e.target.value as any)}
          className="px-3 py-2 rounded-lg text-sm"
          style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }}>
          <option value="All">All Types</option>
          {ALL_TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)}
          className="px-3 py-2 rounded-lg text-sm"
          style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }}>
          <option value="All">All Status</option>
          {["Active","In Progress","Completed","On Hold"].map(s => <option key={s}>{s}</option>)}
        </select>
        <div className="flex rounded-lg overflow-hidden" style={{ border: "1px solid hsl(var(--border))" }}>
          {(["grid","list"] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              className="px-3 py-2"
              style={{ background: view === v ? "hsl(38 95% 52% / 0.15)" : "hsl(var(--card))", color: view === v ? "hsl(38 95% 60%)" : "hsl(215 25% 55%)" }}>
              {v === "grid" ? <Grid3x3 className="h-4 w-4" /> : <List className="h-4 w-4" />}
            </button>
          ))}
        </div>
      </div>

      {/* Project Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16" style={{ color: "hsl(215 25% 45%)" }}>
          <FolderOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No projects found</p>
          <p className="text-sm mt-1">Try adjusting your filters or create a new project</p>
        </div>
      ) : (
        <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" : "space-y-3"}>
          {filtered.map(p => {
            const Icon = TYPE_ICONS[p.type];
            const tc = TYPE_COLORS[p.type];
            const sc = STATUS_COLORS[p.status];
            const phaseIdx = PHASE_STEPS.indexOf(p.phase);
            return (
              <div key={p.id}
                className="rounded-xl p-5 cursor-pointer transition-all hover:scale-[1.01]"
                style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                onClick={() => setSelected(p)}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: tc.bg, border: `1px solid ${tc.border}` }}>
                      <Icon className="h-4 w-4" style={{ color: tc.text }} />
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: tc.bg, color: tc.text }}>{p.type}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: sc.bg, color: sc.text }}>{p.status}</span>
                </div>
                <h3 className="font-semibold text-sm mb-1" style={{ color: "hsl(210 40% 92%)" }}>{p.name}</h3>
                <p className="text-xs mb-3" style={{ color: "hsl(215 25% 55%)" }}>{p.client}</p>
                <p className="text-xs mb-4 line-clamp-2" style={{ color: "hsl(215 25% 50%)" }}>{p.description}</p>

                {/* Phase Progress */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-medium" style={{ color: "hsl(215 25% 50%)" }}>Phase: {p.phase}</span>
                    <span className="text-[10px] font-semibold" style={{ color: "hsl(38 95% 60%)" }}>{p.progress}%</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: "hsl(216 45% 15%)" }}>
                    <div className="h-1.5 rounded-full transition-all" style={{ width: `${p.progress}%`, background: "hsl(38 95% 52%)" }} />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px]" style={{ color: "hsl(215 25% 50%)" }}>
                  <div className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{p.value}</div>
                  <div className="flex items-center gap-1"><Calendar className="h-3 w-3" />{p.deadline}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Project Modal */}
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="w-full max-w-lg rounded-2xl p-6 space-y-4" style={{ background: "hsl(216 52% 10%)", border: "1px solid hsl(var(--border))" }}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold font-display" style={{ color: "hsl(210 40% 94%)" }}>New Project</h2>
              <button onClick={() => setShowNew(false)} style={{ color: "hsl(215 25% 55%)" }}>✕</button>
            </div>
            <div className="space-y-3">
              <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Project name *"
                className="w-full px-3 py-2.5 rounded-lg text-sm"
                style={{ background: "hsl(216 45% 14%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }} />
              <input value={form.client} onChange={e => setForm(f => ({...f, client: e.target.value}))} placeholder="Client name *"
                className="w-full px-3 py-2.5 rounded-lg text-sm"
                style={{ background: "hsl(216 45% 14%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }} />
              <select value={form.type} onChange={e => setForm(f => ({...f, type: e.target.value as ProjectType}))}
                className="w-full px-3 py-2.5 rounded-lg text-sm"
                style={{ background: "hsl(216 45% 14%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }}>
                {ALL_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
              <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} placeholder="Project description"
                rows={3} className="w-full px-3 py-2.5 rounded-lg text-sm resize-none"
                style={{ background: "hsl(216 45% 14%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }} />
              <div className="grid grid-cols-2 gap-3">
                <input value={form.value} onChange={e => setForm(f => ({...f, value: e.target.value}))} placeholder="Deal value (e.g. $250K)"
                  className="px-3 py-2.5 rounded-lg text-sm"
                  style={{ background: "hsl(216 45% 14%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }} />
                <input type="date" value={form.deadline} onChange={e => setForm(f => ({...f, deadline: e.target.value}))}
                  className="px-3 py-2.5 rounded-lg text-sm"
                  style={{ background: "hsl(216 45% 14%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }} />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowNew(false)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold"
                style={{ background: "hsl(216 45% 18%)", color: "hsl(210 40% 75%)" }}>Cancel</button>
              <button onClick={handleCreate} className="flex-1 py-2.5 rounded-lg text-sm font-semibold"
                style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>Create Project</button>
            </div>
          </div>
        </div>
      )}

      {/* Project Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="w-full max-w-2xl rounded-2xl p-6 space-y-5 overflow-y-auto max-h-[90vh]" style={{ background: "hsl(216 52% 10%)", border: "1px solid hsl(var(--border))" }}>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold font-display" style={{ color: "hsl(210 40% 94%)" }}>{selected.name}</h2>
                <p className="text-sm mt-1" style={{ color: "hsl(215 25% 55%)" }}>{selected.client}</p>
              </div>
              <button onClick={() => setSelected(null)} style={{ color: "hsl(215 25% 55%)" }}>✕</button>
            </div>

            {/* Phase Tracker */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "hsl(215 25% 45%)" }}>Project Phases</p>
              <div className="flex items-center gap-1 flex-wrap">
                {PHASE_STEPS.map((phase, i) => {
                  const phaseIdx = PHASE_STEPS.indexOf(selected.phase);
                  const done = i < phaseIdx;
                  const current = i === phaseIdx;
                  return (
                    <div key={phase} className="flex items-center gap-1">
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium"
                        style={{
                          background: current ? "hsl(38 95% 52% / 0.15)" : done ? "hsl(158 64% 40% / 0.12)" : "hsl(216 45% 14%)",
                          color: current ? "hsl(38 95% 60%)" : done ? "hsl(158 64% 55%)" : "hsl(215 25% 45%)",
                          border: `1px solid ${current ? "hsl(38 95% 52% / 0.4)" : done ? "hsl(158 64% 40% / 0.3)" : "hsl(216 45% 20%)"}`,
                        }}>
                        {done && <CheckCircle2 className="h-3 w-3" />}
                        {current && <Play className="h-3 w-3" />}
                        {phase}
                      </div>
                      {i < PHASE_STEPS.length - 1 && <ChevronRight className="h-3 w-3 shrink-0" style={{ color: "hsl(215 25% 35%)" }} />}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl p-4" style={{ background: "hsl(216 45% 12%)", border: "1px solid hsl(var(--border))" }}>
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "hsl(215 25% 45%)" }}>Details</p>
                <div className="space-y-2 text-xs" style={{ color: "hsl(210 40% 75%)" }}>
                  <div className="flex justify-between"><span style={{ color: "hsl(215 25% 50%)" }}>Type</span><span>{selected.type}</span></div>
                  <div className="flex justify-between"><span style={{ color: "hsl(215 25% 50%)" }}>Value</span><span className="font-semibold" style={{ color: "hsl(38 95% 60%)" }}>{selected.value}</span></div>
                  <div className="flex justify-between"><span style={{ color: "hsl(215 25% 50%)" }}>Deadline</span><span>{selected.deadline}</span></div>
                  <div className="flex justify-between"><span style={{ color: "hsl(215 25% 50%)" }}>Priority</span><span>{selected.priority}</span></div>
                </div>
              </div>
              <div className="rounded-xl p-4" style={{ background: "hsl(216 45% 12%)", border: "1px solid hsl(var(--border))" }}>
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "hsl(215 25% 45%)" }}>Objectives</p>
                {selected.objectives.length > 0 ? (
                  <div className="space-y-1.5">
                    {selected.objectives.map((o, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <CheckCircle2 className="h-3 w-3 shrink-0" style={{ color: "hsl(158 64% 55%)" }} />
                        <span style={{ color: "hsl(210 40% 75%)" }}>{o}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs" style={{ color: "hsl(215 25% 40%)" }}>No objectives defined yet.</p>
                )}
              </div>
            </div>

            <div className="rounded-xl p-4" style={{ background: "hsl(216 45% 12%)", border: "1px solid hsl(var(--border))" }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "hsl(215 25% 45%)" }}>Description</p>
              <p className="text-sm" style={{ color: "hsl(210 40% 75%)" }}>{selected.description}</p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setSelected(null)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold"
                style={{ background: "hsl(216 45% 18%)", color: "hsl(210 40% 75%)" }}>Close</button>
              <button
                onClick={() => { navigate(WORKSPACE_ROUTES[selected.type]); setSelected(null); }}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold inline-flex items-center justify-center gap-2"
                style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
                <ExternalLink className="h-4 w-4" /> Open Workspace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
