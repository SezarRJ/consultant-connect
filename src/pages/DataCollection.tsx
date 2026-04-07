/**
 * DataCollection.tsx — Step 2 of workflow
 * Client uploads documents, enters structured data, financial inputs
 * All data is stored in engagement and reused across all tools automatically
 */
import { useState } from "react";
import {
  useEngagementStore, type DataInput, type ResourceItem,
  type FinancialData, type ServiceCategory,
} from "@/store/engagementStore";
import {
  Database, Plus, Check, AlertTriangle,
  FileText, Layers, RefreshCw, Save,
  Info, Trash2,
} from "lucide-react";

const DATA_CATEGORIES = ["Company","Financial","Market","Operations","Custom"] as const;

const SUGGESTED_INPUTS: Record<string, { label: string; category: typeof DATA_CATEGORIES[number]; placeholder: string }[]> = {
  "Strategic Management": [
    { label: "Strategic Objective", category: "Company", placeholder: "e.g. Grow EBITDA while entering 2 new segments" },
    { label: "Target Segments", category: "Market", placeholder: "e.g. B2B industrials, modern trade" },
    { label: "Current Governance Pain Point", category: "Operations", placeholder: "e.g. Slow decisions and unclear ownership" },
    { label: "Portfolio / Capital Priority", category: "Financial", placeholder: "e.g. Shift capex toward high-return units" },
  ],
  "Performance Improvement": [
    { label: "Unit Cost Baseline", category: "Financial", placeholder: "e.g. $2.30 per unit" },
    { label: "Main Bottleneck", category: "Operations", placeholder: "e.g. Packaging line changeovers" },
    { label: "Throughput / Cycle Time", category: "Operations", placeholder: "e.g. 180 units/hour, 5-day lead time" },
    { label: "Working Capital Issue", category: "Financial", placeholder: "e.g. 95 days inventory, slow collections" },
  ],
  "Customer Experience": [
    { label: "Key Journey", category: "Company", placeholder: "e.g. onboarding, complaint handling, renewal" },
    { label: "Top Customer Pain Point", category: "Market", placeholder: "e.g. delayed support and weak follow-up" },
    { label: "Retention / Loyalty Target", category: "Financial", placeholder: "e.g. reduce churn by 4 pts" },
    { label: "Service Channel Mix", category: "Operations", placeholder: "e.g. call center, WhatsApp, field service" },
  ],
  "Consumer Products": [
    { label: "Brand / SKU Portfolio", category: "Company", placeholder: "e.g. 3 brands, 24 active SKUs" },
    { label: "Trade Promotion Challenge", category: "Financial", placeholder: "e.g. heavy discounts with low ROI" },
    { label: "Route to Market Model", category: "Operations", placeholder: "e.g. distributors + key accounts" },
    { label: "Digital Shelf Issue", category: "Market", placeholder: "e.g. low ecommerce availability" },
  ],
  "Marketing Consulting": [
    { label: "ICP / Core Segment", category: "Market", placeholder: "e.g. SME owners in Baghdad and Erbil" },
    { label: "CAC / LTV Baseline", category: "Financial", placeholder: "e.g. CAC $140, LTV $900" },
    { label: "Main Growth Channel", category: "Operations", placeholder: "e.g. Meta ads + sales outreach" },
    { label: "Retention Challenge", category: "Market", placeholder: "e.g. 22% churn after month 3" },
  ],
  "Real Estate Consulting": [
    { label: "Asset / Portfolio Scope", category: "Company", placeholder: "e.g. 7 assets across Baghdad and Erbil" },
    { label: "Lease / Occupancy Issue", category: "Operations", placeholder: "e.g. vacancy at 18%" },
    { label: "Energy / ESG Priority", category: "Operations", placeholder: "e.g. high utility cost, weak metering" },
    { label: "Capital Plan Question", category: "Financial", placeholder: "e.g. hold vs sell and retrofit timing" },
  ],
  "Market & Commercial": [
    { label: "Target Market / Country", category: "Market", placeholder: "e.g. Iraq — Baghdad, Basra, Erbil" },
    { label: "Target Customer Segment", category: "Market", placeholder: "e.g. Modern trade supermarkets, B2B wholesale" },
    { label: "Annual Revenue", category: "Financial", placeholder: "e.g. $4.2M USD" },
    { label: "Current Market Share", category: "Market", placeholder: "e.g. 8% in Baghdad" },
    { label: "Number of SKUs / Products", category: "Company", placeholder: "e.g. 24 active SKUs" },
    { label: "Active Distributors", category: "Operations", placeholder: "e.g. 12 across Iraq" },
    { label: "Key Competitors", category: "Market", placeholder: "e.g. Company A, Company B" },
    { label: "Growth Target", category: "Company", placeholder: "e.g. 30% revenue growth in 12 months" },
  ],
  "Financial Consultancy": [
    { label: "Annual Revenue", category: "Financial", placeholder: "e.g. $10M USD" },
    { label: "COGS", category: "Financial", placeholder: "e.g. $6M USD" },
    { label: "Operating Expenses", category: "Financial", placeholder: "e.g. $2.5M USD" },
    { label: "Total Assets", category: "Financial", placeholder: "e.g. $15M USD" },
    { label: "Total Debt", category: "Financial", placeholder: "e.g. $3M USD" },
    { label: "Number of Employees", category: "Company", placeholder: "e.g. 85 employees" },
    { label: "Industry Benchmark", category: "Market", placeholder: "e.g. FMCG Iraq sector" },
    { label: "Investment Amount", category: "Financial", placeholder: "e.g. $2M capex planned" },
  ],
  "Real Estate": [
    { label: "Property Location", category: "Market", placeholder: "e.g. Erbil — Empire World, Zone 1" },
    { label: "Asset Type", category: "Company", placeholder: "e.g. Mixed-use tower, 30 floors" },
    { label: "Total GFA (m²)", category: "Company", placeholder: "e.g. 45,000 m²" },
    { label: "Estimated Land Cost", category: "Financial", placeholder: "e.g. $8M USD" },
    { label: "Construction Cost (per m²)", category: "Financial", placeholder: "e.g. $800/m²" },
    { label: "Target Sale/Lease Price", category: "Financial", placeholder: "e.g. $2,500/m² residential" },
    { label: "Target Occupancy Rate", category: "Financial", placeholder: "e.g. 80% by Year 2" },
    { label: "Total Investment Budget", category: "Financial", placeholder: "e.g. $45M USD" },
  ],
};

