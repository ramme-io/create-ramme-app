import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import mqtt, { type MqttClient } from 'mqtt';
// ❌ REMOVED: import { appManifest } from '../../config/app.manifest';
// ✅ ADDED: Live Context
import { useManifest } from './ManifestContext';

interface MqttContextType {
  isConnected: boolean;
  lastMessage: Record<string, string>;
  publish: (topic: string, message: string) => void;
  subscribe: (topic: string) => void;
  unsubscribe: (topic: string) => void;
}

const MqttContext = createContext<MqttContextType | null>(null);

export const MqttProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<Record<string, string>>({});
  const clientRef = useRef<MqttClient | null>(null);
  const subscriptions = useRef<Set<string>>(new Set());

  // ✅ 1. Consume Live Manifest
  const appManifest = useManifest();

  useEffect(() => {
    // ✅ 2. Hot-Swap Broker Connection
    // If you change the Broker URL in the Builder, this effect will re-run!
    const brokerUrl = appManifest.config.brokerUrl || 'wss://test.mosquitto.org:8081';
    console.log(`[MQTT] Connecting to ${brokerUrl}...`);
    
    // Disconnect previous if exists
    if (clientRef.current) {
        clientRef.current.end();
    }

    const client = mqtt.connect(brokerUrl);
    clientRef.current = client;

    client.on('connect', () => {
      console.log('[MQTT] Connected ✅');
      setIsConnected(true);
      // Re-subscribe to previous topics if needed
      subscriptions.current.forEach(t => client.subscribe(t));
    });

    client.on('message', (topic: string, payload: Buffer) => {
      const messageStr = payload.toString();
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
  }, [appManifest.config.brokerUrl]); // Only re-connect if URL changes

  const subscribe = (topic: string) => {
    if (clientRef.current && !subscriptions.current.has(topic)) {
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