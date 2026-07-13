// src/features/ai/hooks/useAIChat.ts
import { useState, useCallback } from 'react';
import type { AIMessage } from '../types/ai.types';
import { aiApi } from '../api/ai.api';

export const useAIChat = () => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const answer = await aiApi.sendMessage(content);
      
      const assistantMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: answer,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError('AI қол жетімді емес. Кейінірек көріңіз.');
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
  };
};