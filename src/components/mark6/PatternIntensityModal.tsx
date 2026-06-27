import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Snowflake, Scale, Flame, Crown } from "lucide-react";
import { Character } from "./CharacterData";

interface PatternIntensityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (pattern: string) => void;
  partner: Character | null;
  language: "en" | "zh-TW" | "zh-CN";
}

const content = {
  en: {
    title: "Pattern Intensity",
    subtitle: "規律強度選擇",
    cold: "Cold",
    coldCn: "冷門",
    balanced: "Balanced",
    balancedCn: "平衡",
    hot: "Hot",
    hotCn: "熱門",
  },
  "zh-TW": {
    title: "規律強度選擇",
    subtitle: "Pattern Intensity",
    cold: "冷門",
    coldCn: "Cold",
    balanced: "平衡",
    balancedCn: "Balanced",
    hot: "熱門",
    hotCn: "Hot",
  },
  "zh-CN": {
    title: "规律强度选择",
    subtitle: "Pattern Intensity",
    cold: "冷门",
    coldCn: "Cold",
    balanced: "平衡",
    balancedCn: "Balanced",
    hot: "热门",
    hotCn: "Hot",
  },
};

export function PatternIntensityModal({
  isOpen,
  onClose,
  onConfirm,
  partner,
  language,
}: PatternIntensityModalProps) {
  const t = content[language] || content.en;

  const handleSelect = (pattern: string) => {
    onConfirm(pattern);
  };

  if (!partner) return null;

  const returnLabel = {
    en: "Return",
    "zh-TW": "返回",
    "zh-CN": "返回",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-md p-0 max-h-[85vh] overflow-y-auto"
        style={{
          background: "#000000",
          border: "3px solid #FFD700",
          boxShadow: "0 0 80px rgba(255, 215, 0, 0.5)",
        }}
      >
        <DialogHeader className="p-4 pb-2">
          {/* Partner Image */}
          <div className="flex justify-center mb-3">
            <div 
              className="w-20 h-20 rounded-full overflow-hidden"
              style={{ 
                boxShadow: "0 0 40px rgba(255, 215, 0, 0.7)",
                border: "3px solid #FFD700",
              }}
            >
              <img 
                src={partner.image} 
                alt={partner.name[language]}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <DialogTitle 
            className="text-center space-y-1"
          >
            <div className="flex items-center justify-center gap-2">
              <Crown className="w-5 h-5" style={{ color: "#FFD700" }} />
              <span 
                className="text-xl font-black"
                style={{ 
                  color: "#FFD700",
                  textShadow: "0 0 20px rgba(255, 215, 0, 0.6)",
                  fontFamily: "'Georgia', serif",
                }}
              >
                {t.title}
              </span>
              <Crown className="w-5 h-5" style={{ color: "#FFD700" }} />
            </div>
            <span className="text-sm block" style={{ color: "#B8860B" }}>
              {t.subtitle}
            </span>
          </DialogTitle>
        </DialogHeader>

        {/* 3 Big High-Contrast Buttons */}
        <div className="p-4 pt-2 space-y-3">
          {/* Cold Button */}
          <button
            onClick={() => handleSelect("cold")}
            className="w-full py-5 rounded-xl font-black text-lg transition-all duration-200 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
            style={{
              background: "linear-gradient(135deg, #1E3A5F 0%, #0D1F33 100%)",
              border: "2px solid #60A5FA",
              boxShadow: "0 0 25px rgba(96, 165, 250, 0.4)",
              color: "#60A5FA",
              fontFamily: "'Georgia', serif",
            }}
          >
            <Snowflake className="w-7 h-7" />
            <span className="flex flex-col items-start leading-tight">
              <span className="text-xl">{t.cold}</span>
              <span className="text-xs opacity-70">{t.coldCn}</span>
            </span>
          </button>

          {/* Balanced Button */}
          <button
            onClick={() => handleSelect("balanced")}
            className="w-full py-5 rounded-xl font-black text-lg transition-all duration-200 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
            style={{
              background: "linear-gradient(135deg, #FFD700 0%, #B8860B 100%)",
              border: "2px solid #FFD700",
              boxShadow: "0 0 30px rgba(255, 215, 0, 0.6)",
              color: "#000000",
              fontFamily: "'Georgia', serif",
            }}
          >
            <Scale className="w-7 h-7" />
            <span className="flex flex-col items-start leading-tight">
              <span className="text-xl">{t.balanced}</span>
              <span className="text-xs opacity-70">{t.balancedCn}</span>
            </span>
          </button>

          {/* Hot Button */}
          <button
            onClick={() => handleSelect("hot")}
            className="w-full py-5 rounded-xl font-black text-lg transition-all duration-200 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
            style={{
              background: "linear-gradient(135deg, #7F1D1D 0%, #450A0A 100%)",
              border: "2px solid #EF4444",
              boxShadow: "0 0 25px rgba(239, 68, 68, 0.4)",
              color: "#EF4444",
              fontFamily: "'Georgia', serif",
            }}
          >
            <Flame className="w-7 h-7" />
            <span className="flex flex-col items-start leading-tight">
              <span className="text-xl">{t.hot}</span>
              <span className="text-xs opacity-70">{t.hotCn}</span>
            </span>
          </button>

          {/* Return Button */}
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl font-bold text-base transition-all duration-200 hover:scale-[1.02] active:scale-95 mt-2"
            style={{
              background: "transparent",
              border: "2px solid #6B7280",
              color: "#9CA3AF",
            }}
          >
            {returnLabel[language]}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
