import { useState, useCallback } from 'react';

/**
 * @hook useCrudLocalStorage
 * @description A generic hook for performing CRUD (Create, Read, Update, Delete)
 * operations on an array of items stored in the browser's localStorage.
 * * It serves as the "Database Engine" for the mock runtime.
 *
 * @param storageKey The unique key for this data in localStorage (e.g., 'ramme_db_users').
 * @param initialData The default data to seed localStorage with if it's empty.
 * @returns An object with the current data and functions to manipulate it.
 */
export const useCrudLocalStorage = <T extends { id: any }>(
  storageKey: string,
  initialData: T[]
) => {
  // 1. Initialize State from LocalStorage
  const [data, setData] = useState<T[]>(() => {
    // Safety check for Server-Side Rendering
    if (typeof window === 'undefined') return initialData;
    
    try {
      const item = window.localStorage.getItem(storageKey);
      if (item) {
        return JSON.parse(item);
      } else {
        // Seed the "DB" if empty
        window.localStorage.setItem(storageKey, JSON.stringify(initialData));
        return initialData;
      }
    } catch (error) {
      console.error(`[Data Lake] Error reading key "${storageKey}":`, error);
      return initialData;
    }
  });

  // 2. CREATE
  const createItem = useCallback((newItem: Omit<T, 'id'>) => {
    setData(prevData => {
      // ✅ ROBUST ID GENERATION (Zero Jank)
      // Detects if existing IDs are Numbers or Strings to prevent type conflicts.
      let newId: any;
      const isNumeric = prevData.length > 0 && typeof prevData[0].id === 'number';

      if (isNumeric) {
        const maxId = prevData.reduce((max, item) => (typeof item.id === 'number' && item.id > max ? item.id : max), 0);
        newId = maxId + 1;
      } else {
        // Fallback for string IDs (e.g. 'usr_17354...')
        newId = `id_${Date.now()}`;
      }

      const fullNewItem = { ...newItem, id: newId } as T;
      
      const updatedData = [...prevData, fullNewItem];
      window.localStorage.setItem(storageKey, JSON.stringify(updatedData));
      return updatedData;
    });
  }, [storageKey]);

  // 3. UPDATE
  const updateItem = useCallback((updatedItem: T) => {
    setData(prevData => {
      const updatedData = prevData.map(item =>
        item.id === updatedItem.id ? updatedItem : item
      );
      window.localStorage.setItem(storageKey, JSON.stringify(updatedData));
      return updatedData;
    });
  }, [storageKey]);

  // 4. DELETE
  const deleteItem = useCallback((id: T['id']) => {
    setData(prevData => {
      const updatedData = prevData.filter(item => item.id !== id);
      window.localStorage.setItem(storageKey, JSON.stringify(updatedData));
      return updatedData;
    });
  }, [storageKey]);

  return { data, createItem, updateItem, deleteItem };
};