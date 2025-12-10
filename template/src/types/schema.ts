// src/types/schema.ts
import { z } from 'zod';

// 1. Define what a "Signal" looks like in the config (Static definition)
export const SignalSchema = z.object({
  id: z.string(),
  label: z.string(),
  kind: z.enum(['sensor', 'setpoint', 'state']),
  unit: z.string().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
});

// 2. Define the Application Specification
export const AppSpecificationSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  version: z.string().default("1.0.0"),
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  // We will add 'pages' and 'navigation' here later
  signals: z.array(SignalSchema).default([]),
});

// Export the Types
export type SignalDef = z.infer<typeof SignalSchema>;
export type AppSpecification = z.infer<typeof AppSpecificationSchema>;