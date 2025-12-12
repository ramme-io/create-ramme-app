import React from 'react';
import { PageHeader } from '@ramme-io/ui';

// --- IMPORTS ---
import { getComponent } from '../core/component-registry';
import { dashboardLayout } from '../config/dashboard.layout';
import { useGeneratedSignals } from '../generated/hooks'; // <-- The New Engine

const Dashboard: React.FC = () => {
  // 1. Initialize the "Brain"
  // This single line replaces all the hardcoded hooks.
  const signals = useGeneratedSignals();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Command Center"
        description="Real-time device monitoring and business analytics."
      />

      {/* --- DYNAMIC RUNTIME ENGINE --- */}
      {dashboardLayout.map((section) => (
        <div key={section.id}>
          <h3 className="text-lg font-semibold mb-4 text-foreground">
            {section.title}
          </h3>
          
          <div 
            className="grid gap-6"
            // Use the 'columns' prop from the manifest to control density
            style={{ 
              gridTemplateColumns: `repeat(${section.columns || 3}, minmax(300px, 1fr))` 
            }}
          >
            {section.items.map((item) => {
              const Component = getComponent(item.component);
              
              // Prepare Props
              let dynamicProps = { ...item.props };

              // Inject Signal Data
              if (item.signalId && signals[item.signalId as keyof typeof signals]) {
                const sig = signals[item.signalId as keyof typeof signals];
                
                // Standard Value Injection
                dynamicProps.value = `${sig.value}${sig.unit}`;
                
                // Auto-Status Logic (The "Smart" Layer)
                // If a signal exceeds its defined max, auto-flag it as error
                if (sig.value > (sig.max || 100)) {
                    dynamicProps.status = 'error';
                    dynamicProps.trend = 'CRITICAL';
                }
              }

              return (
                <Component key={item.id} {...dynamicProps} />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;