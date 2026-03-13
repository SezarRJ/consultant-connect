import { useState, useMemo, useRef } from "react";
import {
  Users, Plus, Search, Phone, Mail, MapPin, Building2, TrendingUp,
  DollarSign, Star, Filter, ArrowRight, Tag, Clock,
  CheckCircle2, X, FileBarChart2, Activity, Target,
  MessageSquare, ChevronDown, Edit3, Trash2, MoreHorizontal,
  BarChart2, Handshake, AlertTriangle, RefreshCw, Calendar
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";

// ─── Types ─────────────────────────────────────────────────────────────────
type ContactType   = "Client" | "Prospect" | "Distributor" | "Partner" | "Lead";
type DealStage     = "New Lead" | "Qualified" | "Proposal Sent" | "Negotiation" | "Won" | "Lost";
type ActivityKind  = "Call" | "Email" | "Meeting" | "Note" | "Task";
type CRMTab        = "contacts" | "pipeline" | "deals" | "activities";

interface Contact {
  id: string; name: string; company: string; role: string;
  type: ContactType; city: string; country: string;
  phone: string; email: string; rating: number;
  tags: string[]; linkedService?: string; notes: string;
  lastContact: string; dealValue: string; status: "Active" | "Inactive";
  createdAt: string;
}

interface Deal {
  id: string; title: string; contactId: string; contactName: string;
  company: string; stage: DealStage; value: number;
  probability: number; closeDate: string; product: string;
  city: string; agentUsed: string; notes: string; createdAt: string;
}

interface CRMActivity {
  id: string; kind: ActivityKind; contactId: string; contactName: string;
  subject: string; notes: string; date: string; done: boolean;
}

// ─── Seed data ──────────────────────────────────────────────────────────────
const CONTACTS_SEED: Contact[] = [
  { id:"c1", name:"Ahmad Al-Rashidi",   company:"Al-Mansour Trading Co.",   role:"CEO",                type:"Client",     city:"Baghdad",       country:"Iraq",   phone:"+964 770 123 4567", email:"ahmad@almansour.iq",    rating:5, tags:["FMCG","Distribution"],   linkedService:"distributor-finder",    notes:"Key central Iraq partner since 2024. Handles 40+ stores.",              lastContact:"2026-03-10", dealValue:"$450,000", status:"Active", createdAt:"2024-06-01" },
  { id:"c2", name:"Karwan Barzani",     company:"Erbil Distribution Ltd.",   role:"Managing Director",  type:"Distributor",city:"Erbil",         country:"Iraq",   phone:"+964 750 987 6543", email:"karwan@erbil-dist.com", rating:5, tags:["KRG","Cold Chain"],      linkedService:"partner-matchmaking",   notes:"Top-tier KRG distributor. Covers Erbil, Duhok, Sulaymaniyah.",         lastContact:"2026-03-12", dealValue:"$320,000", status:"Active", createdAt:"2024-08-15" },
  { id:"c3", name:"Sara Mahmoud",       company:"TechBridge FZCO",           role:"Trade Director",     type:"Client",     city:"Dubai",         country:"UAE",    phone:"+971 50 234 5678",  email:"sara@techbridge.ae",    rating:4, tags:["Electronics","B2B"],     linkedService:"market-entry",          notes:"UAE exporter targeting Iraq electronics market. Feasibility done.",     lastContact:"2026-03-08", dealValue:"$180,000", status:"Active", createdAt:"2025-01-10" },
  { id:"c4", name:"Hassan Al-Basri",    company:"Gulf Exports Ltd.",          role:"Export Manager",     type:"Partner",    city:"Basra",         country:"Iraq",   phone:"+964 780 456 7890", email:"hassan@gulfexports.iq", rating:4, tags:["Logistics","Port"],      linkedService:"risk-assessment",       notes:"Port of Basra specialist. Critical for all sea freight.",               lastContact:"2026-03-05", dealValue:"$95,000",  status:"Active", createdAt:"2024-11-20" },
  { id:"c5", name:"Noor Al-Khatib",     company:"Sham Foods Syria",           role:"Export Director",    type:"Prospect",   city:"Damascus",      country:"Syria",  phone:"+963 11 234 567",   email:"noor@shamfoods.sy",     rating:3, tags:["Food","Packaged"],       linkedService:"feasibility-study",     notes:"Exploring Iraq entry for packaged foods. Initial meeting done.",        lastContact:"2026-03-01", dealValue:"$75,000",  status:"Active", createdAt:"2026-02-15" },
  { id:"c6", name:"Youssef Khalid",     company:"Jordan FMCG Group",          role:"Regional Manager",   type:"Lead",       city:"Amman",         country:"Jordan", phone:"+962 79 345 6789",  email:"youssef@jfmcg.jo",      rating:3, tags:["FMCG","Retail"],         linkedService:"distributor-finder",    notes:"Referred by Ahmad. Interested in Baghdad modern trade channels.",       lastContact:"2026-02-28", dealValue:"$60,000",  status:"Active", createdAt:"2026-02-28" },
  { id:"c7", name:"Maria Petrov",       company:"Turk Plastik A.Ş.",         role:"Sales Director",     type:"Prospect",   city:"Istanbul",      country:"Turkey", phone:"+90 212 345 6789",  email:"maria@turkplastik.tr",  rating:4, tags:["Manufacturing","B2B"],   linkedService:"export-readiness",      notes:"Turkish plastics manufacturer. Arabic packaging compliance needed.",    lastContact:"2026-03-07", dealValue:"$120,000", status:"Active", createdAt:"2025-12-01" },
  { id:"c8", name:"Omar Al-Sulaimani",  company:"Sulaimani Wholesale Market", role:"Owner",              type:"Distributor",city:"Sulaymaniyah",  country:"Iraq",   phone:"+964 770 678 9012", email:"omar@swm.iq",           rating:4, tags:["Wholesale","KRG"],       linkedService:"distributor-finder",    notes:"Controls majority of Sulaymaniyah wholesale trade. Key KRG contact.",  lastContact:"2026-03-03", dealValue:"$210,000", status:"Active", createdAt:"2024-09-05" },
  { id:"c9", name:"Lena Schreiber",     company:"Pfalz Beverages GmbH",       role:"Export Manager",     type:"Prospect",   city:"Frankfurt",     country:"Germany",phone:"+49 69 1234 5678",  email:"lena@pfalzbev.de",      rating:3, tags:["Beverages","Premium"],   linkedService:"market-entry",          notes:"German premium juice brand. Exploring premium Gulf+Iraq segment.",      lastContact:"2026-02-20", dealValue:"$90,000",  status:"Active", createdAt:"2026-01-15" },
  { id:"c10",name:"Ali Hassan Najaf",   company:"Najaf Traders Co.",          role:"Director",           type:"Client",     city:"Najaf",         country:"Iraq",   phone:"+964 780 234 5678", email:"ali@najaftraders.iq",   rating:4, tags:["Religious Tourism","Retail"],linkedService:"sales-strategy",      notes:"Najaf-based retailer. Huge religious tourism market. 8 branches.",     lastContact:"2026-03-09", dealValue:"$155,000", status:"Active", createdAt:"2025-03-20" },
];

const DEALS_SEED: Deal[] = [
  { id:"d1", title:"FMCG Distribution — Baghdad 2026",      contactId:"c1",  contactName:"Ahmad Al-Rashidi",  company:"Al-Mansour Trading",    stage:"Negotiation",   value:450000, probability:75,  closeDate:"2026-04-30", product:"Distribution Contract",     city:"Baghdad",       agentUsed:"Distributor Agent",          notes:"Term sheet shared. Awaiting counter-offer on exclusivity clause.",    createdAt:"2026-01-15" },
  { id:"d2", title:"KRG Cold Chain Network Setup",           contactId:"c2",  contactName:"Karwan Barzani",    company:"Erbil Distribution",    stage:"Proposal Sent", value:320000, probability:60,  closeDate:"2026-05-15", product:"Cold Chain Partnership",     city:"Erbil",         agentUsed:"Partner Matchmaking Agent",  notes:"Proposal sent 2 weeks ago. Follow up call scheduled for next week.",  createdAt:"2026-02-01" },
  { id:"d3", title:"Electronics Import — Iraq Market",       contactId:"c3",  contactName:"Sara Mahmoud",      company:"TechBridge FZCO",       stage:"Qualified",     value:180000, probability:45,  closeDate:"2026-06-01", product:"Market Entry Study",         city:"Baghdad",       agentUsed:"Market Entry Agent",         notes:"Full market analysis complete. Pricing study in progress.",           createdAt:"2026-02-20" },
  { id:"d4", title:"Basra Port Logistics Partnership",       contactId:"c4",  contactName:"Hassan Al-Basri",   company:"Gulf Exports Ltd.",     stage:"Won",           value:95000,  probability:100, closeDate:"2026-03-01", product:"Logistics Partnership",      city:"Basra",         agentUsed:"Risk Assessment Agent",      notes:"Contract signed March 2026. Operational from April.",                 createdAt:"2026-01-10" },
  { id:"d5", title:"Syria Food Export — Iraq Entry",         contactId:"c5",  contactName:"Noor Al-Khatib",   company:"Sham Foods Syria",      stage:"New Lead",      value:75000,  probability:20,  closeDate:"2026-07-01", product:"Feasibility Study",          city:"Baghdad",       agentUsed:"Feasibility Study Agent",    notes:"Initial interest. Full feasibility study scope needed.",              createdAt:"2026-03-01" },
  { id:"d6", title:"Jordan FMCG — Baghdad Modern Trade",     contactId:"c6",  contactName:"Youssef Khalid",   company:"Jordan FMCG Group",     stage:"Qualified",     value:60000,  probability:35,  closeDate:"2026-06-15", product:"Distributor Matchmaking",    city:"Baghdad",       agentUsed:"Distributor Agent",          notes:"Screening complete. 3 distributor options identified.",               createdAt:"2026-02-28" },
  { id:"d7", title:"Turkish Plastics — Export Compliance",   contactId:"c7",  contactName:"Maria Petrov",      company:"Turk Plastik",          stage:"Proposal Sent", value:120000, probability:55,  closeDate:"2026-05-30", product:"Export Readiness Check",     city:"Istanbul",      agentUsed:"Export Readiness Agent",     notes:"Arabic labeling compliance proposal submitted. Awaiting review.",     createdAt:"2026-02-10" },
  { id:"d8", title:"Sulaymaniyah Wholesale Distribution",    contactId:"c8",  contactName:"Omar Al-Sulaimani", company:"Sulaimani Wholesale",   stage:"Negotiation",   value:210000, probability:70,  closeDate:"2026-04-15", product:"Wholesale Distribution",     city:"Sulaymaniyah",  agentUsed:"Distributor Agent",          notes:"Price negotiation ongoing. Close to final agreement.",                createdAt:"2026-01-25" },
  { id:"d9", title:"German Premium Juice — Gulf+Iraq",       contactId:"c9",  contactName:"Lena Schreiber",    company:"Pfalz Beverages",       stage:"New Lead",      value:90000,  probability:15,  closeDate:"2026-08-01", product:"Market Entry Analysis",      city:"Baghdad",       agentUsed:"Market Entry Agent",         notes:"Premium segment opportunity. Competitor analysis ordered.",           createdAt:"2026-02-10" },
  { id:"d10",title:"Najaf Retail Expansion Strategy",        contactId:"c10", contactName:"Ali Hassan Najaf",  company:"Najaf Traders Co.",     stage:"Won",           value:155000, probability:100, closeDate:"2026-02-28", product:"Sales Strategy Plan",        city:"Najaf",         agentUsed:"Sales Strategy Agent",       notes:"Strategy delivered and approved. Implementation starting Q2.",        createdAt:"2025-12-15" },
];

const ACTIVITIES_SEED: CRMActivity[] = [
  { id:"a1", kind:"Call",    contactId:"c1",  contactName:"Ahmad Al-Rashidi",  subject:"Q2 targets review call",              notes:"Discussed expanding into Mosul territory. Wants exclusivity.",         date:"2026-03-12", done:true  },
  { id:"a2", kind:"Meeting", contactId:"c2",  contactName:"Karwan Barzani",    subject:"Cold chain warehouse visit in Erbil",  notes:"Toured facility. 500 pallet capacity. Cold storage excellent.",        date:"2026-03-11", done:true  },
  { id:"a3", kind:"Email",   contactId:"c3",  contactName:"Sara Mahmoud",      subject:"Send Iraq electronics pricing report", notes:"Updated Iraq electronics pricing report with Q1 2026 data.",          date:"2026-03-10", done:true  },
  { id:"a4", kind:"Task",    contactId:"c5",  contactName:"Noor Al-Khatib",    subject:"Prepare feasibility study proposal",   notes:"Draft full scope for Syrian food FMCG Iraq entry study.",              date:"2026-03-15", done:false },
  { id:"a5", kind:"Call",    contactId:"c6",  contactName:"Youssef Khalid",    subject:"Present distributor shortlist",        notes:"3 Baghdad distributor options. Present comparison matrix.",            date:"2026-03-14", done:false },
  { id:"a6", kind:"Meeting", contactId:"c7",  contactName:"Maria Petrov",      subject:"Arabic labeling compliance review",    notes:"Review label requirements with their design team in Istanbul.",        date:"2026-03-18", done:false },
  { id:"a7", kind:"Note",    contactId:"c4",  contactName:"Hassan Al-Basri",   subject:"Contract signed — onboarding starts",  notes:"Logistics partnership signed. Starting operations April 1, 2026.",     date:"2026-03-01", done:true  },
  { id:"a8", kind:"Email",   contactId:"c8",  contactName:"Omar Al-Sulaimani", subject:"Revised commercial terms",             notes:"Adjusted margin structure from 18% to 22%. Ball in his court.",        date:"2026-03-09", done:true  },
  { id:"a9", kind:"Task",    contactId:"c9",  contactName:"Lena Schreiber",    subject:"Send competitor analysis for juices",  notes:"Run competitor analysis for premium beverage segment in Iraq.",        date:"2026-03-20", done:false },
  { id:"a10",kind:"Call",    contactId:"c10", contactName:"Ali Hassan Najaf",  subject:"Sales strategy implementation check",  notes:"Check Q1 implementation progress on the Najaf retail strategy.",       date:"2026-03-22", done:false },
];

// ─── Style maps ─────────────────────────────────────────────────────────────
const STAGES: DealStage[] = ["New Lead","Qualified","Proposal Sent","Negotiation","Won","Lost"];

const stageStyle: Record<DealStage, { bg: string; text: string; border: string }> = {
  "New Lead":      { bg:"hsl(215 25% 18%)",        text:"hsl(215 25% 70%)",   border:"hsl(var(--border))" },
  "Qualified":     { bg:"hsl(217 91% 53% / 0.12)", text:"hsl(217 91% 72%)",   border:"hsl(217 91% 53% / 0.35)" },
  "Proposal Sent": { bg:"hsl(38 95% 52% / 0.12)",  text:"hsl(38 95% 62%)",    border:"hsl(38 95% 52% / 0.35)" },
  "Negotiation":   { bg:"hsl(280 60% 55% / 0.12)", text:"hsl(280 60% 74%)",   border:"hsl(280 60% 55% / 0.35)" },
  "Won":           { bg:"hsl(158 64% 40% / 0.12)", text:"hsl(158 64% 58%)",   border:"hsl(158 64% 40% / 0.35)" },
  "Lost":          { bg:"hsl(0 72% 51% / 0.12)",   text:"hsl(0 72% 68%)",     border:"hsl(0 72% 51% / 0.35)" },
};

const typeStyle: Record<ContactType, string> = {
  Client:"data-pill-green", Prospect:"data-pill-blue",
  Distributor:"data-pill-amber", Partner:"data-pill-muted", Lead:"data-pill-red",
};

const actIcon: Record<ActivityKind, string> = { Call:"📞", Email:"✉️", Meeting:"🤝", Note:"📝", Task:"✅" };

const SERVICE_MAP: Record<string, { label: string; url: string }> = {
  "market-entry":       { label:"Market Entry",       url:"/market-entry" },
  "distributor-finder": { label:"Distributor Finder", url:"/distributor-finder" },
  "competitor-analysis":{ label:"Competitor Analysis",url:"/competitor-analysis" },
  "pricing-intelligence":{ label:"Pricing Intelligence",url:"/pricing-intelligence" },
  "risk-assessment":    { label:"Risk Assessment",    url:"/risk-assessment" },
  "partner-matchmaking":{ label:"Partner Matchmaking",url:"/partner-matchmaking" },
  "sales-strategy":     { label:"Sales Strategy",     url:"/sales-strategy" },
  "export-readiness":   { label:"Export Readiness",   url:"/export-readiness" },
  "feasibility-study":  { label:"Feasibility Study",  url:"/feasibility-study" },
};

// ─── Sub-components ──────────────────────────────────────────────────────────
function KPI({ label, value, sub, color }: { label:string; value:string; sub:string; color:"amber"|"green"|"blue"|"red" }) {
  const c = { amber:"hsl(38 95% 60%)", green:"hsl(158 64% 55%)", blue:"hsl(217 91% 70%)", red:"hsl(0 72% 68%)" }[color];
  return (
    <div className="rounded-xl p-4" style={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))" }}>
      <p className="section-label">{label}</p>
      <p className="text-2xl font-bold font-mono-data mt-1" style={{ color }}>{value}</p>
      <p className="text-xs mt-0.5" style={{ color:"hsl(215 25% 50%)" }}>{sub}</p>
    </div>
  );
}

