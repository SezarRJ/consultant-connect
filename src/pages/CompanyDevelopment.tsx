import { useState } from "react";
import {
  Building2, Users, GitBranch, Target, DollarSign, TrendingUp,
  AlertTriangle, CheckCircle2, Plus, ChevronRight, ChevronDown,
  UserPlus, Shield, Zap, Megaphone, Factory, Calculator,
  ClipboardList, Award, Star, ArrowUpRight, RefreshCw, X
} from "lucide-react";
import { useClaudeAnalysis } from "@/hooks/useClaudeAnalysis";

type Tab = "org_chart" | "departments" | "processes" | "hiring" | "salaries";

interface DeptSection { name: string; headcount: number; required: number; roles: string[]; }
interface Department {
  id: string; name: string; nameAr: string; head: string;
  icon: any; color: string; headcount: number; required: number;
  sections: DeptSection[]; responsibilities: string[]; kpis: string[]; reportsTo: string[];
}

const DEPTS: Department[] = [
  { id:"executive", name:"Executive Office", nameAr:"المكتب التنفيذي", head:"CEO / General Manager", icon:Star, color:"hsl(38 95% 60%)", headcount:3, required:4,
    sections:[
      {name:"CEO Office", headcount:1, required:1, roles:["CEO / General Manager"]},
      {name:"Strategy & Planning", headcount:1, required:2, roles:["Chief Strategy Officer","Strategic Planning Analyst"]},
      {name:"Executive Admin", headcount:1, required:1, roles:["Executive Assistant","Office Manager"]},
    ],
    responsibilities:["Set company vision, mission and strategic direction","Approve annual budgets and capital allocation","Oversee all departmental performance","Represent company to board and investors","Approve major contracts and partnerships","Set company culture and values"],
    kpis:["Revenue growth %","EBITDA margin","Strategic goal achievement","Board satisfaction score"], reportsTo:[]},
  { id:"finance", name:"Finance & Accounting", nameAr:"المالية والمحاسبة", head:"CFO / Finance Director", icon:DollarSign, color:"hsl(158 64% 55%)", headcount:6, required:9,
    sections:[
      {name:"Accounting", headcount:3, required:4, roles:["Chief Accountant","Senior Accountant","Junior Accountant","AP/AR Clerk"]},
      {name:"FP&A", headcount:1, required:2, roles:["FP&A Manager","Financial Analyst"]},
      {name:"Treasury", headcount:1, required:2, roles:["Treasury Manager","Cash Controller"]},
      {name:"Internal Audit", headcount:1, required:1, roles:["Internal Auditor"]},
    ],
    responsibilities:["Monthly/quarterly/annual P&L and balance sheet","Cash flow forecasting and treasury management","Budget preparation and variance analysis","Tax planning and regulatory compliance","Payroll processing and coordination","Internal audit and financial controls","Investor and bank reporting"],
    kpis:["DSO","Cost-to-revenue ratio","Budget variance %","Audit findings","Payroll accuracy"], reportsTo:["executive"]},
  { id:"hr", name:"Human Resources", nameAr:"الموارد البشرية", head:"HR Director / CHRO", icon:Users, color:"hsl(280 80% 70%)", headcount:4, required:7,
    sections:[
      {name:"Recruitment & Talent", headcount:1, required:2, roles:["Recruitment Manager","Talent Acquisition Specialist"]},
      {name:"HR Operations", headcount:2, required:3, roles:["HR Manager","HR Generalist","HR Coordinator"]},
      {name:"L&D", headcount:1, required:1, roles:["Learning & Development Manager"]},
      {name:"C&B", headcount:0, required:1, roles:["Compensation & Benefits Specialist"]},
    ],
    responsibilities:["Recruitment, selection and onboarding","Performance management and appraisals","Training and development programs","Compensation, benefits and payroll coordination","HR policy development and compliance","Employee relations and conflict resolution","Workforce planning and succession"],
    kpis:["Time-to-hire","Turnover rate","Training hours/employee","Employee satisfaction","Offer acceptance rate"], reportsTo:["executive"]},
  { id:"operations", name:"Operations", nameAr:"العمليات", head:"COO / Operations Director", icon:Factory, color:"hsl(200 80% 65%)", headcount:12, required:16,
    sections:[
      {name:"Project Management", headcount:3, required:4, roles:["Operations Manager","Senior PM","PM","Junior PM"]},
      {name:"Quality Control", headcount:2, required:3, roles:["QC Manager","Quality Analyst","QC Inspector"]},
      {name:"Supply Chain", headcount:4, required:5, roles:["Supply Chain Manager","Logistics Coordinator","Procurement Officer","Warehouse Supervisor","Inventory Controller"]},
      {name:"Process Improvement", headcount:2, required:2, roles:["Process Engineer","Lean/Six Sigma Specialist"]},
      {name:"Facilities", headcount:1, required:2, roles:["Facilities Manager","Maintenance Supervisor"]},
    ],
    responsibilities:["Day-to-day operations management","Process design, documentation and optimization","Quality assurance and control systems","Supply chain and procurement management","Vendor and supplier management","Facilities and asset management","KPI tracking and operational reporting","ISO and compliance management"],
    kpis:["On-time delivery %","Defect rate","Efficiency ratio","Supplier on-time %","Cost per unit"], reportsTo:["executive"]},
  { id:"sales", name:"Sales & Business Development", nameAr:"المبيعات وتطوير الأعمال", head:"VP Sales / Sales Director", icon:TrendingUp, color:"hsl(38 95% 60%)", headcount:8, required:13,
    sections:[
      {name:"Sales Team", headcount:4, required:6, roles:["Sales Manager","Senior Sales Rep","Sales Rep x3","Sales Coordinator"]},
      {name:"Business Development", headcount:2, required:3, roles:["BD Manager","BD Executive","Partnerships Officer"]},
      {name:"Key Accounts", headcount:1, required:2, roles:["KAM Manager","Key Account Executive"]},
      {name:"Sales Operations", headcount:1, required:2, roles:["Sales Ops Manager","CRM Admin"]},
    ],
    responsibilities:["Revenue generation and target achievement","New business prospecting and pipeline management","Key account management and retention","Pricing and proposal management","Distribution channel development","Sales team training and performance","Market expansion and territory planning","CRM management and analytics"],
    kpis:["Revenue vs target","Pipeline value","Win rate %","Customer retention","Revenue/rep","New accounts/month"], reportsTo:["executive"]},
  { id:"marketing", name:"Marketing & Communications", nameAr:"التسويق والاتصالات", head:"CMO / Marketing Director", icon:Megaphone, color:"hsl(0 72% 68%)", headcount:4, required:8,
    sections:[
      {name:"Brand & Strategy", headcount:1, required:2, roles:["Brand Manager","Marketing Strategist"]},
      {name:"Digital Marketing", headcount:2, required:3, roles:["Digital Marketing Manager","Social Media Specialist","SEO/SEM Specialist"]},
      {name:"Content & Creative", headcount:1, required:2, roles:["Content Manager","Graphic Designer"]},
      {name:"PR & Comms", headcount:0, required:1, roles:["PR Manager"]},
    ],
    responsibilities:["Brand strategy and identity management","Digital marketing campaigns","Content creation and materials","Social media management","Market research and competitive intelligence","PR, media relations and events","Lead generation","Marketing analytics and ROI"],
    kpis:["Lead volume","CPL","Brand awareness","Website traffic","Marketing ROI","Engagement rate"], reportsTo:["executive"]},
  { id:"it", name:"Information Technology", nameAr:"تقنية المعلومات", head:"CTO / IT Director", icon:Zap, color:"hsl(217 91% 70%)", headcount:3, required:6,
    sections:[
      {name:"Infrastructure", headcount:1, required:2, roles:["IT Manager","Systems Administrator"]},
      {name:"Software & Dev", headcount:1, required:2, roles:["Software Developer","Full Stack Developer"]},
      {name:"Security & Support", headcount:1, required:2, roles:["IT Support Specialist","Cybersecurity Analyst"]},
    ],
    responsibilities:["IT infrastructure setup and maintenance","Software development and integration","ERP/CRM/HRIS management","Data backup and disaster recovery","Cybersecurity policies","IT helpdesk and user support","Technology roadmap and digital transformation","Cloud infrastructure"],
    kpis:["System uptime %","Ticket resolution time","Cybersecurity incidents","IT cost/user"], reportsTo:["executive"]},
  { id:"legal", name:"Legal & Compliance", nameAr:"الشؤون القانونية", head:"General Counsel", icon:Shield, color:"hsl(0 72% 68%)", headcount:2, required:4,
    sections:[
      {name:"Legal Affairs", headcount:1, required:2, roles:["Company Lawyer","Legal Officer"]},
      {name:"Compliance", headcount:1, required:2, roles:["Compliance Manager","Regulatory Affairs Officer"]},
    ],
    responsibilities:["Contract drafting, review and negotiation","Corporate governance and board secretarial","Regulatory compliance and licensing","IP protection","Litigation management","Employment law compliance","Anti-corruption and ethics","Data protection"],
    kpis:["Contract turnaround","Compliance score","Disputes resolved","Regulatory filings on time"], reportsTo:["executive"]},
  { id:"customer_service", name:"Customer Service", nameAr:"خدمة العملاء", head:"CS Manager", icon:Award, color:"hsl(158 64% 55%)", headcount:5, required:8,
    sections:[
      {name:"Customer Support", headcount:3, required:5, roles:["CS Team Lead","CS Agent x3","Senior CS Agent"]},
      {name:"After-Sales", headcount:1, required:2, roles:["After-Sales Manager","Technical Support Engineer"]},
      {name:"Customer Experience", headcount:1, required:1, roles:["CX Specialist"]},
    ],
    responsibilities:["Handle all customer inquiries and complaints","Maintain CSAT and NPS scores","After-sales support and warranty management","Customer feedback collection","SLA compliance","CRM data maintenance","Escalation management"],
    kpis:["CSAT","NPS","First-call resolution","Response time","SLA compliance %"], reportsTo:["sales"]},
];

