import React from 'react';
import { getComponent } from '../core/component-registry';
import { useSignal } from '../hooks/useSignal';
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

interface DynamicBlockProps {
  block: {
    id: string;
    type: string;
    props: Record<string, any>;
  };
}

export const DynamicBlock: React.FC<DynamicBlockProps> = ({ block }) => {
  const Component = getComponent(block.type);
  const { signalId, dataId, ...staticProps } = block.props;

  // 1. Resolve Data
  const resolvedData = dataId ? getMockData(dataId) : staticProps.data;

  // 2. Signal Wiring
  const signalState = useSignal(signalId || '');

  // 3. Merge Props
  const dynamicProps: Record<string, any> = { 
    ...staticProps,
    // FIX: Pass data as BOTH 'data' (Charts) and 'rowData' (Tables)
    data: resolvedData || [], 
    rowData: resolvedData || [],
  };

  // 4. Inject Signal Data
  if (signalId && signalState) {
    dynamicProps.value = `${signalState.value}${signalState.unit || ''}`;
    if (signalState.status) {
      dynamicProps.status = mapSignalStatus(signalState.status);
      if (signalState.status === 'error') {
        dynamicProps.variant = 'destructive';
      }
    }
  }

  return <Component key={block.id} {...dynamicProps} />;
};