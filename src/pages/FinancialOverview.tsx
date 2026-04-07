import { useState, useEffect } from "react";
import {
  PieChart, Plus, TrendingUp, TrendingDown, DollarSign, Calendar,
  CheckCircle2, Clock, X, Edit3, Trash2, Search
} from "lucide-react";
import { toast } from "sonner";

type TxType = "invoice"|"expense"|"payment"|"refund";
type TxStatus = "pending"|"paid"|"overdue"|"cancelled";

interface Transaction {
  id:string; type:TxType; status:TxStatus; description:string; project:string;
  client:string; amount:number; currency:string; date:string; dueDate:string; notes:string;
}

const LS="consultai_finance_v1";
const TYPE_CFG:{[k in TxType]:{label:string;color:string;bg:string;dir:1|-1}} = {
  invoice: {label:"Invoice",color:"hsl(158 64% 55%)",bg:"hsl(158 64% 40%/0.12)",dir:1},
  payment: {label:"Payment",color:"hsl(38 95% 60%)",bg:"hsl(38 95% 52%/0.12)",dir:1},
  expense: {label:"Expense",color:"hsl(0 72% 68%)",bg:"hsl(0 72% 51%/0.12)",dir:-1},
  refund:  {label:"Refund", color:"hsl(217 91% 70%)",bg:"hsl(217 91% 53%/0.12)",dir:-1},
};
const STATUS_CFG:{[k in TxStatus]:{label:string;color:string}} = {
  pending:   {label:"Pending",  color:"hsl(38 95% 60%)"},
  paid:      {label:"Paid",     color:"hsl(158 64% 55%)"},
  overdue:   {label:"Overdue",  color:"hsl(0 72% 68%)"},
  cancelled: {label:"Cancelled",color:"hsl(215 25% 50%)"},
};
// Reads project names from Projects localStorage + engagement store so the dropdown stays in sync
function loadProjectNames():string[]{
  try{
    const projs:Array<{name:string}>=JSON.parse(localStorage.getItem("consultai_projects_v1")||"[]")||[];
    const engStore:any=JSON.parse(localStorage.getItem("consultai-v4")||"{}");
    const engs:Array<{name?:string;clientName?:string}>=engStore?.state?.engagements||[];
    const all=[
      ...projs.map(p=>p.name),
      ...engs.map(e=>e.name||e.clientName||"").filter(Boolean),
      "General / Admin",
    ];
    return [...new Set(all)];
  }catch{return["General / Admin"];}
}

const PROJECTS=loadProjectNames();

const BLANK:Omit<Transaction,"id">={type:"invoice",status:"pending",description:"",project:PROJECTS[0]||"General / Admin",client:"",amount:0,currency:"USD",date:new Date().toISOString().slice(0,10),dueDate:new Date(Date.now()+30*86400000).toISOString().slice(0,10),notes:""};

function load():Transaction[]{try{const d=JSON.parse(localStorage.getItem(LS)||"null");return d||[];}catch{return[];}}

