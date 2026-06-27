import { useState } from "react";
import { Link } from "react-router-dom";
import dragonEnglish from "@/assets/dragon-ai-english.png";
import DisclaimerDialog from "./DisclaimerDialog";
import TermsOfServiceDialog from "./TermsOfServiceDialog";
import RefundPolicyDialog from "./RefundPolicyDialog";
import PrivacyPolicyDialog from "./PrivacyPolicyDialog";
import UnsubscribeDialog from "./UnsubscribeDialog";
import { useLanguage } from "@/contexts/LanguageContext";

const footerTranslations = {
  en: {
    affiliate: "Affiliate",
    contactUs: "Contact Us",
    pricing: "Pricing",
    unsubscribe: "Unsubscribe",
    privacyPolicy: "Privacy Policy",
    refundPolicy: "Refund Policy",
    termsOfService: "Terms of Service",
    disclaimer: "Disclaimer",
  },
  "zh-TW": {
    affiliate: "聯盟推廣",
    contactUs: "聯絡我們",
    pricing: "定價",
    unsubscribe: "取消訂閱",
    privacyPolicy: "隱私政策",
    refundPolicy: "退款政策",
    termsOfService: "服務條款",
    disclaimer: "免責聲明",
  },
  "zh-CN": {
    affiliate: "联盟推广",
    contactUs: "联系我们",
    pricing: "定价",
    unsubscribe: "取消订阅",
    privacyPolicy: "隐私政策",
    refundPolicy: "退款政策",
    termsOfService: "服务条款",
    disclaimer: "免责声明",
  },
};

const Footer = () => {
  const { language } = useLanguage();
  const t = footerTranslations[language];
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [refundOpen, setRefundOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [unsubscribeOpen, setUnsubscribeOpen] = useState(false);

  return (
    <>
      <footer id="community" className="py-1.5 pt-6 md:pt-4 mt-4 md:mt-2 border-t border-border relative flex-shrink-0 bg-card/50">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Single Row Footer - Everything on one line */}
          <div className="flex flex-row items-center justify-between gap-2 flex-wrap">
            {/* Logo */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <img 
                src={dragonEnglish} 
                alt="DragonGP AI" 
                className="h-5 w-auto"
              />
              <span className="text-muted-foreground whitespace-nowrap" style={{ fontSize: "0.8rem" }}>
                © 2026 DragonGp.Ai 🐉
              </span>
            </div>

            {/* All Links in Single Row */}
            <div className="flex flex-row items-center gap-2 flex-wrap">
              <a 
                href="https://dragongpai.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                style={{ fontSize: "0.8rem" }}
              >
                {t.affiliate}
              </a>
              <span className="text-muted-foreground/50">|</span>
              <Link 
                to="/contact" 
                className="text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                style={{ fontSize: "0.8rem" }}
              >
                {t.contactUs}
              </Link>
              <span className="text-muted-foreground/50">|</span>
              <Link 
                to="/pricing" 
                className="text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                style={{ fontSize: "0.8rem" }}
              >
                {t.pricing}
              </Link>
              <span className="text-muted-foreground/50">|</span>
              <button
                onClick={() => setUnsubscribeOpen(true)}
                className="text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                style={{ fontSize: "0.8rem" }}
              >
                {t.unsubscribe}
              </button>
              <span className="text-muted-foreground/50">|</span>
              <button
                onClick={() => setPrivacyOpen(true)}
                className="text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                style={{ fontSize: "0.8rem" }}
              >
                {t.privacyPolicy}
              </button>
              <span className="text-muted-foreground/50">|</span>
              <button
                onClick={() => setRefundOpen(true)}
                className="text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                style={{ fontSize: "0.8rem" }}
              >
                {t.refundPolicy}
              </button>
              <span className="text-muted-foreground/50">|</span>
              <button
                onClick={() => setTermsOpen(true)}
                className="text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                style={{ fontSize: "0.8rem" }}
              >
                {t.termsOfService}
              </button>
              <span className="text-muted-foreground/50">|</span>
              <button
                onClick={() => setDisclaimerOpen(true)}
                className="text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                style={{ fontSize: "0.8rem" }}
              >
                {t.disclaimer}
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Refund Policy Modal */}
      <RefundPolicyDialog open={refundOpen} onOpenChange={setRefundOpen} />

      {/* Terms of Service Modal */}
      <TermsOfServiceDialog open={termsOpen} onOpenChange={setTermsOpen} />

      {/* Disclaimer Modal */}
      <DisclaimerDialog open={disclaimerOpen} onOpenChange={setDisclaimerOpen} />

      {/* Privacy Policy Modal */}
      <PrivacyPolicyDialog open={privacyOpen} onOpenChange={setPrivacyOpen} />

      {/* Unsubscribe Modal */}
      <UnsubscribeDialog open={unsubscribeOpen} onOpenChange={setUnsubscribeOpen} />
    </>
  );
};

export default Footer;
