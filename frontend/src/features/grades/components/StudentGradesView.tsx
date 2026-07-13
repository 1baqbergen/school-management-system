// src/features/grades/components/StudentGradesView.tsx
import { useState, useMemo } from 'react';
import { ChevronDown, TrendingUp, Award, Target, Calendar, MessageSquare, User } from 'lucide-react'; // 🔥 User иконкасын қостық
import type { Grade } from '../types/grade.types';

interface StudentGradesViewProps {
  grades: Grade[];
}

interface SubjectGroup {
  subjectId: number;
  subjectName: string;
  grades: Grade[];
  average: number;
  count: number;
  highest: number;
  lowest: number;
}

const StudentGradesView = ({ grades }: StudentGradesViewProps) => {
  const [expandedSubjects, setExpandedSubjects] = useState<Set<number>>(new Set());

  // Группировка оценок по предметам с вычислением статистики
  const subjectGroups = useMemo(() => {
    const groups: Record<number, SubjectGroup> = {};

    grades.forEach((grade) => {
      const subjectId = grade.subject_id;
      if (!groups[subjectId]) {
        groups[subjectId] = {
          subjectId,
          subjectName: grade.subject_name,
          grades: [],
          average: 0,
          count: 0,
          highest: 0,
          lowest: 10,
        };
      }
      groups[subjectId].grades.push(grade);
      groups[subjectId].count++;
    });

    Object.values(groups).forEach((group) => {
      const values = group.grades.map((g) => g.grade_value);
      const sum = values.reduce((acc, val) => acc + val, 0);
      group.average = sum / group.count;
      group.highest = Math.max(...values);
      group.lowest = Math.min(...values);
      
      group.grades.sort((a, b) => new Date(b.grade_date).getTime() - new Date(a.grade_date).getTime());
    });

    return Object.values(groups).sort((a, b) => a.subjectName.localeCompare(b.subjectName));
  }, [grades]);

  const toggleSubject = (subjectId: number) => {
    setExpandedSubjects((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(subjectId)) {
        newSet.delete(subjectId);
      } else {
        newSet.add(subjectId);
      }
      return newSet;
    });
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 9) return { bg: '#DCFCE7', color: '#166534', border: '#86EFAC' };
    if (grade >= 7) return { bg: '#FEF9C3', color: '#854D0E', border: '#FDE047' };
    if (grade >= 5) return { bg: '#FFEDD5', color: '#9A3412', border: '#FDBA74' };
    return { bg: '#FEE2E2', color: '#991B1B', border: '#FECACA' };
  };

  const getAverageColor = (avg: number) => {
    if (avg >= 8) return '#10B981';
    if (avg >= 6) return '#F59E0B';
    if (avg >= 4) return '#F97316';
    return '#EF4444';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const totalGrades = grades.length;
  const averageGrade = totalGrades > 0
    ? (grades.reduce((sum, g) => sum + g.grade_value, 0) / totalGrades).toFixed(1)
    : '0.0';
  const highestGrade = totalGrades > 0 ? Math.max(...grades.map(g => g.grade_value)) : 0;
  const lowestGrade = totalGrades > 0 ? Math.min(...grades.map(g => g.grade_value)) : 0;

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '28px',
    },
    stats: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '20px',
    },
    statCard: {
      backgroundColor: '#ffffff',
      padding: '20px',
      borderRadius: '20px',
      border: '1px solid #F0F2F5',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
      transition: 'all 0.2s ease',
    },
    statLabel: {
      fontSize: '13px',
      fontWeight: '500',
      color: '#64748B',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    statValue: {
      fontSize: '36px',
      fontWeight: '700',
      color: '#0F172A',
      lineHeight: '1.2',
    },
    statSubtext: {
      fontSize: '12px',
      color: '#94A3B8',
      marginTop: '6px',
    },
    accordionContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '16px',
    },
    subjectCard: {
      backgroundColor: '#ffffff',
      borderRadius: '20px',
      border: '1px solid #E2E8F0',
      overflow: 'hidden',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    },
    subjectHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 24px',
      cursor: 'pointer',
      backgroundColor: '#FFFFFF',
      transition: 'background-color 0.2s ease',
    },
    subjectInfo: {
      flex: 1,
    },
    subjectName: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#0F172A',
      marginBottom: '6px',
    },
    subjectStats: {
      display: 'flex',
      gap: '20px',
      flexWrap: 'wrap' as const,
    },
    subjectStat: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '13px',
      color: '#64748B',
    },
    averageBadge: {
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: '600',
      backgroundColor: '#F1F5F9',
      color: '#475569',
    },
    expandIcon: {
      transition: 'transform 0.3s ease',
      transform: 'rotate(0deg)',
      color: '#94A3B8',
    },
    expandIconOpen: {
      transform: 'rotate(180deg)',
    },
    gradesList: {
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      borderTop: '1px solid #F1F5F9',
      backgroundColor: '#F8FAFC',
    },
    gradesListInner: {
      padding: '20px 24px',
    },
    gradeRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 0',
      borderBottom: '1px solid #E2E8F0',
      transition: 'background-color 0.2s ease',
      gap: '30px',
    },
    gradeRowLast: {
      borderBottom: 'none',
    },
    gradeDate: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      color: '#64748B',
      minWidth: '140px',
    },
    // 🔥 ЖАҢА СТИЛЬ - Мұғалім аты үшін
    gradeTeacher: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      minWidth: '150px',
      fontSize: '13px',
      color: '#475569',
    },
    gradeValue: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '48px',
      padding: '6px 12px',
      borderRadius: '30px',
      fontSize: '16px',
      fontWeight: '700',
    },
    gradeComment: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '13px',
      color: '#64748B',
      flex: 1,
      marginLeft: '20px',
    },
    noGrades: {
      textAlign: 'center' as const,
      padding: '32px',
      color: '#94A3B8',
      fontSize: '14px',
    },
    emptyState: {
      textAlign: 'center' as const,
      padding: '60px',
      backgroundColor: '#ffffff',
      borderRadius: '20px',
      border: '2px dashed #E2E8F0',
    },
    emptyIcon: {
      fontSize: '48px',
      marginBottom: '16px',
    },
    emptyTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '8px',
    },
    emptyText: {
      fontSize: '14px',
      color: '#6B7280',
    },
  };

  if (grades.length === 0) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>📚</div>
        <h3 style={styles.emptyTitle}>Бағалар жоқ</h3>
        <p style={styles.emptyText}>Сізде әлі ешқандай баға жоқ</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Статистика */}
      <div style={styles.stats}>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>
            <TrendingUp size={16} color="#3B82F6" />
            Орташа баға
          </div>
          <div style={styles.statValue}>{averageGrade}</div>
          <div style={styles.statSubtext}>барлық пәндер бойынша</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>
            <Award size={16} color="#10B981" />
            Ең жоғары
          </div>
          <div style={styles.statValue}>{highestGrade}</div>
          <div style={styles.statSubtext}>ең жақсы нәтиже</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>
            <Target size={16} color="#F59E0B" />
            Ең төменгі
          </div>
          <div style={styles.statValue}>{lowestGrade}</div>
          <div style={styles.statSubtext}>жақсарту қажет</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>
            <Calendar size={16} color="#8B5CF6" />
            Жалпы бағалар
          </div>
          <div style={styles.statValue}>{totalGrades}</div>
          <div style={styles.statSubtext}>барлығы</div>
        </div>
      </div>

      {/* Аккордеон список предметов */}
      <div style={styles.accordionContainer}>
        {subjectGroups.map((subject) => {
          const isExpanded = expandedSubjects.has(subject.subjectId);
          const gradeColors = getAverageColor(subject.average);
          
          return (
            <div
              key={subject.subjectId}
              style={styles.subjectCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
              }}
            >
              <div
                style={styles.subjectHeader}
                onClick={() => toggleSubject(subject.subjectId)}
              >
                <div style={styles.subjectInfo}>
                  <div style={styles.subjectName}>{subject.subjectName}</div>
                  <div style={styles.subjectStats}>
                    <span style={styles.subjectStat}>
                      📊 {subject.count} баға
                    </span>
                    <span style={styles.subjectStat}>
                      📈 ең жоғары: {subject.highest}
                    </span>
                    <span style={styles.subjectStat}>
                      📉 ең төменгі: {subject.lowest}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ ...styles.averageBadge, backgroundColor: `${gradeColors}15`, color: gradeColors }}>
                    Ø {subject.average.toFixed(1)}
                  </span>
                  <ChevronDown
                    size={20}
                    style={{
                      ...styles.expandIcon,
                      ...(isExpanded ? styles.expandIconOpen : {}),
                    }}
                  />
                </div>
              </div>

              {/* Раскрывающийся список оценок */}
              <div
                style={{
                  ...styles.gradesList,
                  maxHeight: isExpanded ? `${subject.grades.length * 70 + 40}px` : '0px',
                  padding: isExpanded ? '0' : '0',
                }}
              >
                <div style={styles.gradesListInner}>
                  {subject.grades.map((grade, idx) => {
                    const colors = getGradeColor(grade.grade_value);
                    const isLast = idx === subject.grades.length - 1;
                    
                    return (
                      <div
                        key={grade.id}
                        style={{
                          ...styles.gradeRow,
                          ...(isLast ? styles.gradeRowLast : {}),
                        }}
                      >
                        {/* Уақыт */}
                        <div style={styles.gradeDate}>
                          <Calendar size={14} />
                          {formatDate(grade.grade_date)}
                        </div>
                        
                        {/* 🔥 МҰҒАЛІМ АТЫ - ЖАҢА ҚОСЫЛҒАН БӨЛІК */}
                        <div style={styles.gradeTeacher}>
                          <User size={12} />
                          <span>{grade.teacher_name || '—'}</span>
                        </div>
                        
                        {/* Баға */}
                        <div>
                          <span
                            style={{
                              ...styles.gradeValue,
                              backgroundColor: colors.bg,
                              color: colors.color,
                              border: `1px solid ${colors.border}`,
                            }}
                          >
                            {grade.grade_value}
                          </span>
                        </div>
                        
                        {/* Пікір */}
                        {grade.comment && (
                          <div style={styles.gradeComment}>
                            <MessageSquare size={14} />
                            <span>{grade.comment}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentGradesView;