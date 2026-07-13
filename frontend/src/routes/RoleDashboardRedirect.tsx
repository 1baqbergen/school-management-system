// src/routes/RoleDashboardRedirect.tsx
import { Navigate } from 'react-router-dom';
import { useUser, useAuthLoading } from '../store/userStore';

const RoleDashboardRedirect = () => {
  const user = useUser();
  const isLoading = useAuthLoading();

  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const role = String(user.role).toLowerCase(); // ✅ нормализация

  switch (role) {
    case 'admin':
      return <Navigate to="/admin" replace />;
    case 'teacher':
      return <Navigate to="/teacher" replace />;
    case 'student':
      return <Navigate to="/student" replace />;
    case 'parent':
      return <Navigate to="/parent" replace/>
    default:
      return <Navigate to="/login" replace />;
  }
};

export default RoleDashboardRedirect;
