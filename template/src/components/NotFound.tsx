// src/pages/NotFound.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@ramme-io/ui';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12">
      <h1 className="text-9xl font-black text-primary/20">404</h1>
      <h2 className="text-3xl font-bold mt-4">Page Not Found</h2>
      <p className="text-muted-foreground mt-2 mb-6">
        Sorry, the page you are looking for does not exist.
      </p>
      {/* Wrap the Button with the Link component */}
      <Link to="/">
        <Button size="lg">Return to Dashboard</Button>
      </Link>
    </div>
  );
};

export default NotFound;