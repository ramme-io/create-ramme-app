import { create } from 'zustand';
import { useEffect } from 'react';

/**
 * @file useSignalStore.ts
 * @description The "Short-Term Memory" of the application.
 *
 * ARCHITECTURAL ROLE:
 * This Zustand store holds the instantaneous value of every Signal (IoT sensor).
 * It acts as the buffer between the high-speed data stream (MQTT/Simulation)
 * and the UI components.
 */

// --- 1. SIGNAL STORE TYPES ---
export interface SignalValue {
  value: any;
  timestamp: number;
}

interface SignalStore {
  signals: Record<string, SignalValue>;
  // Single update (used by UI controls)
  updateSignal: (id: string, value: any) => void;
  // Batch update (used by MQTT/Simulation)
  updateSignals: (updates: Record<string, any>) => void;
}

// Initial State matches your dashboard IDs to prevent "undefined" errors on load
const initialState = {
  living_room_ac: { value: 72, timestamp: Date.now() },
  living_room_hum: { value: 45, timestamp: Date.now() },
  server_01: { value: 42, timestamp: Date.now() },
  front_door_lock: { value: 'LOCKED', timestamp: Date.now() }
};

export const useSignalStore = create<SignalStore>((set) => ({
  signals: initialState,
  
  updateSignal: (id, value) => set((state) => ({
    signals: {
      ...state.signals,
      [id]: { value, timestamp: Date.now() }
    }
  })),

  updateSignals: (updates) => set((state) => {
    const newSignals = { ...state.signals };
    Object.entries(updates).forEach(([id, val]) => {
      newSignals[id] = { value: val, timestamp: Date.now() };
    });
    return { signals: newSignals };
  })
}));

/**
 * Hook to access specific signals in a component.
 * Usage: const signals = useGeneratedSignals();
 */
export const useGeneratedSignals = () => {
  return useSignalStore((state) => state.signals);
};

// --- 2. SIMULATION ENGINE (The Missing Piece) ---
/**
 * A hook that generates fake data for testing when no MQTT broker is connected.
 * You can toggle this on/off via the manifest config.
 */
export const useSimulation = (isEnabled: boolean = true) => {
  const { updateSignals } = useSignalStore();

  useEffect(() => {
    if (!isEnabled) return;

    console.log("[System] Simulation Mode: ON 🎲");
    const interval = setInterval(() => {
      // Simulate random fluctuations
      const updates: Record<string, any> = {};
      
      // Randomize values slightly around a baseline
      updates['living_room_ac'] = Number((72 + (Math.random() * 4 - 2)).toFixed(1));
      updates['living_room_hum'] = Number((45 + (Math.random() * 6 - 3)).toFixed(1));
      updates['server_01'] = Math.floor(Math.random() * 100);
      
      // Randomly flip the lock status occasionally (1% chance)
      if (Math.random() > 0.99) {
         updates['front_door_lock'] = Math.random() > 0.5 ? 'LOCKED' : 'UNLOCKED';
      }
      
      updateSignals(updates);
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [isEnabled, updateSignals]);
};