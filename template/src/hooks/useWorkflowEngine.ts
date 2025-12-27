import { useEffect } from 'react';
import { useToast } from '@ramme-io/ui';
// @ts-ignore - These generated hooks exist in the build
import { useGeneratedSignals, useSimulation } from '../generated/hooks';
import { appManifest } from '../config/app.manifest';
// ✅ Import types to fix implicit 'any' errors
import type { ActionDefinition, WorkflowDefinition } from '../types/schema';

/**
 * THE RUNTIME LOGIC ENGINE
 * This hook breathes life into the application.
 * It watches for signal changes and executes the workflows defined in the manifest.
 */
export const useWorkflowEngine = () => {
  const signals = useGeneratedSignals();
  const { addToast } = useToast();
  
  // 1. Activate the Data Simulation (Randomizer)
  useSimulation();

  // 2. Define the Action Executor
  // ✅ Explicitly typed 'action'
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
        // ✅ FIX: 'loading' is not a valid ToastType. Using 'info' instead.
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
    if (!appManifest.domain?.workflows) return;

    // ✅ Explicitly typed 'flow'
    appManifest.domain.workflows.forEach((flow: WorkflowDefinition) => {
      if (!flow.active) return;

      // Check Trigger: Signal Change
      if (flow.trigger.type === 'signal_change') {
        const signalId = flow.trigger.config.signalId;
        const condition = flow.trigger.config.condition; // e.g., "> 80"
        
        // @ts-ignore
        const signal = signals[signalId];
        
        if (signal) {
          const val = typeof signal === 'object' ? signal.value : signal;
          
          try {
            // Check if condition is met (e.g. "50 > 80")
            const isMet = checkCondition(val, condition); 
            
            if (isMet) {
              // Throttling logic would go here to prevent spam
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
      const flow = appManifest.domain?.workflows?.find(w => w.id === workflowId);
      if (flow) {
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