import { useLanguage } from "@/contexts/LanguageContext";
import { Progress } from "@/components/ui/progress";
import { Brain } from "lucide-react";
import { useMemo } from "react";

interface DashboardHeaderProps {
  email: string | null;
}

const DashboardHeader = ({ email }: DashboardHeaderProps) => {
  const { language } = useLanguage();

  const vitalityPercent = useMemo(() => Math.floor(Math.random() * 30) + 65, []);

  const username = email?.split("@")[0] || "Explorer";

  const t = {
    en: {
      welcome: `Welcome back, ${username}!`,
      vitality: `Your brain is ${vitalityPercent}% active today.`,
      mentalVitality: "Mental Vitality",
    },
    "zh-TW": {
      welcome: `歡迎回來，${username}！`,
      vitality: `您的大腦今天活躍度為 ${vitalityPercent}%。`,
      mentalVitality: "腦力活力",
    },
    "zh-CN": {
      welcome: `欢迎回来，${username}！`,
      vitality: `您的大脑今天活跃度为 ${vitalityPercent}%。`,
      mentalVitality: "脑力活力",
    },
  }[language] || {
    welcome: `Welcome back, ${username}!`,
    vitality: `Your brain is ${vitalityPercent}% active today.`,
    mentalVitality: "Mental Vitality",
  };

  return (
    <div className="mb-8">
      <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
        {t.welcome}
      </h1>
      <p className="text-muted-foreground text-lg mb-4">{t.vitality}</p>
      <div className="flex items-center gap-3 max-w-sm">
        <Brain className="w-5 h-5 text-primary shrink-0" />
        <span className="text-xs text-muted-foreground whitespace-nowrap">{t.mentalVitality}</span>
        <Progress value={vitalityPercent} className="h-2 flex-1 bg-secondary" />
        <span className="text-xs font-semibold text-primary">{vitalityPercent}%</span>
      </div>
    </div>
  );
};

export default DashboardHeader;
