// src/features/teachers/components/TeachersTable.tsx
import { TEACHER_STATUS } from '../types/teacher.types';
import type { Teacher } from '../types/teacher.types';
interface TeachersTableProps {
  teachers: Teacher[];
  onEdit: (teacher: Teacher) => void;
  onDelete: (id: number) => void;
}

const TeachersTable = ({ teachers, onEdit, onDelete }: TeachersTableProps) => {
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
    statusBadge: {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '30px',
      fontSize: '12px',
      fontWeight: '600',
    },
    statusActive: {
      backgroundColor: '#DCFCE7',
      color: '#166534',
    },
    statusInactive: {
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (teachers.length === 0) {
    return (
      <div style={styles.tableContainer}>
        <div style={styles.emptyState}>
          Нет учителей для отображения
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
            <th style={styles.th}>Қабылдау күні</th>
            <th style={styles.th}>Мәртебесі</th>
            <th style={styles.th}>Құрылған күні</th>
            <th style={styles.th}>Әрекеттер</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher) => (
            <tr
              key={teacher.id}
              style={styles.tr}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F8FAFC';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <td style={styles.td}>{teacher.full_name}</td>
              <td style={styles.td}>{teacher.email}</td>
              <td style={styles.td}>{formatDate(teacher.hire_date)}</td>
              <td style={styles.td}>
                <span
                  style={{
                    ...styles.statusBadge,
                    ...(teacher.is_active ? styles.statusActive : styles.statusInactive),
                  }}
                >
                  {teacher.is_active ? TEACHER_STATUS.active : TEACHER_STATUS.inactive}
                </span>
              </td>
              <td style={styles.td}>{formatDate(teacher.created_at)}</td>
              <td style={styles.td}>
                <div style={styles.actions}>
                  <button
                    style={{ ...styles.actionButton, ...styles.editButton }}
                    onClick={() => onEdit(teacher)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#DBEAFE';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#EFF6FF';
                    }}
                  >
                    Edit
                  </button>
                  <button
                    style={{ ...styles.actionButton, ...styles.deleteButton }}
                    onClick={() => onDelete(teacher.id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#FECACA';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#FEE2E2';
                    }}
                  >
                    Delete
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

export default TeachersTable;