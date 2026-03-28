/**
 * App.tsx — ConsultAI Pro v2
 * ─────────────────────────────────────────────────────────────────
 * Full routing:
 *   / Workflow hubs (CRM → Engagement → Analysis → Strategy → Deliverables)
 *   / Domain modules (/domain/:domain)
 *   / Practice Ops (CRM, Projects, Tasks, Financial, Documents)
 *   / Specialist modules (ISO, Company Dev, Real Estate, Service Modules)
 *   / Intelligence tools (AI Assistant, Agents)
 *   / Legacy routes → redirect to correct hub (backward compat)
 * ─────────────────────────────────────────────────────────────────
 */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/lib/i18n";
import { AppLayout } from "@/components/layout/AppLayout";

// ── New hub pages ──────────────────────────────────────────────────
import Dashboard       from "./pages/Dashboard";
import CRMPage         from "./pages/CRM";
import EngagementHub   from "./pages/EngagementHub";
import AnalysisHub     from "./pages/AnalysisHub";
import StrategyHub     from "./pages/StrategyHub";
import DeliverablesHub from "./pages/DeliverablesHub";
import DomainHub       from "./pages/DomainHub";

// ── Practice Ops (kept as standalone full pages) ────────────────────
import Projects        from "./pages/Projects";
import Tasks           from "./pages/Tasks";
import FinancialOverview from "./pages/FinancialOverview";
import DocumentHub     from "./pages/DocumentHub";

// ── Intelligence ────────────────────────────────────────────────────
import AIAssistant     from "./pages/AIAssistant";
import Agents          from "./pages/Agents";

// ── Specialist modules ──────────────────────────────────────────────
import ISOPreparation      from "./pages/ISOPreparation";
import CompanyDevelopment  from "./pages/CompanyDevelopment";
import RealEstateIntelligence from "./pages/RealEstateIntelligence";
import ServiceModules      from "./pages/ServiceModules";

// ── System ──────────────────────────────────────────────────────────
import Settings        from "./pages/Settings";
import NotFound        from "./pages/NotFound";
import ProposalBuilder from "./pages/ProposalBuilder";
import ReportGenerator from "./pages/ReportGenerator";
import PracticeOpsHub       from "./pages/PracticeOpsHub";
import WorkflowGuide         from "./pages/WorkflowGuide";
import DataCollection        from "./pages/DataCollection";
import FinancialConsultancy  from "./pages/FinancialConsultancy";

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

              {/* ── Dashboard ── */}
              <Route path="/"              element={<Dashboard />} />

              {/* ── Core workflow hubs ── */}
              <Route path="/crm"           element={<CRMPage />} />
              <Route path="/engagement"    element={<EngagementHub />} />
              <Route path="/analysis"      element={<AnalysisHub />} />
              <Route path="/strategy"      element={<StrategyHub />} />
              <Route path="/deliverables"  element={<DeliverablesHub />} />

              {/* ── Domain modules ── */}
              <Route path="/domain/:domain" element={<DomainHub />} />

              {/* ── Practice Ops ── */}
              <Route path="/projects"      element={<Projects />} />
              <Route path="/tasks"         element={<Tasks />} />
              <Route path="/financial"     element={<FinancialOverview />} />
              <Route path="/documents"     element={<DocumentHub />} />

              {/* ── Intelligence tools ── */}
              <Route path="/ai-assistant"  element={<AIAssistant />} />
              <Route path="/agents"        element={<Agents />} />

              {/* ── Specialist modules (not in main nav) ── */}
              <Route path="/iso-preparation"          element={<ISOPreparation />} />
              <Route path="/company-development"      element={<CompanyDevelopment />} />
              <Route path="/real-estate-intelligence"  element={<RealEstateIntelligence />} />
              <Route path="/service-modules"          element={<ServiceModules />} />

              {/* ── System ── */}
              <Route path="/settings"      element={<Settings />} />

              {/* ── Core workflow ── */}
              <Route path="/workflow"              element={<WorkflowGuide />} />
              <Route path="/data-collection"       element={<DataCollection />} />
              <Route path="/financial-consultancy" element={<FinancialConsultancy />} />

              {/* ── Direct service pages ── */}
              <Route path="/proposal-builder"     element={<ProposalBuilder />} />
              <Route path="/report-generator"     element={<ReportGenerator />} />

              {/* ── Legacy redirects (old deep-link bookmarks → correct hub) ── */}
              <Route path="/market-entry"         element={<Navigate to="/analysis" replace />} />
              <Route path="/competitor-analysis"  element={<Navigate to="/analysis" replace />} />
              <Route path="/pricing-intelligence" element={<Navigate to="/analysis" replace />} />
              <Route path="/risk-assessment"      element={<Navigate to="/analysis" replace />} />
              <Route path="/distributor-finder"   element={<Navigate to="/analysis" replace />} />
              <Route path="/export-readiness"     element={<Navigate to="/analysis" replace />} />
              <Route path="/feasibility-study"    element={<Navigate to="/analysis" replace />} />
              <Route path="/market-intelligence"  element={<Navigate to="/analysis" replace />} />
              <Route path="/sales-strategy"       element={<Navigate to="/strategy" replace />} />
              <Route path="/partner-matchmaking"  element={<Navigate to="/strategy" replace />} />
              <Route path="/proposals"            element={<Navigate to="/deliverables" replace />} />
              <Route path="/reports"              element={<Navigate to="/deliverables" replace />} />
              <Route path="/practice-ops"         element={<PracticeOpsHub />} />
              <Route path="/fmcg-intelligence"    element={<Navigate to="/domain/fmcg" replace />} />
              <Route path="/sales-distribution"   element={<Navigate to="/domain/sales" replace />} />
              <Route path="/fb-consulting"        element={<Navigate to="/domain/fnb" replace />} />
              <Route path="/marketing-intelligence" element={<Navigate to="/domain/marketing" replace />} />
              <Route path="/manufacturing-module" element={<Navigate to="/domain/manufacturing" replace />} />
              <Route path="/telecom-module"       element={<Navigate to="/domain/telecom" replace />} />
              <Route path="/business-development" element={<Navigate to="/domain/bizdev" replace />} />

            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
