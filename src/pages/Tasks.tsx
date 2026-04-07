import { useState } from "react";
import { CheckSquare, Plus, Search, X, Edit3, Trash2, Clock, CheckCircle2,
  Circle, AlertTriangle, Calendar, User, Tag, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask, type Task } from "@/hooks/useTasks";

type TaskStatus   = Task["status"];
type TaskPriority = Task["priority"];

const S_CFG: Record<TaskStatus,{label:string;color:string;bg:string;icon:any}> = {
  todo:        {label:"To Do",      color:"hsl(215 25% 60%)",bg:"hsl(216 45% 18%)",      icon:Circle       },
  in_progress: {label:"In Progress",color:"hsl(38 95% 60%)", bg:"hsl(38 95% 52%/0.12)",  icon:Clock        },
  blocked:     {label:"Blocked",    color:"hsl(0 72% 68%)",  bg:"hsl(0 72% 51%/0.12)",   icon:AlertTriangle},
  done:        {label:"Done",       color:"hsl(158 64% 55%)",bg:"hsl(158 64% 40%/0.12)", icon:CheckCircle2 },
};
const P_CFG: Record<TaskPriority,{label:string;color:string}> = {
  urgent:{label:"Urgent",color:"hsl(0 72% 68%)"},
  high:  {label:"High",  color:"hsl(38 95% 60%)"},
  medium:{label:"Medium",color:"hsl(217 91% 70%)"},
  low:   {label:"Low",   color:"hsl(215 25% 55%)"},
};
const IS = {background:"hsl(216 45% 12%)",border:"1px solid hsl(var(--border))",color:"hsl(210 40% 85%)"};
const BLANK: Omit<Task,"id"|"createdAt"> = {
  title:"",description:"",status:"todo",priority:"medium",
  dueDate:new Date(Date.now()+7*86400000).toISOString().slice(0,10),
  project:"",assignee:"",tags:[]
};

function overdue(t:Task){return t.status!=="done"&&t.dueDate&&new Date(t.dueDate)<new Date();}

