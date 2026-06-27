import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Wand2, Check } from "lucide-react";
import { useState } from "react";

interface ColorSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (colorRatio: string) => void;
  language: "en" | "zh-TW" | "zh-CN";
}

const content = {
  en: {
    title: "Aladdin's Magic Color Mix",
    subtitle: "阿拉丁色球組合選擇",
    continue: "Continue",
    continueCn: "繼續",
    red: "Red",
    blue: "Blue",
    green: "Green",
    redCn: "紅",
    blueCn: "藍",
    greenCn: "綠",
    custom: "Genie's Choice",
    customCn: "神燈精靈",
  },
  "zh-TW": {
    title: "阿拉丁色球組合選擇",
    subtitle: "Aladdin's Magic Color Mix",
    continue: "繼續",
    continueCn: "Continue",
    red: "紅",
    blue: "藍",
    green: "綠",
    redCn: "Red",
    blueCn: "Blue",
    greenCn: "Green",
    custom: "神燈精靈",
    customCn: "Genie's Choice",
  },
  "zh-CN": {
    title: "阿拉丁色球组合选择",
    subtitle: "Aladdin's Magic Color Mix",
    continue: "继续",
    continueCn: "Continue",
    red: "红",
    blue: "蓝",
    green: "绿",
    redCn: "Red",
    blueCn: "Blue",
    greenCn: "Green",
    custom: "神灯精灵",
    customCn: "Genie's Choice",
  },
};

// All possible 6-ball combinations: [red, blue, green]
const ratioOptions = [
  { id: "2-2-2", ratio: [2, 2, 2] },
  { id: "3-2-1", ratio: [3, 2, 1] },
  { id: "1-3-2", ratio: [1, 3, 2] },
  { id: "3-3-0", ratio: [3, 3, 0] },
  { id: "4-1-1", ratio: [4, 1, 1] },
  { id: "1-4-1", ratio: [1, 4, 1] },
  { id: "1-1-4", ratio: [1, 1, 4] },
  { id: "4-2-0", ratio: [4, 2, 0] },
  { id: "0-4-2", ratio: [0, 4, 2] },
  { id: "2-0-4", ratio: [2, 0, 4] },
  { id: "5-1-0", ratio: [5, 1, 0] },
  { id: "0-5-1", ratio: [0, 5, 1] },
  { id: "1-0-5", ratio: [1, 0, 5] },
  { id: "6-0-0", ratio: [6, 0, 0] },
  { id: "0-6-0", ratio: [0, 6, 0] },
  { id: "0-0-6", ratio: [0, 0, 6] },
  { id: "custom", ratio: [0, 0, 0] }, // Custom/random
];

