import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useParams } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/lib/i18n";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import ClientWorkspace from "./pages/ClientWorkspace";
import Agents from "./pages/Agents";
import Knowledge from "./pages/Knowledge";
import Insights from "./pages/Insights";
import Deliverables from "./pages/Deliverables";
import DocumentHub from "./pages/DocumentHub";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

function ClientWorkspaceWithKey() {
  const { id } = useParams<{ id: string }>();
  return <ClientWorkspace key={id} />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/clients/:id" element={<ClientWorkspaceWithKey />} />
              <Route path="/agents" element={<Agents />} />
              <Route path="/knowledge" element={<Knowledge />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/deliverables" element={<Deliverables />} />
              <Route path="/documents" element={<DocumentHub />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
