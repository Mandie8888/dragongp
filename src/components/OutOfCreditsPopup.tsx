import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Rocket, Coffee, Sparkles } from "lucide-react";

interface OutOfCreditsPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBuyCoffee: () => void;
  onViewPlans: () => void;
}

export function OutOfCreditsPopup({
  open,
  onOpenChange,
  onBuyCoffee,
  onViewPlans,
}: OutOfCreditsPopupProps) {
  const { language } = useLanguage();

  const content = {
    en: {
      headline: "You've reached your limit! 🚀",
      body: "You have used all your current credits. Top up now to continue your Open Eye exercises.",
      buyCoffee: "Buy a Coffee ($2.00)",
      viewPlans: "View Pro Plans",
    },
    "zh-TW": {
      headline: "您已達到限額！🚀",
      body: "您已使用完所有當前積分。立即充值以繼續您的開眼訓練。",
      buyCoffee: "請喝杯咖啡 ($2.00)",
      viewPlans: "查看專業計劃",
    },
    "zh-CN": {
      headline: "您已达到限额！🚀",
      body: "您已使用完所有当前积分。立即充值以继续您的开眼训练。",
      buyCoffee: "请喝杯咖啡 ($2.00)",
      viewPlans: "查看专业计划",
    },
  };

  const t = content[language] || content.en;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gradient-card border-2 border-dragon/30 shadow-dragon">
        {/* Decorative glow effect */}
        <div className="absolute -inset-1 bg-gradient-dragon rounded-xl opacity-20 blur-xl -z-10" />

        <DialogHeader className="text-center space-y-4 pt-4">
          {/* Icon with glow */}
          <div className="flex justify-center">
            <div className="relative p-4 rounded-full bg-gradient-to-br from-dragon to-gold-500">
              <Rocket className="w-10 h-10 text-white" />
              <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-gold-400 animate-pulse-glow" />
            </div>
          </div>

          <DialogTitle className="font-display text-2xl md:text-3xl text-gradient-gold">
            {t.headline}
          </DialogTitle>

          <DialogDescription className="text-foreground/80 text-base leading-relaxed px-2">
            {t.body}
          </DialogDescription>
        </DialogHeader>

        {/* Action buttons */}
        <div className="flex flex-col gap-3 mt-6 pb-2">
          <Button
            onClick={onBuyCoffee}
            className="w-full btn-hero py-6 text-lg font-semibold relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Coffee className="w-5 h-5" />
              {t.buyCoffee}
            </span>
          </Button>

          <Button
            onClick={onViewPlans}
            variant="outline"
            className="w-full py-6 text-lg font-semibold border-2 border-gold-500/50 text-gold-500 hover:bg-gold-500/10 hover:border-gold-500"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            {t.viewPlans}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
