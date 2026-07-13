import { useEffect, useState } from 'react';
import { subjectApi } from '../../features/subjects/api/subjectApi';
import type { Subject, CreateSubjectDto, UpdateSubjectDto } from '../../features/subjects/types/subject.types';
import SubjectModal from '../../features/subjects/components/SubjectModal';

const SubjectsPage = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  // Загрузка предметов
  const fetchSubjects = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await subjectApi.getAll();
      // Сортируем по дате создания (сначала новые) или по алфавиту
      data.sort((a, b) => a.name.localeCompare(b.name));
      setSubjects(data);
    } catch (err) {
      setError('Не удалось загрузить список предметов');
      console.error('Error loading subjects:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleOpenCreate = () => {
    setModalMode('create');
    setEditingSubject(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (subject: Subject) => {
    setModalMode('edit');
    setEditingSubject(subject);
    setIsModalOpen(true);
  };

  const handleSave = async (data: CreateSubjectDto | UpdateSubjectDto) => {
    if (modalMode === 'create') {
      await subjectApi.create(data as CreateSubjectDto);
    } else if (modalMode === 'edit' && editingSubject) {
      await subjectApi.update(editingSubject.id, data as UpdateSubjectDto);
    }
    await fetchSubjects(); // Перезагружаем список
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этот предмет?')) {
      try {
        await subjectApi.delete(id);
        await fetchSubjects();
      } catch (err) {
        console.error('Error deleting subject:', err);
        setError('Не удалось удалить предмет');
      }
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const styles = {
    page: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '24px',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      fontSize: '28px',
      fontWeight: '600',
      color: '#0f172a',
      margin: 0,
    },
    addButton: {
      padding: '10px 20px',
      backgroundColor: '#3b82f6',
      color: '#ffffff',
      border: 'none',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    tableContainer: {
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      overflow: 'hidden',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse' as const,
      fontSize: '14px',
    },
    th: {
      textAlign: 'left' as const,
      padding: '16px',
      backgroundColor: '#f8fafc',
      color: '#475569',
      fontWeight: '600',
      borderBottom: '1px solid #e2e8f0',
    },
    td: {
      padding: '14px 16px',
      borderBottom: '1px solid #f1f5f9',
      color: '#334155',
    },
    tr: {
      transition: 'background-color 0.15s ease',
    },
    actions: {
      display: 'flex',
      gap: '8px',
    },
    actionButton: {
      padding: '6px 12px',
      border: 'none',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    editButton: {
      backgroundColor: '#eff6ff',
      color: '#3b82f6',
    },
    deleteButton: {
      backgroundColor: '#fef2f2',
      color: '#ef4444',
    },
    loading: {
      padding: '48px',
      textAlign: 'center' as const,
      color: '#64748b',
      fontSize: '16px',
    },
    error: {
      padding: '20px',
      backgroundColor: '#fef2f2',
      border: '1px solid #fee2e2',
      borderRadius: '12px',
      color: '#b91c1c',
      textAlign: 'center' as const,
    },
    emptyState: {
      padding: '48px',
      textAlign: 'center' as const,
      color: '#64748b',
      fontSize: '16px',
      backgroundColor: '#f8fafc',
      borderRadius: '12px',
      border: '2px dashed #e2e8f0',
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Пәндер</h1>
        <button
          style={styles.addButton}
          onClick={handleOpenCreate}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#2563eb';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#3b82f6';
          }}
        >
          + Пән қосу
        </button>
      </div>

      {isLoading && <div style={styles.loading}>Пәндер жүктелуде...</div>}

      {error && !isLoading && (
        <div style={styles.error}>{error}</div>
      )}

      {!isLoading && !error && subjects.length === 0 && (
        <div style={styles.emptyState}>
          Қосылған пәндер жоқ. Біріншісін жасау үшін "Пән қосу" түймесін басыңыз.
        </div>
      )}

      {!isLoading && !error && subjects.length > 0 && (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Атауы</th>
                <th style={styles.th}>Жасалған уақыты</th>
                <th style={styles.th}>Әрекеттер</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => (
                <tr
                  key={subject.id}
                  style={styles.tr}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <td style={styles.td}>{subject.name}</td>
                  <td style={styles.td}>{formatDate(subject.created_at)}</td>
                  <td style={styles.td}>
                    <div style={styles.actions}>
                      <button
                        style={{ ...styles.actionButton, ...styles.editButton }}
                        onClick={() => handleOpenEdit(subject)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#dbeafe';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#eff6ff';
                        }}
                      >
                        Өзгерту
                      </button>
                      <button
                        style={{ ...styles.actionButton, ...styles.deleteButton }}
                        onClick={() => handleDelete(subject.id)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#fee2e2';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#fef2f2';
                        }}
                      >
                        Өшіру
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <SubjectModal
        isOpen={isModalOpen}
        mode={modalMode}
        subject={editingSubject}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default SubjectsPage;