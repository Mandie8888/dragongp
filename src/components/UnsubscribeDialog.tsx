import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCredits } from "@/hooks/useCredits";
import { Loader2, AlertTriangle, ArrowDown, CheckCircle } from "lucide-react";

interface UnsubscribeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const translations = {
  en: {
    title: "Unsubscribe",
    verifying: "The system will verify your active subscription status before proceeding...",
    noSubscription: "No active subscription found for your account.",
    notLoggedIn: "Please log in to manage your subscription.",
    reasonQuestion: "Would you like to provide a reason to help us improve?",
    yes: "Yes",
    no: "No",
    reasonPrice: "Price too high",
    reasonNotInteresting: "Not interesting",
    reasonNotHelpful: "Not helpful",
    reasonOthers: "Others",
    otherReasonPlaceholder: "Please tell us more about your reason (minimum 10 characters)...",
    downsellTitle: "Would you like to switch to a lower-priced plan instead?",
    downsellTier4: "You can downgrade from Tier 4. Stripe will help change your plan and it will take effect next month.",
    downsellTier12: "If you choose Tier 1 or 2, your monthly subscription will be cancelled.",
    downsellOption: "Yes, show me other plans",
    importantNotice: "Important Notice",
    refundPolicy: "According to our No Refund Policy, all payments are final and non-refundable. For questions, please contact:",
    confirmButton: "Confirm and Submit",
    cancelButton: "Cancel",
    submitting: "Submitting...",
    currentTier: "Current Plan",
    // Confirmation modal
    confirmationTitle: "Request Received",
    confirmationMessage: "Your request has been received. Please note that after unsubscribing, you will be ineligible for a Free Gift for the next 6 months should you choose to re-subscribe. You may continue to use the site and your remaining credits until they are fully exhausted.",
    iUnderstand: "I Understand",
  },
  "zh-TW": {
    title: "取消訂閱",
    verifying: "系統將在繼續操作前先確認您的訂閱者身份...",
    noSubscription: "未找到您帳戶的有效訂閱。",
    notLoggedIn: "請登入以管理您的訂閱。",
    reasonQuestion: "您願意提供離開的原因以幫助我們改進嗎？",
    yes: "是",
    no: "否",
    reasonPrice: "價格太高",
    reasonNotInteresting: "內容不感興趣",
    reasonNotHelpful: "沒有幫助",
    reasonOthers: "其他",
    otherReasonPlaceholder: "請告訴我們更多關於您離開的原因（至少10個字符）...",
    downsellTitle: "您是否願意改用較低價格的方案？",
    downsellTier4: "您可以從 Tier 4 向下更改；Stripe 將協助更改方案並於下個月生效。",
    downsellTier12: "若選擇 Tier 1 或 2，月費將被取消。",
    downsellOption: "是的，給我看看其他方案",
    importantNotice: "重要通知",
    refundPolicy: "根據我們的不設退款政策，所有付款均為最終付款且不可退款。如有疑問，請聯繫：",
    confirmButton: "確認並提交",
    cancelButton: "取消",
    submitting: "提交中...",
    currentTier: "當前方案",
    // Confirmation modal
    confirmationTitle: "已收到請求",
    confirmationMessage: "我們已收到您的申請。請注意，取消訂閱後，若您在未來 6 個月內重新訂閱，將無法再次領取免費禮品。在您的點數用完之前，您仍可以繼續使用本站服務。",
    iUnderstand: "我明白",
  },
  "zh-CN": {
    title: "取消订阅",
    verifying: "系统将在继续操作前先确认您的订阅者身份...",
    noSubscription: "未找到您账户的有效订阅。",
    notLoggedIn: "请登录以管理您的订阅。",
    reasonQuestion: "您愿意提供离开的原因以帮助我们改进吗？",
    yes: "是",
    no: "否",
    reasonPrice: "价格太高",
    reasonNotInteresting: "内容不感兴趣",
    reasonNotHelpful: "没有帮助",
    reasonOthers: "其他",
    otherReasonPlaceholder: "请告诉我们更多关于您离开的原因（至少10个字符）...",
    downsellTitle: "您是否愿意改用较低价格的方案？",
    downsellTier4: "您可以从 Tier 4 向下更改；Stripe 将协助更改方案并于下个月生效。",
    downsellTier12: "若选择 Tier 1 或 2，月费将被取消。",
    downsellOption: "是的，给我看看其他方案",
    importantNotice: "重要通知",
    refundPolicy: "根据我们的不设退款政策，所有付款均为最终付款且不可退款。如有疑问，请联系：",
    confirmButton: "确认并提交",
    cancelButton: "取消",
    submitting: "提交中...",
    currentTier: "当前方案",
    // Confirmation modal
    confirmationTitle: "已收到请求",
    confirmationMessage: "我们已收到您的申请。请注意，取消订阅后，若您在未来 6 个月内重新订阅，将无法再次领取免费礼品。在您的点数用完之前，您仍可以继续使用本站服务。",
    iUnderstand: "我明白",
  },
};

