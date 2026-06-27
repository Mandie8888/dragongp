import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sparkles, Coffee, Crown, Flame } from "lucide-react";

export type PlanType = "explorer" | "coffee" | "pro" | "vip" | "test";

interface PaymentSuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planType: PlanType;
  onStartAnalyzing: () => void;
}

const planContent = {
  explorer: {
    icon: Sparkles,
    headline: "Welcome, Explorer! 🎁",
    headlineCN: "欢迎，探索者！🎁",
    body: "Your 5 free credits have been activated with 48-hour access. Explore our AI probability analysis and train your decision-making mind.",
    bodyCN: "您的5个免费积分已激活，享有48小时访问权限。探索我们的AI概率分析，训练您的决策思维。",
    credits: 5,
    accentColor: "from-emerald-500 to-green-600",
  },
  coffee: {
    icon: Coffee,
    headline: "Coffee Boost Activated! ☕",
    headlineCN: "咖啡能量已激活！☕",
    body: "Your 5 credits have been added to your balance. You're ready for your next probability exercise. Let's see what the data says.",
    bodyCN: "您的5个积分已添加到余额中。您已准备好进行下一次概率练习。让我们看看数据怎么说。",
    credits: 5,
    accentColor: "from-amber-600 to-orange-500",
  },
  pro: {
    icon: Flame,
    headline: "Welcome to the Pro Circle!",
    headlineCN: "欢迎加入专业圈子！",
    body: "You now have 28 monthly credits. Your access to RSI, MACD, and Gaming Probability is now fully unlocked. Time to rewire your perspective.",
    bodyCN: "您现在拥有28个月度积分。您对RSI、MACD和游戏概率的访问已完全解锁。是时候重塑您的视角了。",
    credits: 28,
    accentColor: "from-blue-500 to-blue-600",
  },
  vip: {
    icon: Crown,
    headline: "VIP Status Active 🐉",
    headlineCN: "VIP状态已激活 🐉",
    body: "60 credits are now at your command. You have the highest volume of AI Probability Analysis available. Let's get to work.",
    bodyCN: "60个积分现在由您掌控。您拥有最大量的AI概率分析。让我们开始工作吧。",
    credits: 60,
    accentColor: "from-gold-400 via-dragon to-gold-600",
  },
  test: {
    icon: Sparkles,
    headline: "Test Mode Active! 🧪",
    headlineCN: "测试模式已激活！🧪",
    body: "Your 10 test credits have been added. You can now test the full report generation flow.",
    bodyCN: "您的10个测试积分已添加。您现在可以测试完整的报告生成流程。",
    credits: 10,
    accentColor: "from-red-500 to-dragon",
  },
};

export function PaymentSuccessModal({
  open,
  onOpenChange,
  planType,
  onStartAnalyzing,
}: PaymentSuccessModalProps) {
  const { language } = useLanguage();
  const content = planContent[planType];
  const IconComponent = content.icon;

  const handleStartAnalyzing = () => {
    onStartAnalyzing();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gradient-card border-2 border-gold/30 shadow-dragon">
        {/* Decorative dragon glow effect */}
        <div className="absolute -inset-1 bg-gradient-dragon rounded-xl opacity-20 blur-xl -z-10" />
        
        <DialogHeader className="text-center space-y-4 pt-4">
          {/* Icon with glow */}
          <div className="flex justify-center">
            <div className={`relative p-4 rounded-full bg-gradient-to-br ${content.accentColor}`}>
              <IconComponent className="w-10 h-10 text-white" />
              <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-gold-400 animate-pulse-glow" />
            </div>
          </div>

          <DialogTitle className="font-display text-2xl md:text-3xl text-gradient-gold">
            {language === "zh-CN" ? content.headlineCN : content.headline}
          </DialogTitle>

          <DialogDescription className="text-foreground/80 text-base leading-relaxed px-2">
            {language === "zh-CN" ? content.bodyCN : content.body}
          </DialogDescription>
        </DialogHeader>

        {/* Credits added indicator */}
        <div className="flex justify-center my-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30">
            <span className="text-gold font-semibold text-lg">+{content.credits}</span>
            <span className="text-muted-foreground text-sm">
              {language === "zh-CN" ? "积分已添加" : "Credits Added"}
            </span>
          </div>
        </div>

        {/* Action button */}
        <div className="flex flex-col gap-3 mt-2 pb-2">
          <Button
            onClick={handleStartAnalyzing}
            className="w-full btn-hero py-6 text-lg font-semibold relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              {language === "zh-CN" ? "前往 Mark6 游戏" : language === "zh-TW" ? "前往 Mark6 遊戲" : "Go to Mark6 Game"}
            </span>
          </Button>
          
          <p className="text-center text-xs text-muted-foreground">
            {language === "zh-CN" 
              ? "您的积分余额已自动更新"
              : language === "zh-TW"
              ? "您的積分餘額已自動更新"
              : "Your credit balance has been automatically updated"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
