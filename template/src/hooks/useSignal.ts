import { useState, useEffect } from 'react';
import { useMqtt } from '../contexts/MqttContext';
import type { Signal } from '../types/signal';

interface SignalConfig<T> {
  initialValue?: T;
  min?: number;     
  max?: number;
  interval?: number; // Mock mode only
  unit?: string;
  topic?: string;    // Real mode only
}

export function useSignal<T = any>(signalId: string, config: SignalConfig<T> = {}): Signal<T> {
  const { 
    initialValue, 
    min = -Infinity, 
    max = Infinity, 
    interval = 2000, 
    unit,
    topic 
  } = config;

  const { subscribe, unsubscribe, lastMessage, isConnected } = useMqtt();

  const [signal, setSignal] = useState<Signal<T>>({
    id: signalId,
    value: initialValue as T,
    unit: unit,
    timestamp: Date.now(),
    status: 'fresh',
    max: max 
  });

  // --- REAL MODE: MQTT ---
  useEffect(() => {
    if (!topic || !isConnected) return;
    subscribe(topic);
    return () => unsubscribe(topic);
  }, [topic, isConnected, subscribe, unsubscribe]);

  useEffect(() => {
    if (!topic || !lastMessage[topic]) return;

    const rawValue = lastMessage[topic];
    let parsedValue: any = rawValue;

    // Auto-parse numbers and booleans
    if (!isNaN(Number(rawValue))) parsedValue = Number(rawValue);
    else if (rawValue.toLowerCase() === 'true' || rawValue === 'on') parsedValue = true;
    else if (rawValue.toLowerCase() === 'false' || rawValue === 'off') parsedValue = false;

    setSignal(prev => ({
        ...prev,
        value: parsedValue,
        timestamp: Date.now(),
        status: 'fresh'
    }));
  }, [lastMessage, topic]);

  // --- MOCK MODE: SIMULATION ---
  useEffect(() => {
    if (topic) return; // Disable mock if topic exists

    const timer = setInterval(() => {
      setSignal(prev => {
        let newValue: any = prev.value;
        if (typeof prev.value === 'number') {
            const variance = (Math.random() - 0.5) * 2; 
            let nextNum = prev.value + variance;
            if (min !== undefined) nextNum = Math.max(min, nextNum);
            if (max !== undefined) nextNum = Math.min(max, nextNum);
            newValue = Number(nextNum.toFixed(1));
        }
        return { ...prev, value: newValue, timestamp: Date.now(), status: 'fresh' };
      });
    }, interval); 

    return () => clearInterval(timer);
  }, [topic, min, max, interval]);

  return signal;
}