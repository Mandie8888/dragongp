import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Settings as SettingsIcon } from "lucide-react";

const Settings = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const translations = {
    en: {
      title: "Account Settings",
      comingSoon: "Coming Soon: Customize your experience here.",
      backHome: "Back to Home"
    },
    "zh-TW": {
      title: "帳戶設定",
      comingSoon: "即將推出：在此自訂您的體驗。",
      backHome: "返回首頁"
    },
    "zh-CN": {
      title: "账户设置",
      comingSoon: "即将推出：在此自定义您的体验。",
      backHome: "返回首页"
    }
  };

  const t = translations[language] || translations.en;

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center p-8">
      <div className="text-center max-w-2xl">
        <div className="flex items-center justify-center gap-4 mb-8">
          <SettingsIcon className="w-16 h-16 text-gray-400" />
          <h1 className="text-5xl md:text-6xl font-bold text-white">{t.title}</h1>
        </div>
        
        <div className="bg-[#1E293B] border border-gray-600 rounded-2xl p-8 mb-8">
          <p className="text-2xl md:text-3xl text-gray-300 leading-relaxed">
            {t.comingSoon}
          </p>
        </div>

        <Button
          onClick={() => navigate("/")}
          size="lg"
          className="text-xl px-8 py-6 bg-primary hover:bg-primary/90"
        >
          <ArrowLeft className="w-6 h-6 mr-2" />
          {t.backHome}
        </Button>
      </div>
    </div>
  );
};

export default Settings;
