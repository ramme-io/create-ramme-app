// ✅ Match the export from your new mockData.ts
import { DATA_REGISTRY } from '../data/mockData'; 

const DB_PREFIX = 'ramme_db_';

export const initializeDataLake = () => {
  if (typeof window === 'undefined') return;

  console.groupCollapsed('🌊 [Data Lake] Initialization');
  
  Object.entries(DATA_REGISTRY).forEach(([key, seedData]) => {
    const storageKey = `${DB_PREFIX}${key}`;
    const existing = localStorage.getItem(storageKey);

    if (!existing) {
      console.log(`✨ Seeding collection: ${key} (${seedData.length} records)`);
      localStorage.setItem(storageKey, JSON.stringify(seedData));
    } else {
      console.log(`✅ Collection exists: ${key}`);
    }
  });

  console.groupEnd();
};

/**
 * Utility to clear the lake (useful for a "Reset Data" button)
 */
export const resetDataLake = () => {
  // ✅ FIX: Use DATA_REGISTRY (the new name)
  Object.keys(DATA_REGISTRY).forEach((key) => {
    localStorage.removeItem(`${DB_PREFIX}${key}`);
  });
  window.location.reload();
};