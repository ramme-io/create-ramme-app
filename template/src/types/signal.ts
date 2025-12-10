// src/types/signal.ts
/**
 * @file signal.d.ts
 * @description Defines the universal contract for "Live Data" in the Ramme ecosystem.
 *
 * A "Signal" is a single data point that changes over time.
 * unlike a "Record" (which is static database row), a Signal is ephemeral.
 */

export type SignalStatus = 'fresh' | 'stale' | 'disconnected' | 'error';

export interface Signal<T = any> {
  id: string;          // The unique ID (e.g., "temp_01")
  value: T;            // The actual data (e.g., 24.5)
  unit?: string;       // Optional unit (e.g., "°C")
  timestamp: number;   // Unix timestamp of last update
  status: SignalStatus;
  meta?: Record<string, any>; // Extra metadata (e.g., limits)
}

// A simple map for looking up signals by ID
export type SignalMap = Record<string, Signal>;