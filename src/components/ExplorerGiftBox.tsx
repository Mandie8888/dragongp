import { useState, useEffect } from "react";
import { Gift, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import SignUpDialog from "./SignUpDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ExplorerGiftBoxProps {
  onGiftClaimed?: () => void;
}

const ExplorerGiftBox = ({ onGiftClaimed }: ExplorerGiftBoxProps) => {
  const { language } = useLanguage();
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [showClaimedPopup, setShowClaimedPopup] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isExplorerClaimed, setIsExplorerClaimed] = useState(false);

  const [isWithin6Months, setIsWithin6Months] = useState(false);

  const content = {
    en: {
      title: "Explorer Gift",
      freeReports: "5 Free Reports",
      benefit1: "Full AI probability",
      benefit2: "48-hour trial",
      claimGift: "Claim Gift",
      noCreditCard: "No credit card",
      alreadyClaimed: "Your gift has been claimed. Please continue.",
      continueBtn: "Continue to Home",
      antiAbuseMessage: "Our records show you have previously claimed this gift. To prevent abuse, the Free Gift is only available once every 6 months for returning subscribers.",
    },
    "zh-TW": {
      title: "探索者禮物",
      freeReports: "5 份免費報告",
      benefit1: "完整 AI 概率",
      benefit2: "48 小時試用",
      claimGift: "領取禮物",
      noCreditCard: "無需信用卡",
      alreadyClaimed: "您已領取過禮物。請繼續使用。",
      continueBtn: "返回首頁",
      antiAbuseMessage: "我們的記錄顯示您之前已領取過此禮物。為防止濫用，免費禮物每 6 個月只能領取一次。",
    },
    "zh-CN": {
      title: "探索者礼物",
      freeReports: "5 份免费报告",
      benefit1: "完整 AI 概率",
      benefit2: "48 小时试用",
      claimGift: "领取礼物",
      noCreditCard: "无需信用卡",
      alreadyClaimed: "您已领取过礼物。请继续使用。",
      continueBtn: "返回首页",
      antiAbuseMessage: "我们的记录显示您之前已领取过此礼物。为防止滥用，免费礼物每 6 个月只能领取一次。",
    },
  };

  const t = content[language] || content.en;

  // Check visibility: show only for new visitors (not subscribers, not claimed within 6 months)
  useEffect(() => {
    const checkVisibility = async () => {
      // DB is the source of truth for authenticated users — check it FIRST.
      // localStorage is only a UX hint for non-authenticated visitors and must
      // never be trusted for anti-abuse decisions (it can be cleared).
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // Non-authenticated visitor: use localStorage purely as a UX hint.
        const localClaimed = localStorage.getItem("explorer_gift_claimed");
        const localClaimedAt = localStorage.getItem("explorer_gift_claimed_at");
        if (localClaimed === "true" && localClaimedAt) {
          const claimedDate = new Date(localClaimedAt);
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
          if (claimedDate <= sixMonthsAgo) {
            localStorage.removeItem("explorer_gift_claimed");
            localStorage.removeItem("explorer_gift_claimed_at");
          }
        }
      }

      // Check if user is authenticated and has claimed (DB is source of truth)
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_explorer_used, tier, explorer_claimed_at")
          .eq("user_id", user.id)
          .maybeSingle();
        
        if (profile?.is_explorer_used && profile?.explorer_claimed_at) {
          const claimedDate = new Date(profile.explorer_claimed_at);
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
          
          if (claimedDate > sixMonthsAgo) {
            // Claimed within 6 months - not eligible
            setIsExplorerClaimed(true);
            setIsWithin6Months(true);
            localStorage.setItem("explorer_gift_claimed", "true");
            localStorage.setItem("explorer_gift_claimed_at", profile.explorer_claimed_at);
            setIsVisible(false);
            return;
          }
          // If claimed over 6 months ago, they can claim again
        }
        
        // If subscriber (not explorer tier), don't show
        if (profile?.tier && profile.tier !== "explorer") {
          setIsVisible(false);
          return;
        }
      }

      // Show the gift box for new visitors
      setIsVisible(true);
    };

    checkVisibility();
  }, []);

  const handleClaimClick = () => {
    // Double-shield: Check again before showing sign-up
    const localClaimed = localStorage.getItem("explorer_gift_claimed");
    const localClaimedAt = localStorage.getItem("explorer_gift_claimed_at");
    
    if ((localClaimed === "true" && localClaimedAt) || isExplorerClaimed) {
      // Check 6-month window
      if (localClaimedAt) {
        const claimedDate = new Date(localClaimedAt);
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        if (claimedDate > sixMonthsAgo) {
          setIsWithin6Months(true);
        }
      }
      setShowClaimedPopup(true);
      return;
    }
    setSignUpOpen(true);
  };

  const handleClaimedPopupClose = () => {
    setShowClaimedPopup(false);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      <SignUpDialog open={signUpOpen} onOpenChange={setSignUpOpen} />
      
      {/* Already Claimed Popup */}
      <Dialog open={showClaimedPopup} onOpenChange={setShowClaimedPopup}>
        <DialogContent className="sm:max-w-md bg-gradient-to-b from-[#1E3A5F] to-[#0F172A] border-[#D4AF37]/60">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-full bg-[#D4AF37]/20">
                <Gift className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <DialogTitle className="text-xl text-white">{content[language]?.title || content.en.title}</DialogTitle>
            </div>
            <DialogDescription className="text-[#CBD5E1] text-base">
              {isWithin6Months ? t.antiAbuseMessage : t.alreadyClaimed}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end mt-4">
            <Button 
              onClick={handleClaimedPopupClose}
              className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-bold hover:opacity-90"
            >
              {t.continueBtn}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Fixed Explorer Gift Box - Top Right on desktop, hidden on mobile to avoid overlap */}
      <div 
        className="fixed z-[50] animate-fade-in hidden md:block top-20 right-4" 
        style={{ animationDelay: "0.4s" }}
      >
        <div 
          className="backdrop-blur-md rounded-lg p-2.5 shadow-xl w-36"
          style={{
            background: "linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(30, 58, 95, 0.95) 50%, rgba(15, 23, 42, 0.98) 100%)",
            border: "1.5px solid #D4AF37",
            boxShadow: "0 0 15px rgba(212, 175, 55, 0.3), 0 0 30px rgba(212, 175, 55, 0.1)",
          }}
        >
          {/* Title Badge */}
          <div 
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full mb-1.5"
            style={{
              background: "linear-gradient(90deg, #D4AF37, #B8860B)",
              boxShadow: "0 0 8px rgba(212, 175, 55, 0.5)",
            }}
          >
            <Gift className="w-2.5 h-2.5 text-black animate-pulse" />
            <span className="text-[8px] font-bold text-black uppercase tracking-wide">{t.title}</span>
          </div>

          {/* Free Reports Title */}
          <h3 className="font-display text-xs font-bold mb-1 leading-tight text-[#D4AF37]">
            {t.freeReports}
          </h3>

          {/* Benefits */}
          <div className="space-y-0.5 mb-1.5">
            {[t.benefit1, t.benefit2].map((benefit, index) => (
              <div key={index} className="flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5 text-[#D4AF37] flex-shrink-0" />
                <span className="text-[8px] text-white/90">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Claim Button */}
          <button 
            className="w-full py-1.5 px-2 rounded-md font-bold text-black text-[10px] transition-all duration-300 relative overflow-hidden group animate-pulse"
            style={{
              background: "linear-gradient(90deg, #D4AF37, #FFD700, #D4AF37)",
              backgroundSize: "200% 100%",
              animation: "shimmer 2s infinite, pulse 2s infinite",
              boxShadow: "0 0 12px rgba(212, 175, 55, 0.6), 0 0 24px rgba(212, 175, 55, 0.4)",
            }}
            onClick={handleClaimClick}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="relative z-10 flex items-center justify-center gap-1">
              <Gift className="w-3 h-3" />
              {t.claimGift}
            </span>
          </button>

          {/* No Credit Card */}
          <p className="text-[8px] text-center mt-1 text-[#D4AF37]/80">
            {t.noCreditCard}
          </p>
        </div>
      </div>
    </>
  );
};

export default ExplorerGiftBox;
