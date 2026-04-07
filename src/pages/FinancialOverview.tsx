import { useState } from "react";
import {
  Plus, TrendingUp, TrendingDown, DollarSign, CheckCircle2,
  Clock, X, Edit3, Trash2, Search, Loader2, AlertTriangle
} from "lucide-react";
import { toast } from "sonner";
import {
  useTransactions, useCreateTransaction, useUpdateTransaction, useDeleteTransaction,
  type Transaction,
} from "@/hooks/useTransactions";

type TxType   = Transaction["type"];
type TxStatus = Transaction["status"];

const TYPE_CFG: Record<TxType, { label:string; color:string; bg:string; dir:1|-1 }> = {
  invoice: { label:"Invoice", color:"hsl(158 64% 55%)", bg:"hsl(158 64% 40%/0.12)", dir:1  },
  payment: { label:"Payment", color:"hsl(38 95% 60%)",  bg:"hsl(38 95% 52%/0.12)",  dir:1  },
  expense: { label:"Expense", color:"hsl(0 72% 68%)",   bg:"hsl(0 72% 51%/0.12)",   dir:-1 },
  refund:  { label:"Refund",  color:"hsl(217 91% 70%)", bg:"hsl(217 91% 53%/0.12)", dir:-1 },
};
const STATUS_CFG: Record<TxStatus, { label:string; color:string }> = {
  pending:   { label:"Pending",   color:"hsl(38 95% 60%)"  },
  paid:      { label:"Paid",      color:"hsl(158 64% 55%)" },
  overdue:   { label:"Overdue",   color:"hsl(0 72% 68%)"   },
  cancelled: { label:"Cancelled", color:"hsl(215 25% 50%)" },
};

const BLANK: Omit<Transaction,"id"|"createdAt"> = {
  type:"invoice", status:"pending", description:"", project:"", client:"",
  amount:0, currency:"USD",
  date: new Date().toISOString().slice(0,10),
  dueDate: new Date(Date.now()+30*86400000).toISOString().slice(0,10),
  notes:"",
};

const IS = { background:"hsl(216 45% 12%)", border:"1px solid hsl(var(--border))", color:"hsl(210 40% 85%)" };
const fmt = (n:number, cur="USD") => new Intl.NumberFormat("en-US",{style:"currency",currency:cur,maximumFractionDigits:0}).format(n);

