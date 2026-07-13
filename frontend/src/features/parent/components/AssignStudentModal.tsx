// src/features/parent/components/AssignStudentModal.tsx
/*import { useState, useEffect } from 'react';
import { X, Search, UserPlus, Users, Loader2 } from 'lucide-react';
import apiClient from '../../../services/apiClient';

interface Student {
  id: number;
  full_name: string;
  class_name: string;
}

interface AssignStudentModalProps {
  isOpen: boolean;
  parentId: number;
  onClose: () => void;
  onAssign: (parentId: number, studentId: number) => Promise<void>;
}

const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '16px',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: '28px',
    width: '100%',
    maxWidth: '500px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    animation: 'modalEnter 0.2s ease-out',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid #F0F2F5',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  iconBox: {
    width: '36px',
    height: '36px',
    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    margin: 0,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#9CA3AF',
    transition: 'all 0.2s ease',
    padding: '4px',
    borderRadius: '8px',
  },
  searchContainer: {
    padding: '20px 24px',
    borderBottom: '1px solid #F0F2F5',
  },
  searchWrapper: {
    position: 'relative' as const,
  },
  searchIcon: {
    position: 'absolute' as const,
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9CA3AF',
  },
  searchInput: {
    width: '100%',
    padding: '12px 12px 12px 44px',
    fontSize: '14px',
    border: '1px solid #E5E7EB',
    borderRadius: '14px',
    outline: 'none',
    transition: 'all 0.2s ease',
    backgroundColor: '#F9FAFB',
    boxSizing: 'border-box' as const,
  },
  studentsList: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '8px 12px',
  },
  studentItem: (isSelected: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    marginBottom: '8px',
    borderRadius: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: isSelected ? '#ECFDF5' : 'transparent',
    border: isSelected ? '1px solid #A7F3D0' : '1px solid transparent',
  }),
  studentAvatar: {
    width: '44px',
    height: '44px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  studentAvatarText: {
    color: '#FFFFFF',
    fontSize: '16px',
    fontWeight: '600',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#111827',
    marginBottom: '4px',
  },
  studentClass: {
    fontSize: '12px',
    color: '#6B7280',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  radioButton: (isSelected: boolean) => ({
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    border: `2px solid ${isSelected ? '#10B981' : '#D1D5DB'}`,
    backgroundColor: isSelected ? '#10B981' : 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    flexShrink: 0,
  }),
  radioInner: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '48px',
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '48px',
  },
  emptyIcon: {
    marginBottom: '12px',
  },
  emptyText: {
    fontSize: '14px',
    color: '#9CA3AF',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    padding: '20px 24px',
    borderTop: '1px solid #F0F2F5',
    backgroundColor: '#FFFFFF',
  },
  cancelButton: {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  submitButton: (disabled: boolean) => ({
    padding: '10px 24px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#FFFFFF',
    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    border: 'none',
    borderRadius: '12px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  }),
};

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

export const AssignStudentModal = ({ isOpen, parentId, onClose, onAssign }: AssignStudentModalProps) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchStudents();
    }
  }, [isOpen]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<Student[]>('/api/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student =>
    student.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!selectedStudentId) return;
    setSubmitting(true);
    try {
      await onAssign(parentId, selectedStudentId);
      onClose();
      setSelectedStudentId(null);
      setSearchTerm('');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.iconBox}>
              <UserPlus size={18} color="#FFFFFF" />
            </div>
            <h2 style={styles.title}>Оқушы тағайындау</h2>
          </div>
          <button
            onClick={onClose}
            style={styles.closeButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F3F4F6';
              e.currentTarget.style.color = '#374151';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#9CA3AF';
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={styles.searchContainer}>
          <div style={styles.searchWrapper}>
            <Search size={18} style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Оқушыларды іздеу..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#10B981';
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#E5E7EB';
                e.currentTarget.style.backgroundColor = '#F9FAFB';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>

        <div style={styles.studentsList}>
          {loading ? (
            <div style={styles.loadingContainer}>
              <Loader2 size={32} color="#10B981" style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          ) : filteredStudents.length > 0 ? (
            filteredStudents.map((student) => {
              const isSelected = selectedStudentId === student.id;
              return (
                <div
                  key={student.id}
                  style={styles.studentItem(isSelected)}
                  onClick={() => setSelectedStudentId(student.id)}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = '#F9FAFB';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <div style={styles.studentAvatar}>
                    <span style={styles.studentAvatarText}>{getInitials(student.full_name)}</span>
                  </div>
                  <div style={styles.studentInfo}>
                    <div style={styles.studentName}>{student.full_name}</div>
                    <div style={styles.studentClass}>
                      <Users size={12} />
                      {student.class_name}
                    </div>
                  </div>
                  <div style={styles.radioButton(isSelected)}>
                    {isSelected && <div style={styles.radioInner} />}
                  </div>
                </div>
              );
            })
          ) : (
            <div style={styles.emptyState}>
              <Users size={40} color="#D1D5DB" style={styles.emptyIcon} />
              <p style={styles.emptyText}>Оқушылар табылмады</p>
            </div>
          )}
        </div>

        <div style={styles.actions}>
          <button
            onClick={onClose}
            style={styles.cancelButton}
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
            onClick={handleSubmit}
            disabled={!selectedStudentId || submitting}
            style={styles.submitButton(!selectedStudentId || submitting)}
            onMouseEnter={(e) => {
              if (selectedStudentId && !submitting) {
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {submitting ? (
              <>
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                Тағайындалуда...
              </>
            ) : (
              <>
                <UserPlus size={16} />
                Тағайындау
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};*/

