// src/features/classes/components/StudentsModal.tsx
import React from 'react';
import type { ClassStudent, StudentGrade } from '../api/classApi';
import type { Class } from '../types/class.types';

interface StudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedClass: Class | null;
  students: ClassStudent[];
  studentsLoading: boolean;
  studentsError: string | null;
  startDate: string;
  endDate: string;
  onDateFilterChange: (startDate: string, endDate: string) => void;
  onExport: () => void;
}

// Вспомогательная функция для стиля оценки
const getGradeStyle = (grade: number): React.CSSProperties => {
  if (grade >= 4) return { backgroundColor: '#dcfce7', color: '#166534' };
  if (grade >= 3) return { backgroundColor: '#fef9c3', color: '#854d0e' };
  return { backgroundColor: '#fee2e2', color: '#b91c1c' };
};

const StudentsModal: React.FC<StudentsModalProps> = ({
  isOpen,
  onClose,
  selectedClass,
  students,
  studentsLoading,
  studentsError,
  startDate,
  endDate,
  onDateFilterChange,
  onExport,
}) => {
  if (!isOpen || !selectedClass) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>
              {selectedClass.name} - Оқушылар және бағалары
            </h2>
            <p style={styles.subtitle}>
              Таңдалған кезеңдегі үлгерімді қарау
            </p>
          </div>
          <button style={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Date Filter */}
        <div style={styles.filterSection}>
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Бастап:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => onDateFilterChange(e.target.value, endDate)}
              style={styles.dateInput}
            />
          </div>
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Дейін:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => onDateFilterChange(startDate, e.target.value)}
              style={styles.dateInput}
            />
          </div>
          <button
            style={styles.exportButton}
            onClick={onExport}
            disabled={studentsLoading || students.length === 0}
          >
            Excel-ге жүктеу
          </button>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {studentsLoading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.loadingSpinner}></div>
              <p>Деректер жүктелуде...</p>
            </div>
          ) : studentsError ? (
            <div style={styles.errorContainer}>
              <p style={styles.errorText}>{studentsError}</p>
            </div>
          ) : students.length === 0 ? (
            <div style={styles.emptyContainer}>
              <p style={styles.emptyText}>Бұл сыныпта оқушылар жоқ</p>
            </div>
          ) : (
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>№</th>
                    <th style={styles.th}>Оқушының аты-жөні</th>
                    <th style={styles.th}>Пән</th>
                    <th style={styles.th}>Бағасы</th>
                    <th style={styles.th}>Күні</th>
                    <th style={styles.th}>Пікір</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, studentIndex) => (
                    <React.Fragment key={student.id}>
                      {student.grades.length > 0 ? (
                        student.grades.map((grade: StudentGrade, gradeIndex: number) => (
                          <tr key={`${student.id}-${gradeIndex}`} style={styles.tr}>
                            {gradeIndex === 0 && (
                              <>
                                <td
                                  style={{ ...styles.td, ...styles.studentNumberCell }}
                                  rowSpan={student.grades.length}
                                >
                                  <div style={styles.studentNumber}>
                                    {studentIndex + 1}
                                  </div>
                                </td>
                                <td
                                  style={{ ...styles.td, ...styles.studentNameCell }}
                                  rowSpan={student.grades.length}
                                >
                                  <div style={styles.studentName}>
                                    <div style={styles.studentAvatar}>
                                      {student.full_name.charAt(0)}
                                    </div>
                                    {student.full_name}
                                  </div>
                                </td>
                              </>
                            )}
                            <td style={styles.td}>
                              <span style={styles.subjectBadge}>
                                {grade.subject_name}
                              </span>
                            </td>
                            <td style={styles.td}>
                              <span style={{
                                ...styles.gradeBadge,
                                ...getGradeStyle(grade.grade_value)
                              }}>
                                {grade.grade_value}
                              </span>
                            </td>
                            <td style={styles.td}>
                              {new Date(grade.grade_date).toLocaleDateString('ru-RU')}
                            </td>
                            <td style={styles.td}>
                              {grade.comment || '—'}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr key={student.id} style={styles.tr}>
                          <td style={styles.td}>
                            <div style={styles.studentNumber}>
                              {studentIndex + 1}
                            </div>
                          </td>
                          <td style={styles.td}>
                            <div style={styles.studentName}>
                              <div style={styles.studentAvatar}>
                                {student.full_name.charAt(0)}
                              </div>
                              {student.full_name}
                            </div>
                          </td>
                          <td style={styles.td} colSpan={4}>
                            <span style={styles.noGradesBadge}>
                              Таңдалған кезең үшін бағалар жоқ
                            </span>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <div style={styles.stats}>
            <span style={styles.statItem}>
              👥 Барлық оқушылар: <strong>{students.length}</strong>
            </span>
            <span style={styles.statItem}>
              📊 Бағалармен: <strong>{students.filter(s => s.grades.length > 0).length}</strong>
            </span>
            <span style={styles.statItem}>
              📝 Барлық бағалар: <strong>{students.reduce((acc, s) => acc + s.grades.length, 0)}</strong>
            </span>
          </div>
          <button style={styles.closeModalButton} onClick={onClose}>
            Жабу
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    animation: 'fadeIn 0.2s ease-out',
    padding: '20px',
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    width: '100%',
    maxWidth: '1200px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column' as const,
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    animation: 'slideIn 0.3s ease-out',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '24px 32px',
    borderBottom: '1px solid #e2e8f0',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 4px 0',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
  },
  closeButton: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#f1f5f9',
    color: '#64748b',
    fontSize: '18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  filterSection: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-end',
    padding: '24px 32px',
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e2e8f0',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
  filterLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#475569',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.03em',
  },
  dateInput: {
    padding: '10px 12px',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '14px',
    backgroundColor: '#ffffff',
    transition: 'all 0.2s ease',
  },
  exportButton: {
    padding: '10px 20px',
    backgroundColor: '#10b981',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginLeft: 'auto',
    transition: 'all 0.2s ease',
  },
  content: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '0 32px',
  },
  tableContainer: {
    margin: '24px 0',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  },
  th: {
    textAlign: 'left' as const,
    padding: '16px',
    backgroundColor: '#f8fafc',
    color: '#475569',
    fontWeight: '600',
    fontSize: '13px',
    letterSpacing: '0.03em',
    textTransform: 'uppercase' as const,
    borderBottom: '2px solid #e2e8f0',
    position: 'sticky' as const,
    top: 0,
    background: '#f8fafc',
  },
  tr: {
    transition: 'background-color 0.2s ease',
  },
  td: {
    padding: '16px',
    borderBottom: '1px solid #f1f5f9',
    color: '#334155',
    fontSize: '14px',
  },
  studentNameCell: {
    backgroundColor: '#ffffff',
    verticalAlign: 'top' as const,
    fontWeight: '500',
  },
  studentNumberCell: {
    backgroundColor: '#ffffff',
    verticalAlign: 'top' as const,
    width: '50px',
  },
  studentName: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontWeight: '500',
  },
  studentAvatar: {
    width: '32px',
    height: '32px',
    backgroundColor: '#e2e8f0',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '600',
    color: '#475569',
  },
  studentNumber: {
    width: '28px',
    height: '28px',
    backgroundColor: '#f1f5f9',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748b',
  },
  subjectBadge: {
    display: 'inline-block',
    padding: '4px 10px',
    backgroundColor: '#f1f5f9',
    borderRadius: '20px',
    fontSize: '13px',
    color: '#475569',
    fontWeight: '500',
  },
  gradeBadge: {
    display: 'inline-block',
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    textAlign: 'center' as const,
    lineHeight: '36px',
    fontSize: '16px',
    fontWeight: '700',
  },
  noGradesBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    backgroundColor: '#f1f5f9',
    borderRadius: '20px',
    fontSize: '13px',
    color: '#94a3b8',
    fontStyle: 'italic' as const,
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '64px',
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #e2e8f0',
    borderTopColor: '#3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px',
  },
  errorContainer: {
    padding: '32px',
    textAlign: 'center' as const,
    backgroundColor: '#fef2f2',
    borderRadius: '12px',
    margin: '24px 0',
  },
  errorText: {
    color: '#b91c1c',
    fontSize: '15px',
    margin: 0,
  },
  emptyContainer: {
    padding: '48px',
    textAlign: 'center' as const,
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    margin: '24px 0',
  },
  emptyText: {
    color: '#64748b',
    fontSize: '16px',
    margin: 0,
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 32px',
    borderTop: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    borderBottomLeftRadius: '24px',
    borderBottomRightRadius: '24px',
  },
  stats: {
    display: 'flex',
    gap: '24px',
  },
  statItem: {
    fontSize: '14px',
    color: '#64748b',
  },
  closeModalButton: {
    padding: '10px 24px',
    backgroundColor: '#ffffff',
    color: '#475569',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};

// Добавляем анимации
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  input:hover, input:focus {
    border-color: #3b82f6;
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  tr:hover {
    background-color: #f8fafc;
  }
`;
document.head.appendChild(style);

export default StudentsModal;