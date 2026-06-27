import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCredits } from "@/hooks/useCredits";
import { Loader2, AlertTriangle, ArrowDown, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const translations = {
  en: {
    title: "Unsubscribe",
    back: "Back",
    verifying: "The system will verify your active subscription status before proceeding...",
    noSubscription: "No active subscription found for your account.",
    notLoggedIn: "Please log in to manage your subscription.",
    reasonLabel: "Reason for leaving",
    reasonPlaceholder: "Select a reason...",
    reasonPrice: "Price too high",
    reasonNotInteresting: "Not interesting",
    reasonNotHelpful: "Not helpful",
    reasonOthers: "Others",
    otherReasonPlaceholder: "Please tell us more about your reason...",
    downsellTitle: "Would you like to switch to a lower-priced plan instead?",
    downsellTier4: "You can downgrade from Tier 4. Stripe will help change your plan and it will take effect next month.",
    downsellTier12: "If you choose Tier 1 or 2, your monthly subscription will be cancelled.",
    downsellOption: "Yes, show me other plans",
    importantNotice: "Important Notice",
    refundPolicy: "According to our No Refund Policy, all payments are final and non-refundable. For questions, please contact:",
    confirmButton: "Confirm and Submit",
    cancelButton: "Cancel",
    submitting: "Submitting...",
    successMessage: "Your unsubscribe request has been submitted. We'll process it shortly.",
    currentTier: "Current Plan",
  },
  "zh-TW": {
    title: "取消訂閱",
    back: "返回",
    verifying: "系統將在繼續操作前先確認您的訂閱者身份...",
    noSubscription: "未找到您帳戶的有效訂閱。",
    notLoggedIn: "請登入以管理您的訂閱。",
    reasonLabel: "離開原因",
    reasonPlaceholder: "選擇原因...",
    reasonPrice: "價格太高",
    reasonNotInteresting: "內容不感興趣",
    reasonNotHelpful: "沒有幫助",
    reasonOthers: "其他",
    otherReasonPlaceholder: "請告訴我們更多關於您離開的原因...",
    downsellTitle: "您是否願意改用較低價格的方案？",
    downsellTier4: "您可以從 Tier 4 向下更改；Stripe 將協助更改方案並於下個月生效。",
    downsellTier12: "若選擇 Tier 1 或 2，月費將被取消。",
    downsellOption: "是的，給我看看其他方案",
    importantNotice: "重要通知",
    refundPolicy: "根據我們的不設退款政策，所有付款均為最終付款且不可退款。如有疑問，請聯繫：",
    confirmButton: "確認並提交",
    cancelButton: "取消",
    submitting: "提交中...",
    successMessage: "您的取消訂閱請求已提交。我們將盡快處理。",
    currentTier: "當前方案",
  },
  "zh-CN": {
    title: "取消订阅",
    back: "返回",
    verifying: "系统将在继续操作前先确认您的订阅者身份...",
    noSubscription: "未找到您账户的有效订阅。",
    notLoggedIn: "请登录以管理您的订阅。",
    reasonLabel: "离开原因",
    reasonPlaceholder: "选择原因...",
    reasonPrice: "价格太高",
    reasonNotInteresting: "内容不感兴趣",
    reasonNotHelpful: "没有帮助",
    reasonOthers: "其他",
    otherReasonPlaceholder: "请告诉我们更多关于您离开的原因...",
    downsellTitle: "您是否愿意改用较低价格的方案？",
    downsellTier4: "您可以从 Tier 4 向下更改；Stripe 将协助更改方案并于下个月生效。",
    downsellTier12: "若选择 Tier 1 或 2，月费将被取消。",
    downsellOption: "是的，给我看看其他方案",
    importantNotice: "重要通知",
    refundPolicy: "根据我们的不设退款政策，所有付款均为最终付款且不可退款。如有疑问，请联系：",
    confirmButton: "确认并提交",
    cancelButton: "取消",
    submitting: "提交中...",
    successMessage: "您的取消订阅请求已提交。我们将尽快处理。",
    currentTier: "当前方案",
  },
};

const Unsubscribe = () => {
  const { language } = useLanguage();
  const { profile, isAuthenticated } = useCredits();
  const navigate = useNavigate();
  const t = translations[language];

  const [isVerifying, setIsVerifying] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [currentTier, setCurrentTier] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsVerifying(true);
    const timer = setTimeout(() => {
      if (profile && profile.tier !== "free") {
        setHasSubscription(true);
        setCurrentTier(profile.tier);
      } else {
        setHasSubscription(false);
        setCurrentTier(null);
      }
      setIsVerifying(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [profile]);

  const handleSubmit = async () => {
    if (!reason) {
      toast.error(language === "en" ? "Please select a reason" : language === "zh-TW" ? "請選擇原因" : "请选择原因");
      return;
    }
    if (reason === "others" && !otherReason.trim()) {
      toast.error(language === "en" ? "Please provide details" : language === "zh-TW" ? "請提供詳細信息" : "请提供详细信息");
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    toast.success(t.successMessage);
    navigate("/");
  };

  const isTier4 = currentTier === "tier4" || currentTier === "Tier 4";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-16 pb-8 px-4">
        <div className="container mx-auto max-w-lg">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.back}
          </Button>

          <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
            <h1 className="text-2xl font-bold text-dragon mb-6">{t.title}</h1>

            <div className="space-y-4">
              {/* Verification Status */}
              {isVerifying ? (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Loader2 className="h-5 w-5 animate-spin text-dragon" />
                  <span className="text-sm">{t.verifying}</span>
                </div>
              ) : !isAuthenticated ? (
                <div className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm">{t.notLoggedIn}</span>
                </div>
              ) : !hasSubscription ? (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">{t.noSubscription}</span>
                </div>
              ) : (
                <>
                  {/* Current Tier Display */}
                  {currentTier && (
                    <div className="p-3 bg-dragon/10 border border-dragon/30 rounded-lg">
                      <span className="text-sm font-medium">{t.currentTier}: </span>
                      <span className="text-sm text-dragon font-bold capitalize">{currentTier}</span>
                    </div>
                  )}

                  {/* Reason Dropdown */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">{t.reasonLabel}</Label>
                    <Select value={reason} onValueChange={setReason}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder={t.reasonPlaceholder} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="price">{t.reasonPrice}</SelectItem>
                        <SelectItem value="not_interesting">{t.reasonNotInteresting}</SelectItem>
                        <SelectItem value="not_helpful">{t.reasonNotHelpful}</SelectItem>
                        <SelectItem value="others">{t.reasonOthers}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Other Reason Text Area */}
                  {reason === "others" && (
                    <div className="space-y-2">
                      <Textarea
                        placeholder={t.otherReasonPlaceholder}
                        value={otherReason}
                        onChange={(e) => setOtherReason(e.target.value)}
                        className="min-h-[100px] text-sm"
                      />
                    </div>
                  )}

                  {/* Downsell Option */}
                  <div className="p-4 bg-accent/50 border border-accent rounded-lg space-y-3">
                    <div className="flex items-center gap-2">
                      <ArrowDown className="h-4 w-4 text-dragon" />
                      <span className="text-sm font-medium">{t.downsellTitle}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {isTier4 ? t.downsellTier4 : t.downsellTier12}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => navigate("/pricing")}
                    >
                      {t.downsellOption}
                    </Button>
                  </div>

                  {/* Refund Policy Notice */}
                  <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <span className="text-sm font-medium text-destructive">{t.importantNotice}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t.refundPolicy}
                    </p>
                    <a 
                      href="mailto:contact@dragongp.ai" 
                      className="text-xs text-dragon hover:underline block"
                    >
                      contact@dragongp.ai
                    </a>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => navigate(-1)}
                    >
                      {t.cancelButton}
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          {t.submitting}
                        </>
                      ) : (
                        t.confirmButton
                      )}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Unsubscribe;
