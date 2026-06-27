import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Brain, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CreditsDepletedPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreditsDepletedPopup = ({
  open,
  onOpenChange,
}: CreditsDepletedPopupProps) => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const content = {
    en: {
      headline: "AI Energy Depleted",
      body: "Your AI Energy is depleted. Click Top-Up to keep your Mental Gym active.",
      upgradeButton: "TOP-UP",
    },
    tc: {
      headline: "AI 能量耗盡",
      body: "您的 AI 能量已耗盡。點擊充值以保持您的心靈體操活躍。",
      upgradeButton: "充值",
    },
    sc: {
      headline: "AI 能量耗尽",
      body: "您的 AI 能量已耗尽。点击充值以保持您的心灵体操活跃。",
      upgradeButton: "充值",
    },
  };

  const t = content[language === "zh-TW" ? "tc" : language === "zh-CN" ? "sc" : "en"] || content.en;

  const handleUpgrade = () => {
    onOpenChange(false);
    navigate("/pricing");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-md border-0 overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #1E293B 0%, #0F172A 100%)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px -10px rgba(59, 130, 246, 0.3)'
        }}
      >
        {/* Subtle blue glow accent */}
        <div 
          className="absolute top-0 left-0 right-0 h-1"
          style={{
            background: 'linear-gradient(90deg, #3B82F6, #60A5FA, #3B82F6)'
          }}
        />

        <DialogHeader className="text-center space-y-4 pt-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div 
              className="relative p-4 rounded-full"
              style={{
                background: 'linear-gradient(145deg, #1E40AF 0%, #3B82F6 100%)',
                boxShadow: '0 0 30px -5px rgba(59, 130, 246, 0.6)'
              }}
            >
              <Brain className="w-10 h-10 text-white" />
              <Zap className="absolute -top-1 -right-1 w-5 h-5 text-yellow-400" />
            </div>
          </div>

          <DialogTitle className="text-2xl md:text-3xl font-bold text-white">
            {t.headline}
          </DialogTitle>

          <DialogDescription className="text-[#94A3B8] text-base leading-relaxed px-4">
            {t.body}
          </DialogDescription>
        </DialogHeader>

        {/* Action button */}
        <div className="mt-8 pb-4 px-4">
          <Button
            onClick={handleUpgrade}
            className="w-full py-6 text-lg font-bold text-white relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 50%, #60A5FA 100%)',
              boxShadow: '0 10px 30px -10px rgba(59, 130, 246, 0.5)'
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Zap className="w-5 h-5" />
              {t.upgradeButton}
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
