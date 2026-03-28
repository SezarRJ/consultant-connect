/**
 * App.tsx
 * ─────────────────────────────────────────────────────────────────
 * Redesigned routing: 5 hub pages replace 30+ scattered routes.
 * Legacy deep-link pages are kept for backward compatibility and
 * are reachable via Practice Ops hub jump links.
 * ─────────────────────────────────────────────────────────────────
 */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/lib/i18n";
import { AppLayout } from "@/components/layout/AppLayout";

// ── Hub pages (new architecture) ──────────────────────────────────
import Dashboard      from "./pages/Dashboard";
import EngagementHub  from "./pages/EngagementHub";
import AnalysisHub    from "./pages/AnalysisHub";
import StrategyHub    from "./pages/StrategyHub";
import DeliverablesHub from "./pages/DeliverablesHub";
import PracticeOpsHub from "./pages/PracticeOpsHub";

// ── Legacy pages kept for deep-link compatibility ─────────────────
import CRM                   from "./pages/CRM";
import Projects              from "./pages/Projects";
import Tasks                 from "./pages/Tasks";
import FinancialOverview     from "./pages/FinancialOverview";
import Settings              from "./pages/Settings";
import DocumentHub           from "./pages/DocumentHub";
import AIAssistant           from "./pages/AIAssistant";
import Agents                from "./pages/Agents";

// ── Optional specialist modules (hidden from main nav) ────────────
import RealEstateIntelligence from "./pages/RealEstateIntelligence";
import ISOPreparation         from "./pages/ISOPreparation";
import CompanyDevelopment     from "./pages/CompanyDevelopment";
import ServiceModules         from "./pages/ServiceModules";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 5 * 60 * 1000, refetchOnWindowFocus: false },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>

              {/* ── Main workspace ── */}
              <Route path="/"               element={<Dashboard />} />

              {/* ── 5 Service hubs ── */}
              <Route path="/engagement"     element={<EngagementHub />} />
              <Route path="/analysis"       element={<AnalysisHub />} />
              <Route path="/strategy"       element={<StrategyHub />} />
              <Route path="/deliverables"   element={<DeliverablesHub />} />
              <Route path="/practice-ops"   element={<PracticeOpsHub />} />

              {/* ── Practice ops deep links ── */}
              <Route path="/crm"            element={<CRM />} />
              <Route path="/projects"       element={<Projects />} />
              <Route path="/tasks"          element={<Tasks />} />
              <Route path="/financial"      element={<FinancialOverview />} />
              <Route path="/documents"      element={<DocumentHub />} />

              {/* ── Intelligence / tools ── */}
              <Route path="/ai-assistant"   element={<AIAssistant />} />
              <Route path="/agents"         element={<Agents />} />

              {/* ── System ── */}
              <Route path="/settings"       element={<Settings />} />

              {/* ── Optional specialist modules (not in sidebar) ── */}
              <Route path="/real-estate-intelligence" element={<RealEstateIntelligence />} />
              <Route path="/iso-preparation"          element={<ISOPreparation />} />
              <Route path="/company-development"      element={<CompanyDevelopment />} />
              <Route path="/service-modules"          element={<ServiceModules />} />

              {/* ── Legacy advisory routes (redirect traffic from old bookmarks) ── */}
              <Route path="/market-entry"         element={<AnalysisHub />} />
              <Route path="/competitor-analysis"  element={<AnalysisHub />} />
              <Route path="/pricing-intelligence" element={<AnalysisHub />} />
              <Route path="/risk-assessment"      element={<AnalysisHub />} />
              <Route path="/distributor-finder"   element={<AnalysisHub />} />
              <Route path="/export-readiness"     element={<AnalysisHub />} />
              <Route path="/feasibility-study"    element={<AnalysisHub />} />
              <Route path="/market-intelligence"  element={<AnalysisHub />} />
              <Route path="/sales-strategy"       element={<StrategyHub />} />
              <Route path="/partner-matchmaking"  element={<StrategyHub />} />
              <Route path="/proposals"            element={<DeliverablesHub />} />
              <Route path="/reports"              element={<DeliverablesHub />} />

            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
