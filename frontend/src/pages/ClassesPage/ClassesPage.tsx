// src/pages/ClassesPage/ClassesPage.tsx
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { userStore } from '../../store/userStore';
import { classApi } from '../../features/classes/api/classApi';
import type { ClassStudent } from '../../features/classes/api/classApi';
import type { Class, CreateClassDto, UpdateClassDto, TeacherOption } from '../../features/classes/types/class.types';
import ClassModal from '../../features/classes/components/ClassModal';
import StudentsModal from '../../features/classes/components/StudentsModal';

const ClassesPage = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [teachers, setTeachers] = useState<TeacherOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  
  // Students modal states
  const [isStudentsModalOpen, setIsStudentsModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [students, setStudents] = useState<ClassStudent[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState<string | null>(null);
  
  // Date filter states
  const [startDate, setStartDate] = useState<string>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  const user = userStore((state) => state.user);
  const isAdmin = user?.role === 'admin';

  // Загрузка классов и учителей
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [classesData, teachersData] = await Promise.all([
        classApi.getAll(),
        classApi.getTeachers(),
      ]);
      
      classesData.sort((a, b) => {
        if (a.grade === b.grade) {
          return a.letter.localeCompare(b.letter);
        }
        return a.grade - b.grade;
      });
      
      setClasses(classesData);
      setTeachers(teachersData);
    } catch (err) {
      setError('Не удалось загрузить данные');
      console.error('Error loading classes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  // Загрузка студентов выбранного класса
  const handleViewStudents = async (cls: Class) => {
    setSelectedClass(cls);
    setIsStudentsModalOpen(true);
    setStudentsLoading(true);
    setStudentsError(null);

    try {
      const studentsData = await classApi.getClassStudents(cls.id, startDate, endDate);
      setStudents(studentsData);
    } catch (err) {
      console.error('Error loading students:', err);
      setStudentsError('Не удалось загрузить список учеников');
    } finally {
      setStudentsLoading(false);
    }
  };

  // Обновление студентов при изменении дат
  const handleDateFilterChange = async (newStartDate: string, newEndDate: string) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    
    if (selectedClass) {
      setStudentsLoading(true);
      try {
        const studentsData = await classApi.getClassStudents(selectedClass.id, newStartDate, newEndDate);
        setStudents(studentsData);
      } catch (err) {
        console.error('Error loading students:', err);
        setStudentsError('Не удалось загрузить список учеников');
      } finally {
        setStudentsLoading(false);
      }
    }
  };

  // Экспорт в Excel
  const handleExportToExcel = () => {
    if (!students.length || !selectedClass) return;

    interface ExcelRow {
      'Оқушының аты-жөні': string;
      'Пән': string;
      'Баға': string;
      'Күні': string;
      'Пікір': string;
    }

    const excelData: ExcelRow[] = students.flatMap(student => {
      if (student.grades.length > 0) {
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

    XLSX.writeFile(wb, `${selectedClass.name}_бағалау_${startDate}_-_${endDate}.xlsx`);
  };

  const handleOpenCreate = () => {
    setModalMode('create');
    setEditingClass(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cls: Class) => {
    setModalMode('edit');
    setEditingClass(cls);
    setIsModalOpen(true);
  };

  const handleSave = async (data: CreateClassDto | UpdateClassDto) => {
    if (modalMode === 'create') {
      await classApi.create(data as CreateClassDto);
    } else if (modalMode === 'edit' && editingClass) {
      await classApi.update(editingClass.id, data as UpdateClassDto);
    }
    await fetchData();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Сіз бұл сыныпты жойғыңыз келе ме?')) {
      try {
        await classApi.delete(id);
        await fetchData();
      } catch (err) {
        console.error('Error deleting class:', err);
        setError('Сыныпты жою мүмкін болмады');
      }
    }
  };

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

  // Стили компонента
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
    tableContainer: {
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      overflow: 'hidden',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse' as const,
      fontSize: '14px',
    },
    th: {
      textAlign: 'left' as const,
      padding: '16px',
      backgroundColor: '#f8fafc',
      color: '#475569',
      fontWeight: '600',
      borderBottom: '1px solid #e2e8f0',
    },
    td: {
      padding: '14px 16px',
      borderBottom: '1px solid #f1f5f9',
      color: '#334155',
    },
    tr: {
      transition: 'background-color 0.15s ease',
    },
    badge: {
      display: 'inline-block',
      padding: '4px 10px',
      backgroundColor: '#e2e8f0',
      borderRadius: '30px',
      fontSize: '12px',
      fontWeight: '500',
      color: '#334155',
    },
    actions: {
      display: 'flex',
      gap: '8px',
    },
    actionButton: {
      padding: '6px 12px',
      border: 'none',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    editButton: {
      backgroundColor: '#eff6ff',
      color: '#3b82f6',
    },
    deleteButton: {
      backgroundColor: '#fef2f2',
      color: '#ef4444',
    },
    viewButton: {
      backgroundColor: '#eef2ff',
      color: '#4f46e5',
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
    emptyState: {
      padding: '48px',
      textAlign: 'center' as const,
      color: '#64748b',
      fontSize: '16px',
      backgroundColor: '#f8fafc',
      borderRadius: '12px',
      border: '2px dashed #e2e8f0',
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Сыныптар</h1>
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
          + Сынып қосу
        </button>
      </div>

      {isLoading && <div style={styles.loading}>Сыныптар жүктелуде...</div>}

      {error && !isLoading && (
        <div style={styles.error}>{error}</div>
      )}

      {!isLoading && !error && classes.length === 0 && (
        <div style={styles.emptyState}>
          Қосылған сыныптар жоқ. Біріншісін жасау үшін "Сынып қосу" түймесін басыңыз.
        </div>
      )}

      {!isLoading && !error && classes.length > 0 && (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Сынып</th>
                <th style={styles.th}>Сынып жетекшісі</th>
                <th style={styles.th}>Оқушылар саны</th>
                <th style={styles.th}>Әрекеттер</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls) => (
                <tr
                  key={cls.id}
                  style={styles.tr}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <td style={styles.td}>
                    <span style={styles.badge}>{cls.name}</span>
                  </td>
                  <td style={styles.td}>
                    {cls.class_teacher || '—'}
                  </td>
                  <td style={styles.td}>
                    <span style={styles.badge}>
                      {cls.students_count} {cls.students_count === 1 ? 'оқущы' : 
                        cls.students_count >= 2 && cls.students_count <= 4 ? 'оқушы' : 'оқушы'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actions}>
                      <button
                        style={{ ...styles.actionButton, ...styles.editButton }}
                        onClick={() => handleOpenEdit(cls)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#dbeafe';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#eff6ff';
                        }}
                      >
                        Өңдеу
                      </button>
                      <button
                        style={{ ...styles.actionButton, ...styles.deleteButton }}
                        onClick={() => handleDelete(cls.id)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#fee2e2';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#fef2f2';
                        }}
                      >
                        Жою
                      </button>
                      <button
                        style={{ ...styles.actionButton, ...styles.viewButton }}
                        onClick={() => handleViewStudents(cls)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#dbeafe';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#eef2ff';
                        }}
                      >
                         Оқушылар
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ClassModal
        isOpen={isModalOpen}
        mode={modalMode}
        class={editingClass}
        teachers={teachers}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

      <StudentsModal
        isOpen={isStudentsModalOpen}
        onClose={() => setIsStudentsModalOpen(false)}
        selectedClass={selectedClass}
        students={students}
        studentsLoading={studentsLoading}
        studentsError={studentsError}
        startDate={startDate}
        endDate={endDate}
        onDateFilterChange={handleDateFilterChange}
        onExport={handleExportToExcel}
      />
    </div>
  );
};

export default ClassesPage;