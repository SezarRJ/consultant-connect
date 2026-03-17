import { useState } from "react";
import {
  DollarSign, TrendingUp, TrendingDown, BarChart2, PieChart,
  ArrowUpRight, ArrowDownRight, Calendar, Target, CheckCircle2,
  AlertTriangle, RefreshCw, Download, Filter, Activity, Layers
} from "lucide-react";

interface ProjectFinancial {
  id: string;
  project: string;
  client: string;
  type: string;
  revenue: number;
  cost: number;
  profit: number;
  margin: number;
  status: "Active" | "Completed" | "At Risk";
  invoiced: number;
  collected: number;
}

const FINANCIALS: ProjectFinancial[] = [
  { id:"f1", project:"Baghdad Mixed-Use Tower",      client:"Al-Rafidain Investments", type:"Real Estate",          revenue:420000, cost:180000, profit:240000, margin:57, status:"Active",    invoiced:210000, collected:168000 },
  { id:"f2", project:"Iraq FMCG Distribution",       client:"Gulf Foods Group",         type:"FMCG",                 revenue:320000, cost:140000, profit:180000, margin:56, status:"Active",    invoiced:160000, collected:128000 },
  { id:"f3", project:"Erbil F&B Concept Launch",     client:"Nouri Hospitality",        type:"F&B",                  revenue:180000, cost:82000,  profit:98000,  margin:54, status:"Active",    invoiced:90000,  collected:90000  },
  { id:"f4", project:"Telecom Bundle Optimization",  client:"IraqCell Ltd.",            type:"Telecom",              revenue:95000,  cost:42000,  profit:53000,  margin:56, status:"Active",    invoiced:47500,  collected:32000  },
  { id:"f5", project:"Mosul Manufacturing Setup",    client:"Al-Jazeera Industries",    type:"Manufacturing",        revenue:210000, cost:95000,  profit:115000, margin:55, status:"At Risk",   invoiced:105000, collected:62000  },
  { id:"f6", project:"Jordan FMCG Iraq Entry",       client:"Jordan Foods Export",      type:"Sales & Distribution", revenue:75000,  cost:28000,  profit:47000,  margin:63, status:"Completed", invoiced:75000,  collected:75000  },
];

const MONTHLY = [
  { month:"Oct", revenue:180, cost:82,  profit:98  },
  { month:"Nov", revenue:210, cost:95,  profit:115 },
  { month:"Dec", revenue:195, cost:88,  profit:107 },
  { month:"Jan", revenue:285, cost:125, profit:160 },
  { month:"Feb", revenue:340, cost:148, profit:192 },
  { month:"Mar", revenue:420, cost:180, profit:240 },
];

const fmt = (n: number) => n >= 1000000 ? `$${(n/1000000).toFixed(1)}M` : n >= 1000 ? `$${(n/1000).toFixed(0)}K` : `$${n}`;

