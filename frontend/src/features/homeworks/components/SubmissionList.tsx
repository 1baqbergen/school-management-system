// src/features/homeworks/components/SubmissionList.tsx
import type { Submission } from '../types/homework.types';

interface SubmissionListProps {
  submissions: Submission[];
  onGrade: (submission: Submission) => void;
}

const SubmissionList = ({ submissions, onGrade }: SubmissionListProps) => {
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '16px',
    },
    submissionCard: {
      backgroundColor: '#F9FAFB',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid #E5E7EB',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px',
    },
    studentName: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#111827',
    },
    date: {
      fontSize: '12px',
      color: '#6B7280',
    },
    content: {
      fontSize: '14px',
      color: '#334155',
      marginBottom: '12px',
      lineHeight: '1.5',
    },
    fileLink: {
      color: '#3B82F6',
      textDecoration: 'none',
      fontSize: '13px',
      marginBottom: '12px',
      display: 'inline-block',
    },
    gradeSection: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '12px',
      paddingTop: '12px',
      borderTop: '1px solid #E5E7EB',
    },
    gradeBadge: {
      padding: '4px 12px',
      borderRadius: '30px',
      fontSize: '14px',
      fontWeight: '600',
    },
    gradeHigh: {
      backgroundColor: '#DCFCE7',
      color: '#166534',
    },
    gradeMedium: {
      backgroundColor: '#FEF3C7',
      color: '#92400E',
    },
    gradeLow: {
      backgroundColor: '#FEE2E2',
      color: '#991B1B',
    },
    gradeButton: {
      padding: '6px 12px',
      backgroundColor: '#3B82F6',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '8px',
      fontSize: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    comment: {
      fontSize: '13px',
      color: '#64748B',
      marginTop: '8px',
      fontStyle: 'italic',
    },
  };

  const getGradeStyle = (grade: number) => {
    if (grade >= 8) return { ...styles.gradeBadge, ...styles.gradeHigh };
    if (grade >= 5) return { ...styles.gradeBadge, ...styles.gradeMedium };
    return { ...styles.gradeBadge, ...styles.gradeLow };
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (submissions.length === 0) {
    return <div style={{ textAlign: 'center', padding: '48px', color: '#6B7280' }}>Жіберілген жұмыстар жоқ</div>;
  }

  return (
    <div style={styles.container}>
      {submissions.map((sub) => (
        <div key={sub.id} style={styles.submissionCard}>
          <div style={styles.header}>
            <span style={styles.studentName}>{sub.student_name}</span>
            <span style={styles.date}>{formatDate(sub.submitted_at)}</span>
          </div>
          <div style={styles.content}>{sub.content}</div>
          {sub.file_url && (
            <a href={sub.file_url} target="_blank" rel="noopener noreferrer" style={styles.fileLink}>
              📎 Сілтемені ашу
            </a>
          )}
          {sub.grade !== null ? (
            <div style={styles.gradeSection}>
              <span style={getGradeStyle(sub.grade)}>Баға: {sub.grade}</span>
              {sub.comment && <div style={styles.comment}>"{sub.comment}"</div>}
            </div>
          ) : (
            <div style={styles.gradeSection}>
              <span style={{ fontSize: '13px', color: '#6B7280' }}>Бағаланбаған</span>
              <button
                style={styles.gradeButton}
                onClick={() => onGrade(sub)}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2563EB'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#3B82F6'; }}
              >
                Бағалау
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SubmissionList;