function StageBadge({ stage }: { stage: DealStage }) {
  const s = stageStyle[stage];
  return <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background:s.bg, color:s.text, border:`1px solid ${s.border}` }}>{stage}</span>;
}

function ContactCard({ contact, onClick }: { contact: Contact; onClick: () => void }) {
  return (
    <div onClick={onClick} className="rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.01]"
      style={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))" }}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
            style={{ background:"hsl(38 95% 52% / 0.12)", color:"hsl(38 95% 60%)" }}>
            {contact.name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight" style={{ color:"hsl(210 40% 90%)" }}>{contact.name}</p>
            <p className="text-xs" style={{ color:"hsl(215 25% 55%)" }}>{contact.role}</p>
          </div>
        </div>
        <span className={typeStyle[contact.type]} style={{ fontSize:"10px" }}>{contact.type}</span>
      </div>
      <p className="text-xs mb-2 flex items-center gap-1" style={{ color:"hsl(215 25% 68%)" }}>
        <Building2 className="h-3 w-3 shrink-0" />{contact.company}
      </p>
      <div className="flex items-center gap-3 text-xs mb-3">
        <span className="flex items-center gap-1" style={{ color:"hsl(215 25% 55%)" }}>
          <MapPin className="h-3 w-3" />{contact.city}
        </span>
        <span className="font-mono-data font-semibold" style={{ color:"hsl(38 95% 60%)" }}>{contact.dealValue}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-1 flex-wrap">
          {contact.tags.slice(0,2).map(t => <span key={t} className="data-pill-muted" style={{ fontSize:"10px" }}>{t}</span>)}
          {contact.tags.length > 2 && <span className="data-pill-muted" style={{ fontSize:"10px" }}>+{contact.tags.length-2}</span>}
        </div>
        {contact.linkedService && SERVICE_MAP[contact.linkedService] && (
          <span className="text-[10px] flex items-center gap-0.5" style={{ color:"hsl(38 95% 52%)" }}>
            <Target className="h-2.5 w-2.5" />{SERVICE_MAP[contact.linkedService].label.split(" ")[0]}
          </span>
        )}
      </div>
      <div className="mt-3 pt-2.5 border-t flex items-center justify-between text-xs" style={{ borderColor:"hsl(var(--border))" }}>
        <span className="flex items-center gap-1" style={{ color:"hsl(215 25% 48%)" }}><Clock className="h-3 w-3" />{contact.lastContact}</span>
        <span>{"⭐".repeat(contact.rating)}</span>
      </div>
    </div>
  );
}

