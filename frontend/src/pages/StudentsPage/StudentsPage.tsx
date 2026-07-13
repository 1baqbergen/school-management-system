// src/pages/StudentsPage/StudentsPage.tsx
import { useEffect, useState, useCallback, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { userStore } from '../../store/userStore';
import { studentApi } from '../../features/students/api/studentApi';
import type { 
  Student, 
  CreateStudentDto, 
  UpdateStudentDto,
  StudentFilters 
} from '../../features/students/types/student.types';
import StudentsTable from '../../features/students/components/StudentsTable';
import AddEditStudentModal from '../../features/students/components/AddEditStudentModal';
import { classApi } from '../../features/classes/api/classApi';
import type { ClassStudent } from '../../features/classes/api/classApi';

// Интерфейс для класса (из бекенда)
interface ClassOption {
  id: number;
  name: string;
}

interface TeacherClassInfo {
  id: number;
  name: string;
  grade: number;
  letter: string;
}

const StudentsPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<StudentFilters>({
    class_id: null,
    search: '',
  });

  // Teacher specific states (для отображения как в ClassesPage)
  const [teacherClassInfo, setTeacherClassInfo] = useState<TeacherClassInfo | null>(null);
  const [studentsWithGrades, setStudentsWithGrades] = useState<ClassStudent[]>([]);
  const [studentsWithGradesLoading, setStudentsWithGradesLoading] = useState(false);
  
  // Date filter states (для teacher)
  const [startDate, setStartDate] = useState<string>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const user = userStore((state) => state.user);
  const isAdmin = user?.role === 'admin';
  const isTeacher = user?.role === 'teacher';

  // Загрузка классов (только для админа)
  const fetchClasses = async () => {
    try {
      const data = await classApi.getAll();
      const mapped = data.map((cls) => ({
        id: cls.id,
        name: cls.name,
      }));
      setClasses(mapped);
    } catch (err) {
      console.error('Error fetching classes:', err);
    }
  };

  // Загрузка учеников для админа
  const fetchStudents = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await studentApi.getAll();
      data.sort((a, b) => a.full_name.localeCompare(b.full_name));
      setStudents(data);
    } catch (err) {
      setError('Оқушылар тізімін жүктеу мүмкін болмады');
      console.error('Error loading students:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Загрузка данных для учителя (как в ClassesPage)
  const fetchTeacherClassData = async () => {
    setStudentsWithGradesLoading(true);
    setError(null);

    try {
      // Получаем информацию о классе учителя
      const teacherClasses = await classApi.getTeacherClasses();
      
      if (teacherClasses && teacherClasses.length > 0) {
        const teacherClass = teacherClasses[0];
        setTeacherClassInfo({
          id: teacherClass.id,
          name: teacherClass.name,
          grade: teacherClass.grade,
          letter: teacherClass.letter,
        });
        
        // Получаем учеников с оценками
        const studentsData = await classApi.getClassStudents(teacherClass.id, startDate, endDate);
        setStudentsWithGrades(studentsData);
      } else {
        setTeacherClassInfo(null);
        setStudentsWithGrades([]);
      }
    } catch (err) {
      console.error('Error loading teacher class data:', err);
      setError('Сынып деректерін жүктеу мүмкін болмады');
    } finally {
      setStudentsWithGradesLoading(false);
    }
  };

  // Обновление данных учителя при изменении дат
  const handleDateFilterChange = async (newStartDate: string, newEndDate: string) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    
    if (teacherClassInfo) {
      setStudentsWithGradesLoading(true);
      try {
        const studentsData = await classApi.getClassStudents(teacherClassInfo.id, newStartDate, newEndDate);
        setStudentsWithGrades(studentsData);
      } catch (err) {
        console.error('Error loading students:', err);
        setError('Оқушылар тізімін жүктеу мүмкін болмады');
      } finally {
        setStudentsWithGradesLoading(false);
      }
    }
  };

  // Экспорт в Excel для учителя
  const handleExportToExcel = () => {
    if (!studentsWithGrades.length || !teacherClassInfo) return;

    interface ExcelRow {
      'Оқушының аты-жөні': string;
      'Пән': string;
      'Баға': string;
      'Күні': string;
      'Пікір': string;
    }

    const excelData: ExcelRow[] = studentsWithGrades.flatMap(student => {
      if (student.grades && student.grades.length > 0) {
        return student.grades.map(grade => ({
          'Оқушының аты-жөні': student.full_name,
          'Пән': grade.subject_name,
          'Баға': grade.grade_value.toString(),
          'Күні': new Date(grade.grade_date).toLocaleDateString('ru-RU'),
          'Пікір': grade.comment || '',
        }));
      } else {
        return [{
          'Оқушының аты-жөні': student.full_name,
          'Пән': 'Баға жоқ',
          'Баға': '',
          'Күні': '',
          'Пікір': '',
        }];
      }
    });

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Бағалау');
    
    const colWidths = [
      { wch: 30 },
      { wch: 20 },
      { wch: 10 },
      { wch: 15 },
      { wch: 30 },
    ];
    ws['!cols'] = colWidths;

    XLSX.writeFile(wb, `${teacherClassInfo.name}_бағалау_${startDate}_-_${endDate}.xlsx`);
  };

  useEffect(() => {
    if (isAdmin) {
      Promise.all([fetchStudents(), fetchClasses()]);
    } else if (isTeacher) {
      fetchTeacherClassData();
    }
  }, [isAdmin, isTeacher]);

  // Фильтрация учеников (только для админа)
  const filteredStudents = useMemo(() => {
    if (!isAdmin) return [];
    
    return students.filter(student => {
      if (filters.class_id && student.class_id !== filters.class_id) {
        return false;
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return student.full_name.toLowerCase().includes(searchLower);
      }
      
      return true;
    });
  }, [students, filters, isAdmin]);

  const handleOpenCreate = () => {
    setModalMode('create');
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = useCallback((student: Student) => {
    setModalMode('edit');
    setEditingStudent(student);
    setIsModalOpen(true);
  }, []);

  const handleSave = async (data: CreateStudentDto | UpdateStudentDto) => {
    if (modalMode === 'create') {
      await studentApi.create(data as CreateStudentDto);
    } else if (modalMode === 'edit' && editingStudent) {
      await studentApi.update(editingStudent.id, data);
    }
    await fetchStudents();
  };

  const handleDelete = useCallback(async (id: number) => {
    if (window.confirm('Сіз бұл оқушыны жоюға сенімдісіз бе?')) {
      try {
        await studentApi.delete(id);
        await fetchStudents();
      } catch (err) {
        console.error('Error deleting student:', err);
        setError('Оқушыны алып тастау мүмкін болмады');
      }
    }
  }, []);

  const handleFilterChange = (key: keyof StudentFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Стили
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
      fontWeight: '600',
      color: '#0f172a',
      margin: 0,
    },
    addButton: {
      padding: '10px 20px',
      backgroundColor: '#3b82f6',
      color: '#ffffff',
      border: 'none',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    filters: {
      display: 'flex',
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
      minWidth: '200px',
    },
    filterInput: {
      padding: '8px 12px',
      fontSize: '14px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      outline: 'none',
      backgroundColor: '#f8fafc',
      minWidth: '250px',
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
      color: '#64748b',
      fontSize: '16px',
    },
    error: {
      padding: '20px',
      backgroundColor: '#fef2f2',
      border: '1px solid #fee2e2',
      borderRadius: '12px',
      color: '#b91c1c',
      textAlign: 'center' as const,
    },
    teacherHeader: {
      padding: '16px 20px',
      background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)',
      borderRadius: '16px',
      border: '1px solid #c7d2fe',
    },
    teacherClassTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1e40af',
      marginBottom: '8px',
    },
    teacherClassSubtitle: {
      fontSize: '14px',
      color: '#3b82f6',
    },
    dateFilterContainer: {
      display: 'flex',
      gap: '16px',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      padding: '16px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      marginBottom: '16px',
    },
    dateInput: {
      padding: '8px 12px',
      fontSize: '14px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      outline: 'none',
      backgroundColor: '#f8fafc',
    },
    exportButton: {
      padding: '8px 16px',
      backgroundColor: '#10b981',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      marginLeft: 'auto',
    },
    studentsContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '12px',
    },
    studentCard: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
      transition: 'all 0.2s ease',
    },
    studentHeader: {
      padding: '16px',
      backgroundColor: '#f8fafc',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    studentName: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#0f172a',
    },
    studentClass: {
      fontSize: '14px',
      color: '#64748b',
    },
    gradesTable: {
      width: '100%',
      borderCollapse: 'collapse' as const,
      fontSize: '13px',
    },
    gradeTh: {
      textAlign: 'left' as const,
      padding: '12px',
      backgroundColor: '#f1f5f9',
      color: '#475569',
      fontWeight: '500',
      borderBottom: '1px solid #e2e8f0',
    },
    gradeTd: {
      padding: '10px 12px',
      borderBottom: '1px solid #f1f5f9',
      color: '#334155',
    },
    gradeBadge: {
      display: 'inline-block',
      padding: '4px 8px',
      borderRadius: '8px',
      fontSize: '12px',
      fontWeight: '600',
      backgroundColor: '#dbeafe',
      color: '#1e40af',
    },
    noGrades: {
      padding: '24px',
      textAlign: 'center' as const,
      color: '#94a3b8',
      fontSize: '13px',
    },
  };

  if (isTeacher) {
    return (
      <div style={styles.page}>
        <div style={styles.header}>
          <h1 style={styles.title}>Менің сыныбым</h1>
        </div>
        {teacherClassInfo && (
          <div style={styles.teacherHeader}>
            <div style={styles.teacherClassTitle}>
              {teacherClassInfo.name} сыныбы
            </div>
            <div style={styles.teacherClassSubtitle}>
              Сынып жетекшісі: {user?.full_name}
            </div>
          </div>
        )}
        <div style={styles.dateFilterContainer}>
          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>Басталу күні:</span>
            <input
              type="date"
              style={styles.dateInput}
              value={startDate}
              onChange={(e) => handleDateFilterChange(e.target.value, endDate)}
            />
          </div>
          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>Аяқталу күні:</span>
            <input
              type="date"
              style={styles.dateInput}
              value={endDate}
              onChange={(e) => handleDateFilterChange(startDate, e.target.value)}
            />
          </div>
          <button
            style={styles.exportButton}
            onClick={handleExportToExcel}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#059669';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#10b981';
            }}
          >
            📊 Excel жүктеу
          </button>
        </div>

        {studentsWithGradesLoading && (
          <div style={styles.loading}>Оқушылар жүктелуде...</div>
        )}

        {error && !studentsWithGradesLoading && (
          <div style={styles.error}>{error}</div>
        )}

        {!studentsWithGradesLoading && !error && teacherClassInfo && (
          <div style={styles.studentsContainer}>
            {studentsWithGrades.length === 0 ? (
              <div style={styles.noGrades}>
                Бұл сыныпта оқушылар жоқ
              </div>
            ) : (
              studentsWithGrades.map((student) => (
                <div key={student.id} style={styles.studentCard}>
                  <div style={styles.studentHeader}>
                    <div>
                      <div style={styles.studentName}>{student.full_name}</div>
                      <div style={styles.studentClass}>
                        {teacherClassInfo.name} сынып
                      </div>
                    </div>
                  </div>
                  
                  {student.grades && student.grades.length > 0 ? (
                    <table style={styles.gradesTable}>
                      <thead>
                        <tr>
                          <th style={styles.gradeTh}>Пән</th>
                          <th style={styles.gradeTh}>Баға</th>
                          <th style={styles.gradeTh}>Күні</th>
                          <th style={styles.gradeTh}>Пікір</th>
                        </tr>
                      </thead>
                      <tbody>
                        {student.grades.map((grade, idx) => (
                          <tr key={idx}>
                            <td style={styles.gradeTd}>{grade.subject_name}</td>
                            <td style={styles.gradeTd}>
                              <span style={styles.gradeBadge}>{grade.grade_value}</span>
                            </td>
                            <td style={styles.gradeTd}>
                              {new Date(grade.grade_date).toLocaleDateString('ru-RU')}
                            </td>
                            <td style={styles.gradeTd}>{grade.comment || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div style={styles.noGrades}>
                      Оқушының бағалары жоқ
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {!teacherClassInfo && !studentsWithGradesLoading && !error && (
          <div style={styles.error}>
            Сізге сынып тағайындалмаған. Әкімшіге хабарласыңыз.
          </div>
        )}
      </div>
    );
  }

  // Рендер для админа (старая логика)
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

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Оқушыларды басқару</h1>
        <button
          style={styles.addButton}
          onClick={handleOpenCreate}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#2563eb';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#3b82f6';
          }}
        >
          + Оқушыны қосу
        </button>
      </div>
      <div style={styles.filters}>
        <div style={styles.filterGroup}>
          <span style={styles.filterLabel}>Сынып:</span>
          <select
            style={styles.filterSelect}
            value={filters.class_id || ''}
            onChange={(e) => handleFilterChange('class_id', e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Барлық сынып</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.filterGroup}>
          <span style={styles.filterLabel}>Іздеу:</span>
          <input
            type="text"
            style={styles.filterInput}
            placeholder="Аты жөні бойынша іздеу..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        <div style={styles.stats}>
          {filteredStudents.length} оқушы табылды
        </div>
      </div>

      {isLoading && <div style={styles.loading}>Оқушылар жүктелуде...</div>}

      {error && !isLoading && (
        <div style={styles.error}>{error}</div>
      )}

      {!isLoading && !error && (
        <StudentsTable
          students={filteredStudents}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          loading={isLoading}
        />
      )}

      <AddEditStudentModal
        isOpen={isModalOpen}
        mode={modalMode}
        student={editingStudent}
        classes={classes}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        isTeacher={false}
      />
    </div>
  );
};

export default StudentsPage;