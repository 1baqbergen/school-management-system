// src/features/schedule/components/WeeklySchedule.tsx
import { useState, useEffect, useRef } from 'react';
import type { Schedule } from '../types/schedule.types';
import WeekPicker from './WeekPicker';
import DayColumn from './DayColumn';
import { userStore } from '../../../store/userStore';

const DAY_ORDER: Array<Schedule['day_of_week']> = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const DAY_LABEL: Record<Schedule['day_of_week'], string> = {
  Monday: 'Дүйсенбі',
  Tuesday: 'Сейсенбі',
  Wednesday: 'Сәрсенбі',
  Thursday: 'Бейсенбі',
  Friday: 'Жұма',
};

interface Props {
  schedules: Schedule[];
  weekStart: Date;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}

export default function WeeklySchedule({ schedules, weekStart, onPrevWeek, onNextWeek }: Props) {
  const [groupedLessons, setGroupedLessons] = useState<Record<string, Schedule[]>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const user = userStore((state) => state.user);
  const userRole = user?.role?.toLowerCase();

  // Группируем и сортируем уроки при изменении schedules
  useEffect(() => {
    const grouped: Record<string, Schedule[]> = {};
    
    // Инициализируем пустые массивы для всех дней
    for (const day of DAY_ORDER) {
      grouped[day] = [];
    }
    
    // Группируем уроки по дням
    for (const schedule of schedules) {
      if (grouped[schedule.day_of_week]) {
        grouped[schedule.day_of_week].push(schedule);
      }
    }
    
    // Сортируем уроки внутри каждого дня по lesson_number
    for (const day of DAY_ORDER) {
      grouped[day].sort((a, b) => a.lesson_number - b.lesson_number);
    }
    
    setGroupedLessons(grouped);
  }, [schedules]);

  const handleToday = () => {
    const today = new Date();
    const day = today.getDay(); // 0 = Sunday, 1 = Monday, ...
    const diff = day === 0 ? -6 : 1 - day; // Adjust to Monday
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    monday.setHours(0, 0, 0, 0);
    
    // Вычисляем разницу в неделях и вызываем соответствующие функции
    const weeksDiff = Math.round((monday.getTime() - weekStart.getTime()) / (7 * 24 * 60 * 60 * 1000));
    
    if (weeksDiff > 0) {
      for (let i = 0; i < weeksDiff; i++) onNextWeek();
    } else if (weeksDiff < 0) {
      for (let i = 0; i < Math.abs(weeksDiff); i++) onPrevWeek();
    }

    // Прокручиваем контейнер в начало при смене недели
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
    }
  };

  // Прокручиваем контейнер в начало при смене недели через кнопки
  const handlePrevWeek = () => {
    onPrevWeek();
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
    }
  };

  const handleNextWeek = () => {
    onNextWeek();
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
    }
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '24px',
      width: '100%',
      maxWidth: '100%',
    },
    // Обертка с горизонтальным скроллом
    scrollWrapper: {
      width: '100%',
      overflowX: 'auto' as const,
      overflowY: 'visible' as const,
      // Скрываем скроллбар для Chrome/Safari (опционально, можно оставить для красоты)
      scrollbarWidth: 'thin' as const,
      msOverflowStyle: 'auto' as const,
    },
    // Внутренний grid с фиксированной минимальной шириной
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(5, minmax(300px, 1fr))', // Минимальная ширина 300px для каждой колонки
      gap: '20px',
      padding: '4px 4px 12px 4px', // Небольшой padding для тени
      minWidth: 'min-content', // Важно! Заставляет grid не сжиматься меньше контента
      width: 'max-content', // Альтернативный вариант
    },
  };

  // Стили для скроллбара (опционально, для красоты)
  const scrollbarStyles = `
    /* Для Chrome/Safari */
    .weekly-schedule-scroll::-webkit-scrollbar {
      height: 8px;
    }
    .weekly-schedule-scroll::-webkit-scrollbar-track {
      background: #F1F5F9;
      border-radius: 20px;
    }
    .weekly-schedule-scroll::-webkit-scrollbar-thumb {
      background: #CBD5E1;
      border-radius: 20px;
    }
    .weekly-schedule-scroll::-webkit-scrollbar-thumb:hover {
      background: #94A3B8;
    }
  `;

  return (
    <>
      <style>{scrollbarStyles}</style>
      <div style={styles.container}>
        <WeekPicker
          weekStart={weekStart}
          onPrevWeek={handlePrevWeek}
          onNextWeek={handleNextWeek}
          onToday={handleToday}
        />
        
        {/* Обертка со скроллом */}
        <div 
          ref={scrollContainerRef}
          style={styles.scrollWrapper}
          className="weekly-schedule-scroll"
        >
          {/* Grid с колонками дней */}
          <div style={styles.grid}>
            {DAY_ORDER.map((day) => (
              <DayColumn
                key={day}
                day={day}
                dayLabel={DAY_LABEL[day]}
                lessons={groupedLessons[day] || []}
                userRole={userRole}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}