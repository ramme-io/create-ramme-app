/**
 * @file useJustInTimeSeeder.ts
 * @description Runtime Data Generator for the Preview Engine.
 */

import { useMemo } from 'react';
import { getMockData } from '../../data/mockData';
import type { ResourceDefinition, FieldDefinition } from '../validation/schema';

// Helper: Generate a semi-realistic value based on field type
const generateValue = (field: FieldDefinition, index: number) => {
  const i = index + 1;
  const label = field.label || 'Item';
  
  switch (field.type) {
    case 'text': 
      return `${label} ${i}`;
    case 'number': 
      return Math.floor(Math.random() * 100) + 1;
    case 'currency': 
      return (Math.random() * 1000).toFixed(2);
    case 'boolean': 
      return Math.random() > 0.5;
    case 'date': 
      // Return a date within the last 30 days
      const d = new Date();
      d.setDate(d.getDate() - (i * 2));
      return d.toISOString();
    case 'status': 
      return ['Active', 'Pending', 'Inactive', 'Archived'][index % 4];
    case 'email': 
      return `user${i}@example.com`;
    case 'image':
      return `https://i.pravatar.cc/150?u=${i}`;
    case 'textarea':
      return `This is a sample description for ${label} ${i}. It contains enough text to test multi-line rendering.`;
    default: 
      return `${label}-${i}`;
  }
};

export const useJustInTimeSeeder = (dataId: string, resourceDef?: ResourceDefinition | null) => {
  return useMemo(() => {
    // 1. Priority: Static Data (The "Golden Copy")
    // If the developer has manually added data to mockData.ts, always use that.
    const staticData = getMockData(dataId);
    if (staticData && staticData.length > 0) {
      return staticData;
    }

    // 2. Fallback: JIT Generation (The "Safety Net")
    // If we have a schema but no data, generate it now.
    if (resourceDef) {
      console.log(`🌱 [JIT Seeder] Generating 5 mock records for: ${dataId}`);
      
      return Array.from({ length: 5 }).map((_, idx) => {
        const row: Record<string, any> = { 
          // Generate a robust ID that won't collide with future real IDs
          id: `jit_${dataId}_${idx + 1}` 
        };
        
        resourceDef.fields.forEach(field => {
          // Don't overwrite ID if it was part of the fields list
          if (field.key !== 'id') {
            row[field.key] = generateValue(field, idx);
          }
        });
        
        return row;
      });
    }

    // 3. Empty State (If no schema is found)
    return [];
  }, [dataId, resourceDef]);
};