import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import AppShell from "@/components/AppShell";

// ─── Pages ────────────────────────────────────────────────────────────────────
import LandingPage             from "@/pages/LandingPage";
import AuthPage                from "@/pages/AuthPage";
import Login                   from "@/pages/Login";
import Signup                  from "@/pages/Signup";
import ForgotPassword          from "@/pages/ForgotPassword";
import ResetPassword           from "@/pages/ResetPassword";
import OpportunitiesPage       from "@/pages/OpportunitiesPage";
import OpportunityDetailPage   from "@/pages/OpportunityDetailPage";
import ExecutionBlueprintPage  from "@/pages/ExecutionBlueprintPage";
import UserDashboardPage       from "@/pages/UserDashboardPage";
import WeeklySignalsPage       from "@/pages/WeeklySignalsPage";
import PricingPage             from "@/pages/PricingPage";
import SubmitOpportunityPage   from "@/pages/SubmitOpportunityPage";
import VerificationPage        from "@/pages/VerificationPage";
import NotFound                from "@/pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, retry: 1 } },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppShell>
            <Routes>
              {/* ── Public ───────────────────────────────── */}
              <Route path="/"                         element={<LandingPage />} />
              <Route path="/auth"                     element={<AuthPage />} />
              <Route path="/login"                    element={<Login />} />
              <Route path="/signup"                   element={<Signup />} />
              <Route path="/forgot-password"          element={<ForgotPassword />} />
              <Route path="/reset-password"           element={<ResetPassword />} />
              <Route path="/pricing"                  element={<PricingPage />} />
              {/* ── Opportunities ────────────────────────── */}
              <Route path="/opportunities"            element={<OpportunitiesPage />} />
              <Route path="/opportunity/:id"          element={<OpportunityDetailPage />} />
              <Route path="/opportunity/:id/execute"  element={<ExecutionBlueprintPage />} />
              {/* ── Intelligence Engine ──────────────────── */}
              <Route path="/submit"                   element={<SubmitOpportunityPage />} />
              <Route path="/verify"                   element={<VerificationPage />} />
              {/* ── Authenticated ────────────────────────── */}
              <Route path="/dashboard"                element={<UserDashboardPage />} />
              <Route path="/signals"                  element={<WeeklySignalsPage />} />
              {/* ── Fallback ─────────────────────────────── */}
              <Route path="*"                         element={<NotFound />} />
            </Routes>
          </AppShell>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
