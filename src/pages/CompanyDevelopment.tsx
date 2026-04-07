import { useState } from "react";
import {
  Building2, Users, GitBranch, DollarSign, TrendingUp, AlertTriangle,
  CheckCircle2, ChevronDown, UserPlus, Star, ArrowUpRight, RefreshCw,
  Network, FileText, Briefcase, Play, ChevronUp, Info, Lock,
  ClipboardList, BarChart2, Target, Layers, Settings2, Globe, Zap
} from "lucide-react";
import { useClaudeAnalysis } from "@/hooks/useClaudeAnalysis";
import { AIDisclaimer } from "@/components/ai/AIDisclaimer";

interface CompanyProfile {
  name:string; country:string; city:string; region:string;
  industry:string; activity:string; type:string; size:string;
  employees:string; revenue:string; jobTypes:string;
  workNature:string; founded:string; vision:string; challenges:string;
}
type Tab="profile"|"org"|"departments"|"processes"|"roles"|"relations"|"hiring"|"salaries"|"recommendations";

// ── UI Atoms ─────────────────────────────────────────────────────────────────
function Err({msg}:{msg:string}){return(
  <div className="rounded-xl p-4 flex items-start gap-3" style={{background:"hsl(0 72% 51%/0.08)",border:"1px solid hsl(0 72% 51%/0.3)"}}>
    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" style={{color:"hsl(0 72% 68%)"}}/>
    <div><p className="text-sm" style={{color:"hsl(0 72% 68%)"}}>{msg}</p>
    {msg.toLowerCase().includes("credit")&&<a href="https://console.anthropic.com/" target="_blank" rel="noreferrer" className="text-xs mt-1 underline inline-flex items-center gap-1" style={{color:"hsl(38 95% 60%)"}}>Top up credits <ArrowUpRight className="h-3 w-3"/></a>}
    </div>
  </div>
);}
function Spin({msg}:{msg:string}){return(
  <div className="rounded-xl p-14 text-center" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
    <RefreshCw className="h-10 w-10 animate-spin mx-auto mb-4" style={{color:"hsl(38 95% 52%)"}}/>
    <p className="font-semibold" style={{color:"hsl(210 40% 80%)"}}>{msg}</p>
    <p className="text-xs mt-1" style={{color:"hsl(215 25% 45%)"}}>Powered by Claude AI · this may take 30–60 seconds...</p>
  </div>
);}
function Hdr({title,sub,btn}:{title:string;sub?:string;btn?:React.ReactNode}){return(
  <div className="rounded-xl p-5 flex items-center justify-between gap-4 flex-wrap" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
    <div><h2 className="text-base font-bold" style={{color:"hsl(210 40% 92%)"}}>{title}</h2>
    {sub&&<p className="text-xs mt-0.5" style={{color:"hsl(215 25% 55%)"}}>{sub}</p>}</div>
    {btn}
  </div>
);}
function GoldBtn({onClick,loading,label,busy,Icon}:{onClick:()=>void;loading:boolean;label:string;busy:string;Icon:any}){return(
  <button onClick={onClick} disabled={loading}
    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50 hover:opacity-90 transition-all"
    style={{background:"hsl(38 95% 52%)",color:"hsl(216 58% 6%)"}}>
    {loading?<RefreshCw className="h-4 w-4 animate-spin"/>:<Icon className="h-4 w-4"/>}
    {loading?busy:label}
  </button>
);}
function Badge({v,c}:{v:string;c:string}){return(
  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap" style={{background:`${c}18`,color:c}}>{v}</span>
);}
function Bar({pct,c}:{pct:number;c:string}){const col=pct>=80?"hsl(158 64% 55%)":pct>=55?"hsl(38 95% 52%)":"hsl(0 72% 68%)";return(
  <div className="flex items-center gap-2 min-w-24">
    <div className="flex-1 h-1.5 rounded-full" style={{background:"hsl(216 45% 18%)"}}>
      <div className="h-1.5 rounded-full" style={{width:`${Math.min(pct,100)}%`,background:c||col}}/>
    </div>
    <span className="text-[10px] font-bold w-8 text-right" style={{color:c||col}}>{pct}%</span>
  </div>
);}

// ── MEGA PROMPTS (ultra-detailed, company-specific) ──────────────────────────

const SYS_ORG=`You are a world-class organizational design consultant with 30+ years experience in MENA, specializing in Iraq, UAE, Saudi Arabia, Kuwait, Jordan, and Oman markets.

Given the company profile, generate a FULLY CUSTOMIZED organizational structure. Every single output must be 100% specific to:
- The exact business ACTIVITY (not just industry) — use precise terminology
- The exact employee COUNT and REVENUE band — scale departments to reality
- The specific COUNTRY, CITY, and REGION — labor laws, norms, culture
- The NATURE OF WORK (B2B/B2C, product/service, trading/manufacturing/distribution)
- The number of DISTINCT JOB TYPES — design sections around actual job families
- The OWNER VISION and growth stage — build for where they want to go
- The CHALLENGES — fix the structural roots of the stated problems

STRICT RULES:
- NEVER use generic department names. Use exact industry terminology.
  ✗ "Sales" → ✓ "Route-to-Market" (FMCG distribution), ✓ "Business Development" (consulting), ✓ "Projects & Estimation" (construction)
  ✗ "IT" → ✓ "Digital Infrastructure & Cybersecurity" (bank), ✓ "ERP & Systems" (manufacturer)
- Department count MUST match the company's size (small = 4-6 depts, medium = 6-10, large = 10+)
- Sections within departments MUST reflect actual job types the company has
- Headcount numbers MUST be realistic for the revenue band (e.g. $2M company won't have 15 departments)
- NEVER invent departments the company doesn't need for its business model

Respond ONLY with valid JSON (no markdown, no code fences):
{
  "executiveSummary": "string — 5-6 sentences, 100% specific to company name, activity, city and challenges",
  "structureType": "string — e.g. Functional Hierarchy / Matrix / Flat / Divisional / Hybrid",
  "managementLayers": number,
  "spanOfControl": "string — e.g. 1:6 (one manager per 6 staff)",
  "totalCurrentHeadcount": number,
  "totalRequiredHeadcount": number,
  "totalOpenPositions": number,
  "ceo": {
    "title": "string — exact title for this industry/country",
    "directReports": number,
    "coreAccountabilities": ["string — 6-8 specific to company type and vision"],
    "criticalKPIs": ["string — 5-6 CEO-level KPIs"]
  },
  "departments": [
    {
      "id": "string",
      "name": "string — industry-specific name",
      "nameAr": "string — Arabic name",
      "colorHsl": "string — one of: hsl(38 95% 60%) / hsl(158 64% 55%) / hsl(217 91% 70%) / hsl(280 80% 70%) / hsl(0 72% 68%) / hsl(200 80% 65%)",
      "headTitle": "string — exact job title for this industry",
      "currentHeadcount": number,
      "requiredHeadcount": number,
      "recruitmentPriority": "Critical|High|Medium|Low",
      "rationale": "string — 2-3 sentences why THIS specific department is needed for THIS company's activity and stage",
      "sections": [
        {
          "sectionName": "string",
          "currentStaff": number,
          "requiredStaff": number,
          "roles": ["string — exact role titles"],
          "keyDeliverables": ["string — 3-4 specific deliverables"]
        }
      ],
      "responsibilities": ["string — 10-12 SPECIFIC responsibilities for this industry/activity, not generic"],
      "kpis": ["string — 6-8 measurable KPIs with target format e.g. 'Monthly revenue vs target >95%'"],
      "coreProcessesOwned": ["string — 4-6 processes this dept owns"],
      "recommendedTools": ["string — specific software/tools for this industry"],
      "reportsTo": "CEO|string",
      "collaboratesWith": ["string — dept ids"],
      "internalCustomers": ["string — who relies on this dept"],
      "internalSuppliers": ["string — who this dept relies on"],
      "budgetOwnership": "string — what budget they control",
      "complianceResponsibilities": ["string — regulatory/legal items for this country"]
    }
  ],
  "criticalGaps": ["string — top 5 structural gaps specific to company stage and vision"],
  "structureRisks": ["string — top 5 risks of current structure"],
  "growthTriggers": ["string — what milestones should trigger next org expansion"],
  "benchmarkComparison": "string — how this structure compares to industry peers in the region"
}`;

const SYS_PROC=`You are a business process excellence expert with 25+ years designing operational frameworks for MENA companies in Iraq, UAE, Saudi Arabia, Kuwait, Jordan and GCC.

Design ALL business processes and procedures for this specific company. This is NOT a generic template — every process must:
- Use the EXACT industry terminology (e.g. not "Sales Order" but "Route-to-Market Order" for FMCG, "BOQ Submission" for construction)
- Reflect the ACTUAL headcount (small team → fewer approval layers)
- Include realistic SLAs for the company's country and market pace
- Reference actual systems/tools common in this industry in MENA
- Comply with the country's regulatory requirements (e.g. Iraqi labor law, Iraqi tax authority, UAE VAT, Saudi ZATCA)
- Size the process complexity to the company's revenue (a $2M company doesn't need a 20-step procurement process)

Generate at minimum:
- 8 CORE processes (the ones that make the company money)  
- 4 SUPPORT processes (HR, Finance, Admin, IT basics)
- 2 MANAGEMENT processes (review cycles, strategy)
- 10 SOPs (one per critical daily/weekly operation)
- Complete approval authority matrix
- Full meeting cadence
- Communication protocols (internal & external)
- Document management system
- Performance management framework

Respond ONLY with valid JSON (no markdown):
{
  "totalProcessCount": number,
  "processByCategory": {
    "core": number,
    "support": number,
    "management": number
  },
  "processMaturityLevel": "string — current and target maturity",
  "coreProcesses": [
    {
      "id": "string — e.g. OPS-001",
      "processName": "string — industry-specific exact name",
      "category": "Core Revenue|Operations|HR|Finance|Compliance|Customer|Technology|Management",
      "department": "string",
      "processOwner": "string — exact job title",
      "frequency": "string — Daily / Per transaction / Weekly / Monthly / Quarterly",
      "criticality": "Mission-Critical|High|Medium|Low",
      "objective": "string — what business problem this process solves",
      "triggerEvent": "string — what starts this process",
      "inputs": ["string — data/materials/approvals needed to start"],
      "steps": [
        {
          "stepNo": number,
          "action": "string — specific, active verb + object",
          "responsible": "string — exact job title",
          "tool": "string — software, form, system, or manual",
          "sla": "string — time to complete this step",
          "decision": "string|null — decision point if any, with Yes/No paths",
          "output": "string — tangible deliverable of this step",
          "riskIfSkipped": "string — what goes wrong if this step is skipped"
        }
      ],
      "outputs": ["string — final deliverables / outcomes"],
      "qualityControls": ["string — verification checkpoints"],
      "escalationPath": "string — who to escalate to if blocked, and timeframe",
      "kpis": ["string — measurable metric: target value and frequency"],
      "risks": ["string — failure modes specific to this process in this context"],
      "requiredDocuments": ["string — forms, templates, contracts needed"],
      "systemsInvolved": ["string — all software tools involved"],
      "regulatoryRequirements": ["string — legal/regulatory requirements specific to country"],
      "processGaps": ["string — what's likely missing or broken in most companies like this"]
    }
  ],
  "sops": [
    {
      "sopCode": "string — e.g. OPS-SOP-001",
      "title": "string — specific to industry/activity",
      "department": "string",
      "frequency": "string",
      "owner": "string — exact job title",
      "purpose": "string",
      "scope": "string — what is and is NOT covered",
      "prerequisites": ["string — what must be in place before running this SOP"],
      "steps": ["string — numbered, specific action steps with responsible party"],
      "checkpoints": ["string — quality verification points"],
      "recordsRequired": ["string — what to document and where to file"],
      "relatedProcesses": ["string — process IDs"],
      "revision": "v1.0"
    }
  ],
  "approvalAuthority": [
    {
      "decisionType": "string — specific type of decision",
      "amountOrScope": "string — threshold or scope",
      "primaryApprover": "string — exact job title",
      "alternateApprover": "string",
      "escalationTo": "string",
      "maxResponseHours": number,
      "documentRequired": "string — what form/record is needed",
      "countryNote": "string — any local regulatory requirement for this approval"
    }
  ],
  "meetingCadence": [
    {
      "meetingName": "string — industry-specific name",
      "type": "Strategic|Operational|Review|Team|Client|Vendor",
      "frequency": "string",
      "duration": "string",
      "chair": "string — exact job title",
      "attendees": ["string — exact job titles"],
      "mandatoryAgenda": ["string — specific agenda items for this business"],
      "outputRequired": "string — what document/decision comes out",
      "preparationRequired": "string — what attendees must prepare"
    }
  ],
  "communicationMatrix": {
    "internal": {
      "daily": "string — daily standups, reports, escalations",
      "weekly": "string — weekly reporting structure",
      "monthly": "string — monthly review communications",
      "emergency": "string — crisis/escalation protocol",
      "upward": "string — how staff communicate up to management",
      "downward": "string — how management communicates to staff",
      "lateral": "string — cross-department communication"
    },
    "external": {
      "customers": "string — customer communication standards",
      "suppliers": "string — vendor communication protocols",
      "regulators": "string — government/authority communication",
      "banks": "string — banking communication protocols",
      "media": "string — if applicable"
    }
  },
  "documentManagement": {
    "namingConvention": "string — with example",
    "folderStructure": ["string — top-level folders and subfolders"],
    "versionControl": "string",
    "accessLevels": ["string — role: access level"],
    "retentionPolicy": "string — years by document type",
    "backupFrequency": "string",
    "recommendedSystem": "string — software recommendation for this company size"
  },
  "performanceManagement": {
    "reviewCycle": "string — e.g. Annual with mid-year review",
    "ratingScale": "string — e.g. 1-5 with descriptions",
    "selfAssessment": "string — process and timing",
    "managerReview": "string — process and timing",
    "calibration": "string — how ratings are normalized",
    "linkToReward": "string — how performance connects to salary/bonus",
    "pipProcess": "string — performance improvement plan process"
  },
  "processImprovementRoadmap": [
    {
      "priority": number,
      "process": "string",
      "currentState": "string",
      "targetState": "string",
      "effort": "Low|Medium|High",
      "impact": "Low|Medium|High",
      "timeline": "string"
    }
  ]
}`;

const SYS_REL=`You are an organizational dynamics consultant specializing in MENA company structures.

Map every single interdepartmental relationship, workflow, dependency and tension for this company.
Be highly specific to the company's industry, revenue model, and operational stage.

Respond ONLY with valid JSON (no markdown):
{
  "relationshipMap": [
    {
      "fromDept": "string",
      "toDept": "string",
      "relationshipType": "Reports To|Service Provider|Approver|Collaborator|Information Feed|Gatekeeper|Shared Resource",
      "direction": "One-way|Bidirectional",
      "frequency": "Continuous|Daily|Weekly|Monthly|As-Needed",
      "description": "string — what exactly flows between them",
      "dataExchanged": ["string — specific data, reports, approvals"],
      "dependencies": ["string — what dept A cannot do without dept B"],
      "frictionPoints": ["string — common conflict areas"],
      "sla": "string — expected response time"
    }
  ],
  "criticalValueChain": [
    {
      "chainName": "string — e.g. Order-to-Cash / Hire-to-Retire",
      "businessOutcome": "string",
      "sequence": [
        {"step":number, "department":"string", "action":"string", "handoff":"string", "riskIfDelayed":"string"}
      ]
    }
  ],
  "internalSLAs": [
    {
      "serviceProvider": "string",
      "serviceConsumer": "string",
      "service": "string",
      "standardResponseTime": "string",
      "priority": "Critical|High|Medium",
      "escalationPath": "string",
      "measurementMethod": "string"
    }
  ],
  "sharedResources": [
    {
      "resource": "string — e.g. Company vehicles, ERP system, Legal counsel",
      "owner": "string",
      "users": ["string"],
      "allocationMethod": "string",
      "conflictResolution": "string"
    }
  ],
  "informationFlows": [
    {
      "reportName": "string",
      "producedBy": "string",
      "consumedBy": ["string"],
      "frequency": "string",
      "format": "string",
      "criticality": "string"
    }
  ],
  "siloRisks": ["string — areas where departments are too isolated"],
  "overlapRisks": ["string — areas where departments overlap causing duplication"],
  "optimizationRecommendations": ["string — 6-8 specific improvements"],
  "integrationPriorities": ["string — top 3 cross-dept integrations to implement first"]
}`;

const SYS_HIRE=`You are a senior talent acquisition and HR strategy consultant with deep MENA market expertise, specializing in local labor laws, salary benchmarks, and recruitment challenges in Iraq, UAE, Saudi Arabia, Kuwait, Jordan and GCC.

Create a HYPER-DETAILED hiring plan that accounts for:
- Actual local labor market conditions in the specified country/city
- Realistic salary expectations for the local market
- Local labor law requirements (contracts, visas, gratuity, social insurance)
- Availability of talent in the specific city/region
- Company's current revenue and hiring budget capacity
- Industry-specific role requirements

Respond ONLY with valid JSON (no markdown):
{
  "executiveSummary": "string — 4-5 sentences specific to company, market and vision",
  "totalOpenPositions": number,
  "estimatedAnnualHiringCost": "string — total cost including salary, benefits, recruitment fees",
  "marketReadiness": "string — assessment of talent availability in this specific city/country",
  "urgentHires": [
    {
      "rank": number,
      "jobTitle": "string — exact title",
      "department": "string",
      "priority": "Critical|High|Medium",
      "businessJustification": "string — specific impact on company operations",
      "revenueImpact": "string — what revenue/cost is at risk without this hire",
      "timeToFill": "string — realistic estimate for this role in this market",
      "salaryRangeUSD": {"min":number,"mid":number,"max":number},
      "salaryRangeLocal": {"min":number,"mid":number,"max":number,"currency":"string"},
      "totalPackageCost": "string — including all benefits",
      "experienceRequired": "string",
      "mustHaveSkills": ["string — 5-7 hard requirements"],
      "niceToHaveSkills": ["string — 3-4 preferred"],
      "languageRequirements": "string",
      "localVsExpat": "string — recommendation and reasoning",
      "sourcingChannels": ["string — specific platforms/methods for this role in this country"],
      "interviewProcess": ["string — recommended stages"],
      "onboardingDuration": "string",
      "probationPeriod": "string"
    }
  ],
  "hiringWaves": {
    "wave1": {"label":"Immediate — 0 to 30 days","headcount":number,"roles":["string"],"estimatedCost":"string","rationale":"string"},
    "wave2": {"label":"Short-term — Month 2 to 3","headcount":number,"roles":["string"],"estimatedCost":"string","rationale":"string"},
    "wave3": {"label":"Mid-term — Month 4 to 6","headcount":number,"roles":["string"],"estimatedCost":"string","rationale":"string"},
    "wave4": {"label":"Growth — Month 7 to 12","headcount":number,"roles":["string"],"estimatedCost":"string","rationale":"string"}
  },
  "onboardingFramework": {
    "preDayOne": ["string — actions before start date"],
    "week1": ["string — first week program"],
    "month1": ["string — 30-day milestones"],
    "month3": ["string — 90-day milestones"],
    "probationReview": "string — how probation is evaluated"
  },
  "retentionStrategies": [
    {"strategy":"string","targetGroup":"string","cost":"string","expectedImpact":"string"}
  ],
  "hrTechnology": [
    {"tool":"string","purpose":"string","estimatedCost":"string","priority":"Must-Have|Nice-to-Have"}
  ],
  "legalCompliance": [
    {"requirement":"string","country":"string","deadline":"string","penalty":"string","action":"string"}
  ],
  "recruitmentPartners": ["string — local recruitment agencies or job boards specific to country/city"],
  "successMetrics": ["string — how to measure hiring success"],
  "risks": ["string — talent acquisition risks specific to this market"]
}`;

