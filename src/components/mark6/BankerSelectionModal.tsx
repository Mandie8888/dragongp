import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Zap, X, Check } from "lucide-react";

interface BankerSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (bankers: number[]) => void;
  language: "en" | "zh-TW" | "zh-CN";
}

const content = {
  en: {
    title: "Elon's Strategic Banker Selection",
    subtitle: "馬神膽拖策略選擇",
    instruction: "Select your 1 to 5 Banker Numbers (1-49)",
    selected: "Selected Bankers",
    generateBtn: "Generate AI Prediction",
    clearBtn: "Clear All",
    minRequired: "Select at least 1 banker number",
    maxReached: "Maximum 5 bankers selected",
  },
  "zh-TW": {
    title: "馬神策略膽碼選擇",
    subtitle: "Elon's Strategic Banker Selection",
    instruction: "選擇您的 1 至 5 個膽碼 (1-49)",
    selected: "已選膽碼",
    generateBtn: "生成 AI 預測",
    clearBtn: "清除全部",
    minRequired: "請選擇至少 1 個膽碼",
    maxReached: "最多可選 5 個膽碼",
  },
  "zh-CN": {
    title: "马神策略胆码选择",
    subtitle: "Elon's Strategic Banker Selection",
    instruction: "选择您的 1 至 5 个胆码 (1-49)",
    selected: "已选胆码",
    generateBtn: "生成 AI 预测",
    clearBtn: "清除全部",
    minRequired: "请选择至少 1 个胆码",
    maxReached: "最多可选 5 个胆码",
  },
};

export function BankerSelectionModal({
  isOpen,
  onClose,
  onConfirm,
  language,
}: BankerSelectionModalProps) {
  const [selectedBankers, setSelectedBankers] = useState<number[]>([]);
  const t = content[language] || content.en;

  const handleNumberClick = (num: number) => {
    if (selectedBankers.includes(num)) {
      setSelectedBankers(selectedBankers.filter((n) => n !== num));
    } else if (selectedBankers.length < 5) {
      setSelectedBankers([...selectedBankers, num].sort((a, b) => a - b));
    }
  };

  const handleClear = () => {
    setSelectedBankers([]);
  };

  const handleConfirm = () => {
    if (selectedBankers.length >= 1) {
      onConfirm(selectedBankers);
    }
  };

  const getBallColor = (num: number): string => {
    if (num <= 9) return "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)";
    if (num <= 16) return "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)";
    if (num <= 24) return "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)";
    if (num <= 32) return "linear-gradient(135deg, #A855F7 0%, #9333EA 100%)";
    if (num <= 40) return "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)";
    return "linear-gradient(135deg, #EC4899 0%, #DB2777 100%)";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        style={{
          background: "linear-gradient(135deg, #0a1628 0%, #1a2f1a 50%, #0a1628 100%)",
          border: "2px solid #00FF41",
          boxShadow: "0 0 50px rgba(0, 255, 65, 0.3), 0 0 100px rgba(0, 255, 65, 0.1)",
        }}
      >
        <DialogHeader>
          <DialogTitle 
            className="text-2xl font-black text-center"
            style={{ 
              color: "#00FF41",
              textShadow: "0 0 20px rgba(0, 255, 65, 0.5)",
              fontFamily: "'Georgia', serif",
            }}
          >
            {t.title}
            <br />
            <span className="text-lg opacity-70">{t.subtitle}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="p-4">
          {/* Instruction */}
          <p 
            className="text-center mb-4 text-sm"
            style={{ color: "#C0C0C0" }}
          >
            {t.instruction}
          </p>

          {/* Selected Bankers Display */}
          <div 
            className="mb-6 p-4 rounded-xl text-center"
            style={{
              backgroundColor: "rgba(0, 255, 65, 0.1)",
              border: "1px solid rgba(0, 255, 65, 0.3)",
            }}
          >
            <p className="text-xs mb-2" style={{ color: "#00FF41" }}>
              {t.selected}: {selectedBankers.length}/5
            </p>
            <div className="flex gap-2 justify-center flex-wrap min-h-[50px] items-center">
              {selectedBankers.length === 0 ? (
                <span className="text-[#6B7280] text-sm">{t.minRequired}</span>
              ) : (
                selectedBankers.map((num) => (
                  <div
                    key={num}
                    className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold cursor-pointer transition-transform hover:scale-110"
                    style={{
                      background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
                      color: "#000000",
                      boxShadow: "0 0 20px rgba(255, 215, 0, 0.6)",
                      fontFamily: "'Georgia', serif",
                    }}
                    onClick={() => handleNumberClick(num)}
                  >
                    {num}
                  </div>
                ))
              )}
            </div>
            {selectedBankers.length >= 5 && (
              <p className="text-xs mt-2" style={{ color: "#FFD700" }}>
                {t.maxReached}
              </p>
            )}
          </div>

          {/* Number Grid */}
          <div 
            className="grid grid-cols-7 gap-2 mb-6 p-4 rounded-xl"
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.8)",
              border: "1px solid rgba(0, 255, 65, 0.2)",
            }}
          >
            {Array.from({ length: 49 }, (_, i) => i + 1).map((num) => {
              const isSelected = selectedBankers.includes(num);
              return (
                <button
                  key={num}
                  onClick={() => handleNumberClick(num)}
                  disabled={!isSelected && selectedBankers.length >= 5}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                    transition-all duration-200 relative
                    ${isSelected ? "ring-2 ring-[#FFD700] ring-offset-2 ring-offset-[#0F172A]" : ""}
                    ${!isSelected && selectedBankers.length >= 5 ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:scale-110"}
                  `}
                  style={{
                    background: isSelected 
                      ? "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)" 
                      : getBallColor(num),
                    color: isSelected ? "#000000" : "#FFFFFF",
                    boxShadow: isSelected 
                      ? "0 0 15px rgba(255, 215, 0, 0.8)" 
                      : "0 2px 8px rgba(0, 0, 0, 0.3)",
                    fontFamily: "'Georgia', serif",
                  }}
                >
                  {num}
                  {isSelected && (
                    <Check 
                      className="absolute -top-1 -right-1 w-4 h-4 p-0.5 rounded-full"
                      style={{ backgroundColor: "#00FF41", color: "#000" }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button
              onClick={handleClear}
              variant="outline"
              className="px-6 py-3"
              style={{
                borderColor: "#6B7280",
                color: "#C0C0C0",
                backgroundColor: "transparent",
              }}
            >
              <X className="w-4 h-4 mr-2" />
              {t.clearBtn}
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={selectedBankers.length < 1}
              className="px-8 py-3 font-bold"
              style={{
                background: selectedBankers.length >= 1 
                  ? "linear-gradient(135deg, #00FF41 0%, #00CC33 100%)" 
                  : "rgba(107, 114, 128, 0.5)",
                color: selectedBankers.length >= 1 ? "#000000" : "#6B7280",
                boxShadow: selectedBankers.length >= 1 
                  ? "0 0 30px rgba(0, 255, 65, 0.5)" 
                  : "none",
              }}
            >
              <Zap className="w-5 h-5 mr-2" />
              {t.generateBtn}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}