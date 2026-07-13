// src/pages/TeachersPage/TeachersPage.tsx
import { useEffect, useState } from 'react';
import { userStore } from '../../store/userStore';
import { teacherApi } from '../../features/teachers/api/teacherApi';
import type { Teacher, CreateTeacherDto, UpdateTeacherDto } from '../../features/teachers/types/teacher.types';
import TeachersTable from '../../features/teachers/components/TeachersTable';
import AddEditTeacherModal from '../../features/teachers/components/AddEditTeacherModal';

const TeachersPage = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  const user = userStore((state) => state.user);
  const isAdmin = user?.role === 'admin';

  // Загрузка учителей
  const fetchTeachers = async () => {
  setIsLoading(true);
  setError(null);

  try {
    const result = await teacherApi.getAll(); // { count, teachers }
    setTeachers(result.teachers);
  } catch (err) {
    setError('Не удалось загрузить список учителей');
    console.error('Error loading teachers:', err);
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    if (isAdmin) {
      fetchTeachers();
    }
  }, [isAdmin]);

  const handleOpenCreate = () => {
    setModalMode('create');
    setEditingTeacher(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (teacher: Teacher) => {
    setModalMode('edit');
    setEditingTeacher(teacher);
    setIsModalOpen(true);
  };

  const handleSave = async (data: CreateTeacherDto | UpdateTeacherDto) => {
    if (modalMode === 'create') {
      await teacherApi.create(data as CreateTeacherDto);
    } else if (modalMode === 'edit' && editingTeacher) {
      await teacherApi.update(editingTeacher.id, data);
    }
    await fetchTeachers(); // Перезагружаем список
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этого учителя?')) {
      try {
        await teacherApi.delete(id);
        await fetchTeachers();
      } catch (err) {
        console.error('Error deleting teacher:', err);
        setError('Не удалось удалить учителя');
      }
    }
  };

  // Если не админ, показываем сообщение о доступе
  if (!isAdmin) {
    return (
      <div style={{
        padding: '48px',
        textAlign: 'center' as const,
        backgroundColor: '#FEF2F2',
        borderRadius: '16px',
        color: '#B91C1C',
      }}>
        У вас нет доступа к этой странице
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
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#0F172A',
      margin: 0,
    },
    addButton: {
      padding: '10px 20px',
      backgroundColor: '#3B82F6',
      color: '#ffffff',
      border: 'none',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
    },
    loading: {
      padding: '48px',
      textAlign: 'center' as const,
      color: '#64748B',
      fontSize: '16px',
    },
    error: {
      padding: '20px',
      backgroundColor: '#FEF2F2',
      border: '1px solid #FEE2E2',
      borderRadius: '12px',
      color: '#B91C1C',
      textAlign: 'center' as const,
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Мұғалімдерді басқару</h1>
        <button
          style={styles.addButton}
          onClick={handleOpenCreate}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#2563EB';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#3B82F6';
          }}
        >
          + Мұғалім қосу
        </button>
      </div>

      {isLoading && <div style={styles.loading}>Мұғалімдер жүктелуде...</div>}

      {error && !isLoading && (
        <div style={styles.error}>{error}</div>
      )}

      {!isLoading && !error && (
        <TeachersTable
          teachers={teachers}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />
      )}

      <AddEditTeacherModal
        isOpen={isModalOpen}
        mode={modalMode}
        teacher={editingTeacher}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default TeachersPage;