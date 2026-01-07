import React from 'react';
import { PageHeader } from '@ramme-io/ui';

interface StandardPageLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const StandardPageLayout: React.FC<StandardPageLayoutProps> = ({
  title,
  description,
  children,
  actions,
  className,
}) => {
  return (
    <div className={`flex flex-col h-full min-h-[calc(100vh-64px)] animate-in fade-in duration-300 ${className || ''}`}>
      
      {/* 1. Standardized Header Area (Sticky) */}
      <div className="px-4 py-4 md:px-8 border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-10">
        
        {/* Breadcrumbs removed to prevent Router Context crash */}
        
        <PageHeader 
          title={title} 
          description={description} 
          actions={actions}
          className="p-0 border-none" 
        />
      </div>

      {/* 2. Standardized Content Area */}
      <div className="flex-1 p-4 md:p-8 w-full max-w-[1600px] mx-auto">
        {children}
      </div>
    </div>
  );
};