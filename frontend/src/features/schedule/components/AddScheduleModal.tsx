// C:\school-system\frontend\src\features\schedule\components\AddScheduleModal.tsx
import { useEffect, useMemo, useState } from 'react';
import type { CreateScheduleDto, Schedule, ScheduleMeta } from '../types/schedule.types';
import { DAYS_OF_WEEK as DAYS } from '../types/schedule.types';
import { gradeApi } from '../../grades/api/gradeApi';

type Mode = 'create' | 'edit';

interface Props {
  isOpen: boolean;
  mode: Mode;
  meta: ScheduleMeta | null;
  initial?: Schedule | null;
  onClose: () => void;
  onSave: (data: CreateScheduleDto) => Promise<void>;
}

// 🔥 Сабақ уақыттары (Lesson times)
const lessonTimes: Record<number, { start: string; end: string }> = {
  1: { start: '08:00', end: '08:45' },
  2: { start: '08:50', end: '09:35' },
  3: { start: '09:40', end: '10:25' },
  4: { start: '10:40', end: '11:25' },
  5: { start: '11:30', end: '12:15' },
  6: { start: '12:30', end: '13:15' },
  7: { start: '13:20', end: '14:05' },
  8: { start: '14:10', end: '14:55' },
};

const AddScheduleModal = ({ isOpen, mode, meta, initial, onClose, onSave }: Props) => {
  const [formData, setFormData] = useState<CreateScheduleDto>({
    class_id: 0,
    teacher_id: 0,
    subject_id: 0,
    day_of_week: 'Monday',
    lesson_number: 1,
    start_time: '08:00',
    end_time: '08:45',
  });

  // 🔥 Мұғалімнің пәндері үшін state
  const [teacherSubjects, setTeacherSubjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // initial -> form
  useEffect(() => {
    if (!isOpen) return;

    if (mode === 'edit' && initial) {
      setFormData({
        class_id: Number(initial.class_id),
        teacher_id: Number(initial.teacher_id),
        subject_id: Number(initial.subject_id),
        day_of_week: initial.day_of_week,
        lesson_number: Number(initial.lesson_number),
        start_time: initial.start_time,
        end_time: initial.end_time,
      });
      return;
    }

    // create defaults
    setFormData({
      class_id: meta?.classes?.[0]?.id ?? 0,
      teacher_id: meta?.teachers?.[0]?.id ?? 0,
      subject_id: meta?.subjects?.[0]?.id ?? 0,
      day_of_week: 'Monday',
      lesson_number: 1,
      start_time: '08:00',
      end_time: '08:45',
    });
  }, [isOpen, mode, initial, meta]);

  // 🔥 Мұғалім өзгергенде, оның пәндерін жүктеу (Grades логикасы сияқты)
  useEffect(() => {
    if (!formData.teacher_id || formData.teacher_id === 0) {
      setTeacherSubjects([]);
      return;
    }

    const loadSubjects = async () => {
      try {
        console.log('📚 Loading subjects for teacher:', formData.teacher_id);
        const data = await gradeApi.getSubjectsByTeacher(formData.teacher_id);
        const subs = data?.subjects || [];

        console.log('✅ Loaded subjects:', subs);
        setTeacherSubjects(subs);

        // Егер ағымдағы subject_id жүктелген пәндерде жоқ болса, бірінші пәнге ауыстыру
        setFormData(prev => {
          const exists = subs.some(s => s.id === prev.subject_id);
          return {
            ...prev,
            subject_id: exists ? prev.subject_id : (subs[0]?.id ?? 0),
          };
        });
      } catch (error) {
        console.error('❌ Error loading subjects:', error);
        setTeacherSubjects([]);
      }
    };

    loadSubjects();
  }, [formData.teacher_id]);

  // 🔥 Сабақ нөмірі өзгергенде, уақытты автоматты түрде қою
  useEffect(() => {
    const lesson = lessonTimes[formData.lesson_number];
    
    if (lesson) {
      setFormData(prev => ({
        ...prev,
        start_time: lesson.start,
        end_time: lesson.end,
      }));
    }
  }, [formData.lesson_number]);

  const canRenderForm = useMemo(() => {
    if (mode === 'edit') return true;
    return !!meta;
  }, [mode, meta]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]:
        name === 'lesson_number' || name.endsWith('_id')
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!formData.class_id || !formData.teacher_id || !formData.subject_id) {
        setError('Сынып, Мұғалім және Пән таңдау міндетті');
        return;
      }
      await onSave(formData);
      onClose();
    } catch (err) {
      setError('Сақтау кезінде қате. Мәліметті тексеріңіз.');
      console.error('Save error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const styles = {
    overlay: {
      position: 'fixed' as const,
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    modal: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      padding: '28px',
      width: '92%',
      maxWidth: '560px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    },
    title: {
      fontSize: '22px',
      fontWeight: 700,
      color: '#111827',
      margin: 0,
    },
    subtitle: {
      fontSize: '13px',
      color: '#6B7280',
      margin: '6px 0 20px 0',
    },
    form: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '14px',
    },
    grid2: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '6px',
    },
    label: {
      fontSize: '13px',
      fontWeight: 600,
      color: '#374151',
    },
    input: {
      padding: '10px 12px',
      border: '1px solid #E5E7EB',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none',
      backgroundColor: '#fff',
    },
    inputDisabled: {
      padding: '10px 12px',
      border: '1px solid #E5E7EB',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none',
      backgroundColor: '#F3F4F6',
      color: '#6B7280',
    },
    select: {
      padding: '10px 12px',
      border: '1px solid #E5E7EB',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none',
      backgroundColor: '#fff',
      cursor: 'pointer',
    },
    error: {
      padding: '12px',
      backgroundColor: '#FEF2F2',
      border: '1px solid #FEE2E2',
      borderRadius: '8px',
      color: '#991B1B',
      fontSize: '14px',
    },
    actions: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '10px',
      marginTop: '6px',
    },
    btn: {
      padding: '10px 16px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: 600,
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    cancel: { backgroundColor: '#F3F4F6', color: '#374151' },
    save: { backgroundColor: '#3B82F6', color: '#fff' },
    skeleton: {
      padding: '14px',
      backgroundColor: '#F9FAFB',
      border: '1px dashed #E5E7EB',
      borderRadius: '10px',
      color: '#6B7280',
      fontSize: '14px',
    },
    infoText: {
      fontSize: '12px',
      color: '#6B7280',
      marginTop: '4px',
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.title}>
          {mode === 'create' ? 'Сабақ қосу' : 'Сабақты өңдеу'}
        </h2>
        <p style={styles.subtitle}>
          {mode === 'create' ? 'Жаңа сабақ қосу' : 'Сабақ мәліметін өзгерту'}
        </p>

        {!canRenderForm && (
          <div style={styles.skeleton}>
            Мәліметтер жүктелмеді. API қолжетімді екенін тексеріңіз.
          </div>
        )}

        {canRenderForm && (
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.grid2}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Сынып</label>
                <select
                  name="class_id"
                  value={formData.class_id}
                  onChange={handleChange}
                  style={styles.select}
                  required
                >
                  <option value={0}>Сынып таңдаңыз</option>
                  {(meta?.classes ?? []).map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Мұғалім</label>
                <select
                  name="teacher_id"
                  value={formData.teacher_id}
                  onChange={handleChange}
                  style={styles.select}
                  required
                >
                  <option value={0}>Мұғалім таңдаңыз</option>
                  {(meta?.teachers ?? []).map(t => (
                    <option key={t.id} value={t.id}>{t.full_name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={styles.grid2}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Пән</label>
                <select
                  name="subject_id"
                  value={formData.subject_id}
                  onChange={handleChange}
                  style={styles.select}
                  required
                  disabled={!formData.teacher_id}
                >
                  <option value={0}>
                    {!formData.teacher_id 
                      ? 'Алдымен мұғалім таңдаңыз' 
                      : teacherSubjects.length === 0 
                        ? 'Пән жоқ' 
                        : 'Пән таңдаңыз'}
                  </option>
                  {teacherSubjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                {formData.teacher_id && teacherSubjects.length === 0 && (
                  <div style={styles.infoText}>
                    ⚠️ Бұл мұғалімге пән тағайындалмаған
                  </div>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Күн</label>
                <select
                  name="day_of_week"
                  value={formData.day_of_week}
                  onChange={handleChange}
                  style={styles.select}
                  required
                >
                  {DAYS.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={styles.grid2}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Сабақ нөмірі</label>
                <select
                  name="lesson_number"
                  value={formData.lesson_number}
                  onChange={handleChange}
                  style={styles.select}
                  required
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num}>
                      {num}-сабақ ({lessonTimes[num]?.start} - {lessonTimes[num]?.end})
                    </option>
                  ))}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Басталуы / Аяқталуы</label>
                <div style={styles.grid2}>
                  <input
                    type="time"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                  <input
                    type="time"
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>
                
              </div>
            </div>

            {error && <div style={styles.error}>{error}</div>}

            <div style={styles.actions}>
              <button
                type="button"
                style={{ ...styles.btn, ...styles.cancel }}
                onClick={onClose}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#E5E7EB';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#F3F4F6';
                }}
              >
                Болдырмау
              </button>
              <button
                type="submit"
                disabled={isLoading || !formData.teacher_id || !formData.subject_id}
                style={{
                  ...styles.btn,
                  ...styles.save,
                  opacity: (isLoading || !formData.teacher_id || !formData.subject_id) ? 0.7 : 1,
                  cursor: (isLoading || !formData.teacher_id || !formData.subject_id) ? 'not-allowed' : 'pointer',
                }}
                onMouseEnter={(e) => {
                  if (!isLoading && formData.teacher_id && formData.subject_id) {
                    e.currentTarget.style.backgroundColor = '#2563EB';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#3B82F6';
                }}
              >
                {isLoading ? 'Сақталуда...' : 'Сақтау'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddScheduleModal;