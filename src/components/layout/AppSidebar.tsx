/**
 * AppSidebar.tsx v4 — Redesigned with clear workflow grouping
 */
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, Briefcase, BarChart2, Lightbulb,
  FileOutput, Globe2, Settings, ChevronRight,
  ChevronDown, Building2, ShoppingCart, Coffee, Radio,
  Truck, TrendingUp, Megaphone, Network, Bot,
  MessageSquare, FolderKanban, CheckSquare, PieChart, UserCheck,
  FolderOpen, FileText, Database, DollarSign, Layers,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useState } from "react";
import { useEngagementStore, PHASES } from "@/store/engagementStore";

const PHASE_COLORS: Record<string, string> = {
  Discovery:"hsl(38 95% 52%)", "Data Collection":"hsl(200 80% 55%)",
  Analysis:"hsl(270 70% 60%)", Strategy:"hsl(145 65% 45%)",
  Deliverables:"hsl(30 90% 55%)", Review:"hsl(217 91% 68%)", Closed:"hsl(215 25% 45%)",
};

const DOMAIN_ITEMS = [
  { title:"Real Estate",   url:"/domain/real-estate",   icon:Building2   },
  { title:"FMCG",          url:"/domain/fmcg",          icon:ShoppingCart },
  { title:"F&B",           url:"/domain/fnb",           icon:Coffee      },
  { title:"Telecom",       url:"/domain/telecom",       icon:Radio       },
  { title:"Distribution",  url:"/domain/distribution",  icon:Truck       },
  { title:"Sales",         url:"/domain/sales",         icon:TrendingUp  },
  { title:"Marketing",     url:"/domain/marketing",     icon:Megaphone   },
  { title:"Business Dev",  url:"/domain/bizdev",        icon:Network     },
  
];

