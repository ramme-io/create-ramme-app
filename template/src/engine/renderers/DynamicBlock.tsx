import React from 'react';
import { getComponent } from '../../config/component-registry';
// @ts-ignore
import { useGeneratedSignals } from '../runtime/useSignalStore';
import { getMockData } from '../../data/mockData';

/**
 * @file DynamicBlock.tsx
 * @description The "Runtime Hydrator" for the application.
 *
 * ARCHITECTURAL ROLE:
 * This component acts as the bridge between the Abstract Syntax Tree (JSON Manifest)
 * and the concrete React UI.
 *
 * KEY RESPONSIBILITIES:
 * 1. **Component Lookup:** Resolves string types ('StatCard') to actual React components.
 * 2. **Signal Injection:** Subscribes to the real-time Signal Engine and feeds live values to props.
 * 3. **Data Hydration:** Fetches static or async data (users, logs) based on `dataId`.
 * 4. **Status Normalization:** Translates system-level signal states into UI-friendly status colors.
 */

const mapSignalStatus = (status: string): string => {
  switch (status) {
    case 'fresh': return 'online';
    case 'stale': return 'warning';
    case 'disconnected': return 'offline';
    case 'error': return 'error';
    default: return 'offline';
  }
};

export const DynamicBlock: React.FC<any> = ({ block }) => {
  const Component = getComponent(block.type);
  const signals = useGeneratedSignals();

  const { signalId, dataId, ...staticProps } = block.props;
  
  const dynamicProps: Record<string, any> = { 
    ...staticProps,
    dataId,
    signalId 
  };

  // --- DATA INJECTION ---
  if (dataId) {
    const resolvedData = getMockData(dataId);
    dynamicProps.data = resolvedData || [];
    dynamicProps.rowData = resolvedData || [];
  }

  // --- SIGNAL INJECTION ---
  if (signalId && signals && signalId in signals) {
    // @ts-ignore
    const signalState = signals[signalId];

    if (signalState) {
      // ✅ FIX: Check for null and handle objects vs raw values
      const isSignalObject = typeof signalState === 'object' && signalState !== null;

      // Extract Value
      const rawValue = (isSignalObject && 'value' in signalState) 
        ? signalState.value 
        : signalState;

      // Extract Status
      const rawStatus = (isSignalObject && 'status' in signalState)
        ? signalState.status
        : 'fresh'; // Default for raw values

      dynamicProps.value = typeof rawValue === 'number' ? rawValue : String(rawValue);
      
      // ✅ FIX: Explicitly cast to String to satisfy TypeScript
      dynamicProps.status = mapSignalStatus(String(rawStatus));
    } else {
      dynamicProps.status = mapSignalStatus('disconnected');
    }
  }

  return <Component key={block.id} {...dynamicProps} />;
};