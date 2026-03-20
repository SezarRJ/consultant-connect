import { useState, useEffect } from "react";
import { CheckSquare, Plus, Search, X, Edit3, Trash2, Clock, CheckCircle2, Circle, AlertTriangle, Calendar, User, Tag, Filter } from "lucide-react";
import { toast } from "sonner";

type TaskStatus   = "todo"|"in_progress"|"blocked"|"done";
type TaskPriority = "urgent"|"high"|"medium"|"low";

interface Task {
  id:string; title:string; description:string; status:TaskStatus; priority:TaskPriority;
  dueDate:string; project:string; assignee:string; tags:string[]; createdAt:string;
}

const LS="consultai_tasks_v1";
const S_CFG:{[k in TaskStatus]:{label:string;color:string;bg:string}} = {
  todo:        {label:"To Do",      color:"hsl(215 25% 60%)",bg:"hsl(216 45% 18%)"},
  in_progress: {label:"In Progress",color:"hsl(38 95% 60%)", bg:"hsl(38 95% 52%/0.12)"},
  blocked:     {label:"Blocked",    color:"hsl(0 72% 68%)",  bg:"hsl(0 72% 51%/0.12)"},
  done:        {label:"Done",       color:"hsl(158 64% 55%)",bg:"hsl(158 64% 40%/0.12)"},
};
const P_CFG:{[k in TaskPriority]:{label:string;color:string}} = {
  urgent:{label:"Urgent",color:"hsl(0 72% 68%)"},
  high:  {label:"High",  color:"hsl(38 95% 60%)"},
  medium:{label:"Medium",color:"hsl(217 91% 70%)"},
  low:   {label:"Low",   color:"hsl(215 25% 55%)"},
};
const TEAM=["Ahmad Al-Rashidi","Sara Khalil","Omar Hassan","Nour Mahmoud","Layla Ibrahim","Karim Jaber"];
const PROJECTS=["Baghdad FMCG Market Entry","Erbil Tower Feasibility","ISO 9001 Basra","Jordan Pharma Export","General / Admin"];

const SAMPLE:Task[]=[
  {id:"t1",title:"Finalize distributor shortlist for Unilever Iraq",description:"Identify top 5 distributors in Baghdad with cold-chain capability. Include contact info and credit terms.",status:"in_progress",priority:"high",dueDate:"2026-04-01",project:"Baghdad FMCG Market Entry",assignee:"Sara Khalil",tags:["Distribution","Baghdad"],createdAt:"2026-03-01"},
  {id:"t2",title:"Prepare feasibility financial model v2",description:"Update IRR and NPV assumptions based on client feedback from March 15 review call.",status:"todo",priority:"urgent",dueDate:"2026-03-28",project:"Erbil Tower Feasibility",assignee:"Nour Mahmoud",tags:["Finance","Model"],createdAt:"2026-03-10"},
  {id:"t3",title:"Draft ISO gap analysis report",description:"Document all gaps found during the initial walkthrough against ISO 9001:2015 clauses 4-10.",status:"todo",priority:"medium",dueDate:"2026-03-31",project:"ISO 9001 Basra",assignee:"Sara Khalil",tags:["ISO","Documentation"],createdAt:"2026-03-05"},
  {id:"t4",title:"Send weekly update to Unilever stakeholder",description:"Prepare and send the weekly progress update email to VP Sales MENA.",status:"done",priority:"medium",dueDate:"2026-03-17",project:"Baghdad FMCG Market Entry",assignee:"Ahmad Al-Rashidi",tags:["Client Comms"],createdAt:"2026-03-14"},
  {id:"t5",title:"Jordan contract legal review follow-up",description:"Chase legal team at Hikma for contract redline. Deadline is end of March.",status:"blocked",priority:"high",dueDate:"2026-03-25",project:"Jordan Pharma Export",assignee:"Omar Hassan",tags:["Contract","Legal"],createdAt:"2026-03-12"},
  {id:"t6",title:"Competitor price benchmarking — Baghdad FMCG",description:"Mystery shopping exercise across 10 modern trade outlets in Baghdad.",status:"done",priority:"medium",dueDate:"2026-03-10",project:"Baghdad FMCG Market Entry",assignee:"Omar Hassan",tags:["Research","Pricing"],createdAt:"2026-02-25"},
];

