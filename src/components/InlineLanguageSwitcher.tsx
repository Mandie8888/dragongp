import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

type Language = 'en' | 'zh-TW' | 'zh-CN';

const voiceLanguages: Record<Language, string> = {
  'en': 'en-US',
  'zh-TW': 'zh-HK',
  'zh-CN': 'zh-CN',
};

const languageNames: Record<Language, string> = {
  'en': 'English',
  'zh-TW': 'Cantonese (廣東話)',
  'zh-CN': 'Mandarin (普通話)',
};

export default function InlineLanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const languages: Language[] = ['en', 'zh-TW', 'zh-CN'];

  return (
    <div className="flex items-center gap-1 text-xs font-medium">
      {languages.map((lang, index) => (
        <React.Fragment key={lang}>
          <button
            onClick={() => setLanguage(lang)}
            className={`px-2 py-1 rounded transition-colors ${
              language === lang
                ? 'bg-gold-500 text-navy font-bold'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
            title={`Switch to ${languageNames[lang]}`}
          >
            {languageNames[lang]}
          </button>
          {index < languages.length - 1 && (
            <span className="text-muted-foreground/30">|</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}