export default function Tasks() {
  const { data:tasks=[], isLoading, isError } = useTasks();
  const create = useCreateTask(); const update = useUpdateTask(); const remove = useDeleteTask();

  const [search,   setSearch]   = useState("");
  const [fStatus,  setFStatus]  = useState<TaskStatus|"all">("all");
  const [fPriority,setFPriority]= useState<TaskPriority|"all">("all");
  const [showForm, setShowForm] = useState(false);
  const [editId,   setEditId]   = useState<string|null>(null);
  const [form,     setForm]     = useState<Omit<Task,"id"|"createdAt">>(BLANK);
  const [newTag,   setNewTag]   = useState("");

  const filtered = tasks.filter(t=>
    (fStatus  ==="all"||t.status  ===fStatus) &&
    (fPriority==="all"||t.priority===fPriority) &&
    (search===""||t.title.toLowerCase().includes(search.toLowerCase())||t.project.toLowerCase().includes(search.toLowerCase()))
  );

  const openForm = (task?:Task) => {
    if(task){setEditId(task.id);setForm({title:task.title,description:task.description,status:task.status,priority:task.priority,dueDate:task.dueDate,project:task.project,assignee:task.assignee,tags:[...task.tags]});}
    else{setEditId(null);setForm(BLANK);}
    setShowForm(true);
  };

  const save = async () => {
    if(!form.title.trim()){toast.error("Title required");return;}
    if(editId){await update.mutateAsync({id:editId,...form});toast.success("Task updated");}
    else{await create.mutateAsync(form);toast.success("Task created");}
    setShowForm(false);
  };

  const quickStatus = async (t:Task, s:TaskStatus) => {
    await update.mutateAsync({id:t.id,status:s});
  };

  if(isLoading) return <div className="flex items-center justify-center h-64 gap-2 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin"/><span className="text-sm">Loading tasks…</span></div>;
  if(isError)   return <div className="flex items-center justify-center h-64 gap-2" style={{color:"hsl(0 72% 68%)"}}><AlertTriangle className="h-5 w-5"/><span className="text-sm">Failed to load. Check Supabase.</span></div>;

  const counts = {todo:tasks.filter(t=>t.status==="todo").length,in_progress:tasks.filter(t=>t.status==="in_progress").length,blocked:tasks.filter(t=>t.status==="blocked").length,done:tasks.filter(t=>t.status==="done").length};

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold font-display" style={{color:"hsl(210 40% 94%)"}}>Tasks</h1>
          <p className="text-xs mt-0.5" style={{color:"hsl(215 25% 50%)"}}>All tasks — live from your database</p>
        </div>
        <button onClick={()=>openForm()} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold"
          style={{background:"hsl(38 95% 52%)",color:"hsl(216 58% 6%)"}}>
          <Plus className="h-4 w-4"/>New Task
        </button>
      </div>

      {/* Status bar */}
      <div className="grid grid-cols-4 gap-3">
        {(Object.entries(S_CFG) as [TaskStatus, typeof S_CFG[TaskStatus]][]).map(([k,c])=>(
          <button key={k} onClick={()=>setFStatus(fStatus===k?"all":k)}
            className="rounded-xl p-3 text-left transition-all"
            style={{background:fStatus===k?c.color+"18":"hsl(216 45% 11%)",border:`1px solid ${fStatus===k?c.color+"55":"hsl(var(--border))"}` }}>
            <p className="text-lg font-bold" style={{color:c.color}}>{counts[k]}</p>
            <p className="text-[11px]" style={{color:"hsl(215 25% 50%)"}}>{c.label}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{color:"hsl(215 25% 45%)"}}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search tasks…"
            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm" style={IS}/>
        </div>
        {(["all","urgent","high","medium","low"] as const).map(v=>(
          <button key={v} onClick={()=>setFPriority(v==="all"?"all":v as TaskPriority)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize"
            style={{background:fPriority===v?"hsl(217 91% 60%)":"hsl(216 45% 15%)",color:fPriority===v?"#fff":"hsl(215 25% 55%)"}}>
            {v==="all"?"All Priority":v}
          </button>
        ))}
      </div>

      {/* Task list */}
      {filtered.length===0?(
        <div className="rounded-xl p-12 text-center bg-card border border-border">
          <CheckSquare className="h-10 w-10 mx-auto mb-3 opacity-20" style={{color:"hsl(38 95% 52%)"}}/>
          <p className="text-sm font-semibold" style={{color:"hsl(215 25% 50%)"}}>No tasks found</p>
          <p className="text-xs mt-1 mb-4" style={{color:"hsl(215 25% 38%)"}}>Create your first task to start tracking work</p>
          <button onClick={()=>openForm()} className="px-4 py-2 rounded-lg text-sm font-semibold"
            style={{background:"hsl(38 95% 52%)",color:"hsl(216 58% 6%)"}}>Add Task</button>
        </div>
      ):(
        <div className="space-y-2">
          {filtered.map(t=>{
            const sc=S_CFG[t.status]; const pc=P_CFG[t.priority]; const Icon=sc.icon;
            const isOverdue=overdue(t);
            return(
              <div key={t.id} className="rounded-xl px-4 py-3.5 flex items-start gap-3"
                style={{background:"hsl(216 45% 11%)",border:`1px solid ${isOverdue?"hsl(0 72% 51%/0.35)":"hsl(var(--border))"}` }}>
                {/* Status toggle */}
                <button onClick={()=>quickStatus(t,t.status==="done"?"todo":"done")} className="mt-0.5 shrink-0">
                  <Icon className="h-4 w-4" style={{color:sc.color}}/>
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold" style={{color:t.status==="done"?"hsl(215 25% 45%)":"hsl(210 40% 88%)",textDecoration:t.status==="done"?"line-through":"none"}}>{t.title}</p>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{background:sc.bg,color:sc.color}}>{sc.label}</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{background:pc.color+"18",color:pc.color}}>{pc.label}</span>
                    {isOverdue&&<span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{background:"hsl(0 72% 51%/0.15)",color:"hsl(0 72% 68%)"}}>Overdue</span>}
                  </div>
                  {t.description&&<p className="text-xs mt-0.5 truncate" style={{color:"hsl(215 25% 50%)"}}>{t.description}</p>}
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    {t.project&&<span className="text-[10px] flex items-center gap-1" style={{color:"hsl(215 25% 45%)"}}><Tag className="h-2.5 w-2.5"/>{t.project}</span>}
                    {t.assignee&&<span className="text-[10px] flex items-center gap-1" style={{color:"hsl(215 25% 45%)"}}><User className="h-2.5 w-2.5"/>{t.assignee}</span>}
                    {t.dueDate&&<span className="text-[10px] flex items-center gap-1" style={{color:isOverdue?"hsl(0 72% 68%)":"hsl(215 25% 45%)"}}><Calendar className="h-2.5 w-2.5"/>{t.dueDate}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={()=>openForm(t)} className="p-1.5 rounded-lg" style={{background:"hsl(216 45% 18%)"}}>
                    <Edit3 className="h-3 w-3" style={{color:"hsl(215 25% 55%)"}}/>
                  </button>
                  <button onClick={async()=>{await remove.mutateAsync(t.id);toast.success("Deleted");}} className="p-1.5 rounded-lg" style={{background:"hsl(0 72% 51%/0.1)"}}>
                    <Trash2 className="h-3 w-3" style={{color:"hsl(0 72% 68%)"}}/>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Form modal */}
      {showForm&&(
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{background:"rgba(0,0,0,0.6)"}}>
          <div className="w-full max-w-lg rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            style={{background:"hsl(216 52% 10%)",border:"1px solid hsl(var(--border))"}}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm" style={{color:"hsl(210 40% 90%)"}}>
                {editId?"Edit Task":"New Task"}
              </h3>
              <button onClick={()=>setShowForm(false)}><X className="h-4 w-4" style={{color:"hsl(215 25% 50%)"}}/></button>
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{color:"hsl(215 25% 45%)"}}>Title *</label>
              <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))}
                className="w-full px-3 py-2 rounded-lg text-sm" style={IS} placeholder="Task title…"/>
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{color:"hsl(215 25% 45%)"}}>Description</label>
              <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={2}
                className="w-full px-3 py-2 rounded-lg text-sm resize-none" style={IS}/>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{color:"hsl(215 25% 45%)"}}>Status</label>
                <select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value as TaskStatus}))}
                  className="w-full px-3 py-2 rounded-lg text-sm" style={IS}>
                  {(Object.keys(S_CFG) as TaskStatus[]).map(s=><option key={s} value={s}>{S_CFG[s].label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{color:"hsl(215 25% 45%)"}}>Priority</label>
                <select value={form.priority} onChange={e=>setForm(f=>({...f,priority:e.target.value as TaskPriority}))}
                  className="w-full px-3 py-2 rounded-lg text-sm" style={IS}>
                  {(Object.keys(P_CFG) as TaskPriority[]).map(p=><option key={p} value={p}>{P_CFG[p].label}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{color:"hsl(215 25% 45%)"}}>Due Date</label>
                <input type="date" value={form.dueDate} onChange={e=>setForm(f=>({...f,dueDate:e.target.value}))}
                  className="w-full px-3 py-2 rounded-lg text-sm" style={IS}/>
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{color:"hsl(215 25% 45%)"}}>Assignee</label>
                <input value={form.assignee} onChange={e=>setForm(f=>({...f,assignee:e.target.value}))}
                  className="w-full px-3 py-2 rounded-lg text-sm" style={IS} placeholder="Name…"/>
              </div>
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{color:"hsl(215 25% 45%)"}}>Project</label>
              <input value={form.project} onChange={e=>setForm(f=>({...f,project:e.target.value}))}
                className="w-full px-3 py-2 rounded-lg text-sm" style={IS} placeholder="Project name…"/>
            </div>
            {/* Tags */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{color:"hsl(215 25% 45%)"}}>Tags</label>
              <div className="flex gap-1.5 flex-wrap mb-2">
                {form.tags.map(tag=>(
                  <span key={tag} className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full"
                    style={{background:"hsl(217 91% 53%/0.15)",color:"hsl(217 91% 70%)"}}>
                    {tag}<button onClick={()=>setForm(f=>({...f,tags:f.tags.filter(t=>t!==tag)}))}>×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={newTag} onChange={e=>setNewTag(e.target.value)}
                  onKeyDown={e=>{if(e.key==="Enter"&&newTag.trim()){setForm(f=>({...f,tags:[...f.tags,newTag.trim()]}));setNewTag("");}}}
                  className="flex-1 px-3 py-2 rounded-lg text-sm" style={IS} placeholder="Add tag + Enter"/>
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={()=>setShowForm(false)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold"
                style={{background:"hsl(216 45% 18%)",color:"hsl(210 40% 75%)"}}>Cancel</button>
              <button onClick={save} disabled={create.isPending||update.isPending}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-60"
                style={{background:"hsl(38 95% 52%)",color:"hsl(216 58% 6%)"}}>
                {create.isPending||update.isPending?"Saving…":(editId?"Update":"Create")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
