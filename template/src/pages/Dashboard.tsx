import React from 'react';
import { PageHeader, ToggleSwitch, Button, Icon } from '@ramme-io/ui';

// --- IMPORTS ---
import { getComponent } from '../core/component-registry';
import { appManifest } from '../config/app.manifest'; 
import { useGeneratedSignals } from '../generated/hooks';
import type { EntityDefinition } from '../types/schema';
import { useAction } from '../hooks/useAction';

// --- DEV TOOLS (Restored) ---
import { useDevTools } from '../hooks/useDevTools';
import { GhostOverlay } from '../components/dev/GhostOverlay';

const Dashboard: React.FC = () => {
  // 1. Initialize State Machine
  const signals = useGeneratedSignals();
  const { meta, domain } = appManifest;
  
  // 2. Initialize DevTools
  const { isGhostMode, toggleGhostMode } = useDevTools();
  const { sendAction } = useAction();

  return (
    <div className="space-y-8 relative">
      <PageHeader
        title={meta.name || "Command Center"}
        description={meta.description || "Real-time device monitoring."}
        actions={
          // 3. Restore the Toggle Button
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

      {/* --- DYNAMIC RUNTIME ENGINE --- */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        
        {domain.entities.map((entity: EntityDefinition) => {
          // A. Resolve Component & Data
          const componentType = entity.ui?.dashboardComponent || 'DeviceCard';
          const Component = getComponent(componentType);
          
          const primarySignalId = entity.signals[0];
          const signal = primarySignalId ? signals[primarySignalId as keyof typeof signals] : null;

          // B. Prepare Props
          const dynamicProps: any = {
            title: entity.name,
            description: entity.description || `ID: ${entity.id}`,
            icon: entity.ui?.icon || 'activity',
            status: 'offline',
          };

          // C. Inject Signal Data
          if (signal) {
            dynamicProps.value = `${signal.value} ${signal.unit || ''}`;
            dynamicProps.status = 'active';

            if (componentType === 'ToggleCard') {
              dynamicProps.children = (
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-muted-foreground">Active</span>
                  <ToggleSwitch 
                    label="Toggle"
                    checked={(signal.value as any) === true || signal.value === 'true' || signal.value === 1}
                    // THE UPDATE:
                    onChange={(val) => sendAction(entity.id, val)} 
                  />
                </div>
              );
              delete dynamicProps.value; 
            }
          }

          return (
            // 4. Restore the GhostOverlay Wrapper
            <GhostOverlay
              key={entity.id}
              isActive={isGhostMode}
              componentId={entity.id}
              componentType={componentType}
              signalId={primarySignalId}
            >
              <Component {...dynamicProps} />
            </GhostOverlay>
          );
        })}
      </div>
      
      {domain.entities.length === 0 && (
        <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-lg text-slate-400">
          <p>No entities defined.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;