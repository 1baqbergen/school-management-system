// src/pages/HomeworkPage/HomeworkPage.tsx
import { useState, useEffect, useCallback } from 'react';
import { userStore } from '../../store/userStore';
import { homeworkApi } from '../../features/homeworks/api/homeworkApi';
import type { Homework, Submission, CreateHomeworkDto, CreateSubmissionDto, GradeSubmissionDto } from '../../features/homeworks/types/homework.types';
import HomeworkTable from '../../features/homeworks/components/HomeworkTable';
import HomeworkCard from '../../features/homeworks/components/HomeworkCard';
import AddHomeworkModal from '../../features/homeworks/components/AddHomeworkModal';
import SubmissionList from '../../features/homeworks/components/SubmissionList';
import SubmitHomeworkModal from '../../features/homeworks/components/SubmitHomeworkModal';
import GradeSubmissionModal from '../../features/homeworks/components/GradeSubmissionModal';
import ViewSubmissionModal from '../../features/homeworks/components/ViewSubmissionModal';
import apiClient from '../../services/apiClient';

const HomeworkPage = () => {
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [meta, setMeta] = useState<{ classes: any[]; subjects: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 🔥 Backend-тен келетін жіберілген жұмыстар
  const [mySubmissions, setMySubmissions] = useState<Submission[]>([]);
  const [submittedHomeworkIds, setSubmittedHomeworkIds] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedHomework, setSelectedHomework] = useState<Homework | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [showSubmissionsFor, setShowSubmissionsFor] = useState<Homework | null>(null);

  const user = userStore((state) => state.user);
  const userRole = (user?.role || '').toLowerCase();
  const isAdmin = userRole === 'admin';
  const isTeacher = userRole === 'teacher';
  const isStudent = userRole === 'student';

  const fetchHomeworks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await homeworkApi.getHomeworks();
      setHomeworks(data);
    } catch (err) {
      setError('Үй жұмыстарын жүктеу мүмкін болмады');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMeta = useCallback(async () => {
    try {
      const res = await apiClient.get('/api/homeworks/meta');
      setMeta(res.data);
    } catch (err) {
      console.error('Meta error:', err);
    }
  }, []);

  const fetchSubmissions = useCallback(async (homeworkId: number) => {
    try {
      const data = await homeworkApi.getSubmissions(homeworkId);
      setSubmissions(data);
    } catch (err) {
      setError('Жұмыстарды жүктеу мүмкін болмады');
    }
  }, []);

  // 🔥 BACKEND-тен оқушының жіберген жұмыстарын алу (ДҰРЫС ЖОЛ)
  const fetchMySubmissions = useCallback(async () => {
  if (!isStudent) return;
  try {
    const data = await homeworkApi.getMySubmissions();
    console.log('✅ Жіберілген жұмыстар (толық):', JSON.stringify(data, null, 2));
    setMySubmissions(data);
    // Жіберілген үй жұмыстарының ID-ларын алу - homework_id дұрыс екенін тексеріңіз
    const submittedIds = data.map((sub: Submission) => {
      console.log(`Submission: id=${sub.id}, homework_id=${sub.homework_id}`);
      return sub.homework_id;
    }).filter(id => id !== undefined && id !== null);
    console.log('✅ Жіберілген ID-лар:', submittedIds);
    setSubmittedHomeworkIds(submittedIds);
  } catch (err) {
    console.error('❌ Error fetching my submissions:', err);
    setMySubmissions([]);
    setSubmittedHomeworkIds([]);
  }
}, [isStudent]);

  useEffect(() => {
    fetchHomeworks();
    if (isTeacher) {
      fetchMeta();
    }
    if (isStudent) {
      fetchMySubmissions();
    }
  }, [fetchHomeworks, fetchMeta, fetchMySubmissions, isTeacher, isStudent]);

  const handleCreateHomework = async (data: CreateHomeworkDto) => {
    await homeworkApi.createHomework(data);
    await fetchHomeworks();
  };

  const handleDeleteHomework = async (id: number) => {
    if (window.confirm('Бұл үй жұмысын жойғыңыз келе ме?')) {
      await homeworkApi.deleteHomework(id);
      await fetchHomeworks();
    }
  };

  // 🔥 Үй жұмысын жіберу (backend-ке сақтайды)
  const handleSubmitHomework = async (data: CreateSubmissionDto) => {
    setIsSubmitting(true);
    try {
      await homeworkApi.submitHomework(data);
      // Жіберілгеннен кейін тізімді қайта жүктеу - Бұл ЖІБЕРІЛДІ статусын жаңартады
      await fetchMySubmissions();
      await fetchHomeworks();
      setIsSubmitModalOpen(false);
    } catch (err: any) {
      console.error('Submit error:', err);
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert('Жіберу кезінде қате кетті');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🔥 Жіберілген жұмысты көру
  const handleViewSubmission = (homework: Homework) => {
    const submission = mySubmissions.find(s => s.homework_id === homework.id);
    if (submission) {
      setSelectedSubmission(submission);
      setIsViewModalOpen(true);
    }
  };

  const handleGradeSubmission = async (id: number, data: GradeSubmissionDto) => {
    await homeworkApi.gradeSubmission(id, data);
    if (showSubmissionsFor) {
      await fetchSubmissions(showSubmissionsFor.id);
    }
    // Оқушының submissions-ын жаңарту
    if (isStudent) {
      await fetchMySubmissions();
    }
  };

  const handleViewSubmissions = async (homework: Homework) => {
    setShowSubmissionsFor(homework);
    await fetchSubmissions(homework.id);
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
      fontWeight: '700',
      color: '#0F172A',
      margin: 0,
    },
    addButton: {
      padding: '10px 20px',
      backgroundColor: '#3B82F6',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    loading: {
      padding: '48px',
      textAlign: 'center' as const,
      color: '#64748B',
    },
    error: {
      padding: '20px',
      backgroundColor: '#FEF2F2',
      border: '1px solid #FEE2E2',
      borderRadius: '12px',
      color: '#B91C1C',
      textAlign: 'center' as const,
    },
    cardGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
      gap: '20px',
    },
    backButton: {
      marginBottom: '20px',
      padding: '8px 16px',
      backgroundColor: '#F1F5F9',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '14px',
      color: '#475569',
    },
  };

  if (loading) {
    return <div style={styles.loading}>Жүктелуде...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  if (showSubmissionsFor && isTeacher) {
    return (
      <div style={styles.page}>
        <button style={styles.backButton} onClick={() => setShowSubmissionsFor(null)}>
          ← Үй жұмыстарына оралу
        </button>
        <div style={styles.header}>
          <h1 style={styles.title}>Жұмыстар: {showSubmissionsFor.title}</h1>
        </div>
        <SubmissionList submissions={submissions} onGrade={(sub) => {
          setSelectedSubmission(sub);
          setIsGradeModalOpen(true);
        }} />
        <GradeSubmissionModal
          isOpen={isGradeModalOpen}
          submission={selectedSubmission}
          onClose={() => setIsGradeModalOpen(false)}
          onGrade={handleGradeSubmission}
        />
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Үй жұмыстары</h1>
        {isTeacher && (
          <button
            style={styles.addButton}
            onClick={() => setIsAddModalOpen(true)}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2563EB'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#3B82F6'; }}
          >
            + Үй жұмысын қосу
          </button>
        )}
      </div>

      {isAdmin && (
        <HomeworkTable
          homeworks={homeworks}
          userRole={userRole}
          onDelete={handleDeleteHomework}
        />
      )}

      {isTeacher && (
        <>
          <HomeworkTable
            homeworks={homeworks}
            userRole={userRole}
            onDelete={handleDeleteHomework}
            onViewSubmissions={handleViewSubmissions}
          />
          <AddHomeworkModal
            isOpen={isAddModalOpen}
            classes={meta?.classes || []}
            subjects={meta?.subjects || []}
            userRole={userRole}
            onClose={() => setIsAddModalOpen(false)}
            onSave={handleCreateHomework}
          />
        </>
      )}

      {isStudent && (
        <div style={styles.cardGrid}>
          {homeworks.map(homework => {
            const isSubmitted = submittedHomeworkIds.includes(homework.id);
            console.log(`📚 ${homework.title}: isSubmitted=${isSubmitted}, ID=${homework.id}`);
            return (
              <HomeworkCard
                key={homework.id}
                homework={homework}
                isSubmitted={isSubmitted}
                submission={mySubmissions.find(s => s.homework_id === homework.id)}
                onSubmitClick={(hw) => {
                  setSelectedHomework(hw);
                  setIsSubmitModalOpen(true);
                }}
                onViewClick={handleViewSubmission}
              />
            );
          })}
        </div>
      )}

      <SubmitHomeworkModal
        isOpen={isSubmitModalOpen}
        homeworkTitle={selectedHomework?.title || ''}
        homeworkId={selectedHomework?.id || 0}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmit={handleSubmitHomework}
        isLoading={isSubmitting}
      />

      <ViewSubmissionModal
        isOpen={isViewModalOpen}
        submission={selectedSubmission}
        onClose={() => setIsViewModalOpen(false)}
      />
    </div>
  );
};

export default HomeworkPage;