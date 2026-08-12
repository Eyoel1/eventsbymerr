'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'am' | 'en';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  isLoaded: boolean;
  isSwitched: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'am',
  setLang: () => {},
  isLoaded: false,
  isSwitched: false,
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLangState] = useState<Language>('am');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSwitched, setIsSwitched] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('ebm-lang') as Language;
    if (saved === 'en' || saved === 'am') {
      setLangState(saved);
      if (saved === 'en') setIsSwitched(true);
    }
    setIsLoaded(true);
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    setIsSwitched(true);
    localStorage.setItem('ebm-lang', newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, isLoaded, isSwitched }}>
      <div
        data-lang-mode={lang}
        suppressHydrationWarning
        className={`${isLoaded ? 'loaded' : ''} ${isSwitched ? 'lang-switched' : ''}`}
      >
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
