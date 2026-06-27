import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Moon, Sparkles } from "lucide-react";

interface IntuitionLevelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (level: number) => void;
  language: "en" | "zh-TW" | "zh-CN";
}

export function IntuitionLevelModal({
  isOpen,
  onClose,
  onConfirm,
  language,
}: IntuitionLevelModalProps) {
  const [selectedLevel, setSelectedLevel] = useState(3);

  // Moon phase icons based on selection level
  const getMoonPhase = (level: number, selected: number): string => {
    // Moon phases: 🌑 🌒 🌓 🌔 🌕
    const phases = ["🌑", "🌒", "🌓", "🌔", "🌕"];
    if (level > selected) return "🌑"; // Dark moon for unselected
    return phases[level - 1];
  };

  // Glow intensity based on level
  const getGlowColor = (level: number, selected: number) => {
    if (level > selected) return "transparent";
    if (selected <= 2) return "rgba(148, 163, 184, 0.4)"; // Soft silver
    if (selected <= 4) return "rgba(192, 192, 192, 0.6)"; // Bright silver
    return "rgba(255, 255, 255, 0.8)"; // Full moon glow
  };

  const content = {
    en: {
      title: "Achelois's Moonlight Vision",
      subtitle: "月光女神的直覺啟示",
      description: "Select Your Intuition Frequency / 選擇您的直覺頻率 (1-5 Moon Phases)",
      levelLabels: ["New Moon (Low Intuition)", "Waxing", "Half Moon (Balanced)", "Gibbous", "Full Moon (Deep Intuition)"],
      levelDescriptions: ["Subtle", "Gentle", "Balanced", "Deep", "Profound"],
      confirm: "Generate AI Prediction",
      confirmSub: "生成 AI 預測",
    },
    "zh-TW": {
      title: "月光女神的直覺啟示",
      subtitle: "Achelois's Moonlight Vision",
      description: "選擇您的直覺頻率 / Select Your Intuition Frequency（1-5 月相）",
      levelLabels: ["新月（低直覺）", "眉月", "半月（平衡）", "盈凸月", "滿月（深層直覺）"],
      levelDescriptions: ["微妙", "溫和", "平衡", "深沉", "深遠"],
      confirm: "生成 AI 預測",
      confirmSub: "Generate AI Prediction",
    },
    "zh-CN": {
      title: "月光女神的直觉启示",
      subtitle: "Achelois's Moonlight Vision",
      description: "选择您的直觉频率 / Select Your Intuition Frequency（1-5 月相）",
      levelLabels: ["新月（低直觉）", "眉月", "半月（平衡）", "盈凸月", "满月（深层直觉）"],
      levelDescriptions: ["微妙", "温和", "平衡", "深沉", "深远"],
      confirm: "生成 AI 预测",
      confirmSub: "Generate AI Prediction",
    },
  };

  const t = content[language] || content.en;

  const handleConfirm = () => {
    onConfirm(selectedLevel);
  };

  const returnLabel = {
    en: "Return",
    "zh-TW": "返回",
    "zh-CN": "返回",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-md border-0 max-h-[85vh] overflow-y-auto"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
          boxShadow: "0 0 60px rgba(148, 163, 184, 0.3), 0 0 120px rgba(96, 165, 250, 0.15)",
          border: "2px solid rgba(148, 163, 184, 0.4)",
        }}
      >
        <DialogHeader className="text-center pb-4">
          {/* Moon Icon */}
          <div 
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center relative"
            style={{
              background: "linear-gradient(135deg, #C0C0C0 0%, #94A3B8 50%, #64748B 100%)",
              boxShadow: "0 0 40px rgba(192, 192, 192, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.3)",
            }}
          >
            <Moon className="w-8 h-8 text-slate-900" />
            {/* Subtle glow animation */}
            <div 
              className="absolute inset-0 rounded-full animate-pulse"
              style={{
                background: "radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)",
              }}
            />
          </div>
          
          <DialogTitle 
            className="text-2xl font-black"
            style={{ 
              color: "#C0C0C0",
              textShadow: "0 0 20px rgba(192, 192, 192, 0.5)",
              fontFamily: "'Georgia', serif",
            }}
          >
            {t.title}
          </DialogTitle>
          <p 
            className="text-sm mt-1"
            style={{ color: "#94A3B8" }}
          >
            {t.subtitle}
          </p>
          <p 
            className="text-xs mt-2"
            style={{ color: "#64748B" }}
          >
            {t.description}
          </p>
        </DialogHeader>

        {/* Moon Phase Selection */}
        <div className="py-6">
          {/* Moon Phases Display */}
          <div className="flex justify-center gap-3 mb-6">
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`transition-all duration-300 hover:scale-110 focus:outline-none w-14 h-14 rounded-full flex items-center justify-center text-2xl ${
                  selectedLevel === 5 && level <= selectedLevel ? "animate-pulse" : ""
                }`}
                style={{
                  background: level <= selectedLevel 
                    ? "linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)"
                    : "rgba(30, 41, 59, 0.5)",
                  border: level <= selectedLevel 
                    ? "2px solid rgba(192, 192, 192, 0.6)"
                    : "2px solid rgba(71, 85, 105, 0.4)",
                  boxShadow: level <= selectedLevel 
                    ? `0 0 20px ${getGlowColor(level, selectedLevel)}`
                    : "none",
                }}
              >
                {getMoonPhase(level, selectedLevel)}
              </button>
            ))}
          </div>

          {/* Selected Level Info */}
          <div 
            className="text-center p-4 rounded-xl"
            style={{
              background: "rgba(148, 163, 184, 0.1)",
              border: "1px solid rgba(148, 163, 184, 0.3)",
              boxShadow: "0 0 20px rgba(148, 163, 184, 0.1)",
            }}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5" style={{ color: "#C0C0C0" }} />
              <span 
                className="text-lg font-bold"
                style={{ 
                  color: "#C0C0C0",
                  textShadow: "0 0 10px rgba(192, 192, 192, 0.5)",
                }}
              >
                {t.levelLabels[selectedLevel - 1]}
              </span>
            </div>
            <p 
              className="text-sm"
              style={{ color: "#94A3B8" }}
            >
              {language === "en" ? "Intuition: " : "直覺強度："}
              <span className="font-bold" style={{ color: "#C0C0C0" }}>
                {t.levelDescriptions[selectedLevel - 1]}
              </span>
            </p>
          </div>

          {/* Level Indicators */}
          <div className="mt-4 grid grid-cols-5 gap-1 text-center">
            {t.levelLabels.map((label, idx) => {
              const level = idx + 1;
              let levelColor = "#475569";
              let levelBg = "transparent";
              if (level === selectedLevel) {
                levelBg = "rgba(148, 163, 184, 0.2)";
                levelColor = "#C0C0C0";
              }
              return (
                <div 
                  key={idx}
                  className={`text-xs py-1 rounded transition-all duration-200 ${
                    level === selectedLevel ? "font-bold" : "opacity-50"
                  }`}
                  style={{
                    color: levelColor,
                    background: levelBg,
                  }}
                >
                  {level}
                </div>
              );
            })}
          </div>
        </div>

        {/* Confirm Button - Amber (#FFBF00) with Moon Rising Glow */}
        <Button
          onClick={handleConfirm}
          className="w-full py-6 text-lg font-black transition-all duration-300 hover:scale-[1.02]"
          style={{
            background: "linear-gradient(135deg, #FFBF00 0%, #E6AC00 100%)",
            color: "#1a1a1a",
            border: "none",
            boxShadow: "0 0 30px rgba(255, 191, 0, 0.5), 0 0 60px rgba(255, 191, 0, 0.3), 0 8px 25px rgba(255, 191, 0, 0.4)",
            fontFamily: "'Georgia', serif",
          }}
        >
          <Moon className="w-5 h-5 mr-2" />
          <span className="flex flex-col items-start leading-tight">
            <span>{t.confirm}</span>
            <span className="text-xs opacity-70">{t.confirmSub}</span>
          </span>
        </Button>

        {/* Return Button */}
        <Button
          onClick={onClose}
          variant="ghost"
          className="w-full py-3 mt-2 font-bold"
          style={{
            color: "#94A3B8",
            border: "1px solid rgba(148, 163, 184, 0.3)",
          }}
        >
          {returnLabel[language]}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
