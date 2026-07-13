// src/features/schedule/components/LessonCard.tsx
import type { Schedule } from '../types/schedule.types';

interface LessonCardProps {
  lesson: Schedule;
  userRole: string | undefined;
}

const LessonCard = ({ lesson, userRole }: LessonCardProps) => {
  const isTeacher = userRole === 'teacher';
  const isStudent = userRole === 'student';

  const styles = {
    card: {
      backgroundColor: '#ffffff',
      border: '1px solid #F0F2F5',
      borderRadius: '16px',
      padding: '16px',
      transition: 'all 0.2s ease-in-out',
      cursor: 'default',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
      outline: 'none',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '12px',
    },
    lessonNumber: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#3B82F6',
      backgroundColor: '#EFF6FF',
      padding: '4px 10px',
      borderRadius: '20px',
      letterSpacing: '-0.01em',
    },
    time: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#64748B',
    },
    subject: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#0F172A',
      marginBottom: '8px',
      lineHeight: '1.3',
    },
    details: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '4px',
    },
    detailRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      color: '#475569',
    },
    detailLabel: {
      color: '#94A3B8',
      minWidth: '70px',
    },
    detailValue: {
      fontWeight: '500',
      color: '#1E293B',
    },
    accentLine: {
      width: '4px',
      height: '40px',
      backgroundColor: '#3B82F6',
      borderRadius: '4px',
      marginRight: '12px',
    },
  };

  return (
    <div 
      style={styles.card}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.06)';
        e.currentTarget.style.borderColor = '#E2E8F0';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.02)';
        e.currentTarget.style.borderColor = '#F0F2F5';
      }}
      tabIndex={0}
      onKeyDown={(e) => {
        // Добавляем клавиатурную навигацию
        if (e.key === 'Enter') {
          e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.06)';
        }
      }}
    >
      <div style={styles.header}>
        <span style={styles.lessonNumber}>Сабақ {lesson.lesson_number}</span>
        <span style={styles.time}>{lesson.start_time} – {lesson.end_time}</span>
      </div>
      
      <div style={styles.subject}>
        {lesson.subject_name || `Пән #${lesson.subject_id}`}
      </div>
      
      <div style={styles.details}>
        {isStudent && (
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Мұғалім:</span>
            <span style={styles.detailValue}>
              {lesson.teacher_name || `Мұғалім #${lesson.teacher_id}`}
            </span>
          </div>
        )}
        
        {isTeacher && (
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Сынып:</span>
            <span style={styles.detailValue}>
              {lesson.class_name || `Сынып ${lesson.class_id}`}
            </span>
          </div>
        )}
        
        {isStudent && (
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Сынып:</span>
            <span style={styles.detailValue}>
              {lesson.class_name || `Сынып ${lesson.class_id}`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonCard;