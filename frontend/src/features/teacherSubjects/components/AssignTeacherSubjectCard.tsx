// src/features/teacherSubjects/components/AssignTeacherSubjectCard.tsx
import { useState } from 'react';
import type { TeacherOption, SubjectOption } from '../types/teacherSubject.types';

interface AssignTeacherSubjectCardProps {
  teachers: TeacherOption[];
  subjects: SubjectOption[];
  onAssign: (teacherId: number, subjectId: number) => Promise<void>;
  loading?: boolean;
}

const AssignTeacherSubjectCard = ({
  teachers,
  subjects,
  onAssign,
  loading = false,
}: AssignTeacherSubjectCardProps) => {
  const [selectedTeacherId, setSelectedTeacherId] = useState<number>(0);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFormValid = selectedTeacherId > 0 && selectedSubjectId > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      await onAssign(selectedTeacherId, selectedSubjectId);
      // Очищаем форму после успешного назначения
      setSelectedTeacherId(0);
      setSelectedSubjectId(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при назначении');
    } finally {
      setIsSubmitting(false);
    }
  };

  const styles = {
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
      border: '1px solid #e2e8f0',
      marginBottom: '32px',
    },
    title: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#0f172a',
      margin: '0 0 8px 0',
    },
    description: {
      fontSize: '14px',
      color: '#64748b',
      margin: '0 0 20px 0',
    },
    form: {
      display: 'flex',
      gap: '16px',
      alignItems: 'flex-end',
      flexWrap: 'wrap' as const,
    },
    formGroup: {
      flex: '1',
      minWidth: '200px',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '6px',
    },
    label: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#334155',
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
      width: '100%',
    },
    button: {
      padding: '12px 24px',
      fontSize: '14px',
      fontWeight: '500',
      borderRadius: '10px',
      border: 'none',
      cursor: (isFormValid && !isSubmitting && !loading) ? 'pointer' : 'not-allowed',
      backgroundColor: (isFormValid && !isSubmitting && !loading) ? '#3b82f6' : '#94a3b8',
      color: '#ffffff',
      transition: 'all 0.2s ease',
      minWidth: '140px',
      height: '48px',
    },
    error: {
      marginTop: '16px',
      padding: '12px',
      backgroundColor: '#fef2f2',
      border: '1px solid #fee2e2',
      borderRadius: '10px',
      color: '#b91c1c',
      fontSize: '14px',
    },
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Жаңа тағайындау</h3>
      <p style={styles.description}>
        Тағайындау үшін мұғалім мен пәнді таңдаңыз
      </p>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Учитель</label>
          <select
            value={selectedTeacherId}
            onChange={(e) => setSelectedTeacherId(Number(e.target.value))}
            style={styles.select}
            disabled={loading || isSubmitting}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.backgroundColor = '#ffffff';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e2e8f0';
              e.target.style.backgroundColor = '#f8fafc';
            }}
          >
            <option value={0}>Мұғалімді таңдаңыз</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.full_name}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Пән</label>
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(Number(e.target.value))}
            style={styles.select}
            disabled={loading || isSubmitting}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.backgroundColor = '#ffffff';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e2e8f0';
              e.target.style.backgroundColor = '#f8fafc';
            }}
          >
            <option value={0}>Пәнді таңдаңыз</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          style={styles.button}
          disabled={!isFormValid || isSubmitting || loading}
          onMouseEnter={(e) => {
            if (isFormValid && !isSubmitting && !loading) {
              e.currentTarget.style.backgroundColor = '#2563eb';
            }
          }}
          onMouseLeave={(e) => {
            if (isFormValid && !isSubmitting && !loading) {
              e.currentTarget.style.backgroundColor = '#3b82f6';
            }
          }}
        >
          {isSubmitting ? 'Тағайындалуда...' : 'Тағайындау'}
        </button>
      </form>

      {error && <div style={styles.error}>{error}</div>}
    </div>
  );
};

export default AssignTeacherSubjectCard;