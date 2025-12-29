import { useEffect } from 'react';
import { useToast } from '@ramme-io/ui';
// ✅ 1. Correct Imports from Store
import { useGeneratedSignals, useSimulation } from './useSignalStore';
// ✅ 2. Correct Import from Manifest
import { appManifest } from '../../config/app.manifest';

// Minimal Types for internal use (until schema is formalized)
interface ActionDefinition {
  type: string;
  config: Record<string, any>;
}

interface WorkflowDefinition {
  id: string;
  name: string;
  active: boolean;
  trigger: {
    type: string;
    config: {
      signalId: string;
      condition: string;
    };
  };
  actions: ActionDefinition[];
}

/**
 * THE RUNTIME LOGIC ENGINE
 * This hook breathes life into the application.
 * It watches for signal changes and executes the workflows defined in the manifest.
 */
export const useWorkflowEngine = () => {
  const signals = useGeneratedSignals();
  const { addToast } = useToast();
  
  // 1. Activate the Data Simulation (Randomizer)
  // This now checks internally if it should run (based on boolean arg)
  useSimulation(appManifest.config.mockMode);

  // 2. Define the Action Executor
  const executeAction = async (action: ActionDefinition, context: any) => {
    console.log(`[Engine] Executing: ${action.type}`, action);

    switch (action.type) {
      case 'send_notification':
        addToast(action.config.message || 'Notification Sent', 'info');
        break;

      case 'update_resource':
        // In a real app, this would call the API
        addToast(`Updating Resource: ${JSON.stringify(action.config)}`, 'success');
        break;

      case 'agent_task':
        // Simulate AI Agent processing
        console.log(`[AI Agent] Thinking about: "${action.config.prompt}"...`);
        addToast('AI Agent Analyzing...', 'info');
        
        setTimeout(() => {
          // Mock response based on prompt context
          const response = action.config.prompt?.includes('health') 
            ? "System Operating Normally." 
            : "Optimization Recommended.";
            
          addToast(`🤖 Agent: "${response}"`, 'success', 5000);
        }, 1500);
        break;

      case 'navigate':
        window.location.href = action.config.path;
        break;

      default:
        console.warn('Unknown action type:', action.type);
    }
  };

  // 3. Watch Signals & Trigger Workflows
  useEffect(() => {
    // Safety check for undefined domain/workflows
    if (!appManifest.domain?.workflows) return;

    // We cast to our local type since manifest might be "any"
    (appManifest.domain.workflows as unknown as WorkflowDefinition[]).forEach((flow) => {
      if (!flow.active) return;

      // Check Trigger: Signal Change
      if (flow.trigger.type === 'signal_change') {
        const signalId = flow.trigger.config.signalId;
        const condition = flow.trigger.config.condition; // e.g., "> 80"
        
        const signal = signals[signalId];
        
        if (signal) {
          const val = signal.value; // Cleaned up access
          
          try {
            // Check if condition is met (e.g. "50 > 80")
            const isMet = checkCondition(val, condition); 
            
            // Debounce: In a real app, we'd check timestamps to avoid firing every 2ms
            // For now, we rely on the simulation being slow (2s)
            if (isMet) {
              console.log(`[Engine] Trigger Fired: ${flow.name}`);
              flow.actions.forEach(action => executeAction(action, { signal: val }));
            }
          } catch (e) {
            // Ignore parse errors
          }
        }
      }
    });
  }, [signals, addToast]); 

  return { 
    // Exposed for manual triggering (e.g. Buttons)
    triggerWorkflow: (workflowId: string) => {
      // @ts-ignore
      const flow = appManifest.domain?.workflows?.find(w => w.id === workflowId);
      if (flow) {
        // @ts-ignore
        flow.actions.forEach(action => executeAction(action, { manual: true }));
      }
    }
  };
};

// --- HELPER: Safe Condition Checker ---
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