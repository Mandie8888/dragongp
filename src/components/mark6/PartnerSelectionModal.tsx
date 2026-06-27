import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Character, characters } from "./CharacterData";
import { Language } from "@/contexts/LanguageContext";
import { useState } from "react";

interface PartnerSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPartner: (character: Character) => void;
  language: Language;
}

export function PartnerSelectionModal({ isOpen, onClose, onSelectPartner, language }: PartnerSelectionModalProps) {
  const [selectedPartner, setSelectedPartner] = useState<Character | null>(null);

  const content = {
    en: {
      title: "Choose Your Partner",
      subtitle: "Select ONE AI partner to guide your probability analysis",
      continue: "Continue",
      cancel: "Cancel",
      selected: "Selected",
    },
    "zh-TW": {
      title: "選擇您的夥伴",
      subtitle: "選擇一位 AI 夥伴來指導您的概率分析",
      continue: "繼續",
      cancel: "取消",
      selected: "已選擇",
    },
    "zh-CN": {
      title: "选择您的伙伴",
      subtitle: "选择一位 AI 伙伴来指导您的概率分析",
      continue: "继续",
      cancel: "取消",
      selected: "已选择",
    },
  };

  const t = content[language] || content.en;

  const handleContinue = () => {
    if (selectedPartner) {
      onSelectPartner(selectedPartner);
      setSelectedPartner(null);
    }
  };

  const handleClose = () => {
    setSelectedPartner(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="max-w-2xl border-2 max-h-[85vh] overflow-y-auto"
        style={{
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
          borderColor: "#FFD700",
          boxShadow: "0 0 60px rgba(255, 215, 0, 0.3)",
        }}
      >
        <DialogHeader>
          <DialogTitle 
            className="text-center text-2xl font-bold tracking-wide"
            style={{ 
              color: "#FFD700",
              textShadow: "0 0 20px rgba(255, 215, 0, 0.5)",
            }}
          >
            {t.title}
          </DialogTitle>
          
          <DialogDescription className="text-center text-[#C0C0C0] text-sm">
            {t.subtitle}
          </DialogDescription>
        </DialogHeader>

        {/* Partner Grid */}
        <div className="grid grid-cols-5 gap-3 mt-6">
          {characters.map((character) => (
            <div
              key={character.id}
              className={`cursor-pointer group transition-all duration-300 ${
                selectedPartner?.id === character.id ? "scale-105" : "hover:scale-105"
              }`}
              onClick={() => setSelectedPartner(character)}
            >
              <div 
                className="relative p-2 rounded-xl transition-all duration-300"
                style={{
                  background: selectedPartner?.id === character.id 
                    ? "linear-gradient(135deg, rgba(255, 215, 0, 0.3) 0%, rgba(255, 215, 0, 0.1) 100%)"
                    : "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)",
                  border: selectedPartner?.id === character.id 
                    ? "2px solid #FFD700"
                    : "2px solid transparent",
                  boxShadow: selectedPartner?.id === character.id 
                    ? "0 0 20px rgba(255, 215, 0, 0.4)"
                    : "none",
                }}
              >
                {/* Selected Badge */}
                {selectedPartner?.id === character.id && (
                  <div 
                    className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-bold z-10"
                    style={{
                      background: "linear-gradient(90deg, #22C55E 0%, #16A34A 100%)",
                      color: "#FFFFFF",
                    }}
                  >
                    ✓ {t.selected}
                  </div>
                )}

                {/* Character Image */}
                <div 
                  className="w-16 h-16 mx-auto rounded-full overflow-hidden border-2 transition-all duration-300"
                  style={{
                    borderColor: selectedPartner?.id === character.id ? "#FFD700" : "#4B5563",
                  }}
                >
                  <img 
                    src={character.image} 
                    alt={character.name[language]}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Name */}
                <p 
                  className="text-center text-xs font-bold mt-2 truncate"
                  style={{ color: selectedPartner?.id === character.id ? "#FFD700" : "#C0C0C0" }}
                >
                  {character.name[language]}
                </p>
                <p className="text-center text-[9px] text-[#6B7280] truncate">
                  {character.name.en}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 mt-6">
          <div className="flex gap-3">
            <Button
              onClick={handleClose}
              variant="outline"
              className="flex-1 py-3 font-bold border-2"
              style={{
                borderColor: "#6B7280",
                color: "#9CA3AF",
                background: "transparent",
              }}
            >
              {t.cancel}
            </Button>
            <Button
              onClick={handleContinue}
              disabled={!selectedPartner}
              className="flex-1 py-3 font-bold transition-all duration-300"
              style={{
                background: selectedPartner 
                  ? "linear-gradient(90deg, #FFD700 0%, #B8860B 100%)"
                  : "linear-gradient(90deg, #4B5563 0%, #374151 100%)",
                color: selectedPartner ? "#000000" : "#6B7280",
                boxShadow: selectedPartner ? "0 0 20px rgba(255, 215, 0, 0.4)" : "none",
              }}
            >
              {t.continue}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
