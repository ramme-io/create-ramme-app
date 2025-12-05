import { useState, useCallback } from 'react';

/**
 * A generic hook for performing CRUD (Create, Read, Update, Delete)
 * operations on an array of items stored in the browser's localStorage.
 *
 * @param storageKey The unique key for this data in localStorage.
 * @param initialData The default data to seed localStorage with if it's empty.
 * @returns An object with the current data and functions to manipulate it.
 */
export const useCrudLocalStorage = <T extends { id: any }>(
  storageKey: string,
  initialData: T[]
) => {
  const [data, setData] = useState<T[]>(() => {
    try {
      const item = window.localStorage.getItem(storageKey);
      if (item) {
        // If data exists in localStorage, parse and return it.
        return JSON.parse(item);
      } else {
        // Otherwise, seed localStorage with the initial data.
        window.localStorage.setItem(storageKey, JSON.stringify(initialData));
        return initialData;
      }
    } catch (error) {
      console.error("Error reading from localStorage", error);
      return initialData;
    }
  });

  const createItem = useCallback((newItem: Omit<T, 'id'>) => {
    setData(prevData => {
      // Find the highest existing ID to safely create a new one.
      const maxId = prevData.reduce((max, item) => (item.id > max ? item.id : max), 0);
      const fullNewItem = { ...newItem, id: maxId + 1 } as T;
      
      const updatedData = [...prevData, fullNewItem];
      window.localStorage.setItem(storageKey, JSON.stringify(updatedData));
      return updatedData;
    });
  }, [storageKey]);

  const updateItem = useCallback((updatedItem: T) => {
    setData(prevData => {
      const updatedData = prevData.map(item =>
        item.id === updatedItem.id ? updatedItem : item
      );
      window.localStorage.setItem(storageKey, JSON.stringify(updatedData));
      return updatedData;
    });
  }, [storageKey]);

  const deleteItem = useCallback((id: T['id']) => {
    setData(prevData => {
      const updatedData = prevData.filter(item => item.id !== id);
      window.localStorage.setItem(storageKey, JSON.stringify(updatedData));
      return updatedData;
    });
  }, [storageKey]);

  return { data, createItem, updateItem, deleteItem };
};