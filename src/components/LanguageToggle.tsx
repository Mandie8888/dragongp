import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage, Language, languageFullNames, languageLabels } from "@/contexts/LanguageContext";

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  const languages: Language[] = ["en", "zh-TW", "zh-CN"];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-secondary/50 border border-border hover:bg-secondary hover:border-gold/30 transition-all duration-300">
          <Globe className="w-4 h-4 text-gold" />
          <span className="text-sm font-medium text-foreground">
            {languageLabels[language]}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-background border-border min-w-[140px] z-[9999]"
        sideOffset={5}
        style={{ zIndex: 9999 }}
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`cursor-pointer ${
              language === lang 
                ? "bg-gold/10 text-gold" 
                : "text-foreground hover:bg-secondary"
            }`}
          >
            <span className="font-medium">{languageFullNames[lang]}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageToggle;
