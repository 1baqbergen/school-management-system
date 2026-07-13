// src/features/teachers/components/AddEditTeacherModal.tsx
import { useState, useEffect } from 'react';
import type { Teacher, CreateTeacherDto, UpdateTeacherDto } from '../types/teacher.types';

interface AddEditTeacherModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  teacher?: Teacher | null;
  onClose: () => void;
  onSave: (data: CreateTeacherDto | UpdateTeacherDto) => Promise<void>;
}

const AddEditTeacherModal = ({
  isOpen,
  mode,
  teacher,
  onClose,
  onSave,
}: AddEditTeacherModalProps) => {
  const [formData, setFormData] = useState<CreateTeacherDto | UpdateTeacherDto>({
    full_name: '',
    email: '',
    ...(mode === 'create' ? { password: '', hire_date: '' } : { hire_date: '', is_active: true }),
  });
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
    if (mode === 'edit' && teacher) {
      setFormData({
        full_name: teacher.full_name,
        email: teacher.email,
        hire_date: teacher.hire_date,
        is_active: teacher.is_active,
      });
    } else {
      setFormData({
        full_name: '',
        email: '',
        ...(mode === 'create' ? { password: '', hire_date: '' } : { hire_date: '', is_active: true }),
      });
    }
  }, [mode, teacher, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Валидация
      if (!formData.full_name?.trim()) {
        throw new Error('Пожалуйста, введите ФИО');
      }
      if (!formData.email?.trim()) {
        throw new Error('Пожалуйста, введите email');
      }
      if (mode === 'create' && !('password' in formData ? formData.password : '')) {
        throw new Error('Пожалуйста, введите пароль');
      }
      if (!formData.hire_date) {
        throw new Error('Пожалуйста, выберите дату приема');
      }

      await onSave(formData);
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
      borderRadius: '24px',
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
      fontWeight: '700',
      color: '#0F172A',
      margin: '0 0 8px 0',
    },
    subtitle: {
      fontSize: '14px',
      color: '#64748B',
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
      fontWeight: '600',
      color: '#334155',
    },
    input: {
      padding: '12px',
      fontSize: '14px',
      border: '1px solid #E2E8F0',
      borderRadius: '12px',
      outline: 'none',
      transition: 'all 0.2s ease-in-out',
    },
    checkboxGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    checkbox: {
      width: '18px',
      height: '18px',
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
      fontWeight: '600',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      border: 'none',
    },
    cancelButton: {
      backgroundColor: '#F1F5F9',
      color: '#475569',
    },
    saveButton: {
      backgroundColor: '#3B82F6',
      color: '#ffffff',
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

  // Стили для анимаций (добавляем в head)
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
            {mode === 'create' ? 'Мұғалім қосу' : 'Мұғалімді өңдеу'}
          </h2>
          <p style={styles.subtitle}>
            {mode === 'create' 
              ? 'Жаңа мұғалім туралы ақпаратты толтырыңыз' 
              : 'Мұғалім туралы ақпаратты өзгертіңіз'}
          </p>

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Full Name */}
            <div style={styles.formGroup}>
              <label style={styles.label}>ТАӘ</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name || ''}
                onChange={handleChange}
                style={styles.input}
                placeholder="Аты-жөніңізді енгізіңіз"
                required
              />
            </div>

            {/* Email */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                style={styles.input}
                placeholder="teacher@school.kz"
                required
              />
            </div>

            {/* Password (только для create) */}
            {mode === 'create' && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Құпиясөз</label>
                <input
                  type="password"
                  name="password"
                  value={'password' in formData ? formData.password || '' : ''}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Кемінде 6 таңба"
                  required
                />
              </div>
            )}

            {/* Hire Date */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Қабылдау күні</label>
              <input
                type="date"
                name="hire_date"
                value={formData.hire_date || ''}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            {/* Is Active (только для edit) */}
            {mode === 'edit' && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Статус</label>
                <div style={styles.checkboxGroup}>
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={'is_active' in formData ? formData.is_active || false : true}
                    onChange={handleChange}
                    style={styles.checkbox}
                    id="is_active"
                  />
                  <label htmlFor="is_active" style={{ fontSize: '14px', color: '#334155' }}>
                    Белсенді
                  </label>
                </div>
              </div>
            )}

            {error && <div style={styles.error}>{error}</div>}

            <div style={styles.actions}>
              <button
                type="button"
                style={{ ...styles.button, ...styles.cancelButton }}
                onClick={onClose}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#E2E8F0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#F1F5F9';
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
                    e.currentTarget.style.backgroundColor = '#2563EB';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.backgroundColor = '#3B82F6';
                  }
                }}
              >
                {isLoading ? 'Сохранение...' : mode === 'create' ? 'Жасау' : 'Сақтау'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddEditTeacherModal;