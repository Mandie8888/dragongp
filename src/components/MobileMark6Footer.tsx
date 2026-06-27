import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sparkles } from "lucide-react";

const translations = {
  en: {
    cta: "Go to AI Mark6 Probability Game Now",
  },
  "zh-TW": {
    cta: "立即前往 AI 六合彩概率遊戲",
  },
  "zh-CN": {
    cta: "立即前往 AI 六合彩概率游戏",
  },
};

const MobileMark6Footer = () => {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-3 md:hidden z-50 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/95 to-transparent pt-8">
      <Link
        to="/mark6-game"
        className="flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-gradient-to-r from-[#22C55E] to-[#16A34A] hover:from-[#16A34A] hover:to-[#15803D] text-white font-bold text-sm rounded-xl shadow-lg shadow-green-500/30 transition-all duration-300 active:scale-[0.98]"
      >
        <Sparkles className="w-5 h-5" />
        <span className="text-center leading-tight">{t.cta}</span>
      </Link>
    </div>
  );
};

export default MobileMark6Footer;
