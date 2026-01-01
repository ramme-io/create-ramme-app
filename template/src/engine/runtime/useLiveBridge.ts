import { useState, useEffect, useRef } from 'react';
import { appManifest as staticManifest } from '../../config/app.manifest';
import type { AppSpecification } from '../validation/schema';

export const useLiveBridge = () => {
  // 1. Initialize with Static Data (Fallback)
  const [manifest, setManifest] = useState<AppSpecification>(staticManifest);
  const [isLive, setIsLive] = useState(false);
  
  // Use a ref to ensure listeners aren't duplicated in StrictMode
  const isListening = useRef(false);

  useEffect(() => {
    if (isListening.current) return;
    isListening.current = true;

    const handleMessage = (event: MessageEvent) => {
      // Optional Security Check: if (event.origin !== "http://localhost:3000") return;

      if (event.data?.type === 'RAMME_SYNC_MANIFEST') {
        const payload = event.data.payload;
        setManifest(payload);
        setIsLive(true);
      }
    };

    window.addEventListener('message', handleMessage);
    
    // ✅ CRITICAL FIX: The Global Handshake Guard
    // Prevents infinite loops if the component remounts
    if (window.parent !== window && !(window as any).__RAMME_HANDSHAKE_SENT) {
       console.log("🔌 [Bridge] Sending Ready Signal...");
       window.parent.postMessage({ type: 'RAMME_CLIENT_READY' }, '*');
       (window as any).__RAMME_HANDSHAKE_SENT = true; 
    }

    return () => {
        window.removeEventListener('message', handleMessage);
        isListening.current = false;
    };
  }, []);

  return { manifest, isLive };
};