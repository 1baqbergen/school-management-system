
// src/pages/TeacherPanelPage.tsx
import { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  BookOpen,
  Users,
  Star,
  AlertCircle,
  Clock,
  User,
  GraduationCap,
  TrendingUp,
  ArrowRight,
  ChevronRight,
  Loader,
  RefreshCw,
} from "lucide-react";
import apiClient from "../services/apiClient";
import { userStore } from "../store/userStore";
import { classApi } from "../features/classes/api/classApi";
import { gradeApi } from "../features/grades/api/gradeApi";

// ============================================================
// TYPES
// ============================================================

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

interface MyClass {
  id: number;
  name: string;
  grade: number;
  letter: string;
  students_count: number;
  class_teacher?: string;
  class_teacher_id?: number;
}

interface TeacherSubject {
  id: number;
  subject_id: number;
  subject_name: string;
  teacher_id: number;
  teacher_name: string;
  grade_count?: number;
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
  grade_date: string; // YYYY-MM-DD
  comment: string | null;
}

interface StudentAvg {
  student_id: number;
  student_name: string;
  avg_grade: number;
}

// ============================================================
// STYLES
// ============================================================

const styles = {
  container: {
    minHeight: "100vh",

    padding: "32px",
  },
  content: {
    maxWidth: "1400px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "32px",
  },
  greeting: {
    fontSize: "28px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "16px",
    color: "#6B7280",
  },
  refreshButton: {
    backgroundColor: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: "12px",
    padding: "8px 16px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: "#374151",
    transition: "all 0.2s ease",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
    marginBottom: "32px",
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "24px",
    marginBottom: "32px",
  },
  fullWidth: {
    gridColumn: "1 / -1",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: "20px",
    padding: "24px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    border: "1px solid #F3F4F6",
  },
  cardHover: {
    transform: "translateY(-4px)",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.02)",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  cardIcon: {
    width: "24px",
    height: "24px",
    color: "#3B82F6",
  },
  lessonCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: "16px",
    padding: "16px",
    marginBottom: "12px",
    transition: "all 0.2s ease",
    border: "1px solid #F3F4F6",
  },
  lessonHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  lessonNumber: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#3B82F6",
    backgroundColor: "#EFF6FF",
    padding: "4px 12px",
    borderRadius: "12px",
  },
  lessonTime: {
    fontSize: "14px",
    color: "#6B7280",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  lessonSubject: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "8px",
  },
  lessonClass: {
    fontSize: "14px",
    color: "#6B7280",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  subjectCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: "16px",
    padding: "16px",
    transition: "all 0.2s ease",
    border: "1px solid #F3F4F6",
    cursor: "pointer",
  },
  gradeRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid #F3F4F6",
  },
  gradeValue: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#3B82F6",
  },
  gradeHigh: {
    backgroundColor: "#DCFCE7",
    color: "#166534",
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "600",
  },
  gradeLow: {
    backgroundColor: "#FEE2E2",
    color: "#991B1B",
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#3B82F6",
    color: "#FFFFFF",
    padding: "10px 20px",
    borderRadius: "12px",
    border: "none",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "16px",
  },
  buttonOutline: {
    backgroundColor: "transparent",
    color: "#3B82F6",
    border: "1px solid #3B82F6",
    padding: "10px 20px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
  },
  errorContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    flexDirection: "column" as const,
    gap: "16px",
  },
  emptyState: {
    textAlign: "center" as const,
    padding: "48px",
    color: "#6B7280",
  },
  classInfoCard: {
    background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "20px",
    border: "1px solid #BFDBFE",
  },
  className: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1E40AF",
    marginBottom: "8px",
  },
  classTeacher: {
    fontSize: "14px",
    color: "#3B82F6",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "12px",
  },
  classStats: {
    display: "flex",
    gap: "24px",
    marginTop: "12px",
  },
  classStat: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: "#1E40AF",
  },
};

// ============================================================
// COMPONENTS
// ============================================================

