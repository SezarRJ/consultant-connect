/**
 * engagementStore.ts  v2
 * Central state: CRM contacts, Engagements, Output chaining
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";

// ── Types ─────────────────────────────────────────────────────────
export type LeadStatus = "New"|"Contacted"|"Qualified"|"Opportunity"|"Active Client"|"Closed Won"|"Closed Lost";
export type EngagementPhase = "Discovery"|"Analysis"|"Strategy"|"Deliverables"|"Follow-up"|"Closed";
export type EngagementStatus = "Active"|"On Hold"|"Completed"|"Cancelled";
export type HealthStatus = "On Track"|"At Risk"|"Delayed"|"Waiting on Client"|"Closed";

export interface CRMContact {
  id:string; fullName:string; jobTitle:string; email:string; phone:string;
  country:string; companyName:string; industry:string; sector:string;
  leadSource:string; interestedService:string; estimatedBudget:string;
  urgency:"High"|"Medium"|"Low"; leadStatus:LeadStatus; nextActionDate:string;
  notes:string; tags:string[];
  qualificationStatus:"Pending"|"Qualified"|"Rejected";
  qualificationNotes:string; clientNeed:string; businessProblem:string;
  decisionMaker:string; priorityLevel:"High"|"Medium"|"Low";
  engagementId:string|null; createdAt:string; updatedAt:string;
}

export interface Stakeholder {
  id:string; name:string; position:string; company:string;
  role:"Decision Maker"|"Champion"|"Influencer"|"End User"|"Gatekeeper";
  influence:"High"|"Medium"|"Low";
  stance:"Champion"|"Supporter"|"Neutral"|"Skeptic"|"Blocker";
  contactDetails:string; notes:string; nextStep:string;
}

export interface EngagementOutput {
  toolId:string; toolLabel:string; content:string;
  createdAt:string; phase:EngagementPhase;
}

export interface Engagement {
  id:string; name:string; contactId:string|null;
  clientName:string; companyName:string; industry:string; sector:string;
  market:string; serviceType:string; budget:string;
  startDate:string; endDate:string; timeline:string;
  objectives:string; scope:string; constraints:string; risks:string;
  internalNotes:string; priority:"High"|"Medium"|"Low";
  phase:EngagementPhase; status:EngagementStatus; health:HealthStatus;
  progress:number; stakeholders:Stakeholder[];
  outputs:Record<string,EngagementOutput>;
  createdAt:string; updatedAt:string;
}

// ── Sample CRM data ────────────────────────────────────────────────
const SAMPLE_CONTACTS: CRMContact[] = [
  { id:"c1", fullName:"James Mitchell", jobTitle:"VP Sales MENA", email:"j.mitchell@unilever.com",
    phone:"+964 770 100 0001", country:"Iraq", companyName:"Unilever Iraq",
    industry:"FMCG", sector:"Consumer Goods", leadSource:"Referral",
    interestedService:"Market Entry", estimatedBudget:"$42,000", urgency:"High",
    leadStatus:"Active Client", nextActionDate:"2026-04-15",
    notes:"Key relationship. Follow-on for Basra distribution.", tags:["Active Client","FMCG","Priority"],
    qualificationStatus:"Qualified", qualificationNotes:"Budget confirmed. Decision maker engaged.",
    clientNeed:"MENA distribution expansion", businessProblem:"Losing share in Southern Iraq",
    decisionMaker:"James Mitchell", priorityLevel:"High", engagementId:null,
    createdAt:"2026-01-15", updatedAt:"2026-03-18" },
  { id:"c2", fullName:"Dara Salih", jobTitle:"CEO", email:"dara@kgi.iq",
    phone:"+964 750 200 0002", country:"Iraq", companyName:"Kurdistan Group for Investment",
    industry:"Real Estate", sector:"Property Development", leadSource:"Direct",
    interestedService:"Feasibility Study", estimatedBudget:"$85,000", urgency:"High",
    leadStatus:"Opportunity", nextActionDate:"2026-04-01",
    notes:"Erbil tower project. Final report by April 30.", tags:["Real Estate","KRG","VIP"],
    qualificationStatus:"Qualified", qualificationNotes:"High-value. CEO is decision maker.",
    clientNeed:"Tower feasibility + go/no-go", businessProblem:"Need independent feasibility before board",
    decisionMaker:"Dara Salih", priorityLevel:"High", engagementId:null,
    createdAt:"2026-01-08", updatedAt:"2026-03-15" },
  { id:"c3", fullName:"Ali Kareem", jobTitle:"Head of BD", email:"a.kareem@btg.iq",
    phone:"+964 771 400 0005", country:"Iraq", companyName:"Baghdad Telecom Group",
    industry:"Telecom", sector:"B2B Telecoms", leadSource:"LinkedIn",
    interestedService:"Market Intelligence", estimatedBudget:"$18,000", urgency:"Medium",
    leadStatus:"Qualified", nextActionDate:"2026-04-10",
    notes:"B2B product line market entry.", tags:["Telecom","Warm Lead"],
    qualificationStatus:"Qualified", qualificationNotes:"Budget tight but decision fast.",
    clientNeed:"B2B market sizing", businessProblem:"Unclear opportunity for new enterprise product",
    decisionMaker:"Ali Kareem", priorityLevel:"Medium", engagementId:null,
    createdAt:"2026-02-28", updatedAt:"2026-03-08" },
  { id:"c4", fullName:"Fatima Al-Zahra", jobTitle:"Marketing Director", email:"f.alzahra@alrawdah.ae",
    phone:"+971 4 300 0006", country:"UAE", companyName:"Al Rawdah Foods",
    industry:"Food & Beverage", sector:"F&B Manufacturing", leadSource:"Event",
    interestedService:"Sales Strategy", estimatedBudget:"$22,000", urgency:"Low",
    leadStatus:"New", nextActionDate:"2026-04-20",
    notes:"Saudi Arabia expansion potential.", tags:["F&B","UAE"],
    qualificationStatus:"Pending", qualificationNotes:"", clientNeed:"Saudi market entry",
    businessProblem:"No sales channel in KSA", decisionMaker:"",
    priorityLevel:"Low", engagementId:null, createdAt:"2025-09-10", updatedAt:"2026-02-01" },
];

// ── Store ─────────────────────────────────────────────────────────
interface StoreType {
  contacts: CRMContact[];
  engagements: Engagement[];
  activeEngagementId: string | null;
  createContact: (d: Omit<CRMContact,"id"|"createdAt"|"updatedAt">) => string;
  updateContact: (id: string, p: Partial<CRMContact>) => void;
  deleteContact: (id: string) => void;
  convertToEngagement: (contactId: string) => string;
  createEngagement: (d: Omit<Engagement,"id"|"createdAt"|"updatedAt">) => string;
  updateEngagement: (id: string, p: Partial<Engagement>) => void;
  deleteEngagement: (id: string) => void;
  setActiveEngagement: (id: string|null) => void;
  getActiveEngagement: () => Engagement|null;
  addStakeholder: (engId: string, s: Omit<Stakeholder,"id">) => void;
  updateStakeholder: (engId: string, shId: string, p: Partial<Stakeholder>) => void;
  removeStakeholder: (engId: string, shId: string) => void;
  saveOutput: (engId: string, toolId: string, toolLabel: string, content: string, phase: EngagementPhase) => void;
  getOutput: (engId: string, toolId: string) => EngagementOutput|null;
  getAllOutputs: (engId: string) => EngagementOutput[];
  getOutputsByPhase: (engId: string, phase: EngagementPhase) => EngagementOutput[];
}

export const useEngagementStore = create<StoreType>()(
  persist(
    (set, get) => ({
      contacts: SAMPLE_CONTACTS,
      engagements: [],
      activeEngagementId: null,

      createContact: (d) => {
        const id = `c_${Date.now()}`;
        const now = new Date().toISOString();
        set((s) => ({ contacts: [...s.contacts, { ...d, id, createdAt:now, updatedAt:now }] }));
        return id;
      },
      updateContact: (id, p) => set((s) => ({
        contacts: s.contacts.map((c) => c.id===id ? { ...c,...p, updatedAt:new Date().toISOString() } : c)
      })),
      deleteContact: (id) => set((s) => ({ contacts: s.contacts.filter((c) => c.id!==id) })),

      convertToEngagement: (contactId) => {
        const contact = get().contacts.find((c) => c.id===contactId);
        if (!contact) return "";
        const id = `eng_${Date.now()}`;
        const now = new Date().toISOString();
        const eng: Engagement = {
          id, name:`${contact.companyName} — ${contact.interestedService}`,
          contactId, clientName:contact.fullName, companyName:contact.companyName,
          industry:contact.industry, sector:contact.sector, market:contact.country,
          serviceType:contact.interestedService, budget:contact.estimatedBudget,
          startDate:new Date().toISOString().slice(0,10), endDate:"",
          timeline:"TBD", objectives:contact.clientNeed, scope:"",
          constraints:"", risks:"", internalNotes:contact.qualificationNotes,
          priority:contact.priorityLevel, phase:"Discovery", status:"Active",
          health:"On Track", progress:0, stakeholders:[], outputs:{},
          createdAt:now, updatedAt:now,
        };
        get().updateContact(contactId, { engagementId:id, leadStatus:"Active Client" });
        set((s) => ({ engagements:[...s.engagements, eng], activeEngagementId:id }));
        return id;
      },

      createEngagement: (d) => {
        const id = `eng_${Date.now()}`;
        const now = new Date().toISOString();
        set((s) => ({ engagements:[...s.engagements, { ...d, id, createdAt:now, updatedAt:now }], activeEngagementId:id }));
        return id;
      },
      updateEngagement: (id, p) => set((s) => ({
        engagements: s.engagements.map((e) => e.id===id ? { ...e,...p, updatedAt:new Date().toISOString() } : e)
      })),
      deleteEngagement: (id) => set((s) => ({
        engagements: s.engagements.filter((e) => e.id!==id),
        activeEngagementId: s.activeEngagementId===id ? null : s.activeEngagementId,
      })),
      setActiveEngagement: (id) => set({ activeEngagementId:id }),
      getActiveEngagement: () => {
        const { engagements, activeEngagementId } = get();
        return engagements.find((e) => e.id===activeEngagementId) ?? null;
      },

      addStakeholder: (engId, s) => {
        const id = `sh_${Date.now()}`;
        set((state) => ({
          engagements: state.engagements.map((e) => e.id===engId
            ? { ...e, stakeholders:[...e.stakeholders, { ...s, id }], updatedAt:new Date().toISOString() }
            : e)
        }));
      },
      updateStakeholder: (engId, shId, p) => set((s) => ({
        engagements: s.engagements.map((e) => e.id===engId
          ? { ...e, stakeholders:e.stakeholders.map((sh) => sh.id===shId ? { ...sh,...p } : sh) }
          : e)
      })),
      removeStakeholder: (engId, shId) => set((s) => ({
        engagements: s.engagements.map((e) => e.id===engId
          ? { ...e, stakeholders:e.stakeholders.filter((sh) => sh.id!==shId) }
          : e)
      })),

      saveOutput: (engId, toolId, toolLabel, content, phase) => {
        const output: EngagementOutput = { toolId, toolLabel, content, phase, createdAt:new Date().toISOString() };
        set((s) => ({
          engagements: s.engagements.map((e) => e.id===engId
            ? { ...e, outputs:{ ...e.outputs, [toolId]:output }, updatedAt:new Date().toISOString() }
            : e)
        }));
      },
      getOutput: (engId, toolId) => {
        const eng = get().engagements.find((e) => e.id===engId);
        return eng?.outputs?.[toolId] ?? null;
      },
      getAllOutputs: (engId) => {
        const eng = get().engagements.find((e) => e.id===engId);
        return Object.values(eng?.outputs ?? {}).sort((a,b) => a.createdAt.localeCompare(b.createdAt));
      },
      getOutputsByPhase: (engId, phase) => {
        const eng = get().engagements.find((e) => e.id===engId);
        return Object.values(eng?.outputs ?? {}).filter((o) => o.phase===phase);
      },
    }),
    { name:"consultai-v2" }
  )
);

// ── Context builders ──────────────────────────────────────────────

export function buildEngagementContext(e: Engagement|null): string {
  if (!e) return "";
  return `ACTIVE ENGAGEMENT:
- Engagement: ${e.name}
- Client: ${e.clientName} (${e.companyName})
- Industry: ${e.industry} | Sector: ${e.sector}
- Market: ${e.market}
- Service: ${e.serviceType}
- Budget: ${e.budget} | Timeline: ${e.timeline}
- Phase: ${e.phase} | Health: ${e.health}
- Objectives: ${e.objectives}
- Scope: ${e.scope||"Not defined"}
- Constraints: ${e.constraints||"None"}
- Risks: ${e.risks||"Not assessed"}
- Stakeholders: ${e.stakeholders.map((s)=>`${s.name} (${s.role}, ${s.stance})`).join(", ")||"None listed"}
Always tailor your output specifically to this engagement.`;
}

export function buildPriorOutputsContext(e: Engagement|null, toolIds?: string[]): string {
  if (!e) return "";
  const all = Object.values(e.outputs);
  const filtered = toolIds ? all.filter((o) => toolIds.includes(o.toolId)) : all;
  if (!filtered.length) return "";
  return `PRIOR OUTPUTS (use as input, do not repeat):
${filtered.map((o) => `=== ${o.toolLabel} (${o.phase}) ===\n${o.content.slice(0,600)}${o.content.length>600?"…":""}`).join("\n\n")}`;
}

export function buildFullContext(e: Engagement|null, priorIds?: string[]): string {
  return [buildEngagementContext(e), buildPriorOutputsContext(e, priorIds)].filter(Boolean).join("\n\n");
}