const UnsubscribeDialog = ({ open, onOpenChange }: UnsubscribeDialogProps) => {
  const { language } = useLanguage();
  const { profile, isAuthenticated } = useCredits();
  const navigate = useNavigate();
  const t = translations[language];

  const [isVerifying, setIsVerifying] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [currentTier, setCurrentTier] = useState<string | null>(null);
  const [wantsToProvideReason, setWantsToProvideReason] = useState<"yes" | "no" | null>(null);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [otherReason, setOtherReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Validation logic
  const isOthersValid = selectedReason !== "others" || otherReason.trim().length >= 10;
  const canSubmit = wantsToProvideReason === "no" || 
    (wantsToProvideReason === "yes" && selectedReason !== null && isOthersValid);

  useEffect(() => {
    if (open) {
      setIsVerifying(true);
      setShowConfirmation(false);
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
    } else {
      // Reset state when dialog closes
      setWantsToProvideReason(null);
      setSelectedReason(null);
      setOtherReason("");
      setShowConfirmation(false);
    }
  }, [open, profile]);

  const handleSubmit = async () => {
    if (wantsToProvideReason === "yes" && !selectedReason) {
      return;
    }
    if (selectedReason === "others" && otherReason.trim().length < 10) {
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setShowConfirmation(true);
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    onOpenChange(false);
    navigate("/");
  };

  const isTier4 = currentTier === "tier4" || currentTier === "Tier 4";

  const reasonOptions = [
    { value: "price", label: t.reasonPrice },
    { value: "not_interesting", label: t.reasonNotInteresting },
    { value: "not_helpful", label: t.reasonNotHelpful },
    { value: "others", label: t.reasonOthers },
  ];

  // Confirmation Modal
  if (showConfirmation) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
            </div>
            <DialogTitle className="text-xl font-bold text-center">
              {t.confirmationTitle}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground text-center pt-4 leading-relaxed">
              {t.confirmationMessage}
            </DialogDescription>
          </DialogHeader>
          <div className="pt-4">
            <Button
              className="w-full bg-dragon hover:bg-dragon/90"
              onClick={handleConfirmationClose}
            >
              {t.iUnderstand}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-dragon flex items-center gap-2">
            {t.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
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

              {/* Yes/No Question */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">{t.reasonQuestion}</Label>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant={wantsToProvideReason === "yes" ? "default" : "outline"}
                    size="sm"
                    className={`flex-1 h-10 ${wantsToProvideReason === "yes" ? "bg-dragon hover:bg-dragon/90" : ""}`}
                    onClick={() => setWantsToProvideReason("yes")}
                  >
                    {t.yes}
                  </Button>
                  <Button
                    type="button"
                    variant={wantsToProvideReason === "no" ? "default" : "outline"}
                    size="sm"
                    className={`flex-1 h-10 ${wantsToProvideReason === "no" ? "bg-dragon hover:bg-dragon/90" : ""}`}
                    onClick={() => {
                      setWantsToProvideReason("no");
                      setSelectedReason(null);
                      setOtherReason("");
                    }}
                  >
                    {t.no}
                  </Button>
                </div>
              </div>

              {/* Reason Selection - Only show if "Yes" is selected */}
              {wantsToProvideReason === "yes" && (
                <div className="space-y-3 p-3 bg-muted/30 rounded-lg border border-border">
                  <RadioGroup
                    value={selectedReason || ""}
                    onValueChange={setSelectedReason}
                    className="space-y-2"
                  >
                    {reasonOptions.map((option) => (
                      <div 
                        key={option.value} 
                        className="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/50 cursor-pointer"
                        onClick={() => setSelectedReason(option.value)}
                      >
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label 
                          htmlFor={option.value} 
                          className="text-sm cursor-pointer flex-1"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>

                  {/* Other Reason Text Area */}
                  {selectedReason === "others" && (
                    <div className="space-y-2 pt-2">
                      <Textarea
                        placeholder={t.otherReasonPlaceholder}
                        value={otherReason}
                        onChange={(e) => setOtherReason(e.target.value)}
                        className="min-h-[80px] text-sm"
                      />
                      <p className={`text-xs ${otherReason.trim().length >= 10 ? "text-green-500" : "text-muted-foreground"}`}>
                        {otherReason.trim().length}/10 {language === "en" ? "characters minimum" : "最少字符"}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Downsell Option */}
              <div className="p-3 bg-accent/50 border border-accent rounded-lg space-y-2">
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
                  className="w-full text-xs h-8"
                  onClick={() => {
                    onOpenChange(false);
                    window.location.href = "/pricing";
                  }}
                >
                  {t.downsellOption}
                </Button>
              </div>

              {/* Refund Policy Notice */}
              <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg space-y-1">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-medium text-destructive">{t.importantNotice}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t.refundPolicy}
                </p>
                <a 
                  href="mailto:contact@dragongp.ai"
                  className="text-xs text-dragon hover:underline"
                >
                  contact@dragongp.ai
                </a>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 h-9 text-sm"
                  onClick={() => onOpenChange(false)}
                >
                  {t.cancelButton}
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1 h-9 text-sm"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !canSubmit}
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
      </DialogContent>
    </Dialog>
  );
};

export default UnsubscribeDialog;
