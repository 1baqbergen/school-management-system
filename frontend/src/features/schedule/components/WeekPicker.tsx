// src/features/schedule/components/WeekPicker.tsx
interface WeekPickerProps {
  weekStart: Date;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
}

const WeekPicker = ({ weekStart, onPrevWeek, onNextWeek, onToday }: WeekPickerProps) => {
  const formatWeekRange = (start: Date) => {
    const startDate = new Date(start);
    const endDate = new Date(start);
    endDate.setDate(endDate.getDate() + 4); // Пятница

    
    const startStr = startDate.toLocaleDateString('en-US', { day: '2-digit', month: 'long' });
    const endStr = endDate.toLocaleDateString('en-US', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
    
    return `${startStr} – ${endStr}`;
  };

  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '32px',
      padding: '8px 12px',
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      border: '1px solid #F0F2F5',
    },
    weekDisplay: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1E293B',
      letterSpacing: '-0.01em',
    },
    controls: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
    },
    button: {
      padding: '8px 16px',
      backgroundColor: 'transparent',
      border: '1px solid #E2E8F0',
      borderRadius: '40px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#475569',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      outline: 'none',
    },
    todayButton: {
      backgroundColor: '#F8FAFC',
      border: '1px solid #E2E8F0',
      color: '#1E293B',
      fontWeight: '600',
    },
    arrowButton: {
      padding: '8px 14px',
      fontSize: '16px',
    },
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.weekDisplay}>{formatWeekRange(weekStart)}</div>
      <div style={styles.controls}>
        <button
          style={{ ...styles.button, ...styles.arrowButton }}
          onClick={onPrevWeek}
          onKeyDown={(e) => handleKeyDown(e, onPrevWeek)}
          aria-label="Өткен апта"
        >
          ←
        </button>
        <button
          style={{ ...styles.button, ...styles.todayButton }}
          onClick={onToday}
          onKeyDown={(e) => handleKeyDown(e, onToday)}
          aria-label="Осы апта"
        >
          Today
        </button>
        <button
          style={{ ...styles.button, ...styles.arrowButton }}
          onClick={onNextWeek}
          onKeyDown={(e) => handleKeyDown(e, onNextWeek)}
          aria-label="Келесі апта"
        >
          →
        </button>
      </div>
    </div>
  );
};

export default WeekPicker;