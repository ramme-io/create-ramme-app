import React, { useEffect, useState } from 'react';
import { Icon, cn } from '@ramme-io/ui';

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
  const [isRemoteSelected, setIsRemoteSelected] = useState(false);

  // --- 1. INBOUND BRIDGE: Listen for Builder Selections ---
  useEffect(() => {
    if (!isActive) return;

    const handleMessage = (event: MessageEvent) => {
      // Security Check: In prod, you'd check event.origin
      const { type, payload } = event.data || {};

      if (type === 'RAMME_HIGHLIGHT_BLOCK') {
        // If the Builder says "Highlight Block X", checking if it's us
        setIsRemoteSelected(payload?.blockId === componentId);
        
        // Optional: Scroll into view if selected remotely
        if (payload?.blockId === componentId) {
          document.getElementById(`ghost-${componentId}`)?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isActive, componentId]);

  if (!isActive) {
    return <>{children}</>;
  }

  // --- 2. OUTBOUND BRIDGE: Signal the Builder ---
  const handleClick = (e: React.MouseEvent) => {
    // 🛑 Zero Jank: Stop the click from triggering links/buttons
    e.preventDefault();
    e.stopPropagation();

    // 🚀 Signal the Parent
    window.parent.postMessage({
      type: 'RAMME_SELECT_BLOCK',
      payload: { blockId: componentId, type: componentType }
    }, '*');
    
    // Optimistic UI update (optional, usually we wait for parent to confirm)
    setIsRemoteSelected(true);
  };

  return (
    <div 
      id={`ghost-${componentId}`}
      className="relative group isolate" // isolate creates new stacking context
      onClick={handleClick}
    >
      {/* --- THE GHOST LAYER --- */}
      <div className={cn(
        "absolute inset-0 z-50 rounded-lg transition-all duration-200 pointer-events-auto cursor-pointer",
        // Default State (Hover)
        "hover:ring-2 hover:ring-primary/50 hover:bg-primary/5",
        // Selected State (Remote or Local)
        isRemoteSelected ? "ring-2 ring-primary bg-primary/10 shadow-[0_0_0_4px_rgba(var(--app-primary-color),0.1)]" : "border-2 border-dashed border-transparent"
      )} />

      {/* --- INFO BADGE (Top Left) --- */}
      <div className={cn(
        "absolute top-0 left-0 z-50 p-2 transform -translate-y-1/2 transition-opacity duration-200",
        isRemoteSelected || "group-hover:opacity-100 opacity-0"
      )}>
        <div className="flex items-center gap-2 bg-foreground text-background text-[10px] font-mono py-1 px-2 rounded shadow-sm border border-border">
          <Icon name="box" size={10} />
          <span className="font-bold">{componentType}</span>
          <span className="opacity-50">#{componentId.slice(0, 4)}</span>
        </div>
      </div>

      {/* --- DATA WIRE (Bottom Right) --- */}
      {signalId && (
        <div className={cn(
          "absolute bottom-0 right-0 z-50 p-2 transform translate-y-1/2 transition-opacity duration-200",
          isRemoteSelected || "group-hover:opacity-100 opacity-0"
        )}>
           <div className="flex items-center gap-1.5 bg-accent text-accent-foreground text-[10px] font-mono py-1 px-2 rounded shadow-sm border border-accent/20">
             <Icon name="activity" size={10} />
             <span>{signalId}</span>
          </div>
        </div>
      )}

      {/* --- CONTENT (Frozen) --- */}
      {/* We disable pointer events on children so buttons don't fire while Ghost is active */}
      <div className="pointer-events-none select-none">
        {children}
      </div>
    </div>
  );
};