import React from 'react';
import { getComponent } from '../core/component-registry';
import { useSignal } from '../hooks/useSignal';
import { getMockData } from '../data/mockData'; 

// 1. THE TRANSLATOR: Maps Data Status ('fresh') to UI Status ('online')
const mapSignalStatus = (status: string): string => {
  switch (status) {
    case 'fresh': return 'online';       // Active/Good
    case 'stale': return 'warning';      // Old data
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

  // 2. Resolve Data (Crucial Step)
  const resolvedData = dataId ? getMockData(dataId) : staticProps.data;

  // 3. Signal Wiring (Hooks must run unconditionally)
  // We pass an empty string if undefined, the hook handles the rest.
  const signalState = useSignal(signalId || '');

  // 4. Merge Props
  // We explicitly type this as Record<string, any> so we can inject new props without TS errors
  const dynamicProps: Record<string, any> = { 
    ...staticProps,
    data: resolvedData || [], 
  };

  // 5. Inject Signal Data (If valid)
  if (signalId && signalState) {
    // Inject the value (formatted with unit)
    dynamicProps.value = `${signalState.value}${signalState.unit || ''}`;
    
    // Inject the translated status
    if (signalState.status) {
      dynamicProps.status = mapSignalStatus(signalState.status);
      
      // Optional: Auto-map 'variant' for components like Badge that use it
      if (signalState.status === 'error') {
        dynamicProps.variant = 'destructive'; // UI terminology
      }
    }
  }

  return <Component key={block.id} {...dynamicProps} />;
};