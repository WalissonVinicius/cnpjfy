'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

type TranslationKeys = {
  [key: string]: string | TranslationKeys;
};

type Translations = {
  [locale: string]: {
    [namespace: string]: TranslationKeys;
  };
};

const translations: Translations = {};

// Cache para evitar múltiplas requisições
const loadingPromises: { [key: string]: Promise<any> } = {};

async function loadTranslation(locale: string, namespace: string): Promise<TranslationKeys> {
  const key = `${locale}-${namespace}`;
  
  if (translations[locale]?.[namespace]) {
    return translations[locale][namespace];
  }

  if (key in loadingPromises) {
    return loadingPromises[key];
  }

  loadingPromises[key] = fetch(`/locales/${locale}/${namespace}.json`)
    .then(res => res.json())
    .then(data => {
      if (!translations[locale]) {
        translations[locale] = {};
      }
      translations[locale][namespace] = data;
      delete loadingPromises[key];
      return data;
    })
    .catch(error => {
      console.error(`Failed to load translation ${locale}/${namespace}:`, error);
      delete loadingPromises[key];
      return {};
    });

  return loadingPromises[key];
}

function getNestedValue(obj: TranslationKeys, path: string): string {
  const keys = path.split('.');
  let current: any = obj;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return path; // Return key if not found
    }
  }
  
  return typeof current === 'string' ? current : path;
}

export function useTranslation(namespace: string = 'common') {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'pt-BR';
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadTranslation(locale, namespace).then(() => {
      setIsLoaded(true);
    });
  }, [locale, namespace]);

  const t = (key: string, fallback?: string): string => {
    if (!translations[locale]?.[namespace]) {
      return fallback || key;
    }
    
    const value = getNestedValue(translations[locale][namespace], key);
    return value || fallback || key;
  };

  return { t, locale, isLoaded };
}

// Hook para carregar múltiplos namespaces
export function useTranslations(namespaces: string[]) {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'pt-BR';
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    Promise.all(namespaces.map(ns => loadTranslation(locale, ns)))
      .then(() => setIsLoaded(true));
  }, [locale, namespaces]);

  const t = (namespace: string, key: string, fallback?: string): string => {
    if (!translations[locale]?.[namespace]) {
      return fallback || key;
    }
    
    const value = getNestedValue(translations[locale][namespace], key);
    return value || fallback || key;
  };

  return { t, locale, isLoaded };
}