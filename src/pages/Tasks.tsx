import { useState } from "react";
import {
  CheckSquare, Plus, Search, Calendar, Clock, User, Flag,
  CheckCircle2, Circle, AlertTriangle, Filter, MoreHorizontal,
  Target, Layers, ArrowRight, Trash2, Edit3, Play
} from "lucide-react";
import { toast } from "sonner";

type Priority = "High" | "Medium" | "Low";
type TaskStatus = "Todo" | "In Progress" | "Done" | "Blocked";

interface Task {
  id: string;
  title: string;
  project: string;
  assignee: string;
  priority: Priority;
  status: TaskStatus;
  dueDate: string;
  description: string;
  tags: string[];
}

const PRIORITY_COLORS: Record<Priority, { bg: string; text: string }> = {
  High:   { bg: "hsl(0 72% 51% / 0.15)",   text: "hsl(0 72% 68%)"   },
  Medium: { bg: "hsl(38 95% 52% / 0.15)",  text: "hsl(38 95% 60%)"  },
  Low:    { bg: "hsl(217 91% 53% / 0.15)", text: "hsl(217 91% 70%)" },
};

const STATUS_COLORS: Record<TaskStatus, { bg: string; text: string }> = {
  "Todo":        { bg: "hsl(215 25% 20%)",           text: "hsl(215 25% 60%)"  },
  "In Progress": { bg: "hsl(38 95% 52% / 0.15)",     text: "hsl(38 95% 60%)"  },
  "Done":        { bg: "hsl(158 64% 40% / 0.15)",    text: "hsl(158 64% 55%)" },
  "Blocked":     { bg: "hsl(0 72% 51% / 0.15)",      text: "hsl(0 72% 68%)"   },
};

const SEED_TASKS: Task[] = [
  { id:"t1",  title:"Prepare Baghdad feasibility financial model",    project:"Baghdad Mixed-Use Tower",       assignee:"Ahmad",   priority:"High",   status:"In Progress", dueDate:"2026-03-25", description:"Build 3-scenario financial model with IRR/NPV for the mixed-use tower project.", tags:["Finance","Real Estate"] },
  { id:"t2",  title:"RTM territory mapping — Baghdad 5 zones",        project:"Iraq FMCG Distribution",        assignee:"Sara",    priority:"High",   status:"Todo",        dueDate:"2026-03-28", description:"Map Baghdad into 5 distribution territories with outlet count per zone.", tags:["FMCG","Distribution"] },
  { id:"t3",  title:"Competitor pricing analysis for F&B Erbil",      project:"Erbil F&B Concept Launch",      assignee:"Karwan",  priority:"Medium", status:"Done",        dueDate:"2026-03-20", description:"Price benchmarking for 12 premium F&B venues in Erbil city.", tags:["F&B","Pricing"] },
  { id:"t4",  title:"Telecom bundle options matrix",                   project:"Telecom Bundle Optimization",   assignee:"Hassan",  priority:"Medium", status:"In Progress", dueDate:"2026-04-01", description:"Compare 5 bundle configuration options with margin analysis.", tags:["Telecom","Pricing"] },
  { id:"t5",  title:"Risk register for Mosul manufacturing plant",    project:"Mosul Manufacturing Setup",     assignee:"Omar",    priority:"High",   status:"Blocked",     dueDate:"2026-03-30", description:"Full risk register covering regulatory, operational and financial risks.", tags:["Manufacturing","Risk"] },
  { id:"t6",  title:"Final report delivery — Jordan FMCG entry",      project:"Jordan FMCG Iraq Entry",        assignee:"Ahmad",   priority:"Low",    status:"Done",        dueDate:"2026-03-22", description:"Package and deliver final market entry report with distributor database.", tags:["FMCG","Delivery"] },
  { id:"t7",  title:"Location demand analysis — 3 Baghdad sites",     project:"Baghdad Mixed-Use Tower",       assignee:"Sara",    priority:"High",   status:"Todo",        dueDate:"2026-04-05", description:"Foot traffic and demand analysis for 3 shortlisted Baghdad locations.", tags:["Real Estate","Market"] },
  { id:"t8",  title:"Distributor shortlist — Baghdad modern trade",   project:"Iraq FMCG Distribution",        assignee:"Karwan",  priority:"Medium", status:"Todo",        dueDate:"2026-04-10", description:"Screen and shortlist 5 modern trade distributors for Baghdad expansion.", tags:["Distribution","CRM"] },
];

