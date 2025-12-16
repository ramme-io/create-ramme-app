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
 * The Registry maps the "string" name of a component (from the AI Manifest)
 * to the actual React component implementation.
 */
export const COMPONENT_REGISTRY: Record<string, React.FC<any>> = {
  // --- Data Display ---
  StatCard,
  BarChart,
  LineChart,
  PieChart,
  DataTable,
  
  // --- IoT & Controls ---
  DeviceCard,
  
  // MAPPING STRATEGY: 
  // The Wizard generates specific UI intents ("Gauge", "Toggle"). 
  // For now, we map these to our versatile 'DeviceCard' primitive.
  // In the future, we will build dedicated components for each.
  GaugeCard: DeviceCard,      
  SparklineCard: DeviceCard,  
  ToggleCard: DeviceCard,     
  SliderCard: DeviceCard,     

  // --- Layout & Feedback ---
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