const StatCard = ({ title, value, icon: Icon, color, loading }: any) => (
  <div
    style={styles.card}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-4px)";
      e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.1)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.05)";
    }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <div style={{ fontSize: "14px", color: "#6B7280", marginBottom: "8px" }}>{title}</div>
        <div style={{ fontSize: "32px", fontWeight: "700", color: "#111827" }}>
          {loading ? <Loader style={{ width: "24px", height: "24px", animation: "spin 1s linear infinite" }} /> : value}
        </div>
      </div>
      <div style={{ backgroundColor: color || "#EFF6FF", padding: "12px", borderRadius: "16px" }}>
        <Icon style={{ width: "24px", height: "24px", color: "#3B82F6" }} />
      </div>
    </div>
  </div>
);

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function TeacherPanelPage() {
  const [userName, setUserName] = useState<string>("");
  const [todayLessons, setTodayLessons] = useState<Schedule[]>([]);
  const [myClass, setMyClass] = useState<MyClass | null>(null);
  const [mySubjects, setMySubjects] = useState<TeacherSubject[]>([]);
  const [allGrades, setAllGrades] = useState<Grade[]>([]);
  const [recentGrades, setRecentGrades] = useState<Grade[]>([]);
  const [weakStudents, setWeakStudents] = useState<StudentAvg[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const user = userStore((state) => state.user);
  

  // Get current user name
  useEffect(() => {
    if (user?.full_name) {
      setUserName(user.full_name);
    } else {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const userData = JSON.parse(userStr);
          setUserName(userData.full_name || userData.name || "Учитель");
        } catch {
          setUserName("Учитель");
        }
      }
    }
  }, [user]);

  // Get current day of week
  const getCurrentDay = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = new Date().getDay();
    return days[today];
  };

  // Fetch all dashboard data
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const currentDay = getCurrentDay();
      
      // Fetch data in parallel
      const [lessonsRes, classRes, subjectsRes, gradesRes] = await Promise.all([
        apiClient.get<Schedule[]>(`/api/schedules/teacher/my?day=${currentDay}`),
        classApi.getTeacherClasses(),
        apiClient.get<TeacherSubject[]>('/api/teacher-subjects/me'),
        gradeApi.getTeacherGrades(),
      ]);

      const lessons = lessonsRes.data || [];
      const teacherClasses = classRes || [];
      const subjects = subjectsRes.data || [];
      const grades = gradesRes || [];

      // Get the teacher's class (first one)
      const teacherClass = teacherClasses.length > 0 ? teacherClasses[0] : null;
      console.log("subjects:", subjects);
