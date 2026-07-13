// src/features/ai/components/MessageBubble.tsx
import type { AIMessage } from '../types/ai.types';

interface MessageBubbleProps {
  message: AIMessage;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.role === 'user';

  const styles = {
    container: {
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '16px',
    },
    bubble: {
      maxWidth: '70%',
      padding: '12px 16px',
      borderRadius: '18px',
      backgroundColor: isUser ? '#3B82F6' : '#F3F4F6',
      color: isUser ? '#FFFFFF' : '#111827',
      fontSize: '14px',
      lineHeight: '1.5',
      wordWrap: 'break-word' as const,
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    },
    time: {
      fontSize: '10px',
      color: isUser ? '#BFDBFE' : '#6B7280',
      marginTop: '4px',
      textAlign: isUser ? 'right' as const : 'left' as const,
    },
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  // Format AI response with markdown-like styling
  const formatContent = (content: string) => {
    if (isUser) return content;
    
    // Replace markdown-like syntax
    let formatted = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
    
    return <div dangerouslySetInnerHTML={{ __html: formatted }} />;
  };

  return (
    <div style={styles.container}>
      <div>
        <div style={styles.bubble}>
          {isUser ? message.content : formatContent(message.content)}
        </div>
        <div style={styles.time}>{formatTime(message.timestamp)}</div>
      </div>
    </div>
  );
};

export default MessageBubble;