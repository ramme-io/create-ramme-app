import { z } from 'zod';

// ------------------------------------------------------------------
// 1. Signal Schema (The "Nerve")
// Defines a single data point (e.g., "Living Room Temp", "Light Switch")
// ------------------------------------------------------------------
export const SignalSchema = z.object({
  id: z.string().min(1, "Signal ID is required"),
  label: z.string(),
  description: z.string().optional(),
  
  // Classification
  kind: z.enum(['sensor', 'actuator', 'setpoint', 'metric', 'status']),
  
  // Data Source Configuration (CRITICAL for the Adapter Factory)
  source: z.enum(['mock', 'mqtt', 'http', 'derived', 'local']),
  
  // Source-Specific Config 
  topic: z.string().optional(),      // For MQTT (e.g., "home/living/temp")
  endpoint: z.string().optional(),   // For HTTP (e.g., "/api/v1/weather")
  refreshRate: z.number().default(1000), 
  
  // Value Configuration
  defaultValue: z.any().optional(),
  unit: z.string().optional(),       
  
  // Validation
  min: z.number().optional(),
  max: z.number().optional(),
});

export type SignalDefinition = z.infer<typeof SignalSchema>;


// ------------------------------------------------------------------
// 2. Entity Schema (The "Atom")
// Defines a grouping of signals into a logical object (e.g., "Smart Thermostat")
// ------------------------------------------------------------------
export const EntitySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  
  // Taxonomy
  type: z.string(), // e.g., 'device', 'room', 'service'
  category: z.enum(['hardware', 'software', 'logical']).default('logical'),

  // The Signals that belong to this entity (References Signal IDs)
  signals: z.array(z.string()), 
  
  // UI Hints (How should this entity look?)
  ui: z.object({
    icon: z.string().optional(), // IconName
    color: z.string().optional(),
    dashboardComponent: z.string().optional(), // e.g., 'DeviceCard'
  }).optional(),
});

export type EntityDefinition = z.infer<typeof EntitySchema>;


// ------------------------------------------------------------------
// 3. App Specification (The "Master Plan")
// This is the JSON structure the App Builder will generate.
// ------------------------------------------------------------------
export const AppSpecificationSchema = z.object({
  meta: z.object({
    name: z.string(),
    version: z.string(),
    description: z.string().optional(),
    author: z.string().optional(),
    createdAt: z.string().optional(),
  }),
  
  // The Data Layer
  domain: z.object({
    signals: z.array(SignalSchema),
    entities: z.array(EntitySchema),
  }),

  // Global Config
  config: z.object({
    theme: z.enum(['light', 'dark', 'system']).default('system'),
    mockMode: z.boolean().default(true), 
  }),
});

export type AppSpecification = z.infer<typeof AppSpecificationSchema>;