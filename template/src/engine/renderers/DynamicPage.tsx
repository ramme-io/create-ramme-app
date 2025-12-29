import React from 'react';
import { PageHeader, Alert, Button, Icon } from '@ramme-io/ui';
import { appManifest } from '../../config/app.manifest';
// Reuse the GhostOverlay for structure visualization
import { GhostOverlay } from '../../features/developer/GhostOverlay';
// Import the Worker Bee
import { DynamicBlock } from './DynamicBlock';
// Import the Hook to control the overlay
import { useDevTools } from '../../features/developer/useDevTools';

/**
 * @file DynamicPage.tsx
 * @description The "Layout Engine" of the application.
 *
 * ARCHITECTURAL ROLE:
 * This component is the bridge between the Abstract JSON Manifest and the Concrete DOM.
 * It acts as the "General Contractor," taking the blueprint (Manifest) and instructing
 * the workers (DynamicBlock) where to build.
 *
 * HIERARCHY:
 * App -> Routes -> DynamicPage -> (Iterates Sections) -> DynamicBlock -> (Actual Component)
 *
 * KEY FEATURES:
 * 1. **Manifest Lookup:** Uses the `pageId` prop to find the correct configuration in `app.manifest.ts`.
 * 2. **Grid Composition:** Translates abstract layout numbers (e.g., `columns: 3`) into real CSS Grid styles.
 * 3. **DevTools Integration:** Wraps blocks in `GhostOverlay` (when enabled) to visualize the
 * hidden boundaries and signal connections during development.
 */

interface DynamicPageProps {
  pageId: string;
}

export const DynamicPage: React.FC<DynamicPageProps> = ({ pageId }) => {
  // 1. Initialize DevTools
  const { isGhostMode, toggleGhostMode } = useDevTools();

  // 2. Look up the page definition
  const pageConfig = (appManifest as any).pages?.find((p: any) => p.id === pageId);

  if (!pageConfig) {
    return (
      <div className="p-8">
        <Alert variant="danger" title="Page Not Found">
          The manifest does not contain a page with ID: <code>{pageId}</code>.
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-8 fade-in p-6">
      <PageHeader 
        title={pageConfig.title} 
        description={pageConfig.description}
        actions={
          <Button 
            variant={isGhostMode ? 'accent' : 'outline'} 
            size="sm"
            onClick={toggleGhostMode}
            title="Toggle Ghost Mode (Ctrl+Shift+G)"
          >
            <Icon name={isGhostMode ? 'eye' : 'eye-off'} className="mr-2" />
            {isGhostMode ? 'Ghost Mode: ON' : 'Dev Tools'}
          </Button>
        }
      />

      {/* 4. Render Sections */}
      {pageConfig.sections.map((section: any) => (
        <div key={section.id} className="space-y-4">
          {section.title && <h3 className="text-xl font-semibold">{section.title}</h3>}
          
          <div 
            className="grid gap-6"
            style={{ 
              // ⚡️ IMPROVEMENT: Default to 1 column (Full Width) instead of 3.
              // This fixes the "narrow table" issue immediately.
              gridTemplateColumns: `repeat(${section.layout?.columns || 1}, minmax(0, 1fr))` 
            }}
          >
            {section.blocks.map((block: any) => {
              // ⚡️ IMPROVEMENT: Calculate Spanning
              // Allows a block to stretch across multiple columns if needed.
              const colSpan = block.layout?.colSpan || 1;
              const rowSpan = block.layout?.rowSpan || 1;

              return (
                <div 
                  key={block.id}
                  style={{ 
                    gridColumn: `span ${colSpan}`,
                    gridRow: `span ${rowSpan}`
                  }}
                >
                   <GhostOverlay 
                     isActive={isGhostMode}
                     componentId={block.id} 
                     componentType={block.type}
                     signalId={block.props.signalId}
                   >
                     <DynamicBlock block={block} />
                   </GhostOverlay>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DynamicPage;