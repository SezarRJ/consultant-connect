/**
 * engagementStore.ts  v4
 * Full workflow: CRM → Engagement → Data Upload → Analysis → Strategy → Deliverables → Close
 * Financial Consultancy, output chaining, client data reuse across requests
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type LeadStatus = "New"|"Contacted"|"Qualified"|"Opportunity"|"Active Client"|"Closed Won"|"Closed Lost";
export type EngagementPhase = "Discovery"|"Data Collection"|"Analysis"|"Strategy"|"Deliverables"|"Review"|"Closed";
export type EngagementStatus = "Active"|"On Hold"|"Completed"|"Cancelled";
export type HealthStatus = "On Track"|"At Risk"|"Delayed"|"Waiting on Client"|"Closed";
export type ReadinessStatus = "Ready"|"Partially Ready"|"Not Ready";
export type ServiceCategory = "Market & Commercial"|"Financial Consultancy"|"Real Estate"|"Operations"|"Company Development"|"ISO & Compliance"|"Domain Intelligence"|"Strategic Management"|"Performance Improvement"|"Customer Experience"|"Consumer Products"|"Marketing Consulting"|"Real Estate Consulting";

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
  category?: ServiceCategory;
}

export interface ResourceItem {
  id:string; name:string;
  category:"Info"|"Document"|"Report"|"Financial"|"Presentation"|"Contract"|"Data"|"Other";
  status:"Uploaded"|"Pending"|"Reviewed";
  notes?:string; contentSummary?:string;
  createdAt:string; updatedAt?:string;
  // Mark as reusable so next engagements can pull it
  reusable?:boolean;
}

export interface DataInput {
  id:string; key:string; label:string; value:string;
  category:"Company"|"Financial"|"Market"|"Operations"|"Custom";
  createdAt:string;
}

export interface FinancialData {
  // Income Statement
  revenue:string; cogs:string; grossProfit:string; operatingExpenses:string;
  ebitda:string; netProfit:string;
  // Balance Sheet
  totalAssets:string; totalLiabilities:string; equity:string; cash:string;
  receivables:string; inventory:string; debt:string;
  // Ratios (auto-computed labels)
  currency:string; fiscalYear:string; notes:string;
}

export interface PhaseRequirement {
  phase:EngagementPhase;
  requiredInfo:string[];
  requiredDocuments:string[];
  notes?:string;
  completedAt?:string;
}

export interface RequestSummary {
  serviceRequest:string; serviceCategory:ServiceCategory;
  expectedOutputs:string[]; deadline?:string;
  targetMarket?:string; requestedReports:string[]; summary:string;
}

export interface Engagement {
  id:string; name:string; contactId:string|null;
  clientName:string; companyName:string; industry:string; sector:string;
  market:string; serviceType:string; serviceCategory:ServiceCategory;
  budget:string; startDate:string; endDate:string; timeline:string;
  objectives:string; scope:string; constraints:string; risks:string;
  internalNotes:string; priority:"High"|"Medium"|"Low";
  phase:EngagementPhase; status:EngagementStatus; health:HealthStatus;
  progress:number; stakeholders:Stakeholder[];
  outputs:Record<string,EngagementOutput>;
  requestSummary:RequestSummary;
  resources:ResourceItem[];
  dataInputs:DataInput[];
  financialData?:FinancialData;
  phaseRequirements:Partial<Record<EngagementPhase,PhaseRequirement>>;
  requestedOutputs:string[];
  // Link to previous engagements for data reuse
  previousEngagementId?:string;
  reusedResourceIds?:string[];
  createdAt:string; updatedAt:string;
}

export const PHASES:EngagementPhase[] = ["Discovery","Data Collection","Analysis","Strategy","Deliverables","Review","Closed"];

export const SERVICE_CATEGORIES:ServiceCategory[] = [
  "Strategic Management","Performance Improvement","Customer Experience","Consumer Products",
  "Marketing Consulting","Real Estate Consulting","Market & Commercial","Financial Consultancy",
  "Operations","Company Development","ISO & Compliance","Domain Intelligence","Real Estate"
];

export const CATEGORY_SERVICES:Record<ServiceCategory, string[]> = {
  "Strategic Management": ["Corporate Strategy","Growth & Market Entry","Operating Model & Governance","Pricing & Profitability","Performance & PMO","Digital & Data for Strategy","M&A Strategy","Change & Activation","Management Consulting Solutions","Business Strategy Consulting"],
  "Performance Improvement": ["Cost & Productivity","Throughput & Cycle Time","Quality & First-Pass Yield","Pricing & Margin","Procurement & Vendor Value","Working Capital","Analytics & KPI"],
  "Customer Experience": ["Revenue, Loyalty & Lower Cost-to-Serve","Journeys, Service & Loyalty","Service Blueprinting","VOC & NPS System","Retention & Win-back"],
  "Consumer Products": ["Category & Portfolio Strategy","Brand, Shopper & Retail Media","Pricing & Trade Promotion","Sales Operations & Route to Market","Supply Chain & Digital Shelf","Managed Services & Outsourcing"],
  "Marketing Consulting": ["Growth Strategy & Segmentation","Brand & Positioning","Advertising Consulting","Demand Generation & Content","Sales & Marketing Consulting","Pricing & Sales Consulting","Analytics & Marketing Ops","Customer Experience & Retention","Product Marketing","Go-to-Market for New Regions"],
  "Real Estate Consulting": ["Portfolio Strategy & Capital Planning","Transaction Support","Property Management Consulting","Lease & Occupier Optimization","Energy, Retro-commissioning & ESG","Development & Project Controls","Data & Reporting","Property Management Consultants"],
  "Market & Commercial": ["Market Entry","Competitor Analysis","Pricing Intelligence","Risk Assessment","Distributor Finder","Export Readiness","Feasibility Study","Market Intelligence","Sales Strategy","Partner Matchmaking"],
  "Financial Consultancy": ["Financial Analysis","Valuation","Investment Appraisal","Financial Modeling","Budget & Forecast","Cash Flow Analysis","Cost Reduction","Profitability Analysis","Due Diligence","Financial Report"],
  "Real Estate": ["Location Intelligence","Feasibility Engine","Investment Decision","Sensitivity Analysis","Comparable Analysis","Scenario Planning"],
  "Operations": ["Process Optimisation","Supply Chain Design","Procurement Optimiser","Capacity Planning","Quality Management","RTM Design","Territory Optimisation","Van Sales Optimiser"],
  "Company Development": ["Company Restructuring","Corporate Strategy","Merger & Acquisition","Governance Framework","Board Advisory","Growth Planning"],
  "ISO & Compliance": ["ISO 9001 Preparation","ISO 14001","ISO 45001","Gap Analysis","Audit Preparation","Compliance Review"],
  "Domain Intelligence": ["FMCG Intelligence","F&B Consulting","Telecom Intelligence","Distribution Intelligence","Marketing Intelligence","Manufacturing Intelligence","Business Development"],
};

export const SERVICE_TYPICAL_STEPS: Partial<Record<ServiceCategory, string[]>> = {
  "Performance Improvement": ["Diagnose","Prioritize","Pilot","Scale","Track & Adapt"],
  "Consumer Products": ["Baseline","Design","Pilots","Scale"],
  "Marketing Consulting": ["Diagnose","Choices","Plan","Launch","Optimize","Scale"],
  "Real Estate Consulting": ["Baseline","Choices","Plan","Execute","Tune","Review"],
};

const nowIso = () => new Date().toISOString();

const DEFAULT_REQUIREMENTS:Record<EngagementPhase,{info:string[];docs:string[]}> = {
  "Discovery":        { info:["Client objectives","Business background","Key challenges","Stakeholders","Service scope"],  docs:["Company profile","Meeting notes"] },
  "Data Collection":  { info:["All service-specific inputs provided by client","Financial data if applicable","Market data","Assumptions confirmed"], docs:["Client documents","Financial statements","Market reports","Reference data"] },
  "Analysis":         { info:["Validated inputs","Target market confirmed","Methodology agreed"], docs:["Collected data set","Approved inputs"] },
  "Strategy":         { info:["Approved analysis outputs","Priorities confirmed","Constraints understood"], docs:["Analysis report","Client feedback"] },
  "Deliverables":     { info:["Deliverable format agreed","Review cycle defined"], docs:["Draft outputs","Client approval notes"] },
  "Review":           { info:["Client review completed","Revisions noted"], docs:["Reviewed drafts","Revision requests"] },
  "Closed":           { info:["All outputs delivered","Client sign-off","Archive complete"], docs:["Final deliverables","Lessons learned"] },
};

function ensurePhaseReq(phase:EngagementPhase, cur?:PhaseRequirement):PhaseRequirement {
  return cur ?? { phase, requiredInfo:[...DEFAULT_REQUIREMENTS[phase].info], requiredDocuments:[...DEFAULT_REQUIREMENTS[phase].docs], notes:"" };
}

function getMissingOutputs(eng:Engagement):string[] {
  const delivered = Object.values(eng.outputs).map(o=>o.toolLabel.toLowerCase());
  return eng.requestedOutputs.filter(req => !delivered.some(d => d.includes(req.toLowerCase()) || req.toLowerCase().includes(d)));
}

function getReadiness(eng:Engagement, phase:EngagementPhase):ReadinessStatus {
  const phaseReqSet = !!eng.phaseRequirements?.[phase];
  const hasResources = eng.resources.filter(r=>r.status==="Uploaded").length > 0;
  const hasDataInputs = eng.dataInputs && eng.dataInputs.length > 0;
  const hasOutputs = Object.keys(eng.outputs).length > 0;
  const hasSummary = !!eng.requestSummary.summary;

  const score =
    (hasSummary ? 1 : 0) +
    (phaseReqSet ? 1 : 0) +
    ((hasResources || hasDataInputs) ? 1 : 0) +
    ((phase === "Discovery" || hasOutputs) ? 1 : 0);

  if (score >= 4) return "Ready";
  if (score >= 2) return "Partially Ready";
  return "Not Ready";
}

// ── No seeded demo data — start empty ────────────────────────────


// ── Store ────────────────────────────────────────────────────────
export interface StoreType {
  contacts:CRMContact[];
  engagements:Engagement[];
  activeEngagementId:string|null;

  createContact:(data:Omit<CRMContact,"id"|"createdAt"|"updatedAt">)=>string;
  updateContact:(id:string, patch:Partial<CRMContact>)=>void;
  deleteContact:(id:string)=>void;
  convertToEngagement:(contactId:string)=>string;

  createEngagement:(d:Omit<Engagement,"id"|"createdAt"|"updatedAt">)=>string;
  updateEngagement:(id:string, patch:Partial<Engagement>)=>void;
  deleteEngagement:(id:string)=>void;
  setActiveEngagement:(id:string)=>void;
  getActiveEngagement:()=>Engagement|null;

  addStakeholder:(engId:string, s:Omit<Stakeholder,"id">)=>void;
  updateStakeholder:(engId:string, shId:string, patch:Partial<Stakeholder>)=>void;
  removeStakeholder:(engId:string, shId:string)=>void;

  saveOutput:(engId:string, toolId:string, toolLabel:string, content:string, phase:EngagementPhase, category?:ServiceCategory)=>void;
  getOutput:(engId:string, toolId:string)=>EngagementOutput|null;
  getAllOutputs:(engId:string)=>EngagementOutput[];

  addResource:(engId:string, resource:Omit<ResourceItem,"id"|"createdAt">)=>void;
  updateResource:(engId:string, resourceId:string, patch:Partial<ResourceItem>)=>void;
  removeResource:(engId:string, resourceId:string)=>void;

  addDataInput:(engId:string, input:Omit<DataInput,"id"|"createdAt">)=>void;
  updateDataInput:(engId:string, inputId:string, value:string)=>void;
  removeDataInput:(engId:string, inputId:string)=>void;

  updateFinancialData:(engId:string, data:Partial<FinancialData>)=>void;

  addRequestedOutput:(engId:string, output:string)=>void;
  setPhaseRequirement:(engId:string, phase:EngagementPhase, req:Partial<PhaseRequirement>)=>void;
  completePhase:(engId:string, phase:EngagementPhase)=>void;
  getMissingRequestedOutputs:(engId:string)=>string[];

  // Reuse data from a previous engagement
  reuseEngagementData:(newEngId:string, fromEngId:string)=>void;
  getReusableResources:(contactId:string)=>ResourceItem[];
}

export const useEngagementStore = create<StoreType>()(
  persist(
    (set, get) => ({
      contacts:[],
      engagements:[],
      activeEngagementId:null,

      createContact:(data) => {
        const id=`c_${Date.now()}`;
        const now=nowIso();
        set(s=>({contacts:[{...data,id,createdAt:now,updatedAt:now},...s.contacts]}));
        return id;
      },
      updateContact:(id,patch)=>set(s=>({contacts:s.contacts.map(c=>c.id===id?{...c,...patch,updatedAt:nowIso()}:c)})),
      deleteContact:(id)=>set(s=>({contacts:s.contacts.filter(c=>c.id!==id)})),

      convertToEngagement:(contactId) => {
        const contact=get().contacts.find(c=>c.id===contactId);
        if (!contact) return "";
        const id=`eng_${Date.now()}`;
        const now=nowIso();
        const expectedOutputs=contact.requestedOutputs?.length?contact.requestedOutputs:[contact.interestedService,"Executive Summary"];
        const eng:Engagement={
          id, name:`${contact.companyName} — ${contact.interestedService}`,
          contactId, clientName:contact.fullName, companyName:contact.companyName,
          industry:contact.industry, sector:contact.sector, market:contact.country,
          serviceType:contact.interestedService, serviceCategory:"Strategic Management",
          budget:contact.estimatedBudget,
          startDate:new Date().toISOString().slice(0,10), endDate:"",
          timeline:"TBD", objectives:contact.clientNeed, scope:"",
          constraints:"", risks:"", internalNotes:contact.qualificationNotes,
          priority:contact.priorityLevel, phase:"Discovery", status:"Active",
          health:"On Track", progress:0, stakeholders:[], outputs:{},
          requestSummary:{
            serviceRequest:contact.interestedService, serviceCategory:"Strategic Management",
            expectedOutputs, deadline:contact.nextActionDate||"",
            targetMarket:contact.country, requestedReports:expectedOutputs,
            summary:contact.clientNeed||contact.businessProblem||`${contact.interestedService} for ${contact.companyName}`,
          },
          resources:(contact.initialResourceNotes||[]).map((name,i)=>({id:`res_${i}_${Date.now()}`,name,category:"Document",status:"Uploaded",createdAt:now,reusable:true})),
          dataInputs:[],
          phaseRequirements:{Discovery:ensurePhaseReq("Discovery")},
          requestedOutputs:expectedOutputs,
          createdAt:now, updatedAt:now,
        };
        get().updateContact(contactId,{engagementId:id,leadStatus:"Active Client"});
        set(s=>({engagements:[...s.engagements,eng],activeEngagementId:id}));
        return id;
      },

      createEngagement:(d) => {
        const id=`eng_${Date.now()}`;
        const now=nowIso();
        const eng={...d,id,dataInputs:d.dataInputs||[],createdAt:now,updatedAt:now};
        set(s=>({engagements:[...s.engagements,eng],activeEngagementId:id}));
        return id;
      },
      updateEngagement:(id,patch)=>set(s=>({engagements:s.engagements.map(e=>e.id===id?{...e,...patch,updatedAt:nowIso()}:e)})),
      deleteEngagement:(id)=>set(s=>({engagements:s.engagements.filter(e=>e.id!==id),activeEngagementId:s.activeEngagementId===id?null:s.activeEngagementId})),
      setActiveEngagement:(id)=>set({activeEngagementId:id}),
      getActiveEngagement:()=>{const{engagements,activeEngagementId}=get();return engagements.find(e=>e.id===activeEngagementId)??null;},

      addStakeholder:(engId,s)=>{const id=`sh_${Date.now()}`;set(state=>({engagements:state.engagements.map(e=>e.id===engId?{...e,stakeholders:[...e.stakeholders,{...s,id}],updatedAt:nowIso()}:e)}));},
      updateStakeholder:(engId,shId,p)=>set(s=>({engagements:s.engagements.map(e=>e.id===engId?{...e,stakeholders:e.stakeholders.map(sh=>sh.id===shId?{...sh,...p}:sh),updatedAt:nowIso()}:e)})),
      removeStakeholder:(engId,shId)=>set(s=>({engagements:s.engagements.map(e=>e.id===engId?{...e,stakeholders:e.stakeholders.filter(sh=>sh.id!==shId),updatedAt:nowIso()}:e)})),

      saveOutput:(engId,toolId,toolLabel,content,phase,category)=>{
        const output:EngagementOutput={toolId,toolLabel,content,phase,createdAt:nowIso(),category};
        set(s=>({engagements:s.engagements.map(e=>e.id===engId?{...e,outputs:{...e.outputs,[toolId]:output},updatedAt:nowIso()}:e)}));
      },
      getOutput:(engId,toolId)=>{const eng=get().engagements.find(e=>e.id===engId);return eng?.outputs?.[toolId]??null;},
      getAllOutputs:(engId)=>{const eng=get().engagements.find(e=>e.id===engId);return Object.values(eng?.outputs??{}).sort((a,b)=>a.createdAt.localeCompare(b.createdAt));},

      addResource:(engId,resource)=>set(s=>({engagements:s.engagements.map(e=>e.id===engId?{...e,resources:[...e.resources,{id:`res_${Date.now()}`,createdAt:nowIso(),...resource}as ResourceItem],updatedAt:nowIso()}:e)})),
      updateResource:(engId,resourceId,patch)=>set(s=>({engagements:s.engagements.map(e=>e.id===engId?{...e,resources:e.resources.map(r=>r.id===resourceId?{...r,...patch,updatedAt:nowIso()}:r),updatedAt:nowIso()}:e)})),
      removeResource:(engId,resourceId)=>set(s=>({engagements:s.engagements.map(e=>e.id===engId?{...e,resources:e.resources.filter(r=>r.id!==resourceId),updatedAt:nowIso()}:e)})),

      addDataInput:(engId,input)=>set(s=>({engagements:s.engagements.map(e=>e.id===engId?{...e,dataInputs:[...(e.dataInputs||[]),{id:`di_${Date.now()}`,createdAt:nowIso(),...input}],updatedAt:nowIso()}:e)})),
      updateDataInput:(engId,inputId,value)=>set(s=>({engagements:s.engagements.map(e=>e.id===engId?{...e,dataInputs:(e.dataInputs||[]).map(d=>d.id===inputId?{...d,value}:d),updatedAt:nowIso()}:e)})),
      removeDataInput:(engId,inputId)=>set(s=>({engagements:s.engagements.map(e=>e.id===engId?{...e,dataInputs:(e.dataInputs||[]).filter(d=>d.id!==inputId),updatedAt:nowIso()}:e)})),

      updateFinancialData:(engId,data)=>set(s=>({engagements:s.engagements.map(e=>e.id===engId?{...e,financialData:{...e.financialData,...data}as FinancialData,updatedAt:nowIso()}:e)})),

      addRequestedOutput:(engId,output)=>set(s=>({engagements:s.engagements.map(e=>e.id===engId&&!e.requestedOutputs.includes(output)?{...e,requestedOutputs:[...e.requestedOutputs,output],requestSummary:{...e.requestSummary,expectedOutputs:[...e.requestSummary.expectedOutputs,output],requestedReports:[...e.requestSummary.requestedReports,output]},updatedAt:nowIso()}:e)})),
      setPhaseRequirement:(engId,phase,req)=>set(s=>({engagements:s.engagements.map(e=>e.id===engId?{...e,phaseRequirements:{...e.phaseRequirements,[phase]:{...ensurePhaseReq(phase,e.phaseRequirements?.[phase]),...req,phase}},updatedAt:nowIso()}:e)})),

      completePhase:(engId,phase)=>set(s=>({engagements:s.engagements.map(e=>{
        if (e.id!==engId) return e;
        const idx=PHASES.indexOf(phase);
        const nextPhase=idx>=0&&idx<PHASES.length-1?PHASES[idx+1]:phase;
        return{...e,phase:nextPhase,
          status:nextPhase==="Closed"?"Completed":e.status,
          health:nextPhase==="Closed"?"Closed":e.health,
          progress:nextPhase==="Closed"?100:Math.max(e.progress,Math.round(((idx+1)/PHASES.length)*100)),
          phaseRequirements:{...e.phaseRequirements,[phase]:{...ensurePhaseReq(phase,e.phaseRequirements?.[phase]),completedAt:nowIso()},
            ...(nextPhase!==phase?{[nextPhase]:ensurePhaseReq(nextPhase,e.phaseRequirements?.[nextPhase])}:{})},
          updatedAt:nowIso()};
      })})),

      getMissingRequestedOutputs:(engId)=>{const eng=get().engagements.find(e=>e.id===engId);return eng?getMissingOutputs(eng):[];},

      reuseEngagementData:(newEngId,fromEngId)=>{
        const fromEng=get().engagements.find(e=>e.id===fromEngId);
        if (!fromEng) return;
        const reusableResources=fromEng.resources.filter(r=>r.reusable!==false);
        const reusableDataInputs=fromEng.dataInputs||[];
        set(s=>({engagements:s.engagements.map(e=>{
          if (e.id!==newEngId) return e;
          const now=nowIso();
          const newResources=[...e.resources,...reusableResources.map(r=>({...r,id:`res_reused_${r.id}_${Date.now()}`,notes:`Reused from engagement: ${fromEng.name}`,createdAt:now}))];
          const newDataInputs=[...(e.dataInputs||[]),...reusableDataInputs.map(d=>({...d,id:`di_reused_${d.id}_${Date.now()}`,createdAt:now}))];
          return{...e,resources:newResources,dataInputs:newDataInputs,previousEngagementId:fromEngId,reusedResourceIds:reusableResources.map(r=>r.id),financialData:fromEng.financialData,updatedAt:now};
        })}));
      },

      getReusableResources:(contactId)=>{
        const{engagements}=get();
        const contactEngs=engagements.filter(e=>e.contactId===contactId&&e.status==="Completed");
        return contactEngs.flatMap(e=>e.resources.filter(r=>r.reusable!==false));
      },
    }),
    {
      name:"consultai-v4",
      merge:(persistedState,currentState)=>{
        const p=(persistedState as Partial<StoreType>)||{};
        const pContacts=Array.isArray(p.contacts)?p.contacts:currentState.contacts;
        const pEngagements=Array.isArray(p.engagements)?p.engagements:currentState.engagements;
        return{...currentState,...p,contacts:pContacts,engagements:pEngagements,activeEngagementId:p.activeEngagementId||null};
      },
    }
  )
);

// ── Context builders ─────────────────────────────────────────────
export function buildEngagementContext(e:Engagement|null):string {
  if (!e) return "";
  const dataStr=(e.dataInputs||[]).map(d=>`- ${d.label}: ${d.value}`).join("\n")||"None";
  const finStr=e.financialData?`Revenue: ${e.financialData.revenue}, EBITDA: ${e.financialData.ebitda}, Net Profit: ${e.financialData.netProfit}, Total Assets: ${e.financialData.totalAssets}, Equity: ${e.financialData.equity}`:"Not provided";
  return `ACTIVE ENGAGEMENT:
- Client: ${e.clientName} | Company: ${e.companyName}
- Industry: ${e.industry} | Sector: ${e.sector}
- Market: ${e.market} | Service: ${e.serviceType}
- Budget: ${e.budget} | Timeline: ${e.timeline}
- Phase: ${e.phase} | Status: ${e.status}
- Objectives: ${e.objectives}
- Scope: ${e.scope||"Not defined"}
- Constraints: ${e.constraints||"None"}
- Risks: ${e.risks||"Not assessed"}
- Summary: ${e.requestSummary.summary}
- Requested Outputs: ${(e.requestedOutputs||[]).join(", ")||"None"}
- Documents Uploaded: ${e.resources.filter(r=>r.status==="Uploaded").map(r=>r.name).join(", ")||"None"}
CLIENT-PROVIDED DATA:
${dataStr}
FINANCIAL DATA: ${finStr}
- Stakeholders: ${e.stakeholders.map(s=>`${s.name} (${s.role})`).join(", ")||"None"}
Always use this context. Do not ask for information already provided above.`;
}

export function buildPriorOutputsContext(e:Engagement|null, toolIds?:string[]):string {
  if (!e) return "";
  const all=Object.values(e.outputs);
  const filtered=toolIds?all.filter(o=>toolIds.includes(o.toolId)):all;
  if (!filtered.length) return "";
  return `PRIOR ANALYSIS OUTPUTS:\n${filtered.map(o=>`=== ${o.toolLabel} ===\n${o.content.slice(0,600)}${o.content.length>600?"…":""}`).join("\n\n")}`;
}

export function buildFullContext(e:Engagement|null, priorIds?:string[]):string {
  return [buildEngagementContext(e),buildPriorOutputsContext(e,priorIds)].filter(Boolean).join("\n\n");
}

export function getEngagementReadiness(e:Engagement|null, phase?:EngagementPhase):ReadinessStatus {
  if (!e) return "Not Ready";
  return getReadiness(e,phase||e.phase);
}

export function getMissingRequestedOutputs(e:Engagement|null):string[] {
  if (!e) return [];
  return getMissingOutputs(e);
}

export function getPhaseRequirement(e:Engagement, phase:EngagementPhase):PhaseRequirement {
  return ensurePhaseReq(phase, e.phaseRequirements?.[phase]);
}

export function getPhaseProgress(e:Engagement):number {
  if (e.phase === "Closed") return 100;
  const idx=PHASES.indexOf(e.phase);
  return Math.round((idx/PHASES.length)*100);
}
