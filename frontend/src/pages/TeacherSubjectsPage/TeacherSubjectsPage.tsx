// src/pages/TeacherSubjectsPage/TeacherSubjectsPage.tsx
import { useEffect, useState, useCallback } from 'react';
import { userStore } from '../../store/userStore';
import { teacherSubjectApi } from '../../features/teacherSubjects/api/teacherSubjectApi';
import type { 
  TeacherSubject, 
  TeacherOption, 
  SubjectOption 
} from '../../features/teacherSubjects/types/teacherSubject.types';
import AssignTeacherSubjectCard from '../../features/teacherSubjects/components/AssignTeacherSubjectCard';
import TeacherSubjectsTable from '../../features/teacherSubjects/components/TeacherSubjectsTable';
import { normalizeRole } from '../../utils/roleUtils';
const TeacherSubjectsPage = () => {
  const [assignments, setAssignments] = useState<TeacherSubject[]>([]);
  const [teachers, setTeachers] = useState<TeacherOption[]>([]);
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const user = userStore((state) => state.user);
  const role = normalizeRole(user?.role);
const isAdmin = role === 'admin';

  // Загрузка всех данных
  const fetchAllData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [assignmentsData, teachersData, subjectsData] = await Promise.all([
        teacherSubjectApi.getAll(),
        teacherSubjectApi.getTeachers(),
        teacherSubjectApi.getSubjects(),
      ]);

      // Сортируем назначения по дате (сначала новые)
      assignmentsData.sort((a, b) => {
        if (a.created_at && b.created_at) {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        return 0;
      });

      setAssignments(assignmentsData);
      setTeachers(teachersData);
      setSubjects(subjectsData);
    } catch (err) {
      setError('Не удалось загрузить данные');
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAllData();
    }
  }, [isAdmin]);

  const handleAssign = async (teacherId: number, subjectId: number) => {
    setError(null);
    setSuccess(null);

    try {
      await teacherSubjectApi.create({
        teacher_id: teacherId,
        subject_id: subjectId,
      });

      // Перезагружаем список назначений
      const updatedAssignments = await teacherSubjectApi.getAll();
      updatedAssignments.sort((a, b) => {
        if (a.created_at && b.created_at) {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        return 0;
      });
      setAssignments(updatedAssignments);
      
      setSuccess('Предмет успешно назначен учителю');
      
      // Автоматически скрываем сообщение через 3 секунды
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      throw err; // Пробрасываем для обработки в карточке
    }
  };

  const handleDelete = useCallback(async (id: number) => {
    setError(null);
    setSuccess(null);

    try {
      await teacherSubjectApi.delete(id);
      
      // Обновляем список после удаления
      setAssignments(prev => prev.filter(item => item.id !== id));
      
      setSuccess('Назначение успешно удалено');
      
      // Автоматически скрываем сообщение через 3 секунды
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Не удалось удалить назначение');
      console.error('Error deleting assignment:', err);
    }
  }, []);

  // Если не админ, показываем сообщение о доступе
  if (!isAdmin) {
    return (
      <div style={{
        padding: '48px',
        textAlign: 'center' as const,
        backgroundColor: '#fef2f2',
        borderRadius: '12px',
        color: '#b91c1c',
      }}>
        Сізге бұл бетке рұқсат жоқ
      </div>
    );
  }

  const styles = {
    page: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '24px',
    },
    header: {
      marginBottom: '8px',
    },
    title: {
      fontSize: '28px',
      fontWeight: '600',
      color: '#0f172a',
      margin: '0 0 8px 0',
    },
    description: {
      fontSize: '16px',
      color: '#64748b',
      margin: 0,
    },
    message: {
      padding: '16px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '16px',
    },
    successMessage: {
      backgroundColor: '#dcfce7',
      border: '1px solid #86efac',
      color: '#166534',
    },
    errorMessage: {
      backgroundColor: '#fef2f2',
      border: '1px solid #fee2e2',
      color: '#b91c1c',
    },
    loading: {
      padding: '48px',
      textAlign: 'center' as const,
      color: '#64748b',
      fontSize: '16px',
    },
    stats: {
      fontSize: '14px',
      color: '#64748b',
      marginTop: '8px',
    },
  };

  if (isLoading) {
    return (
      <div style={styles.page}>
        <div style={styles.header}>
          <h1 style={styles.title}>Мұғалімдерге пәндерді тағайындау</h1>
          <p style={styles.description}>
            Мұғалімдер мен пәндер арасындағы байланысты басқару
          </p>
        </div>
        <div style={styles.loading}>Загрузка данных...</div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Мұғалімдерге пәндерді тағайындау</h1>
        <p style={styles.description}>
          Мұғалімдер мен пәндер арасындағы байланысты басқару
        </p>
      </div>

      {/* Сообщения */}
      {success && (
        <div style={{ ...styles.message, ...styles.successMessage }}>
          {success}
        </div>
      )}
      
      {error && (
        <div style={{ ...styles.message, ...styles.errorMessage }}>
          {error}
        </div>
      )}

      {/* Карточка назначения */}
      <AssignTeacherSubjectCard
        teachers={teachers}
        subjects={subjects}
        onAssign={handleAssign}
        loading={isLoading}
      />

      {/* Статистика */}
      <div style={styles.stats}>
       Жалпы тағайындаулар: {assignments.length}
      </div>

      {/* Таблица назначений */}
      <TeacherSubjectsTable
        assignments={assignments}
        loading={isLoading}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default TeacherSubjectsPage;