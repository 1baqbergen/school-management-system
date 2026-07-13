// src/pages/AIPage/AIPage.tsx
import { useState, useEffect } from 'react';
import { userStore } from '../../store/userStore';
import { gradeApi } from '../../features/grades/api/gradeApi';
import { classApi } from '../../features/classes/api/classApi';
import apiClient from '../../services/apiClient';
import AIChat from '../../features/ai/components/AIChat';
import RoleInsightsPanel from '../../features/ai/components/RoleInsightsPanel';
import type { ParentChild } from '../../features/ai/types/ai.types';

const AIPage = () => {
  const [stats, setStats] = useState<any>(null);
  const [todayLessons, setTodayLessons] = useState<any[]>([]);
  const [myClass, setMyClass] = useState<any>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [recentGrades, setRecentGrades] = useState<any[]>([]);
  const [children, setChildren] = useState<ParentChild[]>([]);
  const [loading, setLoading] = useState(true);

  const user = userStore((state) => state.user);
  const userRole = (user?.role || '').toLowerCase();
  const studentId = (user as any)?.student_id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userRole === 'admin') {
          const statsRes = await apiClient.get(`/api/dashboard/stats`);
          setStats(statsRes);
        } else if (userRole === 'teacher') {
          const currentDay = new Date().toLocaleDateString('en-US', {
          weekday: 'long',
        });
          const [lessonsRes, classesRes, subjectsRes] = await Promise.all([
            apiClient.get(`/api/schedules/teacher/my?day=${currentDay}`),
            classApi.getTeacherClasses(),
            apiClient.get('/api/teacher-subjects/me'),
          ]);
          setTodayLessons(lessonsRes.data || []);
          setMyClass(classesRes?.[0] || null);
          setSubjects(subjectsRes.data || []);
        } else if (userRole === 'student' && studentId) {
          const currentDay = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
          });
          const [lessonsRes, gradesRes] = await Promise.all([
            apiClient.get(`/api/schedules/student/my?day=${currentDay}`), 
            gradeApi.getByStudentId(studentId),
          ]);
          setTodayLessons(lessonsRes.data || []);
          const sortedGrades = [...(gradesRes || [])].sort(
            (a, b) => new Date(b.grade_date).getTime() - new Date(a.grade_date).getTime()
          );
          setRecentGrades(sortedGrades);
        } else if (userRole === 'parent') {
          const childrenRes = await apiClient.get('/api/parents/my-children');
          const childrenIds = childrenRes.data || [];
          
          const childrenData = await Promise.all(
            childrenIds.map(async (child: any) => {
              const studentIdNum = child.id;
              const grades = await apiClient.get(`/api/parents/child/${studentIdNum}/grades`);
              return {
                profile: child,
                grades: grades.data || [],
              };
            })
          );
          setChildren(childrenData);
        }
      } catch (err) {
        console.error('Error fetching AI page data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userRole, studentId]);

  const styles = {
    container: {
      minHeight: '100vh',

      padding: '32px',
    },
    content: {
      maxWidth: '1400px',
      margin: '0 auto',
    },
    header: {
      marginBottom: '32px',
    },
    title: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#0F172A',
      marginBottom: '8px',
      background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    subtitle: {
      fontSize: '16px',
      color: '#64748B',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1.5fr',
      gap: '24px',
    },
    loading: {
      textAlign: 'center' as const,
      padding: '48px',
      color: '#64748B',
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.loading}>Деректер жүктелуде...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>AI Көмекші</h1>
          <p style={styles.subtitle}>
            Мектеп туралы сұрақ қойыңыз-интеллектуалды талдау мен ұсыныстар алыңыз
          </p>
        </div>

        <div style={styles.grid}>
          <RoleInsightsPanel
            userRole={userRole}
            stats={stats}
            todayLessons={todayLessons}
            myClass={myClass}
            subjects={subjects}
            recentGrades={recentGrades}
            children={children}
          />
          
          <AIChat disabled={loading} />
        </div>
      </div>
    </div>
  );
};

export default AIPage;