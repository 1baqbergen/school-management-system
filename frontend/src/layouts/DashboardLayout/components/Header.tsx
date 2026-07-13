// src/layouts/DashboardLayout/components/Header.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userStore } from '../../../store/userStore';
import { authApi } from '../../../features/auth/api/authApi';
import ProfileModal from '../../../components/ProfileModal/ProfileModal';

const BASE_URL = 'http://localhost:5000';

interface HeaderProps {
  pageTitle: string;
}

const Header = ({ pageTitle }: HeaderProps) => {
  const navigate = useNavigate();
  const user = userStore((state) => state.user);
  const setUser = userStore((state) => state.setUser);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [avatarVersion, setAvatarVersion] = useState(0);

  useEffect(() => {
    const handleAvatarUpdate = () => {
      setAvatarVersion(prev => prev + 1);
    };
    window.addEventListener('avatar-updated', handleAvatarUpdate);
    return () => window.removeEventListener('avatar-updated', handleAvatarUpdate);
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      navigate('/login', { replace: true });
    }
  };

  const getAvatarUrl = () => {
    if (user?.avatar) {
      return `${BASE_URL}${user.avatar}?v=${avatarVersion}`;
    }
    const name = user?.full_name || user?.name || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3B82F6&color=fff&size=40&bold=true`;
  };

  const styles = {
    header: {
      height: '70px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      position: 'sticky' as const,
      top: 0,
      zIndex: 10,
    },
    pageTitle: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#111827',
      margin: 0,
      letterSpacing: '-0.01em',
    },
    userSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      cursor: 'pointer',
      padding: '6px 12px 6px 8px',
      borderRadius: '40px',
      transition: 'all 0.2s ease',
      backgroundColor: '#F9FAFB',
    },
    avatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      objectFit: 'cover' as const,
      border: '2px solid #FFFFFF',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    userName: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
    },
    userRole: {
      fontSize: '12px',
      color: '#6B7280',
      backgroundColor: '#F3F4F6',
      padding: '4px 8px',
      borderRadius: '6px',
      fontWeight: '500',
    },
    logoutButton: {
      padding: '8px 16px',
      backgroundColor: 'transparent',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#6B7280',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
    },
  };

  const getRoleText = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'Әкімші';
      case 'teacher': return 'Мұғалім';
      case 'student': return 'Оқушы';
      case 'parent': return 'Ата-ана';
      default: return 'Қолданушы';
    }
  };

  const displayName = user?.full_name || user?.name || 'Қолданушы';

  return (
    <>
      <header style={styles.header}>
        <h1 style={styles.pageTitle}>{pageTitle}</h1>
        
        <div style={styles.userSection}>
          <div 
            style={styles.userInfo}
            onClick={() => setIsProfileOpen(true)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F3F4F6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#F9FAFB';
            }}
          >
            <img
              src={getAvatarUrl()}
              alt="Avatar"
              style={styles.avatar}
            />
            <span style={styles.userName}>{displayName}</span>
            <span style={styles.userRole}>{getRoleText(user?.role || '')}</span>
          </div>
          
          <button
            style={styles.logoutButton}
            onClick={handleLogout}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F9FAFB';
              e.currentTarget.style.borderColor = '#9CA3AF';
              e.currentTarget.style.color = '#111827';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.color = '#6B7280';
            }}
          >
            Шығу
          </button>
        </div>
      </header>

      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  );
};

export default Header;