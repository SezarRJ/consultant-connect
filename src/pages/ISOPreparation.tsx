import { useState } from "react";
import {
  Award, CheckCircle2, AlertTriangle, RefreshCw, ChevronDown, ChevronRight,
  Shield, FileText, Users, Factory, Globe, Zap, BarChart2, ChevronUp,
  ClipboardList, Star, ArrowUpRight, Download, Info, X, Play, Lock,
  Target, TrendingUp, Building2, Settings2, BookOpen, CheckSquare,
  AlertCircle, Calendar, DollarSign, Layers, Network, Eye
} from "lucide-react";
import { useClaudeAnalysis } from "@/hooks/useClaudeAnalysis";

// ─── ISO Standards ────────────────────────────────────────────────────────────
const ISO_STANDARDS = [
  {
    id:"9001",code:"ISO 9001:2015",name:"Quality Management System",nameAr:"نظام إدارة الجودة",
    icon:Award,color:"hsl(38 95% 60%)",sector:"All Industries",
    clauses:["4. Context of Organization","5. Leadership","6. Planning","7. Support","8. Operation","9. Performance Evaluation","10. Improvement"],
    scope:"Establishes a framework for consistent product/service quality and customer satisfaction",
    mandatoryDocs:["Quality Manual","Quality Policy","Scope of QMS","Risk Register","Objectives & Plans","Competence Records","Monitoring & Measurement Results","Audit Reports","Nonconformities & Corrective Actions","Management Review Records"],
    implementationMonths:6,certificationCostUSD:"$5,000–$25,000",
    benefits:["Improved customer satisfaction","Process efficiency","Reduced waste","Market credibility","Continuous improvement culture"],
    auditAreas:["Document Control","Internal Audit Program","Management Review","Customer Feedback","Corrective Actions","Supplier Management","Calibration Records"]
  },
  {
    id:"14001",code:"ISO 14001:2015",name:"Environmental Management System",nameAr:"نظام إدارة البيئة",
    icon:Globe,color:"hsl(158 64% 55%)",sector:"Manufacturing, Oil & Gas, Utilities",
    clauses:["4. Context of Organization","5. Leadership","6. Planning (Env Aspects)","7. Support","8. Operation","9. Environmental Performance","10. Improvement"],
    scope:"Framework for managing environmental impact and improving sustainability performance",
    mandatoryDocs:["Environmental Policy","Environmental Aspects Register","Legal & Regulatory Register","Objectives & Targets","Emergency Response Procedures","Monitoring & Measurement","Audit Records","Management Review"],
    implementationMonths:8,certificationCostUSD:"$6,000–$20,000",
    benefits:["Regulatory compliance","Reduced environmental liability","Cost savings from resource efficiency","Improved community relations","ESG reporting capability"],
    auditAreas:["Environmental Aspects & Impacts","Legal Compliance","Emergency Preparedness","Waste Management","Energy & Water Consumption","Supplier Environmental Requirements"]
  },
  {
    id:"45001",code:"ISO 45001:2018",name:"Occupational Health & Safety",nameAr:"الصحة والسلامة المهنية",
    icon:Shield,color:"hsl(0 72% 68%)",sector:"Construction, Manufacturing, Oil & Gas",
    clauses:["4. Context","5. Leadership & Worker Participation","6. Planning (Hazard ID)","7. Support","8. Operation","9. Performance Evaluation","10. Improvement"],
    scope:"Reduces workplace incidents and creates safer, healthier work environments",
    mandatoryDocs:["OHS Policy","Hazard Register & Risk Assessment","Legal Requirements Register","Emergency Response Plan","Incident Investigation Reports","Training Records","PPE Register","OHS Objectives & Targets","Audit Records"],
    implementationMonths:6,certificationCostUSD:"$5,500–$18,000",
    benefits:["Reduced workplace accidents","Lower insurance premiums","Legal compliance","Improved staff morale","Reduced absenteeism"],
    auditAreas:["Hazard Identification","Risk Assessment","Legal Compliance","Emergency Response","Incident Reporting","Training Effectiveness","PPE Management","Contractor Safety"]
  },
  {
    id:"27001",code:"ISO 27001:2022",name:"Information Security Management",nameAr:"إدارة أمن المعلومات",
    icon:Lock,color:"hsl(217 91% 70%)",sector:"Technology, Finance, Healthcare, Government",
    clauses:["4. Context","5. Leadership","6. Planning (Risk Assessment)","7. Support","8. Operation","9. Performance Evaluation","10. Improvement","Annex A Controls"],
    scope:"Protects information assets through systematic risk management and 93 security controls",
    mandatoryDocs:["ISMS Scope","Information Security Policy","Risk Assessment & Treatment","Statement of Applicability (SoA)","Risk Treatment Plan","Asset Inventory","Business Continuity Plan","Incident Management Procedure","Access Control Policy","BCP Test Records"],
    implementationMonths:10,certificationCostUSD:"$15,000–$60,000",
    benefits:["Protection from cyber threats","Customer trust","Regulatory compliance (GDPR, NCA)","Reduced breach costs","Competitive advantage"],
    auditAreas:["Asset Management","Access Control","Cryptography","Physical Security","Operations Security","Communications Security","Supplier Relationships","Incident Management","BCM"]
  },
  {
    id:"22000",code:"ISO 22000:2018",name:"Food Safety Management",nameAr:"إدارة سلامة الغذاء",
    icon:Factory,color:"hsl(280 80% 70%)",sector:"Food & Beverage, Agriculture, Catering",
    clauses:["4. Context","5. Leadership","6. Planning","7. Support","8. Operation (HACCP)","9. Performance Evaluation","10. Improvement"],
    scope:"Ensures food safety across the entire supply chain through HACCP and prerequisite programs",
    mandatoryDocs:["Food Safety Policy","HACCP Plan","PRPs (Prerequisite Programs)","Hazard Analysis","Critical Control Points","Traceability Procedures","Allergen Management","Recall & Withdrawal Procedure","Verification Records","Audit Reports"],
    implementationMonths:9,certificationCostUSD:"$8,000–$30,000",
    benefits:["Consumer protection","Market access (export)","Reduced recall risk","Regulatory compliance","Brand protection"],
    auditAreas:["HACCP Plan","Critical Control Points","PRP Implementation","Traceability","Allergen Management","Cleaning & Sanitation","Pest Control","Supplier Approval","Cold Chain"]
  },
  {
    id:"50001",code:"ISO 50001:2018",name:"Energy Management System",nameAr:"نظام إدارة الطاقة",
    icon:Zap,color:"hsl(38 95% 60%)",sector:"Heavy Industry, Manufacturing, Buildings",
    clauses:["4. Context","5. Leadership","6. Planning (Energy Review)","7. Support","8. Operation","9. Performance Evaluation","10. Improvement"],
    scope:"Reduces energy costs and carbon footprint through systematic energy management",
    mandatoryDocs:["Energy Policy","Energy Review","Energy Performance Indicators","Energy Baseline","Objectives & Targets","Action Plans","Monitoring & Measurement","Audit Records"],
    implementationMonths:7,certificationCostUSD:"$5,000–$15,000",
    benefits:["Energy cost reduction 10–30%","Carbon footprint reduction","Regulatory compliance","ESG credibility","Incentive eligibility"],
    auditAreas:["Energy Review","Significant Energy Uses","Energy Baseline","EnPIs","Opportunities Identification","Metering & Monitoring","Procurement Standards"]
  },
  {
    id:"31000",code:"ISO 31000:2018",name:"Risk Management",nameAr:"إدارة المخاطر",
    icon:BarChart2,color:"hsl(200 80% 65%)",sector:"Finance, Insurance, Government, All",
    clauses:["4. Principles","5. Framework","6. Process (Risk Assessment)","6.1 Communication","6.2 Scope & Context","6.3 Risk Assessment","6.4 Risk Treatment","6.5 Monitoring"],
    scope:"Framework and guidelines for managing risk across all organizational levels",
    mandatoryDocs:["Risk Management Policy","Risk Management Framework","Risk Register","Risk Treatment Plans","Risk Appetite Statement","Monitoring Reports","Stakeholder Communication Plan"],
    implementationMonths:4,certificationCostUSD:"$3,000–$10,000",
    benefits:["Proactive risk management","Better decision making","Stakeholder confidence","Regulatory alignment","Reduced surprises"],
    auditAreas:["Risk Identification Process","Risk Analysis Methods","Risk Evaluation","Treatment Options","Monitoring Effectiveness","Communication Channels","Risk Culture"]
  },
  {
    id:"20000",code:"ISO/IEC 20000-1:2018",name:"IT Service Management",nameAr:"إدارة خدمات تقنية المعلومات",
    icon:Settings2,color:"hsl(280 80% 70%)",sector:"IT, Telecom, Managed Services",
    clauses:["4. Context","5. Leadership","6. Planning","7. Support","8. Operation (Service Delivery)","9. Performance Evaluation","10. Improvement"],
    scope:"Establishes service management best practices aligned with ITIL for IT service providers",
    mandatoryDocs:["Service Management Policy","Service Catalogue","Service Level Agreements","Incident Management Procedure","Change Management Procedure","Problem Management Procedure","Configuration Management","Capacity & Availability Plans","Continuity Plans","Audit Records"],
    implementationMonths:9,certificationCostUSD:"$10,000–$40,000",
    benefits:["Service quality improvement","Customer satisfaction","ITIL alignment","Competitive differentiation","Reduced downtime"],
    auditAreas:["Service Catalogue","SLA Management","Incident Management","Change Control","Problem Management","Configuration Management","Release Management","BCM","Service Reporting"]
  },
];

// ─── Types ────────────────────────────────────────────────────────────────────
interface CompanyContext {
  name:string; industry:string; country:string; city:string;
  size:string; employees:string; activity:string; existing:string;
}
type ISOTab = "overview"|"gap"|"action"|"documents"|"audit"|"path"|"training"|"risks";

// ─── Prompts ──────────────────────────────────────────────────────────────────
const SYS_GAP = `You are a certified ISO lead auditor with 25+ years experience in MENA markets including Iraq, UAE, Saudi Arabia, Kuwait, Jordan, Qatar, and Oman. You have audited 200+ companies across all sectors.

Perform a DEEPLY CUSTOMIZED gap analysis for the specified ISO standard AND company. Your analysis must:
- Be 100% specific to the company's INDUSTRY, ACTIVITY, SIZE, and COUNTRY
- Reference actual regulatory requirements for that country (e.g. Iraqi Industry Ministry, UAE ADNOC standards, Saudi SASO)
- Name specific gaps in terms of the company's actual job roles and departments
- Give REALISTIC cost estimates for that specific country and company size
- Identify what ALREADY EXISTS in companies of this type (don't flag things they likely have)

Respond ONLY with valid JSON (no markdown):
{
  "overallReadiness": number,
  "estimatedTimeToReady": "string — realistic for this company size and country",
  "estimatedCostUSD": "string — range specific to this market",
  "auditSummary": "string — 4-5 sentences, company-specific honest assessment",
  "clauseAssessments": [
    {
      "clauseNumber": "string",
      "clauseName": "string",
      "status": "Compliant|Partial|Non-Compliant|Not Applicable",
      "readiness": number,
      "currentState": "string — describe what likely EXISTS in this type of company",
      "specificGaps": ["string — name actual gaps using the company's context, not generic"],
      "requiredActions": ["string — specific actions with owner job title from this company"],
      "priority": "Critical|High|Medium|Low",
      "estimatedEffortDays": number,
      "estimatedCostUSD": "string",
      "evidence": ["string — exact documents/records to prepare"],
      "commonMistakes": ["string — mistakes companies in this industry/country make for this clause"]
    }
  ],
  "criticalFindings": ["string — top issues that would cause audit failure"],
  "strengths": ["string — things this type of company usually already has"],
  "quickWins": ["string — things achievable in < 2 weeks with minimal cost"],
  "majorGaps": ["string — systemic issues requiring significant effort"],
  "resourcesRequired": {
    "people": "string — which roles in this company need to be involved",
    "budget": "string — realistic budget for this country/size",
    "time": "string",
    "external": "string — what consultants/trainers are needed and estimated cost in this market"
  },
  "countrySpecificRequirements": ["string — regulatory/legal requirements specific to the company's country"],
  "industrySpecificRequirements": ["string — sector-specific requirements for this ISO standard in this industry"],
  "riskOfFailure": "Low|Medium|High",
  "certificationBodyRecommendation": "string — which body is best for this industry and country",
  "recommendations": ["string — 8-10 specific, prioritized recommendations"]
}`;

const SYS_ACTION = `You are an ISO implementation project manager with 20+ years specializing in MENA region companies. You have led 150+ successful certification projects across Iraq, UAE, Saudi Arabia, Kuwait, Jordan and GCC.

Create a HYPER-DETAILED, realistic implementation action plan that accounts for:
- The company's actual size, resources, and revenue
- The specific country's regulatory environment and certification body requirements
- The company's industry and activity — tasks must match actual business operations
- Local training provider availability and cost
- Realistic timelines that account for MENA business culture (Ramadan, holidays, decision-making speed)

Respond ONLY with valid JSON (no markdown):
{
  "projectSummary": {
    "totalDuration": "string",
    "totalCost": "string — specific to country",
    "teamRequired": "string — actual roles from this company",
    "isoRepresentativeRole": "string — recommended person for this company type",
    "keyDependencies": ["string"],
    "criticalSuccessFactors": ["string"]
  },
  "phases": [
    {
      "phase": number,
      "name": "string",
      "duration": "string",
      "objectives": ["string"],
      "tasks": [
        {
          "taskCode": "string — e.g. P1-T01",
          "task": "string — specific to company's activity and size",
          "owner": "string — actual job title from this company type",
          "duration": "string",
          "effort": "string — days × people",
          "priority": "Critical|High|Medium",
          "dependencies": ["string — task codes"],
          "deliverable": "string — exact output",
          "cost": "string",
          "notes": "string — country/industry specific tips"
        }
      ],
      "milestones": ["string — measurable checkpoints"],
      "documents": ["string — docs to complete this phase"],
      "risks": ["string — phase-specific risks for this company type"],
      "checklistItems": ["string — items to verify before proceeding to next phase"]
    }
  ],
  "documentationPlan": [
    {
      "document": "string",
      "code": "string — reference code",
      "type": "Policy|Procedure|Record|Form|Manual|Plan",
      "clause": "string",
      "owner": "string",
      "deadline": "string",
      "complexity": "Low|Medium|High",
      "templateGuidance": "string — specific content guidance for this company's activity"
    }
  ],
  "trainingPlan": [
    {
      "course": "string",
      "audience": "string — specific roles from this company",
      "duration": "string",
      "provider": "string — local/regional providers for this country",
      "format": "Classroom|Online|Blended|In-house",
      "cost": "string — realistic for this market",
      "priority": "Critical|High|Medium",
      "timing": "string — which phase"
    }
  ],
  "budgetBreakdown": [
    {
      "category": "string",
      "items": [{"item": "string", "cost": "string", "notes": "string"}],
      "subtotal": "string"
    }
  ],
  "internalAuditPlan": {
    "auditorsNeeded": number,
    "trainingRequired": "string",
    "auditFrequency": "string",
    "firstAuditTiming": "string",
    "auditAreas": ["string"]
  },
  "managementReviewPlan": {
    "frequency": "string",
    "chair": "string",
    "attendees": ["string"],
    "agenda": ["string"],
    "outputsRequired": ["string"]
  },
  "successCriteria": ["string"],
  "changeManagement": ["string — specific to company culture and country context"]
}`;

