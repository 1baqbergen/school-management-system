import { useEffect, useState } from 'react';
import { userStore } from '../../store/userStore';
import { scheduleApi } from '../../features/schedule/api/scheduleApi';
import type { CreateScheduleDto, Schedule, ScheduleMeta } from '../../features/schedule/types/schedule.types';
import ScheduleTable from '../../features/schedule/components/ScheduleTable';
import AddScheduleModal from '../../features/schedule/components/AddScheduleModal';
import WeeklySchedule from '../../features/schedule/components/WeeklySchedule';

const startOfWeekMonday = (d: Date) => {
  const date = new Date(d);
  const day = date.getDay(); // 0=Sun..6=Sat
  const diff = (day === 0 ? -6 : 1) - day; // Monday as start
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
};

const SchedulePage = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [meta, setMeta] = useState<ScheduleMeta | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editing, setEditing] = useState<Schedule | null>(null);

  const [weekStart, setWeekStart] = useState(() => startOfWeekMonday(new Date()));

  const user = userStore((state) => state.user);
  
  const role = user?.role; // 'admin' | 'teacher' | 'student'
  const isAdmin = role === 'admin';
  const isTeacherOrStudent = role === 'teacher' || role === 'student';

  const fetchSchedules = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await scheduleApi.getAll(); // ✅ backend already returns names + ids
      let filtered = data;
      if (role === 'teacher') {
  filtered = data.filter(item => Number(item.teacher_user_id) === Number(user?.id));
} else if (role === 'student') {
  const studentClassId = Number((user as any).class_id);
  if (studentClassId) {
    filtered = data.filter(item => Number(item.class_id) === studentClassId);
  } else {
    filtered = [];
  }
}

      // сортировка
      const dayOrder: Record<string, number> = { Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5 };
      filtered.sort((a, b) => {
        if (a.day_of_week === b.day_of_week) return a.lesson_number - b.lesson_number;
        return (dayOrder[a.day_of_week] ?? 99) - (dayOrder[b.day_of_week] ?? 99);
      });

      setSchedules(filtered);
    } catch (err) {
      setError('Не удалось загрузить расписание');
      console.error('Error loading schedules:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMetaIfNeeded = async () => {
    if (!isAdmin) return;
    try {
      const m = await scheduleApi.getMeta();
      setMeta(m);
    } catch (e) {
      console.error('Meta error:', e);
      setMeta(null);
    }
  };

  useEffect(() => {
    fetchSchedules();
    fetchMetaIfNeeded();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, role]);

  const openCreate = async () => {
    await fetchMetaIfNeeded();
    setModalMode('create');
    setEditing(null);
    setIsModalOpen(true);
  };

  const openEdit = async (item: Schedule) => {
    await fetchMetaIfNeeded();
    setModalMode('edit');
    setEditing(item);
    setIsModalOpen(true);
  };

  const handleSave = async (dto: CreateScheduleDto) => {
    if (modalMode === 'create') {
      await scheduleApi.create(dto);
    } else if (modalMode === 'edit' && editing) {
      await scheduleApi.update(editing.id, dto);
    }
    await fetchSchedules();
  };

  const handleDelete = async (id: number) => {
    await scheduleApi.delete(id);
    await fetchSchedules();
  };

  const onPrevWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    setWeekStart(d);
  };

  const onNextWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    setWeekStart(d);
  };

  const styles = {
    page: { display: 'flex', flexDirection: 'column' as const, gap: '18px' },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '12px',
    },
    title: { fontSize: '28px', fontWeight: 800, color: '#111827', margin: 0 },
    addButton: {
      padding: '10px 16px',
      backgroundColor: '#3B82F6',
      color: '#fff',
      border: 'none',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: 800,
      cursor: 'pointer',
    },
    loading: { padding: '48px', textAlign: 'center' as const, color: '#6B7280' },
    error: {
      padding: '18px',
      backgroundColor: '#FEF2F2',
      border: '1px solid #FEE2E2',
      borderRadius: '12px',
      color: '#991B1B',
      textAlign: 'center' as const,
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Сабақ кестесі</h1>
        {isAdmin && (
          <button style={styles.addButton} onClick={openCreate}>
            + Сабақ Қосу
          </button>
        )}
      </div>

      {isLoading && <div style={styles.loading}>Кестені жүктелуде...</div>}
      {error && !isLoading && <div style={styles.error}>{error}</div>}

      {!isLoading && !error && (
        <>
          {/* ✅ ADMIN: таблица */}
          {isAdmin && (
            <ScheduleTable
              schedules={schedules}
              userRole={role}
              onDelete={handleDelete}
              onEdit={openEdit}
            />
          )}

          {/* ✅ TEACHER/STUDENT: апталық вертикалды view */}
          {isTeacherOrStudent && (
            <WeeklySchedule
              schedules={schedules}
              weekStart={weekStart}
              onPrevWeek={onPrevWeek}
              onNextWeek={onNextWeek}
            />
          )}
        </>
      )}

      {isAdmin && (
        <AddScheduleModal
          isOpen={isModalOpen}
          mode={modalMode}
          meta={meta}
          initial={editing}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default SchedulePage;