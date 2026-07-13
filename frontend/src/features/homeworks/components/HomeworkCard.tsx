// src/features/homeworks/components/HomeworkCard.tsx
import { isOverdue } from '../types/homework.types';
import type { Homework, Submission } from '../types/homework.types';

interface HomeworkCardProps {
  homework: Homework;
  onSubmitClick: (homework: Homework) => void;
  onViewClick: (homework: Homework) => void;
  isSubmitted: boolean;
  submission?: Submission | null;
}

const HomeworkCard = ({ homework, onSubmitClick, onViewClick, isSubmitted, submission }: HomeworkCardProps) => {
  const overdue = isOverdue(homework.due_date);

  console.log(`🎴 HomeworkCard: ${homework.title}, isSubmitted=${isSubmitted}`);

  const styles = {
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: '16px',
      padding: '20px',
      border: '1px solid #F0F2F5',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)',
      transition: 'all 0.2s ease-in-out',
    },
    title: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#0F172A',
      marginBottom: '8px',
    },
    meta: {
      display: 'flex',
      gap: '16px',
      marginBottom: '12px',
      fontSize: '13px',
      color: '#64748B',
    },
    description: {
      fontSize: '14px',
      color: '#334155',
      marginBottom: '16px',
      lineHeight: '1.5',
    },
    dueDate: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '16px',
      paddingTop: '16px',
      borderTop: '1px solid #F0F2F5',
      flexWrap: 'wrap' as const,
      gap: '10px',
    },
    statusBadge: {
      padding: '4px 12px',
      borderRadius: '30px',
      fontSize: '12px',
      fontWeight: '600',
      backgroundColor: overdue ? '#FEE2E2' : '#DCFCE7',
      color: overdue ? '#DC2626' : '#166534',
    },
    button: {
      backgroundColor: '#3B82F6',
      color: '#FFFFFF',
      padding: '8px 16px',
      borderRadius: '10px',
      border: 'none',
      fontSize: '13px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    viewButton: {
      backgroundColor: '#10B981',
      color: '#FFFFFF',
      padding: '8px 16px',
      borderRadius: '10px',
      border: 'none',
      fontSize: '13px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    submittedBadge: {
      padding: '6px 12px',
      borderRadius: '10px',
      backgroundColor: '#DCFCE7',
      color: '#166534',
      fontSize: '13px',
      fontWeight: '500',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
    },
    buttonGroup: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
    },
    gradeInfo: {
      fontSize: '12px',
      padding: '4px 8px',
      borderRadius: '8px',
      backgroundColor: '#FEF3C7',
      color: '#92400E',
    },
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const getGradeText = (grade: number) => {
    if (grade >= 9) return 'Өте жақсы';
    if (grade >= 7) return 'Жақсы';
    if (grade >= 5) return 'Қанағаттанарлық';
    return 'Нашар';
  };

  return (
    <div
      style={styles.card}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.06)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.02)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={styles.title}>{homework.title}</div>
      <div style={styles.meta}>
        <span>{homework.subject_name}</span>
        <span>•</span>
        <span>{homework.teacher_name}</span>
      </div>
      <div style={styles.description}>{homework.description}</div>
      <div style={styles.dueDate}>
        <span style={styles.statusBadge}>{overdue ? 'Өткізілген' : 'Белсенді'}</span>
        <span style={{ fontSize: '13px', color: '#64748B' }}>
          Мерзімі: {formatDate(homework.due_date)}
        </span>
        
        <div style={styles.buttonGroup}>
          {isSubmitted ? (
            <>
              <button
                style={styles.viewButton}
                onClick={() => onViewClick(homework)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#059669';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#10B981';
                }}
              >
                Менің жұмысым
              </button>
              <span style={styles.submittedBadge}>
                ✅ Жіберілді
              </span>
              {submission?.grade && (
                <span style={styles.gradeInfo}>
                  Баға: {submission.grade} ({getGradeText(submission.grade)})
                </span>
              )}
            </>
          ) : (
            <button
              style={styles.button}
              onClick={() => onSubmitClick(homework)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2563EB';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#3B82F6';
              }}
            >
              Жіберу
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeworkCard;