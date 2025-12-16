import { z } from 'zod';

// ------------------------------------------------------------------
// 1. Signal Schema
// ------------------------------------------------------------------
export const SignalSchema = z.object({
  id: z.string().min(1, "Signal ID is required"),
  label: z.string(),
  description: z.string().optional(),
  
  // Classification
  kind: z.enum(['sensor', 'actuator', 'setpoint', 'metric', 'status', 'kpi']),
  
  // Data Source Configuration
  source: z.enum(['mock', 'mqtt', 'http', 'derived', 'local']),
  
  // Protocol-Specific Config 
  topic: z.string().optional(),      // For MQTT
  endpoint: z.string().optional(),   // For HTTP
  jsonPath: z.string().optional(),   // For parsing nested API responses
  refreshRate: z.number().optional().default(1000), 
  
  // Value Configuration
  defaultValue: z.any().optional(),
  unit: z.string().optional(),       
  
  // Validation
  min: z.number().optional(),
  max: z.number().optional(),
});

export type SignalDefinition = z.infer<typeof SignalSchema>;


// ------------------------------------------------------------------
// 2. Entity Schema
// ------------------------------------------------------------------
export const EntitySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  
  // Taxonomy
  type: z.string(), 
  category: z.string().default('logical'), 

  // Linkage
  signals: z.array(z.string()), 
  
  // UI Hints
  ui: z.object({
    icon: z.string().optional(), 
    color: z.string().optional(),
    dashboardComponent: z.string().optional(),
  }).optional(),
});

// <--- THIS WAS MISSING
export type EntityDefinition = z.infer<typeof EntitySchema>;


// ------------------------------------------------------------------
// 3. App Specification (The Root Object)
// ------------------------------------------------------------------
export const AppSpecificationSchema = z.object({
  meta: z.object({
    name: z.string(),
    version: z.string(),
    description: z.string().optional(),
    author: z.string().optional(),
    createdAt: z.string().optional(),
  }),
  
  domain: z.object({
    signals: z.array(SignalSchema),
    entities: z.array(EntitySchema),
  }),

  config: z.object({
    theme: z.enum(['light', 'dark', 'system', 'corporate', 'midnight', 'blueprint']).default('system'),
    mockMode: z.boolean().default(true), 
  }),
});

export type AppSpecification = z.infer<typeof AppSpecificationSchema>;