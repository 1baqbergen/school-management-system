// src/features/parent/components/ChildScheduleView.tsx
import type { Schedule } from '../types/parent.types';
import { Calendar, Clock, User, BookOpen } from 'lucide-react';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  dayCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    border: '1px solid #F0F2F5',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
  },
  dayHeader: {
    background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    padding: '16px 24px',
  },
  dayTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    margin: 0,
  },
  lessonList: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  lessonItem: {
    padding: '16px 24px',
    borderBottom: '1px solid #F0F2F5',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  },
  lessonContent: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    flexWrap: 'wrap' as const,
  },
  lessonNumber: {
    flexShrink: 0,
    width: '40px',
    height: '40px',
    background: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonNumberText: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1D4ED8',
  },
  lessonInfo: {
    flex: 1,
    minWidth: '200px',
  },
  lessonSubject: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '8px',
  },
  lessonDetails: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '16px',
    marginTop: '4px',
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: '#6B7280',
  },
  lessonClass: {
    fontSize: '13px',
    color: '#9CA3AF',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  loadingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    padding: '20px',
    border: '1px solid #F0F2F5',
  },
  loadingHeader: {
    height: '50px',
    backgroundColor: '#F3F4F6',
    borderRadius: '12px',
    marginBottom: '16px',
  },
  loadingRow: {
    height: '60px',
    backgroundColor: '#F9FAFB',
    borderRadius: '10px',
    marginBottom: '8px',
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '64px',
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    border: '1px solid #F0F2F5',
  },
  emptyIcon: {
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: '4px',
  },
  emptyText: {
    fontSize: '13px',
    color: '#9CA3AF',
  },
};

const getDayName = (day: string): string => {
  const days: Record<string, string> = {
    Monday: 'Дүйсенбі',
    Tuesday: 'Сейсенбі',
    Wednesday: 'Сәрсенбі',
    Thursday: 'Бейсенбі',
    Friday: 'Жұма',
  };
  return days[day] || day;
};

const groupByDay = (schedule: Schedule[]): Record<string, Schedule[]> => {
  const grouped: Record<string, Schedule[]> = {};
  schedule.forEach(item => {
    if (!grouped[item.day_of_week]) {
      grouped[item.day_of_week] = [];
    }
    grouped[item.day_of_week].push(item);
  });
  return grouped;
};

interface ChildScheduleViewProps {
  schedule: Schedule[];
  loading: boolean;
}

export const ChildScheduleView = ({ schedule, loading }: ChildScheduleViewProps) => {
  const groupedSchedule = groupByDay(schedule);
  const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        {[...Array(3)].map((_, i) => (
          <div key={i} style={styles.loadingCard}>
            <div style={styles.loadingHeader} />
            <div style={styles.loadingRow} />
            <div style={styles.loadingRow} />
          </div>
        ))}
      </div>
    );
  }

  if (schedule.length === 0) {
    return (
      <div style={styles.emptyState}>
        <Calendar size={48} color="#D1D5DB" style={styles.emptyIcon} />
        <p style={styles.emptyTitle}>Сабақ кестесі жоқ</p>
        <p style={styles.emptyText}>Әлі сабақ кестесі құрылмаған</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {daysOrder.map(day => {
        const lessons = groupedSchedule[day] || [];
        if (lessons.length === 0) return null;

        return (
          <div key={day} style={styles.dayCard}>
            <div style={styles.dayHeader}>
              <h3 style={styles.dayTitle}>
                <Calendar size={18} />
                {getDayName(day)}
              </h3>
            </div>
            <div style={styles.lessonList}>
              {lessons
                .sort((a, b) => a.lesson_number - b.lesson_number)
                .map((lesson) => (
                  <div
                    key={lesson.id}
                    style={styles.lessonItem}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#F9FAFB';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div style={styles.lessonContent}>
                      <div style={styles.lessonNumber}>
                        <span style={styles.lessonNumberText}>{lesson.lesson_number}</span>
                      </div>
                      <div style={styles.lessonInfo}>
                        <div style={styles.lessonSubject}>{lesson.subject_name || 'Пән көрсетілмеген'}</div>
                        <div style={styles.lessonDetails}>
                          <span style={styles.detailItem}>
                            <Clock size={14} />
                            {lesson.start_time || '--:--'} - {lesson.end_time || '--:--'}
                          </span>
                          <span style={styles.detailItem}>
                            <User size={14} />
                            {lesson.teacher_name || 'Мұғалім көрсетілмеген'}
                          </span>
                        </div>
                      </div>
                      <div style={styles.lessonClass}>
                        <BookOpen size={14} />
                        {lesson.class_name}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};