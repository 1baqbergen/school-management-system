// src/features/parent/components/ChildGradesView.tsx
import type { Grade } from '../types/parent.types';
import { Star, TrendingUp, Award, Calendar, User, MessageSquare, BookOpen } from 'lucide-react';
import { useState } from 'react';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  statCard: (bgColor: string) => ({
    background: bgColor,
    borderRadius: '20px',
    padding: '20px',
    color: '#FFFFFF',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
  }),
  statLabel: {
    fontSize: '13px',
    opacity: 0.8,
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '700',
    lineHeight: 1.2,
  },
  distributionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    padding: '20px',
    border: '1px solid #F0F2F5',
  },
  distributionTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  distributionBar: {
    display: 'flex',
    height: '8px',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '16px',
  },
  distributionLegend: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '16px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '11px',
    color: '#6B7280',
  },
  legendDot: (color: string) => ({
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: color,
  }),
  sortControls: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  sortGroup: {
    display: 'inline-flex',
    backgroundColor: '#F9FAFB',
    borderRadius: '12px',
    padding: '4px',
    border: '1px solid #F0F2F5',
  },
  sortButton: (isActive: boolean) => ({
    padding: '6px 14px',
    fontSize: '12px',
    fontWeight: '500',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: isActive ? '#FFFFFF' : 'transparent',
    color: isActive ? '#2563EB' : '#6B7280',
    boxShadow: isActive ? '0 1px 3px rgba(0, 0, 0, 0.05)' : 'none',
  }),
  tableContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    border: '1px solid #F0F2F5',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  },
  th: {
    textAlign: 'left' as const,
    padding: '16px 20px',
    backgroundColor: '#F9FAFB',
    fontSize: '12px',
    fontWeight: '600',
    color: '#6B7280',
    borderBottom: '1px solid #F0F2F5',
  },
  td: {
    padding: '14px 20px',
    fontSize: '14px',
    color: '#374151',
    borderBottom: '1px solid #F0F2F5',
  },
  gradeBadge: (grade: number) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '44px',
    padding: '6px 12px',
    borderRadius: '30px',
    fontSize: '14px',
    fontWeight: '600',
    backgroundColor: grade >= 9 ? '#DCFCE7' : grade >= 7 ? '#DBEAFE' : grade >= 5 ? '#FEF3C7' : '#FEE2E2',
    color: grade >= 9 ? '#166534' : grade >= 7 ? '#1D4ED8' : grade >= 5 ? '#92400E' : '#991B1B',
  }),
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  loadingStat: {
    height: '100px',
    backgroundColor: '#F3F4F6',
    borderRadius: '20px',
  },
  loadingTable: {
    height: '300px',
    backgroundColor: '#F9FAFB',
    borderRadius: '20px',
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '64px',
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    border: '1px solid #F0F2F5',
  },
  emptyIcon: {
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: '4px',
  },
  emptyText: {
    fontSize: '13px',
    color: '#9CA3AF',
  },
};

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('kk-KZ', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

interface ChildGradesViewProps {
  grades: Grade[];
  loading: boolean;
}

export const ChildGradesView = ({ grades, loading }: ChildGradesViewProps) => {
  const [sortBy, setSortBy] = useState<'date' | 'subject' | 'grade'>('date');

  const getAverageGrade = (): number => {
    if (grades.length === 0) return 0;
    const sum = grades.reduce((acc, g) => acc + g.grade_value, 0);
    return sum / grades.length;
  };

  const getHighestGrade = (): number => {
    if (grades.length === 0) return 0;
    return Math.max(...grades.map(g => g.grade_value));
  };

  const getGradeDistribution = () => {
    const distribution = { excellent: 0, good: 0, satisfactory: 0, poor: 0 };
    grades.forEach(g => {
      if (g.grade_value >= 9) distribution.excellent++;
      else if (g.grade_value >= 7) distribution.good++;
      else if (g.grade_value >= 5) distribution.satisfactory++;
      else distribution.poor++;
    });
    return distribution;
  };

  const sortedGrades = [...grades].sort((a, b) => {
    if (sortBy === 'date') return new Date(b.grade_date).getTime() - new Date(a.grade_date).getTime();
    if (sortBy === 'subject') return a.subject_name.localeCompare(b.subject_name);
    if (sortBy === 'grade') return b.grade_value - a.grade_value;
    return 0;
  });

  const distribution = getGradeDistribution();
  const totalGrades = grades.length;
  const averageGrade = getAverageGrade();
  const highestGrade = getHighestGrade();

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingStat} />
        <div style={styles.loadingTable} />
      </div>
    );
  }

  if (grades.length === 0) {
    return (
      <div style={styles.emptyState}>
        <Star size={48} color="#D1D5DB" style={styles.emptyIcon} />
        <p style={styles.emptyTitle}>Бағалар жоқ</p>
        <p style={styles.emptyText}>Әлі бағалар қойылмаған</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.statsGrid}>
        <div style={styles.statCard('linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)')}>
          <div style={styles.statLabel}>
            <TrendingUp size={14} />
            Орташа балл
          </div>
          <div style={styles.statValue}>{averageGrade.toFixed(1)}</div>
        </div>
        <div style={styles.statCard('linear-gradient(135deg, #F59E0B 0%, #D97706 100%)')}>
          <div style={styles.statLabel}>
            <Award size={14} />
            Ең жоғары балл
          </div>
          <div style={styles.statValue}>{highestGrade}</div>
        </div>
        <div style={styles.statCard('linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)')}>
          <div style={styles.statLabel}>
            <Star size={14} />
            Жалпы бағалар
          </div>
          <div style={styles.statValue}>{totalGrades}</div>
        </div>
      </div>

      <div style={styles.distributionCard}>
        <div style={styles.distributionTitle}>
          <TrendingUp size={16} color="#3B82F6" />
          Бағалар бөлінісі
        </div>
        <div style={styles.distributionBar}>
          {distribution.excellent > 0 && (
            <div style={{ width: `${(distribution.excellent / totalGrades) * 100}%`, backgroundColor: '#10B981', height: '100%' }} />
          )}
          {distribution.good > 0 && (
            <div style={{ width: `${(distribution.good / totalGrades) * 100}%`, backgroundColor: '#3B82F6', height: '100%' }} />
          )}
          {distribution.satisfactory > 0 && (
            <div style={{ width: `${(distribution.satisfactory / totalGrades) * 100}%`, backgroundColor: '#F59E0B', height: '100%' }} />
          )}
          {distribution.poor > 0 && (
            <div style={{ width: `${(distribution.poor / totalGrades) * 100}%`, backgroundColor: '#EF4444', height: '100%' }} />
          )}
        </div>
        <div style={styles.distributionLegend}>
          <span style={styles.legendItem}><span style={styles.legendDot('#10B981')} />Өте жақсы (9-10)</span>
          <span style={styles.legendItem}><span style={styles.legendDot('#3B82F6')} />Жақсы (7-8)</span>
          <span style={styles.legendItem}><span style={styles.legendDot('#F59E0B')} />Қанағаттанарлық (5-6)</span>
          <span style={styles.legendItem}><span style={styles.legendDot('#EF4444')} />Нашар (1-4)</span>
        </div>
      </div>

      <div style={styles.sortControls}>
        <div style={styles.sortGroup}>
          <button
            onClick={() => setSortBy('date')}
            style={styles.sortButton(sortBy === 'date')}
            onMouseEnter={(e) => {
              if (sortBy !== 'date') e.currentTarget.style.backgroundColor = '#F3F4F6';
            }}
            onMouseLeave={(e) => {
              if (sortBy !== 'date') e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Күні бойынша
          </button>
          <button
            onClick={() => setSortBy('subject')}
            style={styles.sortButton(sortBy === 'subject')}
            onMouseEnter={(e) => {
              if (sortBy !== 'subject') e.currentTarget.style.backgroundColor = '#F3F4F6';
            }}
            onMouseLeave={(e) => {
              if (sortBy !== 'subject') e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Пән бойынша
          </button>
          <button
            onClick={() => setSortBy('grade')}
            style={styles.sortButton(sortBy === 'grade')}
            onMouseEnter={(e) => {
              if (sortBy !== 'grade') e.currentTarget.style.backgroundColor = '#F3F4F6';
            }}
            onMouseLeave={(e) => {
              if (sortBy !== 'grade') e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Баға бойынша
          </button>
        </div>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}><BookOpen size={14} style={{ display: 'inline', marginRight: '6px' }} />Пән</th>
              <th style={styles.th}>Баға</th>
              <th style={styles.th}><Calendar size={14} style={{ display: 'inline', marginRight: '6px' }} />Күні</th>
              <th style={styles.th}><User size={14} style={{ display: 'inline', marginRight: '6px' }} />Мұғалім</th>
              <th style={styles.th}><MessageSquare size={14} style={{ display: 'inline', marginRight: '6px' }} />Пікір</th>
            </tr>
          </thead>
          <tbody>
            {sortedGrades.map((grade, index) => (
              <tr
                key={grade.id}
                style={{ borderBottom: index === sortedGrades.length - 1 ? 'none' : undefined }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F9FAFB';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <td style={styles.td}>
                  <span style={{ fontWeight: 500 }}>{grade.subject_name || 'Пән көрсетілмеген'}</span>
                </td>
                <td style={styles.td}>
                  <span style={styles.gradeBadge(grade.grade_value)}>{grade.grade_value}</span>
                </td>
                <td style={styles.td}>{formatDate(grade.grade_date)}</td>
                <td style={styles.td}>{grade.teacher_name || 'Мұғалім көрсетілмеген'}</td>
                <td style={styles.td}>
                  <span style={{ color: grade.comment ? '#6B7280' : '#9CA3AF' }}>
                    {grade.comment || '—'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};