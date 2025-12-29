import React from 'react';
import { PageHeader } from '@ramme-io/ui'; // Assuming we have this

interface GenericContentPageProps {
  pageTitle: string;
  children?: React.ReactNode; // Allow for optional custom content later
}

const GenericContentPage: React.FC<GenericContentPageProps> = ({ pageTitle, children }) => {
  return (
    <div>
      <PageHeader title={pageTitle} />
      <div className="mt-6">
        {children ? (
          children
        ) : (
          <p className="text-muted-foreground">
            This is a placeholder page for "{pageTitle}". Replace this content in{' '}
            <code>src/pages/YourSpecificPage.tsx</code>.
          </p>
        )}
      </div>
    </div>
  );
};

export default GenericContentPage;