// src/features/homeworks/components/AddHomeworkModal.tsx
import { useState, useEffect } from 'react';
import type { CreateHomeworkDto } from '../types/homework.types';
interface AddHomeworkModalProps {
  isOpen: boolean;
  classes: Array<{ id: number; name: string }>;
  subjects: Array<{ id: number; name: string }>;
  teacherSubjects?: Array<{ id: number; name: string }>;
  userRole: string; // admin немесе teacher
  onClose: () => void;
  onSave: (data: CreateHomeworkDto) => Promise<void>;
}

const AddHomeworkModal = ({ isOpen, classes, subjects, onClose, onSave }: AddHomeworkModalProps) => {
  const [formData, setFormData] = useState<CreateHomeworkDto>({
    title: '',
    description: '',
    class_id: 0,
    subject_id: 0,
    due_date: new Date().toISOString().split('T')[0],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const teacherSubjects = subjects;
  // ... useState және formData инициализациясын өзгерту
  useEffect(() => {
  if (subjects.length > 0 && formData.subject_id === 0) {
    setFormData(prev => ({ ...prev, subject_id: subjects[0].id }));
  }
  if (classes.length > 0 && formData.class_id === 0) {
    setFormData(prev => ({ ...prev, class_id: classes[0].id }));
  }
}, [subjects, classes]);
  
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!formData.title.trim()) throw new Error('Введите название');
      if (!formData.description.trim()) throw new Error('Введите описание');
      if (!formData.class_id) throw new Error('Выберите класс');
      if (!formData.subject_id) throw new Error('Выберите предмет');
      if (!formData.due_date) throw new Error('Выберите дату сдачи');

      await onSave(formData);
      onClose();
      setFormData({
        title: '',
        description: '',
        class_id: classes[0]?.id || 0,
        subject_id: subjects[0]?.id || 0,
        due_date: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка');
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
    form: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '20px',
      marginTop: '24px',
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
      fontSize: '14px',
      border: '1px solid #E2E8F0',
      borderRadius: '12px',
      outline: 'none',
      transition: 'all 0.2s ease',
    },
    textarea: {
      padding: '12px',
      fontSize: '14px',
      border: '1px solid #E2E8F0',
      borderRadius: '12px',
      outline: 'none',
      minHeight: '100px',
      fontFamily: 'inherit',
    },
    select: {
      padding: '12px',
      fontSize: '14px',
      border: '1px solid #E2E8F0',
      borderRadius: '12px',
      outline: 'none',
      backgroundColor: '#FFFFFF',
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
        <h2 style={styles.title}>Үй тапсырмасын қосу</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Атауы</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Сипаттама</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={styles.textarea}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Сынып</label>
            <select
              value={formData.class_id}
              onChange={(e) => setFormData({ ...formData, class_id: Number(e.target.value) })}
              style={styles.select}
              required
            >
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Пән</label>
            <select
  value={formData.subject_id}
  onChange={(e) => setFormData({ ...formData, subject_id: Number(e.target.value) })}
  style={styles.select}
  required
>
  {teacherSubjects.map(subj => (
    <option key={subj.id} value={subj.id}>{subj.name}</option>
  ))}
</select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Тапсыру күні</label>
            <input
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              style={styles.input}
              required
            />
          </div>
          {error && <div style={styles.error}>{error}</div>}
          <div style={styles.actions}>
            <button type="button" style={{ ...styles.button, ...styles.cancelButton }} onClick={onClose}>
              Бас тарту
            </button>
            <button type="submit" disabled={isLoading} style={{ ...styles.button, ...styles.saveButton, opacity: isLoading ? 0.7 : 1 }}>
              {isLoading ? 'Сақталуда...' : 'Жасау'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHomeworkModal;