import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types/index.ts';
import { translations } from '../i18n/translations.ts';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isUrdu: boolean;
  t: typeof translations['en'];
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('aitemad_lang') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('aitemad_lang', lang);
  };

  const isUrdu = language === 'ur';
  const dir = isUrdu ? 'rtl' : 'ltr';
  const t = translations[language];

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    if (isUrdu) {
      document.body.classList.add('font-urdu');
    } else {
      document.body.classList.remove('font-urdu');
    }
  }, [language, dir, isUrdu]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isUrdu, t, dir }}>
      <div dir={dir} className={isUrdu ? 'font-urdu' : ''}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
