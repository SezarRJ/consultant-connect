import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/lib/i18n";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import MarketEntry from "./pages/MarketEntry";
import DistributorFinder from "./pages/DistributorFinder";
import CompetitorAnalysis from "./pages/CompetitorAnalysis";
import PricingIntelligence from "./pages/PricingIntelligence";
import RiskAssessment from "./pages/RiskAssessment";
import PartnerMatchmaking from "./pages/PartnerMatchmaking";
import SalesStrategy from "./pages/SalesStrategy";
import ExportReadiness from "./pages/ExportReadiness";
import FeasibilityStudy from "./pages/FeasibilityStudy";
import DocumentHub from "./pages/DocumentHub";
import Settings from "./pages/Settings";
import Agents from "./pages/Agents";
import CRM from "./pages/CRM";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import FinancialOverview from "./pages/FinancialOverview";
import MarketIntelligence from "./pages/MarketIntelligence";
import ProposalBuilder from "./pages/ProposalBuilder";
import RealEstateIntelligence from "./pages/RealEstateIntelligence";
import ServiceModules from "./pages/ServiceModules";
import AIAssistant from "./pages/AIAssistant";
import ReportGenerator from "./pages/ReportGenerator";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 5 * 60 * 1000, refetchOnWindowFocus: false } },
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
              <Route path="/"                           element={<Dashboard />} />
              <Route path="/market-entry"               element={<MarketEntry />} />
              <Route path="/distributor-finder"         element={<DistributorFinder />} />
              <Route path="/competitor-analysis"        element={<CompetitorAnalysis />} />
              <Route path="/pricing-intelligence"       element={<PricingIntelligence />} />
              <Route path="/risk-assessment"            element={<RiskAssessment />} />
              <Route path="/partner-matchmaking"        element={<PartnerMatchmaking />} />
              <Route path="/sales-strategy"             element={<SalesStrategy />} />
              <Route path="/export-readiness"           element={<ExportReadiness />} />
              <Route path="/feasibility-study"          element={<FeasibilityStudy />} />
              <Route path="/crm"                        element={<CRM />} />
              <Route path="/agents"                     element={<Agents />} />
              <Route path="/documents"                  element={<DocumentHub />} />
              <Route path="/settings"                   element={<Settings />} />
              <Route path="/projects"                   element={<Projects />} />
              <Route path="/tasks"                      element={<Tasks />} />
              <Route path="/financial"                  element={<FinancialOverview />} />
              <Route path="/market-intelligence"        element={<MarketIntelligence />} />
              <Route path="/proposals"                  element={<ProposalBuilder />} />
              <Route path="/real-estate-intelligence"   element={<RealEstateIntelligence />} />
              <Route path="/service-modules"            element={<ServiceModules />} />
              <Route path="/ai-assistant"               element={<AIAssistant />} />
              <Route path="/reports"                    element={<ReportGenerator />} />
              {/* Service module deep links from Projects workspace */}
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
