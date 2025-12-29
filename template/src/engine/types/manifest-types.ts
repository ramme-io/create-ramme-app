// src/core/manifest-types.ts

import { type IconName } from '@ramme-io/ui';

/**
 * Defines a simple navigation link structure used in menus.
 */
export interface ManifestLink {
  id: string;
  title: string;
  path: string;
  icon?: IconName;
}

/**
 * The fundamental unit of the UI.
 * Corresponds to a specific React component in the registry.
 */
export interface Block {
  id: string;
  type: string; // e.g., 'DeviceCard', 'StatCard', 'LineChart'
  props: Record<string, any>; // Static props (title, default values)
  layout?: {
    colSpan?: number;
    rowSpan?: number;
  };
}

/**
 * A horizontal container that groups blocks together.
 * Maps to a CSS Grid or Flex container.
 */
export interface PageSection {
  id: string;
  title?: string;
  description?: string;
  layout?: {
    columns?: number; // e.g., 3 (for a 3-column grid)
    variant?: 'grid' | 'stack';
  };
  blocks: Block[];
}

/**
 * A top-level page in the application.
 */
export interface PageDefinition {
  id: string;
  slug: string;
  title: string;
  description?: string;
  sections: PageSection[];
}

// ✅ NEW: Full App Specification Types (Matches app.manifest.ts)
export interface AppMeta {
  name: string;
  version: string;
  description: string;
  author: string;
}

export interface AppConfig {
  theme: 'system' | 'light' | 'dark';
  mockMode: boolean;
  brokerUrl?: string; // Added for MQTT
}

export interface AppDomain {
  signals: any[];
  entities: any[];
}

/**
 * The "Brain" of the application.
 * This JSON structure drives the entire UI.
 */
export interface AppSpecification {
  meta: AppMeta;
  config: AppConfig;
  domain: AppDomain;
  pages: PageDefinition[];
}