import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/lib/i18n";
import { AppLayout } from "@/components/layout/AppLayout";

// ── Core Pages ────────────────────────────────────────────────────────────────
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// ── Client & Project Management ───────────────────────────────────────────────
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import CRM from "./pages/CRM";
import DocumentHub from "./pages/DocumentHub";
import Deliverables from "./pages/Deliverables";

// ── Advisory Services (AI Agents) ─────────────────────────────────────────────
import MarketEntry from "./pages/MarketEntry";
import DistributorFinder from "./pages/DistributorFinder";
import CompetitorAnalysis from "./pages/CompetitorAnalysis";
import PricingIntelligence from "./pages/PricingIntelligence";
import RiskAssessment from "./pages/RiskAssessment";
import PartnerMatchmaking from "./pages/PartnerMatchmaking";
import SalesStrategy from "./pages/SalesStrategy";
import ExportReadiness from "./pages/ExportReadiness";
import FeasibilityStudy from "./pages/FeasibilityStudy";

// ── Intelligence & Research ───────────────────────────────────────────────────
import MarketIntelligence from "./pages/MarketIntelligence";
import AIAssistant from "./pages/AIAssistant";
import Agents from "./pages/Agents";
import Knowledge from "./pages/Knowledge";

// ── Revenue & Business Dev ────────────────────────────────────────────────────
import ProposalBuilder from "./pages/ProposalBuilder";
import FinancialOverview from "./pages/FinancialOverview";
import ReportGenerator from "./pages/ReportGenerator";

// ── Premium Modules ───────────────────────────────────────────────────────────
import RealEstateIntelligence from "./pages/RealEstateIntelligence";
import ServiceModules from "./pages/ServiceModules";
import CompanyDevelopment from "./pages/CompanyDevelopment";
import ISOPreparation from "./pages/ISOPreparation";

// ── NEW: Enhanced Consultancy Pages ───────────────────────────────────────────
import EngagementTracker from "./pages/EngagementTracker";
import ClientBriefing from "./pages/ClientBriefing";
import StrategyWorkshop from "./pages/StrategyWorkshop";
import BenchmarkingTool from "./pages/BenchmarkingTool";
import StakeholderMapper from "./pages/StakeholderMapper";
import ExecutiveDashboard from "./pages/ExecutiveDashboard";
import InsightsFeed from "./pages/InsightsFeed";
import PlaybookLibrary from "./pages/PlaybookLibrary";

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

              {/* ── Core ── */}
              <Route path="/"                           element={<Dashboard />} />
              <Route path="/executive"                  element={<ExecutiveDashboard />} />
              <Route path="/settings"                   element={<Settings />} />

              {/* ── Client & Engagement Management ── */}
              <Route path="/projects"                   element={<Projects />} />
              <Route path="/tasks"                      element={<Tasks />} />
              <Route path="/crm"                        element={<CRM />} />
              <Route path="/documents"                  element={<DocumentHub />} />
              <Route path="/deliverables"               element={<Deliverables />} />
              <Route path="/engagement-tracker"         element={<EngagementTracker />} />
              <Route path="/client-briefing"            element={<ClientBriefing />} />

              {/* ── Advisory Services (AI Agents) ── */}
              <Route path="/market-entry"               element={<MarketEntry />} />
              <Route path="/distributor-finder"         element={<DistributorFinder />} />
              <Route path="/competitor-analysis"        element={<CompetitorAnalysis />} />
              <Route path="/pricing-intelligence"       element={<PricingIntelligence />} />
              <Route path="/risk-assessment"            element={<RiskAssessment />} />
              <Route path="/partner-matchmaking"        element={<PartnerMatchmaking />} />
              <Route path="/sales-strategy"             element={<SalesStrategy />} />
              <Route path="/export-readiness"           element={<ExportReadiness />} />
              <Route path="/feasibility-study"          element={<FeasibilityStudy />} />

              {/* ── Intelligence & Research ── */}
              <Route path="/market-intelligence"        element={<MarketIntelligence />} />
              <Route path="/ai-assistant"               element={<AIAssistant />} />
              <Route path="/agents"                     element={<Agents />} />
              <Route path="/knowledge"                  element={<Knowledge />} />
              <Route path="/insights"                   element={<InsightsFeed />} />

              {/* ── Strategy & Frameworks ── */}
              <Route path="/strategy-workshop"          element={<StrategyWorkshop />} />
              <Route path="/benchmarking"               element={<BenchmarkingTool />} />
              <Route path="/stakeholder-mapper"         element={<StakeholderMapper />} />
              <Route path="/playbooks"                  element={<PlaybookLibrary />} />

              {/* ── Revenue & Business Dev ── */}
              <Route path="/proposals"                  element={<ProposalBuilder />} />
              <Route path="/financial"                  element={<FinancialOverview />} />
              <Route path="/reports"                    element={<ReportGenerator />} />

              {/* ── Premium Modules ── */}
              <Route path="/real-estate-intelligence"   element={<RealEstateIntelligence />} />
              <Route path="/service-modules"            element={<ServiceModules />} />
              <Route path="/company-development"        element={<CompanyDevelopment />} />
              <Route path="/iso-preparation"            element={<ISOPreparation />} />

              {/* ── Service Module Deep Links ── */}
              <Route path="/fmcg-intelligence"          element={<ServiceModules />} />
              <Route path="/sales-distribution"         element={<ServiceModules />} />
              <Route path="/fb-consulting"              element={<ServiceModules />} />
              <Route path="/marketing-intelligence"     element={<ServiceModules />} />
              <Route path="/manufacturing-module"       element={<ServiceModules />} />
              <Route path="/telecom-module"             element={<ServiceModules />} />
              <Route path="/business-development"       element={<ServiceModules />} />

            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
