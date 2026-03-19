import { Link } from "react-router-dom";
import {
  TrendingUp, Users, BarChart2, DollarSign, ShieldAlert,
  Handshake, Zap, PackageCheck, FileBarChart2, ArrowRight,
  Globe2, Activity, Bot, FolderOpen, Cpu, CheckCircle2,
  AlertTriangle, FolderKanban, CheckSquare, PieChart, Globe,
  FileText, Building2, Layers, MessageSquare, FileOutput,
  Star, Play, Network, Shield
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

const LAYERS = [
  { label:"Layer A", title:"Consulting Intelligence Engine", desc:"9 AI agents — market entry, feasibility, risk, pricing & more", color:"hsl(217 91% 70%)", bg:"hsl(217 91% 53% / 0.08)", border:"hsl(217 91% 53% / 0.2)", icon:Cpu },
  { label:"Layer B", title:"Business & Revenue Engine",     desc:"CRM, proposals, financial tracking, leads pipeline",        color:"hsl(38 95% 60%)",  bg:"hsl(38 95% 52% / 0.08)",  border:"hsl(38 95% 52% / 0.2)",  icon:DollarSign },
  { label:"Layer C", title:"Execution & Delivery Engine",   desc:"Projects, tasks, milestones, reports & document hub",      color:"hsl(158 64% 55%)", bg:"hsl(158 64% 40% / 0.08)", border:"hsl(158 64% 40% / 0.2)", icon:CheckCircle2 },
];

const SERVICES = [
  { num:"01", title:"Market Entry Analysis",   url:"/market-entry",         icon:TrendingUp,    color:"amber" },
  { num:"02", title:"Distributor Finder",      url:"/distributor-finder",   icon:Users,         color:"green" },
  { num:"03", title:"Competitor Analysis",     url:"/competitor-analysis",  icon:BarChart2,     color:"blue"  },
  { num:"04", title:"Pricing Intelligence",    url:"/pricing-intelligence", icon:DollarSign,    color:"amber" },
  { num:"05", title:"Risk Assessment",         url:"/risk-assessment",      icon:ShieldAlert,   color:"red"   },
  { num:"06", title:"Partner Matchmaking",     url:"/partner-matchmaking",  icon:Handshake,     color:"green" },
  { num:"07", title:"Sales Strategy",          url:"/sales-strategy",       icon:Zap,           color:"blue"  },
  { num:"08", title:"Export Readiness",        url:"/export-readiness",     icon:PackageCheck,  color:"amber" },
  { num:"09", title:"Feasibility Study",       url:"/feasibility-study",    icon:FileBarChart2, color:"green" },
];

const colorMap: Record<string,{bg:string;text:string;border:string}> = {
  amber:{ bg:"hsl(38 95% 52% / 0.08)",  text:"hsl(38 95% 60%)",   border:"hsl(38 95% 52% / 0.25)" },
  green:{ bg:"hsl(158 64% 40% / 0.08)", text:"hsl(158 64% 55%)",  border:"hsl(158 64% 40% / 0.25)"},
  blue: { bg:"hsl(217 91% 53% / 0.08)", text:"hsl(217 91% 70%)",  border:"hsl(217 91% 53% / 0.25)"},
  red:  { bg:"hsl(0 72% 51% / 0.08)",   text:"hsl(0 72% 68%)",    border:"hsl(0 72% 51% / 0.25)"  },
};

const PREMIUM = [
  { title:"Real Estate Intelligence", url:"/real-estate-intelligence", icon:Building2,   color:"hsl(38 95% 60%)",  desc:"Location · Feasibility · Decision Engine", badge:"PREMIUM" },
  { title:"Service Modules",          url:"/service-modules",          icon:Layers,      color:"hsl(217 91% 70%)", desc:"Sales · FMCG · F&B · Telecom · Mfg",      badge:"7 MODULES" },
  { title:"AI Assistant",             url:"/ai-assistant",             icon:MessageSquare,color:"hsl(158 64% 55%)", desc:"CEO Advisor · Strategy · Financial",       badge:"6 AGENTS"  },
  { title:"Report Generator",         url:"/reports",                  icon:FileOutput,  color:"hsl(280 80% 70%)", desc:"Feasibility · Strategy · Market · Sales",  badge:"5 TYPES"   },
  { title:"Company Development",      url:"/company-development",      icon:Network,     color:"hsl(38 95% 60%)",  desc:"Org chart · Depts · Hiring · Salaries",    badge:"NEW"       },
  { title:"ISO Preparation",          url:"/iso-preparation",          icon:Shield,      color:"hsl(158 64% 55%)", desc:"ISO 9001 · 14001 · 45001 · 27001 & more",  badge:"8 STDS"    },
];

const PLATFORM_MODULES = [
  { title:"Projects",           url:"/projects",           icon:FolderKanban, color:"hsl(38 95% 60%)",  desc:"Case management" },
  { title:"Market Intelligence",url:"/market-intelligence",icon:Globe,        color:"hsl(217 91% 70%)", desc:"Sizing & trends"  },
  { title:"AI Agents",          url:"/agents",             icon:Bot,          color:"hsl(158 64% 55%)", desc:"9 AI agents"      },
  { title:"CRM",                url:"/crm",                icon:Users,        color:"hsl(38 95% 60%)",  desc:"Relationships"    },
  { title:"Proposals",          url:"/proposals",          icon:FileText,     color:"hsl(217 91% 70%)", desc:"Auto-generate"    },
  { title:"Financial",          url:"/financial",          icon:PieChart,     color:"hsl(158 64% 55%)", desc:"Revenue tracking" },
  { title:"Tasks",              url:"/tasks",              icon:CheckSquare,  color:"hsl(38 95% 60%)",  desc:"Track delivery"   },
  { title:"Documents",          url:"/documents",          icon:FolderOpen,   color:"hsl(217 91% 70%)", desc:"Client docs"      },
];

const STATS = [
  { label:"Advisory Services", value:"9",    icon:Activity, color:"hsl(38 95% 60%)",  sub:"AI-powered agents"  },
  { label:"Platform Modules",  value:"15+",  icon:Layers,   color:"hsl(158 64% 55%)", sub:"Full coverage"      },
  { label:"Markets Covered",   value:"50+",  icon:Globe2,   color:"hsl(217 91% 70%)", sub:"MENA & global"      },
  { label:"Analysis Time",     value:"<30s", icon:Cpu,      color:"hsl(38 95% 60%)",  sub:"Per service"        },
];

const ACTIVITY = [
  { icon:CheckCircle2, color:"hsl(158 64% 55%)", text:"Jordan FMCG Entry report delivered",        time:"2h ago"  },
  { icon:Building2,    color:"hsl(38 95% 60%)",  text:"Real Estate: Baghdad Tower — GO decision",  time:"4h ago"  },
  { icon:DollarSign,   color:"hsl(38 95% 60%)",  text:"New deal: Baghdad Mixed-Use Tower ($4.2M)", time:"5h ago"  },
  { icon:Bot,          color:"hsl(217 91% 70%)", text:"AI Assistant: 12 consultations today",      time:"7h ago"  },
  { icon:AlertTriangle,color:"hsl(0 72% 68%)",   text:"Mosul manufacturing project on hold",       time:"1d ago"  },
];

export default function Dashboard() {
  const { t, lang } = useI18n();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">

      {/* Hero */}
      <div className="rounded-2xl p-8 relative overflow-hidden"
        style={{ background:"linear-gradient(135deg, hsl(216 52% 10%), hsl(216 52% 13%))", border:"1px solid hsl(38 95% 52% / 0.2)" }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage:"radial-gradient(circle at 80% 20%, hsl(38 95% 52%), transparent 60%)" }} />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Globe2 className="h-5 w-5" style={{ color:"hsl(38 95% 52%)" }} />
            <span className="data-pill-amber">{lang === "ar" ? "منصة استشارات مدعومة بالذكاء الاصطناعي" : "AI-Powered Consultancy Platform"}</span>
          </div>
          <h1 className="text-3xl font-bold font-display mb-2" style={{ color:"hsl(210 40% 94%)" }}>{t.dash_title}</h1>
          <p className="text-base max-w-2xl" style={{ color:"hsl(215 25% 60%)" }}>{t.dash_subtitle}</p>
          <div className="flex items-center gap-3 mt-5 flex-wrap">
            <Link to="/projects"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
              style={{ background:"hsl(38 95% 52%)", color:"hsl(216 58% 6%)" }}>
              <FolderKanban className="h-4 w-4" />
              {lang === "ar" ? "عرض المشاريع" : "View Projects"}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/real-estate-intelligence"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold"
              style={{ background:"hsl(216 45% 18%)", color:"hsl(210 40% 85%)", border:"1px solid hsl(var(--border))" }}>
              <Building2 className="h-4 w-4" />
              {lang === "ar" ? "استخبارات العقارات" : "Real Estate Intel"}
            </Link>
            <Link to="/ai-assistant"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold"
              style={{ background:"hsl(216 45% 18%)", color:"hsl(210 40% 85%)", border:"1px solid hsl(var(--border))" }}>
              <MessageSquare className="h-4 w-4" />
              {lang === "ar" ? "المساعد الذكي" : "AI Assistant"}
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map((s,i) => (
          <div key={i} className="rounded-xl p-4" style={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))" }}>
            <div className="flex items-center gap-2 mb-2">
              <s.icon className="h-4 w-4" style={{ color:s.color }} />
              <span className="text-xs" style={{ color:"hsl(215 25% 55%)" }}>{s.label}</span>
            </div>
            <p className="text-2xl font-bold" style={{ color:s.color }}>{s.value}</p>
            <p className="text-[11px] mt-0.5" style={{ color:"hsl(215 25% 45%)" }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* 3 Layers */}
      <div>
        <h2 className="text-base font-semibold mb-4" style={{ color:"hsl(210 40% 88%)" }}>
          {lang === "ar" ? "هيكل النظام الثلاثي" : "Three-Layer System Architecture"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {LAYERS.map((layer,i) => (
            <div key={i} className="rounded-xl p-5" style={{ background:layer.bg, border:`1px solid ${layer.border}` }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background:`${layer.color}22` }}>
                  <layer.icon className="h-5 w-5" style={{ color:layer.color }} />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background:`${layer.color}22`, color:layer.color }}>{layer.label}</span>
              </div>
              <h3 className="text-sm font-semibold mb-1" style={{ color:"hsl(210 40% 92%)" }}>{layer.title}</h3>
              <p className="text-xs" style={{ color:"hsl(215 25% 55%)" }}>{layer.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Premium Modules */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold" style={{ color:"hsl(210 40% 88%)" }}>
            {lang === "ar" ? "الوحدات المتقدمة" : "Premium Modules"}
          </h2>
          <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
            style={{ background:"hsl(38 95% 52% / 0.12)", color:"hsl(38 95% 60%)" }}>
            {lang === "ar" ? "ميزة تنافسية" : "Strongest Differentiators"}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {PREMIUM.map((m,i) => (
            <Link key={i} to={m.url}
              className="group rounded-xl p-5 transition-all hover:scale-[1.02] block"
              style={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))" }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background:`${m.color}18`, border:`1px solid ${m.color}30` }}>
                  <m.icon className="h-5 w-5" style={{ color:m.color }} />
                </div>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background:`${m.color}15`, color:m.color }}>{m.badge}</span>
              </div>
              <h3 className="text-sm font-semibold mb-1" style={{ color:"hsl(210 40% 92%)" }}>{m.title}</h3>
              <p className="text-[11px]" style={{ color:"hsl(215 25% 50%)" }}>{m.desc}</p>
              <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[11px] font-semibold" style={{ color:m.color }}>
                  {lang === "ar" ? "فتح" : "Open"}
                </span>
                <ArrowRight className="h-3 w-3" style={{ color:m.color }} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Advisory Services Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold" style={{ color:"hsl(210 40% 88%)" }}>{t.dash_services}</h2>
          <span className="text-xs" style={{ color:"hsl(215 25% 45%)" }}>
            {lang === "ar" ? "٩ وكلاء مدعومون بالذكاء الاصطناعي" : "9 AI-powered agents"}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {SERVICES.map((s,i) => {
            const c = colorMap[s.color];
            return (
              <Link key={i} to={s.url}
                className="group rounded-xl p-4 transition-all hover:scale-[1.01] block"
                style={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))" }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background:c.bg, border:`1px solid ${c.border}` }}>
                      <s.icon className="h-4 w-4" style={{ color:c.text }} />
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                      style={{ background:"hsl(216 45% 18%)", color:"hsl(215 25% 55%)" }}>{s.num}</span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color:c.text }} />
                </div>
                <h3 className="text-sm font-semibold" style={{ color:"hsl(210 40% 90%)" }}>{s.title}</h3>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Platform Modules */}
        <div className="lg:col-span-2">
          <h2 className="text-base font-semibold mb-4" style={{ color:"hsl(210 40% 88%)" }}>
            {lang === "ar" ? "وحدات المنصة" : "Platform Modules"}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {PLATFORM_MODULES.map((m,i) => (
              <Link key={i} to={m.url}
                className="group rounded-xl p-4 text-center transition-all hover:scale-[1.02] block"
                style={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))" }}>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl mx-auto mb-2"
                  style={{ background:`${m.color}18`, border:`1px solid ${m.color}30` }}>
                  <m.icon className="h-5 w-5" style={{ color:m.color }} />
                </div>
                <p className="text-xs font-semibold" style={{ color:"hsl(210 40% 85%)" }}>{m.title}</p>
                <p className="text-[10px] mt-0.5" style={{ color:"hsl(215 25% 45%)" }}>{m.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-base font-semibold mb-4" style={{ color:"hsl(210 40% 88%)" }}>
            {lang === "ar" ? "النشاط الأخير" : "Recent Activity"}
          </h2>
          <div className="rounded-xl overflow-hidden" style={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))" }}>
            {ACTIVITY.map((a,i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3"
                style={{ borderTop:i>0?"1px solid hsl(var(--border))":"none" }}>
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                  style={{ background:`${a.color}18` }}>
                  <a.icon className="h-3 w-3" style={{ color:a.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs leading-snug" style={{ color:"hsl(210 40% 78%)" }}>{a.text}</p>
                  <p className="text-[10px] mt-0.5" style={{ color:"hsl(215 25% 40%)" }}>{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl p-5" style={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))" }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color:"hsl(210 40% 88%)" }}>
          {lang === "ar" ? "إجراءات سريعة" : "Quick Actions"}
        </h2>
        <div className="flex flex-wrap gap-3">
          {[
            { label:lang==="ar"?"مشروع جديد":"New Project",          url:"/projects",                 icon:FolderKanban,  primary:true  },
            { label:lang==="ar"?"تحليل عقاري":"Real Estate Analysis", url:"/real-estate-intelligence", icon:Building2,     primary:false },
            { label:lang==="ar"?"إنشاء مقترح":"Generate Proposal",    url:"/proposals",                icon:FileText,      primary:false },
            { label:lang==="ar"?"تحليل سوق":"Market Analysis",        url:"/market-entry",             icon:TrendingUp,    primary:false },
            { label:lang==="ar"?"إنشاء تقرير":"Generate Report",       url:"/reports",                  icon:FileOutput,    primary:false },
            { label:lang==="ar"?"المساعد الذكي":"AI Assistant",        url:"/ai-assistant",             icon:MessageSquare, primary:false },
          ].map((a,i) => (
            <Link key={i} to={a.url}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
              style={a.primary
                ? { background:"hsl(38 95% 52%)", color:"hsl(216 58% 6%)" }
                : { background:"hsl(216 45% 18%)", color:"hsl(210 40% 80%)", border:"1px solid hsl(var(--border))" }}>
              <a.icon className="h-4 w-4" />{a.label}
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
