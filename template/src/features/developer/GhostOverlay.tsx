import React from 'react';
import { Icon } from '@ramme-io/ui';

interface GhostOverlayProps {
  children: React.ReactNode;
  componentId: string;
  componentType: string;
  signalId?: string;
  isActive?: boolean;
}

export const GhostOverlay: React.FC<GhostOverlayProps> = ({
  children,
  componentId,
  componentType,
  signalId,
  isActive = false,
}) => {
  
  if (!isActive) {
    return <>{children}</>;
  }

  const handleClick = (e: React.MouseEvent) => {
    // 🛑 Stop the click from triggering app logic (like navigation or toggles)
    e.preventDefault();
    e.stopPropagation();

    // 🚀 THE GHOST BRIDGE: Signal the Parent (The Builder)
    window.parent.postMessage({
      type: 'RAMME_SELECT_BLOCK',
      payload: { blockId: componentId }
    }, '*');
  };

  return (
    <div 
      className="relative group cursor-pointer"
      onClick={handleClick} // ✅ Add Click Handler
    >
      {/* The "Ghost" Border */}
      <div className="absolute inset-0 z-50 border-2 border-dashed border-accent/50 rounded-lg bg-accent/5 group-hover:bg-accent/10 transition-colors pointer-events-none" />

      {/* The "Info Tag" */}
      <div className="absolute top-0 left-0 z-50 p-2 transform -translate-y-1/2 translate-x-2 pointer-events-none">
        <div className="flex items-center gap-2 bg-accent text-accent-foreground text-xs font-mono py-1 px-2 rounded shadow-sm">
          <Icon name="box" size={12} />
          <span className="font-bold">{componentType}</span>
        </div>
      </div>

      {/* The "Signal Wire" */}
      {signalId && (
        <div className="absolute bottom-0 right-0 z-50 p-2 transform translate-y-1/2 -translate-x-2 pointer-events-none">
           <div className="flex items-center gap-1.5 bg-blue-600 text-white text-xs font-mono py-1 px-2 rounded shadow-sm">
            <Icon name="activity" size={12} />
            <span>{signalId}</span>
          </div>
        </div>
      )}

      {/* Render the actual component underneath */}
      <div className="opacity-50 grayscale transition-all duration-200 group-hover:opacity-75 group-hover:grayscale-0 pointer-events-none">
        {children}
      </div>
    </div>
  );
};