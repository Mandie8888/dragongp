import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PaymentSuccessModal, PlanType } from "@/components/PaymentSuccessModal";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showModal, setShowModal] = useState(false);
  const [planType, setPlanType] = useState<PlanType>("coffee");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get plan type from URL params (set during checkout creation)
    const plan = searchParams.get("plan") as PlanType;
    
    if (plan && ["coffee", "pro", "vip", "explorer", "test"].includes(plan)) {
      setPlanType(plan);
    }

    // Refresh user session to get updated credits
    const refreshSession = async () => {
      try {
        await supabase.auth.refreshSession();
      } catch (error) {
        console.error("Error refreshing session:", error);
      }
    };

    refreshSession();

    // Brief loading state for effect, then show modal
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowModal(true);
    }, 800);

    return () => clearTimeout(timer);
  }, [searchParams]);

  const handleStartAnalyzing = () => {
    // Navigate to Mark6 game page after successful payment
    navigate("/mark6-game", { replace: true });
    // Force a page reload to ensure fresh session data and credit balance
    window.location.reload();
  };

  const handleModalClose = (open: boolean) => {
    if (!open) {
      // If modal is closed without clicking button, go to Mark6 game page
      navigate("/mark6-game", { replace: true });
      window.location.reload();
    }
    setShowModal(open);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-dragon rounded-full opacity-30 blur-xl animate-pulse" />
            <Loader2 className="w-16 h-16 text-gold animate-spin mx-auto relative" />
          </div>
          <p className="text-foreground/70 font-body animate-pulse">
            Processing your payment...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-dragon/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />
      </div>

      <PaymentSuccessModal
        open={showModal}
        onOpenChange={handleModalClose}
        planType={planType}
        onStartAnalyzing={handleStartAnalyzing}
      />
    </div>
  );
}
