import { useMemo } from 'react';
import { useSignalStore } from './useSignalStore';
// ✅ Import Manifest to get static metadata (min, max, units)
import { appManifest } from '../../config/app.manifest';

export interface SignalState {
  id: string;
  value: any;
  unit?: string;
  min?: number;
  max?: number;
  timestamp?: number;
  status: 'fresh' | 'stale'; // Simplified status
}

/**
 * @hook useSignal
 * @description The "Signal Selector".
 *
 * ARCHITECTURAL ROLE:
 * This hook is the bridge between the Static Manifest and the Dynamic Store.
 * 1. It finds the signal definition in the Manifest (for min/max/unit).
 * 2. It grabs the live value from the Zustand SignalStore.
 * 3. It merges them into a single object for the UI to consume.
 */
export const useSignal = (signalId: string): SignalState => {
  // 1. Get Live Data from Store
  const signalData = useSignalStore((state: { signals: { [x: string]: any; }; }) => state.signals[signalId]);

  // 2. Get Static Definition from Manifest
  // We use useMemo so we don't search the array on every render
  const signalDef = useMemo(() => {
    return appManifest.domain.signals.find((s) => s.id === signalId);
  }, [signalId]);

  // 3. Merge and Return
  const value = signalData?.value ?? signalDef?.defaultValue ?? 0;
  
  // Determine if data is stale (older than 10 seconds)
  const isStale = signalData ? (Date.now() - signalData.timestamp > 10000) : true;

  return {
    id: signalId,
    value: value,
    unit: signalDef?.unit,
    min: signalDef?.min,
    max: signalDef?.max,
    timestamp: signalData?.timestamp,
    status: isStale ? 'stale' : 'fresh'
  };
};