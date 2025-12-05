// src/pages/AiChat.tsx
import React, { useState, useEffect } from 'react';
import {
  Card,
  PageHeader,
  Conversation,
  Message,
  PromptInput,
  type MessageProps,
} from '@ramme-io/ui';

// The MessageData type now directly uses MessageProps from the library
type MessageData = Omit<MessageProps, 'onSuggestionClick'>;

const AiChat: React.FC = () => {
  const [messages, setMessages] = useState<MessageData[]>([
    { author: 'AI Assistant', content: 'Hello! How can I help you build your prototype today?' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const addMessage = (message: MessageData) => {
    setMessages(prev => [...prev, message]);
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    addMessage({ author: 'User', content: newMessage, isUser: true });
    setNewMessage('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    addMessage({ author: 'User', content: suggestion, isUser: true });
  }

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.isUser) {
      addMessage({ author: 'AI Assistant', loading: true });

      setTimeout(() => {
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            author: 'AI Assistant',
            content: "That's a great idea! I am a mock AI, but I can certainly help you plan that. What components should be on the dashboard?",
            suggestions: ["Stat Cards", "A Bar Chart", "A Data Table"]
          };
          return newMessages;
        });
      }, 1500);
    }
  }, [messages]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <PageHeader
        title="AI Assistant"
        description="This is the foundational interface for the Ramme AI prototyping assistant."
      />
      <Card className="flex flex-col h-[600px]">
        <Conversation>
          {messages.map((msg, index) => (
            <Message key={index} {...msg} onSuggestionClick={handleSuggestionClick} />
          ))}
        </Conversation>
        <PromptInput
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onSubmit={handleSendMessage}
        />
      </Card>
    </div>
  );
};

export default AiChat;