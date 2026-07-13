// src/components/ProfileModal/ProfileModal.tsx
import { useState, useEffect, useRef } from 'react';
import { X, Camera, Lock, User, Mail, Phone, Info, Save, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import apiClient from '../../services/apiClient';
import { userStore } from '../../store/userStore';

const BASE_URL = 'http://localhost:5000'; // 🔥 BACKEND URL

interface UserProfile {
  id: number;
  full_name: string;
  email: string;
  role: string;
  phone: string;
  bio: string;
  avatar: string | null;
}

const AvatarUpload = ({ avatar, onAvatarChange, isLoading }: { 
  avatar: string | null; 
  onAvatarChange: (file: File) => Promise<void>;
  isLoading: boolean;
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 🔥 avatar өзгергенде preview жаңарту
  useEffect(() => {
    if (avatar) {
      setPreview(`${BASE_URL}${avatar}`);
    } else {
      setPreview(null);
    }
  }, [avatar]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Сурет файлын таңдаңыз');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Файл өлшемі 5MB-дан аспауы керек');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setIsUploading(true);
    try {
      await onAvatarChange(file);
    } finally {
      setIsUploading(false);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: '12px',
    },
    avatarWrapper: {
      position: 'relative' as const,
      cursor: isLoading || isUploading ? 'not-allowed' : 'pointer',
    },
    avatar: {
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      objectFit: 'cover' as const,
      border: '3px solid #FFFFFF',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      transition: 'all 0.2s ease',
    },
    uploadOverlay: {
      position: 'absolute' as const,
      bottom: 0,
      right: 0,
      backgroundColor: '#3B82F6',
      borderRadius: '50%',
      padding: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      border: '2px solid #FFFFFF',
    },
    uploadText: {
      fontSize: '12px',
      color: '#64748B',
      textAlign: 'center' as const,
    },
  };

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent('User')}&background=3B82F6&color=fff&size=100`;

  return (
    <div style={styles.container}>
      <div 
        style={styles.avatarWrapper}
        onClick={() => !isLoading && !isUploading && fileInputRef.current?.click()}
      >
        <img
          src={preview || defaultAvatar}
          alt="Avatar"
          style={{
            ...styles.avatar,
            opacity: isLoading || isUploading ? 0.6 : 1,
          }}
        />
        <div 
          style={styles.uploadOverlay}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#2563EB';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#3B82F6';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <Camera size={16} color="#FFFFFF" />
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          disabled={isLoading || isUploading}
        />
      </div>
      {(isLoading || isUploading) && (
        <div style={styles.uploadText}>Жүктелуде...</div>
      )}
    </div>
  );
};

// 🔥 ProfileForm компоненті
const ProfileForm = ({ profile, onUpdate, isLoading }: {
  profile: UserProfile;
  onUpdate: (data: Partial<UserProfile>) => Promise<void>;
  isLoading: boolean;
}) => {
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    bio: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData({
      full_name: profile.full_name || '',
      phone: profile.phone || '',
      bio: profile.bio || '',
    });
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onUpdate(formData);
    } finally {
      setIsSaving(false);
    }
  };

  const styles = {
    form: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '20px',
    },
    field: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '6px',
    },
    label: {
      fontSize: '13px',
      fontWeight: '500',
      color: '#374151',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    input: {
      padding: '10px 14px',
      fontSize: '14px',
      border: '1px solid #E5E7EB',
      borderRadius: '12px',
      outline: 'none',
      transition: 'all 0.2s ease',
      backgroundColor: '#FFFFFF',
    },
    textarea: {
      padding: '10px 14px',
      fontSize: '14px',
      border: '1px solid #E5E7EB',
      borderRadius: '12px',
      outline: 'none',
      transition: 'all 0.2s ease',
      backgroundColor: '#FFFFFF',
      minHeight: '80px',
      resize: 'vertical' as const,
      fontFamily: 'inherit',
    },
    saveButton: {
      padding: '10px 20px',
      backgroundColor: '#3B82F6',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      justifyContent: 'center',
    },
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.field}>
        <label style={styles.label}>
          <User size={16} />
          Толық аты-жөні
        </label>
        <input
          type="text"
          value={formData.full_name}
          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          style={styles.input}
          disabled={isLoading || isSaving}
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>
          <Mail size={16} />
          Email
        </label>
        <input
          type="email"
          value={profile.email}
          style={{ ...styles.input, backgroundColor: '#F9FAFB', cursor: 'not-allowed' }}
          disabled
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>
          <Phone size={16} />
          Телефон
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          style={styles.input}
          disabled={isLoading || isSaving}
          placeholder="+7 (xxx) xxx-xx-xx"
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>
          <Info size={16} />
          Өзім туралы
        </label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          style={styles.textarea}
          disabled={isLoading || isSaving}
          placeholder="Өзіңіз туралы қысқаша..."
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || isSaving}
        style={{
          ...styles.saveButton,
          opacity: isLoading || isSaving ? 0.7 : 1,
          cursor: isLoading || isSaving ? 'not-allowed' : 'pointer',
        }}
      >
        <Save size={16} />
        {isSaving ? 'Сақталуда...' : 'Өзгерістерді сақтау'}
      </button>
    </form>
  );
};

const PasswordForm = ({ onChangePassword, isLoading }: {
  onChangePassword: (data: { old_password: string; new_password: string }) => Promise<void>;
  isLoading: boolean;
}) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('Құпия сөздер сәйкес келмейді');
      return;
    }

    if (newPassword.length < 6) {
      setError('Жаңа құпия сөз кемінде 6 таңбадан тұруы керек');
      return;
    }

    setIsChanging(true);
    try {
      await onChangePassword({ old_password: oldPassword, new_password: newPassword });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Құпия сөзді өзгерту кезінде қате');
    } finally {
      setIsChanging(false);
    }
  };

  const styles = {
    form: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '20px',
    },
    field: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '6px',
    },
    label: {
      fontSize: '13px',
      fontWeight: '500',
      color: '#374151',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    passwordWrapper: {
      position: 'relative' as const,
    },
    input: {
      width: '100%',
      padding: '10px 40px 10px 14px',
      fontSize: '14px',
      border: '1px solid #E5E7EB',
      borderRadius: '12px',
      outline: 'none',
      transition: 'all 0.2s ease',
      backgroundColor: '#FFFFFF',
    },
    eyeIcon: {
      position: 'absolute' as const,
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      cursor: 'pointer',
      color: '#9CA3AF',
    },
    saveButton: {
      padding: '10px 20px',
      backgroundColor: '#10B981',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      justifyContent: 'center',
    },
    error: {
      padding: '10px',
      backgroundColor: '#FEF2F2',
      border: '1px solid #FEE2E2',
      borderRadius: '10px',
      color: '#DC2626',
      fontSize: '13px',
    },
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.field}>
        <label style={styles.label}>
          <Lock size={16} />
          Ағымдағы құпия сөз
        </label>
        <div style={styles.passwordWrapper}>
          <input
            type={showOldPassword ? 'text' : 'password'}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            style={styles.input}
            disabled={isLoading || isChanging}
            required
          />
          <div
            style={styles.eyeIcon}
            onClick={() => setShowOldPassword(!showOldPassword)}
          >
            {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </div>
        </div>
      </div>

      <div style={styles.field}>
        <label style={styles.label}>
          <Lock size={16} />
          Жаңа құпия сөз
        </label>
        <div style={styles.passwordWrapper}>
          <input
            type={showNewPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={styles.input}
            disabled={isLoading || isChanging}
            required
          />
          <div
            style={styles.eyeIcon}
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </div>
        </div>
      </div>

      <div style={styles.field}>
        <label style={styles.label}>
          <Lock size={16} />
          Жаңа құпия сөзді растау
        </label>
        <div style={styles.passwordWrapper}>
          <input
            type={showNewPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={styles.input}
            disabled={isLoading || isChanging}
            required
          />
        </div>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <button
        type="submit"
        disabled={isLoading || isChanging}
        style={{
          ...styles.saveButton,
          opacity: isLoading || isChanging ? 0.7 : 1,
          cursor: isLoading || isChanging ? 'not-allowed' : 'pointer',
        }}
      >
        <Save size={16} />
        {isChanging ? 'Өзгертілуде...' : 'Құпия сөзді өзгерту'}
      </button>
    </form>
  );
};

// ============================================================
// MAIN MODAL COMPONENT
// ============================================================

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal = ({ isOpen, onClose }: ProfileModalProps) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  const { user, setUser } = userStore();

  useEffect(() => {
    if (isOpen) {
      fetchProfile();
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/api/profile/me');
      setProfile(response.data);
    } catch (error) {
      showToast('error', 'Профильді жүктеу мүмкін болмады');
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpdateProfile = async (data: Partial<UserProfile>) => {
    try {
      const response = await apiClient.put('/api/profile/update', data);
      const updatedProfile = response.data;
      setProfile(updatedProfile);
      
      if (user) {
        setUser({ 
          ...user, 
          full_name: updatedProfile.full_name,
          name: updatedProfile.full_name
        });
      }
      showToast('success', 'Профиль сәтті жаңартылды');
    } catch (error) {
      showToast('error', 'Профильді жаңарту кезінде қате');
      throw error;
    }
  };

  const handleAvatarChange = async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await apiClient.put('/api/profile/avatar', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
      setProfile(prev => prev ? { ...prev, avatar: response.data.avatar } : null);
      if (user) {
        setUser({
            ...user,
            avatar: response.data.avatar
        });
      }
      window.dispatchEvent(new Event('avatar-updated'));
      
      showToast('success', 'Аватар сәтті жаңартылды');
    } catch (error) {
      showToast('error', 'Аватарды жүктеу кезінде қате');
      throw error;
    }
  };

  const handleChangePassword = async (data: { old_password: string; new_password: string }) => {
    await apiClient.put('/api/profile/change-password', data);
    showToast('success', 'Құпия сөз сәтті өзгертілді');
  };

  if (!isOpen) return null;

  const styles = {
    overlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.2s ease-out',
    },
    modal: {
      backgroundColor: '#FFFFFF',
      borderRadius: '24px',
      width: '90%',
      maxWidth: '700px',
      maxHeight: '90vh',
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      animation: 'slideUp 0.3s ease-out',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 24px',
      borderBottom: '1px solid #F0F2F5',
      background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
      color: '#FFFFFF',
      flexShrink: 0,
    },
    title: {
      fontSize: '20px',
      fontWeight: '600',
      margin: 0,
    },
    closeButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#FFFFFF',
      opacity: 0.8,
      transition: 'opacity 0.2s ease',
    },
    tabs: {
      display: 'flex',
      gap: '8px',
      padding: '16px 24px 0 24px',
      borderBottom: '1px solid #F0F2F5',
      flexShrink: 0,
    },
    tab: {
      padding: '10px 20px',
      fontSize: '14px',
      fontWeight: '500',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#64748B',
      borderRadius: '10px 10px 0 0',
      transition: 'all 0.2s ease',
    },
    activeTab: {
      color: '#3B82F6',
      backgroundColor: '#EFF6FF',
      position: 'relative' as const,
    },
    content: {
      padding: '24px',
      overflowY: 'auto' as const,
      flex: 1,
    },
    avatarSection: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '24px',
    },
    toast: {
      position: 'fixed' as const,
      bottom: '24px',
      right: '24px',
      padding: '12px 20px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      zIndex: 1001,
      animation: 'slideInRight 0.3s ease-out',
    },
    toastSuccess: {
      backgroundColor: '#DCFCE7',
      color: '#166534',
      border: '1px solid #86EFAC',
    },
    toastError: {
      backgroundColor: '#FEE2E2',
      color: '#991B1B',
      border: '1px solid #FECACA',
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '400px',
    },
    skeleton: {
      width: '100%',
      height: '200px',
      backgroundColor: '#F3F4F6',
      borderRadius: '12px',
      animation: 'pulse 1.5s ease-in-out infinite',
    },
  };

  const animationStyles = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(100px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `;

  return (
    <>
      <style>{animationStyles}</style>
      <div style={styles.overlay} onClick={onClose}>
        <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div style={styles.header}>
            <h2 style={styles.title}>Пайдаланушы профилі</h2>
            <button
              style={styles.closeButton}
              onClick={onClose}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.8'; }}
            >
              <X size={24} />
            </button>
          </div>

          <div style={styles.tabs}>
            <button
              style={{
                ...styles.tab,
                ...(activeTab === 'profile' ? styles.activeTab : {}),
              }}
              onClick={() => setActiveTab('profile')}
            >
              <User size={16} style={{ display: 'inline', marginRight: '8px' }} />
              Профиль
            </button>
            <button
              style={{
                ...styles.tab,
                ...(activeTab === 'security' ? styles.activeTab : {}),
              }}
              onClick={() => setActiveTab('security')}
            >
              <Lock size={16} style={{ display: 'inline', marginRight: '8px' }} />
              Қауіпсіздік
            </button>
          </div>

          <div style={styles.content}>
            {isLoading ? (
              <div style={styles.loadingContainer}>
                <div style={styles.skeleton} />
              </div>
            ) : (
              profile && (
                <>
                  {activeTab === 'profile' && (
                    <>
                      <div style={styles.avatarSection}>
                        <AvatarUpload
                          avatar={profile.avatar}
                          onAvatarChange={handleAvatarChange}
                          isLoading={isLoading}
                        />
                      </div>
                      <ProfileForm
                        profile={profile}
                        onUpdate={handleUpdateProfile}
                        isLoading={isLoading}
                      />
                    </>
                  )}

                  {activeTab === 'security' && (
                    <PasswordForm
                      onChangePassword={handleChangePassword}
                      isLoading={isLoading}
                    />
                  )}
                </>
              )
            )}
          </div>
        </div>
      </div>

      {toast && (
        <div style={{ ...styles.toast, ...(toast.type === 'success' ? styles.toastSuccess : styles.toastError) }}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {toast.message}
        </div>
      )}
    </>
  );
};

export default ProfileModal;