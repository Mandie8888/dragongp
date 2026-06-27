import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star, Sparkles, Zap } from "lucide-react";

interface SimulationPowerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (stars: number) => void;
  language: "en" | "zh-TW" | "zh-CN";
}

export function SimulationPowerModal({
  isOpen,
  onClose,
  onConfirm,
  language,
}: SimulationPowerModalProps) {
  const [selectedStars, setSelectedStars] = useState(3);

  // Gold color levels based on star selection
  const getStarColor = (star: number, selected: number) => {
    if (star > selected) return "#404040"; // Unselected
    if (selected <= 2) return "#DAA520"; // Soft Gold
    if (selected <= 4) return "#FFD700"; // Bright Gold
    return "#B8860B"; // Imperial Gold (5 stars)
  };

  const getGlowIntensity = (selected: number) => {
    if (selected <= 2) return "0 0 8px rgba(218, 165, 32, 0.6)";
    if (selected <= 4) return "0 0 12px rgba(255, 215, 0, 0.8)";
    return "0 0 20px rgba(184, 134, 11, 1), 0 0 40px rgba(255, 215, 0, 0.6)";
  };

  const content = {
    en: {
      title: "Lucky Star's Simulation Power",
      subtitle: "幸運星模擬強度選擇",
      description: "Select simulation depth (1-5 stars). More stars = deeper Monte Carlo analysis.",
      starLabels: ["Light", "Basic", "Medium", "Deep", "Ultra"],
      simulationCounts: ["100K", "250K", "500K", "750K", "1M"],
      confirm: "Generate AI Prediction",
      confirmSub: "生成 AI 預測",
    },
    "zh-TW": {
      title: "幸運星模擬強度選擇",
      subtitle: "Lucky Star's Simulation Power",
      description: "選擇模擬深度（1-5 星）。星數越多 = 更深入的蒙特卡羅分析。",
      starLabels: ["輕度", "基礎", "中等", "深度", "極致"],
      simulationCounts: ["10萬次", "25萬次", "50萬次", "75萬次", "100萬次"],
      confirm: "生成 AI 預測",
      confirmSub: "Generate AI Prediction",
    },
    "zh-CN": {
      title: "幸运星模拟强度选择",
      subtitle: "Lucky Star's Simulation Power",
      description: "选择模拟深度（1-5 星）。星数越多 = 更深入的蒙特卡罗分析。",
      starLabels: ["轻度", "基础", "中等", "深度", "极致"],
      simulationCounts: ["10万次", "25万次", "50万次", "75万次", "100万次"],
      confirm: "生成 AI 预测",
      confirmSub: "Generate AI Prediction",
    },
  };

  const t = content[language] || content.en;

  const handleConfirm = () => {
    onConfirm(selectedStars);
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
          background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)",
          boxShadow: "0 0 60px rgba(255, 215, 0, 0.3), 0 0 120px rgba(255, 215, 0, 0.15)",
          border: "2px solid rgba(255, 215, 0, 0.4)",
        }}
      >
        <DialogHeader className="text-center pb-4">
          {/* Sparkle Icon - Golden */}
          <div 
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #DAA520 100%)",
              boxShadow: "0 0 40px rgba(255, 215, 0, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.3)",
            }}
          >
            <Sparkles className="w-8 h-8 text-gray-900" />
          </div>
          
          <DialogTitle 
            className="text-2xl font-black"
            style={{ 
              color: "#FFD700",
              textShadow: "0 0 20px rgba(255, 215, 0, 0.5)",
              fontFamily: "'Georgia', serif",
            }}
          >
            {t.title}
          </DialogTitle>
          <p 
            className="text-sm mt-1"
            style={{ color: "#DAA520" }}
          >
            {t.subtitle}
          </p>
          <p 
            className="text-xs mt-2"
            style={{ color: "#B8860B" }}
          >
            {t.description}
          </p>
        </DialogHeader>

        {/* Star Selection */}
        <div className="py-6">
          {/* Stars Display */}
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setSelectedStars(star)}
                className={`transition-all duration-200 hover:scale-110 focus:outline-none ${
                  selectedStars === 5 && star <= selectedStars ? "animate-pulse" : ""
                }`}
              >
                <Star
                  className={`w-12 h-12 transition-all duration-200 ${
                    star <= selectedStars ? "fill-current" : ""
                  }`}
                  style={{
                    color: getStarColor(star, selectedStars),
                    filter: star <= selectedStars 
                      ? `drop-shadow(${getGlowIntensity(selectedStars)})` 
                      : "none",
                  }}
                />
              </button>
            ))}
          </div>

          {/* Selected Level Info */}
          <div 
            className="text-center p-4 rounded-xl"
            style={{
              background: "rgba(255, 215, 0, 0.1)",
              border: "1px solid rgba(255, 215, 0, 0.3)",
              boxShadow: "0 0 20px rgba(255, 215, 0, 0.1)",
            }}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="w-5 h-5" style={{ color: "#FFD700" }} />
              <span 
                className="text-lg font-bold"
                style={{ 
                  color: "#FFD700",
                  textShadow: "0 0 10px rgba(255, 215, 0, 0.5)",
                }}
              >
                {t.starLabels[selectedStars - 1]}
              </span>
            </div>
            <p 
              className="text-sm"
              style={{ color: "#DAA520" }}
            >
              {language === "en" ? "Simulations: " : "模擬次數："}
              <span className="font-bold" style={{ color: "#FFD700" }}>
                {t.simulationCounts[selectedStars - 1]}
              </span>
            </p>
          </div>

          {/* Star Level Descriptions with color coding */}
          <div className="mt-4 grid grid-cols-5 gap-1 text-center">
            {t.starLabels.map((label, idx) => {
              const starLevel = idx + 1;
              let levelColor = "#606060";
              let levelBg = "transparent";
              if (starLevel === selectedStars) {
                levelBg = starLevel <= 2 
                  ? "rgba(218, 165, 32, 0.2)" 
                  : starLevel <= 4 
                  ? "rgba(255, 215, 0, 0.2)" 
                  : "rgba(184, 134, 11, 0.3)";
                levelColor = starLevel <= 2 
                  ? "#DAA520" 
                  : starLevel <= 4 
                  ? "#FFD700" 
                  : "#B8860B";
              }
              return (
                <div 
                  key={idx}
                  className={`text-xs py-1 rounded transition-all duration-200 ${
                    starLevel === selectedStars ? "font-bold" : "opacity-50"
                  } ${selectedStars === 5 && starLevel === 5 ? "animate-pulse" : ""}`}
                  style={{
                    color: levelColor,
                    background: levelBg,
                  }}
                >
                  {starLevel}★
                </div>
              );
            })}
          </div>
        </div>

        {/* Confirm Button - Prosperous Red */}
        <Button
          onClick={handleConfirm}
          className="w-full py-6 text-lg font-black transition-all duration-300 hover:scale-[1.02]"
          style={{
            background: "linear-gradient(135deg, #CC0000 0%, #990000 100%)",
            color: "#FFFFFF",
            boxShadow: "0 0 30px rgba(204, 0, 0, 0.5), 0 0 60px rgba(204, 0, 0, 0.25)",
            fontFamily: "'Georgia', serif",
          }}
        >
          <Sparkles className="w-5 h-5 mr-2" />
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
            color: "#9CA3AF",
            border: "1px solid rgba(255, 215, 0, 0.3)",
          }}
        >
          {returnLabel[language]}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