function ContactModal({ contact, onClose }: { contact: Contact; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background:"rgba(0,0,0,0.75)" }} onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl overflow-hidden" style={{ background:"hsl(216 52% 10%)", border:"1px solid hsl(var(--border))" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between p-5 border-b" style={{ borderColor:"hsl(var(--border))" }}>
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full flex items-center justify-center text-base font-bold" style={{ background:"hsl(38 95% 52% / 0.15)", color:"hsl(38 95% 60%)" }}>
              {contact.name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-base font-bold font-display" style={{ color:"hsl(210 40% 92%)" }}>{contact.name}</h2>
              <p className="text-xs" style={{ color:"hsl(215 25% 55%)" }}>{contact.role} · {contact.company}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 transition">
            <X className="h-4 w-4" style={{ color:"hsl(215 25% 55%)" }} />
          </button>
        </div>
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="flex flex-wrap gap-2">
            <span className={typeStyle[contact.type]}>{contact.type}</span>
            <span className={contact.status === "Active" ? "data-pill-green" : "data-pill-red"} style={{ fontSize:"10px" }}>{contact.status}</span>
            {contact.tags.map(t => <span key={t} className="data-pill-muted">{t}</span>)}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              [<Phone className="h-3.5 w-3.5" />, contact.phone],
              [<Mail className="h-3.5 w-3.5" />, contact.email],
              [<MapPin className="h-3.5 w-3.5" />, `${contact.city}, ${contact.country}`],
              [<DollarSign className="h-3.5 w-3.5" />, contact.dealValue],
            ].map(([icon, val], i) => (
              <div key={i} className="flex items-center gap-2 text-sm" style={{ color:"hsl(215 25% 65%)" }}>
                <span style={{ color:"hsl(38 95% 52%)" }}>{icon as React.ReactNode}</span>
                <span className="truncate">{val as string}</span>
              </div>
            ))}
          </div>
          {contact.notes && (
            <div className="rounded-lg p-3" style={{ background:"hsl(216 45% 13%)" }}>
              <p className="text-xs font-semibold mb-1" style={{ color:"hsl(215 25% 50%)" }}>Notes</p>
              <p className="text-sm leading-relaxed" style={{ color:"hsl(215 25% 68%)" }}>{contact.notes}</p>
            </div>
          )}
          {contact.linkedService && SERVICE_MAP[contact.linkedService] && (
            <Link to={SERVICE_MAP[contact.linkedService].url}
              className="flex items-center justify-between p-3 rounded-xl hover:opacity-90 transition"
              style={{ background:"hsl(38 95% 52% / 0.08)", border:"1px solid hsl(38 95% 52% / 0.25)" }}>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" style={{ color:"hsl(38 95% 60%)" }} />
                <span className="text-sm font-medium" style={{ color:"hsl(38 95% 60%)" }}>
                  Open in {SERVICE_MAP[contact.linkedService].label}
                </span>
              </div>
              <ArrowRight className="h-4 w-4" style={{ color:"hsl(38 95% 60%)" }} />
            </Link>
          )}
          <p className="text-xs" style={{ color:"hsl(215 25% 45%)" }}>
            Last contacted: {contact.lastContact} · Added: {contact.createdAt}
          </p>
        </div>
      </div>
    </div>
  );
}