export default function FinancialOverview() {
  const [period, setPeriod] = useState<"month" | "quarter" | "year">("month");

  const totalRevenue = FINANCIALS.reduce((a,f) => a+f.revenue, 0);
  const totalCost    = FINANCIALS.reduce((a,f) => a+f.cost, 0);
  const totalProfit  = FINANCIALS.reduce((a,f) => a+f.profit, 0);
  const avgMargin    = Math.round(FINANCIALS.reduce((a,f) => a+f.margin, 0) / FINANCIALS.length);
  const totalInvoiced   = FINANCIALS.reduce((a,f) => a+f.invoiced, 0);
  const totalCollected  = FINANCIALS.reduce((a,f) => a+f.collected, 0);
  const outstanding = totalInvoiced - totalCollected;
  const maxRev = Math.max(...MONTHLY.map(m => m.revenue));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display" style={{ color: "hsl(210 40% 94%)" }}>Financial Overview</h1>
          <p className="text-sm mt-1" style={{ color: "hsl(215 25% 55%)" }}>Revenue, profitability & cash flow across all projects</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg overflow-hidden" style={{ border: "1px solid hsl(var(--border))" }}>
            {(["month","quarter","year"] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)} className="px-3 py-1.5 text-xs font-semibold capitalize"
                style={{ background: period===p ? "hsl(38 95% 52% / 0.15)" : "hsl(var(--card))", color: period===p ? "hsl(38 95% 60%)" : "hsl(215 25% 55%)" }}>
                {p}
              </button>
            ))}
          </div>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
            style={{ background: "hsl(216 45% 18%)", color: "hsl(210 40% 75%)", border: "1px solid hsl(var(--border))" }}>
            <Download className="h-3.5 w-3.5" /> Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label:"Total Revenue",   value:fmt(totalRevenue),  sub:"+24% vs last month", icon:DollarSign,   color:"hsl(38 95% 60%)",   up:true  },
          { label:"Net Profit",      value:fmt(totalProfit),   sub:`${avgMargin}% avg margin`,  icon:TrendingUp,   color:"hsl(158 64% 55%)",  up:true  },
          { label:"Total Cost",      value:fmt(totalCost),     sub:"Across all projects", icon:BarChart2,    color:"hsl(0 72% 68%)",    up:false },
          { label:"Outstanding",     value:fmt(outstanding),   sub:"Pending collection",  icon:AlertTriangle,color:"hsl(38 95% 60%)",   up:false },
        ].map((k,i) => (
          <div key={i} className="rounded-xl p-5" style={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))" }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs" style={{ color:"hsl(215 25% 55%)" }}>{k.label}</span>
              <k.icon className="h-4 w-4" style={{ color:k.color }} />
            </div>
            <p className="text-2xl font-bold mb-1" style={{ color:"hsl(210 40% 94%)" }}>{k.value}</p>
            <div className="flex items-center gap-1 text-xs" style={{ color:k.up?"hsl(158 64% 55%)":"hsl(215 25% 50%)" }}>
              {k.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {k.sub}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Revenue Chart */}
        <div className="lg:col-span-2 rounded-xl p-5" style={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))" }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold" style={{ color:"hsl(210 40% 92%)" }}>Monthly Performance</h2>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full inline-block" style={{ background:"hsl(38 95% 52%)" }} />Revenue</span>
              <span className="flex items-center gap-1.5" style={{ color:"hsl(215 25% 55%)" }}><span className="h-2 w-2 rounded-full inline-block" style={{ background:"hsl(158 64% 45%)" }} />Profit</span>
              <span className="flex items-center gap-1.5" style={{ color:"hsl(215 25% 55%)" }}><span className="h-2 w-2 rounded-full inline-block" style={{ background:"hsl(0 72% 51%)" }} />Cost</span>
            </div>
          </div>
          <div className="flex items-end gap-3 h-48">
            {MONTHLY.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex items-end gap-0.5 h-40" style={{ alignItems:"flex-end" }}>
                  {/* Revenue bar */}
                  <div className="flex-1 rounded-t-sm transition-all"
                    style={{ height:`${(m.revenue/maxRev)*100}%`, background:"hsl(38 95% 52% / 0.8)", minHeight:"4px" }} />
                  {/* Profit bar */}
                  <div className="flex-1 rounded-t-sm transition-all"
                    style={{ height:`${(m.profit/maxRev)*100}%`, background:"hsl(158 64% 45% / 0.7)", minHeight:"4px" }} />
                  {/* Cost bar */}
                  <div className="flex-1 rounded-t-sm transition-all"
                    style={{ height:`${(m.cost/maxRev)*100}%`, background:"hsl(0 72% 51% / 0.5)", minHeight:"4px" }} />
                </div>
                <span className="text-[10px]" style={{ color:"hsl(215 25% 45%)" }}>{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Collection Status */}
        <div className="rounded-xl p-5" style={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))" }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color:"hsl(210 40% 92%)" }}>Collection Status</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span style={{ color:"hsl(215 25% 55%)" }}>Invoiced</span>
                <span style={{ color:"hsl(210 40% 85%)" }}>{fmt(totalInvoiced)}</span>
              </div>
              <div className="flex justify-between text-xs mb-1.5">
                <span style={{ color:"hsl(215 25% 55%)" }}>Collected</span>
                <span style={{ color:"hsl(158 64% 55%)" }}>{fmt(totalCollected)}</span>
              </div>
              <div className="flex justify-between text-xs mb-1.5">
                <span style={{ color:"hsl(215 25% 55%)" }}>Outstanding</span>
                <span style={{ color:"hsl(38 95% 60%)" }}>{fmt(outstanding)}</span>
              </div>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background:"hsl(216 45% 15%)" }}>
              <div className="h-2 rounded-full" style={{ width:`${(totalCollected/totalInvoiced)*100}%`, background:"hsl(158 64% 45%)" }} />
            </div>
            <p className="text-xs text-center" style={{ color:"hsl(215 25% 50%)" }}>
              {Math.round((totalCollected/totalInvoiced)*100)}% collection rate
            </p>

            <div className="pt-3 border-t space-y-2" style={{ borderColor:"hsl(var(--border))" }}>
              <p className="text-xs font-semibold" style={{ color:"hsl(215 25% 45%)" }}>By Project Type</p>
              {[
                { type:"Real Estate", pct:37, color:"hsl(38 95% 52%)" },
                { type:"FMCG", pct:25, color:"hsl(158 64% 45%)" },
                { type:"Manufacturing", pct:18, color:"hsl(217 91% 60%)" },
                { type:"Other", pct:20, color:"hsl(215 25% 40%)" },
              ].map((t,i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color:"hsl(215 25% 55%)" }}>{t.type}</span>
                    <span style={{ color:"hsl(210 40% 75%)" }}>{t.pct}%</span>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden" style={{ background:"hsl(216 45% 15%)" }}>
                    <div className="h-1 rounded-full" style={{ width:`${t.pct}%`, background:t.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Project Financials Table */}
      <div className="rounded-xl overflow-hidden" style={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))" }}>
        <div className="px-5 py-4 border-b" style={{ borderColor:"hsl(var(--border))" }}>
          <h2 className="text-sm font-semibold" style={{ color:"hsl(210 40% 92%)" }}>Project Financials</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ background:"hsl(216 45% 12%)" }}>
                {["Project","Client","Type","Revenue","Cost","Profit","Margin","Status","Collected"].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-semibold" style={{ color:"hsl(215 25% 45%)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FINANCIALS.map((f,i) => (
                <tr key={f.id} style={{ borderTop:"1px solid hsl(var(--border))", background:i%2===0?"transparent":"hsl(216 45% 8% / 0.5)" }}>
                  <td className="px-4 py-3 font-medium" style={{ color:"hsl(210 40% 85%)" }}>{f.project}</td>
                  <td className="px-4 py-3" style={{ color:"hsl(215 25% 60%)" }}>{f.client}</td>
                  <td className="px-4 py-3" style={{ color:"hsl(215 25% 55%)" }}>{f.type}</td>
                  <td className="px-4 py-3 font-semibold" style={{ color:"hsl(38 95% 60%)" }}>{fmt(f.revenue)}</td>
                  <td className="px-4 py-3" style={{ color:"hsl(0 72% 65%)" }}>{fmt(f.cost)}</td>
                  <td className="px-4 py-3 font-semibold" style={{ color:"hsl(158 64% 55%)" }}>{fmt(f.profit)}</td>
                  <td className="px-4 py-3" style={{ color:"hsl(210 40% 75%)" }}>{f.margin}%</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{
                        background: f.status==="Completed"?"hsl(217 91% 53% / 0.15)":f.status==="At Risk"?"hsl(0 72% 51% / 0.15)":"hsl(158 64% 40% / 0.15)",
                        color: f.status==="Completed"?"hsl(217 91% 70%)":f.status==="At Risk"?"hsl(0 72% 68%)":"hsl(158 64% 55%)",
                      }}>
                      {f.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full" style={{ background:"hsl(216 45% 15%)", width:"60px" }}>
                        <div className="h-1.5 rounded-full" style={{ width:`${(f.collected/f.invoiced)*100}%`, background:"hsl(158 64% 45%)" }} />
                      </div>
                      <span style={{ color:"hsl(215 25% 55%)" }}>{fmt(f.collected)}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 flex items-center justify-between" style={{ borderTop:"1px solid hsl(var(--border))", background:"hsl(216 45% 10%)" }}>
          <span className="text-xs" style={{ color:"hsl(215 25% 45%)" }}>Totals</span>
          <div className="flex items-center gap-8 text-xs font-semibold">
            <span style={{ color:"hsl(38 95% 60%)" }}>Revenue: {fmt(totalRevenue)}</span>
            <span style={{ color:"hsl(0 72% 65%)" }}>Cost: {fmt(totalCost)}</span>
            <span style={{ color:"hsl(158 64% 55%)" }}>Profit: {fmt(totalProfit)}</span>
            <span style={{ color:"hsl(210 40% 75%)" }}>Avg Margin: {avgMargin}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