const BLANK_FINANCIAL: FinancialData = {
  revenue:"", cogs:"", grossProfit:"", operatingExpenses:"",
  ebitda:"", netProfit:"",
  totalAssets:"", totalLiabilities:"", equity:"", cash:"",
  receivables:"", inventory:"", debt:"",
  currency:"USD", fiscalYear:new Date().getFullYear().toString(), notes:"",
};

const FIN_FIELDS: { key: keyof FinancialData; label: string; group: "income"|"balance"|"meta" }[] = [
  { key:"revenue",           label:"Revenue",              group:"income" },
  { key:"cogs",              label:"COGS",                 group:"income" },
  { key:"grossProfit",       label:"Gross Profit",         group:"income" },
  { key:"operatingExpenses", label:"Operating Expenses",   group:"income" },
  { key:"ebitda",            label:"EBITDA",               group:"income" },
  { key:"netProfit",         label:"Net Profit",           group:"income" },
  { key:"totalAssets",       label:"Total Assets",         group:"balance" },
  { key:"totalLiabilities",  label:"Total Liabilities",   group:"balance" },
  { key:"equity",            label:"Shareholders' Equity", group:"balance" },
  { key:"cash",              label:"Cash & Equivalents",   group:"balance" },
  { key:"receivables",       label:"Accounts Receivable",  group:"balance" },
  { key:"inventory",         label:"Inventory",            group:"balance" },
  { key:"debt",              label:"Total Debt",           group:"balance" },
  { key:"currency",          label:"Currency",             group:"meta" },
  { key:"fiscalYear",        label:"Fiscal Year",          group:"meta" },
  { key:"notes",             label:"Notes",                group:"meta" },
];

