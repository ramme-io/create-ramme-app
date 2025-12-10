import { useState, useEffect } from 'react';
import type { Signal } from '../types/signal';

/**
 * Configuration for the Mock Generator.
 * This allows us to simulate specific hardware constraints.
 */
interface SignalConfig<T> {
  initialValue?: T;
  min?: number;     // Prevent drifting too low
  max?: number;     // Prevent drifting too high
  interval?: number; // Update speed (ms)
  unit?: string;     // e.g., "°F", "%", "RPM"
}

/**
 * The "Universal Socket." 
 * UI Components use this hook to subscribe to data.
 * Currently running in "Synthetic Mode" (Mock) with bounded randomization.
 */
export function useSignal<T = any>(signalId: string, config: SignalConfig<T> = {}): Signal<T> {
  // Defaults
  const { 
    initialValue, 
    min = -Infinity, 
    max = Infinity, 
    interval = 2000, 
    unit 
  } = config;

  // 1. Initialize
  const [signal, setSignal] = useState<Signal<T>>({
    id: signalId,
    value: initialValue as T,
    unit: unit,
    timestamp: Date.now(),
    status: 'fresh',
  });

  useEffect(() => {
    // 2. SIMULATION: Generate synthetic data updates
    const timer = setInterval(() => {
      setSignal(prev => {
        let newValue: any = prev.value;

        // Only apply math if it's a number
        if (typeof prev.value === 'number') {
            // Generate drift
            const variance = (Math.random() - 0.5) * 2; // +/- 1
            let nextNum = prev.value + variance;

            // 🛡️ CLAMPING: Apply the physical bounds
            if (min !== undefined) nextNum = Math.max(min, nextNum);
            if (max !== undefined) nextNum = Math.min(max, nextNum);

            newValue = Number(nextNum.toFixed(1));
        }

        return {
          ...prev,
          value: newValue,
          timestamp: Date.now(),
          status: 'fresh',
          unit: unit // Ensure unit persists
        };
      });
    }, interval); 

    return () => clearInterval(timer);
  }, [signalId, min, max, interval, unit]);

  return signal;
}