import { z } from 'zod';

/**
 * @file schema.ts
 * @description The "Application Constitution".
 *
 * ARCHITECTURAL ROLE:
 * This file uses Zod to define the strict runtime validation rules for the 
 * App Manifest. While `manifest-types.ts` handles compile-time TypeScript checks,
 * this file handles runtime validation, ensuring that any JSON loaded into the 
 * engine (whether from a file, API, or user input) is structurally sound.
 *
 * LAYERS DEFINED:
 * 1. **SaaS Layer:** Data resources, fields, and tables.
 * 2. **Physical Layer:** IoT signals, sensors, and entities.
 * 3. **Logic Layer:** Workflows, triggers, and automated actions.
 * 4. **Presentation Layer:** Pages, sections, and UI blocks.
 */

// ------------------------------------------------------------------
// 1. DATA RESOURCE DEFINITIONS (SaaS Layer)
// ------------------------------------------------------------------

export const FieldSchema = z.object({
  key: z.string(),
  label: z.string(),
  type: z.enum(['text', 'number', 'currency', 'date', 'boolean', 'status', 'email', 'image', 'textarea']),
  required: z.boolean().optional(),
  description: z.string().optional(),
  defaultValue: z.any().optional(),
});
export type FieldDefinition = z.infer<typeof FieldSchema>;

export const ResourceSchema = z.object({
  id: z.string(),
  name: z.string(),
  fields: z.array(FieldSchema),
  defaultView: z.enum(['table', 'grid', 'list']).optional(),
  features: z.object({
    searchable: z.boolean().optional(),
    creatable: z.boolean().optional(),
    editable: z.boolean().optional(),
    deletable: z.boolean().optional(),
    exportable: z.boolean().optional(),
  }).optional(),
});
export type ResourceDefinition = z.infer<typeof ResourceSchema>;


// ------------------------------------------------------------------
// 2. SIGNAL & IOT DEFINITIONS (Physical Layer)
// ------------------------------------------------------------------

export const SignalSchema = z.object({
  id: z.string().min(1, "Signal ID is required"),
  label: z.string(),
  description: z.string().optional(),
  kind: z.enum(['sensor', 'actuator', 'setpoint', 'metric', 'status', 'kpi']),
  source: z.enum(['mock', 'mqtt', 'http', 'derived', 'local']),
  
  // Connectivity
  topic: z.string().optional(),      
  endpoint: z.string().optional(),   
  jsonPath: z.string().optional(),   
  refreshRate: z.number().optional().default(1000), 
  
  // Values
  defaultValue: z.any().optional(),
  unit: z.string().optional(),       
  min: z.number().optional(),
  max: z.number().optional(),
});
export type SignalDefinition = z.infer<typeof SignalSchema>;

export const EntitySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  type: z.string(), 
  category: z.string().default('logical'), 
  signals: z.array(z.string()), 
  ui: z.object({
    icon: z.string().optional(), 
    color: z.string().optional(),
    dashboardComponent: z.string().optional(),
  }).optional(),
});
export type EntityDefinition = z.infer<typeof EntitySchema>;

// ------------------------------------------------------------------
// ✅ NEW: LOGIC & WORKFLOW DEFINITIONS
// ------------------------------------------------------------------

export const TriggerSchema = z.object({
  id: z.string(),
  type: z.enum(['signal_change', 'manual_action', 'schedule', 'webhook']),
  config: z.record(z.string(), z.any()), 
});

export const ActionSchema = z.object({
  id: z.string(),
  type: z.enum([
    'update_resource', 
    'send_notification', 
    'mqtt_publish', 
    'api_call', 
    'navigate', 
    'agent_task'
  ]),
  config: z.record(z.string(), z.any()),
});

export const WorkflowSchema = z.object({
  id: z.string(),
  name: z.string(),
  active: z.boolean().default(true),
  trigger: TriggerSchema,
  actions: z.array(ActionSchema),
});
export type WorkflowDefinition = z.infer<typeof WorkflowSchema>;
export type ActionDefinition = z.infer<typeof ActionSchema>;


// ------------------------------------------------------------------
// 3. UI LAYOUT DEFINITIONS (Presentation Layer)
// ------------------------------------------------------------------

export const BlockSchema = z.object({
  id: z.string(),
  type: z.string(),
  props: z.record(z.string(), z.any()), 
  layout: z.object({
    colSpan: z.number().optional(),
    rowSpan: z.number().optional(),
  }).optional(),
});

export const PageSectionSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  layout: z.object({ 
    columns: z.number().optional(), 
    variant: z.enum(['grid', 'stack', 'split']).optional() 
  }).optional(),
  blocks: z.array(BlockSchema),
});

export const PageSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
  sections: z.array(PageSectionSchema),
});
export type PageDefinition = z.infer<typeof PageSchema>;


// MASTER APP SPECIFICATION
export const AppSpecificationSchema = z.object({
  meta: z.object({
    name: z.string(),
    version: z.string(),
    description: z.string().optional(),
    author: z.string().optional(),
    createdAt: z.string().optional(),
  }),
  
  config: z.object({
    theme: z.enum(['light', 'dark', 'system', 'corporate', 'midnight', 'blueprint']).default('system'),
    mockMode: z.boolean().default(true),
    brokerUrl: z.string().optional(),
  }),

  modules: z.array(z.string()).optional(),
  resources: z.array(ResourceSchema).optional(),
  
  domain: z.object({
    signals: z.array(SignalSchema),
    entities: z.array(EntitySchema),
    // ✅ ADDED WORKFLOWS HERE
    workflows: z.array(WorkflowSchema).optional(),
  }),

  pages: z.array(PageSchema).optional(),
});

export type AppSpecification = z.infer<typeof AppSpecificationSchema>;