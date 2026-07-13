// src/pages/ParentDashboardPage/ParentDashboardPage.tsx
import { useState, useEffect } from 'react';
import { useParentStore } from '../../features/parent/store/parentStore';
import { ParentChildrenView } from '../../features/parent/components/ParentChildrenView';
import { ChildGradesView } from '../../features/parent/components/ChildGradesView';
import { ChildScheduleView } from '../../features/parent/components/ChildScheduleView';
import type { Child } from '../../features/parent/types/parent.types';
import { GraduationCap, CalendarDays, Star } from 'lucide-react';

const styles = {
  container: {
    minHeight: '100vh',
    padding: '32px',
  },
  content: {
    maxWidth: '1400px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '40px',
  },
  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px',
  },
  iconBox: {
    width: '48px',
    height: '48px',
    background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.2)',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '14px',
    color: '#6B7280',
    margin: 0,
    paddingLeft: '60px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  sectionTitleIcon: {
    width: '4px',
    height: '20px',
    background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    borderRadius: '2px',
  },
  childrenSection: {
    marginBottom: '32px',
  },
  childDetailsSection: {
    marginTop: '32px',
  },
  childInfo: {
    marginBottom: '24px',
  },
  childName: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '4px',
  },
  childClass: {
    fontSize: '14px',
    color: '#6B7280',
  },
  tabsContainer: {
    borderBottom: '1px solid #E5E7EB',
    marginBottom: '24px',
  },
  tabs: {
    display: 'flex',
    gap: '8px',
  },
  tab: {
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: '500',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#6B7280',
    borderRadius: '12px 12px 0 0',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  activeTab: {
    color: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
};

const ParentDashboardPage = () => {
  const {
    children,
    selectedChild,
    grades,
    schedule,
    loading,
    fetchChildren,
    fetchChildGrades,
    fetchChildSchedule,
    setSelectedChild,
  } = useParentStore();

  const [activeTab, setActiveTab] = useState<'grades' | 'schedule'>('grades');

  // 🔥 1. Бет ашылғанда selectedChild-ты тазалау
  useEffect(() => {
    setSelectedChild(null);
    fetchChildren();
  }, [fetchChildren, setSelectedChild]);

  // 🔥 2. Тек дұрыс selectedChild болғанда ғана деректерді жүктеу
  useEffect(() => {
    if (selectedChild && children.some(child => child.id === selectedChild.id)) {
      fetchChildGrades(selectedChild.id);
      fetchChildSchedule(selectedChild.id);
    }
  }, [selectedChild, children, fetchChildGrades, fetchChildSchedule]);

  const handleSelectChild = (child: Child) => {
    setSelectedChild(child);
  };

  const tabs = [
    { id: 'grades' as const, label: 'Бағалар', icon: Star },
    { id: 'schedule' as const, label: 'Сабақ кестесі', icon: CalendarDays },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.header}>
          <div style={styles.titleWrapper}>
            <div style={styles.iconBox}>
              <GraduationCap size={24} color="#FFFFFF" />
            </div>
            <h1 style={styles.title}>Ата-ана бақылауы</h1>
          </div>
          <p style={styles.subtitle}>Балаларыңыздың үлгерімін және сабақ кестесін бақылаңыз</p>
        </div>

        <div style={styles.childrenSection}>
          <div style={styles.sectionTitle}>
            <div style={styles.sectionTitleIcon} />
            <span>Менің балаларым</span>
          </div>
          <ParentChildrenView
            children={children}
            selectedChildId={selectedChild?.id || null}
            onSelectChild={handleSelectChild}
            loading={loading}
          />
        </div>

        {selectedChild && (
          <div style={styles.childDetailsSection}>
            <div style={styles.childInfo}>
              <h2 style={styles.childName}>{selectedChild.full_name}</h2>
              <p style={styles.childClass}>{selectedChild.class_name}</p>
            </div>

            <div style={styles.tabsContainer}>
              <div style={styles.tabs}>
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      style={{
                        ...styles.tab,
                        ...(isActive ? styles.activeTab : {}),
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = '#F9FAFB';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <Icon size={16} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {activeTab === 'grades' && (
              <ChildGradesView grades={grades} loading={loading} />
            )}
            {activeTab === 'schedule' && (
              <ChildScheduleView schedule={schedule} loading={loading} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentDashboardPage;