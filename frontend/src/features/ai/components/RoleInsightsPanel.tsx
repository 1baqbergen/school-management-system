// src/features/ai/components/RoleInsightsPanel.tsx
import { Calendar, TrendingUp, Award, Users, AlertCircle } from 'lucide-react';
import type { Grade } from '../../grades/types/grade.types';
import type { ParentChild } from '../types/ai.types';

interface RoleInsightsPanelProps {
  userRole: string;
  stats?: any;
  todayLessons?: any[];
  myClass?: any;
  subjects?: any[];
  recentGrades?: Grade[];
  children?: ParentChild[];
}

const RoleInsightsPanel = ({ userRole, stats, todayLessons, myClass, subjects, recentGrades = [], children = [], }: RoleInsightsPanelProps) => {
  const styles = {
    container: {
      backgroundColor: '#FFFFFF',
      borderRadius: '20px',
      padding: '20px',
      border: '1px solid #F0F2F5',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
    },
    title: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#0F172A',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '12px',
    },
    insightCard: {
      padding: '12px',
      backgroundColor: '#F8FAFC',
      borderRadius: '12px',
      transition: 'all 0.2s ease',
    },
    insightValue: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#0F172A',
      marginBottom: '4px',
    },
    insightLabel: {
      fontSize: '12px',
      color: '#64748B',
    },
    lessonItem: {
      padding: '8px 0',
      borderBottom: '1px solid #F0F2F5',
      fontSize: '13px',
      color: '#334155',
    },
    childBlock: {
      padding: '16px',
      backgroundColor: '#F8FAFC',
      borderRadius: '12px',
      marginBottom: '12px',
    },
    childName: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#0F172A',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    weakSubject: {
      padding: '4px 8px',
      backgroundColor: '#FEF3C7',
      borderRadius: '8px',
      fontSize: '11px',
      color: '#D97706',
      display: 'inline-block',
      marginRight: '6px',
      marginTop: '6px',
    },
    recentGradeItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '6px 0',
      borderBottom: '1px solid #E5E7EB',
      fontSize: '12px',
    },
    gradeValue: {
      fontWeight: '600',
      padding: '2px 6px',
      borderRadius: '6px',
      backgroundColor: '#EFF6FF',
      color: '#3B82F6',
    },
  };

  if (userRole === 'admin' && stats) {
    return (
      <div style={styles.container}>
        <div style={styles.title}>
          <TrendingUp size={18} color="#3B82F6" />
          <span>Мектеп талдауы</span>
        </div>
        <div style={styles.grid}>
          <div style={styles.insightCard}>
            <div style={styles.insightValue}>{stats.students}</div>
            <div style={styles.insightLabel}>Оқушылар</div>
          </div>
          <div style={styles.insightCard}>
            <div style={styles.insightValue}>{stats.teachers}</div>
            <div style={styles.insightLabel}>Мұғалімдер</div>
          </div>
          <div style={styles.insightCard}>
            <div style={styles.insightValue}>{stats.classes}</div>
            <div style={styles.insightLabel}>Сыныптар</div>
          </div>
          <div style={styles.insightCard}>
            <div style={styles.insightValue}>{stats.avgGrade}</div>
            <div style={styles.insightLabel}>Орташа балл</div>
          </div>
        </div>
      </div>
    );
  }

  if (userRole === 'teacher') {
    return (
      <div style={styles.container}>
        <div style={styles.title}>
          <Calendar size={18} color="#3B82F6" />
          <span>Менің панелім</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {myClass && (
            <div style={styles.insightCard}>
              <div style={styles.insightValue}>{myClass.name}</div>
              <div style={styles.insightLabel}>Сынып</div>
              <div style={{ fontSize: '13px', marginTop: '4px' }}>
                Оқушылар: {myClass.students_count}
              </div>
            </div>
          )}
          {subjects && subjects.length > 0 && (
            <div style={styles.insightCard}>
              <div style={styles.insightValue}>{subjects.length}</div>
              <div style={styles.insightLabel}>Пәндер</div>
            </div>
          )}
          {todayLessons && todayLessons.length > 0 && (
            <div>
              <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Бүгін:</div>
              {todayLessons.slice(0, 2).map((lesson, idx) => (
                <div key={idx} style={styles.lessonItem}>
                  {lesson.subject_name} ({lesson.start_time})
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (userRole === 'student') {
    return (
      <div style={styles.container}>
        <div style={styles.title}>
          <Award size={18} color="#3B82F6" />
          <span>Менің үлгерімім</span>
        </div>
        <div style={styles.grid}>
          {recentGrades && recentGrades.length > 0 && (
            <>
              <div style={styles.insightCard}>
                <div style={styles.insightValue}>
                  {(recentGrades.reduce((sum, g) => sum + g.grade_value, 0) / recentGrades.length).toFixed(1)}
                </div>
                <div style={styles.insightLabel}>Орташа балл</div>
              </div>
              <div style={styles.insightCard}>
                <div style={styles.insightValue}>{recentGrades.length}</div>
                <div style={styles.insightLabel}>Бағалау</div>
              </div>
            </>
          )}
          {todayLessons && todayLessons.length > 0 && (
            <div style={{ gridColumn: 'span 2' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Cабақтар: {todayLessons.length}</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (userRole === 'parent') {
    const getWeakSubjects = (grades: Grade[]) => {
      const subjectGrades: Record<string, number[]> = {};
      grades.forEach(grade => {
        if (!subjectGrades[grade.subject_name]) {
          subjectGrades[grade.subject_name] = [];
        }
        subjectGrades[grade.subject_name].push(grade.grade_value);
      });
      
      const averages = Object.entries(subjectGrades).map(([subject, values]) => ({
        subject,
        avg: values.reduce((a, b) => a + b, 0) / values.length
      }));
      
      return averages.filter(item => item.avg < 3.5).map(item => item.subject);
    };

    const getAvgGrade = (grades: Grade[]) => {
      if (!grades.length) return 0;
      return (grades.reduce((sum, g) => sum + g.grade_value, 0) / grades.length).toFixed(1);
    };

    return (
      <div style={styles.container}>
        <div style={styles.title}>
          <Users size={18} color="#3B82F6" />
          <span>Менің балаларым</span>
        </div>
        
        <div style={styles.insightCard}>
          <div style={styles.insightValue}>{children.length}</div>
          <div style={styles.insightLabel}>Балалар саны</div>
        </div>

        {children.map((child, idx) => {
          const weakSubjects = getWeakSubjects(child.grades);
          const avgGrade = getAvgGrade(child.grades);
          const lastGrades = [...child.grades]
            .sort((a, b) => new Date(b.grade_date).getTime() - new Date(a.grade_date).getTime())
            .slice(0, 3);

          return (
            <div key={idx} style={styles.childBlock}>
              <div style={styles.childName}>
                <Award size={16} color="#3B82F6" />
                <span>{child.profile?.full_name || child.profile?.name || 'Бала'}</span>
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '4px' }}>Орташа баға</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: '#0F172A' }}>{avgGrade}</div>
              </div>

              {weakSubjects.length > 0 && (
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertCircle size={12} color="#D97706" />
                    <span>Әлсіз пәндер</span>
                  </div>
                  {weakSubjects.map((subject, i) => (
                    <span key={i} style={styles.weakSubject}>{subject}</span>
                  ))}
                </div>
              )}

              {lastGrades.length > 0 && (
                <div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '6px' }}>Соңғы бағалар</div>
                  {lastGrades.map((grade, i) => (
                    <div key={i} style={styles.recentGradeItem}>
                      <span>{grade.subject_name}</span>
                      <span style={styles.gradeValue}>{grade.grade_value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {children.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px', color: '#9CA3AF' }}>
            Мәліметтер жоқ
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default RoleInsightsPanel;