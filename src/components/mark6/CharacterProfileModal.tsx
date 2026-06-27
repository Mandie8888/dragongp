import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Character } from "./CharacterData";
import { Language } from "@/contexts/LanguageContext";

interface CharacterProfileModalProps {
  character: Character | null;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export function CharacterProfileModal({ character, isOpen, onClose, language }: CharacterProfileModalProps) {
  if (!character) return null;

  const labels = {
    en: {
      mathModule: "Mathematical Module",
      description: "Profile",
      disclaimer: "This character uses a specific mathematical model for probability analysis; it is not a guarantee of results.",
      close: "Close",
    },
    "zh-TW": {
      mathModule: "數學模組",
      description: "簡介",
      disclaimer: "此角色使用特定數學模型進行概率分析；不保證結果。",
      close: "關閉",
    },
    "zh-CN": {
      mathModule: "数学模组",
      description: "简介",
      disclaimer: "此角色使用特定数学模型进行概率分析；不保证结果。",
      close: "关闭",
    },
  };

  const t = labels[language] || labels.en;

  const returnLabel = {
    en: "Return",
    "zh-TW": "返回",
    "zh-CN": "返回",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-lg border-2 max-h-[85vh] overflow-y-auto"
        style={{
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
          borderColor: "#FFD700",
          boxShadow: "0 0 40px rgba(255, 215, 0, 0.3), inset 0 0 60px rgba(0, 255, 65, 0.05)",
        }}
      >
        <DialogHeader className="relative">
          <button
            onClick={onClose}
            className="absolute right-0 top-0 p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-[#C0C0C0]" />
          </button>
          
          {/* Character Image */}
          <div className="flex justify-center mb-4">
            <div 
              className="w-32 h-32 rounded-full overflow-hidden border-4 shadow-lg"
              style={{
                borderColor: "#FFD700",
                boxShadow: "0 0 30px rgba(255, 215, 0, 0.5)",
              }}
            >
              <img 
                src={character.image} 
                alt={character.name[language]}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <DialogTitle 
            className="text-center text-2xl font-bold tracking-wide"
            style={{ 
              color: "#FFD700",
              textShadow: "0 0 20px rgba(255, 215, 0, 0.5)",
              fontFamily: "'Georgia', serif",
            }}
          >
            {character.name[language]}
          </DialogTitle>
          
          <DialogDescription className="text-center text-[#C0C0C0] text-sm">
            {character.style}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Math Module */}
          <div 
            className="p-4 rounded-lg"
            style={{
              background: "linear-gradient(90deg, rgba(0, 255, 65, 0.1) 0%, rgba(0, 255, 65, 0.05) 100%)",
              border: "1px solid rgba(0, 255, 65, 0.3)",
            }}
          >
            <h4 className="text-sm font-semibold text-[#00FF41] mb-2">{t.mathModule}</h4>
            <p 
              className="text-lg font-bold"
              style={{ 
                color: "#FFFFFF",
                fontFamily: "'Courier New', monospace",
              }}
            >
              {character.mathModule[language]}
            </p>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm font-semibold text-[#FFD700] mb-2">{t.description}</h4>
            <p 
              className="text-sm leading-relaxed"
              style={{ 
                color: "#E2E8F0",
                fontSize: "15px",
                lineHeight: "1.7",
              }}
            >
              {character.description[language]}
            </p>
          </div>

          {/* Disclaimer */}
          <p 
            className="text-xs italic text-center pt-2"
            style={{ color: "#94A3B8" }}
          >
            ⚠️ {t.disclaimer}
          </p>

          {/* Return Button */}
          <Button
            onClick={onClose}
            className="w-full py-3 font-bold"
            style={{
              background: "linear-gradient(90deg, #FFD700 0%, #B8860B 100%)",
              color: "#000000",
            }}
          >
            {returnLabel[language] || returnLabel.en}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
