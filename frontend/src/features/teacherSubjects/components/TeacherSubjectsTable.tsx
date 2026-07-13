// src/features/teacherSubjects/components/TeacherSubjectsTable.tsx
import React, { useState } from 'react';
import type { TeacherSubject } from '../types/teacherSubject.types';

interface TeacherSubjectsTableProps {
  assignments: TeacherSubject[];
  loading?: boolean;
  onDelete: (id: number) => Promise<void>;
}

const TeacherSubjectsTable: React.FC<TeacherSubjectsTableProps> = ({
  assignments,
  loading = false,
  onDelete,
}) => {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить это назначение?')) {
      setDeletingId(id);
      try {
        await onDelete(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

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
    },
    td: {
      padding: '14px 16px',
      borderBottom: '1px solid #f1f5f9',
      color: '#334155',
    },
    tr: {
      transition: 'background-color 0.15s ease',
    },
    actions: {
      display: 'flex',
      gap: '8px',
    },
    deleteButton: {
      padding: '6px 12px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '12px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
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

  if (assignments.length === 0) {
    return (
      <div style={styles.tableContainer}>
        <div style={styles.emptyState}>
          Тағайындаулар әзірше жоқ
        </div>
      </div>
    );
  }

  return (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Мұғалім</th>
            <th style={styles.th}>Пән</th>
            <th style={styles.th}>Әрекеттер</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment) => (
            <tr
              key={assignment.id}
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
              <td style={styles.td}>{assignment.teacher_name}</td>
              <td style={styles.td}>{assignment.subject_name}</td>
              <td style={styles.td}>
                <div style={styles.actions}>
                  <button
                    style={styles.deleteButton}
                    onClick={() => handleDelete(assignment.id)}
                    disabled={loading || deletingId === assignment.id}
                    onMouseEnter={(e) => {
                      if (!loading && deletingId !== assignment.id) {
                        e.currentTarget.style.backgroundColor = '#fee2e2';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!loading && deletingId !== assignment.id) {
                        e.currentTarget.style.backgroundColor = '#fef2f2';
                      }
                    }}
                  >
                    {deletingId === assignment.id ? 'Өшірілуде...' : 'Өшіру'}
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

export default React.memo(TeacherSubjectsTable);