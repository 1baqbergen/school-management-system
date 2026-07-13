// src/hooks/useDashboardData.ts
import { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/apiClient';
import type { DashboardData, DashboardStatus } from '../types/dashboard.types';

interface UseDashboardDataReturn {
  data: DashboardData | null;
  status: DashboardStatus;
  error: string | null;
  refetch: () => Promise<void>;
}

const DEFAULT_STATS: DashboardData['stats'] = {
  students: 0,
  teachers: 0,
  classes: 0,
  avgGrade: 0,
  totalGrades: 0,
};

export const useDashboardData = (): UseDashboardDataReturn => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [status, setStatus] = useState<DashboardStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setStatus('loading');
    setError(null);

    try {
      const [
        statsRes,
        topStudentsRes,
        weakStudentsRes,
        gradesRes,
        dynamicsRes,
        subjectRes,
      ] = await Promise.allSettled([
        apiClient.get('/api/dashboard/stats'),
        apiClient.get('/api/dashboard/top-students'),
        apiClient.get('/api/dashboard/weak-students'),
        apiClient.get('/api/grades'),
        apiClient.get('/api/dashboard/grade-dynamics'),
        apiClient.get('/api/dashboard/subject-stats'),
      ]);

      // Process stats
      const stats = statsRes.status === 'fulfilled'
  ? {
      students: Number(statsRes.value.data.students),
      teachers: Number(statsRes.value.data.teachers),
      classes: Number(statsRes.value.data.classes),
      avgGrade: Number(statsRes.value.data.avgGrade),
      totalGrades: (gradesRes.status === 'fulfilled' ? gradesRes.value.data?.length : 0),
    }
  : DEFAULT_STATS;
console.log('STATS:', statsRes);
      // Process top students
      // Process top students
const topStudents = topStudentsRes.status === 'fulfilled'
  ? (topStudentsRes.value.data || []).map((item: any) => ({
      ...item,
      avg: Number(item.avg),
    }))
  : [];

// Process weak students
const weakStudents = weakStudentsRes.status === 'fulfilled'
  ? (weakStudentsRes.value.data || []).map((item: any) => ({
      ...item,
      avg: Number(item.avg),
    }))
  : [];

      // Process grade dynamics
      const gradeDynamics = dynamicsRes.status === 'fulfilled'
  ? (dynamicsRes.value.data || []).map((item: any) => ({
      ...item,
      value: Number(item.value),
    }))
  : [];

      // Process subject stats
      const subjectStats = subjectRes.status === 'fulfilled'
  ? (subjectRes.value.data || []).map((item: any) => ({
      ...item,
      value: Number(item.value),
    }))
  : [];

      setData({
        stats,
        topStudents,
        weakStudents,
        gradeDynamics,
        subjectStats,
      });
      setStatus('success');
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setError('Не удалось загрузить данные дашборда. Пожалуйста, попробуйте позже.');
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, status, error, refetch: fetchData };
};