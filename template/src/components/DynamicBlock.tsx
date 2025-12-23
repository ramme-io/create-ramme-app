import React from 'react';
import { getComponent } from '../core/component-registry';
// @ts-ignore
import { useGeneratedSignals } from '../generated/hooks';
import { getMockData } from '../data/mockData';

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
      // ✅ FIX: Handle both Raw Values (Legacy) and Signal Objects (New)
      // If it's an object with a 'value' property, use that. Otherwise use it directly.
      const rawValue = (typeof signalState === 'object' && 'value' in signalState) 
        ? signalState.value 
        : signalState;

      const status = (typeof signalState === 'object' && 'status' in signalState)
        ? signalState.status
        : 'fresh'; // Default for raw values

      dynamicProps.value = typeof rawValue === 'number' ? rawValue : String(rawValue);
      dynamicProps.status = mapSignalStatus(status);
    } else {
      dynamicProps.status = mapSignalStatus('disconnected');
    }
  }

  return <Component key={block.id} {...dynamicProps} />;
};