import type { UserRole } from '../store/userStore';
export interface PrivateRouteProps {
  children?: React.ReactNode;
}
export interface RoleBasedRouteProps {
  allowedRoles: UserRole[];
  children?: React.ReactNode;
}