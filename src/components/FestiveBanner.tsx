import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { X } from "lucide-react";

const TRIAL_END = new Date("2026-02-25T00:00:00Z");

const content = {
  en: "🧧 Happy Lunar New Year & Valentine's! Enjoy 10 days of Free AI Probability Analysis. Gifted credits added to your account!",
  "zh-TW": "🧧 賀新禧、慶元宵！連續10天免費體驗 AI 概率分析。贈送積分已存入您的賬戶！",
  "zh-CN": "🧧 贺新禧、庆元宵！连续10天免费体验 AI 概率分析。赠送积分已存入您的账户！",
};

export default function FestiveBanner() {
  const { language } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (new Date() < TRIAL_END) {
      setVisible(true);
    }
  }, []);

  if (!visible || dismissed) return null;

  return (
    <div
      className="relative w-full py-2.5 px-4 text-center text-xs md:text-sm font-bold z-50"
      style={{
        background: "linear-gradient(90deg, #B8860B 0%, #FFD700 30%, #FFA500 70%, #B8860B 100%)",
        color: "#1a1a1a",
        boxShadow: "0 2px 12px rgba(255, 215, 0, 0.4)",
      }}
    >
      <span className="inline-block max-w-4xl">{content[language] || content.en}</span>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-black/10 transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
