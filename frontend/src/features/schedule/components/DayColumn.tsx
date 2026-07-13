// src/features/schedule/components/DayColumn.tsx
import type { Schedule } from '../types/schedule.types';
import LessonCard from './LessonCard';

interface DayColumnProps {
  day: string;
  dayLabel: string;
  lessons: Schedule[];
  userRole: string | undefined;
}

const DayColumn = ({ day, dayLabel, lessons, userRole }: DayColumnProps) => {
  const styles = {
    column: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '16px',
      minWidth: '280px', 
      backgroundColor: '#ffffff',
      borderRadius: '20px',
      padding: '20px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)',
      border: '1px solid #F0F2F5',
    },
    dayHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '8px',
      paddingBottom: '12px',
      borderBottom: '2px solid #F0F2F5',
    },
    dayName: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#0F172A',
      letterSpacing: '-0.01em',
    },
    lessonCount: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#94A3B8',
      backgroundColor: '#F8FAFC',
      padding: '4px 10px',
      borderRadius: '20px',
    },
    lessonsList: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '12px',
      minHeight: '200px',
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      backgroundColor: '#F8FAFC',
      borderRadius: '16px',
      border: '2px dashed #E2E8F0',
      textAlign: 'center' as const,
      color: '#94A3B8',
      fontSize: '15px',
      fontWeight: '500',
      minHeight: '200px',
    },
  };

  const getDayColor = (day: string) => {
    const colors: Record<string, string> = {
      'Monday': '#3B82F6',
      'Tuesday': '#8B5CF6',
      'Wednesday': '#EC4899',
      'Thursday': '#F59E0B',
      'Friday': '#10B981',
    };
    return colors[day] || '#3B82F6';
  };

  return (
    <div style={styles.column}>
      <div style={styles.dayHeader}>
        <div style={{ ...styles.dayName, color: getDayColor(day) }}>{dayLabel}</div>
        {lessons.length > 0 && (
          <span style={styles.lessonCount}>{lessons.length} сабақ</span>
        )}
      </div>

      <div style={styles.lessonsList}>
        {lessons.length > 0 ? (
          lessons.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} userRole={userRole} />
          ))
        ) : (
          <div style={styles.emptyState}>
            Сабақ кестесі жоқ
          </div>
        )}
      </div>
    </div>
  );
};

export default DayColumn;