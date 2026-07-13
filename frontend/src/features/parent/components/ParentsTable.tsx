// src/features/parent/components/ParentsTable.tsx
import { useState } from 'react';
import type { Parent, Child } from '../types/parent.types';
import { Trash2, UserPlus, Users, Phone, Calendar, CheckCircle, XCircle, Loader2, X } from 'lucide-react';
import apiClient from '../../../services/apiClient';

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
    gap: '20px',
    maxHeight: '80vh',
    overflowY: 'auto' as const,
    padding: '2px',
    position: 'relative' as const,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    border: '1px solid #E5E7EB',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
  },
  cardSelected: {
    border: '2px solid #3B82F6',
    boxShadow: '0 8px 25px -8px rgba(59, 130, 246, 0.3)',
  },
  cardHeader: {
    padding: '20px',
    cursor: 'pointer',
  },
  headerContent: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
  },
  avatar: {
    flexShrink: 0,
    width: '52px',
    height: '52px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 16px -8px rgba(59, 130, 246, 0.3)',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: '18px',
    fontWeight: '600',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '4px',
  },
  email: {
    fontSize: '12px',
    color: '#6B7280',
    marginBottom: '8px',
  },
  details: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '10px',
    marginTop: '6px',
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '11px',
    color: '#6B7280',
  },
  statusBadge: (isActive: boolean) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    padding: '3px 8px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '500',
    backgroundColor: isActive ? '#EFF6FF' : '#F3F4F6',
    color: isActive ? '#1D4ED8' : '#6B7280',
  }),
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '6px',
    padding: '12px 16px',
    borderTop: '1px solid #E5E7EB',
    backgroundColor: '#FAFAFA',
  },
  actionButton: (color: string) => ({
    padding: '6px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    color: color,
  }),
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(4px)',
    zIndex: 1000,
    animation: 'fadeIn 0.2s ease',
  },
  sidePanel: {
    position: 'fixed' as const,
    top: 0,
    right: 0,
    bottom: 0,
    width: '420px',
    maxWidth: '90vw',
    backgroundColor: '#FFFFFF',
    boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.1)',
    zIndex: 1001,
    display: 'flex',
    flexDirection: 'column' as const,
    animation: 'slideIn 0.3s ease',
  },
  panelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid #E5E7EB',
    background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    color: '#FFFFFF',
  },
  panelTitle: {
    fontSize: '18px',
    fontWeight: '600',
    margin: 0,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#FFFFFF',
    opacity: 0.8,
    transition: 'opacity 0.2s ease',
    padding: '4px',
    borderRadius: '8px',
  },
  panelContent: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '20px 24px',
  },
  parentInfo: {
    marginBottom: '24px',
    padding: '16px',
    backgroundColor: '#F9FAFB',
    borderRadius: '16px',
    border: '1px solid #E5E7EB',
  },
  parentName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '4px',
  },
  parentEmail: {
    fontSize: '12px',
    color: '#6B7280',
    marginBottom: '8px',
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  childrenList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  childItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#FFFFFF',
    borderRadius: '14px',
    border: '1px solid #E5E7EB',
    transition: 'all 0.2s ease',
  },
  childAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  childAvatarText: {
    color: '#FFFFFF',
    fontSize: '14px',
    fontWeight: '600',
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#111827',
    marginBottom: '2px',
  },
  childClass: {
    fontSize: '12px',
    color: '#6B7280',
  },
  removeButton: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#EF4444',
    padding: '6px',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '48px',
    color: '#9CA3AF',
  },
  emptyIcon: {
    marginBottom: '12px',
  },
  emptyText: {
    fontSize: '13px',
  },
  loadingSpinner: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '48px',
  },
  panelActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    padding: '16px 24px',
    borderTop: '1px solid #E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  assignButtonPanel: {
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#1D4ED8',
    backgroundColor: '#EFF6FF',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s ease',
  },
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('kk-KZ', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

interface ParentsTableProps {
  parents: Parent[];
  onAssign: (parent: Parent) => void;
  onDelete: (id: number) => void;
  loading: boolean;
}

export const ParentsTable = ({ parents, onAssign, onDelete, loading }: ParentsTableProps) => {
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
  const [childrenMap, setChildrenMap] = useState<Map<number, Child[]>>(new Map());
  const [loadingChildren, setLoadingChildren] = useState<Set<number>>(new Set());
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const openPanel = async (parent: Parent) => {
    setSelectedParent(parent);
    setIsPanelOpen(true);
    
    if (!childrenMap.has(parent.id)) {
      await fetchParentChildren(parent.id);
    }
  };

  const closePanel = () => {
    setIsPanelOpen(false);
    setSelectedParent(null);
  };

  const fetchParentChildren = async (parentId: number) => {
    setLoadingChildren(prev => new Set(prev).add(parentId));
    try {
      const response = await apiClient.get(`/api/parents/${parentId}/children`);
      setChildrenMap(prev => new Map(prev).set(parentId, response.data));
    } catch (error) {
      console.error('Error fetching children:', error);
      setChildrenMap(prev => new Map(prev).set(parentId, []));
    } finally {
      setLoadingChildren(prev => {
        const newSet = new Set(prev);
        newSet.delete(parentId);
        return newSet;
      });
    }
  };

  // 🔥 Оқушыны ата-анадан өшіру функциясы
  const handleRemoveChild = async (parentId: number, studentId: number) => {
    if (!window.confirm('Осы оқушыны ата-анадан өшіргіңіз келе ме?')) return;

    try {
      await apiClient.delete(`/api/parents/${parentId}/remove-student/${studentId}`);

      // 🔥 UI-ды жаңарту (локально өшіреміз)
      setChildrenMap(prev => {
        const newMap = new Map(prev);
        const children = newMap.get(parentId) || [];
        newMap.set(parentId, children.filter(child => child.id !== studentId));
        return newMap;
      });

    } catch (error) {
      console.error('Remove error:', error);
      alert('Өшіру кезінде қате шықты');
    }
  };

  const handleAssign = (parent: Parent) => {
    closePanel();
    onAssign(parent);
  };

  const handleDelete = (id: number) => {
    closePanel();
    onDelete(id);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{ ...styles.card, opacity: 0.6 }}>
            <div style={styles.cardHeader}>
              <div style={styles.headerContent}>
                <div style={{ ...styles.avatar, background: '#E5E7EB' }} />
                <div style={styles.info}>
                  <div style={{ height: '14px', width: '60%', backgroundColor: '#E5E7EB', borderRadius: '4px', marginBottom: '6px' }} />
                  <div style={{ height: '10px', width: '40%', backgroundColor: '#F3F4F6', borderRadius: '4px' }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (parents.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px', backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1px solid #E5E7EB' }}>
        <Users size={48} color="#D1D5DB" />
        <p style={{ color: '#9CA3AF', marginTop: '16px' }}>Тіркелген ата-аналар жоқ</p>
      </div>
    );
  }

  const children = selectedParent ? childrenMap.get(selectedParent.id) || [] : [];
  const isLoadingChildren = selectedParent ? loadingChildren.has(selectedParent.id) : false;

  return (
    <>
      <div style={styles.container}>
        {parents.map((parent) => {
          const isActive = parent.is_active;
          const isSelected = selectedParent?.id === parent.id;

          return (
            <div
              key={parent.id}
              style={{
                ...styles.card,
                ...(isSelected ? styles.cardSelected : {}),
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 25px -5px rgba(0, 0, 0, 0.08)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={styles.cardHeader} onClick={() => openPanel(parent)}>
                <div style={styles.headerContent}>
                  <div style={styles.avatar}>
                    <span style={styles.avatarText}>{getInitials(parent.full_name)}</span>
                  </div>
                  <div style={styles.info}>
                    <div style={styles.name}>{parent.full_name}</div>
                    <div style={styles.email}>{parent.email}</div>
                    <div style={styles.details}>
                      {parent.phone && (
                        <span style={styles.detailItem}>
                          <Phone size={11} />
                          {parent.phone}
                        </span>
                      )}
                      <span style={styles.detailItem}>
                        <Calendar size={11} />
                        {formatDate(parent.created_at)}
                      </span>
                    </div>
                    <div style={{ marginTop: '6px' }}>
                      <span style={styles.statusBadge(isActive)}>
                        {isActive ? <CheckCircle size={10} /> : <XCircle size={10} />}
                        {isActive ? 'Белсенді' : 'Белсенді емес'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={styles.actions}>
                <button
                  onClick={() => handleAssign(parent)}
                  style={styles.actionButton('#3B82F6')}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#EFF6FF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  title="Оқушы тағайындау"
                >
                  <UserPlus size={15} />
                </button>
                <button
                  onClick={() => handleDelete(parent.id)}
                  style={styles.actionButton('#EF4444')}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FEF2F2';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  title="Жою"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Side Panel */}
      {isPanelOpen && selectedParent && (
        <>
          <div style={styles.overlay} onClick={closePanel} />
          <div style={styles.sidePanel}>
            <div style={styles.panelHeader}>
              <h3 style={styles.panelTitle}>Балалар тізімі</h3>
              <button
                onClick={closePanel}
                style={styles.closeButton}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.8'; }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={styles.panelContent}>
              <div style={styles.parentInfo}>
                <div style={styles.parentName}>{selectedParent.full_name}</div>
                <div style={styles.parentEmail}>{selectedParent.email}</div>
                {selectedParent.phone && (
                  <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
                    <Phone size={11} style={{ display: 'inline', marginRight: '4px' }} />
                    {selectedParent.phone}
                  </div>
                )}
              </div>

              <div style={styles.sectionTitle}>
                <Users size={16} color="#3B82F6" />
                Балалар тізімі
              </div>

              {isLoadingChildren ? (
                <div style={styles.loadingSpinner}>
                  <Loader2 size={24} color="#3B82F6" style={{ animation: 'spin 1s linear infinite' }} />
                </div>
              ) : children.length > 0 ? (
                <div style={styles.childrenList}>
                  {children.map((child) => (
                    <div key={child.id} style={styles.childItem}>
                      <div style={styles.childAvatar}>
                        <span style={styles.childAvatarText}>{getInitials(child.full_name)}</span>
                      </div>
                      <div style={styles.childInfo}>
                        <div style={styles.childName}>{child.full_name}</div>
                        <div style={styles.childClass}>{child.class_name}</div>
                      </div>
                      {/* 🔥 DELETE BUTTON */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveChild(selectedParent.id, child.id);
                        }}
                        style={styles.removeButton}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#FEF2F2';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        title="Оқушыны өшіру"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={styles.emptyState}>
                  <Users size={32} color="#D1D5DB" style={styles.emptyIcon} />
                  <p style={styles.emptyText}>Балалар тағайындалмаған</p>
                </div>
              )}
            </div>

            <div style={styles.panelActions}>
              <button
                onClick={() => handleAssign(selectedParent)}
                style={styles.assignButtonPanel}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#DBEAFE';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#EFF6FF';
                }}
              >
                <UserPlus size={14} />
                Оқушы тағайындау
              </button>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};