// src/features/parent/components/AssignStudentModal.tsx
import { useState, useEffect } from 'react';
import { X, Search, UserPlus, Users, Loader2 } from 'lucide-react';
import apiClient from '../../../services/apiClient';

interface Student {
  id: number;
  full_name: string;
  class_name: string;
}

interface AssignStudentModalProps {
  isOpen: boolean;
  parentId: number;
  onClose: () => void;
  onAssign: (parentId: number, studentId: number) => Promise<void>;
}

const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '16px',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: '28px',
    width: '100%',
    maxWidth: '500px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    animation: 'modalEnter 0.2s ease-out',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid #F0F2F5',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  iconBox: {
    width: '36px',
    height: '36px',
    background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    margin: 0,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#9CA3AF',
    transition: 'all 0.2s ease',
    padding: '4px',
    borderRadius: '8px',
  },
  searchContainer: {
    padding: '20px 24px',
    borderBottom: '1px solid #F0F2F5',
  },
  searchWrapper: {
    position: 'relative' as const,
  },
  searchIcon: {
    position: 'absolute' as const,
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9CA3AF',
  },
  searchInput: {
    width: '100%',
    padding: '12px 12px 12px 44px',
    fontSize: '14px',
    border: '1px solid #E5E7EB',
    borderRadius: '14px',
    outline: 'none',
    transition: 'all 0.2s ease',
    backgroundColor: '#F9FAFB',
    boxSizing: 'border-box' as const,
  },
  studentsList: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '8px 12px',
  },
  studentItem: (isSelected: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    marginBottom: '8px',
    borderRadius: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: isSelected ? '#EFF6FF' : 'transparent',
    border: isSelected ? '1px solid #BFDBFE' : '1px solid transparent',
  }),
  studentAvatar: {
    width: '44px',
    height: '44px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  studentAvatarText: {
    color: '#FFFFFF',
    fontSize: '16px',
    fontWeight: '600',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#111827',
    marginBottom: '4px',
  },
  studentClass: {
    fontSize: '12px',
    color: '#6B7280',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  radioButton: (isSelected: boolean) => ({
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    border: `2px solid ${isSelected ? '#3B82F6' : '#D1D5DB'}`,
    backgroundColor: isSelected ? '#3B82F6' : 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    flexShrink: 0,
  }),
  radioInner: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '48px',
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '48px',
  },
  emptyIcon: {
    marginBottom: '12px',
  },
  emptyText: {
    fontSize: '14px',
    color: '#9CA3AF',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    padding: '20px 24px',
    borderTop: '1px solid #F0F2F5',
    backgroundColor: '#FFFFFF',
  },
  cancelButton: {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  submitButton: (disabled: boolean) => ({
    padding: '10px 24px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#FFFFFF',
    background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    border: 'none',
    borderRadius: '12px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  }),
};

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

export const AssignStudentModal = ({ isOpen, parentId, onClose, onAssign }: AssignStudentModalProps) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchStudents();
    }
  }, [isOpen]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<Student[]>('/api/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student =>
    student.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!selectedStudentId) return;
    setSubmitting(true);
    try {
      await onAssign(parentId, selectedStudentId);
      onClose();
      setSelectedStudentId(null);
      setSearchTerm('');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.iconBox}>
              <UserPlus size={18} color="#FFFFFF" />
            </div>
            <h2 style={styles.title}>Оқушы тағайындау</h2>
          </div>
          <button
            onClick={onClose}
            style={styles.closeButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F3F4F6';
              e.currentTarget.style.color = '#374151';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#9CA3AF';
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={styles.searchContainer}>
          <div style={styles.searchWrapper}>
            <Search size={18} style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Оқушыларды іздеу..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#3B82F6';
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#E5E7EB';
                e.currentTarget.style.backgroundColor = '#F9FAFB';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>

        <div style={styles.studentsList}>
          {loading ? (
            <div style={styles.loadingContainer}>
              <Loader2 size={32} color="#3B82F6" style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          ) : filteredStudents.length > 0 ? (
            filteredStudents.map((student) => {
              const isSelected = selectedStudentId === student.id;
              return (
                <div
                  key={student.id}
                  style={styles.studentItem(isSelected)}
                  onClick={() => setSelectedStudentId(student.id)}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = '#F9FAFB';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <div style={styles.studentAvatar}>
                    <span style={styles.studentAvatarText}>{getInitials(student.full_name)}</span>
                  </div>
                  <div style={styles.studentInfo}>
                    <div style={styles.studentName}>{student.full_name}</div>
                    <div style={styles.studentClass}>
                      <Users size={12} />
                      {student.class_name}
                    </div>
                  </div>
                  <div style={styles.radioButton(isSelected)}>
                    {isSelected && <div style={styles.radioInner} />}
                  </div>
                </div>
              );
            })
          ) : (
            <div style={styles.emptyState}>
              <Users size={40} color="#D1D5DB" style={styles.emptyIcon} />
              <p style={styles.emptyText}>Оқушылар табылмады</p>
            </div>
          )}
        </div>

        <div style={styles.actions}>
          <button
            onClick={onClose}
            style={styles.cancelButton}
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
            onClick={handleSubmit}
            disabled={!selectedStudentId || submitting}
            style={styles.submitButton(!selectedStudentId || submitting)}
            onMouseEnter={(e) => {
              if (selectedStudentId && !submitting) {
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {submitting ? (
              <>
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                Тағайындалуда...
              </>
            ) : (
              <>
                <UserPlus size={16} />
                Тағайындау
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};