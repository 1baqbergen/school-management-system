// src/pages/ParentsPage/ParentsPage.tsx
import { useState, useEffect } from 'react';
import { useParentStore } from '../../features/parent/store/parentStore';
import { ParentsTable } from '../../features/parent/components/ParentsTable';
import { AddParentModal } from '../../features/parent/components/AddParentModal';
import { AssignStudentModal } from '../../features/parent/components/AssignStudentModal';
import type { Parent } from '../../features/parent/types/parent.types';
import { toast } from 'react-hot-toast';
import { Users, UserPlus } from 'lucide-react';

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
    marginBottom: '32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap' as const,
    gap: '16px',
  },
  headerLeft: {
    flex: 1,
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
  addButton: {
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 10px rgba(59, 130, 246, 0.2)',
  },
};

const ParentsPage = () => {
  const { parents, loading, fetchParents, addParent, deleteParent, assignStudent } = useParentStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);

  useEffect(() => {
    fetchParents();
  }, []);

  const handleAddParent = async (data: any) => {
    try {
      await addParent(data);
      toast.success('Ата-ана сәтті қосылды');
    } catch (error) {
      toast.error('Ата-ана қосу кезінде қате');
      throw error;
    }
  };

  const handleDeleteParent = async (id: number) => {
    if (window.confirm('Бұл ата-ананы жойғыңыз келе ме?')) {
      try {
        await deleteParent(id);
        toast.success('Ата-ана жойылды');
      } catch (error) {
        toast.error('Жою кезінде қате');
      }
    }
  };

  const handleAssignStudent = (parent: Parent) => {
    setSelectedParent(parent);
    setIsAssignModalOpen(true);
  };

  const handleAssign = async (parentId: number, studentId: number) => {
    try {
      await assignStudent(parentId, studentId);
      toast.success('Оқушы ата-анаға тағайындалды');
    } catch (error) {
      toast.error('Тағайындау кезінде қате');
      throw error;
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.titleWrapper}>
              <div style={styles.iconBox}>
                <Users size={24} color="#FFFFFF" />
              </div>
              <h1 style={styles.title}>Ата-аналар</h1>
            </div>
            <p style={styles.subtitle}>Ата-аналарды және олардың балаларын басқару</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            style={styles.addButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 10px rgba(59, 130, 246, 0.2)';
            }}
          >
            <UserPlus size={18} />
            Ата-ана қосу
          </button>
        </div>

        <ParentsTable
          parents={parents}
          onAssign={handleAssignStudent}
          onDelete={handleDeleteParent}
          loading={loading}
        />

        <AddParentModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddParent}
        />

        {selectedParent && (
          <AssignStudentModal
            isOpen={isAssignModalOpen}
            parentId={selectedParent.id}
            onClose={() => {
              setIsAssignModalOpen(false);
              setSelectedParent(null);
            }}
            onAssign={handleAssign}
          />
        )}
      </div>
    </div>
  );
};

export default ParentsPage;