import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { EnergyProvider } from "@/contexts/EnergyContext";
import { useSiteVisitTracker } from "@/hooks/useSiteVisitTracker";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./components/LoginPage";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./components/Dashboard";
import EnergyLogForm from "./components/EnergyLogForm";
import AdminPanel from "./components/AdminPanel";
import Documentation from "./pages/Documentation";

const queryClient = new QueryClient();

function AppContent() {
  // Track site visits
  useSiteVisitTracker();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          }
        />
        <Route
          path="/log"
          element={
            <DashboardLayout>
              <EnergyLogForm />
            </DashboardLayout>
          }
        />
        <Route
          path="/admin"
          element={
            <DashboardLayout>
              <AdminPanel />
            </DashboardLayout>
          }
        />
        <Route path="/docs" element={<Documentation />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <EnergyProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </EnergyProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
