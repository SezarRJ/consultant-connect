/**
 * engagementStore.ts  v3
 * CRM-first workflow with request definition, resource uploads,
 * phase requirements, output chaining, missing deliverables tracking,
 * and automated phase progression.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type LeadStatus = "New"|"Contacted"|"Qualified"|"Opportunity"|"Active Client"|"Closed Won"|"Closed Lost";
export type EngagementPhase = "Discovery"|"Analysis"|"Strategy"|"Deliverables"|"Follow-up"|"Closed";
export type EngagementStatus = "Active"|"On Hold"|"Completed"|"Cancelled";
export type HealthStatus = "On Track"|"At Risk"|"Delayed"|"Waiting on Client"|"Closed";
export type ReadinessStatus = "Ready"|"Partially Ready"|"Not Ready";

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
  requestedOutputs?: string[];
  initialResourceNotes?: string[];
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

export interface ResourceItem {
  id: string;
  name: string;
  category: "Info"|"Document"|"Report"|"Financial"|"Presentation"|"Contract"|"Other";
  status: "Uploaded"|"Pending";
  notes?: string;
  createdAt: string;
}

export interface PhaseRequirement {
  phase: EngagementPhase;
  requiredInfo: string[];
  requiredDocuments: string[];
  notes?: string;
  completedAt?: string;
}

export interface RequestSummary {
  serviceRequest: string;
  expectedOutputs: string[];
  deadline?: string;
  targetMarket?: string;
  requestedReports: string[];
  summary: string;
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
  requestSummary: RequestSummary;
  resources: ResourceItem[];
  phaseRequirements: Partial<Record<EngagementPhase, PhaseRequirement>>;
  requestedOutputs: string[];
  createdAt:string; updatedAt:string;
}

export const PHASES: EngagementPhase[] = ["Discovery","Analysis","Strategy","Deliverables","Follow-up","Closed"];

const SEEDED_CONTACT_ID = "c_demo";
const SEEDED_ENGAGEMENT_ID = "eng_demo";

const nowIso = () => new Date().toISOString();

const DEFAULT_REQUIREMENTS: Record<EngagementPhase, { info: string[]; docs: string[] }> = {
  "Discovery": {
    info: ["Customer objectives", "Scope", "Stakeholders", "Business background", "Current challenges"],
    docs: ["Briefing note", "Company profile", "Meeting notes"],
  },
  "Analysis": {
    info: ["Service-specific inputs", "Target market", "Budget", "Key assumptions"],
    docs: ["Relevant market data", "Client documents", "Reference reports"],
  },
  "Strategy": {
    info: ["Approved analysis results", "Customer priorities", "Constraints", "Timeline"],
    docs: ["Analysis report", "Decision notes"],
  },
  "Deliverables": {
    info: ["Requested output type", "Delivery format", "Review notes"],
    docs: ["Approved strategy", "Branding references", "Client report list"],
  },
  "Follow-up": {
    info: ["Delivery status", "Customer feedback", "Open action items"],
    docs: ["Delivered reports", "Revision notes"],
  },
  "Closed": {
    info: ["Closure summary", "Final status", "Next opportunity"],
    docs: ["Final archive", "Lessons learned"],
  },
};

function ensurePhaseRequirement(phase: EngagementPhase, current?: PhaseRequirement): PhaseRequirement {
  return current ?? {
    phase,
    requiredInfo: [...DEFAULT_REQUIREMENTS[phase].info],
    requiredDocuments: [...DEFAULT_REQUIREMENTS[phase].docs],
    notes: "",
  };
}

function getDeliveredOutputLabels(eng: Engagement): string[] {
  return Object.values(eng.outputs).map((o) => o.toolLabel.toLowerCase());
}

function getMissingRequestedOutputsInternal(eng: Engagement): string[] {
  const delivered = getDeliveredOutputLabels(eng);
  return eng.requestedOutputs.filter((req) => !delivered.some((d) => d.includes(req.toLowerCase()) || req.toLowerCase().includes(d)));
}

function getReadinessStatus(eng: Engagement, phase: EngagementPhase): ReadinessStatus {
  const req = ensurePhaseRequirement(phase, eng.phaseRequirements?.[phase]);
  const infoCount = req.requiredInfo.filter(Boolean).length;
  const docCount = req.requiredDocuments.filter(Boolean).length;
  const resourceCount = eng.resources.filter((r) => r.status === "Uploaded").length;
  const outputsCount = Object.values(eng.outputs).filter((o) => o.phase === phase || (phase === "Strategy" && o.phase === "Analysis") || (phase === "Deliverables" && (o.phase === "Strategy" || o.phase === "Analysis"))).length;

  const score =
    (eng.requestSummary.summary ? 1 : 0) +
    (infoCount > 0 ? 1 : 0) +
    ((docCount > 0 && resourceCount > 0) ? 1 : 0) +
    ((phase === "Discovery" || outputsCount > 0) ? 1 : 0);

  if (score >= 4) return "Ready";
  if (score >= 2) return "Partially Ready";
  return "Not Ready";
}

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
    requestedOutputs:["Sales Strategy", "Market Entry", "Competitor Analysis", "Executive Summary"],
    initialResourceNotes:["Company profile", "Distributor performance sheet", "Channel notes", "Prior market report"],
    createdAt:"2026-03-20", updatedAt:"2026-03-28" },
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
  requestSummary: {
    serviceRequest: "Sales Strategy",
    expectedOutputs: ["Sales Strategy", "Market Entry", "Competitor Analysis", "Executive Summary"],
    deadline: "2026-06-15",
    targetMarket: "Iraq with selective GCC export review",
    requestedReports: ["Market Entry", "Sales Strategy", "Competitor Analysis", "Executive Summary"],
    summary: "Customer requests a growth plan covering Iraq commercial expansion, distributor rationalisation, and readiness for selected GCC channels."
  },
  resources: [
    { id: "res_1", name: "Company profile", category: "Document", status: "Uploaded", createdAt: "2026-03-28T08:00:00.000Z" },
    { id: "res_2", name: "Distributor performance sheet", category: "Financial", status: "Uploaded", createdAt: "2026-03-28T08:05:00.000Z" },
    { id: "res_3", name: "Prior market report", category: "Report", status: "Uploaded", createdAt: "2026-03-28T08:07:00.000Z" },
  ],
  phaseRequirements: {
    Discovery: { phase: "Discovery", requiredInfo: ["Customer objectives", "Scope", "Stakeholders"], requiredDocuments: ["Company profile", "Meeting notes"], completedAt: "2026-03-28T08:10:00.000Z", notes: "Discovery inputs completed from CRM and kickoff." },
    Analysis: { phase: "Analysis", requiredInfo: ["Target market", "Budget", "Service-specific inputs"], requiredDocuments: ["Distributor performance sheet", "Prior market report"], notes: "Ready for Sales Strategy and Market Entry testing." },
  },
  requestedOutputs: ["Market Entry", "Competitor Analysis", "Sales Strategy", "Executive Summary"],
  createdAt: "2026-03-28T07:45:00.000Z",
  updatedAt: "2026-03-28T08:30:00.000Z",
};

export interface StoreType {
  contacts: CRMContact[];
  engagements: Engagement[];
  activeEngagementId: string | null;

  createContact: (data: Omit<CRMContact, "id"|"createdAt"|"updatedAt">) => string;
  updateContact: (id: string, patch: Partial<CRMContact>) => void;
  deleteContact: (id: string) => void;
  convertToEngagement: (contactId: string) => string;

  createEngagement: (d: Omit<Engagement, "id"|"createdAt"|"updatedAt">) => string;
  updateEngagement: (id: string, patch: Partial<Engagement>) => void;
  deleteEngagement: (id: string) => void;
  setActiveEngagement: (id: string) => void;
  getActiveEngagement: () => Engagement | null;

  addStakeholder: (engId: string, s: Omit<Stakeholder, "id">) => void;
  updateStakeholder: (engId: string, stakeholderId: string, patch: Partial<Stakeholder>) => void;
  removeStakeholder: (engId: string, stakeholderId: string) => void;

  saveOutput: (engId: string, toolId: string, toolLabel: string, content: string, phase: EngagementPhase) => void;
  getOutput: (engId: string, toolId: string) => EngagementOutput | null;
  getAllOutputs: (engId: string) => EngagementOutput[];
  getOutputsByPhase: (engId: string, phase: EngagementPhase) => EngagementOutput[];

  addResource: (engId: string, resource: Omit<ResourceItem, "id"|"createdAt"> & Partial<Pick<ResourceItem, "createdAt">>) => void;
  addRequestedOutput: (engId: string, output: string) => void;
  setPhaseRequirement: (engId: string, phase: EngagementPhase, requirement: Partial<PhaseRequirement>) => void;
  completePhase: (engId: string, phase: EngagementPhase) => void;
  getMissingRequestedOutputs: (engId: string) => string[];
}

export const useEngagementStore = create<StoreType>()(
  persist(
    (set, get) => ({
      contacts: SAMPLE_CONTACTS,
      engagements: [SEEDED_ENGAGEMENT],
      activeEngagementId: SEEDED_ENGAGEMENT_ID,

      createContact: (data) => {
        const id = `c_${Date.now()}`;
        const now = nowIso();
        set((s) => ({ contacts: [{ ...data, id, createdAt: now, updatedAt: now }, ...s.contacts] }));
        return id;
      },
      updateContact: (id, patch) => set((s) => ({
        contacts: s.contacts.map((c) => c.id === id ? { ...c, ...patch, updatedAt: nowIso() } : c)
      })),
      deleteContact: (id) => set((s) => ({ contacts: s.contacts.filter((c) => c.id !== id) })),

      convertToEngagement: (contactId) => {
        const contact = get().contacts.find((c) => c.id===contactId);
        if (!contact) return "";
        const id = `eng_${Date.now()}`;
        const now = nowIso();
        const expectedOutputs = contact.requestedOutputs?.length ? contact.requestedOutputs : [contact.interestedService, "Executive Summary"];
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
          requestSummary: {
            serviceRequest: contact.interestedService,
            expectedOutputs,
            deadline: contact.nextActionDate || "",
            targetMarket: contact.country,
            requestedReports: expectedOutputs,
            summary: contact.clientNeed || contact.businessProblem || `${contact.interestedService} request for ${contact.companyName}`,
          },
          resources: (contact.initialResourceNotes || []).map((name, idx) => ({ id: `res_seed_${idx}_${Date.now()}`, name, category: "Document", status: "Uploaded", createdAt: now })),
          phaseRequirements: { Discovery: ensurePhaseRequirement("Discovery") },
          requestedOutputs: expectedOutputs,
          createdAt:now, updatedAt:now,
        };
        get().updateContact(contactId, { engagementId:id, leadStatus:"Active Client" });
        set((s) => ({ engagements:[...s.engagements, eng], activeEngagementId:id }));
        return id;
      },

      createEngagement: (d) => {
        const id = `eng_${Date.now()}`;
        const now = nowIso();
        set((s) => ({ engagements:[...s.engagements, { ...d, id, createdAt:now, updatedAt:now }], activeEngagementId:id }));
        return id;
      },
      updateEngagement: (id, patch) => set((s) => ({
        engagements: s.engagements.map((e) => e.id===id ? { ...e, ...patch, updatedAt: nowIso() } : e)
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
            ? { ...e, stakeholders:[...e.stakeholders, { ...s, id }], updatedAt: nowIso() }
            : e)
        }));
      },
      updateStakeholder: (engId, shId, p) => set((s) => ({
        engagements: s.engagements.map((e) => e.id===engId
          ? { ...e, stakeholders:e.stakeholders.map((sh) => sh.id===shId ? { ...sh,...p } : sh), updatedAt: nowIso() }
          : e)
      })),
      removeStakeholder: (engId, shId) => set((s) => ({
        engagements: s.engagements.map((e) => e.id===engId
          ? { ...e, stakeholders:e.stakeholders.filter((sh) => sh.id!==shId), updatedAt: nowIso() }
          : e)
      })),

      saveOutput: (engId, toolId, toolLabel, content, phase) => {
        const output: EngagementOutput = { toolId, toolLabel, content, phase, createdAt: nowIso() };
        set((s) => ({
          engagements: s.engagements.map((e) => e.id===engId
            ? { ...e, outputs:{ ...e.outputs, [toolId]:output }, updatedAt: nowIso() }
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

      addResource: (engId, resource) => set((s) => ({
        engagements: s.engagements.map((e) => e.id === engId
          ? {
              ...e,
              resources: [...e.resources, { id: `res_${Date.now()}`, createdAt: resource.createdAt || nowIso(), ...resource } as ResourceItem],
              updatedAt: nowIso(),
            }
          : e)
      })),
      addRequestedOutput: (engId, output) => set((s) => ({
        engagements: s.engagements.map((e) => e.id === engId
          ? {
              ...e,
              requestedOutputs: e.requestedOutputs.includes(output) ? e.requestedOutputs : [...e.requestedOutputs, output],
              requestSummary: {
                ...e.requestSummary,
                expectedOutputs: e.requestSummary.expectedOutputs.includes(output) ? e.requestSummary.expectedOutputs : [...e.requestSummary.expectedOutputs, output],
                requestedReports: e.requestSummary.requestedReports.includes(output) ? e.requestSummary.requestedReports : [...e.requestSummary.requestedReports, output],
              },
              updatedAt: nowIso(),
            }
          : e)
      })),
      setPhaseRequirement: (engId, phase, requirement) => set((s) => ({
        engagements: s.engagements.map((e) => e.id === engId
          ? {
              ...e,
              phaseRequirements: {
                ...e.phaseRequirements,
                [phase]: { ...ensurePhaseRequirement(phase, e.phaseRequirements?.[phase]), ...requirement, phase },
              },
              updatedAt: nowIso(),
            }
          : e)
      })),
      completePhase: (engId, phase) => set((s) => ({
        engagements: s.engagements.map((e) => {
          if (e.id !== engId) return e;
          const idx = PHASES.indexOf(phase);
          const nextPhase = idx >= 0 && idx < PHASES.length - 1 ? PHASES[idx + 1] : phase;
          const completedRequirement = { ...ensurePhaseRequirement(phase, e.phaseRequirements?.[phase]), completedAt: nowIso() };
          return {
            ...e,
            status: nextPhase === "Closed" ? "Completed" : e.status,
            health: nextPhase === "Closed" ? "Closed" : e.health,
            progress: nextPhase === phase ? 100 : Math.max(e.progress, Math.round(((idx + 1) / PHASES.length) * 100)),
            phaseRequirements: {
              ...e.phaseRequirements,
              [phase]: completedRequirement,
              ...(nextPhase !== phase ? { [nextPhase]: ensurePhaseRequirement(nextPhase, e.phaseRequirements?.[nextPhase]) } : {}),
            },
            phase: nextPhase,
            updatedAt: nowIso(),
          };
        })
      })),
      getMissingRequestedOutputs: (engId) => {
        const eng = get().engagements.find((e) => e.id === engId);
        return eng ? getMissingRequestedOutputsInternal(eng) : [];
      },
    }),
    {
      name:"consultai-v3",
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
- Request Summary: ${e.requestSummary.summary || "Not defined"}
- Requested Outputs: ${(e.requestedOutputs || []).join(", ") || "None listed"}
- Resources Uploaded: ${e.resources.filter((r) => r.status === "Uploaded").map((r) => r.name).join(", ") || "None"}
- Missing Requested Outputs: ${getMissingRequestedOutputsInternal(e).join(", ") || "None"}
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

export function buildRequirementsContext(e: Engagement|null, phase?: EngagementPhase): string {
  if (!e) return "";
  const activePhase = phase || e.phase;
  const req = ensurePhaseRequirement(activePhase, e.phaseRequirements?.[activePhase]);
  return `REQUIREMENTS CHECK:
- Active Phase: ${activePhase}
- Required Information: ${req.requiredInfo.join(", ") || "None"}
- Required Documents: ${req.requiredDocuments.join(", ") || "None"}
- Readiness Status: ${getReadinessStatus(e, activePhase)}
- Missing Requested Outputs: ${getMissingRequestedOutputsInternal(e).join(", ") || "None"}
Do not invent missing source documents. If inputs are incomplete, clearly state assumptions and missing items.`;
}

export function buildFullContext(e: Engagement|null, priorIds?: string[], phase?: EngagementPhase): string {
  return [buildEngagementContext(e), buildRequirementsContext(e, phase), buildPriorOutputsContext(e, priorIds)].filter(Boolean).join("\n\n");
}

export function getEngagementReadiness(e: Engagement|null, phase?: EngagementPhase): ReadinessStatus {
  if (!e) return "Not Ready";
  return getReadinessStatus(e, phase || e.phase);
}

export function getMissingRequestedOutputs(e: Engagement|null): string[] {
  if (!e) return [];
  return getMissingRequestedOutputsInternal(e);
}

export function getPhaseRequirement(e: Engagement|null, phase?: EngagementPhase): PhaseRequirement | null {
  if (!e) return null;
  const activePhase = phase || e.phase;
  return ensurePhaseRequirement(activePhase, e.phaseRequirements?.[activePhase]);
}
