// src/pages/GradesPage/GradesPage.tsx
import { useEffect, useState, useMemo } from 'react';
import { userStore } from '../../store/userStore';
import { gradeApi } from '../../features/grades/api/gradeApi';
import type { Grade, CreateGradeDto, GradeMeta } from '../../features/grades/types/grade.types';
import GradesTable from '../../features/grades/components/GradesTable';
import StudentGradesView from '../../features/grades/components/StudentGradesView';
import AddEditGradeModal from '../../features/grades/components/AddEditGradeModal';

interface Filters {
  class_id: number | null;
  student_id: number | null;
  subject_id: number | null;
  search: string;
}



interface StudentOption {
  id: number;
  name: string;
  class_id: number | null;
  class_name: string;
}

const GradesPage = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
  const [meta, setMeta] = useState<GradeMeta | null>(null);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [filters, setFilters] = useState<Filters>({
    class_id: null,
    student_id: null,
    subject_id: null,
    search: '',
  });

  const user = userStore((state) => state.user);
  const userRole = (user?.role || '').toLowerCase();
  const isAdmin = userRole === 'admin';
  const isTeacher = userRole === 'teacher';
  const isStudent = userRole === 'student';

  // Загрузка классов для фильтра (только для админа)

  // Загрузка студентов для фильтра (только для админа)
  const fetchStudentsForFilter = async () => {
  try {
    const data = await gradeApi.getMeta();

    if (data?.students) {
      const mapped = data.students.map((s) => ({
        id: s.id,
        name: s.name,
        class_id: null, // backend бермейді, сондықтан null
        class_name: s.class_name,
      }));

      setStudents(mapped);
    }
  } catch (err) {
    console.error('Error fetching students:', err);
  }
};

  // Загрузка оценок в зависимости от роли
  const fetchGrades = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let data: Grade[] = [];

      if (isAdmin) {
        data = await gradeApi.getAll();
      } else if (isTeacher) {
        data = await gradeApi.getTeacherGrades();
      } else if (isStudent && user) {
        const studentId = Number((user as any)?.student_id);
        if (Number.isFinite(studentId)) {
          data = await gradeApi.getByStudentId(studentId);
        } else {
          data = [];
        }
      }

      data.sort((a, b) => new Date(b.grade_date).getTime() - new Date(a.grade_date).getTime());
      setGrades(data);
    } catch (err) {
      setError('Бағаларды жүктеу мүмкін болмады');
      console.error('Error loading grades:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Загрузка метаданных для модалки
  const fetchMeta = async () => {
    if (!isAdmin && !isTeacher) return;
    
    try {
      const data = await gradeApi.getMeta();
      setMeta(data);
    } catch (err) {
      console.error('Error loading meta:', err);
    }
  };

  useEffect(() => {
    fetchGrades();
    if (isAdmin || isTeacher) {
      fetchMeta();
    }
    if (isAdmin) {
      fetchStudentsForFilter();
    }
  }, [user?.id, userRole]);

  // Уникальные классы из оценок (для фильтра class)
  const uniqueClasses = useMemo(() => {
    if (!isAdmin) return [];
    const classMap = new Map<number, string>();
    grades.forEach(grade => {
      if (grade.class_id && grade.class_name && !classMap.has(grade.class_id)) {
        classMap.set(grade.class_id, grade.class_name);
      }
    });
    return Array.from(classMap.entries()).map(([id, name]) => ({ id, name }));
  }, [grades, isAdmin]);

  // Фильтрация студентов при выборе класса
  const filteredStudentsForSelect = useMemo(() => {
    if (!filters.class_id) return students;
    return students.filter(student => student.class_id === filters.class_id);
  }, [students, filters.class_id]);

  // Фильтрация оценок (только для админа)
  const filteredGrades = useMemo(() => {
    if (!isAdmin) return grades;
    
    return grades.filter(grade => {
      // Фильтр по классу
      if (filters.class_id && grade.class_id !== filters.class_id) {
        return false;
      }
      
      // Фильтр по студенту
      if (filters.student_id && grade.student_id !== filters.student_id) {
        return false;
      }
      
      // Фильтр по предмету
      if (filters.subject_id && grade.subject_id !== filters.subject_id) {
        return false;
      }
      
      // Поиск по имени студента
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return grade.student_name?.toLowerCase().includes(searchLower);
      }
      
      return true;
    });
  }, [grades, filters, isAdmin]);

  const handleFilterChange = (key: keyof Filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    // Сброс student_id при смене класса
    if (key === 'class_id') {
      setFilters(prev => ({ ...prev, student_id: null }));
    }
  };

  const handleOpenCreate = async () => {
    await fetchMeta();
    setModalMode('create');
    setEditingGrade(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (grade: Grade) => {
    setModalMode('edit');
    setEditingGrade(grade);
    setIsModalOpen(true);
  };

  const handleSave = async (data: CreateGradeDto) => {
    if (modalMode === 'create') {
      await gradeApi.create(data);
    } else if (modalMode === 'edit' && editingGrade) {
      await gradeApi.update(editingGrade.id, data);
    }
    await fetchGrades();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Бұл бағаны жойғыңыз келе ме?')) {
      try {
        await gradeApi.delete(id);
        await fetchGrades();
      } catch (err) {
        console.error('Error deleting grade:', err);
      }
    }
  };

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
    filters: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: '16px',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      padding: '16px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
    },
    filterGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    filterLabel: {
      fontSize: '14px',
      color: '#475569',
      fontWeight: '500',
    },
    filterSelect: {
      padding: '8px 12px',
      fontSize: '14px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      outline: 'none',
      backgroundColor: '#f8fafc',
      minWidth: '180px',
    },
    filterInput: {
      padding: '8px 12px',
      fontSize: '14px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      outline: 'none',
      backgroundColor: '#f8fafc',
      minWidth: '220px',
    },
    stats: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
      fontSize: '14px',
      color: '#64748b',
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

  // Для teacher и student показываем без фильтров
  if (!isAdmin) {
    return (
      <div style={styles.page}>
        <div style={styles.header}>
          <h1 style={styles.title}>Бағалар</h1>
          {(isAdmin || isTeacher) && (
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
              + Баға қосу
            </button>
          )}
        </div>

        {isLoading && <div style={styles.loading}>Жүктелуде...</div>}

        {error && !isLoading && (
          <div style={styles.error}>{error}</div>
        )}

        {!isLoading && !error && (
          <>
            {(isAdmin || isTeacher) && (
              <GradesTable
                grades={grades}
                userRole={userRole}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
              />
            )}

            {isStudent && (
              <StudentGradesView grades={grades} />
            )}
          </>
        )}

        {(isAdmin || isTeacher) && (
          <AddEditGradeModal
            isOpen={isModalOpen}
            mode={modalMode}
            grade={editingGrade}
            meta={meta}
            userRole={userRole}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
          />
        )}
      </div>
    );
  }

  // Admin view with filters
  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Бағалар</h1>
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
          + Баға қосу
        </button>
      </div>

      {/* Filters - только для админа */}
      <div style={styles.filters}>
        <div style={styles.filterGroup}>
          <span style={styles.filterLabel}>Сынып:</span>
          <select
            style={styles.filterSelect}
            value={filters.class_id || ''}
            onChange={(e) => handleFilterChange('class_id', e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Барлық сынып</option>
            {uniqueClasses.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.filterGroup}>
          <span style={styles.filterLabel}>Оқушы:</span>
          <select
            style={styles.filterSelect}
            value={filters.student_id || ''}
            onChange={(e) => handleFilterChange('student_id', e.target.value ? Number(e.target.value) : null)}
            disabled={!filters.class_id && filteredStudentsForSelect.length === 0}
          >
            <option value="">Барлық оқушы</option>
            {filteredStudentsForSelect.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name} ({student.class_name})
              </option>
            ))}
          </select>
        </div>

        <div style={styles.filterGroup}>
          <span style={styles.filterLabel}>Пән:</span>
          <select
            style={styles.filterSelect}
            value={filters.subject_id || ''}
            onChange={(e) => handleFilterChange('subject_id', e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Барлық пән</option>
            {meta?.subjects?.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.filterGroup}>
          <span style={styles.filterLabel}>Іздеу:</span>
          <input
            type="text"
            style={styles.filterInput}
            placeholder="Оқушы аты бойынша іздеу..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        <div style={styles.stats}>
          {filteredGrades.length} баға табылды
        </div>
      </div>

      {isLoading && <div style={styles.loading}>Жүктелуде...</div>}

      {error && !isLoading && (
        <div style={styles.error}>{error}</div>
      )}

      {!isLoading && !error && (
        <GradesTable
          grades={filteredGrades}
          userRole={userRole}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />
      )}

      <AddEditGradeModal
        isOpen={isModalOpen}
        mode={modalMode}
        grade={editingGrade}
        meta={meta}
        userRole={userRole}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default GradesPage;