const HIRING_PROMPT = `You are a senior HR consultant for MENA markets. Generate a comprehensive hiring plan. Respond ONLY with valid JSON:
{"urgentHires":[{"role":"string","department":"string","priority":"Critical|High|Medium","reason":"string","timeframe":"string","estimatedSalary":"string"}],"quarterlyPlan":{"q1":["string"],"q2":["string"],"q3":["string"],"q4":["string"]},"totalHeadcountGap":"number","estimatedRecruitmentCost":"string","onboardingTimeline":"string","recommendedSources":["string"],"recommendations":["string"]}`;

const SALARY_PROMPT = `You are a senior compensation consultant for MENA markets. Provide salary benchmarks. Respond ONLY with valid JSON:
{"marketContext":{"country":"string","city":"string","industryPremium":"string","costOfLiving":"string"},"salaryBands":[{"department":"string","role":"string","level":"Junior|Mid|Senior|Manager|Director|C-Suite","minUSD":"number","midUSD":"number","maxUSD":"number","notes":"string"}],"benefitsPackage":{"housing":"string","transport":"string","health":"string","bonus":"string","leave":"string"},"totalCompensationStrategy":"string","recommendations":["string"]}`;

const PROCESS_PROMPT = `You are a business process consultant. Design company processes. Respond ONLY with valid JSON:
{"coreProcesses":[{"process":"string","department":"string","owner":"string","frequency":"string","steps":["string"],"kpis":["string"]}],"interdepartmentalWorkflows":[{"workflow":"string","departments":["string"],"trigger":"string","outcome":"string"}],"approvalMatrix":[{"decision":"string","amount":"string","approver":"string","timeline":"string"}],"communicationProtocol":{"daily":"string","weekly":"string","monthly":"string","escalation":"string"},"recommendations":["string"]}`;

function ErrorBanner({msg}:{msg:string}) {
  return (
    <div className="rounded-xl p-4 flex items-start gap-3" style={{background:"hsl(0 72% 51% / 0.08)",border:"1px solid hsl(0 72% 51% / 0.3)"}}>
      <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" style={{color:"hsl(0 72% 68%)"}}/>
      <div>
        <p className="text-sm" style={{color:"hsl(0 72% 68%)"}}>{msg}</p>
        {msg.toLowerCase().includes("credit") && <a href="https://console.anthropic.com/" target="_blank" rel="noreferrer" className="text-xs mt-1 underline inline-flex items-center gap-1" style={{color:"hsl(38 95% 60%)"}}>Top up credits <ArrowUpRight className="h-3 w-3"/></a>}
      </div>
    </div>
  );
}

