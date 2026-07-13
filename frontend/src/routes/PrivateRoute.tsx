import { Navigate, Outlet } from 'react-router-dom';
import { userStore } from '../store/userStore';

const PrivateRoute = () => {
  const user = userStore((s) => s.user);
  const hasHydrated = userStore.persist.hasHydrated();

  if (!hasHydrated) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
};

export default PrivateRoute;
