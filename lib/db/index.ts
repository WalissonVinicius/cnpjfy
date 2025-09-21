import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { Company } from '../api';

interface OpenCNPJDB extends DBSchema {
  companies: {
    key: string;
    value: Company & {
      searchedAt: number;
      searchCount: number;
    };
    indexes: {
      'by-searched-at': number;
      'by-search-count': number;
      'by-razao-social': string;
    };
  };
  favorites: {
    key: string;
    value: {
      cnpj: string;
      razaoSocial: string;
      addedAt: number;
    };
  };
  searches: {
    key: string;
    value: {
      id: string;
      cnpj: string;
      query: string;
      timestamp: number;
      success: boolean;
      error?: string;
    };
    indexes: {
      'by-timestamp': number;
      'by-cnpj': string;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<OpenCNPJDB>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<OpenCNPJDB>('opencnpj-db', 1, {
      upgrade(db) {
        // Companies store
        const companiesStore = db.createObjectStore('companies', {
          keyPath: 'cnpj',
        });
        companiesStore.createIndex('by-searched-at', 'searchedAt');
        companiesStore.createIndex('by-search-count', 'searchCount');
        companiesStore.createIndex('by-razao-social', 'razaoSocial');

        // Favorites store
        db.createObjectStore('favorites', {
          keyPath: 'cnpj',
        });

        // Searches store
        const searchesStore = db.createObjectStore('searches', {
          keyPath: 'id',
        });
        searchesStore.createIndex('by-timestamp', 'timestamp');
        searchesStore.createIndex('by-cnpj', 'cnpj');
      },
    });
  }
  return dbPromise;
}

// Company operations
export async function saveCompany(company: Company): Promise<void> {
  const db = await getDB();
  const existing = await db.get('companies', company.cnpj);
  
  const companyData = {
    ...company,
    searchedAt: Date.now(),
    searchCount: (existing?.searchCount || 0) + 1,
  };
  
  await db.put('companies', companyData);
}

export async function getCompany(cnpj: string): Promise<Company | undefined> {
  const db = await getDB();
  const result = await db.get('companies', cnpj);
  if (!result) return undefined;
  
  // Remove metadata fields
  const { searchedAt, searchCount, ...company } = result;
  return company;
}

export async function getRecentCompanies(limit: number = 10): Promise<Company[]> {
  const db = await getDB();
  const companies = await db.getAllFromIndex('companies', 'by-searched-at', undefined, limit);
  
  return companies
    .sort((a, b) => b.searchedAt - a.searchedAt)
    .map(({ searchedAt, searchCount, ...company }) => company);
}

export async function getTrendingCompanies(limit: number = 10): Promise<{ cnpj: string; razaoSocial: string }[]> {
  const db = await getDB();
  const companies = await db.getAllFromIndex('companies', 'by-search-count', undefined, limit);
  
  return companies
    .sort((a, b) => b.searchCount - a.searchCount)
    .slice(0, limit)
    .map(company => ({
      cnpj: company.cnpj,
      razaoSocial: company.razaoSocial,
    }));
}

export async function searchCompaniesLocal(query: string, limit: number = 10): Promise<Company[]> {
  const db = await getDB();
  const companies = await db.getAll('companies');
  
  const searchTerm = query.toLowerCase();
  const filtered = companies.filter(company => 
    company.razaoSocial.toLowerCase().includes(searchTerm) ||
    (company.nomeFantasia && company.nomeFantasia.toLowerCase().includes(searchTerm)) ||
    company.cnpj.includes(query.replace(/\D/g, ''))
  );
  
  return filtered
    .slice(0, limit)
    .map(({ searchedAt, searchCount, ...company }) => company);
}

// Favorites operations
export async function addToFavorites(cnpj: string, razaoSocial: string): Promise<void> {
  const db = await getDB();
  await db.put('favorites', {
    cnpj,
    razaoSocial,
    addedAt: Date.now(),
  });
}

export async function removeFromFavorites(cnpj: string): Promise<void> {
  const db = await getDB();
  await db.delete('favorites', cnpj);
}

export async function getFavorites(): Promise<{ cnpj: string; razaoSocial: string; addedAt: number }[]> {
  const db = await getDB();
  const favorites = await db.getAll('favorites');
  return favorites.sort((a, b) => b.addedAt - a.addedAt);
}

export async function isFavorite(cnpj: string): Promise<boolean> {
  const db = await getDB();
  const favorite = await db.get('favorites', cnpj);
  return !!favorite;
}

// Search history operations
export async function addSearchHistory(
  cnpj: string,
  query: string,
  success: boolean,
  error?: string
): Promise<void> {
  const db = await getDB();
  const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  await db.put('searches', {
    id,
    cnpj,
    query,
    timestamp: Date.now(),
    success,
    error,
  });
}

export async function getSearchHistory(limit: number = 50): Promise<{
  id: string;
  cnpj: string;
  query: string;
  timestamp: number;
  success: boolean;
  error?: string;
}[]> {
  const db = await getDB();
  const searches = await db.getAllFromIndex('searches', 'by-timestamp', undefined, limit);
  return searches.sort((a, b) => b.timestamp - a.timestamp);
}

export async function clearSearchHistory(): Promise<void> {
  const db = await getDB();
  await db.clear('searches');
}

// Cleanup operations
export async function cleanupOldData(daysToKeep: number = 30): Promise<void> {
  const db = await getDB();
  const cutoffTime = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
  
  // Clean old searches
  const oldSearches = await db.getAllFromIndex('searches', 'by-timestamp', IDBKeyRange.upperBound(cutoffTime));
  for (const search of oldSearches) {
    await db.delete('searches', search.id);
  }
  
  // Clean companies that haven't been accessed recently and aren't favorites
  const favorites = await getFavorites();
  const favoriteCnpjs = new Set(favorites.map(f => f.cnpj));
  
  const oldCompanies = await db.getAllFromIndex('companies', 'by-searched-at', IDBKeyRange.upperBound(cutoffTime));
  for (const company of oldCompanies) {
    if (!favoriteCnpjs.has(company.cnpj)) {
      await db.delete('companies', company.cnpj);
    }
  }
}

// Export all data for backup
export async function exportAllData(): Promise<{
  companies: any[];
  favorites: any[];
  searches: any[];
}> {
  const db = await getDB();
  
  return {
    companies: await db.getAll('companies'),
    favorites: await db.getAll('favorites'),
    searches: await db.getAll('searches'),
  };
}