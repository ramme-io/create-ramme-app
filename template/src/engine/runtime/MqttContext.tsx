import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import mqtt, { type MqttClient } from 'mqtt';
import { appManifest } from '../../config/app.manifest'; // ✅ Connect to the Single Source of Truth

interface MqttContextType {
  isConnected: boolean;
  lastMessage: Record<string, string>;
  publish: (topic: string, message: string) => void;
  subscribe: (topic: string) => void;
  unsubscribe: (topic: string) => void;
}

const MqttContext = createContext<MqttContextType | null>(null);

/**
 * @file MqttContext.tsx
 * @description The Real-Time Connectivity Layer.
 *
 * ARCHITECTURAL ROLE:
 * This provider establishes a persistent WebSocket connection to the MQTT Broker
 * defined in `app.manifest.ts`.
 *
 * KEY FEATURES:
 * 1. **Global Connection:** Maintains one connection for the whole app (Singleton pattern).
 * 2. **Topic Management:** specific components (like DeviceCard) can subscribe to
 * specific topics on demand using `subscribe()`.
 * 3. **State Distribution:** Broadcasts the latest messages to any component using `useMqtt()`.
 */

export const MqttProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<Record<string, string>>({});
  const clientRef = useRef<MqttClient | null>(null);
  const subscriptions = useRef<Set<string>>(new Set());

  useEffect(() => {
    // ✅ Load Broker URL from the Manifest Config
    const brokerUrl = appManifest.config.brokerUrl || 'wss://test.mosquitto.org:8081';
    console.log(`[MQTT] Connecting to ${brokerUrl}...`);
    
    const client = mqtt.connect(brokerUrl);
    clientRef.current = client;

    client.on('connect', () => {
      console.log('[MQTT] Connected ✅');
      setIsConnected(true);
    });

    // ✅ FIX: Proper typing for MQTT payload (Buffer)
    client.on('message', (topic: string, payload: Buffer) => {
      const messageStr = payload.toString();
      // console.log(`[MQTT] Msg: ${topic} -> ${messageStr}`); // Optional debug
      setLastMessage((prev) => ({ ...prev, [topic]: messageStr }));
    });

    client.on('error', (err) => {
      console.error('[MQTT] Connection error: ', err);
      client.end();
    });

    return () => {
      console.log('[MQTT] Disconnecting...');
      client.end();
    };
  }, []);

  const subscribe = (topic: string) => {
    if (clientRef.current && !subscriptions.current.has(topic)) {
      console.log(`[MQTT] Subscribing to: ${topic}`);
      clientRef.current.subscribe(topic);
      subscriptions.current.add(topic);
    }
  };

  const unsubscribe = (topic: string) => {
    if (clientRef.current && subscriptions.current.has(topic)) {
      clientRef.current.unsubscribe(topic);
      subscriptions.current.delete(topic);
    }
  };

  const publish = (topic: string, message: string) => {
    if (clientRef.current) {
      clientRef.current.publish(topic, message);
    }
  };

  return (
    <MqttContext.Provider value={{ isConnected, lastMessage, subscribe, unsubscribe, publish }}>
      {children}
    </MqttContext.Provider>
  );
};

export const useMqtt = () => {
  const context = useContext(MqttContext);
  if (!context) throw new Error('useMqtt must be used within an MqttProvider');
  return context;
};