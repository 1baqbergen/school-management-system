// src/features/students/components/StudentsTable.tsx
import React from 'react';
import { STUDENT_STATUS } from '../types/student.types';
import type { Student } from '../types/student.types';
interface StudentsTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: number) => void;
  loading?: boolean;
}

const StudentsTable: React.FC<StudentsTableProps> = ({
  students,
  onEdit,
  onDelete,
  loading = false,
}) => {
  const styles = {
    tableContainer: {
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      overflow: 'hidden',
      backgroundColor: '#ffffff',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
      opacity: loading ? 0.7 : 1,
      transition: 'opacity 0.2s ease',
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
      borderBottom: '2px solid #e2e8f0',
      whiteSpace: 'nowrap' as const,
    },
    td: {
      padding: '14px 16px',
      borderBottom: '1px solid #f1f5f9',
      color: '#334155',
    },
    tr: {
      transition: 'background-color 0.15s ease',
      cursor: 'default',
    },
    statusBadge: {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '30px',
      fontSize: '12px',
      fontWeight: '600',
    },
    statusActive: {
      backgroundColor: '#dcfce7',
      color: '#166534',
    },
    statusInactive: {
      backgroundColor: '#fee2e2',
      color: '#991b1b',
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
    emptyState: {
      padding: '48px',
      textAlign: 'center' as const,
      color: '#64748b',
      fontSize: '16px',
    },
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (students.length === 0) {
    return (
      <div style={styles.tableContainer}>
        <div style={styles.emptyState}>
          Оқушылар жоқ
        </div>
      </div>
    );
  }

  return (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ТАӘ</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Сынып</th>
            <th style={styles.th}>Түскен жылы</th>
            <th style={styles.th}>Статус</th>
            <th style={styles.th}>Құрылған күні</th>
            <th style={styles.th}>Әрекеттер</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr
              key={student.id}
              style={styles.tr}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <td style={styles.td}>{student.full_name}</td>
              <td style={styles.td}>{student.email}</td>
              <td style={styles.td}>{student.class_name}</td>
              <td style={styles.td}>{student.admission_year}</td>
              <td style={styles.td}>
                <span
                  style={{
                    ...styles.statusBadge,
                    ...(student.is_active ? styles.statusActive : styles.statusInactive),
                  }}
                >
                  {student.is_active ? STUDENT_STATUS.active : STUDENT_STATUS.inactive}
                </span>
              </td>
              <td style={styles.td}>{formatDate(student.created_at)}</td>
              <td style={styles.td}>
                <div style={styles.actions}>
                  <button
                    style={{ ...styles.actionButton, ...styles.editButton }}
                    onClick={() => onEdit(student)}
                    disabled={loading}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.currentTarget.style.backgroundColor = '#dbeafe';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) {
                        e.currentTarget.style.backgroundColor = '#eff6ff';
                      }
                    }}
                  >
                    Өңдеу
                  </button>
                  <button
                    style={{ ...styles.actionButton, ...styles.deleteButton }}
                    onClick={() => onDelete(student.id)}
                    disabled={loading}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.currentTarget.style.backgroundColor = '#fee2e2';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) {
                        e.currentTarget.style.backgroundColor = '#fef2f2';
                      }
                    }}
                  >
                    Жою
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default React.memo(StudentsTable);