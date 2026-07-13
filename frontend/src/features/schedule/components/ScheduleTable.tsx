import type { Schedule, } from '../types/schedule.types';
import { DAY_DISPLAY_NAMES } from '../types/schedule.types';

interface Props {
  schedules: Schedule[];
  userRole?: string;
  onDelete: (id: number) => Promise<void>;
  onEdit: (item: Schedule) => void;
}

const ScheduleTable = ({ schedules, userRole, onDelete, onEdit }: Props) => {
  const isAdmin = userRole === 'admin';

  const styles = {
    box: {
      border: '1px solid #E5E7EB',
      borderRadius: '12px',
      overflow: 'hidden',
      backgroundColor: '#fff',
      boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
    },
    table: { width: '100%', borderCollapse: 'collapse' as const, fontSize: '14px' },
    th: {
      textAlign: 'left' as const,
      padding: '14px 16px',
      backgroundColor: '#F9FAFB',
      color: '#374151',
      fontWeight: 700,
      borderBottom: '1px solid #E5E7EB',
      whiteSpace: 'nowrap' as const,
    },
    td: { padding: '12px 16px', borderBottom: '1px solid #F3F4F6', color: '#111827' },
    row: { transition: 'background-color 0.2s ease' },
    actions: { display: 'flex', gap: '8px' },
    btn: {
      padding: '6px 10px',
      borderRadius: '8px',
      fontSize: '12px',
      fontWeight: 700,
      border: 'none',
      cursor: 'pointer',
    },
    edit: { backgroundColor: '#DBEAFE', color: '#1D4ED8' },
    del: { backgroundColor: '#FEE2E2', color: '#B91C1C' },
    empty: { padding: '36px', textAlign: 'center' as const, color: '#6B7280' },
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Өшіруге сенімдісіз бе?')) {
      await onDelete(id);
    }
  };

  if (!schedules.length) return <div style={styles.box}><div style={styles.empty}>Кесте бос.</div></div>;

  return (
    <div style={styles.box}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Күн</th>
            <th style={styles.th}>Сабақ #</th>
            <th style={styles.th}>Басталуы</th>
            <th style={styles.th}>Аяқталуы</th>
            <th style={styles.th}>Сынып</th>
            <th style={styles.th}>Мұғалім</th>
            <th style={styles.th}>Пән</th>
            {isAdmin && <th style={styles.th}>Әрекеттер</th>}
          </tr>
        </thead>
        <tbody>
          {schedules.map((s) => (
            <tr
              key={s.id}
              style={styles.row}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <td style={styles.td}>{DAY_DISPLAY_NAMES[s.day_of_week] ?? s.day_of_week}</td>
              <td style={styles.td}>{s.lesson_number}</td>
              <td style={styles.td}>{s.start_time}</td>
              <td style={styles.td}>{s.end_time}</td>
              <td style={styles.td}>{s.class_name ?? `Class #${s.class_id}`}</td>
              <td style={styles.td}>{s.teacher_name ?? `Teacher #${s.teacher_id}`}</td>
              <td style={styles.td}>{s.subject_name ?? `Subject #${s.subject_id}`}</td>

              {isAdmin && (
                <td style={styles.td}>
                  <div style={styles.actions}>
                    <button style={{ ...styles.btn, ...styles.edit }} onClick={() => onEdit(s)}>
                      Өзгерту
                    </button>
                    <button style={{ ...styles.btn, ...styles.del }} onClick={() => handleDelete(s.id)}>
                      Өшіру
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleTable;