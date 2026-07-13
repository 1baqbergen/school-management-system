// src/features/subjects/components/SubjectModal.tsx
import { useState, useEffect } from 'react';
import type { Subject, CreateSubjectDto, UpdateSubjectDto } from '../types/subject.types';

interface SubjectModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  subject?: Subject | null;
  onClose: () => void;
  onSave: (data: CreateSubjectDto | UpdateSubjectDto) => Promise<void>;
}

const SubjectModal = ({
  isOpen,
  mode,
  subject,
  onClose,
  onSave,
}: SubjectModalProps) => {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Блокировка скролла body при открытом модальном окне
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

  // Инициализация формы при открытии/изменении режима
  useEffect(() => {
    if (mode === 'edit' && subject) {
      setName(subject.name);
    } else {
      setName('');
    }
  }, [mode, subject, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Валидация
      const trimmedName = name.trim();
      
      if (!trimmedName) {
        throw new Error('Название предмета не может быть пустым');
      }
      
      if (trimmedName.length < 2) {
        throw new Error('Название должно содержать минимум 2 символа');
      }

      await onSave({ name: trimmedName });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setIsLoading(false);
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
      animation: 'fadeIn 0.2s ease-out',
    },
    modal: {
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      padding: '32px',
      width: '90%',
      maxWidth: '450px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
      animation: 'slideIn 0.3s ease-out',
    },
    title: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#1e293b',
      margin: '0 0 8px 0',
    },
    subtitle: {
      fontSize: '14px',
      color: '#64748b',
      margin: '0 0 24px 0',
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
    input: {
      padding: '12px',
      fontSize: '15px',
      border: '1px solid #e2e8f0',
      borderRadius: '10px',
      outline: 'none',
      transition: 'all 0.2s ease',
      backgroundColor: '#f8fafc',
    },
    actions: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '12px',
      marginTop: '16px',
    },
    button: {
      padding: '10px 20px',
      fontSize: '14px',
      fontWeight: '500',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      border: 'none',
    },
    cancelButton: {
      backgroundColor: '#f1f5f9',
      color: '#475569',
    },
    saveButton: {
      backgroundColor: '#3b82f6',
      color: '#ffffff',
    },
    error: {
      padding: '12px',
      backgroundColor: '#fef2f2',
      border: '1px solid #fee2e2',
      borderRadius: '10px',
      color: '#b91c1c',
      fontSize: '14px',
    },
  };

  const animationStyles = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;

  return (
    <>
      <style>{animationStyles}</style>
      <div style={styles.overlay} onClick={onClose}>
        <div style={styles.modal} onClick={e => e.stopPropagation()}>
          <h2 style={styles.title}>
            {mode === 'create' ? 'Пәді қосу' : 'Пәнді өзгерту '}
          </h2>
          <p style={styles.subtitle}>
            {mode === 'create' 
              ? 'Жаңа пәннің атын енгізіңіз' 
              : 'Пәннің атын өзгертіңіз'}
          </p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Пән атауы</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.input}
                placeholder="Мысалы: Математика"
                autoFocus
                disabled={isLoading}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.backgroundColor = '#ffffff';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.backgroundColor = '#f8fafc';
                }}
              />
            </div>

            {error && <div style={styles.error}>{error}</div>}

            <div style={styles.actions}>
              <button
                type="button"
                style={{ ...styles.button, ...styles.cancelButton }}
                onClick={onClose}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e2e8f0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                }}
              >
                Бас тарту
              </button>
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  ...styles.button,
                  ...styles.saveButton,
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.backgroundColor = '#2563eb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.backgroundColor = '#3b82f6';
                  }
                }}
              >
                {isLoading ? 'Сақталуда...' : mode === 'create' ? 'Жасау' : 'Сақтау'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SubjectModal;