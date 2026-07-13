// src/features/classes/components/ClassModal.tsx
import { useState, useEffect } from 'react';
import { GRADE_MIN, GRADE_MAX, LETTER_LENGTH } from '../types/class.types';
import type { Class, CreateClassDto, UpdateClassDto, TeacherOption } from '../types/class.types';
interface ClassModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  class?: Class | null;
  teachers: TeacherOption[];
  onClose: () => void;
  onSave: (data: CreateClassDto | UpdateClassDto) => Promise<void>;
}

const ClassModal = ({
  isOpen,
  mode,
  class: currentClass,
  teachers,
  onClose,
  onSave,
}: ClassModalProps) => {
  const [grade, setGrade] = useState<number>(GRADE_MIN);
  const [letter, setLetter] = useState<string>('');
  const [classTeacherId, setClassTeacherId] = useState<number | null>(null);
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
    if (mode === 'edit' && currentClass) {
      setGrade(currentClass.grade);
      setLetter(currentClass.letter);
      setClassTeacherId(currentClass.class_teacher_id || null);
    } else {
      setGrade(GRADE_MIN);
      setLetter('');
      setClassTeacherId(null);
    }
  }, [mode, currentClass, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Валидация
      const trimmedLetter = letter.trim().toUpperCase();
      
      if (!grade || grade < GRADE_MIN || grade > GRADE_MAX) {
        throw new Error(`Класс должен быть от ${GRADE_MIN} до ${GRADE_MAX}`);
      }
      
      if (!trimmedLetter) {
        throw new Error('Буква класса не может быть пустой');
      }
      
      if (trimmedLetter.length !== LETTER_LENGTH) {
        throw new Error(`Буква должна содержать ${LETTER_LENGTH} символ`);
      }
      
      if (!/^[А-ЯA-Z]$/i.test(trimmedLetter)) {
        throw new Error('Буква должна быть одной русской или латинской буквой');
      }

      await onSave({
        grade,
        letter: trimmedLetter,
        class_teacher_id: classTeacherId || null,
      });
      
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
      maxWidth: '500px',
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
    select: {
      padding: '12px',
      fontSize: '15px',
      border: '1px solid #e2e8f0',
      borderRadius: '10px',
      outline: 'none',
      transition: 'all 0.2s ease',
      backgroundColor: '#f8fafc',
      cursor: 'pointer',
    },
    row: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px',
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
            {mode === 'create' ? 'Добавить класс' : 'Редактировать класс'}
          </h2>
          <p style={styles.subtitle}>
            {mode === 'create' 
              ? 'Жаңа сынып туралы ақпаратты енгізіңіз' 
              : 'Сынып туралы ақпаратты өзгертіңіз'}
          </p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.row}>
              {/* Grade */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Сынып нөмірі</label>
                <input
                  type="number"
                  value={grade}
                  onChange={(e) => setGrade(parseInt(e.target.value) || GRADE_MIN)}
                  style={styles.input}
                  min={GRADE_MIN}
                  max={GRADE_MAX}
                  required
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

              {/* Letter */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Әріп</label>
                <input
                  type="text"
                  value={letter}
                  onChange={(e) => setLetter(e.target.value.toUpperCase())}
                  style={styles.input}
                  maxLength={LETTER_LENGTH}
                  placeholder="А"
                  required
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
            </div>

            {/* Class Teacher */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Сынып жетекшісі</label>
              <select
                value={classTeacherId || ''}
                onChange={(e) => setClassTeacherId(e.target.value ? parseInt(e.target.value) : null)}
                style={styles.select}
                disabled={isLoading}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.backgroundColor = '#ffffff';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.backgroundColor = '#f8fafc';
                }}
              >
                <option value="">Тағайындалған жоқ</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.full_name}
                  </option>
                ))}
              </select>
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

export default ClassModal;