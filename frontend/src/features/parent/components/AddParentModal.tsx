// src/features/parent/components/AddParentModal.tsx
import { useState } from 'react';
import { X, UserPlus, Mail, Lock, Phone, User, Eye, EyeOff, Sparkles } from 'lucide-react';

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
    padding: '16px',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: '28px',
    width: '100%',
    maxWidth: '480px',
    maxHeight: '90vh',
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    animation: 'modalEnter 0.2s ease-out',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid #F0F2F5',
    background: '#FFFFFF',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  iconBox: {
    width: '36px',
    height: '36px',
    background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    margin: 0,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#9CA3AF',
    transition: 'all 0.2s ease',
    padding: '4px',
    borderRadius: '8px',
  },
  form: {
    padding: '24px',
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
    gap: '8px',
  },
  labelIcon: {
    color: '#9CA3AF',
  },
  requiredStar: {
    color: '#3B82F6',
    marginLeft: '2px',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    fontSize: '14px',
    border: '1px solid #E5E7EB',
    borderRadius: '14px',
    outline: 'none',
    transition: 'all 0.2s ease',
    backgroundColor: '#F9FAFB',
    boxSizing: 'border-box' as const,
  },
  passwordWrapper: {
    position: 'relative' as const,
  },
  passwordInput: {
    width: '100%',
    padding: '12px 40px 12px 14px',
    fontSize: '14px',
    border: '1px solid #E5E7EB',
    borderRadius: '14px',
    outline: 'none',
    transition: 'all 0.2s ease',
    backgroundColor: '#F9FAFB',
    boxSizing: 'border-box' as const,
  },
  eyeButton: {
    position: 'absolute' as const,
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#9CA3AF',
    padding: '4px',
  },
  errorBox: {
    padding: '12px',
    backgroundColor: '#FEF2F2',
    border: '1px solid #FEE2E2',
    borderRadius: '12px',
  },
  errorText: {
    fontSize: '13px',
    color: '#DC2626',
    margin: 0,
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '8px',
  },
  cancelButton: {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  submitButton: (disabled: boolean) => ({
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#FFFFFF',
    background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    border: 'none',
    borderRadius: '12px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  }),
};

interface AddParentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export const AddParentModal = ({ isOpen, onClose, onSubmit }: AddParentModalProps) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
      onClose();
      setFormData({ full_name: '', email: '', password: '', phone: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ата-ананы қосу кезінде қате');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.iconBox}>
              <UserPlus size={18} color="#FFFFFF" />
            </div>
            <h2 style={styles.title}>Ата-ана қосу</h2>
          </div>
          <button
            onClick={onClose}
            style={styles.closeButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F3F4F6';
              e.currentTarget.style.color = '#374151';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#9CA3AF';
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>
              <User size={14} style={styles.labelIcon} />
              Толық аты-жөні <span style={styles.requiredStar}>*</span>
            </label>
            <input
              type="text"
              required
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              style={styles.input}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#3B82F6';
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#E5E7EB';
                e.currentTarget.style.backgroundColor = '#F9FAFB';
                e.currentTarget.style.boxShadow = 'none';
              }}
              placeholder="Толық Аты Жөні"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>
              <Mail size={14} style={styles.labelIcon} />
              Email <span style={styles.requiredStar}>*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={styles.input}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#3B82F6';
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#E5E7EB';
                e.currentTarget.style.backgroundColor = '#F9FAFB';
                e.currentTarget.style.boxShadow = 'none';
              }}
              placeholder="parent@school.kz"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>
              <Lock size={14} style={styles.labelIcon} />
              Құпия сөз <span style={styles.requiredStar}>*</span>
            </label>
            <div style={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                style={styles.passwordInput}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#3B82F6';
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#E5E7EB';
                  e.currentTarget.style.backgroundColor = '#F9FAFB';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                placeholder="Кемінде 6 таңба"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>
              <Phone size={14} style={styles.labelIcon} />
              Телефон
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              style={styles.input}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#3B82F6';
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#E5E7EB';
                e.currentTarget.style.backgroundColor = '#F9FAFB';
                e.currentTarget.style.boxShadow = 'none';
              }}
              placeholder="+7 (777) 777-77-77"
            />
          </div>

          {error && (
            <div style={styles.errorBox}>
              <p style={styles.errorText}>{error}</p>
            </div>
          )}

          <div style={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              style={styles.cancelButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#E5E7EB';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#F3F4F6';
              }}
            >
              Болдырмау
            </button>
            <button
              type="submit"
              disabled={loading}
              style={styles.submitButton(loading)}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {loading ? (
                <>
                  <div style={{ width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Қосылуда...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Қосу
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};