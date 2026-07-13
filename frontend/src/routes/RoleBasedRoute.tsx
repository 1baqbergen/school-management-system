// src/routes/RoleBasedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useUser, useAuthLoading } from '../store/userStore';
import type { UserRole } from '../store/userStore';
import { normalizeRole } from '../utils/roleUtils';
// Интерфейс для пропсов
interface RoleBasedRouteProps {
  allowedRoles: UserRole[];
}

/**
 * Компонент для защиты маршрутов на основе роли пользователя
 * Проверяет, имеет ли текущий пользователь доступ к маршруту
 * 
 * @param allowedRoles - массив ролей, которым разрешен доступ
 */
const RoleBasedRoute = ({ allowedRoles }: RoleBasedRouteProps) => {
  // Получаем данные пользователя из стора
  const user = useUser();
  const isLoading = useAuthLoading();

  // Пока проверяем авторизацию
  if (isLoading) {
    return null;
  }

  // Проверяем, что пользователь существует и его роль разрешена
  const role = normalizeRole(user?.role);
  const hasAccess = !!role && allowedRoles.includes(role);

  if (!hasAccess) {
    console.log(`RoleBasedRoute: доступ запрещен для роли ${user?.role}. Требуется роль из списка:`, allowedRoles);
    
    // Если пользователь не авторизован (странная ситуация, так как RouteBasedRoute должен быть внутри PrivateRoute)
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    
    // Если роль не подходит - редирект на страницу 403
    return <Navigate to="/403" replace />;
  }

  console.log(`RoleBasedRoute: доступ разрешен для роли ${user?.role}`);
  return <Outlet />;
};

export default RoleBasedRoute;