const COLUMNS: TaskStatus[] = ["Todo", "In Progress", "Done", "Blocked"];

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(SEED_TASKS);
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState<Priority | "All">("All");
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ title: "", project: "", assignee: "", priority: "Medium" as Priority, dueDate: "", description: "" });

  const filtered = tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.project.toLowerCase().includes(search.toLowerCase());
    const matchPriority = filterPriority === "All" || t.priority === filterPriority;
    return matchSearch && matchPriority;
  });

  const getByStatus = (status: TaskStatus) => filtered.filter(t => t.status === status);

  const handleCreate = () => {
    if (!form.title) { toast.error("Title is required"); return; }
    const nt: Task = {
      id: `t${Date.now()}`, title: form.title, project: form.project || "General", assignee: form.assignee || "Unassigned",
      priority: form.priority, status: "Todo", dueDate: form.dueDate || "TBD",
      description: form.description, tags: [],
    };
    setTasks(prev => [nt, ...prev]);
    setShowNew(false);
    setForm({ title:"", project:"", assignee:"", priority:"Medium", dueDate:"", description:"" });
    toast.success("Task created!");
  };

  const toggleDone = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: t.status === "Done" ? "Todo" : "Done" } : t));
  };

  const stats = {
    total: tasks.length,
    inProgress: tasks.filter(t => t.status === "In Progress").length,
    done: tasks.filter(t => t.status === "Done").length,
    blocked: tasks.filter(t => t.status === "Blocked").length,
    overdue: tasks.filter(t => t.status !== "Done" && t.dueDate < new Date().toISOString().split("T")[0]).length,
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold font-display" style={{ color:"hsl(210 40% 94%)" }}>Tasks & Execution</h1>
          <p className="text-sm mt-1" style={{ color:"hsl(215 25% 55%)" }}>Track delivery — from analysis to action</p>
        </div>
        <button onClick={() => setShowNew(true)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold"
          style={{ background:"hsl(38 95% 52%)", color:"hsl(216 58% 6%)" }}>
          <Plus className="h-4 w-4" /> New Task
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label:"Total Tasks",   value:stats.total,      color:"hsl(210 40% 85%)" },
          { label:"In Progress",   value:stats.inProgress, color:"hsl(38 95% 60%)"  },
          { label:"Completed",     value:stats.done,       color:"hsl(158 64% 55%)" },
          { label:"Blocked",       value:stats.blocked,    color:"hsl(0 72% 68%)"   },
          { label:"Overdue",       value:stats.overdue,    color:"hsl(0 72% 68%)"   },
        ].map((s,i) => (
          <div key={i} className="rounded-xl p-4 text-center" style={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))" }}>
            <p className="text-2xl font-bold" style={{ color:s.color }}>{s.value}</p>
            <p className="text-[11px] mt-1" style={{ color:"hsl(215 25% 50%)" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color:"hsl(215 25% 45%)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks or projects..."
            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm"
            style={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))", color:"hsl(210 40% 85%)" }} />
        </div>
        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value as any)}
          className="px-3 py-2 rounded-lg text-sm"
          style={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))", color:"hsl(210 40% 85%)" }}>
          <option value="All">All Priorities</option>
          <option>High</option><option>Medium</option><option>Low</option>
        </select>
        <div className="flex rounded-lg overflow-hidden" style={{ border:"1px solid hsl(var(--border))" }}>
          {(["kanban","list"] as const).map(v => (
            <button key={v} onClick={() => setView(v)} className="px-3 py-2 text-xs font-semibold capitalize"
              style={{ background:view===v?"hsl(38 95% 52% / 0.15)":"hsl(var(--card))", color:view===v?"hsl(38 95% 60%)":"hsl(215 25% 55%)" }}>
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Kanban View */}
      {view === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {COLUMNS.map(col => {
            const colTasks = getByStatus(col);
            const sc = STATUS_COLORS[col];
            return (
              <div key={col} className="rounded-xl" style={{ background:"hsl(216 45% 10%)", border:"1px solid hsl(var(--border))" }}>
                <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor:"hsl(var(--border))" }}>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold" style={{ color:sc.text }}>{col}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold" style={{ background:sc.bg, color:sc.text }}>{colTasks.length}</span>
                  </div>
                </div>
                <div className="p-3 space-y-2 min-h-[200px]">
                  {colTasks.map(t => {
                    const pc = PRIORITY_COLORS[t.priority];
                    return (
                      <div key={t.id} className="rounded-lg p-3 cursor-pointer transition-all hover:scale-[1.01]"
                        style={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))" }}>
                        <div className="flex items-start gap-2 mb-2">
                          <button onClick={() => toggleDone(t.id)} className="mt-0.5 shrink-0">
                            {t.status==="Done" ? <CheckCircle2 className="h-4 w-4" style={{ color:"hsl(158 64% 55%)" }} /> : <Circle className="h-4 w-4" style={{ color:"hsl(215 25% 40%)" }} />}
                          </button>
                          <p className="text-xs font-medium leading-snug" style={{ color:t.status==="Done"?"hsl(215 25% 45%)":"hsl(210 40% 88%)", textDecoration:t.status==="Done"?"line-through":"none" }}>{t.title}</p>
                        </div>
                        <p className="text-[10px] mb-2 pl-6" style={{ color:"hsl(215 25% 50%)" }}>{t.project}</p>
                        <div className="flex items-center justify-between pl-6">
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold" style={{ background:pc.bg, color:pc.text }}>{t.priority}</span>
                          <div className="flex items-center gap-1 text-[10px]" style={{ color:"hsl(215 25% 45%)" }}>
                            <Calendar className="h-3 w-3" />{t.dueDate}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {colTasks.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-xs" style={{ color:"hsl(215 25% 35%)" }}>No tasks</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <div className="rounded-xl overflow-hidden" style={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))" }}>
          <table className="w-full text-xs">
            <thead>
              <tr style={{ background:"hsl(216 45% 12%)" }}>
                {["","Task","Project","Assignee","Priority","Status","Due Date"].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-semibold" style={{ color:"hsl(215 25% 45%)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => {
                const pc = PRIORITY_COLORS[t.priority];
                const sc = STATUS_COLORS[t.status];
                return (
                  <tr key={t.id} style={{ borderTop:"1px solid hsl(var(--border))", background:i%2===0?"transparent":"hsl(216 45% 8% / 0.5)" }}>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleDone(t.id)}>
                        {t.status==="Done" ? <CheckCircle2 className="h-4 w-4" style={{ color:"hsl(158 64% 55%)" }} /> : <Circle className="h-4 w-4" style={{ color:"hsl(215 25% 40%)" }} />}
                      </button>
                    </td>
                    <td className="px-4 py-3 font-medium max-w-xs" style={{ color:t.status==="Done"?"hsl(215 25% 45%)":"hsl(210 40% 85%)", textDecoration:t.status==="Done"?"line-through":"none" }}>{t.title}</td>
                    <td className="px-4 py-3" style={{ color:"hsl(215 25% 60%)" }}>{t.project}</td>
                    <td className="px-4 py-3" style={{ color:"hsl(215 25% 60%)" }}>{t.assignee}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full font-semibold" style={{ background:pc.bg, color:pc.text }}>{t.priority}</span></td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full font-semibold" style={{ background:sc.bg, color:sc.text }}>{t.status}</span></td>
                    <td className="px-4 py-3" style={{ color:"hsl(215 25% 55%)" }}>{t.dueDate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* New Task Modal */}
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background:"rgba(0,0,0,0.7)" }}>
          <div className="w-full max-w-md rounded-2xl p-6 space-y-4" style={{ background:"hsl(216 52% 10%)", border:"1px solid hsl(var(--border))" }}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold" style={{ color:"hsl(210 40% 94%)" }}>New Task</h2>
              <button onClick={() => setShowNew(false)} style={{ color:"hsl(215 25% 55%)" }}>✕</button>
            </div>
            <div className="space-y-3">
              <input value={form.title} onChange={e => setForm(f => ({...f, title:e.target.value}))} placeholder="Task title *"
                className="w-full px-3 py-2.5 rounded-lg text-sm"
                style={{ background:"hsl(216 45% 14%)", border:"1px solid hsl(var(--border))", color:"hsl(210 40% 85%)" }} />
              <input value={form.project} onChange={e => setForm(f => ({...f, project:e.target.value}))} placeholder="Project name"
                className="w-full px-3 py-2.5 rounded-lg text-sm"
                style={{ background:"hsl(216 45% 14%)", border:"1px solid hsl(var(--border))", color:"hsl(210 40% 85%)" }} />
              <div className="grid grid-cols-2 gap-3">
                <input value={form.assignee} onChange={e => setForm(f => ({...f, assignee:e.target.value}))} placeholder="Assignee"
                  className="px-3 py-2.5 rounded-lg text-sm"
                  style={{ background:"hsl(216 45% 14%)", border:"1px solid hsl(var(--border))", color:"hsl(210 40% 85%)" }} />
                <select value={form.priority} onChange={e => setForm(f => ({...f, priority:e.target.value as Priority}))}
                  className="px-3 py-2.5 rounded-lg text-sm"
                  style={{ background:"hsl(216 45% 14%)", border:"1px solid hsl(var(--border))", color:"hsl(210 40% 85%)" }}>
                  <option>High</option><option>Medium</option><option>Low</option>
                </select>
              </div>
              <input type="date" value={form.dueDate} onChange={e => setForm(f => ({...f, dueDate:e.target.value}))}
                className="w-full px-3 py-2.5 rounded-lg text-sm"
                style={{ background:"hsl(216 45% 14%)", border:"1px solid hsl(var(--border))", color:"hsl(210 40% 85%)" }} />
              <textarea value={form.description} onChange={e => setForm(f => ({...f, description:e.target.value}))} placeholder="Description"
                rows={2} className="w-full px-3 py-2.5 rounded-lg text-sm resize-none"
                style={{ background:"hsl(216 45% 14%)", border:"1px solid hsl(var(--border))", color:"hsl(210 40% 85%)" }} />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowNew(false)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold"
                style={{ background:"hsl(216 45% 18%)", color:"hsl(210 40% 75%)" }}>Cancel</button>
              <button onClick={handleCreate} className="flex-1 py-2.5 rounded-lg text-sm font-semibold"
                style={{ background:"hsl(38 95% 52%)", color:"hsl(216 58% 6%)" }}>Create Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
