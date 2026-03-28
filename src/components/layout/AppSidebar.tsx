/**
 * AppSidebar.tsx  v3
 * Full navigation: Workspace · Workflow · Domains · Practice Ops · Intelligence · Specialist · System
 */
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, Briefcase, BarChart2, Lightbulb,
  FileOutput, Globe2, Settings, Languages, ChevronRight,
  ChevronDown, Building2, ShoppingCart, Coffee, Radio,
  Truck, TrendingUp, Megaphone, Network, Bot,
  MessageSquare, FolderKanban, CheckSquare, PieChart, UserCheck,
  FolderOpen, Factory, FileText, FileOutput,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useState } from "react";

const DOMAIN_ITEMS = [
  { title: "Real Estate",     url: "/domain/real-estate",   icon: Building2   },
  { title: "FMCG",            url: "/domain/fmcg",          icon: ShoppingCart },
  { title: "Food & Beverage", url: "/domain/fnb",           icon: Coffee      },
  { title: "Telecom",         url: "/domain/telecom",       icon: Radio       },
  { title: "Distribution",    url: "/domain/distribution",  icon: Truck       },
  { title: "Sales",           url: "/domain/sales",         icon: TrendingUp  },
  { title: "Marketing",       url: "/domain/marketing",     icon: Megaphone   },
  { title: "Business Dev",    url: "/domain/bizdev",        icon: Network     },
  { title: "Manufacturing",   url: "/domain/manufacturing", icon: Factory     },
];

const PRACTICE_OPS_ITEMS = [
  { title: "CRM",          url: "/crm",       icon: UserCheck    },
  { title: "Projects",     url: "/projects",  icon: FolderKanban },
  { title: "Tasks",        url: "/tasks",     icon: CheckSquare  },
  { title: "Financial",    url: "/financial", icon: PieChart     },
  { title: "Document Hub", url: "/documents", icon: FolderOpen   },
];

