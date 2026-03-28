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
const SEEDED_CONTACT_ID = "c_demo";
const SEEDED_ENGAGEMENT_ID = "eng_demo";

const SAMPLE_CONTACTS: CRMContact[] = [
  { id:SEEDED_CONTACT_ID, fullName:"Razan Al-Hadithi", jobTitle:"Commercial Director", email:"razan@mesopotamiafoods.iq",
    phone:"+964 780 555 0101", country:"Iraq", companyName:"Mesopotamia Foods Co.",
    industry:"Food & Beverage", sector:"FMCG Distribution", leadSource:"Referral",
    interestedService:"Sales Strategy", estimatedBudget:"$35,000", urgency:"High",
    leadStatus:"Active Client", nextActionDate:"2026-04-05",
    notes:"Seeded test contact for AI workflow QA. Use this record to test Sales Strategy, Market Entry, Competitor Analysis, and engagement-dependent deliverables.",
    tags:["Demo","QA","FMCG","Iraq"], qualificationStatus:"Qualified",
    qualificationNotes:"Approved for internal testing. Treat as a live commercial expansion engagement.",
    clientNeed:"Expand modern trade coverage in Baghdad, Basra, and Erbil while preparing for selective GCC export opportunities.",
    businessProblem:"Low supermarket penetration, fragmented distributor coverage, and inconsistent channel strategy across Iraq.",
    decisionMaker:"Razan Al-Hadithi", priorityLevel:"High", engagementId:SEEDED_ENGAGEMENT_ID,
    createdAt:"2026-03-20", updatedAt:"2026-03-28" },
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

const SEEDED_ENGAGEMENT: Engagement = {
  id: SEEDED_ENGAGEMENT_ID,
  name: "Mesopotamia Foods — Iraq Growth Sprint",
  contactId: SEEDED_CONTACT_ID,
  clientName: "Razan Al-Hadithi",
  companyName: "Mesopotamia Foods Co.",
  industry: "Food & Beverage",
  sector: "FMCG Distribution",
  market: "Iraq",
  serviceType: "Sales Strategy",
  budget: "$35,000",
  startDate: "2026-03-28",
  endDate: "2026-06-30",
  timeline: "90-day commercial acceleration sprint",
  objectives: "Increase modern trade listings, rationalise channel coverage, define an Iraq go-to-market plan, and prepare for selective GCC export readiness.",
  scope: "Baghdad, Basra, Erbil and selected Iraq-wide distributor channels with export-readiness review for UAE and Kuwait.",
  constraints: "Limited field sales team, uneven distributor performance, price pressure from regional competitors, and tight launch calendar before summer season.",
  risks: "Channel conflict, distributor concentration risk, promotional overspend, and delayed retail onboarding.",
  internalNotes: "Seeded from CRM to support QA across engagement-driven tools.",
  priority: "High",
  phase: "Analysis",
  status: "Active",
  health: "On Track",
  progress: 35,
  stakeholders: [
    {
      id: "sh_demo_1",
      name: "Razan Al-Hadithi",
      position: "Commercial Director",
      company: "Mesopotamia Foods Co.",
      role: "Decision Maker",
      influence: "High",
      stance: "Champion",
      contactDetails: "razan@mesopotamiafoods.iq | +964 780 555 0101",
      notes: "Owns go-to-market decisions and trade budget approval.",
      nextStep: "Review first-pass sales strategy and approve priority channels."
    },
    {
      id: "sh_demo_2",
      name: "Ahmed Al-Samarrai",
      position: "National Sales Manager",
      company: "Mesopotamia Foods Co.",
      role: "Champion",
      influence: "High",
      stance: "Supporter",
      contactDetails: "Internal stakeholder",
      notes: "Provides field coverage and distributor performance data.",
      nextStep: "Validate territory plan and city-by-city rollout assumptions."
    }
  ],
  outputs: {
    briefing: {
      toolId: "briefing",
      toolLabel: "Client Briefing",
      phase: "Discovery",
      createdAt: "2026-03-28T08:00:00.000Z",
      content: "Client context: Mesopotamia Foods Co. is an Iraq-focused FMCG player seeking stronger supermarket penetration and a more disciplined channel strategy across Baghdad, Basra, and Erbil. The engagement should prioritise route-to-market design, modern trade listing strategy, distributor rationalisation, and export-readiness for selective GCC markets."
    },
    intelligence: {
      toolId: "intelligence",
      toolLabel: "Market Intelligence",
      phase: "Analysis",
      createdAt: "2026-03-28T08:30:00.000Z",
      content: "Initial market signal: premium and convenience food categories continue to benefit from urban retail modernisation in Iraq, but execution depends on reliable distributor coverage, shelf visibility, and disciplined trade promotions. Decision support should compare direct modern trade expansion versus hybrid distributor-led coverage."
    }
  },
  createdAt: "2026-03-28T07:45:00.000Z",
  updatedAt: "2026-03-28T08:30:00.000Z",
};

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
      engagements: [SEEDED_ENGAGEMENT],
      activeEngagementId: SEEDED_ENGAGEMENT_ID,

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
    {
      name:"consultai-v2",
      merge: (persistedState, currentState) => {
        const persisted = (persistedState as Partial<StoreType>) || {};
        const persistedContacts = Array.isArray(persisted.contacts) ? persisted.contacts : currentState.contacts;
        const persistedEngagements = Array.isArray(persisted.engagements) ? persisted.engagements : currentState.engagements;

        const contacts = persistedContacts.some((c) => c.id === SEEDED_CONTACT_ID)
          ? persistedContacts
          : [...persistedContacts, currentState.contacts.find((c) => c.id === SEEDED_CONTACT_ID)!];

        const engagements = persistedEngagements.some((e) => e.id === SEEDED_ENGAGEMENT_ID)
          ? persistedEngagements
          : [...persistedEngagements, SEEDED_ENGAGEMENT];

        return {
          ...currentState,
          ...persisted,
          contacts,
          engagements,
          activeEngagementId: persisted.activeEngagementId || SEEDED_ENGAGEMENT_ID,
        };
      },
    }
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