export default function CompanyDevelopment() {
  const [activeTab, setActiveTab] = useState<Tab>("org_chart");
  const [selectedDept, setSelectedDept] = useState<Department|null>(null);
  const [expandedDept, setExpandedDept] = useState<string|null>(null);
  const [company, setCompany] = useState({name:"Al-Rashidi Group",country:"Iraq",city:"Baghdad",industry:"FMCG / Distribution",type:"Private Company",size:"Medium (50–250)",revenue:"$5M–$15M",vision:"Regional FMCG leader in 5 years, IPO-ready by 2030"});

  const hiringAI  = useClaudeAnalysis({systemPrompt:HIRING_PROMPT,  agentId:"hiring-plan"});
  const salaryAI  = useClaudeAnalysis({systemPrompt:SALARY_PROMPT,  agentId:"salary-bench"});
  const processAI = useClaudeAnalysis({systemPrompt:PROCESS_PROMPT, agentId:"process-design"});

  const totalHC  = DEPTS.reduce((a,d)=>a+d.headcount,0);
  const totalReq = DEPTS.reduce((a,d)=>a+d.required,0);
  const totalGap = totalReq - totalHC;
  const criticalDepts = DEPTS.filter(d=>d.required-d.headcount>2);

  const prompt = (extra:string) => `Company: ${company.name}, Country: ${company.country}, City: ${company.city}, Industry: ${company.industry}, Type: ${company.type}, Size: ${company.size}, Revenue: ${company.revenue}, Vision: ${company.vision}. ${extra}`;

  const TABS = [
    {key:"org_chart"  as Tab, label:"Org Chart",      icon:GitBranch},
    {key:"departments"as Tab, label:"Departments",     icon:Building2},
    {key:"processes"  as Tab, label:"Processes",       icon:ClipboardList},
    {key:"hiring"     as Tab, label:"Hiring Plan",     icon:UserPlus},
    {key:"salaries"   as Tab, label:"Salary Benchmarks",icon:DollarSign},
  ];

  const gapColor = (g:number) => g>3?"hsl(0 72% 68%)":g>0?"hsl(38 95% 60%)":"hsl(158 64% 55%)";

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="rounded-2xl p-6 relative overflow-hidden" style={{background:"linear-gradient(135deg,hsl(216 52% 10%),hsl(216 52% 13%))",border:"1px solid hsl(38 95% 52% / 0.2)"}}>
        <div className="absolute inset-0 opacity-5" style={{backgroundImage:"radial-gradient(circle at 70% 30%, hsl(38 95% 52%), transparent 60%)"}}/>
        <div className="relative flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2"><Building2 className="h-5 w-5" style={{color:"hsl(38 95% 52%)"}}/><span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{background:"hsl(38 95% 52% / 0.15)",color:"hsl(38 95% 60%)"}}>COMPANY DEVELOPMENT SERVICES</span></div>
            <h1 className="text-2xl font-bold font-display" style={{color:"hsl(210 40% 94%)"}}>Company Development Services</h1>
            <p className="text-sm mt-1" style={{color:"hsl(215 25% 60%)"}}>Org structure · Department design · Processes & procedures · Hiring plan · Salary benchmarks</p>
          </div>
          <div className="grid grid-cols-4 gap-4 text-center">
            {[{v:DEPTS.length,l:"Departments",c:"hsl(38 95% 60%)"},{v:totalHC,l:"Current Staff",c:"hsl(217 91% 70%)"},{v:totalReq,l:"Required Staff",c:"hsl(158 64% 55%)"},{v:totalGap,l:"Open Roles",c:"hsl(0 72% 68%)"}].map((s,i)=>(
              <div key={i}><p className="text-2xl font-black" style={{color:s.c}}>{s.v}</p><p className="text-[10px]" style={{color:"hsl(215 25% 50%)"}}>{s.l}</p></div>
            ))}
          </div>
        </div>
      </div>

      {/* Company Profile */}
      <div className="rounded-xl p-5" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{color:"hsl(215 25% 45%)"}}>Company Profile (used for AI analysis)</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(["name","country","city","industry","type","size","revenue"] as const).map(k=>(
            <div key={k}>
              <label className="text-[10px] font-semibold uppercase block mb-1" style={{color:"hsl(215 25% 45%)"}}>{k}</label>
              <input value={company[k]} onChange={e=>setCompany(p=>({...p,[k]:e.target.value}))}
                className="w-full px-2.5 py-2 rounded-lg text-xs" style={{background:"hsl(216 45% 12%)",border:"1px solid hsl(var(--border))",color:"hsl(210 40% 85%)"}}/>
            </div>
          ))}
          <div className="col-span-2 md:col-span-1">
            <label className="text-[10px] font-semibold uppercase block mb-1" style={{color:"hsl(215 25% 45%)"}}>Owner Vision</label>
            <textarea value={company.vision} onChange={e=>setCompany(p=>({...p,vision:e.target.value}))} rows={2}
              className="w-full px-2.5 py-2 rounded-lg text-xs resize-none" style={{background:"hsl(216 45% 12%)",border:"1px solid hsl(var(--border))",color:"hsl(210 40% 85%)"}}/>
          </div>
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

      {/* ═══ ORG CHART ═══ */}
      {activeTab==="org_chart" && (
        <div className="space-y-4">
          {/* Gap summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[{l:"Fully Staffed",v:DEPTS.filter(d=>d.headcount>=d.required).length,c:"hsl(158 64% 55%)"},{l:"Minor Gap (1-2)",v:DEPTS.filter(d=>{const g=d.required-d.headcount;return g>0&&g<=2}).length,c:"hsl(38 95% 60%)"},{l:"Critical Gap (3+)",v:criticalDepts.length,c:"hsl(0 72% 68%)"},{l:"Total Open Roles",v:totalGap,c:"hsl(0 72% 68%)"}].map((s,i)=>(
              <div key={i} className="rounded-xl p-4 text-center" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                <p className="text-2xl font-bold" style={{color:s.c}}>{s.v}</p><p className="text-[11px] mt-0.5" style={{color:"hsl(215 25% 50%)"}}>{s.l}</p>
              </div>
            ))}
          </div>

          {/* Org Tree Visual */}
          <div className="rounded-xl p-6 overflow-x-auto" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
            <h2 className="text-sm font-semibold mb-6 text-center" style={{color:"hsl(210 40% 92%)"}}>Organizational Structure — {company.name}</h2>

            {/* CEO */}
            <div className="flex justify-center mb-2">
              {[DEPTS[0]].map(d=>{
                const gap=d.required-d.headcount;
                return(
                  <button key={d.id} onClick={()=>setSelectedDept(d)}
                    className="rounded-2xl p-4 text-center w-52 hover:scale-105 transition-all"
                    style={{background:`${d.color}15`,border:`2px solid ${d.color}50`}}>
                    <d.icon className="h-6 w-6 mx-auto mb-2" style={{color:d.color}}/>
                    <p className="text-xs font-bold" style={{color:"hsl(210 40% 92%)"}}>{d.name}</p>
                    <p className="text-[10px] mt-0.5" style={{color:d.color}}>{d.head.split(" / ")[0]}</p>
                    <div className="flex justify-center gap-1.5 mt-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{background:"hsl(216 45% 18%)",color:"hsl(210 40% 75%)"}}>{d.headcount}/{d.required}</span>
                      {gap>0&&<span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{background:`${gapColor(gap)}20`,color:gapColor(gap)}}>-{gap}</span>}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Connector down */}
            <div className="flex justify-center"><div className="w-0.5 h-8" style={{background:"hsl(38 95% 52% / 0.4)"}}/></div>
            {/* Horizontal line */}
            <div className="relative h-0 mb-0"><div className="absolute left-[5%] right-[5%] top-0 h-0.5" style={{background:"hsl(38 95% 52% / 0.25)"}}/></div>

            {/* C-Suite row */}
            <div className="flex flex-wrap justify-center gap-3 pt-8 mb-2">
              {DEPTS.slice(1,8).map(d=>{
                const gap=d.required-d.headcount;
                return(
                  <div key={d.id} className="flex flex-col items-center">
                    <div className="w-0.5 h-6 mb-1" style={{background:`${d.color}40`}}/>
                    <button onClick={()=>setSelectedDept(d)}
                      className="rounded-xl p-3 text-center w-36 hover:scale-105 transition-all"
                      style={{background:`${d.color}10`,border:`1px solid ${d.color}35`}}>
                      <d.icon className="h-4 w-4 mx-auto mb-1.5" style={{color:d.color}}/>
                      <p className="text-[11px] font-bold leading-tight" style={{color:"hsl(210 40% 90%)"}}>{d.name}</p>
                      <p className="text-[9px] mt-0.5 truncate" style={{color:d.color}}>{d.head.split(" / ")[0]}</p>
                      <div className="flex justify-center gap-1 mt-1.5">
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{background:"hsl(216 45% 18%)",color:"hsl(210 40% 70%)"}}>{d.headcount}/{d.required}</span>
                        {gap>0&&<span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{background:`${gapColor(gap)}15`,color:gapColor(gap)}}>-{gap}</span>}
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Customer Service under Sales */}
            <div className="flex justify-center mt-4">
              <div className="flex flex-col items-center">
                <p className="text-[10px] italic mb-1" style={{color:"hsl(215 25% 40%)"}}>Reports to Sales & BD</p>
                {[DEPTS[8]].map(d=>{
                  const gap=d.required-d.headcount;
                  return(
                    <button key={d.id} onClick={()=>setSelectedDept(d)}
                      className="rounded-xl p-3 text-center w-40 hover:scale-105 transition-all"
                      style={{background:`${d.color}10`,border:`1px solid ${d.color}35`}}>
                      <d.icon className="h-4 w-4 mx-auto mb-1.5" style={{color:d.color}}/>
                      <p className="text-[11px] font-bold" style={{color:"hsl(210 40% 90%)"}}>{d.name}</p>
                      <p className="text-[9px] mt-0.5" style={{color:d.color}}>{d.head}</p>
                      <div className="flex justify-center gap-1 mt-1.5">
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{background:"hsl(216 45% 18%)",color:"hsl(210 40% 70%)"}}>{d.headcount}/{d.required}</span>
                        {gap>0&&<span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{background:`${gapColor(gap)}15`,color:gapColor(gap)}}>-{gap}</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-6 pt-4 flex-wrap" style={{borderTop:"1px solid hsl(var(--border))"}}>
              <p className="text-[10px] font-semibold uppercase" style={{color:"hsl(215 25% 40%)"}}>Legend:</p>
              {[{l:"Fully staffed",c:"hsl(158 64% 55%)"},{l:"Minor gap 1-2",c:"hsl(38 95% 60%)"},{l:"Critical gap 3+",c:"hsl(0 72% 68%)"}].map(l=>(
                <div key={l.l} className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full" style={{background:l.c}}/><span className="text-[10px]" style={{color:"hsl(215 25% 50%)"}}>{l.l}</span></div>
              ))}
              <span className="text-[10px]" style={{color:"hsl(215 25% 40%)"}}>· Click any box for details</span>
            </div>
          </div>

          {/* Critical alerts */}
          {criticalDepts.length>0&&(
            <div className="rounded-xl p-4" style={{background:"hsl(0 72% 51% / 0.06)",border:"1px solid hsl(0 72% 51% / 0.25)"}}>
              <div className="flex items-center gap-2 mb-3"><AlertTriangle className="h-4 w-4" style={{color:"hsl(0 72% 68%)"}}/><p className="text-sm font-semibold" style={{color:"hsl(0 72% 68%)"}}>Critical Staffing Gaps — Immediate Action Required</p></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {criticalDepts.map(d=>(
                  <div key={d.id} className="flex items-center justify-between p-3 rounded-lg" style={{background:"hsl(216 45% 12%)"}}>
                    <div className="flex items-center gap-2"><d.icon className="h-4 w-4" style={{color:d.color}}/><span className="text-xs font-semibold" style={{color:"hsl(210 40% 85%)"}}>{d.name}</span></div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{background:"hsl(0 72% 51% / 0.15)",color:"hsl(0 72% 68%)"}}>Need {d.required-d.headcount} more</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══ DEPARTMENTS ═══ */}
      {activeTab==="departments" && (
        <div className="space-y-3">
          {DEPTS.map(dept=>{
            const isEx=expandedDept===dept.id;
            const gap=dept.required-dept.headcount;
            const gc=gapColor(gap);
            return(
              <div key={dept.id} className="rounded-xl overflow-hidden" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                <button onClick={()=>setExpandedDept(isEx?null:dept.id)}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left" style={{background:isEx?`${dept.color}08`:"transparent"}}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl shrink-0" style={{background:`${dept.color}15`,border:`1px solid ${dept.color}30`}}>
                    <dept.icon className="h-5 w-5" style={{color:dept.color}}/>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm" style={{color:"hsl(210 40% 92%)"}}>{dept.name}</span>
                      <span className="text-[10px]" style={{color:dept.color}}>{dept.nameAr}</span>
                    </div>
                    <p className="text-xs mt-0.5" style={{color:"hsl(215 25% 55%)"}}>Head: {dept.head}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className="text-sm font-bold" style={{color:"hsl(210 40% 88%)"}}>{dept.headcount}<span className="text-[10px] font-normal" style={{color:"hsl(215 25% 50%)"}}> / {dept.required}</span></p>
                      <p className="text-[10px]" style={{color:"hsl(215 25% 50%)"}}>staff</p>
                    </div>
                    {gap>0&&<span className="text-xs font-bold px-2 py-1 rounded-lg" style={{background:`${gc}15`,color:gc}}>−{gap} needed</span>}
                    {isEx?<ChevronDown className="h-4 w-4" style={{color:"hsl(215 25% 45%)"}}/>:<ChevronRight className="h-4 w-4" style={{color:"hsl(215 25% 45%)"}}/>}
                  </div>
                </button>
                {isEx&&(
                  <div className="px-5 pb-5 space-y-4" style={{borderTop:"1px solid hsl(var(--border))"}}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{color:dept.color}}>Sections & Headcount</p>
                        <div className="space-y-2">
                          {dept.sections.map((sec,i)=>{
                            const sg=sec.required-sec.headcount;
                            return(
                              <div key={i} className="rounded-lg p-3" style={{background:"hsl(216 45% 11%)"}}>
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="text-xs font-semibold" style={{color:"hsl(210 40% 85%)"}}>{sec.name}</span>
                                  <span className="text-[10px] font-semibold" style={{color:sg>0?"hsl(38 95% 60%)":"hsl(158 64% 55%)"}}>{sec.headcount}/{sec.required} {sg>0?`(−${sg})`:""}</span>
                                </div>
                                <div className="h-1 rounded-full mb-2" style={{background:"hsl(216 45% 18%)"}}>
                                  <div className="h-1 rounded-full" style={{width:`${Math.min(100,(sec.headcount/sec.required)*100)}%`,background:sg>0?"hsl(38 95% 52%)":"hsl(158 64% 45%)"}}/>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {sec.roles.map((r,j)=><span key={j} className="text-[10px] px-1.5 py-0.5 rounded" style={{background:"hsl(216 45% 16%)",color:"hsl(215 25% 60%)"}}>{r}</span>)}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{color:dept.color}}>Responsibilities</p>
                        <div className="space-y-1.5">
                          {dept.responsibilities.map((r,i)=>(
                            <div key={i} className="flex items-start gap-2 text-xs">
                              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{color:dept.color}}/>
                              <span style={{color:"hsl(210 40% 78%)"}}>{r}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{color:dept.color}}>KPIs</p>
                      <div className="flex flex-wrap gap-2">
                        {dept.kpis.map((kpi,i)=><span key={i} className="text-xs px-3 py-1.5 rounded-lg font-medium" style={{background:`${dept.color}10`,color:dept.color,border:`1px solid ${dept.color}25`}}>{kpi}</span>)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ═══ PROCESSES ═══ */}
      {activeTab==="processes" && (
        <div className="space-y-4">
          <div className="rounded-xl p-5 flex items-center justify-between" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
            <div><h2 className="text-sm font-semibold" style={{color:"hsl(210 40% 92%)"}}>Process & Procedure Map</h2><p className="text-xs mt-0.5" style={{color:"hsl(215 25% 55%)"}}>Core workflows, approval matrix, and interdepartmental procedures</p></div>
            <button onClick={()=>processAI.analyze(prompt(`Design all critical business processes, interdepartmental workflows, approval matrix and communication protocols for all ${DEPTS.length} departments.`))} disabled={processAI.loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50" style={{background:"hsl(38 95% 52%)",color:"hsl(216 58% 6%)"}}>
              {processAI.loading?<RefreshCw className="h-4 w-4 animate-spin"/>:<ClipboardList className="h-4 w-4"/>}
              {processAI.loading?"Designing...":"Generate Process Map"}
            </button>
          </div>

          {/* Static core processes */}
          <div className="space-y-3">
            {[
              {title:"Monthly Financial Close",dept:"Finance",owner:"CFO",freq:"Monthly",color:"hsl(158 64% 55%)",steps:["Collect all invoices & receipts","Reconcile bank statements","Prepare journal entries","Review P&L & balance sheet","CFO approval","Distribute management reports"]},
              {title:"Employee Recruitment",dept:"HR",owner:"HR Director",freq:"Per vacancy",color:"hsl(280 80% 70%)",steps:["Receive approved job requisition","Post job on platforms","Screen applications","Technical interviews","Offer & negotiation","Background check","Onboarding"]},
              {title:"Sales Order Fulfillment",dept:"Sales → Operations",owner:"Sales Manager",freq:"Per order",color:"hsl(38 95% 60%)",steps:["Receive customer PO","Credit check","Inventory confirmation","Warehouse picking & packing","Dispatch & logistics","Delivery confirmation","Invoice & AR"]},
              {title:"Vendor Procurement",dept:"Operations",owner:"Supply Chain",freq:"Per need",color:"hsl(200 80% 65%)",steps:["Purchase requisition","3 vendor quotes","PO approval matrix","PO issuance","Goods receipt","Invoice matching","Payment approval"]},
              {title:"Monthly Ops Review",dept:"All Departments",owner:"COO",freq:"Monthly",color:"hsl(217 91% 70%)",steps:["Collect KPIs from all depts","Prepare dashboard","Ops review meeting","Identify gaps","Assign action items","Follow-up and close loop"]},
              {title:"Customer Complaint Resolution",dept:"Customer Service",owner:"CS Manager",freq:"Per complaint",color:"hsl(158 64% 55%)",steps:["Receive complaint (call/email)","Log in CRM","Assign severity 1-3","Escalate if severity 1","Investigate root cause","Resolve within SLA","Close & survey"]},
              {title:"New Product/Market Launch",dept:"Marketing → Sales → Ops",owner:"CMO",freq:"Per launch",color:"hsl(0 72% 68%)",steps:["Market research & validation","Business case approval","Product/pack preparation","Sales training","Launch campaign","Distribution rollout","Performance review"]},
              {title:"Annual Budget Cycle",dept:"All → Finance",owner:"CFO",freq:"Annual",color:"hsl(38 95% 60%)",steps:["CEO strategic direction","Dept heads prepare budgets","Finance consolidation","Challenge & review","Board approval","Budget communication","Monthly tracking"]},
            ].map((proc,i)=>(
              <div key={i} className="rounded-xl p-5" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                  <div>
                    <h3 className="text-sm font-bold" style={{color:"hsl(210 40% 92%)"}}>{proc.title}</h3>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-[10px] px-2 py-0.5 rounded-full" style={{background:`${proc.color}15`,color:proc.color}}>{proc.dept}</span>
                      <span className="text-[10px]" style={{color:"hsl(215 25% 50%)"}}>Owner: {proc.owner}</span>
                      <span className="text-[10px]" style={{color:"hsl(215 25% 50%)"}}>Frequency: {proc.freq}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-wrap">
                  {proc.steps.map((step,j)=>(
                    <div key={j} className="flex items-center gap-1">
                      <span className="text-[10px] px-2.5 py-1.5 rounded-lg font-medium" style={{background:"hsl(216 45% 12%)",color:"hsl(210 40% 78%)"}}>
                        <span className="font-bold mr-1" style={{color:proc.color}}>{j+1}.</span>{step}
                      </span>
                      {j<proc.steps.length-1&&<ChevronRight className="h-3 w-3 shrink-0" style={{color:"hsl(215 25% 35%)"}}/>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Approval Matrix */}
          <div className="rounded-xl overflow-hidden" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
            <div className="px-5 py-3" style={{background:"hsl(216 45% 12)"}}><h3 className="text-sm font-semibold" style={{color:"hsl(210 40% 92%)"}}>Approval Authority Matrix</h3></div>
            <table className="w-full text-xs">
              <thead><tr style={{background:"hsl(216 45% 10%)"}}>
                {["Decision Type","Amount / Scope","Approver","Max Turnaround"].map(h=><th key={h} className="px-4 py-2.5 text-left font-semibold" style={{color:"hsl(215 25% 45%)"}}>{h}</th>)}
              </tr></thead>
              <tbody>
                {[
                  ["Petty cash expense","Up to $500","Department Head","Same day"],
                  ["Operational purchase","$500 – $5,000","COO","2 business days"],
                  ["Capital expenditure","$5,000 – $50,000","CEO + CFO","5 business days"],
                  ["Strategic investment","> $50,000","Board of Directors","As per board calendar"],
                  ["New hire — staff level","Any","HR + Dept Head","3 days after candidate selected"],
                  ["New hire — manager+","Any","CEO + HR Director","5 days after shortlist"],
                  ["New contract","Up to $20,000","Sales Director + Legal","3 days"],
                  ["New contract","> $20,000","CEO + Legal","7 days"],
                  ["Budget reallocation","Up to 10% of dept budget","CFO","2 business days"],
                  ["Budget reallocation","> 10% of budget","CEO + CFO","Board approval may apply"],
                ].map(([d,a,ap,t],i)=>(
                  <tr key={i} style={{borderTop:"1px solid hsl(var(--border))",background:i%2===0?"transparent":"hsl(216 45% 8% / 0.5)"}}>
                    <td className="px-4 py-2.5 font-medium" style={{color:"hsl(210 40% 85%)"}}>{d}</td>
                    <td className="px-4 py-2.5 font-semibold" style={{color:"hsl(38 95% 60%)"}}>{a}</td>
                    <td className="px-4 py-2.5" style={{color:"hsl(158 64% 55%)"}}>{ap}</td>
                    <td className="px-4 py-2.5" style={{color:"hsl(215 25% 55%)"}}>{t}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {processAI.error&&<ErrorBanner msg={processAI.error}/>}
          {processAI.result&&!processAI.loading&&(
            <div className="rounded-xl p-5" style={{background:"hsl(38 95% 52% / 0.05)",border:"1px solid hsl(38 95% 52% / 0.2)"}}>
              <h3 className="text-sm font-bold mb-4" style={{color:"hsl(38 95% 60%)"}}>AI-Generated Additional Processes</h3>
              {processAI.result.coreProcesses?.map((p:any,i:number)=>(
                <div key={i} className="mb-3 p-4 rounded-lg" style={{background:"hsl(216 45% 11%)"}}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold" style={{color:"hsl(38 95% 60%)"}}>{p.process}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{background:"hsl(216 45% 18%)",color:"hsl(215 25% 55%)"}}>{p.department}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {p.steps?.map((s:string,j:number)=><span key={j} className="text-[10px] px-2 py-0.5 rounded" style={{background:"hsl(216 45% 15%)",color:"hsl(210 40% 72%)"}}>{j+1}. {s}</span>)}
                  </div>
                </div>
              ))}
              {processAI.result.approvalMatrix&&(
                <div className="mt-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{color:"hsl(217 91% 70%)"}}>Additional Approval Rules</p>
                  {processAI.result.approvalMatrix.map((r:any,i:number)=>(
                    <div key={i} className="flex gap-4 text-xs py-1.5 border-b" style={{borderColor:"hsl(var(--border))"}}>
                      <span className="flex-1" style={{color:"hsl(210 40% 80%)"}}>{r.decision}</span>
                      <span style={{color:"hsl(38 95% 60%)"}}>{r.amount}</span>
                      <span style={{color:"hsl(158 64% 55%)"}}>{r.approver}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ═══ HIRING PLAN ═══ */}
      {activeTab==="hiring" && (
        <div className="space-y-4">
          <div className="rounded-xl p-5 flex items-center justify-between" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
            <div><h2 className="text-sm font-semibold" style={{color:"hsl(210 40% 92%)"}}>AI Hiring Plan Generator</h2><p className="text-xs mt-0.5" style={{color:"hsl(215 25% 55%)"}}>Prioritized hiring roadmap based on gaps, company profile and owner vision</p></div>
            <button onClick={()=>hiringAI.analyze(prompt(`Current headcount gaps: ${DEPTS.map(d=>`${d.name}: need ${d.required-d.headcount} more (${d.sections.filter(s=>s.required-s.headcount>0).map(s=>s.name).join(", ")})`).join("; ")}. Total gap: ${totalGap}. Generate comprehensive hiring plan.`))} disabled={hiringAI.loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50" style={{background:"hsl(38 95% 52%)",color:"hsl(216 58% 6%)"}}>
              {hiringAI.loading?<RefreshCw className="h-4 w-4 animate-spin"/>:<UserPlus className="h-4 w-4"/>}
              {hiringAI.loading?"Planning...":"Generate Hiring Plan"}
            </button>
          </div>

          {/* Gap table */}
          <div className="rounded-xl overflow-hidden" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
            <div className="px-5 py-3" style={{background:"hsl(216 45% 12)"}}><h3 className="text-sm font-semibold" style={{color:"hsl(210 40% 92%)"}}>Headcount Gap Analysis</h3></div>
            <table className="w-full text-xs">
              <thead><tr style={{background:"hsl(216 45% 10%)"}}>
                {["Department","Current","Required","Gap","Priority","Sections Needing Staff"].map(h=><th key={h} className="px-4 py-3 text-left font-semibold" style={{color:"hsl(215 25% 45%)"}}>{h}</th>)}
              </tr></thead>
              <tbody>
                {DEPTS.map(dept=>{
                  const gap=dept.required-dept.headcount;
                  const priority=gap>4?"Critical":gap>2?"High":gap>0?"Medium":"Staffed";
                  const pc=priority==="Critical"?"hsl(0 72% 68%)":priority==="High"?"hsl(38 95% 60%)":priority==="Medium"?"hsl(217 91% 70%)":"hsl(158 64% 55%)";
                  const affected=dept.sections.filter(s=>s.required-s.headcount>0).map(s=>s.name);
                  return(
                    <tr key={dept.id} style={{borderTop:"1px solid hsl(var(--border))"}}>
                      <td className="px-4 py-3"><div className="flex items-center gap-2"><dept.icon className="h-3.5 w-3.5" style={{color:dept.color}}/><span className="font-medium" style={{color:"hsl(210 40% 85%)"}}>{dept.name}</span></div></td>
                      <td className="px-4 py-3 font-semibold" style={{color:"hsl(217 91% 70%)"}}>{dept.headcount}</td>
                      <td className="px-4 py-3" style={{color:"hsl(210 40% 75%)"}}>{dept.required}</td>
                      <td className="px-4 py-3 font-bold" style={{color:gap>0?pc:"hsl(158 64% 55%)"}}>{gap>0?`−${gap}`:"✓"}</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{background:`${pc}15`,color:pc}}>{priority}</span></td>
                      <td className="px-4 py-3"><div className="flex flex-wrap gap-1">{affected.slice(0,2).map(s=><span key={s} className="text-[10px] px-1.5 py-0.5 rounded" style={{background:"hsl(216 45% 16%)",color:"hsl(215 25% 60%)"}}>{s}</span>)}{affected.length>2&&<span className="text-[10px]" style={{color:"hsl(215 25% 45%)"}}>+{affected.length-2}</span>}</div></td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot><tr style={{background:"hsl(216 45% 10%)",borderTop:"2px solid hsl(var(--border))"}}>
                <td className="px-4 py-3 font-bold" style={{color:"hsl(210 40% 88%)"}}>TOTAL</td>
                <td className="px-4 py-3 font-bold" style={{color:"hsl(217 91% 70%)"}}>{totalHC}</td>
                <td className="px-4 py-3 font-bold" style={{color:"hsl(210 40% 75%)"}}>{totalReq}</td>
                <td className="px-4 py-3 font-black" style={{color:"hsl(0 72% 68%)"}}>−{totalGap}</td>
                <td colSpan={2}/>
              </tr></tfoot>
            </table>
          </div>

          {hiringAI.error&&<ErrorBanner msg={hiringAI.error}/>}
          {hiringAI.loading&&<div className="rounded-xl p-10 text-center" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}><RefreshCw className="h-8 w-8 animate-spin mx-auto mb-3" style={{color:"hsl(38 95% 52%)"}}/><p className="font-medium" style={{color:"hsl(210 40% 75%)"}}>Building comprehensive hiring plan...</p></div>}
          {hiringAI.result&&!hiringAI.loading&&(
            <div className="space-y-4">
              {hiringAI.result.urgentHires?.length>0&&(
                <div className="rounded-xl p-5" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                  <h3 className="text-sm font-bold mb-4" style={{color:"hsl(0 72% 68%)"}}>🚨 Urgent Hires</h3>
                  <div className="space-y-3">
                    {hiringAI.result.urgentHires.map((h:any,i:number)=>(
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{background:"hsl(216 45% 12%)"}}>
                        <span className="flex h-6 w-6 items-center justify-center rounded text-[10px] font-bold shrink-0" style={{background:"hsl(0 72% 51% / 0.2)",color:"hsl(0 72% 68%)"}}>{i+1}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold" style={{color:"hsl(210 40% 88%)"}}>{h.role}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full" style={{background:"hsl(216 45% 18%)",color:"hsl(215 25% 55%)"}}>{h.department}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{background:"hsl(0 72% 51% / 0.15)",color:"hsl(0 72% 68%)"}}>{h.priority}</span>
                          </div>
                          <p className="text-[11px] mt-1" style={{color:"hsl(215 25% 55%)"}}>{h.reason}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-[10px]" style={{color:"hsl(217 91% 65%)"}}>⏱ {h.timeframe}</span>
                            <span className="text-[10px] font-semibold" style={{color:"hsl(38 95% 60%)"}}>💰 {h.estimatedSalary}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {hiringAI.result.quarterlyPlan&&(
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(["q1","q2","q3","q4"] as const).map((q,i)=>(
                    <div key={q} className="rounded-xl p-4" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                      <p className="text-xs font-bold mb-3" style={{color:"hsl(38 95% 60%)"}}>Q{i+1} Hires</p>
                      <div className="space-y-1.5">
                        {(hiringAI.result.quarterlyPlan[q]||[]).map((role:string,j:number)=>(
                          <div key={j} className="flex items-center gap-1.5 text-[11px]">
                            <Plus className="h-3 w-3 shrink-0" style={{color:"hsl(158 64% 55%)"}}/>
                            <span style={{color:"hsl(210 40% 78%)"}}>{role}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {hiringAI.result.recommendations?.length>0&&(
                <div className="rounded-xl p-5" style={{background:"hsl(158 64% 40% / 0.05)",border:"1px solid hsl(158 64% 40% / 0.2)"}}>
                  <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{color:"hsl(158 64% 55%)"}}>HR Recommendations</h3>
                  {hiringAI.result.recommendations.map((r:string,i:number)=>(
                    <div key={i} className="flex items-start gap-2 text-xs mb-2">
                      <Star className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{color:"hsl(38 95% 60%)"}}/>
                      <span style={{color:"hsl(210 40% 78%)"}}>{r}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {!hiringAI.result&&!hiringAI.loading&&!hiringAI.error&&(
            <div className="rounded-xl p-10 text-center" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
              <UserPlus className="h-12 w-12 mx-auto mb-4 opacity-20" style={{color:"hsl(38 95% 52%)"}}/>
              <p className="font-medium" style={{color:"hsl(215 25% 50%)"}}>Click Generate for AI-powered hiring roadmap</p>
            </div>
          )}
        </div>
      )}

      {/* ═══ SALARIES ═══ */}
      {activeTab==="salaries" && (
        <div className="space-y-4">
          <div className="rounded-xl p-5 flex items-center justify-between" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
            <div><h2 className="text-sm font-semibold" style={{color:"hsl(210 40% 92%)"}}>AI Salary Benchmark Engine</h2><p className="text-xs mt-0.5" style={{color:"hsl(215 25% 55%)"}}>Market-calibrated bands based on country, city, industry, company type and owner vision</p></div>
            <button onClick={()=>salaryAI.analyze(prompt(`Provide comprehensive salary benchmarks for all ${DEPTS.length} departments covering all levels (Junior, Mid, Senior, Manager, Director, C-Suite). Factor in local cost of living, market competitiveness and owner vision.`))} disabled={salaryAI.loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50" style={{background:"hsl(38 95% 52%)",color:"hsl(216 58% 6%)"}}>
              {salaryAI.loading?<RefreshCw className="h-4 w-4 animate-spin"/>:<DollarSign className="h-4 w-4"/>}
              {salaryAI.loading?"Benchmarking...":"Run Salary Analysis"}
            </button>
          </div>

          {salaryAI.error&&<ErrorBanner msg={salaryAI.error}/>}
          {salaryAI.loading&&<div className="rounded-xl p-10 text-center" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}><RefreshCw className="h-8 w-8 animate-spin mx-auto mb-3" style={{color:"hsl(38 95% 52%)"}}/><p className="font-medium" style={{color:"hsl(210 40% 75%)"}}>Analyzing salary benchmarks for {company.country}, {company.city}...</p></div>}
          {salaryAI.result&&!salaryAI.loading&&(
            <div className="space-y-4">
              {salaryAI.result.marketContext&&(
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[{l:"Country",v:salaryAI.result.marketContext.country},{l:"City",v:salaryAI.result.marketContext.city},{l:"Industry Premium",v:salaryAI.result.marketContext.industryPremium},{l:"Cost of Living",v:salaryAI.result.marketContext.costOfLiving}].map((m,i)=>(
                    <div key={i} className="rounded-xl p-4" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                      <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{color:"hsl(215 25% 45%)"}}>{m.l}</p>
                      <p className="text-sm font-bold" style={{color:"hsl(38 95% 60%)"}}>{m.v}</p>
                    </div>
                  ))}
                </div>
              )}
              {salaryAI.result.salaryBands?.length>0&&(
                <div className="rounded-xl overflow-hidden" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                  <div className="px-5 py-3" style={{background:"hsl(216 45% 12)"}}><h3 className="text-sm font-semibold" style={{color:"hsl(210 40% 92%)"}}>Salary Bands — Monthly USD</h3></div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead><tr style={{background:"hsl(216 45% 10%)"}}>
                        {["Department","Role","Level","Min/mo","Mid/mo","Max/mo","Notes"].map(h=><th key={h} className="px-3 py-2.5 text-left font-semibold" style={{color:"hsl(215 25% 45%)"}}>{h}</th>)}
                      </tr></thead>
                      <tbody>
                        {salaryAI.result.salaryBands.map((band:any,i:number)=>{
                          const lc=band.level==="C-Suite"?"hsl(38 95% 60%)":band.level==="Director"?"hsl(217 91% 70%)":band.level==="Manager"?"hsl(158 64% 55%)":"hsl(215 25% 60%)";
                          return(
                            <tr key={i} style={{borderTop:"1px solid hsl(var(--border))",background:i%2===0?"transparent":"hsl(216 45% 8% / 0.5)"}}>
                              <td className="px-3 py-2.5" style={{color:"hsl(215 25% 60%)"}}>{band.department}</td>
                              <td className="px-3 py-2.5 font-medium" style={{color:"hsl(210 40% 85%)"}}>{band.role}</td>
                              <td className="px-3 py-2.5"><span className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{background:`${lc}15`,color:lc}}>{band.level}</span></td>
                              <td className="px-3 py-2.5" style={{color:"hsl(210 40% 75%)"}}>${Number(band.minUSD||0).toLocaleString()}</td>
                              <td className="px-3 py-2.5 font-semibold" style={{color:"hsl(38 95% 60%)"}}>${Number(band.midUSD||0).toLocaleString()}</td>
                              <td className="px-3 py-2.5 font-bold" style={{color:"hsl(158 64% 55%)"}}>${Number(band.maxUSD||0).toLocaleString()}</td>
                              <td className="px-3 py-2.5 text-[11px]" style={{color:"hsl(215 25% 50%)"}}>{band.notes}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {salaryAI.result.benefitsPackage&&(
                <div className="rounded-xl p-5" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
                  <h3 className="text-sm font-bold mb-4" style={{color:"hsl(158 64% 55%)"}}>Recommended Benefits Package</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(salaryAI.result.benefitsPackage).map(([key,val])=>(
                      <div key={key} className="p-3 rounded-lg" style={{background:"hsl(216 45% 12%)"}}>
                        <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{color:"hsl(215 25% 45%)"}}>{key}</p>
                        <p className="text-xs" style={{color:"hsl(210 40% 80%)"}}>{String(val)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {salaryAI.result.totalCompensationStrategy&&(
                <div className="rounded-xl p-5" style={{background:"hsl(38 95% 52% / 0.05)",border:"1px solid hsl(38 95% 52% / 0.2)"}}>
                  <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{color:"hsl(38 95% 60%)"}}>Compensation Strategy</h3>
                  <p className="text-sm" style={{color:"hsl(210 40% 78%)"}}>{salaryAI.result.totalCompensationStrategy}</p>
                </div>
              )}
              {salaryAI.result.recommendations?.length>0&&(
                <div className="rounded-xl p-5" style={{background:"hsl(158 64% 40% / 0.05)",border:"1px solid hsl(158 64% 40% / 0.2)"}}>
                  <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{color:"hsl(158 64% 55%)"}}>Salary Recommendations</h3>
                  {salaryAI.result.recommendations.map((r:string,i:number)=>(
                    <div key={i} className="flex items-start gap-2 text-xs mb-2"><Star className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{color:"hsl(38 95% 60%)"}}/><span style={{color:"hsl(210 40% 78%)"}}>{r}</span></div>
                  ))}
                </div>
              )}
            </div>
          )}
          {!salaryAI.result&&!salaryAI.loading&&!salaryAI.error&&(
            <div className="rounded-xl p-10 text-center" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))"}}>
              <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-20" style={{color:"hsl(38 95% 52%)"}}/>
              <p className="font-medium" style={{color:"hsl(215 25% 50%)"}}>Click "Run Salary Analysis" for market-calibrated benchmarks</p>
              <p className="text-xs mt-1" style={{color:"hsl(215 25% 38%)"}}>Tailored to {company.country}, {company.city} · {company.industry} · {company.type}</p>
            </div>
          )}
        </div>
      )}

      {/* Department Modal */}
      {selectedDept&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:"rgba(0,0,0,0.75)"}}>
          <div className="w-full max-w-2xl rounded-2xl overflow-y-auto max-h-[90vh]" style={{background:"hsl(216 52% 10%)",border:"1px solid hsl(var(--border))"}}>
            <div className="sticky top-0 flex items-center justify-between px-6 py-4" style={{background:"hsl(216 52% 10%)",borderBottom:"1px solid hsl(var(--border))"}}>
              <div className="flex items-center gap-3">
                <selectedDept.icon className="h-5 w-5" style={{color:selectedDept.color}}/>
                <div><h2 className="text-base font-bold" style={{color:"hsl(210 40% 94%)"}}>{selectedDept.name}</h2><p className="text-xs" style={{color:selectedDept.color}}>{selectedDept.nameAr} · Head: {selectedDept.head}</p></div>
              </div>
              <button onClick={()=>setSelectedDept(null)}><X className="h-5 w-5" style={{color:"hsl(215 25% 55%)"}}/></button>
            </div>
            <div className="p-6 space-y-5">
              <div><p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{color:selectedDept.color}}>Sections</p>
                <div className="space-y-2">{selectedDept.sections.map((sec,i)=>{const sg=sec.required-sec.headcount;return(
                  <div key={i} className="p-3 rounded-lg" style={{background:"hsl(216 45% 12%)"}}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold" style={{color:"hsl(210 40% 88%)"}}>{sec.name}</span>
                      <span className="text-[10px]" style={{color:sg>0?"hsl(0 72% 68%)":"hsl(158 64% 55%)"}}>{sec.headcount}/{sec.required}{sg>0?` (need ${sg})`:""}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">{sec.roles.map((r,j)=><span key={j} className="text-[10px] px-2 py-0.5 rounded" style={{background:"hsl(216 45% 16%)",color:"hsl(215 25% 60%)"}}>{r}</span>)}</div>
                  </div>
                );})}</div>
              </div>
              <div><p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{color:selectedDept.color}}>Responsibilities</p>
                <div className="space-y-1">{selectedDept.responsibilities.map((r,i)=>(
                  <div key={i} className="flex items-center gap-2 text-xs"><CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{color:selectedDept.color}}/><span style={{color:"hsl(210 40% 78%)"}}>{r}</span></div>
                ))}</div>
              </div>
              <div><p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{color:selectedDept.color}}>KPIs</p>
                <div className="flex flex-wrap gap-2">{selectedDept.kpis.map((kpi,i)=><span key={i} className="text-xs px-3 py-1.5 rounded-lg font-medium" style={{background:`${selectedDept.color}10`,color:selectedDept.color,border:`1px solid ${selectedDept.color}25`}}>{kpi}</span>)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
