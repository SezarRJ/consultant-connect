import { useState } from "react";
import {
  Award, CheckCircle2, AlertTriangle, RefreshCw, ChevronDown, ChevronRight,
  Target, Shield, FileText, Users, Factory, Globe, Zap, BarChart2,
  ClipboardList, Star, ArrowUpRight, Download, Info, X, Play
} from "lucide-react";
import { useClaudeAnalysis } from "@/hooks/useClaudeAnalysis";

// ─── ISO Standards ─────────────────────────────────────────────────────────
type ISOType = "9001"|"14001"|"45001"|"27001"|"22301"|"50001"|"13485"|"22000";
type Tab = "overview"|"gap_assessment"|"implementation"|"documentation"|"audit_prep";

interface ISOStandard {
  code: ISOType;
  title: string;
  desc: string;
  icon: any;
  color: string;
  bg: string;
  border: string;
  applicability: string;
  clauses: { num: string; title: string; requirements: string[] }[];
  mandatoryDocs: string[];
  benefits: string[];
  typicalTimeline: string;
  complexity: "Low"|"Medium"|"High"|"Very High";
}

const ISO_STANDARDS: ISOStandard[] = [
  {
    code:"9001", title:"ISO 9001:2015", desc:"Quality Management System", icon:Award, color:"hsl(38 95% 60%)", bg:"hsl(38 95% 52% / 0.08)", border:"hsl(38 95% 52% / 0.3)",
    applicability:"Universal — all industries, all sizes", typicalTimeline:"6–12 months", complexity:"Medium",
    clauses:[
      {num:"4", title:"Context of the Organization", requirements:["Define internal/external issues","Identify interested parties","Define QMS scope","Document management system"]},
      {num:"5", title:"Leadership", requirements:["Management commitment","Quality policy","Organizational roles"]},
      {num:"6", title:"Planning", requirements:["Risk and opportunities","Quality objectives","Planning of changes"]},
      {num:"7", title:"Support", requirements:["Resources","Competence","Awareness","Communication","Documented information"]},
      {num:"8", title:"Operation", requirements:["Operational planning","Customer requirements","Design and development","Control of external processes","Production/service provision","Release of products","Nonconforming outputs"]},
      {num:"9", title:"Performance Evaluation", requirements:["Monitoring and measurement","Customer satisfaction","Internal audit","Management review"]},
      {num:"10", title:"Improvement", requirements:["Nonconformity and corrective action","Continual improvement"]},
    ],
    mandatoryDocs:["Quality Policy","Quality Objectives","QMS Scope","Organizational Chart","Process Maps","Risk Register","Competency Matrix","Training Records","Internal Audit Program","Management Review Minutes","Customer Satisfaction Records","Corrective Action Register","Nonconformity Log"],
    benefits:["Improved customer satisfaction","Process standardization","Reduced waste and errors","Better decision making","Enhanced market reputation","Employee engagement"],
  },
  {
    code:"14001", title:"ISO 14001:2015", desc:"Environmental Management System", icon:Globe, color:"hsl(158 64% 55%)", bg:"hsl(158 64% 40% / 0.08)", border:"hsl(158 64% 40% / 0.3)",
    applicability:"Manufacturing, Construction, Oil & Gas, FMCG, Logistics", typicalTimeline:"6–12 months", complexity:"Medium",
    clauses:[
      {num:"4", title:"Context", requirements:["Environmental conditions","Legal requirements","Interested parties","EMS scope"]},
      {num:"6", title:"Planning", requirements:["Environmental aspects and impacts","Compliance obligations","Environmental objectives and plans"]},
      {num:"8", title:"Operation", requirements:["Operational controls","Emergency preparedness and response"]},
      {num:"9", title:"Evaluation", requirements:["Monitoring environmental performance","Compliance evaluation","Internal audits","Management review"]},
    ],
    mandatoryDocs:["Environmental Policy","Environmental Aspects Register","Legal Requirements Register","Environmental Objectives","Emergency Response Plan","Monitoring & Measurement Records","Compliance Evaluation Reports","Waste Management Procedures"],
    benefits:["Regulatory compliance","Reduced environmental impact","Cost savings (energy, waste)","Enhanced brand reputation","Access to green tenders","Risk management"],
  },
  {
    code:"45001", title:"ISO 45001:2018", desc:"Occupational Health & Safety", icon:Shield, color:"hsl(0 72% 68%)", bg:"hsl(0 72% 51% / 0.08)", border:"hsl(0 72% 51% / 0.3)",
    applicability:"All industries — especially manufacturing, construction, FMCG, hospitality", typicalTimeline:"6–12 months", complexity:"Medium",
    clauses:[
      {num:"6", title:"Planning", requirements:["Hazard identification","Risk assessment","Legal requirements","OH&S objectives"]},
      {num:"8", title:"Operation", requirements:["Operational controls","Management of change","Contractor management","Emergency preparedness"]},
      {num:"9", title:"Evaluation", requirements:["Performance monitoring","Incident investigation","Compliance evaluation"]},
    ],
    mandatoryDocs:["OH&S Policy","Hazard Register","Risk Assessment Records","Legal Register","Emergency Response Plan","Incident Investigation Records","Competency & Training Matrix","Work Permit Procedures","PPE Register"],
    benefits:["Reduced workplace accidents","Legal compliance","Lower insurance costs","Better employee morale","Reduced downtime","Regulatory protection"],
  },
  {
    code:"27001", title:"ISO 27001:2022", desc:"Information Security Management", icon:Zap, color:"hsl(217 91% 70%)", bg:"hsl(217 91% 53% / 0.08)", border:"hsl(217 91% 53% / 0.3)",
    applicability:"IT companies, Finance, Healthcare, Telecom, any data-handling business", typicalTimeline:"9–18 months", complexity:"Very High",
    clauses:[
      {num:"4", title:"Context", requirements:["Internal/external issues","Interested parties","ISMS scope"]},
      {num:"6", title:"Planning", requirements:["Information security risks","Risk treatment plan","Statement of Applicability","IS objectives"]},
      {num:"8", title:"Operation", requirements:["Risk assessment","Risk treatment","Annex A controls (93 controls)"]},
      {num:"9", title:"Evaluation", requirements:["IS monitoring","Internal audit","Management review"]},
    ],
    mandatoryDocs:["IS Policy","ISMS Scope","Risk Assessment Methodology","Risk Register","Statement of Applicability","Risk Treatment Plan","Asset Inventory","Access Control Policy","Incident Response Plan","Business Continuity Plan","Data Classification Policy","Supplier Agreements"],
    benefits:["Data breach prevention","Regulatory compliance (GDPR)","Client trust and confidence","Competitive advantage","Reduced cyber insurance costs","Structured security governance"],
  },
  {
    code:"22301", title:"ISO 22301:2019", desc:"Business Continuity Management", icon:Target, color:"hsl(280 80% 70%)", bg:"hsl(280 80% 50% / 0.08)", border:"hsl(280 80% 50% / 0.3)",
    applicability:"Finance, Telecom, Healthcare, Government, Critical Infrastructure", typicalTimeline:"8–14 months", complexity:"High",
    clauses:[
      {num:"6", title:"Planning", requirements:["Business impact analysis","Risk assessment","BC objectives"]},
      {num:"8", title:"Operation", requirements:["BC strategies","BC plans","Incident response procedures","Exercise and testing"]},
      {num:"9", title:"Evaluation", requirements:["Monitoring BC performance","BC audit","Management review"]},
    ],
    mandatoryDocs:["BC Policy","Business Impact Analysis (BIA)","Risk Assessment","BC Strategy","Business Continuity Plan","Crisis Communication Plan","Recovery Procedures","Exercise & Test Reports","Supplier BC Requirements"],
    benefits:["Minimized downtime","Stakeholder confidence","Regulatory compliance","Faster recovery","Reputation protection","Competitive advantage"],
  },
  {
    code:"50001", title:"ISO 50001:2018", desc:"Energy Management System", icon:Zap, color:"hsl(38 95% 60%)", bg:"hsl(38 95% 52% / 0.08)", border:"hsl(38 95% 52% / 0.3)",
    applicability:"Manufacturing, Facilities, Real Estate, Utilities", typicalTimeline:"6–10 months", complexity:"Medium",
    clauses:[
      {num:"6", title:"Planning", requirements:["Energy review","Energy baseline","Energy performance indicators","Energy objectives"]},
      {num:"8", title:"Operation", requirements:["Operational controls","Design for energy performance","Procurement criteria"]},
    ],
    mandatoryDocs:["Energy Policy","Energy Review","Energy Baseline","EnPIs","Energy Action Plan","Operational Controls","Monitoring Records"],
    benefits:["Reduced energy costs","Carbon footprint reduction","Regulatory compliance","Green credentials","Operational efficiency"],
  },
  {
    code:"13485", title:"ISO 13485:2016", desc:"Medical Devices QMS", icon:Shield, color:"hsl(0 72% 68%)", bg:"hsl(0 72% 51% / 0.08)", border:"hsl(0 72% 51% / 0.3)",
    applicability:"Medical device manufacturers, distributors, service providers", typicalTimeline:"12–24 months", complexity:"Very High",
    clauses:[
      {num:"4", title:"QMS Requirements", requirements:["General requirements","Documentation requirements","Medical device file"]},
      {num:"7", title:"Product Realization", requirements:["Customer-related processes","Design and development","Purchasing","Production and service provision","Control of monitoring equipment"]},
    ],
    mandatoryDocs:["Quality Manual","Design History File","Device Master Record","Risk Management File","Post-Market Surveillance","Complaint Handling Procedure","CAPA System","Supplier Qualification Records"],
    benefits:["Market access (FDA/CE)","Patient safety","Regulatory compliance","Product quality","Liability reduction"],
  },
  {
    code:"22000", title:"ISO 22000:2018", desc:"Food Safety Management", icon:Factory, color:"hsl(158 64% 55%)", bg:"hsl(158 64% 40% / 0.08)", border:"hsl(158 64% 40% / 0.3)",
    applicability:"Food manufacturers, restaurants, distributors, packaging", typicalTimeline:"6–12 months", complexity:"High",
    clauses:[
      {num:"6", title:"Planning", requirements:["Hazard analysis (HACCP)","PRPs (Prerequisite Programs)","Food safety objectives"]},
      {num:"8", title:"Operation", requirements:["Prerequisite programs","Traceability","Emergency preparedness","HACCP plan","Verification of control measures"]},
    ],
    mandatoryDocs:["Food Safety Policy","HACCP Plan","Hazard Analysis","PRPs Documentation","Traceability System","Allergen Management","Supplier Approval","Training Records","Cleaning & Sanitation Procedures","Recall/Withdrawal Procedure"],
    benefits:["Consumer safety","Legal compliance","Market access","Supply chain confidence","Brand protection","Reduced recalls"],
  },
];