const SYS_SAL=`You are a total rewards and compensation consultant with 20+ years in MENA markets. You have deep knowledge of actual salary levels in Iraq, UAE, Saudi Arabia, Kuwait, Jordan, Qatar, Oman, Bahrain and their major cities.

Provide ACTUAL, REALISTIC salary data — not ranges that are too broad to be useful. Your data must reflect:
- The specific city's actual cost of living and salary market (e.g. Baghdad vs Erbil vs Basra have different markets)
- The company's revenue size and what it can realistically pay
- The industry's typical compensation philosophy in that country
- Local vs expat differences
- Government vs private sector comparisons
- The impact of inflation and currency fluctuation

Respond ONLY with valid JSON (no markdown):
{
  "marketContext": {
    "country": "string",
    "city": "string",
    "region": "string",
    "gdpPerCapita": "string",
    "averagePrivateSectorSalary": "string",
    "industryMedianSalary": "string",
    "localCurrency": "string",
    "currencySymbol": "string",
    "usdExchangeRate": number,
    "inflationRate": "string",
    "laborMarketCondition": "Talent Scarce|Competitive|Balanced|Employer-Favorable",
    "typicalBenefitsValue": "string — % on top of base",
    "industryNotes": "string — specific compensation dynamics for this industry in this country"
  },
  "compensationPhilosophy": {
    "positioning": "string — e.g. At-market / Above-market / Below-market with equity",
    "payMix": "string — base vs bonus vs benefits split",
    "differentiators": ["string — what makes company attractive beyond salary"],
    "reviewCycle": "string",
    "meritIncreaseRange": "string"
  },
  "salaryBands": [
    {
      "department": "string",
      "jobFamily": "string",
      "role": "string",
      "level": "Intern|Junior|Mid|Senior|Lead|Manager|Senior Manager|Director|VP|C-Suite",
      "yearsExperience": "string",
      "baseSalaryUSD": {"min":number,"median":number,"max":number,"frequency":"Monthly"},
      "baseSalaryLocal": {"min":number,"median":number,"max":number,"currency":"string"},
      "annualBonusPercent": "string",
      "totalCompUSD": "string",
      "marketDemand": "Very High|High|Medium|Low",
      "availabilityInMarket": "Scarce|Limited|Moderate|Abundant",
      "benchmarkSource": "string",
      "notes": "string — local nuances, negotiation tips"
    }
  ],
  "benefitsPackage": {
    "housing": {"provided":boolean,"value":"string","notes":"string"},
    "transportation": {"provided":boolean,"value":"string","notes":"string"},
    "healthInsurance": {"provided":boolean,"coverage":"string","familyCovered":boolean,"notes":"string"},
    "annualLeave": {"days":number,"notes":"string"},
    "airTicket": {"provided":boolean,"frequency":"string","notes":"string"},
    "endOfService": {"calculation":"string","legalRequirement":boolean,"notes":"string"},
    "schoolFees": {"provided":boolean,"coverage":"string"},
    "mobilePhone": {"provided":boolean,"value":"string"},
    "performanceBonus": {"structure":"string","maxPercent":"string"},
    "other": ["string"]
  },
  "legalMandatories": [
    {"item":"string","regulation":"string","employer_cost":"string","employee_cost":"string","notes":"string"}
  ],
  "costOfHiring": {
    "recruitmentFee": "string — agency fee as % of annual salary",
    "onboardingCost": "string",
    "firstYearTotalCost": "string — salary + benefits + recruitment",
    "replacementCostIfLeaves": "string"
  },
  "retentionBenchmarks": {
    "industryAverageTurnover": "string",
    "acceptableTurnover": "string",
    "costOfTurnover": "string"
  },
  "recommendations": ["string — 6-8 specific compensation strategy recommendations for this company"]
}`;

const SYS_RECO=`You are a C-suite transformation advisor and management consultant who has led 50+ company development projects across MENA.

Provide a comprehensive, brutally honest company development roadmap. Do not give generic advice. Every recommendation must be:
- Specific to this company's exact situation, industry and stage
- Prioritized by revenue impact and urgency
- Realistic for the company's size and resources
- Anchored in the local business context

Respond ONLY with valid JSON (no markdown):
{
  "overallHealthScore": number,
  "healthDimensions": {
    "strategyClarity": {"score":number,"comment":"string"},
    "organizationalStructure": {"score":number,"comment":"string"},
    "processMaturity": {"score":number,"comment":"string"},
    "talentQuality": {"score":number,"comment":"string"},
    "technologyReadiness": {"score":number,"comment":"string"},
    "financialManagement": {"score":number,"comment":"string"},
    "complianceGovernance": {"score":number,"comment":"string"},
    "customerExperience": {"score":number,"comment":"string"}
  },
  "executiveAssessment": "string — 5-6 sentences honest assessment of company's current state and biggest opportunities",
  "criticalIssues": [
    {
      "issue": "string",
      "rootCause": "string",
      "revenueImpact": "string",
      "urgency": "Fix Now|Fix in 30 days|Fix in 90 days",
      "recommendedOwner": "string",
      "solution": "string"
    }
  ],
  "quickWins": [
    {
      "action": "string",
      "department": "string",
      "timeframe": "This week|30 days|60 days|90 days",
      "effort": "Low|Medium|High",
      "impact": "string",
      "costUSD": "string",
      "expectedROI": "string",
      "howTo": ["string — 3-5 specific steps to implement"]
    }
  ],
  "strategicRoadmap": [
    {
      "phase": number,
      "phaseName": "string",
      "duration": "string",
      "theme": "string — e.g. Stabilize / Scale / Optimize / Transform",
      "objectives": ["string — 4-5 specific objectives"],
      "keyInitiatives": ["string — 5-6 initiatives with owners"],
      "milestones": ["string — measurable checkpoints"],
      "investmentRequired": "string",
      "expectedRevenueImpact": "string",
      "headcountChange": "string",
      "riskIfDelayed": "string"
    }
  ],
  "technologyRoadmap": [
    {
      "system": "string — specific software name",
      "category": "ERP|CRM|HRIS|Accounting|Operations|Communication|Analytics",
      "priority": "Critical|High|Medium",
      "estimatedCost": "string",
      "implementationTime": "string",
      "businessCase": "string",
      "alternatives": ["string"]
    }
  ],
  "cultureAndEngagement": ["string — 5-6 specific culture initiatives"],
  "governanceFramework": ["string — board/management governance improvements"],
  "complianceChecklist": [
    {"item":"string","status":"Required|Recommended","deadline":"string","penalty":"string","owner":"string"}
  ],
  "kpiDashboard": [
    {
      "kpi": "string",
      "category": "Financial|Operational|People|Customer|Compliance",
      "currentValue": "string",
      "targetValue": "string",
      "timeframe": "string",
      "dataSource": "string",
      "reportingFrequency": "string"
    }
  ],
  "totalInvestmentRequired": "string",
  "expectedROITimeline": "string",
  "successDefinition": ["string — what does success look like in 12/24/36 months"]
}`;

const SYS_ROLES=`You are a job design and HR architecture specialist with deep expertise in MENA labor markets. You design precise, actionable job descriptions and role frameworks for companies across Iraq, UAE, Saudi Arabia, Kuwait, Jordan and GCC.

Given the company profile and department structure, create COMPLETE JOB ROLE SPECIFICATIONS for every distinct job type in the company. Each role must be:
- 100% tailored to this specific company's activity, industry, and business model
- Sized for the company's actual revenue and employee count
- Reflect the actual tasks done in this specific business (not generic templates)
- Include local market context (salary, availability, labor law)

RULES:
- Cover ALL distinct job types (match the number provided in the profile)
- Use exact job titles used in this industry/country (Arabic title where common)
- KPIs must be MEASURABLE with actual numbers (not vague phrases)
- Competencies must be SPECIFIC to this role in this business

Respond ONLY with valid JSON (no markdown):
{
  "totalRoles": number,
  "roleFamilies": [
    {
      "familyName": "string — e.g. Sales & Revenue / Operations & Logistics / Finance & Admin",
      "familyColor": "string — hsl color",
      "roles": [
        {
          "roleId": "string",
          "jobTitle": "string — exact industry title",
          "jobTitleAr": "string — Arabic title",
          "department": "string",
          "section": "string",
          "level": "Entry|Junior|Mid|Senior|Lead|Manager|Director|C-Suite",
          "reportsTo": "string — exact job title",
          "directReports": number,
          "headcount": number,
          "missionStatement": "string — 1-sentence role purpose",
          "coreResponsibilities": [
            {
              "responsibility": "string — specific task",
              "frequency": "Daily|Weekly|Monthly|Per Event",
              "timePercent": number,
              "output": "string — what is produced"
            }
          ],
          "kpis": [
            {
              "kpi": "string — measurable metric",
              "target": "string — specific number/threshold",
              "frequency": "string",
              "dataSource": "string"
            }
          ],
          "qualifications": {
            "education": "string — required degree/diploma",
            "experience": "string — years and type",
            "languages": "string",
            "certifications": ["string"]
          },
          "technicalSkills": ["string — specific tools/software/skills"],
          "softSkills": ["string — behavioral competencies"],
          "workingConditions": {
            "schedule": "string — hours/days/shift",
            "location": "string — office/field/travel",
            "physicalRequirements": "string"
          },
          "salaryRangeUSD": {"min": number, "mid": number, "max": number},
          "salaryRangeLocal": {"min": number, "mid": number, "max": number, "currency": "string"},
          "careerPath": ["string — next role(s) this position leads to"],
          "commonChallenges": ["string — real difficulties of this role in this business"],
          "successFactors": ["string — what makes someone excel in this role"],
          "interactsWith": ["string — internal departments/roles"],
          "toolsAndSystems": ["string — software, equipment, systems used daily"],
          "complianceRequirements": ["string — legal, regulatory, safety requirements for this role"]
        }
      ]
    }
  ],
  "orgPyramid": {
    "cLevel": number,
    "directors": number,
    "managers": number,
    "seniors": number,
    "juniors": number,
    "entry": number
  },
  "jobDesignPrinciples": ["string — 5-6 key principles for managing this workforce"],
  "criticalRoles": ["string — the 3-5 roles most critical to business success and why"]
}`;