export default function FinancialOverview() {
  const { data: txs = [], isLoading, isError } = useTransactions();
  const createTx  = useCreateTransaction();
  const updateTx  = useUpdateTransaction();
  const deleteTx  = useDeleteTransaction();

  const [search,  setSearch]  = useState("");
  const [fType,   setFType]   = useState<TxType|"all">("all");
  const [fStatus, setFStatus] = useState<TxStatus|"all">("all");
  const [showForm,setShowForm]= useState(false);
  const [editId,  setEditId]  = useState<string|null>(null);
  const [form,    setForm]    = useState<Omit<Transaction,"id"|"createdAt">>(BLANK);

  const filtered = txs.filter(t =>
    (fType   === "all" || t.type   === fType) &&
    (fStatus === "all" || t.status === fStatus) &&
    (search  === "" || t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.client.toLowerCase().includes(search.toLowerCase()))
  );

  const income    = txs.filter(t => (t.type==="invoice"||t.type==="payment") && t.status!=="cancelled").reduce((s,t)=>s+t.amount,0);
  const expenses  = txs.filter(t => (t.type==="expense"||t.type==="refund")  && t.status!=="cancelled").reduce((s,t)=>s+t.amount,0);
  const collected = txs.filter(t => t.type==="invoice" && t.status==="paid").reduce((s,t)=>s+t.amount,0);
  const pending   = txs.filter(t => t.type==="invoice" && t.status==="pending").reduce((s,t)=>s+t.amount,0);
  const overdue   = txs.filter(t => t.status==="overdue").reduce((s,t)=>s+t.amount,0);

  const openForm = (tx?: Transaction) => {
    if (tx) { setEditId(tx.id); setForm({ type:tx.type, status:tx.status, description:tx.description, project:tx.project, client:tx.client, amount:tx.amount, currency:tx.currency, date:tx.date, dueDate:tx.dueDate, notes:tx.notes }); }
    else    { setEditId(null); setForm(BLANK); }
    setShowForm(true);
  };

  const save = async () => {
    if (!form.description.trim()) { toast.error("Description is required"); return; }
    if (editId) {
      await updateTx.mutateAsync({ id:editId, ...form });
      toast.success("Transaction updated");
    } else {
      await createTx.mutateAsync(form);
      toast.success("Transaction added");
    }
    setShowForm(false);
  };

  const remove = async (id:string) => {
    await deleteTx.mutateAsync(id);
    toast.success("Deleted");
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-64 gap-2 text-muted-foreground">
      <Loader2 className="h-5 w-5 animate-spin"/><span className="text-sm">Loading transactions…</span>
    </div>
  );
  if (isError) return (
    <div className="flex items-center justify-center h-64 gap-2" style={{color:"hsl(0 72% 68%)"}}>
      <AlertTriangle className="h-5 w-5"/><span className="text-sm">Failed to load. Check Supabase connection.</span>
    </div>
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold font-display" style={{color:"hsl(210 40% 94%)"}}>Financial Overview</h1>
          <p className="text-xs mt-0.5" style={{color:"hsl(215 25% 50%)"}}>Invoices, payments and expenses — live from your database</p>
        </div>
        <button onClick={()=>openForm()} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold"
          style={{background:"hsl(38 95% 52%)",color:"hsl(216 58% 6%)"}}>
          <Plus className="h-4 w-4"/> Add Transaction
        </button>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label:"Total Invoiced",   value:fmt(income),    color:"hsl(158 64% 55%)", icon:TrendingUp   },
          { label:"Collected",        value:fmt(collected), color:"hsl(158 64% 55%)", icon:CheckCircle2 },
          { label:"Pending",          value:fmt(pending),   color:"hsl(38 95% 60%)",  icon:Clock        },
          { label:"Overdue",          value:fmt(overdue),   color:"hsl(0 72% 68%)",   icon:AlertTriangle},
          { label:"Total Expenses",   value:fmt(expenses),  color:"hsl(0 72% 68%)",   icon:TrendingDown },
        ].map(({label,value,color,icon:Icon},i) => (
          <div key={i} className="rounded-xl p-4 bg-card border border-border">
            <div className="flex items-center gap-2 mb-1">
              <Icon className="h-3.5 w-3.5" style={{color}}/>
              <span className="text-[11px] text-muted-foreground">{label}</span>
            </div>
            <p className="text-lg font-bold" style={{color}}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{color:"hsl(215 25% 45%)"}}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search…"
            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm" style={IS}/>
        </div>
        {(["all","invoice","expense","payment","refund"] as const).map(v=>(
          <button key={v} onClick={()=>setFType(v)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize"
            style={{background:fType===v?"hsl(38 95% 52%)":"hsl(216 45% 15%)",color:fType===v?"hsl(216 58% 6%)":"hsl(215 25% 55%)"}}>
            {v==="all"?"All Types":v}
          </button>
        ))}
        {(["all","pending","paid","overdue","cancelled"] as const).map(v=>(
          <button key={v} onClick={()=>setFStatus(v)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize"
            style={{background:fStatus===v?"hsl(217 91% 60%)":"hsl(216 45% 15%)",color:fStatus===v?"#fff":"hsl(215 25% 55%)"}}>
            {v==="all"?"All Status":v}
          </button>
        ))}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="rounded-xl p-12 text-center bg-card border border-border">
          <DollarSign className="h-10 w-10 mx-auto mb-3 opacity-20" style={{color:"hsl(38 95% 52%)"}}/>
          <p className="text-sm font-semibold" style={{color:"hsl(215 25% 50%)"}}>No transactions yet</p>
          <p className="text-xs mt-1 mb-4" style={{color:"hsl(215 25% 38%)"}}>Add your first invoice or expense to start tracking financials</p>
          <button onClick={()=>openForm()} className="px-4 py-2 rounded-lg text-sm font-semibold"
            style={{background:"hsl(38 95% 52%)",color:"hsl(216 58% 6%)"}}>
            <Plus className="h-4 w-4 inline mr-1"/>Add Transaction
          </button>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden bg-card border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr style={{background:"hsl(216 45% 11%)",borderBottom:"1px solid hsl(var(--border))"}}>
                {["Date","Description","Client / Project","Type","Amount","Status",""].map((h,i)=>(
                  <th key={i} className="px-4 py-3 text-left font-semibold" style={{color:"hsl(215 25% 45%)"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t,i)=>{
                const tc=TYPE_CFG[t.type]; const sc=STATUS_CFG[t.status];
                return (
                  <tr key={t.id} style={{borderTop:i>0?"1px solid hsl(var(--border))":"none"}}>
                    <td className="px-4 py-3" style={{color:"hsl(215 25% 50%)"}}>{t.date}</td>
                    <td className="px-4 py-3 font-medium max-w-[200px] truncate" style={{color:"hsl(210 40% 85%)"}}>{t.description}</td>
                    <td className="px-4 py-3" style={{color:"hsl(215 25% 55%)"}}>
                      <div className="truncate max-w-[140px]">{t.client||"—"}</div>
                      {t.project&&<div className="text-[10px] truncate max-w-[140px]" style={{color:"hsl(215 25% 38%)"}}>{t.project}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{background:tc.bg,color:tc.color}}>{tc.label}</span>
                    </td>
                    <td className="px-4 py-3 font-bold" style={{color:tc.dir===1?"hsl(158 64% 55%)":"hsl(0 72% 68%)"}}>
                      {tc.dir===1?"+":"-"}{fmt(t.amount,t.currency)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-semibold" style={{color:sc.color}}>{sc.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={()=>openForm(t)} className="p-1.5 rounded-lg hover:opacity-80"
                          style={{background:"hsl(216 45% 18%)"}}>
                          <Edit3 className="h-3 w-3" style={{color:"hsl(215 25% 55%)"}}/>
                        </button>
                        <button onClick={()=>remove(t.id)} className="p-1.5 rounded-lg hover:opacity-80"
                          style={{background:"hsl(0 72% 51%/0.1)"}}>
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

      {/* Form drawer */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{background:"rgba(0,0,0,0.6)"}}>
          <div className="w-full max-w-lg rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            style={{background:"hsl(216 52% 10%)",border:"1px solid hsl(var(--border))"}}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm" style={{color:"hsl(210 40% 90%)"}}>
                {editId?"Edit Transaction":"New Transaction"}
              </h3>
              <button onClick={()=>setShowForm(false)}><X className="h-4 w-4" style={{color:"hsl(215 25% 50%)"}}/></button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{color:"hsl(215 25% 45%)"}}>Type</label>
                <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value as TxType}))}
                  className="w-full px-3 py-2 rounded-lg text-sm" style={IS}>
                  {(["invoice","payment","expense","refund"] as const).map(v=><option key={v} value={v}>{TYPE_CFG[v].label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{color:"hsl(215 25% 45%)"}}>Status</label>
                <select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value as TxStatus}))}
                  className="w-full px-3 py-2 rounded-lg text-sm" style={IS}>
                  {(["pending","paid","overdue","cancelled"] as const).map(v=><option key={v} value={v}>{STATUS_CFG[v].label}</option>)}
                </select>
              </div>
            </div>

            {[
              {label:"Description *", f:"description" as const, type:"text"},
              {label:"Client",        f:"client"      as const, type:"text"},
              {label:"Project",       f:"project"     as const, type:"text"},
            ].map(({label,f,type})=>(
              <div key={f}>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{color:"hsl(215 25% 45%)"}}>{label}</label>
                <input type={type} value={form[f] as string} onChange={e=>setForm(fr=>({...fr,[f]:e.target.value}))}
                  className="w-full px-3 py-2 rounded-lg text-sm" style={IS}/>
              </div>
            ))}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{color:"hsl(215 25% 45%)"}}>Amount</label>
                <input type="number" min={0} value={form.amount} onChange={e=>setForm(f=>({...f,amount:Number(e.target.value)}))}
                  className="w-full px-3 py-2 rounded-lg text-sm" style={IS}/>
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{color:"hsl(215 25% 45%)"}}>Currency</label>
                <select value={form.currency} onChange={e=>setForm(f=>({...f,currency:e.target.value}))}
                  className="w-full px-3 py-2 rounded-lg text-sm" style={IS}>
                  {["USD","IQD","EUR","GBP","AED","SAR","JOD"].map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{color:"hsl(215 25% 45%)"}}>Date</label>
                <input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))}
                  className="w-full px-3 py-2 rounded-lg text-sm" style={IS}/>
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{color:"hsl(215 25% 45%)"}}>Due Date</label>
                <input type="date" value={form.dueDate} onChange={e=>setForm(f=>({...f,dueDate:e.target.value}))}
                  className="w-full px-3 py-2 rounded-lg text-sm" style={IS}/>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{color:"hsl(215 25% 45%)"}}>Notes</label>
              <textarea value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} rows={2}
                className="w-full px-3 py-2 rounded-lg text-sm resize-none" style={IS}/>
            </div>

            <div className="flex gap-3 pt-1">
              <button onClick={()=>setShowForm(false)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold"
                style={{background:"hsl(216 45% 18%)",color:"hsl(210 40% 75%)"}}>Cancel</button>
              <button onClick={save} disabled={createTx.isPending||updateTx.isPending}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-60"
                style={{background:"hsl(38 95% 52%)",color:"hsl(216 58% 6%)"}}>
                {createTx.isPending||updateTx.isPending?"Saving…":(editId?"Update":"Add")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
