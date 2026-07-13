// src/features/homeworks/components/ViewSubmissionModal.tsx
import type { Submission } from '../types/homework.types';

interface ViewSubmissionModalProps {
  isOpen: boolean;
  submission: Submission | null;
  onClose: () => void;
}

const ViewSubmissionModal = ({ isOpen, submission, onClose }: ViewSubmissionModalProps) => {
  if (!isOpen || !submission) return null;

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
      backgroundColor: '#FFFFFF',
      borderRadius: '20px',
      padding: '32px',
      width: '90%',
      maxWidth: '600px',
      maxHeight: '90vh',
      overflowY: 'auto' as const,
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    },
    title: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#0F172A',
      margin: '0 0 8px 0',
    },
    subtitle: {
      fontSize: '14px',
      color: '#64748B',
      marginBottom: '24px',
      paddingBottom: '16px',
      borderBottom: '1px solid #F0F2F5',
    },
    section: {
      marginBottom: '20px',
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#334155',
      marginBottom: '12px',
    },
    content: {
      backgroundColor: '#F8FAFC',
      padding: '16px',
      borderRadius: '12px',
      fontSize: '14px',
      color: '#1E293B',
      lineHeight: '1.6',
      whiteSpace: 'pre-wrap' as const,
    },
    fileLink: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 16px',
      backgroundColor: '#EFF6FF',
      borderRadius: '10px',
      color: '#3B82F6',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: '500',
    },
    gradeInfo: {
      backgroundColor: '#FEF3C7',
      padding: '12px 16px',
      borderRadius: '12px',
      marginTop: '20px',
    },
    gradeValue: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#92400E',
    },
    gradeComment: {
      fontSize: '14px',
      color: '#78350F',
      marginTop: '8px',
    },
    button: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#F1F5F9',
      border: 'none',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#475569',
      cursor: 'pointer',
      marginTop: '24px',
      transition: 'all 0.2s ease',
    },
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <h2 style={styles.title}>Менің жұмысым</h2>
        <div style={styles.subtitle}>
          {submission.submitted_at ? formatDate(submission.submitted_at) : 'Күні белгісіз'}
        </div>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>Жұмыс мәтіні:</div>
          <div style={styles.content}>
            {submission.content || 'Мәтін көрсетілмеген'}
          </div>
        </div>

        {submission.file_url && (
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Тіркелген файл:</div>
            <a href={submission.file_url} target="_blank" rel="noopener noreferrer" style={styles.fileLink}>
              Файлды ашу
            </a>
          </div>
        )}

        {submission.grade !== undefined && submission.grade !== null && (
          <div style={styles.gradeInfo}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#92400E' }}>Бағалау:</span>
              <span style={styles.gradeValue}>{submission.grade}</span>
            </div>
            {submission.grade_comment && (
              <div style={styles.gradeComment}>
                <strong>Мұғалімнің пікірі:</strong> {submission.grade_comment}
              </div>
            )}
          </div>
        )}

        <button
          style={styles.button}
          onClick={onClose}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#E2E8F0';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#F1F5F9';
          }}
        >
          Жабу
        </button>
      </div>
    </div>
  );
};

export default ViewSubmissionModal;