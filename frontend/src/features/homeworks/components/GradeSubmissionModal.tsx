// src/features/homeworks/components/GradeSubmissionModal.tsx
import { useState, useEffect } from 'react';
import { generateDefaultComment } from '../types/homework.types';
import type { Submission, GradeSubmissionDto } from '../types/homework.types';

interface GradeSubmissionModalProps {
  isOpen: boolean;
  submission: Submission | null;
  onClose: () => void;
  onGrade: (id: number, data: GradeSubmissionDto) => Promise<void>;
}

const GradeSubmissionModal = ({ isOpen, submission, onClose, onGrade }: GradeSubmissionModalProps) => {
  const [grade, setGrade] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (submission && submission.grade !== null) {
      setGrade(submission.grade);
      setComment(submission.comment || generateDefaultComment(submission.grade));
    } else {
      setGrade(5);
      setComment(generateDefaultComment(5));
    }
  }, [submission]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleGradeChange = (value: number) => {
    setGrade(value);
    setComment(generateDefaultComment(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submission) return;
    
    setIsLoading(true);
    setError(null);

    try {
      if (grade < 0 || grade > 10) throw new Error('Оценка должна быть от 0 до 10');
      await onGrade(submission.id, {
  grade,
  comment,
  subject_id: submission.subject_id,
  teacher_id: submission.teacher_id,
});
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Қате');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !submission) return null;

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
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    },
    title: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#0F172A',
      margin: '0 0 8px 0',
    },
    studentName: {
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
    gradeGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: '8px',
    },
    gradeButton: {
      padding: '12px',
      fontSize: '16px',
      fontWeight: '600',
      border: '2px solid #E2E8F0',
      borderRadius: '12px',
      backgroundColor: '#FFFFFF',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    gradeButtonActive: {
      borderColor: '#3B82F6',
      backgroundColor: '#EFF6FF',
      color: '#3B82F6',
    },
    textarea: {
      padding: '12px',
      fontSize: '14px',
      border: '1px solid #E2E8F0',
      borderRadius: '12px',
      outline: 'none',
      minHeight: '80px',
      fontFamily: 'inherit',
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
    saveButton: {
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
        <h2 style={styles.title}>Оценить работу</h2>
        <div style={styles.studentName}>{submission.student_name}</div>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Баға (0-10)</label>
            <div style={styles.gradeGrid}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => (
                <button
                  key={value}
                  type="button"
                  style={{
                    ...styles.gradeButton,
                    ...(grade === value ? styles.gradeButtonActive : {}),
                  }}
                  onClick={() => handleGradeChange(value)}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Пікір</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={styles.textarea}
            />
          </div>
          {error && <div style={styles.error}>{error}</div>}
          <div style={styles.actions}>
            <button type="button" style={{ ...styles.button, ...styles.cancelButton }} onClick={onClose}>
              Бас тарту
            </button>
            <button type="submit" disabled={isLoading} style={{ ...styles.button, ...styles.saveButton, opacity: isLoading ? 0.7 : 1 }}>
              {isLoading ? 'Сақталуда...' : 'Сақтау'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GradeSubmissionModal;