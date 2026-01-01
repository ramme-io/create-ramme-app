import { useEffect } from 'react';
import { useToast } from '@ramme-io/ui';
import { useGeneratedSignals, useSimulation } from './useSignalStore';
// ❌ REMOVED: import { appManifest } from '../../config/app.manifest';
// ✅ ADDED: Live Context
import { useManifest } from './ManifestContext';

// ... (Interfaces can remain the same) ...
interface ActionDefinition { type: string; config: Record<string, any>; }
interface WorkflowDefinition { id: string; name: string; active: boolean; trigger: { type: string; config: { signalId: string; condition: string; }; }; actions: ActionDefinition[]; }

export const useWorkflowEngine = () => {
  const signals = useGeneratedSignals();
  const { addToast } = useToast();
  
  // ✅ 1. Consume Live Manifest
  const appManifest = useManifest();

  // 2. Activate Simulation (Responsive to toggle)
  useSimulation(appManifest.config.mockMode);

  const executeAction = async (action: ActionDefinition, context: any) => {
    // ... (Same execution logic as before) ...
    console.log(`[Engine] Executing: ${action.type}`, action);
    switch (action.type) {
      case 'send_notification': addToast(action.config.message || 'Notification Sent', 'info'); break;
      case 'update_resource': addToast(`Updating Resource: ${JSON.stringify(action.config)}`, 'success'); break;
      case 'navigate': window.location.href = action.config.path; break;
      case 'agent_task': 
        addToast('AI Agent Analyzing...', 'info');
        setTimeout(() => addToast('🤖 Agent: "System Nominal"', 'success', 3000), 1500);
        break;
    }
  };

  // 3. Watch Signals & Trigger Workflows (Live)
  useEffect(() => {
    if (!appManifest.domain?.workflows) return;

    (appManifest.domain.workflows as unknown as WorkflowDefinition[]).forEach((flow) => {
      if (!flow.active) return;

      if (flow.trigger.type === 'signal_change') {
        const signalId = flow.trigger.config.signalId;
        const condition = flow.trigger.config.condition;
        
        // @ts-ignore
        const signal = signals[signalId];
        
        if (signal) {
          const val = signal.value;
          try {
            const isMet = checkCondition(val, condition); 
            if (isMet) {
              console.log(`[Engine] Trigger Fired: ${flow.name}`);
              flow.actions.forEach(action => executeAction(action, { signal: val }));
            }
          } catch (e) {}
        }
      }
    });
  }, [signals, addToast, appManifest.domain.workflows]); // Added dependency

  return { 
    triggerWorkflow: (workflowId: string) => {
      // ✅ 4. Manual Triggers now find new workflows instantly
      const flow = appManifest.domain?.workflows?.find(w => w.id === workflowId);
      if (flow) {
        // @ts-ignore
        flow.actions.forEach(action => executeAction(action, { manual: true }));
      }
    }
  };
};

const checkCondition = (value: number, condition: string): boolean => {
  if (!condition) return false;
  const parts = condition.trim().split(' ');
  const operator = parts[0];
  const target = parseFloat(parts[1]);
  switch (operator) {
    case '>': return value > target;
    case '<': return value < target;
    case '>=': return value >= target;
    case '<=': return value <= target;
    case '==': return value === target;
    default: return false;
  }
};