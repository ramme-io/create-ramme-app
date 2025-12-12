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
  // IoT Primitives
  DeviceCard,
  
  // Data Display
  StatCard,
  BarChart,
  LineChart,
  PieChart,
  DataTable,
  
  // Layout & Feedback
  Card,
  Alert,
  EmptyState,
};

/**
 * Helper to safely resolve a component.
 * Returns a fallback if the component name is unknown.
 */
export const getComponent = (name: string) => {
  const Component = COMPONENT_REGISTRY[name];
  if (!Component) {
    console.warn(`[Registry] Unknown component type: "${name}"`);
    return () => (
      <Alert variant="warning" title="Unknown Component">
        The system tried to render <code>{name}</code> but it was not found in the registry.
      </Alert>
    );
  }
  return Component;
};