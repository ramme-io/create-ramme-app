// src/hooks/useAction.ts
import { useCallback } from 'react';
import { useMqtt } from '../contexts/MqttContext';
import { appManifest } from '../config/app.manifest';

export const useAction = () => {
  const { publish, isConnected } = useMqtt();
  const { config, domain } = appManifest;

  const sendAction = useCallback(async (entityId: string, value: any) => {
    // 1. Find the Entity definition
    const entity = domain.entities.find(e => e.id === entityId);
    if (!entity) {
      console.warn(`[Action] Entity not found: ${entityId}`);
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
      // In a real app, we would update the local cache optimistically here
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
      // Note: This will likely fail (404/405) against a static .json file, 
      // but this is the correct code for a real API.
      try {
        await fetch(signal.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: signal.id, value })
        });
      } catch (err) {
        // We expect this to fail on the static demo, so we suppress the error alert
        console.log('[HTTP] (Simulation) Request sent.'); 
      }
    }

  }, [config.mockMode, isConnected, publish, domain]);

  return { sendAction };
};