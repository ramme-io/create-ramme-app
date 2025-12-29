import { useState, useCallback } from 'react';
import { useToast } from '@ramme-io/ui';

export interface ChatMessage {
  id: string;
  author: string;
  content: string;
  isUser: boolean;
  suggestions?: string[];
  loading?: boolean;
}

export const useMockChat = () => {
  // 1. FIX: Destructure 'addToast' (the correct name from your Provider)
  const { addToast } = useToast(); 
  
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: '1', 
      author: 'Bodewell AI', 
      content: 'Hello! I am monitoring your 12 active devices. How can I help?', 
      isUser: false, 
      suggestions: ['Check System Status', 'Turn off Living Room AC']
    }
  ]);

  const sendMessage = useCallback((content: string) => {
    if (!content.trim()) return;

    // Add User Message
    const userMsg = { id: Date.now().toString(), author: 'You', content, isUser: true };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    // Simulate AI Delay
    setTimeout(() => {
      setIsLoading(false);
      
      // Mock Response Logic
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        author: 'Bodewell AI',
        content: `I received your command: "${content}". Executing protocol...`,
        isUser: false,
        suggestions: ['View Logs', 'Undo Action']
      };
      
      setMessages(prev => [...prev, aiMsg]);
      
      // 2. FIX: Call addToast with separate arguments, not an object
      // Signature: addToast(message, type, duration)
      if (addToast) {
        addToast(
          `Successfully processed: ${content}`, // message
          'success',                            // type
          3000                                  // duration
        );
      }
      
    }, 1500);
  }, [addToast]);

  return {
    messages,
    isLoading,
    sendMessage
  };
};