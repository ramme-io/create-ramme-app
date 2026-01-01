// ✅ Match the export from your new mockData.ts
import { DATA_REGISTRY } from '../../data/mockData'; 

/**
 * @file data-seeder.ts
 * @description The "Big Bang" for the client-side database.
 * * ARCHITECTURAL ROLE:
 * This utility ensures that the LocalStorage "Data Lake" is never empty.
 * On app launch, it checks if data exists. If not, it writes the seed data
 * from `mockData.ts` into the browser's storage.
 */

// 🔒 SHARED CONSTANT: Ensure everyone uses the same key format
const DB_PREFIX = 'ramme_mock_'; 

export const initializeDataLake = () => {
  if (typeof window === 'undefined') return;

  console.groupCollapsed('🌊 [Data Lake] Initialization');
  
  Object.entries(DATA_REGISTRY).forEach(([key, seedData]) => {
    // ✅ FIX: Use the prefix so getMockData() can find it
    const storageKey = `${DB_PREFIX}${key}`; 
    const existing = localStorage.getItem(storageKey);

    if (!existing) {
      console.log(`✨ Seeding collection: ${key} (${(seedData as any[]).length} records)`);
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
  Object.keys(DATA_REGISTRY).forEach((key) => {
    const storageKey = `${DB_PREFIX}${key}`;
    localStorage.removeItem(storageKey); 
  });
  console.log("🔥 Data Lake Evaporated (Cleared)");
  window.location.reload();
};