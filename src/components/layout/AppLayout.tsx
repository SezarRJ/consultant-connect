import { Outlet, useLocation } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";

const getPageTitle = (pathname: string): string => {
  const titles: Record<string, string> = {
    "/": "Dashboard",
    "/market-entry": "Market Entry Analysis",
    "/distributor-finder": "Distributor Finder",
    "/competitor-analysis": "Competitor Analysis",
    "/pricing-intelligence": "Pricing Intelligence",
    "/risk-assessment": "Risk Assessment",
    "/partner-matchmaking": "Partner Matchmaking",
    "/sales-strategy": "Sales Strategy Generator",
    "/export-readiness": "Export Readiness Check",
    "/feasibility-study": "Market Feasibility Study",
  };
  return titles[pathname] || "Iraq Market Intelligence";
};

export function AppLayout() {
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 flex items-center justify-between border-b px-6 shrink-0"
          style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold font-display" style={{ color: "hsl(210 40% 92%)" }}>
              {pageTitle}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ background: "hsl(38 95% 52% / 0.12)", color: "hsl(38 95% 60%)", border: "1px solid hsl(38 95% 52% / 0.25)" }}>
              🇮🇶 Iraq Market Intelligence
            </span>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
