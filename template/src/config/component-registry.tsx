import React from 'react';
// ✅ 1. Import the Master Registry from the UI Library (Tier 1: Atoms)
// This instantly pulls in Button, Card, Inputs, Layouts, Navigation, etc.
import { AUTO_REGISTRY } from '@ramme-io/ui';

// ✅ 2. Import Local "Smart Blocks" (Tier 2: Logic)
// These exist only in the App (Starter), not the UI library.
import { SmartTable } from '../features/datagrid/SmartTable';
import { SmartChart } from '../features/visualizations/SmartChart';

// ✅ 3. MERGE EVERYTHING
export const COMPONENT_REGISTRY: Record<string, React.FC<any>> = {
  // A. The Entire UI Library (~50+ components)
  ...AUTO_REGISTRY,

  // B. The Smart Blocks (Data-Connected)
  SmartTable,
  SmartChart,

  // C. Legacy Aliases (For older AI prompts/manifests)
  'smart_table': SmartTable,
  'smart_chart': SmartChart,
  'stat_card': AUTO_REGISTRY['StatCard'],
  'chart_line': AUTO_REGISTRY['LineChart'],
  'chart_bar': AUTO_REGISTRY['BarChart'],
  'chart_pie': AUTO_REGISTRY['PieChart'],
};

// --- COMPONENT RESOLVER ENGINE ---
export const getComponent = (name: string) => {
  // 1. Normalize the key to handle case-insensitivity and snake_case
  // e.g. "page_header" -> "PageHeader", "button" -> "Button"
  const normalizedName = name.replace(/_/g, '').toLowerCase();
  
  // 2. Lookup Strategy
  // We check the exact name, then the lowercase version, then the normalized version
  const Component = 
    COMPONENT_REGISTRY[name] || 
    COMPONENT_MAP_LOWER[name.toLowerCase()] || 
    COMPONENT_MAP_NORMALIZED[normalizedName];

  // 3. Safety Net (Ghost Placeholder)
  if (!Component) {
    console.warn(`[Registry] ❌ Unknown component: "${name}"`);
    
    return ({ ...props }) => (
      <div className="p-4 border-2 border-dashed border-red-200 bg-red-50 rounded-lg flex flex-col items-center justify-center text-red-400 min-h-[100px] h-full w-full animate-in fade-in">
        <span className="text-xs font-mono font-bold uppercase tracking-wider">{name}</span>
        <span className="text-[10px] mt-1 opacity-75">Component Missing</span>
        {/* Hidden debug data for developers */}
        <div className="hidden">{JSON.stringify(props)}</div>
      </div>
    );
  }
  return Component;
};

// --- OPTIMIZATION: PRE-CALCULATED LOOKUP MAPS ---
// We generate these once on startup so we don't map/reduce on every render.

const COMPONENT_MAP_LOWER = Object.keys(COMPONENT_REGISTRY).reduce((acc, key) => {
    acc[key.toLowerCase()] = COMPONENT_REGISTRY[key];
    return acc;
}, {} as Record<string, React.FC<any>>);

const COMPONENT_MAP_NORMALIZED = Object.keys(COMPONENT_REGISTRY).reduce((acc, key) => {
    acc[key.replace(/_/g, '').toLowerCase()] = COMPONENT_REGISTRY[key];
    return acc;
}, {} as Record<string, React.FC<any>>);