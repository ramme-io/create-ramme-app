import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTheme, Button, availableThemes, type ThemeConfig } from '@ramme-io/ui';

// --- Temporary Theme Switcher (Unchanged) ---
const MiniThemeSwitcher = () => {
  const { setTheme, customTheme, setCustomTheme } = useTheme();
  
  const cyberTheme: ThemeConfig = {
    name: 'Cyberpunk',
    colors: {
      primary: '255 238 88', primaryForeground: '0 0 0',
      secondary: '30 30 35', secondaryForeground: '255 255 255',
      accent: '0 255 255', accentForeground: '0 0 0',
      danger: '255 0 85', dangerForeground: '255 255 255',
      background: '5 5 10', card: '20 20 25', text: '240 240 240',
      border: '255 238 88', muted: '40 40 50', mutedForeground: '150 150 160',
      input: '30 30 35', inputBorder: '80 80 90', ring: '255 238 88'
    },
    borderRadius: '0px',
  };

  return (
    <div className="absolute top-4 right-4 flex gap-2 z-50">
       {availableThemes.slice(0, 3).map(t => (
         <Button key={t} size="sm" variant="ghost" onClick={() => setTheme(t)} className="opacity-50 hover:opacity-100">
           {t}
         </Button>
       ))}
       <Button size="sm" variant="ghost" onClick={() => setCustomTheme(customTheme ? null : cyberTheme)} className="opacity-50 hover:opacity-100">
         AI
       </Button>
    </div>
  );
};

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground relative transition-colors duration-300">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#888_1px,transparent_1px)] [background-size:16px_16px]" />

      <MiniThemeSwitcher />

      {/* ✅ FIX: Removed the outer <Card>, Header, and Footer.
         This is now a "Passthrough" layout. It centers the content 
         but lets the Page (LoginPage/SignupPage) own the UI completely.
      */}
      <div className="z-10 relative w-full flex justify-center p-4">
        <Outlet />
      </div>
    </div>
  );
};