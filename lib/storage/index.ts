// LocalStorage utilities for simple data persistence

const STORAGE_KEYS = {
  THEME: 'opencnpj-theme',
  LANGUAGE: 'opencnpj-language',
  RECENT_SEARCHES: 'opencnpj-recent-searches',
  USER_PREFERENCES: 'opencnpj-preferences',
  OFFLINE_STATUS: 'opencnpj-offline-status',
  COMPARISON_COMPANIES: 'opencnpj-comparison-companies',
} as const;

export interface UserPreferences {
  autoSaveHistory: boolean;
  maxHistoryItems: number;
  defaultExportFormat: 'json' | 'csv' | 'xlsx' | 'pdf';
  showWelcomeMessage: boolean;
  enableNotifications: boolean;
  compactView: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  autoSaveHistory: true,
  maxHistoryItems: 100,
  defaultExportFormat: 'json',
  showWelcomeMessage: true,
  enableNotifications: true,
  compactView: false,
};

// Generic storage functions
function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
}

function removeStorageItem(key: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn('Failed to remove from localStorage:', error);
  }
}

// Theme management
export function getTheme(): string {
  return getStorageItem(STORAGE_KEYS.THEME, 'system');
}

export function setTheme(theme: string): void {
  setStorageItem(STORAGE_KEYS.THEME, theme);
}

// Language management
export function getLanguage(): string {
  return getStorageItem(STORAGE_KEYS.LANGUAGE, 'pt-BR');
}

export function setLanguage(language: string): void {
  setStorageItem(STORAGE_KEYS.LANGUAGE, language);
}

// Recent searches management
export interface RecentSearch {
  cnpj: string;
  razaoSocial: string;
  timestamp: number;
}

export function getRecentSearches(): RecentSearch[] {
  return getStorageItem<RecentSearch[]>(STORAGE_KEYS.RECENT_SEARCHES, []);
}

// Alias for compatibility
export function getSearchHistory(): RecentSearch[] {
  return getRecentSearches();
}

export function addRecentSearch(search: Omit<RecentSearch, 'timestamp'>): void {
  const searches = getRecentSearches();
  const newSearch: RecentSearch = {
    ...search,
    timestamp: Date.now(),
  };
  
  // Remove existing entry for the same CNPJ
  const filtered = searches.filter(s => s.cnpj !== search.cnpj);
  
  // Add new search at the beginning
  const updated = [newSearch, ...filtered].slice(0, 10); // Keep only last 10
  
  setStorageItem(STORAGE_KEYS.RECENT_SEARCHES, updated);
}

export function clearRecentSearches(): void {
  removeStorageItem(STORAGE_KEYS.RECENT_SEARCHES);
}

// Alias for compatibility
export function clearSearchHistory(): void {
  clearRecentSearches();
}

// User preferences management
export function getUserPreferences(): UserPreferences {
  return getStorageItem<UserPreferences>(STORAGE_KEYS.USER_PREFERENCES, DEFAULT_PREFERENCES);
}

export function setUserPreferences(preferences: Partial<UserPreferences>): void {
  const current = getUserPreferences();
  const updated = { ...current, ...preferences };
  setStorageItem(STORAGE_KEYS.USER_PREFERENCES, updated);
}

export function resetUserPreferences(): void {
  setStorageItem(STORAGE_KEYS.USER_PREFERENCES, DEFAULT_PREFERENCES);
}

// Offline status management
export interface OfflineStatus {
  isOffline: boolean;
  lastOnline: number;
  offlineSince?: number;
}

export function getOfflineStatus(): OfflineStatus {
  return getStorageItem<OfflineStatus>(STORAGE_KEYS.OFFLINE_STATUS, {
    isOffline: false,
    lastOnline: Date.now(),
  });
}

export function setOfflineStatus(status: Partial<OfflineStatus>): void {
  const current = getOfflineStatus();
  const updated = { ...current, ...status };
  setStorageItem(STORAGE_KEYS.OFFLINE_STATUS, updated);
}

// Storage size management
export function getStorageSize(): { used: number; available: number } {
  if (typeof window === 'undefined') {
    return { used: 0, available: 0 };
  }
  
  try {
    let used = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length + key.length;
      }
    }
    
    // Estimate available space (most browsers have ~5-10MB limit)
    const estimated = 5 * 1024 * 1024; // 5MB
    return {
      used,
      available: Math.max(0, estimated - used),
    };
  } catch {
    return { used: 0, available: 0 };
  }
}

// Clear all app data
export function clearAllData(): void {
  if (typeof window === 'undefined') return;
  
  Object.values(STORAGE_KEYS).forEach(key => {
    removeStorageItem(key);
  });
}

// Export all localStorage data
export function exportLocalStorageData(): Record<string, any> {
  if (typeof window === 'undefined') return {};
  
  const data: Record<string, any> = {};
  
  Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        data[name] = JSON.parse(item);
      }
    } catch {
      // Skip invalid items
    }
  });
  
  return data;
}

// Import localStorage data
export function importLocalStorageData(data: Record<string, any>): void {
  if (typeof window === 'undefined') return;
  
  Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
    if (data[name] !== undefined) {
      try {
        setStorageItem(key, data[name]);
      } catch (error) {
        console.warn(`Failed to import ${name}:`, error);
      }
    }
  });
}

// Comparison companies storage functions
export interface ComparisonCompany {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia?: string;
  situacao: string;
  dataAbertura: string;
  capitalSocial: number;
  porte: string;
  naturezaJuridica: string;
  atividadePrincipal: {
    codigo: string;
    descricao: string;
  };
  endereco: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    municipio: string;
    uf: string;
    cep: string;
  };
  telefone?: string;
  email?: string;
  timestamp: number;
}

export function getComparisonCompanies(): ComparisonCompany[] {
  return getStorageItem(STORAGE_KEYS.COMPARISON_COMPANIES, []);
}

export function setComparisonCompanies(companies: ComparisonCompany[]): void {
  setStorageItem(STORAGE_KEYS.COMPARISON_COMPANIES, companies);
}

export function addComparisonCompany(company: Omit<ComparisonCompany, 'timestamp'>): void {
  const companies = getComparisonCompanies();
  
  // Remove existing company with same CNPJ
  const filteredCompanies = companies.filter(c => c.cnpj !== company.cnpj);
  
  // Add new company with timestamp
  const newCompany: ComparisonCompany = {
    ...company,
    timestamp: Date.now(),
  };
  
  // Limit to 4 companies maximum
  const updatedCompanies = [newCompany, ...filteredCompanies].slice(0, 4);
  
  setComparisonCompanies(updatedCompanies);
}

export function removeComparisonCompany(cnpj: string): void {
  const companies = getComparisonCompanies();
  const filteredCompanies = companies.filter(c => c.cnpj !== cnpj);
  setComparisonCompanies(filteredCompanies);
}

export function clearComparisonCompanies(): void {
  setStorageItem(STORAGE_KEYS.COMPARISON_COMPANIES, []);
}