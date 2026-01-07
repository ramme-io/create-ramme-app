import React from 'react';
// ✅ Import Core Layout
import { StandardPageLayout } from '../components/layout/StandardPageLayout';

interface GenericContentPageProps {
  pageTitle: string;
  children?: React.ReactNode; 
}

const GenericContentPage: React.FC<GenericContentPageProps> = ({ pageTitle, children }) => {
  return (
    <StandardPageLayout 
      title={pageTitle}
      description={`This is a placeholder page for "${pageTitle}".`}
    >
      {children ? (
        children
      ) : (
        <div className="p-12 border-2 border-dashed border-border rounded-lg bg-muted/10 text-center flex flex-col items-center justify-center">
          <p className="text-muted-foreground text-lg mb-2">
            This page is ready for content.
          </p>
          <p className="text-sm text-muted-foreground">
            Replace this file in <code>src/pages/YourSpecificPage.tsx</code>.
          </p>
        </div>
      )}
    </StandardPageLayout>
  );
};

export default GenericContentPage;