export default function FinancialOverview(){
  const [txs,setTxs]=useState<Transaction[]>(load);
  const [search,setSearch]=useState("");
  const [fType,setFType]=useState<TxType|"all">("all");
  const [fStatus,setFStatus]=useState<TxStatus|"all">("all");
  const [showForm,setShowForm]=useState(false);
  const [editId,setEditId]=useState<string|null>(null);
  const [form,setForm]=useState<Omit<Transaction,"id">>(BLANK);

  useEffect(()=>{localStorage.setItem(LS,JSON.stringify(txs));},[txs]);

  const filtered=txs.filter(t=>(fType==="all"||t.type===fType)&&(fStatus==="all"||t.status===fStatus)&&(search===""||t.description.toLowerCase().includes(search.toLowerCase())||t.client.toLowerCase().includes(search.toLowerCase())));

  const income=txs.filter(t=>t.type==="invoice"||t.type==="payment").reduce((s,t)=>s+(t.status!=="cancelled"?t.amount:0),0);
  const paidIn=txs.filter(t=>(t.type==="invoice"||t.type==="payment")&&t.status==="paid").reduce((s,t)=>s+t.amount,0);
  const expenses=txs.filter(t=>(t.type==="expense"||t.type==="refund")&&t.status!=="cancelled").reduce((s,t)=>s+t.amount,0);
  const outstanding=txs.filter(t=>(t.type==="invoice")&&t.status==="pending").reduce((s,t)=>s+t.amount,0);
  const overdue=txs.filter(t=>t.status==="overdue").reduce((s,t)=>s+t.amount,0);
  const profit=paidIn-expenses;

  const openNew=()=>{setForm(BLANK);setEditId(null);setShowForm(true);};
  const openEdit=(t:Transaction)=>{const{id,...rest}=t;setForm(rest);setEditId(id);setShowForm(true);};
  const save=()=>{
    if(!form.description.trim()||form.amount<=0){toast.error("Description and amount required");return;}
    if(editId){setTxs(ts=>ts.map(t=>t.id===editId?{...t,...form}:t));toast.success("Updated");}
    else{setTxs(ts=>[{...form,id:`tx_${Date.now()}`},...ts]);toast.success("Added");}
    setShowForm(false);
  };
  const del=(id:string)=>{setTxs(ts=>ts.filter(t=>t.id!==id));toast.success("Deleted");};

  const inp="w-full px-3 py-2 rounded-lg text-sm";
  const IS={background:"hsl(216 45% 12%)",border:"1px solid hsl(var(--border))",color:"hsl(210 40% 85%)"};

  return(
    <div className="space-y-5 max-w-5xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <PieChart className="h-6 w-6" style={{color:"hsl(38 95% 52%)"}}/>
          <div><h1 className="text-xl font-bold font-display" style={{color:"hsl(210 40% 92%)"}}>Financial Overview</h1><p className="text-xs" style={{color:"hsl(215 25% 55%)"}}>Revenue tracking, invoices, expenses & cashflow</p></div>
        </div>
        <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold" style={{background:"hsl(38 95% 52%)",color:"hsl(216 58% 6%)"}}>
          <Plus className="h-4 w-4"/> Add Transaction
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          {l:"Total Billed",v:`$${(income/1000).toFixed(0)}K`,c:"hsl(158 64% 55%)",I:TrendingUp,sub:"Invoiced"},
          {l:"Collected",v:`$${(paidIn/1000).toFixed(0)}K`,c:"hsl(38 95% 60%)",I:CheckCircle2,sub:"Received"},
          {l:"Expenses",v:`$${(expenses/1000).toFixed(0)}K`,c:"hsl(0 72% 68%)",I:TrendingDown,sub:"Outgoing"},
          {l:"Net Profit",v:`$${(profit/1000).toFixed(0)}K`,c:profit>=0?"hsl(158 64% 55%)":"hsl(0 72% 68%)",I:DollarSign,sub:"Collected-Expenses"},
          {l:"Outstanding",v:`$${(outstanding/1000).toFixed(0)}K`,c:"hsl(38 95% 60%)",I:Clock,sub:"Pending invoices"},
          {l:"Overdue",v:`$${(overdue/1000).toFixed(0)}K`,c:overdue>0?"hsl(0 72% 68%)":"hsl(158 64% 55%)",I:Calendar,sub:"Late payments"},
        ].map((s,i)=>(
          <div key={i} className="rounded-xl p-4" style={{background:"hsl(var(--card))",border:`1px solid ${s.l==="Overdue"&&overdue>0?"hsl(0 72% 51%/0.3)":"hsl(var(--border))"}` }}>
            <div className="flex items-center gap-1.5 mb-1"><s.I className="h-3.5 w-3.5" style={{color:s.c}}/><p className="text-[9px] font-bold uppercase" style={{color:"hsl(215 25% 45%)"}}>{s.l}</p></div>
            <p className="text-xl font-bold" style={{color:s.c}}>{s.v}</p>
            <p className="text-[9px]" style={{color:"hsl(215 25% 40%)"}}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Revenue breakdown */}
      <div className="grid grid-cols-4 gap-2">
        {(Object.entries(TYPE_CFG) as [TxType,typeof TYPE_CFG[TxType]][]).map(([t,c])=>{
          const total=txs.filter(x=>x.type===t&&x.status!=="cancelled").reduce((s,x)=>s+x.amount,0);
          const count=txs.filter(x=>x.type===t).length;
          return(
            <div key={t} onClick={()=>setFType(fType===t?"all":t)} className="rounded-xl p-4 cursor-pointer"
              style={{background:fType===t?c.bg:"hsl(var(--card))",border:`1px solid ${fType===t?c.color+"40":"hsl(var(--border))"}` }}>
              <p className="text-[10px] font-bold uppercase mb-1" style={{color:c.color}}>{c.label}</p>
              <p className="text-lg font-black" style={{color:c.color}}>${(total/1000).toFixed(0)}K</p>
              <p className="text-[9px]" style={{color:"hsl(215 25% 45%)"}}>{count} transactions</p>
            </div>
          );
        })}
      </div>

      {/* Filter + list */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{color:"hsl(215 25% 45%)"}}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search transactions..." className="w-full pl-9 pr-3 py-2 rounded-lg text-sm" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))",color:"hsl(210 40% 85%)"}}/>
        </div>
        <select value={fStatus} onChange={e=>setFStatus(e.target.value as TxStatus|"all")} className="px-3 py-2 rounded-lg text-sm" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))",color:"hsl(210 40% 85%)"}}>
          <option value="all">All Status</option>
          {(Object.entries(STATUS_CFG) as [TxStatus,typeof STATUS_CFG[TxStatus]][]).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      <div className="rounded-xl overflow-hidden" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
        <table className="w-full text-xs">
          <thead><tr style={{background:"hsl(216 45% 11%)",borderBottom:"1px solid hsl(var(--border))"}}>
            {["Type","Description","Project/Client","Amount","Date","Due","Status",""].map(h=><th key={h} className="px-4 py-3 text-left font-semibold whitespace-nowrap" style={{color:"hsl(215 25% 45%)"}}>{h}</th>)}
          </tr></thead>
          <tbody>{filtered.map((t,i)=>{
            const tc=TYPE_CFG[t.type];const sc=STATUS_CFG[t.status];const isOverdue=t.status==="overdue";
            return(
              <tr key={t.id} style={{borderTop:"1px solid hsl(var(--border))",background:isOverdue?"hsl(0 72% 51%/0.04)":i%2===0?"transparent":"hsl(216 45% 8%/0.4)"}}>
                <td className="px-4 py-3"><span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{background:tc.bg,color:tc.color}}>{tc.label}</span></td>
                <td className="px-4 py-3 max-w-48 truncate" style={{color:"hsl(210 40% 85%)"}}>{t.description}</td>
                <td className="px-4 py-3" style={{color:"hsl(215 25% 55%)"}}>{t.project.split(" ").slice(0,3).join(" ")}{t.client&&<span> · {t.client.split(" ")[0]}</span>}</td>
                <td className="px-4 py-3 font-bold" style={{color:tc.dir===1?"hsl(158 64% 55%)":"hsl(0 72% 68%)"}}>
                  {tc.dir===1?"+":"-"}${t.amount.toLocaleString()}
                </td>
                <td className="px-4 py-3" style={{color:"hsl(215 25% 55%)"}}>{t.date}</td>
                <td className="px-4 py-3" style={{color:isOverdue?"hsl(0 72% 68%)":"hsl(215 25% 50%)"}}>{t.dueDate}</td>
                <td className="px-4 py-3">
                  <select value={t.status} onChange={e=>setTxs(ts=>ts.map(x=>x.id===t.id?{...x,status:e.target.value as TxStatus}:x))}
                    className="px-2 py-1 rounded text-[11px] font-semibold"
                    style={{background:sc.color+"18",color:sc.color,border:`1px solid ${sc.color}30`,appearance:"none"}}>
                    {(Object.entries(STATUS_CFG) as [TxStatus,typeof STATUS_CFG[TxStatus]][]).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                  </select>
                </td>
                <td className="px-3 py-3">
                  <div className="flex gap-1">
                    <button onClick={()=>openEdit(t)} className="p-1.5 rounded hover:bg-white/5"><Edit3 className="h-3 w-3" style={{color:"hsl(215 25% 45%)"}}/></button>
                    <button onClick={()=>del(t.id)} className="p-1.5 rounded hover:bg-white/5"><Trash2 className="h-3 w-3" style={{color:"hsl(0 72% 60%)"}}/></button>
                  </div>
                </td>
              </tr>
            );
          })}</tbody>
        </table>
        {filtered.length===0&&<div className="p-10 text-center"><p style={{color:"hsl(215 25% 45%)"}}>No transactions found</p></div>}
      </div>

      {/* Form */}
      {showForm&&(
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto" style={{background:"rgba(0,0,0,0.75)"}}>
          <div className="w-full max-w-lg rounded-2xl p-6 space-y-4 my-8" style={{background:"hsl(216 52% 10%)",border:"1px solid hsl(var(--border))"}}>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold" style={{color:"hsl(210 40% 94%)"}}>{editId?"Edit Transaction":"Add Transaction"}</h2>
              <button onClick={()=>setShowForm(false)} style={{color:"hsl(215 25% 55%)"}}><X className="h-5 w-5"/></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{color:"hsl(215 25% 45%)"}}>Description *</label>
                <input value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="Invoice/expense description..." className={inp} style={IS}/>
              </div>
              {[{l:"Type",k:"type",opts:Object.keys(TYPE_CFG)},{l:"Status",k:"status",opts:Object.keys(STATUS_CFG)},{l:"Project",k:"project",opts:PROJECTS}].map(f=>(
                <div key={f.k}>
                  <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{color:"hsl(215 25% 45%)"}}>{f.l}</label>
                  <select value={(form as any)[f.k]} onChange={e=>setForm(prev=>({...prev,[f.k]:e.target.value}))} className={inp} style={IS}>
                    {f.opts.map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{color:"hsl(215 25% 45%)"}}>Client</label>
                <input value={form.client} onChange={e=>setForm(f=>({...f,client:e.target.value}))} placeholder="Client name" className={inp} style={IS}/>
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{color:"hsl(215 25% 45%)"}}>Amount (USD) *</label>
                <input type="number" value={form.amount} onChange={e=>setForm(f=>({...f,amount:Number(e.target.value)}))} className={inp} style={IS}/>
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{color:"hsl(215 25% 45%)"}}>Date</label>
                <input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} className={inp} style={IS}/>
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{color:"hsl(215 25% 45%)"}}>Due Date</label>
                <input type="date" value={form.dueDate} onChange={e=>setForm(f=>({...f,dueDate:e.target.value}))} className={inp} style={IS}/>
              </div>
              <div className="col-span-2">
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{color:"hsl(215 25% 45%)"}}>Notes</label>
                <textarea value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} rows={2} className={`${inp} resize-none`} style={IS}/>
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={()=>setShowForm(false)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold" style={{background:"hsl(216 45% 18%)",color:"hsl(210 40% 75%)"}}>Cancel</button>
              <button onClick={save} className="flex-1 py-2.5 rounded-lg text-sm font-bold" style={{background:"hsl(38 95% 52%)",color:"hsl(216 58% 6%)"}}>{editId?"Save Changes":"Add Transaction"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
