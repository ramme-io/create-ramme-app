import { create } from 'zustand';
import { useEffect } from 'react';

// --- 1. SIGNAL STORE ---
export interface SignalValue {
  value: any;
  timestamp: number;
}

interface SignalStore {
  signals: Record<string, SignalValue>;
  updateSignal: (id: string, value: any) => void;
  updateSignals: (updates: Record<string, any>) => void;
}

// Initial State matches app.manifest.ts
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

export const useGeneratedSignals = () => {
  return useSignalStore((state) => state.signals);
};

// --- 2. SIMULATION ENGINE ---
export const useSimulation = () => {
  const { updateSignals } = useSignalStore();

  useEffect(() => {
    console.log("[System] Simulation Started");
    const interval = setInterval(() => {
      // Simulate random fluctuations for sensors
      const updates: Record<string, any> = {};
      
      // Randomize values slightly
      updates['living_room_ac'] = Number((72 + (Math.random() * 4 - 2)).toFixed(1));
      updates['living_room_hum'] = Number((45 + (Math.random() * 6 - 3)).toFixed(1));
      updates['server_01'] = Math.floor(Math.random() * 100);
      
      updateSignals(updates);
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [updateSignals]);
};