import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations } from './translations';
import type { Locale, TranslationKeys } from './types';

type I18nContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationKeys;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    // 从 localStorage 读取，默认中文
    const saved = localStorage.getItem('locale') as Locale;
    return saved && ['zh-CN', 'en-US'].includes(saved) ? saved : 'zh-CN';
  });

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  const value: I18nContextType = {
    locale,
    setLocale,
    t: translations[locale],
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
