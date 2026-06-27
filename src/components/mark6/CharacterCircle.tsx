import { Character } from "./CharacterData";
import { Language } from "@/contexts/LanguageContext";

interface CharacterCircleProps {
  characters: Character[];
  onCharacterClick: (character: Character) => void;
  language: Language;
}

export function CharacterCircle({ characters, onCharacterClick, language }: CharacterCircleProps) {
  // Position characters in a circle - reduced radius by 20%
  const getPosition = (index: number, total: number) => {
    const angle = (index * 2 * Math.PI) / total - Math.PI / 2; // Start from top
    const radius = 96; // Circle radius (120 * 0.8 = 96)
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  };

  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* Center glow effect */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%)",
        }}
      />
      
      {/* Characters arranged in circle - 20% smaller icons */}
      {characters.map((character, index) => {
        const pos = getPosition(index, characters.length);
        return (
          <div
            key={character.id}
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{
              transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
            }}
            onClick={() => onCharacterClick(character)}
          >
            {/* Character Icon - Reduced from w-20 h-20 to w-16 h-16 (20% smaller) */}
            <div 
              className="w-16 h-16 rounded-full overflow-hidden border-3 transition-all duration-300 group-hover:scale-110"
              style={{
                borderWidth: "2px",
                borderColor: "#FFD700",
                boxShadow: "0 0 15px rgba(255, 215, 0, 0.4)",
              }}
            >
              <img 
                src={character.image} 
                alt={character.name[language]}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            
            {/* Nameplate - Compact */}
            <div 
              className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center whitespace-nowrap"
              style={{
                textShadow: "0 0 10px rgba(0, 0, 0, 0.8)",
              }}
            >
              <p className="text-[10px] font-bold text-[#FFD700]">{character.name.en}</p>
              <p className="text-[8px] text-[#C0C0C0]">
                {character.name["zh-TW"]}
              </p>
            </div>
          </div>
        );
      })}

      {/* Center text */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <p 
          className="text-[10px] font-bold"
          style={{ 
            color: "#00FF41",
            textShadow: "0 0 10px rgba(0, 255, 65, 0.5)",
          }}
        >
          {language === "en" ? "SELECT" : "選擇"}
        </p>
      </div>
    </div>
  );
}
