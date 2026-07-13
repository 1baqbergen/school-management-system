  // src/routes/AppRouter.tsx (обновленная версия с исправлением)
  import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
  import { Suspense, lazy } from 'react';

  // Импорты компонентов маршрутизации
  import PrivateRoute from './PrivateRoute';
  import RoleBasedRoute from './RoleBasedRoute';
  import RoleDashboardRedirect from './RoleDashboardRedirect'; // Импортируем новый компонент
  import ParentsPage from '../pages/ParentsPage/ParentsPage';
  import ParentDashboardPage from '../pages/ParentDashboardPage/ParentDashboardPage';


  // Ленивая загрузка страниц
  const LoginPage = lazy(() => import('../pages/LoginPage/LoginPage'));
  const ForbiddenPage = lazy(() => import('../pages/ForbiddenPage'));
  const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

  // Импортируем DashboardLayout
  import DashboardLayout from '../layouts/DashboardLayout/DashboardLayout';

  // Страницы для разных ролей
  const AdminPanelPage = lazy(() => import('../pages/AdminPanelPage'));
  const TeacherPanelPage = lazy(() => import('../pages/TeacherPanelPage'));
  const StudentPanelPage = lazy(() => import('../pages/StudentPanelPage'));
  const ClassesPage = lazy(() => import('../pages/ClassesPage/ClassesPage'));
  const SchedulePage = lazy(() => import('../pages/SchedulePage/SchedulePage'));
  const TeachersPage = lazy(() => import('../pages/TeachersPage/TeachersPage'));
  const StudentsPage = lazy(() => import('../pages/StudentsPage/StudentsPage'));
  const SubjectsPage = lazy(() => import('../pages/SubjectsPage/SubjectsPage'));
  const MySubjectsPage = lazy(() => import('../pages/MySubjectsPage/MySubjectsPage'));
  const GradesPage = lazy(() => import('../pages/GradesPage/GradesPage'));
  const TeacherSubjectsPage = lazy(() => import('../pages/TeacherSubjectsPage/TeacherSubjectsPage'));
  const HomeworkPage = lazy(() => import('../pages/HomeworkPage/HomeworkPage'));
  const AIPage = lazy(() => import('../pages/AIPage/AIPage'));
  // Компонент загрузки
  const PageLoader = () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      Загрузка...
    </div>
  );

  const AppRouter = () => {
    return (
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Публичные маршруты */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/403" element={<ForbiddenPage />} />
            <Route path="/404" element={<NotFoundPage />} />

            {/* Защищенные маршруты с Layout */}
            <Route element={<PrivateRoute />}>
              <Route element={<DashboardLayout />}>
                
                {/* РЕДИРЕКТ С /dashboard В ЗАВИСИМОСТИ ОТ РОЛИ */}
                <Route path="/dashboard" element={<RoleDashboardRedirect />} />
                
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                <Route element={<RoleBasedRoute allowedRoles={['admin']} />}>
                  <Route path="/admin" element={<AdminPanelPage />} />
                  <Route path="/admin/schedule" element={<SchedulePage />} />
                  <Route path="/admin/teachers" element={<TeachersPage />} />
                  <Route path="/admin/students" element={<StudentsPage />} />
                  <Route path="/admin/subjects" element={<SubjectsPage />} />
                  <Route path="/admin/grades" element={<GradesPage />} />
                  <Route path="/admin/classes" element={<ClassesPage />} />
                  <Route path="/admin/teacher-subjects" element={<TeacherSubjectsPage />} />
                  <Route path="/admin/homeworks" element={<HomeworkPage />} />
                  <Route path="/admin/ai" element={<AIPage />} />
                  <Route path="/admin/parents" element={<ParentsPage />} />
                </Route>

                <Route element={<RoleBasedRoute allowedRoles={['teacher']} />}>
                  <Route path="/teacher" element={<TeacherPanelPage />} />
                  <Route path="/teacher/schedule" element={<SchedulePage />} />
                  <Route path="/teacher/subjects" element={<MySubjectsPage />} />
                  <Route path="/teacher/students" element={<StudentsPage />} />
                  <Route path="/teacher/grades" element={<GradesPage />} />
                  <Route path="/teacher/homeworks" element={<HomeworkPage />} />
                  <Route path="/teacher/ai" element={<AIPage />} />
                </Route>

                <Route element={<RoleBasedRoute allowedRoles={['student']} />}>
                  <Route path="/student" element={<StudentPanelPage />} />
                  <Route path="/student/schedule" element={<SchedulePage />} />
                  <Route path="/student/grades" element={<GradesPage />} />
                  <Route path="/student/homeworks" element={<HomeworkPage />} />
                  <Route path="/student/ai" element={<AIPage />} />
                </Route>
                <Route element={<RoleBasedRoute allowedRoles={['parent']} />}>
                  <Route path="/parent" element={<ParentDashboardPage />} />
                  <Route path="/parent/ai" element={<AIPage />} />
                </Route>
                
              </Route>
            </Route>

            {/* 404 - всегда последний */}
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    );
  };

  export default AppRouter;