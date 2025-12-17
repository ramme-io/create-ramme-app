import React from 'react';
import { PageHeader, Alert } from '@ramme-io/ui';
import { appManifest } from '../config/app.manifest';
import { getComponent } from '../core/component-registry';
// Reuse the GhostOverlay for structure visualization
import { GhostOverlay } from '../components/dev/GhostOverlay';
// Import the component that renders a single block (you likely have this extracted from Dashboard.tsx)
import { DynamicBlock } from '../components/DynamicBlock';

interface DynamicPageProps {
  pageId: string;
}

const DynamicPage: React.FC<DynamicPageProps> = ({ pageId }) => {
  // 1. Look up the page definition in the manifest
  const pageConfig = appManifest.pages?.find((p: { id: string; }) => p.id === pageId);

  if (!pageConfig) {
    return (
      <div className="p-8">
        <Alert variant="danger" title="404: Page Definition Not Found">
          The manifest does not contain a page with ID: <code>{pageId}</code>.
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-8 fade-in">
      <PageHeader 
        title={pageConfig.title} 
        description={pageConfig.description} 
      />

      {/* Render Sections */}
      {pageConfig.sections.map((section: { id: React.Key | null | undefined; title: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; layout: { columns: any; }; blocks: any[]; }) => (
        <div key={section.id} className="space-y-4">
          {section.title && <h3 className="text-xl font-semibold">{section.title}</h3>}
          
          <div 
            className="grid gap-6"
            style={{ 
              gridTemplateColumns: `repeat(${section.layout?.columns || 3}, minmax(300px, 1fr))` 
            }}
          >
            {section.blocks.map(block => (
               <GhostOverlay 
                 key={block.id} 
                 componentId={block.id} 
                 componentType={block.type}
                 signalId={block.props.signalId}
               >
                 <DynamicBlock block={block} />
               </GhostOverlay>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DynamicPage;