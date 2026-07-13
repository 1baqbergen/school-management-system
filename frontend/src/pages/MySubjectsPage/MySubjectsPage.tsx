// src/pages/MySubjectsPage/MySubjectsPage.tsx
import { useState, useEffect, useCallback } from 'react';
import { BookOpen, Star, Calendar, TrendingUp, Loader, RefreshCw, AlertCircle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import { gradeApi } from '../../features/grades/api/gradeApi';

// ============================================================
// TYPES
// ============================================================

interface TeacherSubject {
  id: number;
  subject_id: number;
  subject_name: string;
  teacher_id: number;
  teacher_name: string;
}

interface Grade {
  id: number;
  student_id: number;
  student_name: string;
  class_id: number;
  class_name: string;
  subject_id: number;
  subject_name: string;
  teacher_id: number;
  teacher_name: string;
  grade_value: number;
  grade_date: string;
  comment: string | null;
}

interface Schedule {
  id: number;
  lesson_number: number;
  start_time: string;
  end_time: string;
  class_name: string;
  subject_name: string;
  subject_id: number;
  class_id: number;
}

interface SubjectWithStats {
  id: number;
  subject_id: number;
  subject_name: string;
  teacher_id: number;
  teacher_name: string;
  grade_count: number;
  avg_grade: number | null;
  lesson_count: number;
}

// ============================================================
// STYLES
// ============================================================

const styles = {
  container: {
    minHeight: '100vh',

    padding: '32px',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '8px',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '16px',
    color: '#6B7280',
  },
  refreshButton: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: '12px',
    padding: '10px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    color: '#374151',
    fontSize: '14px',
    fontWeight: '500',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '24px',
    marginTop: '24px',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: '1px solid #F3F4F6',
    cursor: 'pointer',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
  },
  subjectName: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '4px',
  },
  teacherName: {
    fontSize: '13px',
    color: '#6B7280',
    marginTop: '4px',
  },
  iconWrapper: {
    backgroundColor: '#EFF6FF',
    padding: '12px',
    borderRadius: '16px',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginTop: '20px',
    marginBottom: '20px',
  },
  statItem: {
    textAlign: 'center' as const,
    padding: '12px',
    backgroundColor: '#F9FAFB',
    borderRadius: '16px',
    transition: 'all 0.2s ease',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '12px',
    color: '#6B7280',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    marginTop: '4px',
  },
  gradeHigh: {
    color: '#10B981',
  },
  gradeMedium: {
    color: '#F59E0B',
  },
  gradeLow: {
    color: '#EF4444',
  },
  button: {
    width: '100%',
    backgroundColor: '#3B82F6',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '12px',
    padding: '12px',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginTop: '8px',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    border: '1px solid #FEE2E2',
    borderRadius: '16px',
    padding: '32px',
    textAlign: 'center' as const,
    maxWidth: '500px',
    margin: '0 auto',
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '64px',
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    border: '2px dashed #E5E7EB',
  },
};

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function MySubjectsPage() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<SubjectWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      
      // Fetch teacher subjects
      const subjectsRes = await apiClient.get<TeacherSubject[]>('/api/teacher-subjects/me');
      const teacherSubjects = subjectsRes.data || [];
      
      if (teacherSubjects.length === 0) {
        setSubjects([]);
        setLoading(false);
        return;
      }
      
      // Fetch grades from gradeApi (like in TeacherPanelPage)
      let grades: Grade[] = [];
      try {
        const gradesData = await gradeApi.getTeacherGrades();
        grades = Array.isArray(gradesData) ? gradesData : [];
        console.log('📊 Grades loaded:', grades.length);
      } catch (err) {
        console.error('Error loading grades:', err);
        grades = [];
      }
      
      // Fetch schedules for lesson count
      let schedules: Schedule[] = [];
      try {
        const schedulesRes = await apiClient.get<Schedule[]>('/api/schedules/teacher/my');
        schedules = schedulesRes.data || [];
        console.log('📅 Schedules loaded:', schedules.length);
      } catch (err) {
        console.error('Error loading schedules:', err);
        schedules = [];
      }
      
      // Calculate statistics for each subject (using TeacherPanelPage logic)
      const subjectsWithStats: SubjectWithStats[] = teacherSubjects.map((subject) => {
        // Filter grades for this subject by subject_name (like in TeacherPanelPage)
        const subjectGrades = grades.filter((grade) => grade.subject_name === subject.subject_name);
        
        // Calculate grade count
        const gradeCount = subjectGrades.length;
        
        // Calculate average grade
        let avgGrade: number | null = null;
        if (gradeCount > 0) {
          const sum = subjectGrades.reduce((acc, grade) => acc + grade.grade_value, 0);
          avgGrade = sum / gradeCount;
        }
        
        // Calculate lesson count (schedules for this subject)
        const lessonCount = schedules.filter((schedule) => schedule.subject_name === subject.subject_name).length;
        
        console.log(`📚 Subject: ${subject.subject_name}, Grades: ${gradeCount}, Avg: ${avgGrade}, Lessons: ${lessonCount}`);
        
        return {
          id: subject.id,
          subject_id: subject.subject_id,
          subject_name: subject.subject_name,
          teacher_id: subject.teacher_id,
          teacher_name: subject.teacher_name,
          grade_count: gradeCount,
          avg_grade: avgGrade,
          lesson_count: lessonCount,
        };
      });
      
      // Sort subjects by name
      subjectsWithStats.sort((a, b) => a.subject_name.localeCompare(b.subject_name));
      
      setSubjects(subjectsWithStats);
    } catch (err) {
      console.error('Error fetching subjects data:', err);
      setError('Мәліметтерді жүктеу мүмкін болмады. Кейінірек қайталап көріңіз.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
  };

  const handleSubjectClick = (subjectId: number, subjectName: string) => {
    navigate(`/teacher/grades?subject_id=${subjectId}&subject_name=${encodeURIComponent(subjectName)}`);
  };

  const getAvgGradeColor = (avg: number | null) => {
    if (avg === null) return {};
    if (avg >= 8) return styles.gradeHigh;
    if (avg >= 5) return styles.gradeMedium;
    return styles.gradeLow;
  };

  const getAvgGradeDisplay = (avg: number | null) => {
    if (avg === null) return '0';
    return avg.toFixed(1);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.loadingContainer}>
            <Loader size={48} style={{ color: '#3B82F6', animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#6B7280', fontSize: '16px' }}>Жүктелуде...</p>
            <style>{`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.errorContainer}>
            <AlertCircle size={48} style={{ color: '#DC2626', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#991B1B', marginBottom: '8px' }}>
              Қате кетті
            </h3>
            <p style={{ color: '#7F1D1D', marginBottom: '24px' }}>{error}</p>
            <button
              onClick={handleRefresh}
              style={styles.button}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2563EB';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#3B82F6';
              }}
            >
              <RefreshCw size={18} />
              Қайта жүктеу
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (subjects.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.header}>
            <div style={styles.headerLeft}>
              <h1 style={styles.title}>Менің пәндерім</h1>
              <p style={styles.subtitle}>Сізге тағайындалған пәндер тізімі</p>
            </div>
            <button
              onClick={handleRefresh}
              style={styles.refreshButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F9FAFB';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <RefreshCw size={16} />
              Жаңарту
            </button>
          </div>
          <div style={styles.emptyState}>
            <BookOpen size={64} style={{ color: '#D1D5DB', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
              Сізге пән тағайындалмаған
            </h3>
            <p style={{ color: '#6B7280', fontSize: '14px' }}>
              Пәндер мектеп әкімшілігі тарапынан тағайындалады
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <h1 style={styles.title}>Менің пәндерім</h1>
            <p style={styles.subtitle}>Сізге тағайындалған пәндер және статистика</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            style={{
              ...styles.refreshButton,
              opacity: refreshing ? 0.6 : 1,
              cursor: refreshing ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
              if (!refreshing) {
                e.currentTarget.style.backgroundColor = '#F9FAFB';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!refreshing) {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {refreshing ? (
              <>
                <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                Жаңартылуда...
              </>
            ) : (
              <>
                <RefreshCw size={16} />
                Жаңарту
              </>
            )}
          </button>
        </div>

        <div style={styles.statsGrid}>
          {subjects.map((subject) => (
            <div
              key={subject.id}
              style={styles.card}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.02)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)';
              }}
              onClick={() => handleSubjectClick(subject.subject_id, subject.subject_name)}
            >
              <div style={styles.cardHeader}>
                <div>
                  <div style={styles.subjectName}>{subject.subject_name}</div>
                  <div style={styles.teacherName}>Мұғалім: {subject.teacher_name}</div>
                </div>
                <div style={styles.iconWrapper}>
                  <BookOpen size={24} color="#3B82F6" />
                </div>
              </div>

              <div style={styles.statsRow}>
                <div style={styles.statItem}>
                  <div style={styles.statValue}>{subject.grade_count}</div>
                  <div style={styles.statLabel}>
                    <Star size={14} />
                    Баға саны
                  </div>
                </div>
                <div style={styles.statItem}>
                  <div style={{ ...styles.statValue, ...getAvgGradeColor(subject.avg_grade) }}>
                    {getAvgGradeDisplay(subject.avg_grade)}
                  </div>
                  <div style={styles.statLabel}>
                    <TrendingUp size={14} />
                    Орташа балл
                  </div>
                </div>
                <div style={styles.statItem}>
                  <div style={styles.statValue}>{subject.lesson_count}</div>
                  <div style={styles.statLabel}>
                    <Calendar size={14} />
                    Сабақ саны
                  </div>
                </div>
              </div>

              <button
                style={styles.button}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563EB';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#3B82F6';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSubjectClick(subject.subject_id, subject.subject_name);
                }}
              >
                Бағаларға өту
                <ChevronRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}