const SYS_DOCS = `You are an ISO documentation architect with 25+ years experience creating management system documents for MENA companies across all industries.

Generate a COMPLETE, COMPANY-SPECIFIC document framework. Every document must be:
- Named using terminology specific to this company's industry and activity
- Structured for the company's size and complexity
- Compliant with both the ISO standard AND the country's regulatory requirements
- Written at the right complexity level for the company's sophistication

Respond ONLY with valid JSON (no markdown):
{
  "documentFramework": {
    "totalDocuments": number,
    "byType": {"Policies": number, "Procedures": number, "Records": number, "Forms": number, "Plans": number, "Manuals": number},
    "complexity": "string — assessment of documentation challenge for this company"
  },
  "documentSets": [
    {
      "type": "Policies|Procedures|Records|Forms|Plans|Manuals",
      "description": "string — what this set covers",
      "documents": [
        {
          "title": "string — industry-specific name",
          "code": "string — e.g. QMS-POL-001",
          "clause": "string — ISO clause(s) covered",
          "priority": "Mandatory|Recommended|Optional",
          "purpose": "string — specific to company's activity",
          "scope": "string — which operations/departments",
          "sections": ["string — exact section headings"],
          "keyContent": ["string — specific content for this company's industry"],
          "reviewFrequency": "string",
          "owner": "string — job title",
          "approver": "string — job title",
          "relatedDocuments": ["string — document codes"],
          "countryRequirements": "string — any local legal requirements reflected in this doc",
          "industryConsiderations": "string — sector-specific elements"
        }
      ]
    }
  ],
  "documentControl": {
    "systemRecommendation": "string — software/tool recommendation for this company size",
    "namingConvention": "string — with example",
    "versionControl": "string",
    "reviewProcess": "string — specific to company structure",
    "accessLevels": ["string"],
    "distributionMethod": "string",
    "obsolescenceControl": "string",
    "translationPolicy": "string — Arabic/English requirements for this country"
  },
  "recordsRetention": [
    {
      "record": "string",
      "clause": "string",
      "minimumRetention": "string",
      "legalRetention": "string — country-specific legal requirement",
      "format": "Paper|Digital|Both",
      "responsibleParty": "string",
      "storageLocation": "string"
    }
  ],
  "quickStartTemplates": ["string — the 5 most critical documents to create first and why"],
  "documentationChallenges": ["string — common pitfalls for this industry/company size"]
}`;

const SYS_RISKS = `You are an ISO risk management consultant and lead auditor with deep MENA expertise. You specialize in identifying implementation and compliance risks specific to industries and countries in the Middle East.

Identify ALL risks with full specificity to this company's industry, activity, size, and country. Do not give generic risks — every risk must reflect:
- The company's actual operational context
- The country's regulatory environment
- The industry's specific hazards and failure modes
- Realistic likelihood based on similar companies in this market

Respond ONLY with valid JSON (no markdown):
{
  "riskSummary": {
    "totalRisks": number,
    "criticalCount": number,
    "highCount": number,
    "topConcern": "string — the single biggest risk for this company"
  },
  "implementationRisks": [
    {
      "riskId": "string — e.g. IR-001",
      "risk": "string — specific to company context",
      "category": "Leadership|Resources|Knowledge|Process|Culture|Technology|External",
      "likelihood": "High|Medium|Low",
      "impact": "High|Medium|Low",
      "riskScore": number,
      "specificCauses": ["string — actual causes for THIS company/industry/country"],
      "potentialConsequences": ["string — real business impact"],
      "preventiveControls": ["string — actions to prevent risk materializing"],
      "mitigationActions": ["string — what to do if risk materializes"],
      "owner": "string — which role owns this risk",
      "reviewFrequency": "string",
      "residualRisk": "High|Medium|Low",
      "industryBenchmark": "string — how common is this risk in this industry"
    }
  ],
  "complianceRisks": [
    {
      "riskId": "string",
      "risk": "string",
      "isoClause": "string",
      "likelihood": "High|Medium|Low",
      "auditImpact": "Major NC|Minor NC|Observation",
      "countryRegulation": "string — relevant local law or regulation",
      "control": "string",
      "evidence": "string — what auditor will look for"
    }
  ],
  "countrySpecificRisks": [
    {
      "risk": "string",
      "source": "string — regulatory body, law, market condition",
      "probability": "string",
      "businessImpact": "string",
      "response": "string"
    }
  ],
  "industrySpecificRisks": [
    {
      "risk": "string — specific to company's sector",
      "triggerEvent": "string",
      "impact": "string",
      "mitigation": "string"
    }
  ],
  "riskMatrix": {
    "critical": ["string — risk IDs"],
    "high": ["string"],
    "medium": ["string"],
    "low": ["string"]
  },
  "riskAppetite": "string — recommended risk appetite for this company type",
  "monitoringPlan": [
    {
      "risk": "string",
      "indicator": "string — leading indicator",
      "threshold": "string",
      "frequency": "string",
      "owner": "string"
    }
  ],
  "topPriorities": ["string — the 5 most important risk mitigation actions to take first"]
}`;

const SYS_AUDIT = `You are a certified ISO lead auditor who has conducted 500+ audits across MENA. You design precise, actionable internal audit checklists.

Generate a COMPREHENSIVE, company-specific self-audit checklist for the specified ISO standard. Every checklist item must:
- Be phrased as a YES/NO verifiable question an internal auditor would ask
- Reference the exact ISO clause it checks
- Be specific to the company's industry, size, and activity
- Include what EVIDENCE the auditor should look for
- Highlight items that most often cause MAJOR nonconformities in this industry

Respond ONLY with valid JSON (no markdown):
{
  "totalItems": number,
  "estimatedAuditDays": "string — realistic for this company size",
  "auditGroups": [
    {
      "groupName": "string — maps to ISO clause group",
      "clauseRef": "string — e.g. Clause 4-5",
      "weight": number,
      "color": "string — hsl color",
      "items": [
        {
          "id": "string — e.g. QMS-4.1-01",
          "question": "string — YES/NO auditable question",
          "clause": "string — exact clause reference",
          "criticality": "Major|Minor|Observation",
          "evidenceRequired": "string — what to look for",
          "industryNote": "string — specific consideration for this industry",
          "auditMethod": "Interview|Document Review|Observation|Record Check|Process Walk",
          "commonFailure": "string — how companies typically fail this item"
        }
      ]
    }
  ],
  "auditPreparation": ["string — what to prepare before starting the audit"],
  "auditConclusion": {
    "passCriteria": "string",
    "failCriteria": "string",
    "reportingRequirements": ["string"]
  }
}`;

