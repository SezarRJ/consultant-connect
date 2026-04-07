import { useState, useEffect } from "react";
import {
  FolderKanban, Plus, Search, DollarSign, Zap, CheckCircle2, Circle,
  AlertTriangle, X, Edit3, Trash2, Eye, FolderOpen
} from "lucide-react";
import { toast } from "sonner";

type Status   = "pipeline"|"active"|"review"|"completed"|"on_hold";
type Priority = "critical"|"high"|"medium"|"low";

interface Milestone { id:string; title:string; dueDate:string; done:boolean; }
interface Project {
  id:string; name:string; client:string; country:string; industry:string; type:string;
  status:Status; priority:Priority; value:number; currency:string;
  startDate:string; endDate:string; progress:number; lead:string;
  team:string[]; tags:string[]; milestones:Milestone[]; notes:string; createdAt:string;
}

const LS_KEY = "consultai_projects_v1";
const S_CFG:{[k in Status]:{label:string;color:string;bg:string}} = {
  pipeline:  {label:"Pipeline",  color:"hsl(217 91% 70%)",bg:"hsl(217 91% 53%/0.12)"},
  active:    {label:"Active",    color:"hsl(158 64% 55%)",bg:"hsl(158 64% 40%/0.12)"},
  review:    {label:"In Review", color:"hsl(38 95% 60%)", bg:"hsl(38 95% 52%/0.12)" },
  completed: {label:"Completed", color:"hsl(158 64% 55%)",bg:"hsl(158 64% 40%/0.12)"},
  on_hold:   {label:"On Hold",   color:"hsl(0 72% 68%)",  bg:"hsl(0 72% 51%/0.12)"  },
};
const P_CFG:{[k in Priority]:{label:string;color:string}} = {
  critical:{label:"Critical",color:"hsl(0 72% 68%)"},
  high:    {label:"High",    color:"hsl(38 95% 60%)"},
  medium:  {label:"Medium",  color:"hsl(217 91% 70%)"},
  low:     {label:"Low",     color:"hsl(215 25% 55%)"},
};
const INDS   = ["FMCG","Food & Beverage","Construction","Healthcare","Technology","Retail","Manufacturing","Energy","Telecom","Real Estate","Finance","Logistics"];
const TYPES  = ["Market Entry","Feasibility Study","ISO Preparation","Company Development","Partner Matching","Sales Strategy","Export Readiness","Risk Assessment","Custom"];
const CTRS   = ["Iraq","Jordan","UAE","Saudi Arabia","Kuwait","Qatar","Bahrain","Oman","Egypt","Turkey"];

const BLANK:Omit<Project,"id"|"createdAt"> = {name:"",client:"",country:"Iraq",industry:"FMCG",type:"Market Entry",status:"pipeline",priority:"medium",value:0,currency:"USD",startDate:new Date().toISOString().slice(0,10),endDate:new Date(Date.now()+90*86400000).toISOString().slice(0,10),progress:0,lead:"",team:[],tags:[],milestones:[],notes:""};

function load():Project[]{try{const d=JSON.parse(localStorage.getItem(LS_KEY)||"null");return d||[];}catch{return [];}}
function daysLeft(d:string){return Math.ceil((new Date(d).getTime()-Date.now())/86400000);}

export default function Projects(){
  const [projects,setProjects]=useState<Project[]>(load);
  const [view,setView]=useState<"board"|"list">("board");
  const [search,setSearch]=useState("");
  const [fStatus,setFStatus]=useState<Status|"all">("all");
  const [showForm,setShowForm]=useState(false);
  const [editId,setEditId]=useState<string|null>(null);
  const [selId,setSelId]=useState<string|null>(null);
  const [form,setForm]=useState<Omit<Project,"id"|"createdAt">>(BLANK);
  const [newTag,setNewTag]=useState("");
  const [newMile,setNewMile]=useState({title:"",dueDate:""});

  useEffect(()=>{localStorage.setItem(LS_KEY,JSON.stringify(projects));},[projects]);

  const filtered=projects.filter(p=>(fStatus==="all"||p.status===fStatus)&&(search===""||p.name.toLowerCase().includes(search.toLowerCase())||p.client.toLowerCase().includes(search.toLowerCase())));
  const sel=projects.find(p=>p.id===selId);
  const stats={total:projects.length,active:projects.filter(p=>p.status==="active").length,revenue:projects.reduce((s,p)=>s+p.value,0),completed:projects.filter(p=>p.status==="completed").length};

  const openNew=()=>{setForm(BLANK);setEditId(null);setShowForm(true);};
  const openEdit=(p:Project)=>{const{id,createdAt,...rest}=p;setForm(rest);setEditId(id);setShowForm(true);};
  const save=()=>{
    if(!form.name.trim()||!form.client.trim()){toast.error("Name and client are required");return;}
    if(editId){setProjects(ps=>ps.map(p=>p.id===editId?{...p,...form}:p));toast.success("Project updated");}
    else{setProjects(ps=>[{...form,id:`p_${Date.now()}`,createdAt:new Date().toISOString().slice(0,10)},...ps]);toast.success("Project created");}
    setShowForm(false);
  };
  const del=(id:string)=>{setProjects(ps=>ps.filter(p=>p.id!==id));if(selId===id)setSelId(null);toast.success("Deleted");};
  const toggleMile=(pid:string,mid:string)=>setProjects(ps=>ps.map(p=>p.id===pid?{...p,milestones:p.milestones.map(m=>m.id===mid?{...m,done:!m.done}:m)}:p));
  const addMile=()=>{if(!newMile.title||!newMile.dueDate)return;setForm(f=>({...f,milestones:[...f.milestones,{id:`m_${Date.now()}`,...newMile,done:false}]}));setNewMile({title:"",dueDate:""});};

  const inp="w-full px-3 py-2 rounded-lg text-sm";
  const IS={background:"hsl(216 45% 12%)",border:"1px solid hsl(var(--border))",color:"hsl(210 40% 85%)"};

  const Card=({p}:{p:Project})=>{
    const sc=S_CFG[p.status];const pc=P_CFG[p.priority];const dl=daysLeft(p.endDate);const ov=dl<0&&p.status!=="completed";
    return(
      <div onClick={()=>setSelId(p.id)} className="rounded-xl p-4 cursor-pointer transition-all"
        style={{background:"hsl(var(--card))",border:`1px solid ${selId===p.id?"hsl(38 95% 52%/0.5)":"hsl(var(--border))"}`,transform:selId===p.id?"none":""}}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="text-xs font-semibold leading-tight flex-1" style={{color:"hsl(210 40% 88%)"}}>{p.name}</p>
          <button onClick={e=>{e.stopPropagation();openEdit(p);}} className="p-1 rounded hover:bg-white/5 shrink-0"><Edit3 className="h-3 w-3" style={{color:"hsl(215 25% 45%)"}}/></button>
        </div>
        <p className="text-[10px] mb-2" style={{color:"hsl(215 25% 50%)"}}>{p.client} · {p.country}</p>
        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
          <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold" style={{background:`${pc.color}18`,color:pc.color}}>{pc.label}</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{background:sc.bg,color:sc.color}}>{sc.label}</span>
        </div>
        <div className="mb-2">
          <div className="flex justify-between text-[9px] mb-1" style={{color:"hsl(215 25% 45%)"}}>
            <span>{p.progress}%</span>
            <span style={{color:ov?"hsl(0 72% 68%)":"hsl(215 25% 45%)"}}>{ov?`${Math.abs(dl)}d overdue`:p.status==="completed"?"Done":`${dl}d left`}</span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{background:"hsl(216 45% 18%)"}}>
            <div className="h-full rounded-full" style={{width:`${p.progress}%`,background:p.progress===100?"hsl(158 64% 55%)":"hsl(38 95% 52%)"}}/>
          </div>
        </div>
        <div className="flex items-center justify-between text-[10px]">
          <span style={{color:"hsl(38 95% 60%)"}}>${p.value.toLocaleString()}</span>
          <span style={{color:"hsl(215 25% 45%)"}}>{p.lead.split(" ")[0]}</span>
        </div>
      </div>
    );
  };

  return(
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <FolderKanban className="h-6 w-6" style={{color:"hsl(38 95% 52%)"}}/>
          <div><h1 className="text-xl font-bold font-display" style={{color:"hsl(210 40% 92%)"}}>Projects</h1><p className="text-xs" style={{color:"hsl(215 25% 55%)"}}>All consulting engagements · pipeline to delivery</p></div>
        </div>
        <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold" style={{background:"hsl(38 95% 52%)",color:"hsl(216 58% 6%)"}}>
          <Plus className="h-4 w-4"/> New Project
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[{l:"Total",v:stats.total,c:"hsl(217 91% 70%)",I:FolderKanban},{l:"Active",v:stats.active,c:"hsl(158 64% 55%)",I:Zap},{l:"Completed",v:stats.completed,c:"hsl(38 95% 60%)",I:CheckCircle2},{l:"Revenue",v:`$${(stats.revenue/1000).toFixed(0)}K`,c:"hsl(38 95% 60%)",I:DollarSign}].map((s,i)=>(
          <div key={i} className="rounded-xl p-4 flex items-center gap-3" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
            <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{background:`${s.c}18`}}><s.I className="h-4 w-4" style={{color:s.c}}/></div>
            <div><p className="text-xl font-bold" style={{color:s.c}}>{s.v}</p><p className="text-[10px]" style={{color:"hsl(215 25% 50%)"}}>{s.l}</p></div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{color:"hsl(215 25% 45%)"}}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search projects or clients..."
            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))",color:"hsl(210 40% 85%)"}}/>
        </div>
        <select value={fStatus} onChange={e=>setFStatus(e.target.value as Status|"all")} className="px-3 py-2 rounded-lg text-sm" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))",color:"hsl(210 40% 85%)"}}>
          <option value="all">All Status</option>
          {(Object.entries(S_CFG) as [Status,typeof S_CFG[Status]][]).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
        </select>
        <div className="flex items-center gap-1 rounded-lg p-1" style={{background:"hsl(216 45% 12%)"}}>
          {(["board","list"] as const).map(v=>(
            <button key={v} onClick={()=>setView(v)} className="px-3 py-1.5 rounded text-xs font-semibold capitalize"
              style={{background:view===v?"hsl(38 95% 52%)":"transparent",color:view===v?"hsl(216 58% 6%)":"hsl(215 25% 55%)"}}>{v}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex gap-4">
        <div className={`flex-1 min-w-0 ${sel?"hidden lg:block":""}`}>
          {view==="board"?(
            <div className="flex gap-3 overflow-x-auto pb-4">
              {(Object.entries(S_CFG) as [Status,typeof S_CFG[Status]][]).map(([s,c])=>{
                const col=filtered.filter(p=>p.status===s);
                return(
                  <div key={s} className="flex-1 min-w-56">
                    <div className="flex items-center gap-2 mb-3 px-1">
                      <span className="text-xs font-bold uppercase tracking-wider" style={{color:c.color}}>{c.label}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full ml-auto" style={{background:c.bg,color:c.color}}>{col.length}</span>
                    </div>
                    <div className="space-y-2">
                      {col.map(p=><Card key={p.id} p={p}/>)}
                      {col.length===0&&<div className="rounded-xl p-4 text-center" style={{border:"1px dashed hsl(var(--border))"}}>
                        <p className="text-[11px]" style={{color:"hsl(215 25% 38%)"}}>No projects</p></div>}
                    </div>
                  </div>
                );
              })}
            </div>
          ):(
            <div className="rounded-xl overflow-hidden" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
              <table className="w-full text-xs">
                <thead><tr style={{background:"hsl(216 45% 11%)",borderBottom:"1px solid hsl(var(--border))"}}>
                  {["Project","Client","Status","Priority","Value","Progress","End Date","Lead",""].map(h=><th key={h} className="px-4 py-3 text-left font-semibold whitespace-nowrap" style={{color:"hsl(215 25% 45%)"}}>{h}</th>)}
                </tr></thead>
                <tbody>{filtered.map((p,i)=>{
                  const sc=S_CFG[p.status];const pc=P_CFG[p.priority];
                  return(
                    <tr key={p.id} onClick={()=>setSelId(p.id)} className="cursor-pointer" style={{borderTop:"1px solid hsl(var(--border))",background:i%2===0?"transparent":"hsl(216 45% 8%/0.4)"}}>
                      <td className="px-4 py-3 font-medium max-w-48 truncate" style={{color:"hsl(210 40% 88%)"}}>{p.name}</td>
                      <td className="px-4 py-3" style={{color:"hsl(215 25% 60%)"}}>{p.client}</td>
                      <td className="px-4 py-3"><span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{background:sc.bg,color:sc.color}}>{sc.label}</span></td>
                      <td className="px-4 py-3"><span className="text-[10px] font-semibold" style={{color:pc.color}}>{pc.label}</span></td>
                      <td className="px-4 py-3 font-semibold" style={{color:"hsl(38 95% 60%)"}}>${p.value.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-20 rounded-full overflow-hidden" style={{background:"hsl(216 45% 18%)"}}>
                            <div className="h-full" style={{width:`${p.progress}%`,background:"hsl(38 95% 52%)"}}/>
                          </div>
                          <span style={{color:"hsl(215 25% 55%)"}}>{p.progress}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3" style={{color:"hsl(215 25% 55%)"}}>{p.endDate}</td>
                      <td className="px-4 py-3" style={{color:"hsl(215 25% 60%)"}}>{p.lead.split(" ")[0]}</td>
                      <td className="px-3 py-3">
                        <div className="flex gap-1">
                          <button onClick={e=>{e.stopPropagation();openEdit(p);}} className="p-1.5 rounded hover:bg-white/5"><Edit3 className="h-3 w-3" style={{color:"hsl(215 25% 45%)"}}/></button>
                          <button onClick={e=>{e.stopPropagation();del(p.id);}} className="p-1.5 rounded hover:bg-white/5"><Trash2 className="h-3 w-3" style={{color:"hsl(0 72% 60%)"}}/></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}</tbody>
              </table>
              {filtered.length===0&&<div className="p-10 text-center"><p style={{color:"hsl(215 25% 45%)"}}>No projects match filters</p></div>}
            </div>
          )}
        </div>

        {/* Detail panel */}
        {sel&&(
          <div className="w-full lg:w-80 xl:w-96 shrink-0 rounded-2xl p-5 overflow-y-auto" style={{background:"hsl(var(--card))",border:"1px solid hsl(38 95% 52%/0.2)",maxHeight:"calc(100vh - 200px)"}}>
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h2 className="text-sm font-bold" style={{color:"hsl(210 40% 92%)"}}>{sel.name}</h2>
                <p className="text-[11px] mt-0.5" style={{color:"hsl(215 25% 55%)"}}>{sel.client} · {sel.country} · {sel.industry}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={()=>openEdit(sel)} className="p-1.5 rounded-lg" style={{background:"hsl(216 45% 18%)"}}><Edit3 className="h-3.5 w-3.5" style={{color:"hsl(215 25% 60%)"}}/></button>
                <button onClick={()=>del(sel.id)} className="p-1.5 rounded-lg" style={{background:"hsl(0 72% 51%/0.1)"}}><Trash2 className="h-3.5 w-3.5" style={{color:"hsl(0 72% 68%)"}}/></button>
                <button onClick={()=>setSelId(null)} className="p-1.5 rounded-lg" style={{background:"hsl(216 45% 18%)"}}><X className="h-3.5 w-3.5" style={{color:"hsl(215 25% 60%)"}}/></button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[{l:"Value",v:`$${sel.value.toLocaleString()}`,c:"hsl(38 95% 60%)"},{l:"Progress",v:`${sel.progress}%`,c:"hsl(158 64% 55%)"},{l:"Milestones",v:`${sel.milestones.filter(m=>m.done).length}/${sel.milestones.length}`,c:"hsl(217 91% 70%)"}].map((s,i)=>(
                <div key={i} className="rounded-lg p-2.5 text-center" style={{background:"hsl(216 45% 12%)"}}><p className="text-sm font-bold" style={{color:s.c}}>{s.v}</p><p className="text-[9px]" style={{color:"hsl(215 25% 45%)"}}>{s.l}</p></div>
              ))}
            </div>
            {/* Status change */}
            <div className="mb-4">
              <p className="text-[10px] font-bold uppercase mb-2" style={{color:"hsl(215 25% 45%)"}}>Status</p>
              <div className="flex flex-wrap gap-1.5">
                {(Object.entries(S_CFG) as [Status,typeof S_CFG[Status]][]).map(([s,c])=>(
                  <button key={s} onClick={()=>{setProjects(ps=>ps.map(p=>p.id===sel.id?{...p,status:s}:p));toast.success(`Moved to ${c.label}`);}}
                    className="text-[11px] px-2.5 py-1 rounded-lg font-semibold"
                    style={{background:sel.status===s?c.bg:"hsl(216 45% 14%)",color:sel.status===s?c.color:"hsl(215 25% 50%)",border:`1px solid ${sel.status===s?c.color+"40":"hsl(var(--border))"}`}}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <p className="text-[10px] font-bold uppercase" style={{color:"hsl(215 25% 45%)"}}>Completion</p>
                <span className="text-[10px] font-bold" style={{color:"hsl(38 95% 60%)"}}>{sel.progress}%</span>
              </div>
              <input type="range" min={0} max={100} step={5} value={sel.progress}
                onChange={e=>setProjects(ps=>ps.map(p=>p.id===sel.id?{...p,progress:Number(e.target.value)}:p))}
                className="w-full accent-amber-500"/>
            </div>
            {/* Milestones */}
            {sel.milestones.length>0&&(
              <div className="mb-4">
                <p className="text-[10px] font-bold uppercase mb-2" style={{color:"hsl(215 25% 45%)"}}>Milestones</p>
                <div className="space-y-1.5">
                  {sel.milestones.map(m=>(
                    <div key={m.id} onClick={()=>toggleMile(sel.id,m.id)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer" style={{background:"hsl(216 45% 12%)"}}>
                      {m.done?<CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{color:"hsl(158 64% 55%)"}}/>:<Circle className="h-3.5 w-3.5 shrink-0" style={{color:"hsl(215 25% 40%)"}}/> }
                      <span className="text-xs flex-1" style={{color:m.done?"hsl(215 25% 45%)":"hsl(210 40% 82%)",textDecoration:m.done?"line-through":"none"}}>{m.title}</span>
                      <span className="text-[10px]" style={{color:"hsl(215 25% 40%)"}}>{m.dueDate}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Team + dates */}
            <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
              <div className="rounded-lg p-2.5" style={{background:"hsl(216 45% 12%)"}}>
                <p className="text-[9px] font-bold uppercase mb-1" style={{color:"hsl(215 25% 45%)"}}>Lead</p>
                <p style={{color:"hsl(210 40% 82%)"}}>{sel.lead}</p>
              </div>
              <div className="rounded-lg p-2.5" style={{background:"hsl(216 45% 12%)"}}>
                <p className="text-[9px] font-bold uppercase mb-1" style={{color:"hsl(215 25% 45%)"}}>Timeline</p>
                <p style={{color:"hsl(210 40% 82%)"}}>{sel.startDate}</p>
                <p style={{color:"hsl(215 25% 45%)"}}>{sel.endDate}</p>
              </div>
            </div>
            {sel.tags.length>0&&(
              <div className="flex flex-wrap gap-1.5 mb-3">
                {sel.tags.map(t=><span key={t} className="text-[10px] px-2 py-0.5 rounded-full" style={{background:"hsl(217 91% 70%/0.1)",color:"hsl(217 91% 70%)",border:"1px solid hsl(217 91% 70%/0.2)"}}>{t}</span>)}
              </div>
            )}
            {sel.notes&&<div className="rounded-lg p-3" style={{background:"hsl(216 45% 12%)"}}>
              <p className="text-[9px] font-bold uppercase mb-1" style={{color:"hsl(215 25% 45%)"}}>Notes</p>
              <p className="text-xs" style={{color:"hsl(215 25% 60%)"}}>{sel.notes}</p>
            </div>}
          </div>
        )}
      </div>

      {/* Form */}
      {showForm&&(
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto" style={{background:"rgba(0,0,0,0.75)"}}>
          <div className="w-full max-w-2xl rounded-2xl p-6 space-y-5 my-8" style={{background:"hsl(216 52% 10%)",border:"1px solid hsl(var(--border))"}}>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold" style={{color:"hsl(210 40% 94%)"}}>{editId?"Edit Project":"New Project"}</h2>
              <button onClick={()=>setShowForm(false)} style={{color:"hsl(215 25% 55%)"}}><X className="h-5 w-5"/></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{color:"hsl(215 25% 45%)"}}>Project Name *</label>
                <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Baghdad FMCG Market Entry — Client Name" className={inp} style={IS}/>
              </div>
              {[{l:"Client *",k:"client",ph:"Client company name"},{l:"Country",k:"country",opts:CTRS},{l:"Industry",k:"industry",opts:INDS},{l:"Type",k:"type",opts:TYPES},{l:"Status",k:"status",opts:Object.keys(S_CFG)},{l:"Priority",k:"priority",opts:Object.keys(P_CFG)},{l:"Lead Consultant",k:"lead",ph:"Your name or team lead"}].map(f=>
                <div key={f.k}>
                  <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{color:"hsl(215 25% 45%)"}}>{f.l}</label>
                  {f.opts?<select value={(form as any)[f.k]} onChange={e=>setForm(prev=>({...prev,[f.k]:e.target.value}))} className={inp} style={IS}>{f.opts.map(o=><option key={o}>{o}</option>)}</select>
                  :<input value={(form as any)[f.k]} onChange={e=>setForm(prev=>({...prev,[f.k]:e.target.value}))} placeholder={f.ph} className={inp} style={IS}/>}
                </div>
              )}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{color:"hsl(215 25% 45%)"}}>Value (USD)</label>
                <input type="number" value={form.value} onChange={e=>setForm(f=>({...f,value:Number(e.target.value)}))} className={inp} style={IS}/>
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{color:"hsl(215 25% 45%)"}}>Start Date</label>
                <input type="date" value={form.startDate} onChange={e=>setForm(f=>({...f,startDate:e.target.value}))} className={inp} style={IS}/>
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{color:"hsl(215 25% 45%)"}}>End Date</label>
                <input type="date" value={form.endDate} onChange={e=>setForm(f=>({...f,endDate:e.target.value}))} className={inp} style={IS}/>
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{color:"hsl(215 25% 45%)"}}>Progress %</label>
                <div className="flex items-center gap-3">
                  <input type="range" min={0} max={100} step={5} value={form.progress} onChange={e=>setForm(f=>({...f,progress:Number(e.target.value)}))} className="flex-1 accent-amber-500"/>
                  <span className="text-sm font-bold w-10 text-right" style={{color:"hsl(38 95% 60%)"}}>{form.progress}%</span>
                </div>
              </div>
            </div>
            {/* Tags */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{color:"hsl(215 25% 45%)"}}>Tags</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {form.tags.map(t=><span key={t} className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full" style={{background:"hsl(217 91% 70%/0.1)",color:"hsl(217 91% 70%)",border:"1px solid hsl(217 91% 70%/0.2)"}}>{t}<button onClick={()=>setForm(f=>({...f,tags:f.tags.filter(x=>x!==t)}))}><X className="h-2.5 w-2.5"/></button></span>)}
              </div>
              <input value={newTag} onChange={e=>setNewTag(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&newTag.trim()){setForm(f=>({...f,tags:[...f.tags,newTag.trim()]}));setNewTag("");}}} placeholder="Type tag and press Enter" className={inp} style={IS}/>
            </div>
            {/* Milestones */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{color:"hsl(215 25% 45%)"}}>Milestones</label>
              <div className="space-y-1.5 mb-2">
                {form.milestones.map(m=><div key={m.id} className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg" style={{background:"hsl(216 45% 12%)"}}>
                  <CheckCircle2 className="h-3 w-3 shrink-0" style={{color:"hsl(158 64% 55%)"}}/>
                  <span className="flex-1" style={{color:"hsl(210 40% 82%)"}}>{m.title}</span>
                  <span style={{color:"hsl(215 25% 45%)"}}>{m.dueDate}</span>
                  <button onClick={()=>setForm(f=>({...f,milestones:f.milestones.filter(x=>x.id!==m.id)}))}><X className="h-3 w-3" style={{color:"hsl(0 72% 60%)"}}/></button>
                </div>)}
              </div>
              <div className="flex gap-2">
                <input value={newMile.title} onChange={e=>setNewMile(m=>({...m,title:e.target.value}))} placeholder="Milestone title" className={`flex-1 ${inp}`} style={IS}/>
                <input type="date" value={newMile.dueDate} onChange={e=>setNewMile(m=>({...m,dueDate:e.target.value}))} className={`w-36 ${inp}`} style={IS}/>
                <button onClick={addMile} className="px-3 py-2 rounded-lg text-xs font-bold" style={{background:"hsl(38 95% 52%/0.15)",color:"hsl(38 95% 60%)"}}>Add</button>
              </div>
            </div>
            {/* Notes */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{color:"hsl(215 25% 45%)"}}>Notes</label>
              <textarea value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} rows={3} placeholder="Client preferences, key contacts, special requirements..." className={`${inp} resize-none`} style={IS}/>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={()=>setShowForm(false)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold" style={{background:"hsl(216 45% 18%)",color:"hsl(210 40% 75%)"}}>Cancel</button>
              <button onClick={save} className="flex-1 py-2.5 rounded-lg text-sm font-bold" style={{background:"hsl(38 95% 52%)",color:"hsl(216 58% 6%)"}}>{editId?"Save Changes":"Create Project"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
