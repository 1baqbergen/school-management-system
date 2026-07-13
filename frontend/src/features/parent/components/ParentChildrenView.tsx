// src/features/parent/components/ParentChildrenView.tsx
import type { Child } from '../types/parent.types';
import { User, BookOpen, Calendar, Star, ChevronRight, Sparkles } from 'lucide-react';

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  card: (isSelected: boolean) => ({
    position: 'relative' as const,
    textAlign: 'left' as const,
    padding: '20px',
    borderRadius: '20px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    border: isSelected ? '2px solid #3B82F6' : '1px solid #E5E7EB',
    backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
    boxShadow: isSelected 
      ? '0 8px 25px -8px rgba(59, 130, 246, 0.3)' 
      : '0 2px 8px rgba(0, 0, 0, 0.04)',
  }),
  selectedBadge: {
    position: 'absolute' as const,
    top: '-10px',
    right: '-10px',
    width: '24px',
    height: '24px',
    backgroundColor: '#3B82F6',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.4)',
  },
  content: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
  },
  avatar: (isSelected: boolean) => ({
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    background: isSelected 
      ? 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)' 
      : 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
  }),
  avatarText: (isSelected: boolean) => ({
    color: isSelected ? '#FFFFFF' : '#1D4ED8',
    fontSize: '20px',
    fontWeight: '600',
  }),
  info: {
    flex: 1,
  },
  name: (isSelected: boolean) => ({
    fontSize: '16px',
    fontWeight: '600',
    color: isSelected ? '#1E3A8A' : '#111827',
    marginBottom: '4px',
  }),
  className: (isSelected: boolean) => ({
    fontSize: '13px',
    color: isSelected ? '#2563EB' : '#6B7280',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '4px',
  }),
  footer: (isSelected: boolean) => ({
    marginTop: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '11px',
    color: isSelected ? '#2563EB' : '#9CA3AF',
  }),
  footerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  footerItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  arrow: {
    transition: 'transform 0.3s ease',
  },
  loadingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  loadingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    padding: '20px',
    border: '1px solid #E5E7EB',
  },
  loadingAvatar: {
    width: '56px',
    height: '56px',
    backgroundColor: '#F3F4F6',
    borderRadius: '16px',
    marginBottom: '16px',
  },
  loadingText: {
    height: '16px',
    backgroundColor: '#F3F4F6',
    borderRadius: '8px',
    width: '70%',
    marginBottom: '8px',
  },
  loadingSubtext: {
    height: '12px',
    backgroundColor: '#F9FAFB',
    borderRadius: '6px',
    width: '50%',
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '48px',
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    border: '1px solid #E5E7EB',
  },
  emptyIcon: {
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: '4px',
  },
  emptyText: {
    fontSize: '13px',
    color: '#9CA3AF',
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

interface ParentChildrenViewProps {
  children: Child[];
  selectedChildId: number | null;
  onSelectChild: (child: Child) => void;
  loading: boolean;
}

export const ParentChildrenView = ({ children, selectedChildId, onSelectChild, loading }: ParentChildrenViewProps) => {
  if (loading) {
    return (
      <div style={styles.loadingGrid}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={styles.loadingCard}>
            <div style={styles.loadingAvatar} />
            <div style={styles.loadingText} />
            <div style={styles.loadingSubtext} />
          </div>
        ))}
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div style={styles.emptyState}>
        <User size={48} color="#D1D5DB" style={styles.emptyIcon} />
        <p style={styles.emptyTitle}>Балалар жоқ</p>
        <p style={styles.emptyText}>Әлі балалар тағайындалмаған</p>
      </div>
    );
  }

  return (
    <div style={styles.grid}>
      {children.map((child) => {
        const isSelected = selectedChildId === child.id;
        return (
          <button
            key={child.id}
            onClick={() => onSelectChild(child)}
            style={styles.card(isSelected)}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 30px -12px rgba(0, 0, 0, 0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
              }
            }}
          >
            {isSelected && (
              <div style={styles.selectedBadge}>
                <Sparkles size={12} color="#FFFFFF" />
              </div>
            )}
            <div style={styles.content}>
              <div style={styles.avatar(isSelected)}>
                <span style={styles.avatarText(isSelected)}>{getInitials(child.full_name)}</span>
              </div>
              <div style={styles.info}>
                <div style={styles.name(isSelected)}>{child.full_name}</div>
                <div style={styles.className(isSelected)}>
                  <BookOpen size={12} />
                  {child.class_name}
                </div>
              </div>
            </div>
            <div style={styles.footer(isSelected)}>
              <div style={styles.footerLeft}>
                <span style={styles.footerItem}>
                  <Star size={11} />
                  Оқушы
                </span>
                <span style={styles.footerItem}>
                  <Calendar size={11} />
                  {child.class_name}
                </span>
              </div>
              <ChevronRight size={14} style={{ ...styles.arrow, transform: isSelected ? 'translateX(4px)' : 'translateX(0)' }} />
            </div>
          </button>
        );
      })}
    </div>
  );
};