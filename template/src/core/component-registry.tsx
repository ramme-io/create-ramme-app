import React from 'react';
import {
  DeviceCard,
  StatCard,
  BarChart,
  LineChart,
  PieChart,
  DataTable, 
  Card,
  Alert,
  EmptyState,
  ToggleSwitch
} from '@ramme-io/ui';

// ✅ IMPORT YOUR CUSTOM COMPONENT
import { SmartTable } from '../blocks/SmartTable';

export const COMPONENT_REGISTRY: Record<string, React.FC<any>> = {
  // IoT Primitives
  DeviceCard,
  
  // Data Display
  StatCard,
  BarChart,
  LineChart,
  PieChart,
  
  // Tables
  DataTable, // The raw grid
  
  // ✅ FIX: Map "SmartTable" to the actual SmartTable component
  // (Previously it was aliased to DataTable, which broke the UI)
  SmartTable: SmartTable, 
  
  // Layout & Feedback
  Card,
  Alert,
  EmptyState,
  
  // Forms/Controls
  ToggleSwitch
};

export const getComponent = (name: string) => {
  const Component = COMPONENT_REGISTRY[name];
  
  if (!Component) {
    console.warn(`[Registry] Unknown component type: "${name}"`);
    return () => (
      <Alert variant="danger" title="Unknown Component">
        The system tried to render <code>{name}</code> but it was not found in the registry.
      </Alert>
    );
  }
  return Component;
};