// src/components/AppFooter.tsx
import React from 'react';

const AppFooter: React.FC = () => {
  return (
    <footer className="py-6 text-center text-muted-foreground">
      <p>&copy; {new Date().getFullYear()} Ramme. All Rights Reserved.</p>
    </footer>
  );
};

export default AppFooter;