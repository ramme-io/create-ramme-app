import React, { useMemo } from 'react';
import { Drawer, FormTemplate, Button, type FormField } from '@ramme-io/ui';

/**
 * @file AutoForm.tsx
 * @description The "Zero-Boilerplate" Form Engine.
 * * ARCHITECTURAL ROLE:
 * This component acts as the bridge between your data schema (JSON) and the UI.
 * Instead of writing manual form code for every resource (Users, Products, Orders),
 * this component dynamically generates the correct inputs based on the field type.
 * * KEY FEATURES:
 * 1. **Smart Mapping:** Automatically converts 'boolean' -> Toggle, 'date' -> DatePicker, etc.
 * 2. **Context Aware:** Auto-detects "Create" vs "Edit" mode based on `initialData`.
 * 3. **Safety Logic:** Automatically hides primary keys during creation and locks them during editing.
 */

interface AutoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  title: string;
  fields: any[]; // The raw metadata from app.manifest.ts
  initialData?: any;
}

export const AutoForm: React.FC<AutoFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  fields,
  initialData
}) => {
  
  // 1. Safe Data Handling
  const safeData = initialData || {};
  const isEditMode = !!safeData.id;

  // 2. Schema-to-UI Mapping Engine
  const formFields = useMemo<FormField[]>(() => {
    return fields
      // 🛑 RULE 1: Hide ID field during creation (System handles it)
      .filter((f: any) => !(f.key === 'id' && !isEditMode))
      .map((f: any) => {
      
      const isIdField = f.key === 'id';

      // Base Configuration for all fields
      const baseConfig = {
        name: f.key,
        label: f.label,
        required: f.required,
        placeholder: f.description || `Enter ${f.label.toLowerCase()}`,
        // Pre-fill data if editing, or use default from schema
        value: safeData[f.key] !== undefined ? safeData[f.key] : (f.defaultValue || ''),
        colSpan: 1,
        // 🛑 RULE 2: If it's the ID field, force it to be disabled (View Only)
        disabled: isIdField
      };

      // Intelligent Type Switching
      switch (f.type) {
        case 'number':
        case 'integer':
        case 'currency':
          return { 
            ...baseConfig, 
            type: 'number',
            value: Number(baseConfig.value) || 0 
          };

        case 'boolean':
          return { 
            ...baseConfig, 
            type: 'toggle', 
            checked: !!baseConfig.value 
          };

        case 'date':
          return { 
            ...baseConfig, 
            type: 'datepicker', 
            value: baseConfig.value ? new Date(baseConfig.value) : null 
          };

        case 'status':
          return { 
            ...baseConfig, 
            type: 'select', 
            options: [
              { value: 'Active', label: 'Active' },
              { value: 'Pending', label: 'Pending' },
              { value: 'Inactive', label: 'Inactive' },
              { value: 'Archived', label: 'Archived' }
            ]
          };

        case 'textarea':
          return { 
            ...baseConfig, 
            type: 'textarea', 
            colSpan: 2 
          };

        case 'email':
          return { ...baseConfig, type: 'email' };

        default:
          return { ...baseConfig, type: 'text' };
      }
    });
  }, [fields, safeData, isEditMode]);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`${isEditMode ? 'Edit' : 'New'} ${title}`}
      size="500px"
    >
      <div className="p-6">
        <FormTemplate 
          fields={formFields} 
          onSubmit={(formData) => {
            // Merge original ID to ensure we update the correct record
            onSubmit({ ...safeData, ...formData }); 
          }} 
        >
            <div className="flex justify-end gap-2 mt-8 pt-4 border-t border-border">
                <Button variant="outline" onClick={onClose} type="button">
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  {isEditMode ? 'Save Changes' : 'Create Record'}
                </Button>
            </div>
        </FormTemplate>
      </div>
    </Drawer>
  );
};