// ── Main Component ────────────────────────────────────────────────────────────
export default function CompanyDevelopment() {
  const [tab, setTab] = useState<Tab>("profile");
  const [exDept, setExDept] = useState<string|null>(null);
  const [exProc, setExProc] = useState<number|null>(null);
  const [exRole, setExRole] = useState<string|null>(null);
  const [profileDone, setProfileDone] = useState(false);

  const [co, setCo] = useState<CompanyProfile>({
    name:"",country:"",city:"",region:"",industry:"",activity:"",
    type:"",size:"",employees:"",revenue:"",jobTypes:"",
    workNature:"",founded:"",vision:"",challenges:""
  });

  const orgAI  = useClaudeAnalysis({systemPrompt:SYS_ORG,   agentId:"org-v4",   modelTier:"flash-lite"});
  const procAI = useClaudeAnalysis({systemPrompt:SYS_PROC,  agentId:"proc-v4",  modelTier:"flash-lite"});
  const relAI  = useClaudeAnalysis({systemPrompt:SYS_REL,   agentId:"rel-v4",   modelTier:"flash-lite"});
  const hirAI  = useClaudeAnalysis({systemPrompt:SYS_HIRE,  agentId:"hire-v4",  modelTier:"flash-lite"});
  const salAI  = useClaudeAnalysis({systemPrompt:SYS_SAL,   agentId:"sal-v4",   modelTier:"flash-lite"});
  const recAI  = useClaudeAnalysis({systemPrompt:SYS_RECO,  agentId:"reco-v4",  modelTier:"flash-lite"});
  const rolAI  = useClaudeAnalysis({systemPrompt:SYS_ROLES, agentId:"roles-v4", modelTier:"flash-lite"});

  const pText=()=>`
COMPANY PROFILE (use ALL fields to customize your output):
Company Name: ${co.name}
Country: ${co.country} | City: ${co.city} | Region/Area: ${co.region}
Industry: ${co.industry}
Exact Business Activity: ${co.activity}
Company Legal Type: ${co.type}
Size Category: ${co.size}
Current Number of Employees: ${co.employees}
Annual Revenue (USD): ${co.revenue}
Number of Distinct Job Types/Roles: ${co.jobTypes}
Nature of Work / Business Model: ${co.workNature}
Year Founded: ${co.founded}
Owner's Vision (3-5 year): ${co.vision}
Current Pain Points / Challenges: ${co.challenges}
`.trim();

  const canUnlock = !!(co.name&&co.country&&co.city&&co.industry&&co.activity&&co.employees&&co.revenue&&co.workNature&&co.vision);

  const TABS:{key:Tab;label:string;icon:any;lock?:boolean}[]=[
    {key:"profile",         label:"Company Profile",    icon:Briefcase},
    {key:"org",             label:"Org Structure",      icon:GitBranch,    lock:!profileDone},
    {key:"departments",     label:"Departments",        icon:Building2,    lock:!profileDone},
    {key:"processes",       label:"Processes & SOPs",   icon:ClipboardList,lock:!profileDone},
    {key:"roles",           label:"Job Roles",          icon:Users,        lock:!profileDone},
    {key:"relations",       label:"Dept Relations",     icon:Network,      lock:!profileDone},
    {key:"hiring",          label:"Hiring Plan",        icon:UserPlus,     lock:!profileDone},
    {key:"salaries",        label:"Salary Benchmarks",  icon:DollarSign,   lock:!profileDone},
    {key:"recommendations", label:"Roadmap",            icon:Star,         lock:!profileDone},
  ];

  const gc=(g:number)=>g>3?"hsl(0 72% 68%)":g>0?"hsl(38 95% 60%)":"hsl(158 64% 55%)";

  // ── PROFILE TAB ─────────────────────────────────────────────────────────────
  const ProfileTab=()=>(
    <div className="space-y-4">
      <div className="rounded-xl p-6" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
        <div className="flex items-center gap-2 mb-5">
          <Info className="h-4 w-4" style={{color:"hsl(38 95% 52%)"}}/>
          <p className="text-sm font-semibold" style={{color:"hsl(210 40% 88%)"}}>
            The more detail you provide, the more accurate and specific every AI analysis will be.
          </p>
        </div>

        {/* Required fields */}
        <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{color:"hsl(38 95% 52%)"}}>Required Fields</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
          {[
            {k:"name"      as const,l:"Company Name",              ph:"e.g. Al-Noor Trading Co."},
            {k:"country"   as const,l:"Country",                   ph:"e.g. Iraq / UAE / KSA"},
            {k:"city"      as const,l:"City",                      ph:"e.g. Baghdad / Erbil / Basra"},
            {k:"region"    as const,l:"Region / District / Zone",  ph:"e.g. Karrada / Sulaymaniyah / Jeddah"},
            {k:"industry"  as const,l:"Industry Sector",           ph:"e.g. FMCG / Construction / Healthcare / Retail"},
            {k:"activity"  as const,l:"Exact Business Activity",   ph:"e.g. Wholesale food distribution to supermarkets"},
            {k:"employees" as const,l:"Current Employees (count)", ph:"e.g. 45"},
            {k:"revenue"   as const,l:"Annual Revenue (USD)",      ph:"e.g. $3.5M / $12M / $50M"},
          ].map(f=>(
            <div key={f.k}>
              <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{color:"hsl(215 25% 50%)"}}>{f.l}</label>
              <input value={co[f.k]} onChange={e=>setCo(p=>({...p,[f.k]:e.target.value}))} placeholder={f.ph}
                className="w-full px-3 py-2.5 rounded-xl text-sm" style={{background:"hsl(216 45% 12%)",border:`1px solid ${co[f.k]?"hsl(38 95% 52%/0.4)":"hsl(var(--border))"}`,color:"hsl(210 40% 88%)"}}/>
            </div>
          ))}
        </div>

        {/* Optional but important */}
        <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{color:"hsl(215 25% 45%)"}}>Recommended Fields (greatly improve AI quality)</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
          {[
            {k:"type"     as const,l:"Company Legal Type",           ph:"e.g. LLC / Family Business / JV / Holding / Startup"},
            {k:"size"     as const,l:"Size Category",                ph:"e.g. Micro (<10) / Small (10-50) / Medium / Large"},
            {k:"jobTypes" as const,l:"No. of Distinct Job Types",    ph:"e.g. 12 (driver, sales rep, accountant...)"},
            {k:"founded"  as const,l:"Year Founded",                 ph:"e.g. 2010"},
          ].map(f=>(
            <div key={f.k}>
              <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{color:"hsl(215 25% 50%)"}}>{f.l}</label>
              <input value={co[f.k]} onChange={e=>setCo(p=>({...p,[f.k]:e.target.value}))} placeholder={f.ph}
                className="w-full px-3 py-2.5 rounded-xl text-sm" style={{background:"hsl(216 45% 12%)",border:"1px solid hsl(var(--border))",color:"hsl(210 40% 88%)"}}/>
            </div>
          ))}
        </div>

        {/* Text areas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            {k:"workNature"  as const,l:"Nature of Work / Business Model",     ph:"Describe HOW you make money: e.g. We buy FMCG goods from suppliers and distribute to 300+ retail outlets across Baghdad. We have a direct sales force of 8 reps and use 12 trucks. We sell on 30-day credit terms. 60% of revenue is from top 10 clients."},
            {k:"vision"      as const,l:"Owner's Vision (3–5 year goal)",       ph:"e.g. Become the #1 food distributor in Iraq by 2028, expand to 3 countries, achieve $30M revenue, potentially IPO or attract private equity."},
            {k:"challenges"  as const,l:"Current Pain Points / Challenges",     ph:"e.g. No formal HR department, high staff turnover in sales team (40%/yr), no ERP system, finance runs on Excel, no formal processes documented, owner is still doing everything himself."},
          ].map(f=>(
            <div key={f.k}>
              <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{color:"hsl(215 25% 50%)"}}>{f.l}</label>
              <textarea value={co[f.k]} onChange={e=>setCo(p=>({...p,[f.k]:e.target.value}))} placeholder={f.ph} rows={4}
                className="w-full px-3 py-2.5 rounded-xl text-sm resize-none" style={{background:"hsl(216 45% 12%)",border:`1px solid ${co[f.k]?"hsl(38 95% 52%/0.4)":"hsl(var(--border))"}`,color:"hsl(210 40% 88%)"}}/>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4" style={{borderTop:"1px solid hsl(var(--border))"}}>
          <div className="flex items-center gap-2">
            {canUnlock
              ?<><CheckCircle2 className="h-4 w-4" style={{color:"hsl(158 64% 55%)"}}/><span className="text-sm" style={{color:"hsl(158 64% 55%)"}}>Profile complete — all modules unlocked</span></>
              :<><AlertTriangle className="h-4 w-4" style={{color:"hsl(38 95% 60%)"}}/><span className="text-sm" style={{color:"hsl(38 95% 60%)"}}>Fill required fields to unlock AI analysis</span></>}
          </div>
          <button onClick={()=>{if(canUnlock){setProfileDone(true);setTab("org");}}}
            disabled={!canUnlock}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold disabled:opacity-40"
            style={{background:"hsl(38 95% 52%)",color:"hsl(216 58% 6%)"}}>
            <Play className="h-4 w-4"/> Unlock All 7 Analysis Modules
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {n:"01",t:"Org Structure",   d:"AI designs your custom org chart based on your exact activity",icon:GitBranch, c:"hsl(38 95% 60%)"},
          {n:"02",t:"Departments",     d:"Every department fully detailed — roles, KPIs, responsibilities",icon:Building2, c:"hsl(158 64% 55%)"},
          {n:"03",t:"Processes",       d:"All SOPs, workflows and approval matrices for your business",icon:ClipboardList,c:"hsl(217 91% 70%)"},
          {n:"04",t:"Hiring & Salary", d:"Custom hiring plan and salary benchmarks for your city & industry",icon:Users, c:"hsl(280 80% 70%)"},
        ].map(s=>(
          <div key={s.n} className="rounded-xl p-4" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-black" style={{color:s.c}}>{s.n}</span>
              <s.icon className="h-4 w-4" style={{color:s.c}}/>
            </div>
            <p className="text-xs font-bold mb-1" style={{color:"hsl(210 40% 88%)"}}>{s.t}</p>
            <p className="text-[11px]" style={{color:"hsl(215 25% 50%)"}}>{s.d}</p>
          </div>
        ))}
      </div>
    </div>
  );

  // ── ORG TAB ─────────────────────────────────────────────────────────────────
  const OrgTab=()=>(
    <div className="space-y-4">
      <Hdr
        title="AI Organizational Structure Design"
        sub={`Custom org chart for ${co.name||"your company"} · ${co.industry} · ${co.employees} employees · ${co.city}, ${co.country}`}
        btn={<GoldBtn onClick={()=>orgAI.analyze(`${pText()}\n\nIMPORTANT: Design the org structure to be 100% specific to this company's exact activity (${co.activity}), size (${co.employees} employees), revenue (${co.revenue}), business model (${co.workNature}), and location (${co.city}, ${co.country}). Use industry-specific department names and titles. Do NOT use generic names.`)} loading={orgAI.loading} label="Generate Org Structure" busy="Designing structure..." Icon={GitBranch}/>}
      />
      {orgAI.error&&<Err msg={orgAI.error}/>}
      {orgAI.loading&&<Spin msg={`Designing org structure for ${co.name}...`}/>}
      {orgAI.result&&!orgAI.loading&&(()=>{
          <AIDisclaimer compact />
        const r=orgAI.result;
        const depts:any[]=r.structure?.departments||[];
        return(
          <div className="space-y-4">
            {/* KPI row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                {l:"Departments",v:depts.length,c:"hsl(38 95% 60%)"},
                {l:"Required Headcount",v:r.totalRequiredHeadcount,c:"hsl(217 91% 70%)"},
                {l:"Current Headcount",v:r.totalCurrentHeadcount,c:"hsl(158 64% 55%)"},
                {l:"Open Positions",v:r.totalOpenPositions,c:"hsl(0 72% 68%)"},
              ].map((s,i)=>(
                <div key={i} className="rounded-xl p-4 text-center" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                  <p className="text-3xl font-black" style={{color:s.c}}>{s.v}</p>
                  <p className="text-[11px] mt-1" style={{color:"hsl(215 25% 50%)"}}>{s.l}</p>
                </div>
              ))}
            </div>

            {/* Summary box */}
            <div className="rounded-xl p-5" style={{background:"hsl(38 95% 52%/0.06)",border:"1px solid hsl(38 95% 52%/0.2)"}}>
              <div className="flex items-center gap-2 mb-2"><Star className="h-4 w-4" style={{color:"hsl(38 95% 60%)"}}/><p className="text-xs font-bold uppercase tracking-wider" style={{color:"hsl(38 95% 60%)"}}>Executive Summary</p></div>
              <p className="text-sm leading-relaxed" style={{color:"hsl(210 40% 82%)"}}>{r.executiveSummary}</p>
              <div className="flex flex-wrap gap-5 mt-3 text-xs">
                {[{l:"Structure Type",v:r.structureType},{l:"Management Layers",v:r.managementLayers},{l:"Span of Control",v:r.spanOfControl}].map((m,i)=>(
                  <span key={i} style={{color:"hsl(215 25% 55%)"}}>{m.l}: <strong style={{color:"hsl(38 95% 60%)"}}>{m.v}</strong></span>
                ))}
              </div>
            </div>

            {/* CEO box */}
            {r.ceo&&(
              <div className="rounded-xl p-5" style={{background:"hsl(38 95% 52%/0.08)",border:"2px solid hsl(38 95% 52%/0.3)"}}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{background:"hsl(38 95% 52%/0.2)"}}>
                    <Star className="h-5 w-5" style={{color:"hsl(38 95% 60%)"}}/>
                  </div>
                  <div><p className="font-bold" style={{color:"hsl(210 40% 92%)"}}>{r.ceo.title}</p><p className="text-xs" style={{color:"hsl(38 95% 60%)"}}>{r.ceo.directReports} direct reports</p></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{color:"hsl(38 95% 60%)"}}>Core Accountabilities</p>
                    <div className="space-y-1">{(r.ceo.coreAccountabilities||[]).map((a:string,i:number)=>(
                      <div key={i} className="flex items-start gap-2 text-xs"><CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{color:"hsl(38 95% 60%)"}}/><span style={{color:"hsl(210 40% 78%)"}}>{a}</span></div>
                    ))}</div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{color:"hsl(38 95% 60%)"}}>CEO KPIs</p>
                    <div className="flex flex-wrap gap-1.5">{(r.ceo.criticalKPIs||[]).map((k:string,i:number)=>(
                      <span key={i} className="text-[10px] px-2.5 py-1 rounded-lg" style={{background:"hsl(38 95% 52%/0.12)",color:"hsl(38 95% 60%)"}}>{k}</span>
                    ))}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Org visual */}
            <div className="rounded-xl p-6 overflow-x-auto" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
              <h3 className="text-sm font-bold text-center mb-6" style={{color:"hsl(210 40% 92%)"}}>Org Chart — {co.name}</h3>
              <div className="flex justify-center mb-1">
                <div className="rounded-2xl px-8 py-4 text-center" style={{background:"hsl(38 95% 52%/0.15)",border:"2px solid hsl(38 95% 52%/0.5)",minWidth:220}}>
                  <Star className="h-6 w-6 mx-auto mb-1.5" style={{color:"hsl(38 95% 60%)"}}/>
                  <p className="text-xs font-bold" style={{color:"hsl(210 40% 92%)"}}>{r.ceo?.title||"CEO"}</p>
                  <p className="text-[10px] mt-0.5" style={{color:"hsl(38 95% 60%)"}}>Executive Leadership</p>
                </div>
              </div>
              <div className="flex justify-center"><div className="w-0.5 h-8" style={{background:"hsl(38 95% 52%/0.4)"}}/></div>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                {depts.map((d:any)=>{
                  const gap=(d.requiredHeadcount||0)-(d.currentHeadcount||0);
                  const pc=gc(gap);
                  const priC=d.recruitmentPriority==="Critical"?"hsl(0 72% 68%)":d.recruitmentPriority==="High"?"hsl(38 95% 60%)":d.recruitmentPriority==="Medium"?"hsl(217 91% 70%)":"hsl(158 64% 55%)";
                  return(
                    <div key={d.id} className="flex flex-col items-center">
                      <div className="w-0.5 h-5" style={{background:`${d.colorHsl||"hsl(38 95% 52%)"}60`}}/>
                      <button onClick={()=>{setExDept(d.id);setTab("departments");}}
                        className="rounded-xl p-3 text-center hover:scale-105 transition-all"
                        style={{background:`${d.colorHsl||"hsl(38 95% 52%)"}12`,border:`1px solid ${d.colorHsl||"hsl(38 95% 52%)"}35`,minWidth:145,maxWidth:165}}>
                        <Building2 className="h-4 w-4 mx-auto mb-1.5" style={{color:d.colorHsl||"hsl(38 95% 60%)"}}/>
                        <p className="text-[11px] font-bold leading-tight" style={{color:"hsl(210 40% 90%)"}}>{d.name}</p>
                        <p className="text-[9px] mt-0.5 truncate px-1" style={{color:d.colorHsl||"hsl(38 95% 60%)"}}>{d.headTitle}</p>
                        <div className="flex justify-center gap-1 mt-1.5 flex-wrap">
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold" style={{background:"hsl(216 45% 18%)",color:"hsl(210 40% 70%)"}}>{d.currentHeadcount||0}/{d.requiredHeadcount||0}</span>
                          {gap>0&&<span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{background:`${pc}20`,color:pc}}>−{gap}</span>}
                        </div>
                        <div className="mt-1.5"><span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full" style={{background:`${priC}15`,color:priC}}>{d.recruitmentPriority}</span></div>
                      </button>
                    </div>
                  );
                })}
              </div>
              <p className="text-center text-[10px] mt-4" style={{color:"hsl(215 25% 40%)"}}>Click any department box to view full details → Departments tab</p>
            </div>

            {/* Critical gaps */}
            {r.criticalGaps?.length>0&&(
              <div className="rounded-xl p-5" style={{background:"hsl(0 72% 51%/0.06)",border:"1px solid hsl(0 72% 51%/0.25)"}}>
                <div className="flex items-center gap-2 mb-3"><AlertTriangle className="h-4 w-4" style={{color:"hsl(0 72% 68%)"}}/><p className="text-sm font-bold" style={{color:"hsl(0 72% 68%)"}}>Critical Structural Gaps</p></div>
                <div className="space-y-2">{r.criticalGaps.map((g:string,i:number)=>(
                  <div key={i} className="flex items-start gap-2 text-xs"><AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{color:"hsl(0 72% 68%)"}}/><span style={{color:"hsl(210 40% 78%)"}}>{g}</span></div>
                ))}</div>
              </div>
            )}

            {/* Growth triggers */}
            {r.growthTriggers?.length>0&&(
              <div className="rounded-xl p-5" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{color:"hsl(158 64% 55%)"}}>When to Expand the Structure (Growth Triggers)</p>
                <div className="flex flex-wrap gap-2">{r.growthTriggers.map((t:string,i:number)=>(
                  <span key={i} className="text-xs px-3 py-1.5 rounded-lg" style={{background:"hsl(158 64% 40%/0.1)",color:"hsl(158 64% 55%)"}}>{t}</span>
                ))}</div>
              </div>
            )}

            {r.benchmarkComparison&&(
              <div className="rounded-xl p-4" style={{background:"hsl(217 91% 70%/0.06)",border:"1px solid hsl(217 91% 70%/0.2)"}}>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{color:"hsl(217 91% 70%)"}}>Industry Benchmark</p>
                <p className="text-sm" style={{color:"hsl(210 40% 80%)"}}>{r.benchmarkComparison}</p>
              </div>
            )}
          </div>
        );
      })()}
      {!orgAI.result&&!orgAI.loading&&!orgAI.error&&(
        <div className="rounded-xl p-14 text-center" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
          <GitBranch className="h-14 w-14 mx-auto mb-4 opacity-15" style={{color:"hsl(38 95% 52%)"}}/>
          <p className="font-semibold" style={{color:"hsl(215 25% 55%)"}}>Click "Generate Org Structure" for a fully custom org design</p>
          <p className="text-xs mt-1" style={{color:"hsl(215 25% 38%)"}}>Specific to {co.industry} · {co.employees} employees · {co.city}, {co.country}</p>
        </div>
      )}
    </div>
  );

  // ── DEPARTMENTS TAB ──────────────────────────────────────────────────────────
  const DeptsTab=()=>{
    const depts:any[]=orgAI.result?.structure?.departments||[];
    if(!orgAI.result) return(
      <div className="rounded-xl p-14 text-center" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
        <Building2 className="h-14 w-14 mx-auto mb-4 opacity-15" style={{color:"hsl(38 95% 52%)"}}/>
        <p className="font-semibold" style={{color:"hsl(215 25% 55%)"}}>Generate Org Structure first to unlock department details</p>
        <button onClick={()=>setTab("org")} className="mt-4 px-4 py-2 rounded-xl text-sm font-semibold" style={{background:"hsl(38 95% 52%/0.15)",color:"hsl(38 95% 60%)"}}>Go to Org Structure →</button>
      </div>
    );
    return(
      <div className="space-y-3">
        <div className="rounded-xl p-4 flex items-center gap-3" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
          <Info className="h-4 w-4 shrink-0" style={{color:"hsl(38 95% 52%)"}}/>
          <p className="text-sm" style={{color:"hsl(210 40% 80%)"}}>
            All {depts.length} departments below are 100% customized for <strong style={{color:"hsl(38 95% 60%)"}}>{co.name}</strong> ({co.activity} · {co.industry} · {co.city}).
          </p>
        </div>
        {depts.map((d:any)=>{
          const isEx=exDept===d.id;
          const gap=(d.requiredHeadcount||0)-(d.currentHeadcount||0);
          const col=d.colorHsl||"hsl(38 95% 52%)";
          return(
            <div key={d.id} className="rounded-xl overflow-hidden" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
              <button onClick={()=>setExDept(isEx?null:d.id)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left transition-all"
                style={{background:isEx?`${col}08`:"transparent"}}>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl shrink-0" style={{background:`${col}18`,border:`1px solid ${col}35`}}>
                  <Building2 className="h-5 w-5" style={{color:col}}/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm" style={{color:"hsl(210 40% 92%)"}}>{d.name}</span>
                    <span className="text-[10px] opacity-60" style={{color:col}}>{d.nameAr}</span>
                    <Badge v={`${d.sections?.length||0} sections`} c={col}/>
                    <Badge v={d.recruitmentPriority} c={d.recruitmentPriority==="Critical"?"hsl(0 72% 68%)":d.recruitmentPriority==="High"?"hsl(38 95% 60%)":"hsl(158 64% 55%)"}/>
                  </div>
                  <p className="text-xs mt-0.5 truncate" style={{color:"hsl(215 25% 55%)"}}>Head: {d.headTitle} · {d.rationale?.substring(0,90)}...</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p className="text-sm font-bold" style={{color:"hsl(210 40% 88%)"}}>{d.currentHeadcount||0}<span className="text-[10px] font-normal" style={{color:"hsl(215 25% 50%)"}}> / {d.requiredHeadcount||0}</span></p>
                    {gap>0&&<p className="text-[10px] font-bold" style={{color:gc(gap)}}>−{gap} needed</p>}
                  </div>
                  {isEx?<ChevronUp className="h-4 w-4" style={{color:"hsl(215 25% 45%)"}}/>:<ChevronDown className="h-4 w-4" style={{color:"hsl(215 25% 45%)"}}/>}
                </div>
              </button>

              {isEx&&(
                <div className="px-5 pb-6 space-y-5" style={{borderTop:"1px solid hsl(var(--border))"}}>
                  {/* Rationale */}
                  <div className="pt-4 rounded-xl px-4 py-3 mt-4" style={{background:`${col}08`,border:`1px solid ${col}20`}}>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{color:col}}>Why This Department Exists</p>
                    <p className="text-xs leading-relaxed" style={{color:"hsl(210 40% 78%)"}}>{d.rationale}</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Sections */}
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{color:col}}>Sections & Headcount</p>
                      <div className="space-y-3">
                        {(d.sections||[]).map((sec:any,i:number)=>{
                          const sg=(sec.requiredStaff||0)-(sec.currentStaff||0);
                          return(
                            <div key={i} className="rounded-xl p-3.5" style={{background:"hsl(216 45% 11%)"}}>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold" style={{color:"hsl(210 40% 88%)"}}>{sec.sectionName}</span>
                                <span className="text-[10px] font-bold" style={{color:sg>0?"hsl(38 95% 60%)":"hsl(158 64% 55%)"}}>{sec.currentStaff||0}/{sec.requiredStaff||0}{sg>0?` (−${sg})`:""}</span>
                              </div>
                              <Bar pct={Math.min(100,Math.round(((sec.currentStaff||0)/(sec.requiredStaff||1))*100))} c={sg>0?"hsl(38 95% 52%)":"hsl(158 64% 45%)"}/>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {(sec.roles||[]).map((r:string,j:number)=><span key={j} className="text-[10px] px-2 py-0.5 rounded-lg" style={{background:"hsl(216 45% 16%)",color:"hsl(215 25% 65%)"}}>{r}</span>)}
                              </div>
                              {sec.keyDeliverables?.length>0&&(
                                <div className="mt-2 pt-2" style={{borderTop:"1px solid hsl(216 45% 18%)"}}>
                                  <p className="text-[9px] uppercase font-bold mb-1" style={{color:"hsl(215 25% 40%)"}}>Key Deliverables</p>
                                  {sec.keyDeliverables.map((d:string,j:number)=><p key={j} className="text-[10px]" style={{color:"hsl(215 25% 60%)"}}>{j+1}. {d}</p>)}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Responsibilities */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{color:col}}>Responsibilities</p>
                        <div className="space-y-2">
                          {(d.responsibilities||[]).map((r:string,i:number)=>(
                            <div key={i} className="flex items-start gap-2 text-xs">
                              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{color:col}}/>
                              <span style={{color:"hsl(210 40% 78%)"}}>{r}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{color:col}}>KPIs</p>
                        <div className="flex flex-wrap gap-1.5">
                          {(d.kpis||[]).map((k:string,i:number)=><span key={i} className="text-[11px] px-2.5 py-1.5 rounded-lg font-medium" style={{background:`${col}10`,color:col,border:`1px solid ${col}25`}}>{k}</span>)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Processes owned, tools, relations */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {d.coreProcessesOwned?.length>0&&(
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{color:col}}>Processes Owned</p>
                        <div className="space-y-1">{d.coreProcessesOwned.map((p:string,i:number)=><p key={i} className="text-[11px]" style={{color:"hsl(215 25% 62%)"}}>{i+1}. {p}</p>)}</div>
                      </div>
                    )}
                    {d.recommendedTools?.length>0&&(
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{color:col}}>Recommended Tools</p>
                        <div className="flex flex-wrap gap-1">{d.recommendedTools.map((t:string,i:number)=><span key={i} className="text-[10px] px-2 py-0.5 rounded-lg" style={{background:"hsl(217 91% 70%/0.1)",color:"hsl(217 91% 70%)",border:"1px solid hsl(217 91% 70%/0.2)"}}>{t}</span>)}</div>
                      </div>
                    )}
                    {d.complianceResponsibilities?.length>0&&(
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{color:"hsl(38 95% 60%)"}}>Compliance ({co.country})</p>
                        <div className="space-y-1">{d.complianceResponsibilities.map((c:string,i:number)=><p key={i} className="text-[10px]" style={{color:"hsl(215 25% 62%)"}}>{i+1}. {c}</p>)}</div>
                      </div>
                    )}
                  </div>

                  {/* Budget + relations */}
                  {d.budgetOwnership&&(
                    <div className="rounded-lg px-4 py-3" style={{background:"hsl(216 45% 12%)"}}>
                      <span className="text-[10px] font-bold uppercase" style={{color:"hsl(215 25% 45%)"}}>Budget Ownership: </span>
                      <span className="text-xs" style={{color:"hsl(210 40% 78%)"}}>{d.budgetOwnership}</span>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      {label:"Internal Customers",items:d.internalCustomers,c:"hsl(158 64% 55%)"},
                      {label:"Internal Suppliers",items:d.internalSuppliers,c:"hsl(217 91% 70%)"},
                      {label:"Collaborates With",items:d.collaboratesWith,c:"hsl(280 80% 70%)"},
                    ].map(g=>g.items?.length>0&&(
                      <div key={g.label} className="rounded-lg p-3" style={{background:"hsl(216 45% 12%)"}}>
                        <p className="text-[10px] font-bold uppercase mb-2" style={{color:g.c}}>{g.label}</p>
                        <div className="flex flex-wrap gap-1">{g.items.map((item:string,i:number)=><span key={i} className="text-[10px] px-2 py-0.5 rounded" style={{background:"hsl(216 45% 18%)",color:g.c}}>{item}</span>)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // ── PROCESSES TAB ────────────────────────────────────────────────────────────
  const ProcsTab=()=>(
    <div className="space-y-4">
      <Hdr
        title="Business Processes & Standard Operating Procedures"
        sub={`All workflows, SOPs, approval matrix and communication protocols — specific to ${co.activity}`}
        btn={<GoldBtn onClick={()=>procAI.analyze(`${pText()}\n\nDesign ALL processes and SOPs for this company. Be extremely specific to the business activity (${co.activity}), industry (${co.industry}), size (${co.employees} employees), and country (${co.country}). Use the actual terminology of this industry. Include ALL approval thresholds in local currency context.`)} loading={procAI.loading} label="Generate All Processes" busy="Designing..." Icon={ClipboardList}/>}
      />
      {procAI.error&&<Err msg={procAI.error}/>}
      {procAI.loading&&<Spin msg={`Designing all processes for ${co.name}...`}/>}
      {procAI.result&&!procAI.loading&&(()=>{
        const r=procAI.result;
        return(
          <div className="space-y-5">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                {l:"Total Processes",v:r.totalProcessCount,c:"hsl(38 95% 60%)"},
                {l:"Core / Revenue",v:r.processByCategory?.core,c:"hsl(0 72% 68%)"},
                {l:"Support / Mgmt",v:(r.processByCategory?.support||0)+(r.processByCategory?.management||0),c:"hsl(217 91% 70%)"},
              ].map((s,i)=>(
                <div key={i} className="rounded-xl p-4 text-center" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                  <p className="text-2xl font-black" style={{color:s.c}}>{s.v}</p>
                  <p className="text-[11px] mt-0.5" style={{color:"hsl(215 25% 50%)"}}>{s.l}</p>
                </div>
              ))}
            </div>

            {/* Core Processes */}
            {r.coreProcesses?.length>0&&(
              <div className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-widest px-1" style={{color:"hsl(215 25% 45%)"}}>Core Business Processes</p>
                {r.coreProcesses.map((proc:any,i:number)=>{
                  const isEx=exProc===i;
                  const pc=proc.criticality==="Mission-Critical"?"hsl(0 72% 68%)":proc.criticality==="High"?"hsl(38 95% 60%)":"hsl(217 91% 70%)";
                  return(
                    <div key={i} className="rounded-xl overflow-hidden" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                      <button onClick={()=>setExProc(isEx?null:i)} className="w-full flex items-start gap-4 px-5 py-4 text-left">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0" style={{background:`${pc}18`}}>
                          <span className="text-xs font-black" style={{color:pc}}>{i+1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <span className="font-bold text-sm" style={{color:"hsl(210 40% 92%)"}}>{proc.processName}</span>
                            <Badge v={proc.criticality} c={pc}/>
                            <Badge v={proc.category} c="hsl(215 25% 55%)"/>
                            <span className="text-[10px]" style={{color:"hsl(215 25% 45%)"}}>Owner: {proc.processOwner}</span>
                            <span className="text-[10px]" style={{color:"hsl(215 25% 45%)"}}>Freq: {proc.frequency}</span>
                          </div>
                          <p className="text-xs" style={{color:"hsl(215 25% 55%)"}}>{proc.objective}</p>
                        </div>
                        <span className="text-[10px] shrink-0 font-semibold" style={{color:"hsl(215 25% 45%)"}}>{proc.steps?.length||0} steps</span>
                        {isEx?<ChevronUp className="h-4 w-4 shrink-0" style={{color:"hsl(215 25% 45%)"}}/>:<ChevronDown className="h-4 w-4 shrink-0" style={{color:"hsl(215 25% 45%)"}}/>}
                      </button>
                      {isEx&&(
                        <div className="px-5 pb-5" style={{borderTop:"1px solid hsl(var(--border))"}}>
                          <div className="grid grid-cols-3 gap-3 py-4">
                            {[{l:"Trigger",v:proc.triggerEvent,c:"hsl(38 95% 60%)"},{l:"Escalation",v:proc.escalationPath,c:"hsl(0 72% 68%)"},{l:"Dept",v:proc.department,c:"hsl(217 91% 70%)"}].map((m,j)=>(
                              <div key={j}><p className="text-[9px] font-bold uppercase mb-0.5" style={{color:"hsl(215 25% 40%)"}}>{m.l}</p><p className="text-xs font-semibold" style={{color:m.c}}>{m.v}</p></div>
                            ))}
                          </div>
                          {/* Inputs */}
                          {proc.inputs?.length>0&&(
                            <div className="mb-3">
                              <p className="text-[10px] font-bold uppercase mb-1.5" style={{color:"hsl(217 91% 70%)"}}>Inputs Required</p>
                              <div className="flex flex-wrap gap-1.5">{proc.inputs.map((inp:string,j:number)=><span key={j} className="text-[10px] px-2.5 py-1 rounded-lg" style={{background:"hsl(216 45% 16%)",color:"hsl(215 25% 65%)"}}>{inp}</span>)}</div>
                            </div>
                          )}
                          {/* Steps */}
                          <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{color:pc}}>Process Steps</p>
                          <div className="space-y-2">
                            {(proc.steps||[]).map((step:any,j:number)=>(
                              <div key={j} className="flex items-start gap-3 p-3 rounded-xl" style={{background:"hsl(216 45% 11%)"}}>
                                <span className="flex h-6 w-6 items-center justify-center rounded-lg text-[10px] font-black shrink-0" style={{background:`${pc}20`,color:pc}}>{step.stepNo||j+1}</span>
                                <div className="flex-1">
                                  <p className="text-xs font-semibold" style={{color:"hsl(210 40% 88%)"}}>{step.action||step}</p>
                                  {step.responsible&&(
                                    <div className="flex flex-wrap gap-3 mt-1">
                                      {[{l:"Responsible",v:step.responsible,c:"hsl(215 25% 60%)"},{l:"Tool",v:step.tool,c:"hsl(217 91% 70%)"},{l:"SLA",v:step.sla,c:"hsl(38 95% 60%)"},{l:"Output",v:step.output,c:"hsl(158 64% 55%)"}].filter(m=>m.v).map((m,k)=>(
                                        <span key={k} className="text-[10px]"><span style={{color:"hsl(215 25% 40%)"}}>{m.l}:</span> <span style={{color:m.c}}>{m.v}</span></span>
                                      ))}
                                    </div>
                                  )}
                                  {step.decision&&<p className="text-[10px] mt-1 italic" style={{color:"hsl(280 80% 70%)"}}>⚡ Decision: {step.decision}</p>}
                                  {step.riskIfSkipped&&<p className="text-[10px] mt-0.5 italic" style={{color:"hsl(0 72% 65%)"}}>⚠ Risk if skipped: {step.riskIfSkipped}</p>}
                                </div>
                              </div>
                            ))}
                          </div>
                          {/* Controls, KPIs, Risks */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                            {[
                              {l:"Quality Controls",items:proc.qualityControls,c:"hsl(158 64% 55%)"},
                              {l:"Process KPIs",items:proc.kpis,c:"hsl(38 95% 60%)"},
                              {l:"Risks",items:proc.risks,c:"hsl(0 72% 68%)"},
                            ].map(g=>g.items?.length>0&&(
                              <div key={g.l} className="rounded-lg p-3" style={{background:"hsl(216 45% 12%)"}}>
                                <p className="text-[10px] font-bold uppercase mb-1.5" style={{color:g.c}}>{g.l}</p>
                                <div className="space-y-1">{g.items.map((item:string,j:number)=><p key={j} className="text-[10px]" style={{color:"hsl(215 25% 60%)"}}>{item}</p>)}</div>
                              </div>
                            ))}
                          </div>
                          {proc.requiredDocuments?.length>0&&(
                            <div className="mt-3">
                              <p className="text-[10px] font-bold uppercase mb-1.5" style={{color:"hsl(215 25% 45%)"}}>Required Documents</p>
                              <div className="flex flex-wrap gap-1.5">{proc.requiredDocuments.map((d:string,j:number)=><span key={j} className="text-[10px] px-2.5 py-1 rounded-lg" style={{background:"hsl(216 45% 16%)",color:"hsl(215 25% 65%)"}}><FileText className="h-3 w-3 inline mr-1"/>{d}</span>)}</div>
                            </div>
                          )}
                          {proc.regulatoryRequirements?.length>0&&(
                            <div className="mt-3 p-3 rounded-xl" style={{background:"hsl(38 95% 52%/0.06)",border:"1px solid hsl(38 95% 52%/0.2)"}}>
                              <p className="text-[10px] font-bold uppercase mb-1.5" style={{color:"hsl(38 95% 60%)"}}>Regulatory Requirements ({co.country})</p>
                              <div className="space-y-1">{proc.regulatoryRequirements.map((r:string,j:number)=><p key={j} className="text-[10px]" style={{color:"hsl(215 25% 65%)"}}>{j+1}. {r}</p>)}</div>
                            </div>
                          )}
                          {proc.processGaps?.length>0&&(
                            <div className="mt-3 p-3 rounded-xl" style={{background:"hsl(0 72% 51%/0.06)",border:"1px solid hsl(0 72% 51%/0.2)"}}>
                              <p className="text-[10px] font-bold uppercase mb-1.5" style={{color:"hsl(0 72% 68%)"}}>Typical Process Gaps in {co.industry}</p>
                              <div className="space-y-1">{proc.processGaps.map((g:string,j:number)=><p key={j} className="flex items-start gap-1.5 text-[10px]"><AlertTriangle className="h-3 w-3 shrink-0 mt-0.5" style={{color:"hsl(0 72% 68%)"}}/><span style={{color:"hsl(215 25% 65%)"}}>{g}</span></p>)}</div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* SOPs */}
            {r.sops?.length>0&&(
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest px-1 mb-3" style={{color:"hsl(215 25% 45%)"}}>Standard Operating Procedures ({r.sops.length} SOPs)</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {r.sops.map((sop:any,i:number)=>(
                    <div key={i} className="rounded-xl p-4" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge v={sop.sopCode} c="hsl(38 95% 60%)"/>
                          <span className="text-xs font-bold" style={{color:"hsl(210 40% 88%)"}}>{sop.title}</span>
                        </div>
                        {sop.revision&&<span className="text-[9px] px-1.5 py-0.5 rounded shrink-0" style={{background:"hsl(216 45% 18%)",color:"hsl(215 25% 50%)"}}>{sop.revision}</span>}
                      </div>
                      <div className="flex items-center gap-3 text-[10px] mb-1.5" style={{color:"hsl(215 25% 50%)"}}>
                        <span>{sop.department}</span><span>·</span><span>{sop.frequency}</span><span>·</span><span style={{color:"hsl(38 95% 55%)"}}>{sop.owner}</span>
                      </div>
                      {sop.scope&&<p className="text-[10px] mb-1.5" style={{color:"hsl(215 25% 50%)"}}><span style={{color:"hsl(215 25% 40%)"}}>Scope:</span> {sop.scope}</p>}
                      <p className="text-[11px] mb-2 italic" style={{color:"hsl(215 25% 55%)"}}>{sop.purpose}</p>
                      {sop.prerequisites?.length>0&&(
                        <div className="mb-2">
                          <p className="text-[9px] font-bold uppercase mb-1" style={{color:"hsl(217 91% 70%)"}}>Prerequisites</p>
                          <div className="flex flex-wrap gap-1">{sop.prerequisites.map((p:string,j:number)=><span key={j} className="text-[9px] px-1.5 py-0.5 rounded" style={{background:"hsl(217 91% 70%/0.08)",color:"hsl(217 91% 70%)"}}>{p}</span>)}</div>
                        </div>
                      )}
                      <div className="space-y-1">{(sop.steps||[]).map((s:string,j:number)=>(
                        <div key={j} className="flex items-start gap-1.5 text-[10px]">
                          <span className="font-bold shrink-0 w-5 text-right" style={{color:"hsl(38 95% 60%)"}}>{j+1}.</span>
                          <span style={{color:"hsl(215 25% 62%)"}}>{s}</span>
                        </div>
                      ))}</div>
                      {sop.checkpoints?.length>0&&(
                        <div className="mt-2 pt-2" style={{borderTop:"1px solid hsl(var(--border))"}}>
                          <p className="text-[9px] font-bold uppercase mb-1" style={{color:"hsl(158 64% 55%)"}}>✓ Quality Checkpoints</p>
                          <div className="flex flex-wrap gap-1">{sop.checkpoints.map((c:string,j:number)=><span key={j} className="text-[9px] px-1.5 py-0.5 rounded" style={{background:"hsl(158 64% 40%/0.1)",color:"hsl(158 64% 55%)"}}>{c}</span>)}</div>
                        </div>
                      )}
                      {sop.recordsRequired?.length>0&&(
                        <div className="mt-2 pt-2" style={{borderTop:"1px solid hsl(var(--border))"}}>
                          <p className="text-[9px] font-bold uppercase mb-1" style={{color:"hsl(215 25% 45%)"}}>Records to Keep</p>
                          <div className="flex flex-wrap gap-1">{sop.recordsRequired.map((r:string,j:number)=><span key={j} className="text-[9px] px-1.5 py-0.5 rounded" style={{background:"hsl(216 45% 16%)",color:"hsl(215 25% 60%)"}}>{r}</span>)}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Approval Matrix */}
            {r.approvalAuthority?.length>0&&(
              <div className="rounded-xl overflow-hidden" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                <div className="px-5 py-3" style={{background:"hsl(216 45% 11%)"}}><h3 className="text-sm font-bold" style={{color:"hsl(210 40% 92%)"}}>Approval Authority Matrix — {co.country}</h3></div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead><tr style={{background:"hsl(216 45% 10%)"}}>
                      {["Decision Type","Amount/Scope","Primary Approver","Alternate","Escalation To","Max Hours","Document Required","Country Note"].map(h=><th key={h} className="px-3 py-2.5 text-left font-semibold whitespace-nowrap" style={{color:"hsl(215 25% 45%)"}}>{h}</th>)}
                    </tr></thead>
                    <tbody>{r.approvalAuthority.map((row:any,i:number)=>(
                      <tr key={i} style={{borderTop:"1px solid hsl(var(--border))",background:i%2===0?"transparent":"hsl(216 45% 8%/0.5)"}}>
                        <td className="px-3 py-2.5 font-medium" style={{color:"hsl(210 40% 85%)"}}>{row.decisionType}</td>
                        <td className="px-3 py-2.5 font-semibold" style={{color:"hsl(38 95% 60%)"}}>{row.amountOrScope}</td>
                        <td className="px-3 py-2.5" style={{color:"hsl(158 64% 55%)"}}>{row.primaryApprover}</td>
                        <td className="px-3 py-2.5" style={{color:"hsl(215 25% 55%)"}}>{row.alternateApprover}</td>
                        <td className="px-3 py-2.5" style={{color:"hsl(217 91% 70%)"}}>{row.escalationTo}</td>
                        <td className="px-3 py-2.5 font-bold" style={{color:"hsl(38 95% 60%)"}}>{row.maxResponseHours||(row.maxResponseDays?`${row.maxResponseDays*24}`:"-")}h</td>
                        <td className="px-3 py-2.5" style={{color:"hsl(215 25% 50%)"}}>{row.documentRequired}</td>
                        <td className="px-3 py-2.5" style={{color:"hsl(38 95% 55%)",fontSize:"10px"}}>{row.countryNote||"—"}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Meeting Cadence */}
            {r.meetingCadence?.length>0&&(
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest px-1 mb-3" style={{color:"hsl(215 25% 45%)"}}>Meeting Cadence</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {r.meetingCadence.map((m:any,i:number)=>{
                    const tc=m.type==="Strategic"?"hsl(38 95% 60%)":m.type==="Operational"?"hsl(158 64% 55%)":"hsl(217 91% 70%)";
                    return(
                      <div key={i} className="rounded-xl p-4" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold" style={{color:"hsl(210 40% 88%)"}}>{m.meetingName}</span>
                          <div className="flex items-center gap-2"><Badge v={m.type} c={tc}/><span className="text-[10px]" style={{color:"hsl(215 25% 50%)"}}>{m.duration}</span></div>
                        </div>
                        <p className="text-[10px] mb-1" style={{color:"hsl(215 25% 50%)"}}><strong>Chair:</strong> {m.chair} · <strong>Freq:</strong> {m.frequency}</p>
                        <p className="text-[10px] mb-2" style={{color:"hsl(215 25% 50%)"}}><strong>Attendees:</strong> {(m.attendees||[]).join(", ")}</p>
                        <div className="space-y-0.5">{(m.mandatoryAgenda||[]).map((a:string,j:number)=><p key={j} className="text-[10px]" style={{color:"hsl(215 25% 60%)"}}>{j+1}. {a}</p>)}</div>
                        {m.outputRequired&&<p className="text-[10px] mt-2" style={{color:"hsl(38 95% 55%)"}}><strong>Output:</strong> {m.outputRequired}</p>}
                        {m.preparationRequired&&<p className="text-[10px] mt-1" style={{color:"hsl(217 91% 70%)"}}><strong>Prep:</strong> {m.preparationRequired}</p>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Communication Matrix */}
            {r.communicationMatrix&&(
              <div className="rounded-xl p-5" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{color:"hsl(217 91% 70%)"}}>Communication Matrix</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[{label:"Internal",data:r.communicationMatrix.internal},{label:"External",data:r.communicationMatrix.external}].map(g=>g.data&&(
                    <div key={g.label}>
                      <p className="text-[10px] font-bold uppercase mb-2" style={{color:"hsl(215 25% 45%)"}}>{g.label}</p>
                      <div className="space-y-1.5">{Object.entries(g.data).map(([k,v])=>(
                        <div key={k} className="flex gap-2 text-xs">
                          <span className="capitalize font-semibold w-20 shrink-0" style={{color:"hsl(215 25% 50%)"}}>{k}:</span>
                          <span style={{color:"hsl(210 40% 75%)"}}>{String(v)}</span>
                        </div>
                      ))}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Performance Management */}
            {r.performanceManagement&&(
              <div className="rounded-xl p-5" style={{background:"hsl(38 95% 52%/0.05)",border:"1px solid hsl(38 95% 52%/0.2)"}}>
                <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{color:"hsl(38 95% 60%)"}}>Performance Management Framework</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(r.performanceManagement).map(([k,v])=>(
                    <div key={k}><p className="text-[10px] font-bold uppercase capitalize" style={{color:"hsl(215 25% 45%)"}}>{k.replace(/([A-Z])/g," $1")}:</p><p className="text-xs mt-0.5" style={{color:"hsl(210 40% 78%)"}}>{String(v)}</p></div>
                  ))}
                </div>
              </div>
            )}

            {/* Process Maturity + Document System */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {r.processMaturityLevel&&(
                <div className="rounded-xl p-4" style={{background:"hsl(217 91% 70%/0.06)",border:"1px solid hsl(217 91% 70%/0.2)"}}>
                  <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{color:"hsl(217 91% 70%)"}}>Process Maturity Level</p>
                  <p className="text-sm" style={{color:"hsl(210 40% 82%)"}}>{r.processMaturityLevel}</p>
                </div>
              )}
              {r.documentManagement?.recommendedSystem&&(
                <div className="rounded-xl p-4" style={{background:"hsl(158 64% 40%/0.06)",border:"1px solid hsl(158 64% 40%/0.2)"}}>
                  <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{color:"hsl(158 64% 55%)"}}>Recommended Document System</p>
                  <p className="text-sm" style={{color:"hsl(210 40% 82%)"}}>{r.documentManagement.recommendedSystem}</p>
                </div>
              )}
            </div>

            {/* Process Improvement Roadmap */}
            {r.processImprovementRoadmap?.length>0&&(
              <div className="rounded-xl overflow-hidden" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                <div className="px-5 py-3" style={{background:"hsl(216 45% 11%)"}}><h3 className="text-sm font-bold" style={{color:"hsl(210 40% 92%)"}}>Process Improvement Roadmap — Priority Order</h3></div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead><tr style={{background:"hsl(216 45% 10%)"}}>
                      {["#","Process","Current State","Target State","Effort","Impact","Timeline"].map(h=><th key={h} className="px-3 py-2.5 text-left font-semibold whitespace-nowrap" style={{color:"hsl(215 25% 45%)"}}>{h}</th>)}
                    </tr></thead>
                    <tbody>{r.processImprovementRoadmap.map((item:any,i:number)=>{
                      const ec=item.effort==="High"?"hsl(0 72% 68%)":item.effort==="Medium"?"hsl(38 95% 60%)":"hsl(158 64% 55%)";
                      const ic=item.impact==="High"?"hsl(158 64% 55%)":item.impact==="Medium"?"hsl(38 95% 60%)":"hsl(215 25% 55%)";
                      return(
                        <tr key={i} style={{borderTop:"1px solid hsl(var(--border))",background:i%2===0?"transparent":"hsl(216 45% 8%/0.5)"}}>
                          <td className="px-3 py-2.5 font-black" style={{color:"hsl(38 95% 60%)"}}>{item.priority}</td>
                          <td className="px-3 py-2.5 font-semibold" style={{color:"hsl(210 40% 88%)"}}>{item.process}</td>
                          <td className="px-3 py-2.5" style={{color:"hsl(0 72% 65%)"}}>{item.currentState}</td>
                          <td className="px-3 py-2.5" style={{color:"hsl(158 64% 55%)"}}>{item.targetState}</td>
                          <td className="px-3 py-2.5"><span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{background:`${ec}15`,color:ec}}>{item.effort}</span></td>
                          <td className="px-3 py-2.5"><span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{background:`${ic}15`,color:ic}}>{item.impact}</span></td>
                          <td className="px-3 py-2.5" style={{color:"hsl(217 91% 70%)"}}>{item.timeline}</td>
                        </tr>
                      );
                    })}</tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );
      })()}
      {!procAI.result&&!procAI.loading&&!procAI.error&&(
        <div className="rounded-xl p-14 text-center" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
          <ClipboardList className="h-14 w-14 mx-auto mb-4 opacity-15" style={{color:"hsl(38 95% 52%)"}}/>
          <p className="font-semibold" style={{color:"hsl(215 25% 55%)"}}>Click "Generate All Processes" for complete process design</p>
          <p className="text-xs mt-1" style={{color:"hsl(215 25% 38%)"}}>Specific to {co.activity} · {co.industry} · {co.country} · includes process improvement roadmap</p>
        </div>
      )}
    </div>
  );

  // ── JOB ROLES TAB ─────────────────────────────────────────────────────────────
  const RolesTab=()=>(
    <div className="space-y-4">
      <Hdr
        title="Job Role Specifications"
        sub={`Complete role design for all ${co.jobTypes||"distinct"} job types · ${co.industry} · ${co.city}, ${co.country}`}
        btn={<GoldBtn
          onClick={()=>rolAI.analyze(`${pText()}\n\nDepartment structure: ${JSON.stringify(orgAI.result?.structure?.departments?.map((d:any)=>({name:d.name,sections:d.sections,roles:d.sections?.flatMap((s:any)=>s.roles)})))}\n\nDesign COMPLETE job role specifications for EVERY distinct job type in this company. Be 100% specific to the business activity (${co.activity}), location (${co.city}, ${co.country}), revenue (${co.revenue}), and exactly ${co.jobTypes||"all"} job types. Include realistic local salary data and real measurable KPIs.`)}
          loading={rolAI.loading} label="Generate All Job Roles" busy="Designing roles..." Icon={Users}
        />}
      />
      {rolAI.error&&<Err msg={rolAI.error}/>}
      {rolAI.loading&&<Spin msg={`Designing ${co.jobTypes||"all"} job roles for ${co.name}...`}/>}
      {rolAI.result&&!rolAI.loading&&(()=>{
        const r=rolAI.result;
        const families:any[]=r.roleFamilies||[];
        return(
          <div className="space-y-5">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                {l:"Total Roles Defined",v:r.totalRoles,c:"hsl(38 95% 60%)"},
                {l:"Role Families",v:families.length,c:"hsl(158 64% 55%)"},
                {l:"Managers & Above",v:(r.orgPyramid?.cLevel||0)+(r.orgPyramid?.directors||0)+(r.orgPyramid?.managers||0),c:"hsl(217 91% 70%)"},
                {l:"Frontline Staff",v:(r.orgPyramid?.juniors||0)+(r.orgPyramid?.entry||0),c:"hsl(280 80% 70%)"},
              ].map((s,i)=>(
                <div key={i} className="rounded-xl p-4 text-center" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                  <p className="text-3xl font-black" style={{color:s.c}}>{s.v}</p>
                  <p className="text-[11px] mt-1" style={{color:"hsl(215 25% 50%)"}}>{s.l}</p>
                </div>
              ))}
            </div>

            {/* Org Pyramid */}
            {r.orgPyramid&&(
              <div className="rounded-xl p-5" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                <p className="text-[11px] font-bold uppercase tracking-wider mb-4" style={{color:"hsl(38 95% 60%)"}}>Org Pyramid</p>
                <div className="space-y-1.5 max-w-sm mx-auto">
                  {[
                    {label:"C-Suite",val:r.orgPyramid.cLevel,w:"25%",c:"hsl(38 95% 52%)"},
                    {label:"Directors",val:r.orgPyramid.directors,w:"40%",c:"hsl(280 80% 60%)"},
                    {label:"Managers",val:r.orgPyramid.managers,w:"55%",c:"hsl(217 91% 60%)"},
                    {label:"Senior",val:r.orgPyramid.seniors,w:"70%",c:"hsl(158 64% 45%)"},
                    {label:"Junior",val:r.orgPyramid.juniors,w:"85%",c:"hsl(200 70% 55%)"},
                    {label:"Entry Level",val:r.orgPyramid.entry,w:"100%",c:"hsl(215 25% 50%)"},
                  ].map((row,i)=>(
                    <div key={i} className="flex items-center gap-3" style={{paddingLeft:`calc(50% - ${parseInt(row.w)/2}%)`}}>
                      <div className="flex-1 rounded-lg py-1.5 px-3 flex justify-between items-center" style={{background:`${row.c}18`,border:`1px solid ${row.c}30`}}>
                        <span className="text-[11px] font-semibold" style={{color:"hsl(210 40% 85%)"}}>{row.label}</span>
                        <span className="text-[11px] font-black" style={{color:row.c}}>{row.val}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Critical roles */}
            {r.criticalRoles?.length>0&&(
              <div className="rounded-xl p-4" style={{background:"hsl(0 72% 51%/0.06)",border:"1px solid hsl(0 72% 51%/0.2)"}}>
                <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{color:"hsl(0 72% 68%)"}}>Mission-Critical Roles</p>
                <div className="space-y-1">{r.criticalRoles.map((cr:string,i:number)=>(
                  <div key={i} className="flex items-start gap-2 text-xs"><Star className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{color:"hsl(38 95% 60%)"}}/><span style={{color:"hsl(210 40% 80%)"}}>{cr}</span></div>
                ))}</div>
              </div>
            )}

            {/* Role families */}
            {families.map((fam:any)=>(
              <div key={fam.familyName} className="space-y-3">
                <div className="flex items-center gap-3 px-1">
                  <div className="h-0.5 flex-1" style={{background:`${fam.familyColor||"hsl(38 95% 52%)"}30`}}/>
                  <p className="text-[11px] font-bold uppercase tracking-widest whitespace-nowrap" style={{color:fam.familyColor||"hsl(38 95% 60%)"}}>{fam.familyName}</p>
                  <div className="h-0.5 flex-1" style={{background:`${fam.familyColor||"hsl(38 95% 52%)"}30`}}/>
                </div>
                {(fam.roles||[]).map((role:any)=>{
                  const isEx=exRole===role.roleId;
                  const col=fam.familyColor||"hsl(38 95% 60%)";
                  const lvlC=role.level==="C-Suite"||role.level==="Director"?"hsl(38 95% 60%)":role.level==="Manager"||role.level==="Lead"?"hsl(158 64% 55%)":"hsl(217 91% 70%)";
                  return(
                    <div key={role.roleId} className="rounded-xl overflow-hidden" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                      <button onClick={()=>setExRole(isEx?null:role.roleId)}
                        className="w-full flex items-center gap-4 px-5 py-4 text-left transition-all"
                        style={{background:isEx?`${col}08`:"transparent"}}>
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl shrink-0" style={{background:`${col}18`,border:`1px solid ${col}35`}}>
                          <Users className="h-5 w-5" style={{color:col}}/>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm" style={{color:"hsl(210 40% 92%)"}}>{role.jobTitle}</span>
                            {role.jobTitleAr&&<span className="text-[10px] opacity-60" style={{color:col}}>{role.jobTitleAr}</span>}
                            <Badge v={role.level} c={lvlC}/>
                            <Badge v={`×${role.headcount}`} c="hsl(215 25% 55%)"/>
                          </div>
                          <p className="text-xs mt-0.5" style={{color:"hsl(215 25% 55%)"}}>{role.department}{role.section?` → ${role.section}`:""} · Reports to: {role.reportsTo}</p>
                          {role.missionStatement&&<p className="text-xs mt-0.5 italic truncate" style={{color:"hsl(215 25% 60%)"}}>{role.missionStatement}</p>}
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <p className="text-sm font-bold" style={{color:"hsl(38 95% 60%)"}}>${role.salaryRangeUSD?.mid?.toLocaleString()}<span className="text-[10px] font-normal" style={{color:"hsl(215 25% 50%)"}}>/mo</span></p>
                          </div>
                          {isEx?<ChevronUp className="h-4 w-4" style={{color:"hsl(215 25% 45%)"}}/>:<ChevronDown className="h-4 w-4" style={{color:"hsl(215 25% 45%)"}}/>}
                        </div>
                      </button>

                      {isEx&&(
                        <div className="px-5 pb-6 space-y-5" style={{borderTop:"1px solid hsl(var(--border))"}}>
                          {/* Mission */}
                          <div className="pt-4 rounded-xl px-4 py-3 mt-4" style={{background:`${col}08`,border:`1px solid ${col}20`}}>
                            <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{color:col}}>Role Mission</p>
                            <p className="text-sm" style={{color:"hsl(210 40% 82%)"}}>{role.missionStatement}</p>
                          </div>

                          {/* Responsibilities */}
                          {role.coreResponsibilities?.length>0&&(
                            <div>
                              <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{color:col}}>Core Responsibilities</p>
                              <div className="rounded-xl overflow-hidden" style={{border:"1px solid hsl(var(--border))"}}>
                                <table className="w-full text-xs">
                                  <thead><tr style={{background:"hsl(216 45% 10%)"}}>
                                    {["Responsibility","Frequency","Time %","Output"].map(h=><th key={h} className="px-3 py-2.5 text-left font-semibold" style={{color:"hsl(215 25% 45%)"}}>{h}</th>)}
                                  </tr></thead>
                                  <tbody>{role.coreResponsibilities.map((resp:any,i:number)=>(
                                    <tr key={i} style={{borderTop:"1px solid hsl(var(--border))",background:i%2===0?"transparent":"hsl(216 45% 8%/0.5)"}}>
                                      <td className="px-3 py-2" style={{color:"hsl(210 40% 82%)"}}>{resp.responsibility}</td>
                                      <td className="px-3 py-2 whitespace-nowrap"><Badge v={resp.frequency} c="hsl(215 25% 55%)"/></td>
                                      <td className="px-3 py-2 font-bold" style={{color:col}}>{resp.timePercent}%</td>
                                      <td className="px-3 py-2" style={{color:"hsl(215 25% 60%)"}}>{resp.output}</td>
                                    </tr>
                                  ))}</tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          {/* KPIs */}
                          {role.kpis?.length>0&&(
                            <div>
                              <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{color:col}}>KPIs & Performance Metrics</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {role.kpis.map((kpi:any,i:number)=>(
                                  <div key={i} className="rounded-xl p-3" style={{background:"hsl(216 45% 11%)"}}>
                                    <p className="text-[11px] font-bold" style={{color:"hsl(210 40% 88%)"}}>{kpi.kpi}</p>
                                    <div className="flex items-center gap-3 mt-1 text-[10px]">
                                      <span style={{color:"hsl(158 64% 55%)"}}>Target: <strong>{kpi.target}</strong></span>
                                      <span style={{color:"hsl(215 25% 50%)"}}>{kpi.frequency}</span>
                                      <span style={{color:"hsl(215 25% 45%)"}}>{kpi.dataSource}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Qualifications + Skills */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {role.qualifications&&(
                              <div>
                                <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{color:col}}>Qualifications</p>
                                <div className="space-y-2">
                                  {[
                                    {l:"Education",v:role.qualifications.education},
                                    {l:"Experience",v:role.qualifications.experience},
                                    {l:"Languages",v:role.qualifications.languages},
                                  ].map(q=>q.v&&(
                                    <div key={q.l} className="flex gap-2 text-xs">
                                      <span className="w-24 shrink-0 font-semibold" style={{color:"hsl(215 25% 50%)"}}>{q.l}:</span>
                                      <span style={{color:"hsl(210 40% 78%)"}}>{q.v}</span>
                                    </div>
                                  ))}
                                  {role.qualifications.certifications?.length>0&&(
                                    <div>
                                      <p className="text-[10px] font-semibold mb-1" style={{color:"hsl(215 25% 50%)"}}>Certifications:</p>
                                      <div className="flex flex-wrap gap-1">{role.qualifications.certifications.map((c:string,i:number)=><span key={i} className="text-[10px] px-2 py-0.5 rounded" style={{background:"hsl(38 95% 52%/0.1)",color:"hsl(38 95% 60%)"}}>{c}</span>)}</div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            <div className="space-y-3">
                              {role.technicalSkills?.length>0&&(
                                <div>
                                  <p className="text-[10px] font-bold uppercase mb-2" style={{color:col}}>Technical Skills</p>
                                  <div className="flex flex-wrap gap-1">{role.technicalSkills.map((s:string,i:number)=><span key={i} className="text-[10px] px-2 py-0.5 rounded-lg" style={{background:"hsl(217 91% 70%/0.1)",color:"hsl(217 91% 70%)"}}>{s}</span>)}</div>
                                </div>
                              )}
                              {role.softSkills?.length>0&&(
                                <div>
                                  <p className="text-[10px] font-bold uppercase mb-2" style={{color:col}}>Competencies</p>
                                  <div className="flex flex-wrap gap-1">{role.softSkills.map((s:string,i:number)=><span key={i} className="text-[10px] px-2 py-0.5 rounded-lg" style={{background:"hsl(158 64% 40%/0.1)",color:"hsl(158 64% 55%)"}}>{s}</span>)}</div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Salary + Career + Conditions */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="rounded-xl p-4" style={{background:"hsl(38 95% 52%/0.06)",border:"1px solid hsl(38 95% 52%/0.2)"}}>
                              <p className="text-[10px] font-bold uppercase mb-2" style={{color:"hsl(38 95% 60%)"}}>Salary Range ({co.country})</p>
                              <div className="space-y-1">
                                <div className="flex justify-between text-[11px]">
                                  <span style={{color:"hsl(215 25% 50%)"}}>Min:</span><span style={{color:"hsl(210 40% 82%)"}}>${role.salaryRangeUSD?.min?.toLocaleString()}/mo</span>
                                </div>
                                <div className="flex justify-between text-[11px]">
                                  <span style={{color:"hsl(215 25% 50%)"}}>Mid:</span><span className="font-bold" style={{color:"hsl(38 95% 60%)"}}>${role.salaryRangeUSD?.mid?.toLocaleString()}/mo</span>
                                </div>
                                <div className="flex justify-between text-[11px]">
                                  <span style={{color:"hsl(215 25% 50%)"}}>Max:</span><span style={{color:"hsl(210 40% 82%)"}}>${role.salaryRangeUSD?.max?.toLocaleString()}/mo</span>
                                </div>
                                {role.salaryRangeLocal&&(
                                  <div className="pt-1 mt-1" style={{borderTop:"1px solid hsl(var(--border))"}}>
                                    <p className="text-[10px]" style={{color:"hsl(215 25% 45%)"}}>{role.salaryRangeLocal.currency}: {role.salaryRangeLocal.min?.toLocaleString()}–{role.salaryRangeLocal.max?.toLocaleString()}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                            {role.careerPath?.length>0&&(
                              <div className="rounded-xl p-4" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                                <p className="text-[10px] font-bold uppercase mb-2" style={{color:col}}>Career Path</p>
                                <div className="space-y-1">{role.careerPath.map((cp:string,i:number)=>(
                                  <div key={i} className="flex items-center gap-1.5 text-[11px]"><TrendingUp className="h-3 w-3" style={{color:col}}/><span style={{color:"hsl(210 40% 78%)"}}>{cp}</span></div>
                                ))}</div>
                              </div>
                            )}
                            {role.workingConditions&&(
                              <div className="rounded-xl p-4" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                                <p className="text-[10px] font-bold uppercase mb-2" style={{color:col}}>Working Conditions</p>
                                {[{l:"Schedule",v:role.workingConditions.schedule},{l:"Location",v:role.workingConditions.location},{l:"Physical",v:role.workingConditions.physicalRequirements}].map(wc=>wc.v&&(
                                  <div key={wc.l} className="flex gap-2 text-[10px] mb-1"><span className="font-semibold w-16 shrink-0" style={{color:"hsl(215 25% 50%)"}}>{wc.l}:</span><span style={{color:"hsl(215 25% 62%)"}}>{wc.v}</span></div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Success + challenges */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {role.successFactors?.length>0&&(
                              <div>
                                <p className="text-[10px] font-bold uppercase mb-2" style={{color:"hsl(158 64% 55%)"}}>Success Factors</p>
                                <div className="space-y-1">{role.successFactors.map((s:string,i:number)=><p key={i} className="flex items-start gap-1.5 text-[11px]"><CheckCircle2 className="h-3 w-3 shrink-0 mt-0.5" style={{color:"hsl(158 64% 55%)"}}/><span style={{color:"hsl(210 40% 78%)"}}>{s}</span></p>)}</div>
                              </div>
                            )}
                            {role.commonChallenges?.length>0&&(
                              <div>
                                <p className="text-[10px] font-bold uppercase mb-2" style={{color:"hsl(0 72% 68%)"}}>Common Challenges</p>
                                <div className="space-y-1">{role.commonChallenges.map((c:string,i:number)=><p key={i} className="flex items-start gap-1.5 text-[11px]"><AlertTriangle className="h-3 w-3 shrink-0 mt-0.5" style={{color:"hsl(0 72% 68%)"}}/><span style={{color:"hsl(210 40% 78%)"}}>{c}</span></p>)}</div>
                              </div>
                            )}
                          </div>

                          {/* Tools + compliance */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {role.toolsAndSystems?.length>0&&(
                              <div>
                                <p className="text-[10px] font-bold uppercase mb-2" style={{color:"hsl(217 91% 70%)"}}>Tools & Systems</p>
                                <div className="flex flex-wrap gap-1">{role.toolsAndSystems.map((t:string,i:number)=><span key={i} className="text-[10px] px-2 py-0.5 rounded-lg" style={{background:"hsl(217 91% 70%/0.1)",color:"hsl(217 91% 70%)"}}>{t}</span>)}</div>
                              </div>
                            )}
                            {role.complianceRequirements?.length>0&&(
                              <div>
                                <p className="text-[10px] font-bold uppercase mb-2" style={{color:"hsl(38 95% 60%)"}}>Compliance ({co.country})</p>
                                <div className="space-y-0.5">{role.complianceRequirements.map((c:string,i:number)=><p key={i} className="text-[11px]" style={{color:"hsl(215 25% 60%)"}}>{i+1}. {c}</p>)}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Design Principles */}
            {r.jobDesignPrinciples?.length>0&&(
              <div className="rounded-xl p-5" style={{background:"hsl(38 95% 52%/0.05)",border:"1px solid hsl(38 95% 52%/0.2)"}}>
                <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{color:"hsl(38 95% 60%)"}}>Job Design Principles for {co.name}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {r.jobDesignPrinciples.map((p:string,i:number)=>(
                    <div key={i} className="flex items-start gap-2 text-xs"><CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{color:"hsl(38 95% 60%)"}}/><span style={{color:"hsl(210 40% 78%)"}}>{p}</span></div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })()}
      {!rolAI.result&&!rolAI.loading&&!rolAI.error&&(
        <div className="rounded-xl p-14 text-center" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
          <Users className="h-14 w-14 mx-auto mb-4 opacity-15" style={{color:"hsl(38 95% 52%)"}}/>
          <p className="font-semibold" style={{color:"hsl(215 25% 55%)"}}>Click "Generate All Job Roles" for complete role specifications</p>
          <p className="text-xs mt-1" style={{color:"hsl(215 25% 38%)"}}>Covers all {co.jobTypes||"distinct"} job types · includes KPIs, salaries, career paths</p>
        </div>
      )}
    </div>
  );

  // ── RELATIONS TAB ─────────────────────────────────────────────────────────────
  const RelsTab=()=>(
    <div className="space-y-4">
      <Hdr title="Interdepartmental Relations & Workflows" sub="Data flows, dependencies, value chains, SLAs and friction points"
        btn={<GoldBtn onClick={()=>relAI.analyze(`${pText()}\n\nDepts: ${JSON.stringify(orgAI.result?.structure?.departments?.map((d:any)=>d.name))}\nMap ALL interdepartmental relationships, value chains, SLAs and information flows.`)} loading={relAI.loading} label="Map All Relations" busy="Mapping..." Icon={Network}/>}
      />
      {relAI.error&&<Err msg={relAI.error}/>}
      {relAI.loading&&<Spin msg="Mapping all interdepartmental relationships..."/>}
      {relAI.result&&!relAI.loading&&(()=>{
        const r=relAI.result;
        return(
          <div className="space-y-4">
            {/* Relations table */}
            {r.relationshipMap?.length>0&&(
              <div className="rounded-xl overflow-hidden" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                <div className="px-5 py-3" style={{background:"hsl(216 45% 11%)"}}><h3 className="text-sm font-bold" style={{color:"hsl(210 40% 92%)"}}>Department Relationship Map</h3></div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead><tr style={{background:"hsl(216 45% 10%)"}}>
                      {["From","Type","To","Direction","Frequency","What Flows"].map(h=><th key={h} className="px-3 py-2.5 text-left font-semibold whitespace-nowrap" style={{color:"hsl(215 25% 45%)"}}>{h}</th>)}
                    </tr></thead>
                    <tbody>{r.relationshipMap.map((rel:any,i:number)=>{
                      const tc=rel.relationshipType==="Reports To"?"hsl(158 64% 55%)":rel.relationshipType==="Approver"?"hsl(38 95% 60%)":rel.relationshipType==="Gatekeeper"?"hsl(0 72% 68%)":"hsl(217 91% 70%)";
                      return(
                        <tr key={i} style={{borderTop:"1px solid hsl(var(--border))",background:i%2===0?"transparent":"hsl(216 45% 8%/0.5)"}}>
                          <td className="px-3 py-2.5 font-semibold" style={{color:"hsl(210 40% 85%)"}}>{rel.fromDept}</td>
                          <td className="px-3 py-2.5"><Badge v={rel.relationshipType} c={tc}/></td>
                          <td className="px-3 py-2.5 font-semibold" style={{color:"hsl(210 40% 85%)"}}>{rel.toDept}</td>
                          <td className="px-3 py-2.5" style={{color:"hsl(215 25% 55%)"}}>{rel.direction}</td>
                          <td className="px-3 py-2.5" style={{color:"hsl(215 25% 55%)"}}>{rel.frequency}</td>
                          <td className="px-3 py-2.5" style={{color:"hsl(215 25% 60%)"}}>{rel.description}</td>
                        </tr>
                      );
                    })}</tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Value Chains */}
            {r.criticalValueChain?.length>0&&(
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest px-1 mb-3" style={{color:"hsl(215 25% 45%)"}}>Critical Value Chains</p>
                {r.criticalValueChain.map((chain:any,i:number)=>(
                  <div key={i} className="rounded-xl p-5 mb-3" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-bold" style={{color:"hsl(38 95% 60%)"}}>{chain.chainName}</span>
                      <span className="text-[10px]" style={{color:"hsl(215 25% 50%)"}}>{chain.businessOutcome}</span>
                    </div>
                    <div className="flex items-center gap-1 flex-wrap">
                      {(chain.sequence||[]).map((step:any,j:number)=>(
                        <div key={j} className="flex items-center gap-1">
                          <div className="rounded-lg p-2.5 text-center" style={{background:"hsl(216 45% 12%)",minWidth:100}}>
                            <p className="text-[9px] font-bold" style={{color:"hsl(38 95% 60%)"}}>{step.department}</p>
                            <p className="text-[10px] mt-0.5" style={{color:"hsl(210 40% 78%)"}}>{step.action}</p>
                            {step.handoff&&<p className="text-[9px] mt-0.5" style={{color:"hsl(215 25% 45%)"}}>→ {step.handoff}</p>}
                          </div>
                          {j<chain.sequence.length-1&&<span style={{color:"hsl(38 95% 52%/0.5)",fontSize:18}}>→</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SLAs */}
            {r.internalSLAs?.length>0&&(
              <div className="rounded-xl overflow-hidden" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                <div className="px-5 py-3" style={{background:"hsl(216 45% 11%)"}}><h3 className="text-sm font-bold" style={{color:"hsl(210 40% 92%)"}}>Internal Service Level Agreements</h3></div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead><tr style={{background:"hsl(216 45% 10%)"}}>
                      {["Provider","Consumer","Service","Response Time","Priority","Escalation","How Measured"].map(h=><th key={h} className="px-3 py-2.5 text-left font-semibold whitespace-nowrap" style={{color:"hsl(215 25% 45%)"}}>{h}</th>)}
                    </tr></thead>
                    <tbody>{r.internalSLAs.map((sla:any,i:number)=>{
                      const pc=sla.priority==="Critical"?"hsl(0 72% 68%)":sla.priority==="High"?"hsl(38 95% 60%)":"hsl(217 91% 70%)";
                      return(
                        <tr key={i} style={{borderTop:"1px solid hsl(var(--border))",background:i%2===0?"transparent":"hsl(216 45% 8%/0.5)"}}>
                          <td className="px-3 py-2.5 font-semibold" style={{color:"hsl(158 64% 55%)"}}>{sla.serviceProvider}</td>
                          <td className="px-3 py-2.5" style={{color:"hsl(210 40% 85%)"}}>{sla.serviceConsumer}</td>
                          <td className="px-3 py-2.5" style={{color:"hsl(215 25% 65%)"}}>{sla.service}</td>
                          <td className="px-3 py-2.5 font-semibold" style={{color:"hsl(38 95% 60%)"}}>{sla.standardResponseTime}</td>
                          <td className="px-3 py-2.5"><Badge v={sla.priority} c={pc}/></td>
                          <td className="px-3 py-2.5" style={{color:"hsl(217 91% 70%)"}}>{sla.escalationPath}</td>
                          <td className="px-3 py-2.5" style={{color:"hsl(215 25% 50%)"}}>{sla.measurementMethod}</td>
                        </tr>
                      );
                    })}</tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Info Flows */}
            {r.informationFlows?.length>0&&(
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest px-1 mb-3" style={{color:"hsl(215 25% 45%)"}}>Key Information Flows & Reports</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {r.informationFlows.map((flow:any,i:number)=>(
                    <div key={i} className="rounded-xl p-4" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                      <p className="text-xs font-bold mb-1" style={{color:"hsl(210 40% 88%)"}}>{flow.reportName}</p>
                      <div className="flex flex-wrap gap-3 text-[10px]" style={{color:"hsl(215 25% 50%)"}}>
                        <span>By: <strong style={{color:"hsl(38 95% 60%)"}}>{flow.producedBy}</strong></span>
                        <span>Freq: {flow.frequency}</span>
                        <span>Format: {flow.format}</span>
                        <span>Criticality: <strong style={{color:"hsl(0 72% 68%)"}}>{flow.criticality}</strong></span>
                      </div>
                      <p className="text-[10px] mt-1" style={{color:"hsl(215 25% 50%)"}}>Consumed by: {(flow.consumedBy||[]).join(", ")}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Silo + Overlap + Optimization */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {l:"Silo Risks",items:r.siloRisks,c:"hsl(0 72% 68%)"},
                {l:"Overlap Risks",items:r.overlapRisks,c:"hsl(38 95% 60%)"},
                {l:"Optimization Opportunities",items:r.optimizationRecommendations,c:"hsl(158 64% 55%)"},
              ].map(g=>g.items?.length>0&&(
                <div key={g.l} className="rounded-xl p-4" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{color:g.c}}>{g.l}</p>
                  <div className="space-y-1.5">{g.items.map((item:string,i:number)=>(
                    <div key={i} className="flex items-start gap-1.5 text-[11px]">
                      <span className="shrink-0" style={{color:g.c}}>•</span>
                      <span style={{color:"hsl(210 40% 78%)"}}>{item}</span>
                    </div>
                  ))}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
      {!relAI.result&&!relAI.loading&&!relAI.error&&(
        <div className="rounded-xl p-14 text-center" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
          <Network className="h-14 w-14 mx-auto mb-4 opacity-15" style={{color:"hsl(38 95% 52%)"}}/>
          <p className="font-semibold" style={{color:"hsl(215 25% 55%)"}}>Click "Map All Relations" to see all interdepartmental workflows</p>
        </div>
      )}
    </div>
  );

  // ── HIRING TAB ───────────────────────────────────────────────────────────────
  const HireTab=()=>(
    <div className="space-y-4">
      <Hdr title="AI Hiring Plan" sub={`Prioritized recruitment roadmap · ${co.employees} employees → required headcount · ${co.city}, ${co.country}`}
        btn={<GoldBtn onClick={()=>hirAI.analyze(`${pText()}\n\nOrg gaps: ${JSON.stringify(orgAI.result?.structure?.departments?.map((d:any)=>({dept:d.name,gap:(d.requiredHeadcount||0)-(d.currentHeadcount||0),priority:d.recruitmentPriority})))}\n\nCreate a hyper-detailed hiring plan with realistic salary data for ${co.city}, ${co.country}. Include actual local labor law requirements.`)} loading={hirAI.loading} label="Generate Hiring Plan" busy="Planning..." Icon={UserPlus}/>}
      />
      {hirAI.error&&<Err msg={hirAI.error}/>}
      {hirAI.loading&&<Spin msg={`Building hiring plan for ${co.name} (${co.country})...`}/>}
      {hirAI.result&&!hirAI.loading&&(()=>{
        const r=hirAI.result;
        return(
          <div className="space-y-4">
            <div className="rounded-xl p-5" style={{background:"hsl(38 95% 52%/0.06)",border:"1px solid hsl(38 95% 52%/0.2)"}}>
              <p className="text-sm leading-relaxed" style={{color:"hsl(210 40% 82%)"}}>{r.executiveSummary}</p>
              <div className="flex flex-wrap gap-5 mt-3 text-xs">
                {[{l:"Total Open Positions",v:r.totalOpenPositions,c:"hsl(0 72% 68%)"},{l:"Annual Hiring Cost",v:r.estimatedAnnualHiringCost,c:"hsl(38 95% 60%)"},{l:"Market Readiness",v:r.marketReadiness,c:"hsl(158 64% 55%)"}].map((m,i)=>(
                  <div key={i}><p className="text-[10px] mb-0.5" style={{color:"hsl(215 25% 45%)"}}>{m.l}</p><p className="font-bold" style={{color:m.c}}>{m.v}</p></div>
                ))}
              </div>
            </div>

            {/* Urgent Hires */}
            {r.urgentHires?.length>0&&(
              <div className="rounded-xl p-5" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                <h3 className="text-sm font-bold mb-4" style={{color:"hsl(0 72% 68%)"}}>🚨 Prioritized Hires</h3>
                <div className="space-y-3">
                  {r.urgentHires.map((h:any,i:number)=>{
                    const pc=h.priority==="Critical"?"hsl(0 72% 68%)":h.priority==="High"?"hsl(38 95% 60%)":"hsl(217 91% 70%)";
                    return(
                      <div key={i} className="rounded-xl p-4" style={{background:"hsl(216 45% 11%)"}}>
                        <div className="flex items-start gap-3">
                          <span className="flex h-7 w-7 items-center justify-center rounded-xl text-xs font-black shrink-0" style={{background:`${pc}20`,color:pc}}>{h.rank||i+1}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="text-sm font-bold" style={{color:"hsl(210 40% 92%)"}}>{h.jobTitle}</span>
                              <Badge v={h.department} c="hsl(215 25% 55%)"/>
                              <Badge v={h.priority} c={pc}/>
                            </div>
                            <p className="text-xs mb-1" style={{color:"hsl(215 25% 60%)"}}>{h.businessJustification}</p>
                            <p className="text-[11px] mb-2" style={{color:"hsl(38 95% 55%)"}}><span style={{color:"hsl(215 25% 45%)"}}>Revenue impact:</span> {h.revenueImpact}</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px] mb-2">
                              <span><span style={{color:"hsl(215 25% 40%)"}}>Fill time:</span> <span style={{color:"hsl(217 91% 70%)"}}>{h.timeToFill}</span></span>
                              <span><span style={{color:"hsl(215 25% 40%)"}}>USD/mo:</span> <span style={{color:"hsl(38 95% 60%)"}}>${h.salaryRangeUSD?.mid?.toLocaleString()}</span></span>
                              <span><span style={{color:"hsl(215 25% 40%)"}}>Local/mo:</span> <span style={{color:"hsl(158 64% 55%)"}}>{h.salaryRangeLocal?.mid?.toLocaleString()} {h.salaryRangeLocal?.currency}</span></span>
                              <span><span style={{color:"hsl(215 25% 40%)"}}>Experience:</span> <span style={{color:"hsl(215 25% 62%)"}}>{h.experienceRequired}</span></span>
                            </div>
                            <div className="flex flex-wrap gap-2 text-[10px] mb-2">
                              <span><span style={{color:"hsl(215 25% 40%)"}}>Language:</span> <span style={{color:"hsl(215 25% 62%)"}}>{h.languageRequirements}</span></span>
                              <span><span style={{color:"hsl(215 25% 40%)"}}>Local/Expat:</span> <span style={{color:"hsl(280 80% 70%)"}}>{h.localVsExpat}</span></span>
                              <span><span style={{color:"hsl(215 25% 40%)"}}>Probation:</span> <span style={{color:"hsl(215 25% 62%)"}}>{h.probationPeriod}</span></span>
                            </div>
                            {h.mustHaveSkills?.length>0&&<div className="flex flex-wrap gap-1 mb-1">{h.mustHaveSkills.map((s:string,j:number)=><span key={j} className="text-[10px] px-2 py-0.5 rounded" style={{background:"hsl(216 45% 18%)",color:"hsl(215 25% 65%)"}}>{s}</span>)}</div>}
                            {h.sourcingChannels?.length>0&&<p className="text-[10px]" style={{color:"hsl(158 64% 55%)"}}><span style={{color:"hsl(215 25% 40%)"}}>Sourcing:</span> {h.sourcingChannels.join(" · ")}</p>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Waves */}
            {r.hiringWaves&&(
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest px-1 mb-3" style={{color:"hsl(215 25% 45%)"}}>Phased Hiring Roadmap</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(r.hiringWaves).map(([key,wave]:any)=>{
                    const wc:Record<string,string>={wave1:"hsl(0 72% 68%)",wave2:"hsl(38 95% 60%)",wave3:"hsl(217 91% 70%)",wave4:"hsl(158 64% 55%)"};
                    const c=wc[key]||"hsl(38 95% 60%)";
                    return(
                      <div key={key} className="rounded-xl p-4" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                        <p className="text-[10px] font-black uppercase mb-1" style={{color:c}}>{wave.label}</p>
                        <p className="text-lg font-black mb-1" style={{color:c}}>{wave.headcount} hires</p>
                        <p className="text-[10px] mb-2" style={{color:"hsl(215 25% 50%)"}}>{wave.estimatedCost}</p>
                        <p className="text-[10px] italic mb-2" style={{color:"hsl(215 25% 55%)"}}>{wave.rationale}</p>
                        <div className="space-y-1">{(wave.roles||[]).map((role:string,j:number)=>(
                          <div key={j} className="flex items-center gap-1.5 text-[11px]">
                            <UserPlus className="h-3 w-3 shrink-0" style={{color:c}}/>
                            <span style={{color:"hsl(210 40% 78%)"}}>{role}</span>
                          </div>
                        ))}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Onboarding + Retention + Legal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {r.onboardingFramework&&(
                <div className="rounded-xl p-4" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                  <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{color:"hsl(158 64% 55%)"}}>Onboarding Framework</p>
                  {Object.entries(r.onboardingFramework).map(([k,v]:any)=>v?.length>0&&(
                    <div key={k} className="mb-2">
                      <p className="text-[9px] font-bold uppercase mb-1" style={{color:"hsl(215 25% 45%)"}}>{k.replace(/([A-Z])/g," $1")}</p>
                      <div className="space-y-0.5">{(v||[]).map((item:string,i:number)=><p key={i} className="text-[10px]" style={{color:"hsl(215 25% 62%)"}}>{i+1}. {item}</p>)}</div>
                    </div>
                  ))}
                </div>
              )}
              {r.retentionStrategies?.length>0&&(
                <div className="rounded-xl p-4" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                  <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{color:"hsl(217 91% 70%)"}}>Retention Strategies</p>
                  <div className="space-y-2">{r.retentionStrategies.map((s:any,i:number)=>(
                    <div key={i} className="p-2 rounded-lg" style={{background:"hsl(216 45% 12%)"}}>
                      <p className="text-[11px] font-semibold" style={{color:"hsl(210 40% 85%)"}}>{s.strategy||s}</p>
                      {s.targetGroup&&<p className="text-[10px]" style={{color:"hsl(215 25% 55%)"}}>For: {s.targetGroup} · Cost: {s.cost} · Impact: {s.expectedImpact}</p>}
                    </div>
                  ))}</div>
                </div>
              )}
              {r.legalCompliance?.length>0&&(
                <div className="rounded-xl p-4" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                  <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{color:"hsl(38 95% 60%)"}}>Legal Compliance ({co.country})</p>
                  <div className="space-y-2">{r.legalCompliance.map((l:any,i:number)=>(
                    <div key={i} className="p-2 rounded-lg" style={{background:"hsl(216 45% 12%)"}}>
                      <p className="text-[11px] font-semibold" style={{color:"hsl(210 40% 85%)"}}>{l.requirement||l}</p>
                      {l.penalty&&<p className="text-[10px]" style={{color:"hsl(0 72% 68%)"}}>Penalty: {l.penalty}</p>}
                      {l.action&&<p className="text-[10px]" style={{color:"hsl(158 64% 55%)"}}>Action: {l.action}</p>}
                    </div>
                  ))}</div>
                </div>
              )}
            </div>
          </div>
        );
      })()}
      {!hirAI.result&&!hirAI.loading&&!hirAI.error&&(
        <div className="rounded-xl p-14 text-center" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
          <UserPlus className="h-14 w-14 mx-auto mb-4 opacity-15" style={{color:"hsl(38 95% 52%)"}}/>
          <p className="font-semibold" style={{color:"hsl(215 25% 55%)"}}>Click "Generate Hiring Plan" for a full prioritized recruitment roadmap</p>
        </div>
      )}
    </div>
  );

  // ── SALARIES TAB ─────────────────────────────────────────────────────────────
  const SalsTab=()=>(
    <div className="space-y-4">
      <Hdr title="AI Salary Benchmark Engine" sub={`Real market data for ${co.city}, ${co.country} · ${co.industry} · ${co.revenue} revenue`}
        btn={<GoldBtn onClick={()=>salAI.analyze(`${pText()}\n\nDepts: ${JSON.stringify(orgAI.result?.structure?.departments?.map((d:any)=>({name:d.name,sections:d.sections?.map((s:any)=>s.roles).flat()})))}\n\nProvide REALISTIC, SPECIFIC salary data for ${co.city}, ${co.country}. This is a ${co.revenue} revenue ${co.industry} company. Give actual numbers that reflect reality in this specific city and industry.`)} loading={salAI.loading} label="Run Salary Analysis" busy="Benchmarking..." Icon={DollarSign}/>}
      />
      {salAI.error&&<Err msg={salAI.error}/>}
      {salAI.loading&&<Spin msg={`Analyzing salary market for ${co.city}, ${co.country}...`}/>}
      {salAI.result&&!salAI.loading&&(()=>{
        const r=salAI.result;
        return(
          <div className="space-y-4">
            {/* Market context */}
            {r.marketContext&&(
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  {l:"Market",v:`${r.marketContext.city}, ${r.marketContext.country}`,c:"hsl(38 95% 60%)"},
                  {l:"Avg Private Sector",v:r.marketContext.averagePrivateSectorSalary,c:"hsl(158 64% 55%)"},
                  {l:"Labor Market",v:r.marketContext.laborMarketCondition,c:"hsl(217 91% 70%)"},
                  {l:"Inflation",v:r.marketContext.inflationRate,c:"hsl(280 80% 70%)"},
                ].map((m,i)=>(
                  <div key={i} className="rounded-xl p-4" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{color:"hsl(215 25% 45%)"}}>{m.l}</p>
                    <p className="text-sm font-bold" style={{color:m.c}}>{m.v}</p>
                  </div>
                ))}
              </div>
            )}
            {r.marketContext?.industryNotes&&(
              <div className="rounded-xl p-4" style={{background:"hsl(217 91% 70%/0.06)",border:"1px solid hsl(217 91% 70%/0.2)"}}>
                <p className="text-[10px] font-bold uppercase mb-1" style={{color:"hsl(217 91% 70%)"}}>Industry Notes</p>
                <p className="text-sm" style={{color:"hsl(210 40% 80%)"}}>{r.marketContext.industryNotes}</p>
              </div>
            )}

            {/* Compensation philosophy */}
            {r.compensationPhilosophy&&(
              <div className="rounded-xl p-5" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{color:"hsl(38 95% 60%)"}}>Recommended Compensation Philosophy</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  {Object.entries(r.compensationPhilosophy).map(([k,v])=>(
                    <div key={k}><p className="text-[10px] font-bold capitalize" style={{color:"hsl(215 25% 45%)"}}>{k.replace(/([A-Z])/g," $1")}:</p><p style={{color:"hsl(210 40% 78%)"}}>{String(v)}</p></div>
                  ))}
                </div>
              </div>
            )}

            {/* Salary bands table */}
            {r.salaryBands?.length>0&&(
              <div className="rounded-xl overflow-hidden" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                <div className="px-5 py-3 flex items-center justify-between" style={{background:"hsl(216 45% 11%)"}}>
                  <h3 className="text-sm font-bold" style={{color:"hsl(210 40% 92%)"}}>Salary Bands — {r.marketContext?.city} Market · Monthly Base</h3>
                  <span className="text-[10px]" style={{color:"hsl(215 25% 50%)"}}>1 USD ≈ {r.marketContext?.usdExchangeRate} {r.marketContext?.currencySymbol}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead><tr style={{background:"hsl(216 45% 10%)"}}>
                      {["Department","Role","Level","Exp","Min USD","Median USD","Max USD","Total Comp","Local Mid","Bonus %","Demand","Availability","Notes"].map(h=><th key={h} className="px-2.5 py-2.5 text-left font-semibold whitespace-nowrap" style={{color:"hsl(215 25% 45%)"}}>{h}</th>)}
                    </tr></thead>
                    <tbody>{r.salaryBands.map((band:any,i:number)=>{
                      const lc=band.level==="C-Suite"?"hsl(38 95% 60%)":band.level?.includes("Director")||band.level==="VP"?"hsl(217 91% 70%)":band.level?.includes("Manager")?"hsl(158 64% 55%)":band.level?.includes("Senior")||band.level==="Lead"?"hsl(280 80% 70%)":"hsl(215 25% 60%)";
                      const dc=band.marketDemand==="Very High"?"hsl(0 72% 68%)":band.marketDemand==="High"?"hsl(38 95% 60%)":band.marketDemand==="Medium"?"hsl(217 91% 70%)":"hsl(158 64% 55%)";
                      const ac=band.availabilityInMarket==="Scarce"?"hsl(0 72% 68%)":band.availabilityInMarket==="Limited"?"hsl(38 95% 60%)":"hsl(158 64% 55%)";
                      return(
                        <tr key={i} style={{borderTop:"1px solid hsl(var(--border))",background:i%2===0?"transparent":"hsl(216 45% 8%/0.5)"}}>
                          <td className="px-2.5 py-2.5" style={{color:"hsl(215 25% 58%)"}}>{band.department}</td>
                          <td className="px-2.5 py-2.5 font-medium" style={{color:"hsl(210 40% 85%)"}}>{band.role}</td>
                          <td className="px-2.5 py-2.5"><Badge v={band.level} c={lc}/></td>
                          <td className="px-2.5 py-2.5" style={{color:"hsl(215 25% 55%)"}}>{band.yearsExperience}</td>
                          <td className="px-2.5 py-2.5" style={{color:"hsl(210 40% 68%)"}}>${(band.baseSalaryUSD?.min||0).toLocaleString()}</td>
                          <td className="px-2.5 py-2.5 font-bold" style={{color:"hsl(38 95% 60%)"}}>${(band.baseSalaryUSD?.median||0).toLocaleString()}</td>
                          <td className="px-2.5 py-2.5 font-semibold" style={{color:"hsl(158 64% 55%)"}}>${(band.baseSalaryUSD?.max||0).toLocaleString()}</td>
                          <td className="px-2.5 py-2.5 font-semibold" style={{color:"hsl(38 95% 55%)"}}>{band.totalCompUSD||"—"}</td>
                          <td className="px-2.5 py-2.5" style={{color:"hsl(217 91% 70%)"}}>{(band.baseSalaryLocal?.median||0).toLocaleString()} {band.baseSalaryLocal?.currency||r.marketContext?.currencySymbol}</td>
                          <td className="px-2.5 py-2.5" style={{color:"hsl(280 80% 70%)"}}>{band.annualBonusPercent||"—"}</td>
                          <td className="px-2.5 py-2.5"><Badge v={band.marketDemand} c={dc}/></td>
                          <td className="px-2.5 py-2.5"><Badge v={band.availabilityInMarket} c={ac}/></td>
                          <td className="px-2.5 py-2.5 text-[10px] max-w-40" style={{color:"hsl(215 25% 48%)"}}>{band.notes}</td>
                        </tr>
                      );
                    })}</tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Benefits + Legal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {r.benefitsPackage&&(
                <div className="rounded-xl p-5" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                  <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{color:"hsl(158 64% 55%)"}}>Benefits Package</p>
                  <div className="space-y-2">
                    {Object.entries(r.benefitsPackage).filter(([,v])=>v&&typeof v==="object"&&(v as any).value||(typeof v==="string")).map(([key,val]:any)=>(
                      <div key={key} className="flex items-start gap-2">
                        <span className="text-[10px] font-bold uppercase w-24 shrink-0 mt-0.5 capitalize" style={{color:"hsl(215 25% 45%)"}}>{key.replace(/([A-Z])/g," $1")}:</span>
                        <span className="text-xs" style={{color:"hsl(210 40% 78%)"}}>{typeof val==="object"?`${val.provided?"✓":"✗"} ${val.value||val.coverage||val.days||""} ${val.notes||""}`:String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {r.legalMandatories?.length>0&&(
                <div className="rounded-xl p-5" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                  <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{color:"hsl(38 95% 60%)"}}>Legal Mandatories ({co.country})</p>
                  <div className="space-y-2">{r.legalMandatories.map((l:any,i:number)=>(
                    <div key={i} className="p-2 rounded-lg" style={{background:"hsl(216 45% 12%)"}}>
                      <p className="text-[11px] font-semibold" style={{color:"hsl(210 40% 85%)"}}>{l.item}</p>
                      <p className="text-[10px] mt-0.5" style={{color:"hsl(215 25% 55%)"}}>{l.regulation}</p>
                      {(l.employer_cost||l.employee_cost)&&<p className="text-[10px]" style={{color:"hsl(38 95% 55%)"}}>Employer: {l.employer_cost} · Employee: {l.employee_cost}</p>}
                    </div>
                  ))}</div>
                </div>
              )}
            </div>

            {/* Cost of hiring */}
            {r.costOfHiring&&(
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(r.costOfHiring).map(([k,v])=>(
                  <div key={k} className="rounded-xl p-4" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                    <p className="text-[10px] font-bold uppercase capitalize mb-1" style={{color:"hsl(215 25% 45%)"}}>{k.replace(/([A-Z])/g," $1")}</p>
                    <p className="text-sm font-bold" style={{color:"hsl(38 95% 60%)"}}>{String(v)}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Retention Benchmarks */}
            {r.retentionBenchmarks&&(
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  {l:"Industry Avg Turnover",v:r.retentionBenchmarks.industryAverageTurnover,c:"hsl(0 72% 68%)"},
                  {l:"Acceptable Turnover",v:r.retentionBenchmarks.acceptableTurnover,c:"hsl(38 95% 60%)"},
                  {l:"Cost of Turnover",v:r.retentionBenchmarks.costOfTurnover,c:"hsl(217 91% 70%)"},
                ].map((m,i)=>m.v&&(
                  <div key={i} className="rounded-xl p-4" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{color:"hsl(215 25% 45%)"}}>{m.l}</p>
                    <p className="text-sm font-bold" style={{color:m.c}}>{m.v}</p>
                  </div>
                ))}
              </div>
            )}

            {r.recommendations?.length>0&&(
              <div className="rounded-xl p-5" style={{background:"hsl(158 64% 40%/0.05)",border:"1px solid hsl(158 64% 40%/0.2)"}}>
                <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{color:"hsl(158 64% 55%)"}}>Compensation Strategy Recommendations</p>
                <div className="space-y-2">{r.recommendations.map((rec:string,i:number)=>(
                  <div key={i} className="flex items-start gap-2 text-xs"><Star className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{color:"hsl(38 95% 60%)"}}/><span style={{color:"hsl(210 40% 78%)"}}>{rec}</span></div>
                ))}</div>
              </div>
            )}
          </div>
        );
      })()}
      {!salAI.result&&!salAI.loading&&!salAI.error&&(
        <div className="rounded-xl p-14 text-center" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
          <DollarSign className="h-14 w-14 mx-auto mb-4 opacity-15" style={{color:"hsl(38 95% 52%)"}}/>
          <p className="font-semibold" style={{color:"hsl(215 25% 55%)"}}>Click "Run Salary Analysis" for real market benchmarks</p>
          <p className="text-xs mt-1" style={{color:"hsl(215 25% 38%)"}}>Actual data for {co.city}, {co.country} · {co.industry} · {co.revenue}</p>
        </div>
      )}
    </div>
  );

  // ── RECOMMENDATIONS TAB ──────────────────────────────────────────────────────
  const RecoTab=()=>(
    <div className="space-y-4">
      <Hdr title="Company Development Roadmap & Recommendations" sub="AI-powered organizational health assessment and full transformation plan"
        btn={<GoldBtn onClick={()=>recAI.analyze(`${pText()}\n\nOrg health data: depts=${orgAI.result?.structure?.departments?.length||0}, processes=${procAI.result?.totalProcessCount||0}, hiringGap=${hirAI.result?.totalOpenPositions||0}\n\nBe brutally honest and highly specific. Every recommendation must be tied to the company's specific situation.`)} loading={recAI.loading} label="Generate Full Roadmap" busy="Analyzing..." Icon={TrendingUp}/>}
      />
      {recAI.error&&<Err msg={recAI.error}/>}
      {recAI.loading&&<Spin msg="Analyzing company health and building roadmap..."/>}
      {recAI.result&&!recAI.loading&&(()=>{
        const r=recAI.result;
        const score=r.overallHealthScore||0;
        const sc=score>=75?"hsl(158 64% 55%)":score>=50?"hsl(38 95% 60%)":"hsl(0 72% 68%)";
        return(
          <div className="space-y-4">
            {/* Health Score */}
            <div className="rounded-2xl p-6 flex items-center gap-8 flex-wrap" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
              <div className="text-center shrink-0">
                <p className="text-7xl font-black" style={{color:sc}}>{score}</p>
                <p className="text-xs mt-1 font-bold uppercase tracking-wider" style={{color:"hsl(215 25% 50%)"}}>Health Score</p>
              </div>
              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
                {r.healthDimensions&&Object.entries(r.healthDimensions).map(([key,val]:any)=>{
                  const vc=val.score>=75?"hsl(158 64% 55%)":val.score>=50?"hsl(38 95% 60%)":"hsl(0 72% 68%)";
                  return(
                    <div key={key}>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-[10px] capitalize" style={{color:"hsl(215 25% 50%)"}}>{key.replace(/([A-Z])/g," $1")}</p>
                        <span className="text-xs font-black" style={{color:vc}}>{val.score}</span>
                      </div>
                      <Bar pct={val.score} c={vc}/>
                      <p className="text-[9px] mt-1" style={{color:"hsl(215 25% 45%)"}}>{val.comment}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Assessment */}
            {r.executiveAssessment&&(
              <div className="rounded-xl p-5" style={{background:"hsl(38 95% 52%/0.06)",border:"1px solid hsl(38 95% 52%/0.2)"}}>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{color:"hsl(38 95% 60%)"}}>Executive Assessment</p>
                <p className="text-sm leading-relaxed" style={{color:"hsl(210 40% 82%)"}}>{r.executiveAssessment}</p>
              </div>
            )}

            {/* Critical Issues */}
            {r.criticalIssues?.length>0&&(
              <div className="rounded-xl p-5" style={{background:"hsl(0 72% 51%/0.06)",border:"1px solid hsl(0 72% 51%/0.2)"}}>
                <h3 className="text-sm font-bold mb-3" style={{color:"hsl(0 72% 68%)"}}>Critical Issues</h3>
                <div className="space-y-3">{r.criticalIssues.map((issue:any,i:number)=>{
                  const uc=issue.urgency==="Fix Now"?"hsl(0 72% 68%)":issue.urgency==="Fix in 30 days"?"hsl(38 95% 60%)":"hsl(217 91% 70%)";
                  return(
                    <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl" style={{background:"hsl(216 45% 12%)"}}>
                      <Badge v={issue.urgency} c={uc}/>
                      <div className="flex-1">
                        <p className="text-xs font-bold" style={{color:"hsl(210 40% 88%)"}}>{issue.issue}</p>
                        <p className="text-[11px] mt-0.5" style={{color:"hsl(215 25% 55%)"}}><span style={{color:"hsl(215 25% 40%)"}}>Root cause:</span> {issue.rootCause}</p>
                        <p className="text-[11px]" style={{color:"hsl(38 95% 55%)"}}><span style={{color:"hsl(215 25% 40%)"}}>Revenue impact:</span> {issue.revenueImpact}</p>
                        <p className="text-[11px]" style={{color:"hsl(158 64% 55%)"}}><span style={{color:"hsl(215 25% 40%)"}}>Solution:</span> {issue.solution}</p>
                      </div>
                    </div>
                  );
                })}</div>
              </div>
            )}

            {/* Quick Wins */}
            {r.quickWins?.length>0&&(
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest px-1 mb-3" style={{color:"hsl(215 25% 45%)"}}>Quick Wins</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {r.quickWins.map((w:any,i:number)=>{
                    const tc=w.timeframe==="This week"?"hsl(0 72% 68%)":w.timeframe==="30 days"?"hsl(38 95% 60%)":w.timeframe==="60 days"?"hsl(217 91% 70%)":"hsl(158 64% 55%)";
                    return(
                      <div key={i} className="rounded-xl p-4" style={{background:"hsl(var(--card))",border:`1px solid ${tc}30`}}>
                        <div className="flex items-center gap-2 mb-2"><Badge v={w.timeframe} c={tc}/><Badge v={w.effort+" effort"} c="hsl(215 25% 55%)"/></div>
                        <p className="text-sm font-bold mb-1" style={{color:"hsl(210 40% 92%)"}}>{w.action}</p>
                        <p className="text-xs mb-2" style={{color:"hsl(215 25% 58%)"}}><span style={{color:"hsl(215 25% 40%)"}}>Dept:</span> {w.department} · <span style={{color:"hsl(215 25% 40%)"}}>Cost:</span> {w.costUSD} · <span style={{color:"hsl(158 64% 55%)"}}>ROI:</span> {w.expectedROI}</p>
                        <p className="text-xs mb-2" style={{color:"hsl(38 95% 55%)"}}>{w.impact}</p>
                        {w.howTo?.length>0&&(
                          <div className="space-y-0.5">{w.howTo.map((step:string,j:number)=><p key={j} className="text-[10px]" style={{color:"hsl(215 25% 55%)"}}>{j+1}. {step}</p>)}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Strategic Roadmap */}
            {r.strategicRoadmap?.length>0&&(
              <div className="space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-widest px-1" style={{color:"hsl(215 25% 45%)"}}>Strategic Development Roadmap</p>
                {r.strategicRoadmap.map((phase:any,i:number)=>{
                  const phaseC=["hsl(38 95% 60%)","hsl(158 64% 55%)","hsl(217 91% 70%)","hsl(280 80% 70%)"][i%4];
                  return(
                    <div key={i} className="rounded-xl p-5" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl shrink-0" style={{background:`${phaseC}18`,border:`2px solid ${phaseC}40`}}>
                          <span className="text-sm font-black" style={{color:phaseC}}>{phase.phase}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 flex-wrap mb-2">
                            <span className="font-bold text-sm" style={{color:"hsl(210 40% 92%)"}}>{phase.phaseName}</span>
                            <Badge v={phase.duration} c={phaseC}/>
                            <Badge v={phase.theme} c="hsl(215 25% 55%)"/>
                            <span className="text-[10px]" style={{color:"hsl(215 25% 50%)"}}>{phase.investmentRequired}</span>
                            <span className="text-[10px]" style={{color:"hsl(158 64% 55%)"}}>Revenue: {phase.expectedRevenueImpact}</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {[
                              {l:"Objectives",items:phase.objectives,c:"hsl(38 95% 60%)"},
                              {l:"Key Initiatives",items:phase.keyInitiatives,c:"hsl(158 64% 55%)"},
                              {l:"Milestones",items:phase.milestones,c:"hsl(217 91% 70%)"},
                            ].map(g=>(
                              <div key={g.l}>
                                <p className="text-[10px] font-bold uppercase mb-1.5" style={{color:g.c}}>{g.l}</p>
                                <div className="space-y-0.5">{(g.items||[]).map((item:string,j:number)=><p key={j} className="text-[10px]" style={{color:"hsl(215 25% 62%)"}}>{j+1}. {item}</p>)}</div>
                              </div>
                            ))}
                          </div>
                          {phase.riskIfDelayed&&<p className="text-[10px] mt-2" style={{color:"hsl(0 72% 68%)"}}><span style={{color:"hsl(215 25% 40%)"}}>Risk if delayed:</span> {phase.riskIfDelayed}</p>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* KPI Dashboard + Technology */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {r.kpiDashboard?.length>0&&(
                <div className="rounded-xl overflow-hidden" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                  <div className="px-5 py-3" style={{background:"hsl(216 45% 11%)"}}><h3 className="text-sm font-bold" style={{color:"hsl(210 40% 92%)"}}>KPI Dashboard</h3></div>
                  <div className="p-3 space-y-2">
                    {r.kpiDashboard.map((kpi:any,i:number)=>(
                      <div key={i} className="flex items-center gap-2 p-2 rounded-lg" style={{background:"hsl(216 45% 12%)"}}>
                        <div className="flex-1">
                          <p className="text-[11px] font-semibold" style={{color:"hsl(210 40% 85%)"}}>{kpi.kpi}</p>
                          <p className="text-[10px]" style={{color:"hsl(215 25% 50%)"}}>{kpi.category} · {kpi.reportingFrequency}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[10px]"><span style={{color:"hsl(215 25% 45%)"}}>Now:</span> <span style={{color:"hsl(0 72% 68%)"}}>{kpi.currentValue}</span></p>
                          <p className="text-[10px]"><span style={{color:"hsl(215 25% 45%)"}}>Target:</span> <span style={{color:"hsl(158 64% 55%)"}}>{kpi.targetValue}</span></p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {r.technologyRoadmap?.length>0&&(
                <div className="rounded-xl overflow-hidden" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                  <div className="px-5 py-3" style={{background:"hsl(216 45% 11%)"}}><h3 className="text-sm font-bold" style={{color:"hsl(210 40% 92%)"}}>Technology Roadmap</h3></div>
                  <div className="p-3 space-y-2">
                    {r.technologyRoadmap.map((tech:any,i:number)=>{
                      const tc=tech.priority==="Critical"?"hsl(0 72% 68%)":tech.priority==="High"?"hsl(38 95% 60%)":"hsl(217 91% 70%)";
                      return(
                        <div key={i} className="p-2 rounded-lg" style={{background:"hsl(216 45% 12%)"}}>
                          <div className="flex items-center gap-2 mb-0.5"><span className="text-[11px] font-bold" style={{color:"hsl(210 40% 88%)"}}>{tech.system}</span><Badge v={tech.priority} c={tc}/><Badge v={tech.category} c="hsl(215 25% 55%)"/></div>
                          <p className="text-[10px]" style={{color:"hsl(215 25% 55%)"}}>{tech.businessCase}</p>
                          <p className="text-[10px]" style={{color:"hsl(38 95% 55%)"}}>{tech.estimatedCost} · {tech.implementationTime}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Compliance + Success */}
            {r.totalInvestmentRequired&&(
              <div className="rounded-xl p-5" style={{background:"hsl(158 64% 40%/0.05)",border:"1px solid hsl(158 64% 40%/0.2)"}}>
                <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{color:"hsl(158 64% 55%)"}}>Total Investment · Timeline · Success Definition</p>
                <div className="flex flex-wrap gap-6 mb-3">
                  <div><p className="text-[10px]" style={{color:"hsl(215 25% 45%)"}}>Total Investment</p><p className="text-sm font-bold" style={{color:"hsl(38 95% 60%)"}}>{r.totalInvestmentRequired}</p></div>
                  <div><p className="text-[10px]" style={{color:"hsl(215 25% 45%)"}}>ROI Timeline</p><p className="text-sm font-bold" style={{color:"hsl(158 64% 55%)"}}>{r.expectedROITimeline}</p></div>
                </div>
                <div className="space-y-1">{(r.successDefinition||[]).map((s:string,i:number)=>(
                  <div key={i} className="flex items-start gap-2 text-xs"><CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{color:"hsl(158 64% 55%)"}}/><span style={{color:"hsl(210 40% 78%)"}}>{s}</span></div>
                ))}</div>
              </div>
            )}
          </div>
        );
      })()}
      {!recAI.result&&!recAI.loading&&!recAI.error&&(
        <div className="rounded-xl p-14 text-center" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
          <TrendingUp className="h-14 w-14 mx-auto mb-4 opacity-15" style={{color:"hsl(38 95% 52%)"}}/>
          <p className="font-semibold" style={{color:"hsl(215 25% 55%)"}}>Click "Generate Full Roadmap" for your complete development plan</p>
          <p className="text-xs mt-1" style={{color:"hsl(215 25% 38%)"}}>Tip: Run Org Structure, Processes and Hiring first for best results</p>
        </div>
      )}
    </div>
  );

  // ── RENDER ────────────────────────────────────────────────────────────────────
  return(
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="rounded-2xl p-6 relative overflow-hidden" style={{background:"linear-gradient(135deg,hsl(216 52% 10%),hsl(216 52% 13%))",border:"1px solid hsl(38 95% 52%/0.2)"}}>
        <div className="absolute inset-0 opacity-5" style={{backgroundImage:"radial-gradient(circle at 70% 30%, hsl(38 95% 52%), transparent 60%)"}}/>
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-5 w-5" style={{color:"hsl(38 95% 52%)"}}/>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{background:"hsl(38 95% 52%/0.15)",color:"hsl(38 95% 60%)"}}>COMPANY DEVELOPMENT SERVICES</span>
          </div>
          <h1 className="text-2xl font-bold font-display" style={{color:"hsl(210 40% 94%)"}}>
            {co.name||"Your Company"} — AI Organizational Intelligence
          </h1>
          <p className="text-sm mt-1" style={{color:"hsl(215 25% 60%)"}}>
            {co.activity||"Complete your profile to begin"}{co.industry?` · ${co.industry}`:""}{co.city&&co.country?` · ${co.city}, ${co.country}`:""}
          </p>
          {profileDone&&(
            <div className="flex flex-wrap gap-5 mt-3 text-xs">
              {[{l:"Employees",v:co.employees},{l:"Revenue",v:co.revenue},{l:"Type",v:co.type},{l:"Founded",v:co.founded}].filter(m=>m.v).map((m,i)=>(
                <span key={i} style={{color:"hsl(215 25% 55%)"}}>{m.l}: <strong style={{color:"hsl(38 95% 55%)"}}>{m.v}</strong></span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {TABS.map(t=>(
          <button key={t.key} onClick={()=>!t.lock&&setTab(t.key)} disabled={t.lock}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all disabled:opacity-35"
            style={{background:tab===t.key?"hsl(38 95% 52%/0.15)":"hsl(var(--card))",color:tab===t.key?"hsl(38 95% 60%)":"hsl(215 25% 55%)",border:`1px solid ${tab===t.key?"hsl(38 95% 52%/0.35)":"hsl(var(--border))"}`,cursor:t.lock?"not-allowed":"pointer"}}>
            {t.lock?<Lock className="h-3.5 w-3.5 opacity-50"/>:<t.icon className="h-3.5 w-3.5"/>}
            {t.label}
          </button>
        ))}
      </div>

      {tab==="profile"         &&<ProfileTab/>}
      {tab==="org"             &&<OrgTab/>}
      {tab==="departments"     &&<DeptsTab/>}
      {tab==="processes"       &&<ProcsTab/>}
      {tab==="roles"           &&<RolesTab/>}
      {tab==="relations"       &&<RelsTab/>}
      {tab==="hiring"          &&<HireTab/>}
      {tab==="salaries"        &&<SalsTab/>}
      {tab==="recommendations" &&<RecoTab/>}
    </div>
  );
}