export function AppSidebar() {
  const location = useLocation();
  const { lang, setLang } = useI18n();
  const [domainsOpen,  setDomainsOpen]  = useState(false);
  const [practiceOpen, setPracticeOpen] = useState(false);
  const [specialOpen,  setSpecialOpen]  = useState(false);

  const active = (url: string) =>
    url === "/" ? location.pathname === "/" : location.pathname.startsWith(url);

  const navItem = (title: string, titleAr: string, url: string, Icon: React.ElementType) => {
    const isActive = active(url);
    return (
      <Link key={url} to={url}
        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all"
        style={{
          background: isActive ? "hsl(38 95% 52% / 0.13)" : "transparent",
          color: isActive ? "hsl(38 95% 60%)" : "hsl(210 40% 68%)",
        }}>
        <Icon className="h-4 w-4 shrink-0" />
        <span className="flex-1">{lang === "ar" ? titleAr : title}</span>
        {isActive && <ChevronRight className="h-3 w-3 opacity-60" style={{ color: "hsl(38 95% 52%)" }} />}
      </Link>
    );
  };

  const subItem = (title: string, url: string, Icon: React.ElementType) => {
    const isActive = active(url);
    return (
      <Link key={url} to={url}
        className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition-all"
        style={{
          background: isActive ? "hsl(38 95% 52% / 0.13)" : "transparent",
          color: isActive ? "hsl(38 95% 60%)" : "hsl(210 40% 60%)",
        }}>
        <Icon className="h-3.5 w-3.5 shrink-0" />
        <span>{title}</span>
      </Link>
    );
  };

  const sectionHeader = (label: string, labelAr: string) => (
    <p className="px-2 mb-1.5 text-[9px] font-semibold tracking-[0.12em] uppercase" style={{ color: "hsl(215 25% 38%)" }}>
      {lang === "ar" ? labelAr : label}
    </p>
  );

  const collapsibleSection = (
    label: string, labelAr: string,
    open: boolean, setOpen: (v: boolean) => void,
    children: React.ReactNode,
  ) => (
    <div>
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full px-2 mb-1.5">
        <p className="text-[9px] font-semibold tracking-[0.12em] uppercase" style={{ color: "hsl(215 25% 38%)" }}>
          {lang === "ar" ? labelAr : label}
        </p>
        <ChevronDown className="h-3 w-3 transition-transform"
          style={{ color: "hsl(215 25% 38%)", transform: open ? "rotate(0deg)" : "rotate(-90deg)" }} />
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

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-4 space-y-5">

        {/* WORKSPACE */}
        <div>
          {sectionHeader("WORKSPACE", "مساحة العمل")}
          <div className="space-y-0.5">
            {navItem("Dashboard", "لوحة التحكم", "/", LayoutDashboard)}
          </div>
        </div>

        {/* WORKFLOW */}
        <div>
          {sectionHeader("WORKFLOW", "مسار العمل")}
          <div className="space-y-0.5">
            {navItem("CRM", "إدارة العملاء", "/crm", Users)}
            {navItem("Engagement", "المشاريع", "/engagement", Briefcase)}
            {navItem("Analysis", "التحليل", "/analysis", BarChart2)}
            {navItem("Strategy", "الاستراتيجية", "/strategy", Lightbulb)}
            {navItem("Deliverables", "المخرجات", "/deliverables", FileOutput)}
          </div>
        </div>

        {/* DOMAINS */}
        {collapsibleSection("DOMAINS", "القطاعات", domainsOpen, setDomainsOpen,
          DOMAIN_ITEMS.map(({ title, url, icon: Icon }) => subItem(title, url, Icon))
        )}

        {/* PRACTICE OPS */}
        {collapsibleSection("PRACTICE OPS", "العمليات", practiceOpen, setPracticeOpen,
          <>
            {PRACTICE_OPS_ITEMS.map(({ title, url, icon: Icon }) => subItem(title, url, Icon))}
            {subItem("Proposal Builder", "/proposal-builder", FileText)}
            {subItem("Report Generator", "/report-generator", FileOutput)}
          </>
        )}

        {/* INTELLIGENCE */}
        <div>
          {sectionHeader("INTELLIGENCE", "الذكاء الاصطناعي")}
          <div className="space-y-0.5">
            {navItem("AI Assistant", "المساعد الذكي", "/ai-assistant", MessageSquare)}
            {navItem("AI Agents", "الوكلاء الذكيون", "/agents", Bot)}
          </div>
        </div>

        {/* SPECIALIST */}
        {collapsibleSection("SPECIALIST", "الوحدات المتخصصة", specialOpen, setSpecialOpen, <>
          {subItem("Company Dev", "/company-development", Building2)}
          {subItem("ISO Preparation", "/iso-preparation", Settings)}
          {subItem("Real Estate Intel", "/real-estate-intelligence", Building2)}
          {subItem("Service Modules", "/service-modules", Network)}
        </>)}

        {/* SYSTEM */}
        <div>
          {sectionHeader("SYSTEM", "النظام")}
          <div className="space-y-0.5">
            {navItem("Settings", "الإعدادات", "/settings", Settings)}
          </div>
        </div>
      </nav>

      {/* Language */}
      <div className="px-3 py-3 border-t space-y-2" style={{ borderColor: "hsl(var(--sidebar-border))" }}>
        <div className="flex items-center gap-1.5 mb-1">
          <Languages className="h-3 w-3" style={{ color: "hsl(215 25% 42%)" }} />
          <span className="text-[10px]" style={{ color: "hsl(215 25% 42%)" }}>{lang === "ar" ? "اللغة" : "Language"}</span>
        </div>
        <div className="grid grid-cols-2 gap-1">
          {(["en", "ar"] as const).map((l) => (
            <button key={l} onClick={() => setLang(l)}
              className="py-1.5 rounded-md text-[11px] font-semibold transition-all"
              style={{
                background: lang === l ? "hsl(38 95% 52%)" : "hsl(216 45% 16%)",
                color: lang === l ? "hsl(216 58% 6%)" : "hsl(215 25% 55%)",
              }}>
              {l === "en" ? "English" : "العربية"}
            </button>
          ))}
        </div>
        <p className="text-[9px] text-center" style={{ color: "hsl(215 25% 30%)" }}>ConsultAI © 2026</p>
      </div>
    </aside>
  );
}