const BLANK:Omit<Task,"id"|"createdAt">={title:"",description:"",status:"todo",priority:"medium",dueDate:new Date(Date.now()+7*86400000).toISOString().slice(0,10),project:PROJECTS[0],assignee:TEAM[0],tags:[]};

function load():Task[]{try{const d=JSON.parse(localStorage.getItem(LS)||"null");return d||SAMPLE;}catch{return SAMPLE;}}
function overdue(t:Task){return t.status!=="done"&&new Date(t.dueDate)<new Date();}

export default function Tasks(){
  const [tasks,setTasks]=useState<Task[]>(load);
  const [search,setSearch]=useState("");
  const [fStatus,setFStatus]=useState<TaskStatus|"all">("all");
  const [fPriority,setFPriority]=useState<TaskPriority|"all">("all");
  const [showForm,setShowForm]=useState(false);
  const [editId,setEditId]=useState<string|null>(null);
  const [form,setForm]=useState<Omit<Task,"id"|"createdAt">>(BLANK);
  const [newTag,setNewTag]=useState("");

  useEffect(()=>{localStorage.setItem(LS,JSON.stringify(tasks));},[tasks]);

  const filtered=tasks.filter(t=>
    (fStatus==="all"||t.status===fStatus)&&
    (fPriority==="all"||t.priority===fPriority)&&
    (search===""||t.title.toLowerCase().includes(search.toLowerCase())||t.project.toLowerCase().includes(search.toLowerCase()))
  );

  const stats={total:tasks.length,todo:tasks.filter(t=>t.status==="todo").length,inProgress:tasks.filter(t=>t.status==="in_progress").length,blocked:tasks.filter(t=>t.status==="blocked").length,done:tasks.filter(t=>t.status==="done").length,overdue:tasks.filter(overdue).length};

  const openNew=()=>{setForm(BLANK);setEditId(null);setShowForm(true);};
  const openEdit=(t:Task)=>{const{id,createdAt,...rest}=t;setForm(rest);setEditId(id);setShowForm(true);};
  const save=()=>{
    if(!form.title.trim()){toast.error("Title is required");return;}
    if(editId){setTasks(ts=>ts.map(t=>t.id===editId?{...t,...form}:t));toast.success("Task updated");}
    else{setTasks(ts=>[{...form,id:`t_${Date.now()}`,createdAt:new Date().toISOString().slice(0,10)},...ts]);toast.success("Task created");}
    setShowForm(false);
  };
  const del=(id:string)=>{setTasks(ts=>ts.filter(t=>t.id!==id));toast.success("Deleted");};
  const cycle=(t:Task)=>{
    const order:TaskStatus[]=["todo","in_progress","blocked","done"];
    const next=order[(order.indexOf(t.status)+1)%order.length];
    setTasks(ts=>ts.map(x=>x.id===t.id?{...x,status:next}:x));
    toast.success(`→ ${S_CFG[next].label}`);
  };

  const inp="w-full px-3 py-2 rounded-lg text-sm";
  const IS={background:"hsl(216 45% 12%)",border:"1px solid hsl(var(--border))",color:"hsl(210 40% 85%)"};

  return(
    <div className="space-y-5 max-w-5xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <CheckSquare className="h-6 w-6" style={{color:"hsl(38 95% 52%)"}}/>
          <div><h1 className="text-xl font-bold font-display" style={{color:"hsl(210 40% 92%)"}}>Tasks & Execution</h1><p className="text-xs" style={{color:"hsl(215 25% 55%)"}}>All deliverables across every project</p></div>
        </div>
        <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold" style={{background:"hsl(38 95% 52%)",color:"hsl(216 58% 6%)"}}>
          <Plus className="h-4 w-4"/> New Task
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {[{l:"Total",v:stats.total,c:"hsl(215 25% 60%)"},{l:"To Do",v:stats.todo,c:"hsl(217 91% 70%)"},{l:"In Progress",v:stats.inProgress,c:"hsl(38 95% 60%)"},{l:"Blocked",v:stats.blocked,c:"hsl(0 72% 68%)"},{l:"Done",v:stats.done,c:"hsl(158 64% 55%)"},{l:"Overdue",v:stats.overdue,c:"hsl(0 72% 68%)"}].map((s,i)=>(
          <div key={i} className="rounded-xl p-3 text-center" style={{background:"hsl(var(--card))",border:`1px solid ${s.l==="Overdue"&&s.v>0?"hsl(0 72% 51%/0.3)":"hsl(var(--border))"}`}}>
            <p className="text-lg font-bold" style={{color:s.c}}>{s.v}</p>
            <p className="text-[10px]" style={{color:"hsl(215 25% 50%)"}}>{s.l}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{color:"hsl(215 25% 45%)"}}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search tasks..." className="w-full pl-9 pr-3 py-2 rounded-lg text-sm" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))",color:"hsl(210 40% 85%)"}}/>
        </div>
        <select value={fStatus} onChange={e=>setFStatus(e.target.value as TaskStatus|"all")} className="px-3 py-2 rounded-lg text-sm" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))",color:"hsl(210 40% 85%)"}}>
          <option value="all">All Status</option>
          {(Object.entries(S_CFG) as [TaskStatus,typeof S_CFG[TaskStatus]][]).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={fPriority} onChange={e=>setFPriority(e.target.value as TaskPriority|"all")} className="px-3 py-2 rounded-lg text-sm" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))",color:"hsl(210 40% 85%)"}}>
          <option value="all">All Priority</option>
          {(Object.entries(P_CFG) as [TaskPriority,typeof P_CFG[TaskPriority]][]).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      {/* Task list */}
      <div className="space-y-2">
        {filtered.map(t=>{
          const sc=S_CFG[t.status];const pc=P_CFG[t.priority];const ov=overdue(t);
          return(
            <div key={t.id} className="rounded-xl px-4 py-3 flex items-start gap-3" style={{background:"hsl(var(--card))",border:`1px solid ${ov?"hsl(0 72% 51%/0.25)":"hsl(var(--border))"}`}}>
              <button onClick={()=>cycle(t)} className="mt-0.5 shrink-0">
                {t.status==="done"?<CheckCircle2 className="h-4 w-4" style={{color:"hsl(158 64% 55%)"}}/>:t.status==="blocked"?<AlertTriangle className="h-4 w-4" style={{color:"hsl(0 72% 68%)"}}/>:<Circle className="h-4 w-4" style={{color:"hsl(215 25% 40%)"}}/>}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold" style={{color:t.status==="done"?"hsl(215 25% 50%)":"hsl(210 40% 88%)",textDecoration:t.status==="done"?"line-through":"none"}}>{t.title}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold" style={{background:`${pc.color}18`,color:pc.color}}>{pc.label}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{background:sc.bg,color:sc.color}}>{sc.label}</span>
                  {ov&&<span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold" style={{background:"hsl(0 72% 51%/0.15)",color:"hsl(0 72% 68%)"}}>OVERDUE</span>}
                </div>
                {t.description&&<p className="text-xs mt-0.5" style={{color:"hsl(215 25% 52%)"}}>{t.description}</p>}
                <div className="flex items-center gap-3 mt-1 text-[10px] flex-wrap" style={{color:"hsl(215 25% 45%)"}}>
                  <span><Calendar className="h-2.5 w-2.5 inline mr-0.5"/>{t.dueDate}</span>
                  <span><User className="h-2.5 w-2.5 inline mr-0.5"/>{t.assignee.split(" ")[0]}</span>
                  <span style={{color:"hsl(217 91% 60%)"}}>{t.project}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {t.tags.map(tag=><span key={tag} className="hidden md:inline-flex text-[9px] px-1.5 py-0.5 rounded-full" style={{background:"hsl(217 91% 70%/0.1)",color:"hsl(217 91% 70%)"}}>{tag}</span>)}
                <button onClick={()=>openEdit(t)} className="p-1.5 rounded hover:bg-white/5"><Edit3 className="h-3.5 w-3.5" style={{color:"hsl(215 25% 45%)"}}/></button>
                <button onClick={()=>del(t.id)} className="p-1.5 rounded hover:bg-white/5"><Trash2 className="h-3.5 w-3.5" style={{color:"hsl(0 72% 60%)"}}/></button>
              </div>
            </div>
          );
        })}
        {filtered.length===0&&<div className="rounded-xl p-10 text-center" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
          <CheckSquare className="h-12 w-12 mx-auto mb-3 opacity-15" style={{color:"hsl(38 95% 52%)"}}/>
          <p style={{color:"hsl(215 25% 45%)"}}>No tasks match your filters</p>
        </div>}
      </div>

      {/* Form */}
      {showForm&&(
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto" style={{background:"rgba(0,0,0,0.75)"}}>
          <div className="w-full max-w-lg rounded-2xl p-6 space-y-4 my-8" style={{background:"hsl(216 52% 10%)",border:"1px solid hsl(var(--border))"}}>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold" style={{color:"hsl(210 40% 94%)"}}>{editId?"Edit Task":"New Task"}</h2>
              <button onClick={()=>setShowForm(false)} style={{color:"hsl(215 25% 55%)"}}><X className="h-5 w-5"/></button>
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{color:"hsl(215 25% 45%)"}}>Title *</label>
              <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Task title..." className={inp} style={IS}/>
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{color:"hsl(215 25% 45%)"}}>Description</label>
              <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={3} placeholder="Details..." className={`${inp} resize-none`} style={IS}/>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[{l:"Status",k:"status",opts:Object.keys(S_CFG)},{l:"Priority",k:"priority",opts:Object.keys(P_CFG)},{l:"Project",k:"project",opts:PROJECTS},{l:"Assignee",k:"assignee",opts:TEAM}].map(f=>(
                <div key={f.k}>
                  <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{color:"hsl(215 25% 45%)"}}>{f.l}</label>
                  <select value={(form as any)[f.k]} onChange={e=>setForm(prev=>({...prev,[f.k]:e.target.value}))} className={inp} style={IS}>
                    {f.opts.map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{color:"hsl(215 25% 45%)"}}>Due Date</label>
                <input type="date" value={form.dueDate} onChange={e=>setForm(f=>({...f,dueDate:e.target.value}))} className={inp} style={IS}/>
              </div>
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{color:"hsl(215 25% 45%)"}}>Tags</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {form.tags.map(t=><span key={t} className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full" style={{background:"hsl(217 91% 70%/0.1)",color:"hsl(217 91% 70%)",border:"1px solid hsl(217 91% 70%/0.2)"}}>{t}<button onClick={()=>setForm(f=>({...f,tags:f.tags.filter(x=>x!==t)}))}><X className="h-2.5 w-2.5"/></button></span>)}
              </div>
              <input value={newTag} onChange={e=>setNewTag(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&newTag.trim()){setForm(f=>({...f,tags:[...f.tags,newTag.trim()]}));setNewTag("");}}} placeholder="Type tag, press Enter" className={inp} style={IS}/>
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={()=>setShowForm(false)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold" style={{background:"hsl(216 45% 18%)",color:"hsl(210 40% 75%)"}}>Cancel</button>
              <button onClick={save} className="flex-1 py-2.5 rounded-lg text-sm font-bold" style={{background:"hsl(38 95% 52%)",color:"hsl(216 58% 6%)"}}>{editId?"Save Changes":"Create Task"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
