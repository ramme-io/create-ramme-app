import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
// ✅ FIX 1: Correct Path to Static Manifest
import { appManifest as staticManifest } from '../../config/app.manifest';
// ✅ FIX 2: Correct Path to Types
import type { AppSpecification } from '../validation/schema';

interface ManifestContextType {
  manifest: AppSpecification;
  isLive: boolean;
}

const ManifestContext = createContext<ManifestContextType>({ 
  manifest: staticManifest, 
  isLive: false 
});

export const ManifestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Initialize State
  const [manifest, setManifest] = useState<AppSpecification>(staticManifest);
  const [isLive, setIsLive] = useState(false);
  
  // 2. Global Listener Guard (Refs persist across re-renders)
  const isListening = useRef(false);

  useEffect(() => {
    // Prevent double-attaching listeners in StrictMode
    if (isListening.current) return;
    isListening.current = true;

    // A. Define the Listener
    const handleMessage = (event: MessageEvent) => {
      // Security: Filter out noise, listen only for our specific event
      if (event.data?.type === 'RAMME_SYNC_MANIFEST') {
        const payload = event.data.payload;
        // console.log("⚡️ [Context] Sync Received");
        setManifest(payload);
        setIsLive(true);
      }
    };

    // B. Attach Listener
    window.addEventListener('message', handleMessage);

    // C. Send Handshake (ONCE per session)
    // We check a global window property to ensure we never spam the parent,
    // even if this Provider is unmounted and remounted by React Router.
    if (window.parent !== window && !(window as any).__RAMME_HANDSHAKE_SENT) {
       console.log("🔌 [Context] Handshake Sent 🤝");
       window.parent.postMessage({ type: 'RAMME_CLIENT_READY' }, '*');
       (window as any).__RAMME_HANDSHAKE_SENT = true;
    }

    // Cleanup
    return () => {
      window.removeEventListener('message', handleMessage);
      isListening.current = false;
    };
  }, []);

  return (
    <ManifestContext.Provider value={{ manifest, isLive }}>
      {children}
    </ManifestContext.Provider>
  );
};

// --- CONSUMER HOOKS ---

export const useManifest = () => {
  const context = useContext(ManifestContext);
  if (!context) return staticManifest;
  return context.manifest;
};

// Returns 'live' | 'static' string to match your UI components
export const useBridgeStatus = () => {
  const context = useContext(ManifestContext);
  return context?.isLive ? 'live' : 'static';
};