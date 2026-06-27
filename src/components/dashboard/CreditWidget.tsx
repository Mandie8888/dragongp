import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, ArrowUpRight, CalendarClock } from "lucide-react";

interface CreditWidgetProps {
  creditBalance: number;
  tier: string;
}

const CreditWidget = ({ creditBalance, tier }: CreditWidgetProps) => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const t = {
    en: {
      title: "Credits",
      available: "Available",
      topUp: "Quick Top-Up",
      tier: "Current Tier",
      nextRefresh: "Next Refresh",
      monthly: "Monthly renewal",
      noPlan: "No active plan",
    },
    "zh-TW": {
      title: "積分",
      available: "可用",
      topUp: "快速充值",
      tier: "當前等級",
      nextRefresh: "下次刷新",
      monthly: "月度續期",
      noPlan: "無活躍計劃",
    },
    "zh-CN": {
      title: "积分",
      available: "可用",
      topUp: "快速充值",
      tier: "当前等级",
      nextRefresh: "下次刷新",
      monthly: "月度续期",
      noPlan: "无活跃计划",
    },
  }[language] || {
    title: "Credits",
    available: "Available",
    topUp: "Quick Top-Up",
    tier: "Current Tier",
    nextRefresh: "Next Refresh",
    monthly: "Monthly renewal",
    noPlan: "No active plan",
  };

  const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1);
  const isMonthly = tier === "pro" || tier === "vip";

  return (
    <Card className="bg-gradient-card border-border shadow-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-display flex items-center gap-2">
          <Coins className="w-5 h-5 text-primary" />
          {t.title}
        </CardTitle>
        <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary font-semibold uppercase">
          {tierLabel}
        </span>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Big balance */}
        <div>
          <p className="text-5xl font-bold text-gradient-gold font-display">{creditBalance}</p>
          <p className="text-muted-foreground text-sm">{t.available}</p>
        </div>

        {/* Next refresh */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarClock className="w-4 h-4" />
          <span>{isMonthly ? t.monthly : t.noPlan}</span>
        </div>

        {/* Top-Up Button */}
        <Button
          onClick={() => navigate("/pricing")}
          className="w-full bg-gradient-gold text-primary-foreground font-semibold hover:opacity-90"
        >
          {t.topUp}
          <ArrowUpRight className="w-4 h-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default CreditWidget;
