import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeModeProvider } from "@/contexts/ThemeModeContext";
import { AIGatewayProvider } from "@/contexts/AIGatewayContext";
import Navbar from "@/components/Navbar"; 
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import PaymentSuccess from "./pages/PaymentSuccess";
import GenerateReport from "./pages/GenerateReport";
import AIStocks from "./pages/AIStocks";
import StockReport from "./pages/StockReport";
import ContactUs from "./pages/ContactUs";
import Pricing from "./pages/Pricing";
import Dashboard from "./pages/Dashboard";
import Watchlist from "./pages/Watchlist";
import Settings from "./pages/Settings";
import About from "./pages/About";
import Feedback from "./pages/Feedback";
import Mark6Game from "./pages/Mark6Game";
import Mark6Results from "./pages/Mark6Results";
import HowItWorks from "./pages/HowItWorks";
import Unsubscribe from "./pages/Unsubscribe";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthCallback from "./pages/AuthCallback";

const queryClient = new QueryClient();

const App = () => {
  const [dashboardOpen, setDashboardOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AIGatewayProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ThemeModeProvider>
                <Navbar /> 
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/payment-success" element={<PaymentSuccess />} />
                  <Route path="/generate-report" element={<Mark6Game />} />
                  <Route path="/mark6-game" element={<Mark6Game />} />
                  <Route path="/mark6-results" element={<Mark6Results />} />
                  <Route path="/ai-stocks" element={<AIStocks />} />
                  <Route path="/report" element={<StockReport />} />
                  <Route path="/contact" element={<ContactUs />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/watchlist" element={<Watchlist />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/how-it-works" element={<HowItWorks />} />
                  <Route path="/feedback" element={<Feedback />} />
                  <Route path="/unsubscribe" element={<Unsubscribe />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Dashboard open={dashboardOpen} onOpenChange={setDashboardOpen} />
              </ThemeModeProvider>
            </BrowserRouter>
          </TooltipProvider>
        </AIGatewayProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
