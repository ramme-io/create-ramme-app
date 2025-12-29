import React, { useState } from 'react';
import { 
  Card, 
  Conversation, 
  Message, 
  PromptInput, 
  Button,
  Icon,
} from '@ramme-io/ui';
import { useMockChat } from '../features/assistant/useMockChat';

interface AIChatWidgetProps {
  onClose: () => void;
}

export const AIChatWidget: React.FC<AIChatWidgetProps> = ({ onClose }) => {
  // 1. Use the shared "Brain"
  const { messages, isLoading, sendMessage } = useMockChat();
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
    setInput('');
  };

  return (
    <Card className="fixed bottom-24 right-6 w-96 h-[500px] shadow-2xl flex flex-col z-50 animate-in slide-in-from-bottom-5 border-border">
      
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center bg-muted/50 rounded-t-lg">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="font-semibold text-sm">AI Chat</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
          <Icon name="x" size={16} />
        </Button>
      </div>

      {/* Chat History Area */}
      <div className="flex-1 overflow-hidden p-0 bg-background">
        <Conversation>
          {messages.map((msg) => (
            <Message
              key={msg.id}
              author={msg.author}
              content={msg.content}
              isUser={msg.isUser}
              suggestions={msg.suggestions}
              onSuggestionClick={(s) => sendMessage(s)}
            />
          ))}
          {isLoading && <Message author="Bodewell AI" isUser={false} loading />}
        </Conversation>
      </div>

      {/* Input Footer */}
      <div className="p-4 border-t bg-card">
        <PromptInput
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onSubmit={handleSubmit}
          placeholder="Ask to adjust temperature..."
        />
      </div>
    </Card>
  );
};