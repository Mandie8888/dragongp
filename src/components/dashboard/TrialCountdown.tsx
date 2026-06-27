import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Clock, Sparkles } from "lucide-react";

const TRIAL_END = new Date("2026-02-25T00:00:00Z");

const content = {
  en: (d: number) => `Special Festive Trial ends in: ${d} day${d !== 1 ? "s" : ""}`,
  "zh-TW": (d: number) => `新春特別體驗倒數：${d} 天`,
  "zh-CN": (d: number) => `新春特别体验倒数：${d} 天`,
};

export default function TrialCountdown() {
  const { language } = useLanguage();
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    const calc = () => {
      const diff = TRIAL_END.getTime() - Date.now();
      if (diff <= 0) {
        setDaysLeft(null);
      } else {
        setDaysLeft(Math.ceil(diff / (1000 * 60 * 60 * 24)));
      }
    };
    calc();
    const interval = setInterval(calc, 60000);
    return () => clearInterval(interval);
  }, []);

  if (daysLeft === null) return null;

  const t = content[language] || content.en;

  return (
    <div
      className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold"
      style={{
        background: "linear-gradient(135deg, rgba(255, 215, 0, 0.12) 0%, rgba(255, 68, 68, 0.08) 100%)",
        border: "1px solid rgba(255, 215, 0, 0.3)",
        color: "#FFD700",
      }}
    >
      <Sparkles className="w-4 h-4 text-[#FF6B6B] shrink-0" />
      <Clock className="w-3.5 h-3.5 shrink-0 opacity-70" />
      <span>{t(daysLeft)}</span>
    </div>
  );
}
