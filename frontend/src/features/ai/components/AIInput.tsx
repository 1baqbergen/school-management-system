// src/features/ai/components/AIInput.tsx
import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Send } from 'lucide-react';

interface AIInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

const AIInput = ({ onSend, isLoading, disabled = false }: AIInputProps) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() && !isLoading && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const styles = {
    container: {
      borderTop: '1px solid #E5E7EB',
      padding: '20px',
      backgroundColor: '#FFFFFF',
      borderRadius: '0 0 20px 20px',
    },
    inputWrapper: {
      display: 'flex',
      gap: '12px',
      alignItems: 'flex-end',
    },
    textarea: {
      flex: 1,
      padding: '12px 16px',
      border: '1px solid #E5E7EB',
      borderRadius: '20px',
      fontSize: '14px',
      fontFamily: 'inherit',
      resize: 'none' as const,
      outline: 'none',
      transition: 'all 0.2s ease',
      maxHeight: '120px',
      overflow: 'auto',
    },
    sendButton: {
      padding: '12px',
      backgroundColor: isLoading || disabled ? '#9CA3AF' : '#3B82F6',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '50%',
      cursor: isLoading || disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '44px',
      height: '44px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.inputWrapper}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="AI-Көмекшіден сұраңыз"
          disabled={isLoading || disabled}
          style={styles.textarea}
          rows={1}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#3B82F6';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#E5E7EB';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || disabled || !input.trim()}
          style={styles.sendButton}
          onMouseEnter={(e) => {
            if (!isLoading && !disabled && input.trim()) {
              e.currentTarget.style.backgroundColor = '#2563EB';
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading && !disabled && input.trim()) {
              e.currentTarget.style.backgroundColor = '#3B82F6';
            }
          }}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default AIInput;