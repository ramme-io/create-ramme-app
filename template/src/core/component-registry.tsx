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
} from '@ramme-io/ui';

/**
 * The Registry maps the "string" name of a component (from the JSON manifest)
 * to the actual React component implementation.
 */
export const COMPONENT_REGISTRY: Record<string, React.FC<any>> = {
  // --- Core Components ---
  DeviceCard,
  StatCard,
  BarChart,
  LineChart,
  PieChart,
  DataTable,
  Card,
  Alert,
  EmptyState,

  // --- 🛡️ ROBUSTNESS ALIASES ---
  // These mappings allow the manifest to use lowercase or alternate names
  // without crashing the application.
  
  // Tables
  'table': DataTable,       // Fixes your specific error
  'Table': DataTable,
  'grid': DataTable,

  // Charts
  'chart': BarChart,        // Default generic chart to BarChart
  'line': LineChart,
  'bar': BarChart,
  'pie': PieChart,

  // IoT Fallbacks
  'DataCard': DeviceCard,
  'GaugeCard': DeviceCard,
  'ToggleCard': DeviceCard,
  'SliderCard': DeviceCard,
  'SparklineCard': DeviceCard,
};

/**
 * Helper to safely resolve a component.
 * Returns a fallback if the component name is unknown.
 */
export const getComponent = (name: string) => {
  // 1. Try direct lookup
  let Component = COMPONENT_REGISTRY[name];

  // 2. If not found, try PascalCase (e.g. "deviceCard" -> "DeviceCard")
  if (!Component) {
    const pascalName = name.charAt(0).toUpperCase() + name.slice(1);
    Component = COMPONENT_REGISTRY[pascalName];
  }

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