// ─── Helper Components ────────────────────────────────────────────────────────
function ErrorBanner({msg}:{msg:string}) {
  return (
    <div className="rounded-xl p-4 flex items-start gap-3" style={{background:"hsl(0 72% 51% / 0.08)",border:"1px solid hsl(0 72% 51% / 0.3)"}}>
      <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" style={{color:"hsl(0 72% 68%)"}}/>
      <div>
        <p className="text-sm" style={{color:"hsl(0 72% 68%)"}}>{msg}</p>
        {msg.toLowerCase().includes("credit")&&<a href="https://console.anthropic.com/" target="_blank" rel="noreferrer" className="text-xs mt-1 underline inline-flex items-center gap-1" style={{color:"hsl(38 95% 60%)"}}>Top up credits <ArrowUpRight className="h-3 w-3"/></a>}
      </div>
    </div>
  );
}
function LoadingCard({msg}:{msg:string}) {
  return (
    <div className="rounded-xl p-12 text-center" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
      <RefreshCw className="h-10 w-10 animate-spin mx-auto mb-4" style={{color:"hsl(38 95% 52%)"}}/>
      <p className="font-semibold" style={{color:"hsl(210 40% 80%)"}}>{msg}</p>
      <p className="text-xs mt-1" style={{color:"hsl(215 25% 45%)"}}>Powered by Claude AI — please wait...</p>
    </div>
  );
}
function RunBtn({onClick,loading,label,loadingLabel,icon:Icon,color}:{onClick:()=>void;loading:boolean;label:string;loadingLabel:string;icon:any;color?:string}) {
  return (
    <button onClick={onClick} disabled={loading}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50 transition-all hover:opacity-90"
      style={{background:color||"hsl(38 95% 52%)",color:"hsl(216 58% 6%)"}}>
      {loading?<RefreshCw className="h-4 w-4 animate-spin"/>:<Icon className="h-4 w-4"/>}
      {loading?loadingLabel:label}
    </button>
  );
}
function StatusBadge({status}:{status:string}) {
  const map:Record<string,string>={
    "Compliant":"hsl(158 64% 55%)","Partial":"hsl(38 95% 60%)",
    "Non-Compliant":"hsl(0 72% 68%)","Not Applicable":"hsl(215 25% 50%)",
    "Critical":"hsl(0 72% 68%)","High":"hsl(38 95% 60%)","Medium":"hsl(217 91% 70%)","Low":"hsl(158 64% 55%)"
  };
  const c=map[status]||"hsl(215 25% 55%)";
  return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap" style={{background:`${c}18`,color:c}}>{status}</span>;
}
function ReadinessBar({value,color}:{value:number;color:string}) {
  const c=value>=80?color||"hsl(158 64% 55%)":value>=60?"hsl(38 95% 52%)":"hsl(0 72% 68%)";
  return(
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full" style={{background:"hsl(216 45% 18%)"}}>
        <div className="h-1.5 rounded-full transition-all" style={{width:`${value}%`,background:c}}/>
      </div>
      <span className="text-[10px] font-bold w-8 text-right" style={{color:c}}>{value}%</span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ISOPreparation() {
  const [selectedStd, setSelectedStd] = useState(ISO_STANDARDS[0]);
  const [activeTab, setActiveTab] = useState<ISOTab>("overview");
  const [auditChecks, setAuditChecks] = useState<Record<string,boolean>>({});
  const [expandedClause, setExpandedClause] = useState<number|null>(null);
  const [expandedPhase, setExpandedPhase] = useState<number|null>(null);
  const [expandedDocSet, setExpandedDocSet] = useState<string|null>(null);
  const [expandedRisk, setExpandedRisk] = useState<number|null>(null);
  const [expandedDoc, setExpandedDoc] = useState<string|null>(null);

  const [context, setContext] = useState<CompanyContext>({
    name:"",industry:"",country:"",city:"",
    size:"",employees:"",activity:"",existing:""
  });
  const [contextSaved, setContextSaved] = useState(false);

  const gapAI   = useClaudeAnalysis({systemPrompt:SYS_GAP,    agentId:`gap-${selectedStd.id}`,   modelTier:"flash", reasoningEffort:"medium"});
  const actAI   = useClaudeAnalysis({systemPrompt:SYS_ACTION,  agentId:`act-${selectedStd.id}`,   modelTier:"flash-lite"});
  const docAI   = useClaudeAnalysis({systemPrompt:SYS_DOCS,    agentId:`doc-${selectedStd.id}`,   modelTier:"flash-lite"});
  const riskAI  = useClaudeAnalysis({systemPrompt:SYS_RISKS,   agentId:`risk-${selectedStd.id}`,  modelTier:"flash-lite"});
  const auditAI = useClaudeAnalysis({systemPrompt:SYS_AUDIT,   agentId:`audit-${selectedStd.id}`, modelTier:"flash-lite"});

  const contextText = () => `
ISO Standard: ${selectedStd.code} — ${selectedStd.name}
Company: ${context.name||"[Company]"}
Industry: ${context.industry||"[Industry]"}
Country: ${context.country}, City: ${context.city}
Company Size: ${context.size}, Employees: ${context.employees}
Business Activity: ${context.activity}
Existing Certifications / Quality Systems: ${context.existing||"None"}
`.trim();

  const TABS: {key:ISOTab;label:string;icon:any}[] = [
    {key:"overview",  label:"Overview",       icon:Eye},
    {key:"gap",       label:"Gap Analysis",   icon:BarChart2},
    {key:"action",    label:"Action Plan",    icon:Target},
    {key:"documents", label:"Documents",      icon:FileText},
    {key:"audit",     label:"Self-Audit",     icon:CheckSquare},
    {key:"path",      label:"Cert. Path",     icon:Award},
    {key:"training",  label:"Training",       icon:BookOpen},
    {key:"risks",     label:"Risks",          icon:AlertCircle},
  ];

  // ── Overview Tab ─────────────────────────────────────────────────────────────
  const OverviewTab = () => (
    <div className="space-y-5">
      {/* Company context */}
      <div className="rounded-xl p-5" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4" style={{color:"hsl(38 95% 52%)"}}/>
            <p className="text-sm font-semibold" style={{color:"hsl(210 40% 88%)"}}>Company Context <span className="text-[10px] font-normal" style={{color:"hsl(215 25% 45%)"}}>— improves all AI analysis</span></p>
          </div>
          {contextSaved&&<span className="text-[10px] px-2 py-0.5 rounded-full" style={{background:"hsl(158 64% 40% / 0.15)",color:"hsl(158 64% 55%)"}}>✓ Saved</span>}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {k:"name"      as const,label:"Company Name",    ph:"e.g. Al-Noor Factory"},
            {k:"industry"  as const,label:"Industry",        ph:"e.g. Food Manufacturing"},
            {k:"country"   as const,label:"Country",         ph:"e.g. Iraq"},
            {k:"city"      as const,label:"City",            ph:"e.g. Erbil"},
            {k:"size"      as const,label:"Company Size",    ph:"e.g. Medium (50–250)"},
            {k:"employees" as const,label:"No. Employees",   ph:"e.g. 85"},
            {k:"activity"  as const,label:"Business Activity",ph:"e.g. Bottled water production"},
            {k:"existing"  as const,label:"Existing Certs",  ph:"e.g. None / ISO 9001 (partial)"},
          ].map(f=>(
            <div key={f.k}>
              <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{color:"hsl(215 25% 45%)"}}>{f.label}</label>
              <input value={context[f.k]} onChange={e=>setContext(p=>({...p,[f.k]:e.target.value}))} placeholder={f.ph}
                className="w-full px-3 py-2 rounded-lg text-xs" style={{background:"hsl(216 45% 12%)",border:"1px solid hsl(var(--border))",color:"hsl(210 40% 85%)"}}/>
            </div>
          ))}
        </div>
        <button onClick={()=>setContextSaved(true)} className="mt-3 px-4 py-2 rounded-lg text-xs font-semibold" style={{background:"hsl(38 95% 52% / 0.15)",color:"hsl(38 95% 60%)"}}>Save Context</button>
      </div>

      {/* Standard detail */}
      <div className="rounded-xl p-6" style={{background:"hsl(var(--card))",border:`1px solid ${selectedStd.color}30`}}>
        <div className="flex items-start gap-4 flex-wrap mb-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl shrink-0" style={{background:`${selectedStd.color}18`,border:`2px solid ${selectedStd.color}40`}}>
            <selectedStd.icon className="h-7 w-7" style={{color:selectedStd.color}}/>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold" style={{color:"hsl(210 40% 94%)"}}>{selectedStd.code}</h2>
            <p className="text-base" style={{color:selectedStd.color}}>{selectedStd.name}</p>
            <p className="text-xs mt-1" style={{color:"hsl(215 25% 55%)"}}>{selectedStd.nameAr} · {selectedStd.sector}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold" style={{color:"hsl(38 95% 60%)"}}>{selectedStd.certificationCostUSD}</p>
            <p className="text-[10px]" style={{color:"hsl(215 25% 45%)"}}>Certification cost</p>
            <p className="text-sm font-semibold mt-1" style={{color:"hsl(158 64% 55%)"}}>{selectedStd.implementationMonths} months</p>
            <p className="text-[10px]" style={{color:"hsl(215 25% 45%)"}}>Typical implementation</p>
          </div>
        </div>
        <p className="text-sm mb-4" style={{color:"hsl(210 40% 78%)"}}>{selectedStd.scope}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Clauses */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{color:selectedStd.color}}>Standard Clauses</p>
            <div className="space-y-1.5">
              {selectedStd.clauses.map((clause,i)=>(
                <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-lg" style={{background:"hsl(216 45% 12%)"}}>
                  <span className="flex h-5 w-5 items-center justify-center rounded text-[9px] font-black shrink-0" style={{background:`${selectedStd.color}20`,color:selectedStd.color}}>{i+4}</span>
                  <span className="text-xs" style={{color:"hsl(210 40% 82%)"}}>{clause}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Benefits */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{color:selectedStd.color}}>Business Benefits</p>
            <div className="space-y-2">
              {selectedStd.benefits.map((b,i)=>(
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" style={{color:selectedStd.color}}/>
                  <span className="text-xs" style={{color:"hsl(210 40% 78%)"}}>{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* All standards comparison */}
      <div className="rounded-xl overflow-hidden" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
        <div className="px-5 py-3" style={{background:"hsl(216 45% 11%)"}}><h3 className="text-sm font-bold" style={{color:"hsl(210 40% 92%)"}}>All 8 ISO Standards Comparison</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr style={{background:"hsl(216 45% 10%)"}}>
              {["Standard","Name","Best For","Timeline","Cost (USD)","Clauses"].map(h=><th key={h} className="px-4 py-2.5 text-left font-semibold whitespace-nowrap" style={{color:"hsl(215 25% 45%)"}}>{h}</th>)}
            </tr></thead>
            <tbody>{ISO_STANDARDS.map((std,i)=>(
              <tr key={std.id} onClick={()=>setSelectedStd(std)} style={{borderTop:"1px solid hsl(var(--border))",background:selectedStd.id===std.id?`${std.color}08`:"transparent",cursor:"pointer"}}>
                <td className="px-4 py-3"><span className="font-bold text-[11px]" style={{color:std.color}}>{std.code}</span></td>
                <td className="px-4 py-3 font-medium" style={{color:"hsl(210 40% 85%)"}}>{std.name}</td>
                <td className="px-4 py-3" style={{color:"hsl(215 25% 60%)"}}>{std.sector}</td>
                <td className="px-4 py-3 font-semibold" style={{color:"hsl(158 64% 55%)"}}>{std.implementationMonths} mo.</td>
                <td className="px-4 py-3" style={{color:"hsl(38 95% 60%)"}}>{std.certificationCostUSD}</td>
                <td className="px-4 py-3" style={{color:"hsl(215 25% 55%)"}}>{std.clauses.length}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ── Gap Analysis Tab ──────────────────────────────────────────────────────────
  const GapTab = () => (
    <div className="space-y-4">
      <div className="rounded-xl p-5 flex items-center justify-between flex-wrap gap-4" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
        <div>
          <h2 className="text-base font-bold" style={{color:"hsl(210 40% 92%)"}}>Clause-by-Clause Gap Analysis</h2>
          <p className="text-xs mt-0.5" style={{color:"hsl(215 25% 55%)"}}>AI assessment of your current compliance level for {selectedStd.code} — tailored to {context.industry||"your industry"}</p>
        </div>
        <RunBtn onClick={()=>gapAI.analyze(`${contextText()}\n\nPerform a detailed clause-by-clause gap analysis. Be specific to this company's industry, size, activity, and country. Provide realistic effort estimates for ${context.country} labor costs.`)} loading={gapAI.loading} label="Run Gap Analysis" loadingLabel="Analyzing..." icon={BarChart2} color={selectedStd.color}/>
      </div>
      {gapAI.error&&<ErrorBanner msg={gapAI.error}/>}
      {gapAI.loading&&<LoadingCard msg={`Analyzing ${selectedStd.code} compliance gaps for ${context.industry||"your company"}...`}/>}
      {gapAI.result&&!gapAI.loading&&(()=>{
        const r=gapAI.result;
        return (
          <div className="space-y-4">
            {/* Overall Score */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                {l:"Overall Readiness",v:`${r.overallReadiness||0}%`,c:r.overallReadiness>=70?"hsl(158 64% 55%)":r.overallReadiness>=50?"hsl(38 95% 60%)":"hsl(0 72% 68%)"},
                {l:"Time to Ready",v:r.estimatedTimeToReady,c:"hsl(217 91% 70%)"},
                {l:"Estimated Cost",v:r.estimatedCostUSD,c:"hsl(38 95% 60%)"},
                {l:"Failure Risk",v:r.riskOfFailure,c:r.riskOfFailure==="High"?"hsl(0 72% 68%)":r.riskOfFailure==="Medium"?"hsl(38 95% 60%)":"hsl(158 64% 55%)"},
              ].map((m,i)=>(
                <div key={i} className="rounded-xl p-4" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{color:"hsl(215 25% 45%)"}}>{m.l}</p>
                  <p className="text-lg font-bold" style={{color:m.c}}>{m.v}</p>
                </div>
              ))}
            </div>

            {/* Readiness bar */}
            <div className="rounded-xl p-5" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-bold" style={{color:"hsl(210 40% 92%)"}}>Overall Compliance Readiness</p>
                <p className="text-2xl font-black" style={{color:r.overallReadiness>=70?"hsl(158 64% 55%)":"hsl(38 95% 60%)"}}>{r.overallReadiness||0}%</p>
              </div>
              <div className="h-3 rounded-full" style={{background:"hsl(216 45% 18%)"}}>
                <div className="h-3 rounded-full transition-all" style={{width:`${r.overallReadiness||0}%`,background:r.overallReadiness>=70?"hsl(158 64% 45%)":"hsl(38 95% 52%)"}}/>
              </div>
              <div className="flex justify-between mt-2 text-[10px]" style={{color:"hsl(215 25% 45%)"}}>
                <span>0% — Start</span><span>50% — In Progress</span><span>80% — Pre-Audit</span><span>100% — Ready</span>
              </div>
            </div>

            {/* Strengths / Major Gaps / Quick Wins */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {label:"Strengths",items:r.strengths,c:"hsl(158 64% 55%)",icon:CheckCircle2},
                {label:"Major Gaps",items:r.majorGaps,c:"hsl(0 72% 68%)",icon:AlertTriangle},
                {label:"Quick Wins",items:r.quickWins,c:"hsl(38 95% 60%)",icon:Star},
              ].map(g=>g.items?.length>0&&(
                <div key={g.label} className="rounded-xl p-4" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                  <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{color:g.c}}>{g.label}</p>
                  <div className="space-y-1.5">{g.items.map((item:string,i:number)=>(
                    <div key={i} className="flex items-start gap-1.5 text-[11px]">
                      <g.icon className="h-3 w-3 shrink-0 mt-0.5" style={{color:g.c}}/>
                      <span style={{color:"hsl(210 40% 78%)"}}>{item}</span>
                    </div>
                  ))}</div>
                </div>
              ))}
            </div>

            {/* Resources Required */}
            {r.resourcesRequired&&(
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(r.resourcesRequired).map(([key,val])=>(
                  <div key={key} className="rounded-xl p-3" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1 capitalize" style={{color:"hsl(215 25% 45%)"}}>{key}</p>
                    <p className="text-xs font-semibold" style={{color:"hsl(38 95% 60%)"}}>{String(val)}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Clause-by-clause */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest px-1 mb-3" style={{color:"hsl(215 25% 45%)"}}>Clause-by-Clause Assessment</p>
              <div className="space-y-2">
                {(r.clauseAssessments||[]).map((clause:any,i:number)=>{
                  const isEx=expandedClause===i;
                  return(
                    <div key={i} className="rounded-xl overflow-hidden" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                      <button onClick={()=>setExpandedClause(isEx?null:i)} className="w-full flex items-center gap-3 px-4 py-3 text-left">
                        <span className="text-[11px] font-black shrink-0 w-8" style={{color:selectedStd.color}}>{clause.clauseNumber}</span>
                        <span className="flex-1 text-xs font-semibold" style={{color:"hsl(210 40% 85%)"}}>{clause.clauseName}</span>
                        <div className="flex items-center gap-3 shrink-0 flex-wrap justify-end">
                          <ReadinessBar value={clause.readiness||0} color={selectedStd.color}/>
                          <StatusBadge status={clause.status}/>
                          <StatusBadge status={clause.priority}/>
                        </div>
                        {isEx?<ChevronUp className="h-3.5 w-3.5 shrink-0" style={{color:"hsl(215 25% 45%)"}}/>:<ChevronDown className="h-3.5 w-3.5 shrink-0" style={{color:"hsl(215 25% 45%)"}}/>}
                      </button>
                      {isEx&&(
                        <div className="px-4 pb-4 space-y-3" style={{borderTop:"1px solid hsl(var(--border))"}}>
                          <div className="pt-3 text-xs rounded-lg px-3 py-2" style={{background:"hsl(216 45% 12%)"}}>
                            <span className="font-semibold" style={{color:"hsl(215 25% 45%)"}}>Current State: </span>
                            <span style={{color:"hsl(210 40% 78%)"}}>{clause.currentState}</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {(clause.specificGaps||clause.gaps)?.length>0&&<div>
                              <p className="text-[10px] font-bold uppercase mb-2" style={{color:"hsl(0 72% 68%)"}}>Gaps Identified</p>
                              <div className="space-y-1">{(clause.specificGaps||clause.gaps).map((g:string,j:number)=><div key={j} className="flex items-start gap-1.5 text-[11px]"><AlertTriangle className="h-3 w-3 shrink-0 mt-0.5" style={{color:"hsl(0 72% 68%)"}}/><span style={{color:"hsl(210 40% 75%)"}}>{g}</span></div>)}</div>
                            </div>}
                            {clause.requiredActions?.length>0&&<div>
                              <p className="text-[10px] font-bold uppercase mb-2" style={{color:"hsl(158 64% 55%)"}}>Required Actions</p>
                              <div className="space-y-1">{clause.requiredActions.map((a:string,j:number)=><div key={j} className="flex items-start gap-1.5 text-[11px]"><CheckCircle2 className="h-3 w-3 shrink-0 mt-0.5" style={{color:"hsl(158 64% 55%)"}}/><span style={{color:"hsl(210 40% 75%)"}}>{a}</span></div>)}</div>
                            </div>}
                          </div>
                          {clause.evidence?.length>0&&<div>
                            <p className="text-[10px] font-bold uppercase mb-2" style={{color:"hsl(217 91% 70%)"}}>Evidence / Documents Required</p>
                            <div className="flex flex-wrap gap-1.5">{clause.evidence.map((e:string,j:number)=><span key={j} className="text-[10px] px-2.5 py-1 rounded-lg" style={{background:"hsl(216 45% 16%)",color:"hsl(215 25% 65%)"}}><FileText className="h-3 w-3 inline mr-1"/>{e}</span>)}</div>
                          </div>}
                          {clause.commonMistakes?.length>0&&<div>
                            <p className="text-[10px] font-bold uppercase mb-2" style={{color:"hsl(280 80% 70%)"}}>Common Mistakes ({context.industry||"this industry"})</p>
                            <div className="space-y-1">{clause.commonMistakes.map((m:string,j:number)=><div key={j} className="flex items-start gap-1.5 text-[11px]"><AlertCircle className="h-3 w-3 shrink-0 mt-0.5" style={{color:"hsl(280 80% 70%)"}}/><span style={{color:"hsl(210 40% 75%)"}}>{m}</span></div>)}</div>
                          </div>}
                          <div className="flex items-center gap-6 text-[10px]">
                            <span><span style={{color:"hsl(215 25% 40%)"}}>Effort:</span> <span style={{color:"hsl(38 95% 60%)"}}>{clause.estimatedEffortDays} days</span></span>
                            <span><span style={{color:"hsl(215 25% 40%)"}}>Cost:</span> <span style={{color:"hsl(158 64% 55%)"}}>{clause.estimatedCostUSD}</span></span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Country + Industry Specific */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {r.countrySpecificRequirements?.length>0&&(
                <div className="rounded-xl p-4" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                  <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{color:"hsl(38 95% 60%)"}}>Country-Specific Requirements ({context.country||"Your Country"})</p>
                  <div className="space-y-1.5">{r.countrySpecificRequirements.map((req:string,i:number)=>(
                    <div key={i} className="flex items-start gap-1.5 text-[11px]"><Globe className="h-3 w-3 shrink-0 mt-0.5" style={{color:"hsl(38 95% 60%)"}}/><span style={{color:"hsl(210 40% 78%)"}}>{req}</span></div>
                  ))}</div>
                </div>
              )}
              {r.industrySpecificRequirements?.length>0&&(
                <div className="rounded-xl p-4" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                  <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{color:"hsl(217 91% 70%)"}}>Industry-Specific Requirements ({context.industry||"Your Sector"})</p>
                  <div className="space-y-1.5">{r.industrySpecificRequirements.map((req:string,i:number)=>(
                    <div key={i} className="flex items-start gap-1.5 text-[11px]"><Factory className="h-3 w-3 shrink-0 mt-0.5" style={{color:"hsl(217 91% 70%)"}}/><span style={{color:"hsl(210 40% 78%)"}}>{req}</span></div>
                  ))}</div>
                </div>
              )}
            </div>

            {/* Cert Body Recommendation */}
            {r.certificationBodyRecommendation&&(
              <div className="rounded-xl p-4" style={{background:"hsl(158 64% 40%/0.06)",border:"1px solid hsl(158 64% 40%/0.2)"}}>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{color:"hsl(158 64% 55%)"}}>Recommended Certification Body for {context.industry||"Your Industry"} in {context.country||"Your Country"}</p>
                <p className="text-sm" style={{color:"hsl(210 40% 82%)"}}>{r.certificationBodyRecommendation}</p>
              </div>
            )}

            {r.recommendations?.length>0&&<div className="rounded-xl p-5" style={{background:"hsl(38 95% 52% / 0.05)",border:"1px solid hsl(38 95% 52% / 0.2)"}}>
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{color:"hsl(38 95% 60%)"}}>Auditor Recommendations</p>
              <div className="space-y-2">{r.recommendations.map((rec:string,i:number)=><div key={i} className="flex items-start gap-2 text-xs"><Star className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{color:"hsl(38 95% 60%)"}}/><span style={{color:"hsl(210 40% 78%)"}}>{rec}</span></div>)}</div>
            </div>}
          </div>
        );
      })()}
      {!gapAI.result&&!gapAI.loading&&!gapAI.error&&<div className="rounded-xl p-12 text-center" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
        <BarChart2 className="h-14 w-14 mx-auto mb-4 opacity-15" style={{color:selectedStd.color}}/>
        <p className="font-semibold" style={{color:"hsl(215 25% 55%)"}}>Click "Run Gap Analysis" for a full {selectedStd.code} compliance assessment</p>
        <p className="text-xs mt-1" style={{color:"hsl(215 25% 38%)"}}>Clause-by-clause · Country & industry-specific · Common mistakes · Effort estimates</p>
      </div>}
    </div>
  );

  // ── Action Plan Tab ───────────────────────────────────────────────────────────
  const ActionTab = () => (
    <div className="space-y-4">
      <div className="rounded-xl p-5 flex items-center justify-between flex-wrap gap-4" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
        <div>
          <h2 className="text-base font-bold" style={{color:"hsl(210 40% 92%)"}}>Implementation Action Plan</h2>
          <p className="text-xs mt-0.5" style={{color:"hsl(215 25% 55%)"}}>Detailed phased plan to achieve {selectedStd.code} certification</p>
        </div>
        <RunBtn onClick={()=>actAI.analyze(`${contextText()}\n\nGap readiness: ${gapAI.result?.overallReadiness||"unknown"}%\nCreate a complete, phased implementation plan with all tasks, owners, timelines, documents and budget for achieving ${selectedStd.code} certification.`)} loading={actAI.loading} label="Generate Action Plan" loadingLabel="Planning..." icon={Target} color={selectedStd.color}/>
      </div>
      {actAI.error&&<ErrorBanner msg={actAI.error}/>}
      {actAI.loading&&<LoadingCard msg={`Building ${selectedStd.code} implementation plan...`}/>}
      {actAI.result&&!actAI.loading&&(()=>{
        const r=actAI.result;
        return (
          <div className="space-y-4">
            {/* Project Summary */}
            {r.projectSummary&&(
              <div className="rounded-xl p-5" style={{background:`${selectedStd.color}08`,border:`1px solid ${selectedStd.color}25`}}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    {l:"Total Duration",v:r.projectSummary.totalDuration,c:"hsl(217 91% 70%)"},
                    {l:"Total Cost",v:r.projectSummary.totalCost,c:"hsl(38 95% 60%)"},
                    {l:"Team Required",v:r.projectSummary.teamRequired,c:"hsl(158 64% 55%)"},
                  ].map((m,i)=>(
                    <div key={i}><p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{color:"hsl(215 25% 45%)"}}>{m.l}</p><p className="text-sm font-bold" style={{color:m.c}}>{m.v}</p></div>
                  ))}
                </div>
                {r.projectSummary.keyDependencies?.length>0&&<div className="mt-3 pt-3" style={{borderTop:`1px solid ${selectedStd.color}20`}}>
                  <p className="text-[10px] font-bold uppercase mb-1.5" style={{color:"hsl(215 25% 45%)"}}>Key Dependencies</p>
                  <div className="flex flex-wrap gap-2">{r.projectSummary.keyDependencies.map((d:string,i:number)=><span key={i} className="text-[10px] px-2 py-0.5 rounded" style={{background:"hsl(216 45% 18%)",color:"hsl(215 25% 60%)"}}>{d}</span>)}</div>
                </div>}
              </div>
            )}

            {/* Phases */}
            <div className="space-y-3">
              {(r.phases||[]).map((phase:any,i:number)=>{
                const phaseColors=["hsl(38 95% 60%)","hsl(158 64% 55%)","hsl(217 91% 70%)","hsl(280 80% 70%)","hsl(0 72% 68%)"];
                const c=phaseColors[i%5];
                const isEx=expandedPhase===i;
                return(
                  <div key={i} className="rounded-xl overflow-hidden" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                    <button onClick={()=>setExpandedPhase(isEx?null:i)} className="w-full flex items-center gap-4 px-5 py-4 text-left">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl shrink-0" style={{background:`${c}18`,border:`2px solid ${c}40`}}>
                        <span className="font-black text-sm" style={{color:c}}>{phase.phase}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm" style={{color:"hsl(210 40% 92%)"}}>{phase.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full" style={{background:`${c}15`,color:c}}>{phase.duration}</span>
                        </div>
                        <p className="text-xs mt-0.5" style={{color:"hsl(215 25% 55%)"}}>{phase.tasks?.length||0} tasks · {phase.documents?.length||0} documents</p>
                      </div>
                      {isEx?<ChevronUp className="h-4 w-4 shrink-0" style={{color:"hsl(215 25% 45%)"}}/>:<ChevronDown className="h-4 w-4 shrink-0" style={{color:"hsl(215 25% 45%)"}}/>}
                    </button>
                    {isEx&&(
                      <div className="px-5 pb-5 space-y-4" style={{borderTop:"1px solid hsl(var(--border))"}}>
                        {/* Objectives */}
                        {phase.objectives?.length>0&&<div className="pt-3">
                          <p className="text-[10px] font-bold uppercase mb-2" style={{color:c}}>Objectives</p>
                          <div className="flex flex-wrap gap-2">{phase.objectives.map((o:string,j:number)=><span key={j} className="text-xs px-2.5 py-1 rounded-lg" style={{background:`${c}10`,color:c}}>{o}</span>)}</div>
                        </div>}
                        {/* Tasks */}
                        {phase.tasks?.length>0&&<div>
                          <p className="text-[10px] font-bold uppercase mb-2" style={{color:c}}>Tasks</p>
                          <div className="space-y-2">
                            {phase.tasks.map((task:any,j:number)=>{
                              const tc=task.priority==="Critical"?"hsl(0 72% 68%)":task.priority==="High"?"hsl(38 95% 60%)":"hsl(217 91% 70%)";
                              return(
                                <div key={j} className="rounded-lg p-3" style={{background:"hsl(216 45% 11%)"}}>
                                  <div className="flex items-start gap-2">
                                    <StatusBadge status={task.priority}/>
                                    <div className="flex-1">
                                      <p className="text-xs font-semibold" style={{color:"hsl(210 40% 88%)"}}>{task.taskCode&&<span className="text-[10px] mr-1.5" style={{color:"hsl(215 25% 45%)"}}>{task.taskCode}</span>}{task.task}</p>
                                      <div className="flex flex-wrap gap-3 mt-1 text-[10px]">
                                        <span><span style={{color:"hsl(215 25% 40%)"}}>Owner:</span> <span style={{color:"hsl(215 25% 62%)"}}>{task.owner}</span></span>
                                        <span><span style={{color:"hsl(215 25% 40%)"}}>Duration:</span> <span style={{color:"hsl(217 91% 70%)"}}>{task.duration}</span></span>
                                        <span><span style={{color:"hsl(215 25% 40%)"}}>Effort:</span> <span style={{color:"hsl(38 95% 60%)"}}>{task.effort}</span></span>
                                        {task.cost&&<span><span style={{color:"hsl(215 25% 40%)"}}>Cost:</span> <span style={{color:"hsl(158 64% 55%)"}}>{task.cost}</span></span>}
                                      </div>
                                      {task.deliverable&&<p className="text-[10px] mt-1" style={{color:"hsl(215 25% 55%)"}}><span style={{color:"hsl(215 25% 40%)"}}>Deliverable:</span> {task.deliverable}</p>}
                                      {task.notes&&<p className="text-[10px] mt-1 italic" style={{color:"hsl(280 80% 65%)"}}><span style={{color:"hsl(215 25% 40%)"}}>Tip:</span> {task.notes}</p>}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>}
                        {/* Documents & Milestones */}
                        <div className="grid grid-cols-2 gap-3">
                          {phase.documents?.length>0&&<div className="rounded-lg p-3" style={{background:"hsl(216 45% 12%)"}}>
                            <p className="text-[10px] font-bold uppercase mb-2" style={{color:"hsl(217 91% 70%)"}}>Documents to Produce</p>
                            <div className="space-y-1">{phase.documents.map((d:string,j:number)=><p key={j} className="text-[10px]" style={{color:"hsl(215 25% 62%)"}}><FileText className="h-3 w-3 inline mr-1"/>{d}</p>)}</div>
                          </div>}
                          {phase.milestones?.length>0&&<div className="rounded-lg p-3" style={{background:"hsl(216 45% 12%)"}}>
                            <p className="text-[10px] font-bold uppercase mb-2" style={{color:"hsl(158 64% 55%)"}}>Milestones</p>
                            <div className="space-y-1">{phase.milestones.map((m:string,j:number)=><p key={j} className="text-[10px]" style={{color:"hsl(215 25% 62%)"}}>✓ {m}</p>)}</div>
                          </div>}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Budget Breakdown */}
            {r.budgetBreakdown?.length>0&&(
              <div className="rounded-xl overflow-hidden" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                <div className="px-5 py-3" style={{background:"hsl(216 45% 11%)"}}><h3 className="text-sm font-bold" style={{color:"hsl(210 40% 92%)"}}>Budget Breakdown</h3></div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead><tr style={{background:"hsl(216 45% 10%)"}}>
                      {["Item","Cost","Phase","Justification"].map(h=><th key={h} className="px-4 py-2.5 text-left font-semibold" style={{color:"hsl(215 25% 45%)"}}>{h}</th>)}
                    </tr></thead>
                    <tbody>{r.budgetBreakdown.map((item:any,i:number)=>(
                      <tr key={i} style={{borderTop:"1px solid hsl(var(--border))",background:i%2===0?"transparent":"hsl(216 45% 8% / 0.5)"}}>
                        <td className="px-4 py-2.5 font-medium" style={{color:"hsl(210 40% 85%)"}}>{item.item}</td>
                        <td className="px-4 py-2.5 font-bold" style={{color:"hsl(38 95% 60%)"}}>{item.cost}</td>
                        <td className="px-4 py-2.5" style={{color:"hsl(217 91% 70%)"}}>{item.phase}</td>
                        <td className="px-4 py-2.5" style={{color:"hsl(215 25% 55%)"}}>{item.justification}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Training Plan from action plan */}
            {r.trainingPlan?.length>0&&(
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest px-1 mb-3" style={{color:"hsl(215 25% 45%)"}}>Training Plan</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {r.trainingPlan.map((tr:any,i:number)=>{
                    const tc=tr.priority==="Critical"?"hsl(0 72% 68%)":tr.priority==="High"?"hsl(38 95% 60%)":"hsl(217 91% 70%)";
                    return(
                      <div key={i} className="rounded-xl p-4" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold" style={{color:"hsl(210 40% 88%)"}}>{tr.course}</span>
                          <StatusBadge status={tr.priority}/>
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-[10px]">
                          <span><span style={{color:"hsl(215 25% 40%)"}}>Audience:</span> <span style={{color:"hsl(215 25% 62%)"}}>{tr.audience}</span></span>
                          <span><span style={{color:"hsl(215 25% 40%)"}}>Duration:</span> <span style={{color:"hsl(217 91% 70%)"}}>{tr.duration}</span></span>
                          <span><span style={{color:"hsl(215 25% 40%)"}}>Provider:</span> <span style={{color:"hsl(215 25% 62%)"}}>{tr.provider}</span></span>
                          <span><span style={{color:"hsl(215 25% 40%)"}}>Cost:</span> <span style={{color:"hsl(38 95% 60%)"}}>{tr.cost}</span></span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Internal Audit Plan */}
            {r.internalAuditPlan&&(
              <div className="rounded-xl p-5" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{color:"hsl(158 64% 55%)"}}>Internal Audit Program</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  {[
                    {l:"Auditors Needed",v:r.internalAuditPlan.auditorsNeeded},
                    {l:"Audit Frequency",v:r.internalAuditPlan.auditFrequency},
                    {l:"First Audit",v:r.internalAuditPlan.firstAuditTiming},
                    {l:"Training Required",v:r.internalAuditPlan.trainingRequired},
                  ].map((m,i)=>(
                    <div key={i} className="rounded-lg p-3" style={{background:"hsl(216 45% 12%)"}}>
                      <p className="text-[10px] font-semibold uppercase mb-1" style={{color:"hsl(215 25% 45%)"}}>{m.l}</p>
                      <p className="text-xs font-semibold" style={{color:"hsl(158 64% 55%)"}}>{m.v}</p>
                    </div>
                  ))}
                </div>
                {r.internalAuditPlan.auditAreas?.length>0&&(
                  <div>
                    <p className="text-[10px] font-bold uppercase mb-2" style={{color:"hsl(215 25% 45%)"}}>Audit Areas</p>
                    <div className="flex flex-wrap gap-1.5">{r.internalAuditPlan.auditAreas.map((a:string,i:number)=><span key={i} className="text-[10px] px-2.5 py-1 rounded-lg" style={{background:"hsl(158 64% 40%/0.1)",color:"hsl(158 64% 55%)"}}>{a}</span>)}</div>
                  </div>
                )}
              </div>
            )}

            {/* Management Review Plan */}
            {r.managementReviewPlan&&(
              <div className="rounded-xl p-5" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{color:"hsl(38 95% 60%)"}}>Management Review Plan</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    {[{l:"Frequency",v:r.managementReviewPlan.frequency},{l:"Chair",v:r.managementReviewPlan.chair}].map((m,i)=>(
                      <div key={i} className="flex gap-2 text-xs">
                        <span className="w-20 shrink-0 font-semibold" style={{color:"hsl(215 25% 45%)"}}>{m.l}:</span>
                        <span style={{color:"hsl(210 40% 78%)"}}>{m.v}</span>
                      </div>
                    ))}
                    {r.managementReviewPlan.attendees?.length>0&&(
                      <div>
                        <p className="text-[10px] font-semibold mb-1" style={{color:"hsl(215 25% 45%)"}}>Attendees:</p>
                        <div className="flex flex-wrap gap-1">{r.managementReviewPlan.attendees.map((a:string,i:number)=><span key={i} className="text-[10px] px-2 py-0.5 rounded" style={{background:"hsl(216 45% 18%)",color:"hsl(215 25% 62%)"}}>{a}</span>)}</div>
                      </div>
                    )}
                  </div>
                  {r.managementReviewPlan.agenda?.length>0&&(
                    <div>
                      <p className="text-[10px] font-bold uppercase mb-2" style={{color:"hsl(38 95% 60%)"}}>Standard Agenda</p>
                      <div className="space-y-1">{r.managementReviewPlan.agenda.map((a:string,i:number)=><p key={i} className="text-[10px]" style={{color:"hsl(215 25% 62%)"}}>{i+1}. {a}</p>)}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Change Management */}
            {r.changeManagement?.length>0&&(
              <div className="rounded-xl p-4" style={{background:"hsl(280 80% 70%/0.05)",border:"1px solid hsl(280 80% 70%/0.2)"}}>
                <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{color:"hsl(280 80% 70%)"}}>Change Management Strategy</p>
                <div className="space-y-1">{r.changeManagement.map((c:string,i:number)=>(
                  <div key={i} className="flex items-start gap-1.5 text-[11px]"><ChevronRight className="h-3 w-3 shrink-0 mt-0.5" style={{color:"hsl(280 80% 70%)"}}/><span style={{color:"hsl(210 40% 78%)"}}>{c}</span></div>
                ))}</div>
              </div>
            )}
          </div>
        );
      })()}
      {!actAI.result&&!actAI.loading&&!actAI.error&&<div className="rounded-xl p-12 text-center" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
        <Target className="h-14 w-14 mx-auto mb-4 opacity-15" style={{color:selectedStd.color}}/>
        <p className="font-semibold" style={{color:"hsl(215 25% 55%)"}}>Click "Generate Action Plan" for a detailed implementation roadmap</p>
        <p className="text-xs mt-1" style={{color:"hsl(215 25% 38%)"}}>Tip: Run Gap Analysis first for a more accurate plan</p>
      </div>}
    </div>
  );

  // ── Documents Tab ─────────────────────────────────────────────────────────────
  const DocumentsTab = () => (
    <div className="space-y-4">
      <div className="rounded-xl p-5 flex items-center justify-between flex-wrap gap-4" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
        <div>
          <h2 className="text-base font-bold" style={{color:"hsl(210 40% 92%)"}}>Documentation Framework</h2>
          <p className="text-xs mt-0.5" style={{color:"hsl(215 25% 55%)"}}>Complete document structure with templates for {selectedStd.code}</p>
        </div>
        <RunBtn onClick={()=>docAI.analyze(`${contextText()}\n\nGenerate complete documentation framework with all required documents, their content guides, and document control system for ${selectedStd.code}.`)} loading={docAI.loading} label="Generate Doc Framework" loadingLabel="Generating..." icon={FileText} color={selectedStd.color}/>
      </div>

      {/* Mandatory docs - always visible */}
      <div className="rounded-xl p-5" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
        <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{color:selectedStd.color}}>Mandatory Documents for {selectedStd.code}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {selectedStd.mandatoryDocs.map((doc,i)=>(
            <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-lg" style={{background:"hsl(216 45% 12%)"}}>
              <FileText className="h-3.5 w-3.5 shrink-0" style={{color:selectedStd.color}}/>
              <span className="text-xs" style={{color:"hsl(210 40% 82%)"}}>{doc}</span>
            </div>
          ))}
        </div>
      </div>

      {docAI.error&&<ErrorBanner msg={docAI.error}/>}
      {docAI.loading&&<LoadingCard msg={`Generating documentation framework for ${selectedStd.code}...`}/>}
      {docAI.result&&!docAI.loading&&(()=>{
        const r=docAI.result;
        return (
          <div className="space-y-4">
            {/* Document Sets */}
            {(r.documentSets||[]).map((set:any)=>{
              const isEx=expandedDocSet===set.type;
              return(
                <div key={set.type} className="rounded-xl overflow-hidden" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                  <button onClick={()=>setExpandedDocSet(isEx?null:set.type)} className="w-full flex items-center gap-4 px-5 py-4 text-left">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0" style={{background:`${selectedStd.color}18`}}>
                      <FileText className="h-4 w-4" style={{color:selectedStd.color}}/>
                    </div>
                    <div className="flex-1">
                      <span className="font-bold text-sm" style={{color:"hsl(210 40% 92%)"}}>{set.type}</span>
                      <span className="ml-2 text-[10px]" style={{color:"hsl(215 25% 50%)"}}>{set.documents?.length||0} documents</span>
                    </div>
                    {isEx?<ChevronUp className="h-4 w-4" style={{color:"hsl(215 25% 45%)"}}/>:<ChevronDown className="h-4 w-4" style={{color:"hsl(215 25% 45%)"}}/>}
                  </button>
                  {isEx&&(
                    <div className="px-5 pb-5 space-y-3" style={{borderTop:"1px solid hsl(var(--border))"}}>
                      {(set.documents||[]).map((doc:any)=>{
                        const docKey=doc.code||doc.title;
                        const isDocEx=expandedDoc===docKey;
                        return(
                          <div key={docKey} className="rounded-xl overflow-hidden" style={{background:"hsl(216 45% 11%)"}}>
                            <button onClick={()=>setExpandedDoc(isDocEx?null:docKey)} className="w-full flex items-center gap-3 px-4 py-3 text-left">
                              <span className="text-[10px] font-black shrink-0" style={{color:selectedStd.color}}>{doc.code}</span>
                              <span className="flex-1 text-xs font-semibold" style={{color:"hsl(210 40% 88%)"}}>{doc.title}</span>
                              <span className="text-[10px] shrink-0" style={{color:"hsl(215 25% 50%)"}}>{doc.clause}</span>
                              {isDocEx?<ChevronUp className="h-3.5 w-3.5 shrink-0" style={{color:"hsl(215 25% 45%)"}}/>:<ChevronDown className="h-3.5 w-3.5 shrink-0" style={{color:"hsl(215 25% 45%)"}}/>}
                            </button>
                            {isDocEx&&(
                              <div className="px-4 pb-4 space-y-3" style={{borderTop:"1px solid hsl(216 45% 16%)"}}>
                                <div className="pt-3 grid grid-cols-2 gap-2 text-[10px]">
                                  <span><span style={{color:"hsl(215 25% 40%)"}}>Purpose:</span> <span style={{color:"hsl(215 25% 62%)"}}>{doc.purpose}</span></span>
                                  <span><span style={{color:"hsl(215 25% 40%)"}}>Scope:</span> <span style={{color:"hsl(215 25% 62%)"}}>{doc.scope}</span></span>
                                  <span><span style={{color:"hsl(215 25% 40%)"}}>Owner:</span> <span style={{color:"hsl(38 95% 55%)"}}>{doc.owner}</span></span>
                                  <span><span style={{color:"hsl(215 25% 40%)"}}>Approver:</span> <span style={{color:"hsl(158 64% 55%)"}}>{doc.approver}</span></span>
                                  <span><span style={{color:"hsl(215 25% 40%)"}}>Review:</span> <span style={{color:"hsl(217 91% 70%)"}}>{doc.reviewFrequency}</span></span>
                                </div>
                                {doc.sections?.length>0&&<div>
                                  <p className="text-[10px] font-bold uppercase mb-1.5" style={{color:selectedStd.color}}>Document Sections</p>
                                  <div className="flex flex-wrap gap-1.5">{doc.sections.map((s:string,j:number)=><span key={j} className="text-[10px] px-2.5 py-1 rounded-lg" style={{background:"hsl(216 45% 16%)",color:"hsl(210 40% 72%)"}}>{s}</span>)}</div>
                                </div>}
                                {doc.keyContent?.length>0&&<div>
                                  <p className="text-[10px] font-bold uppercase mb-1.5" style={{color:selectedStd.color}}>Key Content Guide</p>
                                  <div className="space-y-1">{doc.keyContent.map((c:string,j:number)=><div key={j} className="flex items-start gap-1.5 text-[10px]"><ChevronRight className="h-3 w-3 shrink-0 mt-0.5" style={{color:selectedStd.color}}/><span style={{color:"hsl(215 25% 65%)"}}>{c}</span></div>)}</div>
                                </div>}
                                {doc.relatedDocuments?.length>0&&<div>
                                  <p className="text-[10px] font-bold uppercase mb-1" style={{color:"hsl(215 25% 45%)"}}>Related Documents</p>
                                  <div className="flex flex-wrap gap-1">{doc.relatedDocuments.map((d:string,j:number)=><span key={j} className="text-[10px] px-2 py-0.5 rounded" style={{background:"hsl(216 45% 18%)",color:"hsl(215 25% 60%)"}}>{d}</span>)}</div>
                                </div>}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Document Framework Summary */}
            {r.documentFramework&&(
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  {l:"Total Documents",v:r.documentFramework.totalDocuments,c:"hsl(38 95% 60%)"},
                  {l:"Complexity",v:r.documentFramework.complexity,c:"hsl(217 91% 70%)"},
                  {l:"Policies",v:r.documentFramework.byType?.Policies,c:"hsl(158 64% 55%)"},
                  {l:"Procedures",v:r.documentFramework.byType?.Procedures,c:"hsl(280 80% 70%)"},
                ].map((m,i)=>m.v!==undefined&&(
                  <div key={i} className="rounded-xl p-4" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{color:"hsl(215 25% 45%)"}}>{m.l}</p>
                    <p className="text-sm font-bold" style={{color:m.c}}>{m.v}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Start Templates */}
            {r.quickStartTemplates?.length>0&&(
              <div className="rounded-xl p-4" style={{background:"hsl(158 64% 40%/0.06)",border:"1px solid hsl(158 64% 40%/0.2)"}}>
                <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{color:"hsl(158 64% 55%)"}}>Quick Start — 5 Documents to Create First</p>
                <div className="space-y-1.5">{r.quickStartTemplates.map((t:string,i:number)=>(
                  <div key={i} className="flex items-start gap-2 text-[11px]"><span className="font-black shrink-0" style={{color:"hsl(158 64% 55%)"}}>{i+1}.</span><span style={{color:"hsl(210 40% 78%)"}}>{t}</span></div>
                ))}</div>
              </div>
            )}

            {/* Document Sets */}
            {(r.documentSets||[]).map((set:any)=>{
              const isEx=expandedDocSet===set.type;
              return(
                <div key={set.type} className="rounded-xl overflow-hidden" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                  <button onClick={()=>setExpandedDocSet(isEx?null:set.type)} className="w-full flex items-center gap-4 px-5 py-4 text-left">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0" style={{background:`${selectedStd.color}18`}}>
                      <FileText className="h-4 w-4" style={{color:selectedStd.color}}/>
                    </div>
                    <div className="flex-1">
                      <span className="font-bold text-sm" style={{color:"hsl(210 40% 92%)"}}>{set.type}</span>
                      {set.description&&<span className="ml-2 text-[10px]" style={{color:"hsl(215 25% 50%)"}}>{set.description}</span>}
                      <span className="ml-2 text-[10px]" style={{color:"hsl(215 25% 50%)"}}>· {set.documents?.length||0} documents</span>
                    </div>
                    {isEx?<ChevronUp className="h-4 w-4" style={{color:"hsl(215 25% 45%)"}}/>:<ChevronDown className="h-4 w-4" style={{color:"hsl(215 25% 45%)"}}/>}
                  </button>
                  {isEx&&(
                    <div className="px-5 pb-5 space-y-3" style={{borderTop:"1px solid hsl(var(--border))"}}>
                      {(set.documents||[]).map((doc:any)=>{
                        const docKey=doc.code||doc.title;
                        const isDocEx=expandedDoc===docKey;
                        const priC=doc.priority==="Mandatory"?"hsl(0 72% 68%)":doc.priority==="Recommended"?"hsl(38 95% 60%)":"hsl(215 25% 55%)";
                        return(
                          <div key={docKey} className="rounded-xl overflow-hidden" style={{background:"hsl(216 45% 11%)"}}>
                            <button onClick={()=>setExpandedDoc(isDocEx?null:docKey)} className="w-full flex items-center gap-3 px-4 py-3 text-left">
                              <span className="text-[10px] font-black shrink-0" style={{color:selectedStd.color}}>{doc.code}</span>
                              <span className="flex-1 text-xs font-semibold" style={{color:"hsl(210 40% 88%)"}}>{doc.title}</span>
                              {doc.priority&&<span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0" style={{background:`${priC}15`,color:priC}}>{doc.priority}</span>}
                              <span className="text-[10px] shrink-0" style={{color:"hsl(215 25% 50%)"}}>{doc.clause}</span>
                              {isDocEx?<ChevronUp className="h-3.5 w-3.5 shrink-0" style={{color:"hsl(215 25% 45%)"}}/>:<ChevronDown className="h-3.5 w-3.5 shrink-0" style={{color:"hsl(215 25% 45%)"}}/>}
                            </button>
                            {isDocEx&&(
                              <div className="px-4 pb-4 space-y-3" style={{borderTop:"1px solid hsl(216 45% 16%)"}}>
                                <div className="pt-3 grid grid-cols-2 gap-2 text-[10px]">
                                  <span><span style={{color:"hsl(215 25% 40%)"}}>Purpose:</span> <span style={{color:"hsl(215 25% 62%)"}}>{doc.purpose}</span></span>
                                  <span><span style={{color:"hsl(215 25% 40%)"}}>Scope:</span> <span style={{color:"hsl(215 25% 62%)"}}>{doc.scope}</span></span>
                                  <span><span style={{color:"hsl(215 25% 40%)"}}>Owner:</span> <span style={{color:"hsl(38 95% 55%)"}}>{doc.owner}</span></span>
                                  <span><span style={{color:"hsl(215 25% 40%)"}}>Approver:</span> <span style={{color:"hsl(158 64% 55%)"}}>{doc.approver}</span></span>
                                  <span><span style={{color:"hsl(215 25% 40%)"}}>Review:</span> <span style={{color:"hsl(217 91% 70%)"}}>{doc.reviewFrequency}</span></span>
                                  {doc.complexity&&<span><span style={{color:"hsl(215 25% 40%)"}}>Complexity:</span> <span style={{color:"hsl(38 95% 55%)"}}>{doc.complexity}</span></span>}
                                </div>
                                {doc.sections?.length>0&&<div>
                                  <p className="text-[10px] font-bold uppercase mb-1.5" style={{color:selectedStd.color}}>Document Sections</p>
                                  <div className="flex flex-wrap gap-1.5">{doc.sections.map((s:string,j:number)=><span key={j} className="text-[10px] px-2.5 py-1 rounded-lg" style={{background:"hsl(216 45% 16%)",color:"hsl(210 40% 72%)"}}>{s}</span>)}</div>
                                </div>}
                                {doc.keyContent?.length>0&&<div>
                                  <p className="text-[10px] font-bold uppercase mb-1.5" style={{color:selectedStd.color}}>Content Guide</p>
                                  <div className="space-y-1">{doc.keyContent.map((c:string,j:number)=><div key={j} className="flex items-start gap-1.5 text-[10px]"><ChevronRight className="h-3 w-3 shrink-0 mt-0.5" style={{color:selectedStd.color}}/><span style={{color:"hsl(215 25% 65%)"}}>{c}</span></div>)}</div>
                                </div>}
                                {doc.templateGuidance&&<div className="rounded-lg px-3 py-2" style={{background:"hsl(280 80% 70%/0.06)",border:"1px solid hsl(280 80% 70%/0.2)"}}>
                                  <p className="text-[10px] font-bold mb-1" style={{color:"hsl(280 80% 70%)"}}>Template Guidance ({context.activity||"your activity"})</p>
                                  <p className="text-[10px]" style={{color:"hsl(215 25% 65%)"}}>{doc.templateGuidance}</p>
                                </div>}
                                {(doc.industryConsiderations||doc.countryRequirements)&&<div className="grid grid-cols-2 gap-2">
                                  {doc.industryConsiderations&&<div><p className="text-[10px] font-bold mb-1" style={{color:"hsl(217 91% 70%)"}}>Industry Notes</p><p className="text-[10px]" style={{color:"hsl(215 25% 60%)"}}>{doc.industryConsiderations}</p></div>}
                                  {doc.countryRequirements&&<div><p className="text-[10px] font-bold mb-1" style={{color:"hsl(38 95% 60%)"}}>Country ({context.country||"Local"}) Requirements</p><p className="text-[10px]" style={{color:"hsl(215 25% 60%)"}}>{doc.countryRequirements}</p></div>}
                                </div>}
                                {doc.relatedDocuments?.length>0&&<div>
                                  <p className="text-[10px] font-bold uppercase mb-1" style={{color:"hsl(215 25% 45%)"}}>Related Documents</p>
                                  <div className="flex flex-wrap gap-1">{doc.relatedDocuments.map((d:string,j:number)=><span key={j} className="text-[10px] px-2 py-0.5 rounded" style={{background:"hsl(216 45% 18%)",color:"hsl(215 25% 60%)"}}>{d}</span>)}</div>
                                </div>}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Document Control */}
            {r.documentControl&&(
              <div className="rounded-xl p-5" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{color:"hsl(217 91% 70%)"}}>Document Control System</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(r.documentControl).map(([key,val])=>(
                    <div key={key}><span className="text-[10px] font-bold uppercase" style={{color:"hsl(215 25% 45%)"}}>{key.replace(/([A-Z])/g," $1").trim()}: </span><span className="text-xs" style={{color:"hsl(210 40% 78%)"}}>{String(val)}</span></div>
                  ))}
                </div>
                {r.documentationChallenges?.length>0&&(
                  <div className="mt-3 pt-3" style={{borderTop:"1px solid hsl(var(--border))"}}>
                    <p className="text-[10px] font-bold uppercase mb-2" style={{color:"hsl(0 72% 68%)"}}>Common Documentation Pitfalls</p>
                    <div className="space-y-1">{r.documentationChallenges.map((c:string,i:number)=>(
                      <div key={i} className="flex items-start gap-1.5 text-[11px]"><AlertTriangle className="h-3 w-3 shrink-0 mt-0.5" style={{color:"hsl(0 72% 68%)"}}/><span style={{color:"hsl(210 40% 78%)"}}>{c}</span></div>
                    ))}</div>
                  </div>
                )}
              </div>
            )}

            {/* Records Retention */}
            {r.recordsRetention?.length>0&&(
              <div className="rounded-xl overflow-hidden" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                <div className="px-5 py-3" style={{background:"hsl(216 45% 11%)"}}><h3 className="text-sm font-bold" style={{color:"hsl(210 40% 92%)"}}>Records Retention Schedule</h3></div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead><tr style={{background:"hsl(216 45% 10%)"}}>
                      {["Record","Clause","Min. Retention","Legal Retention","Format","Owner","Location"].map(h=><th key={h} className="px-4 py-2.5 text-left font-semibold whitespace-nowrap" style={{color:"hsl(215 25% 45%)"}}>{h}</th>)}
                    </tr></thead>
                    <tbody>{r.recordsRetention.map((rec:any,i:number)=>(
                      <tr key={i} style={{borderTop:"1px solid hsl(var(--border))",background:i%2===0?"transparent":"hsl(216 45% 8% / 0.5)"}}>
                        <td className="px-4 py-2.5 font-medium" style={{color:"hsl(210 40% 85%)"}}>{rec.record}</td>
                        <td className="px-4 py-2.5" style={{color:selectedStd.color}}>{rec.clause||"—"}</td>
                        <td className="px-4 py-2.5 font-semibold" style={{color:"hsl(38 95% 60%)"}}>{rec.minimumRetention||rec.retention}</td>
                        <td className="px-4 py-2.5 font-semibold" style={{color:"hsl(0 72% 68%)"}}>{rec.legalRetention||"—"}</td>
                        <td className="px-4 py-2.5" style={{color:"hsl(215 25% 60%)"}}>{rec.format}</td>
                        <td className="px-4 py-2.5" style={{color:"hsl(158 64% 55%)"}}>{rec.responsibleParty||"—"}</td>
                        <td className="px-4 py-2.5" style={{color:"hsl(217 91% 70%)"}}>{rec.storageLocation||rec.location}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );

  // ── Self-Audit Tab ────────────────────────────────────────────────────────────
  const AuditTab = () => {
    // Keep static checklist as fallback while AI loads
    const staticItems = selectedStd.auditAreas.flatMap(area=>
      ["Policy & Procedures documented","Records maintained & up-to-date","Staff trained & competent"].map(sub=>({
        area, item:`${area}: ${sub}`, key:`${area}::${sub}`
      }))
    );
    const totalChecks = auditAI.result
      ? auditAI.result.auditGroups?.reduce((acc:number, g:any) => acc + (g.items?.length||0), 0)
      : staticItems.length;
    const checkedCount = Object.values(auditChecks).filter(Boolean).length;
    const auditProgress = totalChecks > 0 ? Math.round((checkedCount / totalChecks) * 100) : 0;

    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="rounded-xl p-5 flex items-center justify-between flex-wrap gap-4" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
          <div>
            <h2 className="text-base font-bold" style={{color:"hsl(210 40% 92%)"}}>Internal Self-Audit Checklist</h2>
            <p className="text-xs mt-0.5" style={{color:"hsl(215 25% 55%)"}}>AI-generated audit questions specific to {selectedStd.code} · {context.industry||"your industry"} · {context.country||"your country"}</p>
          </div>
          <div className="flex items-center gap-3">
            <RunBtn
              onClick={()=>auditAI.analyze(`${contextText()}\n\nGenerate a comprehensive internal self-audit checklist for ${selectedStd.code}. Be 100% specific to this company's industry (${context.industry||"general"}), activity (${context.activity||"general business"}), size (${context.employees||"medium"}), and country (${context.country||"MENA"}). Include items that are most commonly failed by companies in this sector.`)}
              loading={auditAI.loading} label="Generate AI Checklist" loadingLabel="Building checklist..." icon={CheckSquare} color={selectedStd.color}
            />
            <button onClick={()=>setAuditChecks({})} className="px-3 py-2 rounded-lg text-xs font-semibold" style={{background:"hsl(0 72% 51%/0.12)",color:"hsl(0 72% 68%)"}}>Reset</button>
          </div>
        </div>

        {/* Progress */}
        <div className="rounded-xl p-5" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-bold" style={{color:"hsl(210 40% 92%)"}}>Audit Progress</p>
              <p className="text-xs mt-0.5" style={{color:"hsl(215 25% 50%)"}}>{checkedCount} of {totalChecks} items checked</p>
            </div>
            <p className="text-4xl font-black" style={{color:auditProgress>=80?"hsl(158 64% 55%)":auditProgress>=50?"hsl(38 95% 60%)":"hsl(0 72% 68%)"}}>{auditProgress}%</p>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{background:"hsl(216 45% 18%)"}}>
            <div className="h-3 rounded-full transition-all duration-500" style={{width:`${auditProgress}%`,background:auditProgress>=80?"hsl(158 64% 45%)":"hsl(38 95% 52%)"}}/>
          </div>
          <div className="flex justify-between mt-2 text-[10px]" style={{color:"hsl(215 25% 40%)"}}>
            <span>0% — Not Started</span><span>50% — In Progress</span><span>80% — Pre-Audit Ready</span><span>100% — Audit Ready</span>
          </div>
        </div>

        {auditAI.error&&<ErrorBanner msg={auditAI.error}/>}
        {auditAI.loading&&<LoadingCard msg={`Building ${selectedStd.code} self-audit checklist for ${context.industry||"your company"}...`}/>}

        {/* AI-Generated Checklist */}
        {auditAI.result&&!auditAI.loading&&(()=>{
          const r=auditAI.result;
          const groups:any[]=r.auditGroups||[];
          return (
            <div className="space-y-4">
              {/* Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  {l:"Total Checklist Items",v:r.totalItems,c:"hsl(38 95% 60%)"},
                  {l:"Audit Groups",v:groups.length,c:"hsl(158 64% 55%)"},
                  {l:"Estimated Audit Duration",v:r.estimatedAuditDays,c:"hsl(217 91% 70%)"},
                  {l:"Items Completed",v:`${checkedCount}/${r.totalItems}`,c:auditProgress>=80?"hsl(158 64% 55%)":"hsl(38 95% 60%)"},
                ].map((m,i)=>(
                  <div key={i} className="rounded-xl p-4 text-center" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                    <p className="text-lg font-black" style={{color:m.c}}>{m.v}</p>
                    <p className="text-[10px] mt-1" style={{color:"hsl(215 25% 50%)"}}>{m.l}</p>
                  </div>
                ))}
              </div>

              {/* Audit Preparation */}
              {r.auditPreparation?.length>0&&(
                <div className="rounded-xl p-4" style={{background:"hsl(217 91% 70%/0.06)",border:"1px solid hsl(217 91% 70%/0.2)"}}>
                  <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{color:"hsl(217 91% 70%)"}}>Before You Start — Audit Preparation</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                    {r.auditPreparation.map((p:string,i:number)=>(
                      <div key={i} className="flex items-start gap-2 text-[11px]"><CheckSquare className="h-3 w-3 shrink-0 mt-0.5" style={{color:"hsl(217 91% 70%)"}}/><span style={{color:"hsl(210 40% 78%)"}}>{p}</span></div>
                    ))}
                  </div>
                </div>
              )}

              {/* Audit Groups */}
              {groups.map((group:any, gi:number)=>{
                const groupItems:any[] = group.items||[];
                const groupChecked = groupItems.filter((item:any)=>auditChecks[item.id]).length;
                const groupPct = groupItems.length>0 ? Math.round((groupChecked/groupItems.length)*100) : 0;
                const col = group.color || selectedStd.color;
                const majorItems = groupItems.filter((i:any)=>i.criticality==="Major");
                const majorFailed = majorItems.filter((i:any)=>!auditChecks[i.id]).length;
                return (
                  <div key={gi} className="rounded-xl overflow-hidden" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                    {/* Group header */}
                    <div className="px-5 py-4" style={{background:`${col}06`,borderBottom:"1px solid hsl(var(--border))"}}>
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0" style={{background:`${col}18`,border:`1px solid ${col}35`}}>
                            <span className="text-[10px] font-black" style={{color:col}}>{group.clauseRef}</span>
                          </div>
                          <div>
                            <p className="text-sm font-bold" style={{color:"hsl(210 40% 92%)"}}>{group.groupName}</p>
                            <p className="text-[10px]" style={{color:"hsl(215 25% 50%)"}}>{groupItems.length} items · {groupChecked} checked{majorFailed>0?` · ⚠ ${majorFailed} major items pending`:""}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-32">
                            <div className="h-2 rounded-full" style={{background:"hsl(216 45% 18%)"}}>
                              <div className="h-2 rounded-full transition-all" style={{width:`${groupPct}%`,background:groupPct===100?"hsl(158 64% 45%)":col}}/>
                            </div>
                          </div>
                          <span className="text-sm font-black w-10 text-right" style={{color:groupPct===100?"hsl(158 64% 55%)":col}}>{groupPct}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Checklist items */}
                    <div className="divide-y" style={{borderColor:"hsl(var(--border))"}}>
                      {groupItems.map((item:any, ii:number)=>{
                        const checked = !!auditChecks[item.id];
                        const critC = item.criticality==="Major"?"hsl(0 72% 68%)":item.criticality==="Minor"?"hsl(38 95% 60%)":"hsl(217 91% 70%)";
                        return (
                          <div key={item.id} className="px-5 py-3 transition-all" style={{background:checked?"hsl(158 64% 40%/0.04)":"transparent"}}>
                            <div className="flex items-start gap-3">
                              {/* Checkbox */}
                              <button onClick={()=>setAuditChecks(p=>({...p,[item.id]:!p[item.id]}))}
                                className="flex h-6 w-6 items-center justify-center rounded-lg shrink-0 mt-0.5 transition-all"
                                style={{background:checked?"hsl(158 64% 45%)":"hsl(216 45% 18%)",border:`2px solid ${checked?"hsl(158 64% 45%)":"hsl(215 25% 35%)"}`}}>
                                {checked&&<CheckCircle2 className="h-4 w-4" style={{color:"white"}}/>}
                              </button>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start gap-2 flex-wrap">
                                  <span className="text-xs font-semibold flex-1" style={{color:checked?"hsl(215 25% 45%)":"hsl(210 40% 85%)",textDecoration:checked?"line-through":"none"}}>{item.question}</span>
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full" style={{background:`${critC}15`,color:critC}}>{item.criticality}</span>
                                    <span className="text-[9px] px-1.5 py-0.5 rounded" style={{background:"hsl(216 45% 18%)",color:"hsl(215 25% 50%)"}}>{item.clause}</span>
                                  </div>
                                </div>
                                {!checked&&(
                                  <div className="mt-1.5 grid grid-cols-1 md:grid-cols-3 gap-1.5">
                                    <div className="text-[10px]"><span style={{color:"hsl(215 25% 40%)"}}>Evidence: </span><span style={{color:"hsl(215 25% 60%)"}}>{item.evidenceRequired}</span></div>
                                    <div className="text-[10px]"><span style={{color:"hsl(215 25% 40%)"}}>Method: </span><span style={{color:"hsl(217 91% 65%)"}}>{item.auditMethod}</span></div>
                                    {item.industryNote&&<div className="text-[10px]"><span style={{color:"hsl(38 95% 52%)"}}>Note: </span><span style={{color:"hsl(215 25% 60%)"}}>{item.industryNote}</span></div>}
                                  </div>
                                )}
                                {!checked&&item.commonFailure&&(
                                  <div className="mt-1 text-[10px] flex items-start gap-1"><AlertTriangle className="h-3 w-3 shrink-0 mt-0.5" style={{color:"hsl(0 72% 68%)"}}/><span style={{color:"hsl(0 72% 65%)"}}>{item.commonFailure}</span></div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Audit Conclusion */}
              {r.auditConclusion&&(
                <div className="rounded-xl p-5" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                  <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{color:"hsl(38 95% 60%)"}}>Audit Conclusion Criteria</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-lg p-3" style={{background:"hsl(158 64% 40%/0.08)",border:"1px solid hsl(158 64% 40%/0.2)"}}>
                      <p className="text-[10px] font-bold uppercase mb-1" style={{color:"hsl(158 64% 55%)"}}>✅ Pass Criteria</p>
                      <p className="text-xs" style={{color:"hsl(210 40% 78%)"}}>{r.auditConclusion.passCriteria}</p>
                    </div>
                    <div className="rounded-lg p-3" style={{background:"hsl(0 72% 51%/0.08)",border:"1px solid hsl(0 72% 51%/0.2)"}}>
                      <p className="text-[10px] font-bold uppercase mb-1" style={{color:"hsl(0 72% 68%)"}}>❌ Fail Criteria</p>
                      <p className="text-xs" style={{color:"hsl(210 40% 78%)"}}>{r.auditConclusion.failCriteria}</p>
                    </div>
                  </div>
                  {r.auditConclusion.reportingRequirements?.length>0&&(
                    <div className="mt-3">
                      <p className="text-[10px] font-bold uppercase mb-2" style={{color:"hsl(215 25% 45%)"}}>Reporting Requirements</p>
                      <div className="flex flex-wrap gap-1.5">{r.auditConclusion.reportingRequirements.map((req:string,i:number)=>(
                        <span key={i} className="text-[10px] px-2.5 py-1 rounded-lg" style={{background:"hsl(216 45% 16%)",color:"hsl(215 25% 62%)"}}>{req}</span>
                      ))}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })()}

        {/* Static fallback checklist when no AI result yet */}
        {!auditAI.result&&!auditAI.loading&&(
          <div className="space-y-3">
            <div className="rounded-xl p-4" style={{background:"hsl(38 95% 52%/0.06)",border:"1px solid hsl(38 95% 52%/0.2)"}}>
              <p className="text-xs" style={{color:"hsl(38 95% 60%)"}}>💡 Click "Generate AI Checklist" above for a detailed, industry-specific audit checklist with evidence requirements, criticality ratings, and common failure points. The basic checklist below is shown as a starting point.</p>
            </div>
            {selectedStd.auditAreas.map((area,ai)=>{
              const areaItems=staticItems.filter(c=>c.area===area);
              const areaChecked=areaItems.filter(c=>auditChecks[c.key]).length;
              const areaColor=areaChecked===areaItems.length?"hsl(158 64% 55%)":areaChecked>0?"hsl(38 95% 60%)":"hsl(215 25% 50%)";
              return(
                <div key={ai} className="rounded-xl p-4" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold" style={{color:"hsl(210 40% 88%)"}}>{area}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{background:`${areaColor}15`,color:areaColor}}>{areaChecked}/{areaItems.length}</span>
                  </div>
                  <div className="space-y-2">
                    {areaItems.map((item,j)=>(
                      <label key={j} className="flex items-center gap-3 cursor-pointer">
                        <div className="flex h-5 w-5 items-center justify-center rounded-md shrink-0" style={{background:auditChecks[item.key]?"hsl(158 64% 45%)":"hsl(216 45% 18%)",border:`1px solid ${auditChecks[item.key]?"hsl(158 64% 45%)":"hsl(215 25% 35%)"}`}}
                          onClick={()=>setAuditChecks(p=>({...p,[item.key]:!p[item.key]}))}>
                          {auditChecks[item.key]&&<CheckCircle2 className="h-3.5 w-3.5" style={{color:"white"}}/>}
                        </div>
                        <span className="text-xs" style={{color:auditChecks[item.key]?"hsl(215 25% 45%)":"hsl(210 40% 78%)",textDecoration:auditChecks[item.key]?"line-through":"none"}}>{item.item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // ── Certification Path Tab ────────────────────────────────────────────────────
  const PathTab = () => {
    const steps=[
      {n:1,title:"Initial Gap Analysis",desc:"Assess current state against all ISO clauses and identify compliance gaps",duration:"2–4 weeks",owner:"Management + Consultant"},
      {n:2,title:"Management Commitment",desc:"CEO and top management formally commit to certification with signed policy",duration:"1 week",owner:"CEO / Board"},
      {n:3,title:"Appoint Management Representative",desc:"Designate an internal ISO champion responsible for implementation",duration:"1 week",owner:"HR + CEO"},
      {n:4,title:"Training & Awareness",desc:"Train all relevant staff on the standard requirements and their roles",duration:"2–6 weeks",owner:"ISO Champion + HR"},
      {n:5,title:"Documentation Development",desc:"Create all mandatory and supporting documents, procedures and records",duration:"6–12 weeks",owner:"Process Owners"},
      {n:6,title:"System Implementation",desc:"Roll out new processes, procedures and controls across all departments",duration:"8–16 weeks",owner:"All Departments"},
      {n:7,title:"Internal Audit",desc:"Conduct at least one full internal audit cycle to verify compliance",duration:"2–3 weeks",owner:"Internal Auditor"},
      {n:8,title:"Management Review",desc:"Top management reviews the system performance and sets improvement objectives",duration:"1 day",owner:"CEO + Management"},
      {n:9,title:"Certification Audit Stage 1",desc:"Certification body reviews documentation and confirms readiness for Stage 2",duration:"1–2 days",owner:"Certification Body"},
      {n:10,title:"Certification Audit Stage 2",desc:"On-site audit of full system implementation — certificate issued upon passing",duration:"2–5 days",owner:"Certification Body"},
    ];
    const bodies=[
      {name:"BSI Group",country:"UK / Global",website:"bsigroup.com",specialty:"Most recognized globally"},
      {name:"Bureau Veritas",country:"France / Global",website:"bureauveritas.com",specialty:"Strong in MENA"},
      {name:"SGS SA",country:"Switzerland / Global",website:"sgs.com",specialty:"Largest network"},
      {name:"TÜV Rheinland",country:"Germany / Global",website:"tuv.com",specialty:"Strong in manufacturing"},
      {name:"DNV",country:"Norway / Global",website:"dnv.com",specialty:"Oil & gas, energy"},
      {name:"Intertek",country:"UK / Global",website:"intertek.com",specialty:"Consumer products"},
      {name:"LRQA",country:"UK / Global",website:"lrqa.com",specialty:"Quality & risk"},
      {name:"NQA",country:"UK / Global",website:"nqa.com",specialty:"Cost-effective option"},
      {name:"Gulf Certification",country:"UAE / MENA",website:"gulfcert.ae",specialty:"MENA specialist"},
    ];
    return (
      <div className="space-y-5">
        {/* 10-step roadmap */}
        <div className="rounded-xl p-5" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
          <h2 className="text-base font-bold mb-5" style={{color:"hsl(210 40% 92%)"}}>10-Step Certification Roadmap — {selectedStd.code}</h2>
          <div className="space-y-3">
            {steps.map((step,i)=>{
              const c=i<3?"hsl(38 95% 60%)":i<6?"hsl(158 64% 55%)":i<8?"hsl(217 91% 70%)":"hsl(280 80% 70%)";
              return(
                <div key={i} className="flex items-start gap-4 p-4 rounded-xl" style={{background:"hsl(216 45% 11%)"}}>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0" style={{background:`${c}18`,border:`2px solid ${c}40`}}>
                    <span className="text-sm font-black" style={{color:c}}>{step.n}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <span className="text-sm font-bold" style={{color:"hsl(210 40% 92%)"}}>{step.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full" style={{background:`${c}12`,color:c}}>{step.duration}</span>
                    </div>
                    <p className="text-xs" style={{color:"hsl(215 25% 60%)"}}>{step.desc}</p>
                    <p className="text-[10px] mt-1" style={{color:"hsl(215 25% 45%)"}}><span style={{color:"hsl(215 25% 38%)"}}>Owner:</span> {step.owner}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Certification Bodies */}
        <div className="rounded-xl p-5" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
          <h2 className="text-sm font-bold mb-4" style={{color:"hsl(210 40% 92%)"}}>Accredited Certification Bodies</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {bodies.map((body,i)=>(
              <div key={i} className="rounded-xl p-4" style={{background:"hsl(216 45% 11%)"}}>
                <p className="text-sm font-bold mb-1" style={{color:"hsl(210 40% 88%)"}}>{body.name}</p>
                <p className="text-[10px] mb-1" style={{color:"hsl(215 25% 50%)"}}>{body.country}</p>
                <p className="text-[10px] mb-2" style={{color:"hsl(38 95% 55%)"}}>{body.specialty}</p>
                <a href={`https://${body.website}`} target="_blank" rel="noreferrer" className="text-[10px] underline inline-flex items-center gap-1" style={{color:"hsl(217 91% 70%)"}}>{body.website} <ArrowUpRight className="h-3 w-3"/></a>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ── Training Tab ──────────────────────────────────────────────────────────────
  const TrainingTab = () => (
    <div className="space-y-4">
      <div className="rounded-xl p-5" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
        <h2 className="text-base font-bold mb-4" style={{color:"hsl(210 40% 92%)"}}>Training & Competence Requirements — {selectedStd.code}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {role:"Top Management / CEO",courses:["ISO Awareness (Executive)","Understanding of standard requirements","Management Review process","Strategic context & objectives setting"],hours:"4–8",cert:"Not mandatory"},
            {role:"ISO Management Representative",courses:["ISO Lead Implementer (5-day)","Internal Auditor (3-day)","Documentation skills","Change management"],hours:"40+",cert:"Lead Implementer"},
            {role:"Internal Auditors",courses:["ISO Internal Auditor (3-day)","Audit techniques & reporting","Non-conformity management"],hours:"24",cert:"Internal Auditor"},
            {role:"Department Heads",courses:["ISO Awareness","Process management","Risk & opportunity identification","KPI setting & monitoring"],hours:"8–16",cert:"Not mandatory"},
            {role:"All Staff",courses:["ISO Awareness (all-staff)","Process & procedure training","Roles & responsibilities","Incident/nonconformity reporting"],hours:"4–8",cert:"Not mandatory"},
            {role:"External Auditors (optional)",courses:["Hire certified external auditor for pre-certification mock audit"],hours:"16–24",cert:"Lead Auditor (external)"},
          ].map((t,i)=>(
            <div key={i} className="rounded-xl p-4" style={{background:"hsl(216 45% 11%)"}}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold" style={{color:"hsl(210 40% 88%)"}}>{t.role}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full" style={{background:"hsl(38 95% 52% / 0.12)",color:"hsl(38 95% 60%)"}}>{t.hours}h</span>
              </div>
              <div className="space-y-1.5 mb-3">
                {t.courses.map((c,j)=>(
                  <div key={j} className="flex items-start gap-2 text-[11px]">
                    <BookOpen className="h-3 w-3 shrink-0 mt-0.5" style={{color:selectedStd.color}}/>
                    <span style={{color:"hsl(215 25% 65%)"}}>{c}</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px]"><span style={{color:"hsl(215 25% 40%)"}}>Certification:</span> <span style={{color:"hsl(158 64% 55%)"}}>{t.cert}</span></p>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl p-5" style={{background:"hsl(38 95% 52% / 0.05)",border:"1px solid hsl(38 95% 52% / 0.2)"}}>
        <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{color:"hsl(38 95% 60%)"}}>Recommended Training Providers (MENA)</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          {["BSI Training — bsi-training.com","Bureau Veritas Academy — bureauveritas.com/academy","SGS Academy — sgs.com/academy","TÜV Rheinland Academy — tuv.com/academy","Intertek Academy — intertek.com/training","Local consultants (check IRCA accreditation)","Online: Coursera, LinkedIn Learning (ISO fundamentals)","IRCA Registered Training Organizations — irca.org"].map((p,i)=>(
            <div key={i} className="flex items-center gap-2"><Star className="h-3 w-3 shrink-0" style={{color:"hsl(38 95% 55%)"}}/><span style={{color:"hsl(210 40% 78%)"}}>{p}</span></div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── Risks Tab ─────────────────────────────────────────────────────────────────
  const RisksTab = () => (
    <div className="space-y-4">
      <div className="rounded-xl p-5 flex items-center justify-between flex-wrap gap-4" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
        <div>
          <h2 className="text-base font-bold" style={{color:"hsl(210 40% 92%)"}}>ISO Implementation & Compliance Risks</h2>
          <p className="text-xs mt-0.5" style={{color:"hsl(215 25% 55%)"}}>Full risk assessment for {selectedStd.code} certification journey</p>
        </div>
        <RunBtn onClick={()=>riskAI.analyze(`${contextText()}\n\nIdentify all risks related to implementing and maintaining ${selectedStd.code} for this specific company.`)} loading={riskAI.loading} label="Assess All Risks" loadingLabel="Assessing..." icon={AlertCircle} color={selectedStd.color}/>
      </div>
      {riskAI.error&&<ErrorBanner msg={riskAI.error}/>}
      {riskAI.loading&&<LoadingCard msg="Assessing implementation and compliance risks..."/>}
      {riskAI.result&&!riskAI.loading&&(()=>{
        const r=riskAI.result;
        return (
          <div className="space-y-4">
            {/* Risk Summary */}
            {r.riskSummary&&(
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  {l:"Total Risks",v:r.riskSummary.totalRisks,c:"hsl(215 25% 60%)"},
                  {l:"Critical Risks",v:r.riskSummary.criticalCount,c:"hsl(0 72% 68%)"},
                  {l:"High Risks",v:r.riskSummary.highCount,c:"hsl(38 95% 60%)"},
                  {l:"Top Concern",v:r.riskSummary.topConcern?.substring(0,40)+"...",c:"hsl(280 80% 70%)"},
                ].map((m,i)=>(
                  <div key={i} className="rounded-xl p-4" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{color:"hsl(215 25% 45%)"}}>{m.l}</p>
                    <p className="text-sm font-bold" style={{color:m.c}}>{m.v}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Risk Matrix */}
            {r.riskMatrix&&(
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[{l:"Critical",items:r.riskMatrix.critical,c:"hsl(0 72% 68%)"},{l:"High",items:r.riskMatrix.high,c:"hsl(38 95% 60%)"},{l:"Medium",items:r.riskMatrix.medium,c:"hsl(217 91% 70%)"},{l:"Low",items:r.riskMatrix.low,c:"hsl(158 64% 55%)"}].map(cat=>(
                  <div key={cat.l} className="rounded-xl p-4" style={{background:"hsl(var(--card))",border:`1px solid ${cat.c}30`}}>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{color:cat.c}}>{cat.l} ({cat.items?.length||0})</p>
                    <div className="space-y-1">{(cat.items||[]).slice(0,4).map((risk:string,i:number)=><p key={i} className="text-[10px]" style={{color:"hsl(215 25% 60%)"}}>{risk}</p>)}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Implementation Risks */}
            {r.implementationRisks?.length>0&&(
              <div className="space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-widest px-1" style={{color:"hsl(215 25% 45%)"}}>Implementation Risks</p>
                {r.implementationRisks.map((risk:any,i:number)=>{
                  const isEx=expandedRisk===i;
                  const lc=risk.likelihood==="High"?"hsl(0 72% 68%)":risk.likelihood==="Medium"?"hsl(38 95% 60%)":"hsl(158 64% 55%)";
                  const ic=risk.impact==="High"?"hsl(0 72% 68%)":risk.impact==="Medium"?"hsl(38 95% 60%)":"hsl(158 64% 55%)";
                  const score=risk.riskScore||0;
                  const sc=score>=15?"hsl(0 72% 68%)":score>=8?"hsl(38 95% 60%)":"hsl(158 64% 55%)";
                  return(
                    <div key={i} className="rounded-xl overflow-hidden" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                      <button onClick={()=>setExpandedRisk(isEx?null:i)} className="w-full flex items-center gap-3 px-5 py-4 text-left">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0" style={{background:`${sc}15`}}>
                          <span className="text-xs font-black" style={{color:sc}}>{score}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold" style={{color:"hsl(210 40% 88%)"}}>{risk.riskId&&<span className="mr-1.5 text-[10px]" style={{color:"hsl(215 25% 45%)"}}>{risk.riskId}</span>}{risk.risk}</p>
                          <p className="text-[10px] mt-0.5" style={{color:"hsl(215 25% 50%)"}}>{risk.category}{risk.industryBenchmark?` · ${risk.industryBenchmark}`:""}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="text-center"><p className="text-[9px]" style={{color:"hsl(215 25% 45%)"}}>Likelihood</p><StatusBadge status={risk.likelihood}/></div>
                          <div className="text-center"><p className="text-[9px]" style={{color:"hsl(215 25% 45%)"}}>Impact</p><StatusBadge status={risk.impact}/></div>
                        </div>
                        {isEx?<ChevronUp className="h-4 w-4 shrink-0" style={{color:"hsl(215 25% 45%)"}}/>:<ChevronDown className="h-4 w-4 shrink-0" style={{color:"hsl(215 25% 45%)"}}/>}
                      </button>
                      {isEx&&(
                        <div className="px-5 pb-4 space-y-3" style={{borderTop:"1px solid hsl(var(--border))"}}>
                          <div className="grid grid-cols-2 gap-3 pt-3">
                            {(risk.specificCauses||risk.causes)?.length>0&&<div><p className="text-[10px] font-bold uppercase mb-1.5" style={{color:"hsl(0 72% 68%)"}}>Root Causes</p><div className="space-y-1">{(risk.specificCauses||risk.causes).map((c:string,j:number)=><p key={j} className="text-[10px]" style={{color:"hsl(215 25% 62%)"}}>{j+1}. {c}</p>)}</div></div>}
                            {(risk.potentialConsequences||risk.consequences)?.length>0&&<div><p className="text-[10px] font-bold uppercase mb-1.5" style={{color:"hsl(38 95% 60%)"}}>Consequences</p><div className="space-y-1">{(risk.potentialConsequences||risk.consequences).map((c:string,j:number)=><p key={j} className="text-[10px]" style={{color:"hsl(215 25% 62%)"}}>{j+1}. {c}</p>)}</div></div>}
                          </div>
                          {(risk.preventiveControls||risk.controls)?.length>0&&<div><p className="text-[10px] font-bold uppercase mb-1.5" style={{color:"hsl(217 91% 70%)"}}>Preventive Controls</p><div className="space-y-1">{(risk.preventiveControls||risk.controls).map((c:string,j:number)=><div key={j} className="flex items-start gap-1.5 text-[10px]"><CheckCircle2 className="h-3 w-3 shrink-0 mt-0.5" style={{color:"hsl(217 91% 70%)"}}/><span style={{color:"hsl(215 25% 65%)"}}>{c}</span></div>)}</div></div>}
                          {(risk.mitigationActions||risk.mitigation)?.length>0&&<div><p className="text-[10px] font-bold uppercase mb-1.5" style={{color:"hsl(158 64% 55%)"}}>Mitigation Actions</p><div className="space-y-1">{(risk.mitigationActions||risk.mitigation).map((m:string,j:number)=><div key={j} className="flex items-start gap-1.5 text-[10px]"><CheckCircle2 className="h-3 w-3 shrink-0 mt-0.5" style={{color:"hsl(158 64% 55%)"}}/><span style={{color:"hsl(215 25% 65%)"}}>{m}</span></div>)}</div></div>}
                          <div className="flex items-center gap-4 text-[10px]">
                            <span><span style={{color:"hsl(215 25% 40%)"}}>Owner:</span> <span style={{color:"hsl(38 95% 55%)"}}>{risk.owner}</span></span>
                            <span><span style={{color:"hsl(215 25% 40%)"}}>Review:</span> <span style={{color:"hsl(217 91% 70%)"}}>{risk.reviewFrequency}</span></span>
                            <span><span style={{color:"hsl(215 25% 40%)"}}>Residual Risk:</span> <StatusBadge status={risk.residualRisk}/></span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Country + Industry Specific Risks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {r.countrySpecificRisks?.length>0&&(
                <div className="rounded-xl p-5" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                  <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{color:"hsl(38 95% 60%)"}}>Country-Specific Risks ({context.country||"Your Country"})</p>
                  <div className="space-y-3">{r.countrySpecificRisks.map((risk:any,i:number)=>(
                    <div key={i} className="p-3 rounded-xl" style={{background:"hsl(216 45% 11%)"}}>
                      <p className="text-[11px] font-semibold mb-1" style={{color:"hsl(210 40% 88%)"}}>{risk.risk}</p>
                      <p className="text-[10px]" style={{color:"hsl(215 25% 50%)"}}><span style={{color:"hsl(215 25% 40%)"}}>Source:</span> {risk.source}</p>
                      <p className="text-[10px]" style={{color:"hsl(158 64% 55%)"}}><span style={{color:"hsl(215 25% 40%)"}}>Response:</span> {risk.response}</p>
                    </div>
                  ))}</div>
                </div>
              )}
              {r.industrySpecificRisks?.length>0&&(
                <div className="rounded-xl p-5" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                  <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{color:"hsl(217 91% 70%)"}}>Industry-Specific Risks ({context.industry||"Your Sector"})</p>
                  <div className="space-y-3">{r.industrySpecificRisks.map((risk:any,i:number)=>(
                    <div key={i} className="p-3 rounded-xl" style={{background:"hsl(216 45% 11%)"}}>
                      <p className="text-[11px] font-semibold mb-1" style={{color:"hsl(210 40% 88%)"}}>{risk.risk}</p>
                      <p className="text-[10px]" style={{color:"hsl(215 25% 50%)"}}><span style={{color:"hsl(215 25% 40%)"}}>Trigger:</span> {risk.triggerEvent}</p>
                      <p className="text-[10px]" style={{color:"hsl(158 64% 55%)"}}><span style={{color:"hsl(215 25% 40%)"}}>Mitigation:</span> {risk.mitigation}</p>
                    </div>
                  ))}</div>
                </div>
              )}
            </div>

            {/* Compliance Risks */}
            {r.complianceRisks?.length>0&&(
              <div className="rounded-xl overflow-hidden" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                <div className="px-5 py-3" style={{background:"hsl(216 45% 11%)"}}><h3 className="text-sm font-bold" style={{color:"hsl(210 40% 92%)"}}>Compliance Risks (Audit Failure Points)</h3></div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead><tr style={{background:"hsl(216 45% 10%)"}}>
                      {["Risk","ISO Clause","Likelihood","Audit Impact","Local Regulation","Control"].map(h=><th key={h} className="px-3 py-2.5 text-left font-semibold whitespace-nowrap" style={{color:"hsl(215 25% 45%)"}}>{h}</th>)}
                    </tr></thead>
                    <tbody>{r.complianceRisks.map((cr:any,i:number)=>(
                      <tr key={i} style={{borderTop:"1px solid hsl(var(--border))",background:i%2===0?"transparent":"hsl(216 45% 8%/0.5)"}}>
                        <td className="px-3 py-2.5 font-medium" style={{color:"hsl(210 40% 85%)"}}>{cr.risk}</td>
                        <td className="px-3 py-2.5 font-semibold" style={{color:selectedStd.color}}>{cr.isoClause||cr.clause}</td>
                        <td className="px-3 py-2.5"><StatusBadge status={cr.likelihood}/></td>
                        <td className="px-3 py-2.5"><StatusBadge status={cr.auditImpact||cr.impact}/></td>
                        <td className="px-3 py-2.5" style={{color:"hsl(38 95% 60%)"}}>{cr.countryRegulation||"—"}</td>
                        <td className="px-3 py-2.5" style={{color:"hsl(215 25% 55%)"}}>{cr.control}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Top Priorities + Monitoring */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {r.topPriorities?.length>0&&<div className="rounded-xl p-5" style={{background:"hsl(0 72% 51% / 0.05)",border:"1px solid hsl(0 72% 51% / 0.2)"}}>
                <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{color:"hsl(0 72% 68%)"}}>Top Risk Mitigation Priorities</p>
                <div className="space-y-2">{r.topPriorities.map((p:string,i:number)=><div key={i} className="flex items-start gap-2 text-xs"><AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{color:"hsl(0 72% 68%)"}}/><span style={{color:"hsl(210 40% 78%)"}}>{p}</span></div>)}</div>
              </div>}
              {r.monitoringPlan?.length>0&&<div className="rounded-xl p-5" style={{background:"hsl(158 64% 40% / 0.05)",border:"1px solid hsl(158 64% 40% / 0.2)"}}>
                <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{color:"hsl(158 64% 55%)"}}>Risk Monitoring Plan</p>
                <div className="space-y-2">{(typeof r.monitoringPlan[0]==="string"?r.monitoringPlan.map((m:string)=>({risk:m})):r.monitoringPlan).map((m:any,i:number)=>(
                  <div key={i} className="p-2.5 rounded-lg" style={{background:"hsl(216 45% 12%)"}}>
                    <p className="text-[11px] font-semibold" style={{color:"hsl(210 40% 85%)"}}>{m.risk||m}</p>
                    {m.indicator&&<p className="text-[10px] mt-0.5"><span style={{color:"hsl(215 25% 40%)"}}>Indicator:</span> <span style={{color:"hsl(158 64% 55%)"}}>{m.indicator}</span></p>}
                    {m.threshold&&<p className="text-[10px]"><span style={{color:"hsl(215 25% 40%)"}}>Threshold:</span> <span style={{color:"hsl(38 95% 55%)"}}>{m.threshold}</span></p>}
                    {m.frequency&&<p className="text-[10px]"><span style={{color:"hsl(215 25% 40%)"}}>Frequency:</span> <span style={{color:"hsl(217 91% 70%)"}}>{m.frequency}</span></p>}
                  </div>
                ))}</div>
              </div>}
            </div>
          </div>
        );
      })()}
      {!riskAI.result&&!riskAI.loading&&!riskAI.error&&<div className="rounded-xl p-12 text-center" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
        <AlertCircle className="h-14 w-14 mx-auto mb-4 opacity-15" style={{color:selectedStd.color}}/>
        <p className="font-semibold" style={{color:"hsl(215 25% 55%)"}}>Click "Assess All Risks" for a complete risk register</p>
        <p className="text-xs mt-1" style={{color:"hsl(215 25% 38%)"}}>Country-specific · Industry-specific · Compliance risks · Monitoring plan</p>
      </div>}
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="rounded-2xl p-6 relative overflow-hidden" style={{background:"linear-gradient(135deg,hsl(216 52% 10%),hsl(216 52% 13%))",border:`1px solid ${selectedStd.color}25`}}>
        <div className="absolute inset-0 opacity-5" style={{backgroundImage:`radial-gradient(circle at 70% 30%, ${selectedStd.color}, transparent 60%)`}}/>
        <div className="relative flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <selectedStd.icon className="h-5 w-5" style={{color:selectedStd.color}}/>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{background:`${selectedStd.color}18`,color:selectedStd.color}}>ISO PREPARATION PLATFORM</span>
            </div>
            <h1 className="text-2xl font-bold font-display" style={{color:"hsl(210 40% 94%)"}}>ISO Certification Preparation</h1>
            <p className="text-sm mt-1" style={{color:"hsl(215 25% 60%)"}}>Selected: <span className="font-semibold" style={{color:selectedStd.color}}>{selectedStd.code} — {selectedStd.name}</span></p>
          </div>
          <div className="flex flex-wrap gap-2">
            {ISO_STANDARDS.map(std=>(
              <button key={std.id} onClick={()=>{setSelectedStd(std);setActiveTab("overview");}}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all"
                style={{background:selectedStd.id===std.id?`${std.color}18`:"hsl(216 45% 14%)",color:selectedStd.id===std.id?std.color:"hsl(215 25% 55%)",border:`1px solid ${selectedStd.id===std.id?`${std.color}40`:"hsl(216 45% 22%)"}`}}>
                <std.icon className="h-3 w-3"/>
                {std.id === "20000" ? "20000" : std.id}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {TABS.map(tab=>(
          <button key={tab.key} onClick={()=>setActiveTab(tab.key)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all"
            style={{background:activeTab===tab.key?`${selectedStd.color}18`:"hsl(var(--card))",color:activeTab===tab.key?selectedStd.color:"hsl(215 25% 55%)",border:`1px solid ${activeTab===tab.key?`${selectedStd.color}40`:"hsl(var(--border))"}`,}}>
            <tab.icon className="h-3.5 w-3.5"/>{tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab==="overview"  && <OverviewTab/>}
      {activeTab==="gap"       && <GapTab/>}
      {activeTab==="action"    && <ActionTab/>}
      {activeTab==="documents" && <DocumentsTab/>}
      {activeTab==="audit"     && <AuditTab/>}
      {activeTab==="path"      && <PathTab/>}
      {activeTab==="training"  && <TrainingTab/>}
      {activeTab==="risks"     && <RisksTab/>}
    </div>
  );
}
