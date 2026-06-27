import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Zap, TrendingUp, Filter, Moon, Star, Crown } from "lucide-react";
import { Character } from "./CharacterData";

interface RiskIntensityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (intensity: number) => void;
  partner: Character | null;
  language: "en" | "zh-TW" | "zh-CN";
}

const content = {
  en: {
    generateBtn: "Generate AI Prediction",
    conservative: "Conservative",
    balanced: "Balanced",
    aggressive: "Aggressive",
    extreme: "Extreme",
  },
  "zh-TW": {
    generateBtn: "生成 AI 預測",
    conservative: "保守",
    balanced: "平衡",
    aggressive: "進取",
    extreme: "極端",
  },
  "zh-CN": {
    generateBtn: "生成 AI 预测",
    conservative: "保守",
    balanced: "平衡",
    aggressive: "进取",
    extreme: "极端",
  },
};

const partnerConfig: Record<string, {
  title: { en: string; "zh-TW": string; "zh-CN": string };
  subtitle: { en: string; "zh-TW": string; "zh-CN": string };
  sliderLabel: { en: string; "zh-TW": string; "zh-CN": string };
  icon: React.ElementType;
  color: string;
  glow: string;
}> = {
  "god-of-gambling": {
    title: {
      en: "God of Gambling's Risk Analysis",
      "zh-TW": "賭神風險分析",
      "zh-CN": "赌神风险分析",
    },
    subtitle: {
      en: "Consecutive Numbers & Trailing Digits",
      "zh-TW": "連號與尾數分析",
      "zh-CN": "连号与尾数分析",
    },
    sliderLabel: {
      en: "Risk Intensity Level",
      "zh-TW": "風險強度等級",
      "zh-CN": "风险强度等级",
    },
    icon: Crown,
    color: "#FFD700",
    glow: "rgba(255, 215, 0, 0.5)",
  },
  "lucky-star": {
    title: {
      en: "Lucky Star's Monte Carlo Setup",
      "zh-TW": "幸運星蒙特卡羅設置",
      "zh-CN": "幸运星蒙特卡罗设置",
    },
    subtitle: {
      en: "1M Simulation Intensity",
      "zh-TW": "百萬模擬強度",
      "zh-CN": "百万模拟强度",
    },
    sliderLabel: {
      en: "Hot/Cold Number Filter",
      "zh-TW": "熱門/冷門號碼過濾",
      "zh-CN": "热门/冷门号码过滤",
    },
    icon: Star,
    color: "#F59E0B",
    glow: "rgba(245, 158, 11, 0.5)",
  },
  achelois: {
    title: {
      en: "Achelois Lunar Phase Analysis",
      "zh-TW": "月光女神月相分析",
      "zh-CN": "月光女神月相分析",
    },
    subtitle: {
      en: "Odd/Even & High/Low Balance",
      "zh-TW": "奇偶與高低平衡",
      "zh-CN": "奇偶与高低平衡",
    },
    sliderLabel: {
      en: "High-Frequency Filter",
      "zh-TW": "高頻過濾器",
      "zh-CN": "高频过滤器",
    },
    icon: Moon,
    color: "#8B5CF6",
    glow: "rgba(139, 92, 246, 0.5)",
  },
};

export function RiskIntensityModal({
  isOpen,
  onClose,
  onConfirm,
  partner,
  language,
}: RiskIntensityModalProps) {
  const [intensity, setIntensity] = useState(50);
  const t = content[language] || content.en;
  
  const config = partner ? partnerConfig[partner.id] : partnerConfig["god-of-gambling"];
  const IconComponent = config?.icon || TrendingUp;

  const getIntensityLabel = (): string => {
    if (intensity <= 25) return t.conservative;
    if (intensity <= 50) return t.balanced;
    if (intensity <= 75) return t.aggressive;
    return t.extreme;
  };

  const handleConfirm = () => {
    onConfirm(intensity);
  };

  if (!partner || !config) return null;

  const returnLabel = {
    en: "Return",
    "zh-TW": "返回",
    "zh-CN": "返回",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-lg max-h-[85vh] overflow-y-auto"
        style={{
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
          border: `2px solid ${config.color}`,
          boxShadow: `0 0 50px ${config.glow}, 0 0 100px ${config.glow.replace('0.5', '0.2')}`,
        }}
      >
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div 
              className="w-20 h-20 rounded-full overflow-hidden"
              style={{ boxShadow: `0 0 30px ${config.glow}` }}
            >
              <img 
                src={partner.image} 
                alt={partner.name[language]}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <DialogTitle 
            className="text-xl font-black text-center"
            style={{ 
              color: config.color,
              textShadow: `0 0 20px ${config.glow}`,
              fontFamily: "'Georgia', serif",
            }}
          >
            {config.title[language]}
            <br />
            <span className="text-sm opacity-70">{config.subtitle[language]}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          {/* Slider Label */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <IconComponent className="w-5 h-5" style={{ color: config.color }} />
              <span className="text-sm" style={{ color: "#C0C0C0" }}>
                {config.sliderLabel[language]}
              </span>
            </div>
            <span 
              className="font-bold text-lg"
              style={{ 
                color: config.color,
                fontFamily: "'Georgia', serif",
              }}
            >
              {intensity}%
            </span>
          </div>

          {/* Intensity Slider */}
          <div 
            className="p-4 rounded-xl mb-4"
            style={{
              backgroundColor: "rgba(30, 41, 59, 0.8)",
              border: `1px solid ${config.color}40`,
            }}
          >
            <Slider
              value={[intensity]}
              onValueChange={(value) => setIntensity(value[0])}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between mt-2 text-xs" style={{ color: "#6B7280" }}>
              <span>{t.conservative}</span>
              <span>{t.balanced}</span>
              <span>{t.aggressive}</span>
              <span>{t.extreme}</span>
            </div>
          </div>

          {/* Current Selection Display */}
          <div 
            className="text-center py-3 px-4 rounded-lg mb-6"
            style={{
              backgroundColor: `${config.color}20`,
              border: `1px solid ${config.color}40`,
            }}
          >
            <Filter className="w-4 h-4 inline mr-2" style={{ color: config.color }} />
            <span 
              className="font-bold"
              style={{ 
                color: config.color,
                fontFamily: "'Georgia', serif",
              }}
            >
              {getIntensityLabel()}
            </span>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleConfirm}
            className="w-full py-4 font-bold text-lg"
            style={{
              background: `linear-gradient(135deg, ${config.color} 0%, ${config.color}CC 100%)`,
              color: "#000000",
              boxShadow: `0 0 30px ${config.glow}`,
            }}
          >
            <Zap className="w-5 h-5 mr-2" />
            {t.generateBtn}
          </Button>

          {/* Return Button */}
          <Button
            onClick={onClose}
            variant="ghost"
            className="w-full py-3 mt-2 font-bold"
            style={{
              color: "#9CA3AF",
              border: "1px solid rgba(156, 163, 175, 0.3)",
            }}
          >
            {returnLabel[language]}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}