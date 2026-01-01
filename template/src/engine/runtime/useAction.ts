import { useCallback } from 'react';
import { useMqtt } from './MqttContext';
// ❌ REMOVED: import { appManifest } from '../../config/app.manifest';
// ✅ ADDED: Live Context
import { useManifest } from './ManifestContext';

export const useAction = () => {
  const { publish, isConnected } = useMqtt();
  
  // ✅ 1. Consume Live Manifest
  const appManifest = useManifest();
  const { config, domain } = appManifest;

  const sendAction = useCallback(async (entityId: string, value: any) => {
    // 2. Find the Entity definition (Live)
    const entity = domain.entities.find(e => e.id === entityId);
    
    if (!entity) {
      console.warn(`[Action] Entity ID '${entityId}' not found in manifest.`);
      return;
    }

    const signalId = entity.signals[0];
    const signal = domain.signals.find(s => s.id === signalId);

    if (!signal) {
      console.warn(`[Action] No signal linked to entity: ${entityId}`);
      return;
    }

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