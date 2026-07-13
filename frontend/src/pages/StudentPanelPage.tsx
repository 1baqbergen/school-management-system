// src/pages/StudentPanelPage.tsx
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
  ChevronRight,
  Loader,
  RefreshCw,
  Award,
  Target,
} from "lucide-react";

import apiClient from "../services/apiClient";
import { userStore } from "../store/userStore";
import { gradeApi } from "../features/grades/api/gradeApi";
import { classApi } from "../features/classes/api/classApi";

// ============================================================
// TYPES
// ============================================================

interface Schedule {
  id: number;
  lesson_number: number;
  start_time: string;
  end_time: string;
  class_name: string;
  class_id: number;
  subject_name: string;
  subject_id: number;
  teacher_name: string;
  teacher_id: number;
  day_of_week: string;
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

interface SubjectPerformance {
  subject_id: number;
  subject_name: string;
  average: number;
  count: number;
  highest: number;
  lowest: number;
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
  lessonTeacher: {
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
  },
  gradeRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid #F3F4F6",
  },
  gradeRowLast: {
    borderBottom: "none",
  },
  gradeHigh: {
    backgroundColor: "#DCFCE7",
    color: "#166534",
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "600",
  },
  gradeMedium: {
    backgroundColor: "#FEF3C7",
    color: "#92400E",
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
    width: "100%",
    justifyContent: "center",
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
  performanceCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: "16px",
    padding: "16px",
    marginBottom: "12px",
    transition: "all 0.2s ease",
    border: "1px solid #F3F4F6",
  },
  performanceHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  performanceStats: {
    display: "flex",
    gap: "16px",
    marginTop: "8px",
  },
  performanceStat: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "13px",
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

export default function StudentPanelPage() {
  const [userName, setUserName] = useState<string>("");
  const [todayLessons, setTodayLessons] = useState<Schedule[]>([]);
  const [allGrades, setAllGrades] = useState<Grade[]>([]);
  const [recentGrades, setRecentGrades] = useState<Grade[]>([]);
  const [subjectPerformances, setSubjectPerformances] = useState<SubjectPerformance[]>([]);
  const [myClass, setMyClass] = useState<MyClass | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const user = userStore((state) => state.user);
  const studentId = Number(user?.student_id || user?.id);

  // Get current user name
  useEffect(() => {
    if (user?.full_name) {
      setUserName(user.full_name);
    } else {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const userData = JSON.parse(userStr);
          setUserName(userData.full_name || userData.name || "Студент");
        } catch {
          setUserName("Студент");
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
    if (!studentId) {
      console.error("Student ID not found");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const currentDay = getCurrentDay();
      
      // Fetch data in parallel
      const [schedulesRes, gradesRes] = await Promise.all([
        apiClient.get<Schedule[]>(`/api/schedules/student/my?day=${currentDay}`),
        gradeApi.getByStudentId(studentId),
      ]);

      const schedules = Array.isArray(schedulesRes.data)
  ? schedulesRes.data
  : [];
      const grades = gradesRes || [];

      // Sort lessons by lesson number
      schedules.sort((a, b) => a.lesson_number - b.lesson_number);
      
      // Calculate subject performances
      const subjectMap = new Map<number, { 
        name: string; 
        total: number; 
        count: number; 
        highest: number; 
        lowest: number;
      }>();
      
      grades.forEach((grade) => {
        if (!subjectMap.has(grade.subject_id)) {
          subjectMap.set(grade.subject_id, {
            name: grade.subject_name,
            total: 0,
            count: 0,
            highest: 0,
            lowest: 10,
          });
        }
        const subject = subjectMap.get(grade.subject_id)!;
        subject.total += grade.grade_value;
        subject.count += 1;
        subject.highest = Math.max(subject.highest, grade.grade_value);
        subject.lowest = Math.min(subject.lowest, grade.grade_value);
      });
      
      const performances: SubjectPerformance[] = [];
      subjectMap.forEach((subject, id) => {
        performances.push({
          subject_id: id,
          subject_name: subject.name,
          average: subject.total / subject.count,
          count: subject.count,
          highest: subject.highest,
          lowest: subject.lowest,
        });
      });
      
      // Sort by subject name
      performances.sort((a, b) => a.subject_name.localeCompare(b.subject_name));
      
      // Get recent grades (last 5)
      const sortedGrades = [...grades].sort((a, b) => 
        new Date(b.grade_date).getTime() - new Date(a.grade_date).getTime()
      );
      
      // Get student's class
      let classData: MyClass | null = null;
      if (grades.length > 0 && grades[0].class_id) {
        try {
          const classInfo = await classApi.getById(grades[0].class_id);
          if (classInfo) {
            classData = {
              id: classInfo.id,
              name: classInfo.name,
              grade: classInfo.grade,
              letter: classInfo.letter,
              students_count: classInfo.students_count || 0,
              class_teacher: classInfo.class_teacher || undefined,
            };
          }
        } catch (err) {
          console.error("Error fetching class info:", err);
        }
      }
      
      setTodayLessons(schedules);
      setAllGrades(grades);
      setRecentGrades(sortedGrades.slice(0, 5));
      setSubjectPerformances(performances);
      setMyClass(classData);
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Мәліметтерді жүктеу мүмкін болмады');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [studentId]);

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
  };

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Calculate statistics
  const totalGrades = allGrades.length;
  const averageGrade = totalGrades > 0
    ? (allGrades.reduce((sum, g) => sum + g.grade_value, 0) / totalGrades).toFixed(1)
    : "0.0";
  const highestGrade = totalGrades > 0 ? Math.max(...allGrades.map(g => g.grade_value)) : 0;
  const lowestGrade = totalGrades > 0 ? Math.min(...allGrades.map(g => g.grade_value)) : 0;
  const uniqueSubjects = subjectPerformances.length;

  const getGradeStyle = (grade: number) => {
    if (grade >= 9) return styles.gradeHigh;
    if (grade >= 7) return styles.gradeMedium;
    if (grade >= 5) return { backgroundColor: "#FFEDD5", color: "#9A3412", padding: "4px 12px", borderRadius: "12px", fontSize: "14px", fontWeight: "600" };
    return styles.gradeLow;
  };

  const getAverageColor = (avg: number) => {
    if (avg >= 8) return "#10B981";
    if (avg >= 6) return "#F59E0B";
    if (avg >= 4) return "#F97316";
    return "#EF4444";
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "short",
    });
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
            <p style={styles.subtitle}>Сіздің білім порталыңыз</p>
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

        {/* My Class Info */}
        {myClass && (
          <div style={styles.classInfoCard}>
            <div style={styles.className}>{myClass.name} сыныбы</div>
            {myClass.class_teacher && (
              <div style={styles.classTeacher}>
                <User style={{ width: "16px", height: "16px" }} />
                Сынып жетекшісі: {myClass.class_teacher}
              </div>
            )}
            <div style={styles.classStats}>
              <div style={styles.classStat}>
                <Users style={{ width: "16px", height: "16px" }} />
                Оқушылар саны: {myClass.students_count}
              </div>
              <div style={styles.classStat}>
                <GraduationCap style={{ width: "16px", height: "16px" }} />
                {myClass.name}
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          <StatCard title="Бүгінгі сабақтар" value={todayLessons.length} icon={Calendar} loading={loading} />
          <StatCard title="Пәндер саны" value={uniqueSubjects} icon={BookOpen} loading={loading} />
          <StatCard title="Барлық бағалар" value={totalGrades} icon={Star} loading={loading} />
          <StatCard title="Орташа балл" value={averageGrade} icon={TrendingUp} loading={loading} />
        </div>

        {/* Main Grid */}
        <div style={styles.mainGrid}>
          {/* Today's Schedule */}
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
                  <div style={styles.lessonTeacher}>
                    <User style={{ width: "14px", height: "14px" }} />
                    {lesson.teacher_name}
                  </div>
                </div>
              ))
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
      <div key={grade.id} style={{ ...styles.gradeRow, ...(index === recentGrades.length - 1 ? styles.gradeRowLast : {}) }}>
        <div>
          {/* Пән атауы */}
          <div style={{ fontSize: "14px", fontWeight: "500", color: "#111827", marginBottom: "4px" }}>{grade.subject_name}</div>
          {/* Мұғалімнің аты (бұрынғы уақыттың орнына) */}
          <div style={{ fontSize: "12px", color: "#6B7280", display: "flex", alignItems: "center", gap: "4px" }}>
            <User size={12} />
            {grade.teacher_name}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          {/* Баға */}
          <div style={getGradeStyle(grade.grade_value)}>
            {grade.grade_value}
          </div>
          {/* Баға қойылған уақыт (бұрынғы пікірдің орнына) */}
          <div style={{ fontSize: "11px", color: "#6B7280", minWidth: "60px", textAlign: "right" }}>
            {formatDate(grade.grade_date)}
          </div>
        </div>
      </div>
    ))
  )}
  <button
    style={styles.buttonOutline}
    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#EFF6FF"; }}
    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
    onClick={() => window.location.href = "/student/grades"}
  >
    Барлық бағаларды көру <ChevronRight style={{ width: "16px", height: "16px" }} />
  </button>
</div>

          {/* Performance by Subject */}
          <div
            style={{ ...styles.card, ...styles.fullWidth }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.05)"; }}
          >
            <div style={styles.cardTitle}>
              <TrendingUp style={styles.cardIcon} />
              <span>Пәндер бойынша үлгерім</span>
            </div>
            {subjectPerformances.length === 0 ? (
              <div style={styles.emptyState}>Пәндер бойынша деректер жоқ</div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
                {subjectPerformances.map((subject) => (
                  <div
                    key={subject.subject_id}
                    style={styles.performanceCard}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#FFFFFF"; e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#F9FAFB"; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    <div style={styles.performanceHeader}>
                      <div style={{ fontSize: "16px", fontWeight: "600", color: "#111827" }}>{subject.subject_name}</div>
                      <div style={{ 
                        fontSize: "20px", 
                        fontWeight: "700", 
                        color: getAverageColor(subject.average),
                        backgroundColor: `${getAverageColor(subject.average)}15`,
                        padding: "4px 12px",
                        borderRadius: "20px",
                      }}>
                        {subject.average.toFixed(1)}
                      </div>
                    </div>
                    <div style={styles.performanceStats}>
                      <div style={styles.performanceStat}>
                        <Star style={{ width: "14px", height: "14px" }} />
                        {subject.count} баға
                      </div>
                      <div style={styles.performanceStat}>
                        <Award style={{ width: "14px", height: "14px" }} />
                        Ең жоғары: {subject.highest}
                      </div>
                      <div style={styles.performanceStat}>
                        <Target style={{ width: "14px", height: "14px" }} />
                        Ең төменгі: {subject.lowest}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Additional Stats Row */}
        <div style={styles.statsGrid}>
          <StatCard title="Ең жоғары балл" value={highestGrade} icon={Award} color="#DCFCE7" loading={loading} />
          <StatCard title="Ең төменгі балл" value={lowestGrade} icon={Target} color="#FEE2E2" loading={loading} />
        </div>
      </div>
    </div>
  );
}