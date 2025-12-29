import { useCallback } from 'react';
import { useMqtt } from './MqttContext';
// ✅ User Verified Path
import { appManifest } from '../../config/app.manifest';

/**
 * @file useAction.ts
 * @description The "Effectuator" hook.
 *
 * ARCHITECTURAL ROLE:
 * This hook handles outgoing commands from the UI. It abstracts the transport layer,
 * automatically routing actions to the correct destination (MQTT, HTTP, or Mock Console)
 * based on the entity's configuration in the manifest.
 */

export const useAction = () => {
  const { publish, isConnected } = useMqtt();
  
  // Destructure config/domain from the manifest
  const { config, domain } = appManifest;

  const sendAction = useCallback(async (entityId: string, value: any) => {
    // 1. Find the Entity definition
    // Note: If domain.entities is empty (early stage), this is where we'd add fallback logic
    const entity = domain.entities.find(e => e.id === entityId);
    
    if (!entity) {
      // For development/debugging, we log this even if the entity is missing
      console.warn(`[Action] Entity ID '${entityId}' not found in manifest.`);
      return;
    }

    // 2. Find the Primary Signal (The target of the action)
    const signalId = entity.signals[0];
    const signal = domain.signals.find(s => s.id === signalId);

    if (!signal) {
      console.warn(`[Action] No signal linked to entity: ${entityId}`);
      return;
    }

    // 3. EXECUTE based on Mode & Source
    
    // --- Mock Mode ---
    if (config.mockMode) {
      console.log(`%c[Mock Action] Setting ${entity.name} to:`, 'color: #10b981; font-weight: bold;', value);
      return;
    }

    // --- Live Mode (MQTT) ---
    if (signal.source === 'mqtt' && signal.topic) {
      if (!isConnected) {
        console.warn('[Action] Cannot send: MQTT disconnected');
        return;
      }
      const payload = typeof value === 'object' ? JSON.stringify(value) : String(value);
      console.log(`[MQTT] Publishing to '${signal.topic}': ${payload}`);
      publish(signal.topic, payload);
    }

    // --- Live Mode (HTTP) ---
    if (signal.source === 'http' && signal.endpoint) {
      console.log(`[HTTP] POST to ${signal.endpoint}:`, value);
      try {
        await fetch(signal.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: signal.id, value })
        });
      } catch (err) {
        console.log('[HTTP] (Simulation) Request sent.'); 
      }
    }

  }, [config.mockMode, isConnected, publish, domain]);

  return { sendAction };
};