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
  Button
} from '@ramme-io/ui';
// ✅ IMPORT CUSTOM COMPONENTS
import { SmartTable } from '../features/datagrid/SmartTable';
import { SmartChart } from '../features/visualizations/SmartChart';

export const COMPONENT_REGISTRY: Record<string, React.FC<any>> = {
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

  // --- ALIASES FOR BUILDER (snake_case -> Component) ---
  'stat_card': StatCard,
  'chart_line': LineChart,
  'chart_bar': BarChart,
  'chart_pie': PieChart,
  'smart_table': SmartTable,
  'smart_chart': SmartChart,
  'button': Button || ((props: any) => <button {...props} />),
};

export const getComponent = (name: string) => {
  // Normalize key (e.g. 'smart_table' -> 'SmartTable' if needed, or simple lookup)
  const Component = COMPONENT_MAP[name] || COMPONENT_MAP[name.toLowerCase()] || COMPONENT_MAP[name.replace(/_/g, '')];

  if (!Component) {
    console.warn(`[Registry] Unknown component: "${name}"`);
    
    // ✅ OPTIMIZATION: Return a "Ghost" placeholder instead of crashing
    // This maintains layout stability and informs the user.
    return ({ ...props }) => (
      <div className="p-4 border-2 border-dashed border-red-200 bg-red-50 rounded-lg flex flex-col items-center justify-center text-red-400 min-h-[100px] h-full w-full">
        <span className="text-xs font-mono font-bold uppercase">{name}</span>
        <span className="text-[10px] mt-1 opacity-75">Component Not Found</span>
        <div className="hidden">{JSON.stringify(props)}</div>
      </div>
    );
  }
  return Component;
};

// Helper mapping for normalization
const COMPONENT_MAP = Object.keys(COMPONENT_REGISTRY).reduce((acc, key) => {
    acc[key] = COMPONENT_REGISTRY[key];
    acc[key.toLowerCase()] = COMPONENT_REGISTRY[key];
    acc[key.replace(/_/g, '').toLowerCase()] = COMPONENT_REGISTRY[key];
    return acc;
}, {} as Record<string, React.FC<any>>);