function AddContactModal({ onAdd, onClose }: { onAdd: (c: Contact) => void; onClose: () => void }) {
  const blank = { name:"", company:"", role:"", type:"Prospect" as ContactType, city:"", country:"Iraq", phone:"", email:"", tags:"", linkedService:"", notes:"" };
  const [f, setF] = useState(blank);
  const save = () => {
    if (!f.name.trim() || !f.company.trim()) { toast.error("Name and company are required"); return; }
    const newC: Contact = { ...f, id:`c${Date.now()}`, tags: f.tags ? f.tags.split(",").map(t=>t.trim()).filter(Boolean) : [], rating:3, dealValue:"$0", status:"Active", lastContact: new Date().toISOString().split("T")[0], createdAt: new Date().toISOString().split("T")[0] };
    onAdd(newC); toast.success(`${f.name} added to CRM`); onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background:"rgba(0,0,0,0.75)" }} onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl" style={{ background:"hsl(216 52% 10%)", border:"1px solid hsl(var(--border))" }} onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor:"hsl(var(--border))" }}>
          <h2 className="text-base font-bold font-display" style={{ color:"hsl(210 40% 92%)" }}>Add New Contact</h2>
          <button onClick={onClose}><X className="h-4 w-4" style={{ color:"hsl(215 25% 55%)" }} /></button>
        </div>
        <div className="p-5 grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
          {[
            { label:"Full Name *", key:"name", span:2 }, { label:"Company *", key:"company" }, { label:"Role / Title", key:"role" },
            { label:"City", key:"city" }, { label:"Country", key:"country" },
            { label:"Phone", key:"phone" }, { label:"Email", key:"email" },
            { label:"Tags (comma separated)", key:"tags", span:2 }, { label:"Notes", key:"notes", span:2 },
          ].map(({ label, key, span }) => (
            <div key={key} className={span === 2 ? "col-span-2" : ""}>
              <label className="section-label">{label}</label>
              <input className="w-full mt-1 px-3 py-2 rounded-lg text-sm" value={(f as any)[key]}
                onChange={e => setF(p=>({...p,[key]:e.target.value}))}
                style={{ background:"hsl(216 45% 14%)", border:"1px solid hsl(var(--border))", color:"hsl(210 40% 85%)" }} />
            </div>
          ))}
          <div>
            <label className="section-label">Contact Type</label>
            <select className="w-full mt-1 px-3 py-2 rounded-lg text-sm" value={f.type}
              onChange={e => setF(p=>({...p,type:e.target.value as ContactType}))}
              style={{ background:"hsl(216 45% 14%)", border:"1px solid hsl(var(--border))", color:"hsl(210 40% 85%)" }}>
              {(["Client","Prospect","Distributor","Partner","Lead"] as ContactType[]).map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="section-label">Linked Service</label>
            <select className="w-full mt-1 px-3 py-2 rounded-lg text-sm" value={f.linkedService}
              onChange={e => setF(p=>({...p,linkedService:e.target.value}))}
              style={{ background:"hsl(216 45% 14%)", border:"1px solid hsl(var(--border))", color:"hsl(210 40% 85%)" }}>
              <option value="">— None —</option>
              {Object.entries(SERVICE_MAP).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-3 p-5 pt-0">
          <button onClick={save} className="flex-1 py-2.5 rounded-xl text-sm font-semibold" style={{ background:"hsl(38 95% 52%)", color:"hsl(216 58% 6%)" }}>Add Contact</button>
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold" style={{ background:"hsl(216 45% 18%)", color:"hsl(215 25% 65%)", border:"1px solid hsl(var(--border))" }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ───────────────────────────────────────────────────────────────────
export default function CRM() {
  const { t } = useI18n();
  const [tab, setTab] = useState<CRMTab>("contacts");
  const [contacts, setContacts] = useState<Contact[]>(CONTACTS_SEED);
  const [deals, setDeals]       = useState<Deal[]>(DEALS_SEED);
  const [activities, setActivities] = useState<CRMActivity[]>(ACTIVITIES_SEED);
  const [search, setSearch]     = useState("");
  const [typeFilter, setTypeFilter] = useState<ContactType | "All">("All");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showAdd, setShowAdd]   = useState(false);
  const [actFilter, setActFilter] = useState<"all"|"pending"|"done">("all");

  // ── Stats ──────────────────────────────────────────────────────────────────
  const activePipeline = useMemo(() => deals.filter(d=>!["Won","Lost"].includes(d.stage)).reduce((s,d)=>s+d.value,0), [deals]);
  const wonTotal        = useMemo(() => deals.filter(d=>d.stage==="Won").reduce((s,d)=>s+d.value,0), [deals]);
  const openDeals       = deals.filter(d=>!["Won","Lost"].includes(d.stage));
  const pendingActs     = activities.filter(a=>!a.done);

  // ── Filtered contacts ─────────────────────────────────────────────────────
  const filteredContacts = contacts.filter(c =>
    (typeFilter==="All" || c.type===typeFilter) &&
    (c.name.toLowerCase().includes(search.toLowerCase()) ||
     c.company.toLowerCase().includes(search.toLowerCase()) ||
     c.city.toLowerCase().includes(search.toLowerCase()))
  );

  // ── Filtered activities ───────────────────────────────────────────────────
  const filteredActs = activities.filter(a =>
    actFilter==="all" ? true : actFilter==="pending" ? !a.done : a.done
  );

  // ── Pipeline helpers ──────────────────────────────────────────────────────
  const stageDeals   = (s: DealStage) => deals.filter(d=>d.stage===s);
  const stageVal     = (s: DealStage) => stageDeals(s).reduce((t,d)=>t+d.value,0);

  const moveDeal = (dealId: string, dir: "forward"|"back") => {
    setDeals(prev => prev.map(d => {
      if (d.id !== dealId) return d;
      const idx  = STAGES.indexOf(d.stage);
      const next = dir==="forward" ? STAGES[Math.min(idx+1, STAGES.length-1)] : STAGES[Math.max(idx-1, 0)];
      toast.success(`Moved to "${next}"`);
      return { ...d, stage: next };
    }));
  };

  const toggleAct = (id: string) =>
    setActivities(prev => prev.map(a => a.id===id ? {...a, done:!a.done} : a));

  const deleteContact = (id: string) => {
    setContacts(prev=>prev.filter(c=>c.id!==id));
    toast.success("Contact removed");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-5 w-5" style={{ color:"hsl(38 95% 52%)" }} />
            <h1 className="text-xl font-bold font-display" style={{ color:"hsl(210 40% 92%)" }}>CRM — Relationship Manager</h1>
          </div>
          <p className="text-sm" style={{ color:"hsl(215 25% 55%)" }}>Contacts · Deals pipeline · Activities — linked to Iraq advisory services</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background:"hsl(38 95% 52%)", color:"hsl(216 58% 6%)" }}>
          <Plus className="h-4 w-4" /> Add Contact
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPI label="Total Contacts"    value={String(contacts.length)}                               sub={`${contacts.filter(c=>c.status==="Active").length} active`} color="amber" />
        <KPI label="Active Pipeline"   value={`$${(activePipeline/1000).toFixed(0)}K`}               sub={`${openDeals.length} open deals`}                           color="green" />
        <KPI label="Won Revenue"       value={`$${(wonTotal/1000).toFixed(0)}K`}                     sub={`${deals.filter(d=>d.stage==="Won").length} deals closed`}  color="blue"  />
        <KPI label="Pending Follow-ups"value={String(pendingActs.length)}                             sub="activities due"                                             color="red"   />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background:"hsl(216 45% 12%)" }}>
        {([
          { key:"contacts",   label:"Contacts",    icon:Users       },
          { key:"pipeline",   label:"Pipeline",    icon:TrendingUp  },
          { key:"deals",      label:"All Deals",   icon:DollarSign  },
          { key:"activities", label:"Activities",  icon:Activity    },
        ] as { key:CRMTab; label:string; icon:any }[]).map(({ key, label, icon:Icon }) => (
          <button key={key} onClick={()=>setTab(key)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap"
            style={{ background:tab===key?"hsl(38 95% 52%)":"transparent", color:tab===key?"hsl(216 58% 6%)":"hsl(215 25% 60%)" }}>
            <Icon className="h-3.5 w-3.5" />{label}
          </button>
        ))}
      </div>

      {/* ── CONTACTS TAB ─────────────────────────────────────────────────────── */}
      {tab==="contacts" && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color:"hsl(215 25% 45%)" }} />
              <input className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm"
                style={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))", color:"hsl(210 40% 85%)" }}
                placeholder="Search by name, company, city..." value={search}
                onChange={e=>setSearch(e.target.value)} />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {(["All","Client","Prospect","Distributor","Partner","Lead"] as (ContactType|"All")[]).map(t => (
                <button key={t} onClick={()=>setTypeFilter(t)}
                  className="px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                  style={{ background:typeFilter===t?"hsl(38 95% 52%)":"hsl(216 45% 15%)", color:typeFilter===t?"hsl(216 58% 6%)":"hsl(215 25% 65%)", border:"1px solid hsl(var(--border))" }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredContacts.map(c => <ContactCard key={c.id} contact={c} onClick={()=>setSelectedContact(c)} />)}
            {filteredContacts.length === 0 && (
              <div className="col-span-3 rounded-xl p-10 text-center" style={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))" }}>
                <Users className="h-8 w-8 mx-auto mb-3" style={{ color:"hsl(215 25% 35%)" }} />
                <p className="text-sm" style={{ color:"hsl(215 25% 50%)" }}>No contacts match this filter</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── PIPELINE TAB (Kanban) ─────────────────────────────────────────────── */}
      {tab==="pipeline" && (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-3 min-w-max">
            {STAGES.map(stage => {
              const s   = stageStyle[stage];
              const col = stageDeals(stage);
              return (
                <div key={stage} className="w-60 flex-shrink-0">
                  {/* Column header */}
                  <div className="rounded-xl p-3 mb-3" style={{ background:s.bg, border:`1px solid ${s.border}` }}>
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold" style={{ color:s.text }}>{stage}</p>
                      <span className="flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold"
                        style={{ background:s.bg, color:s.text, border:`1px solid ${s.border}` }}>{col.length}</span>
                    </div>
                    <p className="text-[10px] font-mono-data mt-0.5" style={{ color:s.text }}>
                      ${(stageVal(stage)/1000).toFixed(0)}K total
                    </p>
                  </div>
                  {/* Cards */}
                  <div className="space-y-2">
                    {col.map(deal => (
                      <div key={deal.id} className="rounded-xl p-3 group"
                        style={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))" }}>
                        <p className="text-xs font-semibold mb-1 leading-tight" style={{ color:"hsl(210 40% 90%)" }}>{deal.title}</p>
                        <p className="text-[10px] mb-2 flex items-center gap-1" style={{ color:"hsl(215 25% 55%)" }}>
                          <Building2 className="h-2.5 w-2.5" />{deal.company}
                        </p>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono-data text-sm font-bold" style={{ color:"hsl(38 95% 60%)" }}>
                            ${(deal.value/1000).toFixed(0)}K
                          </span>
                          <span className="text-[10px]" style={{ color:"hsl(215 25% 50%)" }}>{deal.probability}%</span>
                        </div>
                        <div className="w-full h-1 rounded-full mb-2" style={{ background:"hsl(216 45% 22%)" }}>
                          <div className="h-full rounded-full transition-all" style={{ width:`${deal.probability}%`, background: stage==="Won"?"hsl(158 64% 45%)":stage==="Lost"?"hsl(0 72% 55%)":"hsl(38 95% 52%)" }} />
                        </div>
                        <p className="text-[10px] mb-2" style={{ color:"hsl(215 25% 46%)" }}>
                          📍{deal.city} · 📅{deal.closeDate}
                        </p>
                        <p className="text-[10px] mb-2 truncate" style={{ color:"hsl(215 25% 48%)" }}>🤖 {deal.agentUsed}</p>
                        {/* Move buttons */}
                        {stage !== "Won" && stage !== "Lost" && (
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                            {stage !== "New Lead" && (
                              <button onClick={()=>moveDeal(deal.id,"back")}
                                className="flex-1 py-1 rounded text-[10px] font-medium transition-all"
                                style={{ background:"hsl(216 45% 18%)", color:"hsl(215 25% 60%)" }}>← Back</button>
                            )}
                            <button onClick={()=>moveDeal(deal.id,"forward")}
                              className="flex-1 py-1 rounded text-[10px] font-medium transition-all"
                              style={{ background:"hsl(38 95% 52% / 0.15)", color:"hsl(38 95% 62%)" }}>Next →</button>
                          </div>
                        )}
                      </div>
                    ))}
                    {col.length===0 && (
                      <div className="rounded-xl p-4 text-center border-2 border-dashed" style={{ borderColor:"hsl(var(--border))" }}>
                        <p className="text-[11px]" style={{ color:"hsl(215 25% 38%)" }}>No deals here</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── DEALS TABLE ──────────────────────────────────────────────────────── */}
      {tab==="deals" && (
        <div className="rounded-xl overflow-hidden" style={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))" }}>
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor:"hsl(var(--border))" }}>
            <h2 className="text-sm font-bold font-display" style={{ color:"hsl(210 40% 88%)" }}>All Deals ({deals.length})</h2>
            <div className="flex gap-2">
              <span className="data-pill-green">{deals.filter(d=>d.stage==="Won").length} Won</span>
              <span className="data-pill-amber">${(activePipeline/1000).toFixed(0)}K Active</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom:"1px solid hsl(var(--border))" }}>
                  {["Deal","Contact","Stage","Value","Probability","Close Date","City","Agent Used"].map(h=>(
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color:"hsl(215 25% 50%)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {deals.map((d,i) => (
                  <tr key={d.id} className="hover:bg-white/[0.02] transition-colors" style={{ borderBottom: i<deals.length-1?"1px solid hsl(var(--border))":"none" }}>
                    <td className="px-4 py-3">
                      <p className="text-xs font-semibold whitespace-nowrap" style={{ color:"hsl(210 40% 88%)" }}>{d.title}</p>
                      <p className="text-[10px]" style={{ color:"hsl(215 25% 50%)" }}>{d.product}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="text-xs font-medium" style={{ color:"hsl(210 40% 80%)" }}>{d.contactName}</p>
                      <p className="text-[10px]" style={{ color:"hsl(215 25% 50%)" }}>{d.company}</p>
                    </td>
                    <td className="px-4 py-3"><StageBadge stage={d.stage} /></td>
                    <td className="px-4 py-3 font-mono-data font-bold text-xs whitespace-nowrap" style={{ color:"hsl(38 95% 60%)" }}>
                      ${(d.value/1000).toFixed(0)}K
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full" style={{ background:"hsl(216 45% 22%)" }}>
                          <div className="h-full rounded-full" style={{ width:`${d.probability}%`, background:"hsl(38 95% 52%)" }} />
                        </div>
                        <span className="text-xs font-mono-data whitespace-nowrap" style={{ color:"hsl(215 25% 55%)" }}>{d.probability}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color:"hsl(215 25% 60%)" }}>{d.closeDate}</td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color:"hsl(215 25% 60%)" }}>
                      <MapPin className="h-3 w-3 inline mr-0.5" />{d.city}
                    </td>
                    <td className="px-4 py-3 text-[10px] whitespace-nowrap" style={{ color:"hsl(215 25% 52%)" }}>
                      🤖 {d.agentUsed.replace(" Agent","")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── ACTIVITIES TAB ─────────────────────────────────────────────────── */}
      {tab==="activities" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5 p-1 rounded-lg w-fit" style={{ background:"hsl(216 45% 12%)" }}>
              {([["all","All"],["pending","Pending"],["done","Done"]] as [string,string][]).map(([k,l])=>(
                <button key={k} onClick={()=>setActFilter(k as any)}
                  className="px-3 py-1.5 rounded-md text-xs font-semibold transition-all"
                  style={{ background:actFilter===k?"hsl(38 95% 52%)":"transparent", color:actFilter===k?"hsl(216 58% 6%)":"hsl(215 25% 60%)" }}>
                  {l}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <span className="data-pill-amber">{pendingActs.length} pending</span>
              <span className="data-pill-green">{activities.filter(a=>a.done).length} done</span>
            </div>
          </div>

          {filteredActs.map(a => (
            <div key={a.id} className="rounded-xl p-4 flex items-start gap-4 transition-all"
              style={{ background:"hsl(var(--card))", border:`1px solid ${a.done?"hsl(var(--border))":"hsl(38 95% 52% / 0.2)"}`, opacity:a.done?0.6:1 }}>
              {/* Toggle checkbox */}
              <button onClick={()=>toggleAct(a.id)}
                className="mt-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                style={{ borderColor:a.done?"hsl(158 64% 45%)":"hsl(38 95% 52%)", background:a.done?"hsl(158 64% 45%)":"transparent" }}>
                {a.done && <CheckCircle2 className="h-3 w-3 text-white" />}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className="text-base">{actIcon[a.kind]}</span>
                  <span className="text-sm font-semibold" style={{ color:a.done?"hsl(215 25% 55%)":"hsl(210 40% 90%)" }}>{a.subject}</span>
                  <span className="data-pill-muted" style={{ fontSize:"10px" }}>{a.kind}</span>
                </div>
                <p className="text-xs mb-1 flex items-center gap-1" style={{ color:"hsl(215 25% 55%)" }}>
                  <Users className="h-3 w-3" />{a.contactName}
                </p>
                <p className="text-xs" style={{ color:"hsl(215 25% 58%)" }}>{a.notes}</p>
              </div>
              <div className="text-right shrink-0 flex flex-col items-end gap-1">
                <p className="text-xs font-mono-data" style={{ color:a.done?"hsl(215 25% 45%)":"hsl(38 95% 55%)" }}>{a.date}</p>
                <span className={a.done?"data-pill-green":"data-pill-amber"} style={{ fontSize:"10px" }}>
                  {a.done?"Done":"Pending"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {selectedContact && <ContactModal contact={selectedContact} onClose={()=>setSelectedContact(null)} />}
      {showAdd && <AddContactModal onAdd={c=>setContacts(p=>[c,...p])} onClose={()=>setShowAdd(false)} />}
    </div>
  );
}
