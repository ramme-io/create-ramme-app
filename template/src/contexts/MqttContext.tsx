import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import mqtt, { MqttClient } from 'mqtt';

interface MqttContextType {
  isConnected: boolean;
  lastMessage: Record<string, string>;
  publish: (topic: string, message: string) => void;
  subscribe: (topic: string) => void;
  unsubscribe: (topic: string) => void;
}

const MqttContext = createContext<MqttContextType | null>(null);

// Public Test Broker for "Out of the Box" functionality
// In a real app, this comes from config.ts
const DEFAULT_BROKER = 'wss://test.mosquitto.org:8081'; 

export const MqttProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<Record<string, string>>({});
  const clientRef = useRef<MqttClient | null>(null);
  
  // Track active subscriptions to avoid double-subscribing
  const subscriptions = useRef<Set<string>>(new Set());

  useEffect(() => {
    console.log(`[MQTT] Connecting to ${DEFAULT_BROKER}...`);
    
    const client = mqtt.connect(DEFAULT_BROKER);
    clientRef.current = client;

    client.on('connect', () => {
      console.log('[MQTT] Connected ✅');
      setIsConnected(true);
    });

    client.on('message', (topic: any, message: { toString: () => any; }) => {
      const payload = message.toString();
      setLastMessage((prev) => ({ ...prev, [topic]: payload }));
    });

    client.on('error', (err: any) => {
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