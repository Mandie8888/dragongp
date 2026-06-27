import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Send, MessageSquare } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const translations = {
  en: {
    title: "Feedback",
    subtitle: "Your comments help us improve",
    name: "Name (Optional)",
    namePlaceholder: "Your name or nickname",
    email: "Email",
    emailPlaceholder: "your.email@example.com",
    comments: "Your Comments",
    commentsPlaceholder: "Share your thoughts, suggestions, or feedback with us...",
    submit: "Submit Feedback",
    sending: "Sending...",
    successTitle: "Thank You!",
    successMessage: "Thank you for your feedback!",
    errorTitle: "Error",
    errorMessage: "Failed to send feedback. Please try again later.",
    privacyNote: "We will never display your full name or personal contact details publicly.",
    // Disclaimer Modal
    disclaimerTitle: "Feedback & Testimonial Disclaimer",
    disclaimerPolicy: "User Feedback Policy",
    disclaimerIntro: "By submitting your feedback or comments to contact@dragongp.ai, you acknowledge and agree to the following:",
    consent: "Consent for Use",
    consentText: "You grant DragonGP AI permission to use your feedback for marketing, promotional, and branding purposes on our website or social media.",
    privacy: "Privacy Protection",
    privacyText: "To protect your privacy, we will never display your full name or personal contact details. We will only use a \"Hidden Name\" format (e.g., \"Mr. W from HK\" or \"User A123\").",
    optOut: "Opt-Out",
    optOutText: "If you do not wish for your feedback to be used publicly, please include the phrase \"DO NOT PUBLISH\" in your message.",
    noCompensation: "No Compensation",
    noCompensationText: "You understand that the use of your feedback is voluntary and does not entitle you to any royalties or compensation.",
    acceptAndSend: "Accept & Send",
    cancel: "Cancel",
  },
  "zh-TW": {
    title: "意見回饋",
    subtitle: "您的建議幫助我們改進",
    name: "姓名（選填）",
    namePlaceholder: "您的姓名或暱稱",
    email: "電郵",
    emailPlaceholder: "your.email@example.com",
    comments: "您的建議",
    commentsPlaceholder: "與我們分享您的想法、建議或回饋...",
    submit: "提交回饋",
    sending: "發送中...",
    successTitle: "感謝您！",
    successMessage: "感謝您的意見！",
    errorTitle: "錯誤",
    errorMessage: "發送失敗。請稍後再試。",
    privacyNote: "我們絕不會公開顯示您的全名或個人聯絡資料。",
    // Disclaimer Modal
    disclaimerTitle: "意見回饋與證言聲明",
    disclaimerPolicy: "用戶意見回饋條約",
    disclaimerIntro: "當您向 contact@dragongp.ai 提交意見或評論時，即代表您理解並同意以下事項：",
    consent: "授權使用",
    consentText: "您授權 DragonGP AI 將您的回饋用於本網站或社群媒體的營銷、推廣及品牌建設用途。",
    privacy: "隱私保護",
    privacyText: "為保護您的個人隱私，我們絕不會顯示您的全名或詳細聯絡資料。我們僅會以「隱藏姓名」的方式呈現（例如：「來自香港的 W 先生」或「用戶 A123」）。",
    optOut: "拒絕公開",
    optOutText: "若您不希望您的回饋被公開引用，請在郵件中註明「請勿公開」字樣。",
    noCompensation: "無補償聲明",
    noCompensationText: "您理解此類回饋的使用均屬自願性質，不涉及任何版權費或報酬。",
    acceptAndSend: "接受並發送",
    cancel: "取消",
  },
  "zh-CN": {
    title: "意见回馈",
    subtitle: "您的建议帮助我们改进",
    name: "姓名（选填）",
    namePlaceholder: "您的姓名或昵称",
    email: "邮箱",
    emailPlaceholder: "your.email@example.com",
    comments: "您的建议",
    commentsPlaceholder: "与我们分享您的想法、建议或反馈...",
    submit: "提交回馈",
    sending: "发送中...",
    successTitle: "感谢您！",
    successMessage: "感谢您的意见！",
    errorTitle: "错误",
    errorMessage: "发送失败。请稍后再试。",
    privacyNote: "我们绝不会公开显示您的全名或个人联系资料。",
    // Disclaimer Modal
    disclaimerTitle: "意见回馈与证言声明",
    disclaimerPolicy: "用户意见回馈条款",
    disclaimerIntro: "当您向 contact@dragongp.ai 提交意见或评论时，即代表您理解并同意以下事项：",
    consent: "授权使用",
    consentText: "您授权 DragonGP AI 将您的反馈用于本网站或社交媒体的营销、推广及品牌建设用途。",
    privacy: "隐私保护",
    privacyText: "为保护您的个人隐私，我们绝不会显示您的全名或详细联系资料。我们仅会以「隐藏姓名」的方式呈现（例如：「来自香港的 W 先生」或「用户 A123」）。",
    optOut: "拒绝公开",
    optOutText: "若您不希望您的反馈被公开引用，请在邮件中注明「请勿公开」字样。",
    noCompensation: "无补偿声明",
    noCompensationText: "您理解此类反馈的使用均属自愿性质，不涉及任何版权费或报酬。",
    acceptAndSend: "接受并发送",
    cancel: "取消",
  },
};

const Feedback = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const t = translations[language];
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    comments: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getValidationMessage = () => {
    if (language === "en") return "Please fill in required fields.";
    if (language === "zh-TW") return "請填寫必填欄位。";
    return "请填写必填栏位。";
  };

  const handleSubmitClick = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email is provided
    if (!formData.email || !formData.comments) {
      toast({
        title: t.errorTitle,
        description: getValidationMessage(),
        variant: "destructive",
      });
      return;
    }
    
    // Show disclaimer modal instead of sending immediately
    setShowDisclaimer(true);
  };

  const handleAcceptAndSend = async () => {
    setIsSubmitting(true);
    setShowDisclaimer(false);

    try {
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: {
          name: formData.name || "Anonymous",
          email: formData.email,
          subject: "User Feedback",
          message: formData.comments,
          rating: 5, // Default to 5 stars for general feedback (database requires 1-5)
        },
      });

      if (error) throw error;

      // Clear the form
      setFormData({ name: "", email: "", comments: "" });
      
      // Show success toast
      toast({
        title: t.successTitle,
        description: t.successMessage,
      });
      
      // Redirect to home page
      navigate("/");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: t.errorTitle,
        description: t.errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <Navbar />
      
      <main className="flex-1 pt-14 overflow-hidden flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-dragon/10 mb-4">
              <MessageSquare className="w-8 h-8 text-dragon" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">{t.title}</h1>
            <p className="text-muted-foreground text-sm mt-1">{t.subtitle}</p>
          </div>

          {/* Form Card */}
          <div className="bg-card/50 backdrop-blur-sm border border-dragon/20 rounded-lg p-6">
            <form onSubmit={handleSubmitClick} className="space-y-4">
              {/* Name & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-sm">{t.name}</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder={t.namePlaceholder}
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-background/50 mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm">{t.email} *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={t.emailPlaceholder}
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-background/50 mt-1"
                  />
                </div>
              </div>

              {/* Comments Textarea */}
              <div>
                <Label htmlFor="comments" className="text-sm">{t.comments} *</Label>
                <Textarea
                  id="comments"
                  name="comments"
                  placeholder={t.commentsPlaceholder}
                  value={formData.comments}
                  onChange={handleChange}
                  required
                  className="bg-background/50 resize-none mt-1 min-h-[150px]"
                />
              </div>

              {/* Privacy Note */}
              <p className="text-xs text-muted-foreground italic border-l-2 border-dragon/30 pl-3">
                {t.privacyNote}
              </p>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-dragon hover:bg-dragon/90 text-white font-semibold h-11 flex-shrink-0"
              >
                {isSubmitting ? (
                  t.sending
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    {t.submit}
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </main>

      {/* Disclaimer Modal */}
      <Dialog open={showDisclaimer} onOpenChange={setShowDisclaimer}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-dragon">
              {t.disclaimerTitle}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {t.disclaimerPolicy}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <p className="text-sm text-foreground">
              {t.disclaimerIntro}
            </p>

            <div className="space-y-3">
              {/* 1. Consent for Use */}
              <div className="bg-muted/50 rounded-lg p-3">
                <h4 className="font-semibold text-foreground text-sm mb-1">
                  1. {t.consent}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {t.consentText}
                </p>
              </div>

              {/* 2. Privacy Protection */}
              <div className="bg-muted/50 rounded-lg p-3">
                <h4 className="font-semibold text-foreground text-sm mb-1">
                  2. {t.privacy}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {t.privacyText}
                </p>
              </div>

              {/* 3. Opt-Out */}
              <div className="bg-muted/50 rounded-lg p-3">
                <h4 className="font-semibold text-foreground text-sm mb-1">
                  3. {t.optOut}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {t.optOutText}
                </p>
              </div>

              {/* 4. No Compensation */}
              <div className="bg-muted/50 rounded-lg p-3">
                <h4 className="font-semibold text-foreground text-sm mb-1">
                  4. {t.noCompensation}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {t.noCompensationText}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setShowDisclaimer(false)}
              className="flex-1"
            >
              {t.cancel}
            </Button>
            <Button
              onClick={handleAcceptAndSend}
              disabled={isSubmitting}
              className="flex-1 bg-dragon hover:bg-dragon/90 text-white font-semibold"
            >
              {isSubmitting ? t.sending : t.acceptAndSend}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Feedback;
