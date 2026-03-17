import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, TrendingUp, Users, BarChart2, DollarSign,
  ShieldAlert, Handshake, Zap, PackageCheck, FileBarChart2,
  ChevronRight, Globe2, Bot, FolderOpen, Settings, Languages,
  UserCheck, FolderKanban, CheckSquare, PieChart, Globe, FileText,
  ChevronDown
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useState } from "react";

export function AppSidebar() {
  const location = useLocation();
  const { t, lang, setLang } = useI18n();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const isActive = (url: string) =>
    url === "/" ? location.pathname === "/" : location.pathname.startsWith(url);

  const toggleGroup = (key: string) =>
    setCollapsed(prev => ({ ...prev, [key]: !prev[key] }));

  const groups = [
    {
      key: "overview", label: "OVERVIEW", collapsible: false,
      items: [
        { title: "Dashboard",           url: "/",                    icon: LayoutDashboard },
        { title: "Projects",            url: "/projects",            icon: FolderKanban    },
      ],
    },
    {
      key: "services", label: "ADVISORY SERVICES", collapsible: true,
      items: [
        { title: t.nav_market_entry,    url: "/market-entry",         icon: TrendingUp,    badge: "01" },
        { title: t.nav_distributor,     url: "/distributor-finder",   icon: Users,         badge: "02" },
        { title: t.nav_competitor,      url: "/competitor-analysis",  icon: BarChart2,     badge: "03" },
        { title: t.nav_pricing,         url: "/pricing-intelligence", icon: DollarSign,    badge: "04" },
        { title: t.nav_risk,            url: "/risk-assessment",      icon: ShieldAlert,   badge: "05" },
        { title: t.nav_partner,         url: "/partner-matchmaking",  icon: Handshake,     badge: "06" },
        { title: t.nav_sales,           url: "/sales-strategy",       icon: Zap,           badge: "07" },
        { title: t.nav_export,          url: "/export-readiness",     icon: PackageCheck,  badge: "08" },
        { title: t.nav_feasibility,     url: "/feasibility-study",    icon: FileBarChart2, badge: "09" },
      ],
    },
    {
      key: "intelligence", label: "INTELLIGENCE", collapsible: true,
      items: [
        { title: "Market Intelligence", url: "/market-intelligence",  icon: Globe          },
        { title: "AI Agents",           url: "/agents",               icon: Bot            },
      ],
    },
    {
      key: "business", label: "REVENUE ENGINE", collapsible: true,
      items: [
        { title: "CRM",                 url: "/crm",                  icon: UserCheck      },
        { title: "Proposal Builder",    url: "/proposals",            icon: FileText       },
        { title: "Financial Overview",  url: "/financial",            icon: PieChart       },
      ],
    },
    {
      key: "execution", label: "EXECUTION", collapsible: true,
      items: [
        { title: "Tasks & Execution",   url: "/tasks",                icon: CheckSquare    },
        { title: "Document Hub",        url: "/documents",            icon: FolderOpen     },
      ],
    },
    {
      key: "system", label: "SYSTEM", collapsible: false,
      items: [
        { title: t.nav_settings,        url: "/settings",             icon: Settings       },
      ],
    },
  ];

  return (
    <aside
      className="flex h-screen w-64 flex-col border-r shrink-0"
      style={{ borderColor: "hsl(var(--sidebar-border))", background: "hsl(var(--sidebar-background))" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b" style={{ borderColor: "hsl(var(--sidebar-border))" }}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ background: "hsl(38 95% 52%)" }}>
          <Globe2 className="h-5 w-5" style={{ color: "hsl(216 58% 6%)" }} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold font-display" style={{ color: "hsl(210 40% 92%)" }}>ConsultAI</span>
          <span className="text-xs" style={{ color: "hsl(38 95% 52%)" }}>Intelligence Platform</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        {groups.map(group => {
          const isCollapsed = group.collapsible && collapsed[group.key];
          const hasActive = group.items.some(i => isActive(i.url));

          return (
            <div key={group.key}>
              <div
                className={`flex items-center justify-between px-2 mb-1.5 ${group.collapsible ? "cursor-pointer" : ""}`}
                onClick={() => group.collapsible && toggleGroup(group.key)}
              >
                <p className="text-[10px] font-semibold tracking-widest uppercase"
                  style={{ color: hasActive && isCollapsed ? "hsl(38 95% 52%)" : "hsl(215 25% 40%)" }}>
                  {group.label}
                  {hasActive && isCollapsed && (
                    <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full" style={{ background: "hsl(38 95% 52%)", verticalAlign: "middle" }} />
                  )}
                </p>
                {group.collapsible && (
                  <ChevronDown
                    className="h-3 w-3 transition-transform"
                    style={{
                      color: "hsl(215 25% 38%)",
                      transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)"
                    }}
                  />
                )}
              </div>

              {!isCollapsed && (
                <div className="space-y-0.5">
                  {group.items.map(item => {
                    const active = isActive(item.url);
                    return (
                      <Link
                        key={item.url}
                        to={item.url}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all"
                        style={{
                          background: active ? "hsl(38 95% 52% / 0.12)" : "transparent",
                          color: active ? "hsl(38 95% 60%)" : "hsl(210 40% 72%)",
                        }}
                      >
                        {"badge" in item && item.badge ? (
                          <span
                            className="flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold shrink-0"
                            style={{
                              background: active ? "hsl(38 95% 52% / 0.25)" : "hsl(216 45% 18%)",
                              color: active ? "hsl(38 95% 60%)" : "hsl(215 25% 55%)",
                            }}
                          >
                            {item.badge}
                          </span>
                        ) : (
                          <item.icon className="h-4 w-4 shrink-0" />
                        )}
                        <span className="flex-1 font-medium text-[13px]">{item.title}</span>
                        {active && <ChevronRight className="h-3 w-3 opacity-60" />}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t space-y-2" style={{ borderColor: "hsl(var(--sidebar-border))" }}>
        <div className="flex items-center gap-2">
          <Languages className="h-3.5 w-3.5 shrink-0" style={{ color: "hsl(215 25% 45%)" }} />
          <span className="text-[11px] font-medium" style={{ color: "hsl(215 25% 50%)" }}>Language</span>
        </div>
        <div className="grid grid-cols-2 gap-1">
          {(["en", "ar"] as const).map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className="py-1.5 rounded-md text-xs font-semibold transition-all"
              style={{
                background: lang === l ? "hsl(38 95% 52%)" : "hsl(216 45% 18%)",
                color: lang === l ? "hsl(216 58% 6%)" : "hsl(215 25% 60%)",
              }}
            >
              {l === "en" ? "English" : "العربية"}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-center" style={{ color: "hsl(215 25% 35%)" }}>ConsultAI Platform © 2026</p>
      </div>
    </aside>
  );
}
