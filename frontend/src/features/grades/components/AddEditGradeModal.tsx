// src/features/grades/components/AddEditGradeModal.tsx
import { useState, useEffect, useMemo } from 'react';
import { GRADE_VALUES, generateDefaultComment } from '../types/grade.types';
import type { Grade, CreateGradeDto, GradeMeta } from '../types/grade.types';
import { gradeApi } from '../api/gradeApi';

interface AddEditGradeModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  grade?: Grade | null;
  meta: GradeMeta | null;
  userRole: string | undefined;
  onClose: () => void;
  onSave: (data: CreateGradeDto) => Promise<void>;
}

const AddEditGradeModal = ({
  isOpen,
  mode,
  grade,
  meta,
  userRole,
  onClose,
  onSave,
}: AddEditGradeModalProps) => {
  const isTeacher = userRole === 'teacher';
  const isAdmin = userRole === 'admin' || userRole === 'director';

  const [formData, setFormData] = useState<CreateGradeDto>({
    student_id: 0,
    subject_id: 0,
    grade_value: 5,
    grade_date: new Date().toISOString().split('T')[0],
    comment: '',
  });

  const [selectedTeacherId, setSelectedTeacherId] = useState<number>(0);

  const [filteredSubjects, setFilteredSubjects] = useState<Array<{ id: number; name: string }>>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ====== defaults ======
  const defaultStudentId = useMemo(() => meta?.students?.[0]?.id ?? 0, [meta]);
  const defaultSubjectIdFromMeta = useMemo(() => meta?.subjects?.[0]?.id ?? 0, [meta]);
  const defaultTeacherId = useMemo(() => meta?.teachers?.[0]?.id ?? 0, [meta]);

  // ====== init: teacher select default (admin only) ======
  useEffect(() => {
    if (!isOpen) return;

    if (isAdmin) {
      // edit режимде grade.teacher_id болса соны қоямыз
      const initialTeacherId = (mode === 'edit' && grade?.teacher_id) ? grade.teacher_id : defaultTeacherId;
      setSelectedTeacherId(initialTeacherId || 0);
    } else {
      setSelectedTeacherId(0);
    }
  }, [isOpen, isAdmin, mode, grade?.teacher_id, defaultTeacherId]);

  // ====== load subjects for selected teacher (admin only) ======
  useEffect(() => {
    const load = async () => {
      if (!isOpen) return;

      // Teacher роль: subjects meta арқылы already filtered келуі керек (backend /meta teacher -> teacher subjects)
      if (isTeacher) {
        setFilteredSubjects(meta?.subjects || []);
        return;
      }

      // Admin роль: teacher таңдалмайынша пән жоқ (немесе meta.subjects көрсете беруге болады — бірақ сенің талабың бойынша teacher-ге тәуелді)
      if (isAdmin) {
        if (!selectedTeacherId) {
          setFilteredSubjects([]);
          return;
        }
        try {
          const data = await gradeApi.getSubjectsByTeacher(selectedTeacherId);
          const subs = data?.subjects || [];
          setFilteredSubjects(subs);

          // subject default: егер қазір subject_id дұрыс емес болса, бірінші пәнге ауыстырамыз
          setFormData(prev => {
            const exists = subs.some(s => s.id === prev.subject_id);
            return {
              ...prev,
              subject_id: exists ? prev.subject_id : (subs[0]?.id ?? 0),
            };
          });
        } catch (e) {
          console.error('Failed to load teacher subjects', e);
          setFilteredSubjects([]);
        }
        return;
      }

      // Student роль (мұнда add grade болмайды, бірақ компонент универсал)
      setFilteredSubjects(meta?.subjects || []);
    };

    load();
  }, [isOpen, isTeacher, isAdmin, selectedTeacherId, meta?.subjects]);

  // ====== init formData (SINGLE useEffect) ======
  useEffect(() => {
    if (!isOpen) return;

    if (mode === 'edit' && grade) {
      setFormData({
        student_id: grade.student_id,
        subject_id: grade.subject_id,
        grade_value: grade.grade_value,
        grade_date: grade.grade_date,
        comment: grade.comment || '',
        // teacher_id edit кезінде де керек емес (backend edit teacher_id өзгерпейді деп алсақ)
      });
      return;
    }

    // create mode defaults
    setFormData({
      student_id: defaultStudentId,
      subject_id: isAdmin ? 0 : defaultSubjectIdFromMeta, // admin үшін teacher таңдағаннан кейін subject келеді
      grade_value: 5,
      grade_date: new Date().toISOString().split('T')[0],
      comment: '',
    });
  }, [isOpen, mode, grade, defaultStudentId, defaultSubjectIdFromMeta, isAdmin]);

  // ====== auto comment ======
  useEffect(() => {
    if (!isOpen) return;
    const defaultComment = generateDefaultComment(formData.grade_value);
    setFormData(prev => ({
      ...prev,
      comment: defaultComment,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.grade_value, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]:
        name === 'student_id' || name === 'subject_id' || name === 'grade_value'
          ? parseInt(value) || 0
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!formData.student_id) throw new Error('Please select a student');

      // subject list: teacher/admin кезінде фильтрленген тізіммен тексереміз
      const currentSubjects = isAdmin || isTeacher ? filteredSubjects : (meta?.subjects || []);
      if (!formData.subject_id) throw new Error('Please select a subject');
      if (currentSubjects.length > 0 && !currentSubjects.some(s => s.id === formData.subject_id)) {
        throw new Error('Selected subject is not available');
      }

      if (formData.grade_value < 0 || formData.grade_value > 10) throw new Error('Grade must be between 0 and 10');
      if (!formData.grade_date) throw new Error('Please select a date');

      const payload: CreateGradeDto = { ...formData };

      // ✅ admin/director teacher_id міндетті
      if (isAdmin) {
        if (!selectedTeacherId) throw new Error('Please select a teacher');
        payload.teacher_id = selectedTeacherId;
      } else {
        // ✅ teacher/student teacher_id жібермейміз
        delete (payload as any).teacher_id;
      }

      await onSave(payload);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Қате орын алды');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

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
    },
    modal: {
      backgroundColor: '#ffffff',
      borderRadius: '24px',
      padding: '32px',
      width: '90%',
      maxWidth: '500px',
      maxHeight: '90vh',
      overflowY: 'auto' as const,
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#0F172A',
      margin: '0 0 8px 0',
    },
    subtitle: {
      fontSize: '14px',
      color: '#64748B',
      margin: '0 0 24px 0',
    },
    form: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '20px',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '6px',
    },
    label: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#334155',
    },
    select: {
      padding: '12px',
      fontSize: '14px',
      border: '1px solid #E2E8F0',
      borderRadius: '12px',
      outline: 'none',
      backgroundColor: '#ffffff',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
    },
    input: {
      padding: '12px',
      fontSize: '14px',
      border: '1px solid #E2E8F0',
      borderRadius: '12px',
      outline: 'none',
      transition: 'all 0.2s ease-in-out',
    },
    textarea: {
      padding: '12px',
      fontSize: '14px',
      border: '1px solid #E2E8F0',
      borderRadius: '12px',
      outline: 'none',
      minHeight: '80px',
      resize: 'vertical' as const,
      fontFamily: 'inherit',
    },
    gradeGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: '8px',
    },
    gradeButton: {
      padding: '12px 0',
      fontSize: '16px',
      fontWeight: '600',
      border: '2px solid #E2E8F0',
      borderRadius: '12px',
      backgroundColor: '#ffffff',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
    },
    gradeButtonActive: {
      border: '2px solid #3B82F6',
      backgroundColor: '#EFF6FF',
      color: '#3B82F6',
    },
    actions: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '12px',
      marginTop: '24px',
    },
    button: {
      padding: '12px 24px',
      fontSize: '14px',
      fontWeight: '600',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      border: 'none',
    },
    cancelButton: {
      backgroundColor: '#F1F5F9',
      color: '#475569',
    },
    saveButton: {
      backgroundColor: '#3B82F6',
      color: '#ffffff',
    },
    error: {
      padding: '12px',
      backgroundColor: '#FEF2F2',
      border: '1px solid #FEE2E2',
      borderRadius: '12px',
      color: '#B91C1C',
      fontSize: '14px',
    },
  };

  const subjectsForSelect = (isAdmin || isTeacher) ? filteredSubjects : (meta?.subjects || []);
  const noSubjects = subjectsForSelect.length === 0;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <h2 style={styles.title}>
          {mode === 'create' ? 'Жаңа Баға Қосу' : 'Бағаны өзгерту'}
        </h2>
        <p style={styles.subtitle}>
          {mode === 'create' ? 'Баға туралы ақпаратты енгізіңіз' : 'Баға туралы ақпаратты жаңарту'}
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* ✅ ADMIN: Teacher Select */}
          {isAdmin && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Мұғалім</label>
              <select
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(parseInt(e.target.value) || 0)}
                style={styles.select}
                required
                disabled={mode === 'edit'} // edit режимде teacher ауыстырмаймыз (қаласаң алып тастайсың)
              >
                <option value={0}>Мұғалімді таңдаңыз</option>
                {meta?.teachers?.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Student Select */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Оқушы</label>
            <select
              name="student_id"
              value={formData.student_id}
              onChange={handleChange}
              style={styles.select}
              disabled={mode === 'edit' && isTeacher}
              required
            >
              <option value={0}>Студент таңдаңыз</option>
              {meta?.students?.map(student => (
                <option key={student.id} value={student.id}>
                  {student.name} ({student.class_name})
                </option>
              ))}
            </select>
          </div>

          {/* Subject Select */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Пән</label>
            <select
              name="subject_id"
              value={formData.subject_id}
              onChange={handleChange}
              style={styles.select}
              disabled={(mode === 'edit' && isTeacher) || noSubjects}
              required
            >
              <option value={0}>
                {noSubjects ? 'Пәндер жоқ' : 'Пән таңдау'}
              </option>
              {subjectsForSelect.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          {/* Grade Value */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Баға (0-10)</label>
            <div style={styles.gradeGrid}>
              {GRADE_VALUES.map(value => (
                <button
                  key={value}
                  type="button"
                  style={{
                    ...styles.gradeButton,
                    ...(formData.grade_value === value ? styles.gradeButtonActive : {}),
                  }}
                  onClick={() => setFormData(prev => ({ ...prev, grade_value: value }))}
                  onMouseEnter={(e) => {
                    if (formData.grade_value !== value) {
                      e.currentTarget.style.borderColor = '#94A3B8';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (formData.grade_value !== value) {
                      e.currentTarget.style.borderColor = '#E2E8F0';
                    }
                  }}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Күні</label>
            <input
              type="date"
              name="grade_date"
              value={formData.grade_date}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          {/* Comment */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Пікір</label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              style={styles.textarea}
              placeholder="Пікірді енгізіңіз (міндетті емес)"
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.actions}>
            <button
              type="button"
              style={{ ...styles.button, ...styles.cancelButton }}
              onClick={onClose}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E2E8F0'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F1F5F9'; }}
            >
              Бас тарту
            </button>

            <button
              type="submit"
              disabled={isLoading || noSubjects}
              style={{
                ...styles.button,
                ...styles.saveButton,
                opacity: (isLoading || noSubjects) ? 0.7 : 1,
                cursor: (isLoading || noSubjects) ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => {
                if (!isLoading && !noSubjects) e.currentTarget.style.backgroundColor = '#2563EB';
              }}
              onMouseLeave={(e) => {
                if (!isLoading && !noSubjects) e.currentTarget.style.backgroundColor = '#3B82F6';
              }}
            >
              {isLoading ? 'Saving...' : mode === 'create' ? 'Жасау' : 'Өзгерісті Сақтау'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditGradeModal;