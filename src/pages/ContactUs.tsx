import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Send, Star, Mail, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

const translations = {
  en: {
    title: "Contact Us",
    subtitle: "We'd love to hear from you",
    name: "Name",
    namePlaceholder: "Your full name",
    email: "Email",
    emailPlaceholder: "your.email@example.com",
    subject: "Subject",
    subjectPlaceholder: "How can we help you?",
    message: "Message",
    messagePlaceholder: "Please describe your inquiry...",
    rating: "Rate your experience",
    ratingScale: "(1-5)",
    marketingNote: "We may feature your comments on our homepage.",
    submit: "Send Message",
    sending: "Sending...",
    back: "Back",
    successTitle: "Thank You! 🎉",
    successMessage: "A confirmation email has been sent to your inbox from dragongpai@gmail.com.",
    errorTitle: "Error",
    errorMessage: "Failed to send message. Please try again later.",
    contactDetails: "Contact Details",
    emailUs: "Email Us",
    socialPreferences: "Where do you follow us?",
    others: "Others",
    othersPlaceholder: "Other platforms...",
    messageUs: "Message Us",
  },
  "zh-TW": {
    title: "聯絡我們",
    subtitle: "我們很樂意收到您的來信",
    name: "姓名",
    namePlaceholder: "您的全名",
    email: "電郵",
    emailPlaceholder: "your.email@example.com",
    subject: "主題",
    subjectPlaceholder: "我們能如何幫助您？",
    message: "訊息",
    messagePlaceholder: "請描述您的問題...",
    rating: "體驗評分",
    ratingScale: "(1-5)",
    marketingNote: "我們可能會在首頁展示您的評論。",
    submit: "發送訊息",
    sending: "發送中...",
    back: "返回",
    successTitle: "感謝您！🎉",
    successMessage: "確認郵件已發送至您的信箱（來自 dragongpai@gmail.com）。",
    errorTitle: "錯誤",
    errorMessage: "發送失敗。請稍後再試。",
    contactDetails: "聯絡方式",
    emailUs: "電郵聯絡",
    socialPreferences: "您在哪裡關注我們？",
    others: "其他",
    othersPlaceholder: "其他平台...",
    messageUs: "留言給我們",
  },
  "zh-CN": {
    title: "联系我们",
    subtitle: "我们很乐意收到您的来信",
    name: "姓名",
    namePlaceholder: "您的全名",
    email: "邮箱",
    emailPlaceholder: "your.email@example.com",
    subject: "主题",
    subjectPlaceholder: "我们能如何帮助您？",
    message: "消息",
    messagePlaceholder: "请描述您的问题...",
    rating: "体验评分",
    ratingScale: "(1-5)",
    marketingNote: "我们可能会在首页展示您的评论。",
    submit: "发送消息",
    sending: "发送中...",
    back: "返回",
    successTitle: "感谢您！🎉",
    successMessage: "确认邮件已发送至您的邮箱（来自 dragongpai@gmail.com）。",
    errorTitle: "错误",
    errorMessage: "发送失败。请稍后再试。",
    contactDetails: "联系方式",
    emailUs: "邮件联系",
    socialPreferences: "您在哪里关注我们？",
    others: "其他",
    othersPlaceholder: "其他平台...",
    messageUs: "留言给我们",
  },
};

