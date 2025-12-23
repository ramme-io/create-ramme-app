import { useSignal } from '../hooks/useSignal';

export const useGeneratedSignals = () => {
  
  // 🟢 REAL: Connected to public MQTT test broker
  const living_room_ac = useSignal('living_room_ac', {
    initialValue: 72,
    min: 60,
    max: 90,
    unit: '°F',
    topic: 'ramme/test/temp' // <--- The magic link
  });

  // 🟠 MOCK: Simulation Mode
  const living_room_hum = useSignal('living_room_hum', {
    initialValue: 45,
    min: 40,
    max: 60,
    unit: '%'
  });

  const server_01 = useSignal('server_01', {
    initialValue: 42,
    min: 10,
    max: 95,
    unit: '%'
  });

  const front_door_lock = useSignal('front_door_lock', {
    initialValue: 'LOCKED',
    unit: ''
  });

  return {
    living_room_ac,
    living_room_hum,
    server_01,
    front_door_lock,
  };
};