export function ColorSelectionModal({
  isOpen,
  onClose,
  onConfirm,
  language,
}: ColorSelectionModalProps) {
  const t = content[language] || content.en;
  const [selected, setSelected] = useState<string | null>(null);

  const handleConfirm = () => {
    if (selected) {
      onConfirm(selected);
    }
  };

  const renderRatioLabel = (ratio: number[], isCustom: boolean) => {
    if (isCustom) {
      return (
        <span className="text-xs font-medium" style={{ color: "#FFD700" }}>
          {t.custom} / {t.customCn}
        </span>
      );
    }
    
    return (
      <div className="flex flex-wrap gap-1 justify-center text-[10px] font-medium leading-tight">
        <span style={{ color: "#EF4444" }}>{ratio[0]}{t.redCn}</span>
        <span style={{ color: "#9CA3AF" }}>/</span>
        <span style={{ color: "#3B82F6" }}>{ratio[1]}{t.blueCn}</span>
        <span style={{ color: "#9CA3AF" }}>/</span>
        <span style={{ color: "#22C55E" }}>{ratio[2]}{t.greenCn}</span>
      </div>
    );
  };

  const renderBalls = (ratio: number[], isCustom: boolean) => {
    if (isCustom) {
      return (
        <div className="flex items-center justify-center gap-0.5">
          {[0, 1, 2, 3, 4, 5].map((idx) => (
            <div
              key={idx}
              className="w-4 h-4 rounded-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${
                  idx % 3 === 0 ? "#A855F7" : idx % 3 === 1 ? "#FFD700" : "#9333EA"
                } 0%, ${
                  idx % 3 === 0 ? "#7C3AED" : idx % 3 === 1 ? "#B8860B" : "#6B21A8"
                } 100%)`,
                boxShadow: "0 0 4px rgba(255, 215, 0, 0.4)",
              }}
            >
              <Sparkles className="w-2 h-2 text-white" />
            </div>
          ))}
        </div>
      );
    }

    const balls = [];
    // Red balls
    for (let i = 0; i < ratio[0]; i++) {
      balls.push(
        <div
          key={`r${i}`}
          className="w-4 h-4 rounded-full"
          style={{
            background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
            boxShadow: "0 0 4px rgba(239, 68, 68, 0.5)",
          }}
        />
      );
    }
    // Blue balls
    for (let i = 0; i < ratio[1]; i++) {
      balls.push(
        <div
          key={`b${i}`}
          className="w-4 h-4 rounded-full"
          style={{
            background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
            boxShadow: "0 0 4px rgba(59, 130, 246, 0.5)",
          }}
        />
      );
    }
    // Green balls
    for (let i = 0; i < ratio[2]; i++) {
      balls.push(
        <div
          key={`g${i}`}
          className="w-4 h-4 rounded-full"
          style={{
            background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
            boxShadow: "0 0 4px rgba(34, 197, 94, 0.5)",
          }}
        />
      );
    }

    return <div className="flex items-center justify-center gap-0.5">{balls}</div>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-md p-0 overflow-hidden flex flex-col"
        style={{
          background: "#0a0015",
          border: "3px solid #A855F7",
          boxShadow: "0 0 80px rgba(168, 85, 247, 0.5), 0 0 120px rgba(255, 215, 0, 0.2)",
          maxHeight: "85vh",
        }}
      >
        {/* Header */}
        <DialogHeader className="p-3 pb-2 flex-shrink-0">
          <div className="flex justify-center mb-2">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ 
                background: "linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)",
                boxShadow: "0 0 30px rgba(168, 85, 247, 0.7), 0 0 60px rgba(255, 215, 0, 0.3)",
              }}
            >
              <Wand2 className="w-6 h-6" style={{ color: "#FFD700" }} />
            </div>
          </div>
          
          <DialogTitle className="text-center space-y-0.5">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" style={{ color: "#FFD700" }} />
              <span 
                className="text-lg font-black"
                style={{ 
                  color: "#A855F7",
                  textShadow: "0 0 20px rgba(168, 85, 247, 0.6)",
                  fontFamily: "'Georgia', serif",
                }}
              >
                {t.title}
              </span>
              <Sparkles className="w-4 h-4" style={{ color: "#FFD700" }} />
            </div>
            <span className="text-xs block" style={{ color: "#9333EA" }}>
              {t.subtitle}
            </span>
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable Grid Content */}
        <div 
          className="flex-1 overflow-y-auto px-3 pb-2"
          style={{ maxHeight: "400px" }}
        >
          <div className="grid grid-cols-2 gap-2">
            {ratioOptions.map((option) => {
              const isCustom = option.id === "custom";
              const isSelected = selected === option.id;
              
              return (
                <button
                  key={option.id}
                  onClick={() => setSelected(option.id)}
                  className={`relative py-2 px-2 rounded-lg font-bold transition-all duration-200 hover:scale-[1.02] active:scale-95 ${
                    isCustom ? "col-span-2" : ""
                  }`}
                  style={{
                    background: isSelected
                      ? "linear-gradient(135deg, rgba(168, 85, 247, 0.4) 0%, rgba(124, 58, 237, 0.3) 100%)"
                      : isCustom 
                        ? "linear-gradient(135deg, #1a1a2e 0%, #0f0f23 100%)"
                        : "linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%)",
                    border: isSelected
                      ? "2px solid #A855F7"
                      : isCustom 
                        ? "2px dashed #FFD700" 
                        : "1px solid rgba(168, 85, 247, 0.3)",
                    boxShadow: isSelected 
                      ? "0 0 20px rgba(168, 85, 247, 0.5)" 
                      : isCustom 
                        ? "0 0 15px rgba(255, 215, 0, 0.2)" 
                        : "none",
                  }}
                >
                  {/* Selection indicator */}
                  {isSelected && (
                    <div 
                      className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ background: "#A855F7" }}
                    >
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  
                  {/* Color balls preview */}
                  <div className="mb-1">
                    {renderBalls(option.ratio, isCustom)}
                  </div>
                  
                  {/* Trilingual Labels */}
                  {renderRatioLabel(option.ratio, isCustom)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sticky Footer */}
        <div 
          className="flex-shrink-0 p-3 pt-2"
          style={{ 
            borderTop: "1px solid rgba(168, 85, 247, 0.3)",
            background: "#0a0015",
          }}
        >
          <Button
            onClick={handleConfirm}
            disabled={!selected}
            className="w-full py-3 font-bold text-base transition-all duration-200"
            style={{
              background: selected 
                ? "linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)"
                : "rgba(168, 85, 247, 0.3)",
              color: selected ? "#FFFFFF" : "rgba(255, 255, 255, 0.5)",
              boxShadow: selected ? "0 0 20px rgba(168, 85, 247, 0.5)" : "none",
              border: "none",
            }}
          >
            <span>{t.continue}</span>
            <span className="ml-2 opacity-70">/ {t.continueCn}</span>
          </Button>

          {/* Return Button */}
          <Button
            onClick={onClose}
            variant="ghost"
            className="w-full py-2 mt-2 font-bold text-sm"
            style={{
              color: "#9CA3AF",
              border: "1px solid rgba(168, 85, 247, 0.3)",
            }}
          >
            {language === "en" ? "Return" : "返回"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
