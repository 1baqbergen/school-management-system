// src/features/homeworks/components/SubmitHomeworkModal.tsx
import { useState } from 'react';
import type { CreateSubmissionDto } from '../types/homework.types';

interface SubmitHomeworkModalProps {
  isOpen: boolean;
  homeworkTitle: string;
  homeworkId: number;
  onClose: () => void;
  onSubmit: (data: CreateSubmissionDto) => Promise<void>;
  isLoading?: boolean;
}

const SubmitHomeworkModal = ({
  isOpen,
  homeworkTitle,
  homeworkId,
  onClose,
  onSubmit,
  isLoading = false
}: SubmitHomeworkModalProps) => {
  const [content, setContent] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (!content.trim()) throw new Error('Жұмыс мәтінін енгізіңіз');
      await onSubmit({
        homework_id: homeworkId,
        content: content.trim(),
        file_url: fileUrl || null,
      });
      setContent('');
      setFileUrl('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Жіберу кезінде қате');
    }
  };

  if (!isOpen) return null;

  const styles = {
    overlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    modal: {
      backgroundColor: '#FFFFFF',
      borderRadius: '20px',
      padding: '32px',
      width: '90%',
      maxWidth: '500px',
      maxHeight: '90vh',
      overflowY: 'auto' as const,
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    },
    title: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#0F172A',
      margin: '0 0 8px 0',
    },
    homeworkTitle: {
      fontSize: '14px',
      color: '#64748B',
      marginBottom: '24px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '20px',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '6px',
    },
    label: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#334155',
    },
    textarea: {
      padding: '12px',
      fontSize: '14px',
      border: '1px solid #E2E8F0',
      borderRadius: '12px',
      outline: 'none',
      minHeight: '120px',
      fontFamily: 'inherit',
      resize: 'vertical' as const,
    },
    input: {
      padding: '12px',
      fontSize: '14px',
      border: '1px solid #E2E8F0',
      borderRadius: '12px',
      outline: 'none',
    },
    actions: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '12px',
      marginTop: '16px',
    },
    button: {
      padding: '12px 24px',
      fontSize: '14px',
      fontWeight: '500',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      border: 'none',
    },
    cancelButton: {
      backgroundColor: '#F1F5F9',
      color: '#475569',
    },
    submitButton: {
      backgroundColor: '#3B82F6',
      color: '#FFFFFF',
    },
    error: {
      padding: '12px',
      backgroundColor: '#FEF2F2',
      border: '1px solid #FEE2E2',
      borderRadius: '12px',
      color: '#B91C1C',
      fontSize: '14px',
    },
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <h2 style={styles.title}>Жұмысты жіберу</h2>
        <div style={styles.homeworkTitle}>{homeworkTitle}</div>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Жұмыс мәтіні</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={styles.textarea}
              placeholder="Жұмысыңыздың мәтінін енгізіңіз..."
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Файл сілтемесі (міндетті емес)</label>
            <input
              type="url"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              style={styles.input}
              placeholder="https://..."
            />
          </div>
          {error && <div style={styles.error}>{error}</div>}
          <div style={styles.actions}>
            <button type="button" style={{ ...styles.button, ...styles.cancelButton }} onClick={onClose}>
              Болдырмау
            </button>
            <button 
              type="submit" 
              disabled={isLoading} 
              style={{ 
                ...styles.button, 
                ...styles.submitButton, 
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? 'Жіберілуде...' : 'Жіберу'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitHomeworkModal;