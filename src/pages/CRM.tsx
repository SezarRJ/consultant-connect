/**
 * CRM.tsx — entry point for all new work
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCRMContacts, useCreateCRMContact, useUpdateCRMContact, useDeleteCRMContact,
  type CRMContact, type LeadStatus,
} from "@/hooks/useCRMContacts";
import { useEngagementStore } from "@/store/engagementStore";
import { Loader2, AlertTriangle } from "lucide-react";
import {
  Users, Plus, Search, X, Phone, Mail, Globe, Building2,
  ArrowRight, CheckCircle2, Briefcase, Star, Trash2
} from "lucide-react";

const STATUS_CONFIG: Record<LeadStatus, { color: string; bg: string; label: string }> = {
  "New":           { color: "hsl(215 25% 60%)", bg: "hsl(216 45% 18%)",       label: "New"           },
  "Contacted":     { color: "hsl(200 80% 55%)", bg: "hsl(200 80% 55%/0.12)",  label: "Contacted"     },
  "Qualified":     { color: "hsl(217 91% 70%)", bg: "hsl(217 91% 53%/0.12)",  label: "Qualified"     },
  "Opportunity":   { color: "hsl(280 80% 70%)", bg: "hsl(280 80% 60%/0.12)",  label: "Opportunity"   },
  "Active Client": { color: "hsl(145 65% 48%)", bg: "hsl(145 65% 40%/0.12)",  label: "Active Client" },
  "Closed Won":    { color: "hsl(38 95% 52%)",  bg: "hsl(38 95% 52%/0.12)",   label: "Closed Won"    },
  "Closed Lost":   { color: "hsl(0 72% 60%)",   bg: "hsl(0 72% 51%/0.12)",    label: "Closed Lost"   },
};

const STATUSES = Object.keys(STATUS_CONFIG) as LeadStatus[];
const COUNTRIES  = ["Iraq","Jordan","UAE","Saudi Arabia","Kuwait","Qatar","Bahrain","Oman","Egypt","Turkey","Lebanon"];
const INDUSTRIES = ["FMCG","Food & Beverage","Real Estate","Telecom","Construction","Healthcare","Technology","Retail","Manufacturing","Energy","Finance","Distribution"];
const SERVICES   = ["Market Entry","Feasibility Study","Market Intelligence","Competitor Analysis","Risk Assessment","Sales Strategy","Pricing Intelligence","Distributor Finder","Export Readiness","Partner Matchmaking","ISO Preparation","Company Development"];
const SOURCES    = ["Referral","Direct","LinkedIn","Event","Cold Outreach","Website","Partner"];

const BLANK: Omit<CRMContact, "id"|"createdAt"|"updatedAt"> = {
  fullName:"", jobTitle:"", email:"", phone:"", country:"Iraq", companyName:"",
  industry:"FMCG", sector:"", leadSource:"Direct", interestedService:"Market Entry",
  estimatedBudget:"", urgency:"Medium", leadStatus:"New", nextActionDate:"",
  notes:"", tags:[], qualificationStatus:"Pending", qualificationNotes:"",
  clientNeed:"", businessProblem:"", decisionMaker:"", priorityLevel:"Medium", engagementId:null,
};

// ── Contact Card ──────────────────────────────────────────────────
function ContactCard({ c, onClick, selected }: { c: CRMContact; onClick: () => void; selected: boolean }) {
  const sc = STATUS_CONFIG[c.leadStatus];
  return (
    <button onClick={onClick}
      className="w-full text-left p-4 rounded-xl transition-all hover:opacity-90"
      style={{
        background: selected ? "hsl(38 95% 52%/0.1)" : "hsl(216 45% 10%)",
        border: selected ? "1px solid hsl(38 95% 52%/0.3)" : "1px solid hsl(216 45% 18%)",
      }}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
          style={{ background: "hsl(216 45% 18%)", color: "hsl(210 40% 72%)" }}>
          {c.fullName[0] || "?"}
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full ml-auto"
          style={{ background: sc.bg, color: sc.color }}>{sc.label}</span>
      </div>
      <p className="text-sm font-semibold truncate" style={{ color: "hsl(210 40% 88%)" }}>{c.fullName}</p>
      <p className="text-xs truncate" style={{ color: "hsl(215 25% 50%)" }}>{c.jobTitle} · {c.companyName}</p>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-[10px]" style={{ color: "hsl(215 25% 42%)" }}>{c.industry}</span>
        {c.estimatedBudget && (
          <span className="text-[10px] ml-auto" style={{ color: "hsl(38 95% 52%)" }}>{c.estimatedBudget}</span>
        )}
      </div>
    </button>
  );
}

// ── Contact Detail ────────────────────────────────────────────────
function ContactDetail({ c, onEdit, onConvert, onDelete, onStatusChange }: {
  c: CRMContact; onEdit: () => void; onConvert: () => void; onDelete: () => void;
  onStatusChange: (status: LeadStatus) => void;
}) {
  const sc = STATUS_CONFIG[c.leadStatus];

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-5" style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 18%)" }}>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: sc.bg, color: sc.color }}>{sc.label}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "hsl(216 45% 18%)", color: "hsl(215 25% 50%)" }}>{c.urgency} urgency</span>
            </div>
            <h2 className="text-lg font-bold" style={{ color: "hsl(210 40% 92%)" }}>{c.fullName}</h2>
            <p className="text-sm" style={{ color: "hsl(215 25% 52%)" }}>{c.jobTitle} · {c.companyName}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button onClick={onEdit} className="text-xs px-3 py-1.5 rounded-lg"
              style={{ background: "hsl(216 45% 18%)", color: "hsl(215 25% 60%)" }}>Edit</button>
            <button onClick={onDelete} className="p-1.5 rounded-lg"
              style={{ background: "hsl(0 72% 51%/0.12)", color: "hsl(0 72% 60%)" }}>
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {([
            [Mail, c.email], [Phone, c.phone], [Globe, c.country], [Building2, c.industry],
          ] as [React.ElementType, string][]).map(([Icon, val], i) => val ? (
            <div key={i} className="flex items-center gap-2">
              <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: "hsl(215 25% 45%)" }} />
              <span className="text-xs truncate" style={{ color: "hsl(210 40% 75%)" }}>{val}</span>
            </div>
          ) : null)}
        </div>
      </div>

      <div className="rounded-xl p-4 space-y-3" style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 18%)" }}>
        <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: "hsl(215 25% 40%)" }}>Lead Information</p>
        {([
          ["Interested Service", c.interestedService],
          ["Estimated Budget",   c.estimatedBudget],
          ["Lead Source",        c.leadSource],
          ["Next Action Date",   c.nextActionDate],
        ] as [string, string][]).map(([l, v]) => v ? (
          <div key={l} className="flex items-center justify-between">
            <span className="text-xs" style={{ color: "hsl(215 25% 48%)" }}>{l}</span>
            <span className="text-xs font-medium" style={{ color: "hsl(210 40% 82%)" }}>{v}</span>
          </div>
        ) : null)}
        <div>
          <label className="block text-[10px] uppercase tracking-wider font-semibold mb-1" style={{ color: "hsl(215 25% 48%)" }}>Update Status</label>
          <select value={c.leadStatus}
            onChange={(e) => onStatusChange(e.target.value as LeadStatus)}
            className="w-full rounded-md px-3 py-1.5 text-xs"
            style={{ background: "hsl(216 45% 14%)", color: "hsl(210 40% 88%)", border: "1px solid hsl(216 45% 22%)" }}>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {c.qualificationStatus === "Qualified" && (
        <div className="rounded-xl p-4 space-y-2"
          style={{ background: "hsl(145 65% 40%/0.06)", border: "1px solid hsl(145 65% 40%/0.2)" }}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" style={{ color: "hsl(145 65% 48%)" }} />
            <p className="text-xs font-semibold" style={{ color: "hsl(145 65% 55%)" }}>Qualified Lead</p>
          </div>
          {c.qualificationNotes && (
            <p className="text-xs" style={{ color: "hsl(145 65% 45%)" }}>{c.qualificationNotes}</p>
          )}
        </div>
      )}

      {c.notes && (
        <div className="rounded-xl p-4" style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 18%)" }}>
          <p className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: "hsl(215 25% 40%)" }}>Notes</p>
          <p className="text-xs leading-relaxed" style={{ color: "hsl(210 40% 72%)" }}>{c.notes}</p>
        </div>
      )}

      {!c.engagementId ? (
        <button onClick={onConvert}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
          <Briefcase className="h-4 w-4" /> Convert to Engagement <ArrowRight className="h-4 w-4" />
        </button>
      ) : (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl"
          style={{ background: "hsl(145 65% 40%/0.08)", border: "1px solid hsl(145 65% 40%/0.2)" }}>
          <CheckCircle2 className="h-4 w-4" style={{ color: "hsl(145 65% 48%)" }} />
          <span className="text-xs font-medium" style={{ color: "hsl(145 65% 55%)" }}>Linked to active engagement</span>
        </div>
      )}
    </div>
  );
}

// ── Contact Form ──────────────────────────────────────────────────
function ContactForm({ initial, onSave, onClose }: {
  initial?: Partial<CRMContact>; onSave: (d: any) => void; onClose: () => void;
}) {
  const [form, setForm] = useState({ ...BLANK, ...initial });
  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.7)" }}>
      <div className="w-full max-w-2xl rounded-xl p-6 space-y-4 overflow-y-auto max-h-[90vh]"
        style={{ background: "hsl(216 58% 8%)", border: "1px solid hsl(216 45% 20%)" }}>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold" style={{ color: "hsl(210 40% 92%)" }}>
            {initial?.id ? "Edit Contact" : "New Contact"}
          </h2>
          <button onClick={onClose}><X className="h-4 w-4" style={{ color: "hsl(215 25% 50%)" }} /></button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {([
            ["Full Name",  "fullName",    "text"],
            ["Job Title",  "jobTitle",    "text"],
            ["Email",      "email",       "email"],
            ["Phone",      "phone",       "text"],
            ["Company",    "companyName", "text"],
            ["Sector",     "sector",      "text"],
          ] as [string, string, string][]).map(([label, key, type]) => (
            <div key={key}>
              <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1"
                style={{ color: "hsl(215 25% 48%)" }}>{label}</label>
              <input type={type} value={(form as any)[key]} onChange={f(key)}
                className="w-full rounded-md px-3 py-1.5 text-sm"
                style={{ background: "hsl(216 45% 12%)", color: "hsl(210 40% 88%)", border: "1px solid hsl(216 45% 22%)" }} />
            </div>
          ))}

          {([
            ["Country",       "country",             COUNTRIES],
            ["Industry",      "industry",            INDUSTRIES],
            ["Lead Source",   "leadSource",          SOURCES],
            ["Service",       "interestedService",   SERVICES],
            ["Urgency",       "urgency",             ["High","Medium","Low"]],
            ["Priority",      "priorityLevel",       ["High","Medium","Low"]],
            ["Lead Status",   "leadStatus",          STATUSES],
            ["Qualification", "qualificationStatus", ["Pending","Qualified","Rejected"]],
          ] as [string, string, string[]][]).map(([label, key, opts]) => (
            <div key={key}>
              <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1"
                style={{ color: "hsl(215 25% 48%)" }}>{label}</label>
              <select value={(form as any)[key]} onChange={f(key)}
                className="w-full rounded-md px-3 py-1.5 text-sm"
                style={{ background: "hsl(216 45% 12%)", color: "hsl(210 40% 88%)", border: "1px solid hsl(216 45% 22%)" }}>
                {opts.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}

          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1"
              style={{ color: "hsl(215 25% 48%)" }}>Estimated Budget</label>
            <input type="text" value={form.estimatedBudget} onChange={f("estimatedBudget")}
              placeholder="e.g. $42,000" className="w-full rounded-md px-3 py-1.5 text-sm"
              style={{ background: "hsl(216 45% 12%)", color: "hsl(210 40% 88%)", border: "1px solid hsl(216 45% 22%)" }} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1"
              style={{ color: "hsl(215 25% 48%)" }}>Next Action Date</label>
            <input type="date" value={form.nextActionDate} onChange={f("nextActionDate")}
              className="w-full rounded-md px-3 py-1.5 text-sm"
              style={{ background: "hsl(216 45% 12%)", color: "hsl(210 40% 88%)", border: "1px solid hsl(216 45% 22%)" }} />
          </div>
        </div>

        {([
          ["Client Need",         "clientNeed"],
          ["Business Problem",    "businessProblem"],
          ["Decision Maker",      "decisionMaker"],
          ["Qualification Notes", "qualificationNotes"],
          ["Notes",               "notes"],
        ] as [string, string][]).map(([l, k]) => (
          <div key={k}>
            <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1"
              style={{ color: "hsl(215 25% 48%)" }}>{l}</label>
            <textarea rows={2} value={(form as any)[k]} onChange={f(k)}
              className="w-full rounded-md px-3 py-2 text-sm resize-none"
              style={{ background: "hsl(216 45% 12%)", color: "hsl(210 40% 88%)", border: "1px solid hsl(216 45% 22%)" }} />
          </div>
        ))}

        <div className="flex gap-2">
          <button onClick={() => onSave(form)}
            className="flex-1 py-2 rounded-lg text-sm font-semibold"
            style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>Save</button>
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm"
            style={{ background: "hsl(216 45% 18%)", color: "hsl(210 40% 72%)" }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────
export default function CRMPage() {
  const navigate = useNavigate();
  const { data: contacts = [], isLoading, isError } = useCRMContacts();
  const createContact = useCreateCRMContact();
  const updateContact = useUpdateCRMContact();
  const deleteContact = useDeleteCRMContact();
  const { createEngagement } = useEngagementStore();

  const [search,       setSearch]       = useState("");
  const [filterStatus, setFilterStatus] = useState<LeadStatus | "all">("all");
  const [selId,        setSelId]        = useState<string | null>(null);
  const [showForm,     setShowForm]     = useState(false);
  const [editContact,  setEditContact]  = useState<CRMContact | null>(null);

  const filtered = contacts.filter((c) =>
    (filterStatus === "all" || c.leadStatus === filterStatus) &&
    (search === "" || [c.fullName, c.companyName, c.email].some(
      (v) => v.toLowerCase().includes(search.toLowerCase())
    ))
  );
  const sel = contacts.find((c) => c.id === selId);

  const handleSave = async (d: any) => {
    if (editContact) {
      await updateContact.mutateAsync({ id: editContact.id, ...d });
    } else {
      await createContact.mutateAsync(d);
    }
    setShowForm(false); setEditContact(null);
  };

  // Convert contact to engagement — creates Zustand engagement + marks Supabase contact as Active Client
  const handleConvert = async (contact: CRMContact) => {
    // 1. Update CRM contact status in Supabase
    await updateContact.mutateAsync({ id: contact.id, leadStatus: "Active Client" });

    // 2. Build and create the engagement in Zustand store (sets it as active automatically)
    const expectedOutputs = [contact.interestedService, "Executive Summary"].filter(Boolean);
    createEngagement({
      name: `${contact.companyName || contact.fullName} — ${contact.interestedService}`,
      contactId: contact.id,
      clientName: contact.fullName,
      companyName: contact.companyName,
      industry: contact.industry,
      sector: contact.sector,
      market: contact.country,
      serviceType: contact.interestedService,
      serviceCategory: "Strategic Management",
      budget: contact.estimatedBudget,
      startDate: new Date().toISOString().slice(0, 10),
      endDate: "",
      timeline: "TBD",
      objectives: contact.clientNeed || contact.businessProblem || "",
      scope: "",
      constraints: "",
      risks: "",
      internalNotes: contact.qualificationNotes,
      priority: contact.priorityLevel,
      phase: "Discovery",
      status: "Active",
      health: "On Track",
      progress: 0,
      stakeholders: [],
      outputs: {},
      requestSummary: {
        serviceRequest: contact.interestedService,
        serviceCategory: "Strategic Management",
        expectedOutputs,
        deadline: contact.nextActionDate || "",
        targetMarket: contact.country,
        requestedReports: expectedOutputs,
        summary: contact.clientNeed || contact.businessProblem || `${contact.interestedService} for ${contact.companyName || contact.fullName}`,
      },
      resources: [],
      dataInputs: [],
      phaseRequirements: {},
      requestedOutputs: expectedOutputs,
    });

    // 3. Go to Engagement Hub (engagement is now active)
    navigate("/engagement");
  };

  const handleDelete = async (id: string) => {
    await deleteContact.mutateAsync(id);
    setSelId(null);
  };

  const activeClients = contacts.filter((c) => c.leadStatus === "Active Client").length;
  const qualified     = contacts.filter((c) => c.leadStatus === "Qualified").length;
  const won           = contacts.filter((c) => c.leadStatus === "Closed Won").length;

  if (isLoading) return (
    <div className="flex items-center justify-center h-64 gap-2 text-muted-foreground">
      <Loader2 className="h-5 w-5 animate-spin"/><span className="text-sm">Loading contacts…</span>
    </div>
  );
  if (isError) return (
    <div className="flex items-center justify-center h-64 gap-2" style={{color:"hsl(0 72% 68%)"}}>
      <AlertTriangle className="h-5 w-5"/><span className="text-sm">Failed to load. Check Supabase connection.</span>
    </div>
  );

  return (
    <div className="space-y-5 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "hsl(210 40% 92%)" }}>CRM</h1>
          <p className="text-sm mt-0.5" style={{ color: "hsl(215 25% 48%)" }}>
            Manage leads, qualify prospects, and convert to engagements — live from your database.
          </p>
        </div>
        <button onClick={() => { setEditContact(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
          style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
          <Plus className="h-4 w-4" /> New Contact
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Contacts",  value: contacts.length, color: "hsl(210 40% 72%)", Icon: Users         },
          { label: "Qualified",       value: qualified,       color: "hsl(217 91% 68%)", Icon: Star          },
          { label: "Active Clients",  value: activeClients,   color: "hsl(145 65% 48%)", Icon: CheckCircle2  },
          { label: "Closed Won",      value: won,             color: "hsl(38 95% 52%)",  Icon: Briefcase     },
        ].map(({ label, value, color, Icon }) => (
          <div key={label} className="rounded-xl p-4" style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 18%)" }}>
            <Icon className="h-4 w-4 mb-2" style={{ color }} />
            <p className="text-2xl font-bold" style={{ color }}>{value}</p>
            <p className="text-[10px] uppercase tracking-wider font-semibold mt-0.5" style={{ color: "hsl(215 25% 42%)" }}>{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* List */}
        <div className="col-span-5 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: "hsl(215 25% 45%)" }} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search contacts…"
                className="w-full pl-8 pr-3 py-2 rounded-lg text-sm"
                style={{ background: "hsl(216 45% 10%)", color: "hsl(210 40% 88%)", border: "1px solid hsl(216 45% 18%)" }} />
            </div>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)}
              className="rounded-lg px-3 py-2 text-xs"
              style={{ background: "hsl(216 45% 10%)", color: "hsl(210 40% 80%)", border: "1px solid hsl(216 45% 18%)" }}>
              <option value="all">All</option>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          {contacts.length === 0 ? (
            <div className="rounded-xl p-10 text-center" style={{ background: "hsl(216 45% 10%)", border: "2px dashed hsl(216 45% 20%)" }}>
              <Users className="h-8 w-8 mx-auto mb-3 opacity-20" style={{ color: "hsl(38 95% 52%)" }}/>
              <p className="text-sm font-semibold" style={{ color: "hsl(215 25% 50%)" }}>No contacts yet</p>
              <p className="text-xs mt-1" style={{ color: "hsl(215 25% 38%)" }}>Add your first lead to start the pipeline</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.length === 0
                ? <p className="text-sm text-center py-8" style={{ color: "hsl(215 25% 40%)" }}>No contacts found.</p>
                : filtered.map((c) => (
                  <ContactCard key={c.id} c={c} selected={selId === c.id} onClick={() => setSelId(c.id)} />
                ))}
            </div>
          )}
        </div>

        {/* Detail */}
        <div className="col-span-7">
          {sel ? (
            <ContactDetail
              c={sel}
              onEdit={() => { setEditContact(sel); setShowForm(true); }}
              onConvert={() => handleConvert(sel)}
              onDelete={() => handleDelete(sel.id)}
              onStatusChange={(status) => updateContact.mutate({ id: sel.id, leadStatus: status })}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 rounded-xl"
              style={{ background: "hsl(216 45% 10%)", border: "1px solid hsl(216 45% 18%)" }}>
              <Users className="h-10 w-10 mb-3" style={{ color: "hsl(216 45% 25%)" }} />
              <p className="text-sm" style={{ color: "hsl(215 25% 45%)" }}>Select a contact to view details</p>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <ContactForm
          initial={editContact || undefined}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditContact(null); }}
        />
      )}
    </div>
  );
}
