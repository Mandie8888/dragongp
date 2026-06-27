import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { Check, Brain, Crown, Coffee, Loader2, Gift, AlertCircle, Sparkles, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import SignUpDialog from "./SignUpDialog";
import MasterDisclaimerModal from "./MasterDisclaimerModal";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const PricingSection = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [showSignUpDialog, setShowSignUpDialog] = useState(false);
  const [isExplorerClaimed, setIsExplorerClaimed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);
  const [pendingPlanType, setPendingPlanType] = useState<string | null>(null);

  useEffect(() => {
    const checkExplorerStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setIsAuthenticated(true);
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_explorer_used")
          .eq("user_id", user.id)
          .maybeSingle();
        
        if (profile?.is_explorer_used) {
          setIsExplorerClaimed(true);
        }
      }
    };
    checkExplorerStatus();
  }, []);

  const getLangKey = () => {
    if (language === "zh-TW") return "tc";
    if (language === "zh-CN") return "sc";
    return "en";
  };
  const langKey = getLangKey();

  const content = {
    en: {
      title: "Select Your AI Plan",
      subtitle: "Unbiased Math Logic. No Broker Bias.",
      trustBadge: "🔒 Secure Stripe Payments",
      mostPopular: "⭐ MOST POPULAR",
      explorerClaimed: "Free gift already applied",
      error: "Error",
      errorCheckout: "Payment gateway is temporarily busy. Please try again in a moment.",
      errorGeneral: "Something went wrong. Please try again.",
      back: "Back",
    },
    tc: {
      title: "選擇您的 AI 計劃",
      subtitle: "純粹數學邏輯，拒絕經紀人偏見。",
      trustBadge: "🔒 安全Stripe支付",
      mostPopular: "⭐ 最受歡迎",
      explorerClaimed: "免費禮包已領取",
      error: "錯誤",
      errorCheckout: "支付網關暫時繁忙。請稍後再試。",
      errorGeneral: "出了點問題。請再試一次。",
      back: "返回",
    },
    sc: {
      title: "选择您的 AI 计划",
      subtitle: "纯粹数学逻辑，拒绝经纪人偏见。",
      trustBadge: "🔒 安全Stripe支付",
      mostPopular: "⭐ 最受欢迎",
      explorerClaimed: "免费礼包已领取",
      error: "错误",
      errorCheckout: "支付网关暂时繁忙。请稍后再试。",
      errorGeneral: "出了点问题。请再试一次。",
      back: "返回",
    },
  };

  const t = content[langKey];

  // ✅ UPDATED: Plans with correct Stripe Price IDs
  const plans = [
    {
      id: "explorer",
      icon: Gift,
      priceId: "price_1Sp8vJ2WQfsxlWM6tAOHh6Eb",
      name: { en: "Explorer Gift", tc: "探索者禮物", sc: "探索者礼物" },
      price: { en: "$0", tc: "$0", sc: "$0" },
      period: { en: "FREE", tc: "免費", sc: "免费" },
      features: [
        { en: "48-Hour Full Access", tc: "48小時完整使用權", sc: "48小时完整使用权" },
        { en: "5 AI Reports", tc: "5份AI報告", sc: "5份AI报告" },
        { en: "No Credit Card Required", tc: "無需信用卡", sc: "无需信用卡" },
      ],
      button: { en: "Claim Free Gift", tc: "領取免費禮物", sc: "领取免费礼物" },
      disabledButton: { en: "Gift Already Claimed", tc: "禮物已領取", sc: "礼物已领取" },
      planType: "explorer",
      colorScheme: "green",
      borderColor: "#10B981",
      bgGradient: "from-[#10B981]/10 to-[#059669]/5",
    },
    {
      id: "coffee",
      icon: Coffee,
      priceId: "price_1Sp8xL2WQfsxlWM6CokoYptI",
      name: { en: "Coffee Plan", tc: "咖啡方案", sc: "咖啡方案" },
      price: { en: "$2.00", tc: "$2.00", sc: "$2.00" },
      period: { en: "One-time", tc: "一次性", sc: "一次性" },
      features: [
        { en: "5 Additional AI Reports", tc: "額外5份AI報告", sc: "额外5份AI报告" },
        { en: "Instant Top-Up", tc: "即時充值", sc: "即时充值" },
        { en: "No Subscription", tc: "無需訂閱", sc: "无需订阅" },
      ],
      button: { en: "Get Coffee Boost", tc: "獲取咖啡能量", sc: "获取咖啡能量" },
      planType: "coffee",
      colorScheme: "coffee",
      borderColor: "#CD7F32",
      bgGradient: "from-[#CD7F32]/10 to-[#8B4513]/5",
    },
    {
      id: "pro",
      icon: Brain,
      priceId: "price_1Sqs7q2WQfsxlWM6Ve6fbw85",
      name: { en: "Pro Monthly", tc: "專業月費", sc: "专业月费" },
      price: { en: "$10.00", tc: "$10.00", sc: "$10.00" },
      period: { en: "/month", tc: "/月", sc: "/月" },
      features: [
        { en: "50 Reports per Month", tc: "每月50份報告", sc: "每月50份报告" },
        { en: "Advanced Indicator Logic", tc: "進階指標邏輯", sc: "进阶指标逻辑" },
        { en: "Email Support", tc: "電郵支援", sc: "邮件支持" },
        { en: "Watchlist Limit: 20", tc: "自選股上限: 20", sc: "自选股上限: 20" },
      ],
      button: { en: "Choose Pro", tc: "選擇專業版", sc: "选择专业版" },
      planType: "pro",
      colorScheme: "gold",
      borderColor: "#FFD700",
      bgGradient: "from-[#FFD700]/15 to-[#FFA500]/10",
      isPopular: true,
    },
    {
      id: "vip",
      icon: Crown,
      priceId: "price_1SqrbA2WQfsxlWM6yV4moIQb",
      name: { en: "VIP Annual", tc: "VIP年費", sc: "VIP年费" },
      price: { en: "$50.00", tc: "$50.00", sc: "$50.00" },
      period: { en: "/year", tc: "/年", sc: "/年" },
      features: [
        { en: "100 Reports per Month", tc: "每月100份報告", sc: "每月100份报告" },
        { en: "Early Access to New Features", tc: "優先體驗新功能", sc: "优先体验新功能" },
        { en: "Priority Server Speed", tc: "優先伺服器速度", sc: "优先服务器速度" },
        { en: "1-on-1 Setup Support", tc: "一對一設定支援", sc: "一对一设置支持" },
      ],
      button: { en: "Join VIP Elite", tc: "加入VIP精英", sc: "加入VIP精英" },
      planType: "vip",
      colorScheme: "diamond",
      borderColor: "#60A5FA",
      bgGradient: "from-[#60A5FA]/15 to-[#3B82F6]/10",
    },
  ];

  const claimedPopupContent = {
    en: { 
      title: "Gift Already Claimed", 
      description: "Your gift has been claimed. Please continue.",
      continueBtn: "Continue to Home"
    },
    tc: { 
      title: "禮物已領取", 
      description: "您已領取過禮物。請繼續使用。",
      continueBtn: "返回首頁"
    },
    sc: { 
      title: "礼物已领取", 
      description: "您已领取过礼物。请继续使用。",
      continueBtn: "返回首页"
    },
  };

  const [showClaimedPopup, setShowClaimedPopup] = useState(false);
  const claimedT = claimedPopupContent[langKey];

  // Handle initial button click - show disclaimer for paid plans
  const handlePlanClick = async (planType: string) => {
    if (planType === "explorer") {
      // Explorer (free) plan - handle directly without disclaimer
      const localClaimed = localStorage.getItem("explorer_gift_claimed");
      if (localClaimed === "true") {
        setShowClaimedPopup(true);
        return;
      }
      
      if (isExplorerClaimed) {
        localStorage.setItem("explorer_gift_claimed", "true");
        setShowClaimedPopup(true);
        return;
      }
      
      setShowSignUpDialog(true);
      return;
    }

    // For paid plans (coffee, pro, vip) - check authentication first
    if (!isAuthenticated) {
      // Save the chosen plan so we can redirect back after signup/login
      localStorage.setItem("pending_plan_type", planType);
      setShowSignUpDialog(true);
      return;
    }

    // Authenticated - show disclaimer modal first
    setPendingPlanType(planType);
    setShowDisclaimerModal(true);
  };

  // ✅ UPDATED: Handle disclaimer acceptance - proceed to Stripe with correct priceId
  const handleDisclaimerAccept = async () => {
    if (!pendingPlanType) return;
    
    setShowDisclaimerModal(false);
    setLoadingPlan(pendingPlanType);
    
    try {
      // Find the selected plan
      const selectedPlan = plans.find(p => p.planType === pendingPlanType);
      if (!selectedPlan) {
        toast({ title: t.error, description: "Plan not found", variant: "destructive" });
        setLoadingPlan(null);
        setPendingPlanType(null);
        return;
      }

      console.log("[PricingSection] Creating checkout for plan:", pendingPlanType);
      console.log("[PricingSection] Price ID:", selectedPlan.priceId);

      // Get current user info
      const { data: { user } } = await supabase.auth.getUser();

      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { 
          priceId: selectedPlan.priceId,
          userId: user?.id || "",
          email: user?.email || ""
        },
      });

      console.log("[PricingSection] Checkout response:", { data, error });

      if (error) {
        console.error("[PricingSection] Checkout error:", error);
        toast({ title: t.error, description: t.errorCheckout, variant: "destructive" });
        setLoadingPlan(null);
        setPendingPlanType(null);
        return;
      }

      if (data?.error) {
        console.error("[PricingSection] Checkout returned error:", data.error);
        toast({ title: t.error, description: data.error, variant: "destructive" });
        setLoadingPlan(null);
        setPendingPlanType(null);
        return;
      }

      if (data?.url) {
        console.log("[PricingSection] Redirecting to Stripe:", data.url);
        window.location.href = data.url;
      } else {
        console.error("[PricingSection] No URL in checkout response");
        toast({ title: t.error, description: t.errorCheckout, variant: "destructive" });
        setLoadingPlan(null);
        setPendingPlanType(null);
      }
    } catch (error) {
      console.error("[PricingSection] Exception during checkout:", error);
      toast({ title: t.error, description: t.errorGeneral, variant: "destructive" });
      setLoadingPlan(null);
      setPendingPlanType(null);
    }
  };

  const handleDisclaimerDecline = () => {
    setShowDisclaimerModal(false);
    setPendingPlanType(null);
  };

  const handleClaimedPopupClose = () => {
    setShowClaimedPopup(false);
    navigate("/");
  };

  const getButtonStyles = (colorScheme: string, isDisabled: boolean) => {
    if (isDisabled) return "bg-[#475569] text-[#94A3B8] cursor-not-allowed";
    switch (colorScheme) {
      case "green": return "bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white shadow-lg shadow-[#10B981]/30";
      case "coffee": return "bg-gradient-to-r from-[#CD7F32] to-[#8B4513] hover:from-[#B87333] hover:to-[#7B3F00] text-white shadow-lg shadow-[#CD7F32]/30";
      case "gold": return "bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFC000] hover:to-[#FF8C00] text-black font-extrabold shadow-lg shadow-[#FFD700]/40";
      case "diamond": return "bg-gradient-to-r from-[#60A5FA] to-[#3B82F6] hover:from-[#3B82F6] hover:to-[#2563EB] text-white shadow-lg shadow-[#60A5FA]/30";
      default: return "bg-[#3B82F6] hover:bg-[#2563EB] text-white";
    }
  };

  // Render a single plan card
  const renderPlanCard = (plan: typeof plans[0], isMobile: boolean = false) => {
    const IconComponent = plan.icon;
    const isLoading = loadingPlan === plan.planType;
    const isExplorerDisabled = plan.planType === "explorer" && isExplorerClaimed;
    
    return (
      <Card
        key={plan.id}
        className={`relative flex flex-col transition-all duration-300 hover:scale-[1.02] border-2 rounded-xl overflow-hidden ${
          isMobile ? "h-full" : "flex-1 min-w-0"
        } ${isExplorerDisabled ? "opacity-60" : ""} ${plan.isPopular ? "ring-2 ring-[#FFD700] ring-offset-1 ring-offset-[#0F172A]" : ""}`}
        style={{
          borderColor: plan.borderColor,
          borderWidth: "2px",
          background: `linear-gradient(to bottom, ${plan.borderColor}15, ${plan.borderColor}05)`,
        }}
      >
        {plan.isPopular && (
          <div className="absolute -top-0 left-0 right-0 z-10">
            <div 
              className="flex items-center justify-center gap-1 py-1 text-black font-extrabold text-xs md:text-sm"
              style={{ backgroundColor: "#FFD700" }}
            >
              <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
              {t.mostPopular}
              <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
            </div>
          </div>
        )}

        {plan.colorScheme === "green" && !isExplorerDisabled && (
          <div className="absolute top-1 right-1 z-10">
            <span className="bg-[#10B981] text-white text-[10px] md:text-xs font-bold px-1.5 py-0.5 rounded-full">
              🎁 FREE
            </span>
          </div>
        )}

        <CardHeader className={`text-center pb-1 px-2 lg:px-3 ${plan.isPopular ? "pt-8" : "pt-3"}`}>
          <div 
            className="mx-auto mb-2 p-2 rounded-full"
            style={{ 
              backgroundColor: `${plan.borderColor}30`,
              boxShadow: `0 0 15px ${plan.borderColor}40`,
            }}
          >
            <IconComponent className="w-5 h-5 md:w-6 md:h-6" style={{ color: plan.borderColor }} />
          </div>
          
          <CardTitle 
            className="text-base md:text-lg lg:text-xl font-display font-bold mb-0"
            style={{ color: plan.borderColor }}
          >
            {plan.name[langKey]}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 text-center px-2 lg:px-3 py-2">
          <div className="mb-2">
            <span 
              className="text-2xl md:text-3xl lg:text-4xl font-extrabold"
              style={{ color: plan.borderColor }}
            >
              {plan.price[langKey]}
            </span>
            <span className="text-[#CBD5E1] text-sm md:text-base ml-1 font-medium">
              {plan.period[langKey]}
            </span>
          </div>

          <ul className="space-y-1.5 text-left">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <Check 
                  className="w-4 h-4 flex-shrink-0 mt-0.5" 
                  style={{ color: plan.borderColor }} 
                />
                <span className="text-white font-semibold text-xs md:text-sm leading-tight">
                  {feature[langKey]}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>

        <CardFooter className="pt-2 pb-3 px-2 lg:px-3 mt-auto">
          <Button
            onClick={() => handlePlanClick(plan.planType)}
            disabled={isLoading || isExplorerDisabled}
            className={`w-full font-bold text-sm md:text-base py-4 md:py-5 transition-all duration-300 rounded-lg ${getButtonStyles(plan.colorScheme, isExplorerDisabled)}`}
            size="lg"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isExplorerDisabled ? (
              <span className="flex items-center justify-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs md:text-sm">{plan.disabledButton?.[langKey]}</span>
              </span>
            ) : (
              plan.button[langKey]
            )}
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <>
      <section id="pricing" className="h-full flex flex-col px-2 md:px-4 py-2 overflow-hidden" style={{ backgroundColor: '#0F172A' }}>
        {/* Back Button - Top */}
        <div className="flex justify-start mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-[#CBD5E1] hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            {t.back}
          </Button>
        </div>

        {/* Header - Compact */}
        <div className="text-center mb-3">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-display font-bold text-[#FFD700] mb-1">{t.title}</h2>
          <p className="text-sm md:text-base text-[#CBD5E1]">{t.subtitle}</p>
          <p className="text-xs text-[#64748B] mt-1">{t.trustBadge}</p>
        </div>

        {/* Mobile: Vertical Stack */}
        <div className="md:hidden flex-1 px-2 overflow-y-auto">
          <div className="flex flex-col gap-3 pb-4">
            {plans.map((plan) => (
              <div key={plan.id} className="w-full">
                {renderPlanCard(plan, true)}
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="w-full mt-2 text-[#CBD5E1] border-[#CBD5E1]/30 hover:bg-[#CBD5E1]/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.back}
            </Button>
          </div>
        </div>

        {/* Desktop/Tablet: 4-Column Grid */}
        <div className="hidden md:flex flex-1 flex-row gap-2 lg:gap-3 items-stretch justify-center max-w-[1400px] mx-auto w-full">
          {plans.map((plan) => renderPlanCard(plan, false))}
        </div>
      </section>

      {/* Gift Already Claimed Popup */}
      <Dialog open={showClaimedPopup} onOpenChange={setShowClaimedPopup}>
        <DialogContent className="bg-[#1E293B] border-[#F59E0B]/50 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#F59E0B]">
              <AlertCircle className="w-5 h-5" />
              {claimedT.title}
            </DialogTitle>
            <DialogDescription className="text-[#CBD5E1] text-sm">
              {claimedT.description}
            </DialogDescription>
          </DialogHeader>
          <Button 
            onClick={handleClaimedPopupClose} 
            className="bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:opacity-90 text-black font-bold"
          >
            {claimedT.continueBtn}
          </Button>
        </DialogContent>
      </Dialog>

      <SignUpDialog open={showSignUpDialog} onOpenChange={setShowSignUpDialog} />

      <MasterDisclaimerModal
        open={showDisclaimerModal}
        onOpenChange={setShowDisclaimerModal}
        onAccept={handleDisclaimerAccept}
        onDecline={handleDisclaimerDecline}
      />
    </>
  );
};

export default PricingSection;