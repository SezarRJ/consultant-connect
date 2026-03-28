/**
 * AppSidebar.tsx
 * ─────────────────────────────────────────────────────────────────
 * Redesigned navigation: 5 main service hubs + system group.
 * Each hub links to a single page that renders sub-service tabs/cards.
 * ─────────────────────────────────────────────────────────────────
 */
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  BarChart2,
  Lightbulb,
  FileOutput,
  Building2,
  Settings,
  Globe2,
  Languages,
  ChevronRight,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

// ── Nav definition ─────────────────────────────────────────────────

const NAV = [
  {
    key: "overview",
    label: "WORKSPACE",
    labelAr: "مساحة العمل",
    items: [
      { title: "Dashboard",     titleAr: "لوحة التحكم",  url: "/",              icon: LayoutDashboard },
    ],
  },
  {
    key: "services",
    label: "SERVICES",
    labelAr: "الخدمات",
    items: [
      {
        title: "Engagement",    titleAr: "إدارة المشروع", url: "/engagement",    icon: Briefcase,
        sub: ["Client Briefing", "Stakeholder Mapper", "Engagement Tracker", "Documents", "Activity Log"],
      },
      {
        title: "Analysis",      titleAr: "التحليل",       url: "/analysis",      icon: BarChart2,
        sub: ["Market Entry", "Competitor Analysis", "Pricing Intelligence", "Risk Assessment",
               "Distributor Finder", "Export Readiness", "Feasibility Study", "Market Intelligence"],
      },
      {
        title: "Strategy",      titleAr: "الاستراتيجية",  url: "/strategy",      icon: Lightbulb,
        sub: ["Strategy Workshop", "Benchmarking", "Sales Strategy", "Partner Matchmaking", "Playbooks"],
      },
      {
        title: "Deliverables",  titleAr: "المخرجات",      url: "/deliverables",  icon: FileOutput,
        sub: ["Proposal Builder", "Report Generator", "Deliverables", "Executive Summary"],
      },
      {
        title: "Practice Ops",  titleAr: "إدارة المكتب",  url: "/practice-ops",  icon: Building2,
        sub: ["CRM", "Projects", "Tasks", "Financial Overview"],
      },
    ],
  },
  {
    key: "system",
    label: "SYSTEM",
    labelAr: "النظام",
    items: [
      { title: "Settings",      titleAr: "الإعدادات",     url: "/settings",      icon: Settings },
    ],
  },
];

// ── Component ──────────────────────────────────────────────────────

export function AppSidebar() {
  const location = useLocation();
  const { lang, setLang } = useI18n();

  const isActive = (url: string) =>
    url === "/" ? location.pathname === "/" : location.pathname.startsWith(url);

  return (
    <aside
      className="flex h-screen w-56 flex-col border-r shrink-0"
      style={{
        borderColor: "hsl(var(--sidebar-border))",
        background: "hsl(var(--sidebar-background))",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 py-4 border-b"
        style={{ borderColor: "hsl(var(--sidebar-border))" }}
      >
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
          style={{ background: "hsl(38 95% 52%)" }}
        >
          <Globe2 className="h-4 w-4" style={{ color: "hsl(216 58% 6%)" }} />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-bold" style={{ color: "hsl(210 40% 92%)" }}>
            ConsultAI
          </span>
          <span className="text-[10px]" style={{ color: "hsl(38 95% 52%)" }}>
            Engagement OS
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-4 space-y-5">
        {NAV.map((group) => (
          <div key={group.key}>
            <p
              className="px-2 mb-1.5 text-[9px] font-semibold tracking-[0.12em] uppercase"
              style={{ color: "hsl(215 25% 38%)" }}
            >
              {lang === "ar" ? group.labelAr : group.label}
            </p>

            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.url);
                const title = lang === "ar" ? item.titleAr : item.title;

                return (
                  <div key={item.url}>
                    <Link
                      to={item.url}
                      className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all group"
                      style={{
                        background: active ? "hsl(38 95% 52% / 0.13)" : "transparent",
                        color: active ? "hsl(38 95% 60%)" : "hsl(210 40% 68%)",
                      }}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1">{title}</span>
                      {active && (
                        <ChevronRight
                          className="h-3 w-3 opacity-60"
                          style={{ color: "hsl(38 95% 52%)" }}
                        />
                      )}
                    </Link>

                    {/* Sub-service preview — shown when parent is active */}
                    {"sub" in item && item.sub && active && (
                      <div className="ml-7 mt-1 mb-1 space-y-0.5">
                        {item.sub.slice(0, 4).map((sub) => (
                          <p
                            key={sub}
                            className="text-[11px] px-2 py-0.5 rounded"
                            style={{ color: "hsl(215 25% 48%)" }}
                          >
                            {sub}
                          </p>
                        ))}
                        {item.sub.length > 4 && (
                          <p className="text-[10px] px-2" style={{ color: "hsl(215 25% 38%)" }}>
                            +{item.sub.length - 4} more
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Language footer */}
      <div
        className="px-3 py-3 border-t space-y-2"
        style={{ borderColor: "hsl(var(--sidebar-border))" }}
      >
        <div className="flex items-center gap-1.5 mb-1">
          <Languages className="h-3 w-3" style={{ color: "hsl(215 25% 42%)" }} />
          <span className="text-[10px]" style={{ color: "hsl(215 25% 42%)" }}>
            {lang === "ar" ? "اللغة" : "Language"}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1">
          {(["en", "ar"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className="py-1.5 rounded-md text-[11px] font-semibold transition-all"
              style={{
                background: lang === l ? "hsl(38 95% 52%)" : "hsl(216 45% 16%)",
                color: lang === l ? "hsl(216 58% 6%)" : "hsl(215 25% 55%)",
              }}
            >
              {l === "en" ? "English" : "العربية"}
            </button>
          ))}
        </div>
        <p className="text-[9px] text-center" style={{ color: "hsl(215 25% 30%)" }}>
          ConsultAI © 2026
        </p>
      </div>
    </aside>
  );
}
