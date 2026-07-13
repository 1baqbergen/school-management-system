// src/pages/AdminPanelPage.tsx
import { useState, useEffect } from 'react';
import {
  Calendar,
  Star,
  AlertCircle,
  BarChart3,
  LineChart as LineChartIcon,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Area,
  AreaChart,
} from 'recharts';
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";

// Custom hooks
import { useDashboardData } from '../hooks/useDashboardData';

// Components
import { ChartCard } from '../components/dashboard/ChartCard';
import { EmptyState } from '../components/dashboard/EmptyState';
import { DashboardSkeleton } from '../components/dashboard/DashboardSkeleton';

// Types
import type { SubjectStat } from '../types/dashboard.types';

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-2xl border border-white/20">
        <p className="text-sm font-semibold text-gray-900">{label}</p>
        <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {payload[0].value}
        </p>
        <p className="text-xs text-gray-500 mt-1">орташа балл</p>
      </div>
    );
  }
  return null;
};

// ===== CARD =====
const StatCard = ({ title, value, color, link }: any) => {
  const navigate = useNavigate();

  // Градиентті фондар
  const gradients: { [key: string]: string } = {
    '#17a2b8': 'linear-gradient(135deg, #17a2b8 0%, #0f7e8f 100%)',
    '#dc3545': 'linear-gradient(135deg, #dc3545 0%, #b81c2c 100%)',
    '#ffc107': 'linear-gradient(135deg, #ffc107 0%, #e6a800 100%)',
    '#28a745': 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)',
  };

  const getIcon = () => {
    switch (title) {
      case 'Оқушы':
        return '👨‍🎓';
      case 'Мұғалім':
        return '👩‍🏫';
      case 'Сынып':
        return '📚';
      case 'Барлық баға':
        return '⭐';
      default:
        return '📊';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
      onClick={() => navigate(link)}
      style={{
        background: gradients[color] || color,
        borderRadius: "20px",
        padding: "20px",
        color: "white",
        width: "240px",
        minWidth: "240px",
        flexShrink: 0,
        cursor: "pointer",
        position: "relative", 
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.2)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        transition: "box-shadow 0.2s ease",
        marginBottom: "8px",
      }}
      onMouseEnter={(e: any) => {
        e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.2)";
      }}
      onMouseLeave={(e: any) => {
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
      }}
    >
      {/* Декор элементтері */}
      <div
        style={{
          position: "absolute",
          top: "-15%",
          right: "-15%",
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-25%",
          left: "-20%",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.05)",
          pointerEvents: "none",
        }}
      />

      {/* Иконка */}
      <div
        style={{
          fontSize: "40px",
          marginBottom: "16px",
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
        }}
      >
        {getIcon()}
      </div>

      {/* Мән және тақырып */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <h2
          style={{
            fontSize: "32px",
            margin: 0,
            fontWeight: "800",
            letterSpacing: "-0.5px",
            lineHeight: 1.2,
            textShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          {value.toLocaleString()}
        </h2>

        <p
          style={{
            marginTop: "6px",
            marginBottom: "16px",
            fontSize: "13px",
            fontWeight: "500",
            opacity: 0.9,
            letterSpacing: "0.3px",
          }}
        >
          {title}
        </p>

        {/* Кнопка */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(link);
          }}
          style={{
            padding: "6px 14px",
            borderRadius: "10px",
            border: "none",
            background: "rgba(255,255,255,0.2)",
            backdropFilter: "blur(5px)",
            color: "white",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "600",
            transition: "all 0.2s",
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
          }}
          onMouseEnter={(e: any) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.3)";
            e.currentTarget.style.transform = "translateX(3px)";
          }}
          onMouseLeave={(e: any) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.2)";
            e.currentTarget.style.transform = "translateX(0)";
          }}
        >
          Толығырақ
          <span style={{ fontSize: "14px" }}>→</span>
        </button>
      </div>

      {/* Анимациялық жолақ */}
      <motion.div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: "3px",
          background: "rgba(255,255,255,0.6)",
          borderRadius: "3px",
        }}
        initial={{ width: "0%" }}
        whileHover={{ width: "100%" }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

// ===== TOP STUDENTS LIST =====
const TopStudentsList = ({ students }: any) => {
  // Медаль түстері
  const medalColors = {
    1: 'linear-gradient(135deg, #FFD700 0%, #FFB347 100%)',
    2: 'linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%)',
    3: 'linear-gradient(135deg, #CD7F32 0%, #B87333 100%)',
  };

  const medalIcons = {
    1: '🥇',
    2: '🥈',
    3: '🥉',
  };

  return (
    <div className="space-y-3">
      {students.map((student: any, index: number) => {
        const rank = index + 1;
        const isTop3 = rank <= 3;
        
        return (
          <motion.div
            key={student.id || index}
            style={{
              background: isTop3 
                ? medalColors[rank as keyof typeof medalColors]
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '10px',
              cursor: 'default',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
            }}
          >
            {/* Декор элементтері */}
            <div
              style={{
                position: 'absolute',
                top: '-20%',
                right: '-10%',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                pointerEvents: 'none',
              }}
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Ранг иконкасы */}
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: isTop3 
                      ? 'rgba(255,255,255,0.3)'
                      : 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    backdropFilter: 'blur(5px)',
                  }}
                >
                  {isTop3 ? medalIcons[rank as keyof typeof medalIcons] : '📚'}
                </div>
                
                <div>
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: 'white',
                      margin: 0,
                      textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                    }}
                  >
                    {student.full_name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      style={{
                        fontSize: '12px',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        background: 'rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(5px)',
                        color: 'white',
                      }}
                    >
                      {student.class || '7A'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Орташа балл */}
              <div
                style={{
                  textAlign: 'right',
                }}
              >
                <div
                  style={{
                    fontSize: '28px',
                    fontWeight: '800',
                    color: 'white',
                    lineHeight: 1,
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  }}
                >
                  {student.avg}
                </div>
                <div
                  style={{
                    fontSize: '10px',
                    opacity: 0.8,
                    color: 'white',
                    marginTop: '4px',
                  }}
                >
                  орташа балл
                </div>
              </div>
            </div>
            
            <motion.div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                height: '3px',
                background: 'rgba(255,255,255,0.5)',
                borderRadius: '3px',
              }}
              initial={{ width: '0%' }}
              whileHover={{ width: '100%' }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        );
      })}
    </div>
  );
};