function DocRow({ resource, onUpdate, onRemove }: { resource: ResourceItem; onUpdate: (patch: Partial<ResourceItem>) => void; onRemove: () => void }) {
  const STATUS_COLORS = { Uploaded: "hsl(145 65% 52%)", Pending: "hsl(38 85% 52%)", Reviewed: "hsl(200 80% 55%)" };
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
      style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 17%)" }}>
      <FileText className="h-4 w-4 shrink-0" style={{ color: "hsl(215 25% 48%)" }} />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium truncate" style={{ color: "hsl(210 40% 85%)" }}>{resource.name}</p>
        <p className="text-[10px]" style={{ color: "hsl(215 25% 45%)" }}>{resource.category}</p>
      </div>
      <select value={resource.status} onChange={e => onUpdate({ status: e.target.value as any })}
        className="text-[11px] rounded-md px-2 py-1 font-semibold"
        style={{ background: "hsl(216 45% 14%)", border: "none", color: STATUS_COLORS[resource.status] }}>
        <option value="Pending">Pending</option>
        <option value="Uploaded">Uploaded</option>
        <option value="Reviewed">Reviewed</option>
      </select>
      <button onClick={onRemove} className="p-1 rounded hover:opacity-70">
        <Trash2 className="h-3.5 w-3.5" style={{ color: "hsl(215 25% 40%)" }} />
      </button>
    </div>
  );
}

