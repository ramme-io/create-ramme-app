import { useState, useEffect, useCallback } from 'react';

// Keys for localStorage to persist state across reloads
const STORAGE_KEY_GHOST_MODE = 'ramme_dev_ghost_mode';

export interface DevToolsState {
  isGhostMode: boolean;
  toggleGhostMode: () => void;
}

/**
 * @hook useDevTools
 * @description
 * Manages the state of development tools within the running application.
 * It persists preferences (like "Ghost Mode") to localStorage so debugging
 * sessions aren't interrupted by refreshes.
 */
export const useDevTools = (): DevToolsState => {
  // 1. Lazy initializer to read from storage immediately
  const [isGhostMode, setIsGhostMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY_GHOST_MODE);
      return stored ? JSON.parse(stored) : false;
    } catch (e) {
      console.warn('Failed to read dev tools state', e);
      return false;
    }
  });

  // 2. Toggle Handler with Persistence
  const toggleGhostMode = useCallback(() => {
    setIsGhostMode((prev) => {
      const newValue = !prev;
      try {
        window.localStorage.setItem(STORAGE_KEY_GHOST_MODE, JSON.stringify(newValue));
      } catch (e) {
        console.warn('Failed to save dev tools state', e);
      }
      return newValue;
    });
  }, []);

  // 3. Keyboard Shortcut (Optional but Pro-Level)
  // Ctrl + Shift + G to toggle Ghost Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'G') {
        e.preventDefault();
        toggleGhostMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleGhostMode]);

  return { isGhostMode, toggleGhostMode };
};