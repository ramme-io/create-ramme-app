// ------------------------------------------------------------------
// GENERATED ADAPTER CODE
// Config: LIVE MODE (HTTP)
// ------------------------------------------------------------------
import { useEffect, useState } from 'react';

// Signal IDs defined in your Acme Corp schema
export type SignalId = 'mrr_stripe' | 'active_users';

export function useGeneratedSignals() {
  // 1. Initialize state with default values (0)
  const [signals, setSignals] = useState<Record<SignalId, any>>({
    'mrr_stripe': { value: 0, unit: 'USD', status: 'stale' },
    'active_users': { value: 0, unit: '', status: 'stale' }
  });

  // 2. HTTP Polling Implementation
  useEffect(() => {
    // Helper to extract nested data (e.g. "data.finance.mrr")
    const getNestedValue = (obj: any, path: string) => {
      return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    const pollEndpoints = async () => {
      console.log('🔄 Polling /api_mock.json...');
      
      try {
        const response = await fetch('/api_mock.json');
        if (response.ok) {
          const json = await response.json();
          
          // Update Signals based on the paths defined in manifest
          setSignals(prev => ({
            ...prev,
            'mrr_stripe': { 
              value: getNestedValue(json, 'data.finance.mrr'), 
              unit: 'USD', 
              status: 'fresh' 
            },
            'active_users': { 
              value: getNestedValue(json, 'data.users.total'), 
              unit: '', 
              status: 'fresh' 
            }
          }));
        }
      } catch (err) {
        console.error("API Polling Error:", err);
      }
    };

    // Initial Fetch
    pollEndpoints();
    
    // Poll every 5s
    const interval = setInterval(pollEndpoints, 5000);
    return () => clearInterval(interval);
  }, []);

  return signals;
}