console.log("grades:", grades);
      
      // Set my class with students count
      if (teacherClass) {
        // Fetch students to get accurate count
        try {
          const studentsData = await classApi.getClassStudents(teacherClass.id);
          setMyClass({
            id: teacherClass.id,
            name: teacherClass.name,
            grade: teacherClass.grade,
            letter: teacherClass.letter,
            students_count: studentsData.length,
            class_teacher: user?.full_name || "Мен",
            class_teacher_id: teacherClass.class_teacher_id ?? undefined,
          });
        } catch (err) {
          console.error('Error fetching students count:', err);
          setMyClass({
            id: teacherClass.id,
            name: teacherClass.name,
            grade: teacherClass.grade,
            letter: teacherClass.letter,
            students_count: teacherClass.students_count || 0,
            class_teacher: user?.full_name || "Мен",
          });
        }
      } else {
        setMyClass(null);
      }

      // Sort lessons by lesson number
      lessons.sort((a: Schedule, b: Schedule) => a.lesson_number - b.lesson_number);
      
      // Calculate grade counts per subject
      const gradeCountMap = new Map<number, number>();
      grades.forEach((grade: Grade) => {
        gradeCountMap.set(grade.subject_id, (gradeCountMap.get(grade.subject_id) || 0) + 1);
      });
      
      // Add grade count to subjects
      const subjectsWithCount = subjects.map((subject) => ({
  ...subject,
  grade_count: grades.filter(
    (g) => g.subject_name === subject.subject_name
  ).length,
}));
      
      // Calculate weak students (avg grade < 5)
      const studentGradesMap = new Map<number, { name: string; total: number; count: number }>();
      
      grades.forEach((grade: Grade) => {
        if (!studentGradesMap.has(grade.student_id)) {
          studentGradesMap.set(grade.student_id, {
            name: grade.student_name,
            total: 0,
            count: 0,
          });
        }
        const student = studentGradesMap.get(grade.student_id)!;
        student.total += grade.grade_value;
        student.count += 1;
      });

      const weak: StudentAvg[] = [];
      studentGradesMap.forEach((student, id) => {
        const avg = student.total / student.count;
        if (avg < 5) {
          weak.push({
            student_id: id,
            student_name: student.name,
            avg_grade: avg,
          });
        }
      });
      
      // Sort weak students by avg grade ascending
      weak.sort((a, b) => a.avg_grade - b.avg_grade);
      
      // Get recent grades (last 5)
      const sortedGrades = [...grades].sort((a, b) => 
        new Date(b.grade_date).getTime() - new Date(a.grade_date).getTime()
      );
      
      setTodayLessons(lessons);
      setMySubjects(subjectsWithCount);
      setAllGrades(grades);
      setRecentGrades(sortedGrades.slice(0, 5));
      setWeakStudents(weak);
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Мәліметтерді жүктеу мүмкін болмады');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
  };

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  
  const getGradeColor = (grade: number) => {
    if (grade >= 8) return styles.gradeHigh;
    if (grade < 5) return styles.gradeLow;
    return { backgroundColor: "#FEF3C7", color: "#92400E", padding: "4px 12px", borderRadius: "12px", fontSize: "14px", fontWeight: "600" };
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={{ textAlign: "center" }}>
          <Loader style={{ width: "48px", height: "48px", color: "#3B82F6", animation: "spin 1s linear infinite" }} />
          <p style={{ marginTop: "16px", color: "#6B7280" }}>Жүктелуде...</p>
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={{ backgroundColor: "#FEE2E2", padding: "20px", borderRadius: "16px", textAlign: "center", maxWidth: "400px" }}>
          <AlertCircle style={{ width: "48px", height: "48px", color: "#DC2626", marginBottom: "16px" }} />
          <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#991B1B", marginBottom: "8px" }}>Қате кетті</h3>
          <p style={{ color: "#7F1D1D", marginBottom: "16px" }}>{error}</p>
          <button
            onClick={handleRefresh}
            style={styles.button}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#2563EB"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#3B82F6"; }}
          >
            Қайта жүктеу
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Header with refresh button */}
        <div style={{ ...styles.header, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={styles.greeting}>Қош келдіңіз, {userName}!</h1>
            <p style={styles.subtitle}>Білім беру процесінің басқару панелі</p>
          </div>
          <button
            style={styles.refreshButton}
            onClick={handleRefresh}
            disabled={refreshing}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#F3F4F6"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#FFFFFF"; }}
          >
            <RefreshCw style={{ width: "16px", height: "16px", animation: refreshing ? "spin 1s linear infinite" : "none" }} />
            Жаңарту
          </button>
        </div>

        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          <StatCard title="Бүгінгі сабақтар" value={todayLessons.length} icon={Calendar} loading={loading} />
          <StatCard title="Менің пәндерім" value={mySubjects.length} icon={BookOpen} loading={loading} />
          <StatCard title="Сыныптағы оқушылар" value={myClass?.students_count || 0} icon={Users} loading={loading} />
          <StatCard title="Барлық бағалар" value={allGrades.length} icon={Star} loading={loading} />
        </div>

        {/* My Class Info - New styled block */}
        {myClass && (
          <div style={styles.classInfoCard}>
            <div style={styles.className}>{myClass.name} сыныбы</div>
            <div style={styles.classTeacher}>
              <User style={{ width: "16px", height: "16px" }} />
              Сынып жетекшісі: {myClass.class_teacher || userName}
            </div>
            <div style={styles.classStats}>
              <div style={styles.classStat}>
                <Users style={{ width: "16px", height: "16px" }} />
                Оқушылар саны: {myClass.students_count}
              </div>
              <div style={styles.classStat}>
                <Star style={{ width: "16px", height: "16px" }} />
                Барлық бағалар: {allGrades.length}
              </div>
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div style={styles.mainGrid}>
          {/* Today's Lessons */}
          <div
            style={styles.card}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.05)"; }}
          >
            <div style={styles.cardTitle}>
              <Calendar style={styles.cardIcon} />
              <span>Бүгінгі сабақтар</span>
            </div>
            {todayLessons.length === 0 ? (
              <div style={styles.emptyState}>
                <Clock style={{ width: "48px", height: "48px", marginBottom: "16px", opacity: 0.5 }} />
                <p>Бүгін сабақ жоқ</p>
              </div>
            ) : (
              todayLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  style={styles.lessonCard}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#FFFFFF"; e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#F9FAFB"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={styles.lessonHeader}>
                    <span style={styles.lessonNumber}>{lesson.lesson_number}-сабақ</span>
                    <span style={styles.lessonTime}>
                      <Clock style={{ width: "14px", height: "14px" }} />
                      {lesson.start_time} - {lesson.end_time}
                    </span>
                  </div>
                  <div style={styles.lessonSubject}>{lesson.subject_name}</div>
                  <div style={styles.lessonClass}>
                    <GraduationCap style={{ width: "14px", height: "14px" }} />
                    {lesson.class_name}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* My Subjects */}
          <div
            style={styles.card}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.05)"; }}
          >
            <div style={styles.cardTitle}>
              <BookOpen style={styles.cardIcon} />
              <span>Менің пәндерім</span>
            </div>
            {mySubjects.length === 0 ? (
              <div style={styles.emptyState}>Сізге пән тағайындалмаған</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {mySubjects.map((subject) => (
                  <div
                    key={subject.id}
                    style={styles.subjectCard}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#FFFFFF"; e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#F9FAFB"; e.currentTarget.style.boxShadow = "none"; }}
                    onClick={() => window.location.href = "/teacher/subjects"}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: "16px", fontWeight: "600", color: "#111827", marginBottom: "4px" }}>{subject.subject_name}</div>
                        <div style={{ fontSize: "13px", color: "#6B7280" }}>
                          <Star style={{ width: "12px", height: "12px", display: "inline", marginRight: "4px" }} />
                          Бағалар саны: {subject.grade_count || 0}
                        </div>
                      </div>
                      <TrendingUp style={{ width: "20px", height: "20px", color: "#3B82F6" }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Grades */}
          <div
            style={styles.card}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.05)"; }}
          >
            <div style={styles.cardTitle}>
              <Star style={styles.cardIcon} />
              <span>Соңғы бағалар</span>
            </div>
            {recentGrades.length === 0 ? (
              <div style={styles.emptyState}>Соңғы бағалар жоқ</div>
            ) : (
              recentGrades.map((grade, index) => (
                <div key={index} style={styles.gradeRow}>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: "500", color: "#111827", marginBottom: "4px" }}>{grade.student_name}</div>
                    <div style={{ fontSize: "12px", color: "#6B7280" }}>{grade.subject_name}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={getGradeColor(grade.grade_value)}>
                      {grade.grade_value}
                    </div>
                    <div style={{ fontSize: "12px", color: "#6B7280" }}>
                      {new Date(grade.grade_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            )}
            <button
              style={styles.buttonOutline}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#EFF6FF"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
              onClick={() => window.location.href = "/teacher/grades"}
            >
              Барлық бағаларды көру <ChevronRight style={{ width: "16px", height: "16px" }} />
            </button>
          </div>

          {/* Class Actions */}
          <div
            style={styles.card}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.05)"; }}
          >
            <div style={styles.cardTitle}>
              <Users style={styles.cardIcon} />
              <span>Сыныппен жұмыс</span>
            </div>
            {myClass ? (
              <>
                <div style={{ fontSize: "14px", color: "#6B7280", marginBottom: "24px" }}>
                  Сіз {myClass.name} сыныбының жетекшісісіз. Оқушылардың үлгерімін бақылаңыз және баға қойыңыз.
                </div>
                <div style={{ display: "flex", gap: "12px", flexDirection: "column" }}>
                  <button
                    style={styles.button}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#2563EB"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#3B82F6"; }}
                    onClick={() => window.location.href = "/teacher/students"}
                  >
                    Оқушылар тізімі <ArrowRight style={{ width: "16px", height: "16px" }} />
                  </button>
                  <button
                    style={styles.buttonOutline}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#EFF6FF"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                    onClick={() => window.location.href = "/teacher/grades"}
                  >
                    Баға қою <ChevronRight style={{ width: "16px", height: "16px" }} />
                  </button>
                </div>
              </>
            ) : (
              <div style={styles.emptyState}>Сізге сынып тағайындалмаған</div>
            )}
          </div>
        </div>

        {/* Weak Students Section */}
        {weakStudents.length > 0 && (
          <div
            style={{ ...styles.card, ...styles.fullWidth }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.05)"; }}
          >
            <div style={styles.cardTitle}>
              <AlertCircle style={styles.cardIcon} />
              <span>Назар аудару қажет оқушылар</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
              {weakStudents.map((student) => (
                <div
                  key={student.student_id}
                  style={{ ...styles.subjectCard, display: "flex", justifyContent: "space-between", alignItems: "center" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#FFFFFF"; e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#F9FAFB"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div>
                    <div style={{ fontSize: "16px", fontWeight: "600", color: "#111827", marginBottom: "4px" }}>{student.student_name}</div>
                    <div style={{ fontSize: "13px", color: "#6B7280" }}>Орташа балл</div>
                  </div>
                  <div style={{ ...styles.gradeLow, fontSize: "18px", padding: "8px 16px" }}>
                    {student.avg_grade.toFixed(1)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}