export default function DataCollection() {
  const {
    getActiveEngagement, updateEngagement, addDataInput, updateDataInput,
    removeDataInput, addResource, updateResource, removeResource,
    updateFinancialData, engagements, reuseEngagementData,
  } = useEngagementStore();
  const eng = getActiveEngagement();

  const [tab, setTab] = useState<"documents"|"data"|"financial"|"reuse">("documents");
  const [newDocName, setNewDocName] = useState("");
  const [newDocCat, setNewDocCat] = useState<ResourceItem["category"]>("Document");
  const [newInputLabel, setNewInputLabel] = useState("");
  const [newInputValue, setNewInputValue] = useState("");
  const [newInputCat, setNewInputCat] = useState<DataInput["category"]>("Company");
  const [finData, setFinData] = useState<Partial<FinancialData>>(eng?.financialData || {});
  const [finSaved, setFinSaved] = useState(false);
  const [notes, setNotes] = useState(eng?.financialData?.notes || "");

  if (!eng) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <AlertTriangle className="h-8 w-8" style={{ color: "hsl(38 85% 52%)" }} />
      <p className="text-sm font-medium" style={{ color: "hsl(215 25% 52%)" }}>No active engagement. Select one from the workflow.</p>
    </div>
  );

  const suggested = SUGGESTED_INPUTS[eng.serviceCategory] || SUGGESTED_INPUTS["Strategic Management"];
  const incomeFields = FIN_FIELDS.filter(f => f.group === "income");
  const balanceFields = FIN_FIELDS.filter(f => f.group === "balance");
  const metaFields = FIN_FIELDS.filter(f => f.group === "meta");

  const addSuggested = (s: typeof suggested[0]) => {
    addDataInput(eng.id, { key: s.label.toLowerCase().replace(/\s+/g,"-"), label: s.label, value: "", category: s.category });
  };

  const saveFinancial = () => {
    updateFinancialData(eng.id, { ...finData, notes });
    setFinSaved(true);
    setTimeout(() => setFinSaved(false), 2000);
  };

  const TAB_STYLE = (t: string) => ({
    background: tab === t ? "hsl(38 95% 52%/0.12)" : "hsl(216 45% 12%)",
    color: tab === t ? "hsl(38 95% 60%)" : "hsl(215 25% 52%)",
    border: `1px solid ${tab === t ? "hsl(38 95% 52%/0.3)" : "hsl(216 45% 18%)"}`,
  });

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Database className="h-5 w-5" style={{ color: "hsl(200 80% 55%)" }} />
          <h1 className="text-xl font-bold" style={{ color: "hsl(210 40% 92%)" }}>Data Collection</h1>
        </div>
        <p className="text-sm" style={{ color: "hsl(215 25% 48%)" }}>
          Enter all client-provided data once — every analysis tool will use it automatically.
        </p>
      </div>

      {/* Active engagement banner */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
        style={{ background: "hsl(38 95% 52%/0.08)", border: "1px solid hsl(38 95% 52%/0.2)" }}>
        <Layers className="h-4 w-4 shrink-0" style={{ color: "hsl(38 95% 52%)" }} />
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold" style={{ color: "hsl(38 95% 65%)" }}>
            {eng.companyName} — {eng.serviceType}
          </p>
          <p className="text-[11px]" style={{ color: "hsl(215 25% 50%)" }}>
            {eng.resources.filter(r => r.status === "Uploaded").length} docs · {(eng.dataInputs || []).length} data inputs · Phase: {eng.phase}
          </p>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: "hsl(38 95% 52%/0.12)", color: "hsl(38 95% 60%)" }}>
          {eng.serviceCategory}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: "documents", label: "📂 Documents", badge: eng.resources.length },
          { id: "data",      label: "📊 Data Inputs", badge: (eng.dataInputs || []).length },
          { id: "financial", label: "💰 Financial Data", badge: eng.financialData ? 1 : 0 },
          { id: "reuse",     label: "♻️ Reuse Previous", badge: 0 },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as any)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold"
            style={TAB_STYLE(t.id)}>
            {t.label}
            {t.badge > 0 && <span className="text-[10px] font-bold px-1.5 rounded-full" style={{ background: "hsl(145 65% 40%/0.2)", color: "hsl(145 65% 55%)" }}>{t.badge}</span>}
          </button>
        ))}
      </div>

      {/* ── DOCUMENTS tab ── */}
      {tab === "documents" && (
        <div className="space-y-4">
          <p className="text-xs" style={{ color: "hsl(215 25% 48%)" }}>
            Log all documents the client provides. Mark them as Uploaded when received.
          </p>
          <div className="space-y-2">
            {eng.resources.map(r => (
              <DocRow key={r.id} resource={r}
                onUpdate={p => updateResource(eng.id, r.id, p)}
                onRemove={() => removeResource(eng.id, r.id)} />
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <select value={newDocCat} onChange={e => setNewDocCat(e.target.value as any)}
              className="rounded-lg px-3 py-2 text-sm"
              style={{ background: "hsl(216 45% 12%)", border: "1px solid hsl(216 45% 20%)", color: "hsl(210 40% 78%)" }}>
              {["Document","Report","Financial","Presentation","Contract","Data","Other"].map(c => <option key={c}>{c}</option>)}
            </select>
            <input value={newDocName} onChange={e => setNewDocName(e.target.value)}
              placeholder="Document name…"
              className="flex-1 rounded-lg px-3 py-2 text-sm"
              style={{ background: "hsl(216 45% 12%)", border: "1px solid hsl(216 45% 20%)", color: "hsl(210 40% 88%)" }} />
            <button onClick={() => {
              if (!newDocName.trim()) return;
              addResource(eng.id, { name: newDocName.trim(), category: newDocCat, status: "Uploaded", reusable: true });
              setNewDocName("");
            }} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold"
              style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>
        </div>
      )}

      {/* ── DATA INPUTS tab ── */}
      {tab === "data" && (
        <div className="space-y-4">
          <p className="text-xs" style={{ color: "hsl(215 25% 48%)" }}>
            Enter all client-provided data. These are automatically injected into every AI tool prompt.
          </p>

          {/* Suggested inputs */}
          <div className="rounded-xl p-4" style={{ background: "hsl(216 45% 9%)", border: "1px solid hsl(216 45% 16%)" }}>
            <p className="text-[10px] uppercase tracking-widest font-bold mb-3" style={{ color: "hsl(215 25% 40%)" }}>
              SUGGESTED FOR {eng.serviceCategory.toUpperCase()}
            </p>
            <div className="flex flex-wrap gap-2">
              {suggested.map(s => {
                const already = (eng.dataInputs || []).some(d => d.label === s.label);
                return (
                  <button key={s.label} onClick={() => !already && addSuggested(s)}
                    disabled={already}
                    className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all"
                    style={{
                      background: already ? "hsl(145 65% 40%/0.1)" : "hsl(216 45% 13%)",
                      color: already ? "hsl(145 65% 50%)" : "hsl(215 25% 58%)",
                      border: `1px solid ${already ? "hsl(145 65% 40%/0.25)" : "hsl(216 45% 20%)"}`,
                    }}>
                    {already ? <span className="flex items-center gap-1"><Check className="h-3 w-3" /> {s.label}</span> : `+ ${s.label}`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Existing inputs */}
          <div className="space-y-2">
            {(eng.dataInputs || []).map(input => (
              <div key={input.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 17%)" }}>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold mb-0.5" style={{ color: "hsl(215 25% 48%)" }}>{input.label}</p>
                  <input value={input.value}
                    onChange={e => updateDataInput(eng.id, input.id, e.target.value)}
                    placeholder="Enter value…"
                    className="w-full text-sm bg-transparent outline-none"
                    style={{ color: "hsl(210 40% 85%)" }} />
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0"
                  style={{ background: "hsl(216 45% 16%)", color: "hsl(215 25% 48%)" }}>{input.category}</span>
                <button onClick={() => removeDataInput(eng.id, input.id)} className="p-1 hover:opacity-70">
                  <Trash2 className="h-3.5 w-3.5" style={{ color: "hsl(215 25% 40%)" }} />
                </button>
              </div>
            ))}
          </div>

          {/* Add custom input */}
          <div className="flex gap-2">
            <select value={newInputCat} onChange={e => setNewInputCat(e.target.value as any)}
              className="rounded-lg px-3 py-2 text-sm"
              style={{ background: "hsl(216 45% 12%)", border: "1px solid hsl(216 45% 20%)", color: "hsl(210 40% 78%)" }}>
              {DATA_CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <input value={newInputLabel} onChange={e => setNewInputLabel(e.target.value)}
              placeholder="Field name (e.g. Annual Revenue)…"
              className="flex-1 rounded-lg px-3 py-2 text-sm"
              style={{ background: "hsl(216 45% 12%)", border: "1px solid hsl(216 45% 20%)", color: "hsl(210 40% 88%)" }} />
            <button onClick={() => {
              if (!newInputLabel.trim()) return;
              addDataInput(eng.id, { key: newInputLabel.toLowerCase().replace(/\s+/g,"-"), label: newInputLabel, value: newInputValue, category: newInputCat });
              setNewInputLabel(""); setNewInputValue("");
            }} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold"
              style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>
        </div>
      )}

      {/* ── FINANCIAL tab ── */}
      {tab === "financial" && (
        <div className="space-y-5">
          <p className="text-xs" style={{ color: "hsl(215 25% 48%)" }}>
            Enter client financial data. Used automatically in Financial Consultancy, Feasibility Study, and Investment Analysis tools.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Income Statement */}
            <div className="rounded-xl p-4 space-y-3" style={{ background: "hsl(216 45% 9%)", border: "1px solid hsl(216 45% 16%)" }}>
              <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: "hsl(145 65% 48%)" }}>INCOME STATEMENT</p>
              {incomeFields.map(f => (
                <div key={f.key}>
                  <label className="block text-[10px] font-semibold mb-0.5" style={{ color: "hsl(215 25% 45%)" }}>{f.label}</label>
                  <input value={finData[f.key] ?? ""} onChange={e => setFinData(d => ({ ...d, [f.key]: e.target.value }))}
                    placeholder={f.key === "currency" ? "USD" : "Amount…"}
                    className="w-full rounded-md px-3 py-1.5 text-sm"
                    style={{ background: "hsl(216 45% 13%)", border: "1px solid hsl(216 45% 20%)", color: "hsl(210 40% 85%)" }} />
                </div>
              ))}
            </div>
            {/* Balance Sheet */}
            <div className="rounded-xl p-4 space-y-3" style={{ background: "hsl(216 45% 9%)", border: "1px solid hsl(216 45% 16%)" }}>
              <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: "hsl(200 80% 55%)" }}>BALANCE SHEET</p>
              {balanceFields.map(f => (
                <div key={f.key}>
                  <label className="block text-[10px] font-semibold mb-0.5" style={{ color: "hsl(215 25% 45%)" }}>{f.label}</label>
                  <input value={finData[f.key] ?? ""} onChange={e => setFinData(d => ({ ...d, [f.key]: e.target.value }))}
                    placeholder="Amount…"
                    className="w-full rounded-md px-3 py-1.5 text-sm"
                    style={{ background: "hsl(216 45% 13%)", border: "1px solid hsl(216 45% 20%)", color: "hsl(210 40% 85%)" }} />
                </div>
              ))}
            </div>
          </div>

          {/* Meta */}
          <div className="flex gap-3">
            {metaFields.filter(f => f.key !== "notes").map(f => (
              <div key={f.key} className="flex-1">
                <label className="block text-[10px] font-semibold mb-1" style={{ color: "hsl(215 25% 45%)" }}>{f.label}</label>
                <input value={finData[f.key] ?? ""} onChange={e => setFinData(d => ({ ...d, [f.key]: e.target.value }))}
                  className="w-full rounded-md px-3 py-1.5 text-sm"
                  style={{ background: "hsl(216 45% 12%)", border: "1px solid hsl(216 45% 20%)", color: "hsl(210 40% 85%)" }} />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-[10px] font-semibold mb-1" style={{ color: "hsl(215 25% 45%)" }}>Notes</label>
            <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any notes about the financial data…"
              className="w-full rounded-md px-3 py-2 text-sm resize-none"
              style={{ background: "hsl(216 45% 12%)", border: "1px solid hsl(216 45% 20%)", color: "hsl(210 40% 85%)" }} />
          </div>

          <button onClick={saveFinancial}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: finSaved ? "hsl(145 65% 40%/0.15)" : "hsl(38 95% 52%)", color: finSaved ? "hsl(145 65% 55%)" : "hsl(216 58% 6%)" }}>
            {finSaved ? <><Check className="h-4 w-4" /> Saved!</> : <><Save className="h-4 w-4" /> Save Financial Data</>}
          </button>
        </div>
      )}

      {/* ── REUSE tab ── */}
      {tab === "reuse" && (
        <div className="space-y-4">
          <div className="flex items-start gap-3 px-4 py-3 rounded-xl"
            style={{ background: "hsl(200 80% 55%/0.08)", border: "1px solid hsl(200 80% 55%/0.2)" }}>
            <Info className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "hsl(200 80% 60%)" }} />
            <p className="text-xs" style={{ color: "hsl(215 25% 58%)" }}>
              Reuse documents and data inputs from a previous engagement for the same client. This saves re-uploading the same company profile, financial data, or market reports.
            </p>
          </div>

          {eng.contactId && (() => {
            const contactEngs = engagements.filter(e => e.contactId === eng.contactId && e.id !== eng.id);
            if (contactEngs.length === 0) return (
              <p className="text-sm text-center py-8" style={{ color: "hsl(215 25% 45%)" }}>No previous engagements for this client.</p>
            );
            return (
              <div className="space-y-3">
                {contactEngs.map(prevEng => (
                  <div key={prevEng.id} className="rounded-xl p-4"
                    style={{ background: "hsl(216 45% 9%)", border: "1px solid hsl(216 45% 16%)" }}>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "hsl(210 40% 88%)" }}>{prevEng.name}</p>
                        <p className="text-[11px]" style={{ color: "hsl(215 25% 48%)" }}>
                          {prevEng.resources.length} docs · {(prevEng.dataInputs||[]).length} inputs · {prevEng.status}
                        </p>
                      </div>
                      <button onClick={() => reuseEngagementData(eng.id, prevEng.id)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold"
                        style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
                        <RefreshCw className="h-3.5 w-3.5" /> Reuse Data
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {prevEng.resources.slice(0,5).map(r => (
                        <span key={r.id} className="text-[10px] px-2 py-0.5 rounded-full"
                          style={{ background: "hsl(216 45% 14%)", color: "hsl(215 25% 52%)" }}>{r.name}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
