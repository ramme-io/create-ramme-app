import { useMemo } from 'react';
import { useSignalStore } from './useSignalStore';
// ❌ REMOVED: import { appManifest } from '../../config/app.manifest';
// ✅ ADDED: Live Context
import { useManifest } from './ManifestContext';

export interface SignalState {
  id: string;
  value: any;
  unit?: string;
  min?: number;
  max?: number;
  timestamp?: number;
  status: 'fresh' | 'stale';
}

export const useSignal = (signalId: string): SignalState => {
  const signalData = useSignalStore((state) => state.signals[signalId]);
  
  // ✅ 1. Consume Live Manifest
  const appManifest = useManifest();

  // 2. Get Static Definition from Manifest (Live)
  const signalDef = useMemo(() => {
    return appManifest.domain.signals.find((s) => s.id === signalId);
  }, [signalId, appManifest]); // Re-run if manifest updates

  const value = signalData?.value ?? signalDef?.defaultValue ?? 0;
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