export function AppSidebar() {
  const location = useLocation();
  const { lang, setLang } = useI18n();
  const [domainsOpen,  setDomainsOpen]  = useState(false);
  const [opsOpen,      setOpsOpen]      = useState(false);
  const [specialOpen,  setSpecialOpen]  = useState(false);

  const { getActiveEngagement } = useEngagementStore();
  const eng = getActiveEngagement();

  const active = (url: string) =>
    url === "/" ? location.pathname === "/" : location.pathname.startsWith(url);

  const navItem = (title: string, url: string, Icon: React.ElementType, accent?: string) => {
    const isActive = active(url);
    const color = accent || "hsl(38 95% 52%)";
    return (
      <Link key={url+title} to={url}
        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all"
        style={{ background: isActive ? `${color}15` : "transparent", color: isActive ? color : "hsl(210 40% 68%)" }}>
        <Icon className="h-4 w-4 shrink-0" style={{ color: isActive ? color : undefined }} />
        <span className="flex-1">{title}</span>
        {isActive && <ChevronRight className="h-3 w-3 opacity-60" style={{ color }} />}
      </Link>
    );
  };

  const subItem = (title: string, url: string, Icon: React.ElementType) => {
    const isActive = active(url);
    return (
      <Link key={url+title} to={url}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition-all"
        style={{ background: isActive ? "hsl(38 95% 52%/0.13)" : "transparent", color: isActive ? "hsl(38 95% 60%)" : "hsl(210 40% 60%)" }}>
        <Icon className="h-3.5 w-3.5 shrink-0" />{title}
      </Link>
    );
  };

  const sectionLabel = (label: string, labelAr: string) => (
    <p className="px-2 mb-1 text-[9px] font-bold tracking-[0.14em] uppercase" style={{ color: "hsl(215 25% 35%)" }}>
      {lang === "ar" ? labelAr : label}
    </p>
  );

  const collapsible = (label: string, labelAr: string, open: boolean, setOpen: (v: boolean) => void, children: React.ReactNode) => (
    <div>
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full px-2 mb-1">
        <p className="text-[9px] font-bold tracking-[0.14em] uppercase" style={{ color: "hsl(215 25% 35%)" }}>
          {lang === "ar" ? labelAr : label}
        </p>
        <ChevronDown className="h-3 w-3" style={{ color: "hsl(215 25% 35%)", transform: open ? "none" : "rotate(-90deg)", transition: "transform 0.2s" }} />
      </button>
      {open && <div className="space-y-0.5">{children}</div>}
    </div>
  );

  return (
    <aside className="flex h-screen w-56 flex-col border-r shrink-0"
      style={{ borderColor: "hsl(var(--sidebar-border))", background: "hsl(var(--sidebar-background))" }}>

      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b" style={{ borderColor: "hsl(var(--sidebar-border))" }}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: "hsl(38 95% 52%)" }}>
          <Globe2 className="h-4 w-4" style={{ color: "hsl(216 58% 6%)" }} />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-bold" style={{ color: "hsl(210 40% 92%)" }}>ConsultAI</span>
          <span className="text-[10px]" style={{ color: "hsl(38 95% 52%)" }}>Engagement OS</span>
        </div>
      </div>

      {/* Active Engagement Indicator */}
      {eng && (
        <Link to="/workflow" className="mx-2.5 mt-2.5 px-3 py-2 rounded-lg flex items-center gap-2"
          style={{ background: "hsl(38 95% 52%/0.08)", border: "1px solid hsl(38 95% 52%/0.2)" }}>
          <div className="h-2 w-2 rounded-full shrink-0 animate-pulse" style={{ background: PHASE_COLORS[eng.phase] || "hsl(38 95% 52%)" }} />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold truncate" style={{ color: "hsl(38 95% 65%)" }}>{eng.companyName}</p>
            <p className="text-[9px]" style={{ color: "hsl(215 25% 48%)" }}>{eng.phase}</p>
          </div>
        </Link>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4">

        {/* WORKSPACE */}
        <div className="space-y-0.5">
          {sectionLabel("WORKSPACE", "مساحة العمل")}
          {navItem("Dashboard", "/", LayoutDashboard)}
          {navItem("Workflow Guide", "/workflow", Layers, "hsl(200 80% 55%)")}
        </div>

        {/* ENGAGEMENT FLOW */}
        <div className="space-y-0.5">
          {sectionLabel("ENGAGEMENT FLOW", "مسار العمل")}
          {navItem("CRM",           "/crm",             Users,     "hsl(38 95% 52%)")}
          {navItem("Engagement",    "/engagement",      Briefcase, "hsl(200 80% 55%)")}
          {navItem("Data Collection","/data-collection",Database,  "hsl(270 70% 65%)")}
          {navItem("Analysis",      "/analysis",        BarChart2, "hsl(145 65% 48%)")}
          {navItem("Strategy",      "/strategy",        Lightbulb, "hsl(30 90% 55%)")}
          {navItem("Deliverables",  "/deliverables",    FileOutput,"hsl(217 91% 68%)")}
        </div>

        {/* SERVICES */}
        <div className="space-y-0.5">
          {sectionLabel("SERVICES", "الخدمات")}
          {navItem("Service Catalog",      "/service-modules",      Network,   "hsl(38 95% 52%)")}
          {navItem("Performance Improvement","/workflow",          TrendingUp, "hsl(145 65% 48%)")}
          {navItem("Strategic Management", "/workflow",            Layers,    "hsl(217 91% 68%)")}
          {navItem("Real Estate Consulting","/real-estate-intelligence",Building2,"hsl(30 90% 55%)")}
          {navItem("Proposal Builder",     "/proposal-builder",    FileText,  "hsl(38 95% 52%)")}
          {navItem("Report Generator",     "/report-generator",    FileOutput,"hsl(200 80% 55%)")}
        </div>

        {/* DOMAINS */}
        {collapsible("DOMAINS","القطاعات", domainsOpen, setDomainsOpen,
          DOMAIN_ITEMS.map(({ title, url, icon: Icon }) => subItem(title, url, Icon))
        )}

        {/* PRACTICE OPS */}
        {collapsible("PRACTICE OPS","العمليات", opsOpen, setOpsOpen, <>
          {subItem("CRM",          "/crm",       UserCheck)}
          {subItem("Projects",     "/projects",  FolderKanban)}
          {subItem("Tasks",        "/tasks",     CheckSquare)}
          {subItem("Financial",    "/financial", PieChart)}
          {subItem("Document Hub", "/documents", FolderOpen)}
        </>)}

        {/* INTELLIGENCE */}
        <div className="space-y-0.5">
          {sectionLabel("INTELLIGENCE","الذكاء الاصطناعي")}
          {navItem("AI Assistant","/ai-assistant",MessageSquare,"hsl(200 80% 55%)")}
          {navItem("AI Agents",   "/agents",      Bot,          "hsl(270 70% 65%)")}
        </div>

        {/* SPECIALIST */}
        {collapsible("SPECIALIST","الوحدات المتخصصة", specialOpen, setSpecialOpen, <>
          {subItem("Company Dev",     "/company-development",      Building2)}
          {subItem("ISO Preparation", "/iso-preparation",          Settings)}
          {subItem("Real Estate Intel","/real-estate-intelligence", Building2)}
          {subItem("Service Modules", "/service-modules",          Network)}
        </>)}

        {/* SYSTEM */}
        <div className="space-y-0.5">
          {sectionLabel("SYSTEM","النظام")}
          {navItem("Settings","/settings",Settings)}
        </div>
      </nav>

      {/* Language */}
      <div className="px-3 py-3 border-t space-y-2" style={{ borderColor: "hsl(var(--sidebar-border))" }}>
        <div className="grid grid-cols-2 gap-1">
          {(["en","ar"] as const).map(l => (
            <button key={l} onClick={() => setLang(l)}
              className="py-1.5 rounded-md text-[11px] font-semibold transition-all"
              style={{ background: lang===l?"hsl(38 95% 52%)":"hsl(216 45% 16%)", color: lang===l?"hsl(216 58% 6%)":"hsl(215 25% 55%)" }}>
              {l==="en"?"English":"العربية"}
            </button>
          ))}
        </div>
        <p className="text-[9px] text-center" style={{ color: "hsl(215 25% 30%)" }}>ConsultAI © 2026</p>
      </div>
    </aside>
  );
}
