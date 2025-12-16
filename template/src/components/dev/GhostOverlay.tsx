/**
 * @file GhostOverlay.tsx
 * @repository ramme-app-starter
 * @description
 * A development-mode wrapper that provides "X-Ray vision" into the
 * application's structure.
 *
 * INTENT & PHILOSOPHY:
 * This component embodies the "Glass Box" doctrine of the Ramme Framework.
 * It allows creators to peer behind the "Visual Fidelity" of the prototype
 * and inspect the "Functional Fidelity" underneath.
 *
 * STRATEGIC VALUE:
 * 1. Traceability: It visually links a UI element (e.g., a Gauge) back to
 * its source definition in the manifest (e.g., Signal ID: 'temp_01').
 * 2. Debugging: It helps creators understand layout boundaries (Grid Cells)
 * and data flow without needing browser DevTools.
 * 3. Education: It reinforces the "Architect" mindset by exposing the
 * component hierarchy.
 *
 * USAGE:
 * Wrap any dynamic component in the `Dashboard.tsx` loop with this overlay.
 * It listens to a global `debugMode` state (likely from a store or context)
 * to toggle its visibility.
 */

import React from 'react';
import { Badge, Icon } from '@ramme-io/ui';
// We'll need a way to check if we are in "Debug/Ghost" mode.
// For now, we can pass it as a prop or assume a context hook exists.
// import { useDevTools } from '../../contexts/DevToolsContext';

interface GhostOverlayProps {
  /** The actual UI component being wrapped (e.g., DeviceCard) */
  children: React.ReactNode;
  
  /** The unique ID of the component from the manifest */
  componentId: string;
  
  /** The name of the React component being rendered (e.g., "StatCard") */
  componentType: string;
  
  /** (Optional) The ID of the data signal driving this component */
  signalId?: string;
  
  /** Whether the overlay is currently active (X-Ray Mode on) */
  isActive?: boolean;
}

export const GhostOverlay: React.FC<GhostOverlayProps> = ({
  children,
  componentId,
  componentType,
  signalId,
  isActive = false, // Default to off
}) => {
  
  if (!isActive) {
    return <>{children}</>;
  }

  return (
    <div className="relative group">
      {/* The "Ghost" Border 
        - dashed: indicates scaffolding/structure
        - accent color: differentiates dev tools from UI
      */}
      <div className="absolute inset-0 z-50 pointer-events-none border-2 border-dashed border-accent/50 rounded-lg bg-accent/5 group-hover:bg-accent/10 transition-colors" />

      {/* The "Info Tag" 
        - Floats top-left
        - Displays the technical 'bones' of the component
      */}
      <div className="absolute top-0 left-0 z-50 p-2 transform -translate-y-1/2 translate-x-2">
        <div className="flex items-center gap-2 bg-accent text-accent-foreground text-xs font-mono py-1 px-2 rounded shadow-sm">
          <Icon name="box" size={12} />
          <span className="font-bold">{componentType}</span>
          <span className="opacity-75">#{componentId}</span>
        </div>
      </div>

      {/* The "Signal Wire" 
        - Floats bottom-right if a signal is connected
        - Shows the data source wiring
      */}
      {signalId && (
        <div className="absolute bottom-0 right-0 z-50 p-2 transform translate-y-1/2 -translate-x-2">
           <div className="flex items-center gap-1.5 bg-blue-600 text-white text-xs font-mono py-1 px-2 rounded shadow-sm">
            <Icon name="activity" size={12} />
            <span>Signal: {signalId}</span>
          </div>
        </div>
      )}

      {/* Render the actual component underneath */}
      <div className="opacity-50 grayscale transition-all duration-200 group-hover:opacity-75 group-hover:grayscale-0">
        {children}
      </div>
    </div>
  );
};