const GAP_PROMPT = `You are a senior ISO management systems consultant. Conduct a gap assessment. Respond ONLY with valid JSON:
{"overallReadiness":"number 0-100","status":"Not Started|Early Stage|In Progress|Nearly Ready|Ready","gaps":[{"clause":"string","area":"string","currentState":"string","requirement":"string","gap":"Critical|Major|Minor|Conforming","effort":"string","recommendation":"string"}],"quickWins":["string"],"criticalActions":["string"],"estimatedTimeToReady":"string","priorityOrder":["string"]}`;

const IMPL_PROMPT = `You are a senior ISO implementation consultant. Create a detailed implementation plan. Respond ONLY with valid JSON:
{"phases":[{"phase":"string","duration":"string","activities":["string"],"deliverables":["string"],"owner":"string","budget":"string"}],"totalDuration":"string","totalCost":"string","criticalSuccessFactors":["string"],"risks":[{"risk":"string","mitigation":"string"}],"recommendations":["string"]}`;

// ─── Helper ───────────────────────────────────────────────────────────────────
function ErrorBanner({msg}:{msg:string}) {
  return (
    <div className="rounded-xl p-4 flex items-start gap-3" style={{background:"hsl(0 72% 51% / 0.08)",border:"1px solid hsl(0 72% 51% / 0.3)"}}>
      <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" style={{color:"hsl(0 72% 68%)"}}/>
      <div>
        <p className="text-sm" style={{color:"hsl(0 72% 68%)"}}>{msg}</p>
        {msg.toLowerCase().includes("credit")&&<a href="https://console.anthropic.com/" target="_blank" rel="noreferrer" className="text-xs mt-1 underline inline-flex items-center gap-1" style={{color:"hsl(38 95% 60%)"}}>Top up <ArrowUpRight className="h-3 w-3"/></a>}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ISOPreparation() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [selectedISO, setSelectedISO] = useState<ISOType>("9001");
  const [expandedISO, setExpandedISO] = useState<ISOType|null>(null);
  const [expandedClause, setExpandedClause] = useState<string|null>(null);
  const [companyContext, setCompanyContext] = useState({name:"",industry:"FMCG",country:"Iraq",size:"Medium",activity:"Distribution and trading"});

  const gapAI  = useClaudeAnalysis({systemPrompt:GAP_PROMPT,  agentId:"iso-gap"});
  const implAI = useClaudeAnalysis({systemPrompt:IMPL_PROMPT, agentId:"iso-impl"});

  const selected = ISO_STANDARDS.find(s=>s.code===selectedISO)!;

  const runGap = () => {
    gapAI.analyze(`Conduct ISO ${selectedISO} gap assessment for: Company: ${companyContext.name||"client company"}, Industry: ${companyContext.industry}, Country: ${companyContext.country}, Size: ${companyContext.size}, Activity: ${companyContext.activity}. Evaluate all clauses of ISO ${selectedISO} (${selected.title}). Be specific about MENA business context.`);
  };

  const runImpl = () => {
    implAI.analyze(`Create detailed ISO ${selectedISO} implementation plan for: Company: ${companyContext.name||"client company"}, Industry: ${companyContext.industry}, Country: ${companyContext.country}, Size: ${companyContext.size}. Standard: ${selected.title} — ${selected.desc}. Include realistic budget for MENA/Iraq market.`);
  };

  const complexityColor = (c:string) => c==="Very High"?"hsl(0 72% 68%)":c==="High"?"hsl(38 95% 60%)":c==="Medium"?"hsl(217 91% 70%)":"hsl(158 64% 55%)";
  const gapLevelColor = (g:string) => g==="Critical"?"hsl(0 72% 68%)":g==="Major"?"hsl(38 95% 60%)":g==="Minor"?"hsl(217 91% 70%)":"hsl(158 64% 55%)";

  const TABS = [
    {key:"overview"       as Tab, label:"ISO Standards",      icon:Award},
    {key:"gap_assessment" as Tab, label:"Gap Assessment",      icon:BarChart2},
    {key:"implementation" as Tab, label:"Implementation Plan", icon:ClipboardList},
    {key:"documentation"  as Tab, label:"Documentation",       icon:FileText},
    {key:"audit_prep"     as Tab, label:"Audit Preparation",   icon:CheckCircle2},
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="rounded-2xl p-6 relative overflow-hidden" style={{background:"linear-gradient(135deg,hsl(216 52% 10%),hsl(216 52% 13%))",border:"1px solid hsl(38 95% 52% / 0.2)"}}>
        <div className="absolute inset-0 opacity-5" style={{backgroundImage:"radial-gradient(circle at 70% 30%, hsl(38 95% 52%), transparent 60%)"}}/>
        <div className="relative">
          <div className="flex items-center gap-2 mb-2"><Award className="h-5 w-5" style={{color:"hsl(38 95% 52%)"}}/><span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{background:"hsl(38 95% 52% / 0.15)",color:"hsl(38 95% 60%)"}}>ISO PREPARATION MODULE</span></div>
          <h1 className="text-2xl font-bold font-display" style={{color:"hsl(210 40% 94%)"}}>ISO Certification Preparation</h1>
          <p className="text-sm mt-1" style={{color:"hsl(215 25% 60%)"}}>Gap assessment · Implementation planning · Documentation · Audit preparation — covering all major ISO standards</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {ISO_STANDARDS.map(s=>(
              <button key={s.code} onClick={()=>setSelectedISO(s.code)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{background:selectedISO===s.code?s.bg:"hsl(216 45% 16%)",color:selectedISO===s.code?s.color:"hsl(215 25% 55%)",border:`1px solid ${selectedISO===s.code?s.border:"transparent"}`}}>
                {s.title.split(":")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Company Context */}
      <div className="rounded-xl p-5" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{color:"hsl(215 25% 45%)"}}>Company Context (for AI assessment)</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {([{k:"name",l:"Company Name",p:"e.g. Al-Rashidi Group"},{k:"industry",l:"Industry",p:"e.g. FMCG"},{k:"country",l:"Country",p:"e.g. Iraq"},{k:"size",l:"Company Size",p:"e.g. Medium"},{k:"activity",l:"Main Activity",p:"e.g. Distribution"}] as const).map(f=>(
            <div key={f.k}>
              <label className="text-[10px] font-semibold uppercase block mb-1" style={{color:"hsl(215 25% 45%)"}}>{f.l}</label>
              <input value={companyContext[f.k]} onChange={e=>setCompanyContext(p=>({...p,[f.k]:e.target.value}))} placeholder={f.p}
                className="w-full px-2.5 py-2 rounded-lg text-xs" style={{background:"hsl(216 45% 12%)",border:"1px solid hsl(var(--border))",color:"hsl(210 40% 85%)"}}/>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {TABS.map(tab=>(
          <button key={tab.key} onClick={()=>setActiveTab(tab.key)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap"
            style={{background:activeTab===tab.key?"hsl(38 95% 52% / 0.15)":"hsl(var(--card))",color:activeTab===tab.key?"hsl(38 95% 60%)":"hsl(215 25% 55%)",border:`1px solid ${activeTab===tab.key?"hsl(38 95% 52% / 0.35)":"hsl(var(--border))"}`}}>
            <tab.icon className="h-3.5 w-3.5"/>{tab.label}
          </button>
        ))}
      </div>

      {/* ═══ OVERVIEW ═══ */}
      {activeTab==="overview" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[{l:"Standards Available",v:ISO_STANDARDS.length,c:"hsl(38 95% 60%)"},{l:"Industries Covered",v:"All",c:"hsl(158 64% 55%)"},{l:"Selected Standard",v:selected.code,c:"hsl(217 91% 70%)"},{l:"Complexity",v:selected.complexity,c:complexityColor(selected.complexity)}].map((s,i)=>(
              <div key={i} className="rounded-xl p-4 text-center" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                <p className="text-xl font-bold" style={{color:s.c}}>{s.v}</p><p className="text-[11px] mt-0.5" style={{color:"hsl(215 25% 50%)"}}>{s.l}</p>
              </div>
            ))}
          </div>

          {ISO_STANDARDS.map(std=>{
            const isEx=expandedISO===std.code;
            return(
              <div key={std.code} className="rounded-xl overflow-hidden" style={{background:"hsl(var(--card))",border:`1px solid ${selectedISO===std.code?std.border:"hsl(var(--border))"}`}}>
                <button onClick={()=>{setExpandedISO(isEx?null:std.code);setSelectedISO(std.code);}}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left" style={{background:isEx?std.bg:"transparent"}}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl shrink-0" style={{background:`${std.color}15`,border:`1px solid ${std.color}30`}}>
                    <std.icon className="h-6 w-6" style={{color:std.color}}/>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm" style={{color:"hsl(210 40% 92%)"}}>{std.title}</span>
                      <span className="text-xs" style={{color:std.color}}>— {std.desc}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{background:`${complexityColor(std.complexity)}15`,color:complexityColor(std.complexity)}}>{std.complexity}</span>
                    </div>
                    <p className="text-xs mt-0.5" style={{color:"hsl(215 25% 55%)"}}>{std.applicability}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 text-right">
                    <div><p className="text-xs font-semibold" style={{color:"hsl(210 40% 80%)"}}>{std.typicalTimeline}</p><p className="text-[10px]" style={{color:"hsl(215 25% 50%)"}}>to certify</p></div>
                    {isEx?<ChevronDown className="h-4 w-4" style={{color:"hsl(215 25% 45%)"}}/>:<ChevronRight className="h-4 w-4" style={{color:"hsl(215 25% 45%)"}}/>}
                  </div>
                </button>
                {isEx&&(
                  <div className="px-5 pb-5 space-y-4" style={{borderTop:"1px solid hsl(var(--border))"}}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4">
                      {/* Clauses */}
                      <div className="lg:col-span-2">
                        <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{color:std.color}}>Key Clauses</p>
                        <div className="space-y-2">
                          {std.clauses.map(clause=>{
                            const cEx=expandedClause===`${std.code}-${clause.num}`;
                            return(
                              <div key={clause.num} className="rounded-lg overflow-hidden" style={{background:"hsl(216 45% 11%)"}}>
                                <button onClick={()=>setExpandedClause(cEx?null:`${std.code}-${clause.num}`)}
                                  className="w-full flex items-center gap-3 px-3 py-2.5 text-left">
                                  <span className="flex h-6 w-6 items-center justify-center rounded text-[10px] font-bold shrink-0" style={{background:`${std.color}20`,color:std.color}}>{clause.num}</span>
                                  <span className="text-xs font-semibold flex-1" style={{color:"hsl(210 40% 85%)"}}>{clause.title}</span>
                                  {cEx?<ChevronDown className="h-3.5 w-3.5" style={{color:"hsl(215 25% 45%)"}}/>:<ChevronRight className="h-3.5 w-3.5" style={{color:"hsl(215 25% 45%)"}}/>}
                                </button>
                                {cEx&&<div className="px-3 pb-2.5 space-y-1">
                                  {clause.requirements.map((req,j)=>(
                                    <div key={j} className="flex items-center gap-2 text-[11px]">
                                      <CheckCircle2 className="h-3 w-3 shrink-0" style={{color:std.color}}/>
                                      <span style={{color:"hsl(210 40% 72%)"}}>{req}</span>
                                    </div>
                                  ))}
                                </div>}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      {/* Benefits & Docs */}
                      <div className="space-y-3">
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{color:std.color}}>Benefits</p>
                          {std.benefits.map((b,i)=>(
                            <div key={i} className="flex items-center gap-2 text-xs mb-1.5">
                              <Star className="h-3.5 w-3.5 shrink-0" style={{color:std.color}}/>
                              <span style={{color:"hsl(210 40% 78%)"}}>{b}</span>
                            </div>
                          ))}
                        </div>
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{color:std.color}}>Mandatory Documents ({std.mandatoryDocs.length})</p>
                          <div className="flex flex-wrap gap-1">
                            {std.mandatoryDocs.map((d,i)=><span key={i} className="text-[10px] px-2 py-0.5 rounded" style={{background:"hsl(216 45% 14%)",color:"hsl(215 25% 60%)"}}>{d}</span>)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button onClick={()=>{setActiveTab("gap_assessment");runGap();}}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold"
                        style={{background:std.color,color:"hsl(216 58% 6%)"}}>
                        <BarChart2 className="h-4 w-4"/> Run Gap Assessment
                      </button>
                      <button onClick={()=>{setActiveTab("implementation");runImpl();}}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold"
                        style={{background:"hsl(216 45% 18%)",color:"hsl(210 40% 75%)",border:"1px solid hsl(var(--border))"}}>
                        <ClipboardList className="h-4 w-4"/> Build Implementation Plan
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ═══ GAP ASSESSMENT ═══ */}
      {activeTab==="gap_assessment" && (
        <div className="space-y-4">
          <div className="rounded-xl p-5 flex items-center justify-between flex-wrap gap-3" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
            <div>
              <div className="flex items-center gap-2">
                <selected.icon className="h-4 w-4" style={{color:selected.color}}/>
                <h2 className="text-sm font-semibold" style={{color:"hsl(210 40% 92%)"}}>Gap Assessment — {selected.title}</h2>
              </div>
              <p className="text-xs mt-0.5" style={{color:"hsl(215 25% 55%)"}}>AI evaluates your company against all {selected.clauses.length} clause groups — identifies gaps and prioritizes actions</p>
            </div>
            <button onClick={runGap} disabled={gapAI.loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50"
              style={{background:selected.color,color:"hsl(216 58% 6%)"}}>
              {gapAI.loading?<RefreshCw className="h-4 w-4 animate-spin"/>:<Play className="h-4 w-4"/>}
              {gapAI.loading?"Assessing...":"Run Gap Assessment"}
            </button>
          </div>

          {/* ISO selector */}
          <div className="flex flex-wrap gap-2">
            {ISO_STANDARDS.map(s=>(
              <button key={s.code} onClick={()=>{setSelectedISO(s.code);gapAI.analyze&&setExpandedISO(null);}}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                style={{background:selectedISO===s.code?s.bg:"hsl(216 45% 14%)",color:selectedISO===s.code?s.color:"hsl(215 25% 55%)",border:`1px solid ${selectedISO===s.code?s.border:"transparent"}`}}>
                {s.code}
              </button>
            ))}
          </div>

          {gapAI.error&&<ErrorBanner msg={gapAI.error}/>}
          {gapAI.loading&&<div className="rounded-xl p-10 text-center" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-3" style={{color:selected.color}}/>
            <p className="font-medium" style={{color:"hsl(210 40% 75%)"}}>Assessing your readiness for {selected.title}...</p>
            <p className="text-xs mt-1" style={{color:"hsl(215 25% 45%)"}}>Evaluating all clause groups and identifying gaps</p>
          </div>}

          {gapAI.result&&!gapAI.loading&&(
            <div className="space-y-4">
              {/* Readiness score */}
              <div className="rounded-xl p-6 flex items-center gap-8 flex-wrap" style={{background:"hsl(var(--card))",border:`1px solid ${selected.border}`}}>
                <div className="text-center">
                  <p className="text-5xl font-black" style={{color:gapAI.result.overallReadiness>=70?"hsl(158 64% 55%)":gapAI.result.overallReadiness>=40?"hsl(38 95% 60%)":"hsl(0 72% 68%)"}}>{gapAI.result.overallReadiness}%</p>
                  <p className="text-sm mt-1" style={{color:"hsl(215 25% 50%)"}}>Readiness Score</p>
                </div>
                <div>
                  <p className="text-xl font-bold" style={{color:selected.color}}>{gapAI.result.status}</p>
                  <p className="text-xs mt-1" style={{color:"hsl(215 25% 55%)"}}>Estimated time to ready: {gapAI.result.estimatedTimeToReady}</p>
                  <div className="h-3 rounded-full mt-3 w-64" style={{background:"hsl(216 45% 15%)"}}>
                    <div className="h-3 rounded-full transition-all" style={{width:`${gapAI.result.overallReadiness}%`,background:gapAI.result.overallReadiness>=70?"hsl(158 64% 45%)":gapAI.result.overallReadiness>=40?"hsl(38 95% 52%)":"hsl(0 72% 51%)"}}/>
                  </div>
                </div>
              </div>

              {/* Gaps table */}
              {gapAI.result.gaps?.length>0&&(
                <div className="rounded-xl overflow-hidden" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                  <div className="px-5 py-3" style={{background:"hsl(216 45% 12)"}}><h3 className="text-sm font-semibold" style={{color:"hsl(210 40% 92%)"}}>Gap Analysis by Clause</h3></div>
                  <table className="w-full text-xs">
                    <thead><tr style={{background:"hsl(216 45% 10%)"}}>
                      {["Clause","Area","Current State","Gap Level","Effort","Action"].map(h=><th key={h} className="px-3 py-2.5 text-left font-semibold" style={{color:"hsl(215 25% 45%)"}}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {gapAI.result.gaps.map((g:any,i:number)=>(
                        <tr key={i} style={{borderTop:"1px solid hsl(var(--border))"}}>
                          <td className="px-3 py-2.5 font-semibold" style={{color:selected.color}}>{g.clause}</td>
                          <td className="px-3 py-2.5 font-medium" style={{color:"hsl(210 40% 85%)"}}>{g.area}</td>
                          <td className="px-3 py-2.5 text-[11px]" style={{color:"hsl(215 25% 55%)"}}>{g.currentState}</td>
                          <td className="px-3 py-2.5"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{background:`${gapLevelColor(g.gap)}15`,color:gapLevelColor(g.gap)}}>{g.gap}</span></td>
                          <td className="px-3 py-2.5" style={{color:"hsl(215 25% 55%)"}}>{g.effort}</td>
                          <td className="px-3 py-2.5 text-[11px]" style={{color:"hsl(210 40% 75%)"}}>{g.recommendation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Quick wins */}
                {gapAI.result.quickWins?.length>0&&(
                  <div className="rounded-xl p-5" style={{background:"hsl(158 64% 40% / 0.05)",border:"1px solid hsl(158 64% 40% / 0.2)"}}>
                    <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{color:"hsl(158 64% 55%)"}}>⚡ Quick Wins (0–30 days)</h3>
                    {gapAI.result.quickWins.map((w:string,i:number)=>(
                      <div key={i} className="flex items-start gap-2 text-xs mb-2"><CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{color:"hsl(158 64% 55%)"}}/><span style={{color:"hsl(210 40% 78%)"}}>{w}</span></div>
                    ))}
                  </div>
                )}
                {/* Critical actions */}
                {gapAI.result.criticalActions?.length>0&&(
                  <div className="rounded-xl p-5" style={{background:"hsl(0 72% 51% / 0.05)",border:"1px solid hsl(0 72% 51% / 0.2)"}}>
                    <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{color:"hsl(0 72% 68%)"}}>🚨 Critical Actions</h3>
                    {gapAI.result.criticalActions.map((a:string,i:number)=>(
                      <div key={i} className="flex items-start gap-2 text-xs mb-2"><AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{color:"hsl(0 72% 68%)"}}/><span style={{color:"hsl(210 40% 78%)"}}>{a}</span></div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          {!gapAI.result&&!gapAI.loading&&!gapAI.error&&(
            <div className="rounded-xl p-10 text-center" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
              <BarChart2 className="h-12 w-12 mx-auto mb-4 opacity-20" style={{color:selected.color}}/>
              <p className="font-medium" style={{color:"hsl(215 25% 50%)"}}>Click "Run Gap Assessment" to evaluate your {selectedISO} readiness</p>
            </div>
          )}
        </div>
      )}

      {/* ═══ IMPLEMENTATION PLAN ═══ */}
      {activeTab==="implementation" && (
        <div className="space-y-4">
          <div className="rounded-xl p-5 flex items-center justify-between flex-wrap gap-3" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
            <div>
              <h2 className="text-sm font-semibold" style={{color:"hsl(210 40% 92%)"}}>Implementation Plan — {selected.title}</h2>
              <p className="text-xs mt-0.5" style={{color:"hsl(215 25% 55%)"}}>Phase-by-phase roadmap with budget, timeline, and resource planning</p>
            </div>
            <button onClick={runImpl} disabled={implAI.loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50"
              style={{background:selected.color,color:"hsl(216 58% 6%)"}}>
              {implAI.loading?<RefreshCw className="h-4 w-4 animate-spin"/>:<ClipboardList className="h-4 w-4"/>}
              {implAI.loading?"Planning...":"Generate Implementation Plan"}
            </button>
          </div>

          {implAI.error&&<ErrorBanner msg={implAI.error}/>}
          {implAI.loading&&<div className="rounded-xl p-10 text-center" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-3" style={{color:selected.color}}/>
            <p className="font-medium" style={{color:"hsl(210 40% 75%)"}}>Building ISO {selectedISO} implementation roadmap...</p>
          </div>}

          {implAI.result&&!implAI.loading&&(
            <div className="space-y-4">
              {/* Summary */}
              <div className="grid grid-cols-3 gap-3">
                {[{l:"Total Duration",v:implAI.result.totalDuration,c:selected.color},{l:"Total Budget",v:implAI.result.totalCost,c:"hsl(38 95% 60%)"},{l:"Phases",v:implAI.result.phases?.length,c:"hsl(158 64% 55%)"}].map((s,i)=>(
                  <div key={i} className="rounded-xl p-4 text-center" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                    <p className="text-xl font-bold" style={{color:s.c}}>{s.v}</p><p className="text-[11px] mt-0.5" style={{color:"hsl(215 25% 50%)"}}>{s.l}</p>
                  </div>
                ))}
              </div>

              {/* Phases */}
              {implAI.result.phases?.map((phase:any,i:number)=>(
                <div key={i} className="rounded-xl p-5" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-black" style={{background:`${selected.color}20`,color:selected.color}}>{i+1}</span>
                      <div>
                        <h3 className="text-sm font-bold" style={{color:"hsl(210 40% 92%)"}}>{phase.phase}</h3>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-[10px]" style={{color:"hsl(215 25% 55%)"}}>⏱ {phase.duration}</span>
                          {phase.owner&&<span className="text-[10px]" style={{color:"hsl(215 25% 55%)"}}>Owner: {phase.owner}</span>}
                          {phase.budget&&<span className="text-[10px] font-semibold" style={{color:"hsl(38 95% 60%)"}}>💰 {phase.budget}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {phase.activities?.length>0&&(
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{color:"hsl(215 25% 45%)"}}>Activities</p>
                        {phase.activities.map((a:string,j:number)=>(
                          <div key={j} className="flex items-center gap-2 text-xs mb-1.5"><Play className="h-3 w-3 shrink-0" style={{color:selected.color}}/><span style={{color:"hsl(210 40% 78%)"}}>{a}</span></div>
                        ))}
                      </div>
                    )}
                    {phase.deliverables?.length>0&&(
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{color:"hsl(215 25% 45%)"}}>Deliverables</p>
                        {phase.deliverables.map((d:string,j:number)=>(
                          <div key={j} className="flex items-center gap-2 text-xs mb-1.5"><CheckCircle2 className="h-3 w-3 shrink-0" style={{color:"hsl(158 64% 55%)"}}/><span style={{color:"hsl(210 40% 78%)"}}>{d}</span></div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Risks */}
              {implAI.result.risks?.length>0&&(
                <div className="rounded-xl p-5" style={{background:"hsl(0 72% 51% / 0.05)",border:"1px solid hsl(0 72% 51% / 0.2)"}}>
                  <h3 className="text-sm font-bold mb-3" style={{color:"hsl(0 72% 68%)"}}>Implementation Risks & Mitigations</h3>
                  <div className="space-y-3">
                    {implAI.result.risks.map((r:any,i:number)=>(
                      <div key={i} className="grid grid-cols-2 gap-3 p-3 rounded-lg" style={{background:"hsl(216 45% 12%)"}}>
                        <div className="flex items-start gap-2 text-xs"><AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{color:"hsl(0 72% 68%)"}}/><span style={{color:"hsl(210 40% 80%)"}}>{r.risk}</span></div>
                        <div className="flex items-start gap-2 text-xs"><Shield className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{color:"hsl(158 64% 55%)"}}/><span style={{color:"hsl(210 40% 78%)"}}>{r.mitigation}</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {!implAI.result&&!implAI.loading&&!implAI.error&&(
            <div className="rounded-xl p-10 text-center" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
              <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-20" style={{color:selected.color}}/>
              <p className="font-medium" style={{color:"hsl(215 25% 50%)"}}>Click "Generate Implementation Plan" for a detailed roadmap</p>
            </div>
          )}
        </div>
      )}

      {/* ═══ DOCUMENTATION ═══ */}
      {activeTab==="documentation" && (
        <div className="space-y-4">
          <div className="rounded-xl p-5" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
            <h2 className="text-sm font-semibold mb-1" style={{color:"hsl(210 40% 92%)"}}>Mandatory Documentation — {selected.title}</h2>
            <p className="text-xs" style={{color:"hsl(215 25% 55)"}}>Complete list of required documents, procedures, and records for certification</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-xl p-5" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
              <h3 className="text-sm font-bold mb-4" style={{color:selected.color}}>Mandatory Documents ({selected.mandatoryDocs.length})</h3>
              <div className="space-y-2">
                {selected.mandatoryDocs.map((doc,i)=>(
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-lg" style={{background:"hsl(216 45% 11%)"}}>
                    <div className="flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5 shrink-0" style={{color:selected.color}}/>
                      <span className="text-xs" style={{color:"hsl(210 40% 80%)"}}>{doc}</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold" style={{background:"hsl(216 45% 16%)",color:"hsl(215 25% 55%)"}}>Required</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-xl p-5" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                <h3 className="text-sm font-bold mb-3" style={{color:selected.color}}>Document Control Requirements</h3>
                {["All documents must have unique identification number","Version control with revision history","Approval signatures (author + reviewer + approver)","Clear distribution list and access controls","Annual review cycle minimum","Obsolete documents clearly marked and archived","Controlled copy register maintained"].map((req,i)=>(
                  <div key={i} className="flex items-center gap-2 text-xs mb-2"><CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{color:"hsl(158 64% 55%)"}}/><span style={{color:"hsl(210 40% 78%)"}}>{req}</span></div>
                ))}
              </div>
              <div className="rounded-xl p-5" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                <h3 className="text-sm font-bold mb-3" style={{color:selected.color}}>Document Hierarchy</h3>
                {[{level:"Level 1",title:"Policy",desc:"Top-level intent and commitment",color:"hsl(38 95% 60%)"},{level:"Level 2",title:"Procedures",desc:"How things are done (who, what, when)",color:"hsl(217 91% 70%)"},{level:"Level 3",title:"Work Instructions",desc:"Step-by-step task guidance",color:"hsl(158 64% 55%)"},{level:"Level 4",title:"Records & Forms",desc:"Evidence of compliance",color:"hsl(215 25% 55%)"}].map((h,i)=>(
                  <div key={i} className="flex items-center gap-3 mb-2 p-2.5 rounded-lg" style={{background:"hsl(216 45% 11%)"}}>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0" style={{background:`${h.color}15`,color:h.color}}>{h.level}</span>
                    <div><p className="text-xs font-semibold" style={{color:"hsl(210 40% 85%)"}}>{h.title}</p><p className="text-[10px]" style={{color:"hsl(215 25% 50%)"}}>{h.desc}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ AUDIT PREPARATION ═══ */}
      {activeTab==="audit_prep" && (
        <div className="space-y-4">
          <div className="rounded-xl p-5" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
            <h2 className="text-sm font-semibold mb-1" style={{color:"hsl(210 40% 92%)"}}>Audit Preparation — {selected.title}</h2>
            <p className="text-xs" style={{color:"hsl(215 25% 55%)"}}>Stage 1 (Documentation review) and Stage 2 (On-site audit) preparation checklist</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Stage 1 */}
            <div className="rounded-xl p-5" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
              <h3 className="text-sm font-bold mb-4" style={{color:"hsl(38 95% 60%)"}}>Stage 1 — Document Review</h3>
              {["QMS/EMS/ISMS scope documented and approved","All mandatory procedures written and approved","Risk assessment completed and documented","Internal audit completed (all clauses covered)","Management review meeting conducted","Corrective actions from internal audit closed","Competency records up to date for all staff","Evidence of objectives being measured","Nonconformity log maintained","Calibration records (if applicable)"].map((item,i)=>(
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg mb-2 cursor-pointer" style={{background:"hsl(216 45% 11%)"}}>
                  <div className="h-4 w-4 rounded border-2 shrink-0 flex items-center justify-center" style={{borderColor:"hsl(38 95% 52%)"}}/>
                  <span className="text-xs" style={{color:"hsl(210 40% 78%)"}}>{item}</span>
                </div>
              ))}
            </div>
            {/* Stage 2 */}
            <div className="rounded-xl p-5" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
              <h3 className="text-sm font-bold mb-4" style={{color:"hsl(158 64% 55%)"}}>Stage 2 — On-Site Audit</h3>
              {["Auditor welcome pack ready (site map, org chart, schedule)","Management representative identified and briefed","All staff aware of audit date and their role","Meeting room prepared for opening/closing meetings","All records accessible and organized","Process areas clean and compliant","Corrective action evidence ready","Interviews practiced with key staff","Emergency procedures posted and known","Audit program sample size understood"].map((item,i)=>(
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg mb-2 cursor-pointer" style={{background:"hsl(216 45% 11%)"}}>
                  <div className="h-4 w-4 rounded border-2 shrink-0 flex items-center justify-center" style={{borderColor:"hsl(158 64% 45%)"}}/>
                  <span className="text-xs" style={{color:"hsl(210 40% 78%)"}}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Common audit pitfalls */}
          <div className="rounded-xl p-5" style={{background:"hsl(0 72% 51% / 0.05)",border:"1px solid hsl(0 72% 51% / 0.2)"}}>
            <h3 className="text-sm font-bold mb-4" style={{color:"hsl(0 72% 68%)"}}>⚠️ Common Audit Pitfalls — Avoid These</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "Documents not reviewed/approved in last 12 months","Objectives without measurement evidence","Internal auditor not trained or qualified","Management review not covering all required inputs","Staff unable to explain quality/safety policy","Records with gaps or unsigned approvals","Corrective actions not closed within timelines","Customer complaints not linked to corrective actions","Calibration records expired or missing","Training records not matching job requirements",
              ].map((p,i)=>(
                <div key={i} className="flex items-start gap-2 text-xs p-2.5 rounded-lg" style={{background:"hsl(216 45% 12%)"}}>
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{color:"hsl(0 72% 68%)"}}/>
                  <span style={{color:"hsl(210 40% 78%)"}}>{p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Certification bodies */}
          <div className="rounded-xl p-5" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
            <h3 className="text-sm font-bold mb-4" style={{color:"hsl(217 91% 70%)"}}>Recommended Certification Bodies</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[{name:"Bureau Veritas",desc:"Global leader, strong MENA presence",logo:"BV"},{name:"SGS",desc:"World's largest inspection company",logo:"SGS"},{name:"DNV",desc:"Strong in oil & gas, maritime",logo:"DNV"},{name:"TÜV Rheinland",desc:"German precision, widely accepted",logo:"TÜV"},{name:"BSI",desc:"British Standards Institution, pioneer",logo:"BSI"},{name:"Intertek",desc:"Strong in testing & certification",logo:"ITK"},{name:"LRQA",desc:"Lloyd's Register, respected globally",logo:"LRQA"},{name:"QHSE Arabia",desc:"MENA specialist CB",logo:"QA"}].map((cb,i)=>(
                <div key={i} className="p-3 rounded-lg text-center" style={{background:"hsl(216 45% 12%)"}}>
                  <div className="h-10 w-10 rounded-lg mx-auto mb-2 flex items-center justify-center font-black text-xs" style={{background:"hsl(216 45% 18%)",color:"hsl(217 91% 70%)"}}>{cb.logo}</div>
                  <p className="text-xs font-semibold" style={{color:"hsl(210 40% 85%)"}}>{cb.name}</p>
                  <p className="text-[10px] mt-0.5" style={{color:"hsl(215 25% 50%)"}}>{cb.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