// ===== WEAK STUDENTS LIST =====
const WeakStudentsList = ({ students }: any) => {
  return (
    <div className="space-y-3">
      {students.map((student: any, index: number) => (
        <div
          key={student.id || index}
          
          style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #dc2626 100%)',
            borderRadius: '16px',
            padding: '16px',
            cursor: 'default',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-20%',
              right: '-10%',
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              pointerEvents: 'none',
            }}
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  backdropFilter: 'blur(5px)',
                }}
              >
                ⚠️
              </div>
              
              <div>
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: 'white',
                    margin: 0,
                    textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  }}
                >
                  {student.full_name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    style={{
                      fontSize: '12px',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(5px)',
                      color: 'white',
                    }}
                  >
                    {student.class || '7A'}
                  </span>
                </div>
              </div>
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: '800',
                  color: 'white',
                  lineHeight: 1,
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
              >
                {student.averageGrade || student.grade || '4.5'}
              </div>
              <div
                style={{
                  fontSize: '10px',
                  opacity: 0.8,
                  color: 'white',
                  marginTop: '4px',
                }}
              >
                орташа балл
              </div>
            </div>
          </div>
          
          <motion.div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: '3px',
              background: 'rgba(255,255,255,0.5)',
              borderRadius: '3px',
            }}
            initial={{ width: '0%' }}
            whileHover={{ width: '100%' }}
            transition={{ duration: 0.3 }}
          />
        </div>
      ))}
    </div>
  );
};

