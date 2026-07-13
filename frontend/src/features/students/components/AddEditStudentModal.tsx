// src/features/students/components/AddEditStudentModal.tsx
import { useState, useEffect } from 'react';
import {
  ADMISSION_YEAR_MIN,
  ADMISSION_YEAR_MAX,
  PASSWORD_MIN_LENGTH
} from '../types/student.types';
import type { 
  Student, 
  CreateStudentDto, 
  UpdateStudentDto
} from '../types/student.types';
interface ClassOption {
  id: number;
  name: string;
}

interface AddEditStudentModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  student?: Student | null;
  classes: ClassOption[];
  onClose: () => void;
  onSave: (data: CreateStudentDto | UpdateStudentDto) => Promise<void>;
  isTeacher?: boolean;
}

const AddEditStudentModal = ({
  isOpen,
  mode,
  student,
  classes,
  onClose,
  onSave,
  
}: AddEditStudentModalProps) => {
  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [classId, setClassId] = useState<number>(0);
  const [admissionYear, setAdmissionYear] = useState<number>(new Date().getFullYear());
  const [isActive, setIsActive] = useState(true);
  
  // UI state
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
    if (mode === 'edit' && student) {
      setFullName(student.full_name);
      setEmail(student.email);
      setClassId(student.class_id);
      setAdmissionYear(student.admission_year);
      setIsActive(student.is_active);
      setPassword(''); // Не показываем пароль в edit режиме
    } else {
      setFullName('');
      setEmail('');
      setPassword('');
      setClassId(classes[0]?.id || 0);
      setAdmissionYear(new Date().getFullYear());
      setIsActive(true);
    }
    setError(null);
  }, [mode, student, classes, isOpen]);

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Валидация
      const trimmedFullName = fullName.trim();
      const trimmedEmail = email.trim();
      
      if (!trimmedFullName) {
        throw new Error('Аты жөні бос болмауы керек');
      }
      
      if (!trimmedEmail) {
        throw new Error('Email бос болмауы керек');
      }
      
      if (!validateEmail(trimmedEmail)) {
        throw new Error('Дұрыс email мекенжайын енгізіңіз');
      }
      
      if (mode === 'create' && !password) {
        throw new Error('Құпия сөз бос болмауы керек');
      }
      
      if (mode === 'create' && password.length < PASSWORD_MIN_LENGTH) {
        throw new Error(`Құпия сөзде кемінде ${PASSWORD_MIN_LENGTH} таңба болуы керек`);
      }
      
      if (!classId) {
        throw new Error('Сыныпты таңдаңыз');
      }
      
      if (!admissionYear || admissionYear < ADMISSION_YEAR_MIN || admissionYear > ADMISSION_YEAR_MAX) {
        throw new Error(`Қабылдау жылы ${ADMISSION_YEAR_MIN} - ${ADMISSION_YEAR_MAX} дейін болуы керек`);
      }

      const data = mode === 'create'
        ? {
            full_name: trimmedFullName,
            email: trimmedEmail,
            password,
            class_id: classId,
            admission_year: admissionYear,
          }
        : {
            full_name: trimmedFullName,
            email: trimmedEmail,
            class_id: classId,
            admission_year: admissionYear,
            is_active: isActive,
          };

      await onSave(data);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Қате орын алды');
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
      maxHeight: '90vh',
      overflowY: 'auto' as const,
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      animation: 'scaleIn 0.3s ease-out',
    },
    title: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#0f172a',
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
    toggleContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '8px 0',
    },
    toggle: {
      position: 'relative' as const,
      display: 'inline-block',
      width: '52px',
      height: '28px',
      backgroundColor: isActive ? '#3b82f6' : '#cbd5e1',
      borderRadius: '34px',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
      border: 'none',
    },
    toggleSlider: {
      position: 'absolute' as const,
      top: '2px',
      left: isActive ? '26px' : '2px',
      width: '24px',
      height: '24px',
      backgroundColor: '#ffffff',
      borderRadius: '50%',
      transition: 'left 0.2s ease',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    },
    toggleLabel: {
      fontSize: '14px',
      color: '#334155',
      cursor: 'pointer',
    },
    actions: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '12px',
      marginTop: '24px',
    },
    button: {
      padding: '12px 24px',
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
    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
  `;

  return (
    <>
      <style>{animationStyles}</style>
      <div style={styles.overlay} onClick={onClose}>
        <div style={styles.modal} onClick={e => e.stopPropagation()}>
          <h2 style={styles.title}>
            {mode === 'create' ? 'Оқушыны қосу' : 'Оқушыны өңдеу'}
          </h2>
          <p style={styles.subtitle}>
            {mode === 'create' 
              ? 'Жаңа оқушы туралы ақпаратты толтырыңыз' 
              : 'Оқушы туралы ақпаратты өзгертіңіз'}
          </p>

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Full Name */}
            <div style={styles.formGroup}>
              <label style={styles.label}>ФИО</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={styles.input}
                placeholder="Тегі Аты Әкесінің-аты"
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

            {/* Email */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                placeholder="student@school.com"
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

            {/* Password (только create) */}
            {mode === 'create' && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Құпиясөз</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                  placeholder={`Кем дегенде ${PASSWORD_MIN_LENGTH} таңба`}
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
            )}

            {/* Class */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Сынып</label>
              <select
                value={classId}
                onChange={(e) => setClassId(Number(e.target.value))}
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
                <option value={0}>Сыныпты таңдаңыз</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Admission Year */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Түскен жылы</label>
              <input
                type="number"
                value={admissionYear}
                onChange={(e) => setAdmissionYear(Number(e.target.value))}
                style={styles.input}
                min={ADMISSION_YEAR_MIN}
                max={ADMISSION_YEAR_MAX}
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

            {/* Is Active (только edit) */}
            {mode === 'edit' && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Статус</label>
                <div style={styles.toggleContainer}>
                  <button
                    type="button"
                    style={styles.toggle}
                    onClick={() => setIsActive(!isActive)}
                  >
                    <div style={styles.toggleSlider} />
                  </button>
                  <span style={styles.toggleLabel}>
                    {isActive ? 'Белсенді' : 'Белсенді емес'}
                  </span>
                </div>
              </div>
            )}

            {error && <div style={styles.error}>{error}</div>}

            <div style={styles.actions}>
              <button
                type="button"
                style={{ ...styles.button, ...styles.cancelButton }}
                onClick={onClose}
                disabled={isLoading}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.backgroundColor = '#e2e8f0';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.backgroundColor = '#f1f5f9';
                  }
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

export default AddEditStudentModal;