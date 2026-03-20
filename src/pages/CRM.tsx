import { useState, useEffect } from "react";
import {
  Users, Plus, Search, X, Edit3, Trash2, Phone, Mail, Globe,
  Building2, Star, TrendingUp, MessageSquare, Calendar, DollarSign, CheckCircle2
} from "lucide-react";
import { toast } from "sonner";

type Stage = "lead"|"qualified"|"proposal"|"negotiation"|"won"|"lost";
interface Contact {
  id:string; company:string; name:string; role:string; email:string; phone:string;
  country:string; industry:string; stage:Stage; value:number; lastContact:string;
  notes:string; tags:string[]; createdAt:string;
}

const LS="consultai_crm_v1";
const ST:{[k in Stage]:{label:string;color:string;bg:string}} = {
  lead:        {label:"Lead",        color:"hsl(215 25% 60%)",bg:"hsl(216 45% 18%)"},
  qualified:   {label:"Qualified",   color:"hsl(217 91% 70%)",bg:"hsl(217 91% 53%/0.12)"},
  proposal:    {label:"Proposal",    color:"hsl(280 80% 70%)",bg:"hsl(280 80% 60%/0.12)"},
  negotiation: {label:"Negotiation", color:"hsl(38 95% 60%)", bg:"hsl(38 95% 52%/0.12)"},
  won:         {label:"Won",         color:"hsl(158 64% 55%)",bg:"hsl(158 64% 40%/0.12)"},
  lost:        {label:"Lost",        color:"hsl(0 72% 68%)",  bg:"hsl(0 72% 51%/0.12)"},
};
const CTRS=["Iraq","Jordan","UAE","Saudi Arabia","Kuwait","Qatar","Bahrain","Oman","Egypt","Turkey"];
const INDS=["FMCG","Food & Beverage","Construction","Healthcare","Technology","Retail","Manufacturing","Energy","Telecom","Real Estate","Finance"];

const SAMPLE:Contact[]=[
  {id:"c1",company:"Unilever Iraq",name:"James Mitchell",role:"VP Sales MENA",email:"j.mitchell@unilever.com",phone:"+964 770 100 0001",country:"Iraq",industry:"FMCG",stage:"won",value:42000,lastContact:"2026-03-18",notes:"Key relationship. Interested in follow-on engagement for Basra distribution.",tags:["Active Client","FMCG","Priority"],createdAt:"2026-01-15"},
  {id:"c2",company:"Kurdistan Group for Investment",name:"Dara Salih",role:"CEO",email:"dara@kgi.iq",phone:"+964 750 200 0002",country:"Iraq",industry:"Real Estate",stage:"negotiation",value:85000,lastContact:"2026-03-15",notes:"Erbil tower project in review. Expects final report by April 30.",tags:["Real Estate","KRG","VIP"],createdAt:"2026-01-08"},
  {id:"c3",company:"Gulf Oil Services Co.",name:"Tariq Al-Obaidi",role:"GM Operations",email:"t.obaidi@gulfos.com",phone:"+964 780 300 0003",country:"Iraq",industry:"Energy",stage:"won",value:28000,lastContact:"2026-03-10",notes:"ISO 9001 project started. Very engaged team on their side.",tags:["Active Client","ISO","Basra"],createdAt:"2026-02-18"},
  {id:"c4",company:"Hikma Pharmaceuticals",name:"Rania Suleiman",role:"Director Strategy",email:"r.suleiman@hikma.com",phone:"+962 6 580 2000",country:"Jordan",industry:"Healthcare",stage:"proposal",value:35000,lastContact:"2026-03-12",notes:"Contract in legal review. Very interested in our MENA export framework.",tags:["Pharma","Jordan","High Value"],createdAt:"2026-03-05"},
  {id:"c5",company:"Baghdad Telecom Group",name:"Ali Kareem",role:"Head of Business Development",email:"a.kareem@btg.iq",phone:"+964 771 400 0005",country:"Iraq",industry:"Telecom",stage:"qualified",value:18000,lastContact:"2026-03-08",notes:"Interested in market entry analysis for B2B product line. Follow up after Eid.",tags:["Telecom","Warm Lead"],createdAt:"2026-02-28"},
  {id:"c6",company:"Al Rawdah Foods",name:"Fatima Al-Zahra",role:"Marketing Director",email:"f.alzahra@alrawdah.ae",phone:"+971 4 300 0006",country:"UAE",industry:"Food & Beverage",stage:"won",value:22000,lastContact:"2026-02-01",notes:"Project completed. Discussed follow-on engagement for Saudi Arabia expansion.",tags:["F&B","UAE","Completed"],createdAt:"2025-09-10"},
  {id:"c7",company:"Mosul Construction LLC",name:"Khalid Nouri",role:"COO",email:"k.nouri@mosulcon.iq",phone:"+964 760 500 0007",country:"Iraq",industry:"Construction",stage:"lead",value:0,lastContact:"2026-03-01",notes:"Inbound inquiry. Interested in company development consulting.",tags:["Mosul","Inbound","New"],createdAt:"2026-03-01"},
];

const BLANK:Omit<Contact,"id"|"createdAt">={company:"",name:"",role:"",email:"",phone:"",country:"Iraq",industry:"FMCG",stage:"lead",value:0,lastContact:new Date().toISOString().slice(0,10),notes:"",tags:[]};

function load():Contact[]{try{const d=JSON.parse(localStorage.getItem(LS)||"null");return d||SAMPLE;}catch{return SAMPLE;}}

export default function CRM(){
  const [contacts,setContacts]=useState<Contact[]>(load);
  const [search,setSearch]=useState("");
  const [fStage,setFStage]=useState<Stage|"all">("all");
  const [showForm,setShowForm]=useState(false);
  const [editId,setEditId]=useState<string|null>(null);
  const [selId,setSelId]=useState<string|null>(null);
  const [form,setForm]=useState<Omit<Contact,"id"|"createdAt">>(BLANK);
  const [newTag,setNewTag]=useState("");

  useEffect(()=>{localStorage.setItem(LS,JSON.stringify(contacts));},[contacts]);

  const filtered=contacts.filter(c=>(fStage==="all"||c.stage===fStage)&&(search===""||c.company.toLowerCase().includes(search.toLowerCase())||c.name.toLowerCase().includes(search.toLowerCase())));
  const sel=contacts.find(c=>c.id===selId);
  const pipeline=contacts.filter(c=>!["won","lost"].includes(c.stage)).reduce((s,c)=>s+c.value,0);
  const won=contacts.filter(c=>c.stage==="won").reduce((s,c)=>s+c.value,0);

  const openNew=()=>{setForm(BLANK);setEditId(null);setShowForm(true);};
  const openEdit=(c:Contact)=>{const{id,createdAt,...rest}=c;setForm(rest);setEditId(id);setShowForm(true);};
  const save=()=>{
    if(!form.company.trim()||!form.name.trim()){toast.error("Company and name required");return;}
    if(editId){setContacts(cs=>cs.map(c=>c.id===editId?{...c,...form}:c));toast.success("Contact updated");}
    else{setContacts(cs=>[{...form,id:`c_${Date.now()}`,createdAt:new Date().toISOString().slice(0,10)},...cs]);toast.success("Contact added");}
    setShowForm(false);
  };
  const del=(id:string)=>{setContacts(cs=>cs.filter(c=>c.id!==id));if(selId===id)setSelId(null);toast.success("Deleted");};

  const inp="w-full px-3 py-2 rounded-lg text-sm";
  const IS={background:"hsl(216 45% 12%)",border:"1px solid hsl(var(--border))",color:"hsl(210 40% 85%)"};

  return(
    <div className="space-y-5 max-w-7xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6" style={{color:"hsl(38 95% 52%)"}}/>
          <div><h1 className="text-xl font-bold font-display" style={{color:"hsl(210 40% 92%)"}}>CRM</h1><p className="text-xs" style={{color:"hsl(215 25% 55%)"}}>Client relationships, pipeline & deal tracking</p></div>
        </div>
        <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold" style={{background:"hsl(38 95% 52%)",color:"hsl(216 58% 6%)"}}>
          <Plus className="h-4 w-4"/> Add Contact
        </button>
      </div>

      {/* Pipeline stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[{l:"Total Contacts",v:contacts.length,c:"hsl(217 91% 70%)"},{l:"Active Pipeline",v:`$${(pipeline/1000).toFixed(0)}K`,c:"hsl(38 95% 60%)"},{l:"Won Revenue",v:`$${(won/1000).toFixed(0)}K`,c:"hsl(158 64% 55%)"},{l:"Win Rate",v:`${Math.round(contacts.filter(c=>c.stage==="won").length/Math.max(contacts.filter(c=>["won","lost"].includes(c.stage)).length,1)*100)}%`,c:"hsl(38 95% 60%)"}].map((s,i)=>(
          <div key={i} className="rounded-xl p-4" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
            <p className="text-xl font-bold" style={{color:s.c}}>{s.v}</p>
            <p className="text-[10px] mt-0.5" style={{color:"hsl(215 25% 50%)"}}>{s.l}</p>
          </div>
        ))}
      </div>

      {/* Pipeline funnel */}
      <div className="rounded-xl p-5" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
        <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{color:"hsl(215 25% 45%)"}}>Sales Pipeline</p>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {(Object.entries(ST) as [Stage,typeof ST[Stage]][]).map(([s,c])=>{
            const cnt=contacts.filter(x=>x.stage===s).length;
            const val=contacts.filter(x=>x.stage===s).reduce((sum,x)=>sum+x.value,0);
            return(
              <div key={s} onClick={()=>setFStage(fStage===s?"all":s)} className="flex-1 min-w-24 rounded-xl p-3 text-center cursor-pointer transition-all"
                style={{background:fStage===s?c.bg:"hsl(216 45% 12%)",border:`1px solid ${fStage===s?c.color+"40":"hsl(var(--border))"}`,transform:"none"}}>
                <p className="text-[9px] font-bold uppercase mb-1" style={{color:c.color}}>{c.label}</p>
                <p className="text-2xl font-black" style={{color:c.color}}>{cnt}</p>
                {val>0&&<p className="text-[9px]" style={{color:"hsl(215 25% 50%)"}}>${(val/1000).toFixed(0)}K</p>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{color:"hsl(215 25% 45%)"}}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search contacts or companies..."
            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))",color:"hsl(210 40% 85%)"}}/>
        </div>
      </div>

      {/* Contact list + detail */}
      <div className="flex gap-4">
        <div className={`flex-1 space-y-2 ${sel?"hidden lg:block":""}`}>
          {filtered.map(c=>{
            const sc=ST[c.stage];
            return(
              <div key={c.id} onClick={()=>setSelId(c.id)} className="rounded-xl px-5 py-4 cursor-pointer flex items-center gap-4 flex-wrap"
                style={{background:"hsl(var(--card))",border:`1px solid ${selId===c.id?"hsl(38 95% 52%/0.4)":"hsl(var(--border))"}`}}>
                <div className="h-10 w-10 rounded-xl flex items-center justify-center text-sm font-black shrink-0" style={{background:"hsl(38 95% 52%/0.15)",color:"hsl(38 95% 60%)"}}>
                  {c.company.slice(0,2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold" style={{color:"hsl(210 40% 88%)"}}>{c.company}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{background:sc.bg,color:sc.color}}>{sc.label}</span>
                  </div>
                  <p className="text-xs mt-0.5" style={{color:"hsl(215 25% 55%)"}}>{c.name} · {c.role} · {c.country}</p>
                </div>
                <div className="flex items-center gap-4 text-xs shrink-0">
                  {c.value>0&&<span className="font-bold" style={{color:"hsl(38 95% 60%)"}}>${c.value.toLocaleString()}</span>}
                  <span style={{color:"hsl(215 25% 45%)"}}>{c.lastContact}</span>
                  <div className="flex gap-1">
                    <button onClick={e=>{e.stopPropagation();openEdit(c);}} className="p-1.5 rounded hover:bg-white/5"><Edit3 className="h-3.5 w-3.5" style={{color:"hsl(215 25% 45%)"}}/></button>
                    <button onClick={e=>{e.stopPropagation();del(c.id);}} className="p-1.5 rounded hover:bg-white/5"><Trash2 className="h-3.5 w-3.5" style={{color:"hsl(0 72% 60%)"}}/></button>
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length===0&&<div className="rounded-xl p-10 text-center" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
            <Users className="h-12 w-12 mx-auto mb-3 opacity-15" style={{color:"hsl(38 95% 52%)"}}/>
            <p style={{color:"hsl(215 25% 45%)"}}>No contacts found</p>
          </div>}
        </div>

        {/* Detail */}
        {sel&&(
          <div className="w-full lg:w-80 shrink-0 rounded-2xl p-5 space-y-4 overflow-y-auto" style={{background:"hsl(var(--card))",border:"1px solid hsl(38 95% 52%/0.2)",maxHeight:"calc(100vh - 200px)"}}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl flex items-center justify-center text-sm font-black" style={{background:"hsl(38 95% 52%/0.15)",color:"hsl(38 95% 60%)"}}>{sel.company.slice(0,2).toUpperCase()}</div>
                <div>
                  <p className="font-bold text-sm" style={{color:"hsl(210 40% 92%)"}}>{sel.company}</p>
                  <p className="text-xs" style={{color:"hsl(215 25% 55%)"}}>{sel.country} · {sel.industry}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={()=>openEdit(sel)} className="p-1.5 rounded-lg" style={{background:"hsl(216 45% 18%)"}}><Edit3 className="h-3.5 w-3.5" style={{color:"hsl(215 25% 60%)"}}/></button>
                <button onClick={()=>setSelId(null)} className="p-1.5 rounded-lg" style={{background:"hsl(216 45% 18%)"}}><X className="h-3.5 w-3.5" style={{color:"hsl(215 25% 60%)"}}/></button>
              </div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{background:"hsl(216 45% 12%)"}}>
                <Users className="h-3.5 w-3.5 shrink-0" style={{color:"hsl(215 25% 45%)"}}/><span style={{color:"hsl(210 40% 82%)"}}>{sel.name}</span><span style={{color:"hsl(215 25% 45%)"}}>· {sel.role}</span>
              </div>
              {sel.email&&<div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{background:"hsl(216 45% 12%)"}}><Mail className="h-3.5 w-3.5 shrink-0" style={{color:"hsl(217 91% 65%)"}}/><a href={`mailto:${sel.email}`} className="hover:underline" style={{color:"hsl(217 91% 70%)"}}>{sel.email}</a></div>}
              {sel.phone&&<div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{background:"hsl(216 45% 12%)"}}><Phone className="h-3.5 w-3.5 shrink-0" style={{color:"hsl(158 64% 55%)"}}/><span style={{color:"hsl(210 40% 82%)"}}>{sel.phone}</span></div>}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase mb-2" style={{color:"hsl(215 25% 45%)"}}>Stage</p>
              <div className="flex flex-wrap gap-1.5">
                {(Object.entries(ST) as [Stage,typeof ST[Stage]][]).map(([s,c])=>(
                  <button key={s} onClick={()=>{setContacts(cs=>cs.map(x=>x.id===sel.id?{...x,stage:s}:x));toast.success(`→ ${c.label}`);}}
                    className="text-[11px] px-2.5 py-1 rounded-lg font-semibold"
                    style={{background:sel.stage===s?c.bg:"hsl(216 45% 14%)",color:sel.stage===s?c.color:"hsl(215 25% 50%)",border:`1px solid ${sel.stage===s?c.color+"40":"hsl(var(--border))"}`}}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
            {sel.value>0&&<div className="rounded-lg p-3" style={{background:"hsl(38 95% 52%/0.08)",border:"1px solid hsl(38 95% 52%/0.2)"}}>
              <p className="text-[10px] font-bold uppercase mb-1" style={{color:"hsl(215 25% 45%)"}}>Deal Value</p>
              <p className="text-xl font-black" style={{color:"hsl(38 95% 60%)"}}>${sel.value.toLocaleString()}</p>
            </div>}
            {sel.tags.length>0&&<div className="flex flex-wrap gap-1.5">
              {sel.tags.map(t=><span key={t} className="text-[10px] px-2 py-0.5 rounded-full" style={{background:"hsl(217 91% 70%/0.1)",color:"hsl(217 91% 70%)",border:"1px solid hsl(217 91% 70%/0.2)"}}>{t}</span>)}
            </div>}
            {sel.notes&&<div className="rounded-lg p-3" style={{background:"hsl(216 45% 12%)"}}>
              <p className="text-[9px] font-bold uppercase mb-1" style={{color:"hsl(215 25% 45%)"}}>Notes</p>
              <p className="text-xs" style={{color:"hsl(215 25% 60%)"}}>{sel.notes}</p>
            </div>}
            <p className="text-[10px]" style={{color:"hsl(215 25% 40%)"}}>Last contact: {sel.lastContact}</p>
          </div>
        )}
      </div>

      {/* Form */}
      {showForm&&(
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto" style={{background:"rgba(0,0,0,0.75)"}}>
          <div className="w-full max-w-lg rounded-2xl p-6 space-y-4 my-8" style={{background:"hsl(216 52% 10%)",border:"1px solid hsl(var(--border))"}}>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold" style={{color:"hsl(210 40% 94%)"}}>{editId?"Edit Contact":"Add Contact"}</h2>
              <button onClick={()=>setShowForm(false)} style={{color:"hsl(215 25% 55%)"}}><X className="h-5 w-5"/></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[{l:"Company *",k:"company",ph:"Company name",span:true},{l:"Contact Name *",k:"name",ph:"Full name",span:false},{l:"Role",k:"role",ph:"Job title",span:false},{l:"Email",k:"email",ph:"email@company.com",span:false},{l:"Phone",k:"phone",ph:"+964 ...",span:false}].map(f=>(
                <div key={f.k} className={f.span?"col-span-2":""}>
                  <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{color:"hsl(215 25% 45%)"}}>{f.l}</label>
                  <input value={(form as any)[f.k]} onChange={e=>setForm(prev=>({...prev,[f.k]:e.target.value}))} placeholder={f.ph} className={inp} style={IS}/>
                </div>
              ))}
              {[{l:"Country",k:"country",opts:CTRS},{l:"Industry",k:"industry",opts:INDS},{l:"Stage",k:"stage",opts:Object.keys(ST)}].map(f=>(
                <div key={f.k}>
                  <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{color:"hsl(215 25% 45%)"}}>{f.l}</label>
                  <select value={(form as any)[f.k]} onChange={e=>setForm(prev=>({...prev,[f.k]:e.target.value}))} className={inp} style={IS}>
                    {f.opts.map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{color:"hsl(215 25% 45%)"}}>Deal Value (USD)</label>
                <input type="number" value={form.value} onChange={e=>setForm(f=>({...f,value:Number(e.target.value)}))} className={inp} style={IS}/>
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{color:"hsl(215 25% 45%)"}}>Last Contact</label>
                <input type="date" value={form.lastContact} onChange={e=>setForm(f=>({...f,lastContact:e.target.value}))} className={inp} style={IS}/>
              </div>
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{color:"hsl(215 25% 45%)"}}>Tags</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {form.tags.map(t=><span key={t} className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full" style={{background:"hsl(217 91% 70%/0.1)",color:"hsl(217 91% 70%)",border:"1px solid hsl(217 91% 70%/0.2)"}}>{t}<button onClick={()=>setForm(f=>({...f,tags:f.tags.filter(x=>x!==t)}))}><X className="h-2.5 w-2.5"/></button></span>)}
              </div>
              <input value={newTag} onChange={e=>setNewTag(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&newTag.trim()){setForm(f=>({...f,tags:[...f.tags,newTag.trim()]}));setNewTag("");}}} placeholder="Type tag, press Enter" className={inp} style={IS}/>
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{color:"hsl(215 25% 45%)"}}>Notes</label>
              <textarea value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} rows={3} className={`${inp} resize-none`} style={IS}/>
            </div>
            <div className="flex gap-3">
              <button onClick={()=>setShowForm(false)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold" style={{background:"hsl(216 45% 18%)",color:"hsl(210 40% 75%)"}}>Cancel</button>
              <button onClick={save} className="flex-1 py-2.5 rounded-lg text-sm font-bold" style={{background:"hsl(38 95% 52%)",color:"hsl(216 58% 6%)"}}>{editId?"Save Changes":"Add Contact"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
