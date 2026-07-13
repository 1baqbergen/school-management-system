// src/features/homeworks/components/HomeworkTable.tsx
import { isOverdue } from '../types/homework.types';
import type { Homework } from '../types/homework.types';
interface HomeworkTableProps {
  homeworks: Homework[];
  userRole: string;
  onDelete?: (id: number) => void;
  onViewSubmissions?: (homework: Homework) => void;
}

const HomeworkTable = ({ homeworks, userRole, onDelete, onViewSubmissions }: HomeworkTableProps) => {
  const isAdmin = userRole === 'admin';
  const isTeacher = userRole === 'teacher';

  const styles = {
    tableContainer: {
      border: '1px solid #E5E7EB',
      borderRadius: '12px',
      overflow: 'hidden',
      backgroundColor: '#FFFFFF',
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
      color: '#475569',
      fontWeight: '600',
      borderBottom: '2px solid #E2E8F0',
    },
    td: {
      padding: '14px 16px',
      borderBottom: '1px solid #F1F5F9',
      color: '#334155',
    },
    tr: {
      transition: 'background-color 0.15s ease',
    },
    overdueBadge: {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '30px',
      fontSize: '12px',
      fontWeight: '600',
      backgroundColor: '#FEE2E2',
      color: '#DC2626',
    },
    activeBadge: {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '30px',
      fontSize: '12px',
      fontWeight: '600',
      backgroundColor: '#DCFCE7',
      color: '#166534',
    },
    button: {
      padding: '6px 12px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '12px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      marginRight: '8px',
    },
    deleteButton: {
      backgroundColor: '#FEE2E2',
      color: '#DC2626',
    },
    viewButton: {
      backgroundColor: '#EFF6FF',
      color: '#3B82F6',
    },
    emptyState: {
      padding: '48px',
      textAlign: 'center' as const,
      color: '#64748B',
    },
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (homeworks.length === 0) {
    return <div style={styles.emptyState}>Үй тапсырмасы әлі жоқ</div>;
  }

  return (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Атауы</th>
            <th style={styles.th}>Сынып</th>
            <th style={styles.th}>Пән</th>
            <th style={styles.th}>Мұғалім</th>
            <th style={styles.th}>Тапсыру мерзімі</th>
            <th style={styles.th}>Мәртебесі</th>
            <th style={styles.th}>Әрекеттер</th>
          </tr>
        </thead>
        <tbody>
          {homeworks.map((homework) => {
            const overdue = isOverdue(homework.due_date);
            return (
              <tr
                key={homework.id}
                style={styles.tr}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F8FAFC';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <td style={styles.td}>{homework.title}</td>
                <td style={styles.td}>{homework.class_name}</td>
                <td style={styles.td}>{homework.subject_name}</td>
                <td style={styles.td}>{homework.teacher_name}</td>
                <td style={styles.td}>{formatDate(homework.due_date)}</td>
                <td style={styles.td}>
                  <span style={overdue ? styles.overdueBadge : styles.activeBadge}>
                    {overdue ? 'Мерзімі өткен' : 'Белсенді'}
                  </span>
                </td>
                <td style={styles.td}>
                  {(isTeacher || isAdmin) && (
                    <>
                      {isTeacher && onViewSubmissions && (
                        <button
                          style={{ ...styles.button, ...styles.viewButton }}
                          onClick={() => onViewSubmissions(homework)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#DBEAFE';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#EFF6FF';
                          }}
                        >
                          Жұмыстар
                        </button>
                      )}
                      {isAdmin && onDelete && (
                        <button
                          style={{ ...styles.button, ...styles.deleteButton }}
                          onClick={() => onDelete(homework.id)}
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
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default HomeworkTable;