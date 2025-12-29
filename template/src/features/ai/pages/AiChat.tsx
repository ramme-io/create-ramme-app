// ramme-app-starter/template/src/pages/AiChat.tsx
import React, { useState } from 'react';
import {
  Card,
  PageHeader,
  Conversation,
  Message,
  PromptInput,
} from '@ramme-io/ui';
import { useMockChat } from '../../assistant/useMockChat'; // <--- The new brain

const AiChat: React.FC = () => {
  const { messages, isLoading, sendMessage } = useMockChat();
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
    setInput('');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 h-[calc(100vh-64px)] flex flex-col">
      <PageHeader
        title="AI Assistant"
        description="Full-screen command center for Ramme AI."
      />
      
      {/* We use flex-1 on the Card to make it fill the remaining screen space 
         perfectly, creating that immersive "ChatGPT" feel.
      */}
      <Card className="flex-1 flex flex-col min-h-0 shadow-sm border-border/50">
        <div className="flex-1 overflow-hidden">
          <Conversation>
            {messages.map((msg) => (
              <Message
                key={msg.id}
                author={msg.author}
                content={msg.content}
                isUser={msg.isUser}
                loading={msg.loading}
                suggestions={msg.suggestions}
                onSuggestionClick={(s) => sendMessage(s)}
              />
            ))}
            {isLoading && <Message author="Bodewell AI" isUser={false} loading />}
          </Conversation>
        </div>
        
        <div className="p-4 border-t bg-card">
          <PromptInput
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onSubmit={handleSubmit}
            placeholder="Type a command or ask a question..."
          />
        </div>
      </Card>
    </div>
  );
};

export default AiChat;