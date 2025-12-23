import React from 'react';
import { useLocation } from 'react-router-dom';
import { PageHeader, Alert } from '@ramme-io/ui';
import { appManifest } from '../config/app.manifest';
import { DynamicBlock } from '../components/DynamicBlock';

const Dashboard: React.FC = () => {
  const location = useLocation();
  
  // 1. Determine current slug from URL
  const pathParts = location.pathname.split('/').filter(Boolean);
  // If path is root or /dashboard, slug is 'dashboard', else take the last part
  const currentSlug = pathParts.length > 1 ? pathParts[pathParts.length - 1] : 'dashboard';

  // 2. Find the matching Page Definition
  const pageDef = appManifest.pages?.find(p => p.slug === currentSlug) 
    || appManifest.pages?.[0];

  if (!pageDef) {
    return (
      <div className="p-8">
        <Alert variant="warning" title="Page Not Found">
          Could not find a definition for slug: <code>{currentSlug}</code>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      <PageHeader
        title={pageDef.title}
        description={pageDef.description}
      />

      {pageDef.sections.map((section) => (
        <div key={section.id} className="relative">
          {section.title && (
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              {section.title}
            </h3>
          )}
          
          <div 
            className="grid gap-6"
            style={{ 
              gridTemplateColumns: `repeat(${section.layout?.columns || 3}, minmax(300px, 1fr))` 
            }}
          >
            {section.blocks.map((block) => (
              <DynamicBlock key={block.id} block={block} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;