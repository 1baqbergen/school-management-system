// src/features/ai/components/AIChat.tsx
import { useEffect, useRef } from 'react';
import { useAIChat } from '../hooks/useAIChat';
import MessageBubble from './MessageBubble';
import AIInput from './AIInput';
import LoadingIndicator from './LoadingIndicator';
import { Bot, Sparkles } from 'lucide-react';

interface AIChatProps {
  disabled?: boolean;
}

const AIChat = ({ disabled = false }: AIChatProps) => {
  const { messages, isLoading, error, sendMessage } = useAIChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      height: '100%',
      backgroundColor: '#FFFFFF',
      borderRadius: '20px',
      border: '1px solid #F0F2F5',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
      overflow: 'hidden',
    },
    header: {
      padding: '20px',
      borderBottom: '1px solid #F0F2F5',
      background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
      color: '#FFFFFF',
    },
    headerTitle: {
      fontSize: '18px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '4px',
    },
    headerSubtitle: {
      fontSize: '13px',
      opacity: 0.9,
    },
    messagesContainer: {
      flex: 1,
      overflowY: 'auto' as const,
      padding: '20px',
      minHeight: '400px',
      maxHeight: '500px',
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'flex-start',
      marginBottom: '16px',
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      color: '#9CA3AF',
      textAlign: 'center' as const,
      gap: '12px',
    },
    error: {
      padding: '12px',
      backgroundColor: '#FEF2F2',
      border: '1px solid #FEE2E2',
      borderRadius: '12px',
      color: '#B91C1C',
      fontSize: '13px',
      marginBottom: '16px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerTitle}>
          <Sparkles size={20} />
          <span>Ai Мектеп Көмекшісі</span>
        </div>
        <div style={styles.headerSubtitle}>
          Сіздің жасанды интеллектке негізделген жеке талдаушыңыз
        </div>
      </div>

      <div ref={chatContainerRef} style={styles.messagesContainer}>
        {messages.length === 0 && !isLoading && (
          <div style={styles.emptyState}>
            <Bot size={48} />
            <div>
              <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>
                Мектеп туралы сұрақ қойыңыз
              </div>
              <div style={{ fontSize: '13px' }}>
                Мысалы: "Жалпы статистиканы көрсетіңіз" немесе "Ең жақсы оқушылар кім?"
              </div>
            </div>
          </div>
        )}

        {error && <div style={styles.error}>{error}</div>}

        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isLoading && (
          <div style={styles.loadingContainer}>
            <LoadingIndicator />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <AIInput onSend={sendMessage} isLoading={isLoading} disabled={disabled} />
    </div>
  );
};

export default AIChat;