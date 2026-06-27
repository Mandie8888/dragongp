import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { characters } from "@/components/mark6/CharacterData";
import dragonLogo from "@/assets/dragon-logo.png";
import goddessImg from "@/assets/characters/goddess-of-fortune.png";

const POPUP_KEY = "dragongp_lunar_valentine_2026";
const TRIAL_END = new Date("2026-02-25T00:00:00Z");

const allPartners = [
  { image: dragonLogo, name: { en: "Dragon", "zh-TW": "龍", "zh-CN": "龙" } },
  ...characters.map((c) => ({ image: c.image, name: c.name })),
  { image: goddessImg, name: { en: "Goddess of Fortune", "zh-TW": "財神娘娘", "zh-CN": "财神娘娘" } },
];

const content = {
  en: {
    title: "🧧 Happy Lunar New Year & Valentine's Day!",
    subtitle: "Good Luck & Mental Vitality!",
    desc: "Your 10 gifted credits are ready. May this year bring wisdom, fortune, and clarity to your analysis journey!",
    cta: "Let's Celebrate! 🎉",
  },
  "zh-TW": {
    title: "🧧 恭賀新禧 · 情人節快樂！",
    subtitle: "祝您好運、腦力充沛！",
    desc: "您的10個贈送積分已就緒。願新的一年為您的分析之旅帶來智慧、財富和洞察力！",
    cta: "開始慶祝！🎉",
  },
  "zh-CN": {
    title: "🧧 恭贺新禧 · 情人节快乐！",
    subtitle: "祝您好运、脑力充沛！",
    desc: "您的10个赠送积分已就绪。愿新的一年为您的分析之旅带来智慧、财富和洞察力！",
    cta: "开始庆祝！🎉",
  },
};

export default function LunarValentinePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    if (new Date() >= TRIAL_END) return;
    const alreadyShown = localStorage.getItem(POPUP_KEY);
    if (alreadyShown) return;

    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setTimeout(() => setIsOpen(true), 800);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" && !localStorage.getItem(POPUP_KEY)) {
        setTimeout(() => setIsOpen(true), 800);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleClose = () => {
    localStorage.setItem(POPUP_KEY, "true");
    setIsOpen(false);
  };

  const t = content[language] || content.en;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-md border-0 p-0 overflow-hidden z-[300] mx-4 max-h-[90vh] overflow-y-auto"
        style={{
          background: "linear-gradient(135deg, #1a0a0a 0%, #2a1a1e 30%, #1a1a2e 70%, #0a0a0a 100%)",
          boxShadow: "0 0 60px rgba(255, 50, 50, 0.2), 0 0 120px rgba(255, 215, 0, 0.2)",
          border: "2px solid rgba(255, 215, 0, 0.5)",
        }}
      >
        <div className="pt-6 pb-2 text-center">
          <h2
            className="text-lg font-bold mb-1 px-4"
            style={{ color: "#FFD700", textShadow: "0 0 20px rgba(255, 215, 0, 0.5)" }}
          >
            {t.title}
          </h2>
          <p className="text-sm font-semibold" style={{ color: "#FF6B6B" }}>
            {t.subtitle}
          </p>
        </div>

        {/* AI Partners Grid */}
        <div className="px-6 py-4">
          <div className="flex flex-wrap justify-center gap-3">
            {allPartners.map((p, i) => (
              <div key={i} className="flex flex-col items-center gap-1 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div
                  className="w-12 h-12 rounded-full overflow-hidden border-2"
                  style={{
                    borderColor: "rgba(255, 215, 0, 0.6)",
                    boxShadow: "0 0 12px rgba(255, 215, 0, 0.3)",
                  }}
                >
                  <img src={p.image} alt={p.name.en} className="w-full h-full object-cover" />
                </div>
                <span className="text-[9px] text-center max-w-[56px] truncate" style={{ color: "#FFD700" }}>
                  {p.name[language] || p.name.en}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 pb-6 text-center">
          <p className="text-xs mb-4 leading-relaxed" style={{ color: "#E0E0E0" }}>
            {t.desc}
          </p>
          <Button
            onClick={handleClose}
            className="w-full py-5 text-base font-black transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: "linear-gradient(135deg, #FF4444 0%, #FFD700 50%, #FF4444 100%)",
              color: "#fff",
              border: "none",
              boxShadow: "0 0 30px rgba(255, 68, 68, 0.4), 0 0 60px rgba(255, 215, 0, 0.3)",
              textShadow: "0 1px 3px rgba(0,0,0,0.5)",
            }}
          >
            {t.cta}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
