import { createContext, useContext, useState, ReactNode } from "react";

export type Language = "en" | "zh-TW" | "zh-CN";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  languageLabels: Record<Language, string>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const languageLabels: Record<Language, string> = {
  "en": "EN",
  "zh-TW": "繁體",
  "zh-CN": "简体",
};

export const languageFullNames: Record<Language, string> = {
  "en": "English",
  "zh-TW": "繁體中文",
  "zh-CN": "简体中文",
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");

  return (
    <LanguageContext.Provider value={{ language, setLanguage, languageLabels }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
