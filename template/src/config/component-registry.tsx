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
  ToggleSwitch,
  Button // Ensure Button is imported if used
} from '@ramme-io/ui';

// ✅ IMPORT YOUR CUSTOM COMPONENT
import { SmartTable } from '../features/datagrid/SmartTable';
import { SmartChart } from '../features/visualizations/SmartChart';

export const COMPONENT_REGISTRY: Record<string, React.FC<any>> = {
  // --- 1. Standard PascalCase Names (Keep these) ---
  DeviceCard,
  StatCard,
  BarChart,
  LineChart,
  PieChart,
  DataTable,
  SmartTable,
  SmartChart,
  Card,
  Alert,
  EmptyState,
  ToggleSwitch,

  // --- 2. ✅ ALIASES FOR BUILDER (snake_case -> Component) ---
  'stat_card': StatCard,     // Fixes "Unknown Component: stat_card"
  'chart_line': LineChart,   // Fixes "Unknown Component: chart_line"
  'chart_bar': BarChart,     // Future-proofing
  'chart_pie': PieChart,     // Future-proofing
  'smart_table': SmartTable, // Future-proofing
  'smart_chart': SmartChart, // Future-proofing
  'button': Button || ((props: any) => <button {...props} />), // Fallback if Button isn't in UI lib
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