// Helper for bar chart colors
const getBarColor = (value: number): string => {
  if (value >= 8) return '#10B981';
  if (value >= 7) return '#3B82F6';
  return '#F59E0B';
};

export default function AdminPanelPage() {
  const { data, status, error, refetch } = useDashboardData();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  // Error state
  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto p-8 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-4">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ошибка загрузки</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => refetch()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            Попробовать снова
          </button>
        </motion.div>
      </div>
    );
  }

  // No data state
  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30" >
        <div className="max-w-7xl mx-auto px-6 py-8">
          <EmptyState
            title="Нет данных"
            message="Не удалось загрузить данные дашборда"
            icon={AlertCircle}
          />
        </div>
      </div>
    );
  }

  const { stats, topStudents, weakStudents, gradeDynamics, subjectStats } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" >

        {/* HEADER с текущей датой */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Әкімші панелі</h1>
              <p className="text-gray-500 mt-1">{currentTime.toLocaleDateString('ru-RU')}</p>
            </div>
          </div>
        </motion.div>

        {/* 4 Статистические карточки */}
        <div style={{ 
          display: "flex", 
          gap: "20px", 
          flexWrap: "nowrap", 
          overflowX: "visible",
          paddingBottom: "12px"
        }}>
          <div style={{ display: "flex", gap: "20px", flexShrink: 0 }}>
            <StatCard
              title="Оқушы"
              value={stats.students}
              color="#17a2b8"
              link="/admin/students"
            />
            <StatCard
              title="Мұғалім"
              value={stats.teachers}
              color="#dc3545"
              link="/admin/teachers"
            />
            <StatCard
              title="Сынып"
              value={stats.classes}
              color="#ffc107"
              link="/admin/classes"
            />
            <StatCard
              title="Барлық баға"
              value={stats.totalGrades || 0}
              color="#28a745"
              link="/admin/grades"
            />
          </div>
        </div>

        {/* Нижний блок: графики */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartCard title="Үлгерім динамикасы" subtitle="Айлар бойынша орташа балл" icon={LineChartIcon}>
            <div className="w-full h-[400px] mt-4">
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={gradeDynamics} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="gradeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 10]} tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={3} fill="url(#gradeGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="Пәндер бойынша үлгерім" subtitle="Орташа балл (0-10 шкала)" icon={BarChart3}>
            <div className="w-full h-[400px] mt-4">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={subjectStats} margin={{ top: 20, right: 30, left: 20, bottom: 20 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
                  <XAxis type="number" domain={[0, 10]} tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="subject" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                    {subjectStats.map((entry: SubjectStat, index: number) => (
                      <Cell key={`cell-${index}`} fill={getBarColor(entry.value)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Таблицы с учениками */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Үздік оқушылар" subtitle="Үлгерімі бойынша үздік 5" icon={Star}>
            {topStudents.length > 0 ? (
              <TopStudentsList students={topStudents} />
            ) : (
              <EmptyState title="Деректер жоқ" message="Үздік оқушылар туралы ақпарат жоқ" icon={Star} />
            )}
          </ChartCard>

          <ChartCard title="Үлгерімі төмен оқушылар" subtitle="Назар аударуды қажет етеді" icon={AlertCircle}>
            {weakStudents.length > 0 ? (
              <WeakStudentsList students={weakStudents} />
            ) : (
              <div className="p-6 text-center">
                <p className="text-green-600 font-semibold text-lg">🎉 Керемет!</p>
                <p className="text-gray-500 text-sm mt-2">Үлгерімі төмен оқушылар жоқ</p>
              </div>
            )}
          </ChartCard>
        </div>

        {/* Footer с датой обновления */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/40 backdrop-blur-sm border border-white/50 shadow-sm">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500">
              Деректер күн сайын жаңартылады * Соңғы жаңарту: {currentTime.toLocaleDateString('ru-RU')}
            </span>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
