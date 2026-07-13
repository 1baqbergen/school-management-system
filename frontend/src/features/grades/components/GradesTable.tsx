// src/features/grades/components/GradesTable.tsx
import type { Grade } from '../types/grade.types';

interface GradesTableProps {
  grades: Grade[];
  userRole: string | undefined;
  onEdit: (grade: Grade) => void;
  onDelete: (id: number) => void;
}

const GradesTable = ({ grades, userRole, onEdit, onDelete }: GradesTableProps) => {
  const isAdmin = userRole === 'admin';
  const isTeacher = userRole === 'teacher';
  const canDelete = isAdmin; // Только ADMIN может удалять
  const canEdit = isAdmin || isTeacher; // ADMIN и TEACHER могут редактировать

  const styles = {
    tableContainer: {
      border: '1px solid #E5E7EB',
      borderRadius: '16px',
      overflow: 'hidden',
      backgroundColor: '#ffffff',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse' as const,
      fontSize: '14px',
    },
    th: {
      textAlign: 'left' as const,
      padding: '16px',
      backgroundColor: '#F8FAFC',
      color: '#1E293B',
      fontWeight: '600',
      borderBottom: '2px solid #E2E8F0',
      whiteSpace: 'nowrap' as const,
    },
    td: {
      padding: '14px 16px',
      borderBottom: '1px solid #F0F2F5',
      color: '#0F172A',
    },
    tr: {
      transition: 'background-color 0.2s ease-in-out',
    },
    gradeBadge: {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '30px',
      fontSize: '14px',
      fontWeight: '600',
      textAlign: 'center' as const,
      minWidth: '40px',
    },
    gradeHigh: {
      backgroundColor: '#DCFCE7',
      color: '#166534',
    },
    gradeMedium: {
      backgroundColor: '#FEF9C3',
      color: '#854D0E',
    },
    gradeLow: {
      backgroundColor: '#FFEDD5',
      color: '#9A3412',
    },
    gradeVeryLow: {
      backgroundColor: '#FEE2E2',
      color: '#991B1B',
    },
    actions: {
      display: 'flex',
      gap: '8px',
    },
    actionButton: {
      padding: '6px 12px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '12px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
    },
    editButton: {
      backgroundColor: '#EFF6FF',
      color: '#3B82F6',
    },
    deleteButton: {
      backgroundColor: '#FEE2E2',
      color: '#DC2626',
    },
    emptyState: {
      padding: '48px',
      textAlign: 'center' as const,
      color: '#94A3B8',
      fontSize: '16px',
    },
  };

  const getGradeStyle = (grade: number) => {
    if (grade >= 9) return { ...styles.gradeBadge, ...styles.gradeHigh };
    if (grade >= 7) return { ...styles.gradeBadge, ...styles.gradeMedium };
    if (grade >= 5) return { ...styles.gradeBadge, ...styles.gradeLow };
    return { ...styles.gradeBadge, ...styles.gradeVeryLow };
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (grades.length === 0) {
    return (
      <div style={styles.tableContainer}>
        <div style={styles.emptyState}>
          Бағалар жоқ
        </div>
      </div>
    );
  }

  return (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Күні</th>
            <th style={styles.th}>Оқушы</th>
            <th style={styles.th}>Сынып</th>
            <th style={styles.th}>Пән</th>
            <th style={styles.th}>Мұғалім</th>
            <th style={styles.th}>Баға</th>
            <th style={styles.th}>Пікір</th>
            <th style={styles.th}>Әрекеттер</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((grade) => (
            <tr
              key={grade.id}
              style={styles.tr}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F8FAFC';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <td style={styles.td}>{formatDate(grade.grade_date)}</td>
              <td style={styles.td}>{grade.student_name}</td>
              <td style={styles.td}>{grade.class_name}</td>
              <td style={styles.td}>{grade.subject_name}</td>
              <td style={styles.td}>{grade.teacher_name}</td>
              <td style={styles.td}>
                <span style={getGradeStyle(grade.grade_value)}>
                  {grade.grade_value}
                </span>
              </td>
              <td style={styles.td}>{grade.comment || '-'}</td>
              <td style={styles.td}>
                <div style={styles.actions}>
                  {canEdit && (
                    <button
                      style={{ ...styles.actionButton, ...styles.editButton }}
                      onClick={() => onEdit(grade)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#DBEAFE';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#EFF6FF';
                      }}
                    >
                      Өзгерту
                    </button>
                  )}
                  {canDelete && (
                    <button
                      style={{ ...styles.actionButton, ...styles.deleteButton }}
                      onClick={() => onDelete(grade.id)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#FECACA';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#FEE2E2';
                      }}
                    >
                      Өшіру
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GradesTable;