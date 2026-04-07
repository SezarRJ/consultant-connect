import { useState } from "react";
import { FolderKanban, Plus, Search, DollarSign, CheckCircle2, Circle,
  AlertTriangle, X, Edit3, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject, type Project } from "@/hooks/useProjects";

type Status   = Project["status"];
type Priority = Project["priority"];

const S_CFG: Record<Status,{label:string;color:string;bg:string}> = {
  pipeline:  {label:"Pipeline",  color:"hsl(217 91% 70%)",bg:"hsl(217 91% 53%/0.12)"},
  active:    {label:"Active",    color:"hsl(158 64% 55%)",bg:"hsl(158 64% 40%/0.12)"},
  review:    {label:"In Review", color:"hsl(38 95% 60%)", bg:"hsl(38 95% 52%/0.12)" },
  completed: {label:"Completed", color:"hsl(158 64% 55%)",bg:"hsl(158 64% 40%/0.12)"},
  on_hold:   {label:"On Hold",   color:"hsl(0 72% 68%)",  bg:"hsl(0 72% 51%/0.12)"  },
};
const P_CFG: Record<Priority,{label:string;color:string}> = {
  critical:{label:"Critical",color:"hsl(0 72% 68%)"},
  high:    {label:"High",    color:"hsl(38 95% 60%)"},
  medium:  {label:"Medium",  color:"hsl(217 91% 70%)"},
  low:     {label:"Low",     color:"hsl(215 25% 55%)"},
};
const IS = {background:"hsl(216 45% 12%)",border:"1px solid hsl(var(--border))",color:"hsl(210 40% 85%)"};
const INDS=["FMCG","Food & Beverage","Construction","Healthcare","Technology","Retail","Manufacturing","Energy","Telecom","Real Estate","Finance","Logistics"];
const TYPES=["Market Entry","Feasibility Study","ISO Preparation","Company Development","Partner Matching","Sales Strategy","Export Readiness","Risk Assessment","Custom"];
const CTRS=["Iraq","Jordan","UAE","Saudi Arabia","Kuwait","Qatar","Bahrain","Oman","Egypt","Turkey"];
const fmt=(n:number,c="USD")=>new Intl.NumberFormat("en-US",{style:"currency",currency:c,maximumFractionDigits:0}).format(n);
const daysLeft=(d:string)=>Math.ceil((new Date(d).getTime()-Date.now())/86400000);

const BLANK: Omit<Project,"id"|"createdAt"> = {
  name:"",client:"",country:"Iraq",industry:"FMCG",type:"Market Entry",
  status:"pipeline",priority:"medium",value:0,currency:"USD",
  startDate:new Date().toISOString().slice(0,10),
  endDate:new Date(Date.now()+90*86400000).toISOString().slice(0,10),
  progress:0,leadName:"",team:[],tags:[],milestones:[],notes:""
};

export default function Projects() {
  const { data:projects=[], isLoading, isError } = useProjects();
  const create=useCreateProject(); const upd=useUpdateProject(); const del=useDeleteProject();

  const [view,     setView]    = useState<"board"|"list">("board");
  const [search,   setSearch]  = useState("");
  const [fStatus,  setFStatus] = useState<Status|"all">("all");
  const [showForm, setShowForm]= useState(false);
  const [editId,   setEditId]  = useState<string|null>(null);
  const [selId,    setSelId]   = useState<string|null>(null);
  const [form,     setForm]    = useState<Omit<Project,"id"|"createdAt">>(BLANK);

  const filtered = projects.filter(p=>
    (fStatus==="all"||p.status===fStatus) &&
    (search===""||p.name.toLowerCase().includes(search.toLowerCase())||p.client.toLowerCase().includes(search.toLowerCase()))
  );

  const totalValue = projects.filter(p=>p.status==="active"||p.status==="review").reduce((s,p)=>s+p.value,0);

  const openForm=(proj?:Project)=>{
    if(proj){setEditId(proj.id);setForm({name:proj.name,client:proj.client,country:proj.country,industry:proj.industry,type:proj.type,status:proj.status,priority:proj.priority,value:proj.value,currency:proj.currency,startDate:proj.startDate,endDate:proj.endDate,progress:proj.progress,leadName:proj.leadName,team:[...proj.team],tags:[...proj.tags],milestones:[...proj.milestones],notes:proj.notes});}
    else{setEditId(null);setForm(BLANK);}
    setShowForm(true);
  };

  const save=async()=>{
    if(!form.name.trim()){toast.error("Project name required");return;}
    if(editId){await upd.mutateAsync({id:editId,...form});toast.success("Project updated");}
    else{await create.mutateAsync(form);toast.success("Project created");}
    setShowForm(false);
  };

  if(isLoading) return <div className="flex items-center justify-center h-64 gap-2 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin"/><span className="text-sm">Loading projects…</span></div>;
  if(isError)   return <div className="flex items-center justify-center h-64 gap-2" style={{color:"hsl(0 72% 68%)"}}><AlertTriangle className="h-5 w-5"/><span className="text-sm">Failed to load. Check Supabase.</span></div>;

  const sel=projects.find(p=>p.id===selId);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold font-display" style={{color:"hsl(210 40% 94%)"}}>Projects</h1>
          <p className="text-xs mt-0.5" style={{color:"hsl(215 25% 50%)"}}>
            {projects.length} projects · {fmt(totalValue)} active value
          </p>
        </div>
        <div className="flex gap-2">
          {(["board","list"] as const).map(v=>(
            <button key={v} onClick={()=>setView(v)} className="px-3 py-2 rounded-lg text-xs font-semibold capitalize"
              style={{background:view===v?"hsl(38 95% 52%)":"hsl(216 45% 15%)",color:view===v?"hsl(216 58% 6%)":"hsl(215 25% 55%)"}}>
              {v}
            </button>
          ))}
          <button onClick={()=>openForm()} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
            style={{background:"hsl(38 95% 52%)",color:"hsl(216 58% 6%)"}}>
            <Plus className="h-4 w-4"/>New Project
          </button>
        </div>
      </div>

      {/* Status tabs + search */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{color:"hsl(215 25% 45%)"}}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search projects…"
            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm" style={IS}/>
        </div>
        {(["all",...Object.keys(S_CFG)] as const).map(v=>(
          <button key={v} onClick={()=>setFStatus(v as Status|"all")}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold"
            style={{background:fStatus===v?"hsl(217 91% 60%)":"hsl(216 45% 15%)",color:fStatus===v?"#fff":"hsl(215 25% 55%)"}}>
            {v==="all"?"All":(S_CFG[v as Status]?.label||v)}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length===0?(
        <div className="rounded-xl p-12 text-center bg-card border border-border">
          <FolderKanban className="h-10 w-10 mx-auto mb-3 opacity-20" style={{color:"hsl(38 95% 52%)"}}/>
          <p className="text-sm font-semibold" style={{color:"hsl(215 25% 50%)"}}>No projects yet</p>
          <p className="text-xs mt-1 mb-4" style={{color:"hsl(215 25% 38%)"}}>Create your first project to start tracking engagements</p>
          <button onClick={()=>openForm()} className="px-4 py-2 rounded-lg text-sm font-semibold"
            style={{background:"hsl(38 95% 52%)",color:"hsl(216 58% 6%)"}}>Add Project</button>
        </div>
      ) : view==="board" ? (
        // Board view by status
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {(Object.keys(S_CFG) as Status[]).map(st=>{
            const col=filtered.filter(p=>p.status===st);
            const sc=S_CFG[st];
            return(
              <div key={st} className="rounded-xl p-3 min-h-[200px]"
                style={{background:"hsl(216 45% 10%)",border:`1px solid ${sc.color}30`}}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{background:sc.bg,color:sc.color}}>{sc.label}</span>
                  <span className="text-[10px]" style={{color:"hsl(215 25% 45%)"}}>{col.length}</span>
                </div>
                <div className="space-y-2">
                  {col.map(p=>(
                    <button key={p.id} onClick={()=>setSelId(selId===p.id?null:p.id)}
                      className="w-full text-left rounded-lg p-3 transition-all"
                      style={{background:selId===p.id?"hsl(38 95% 52%/0.1)":"hsl(216 45% 13%)",border:`1px solid ${selId===p.id?"hsl(38 95% 52%/0.3)":"hsl(var(--border))"}` }}>
                      <p className="text-xs font-semibold truncate" style={{color:"hsl(210 40% 88%)"}}>{p.name}</p>
                      <p className="text-[10px] mt-0.5 truncate" style={{color:"hsl(215 25% 45%)"}}>{p.client}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px]" style={{color:P_CFG[p.priority].color}}>{P_CFG[p.priority].label}</span>
                        <span className="text-[10px] font-bold" style={{color:"hsl(38 95% 60%)"}}>{fmt(p.value,p.currency)}</span>
                      </div>
                      <div className="mt-2 h-1 rounded-full overflow-hidden" style={{background:"hsl(216 45% 20%)"}}>
                        <div className="h-full rounded-full" style={{width:`${p.progress}%`,background:sc.color}}/>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // List view
        <div className="rounded-xl overflow-hidden bg-card border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr style={{background:"hsl(216 45% 11%)",borderBottom:"1px solid hsl(var(--border))"}}>
                {["Project","Client","Status","Priority","Value","Progress","Due",""].map((h,i)=>(
                  <th key={i} className="px-4 py-3 text-left font-semibold" style={{color:"hsl(215 25% 45%)"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p,i)=>{
                const sc=S_CFG[p.status]; const pc=P_CFG[p.priority];
                const dl=p.endDate?daysLeft(p.endDate):null;
                return(
                  <tr key={p.id} style={{borderTop:i>0?"1px solid hsl(var(--border))":"none"}}>
                    <td className="px-4 py-3 max-w-[200px]">
                      <p className="font-semibold truncate" style={{color:"hsl(210 40% 88%)"}}>{p.name}</p>
                      <p className="text-[10px] truncate" style={{color:"hsl(215 25% 45%)"}}>{p.type}</p>
                    </td>
                    <td className="px-4 py-3 truncate max-w-[120px]" style={{color:"hsl(215 25% 55%)"}}>{p.client}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{background:sc.bg,color:sc.color}}>{sc.label}</span></td>
                    <td className="px-4 py-3"><span className="text-[10px] font-bold" style={{color:pc.color}}>{pc.label}</span></td>
                    <td className="px-4 py-3 font-bold" style={{color:"hsl(38 95% 60%)"}}>{fmt(p.value,p.currency)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{background:"hsl(216 45% 20%)"}}>
                          <div className="h-full rounded-full" style={{width:`${p.progress}%`,background:sc.color}}/>
                        </div>
                        <span style={{color:"hsl(215 25% 50%)"}}>{p.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{color:dl!==null&&dl<0?"hsl(0 72% 68%)":"hsl(215 25% 50%)"}}>{p.endDate||"—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={()=>openForm(p)} className="p-1.5 rounded-lg" style={{background:"hsl(216 45% 18%)"}}>
                          <Edit3 className="h-3 w-3" style={{color:"hsl(215 25% 55%)"}}/>
                        </button>
                        <button onClick={async()=>{await del.mutateAsync(p.id);toast.success("Deleted");}} className="p-1.5 rounded-lg" style={{background:"hsl(0 72% 51%/0.1)"}}>
                          <Trash2 className="h-3 w-3" style={{color:"hsl(0 72% 68%)"}}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail panel for board */}
      {sel&&view==="board"&&(
        <div className="rounded-xl p-5 space-y-3 bg-card border border-border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold" style={{color:"hsl(210 40% 90%)"}}>{sel.name}</p>
              <p className="text-xs mt-0.5" style={{color:"hsl(215 25% 50%)"}}>{sel.client} · {sel.country} · {sel.industry}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>openForm(sel)} className="p-2 rounded-lg" style={{background:"hsl(216 45% 18%)"}}>
                <Edit3 className="h-3.5 w-3.5" style={{color:"hsl(215 25% 55%)"}}/>
              </button>
              <button onClick={()=>setSelId(null)}><X className="h-4 w-4" style={{color:"hsl(215 25% 50%)"}}/></button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[["Value",fmt(sel.value,sel.currency)],["Progress",`${sel.progress}%`],["Lead",sel.leadName||"—"]].map(([l,v])=>(
              <div key={l} className="rounded-lg p-3" style={{background:"hsl(216 45% 13%)"}}>
                <p className="text-[10px]" style={{color:"hsl(215 25% 45%)"}}>{l}</p>
                <p className="text-sm font-bold" style={{color:"hsl(38 95% 60%)"}}>{v}</p>
              </div>
            ))}
          </div>
          {sel.notes&&<p className="text-xs" style={{color:"hsl(215 25% 50%)"}}>{sel.notes}</p>}
          {sel.milestones.length>0&&(
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{color:"hsl(215 25% 45%)"}}>Milestones</p>
              {sel.milestones.map((m,i)=>(
                <div key={i} className="flex items-center gap-2 py-1">
                  {m.done?<CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{color:"hsl(158 64% 55%)"}}/>
                        :<Circle className="h-3.5 w-3.5 shrink-0" style={{color:"hsl(215 25% 45%)"}}/>}
                  <span className="text-xs" style={{color:m.done?"hsl(215 25% 45%)":"hsl(210 40% 80%)",textDecoration:m.done?"line-through":"none"}}>{m.title}</span>
                  <span className="text-[10px] ml-auto" style={{color:"hsl(215 25% 40%)"}}>{m.dueDate}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Form modal */}
      {showForm&&(
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{background:"rgba(0,0,0,0.6)"}}>
          <div className="w-full max-w-lg rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            style={{background:"hsl(216 52% 10%)",border:"1px solid hsl(var(--border))"}}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm" style={{color:"hsl(210 40% 90%)"}}>
                {editId?"Edit Project":"New Project"}
              </h3>
              <button onClick={()=>setShowForm(false)}><X className="h-4 w-4" style={{color:"hsl(215 25% 50%)"}}/></button>
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{color:"hsl(215 25% 45%)"}}>Project Name *</label>
              <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}
                className="w-full px-3 py-2 rounded-lg text-sm" style={IS}/>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{color:"hsl(215 25% 45%)"}}>Client</label>
                <input value={form.client} onChange={e=>setForm(f=>({...f,client:e.target.value}))} className="w-full px-3 py-2 rounded-lg text-sm" style={IS}/>
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{color:"hsl(215 25% 45%)"}}>Country</label>
                <select value={form.country} onChange={e=>setForm(f=>({...f,country:e.target.value}))} className="w-full px-3 py-2 rounded-lg text-sm" style={IS}>
                  {CTRS.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{color:"hsl(215 25% 45%)"}}>Industry</label>
                <select value={form.industry} onChange={e=>setForm(f=>({...f,industry:e.target.value}))} className="w-full px-3 py-2 rounded-lg text-sm" style={IS}>
                  {INDS.map(i=><option key={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{color:"hsl(215 25% 45%)"}}>Type</label>
                <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))} className="w-full px-3 py-2 rounded-lg text-sm" style={IS}>
                  {TYPES.map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{color:"hsl(215 25% 45%)"}}>Status</label>
                <select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value as Status}))} className="w-full px-3 py-2 rounded-lg text-sm" style={IS}>
                  {(Object.keys(S_CFG) as Status[]).map(s=><option key={s} value={s}>{S_CFG[s].label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{color:"hsl(215 25% 45%)"}}>Priority</label>
                <select value={form.priority} onChange={e=>setForm(f=>({...f,priority:e.target.value as Priority}))} className="w-full px-3 py-2 rounded-lg text-sm" style={IS}>
                  {(Object.keys(P_CFG) as Priority[]).map(p=><option key={p} value={p}>{P_CFG[p].label}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{color:"hsl(215 25% 45%)"}}>Contract Value (USD)</label>
                <input type="number" min={0} value={form.value} onChange={e=>setForm(f=>({...f,value:Number(e.target.value)}))} className="w-full px-3 py-2 rounded-lg text-sm" style={IS}/>
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{color:"hsl(215 25% 45%)"}}>Progress %</label>
                <input type="number" min={0} max={100} value={form.progress} onChange={e=>setForm(f=>({...f,progress:Math.min(100,Math.max(0,Number(e.target.value)))}))} className="w-full px-3 py-2 rounded-lg text-sm" style={IS}/>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{color:"hsl(215 25% 45%)"}}>Start Date</label>
                <input type="date" value={form.startDate} onChange={e=>setForm(f=>({...f,startDate:e.target.value}))} className="w-full px-3 py-2 rounded-lg text-sm" style={IS}/>
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{color:"hsl(215 25% 45%)"}}>End Date</label>
                <input type="date" value={form.endDate} onChange={e=>setForm(f=>({...f,endDate:e.target.value}))} className="w-full px-3 py-2 rounded-lg text-sm" style={IS}/>
              </div>
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{color:"hsl(215 25% 45%)"}}>Lead</label>
              <input value={form.leadName} onChange={e=>setForm(f=>({...f,leadName:e.target.value}))} className="w-full px-3 py-2 rounded-lg text-sm" style={IS} placeholder="Lead consultant name…"/>
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{color:"hsl(215 25% 45%)"}}>Notes</label>
              <textarea value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} rows={2} className="w-full px-3 py-2 rounded-lg text-sm resize-none" style={IS}/>
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={()=>setShowForm(false)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold"
                style={{background:"hsl(216 45% 18%)",color:"hsl(210 40% 75%)"}}>Cancel</button>
              <button onClick={save} disabled={create.isPending||upd.isPending}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-60"
                style={{background:"hsl(38 95% 52%)",color:"hsl(216 58% 6%)"}}>
                {create.isPending||upd.isPending?"Saving…":(editId?"Update":"Create")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
