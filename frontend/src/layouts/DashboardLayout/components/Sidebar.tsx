// src/layouts/DashboardLayout/components/Sidebar.tsx
import { NavLink, useLocation } from 'react-router-dom';
import { userStore } from '../../../store/userStore';
import { getMenuByRole, normalizeRole  } from '../../../utils/roleUtils';

const Sidebar = () => {
  const location = useLocation();
  const user = userStore((state) => state.user);
  
  // Получаем меню в зависимости от роли пользователя
  const role = normalizeRole(user?.role);
const menuItems = getMenuByRole(role);

  const styles = {
    sidebar: {
      width: '240px',
      height: '100vh',
      backgroundColor: '#1a1f2e',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column' as const,
      position: 'fixed' as const,
      left: 0,
      top: 0,
      overflowY: 'auto' as const,
      boxShadow: '2px 0 8px rgba(0, 0, 0, 0.15)',
    },
    logo: {
      padding: '24px 20px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      marginBottom: '24px',
    },
    logoText: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#ffffff',
      margin: 0,
      letterSpacing: '-0.01em',
    },
    logoSubtext: {
      fontSize: '12px',
      color: 'rgba(255, 255, 255, 0.5)',
      marginTop: '4px',
    },
    nav: {
      flex: 1,
      padding: '0 12px',
    },
    navList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    navItem: {
      marginBottom: '4px',
    },
    navLink: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 16px',
      borderRadius: '8px',
      color: 'rgba(255, 255, 255, 0.7)',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.2s ease-in-out',
    },
    navLinkActive: {
      backgroundColor: 'rgba(99, 102, 241, 0.15)',
      color: '#ffffff',
    },
    footer: {
      padding: '20px',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      fontSize: '12px',
      color: 'rgba(255, 255, 255, 0.4)',
      textAlign: 'center' as const,
    },
  };

  return (
    <aside style={styles.sidebar}>
      {/* Логотип */}
      <div style={styles.logo}>
        <h2 style={styles.logoText}>School Manager</h2>
        <div style={styles.logoSubtext}>Education Platform</div>
      </div>

      {/* Навигация */}
      <nav style={styles.nav}>
        <ul style={styles.navList}>
          {menuItems.map((item) => (
            <li key={item.id} style={styles.navItem}>
              <NavLink
                to={item.path}
                style={({ isActive }) => ({
                  ...styles.navLink,
                  ...(isActive ? styles.navLinkActive : {}),
                })}
                onMouseEnter={(e) => {
                  if (!location.pathname.includes(item.path)) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!location.pathname.includes(item.path)) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Футер сайдбара */}
      <div style={styles.footer}>
        <div>v1.0.0</div>
      </div>
    </aside>
  );
};

export default Sidebar;