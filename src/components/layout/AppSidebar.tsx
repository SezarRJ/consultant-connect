import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, TrendingUp, Users, BarChart2, DollarSign,
  ShieldAlert, Handshake, Zap, PackageCheck, FileBarChart2, ChevronRight, Globe2
} from "lucide-react";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, group: "overview" },
  { title: "Market Entry Analysis", url: "/market-entry", icon: TrendingUp, badge: "1", group: "services" },
  { title: "Distributor Finder", url: "/distributor-finder", icon: Users, badge: "2", group: "services" },
  { title: "Competitor Analysis", url: "/competitor-analysis", icon: BarChart2, badge: "3", group: "services" },
  { title: "Pricing Intelligence", url: "/pricing-intelligence", icon: DollarSign, badge: "4", group: "services" },
  { title: "Risk Assessment", url: "/risk-assessment", icon: ShieldAlert, badge: "5", group: "services" },
  { title: "Partner Matchmaking", url: "/partner-matchmaking", icon: Handshake, badge: "6", group: "services" },
  { title: "Sales Strategy", url: "/sales-strategy", icon: Zap, badge: "7", group: "services" },
  { title: "Export Readiness", url: "/export-readiness", icon: PackageCheck, badge: "8", group: "services" },
  { title: "Feasibility Study", url: "/feasibility-study", icon: FileBarChart2, group: "reports" },
];

export function AppSidebar() {
  const location = useLocation();

  const isActive = (url: string) => {
    if (url === "/") return location.pathname === "/";
    return location.pathname.startsWith(url);
  };

  const groupLabels: Record<string, string> = {
    overview: "OVERVIEW",
    services: "ADVISORY SERVICES",
    reports: "REPORTS & PLANS",
  };

  const groups = ["overview", "services", "reports"];

  return (
    <aside className="flex h-screen w-64 flex-col border-r shrink-0" style={{ borderColor: "hsl(var(--sidebar-border))", background: "hsl(var(--sidebar-background))" }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b" style={{ borderColor: "hsl(var(--sidebar-border))" }}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ background: "hsl(38 95% 52%)" }}>
          <Globe2 className="h-5 w-5" style={{ color: "hsl(216 58% 6%)" }} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold font-display" style={{ color: "hsl(210 40% 92%)" }}>Iraq Market</span>
          <span className="text-xs" style={{ color: "hsl(38 95% 52%)" }}>Intelligence Platform</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {groups.map(group => {
          const items = navItems.filter(i => i.group === group);
          return (
            <div key={group}>
              <p className="px-2 mb-2 text-[10px] font-semibold tracking-widest uppercase" style={{ color: "hsl(215 25% 40%)" }}>
                {groupLabels[group]}
              </p>
              <div className="space-y-0.5">
                {items.map(item => {
                  const active = isActive(item.url);
                  return (
                    <Link
                      key={item.url}
                      to={item.url}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all group"
                      style={{
                        background: active ? "hsl(38 95% 52% / 0.12)" : "transparent",
                        color: active ? "hsl(38 95% 60%)" : "hsl(210 40% 72%)",
                      }}
                    >
                      {item.badge && (
                        <span className="flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold shrink-0"
                          style={{
                            background: active ? "hsl(38 95% 52% / 0.25)" : "hsl(216 45% 18%)",
                            color: active ? "hsl(38 95% 60%)" : "hsl(215 25% 55%)",
                          }}>
                          {item.badge}
                        </span>
                      )}
                      {!item.badge && (
                        <item.icon className="h-4 w-4 shrink-0" />
                      )}
                      <span className="flex-1 font-medium text-[13px]">{item.title}</span>
                      {active && <ChevronRight className="h-3 w-3 opacity-60" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t text-center" style={{ borderColor: "hsl(var(--sidebar-border))" }}>
        <p className="text-[10px]" style={{ color: "hsl(215 25% 40%)" }}>Iraq Market Intelligence • 2026</p>
      </div>
    </aside>
  );
}