const ContactUs = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const t = translations[language];
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    rating: 0,
  });
  const [socialMedia, setSocialMedia] = useState({
    facebook: false,
    instagram: false,
    youtube: false,
    twitter: false,
    others: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (platform: string, checked: boolean) => {
    setSocialMedia((prev) => ({ ...prev, [platform]: checked }));
  };

  const handleRatingClick = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.rating === 0) {
      toast({
        title: t.errorTitle,
        description: t.rating,
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          rating: formData.rating,
          socialMedia: socialMedia,
        },
      });

      if (error) throw error;

      toast({
        title: t.successTitle,
        description: t.successMessage,
      });
      setFormData({ name: "", email: "", subject: "", message: "", rating: 0 });
      setSocialMedia({ facebook: false, instagram: false, youtube: false, twitter: false, others: "" });
    } catch (error) {
      console.error("Error submitting contact form:", error);
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
      
      <main className="flex-1 pt-14 overflow-hidden flex items-center">
        <div 
          className="container mx-auto px-4 overflow-y-auto" 
          style={{ maxHeight: "80vh" }}
        >
          {/* Back Button + Header */}
          <div className="flex items-center gap-4 mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              {t.back}
            </Button>
          </div>
          <div className="text-center mb-2">
            <h1 className="font-bold text-foreground" style={{ fontSize: "1.5rem" }}>{t.title}</h1>
            <p className="text-muted-foreground text-xs mt-0.5">{t.subtitle}</p>
          </div>

          {/* Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 max-w-4xl mx-auto">
            {/* Left Column - Contact Details & Social Preferences */}
            <div className="space-y-2">
              {/* Contact Details */}
              <div className="bg-card/50 backdrop-blur-sm border border-dragon/20 rounded-lg p-3">
                <h2 className="font-semibold text-foreground mb-2" style={{ fontSize: "1rem" }}>{t.contactDetails}</h2>
                
                {/* Email */}
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-dragon/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-3.5 h-3.5 text-dragon" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">{t.emailUs}</p>
                    <a 
                      href="mailto:dragongpai@gmail.com" 
                      className="text-xs text-muted-foreground hover:text-dragon transition-colors"
                    >
                      dragongpai@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Social Media Preferences */}
              <div className="bg-card/50 backdrop-blur-sm border border-dragon/20 rounded-lg p-2">
                <h2 className="font-semibold text-foreground mb-1" style={{ fontSize: "1rem" }}>{t.socialPreferences}</h2>
                
                <div className="grid grid-cols-2 gap-1 mb-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="facebook" 
                      checked={socialMedia.facebook}
                      onCheckedChange={(checked) => handleSocialChange("facebook", checked as boolean)}
                    />
                    <label htmlFor="facebook" className="text-sm text-foreground cursor-pointer">Facebook</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="instagram" 
                      checked={socialMedia.instagram}
                      onCheckedChange={(checked) => handleSocialChange("instagram", checked as boolean)}
                    />
                    <label htmlFor="instagram" className="text-sm text-foreground cursor-pointer">Instagram</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="youtube" 
                      checked={socialMedia.youtube}
                      onCheckedChange={(checked) => handleSocialChange("youtube", checked as boolean)}
                    />
                    <label htmlFor="youtube" className="text-sm text-foreground cursor-pointer">YouTube</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="twitter" 
                      checked={socialMedia.twitter}
                      onCheckedChange={(checked) => handleSocialChange("twitter", checked as boolean)}
                    />
                    <label htmlFor="twitter" className="text-sm text-foreground cursor-pointer">X (Twitter)</label>
                  </div>
                </div>

                {/* Others Input */}
                <div className="flex items-center gap-2">
                  <Label htmlFor="others" className="text-sm whitespace-nowrap">{t.others}:</Label>
                  <Input
                    id="others"
                    type="text"
                    placeholder={t.othersPlaceholder}
                    value={socialMedia.others}
                    onChange={(e) => setSocialMedia(prev => ({ ...prev, others: e.target.value }))}
                    className="bg-background/50 h-7 text-sm flex-1"
                    style={{ fontSize: "1.1rem" }}
                  />
                </div>
              </div>

              {/* Marketing Note */}
              <p className="text-xs text-muted-foreground italic border-l-2 border-dragon/30 pl-2">
                {t.marketingNote}
              </p>
            </div>

            {/* Right Column - Form */}
            <div className="bg-card/50 backdrop-blur-sm border border-dragon/20 rounded-lg p-2">
              <h2 className="font-semibold text-foreground mb-1" style={{ fontSize: "1rem" }}>{t.messageUs}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-2">
                {/* Name & Email in one row */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="name" style={{ fontSize: "1rem" }}>{t.name}</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder={t.namePlaceholder}
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="bg-background/50 h-7 py-0.5 px-2"
                      style={{ fontSize: "1.1rem" }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" style={{ fontSize: "1rem" }}>{t.email}</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder={t.emailPlaceholder}
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-background/50 h-7 py-0.5 px-2"
                      style={{ fontSize: "1.1rem" }}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject" style={{ fontSize: "1rem" }}>{t.subject}</Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder={t.subjectPlaceholder}
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="bg-background/50 h-7 py-0.5 px-2"
                    style={{ fontSize: "1.1rem" }}
                  />
                </div>

                <div>
                  <Label htmlFor="message" style={{ fontSize: "1rem" }}>{t.message}</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder={t.messagePlaceholder}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="bg-background/50 resize-none py-1 px-2"
                    style={{ fontSize: "1.1rem", height: "100px" }}
                  />
                </div>

                {/* Star Rating - Compact */}
                <div className="flex items-center gap-2">
                  <Label style={{ fontSize: "1rem" }} className="whitespace-nowrap">
                    {t.rating} <span className="text-muted-foreground text-xs">{t.ratingScale}</span>
                  </Label>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingClick(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="p-0.5 transition-transform hover:scale-110 focus:outline-none focus:ring-1 focus:ring-dragon rounded"
                      >
                        <Star
                          className={`w-5 h-5 transition-colors ${
                            star <= (hoveredRating || formData.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* High-contrast Submit Button - flex-shrink-0 ensures visibility */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-dragon hover:bg-dragon/90 text-white font-semibold h-9 flex-shrink-0"
                  style={{ fontSize: "1.1rem" }}
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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactUs;
