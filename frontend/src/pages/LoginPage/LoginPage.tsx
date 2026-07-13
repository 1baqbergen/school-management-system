// src/pages/LoginPage/LoginPage.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../features/auth/api/authApi';
import { userStore } from '../../store/userStore';
interface LoginFormInputs {
  email: string;
  password: string;
}
const LoginPage = () => {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const setUser = userStore((state) => state.setUser);
  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setLoginError(null);
    setIsLoading(true);
    try {
      const loginResponse = await authApi.login(data);

// ✅ міндетті түрде /me арқылы толық user алу (class_id осында келеді)
const meUser = await authApi.getMe();

if (meUser) {
  setUser(meUser);
} else {
  // fallback (теорияда керек болмайды)
  setUser(loginResponse.user);
}

    switch (loginResponse.user.role) {
      case 'admin':
        navigate('/admin', { replace: true });
        break;
      case 'teacher':
        navigate('/teacher', { replace: true });
        break;
      case 'student':
        navigate('/student', { replace: true });
        break;
      default:
        navigate('/dashboard', { replace: true });
    }

  } catch (error: any) {
    console.error('Login error:', error);

    if (error.response?.status === 401) {
      setLoginError('Неверный email или пароль');
    } else {
      setLoginError('Ошибка входа');
    }
  } finally {
    setIsLoading(false);
  }
};


  
  const styles = {
    container: {
      display: 'flex',
      width: '100vw',
      height: '100vh',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    },
    leftPanel: {
      width: '40%',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ffffff',
      position: 'relative' as const,
    },
    formContainer: {
      width: '100%',
      maxWidth: '380px',
      padding: '40px',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '24px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08), 0 6px 12px rgba(0, 0, 0, 0.05)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    formTitle: {
      margin: '0 0 8px 0',
      fontSize: '32px',
      fontWeight: '600',
      color: '#111827',
      letterSpacing: '-0.02em',
    },
    formSubtitle: {
      margin: '0 0 32px 0',
      fontSize: '16px',
      color: '#6B7280',
      lineHeight: '24px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '24px',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '6px',
    },
    label: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
      marginLeft: '4px',
    },
    input: {
      width: '100%',
      padding: '14px 16px',
      fontSize: '16px',
      backgroundColor: '#F9FAFB',
      border: '2px solid #E5E7EB',
      borderRadius: '12px',
      outline: 'none',
      transition: 'all 0.2s ease-in-out',
      boxSizing: 'border-box' as const,
      color: '#111827',
    },
    inputFocus: {
      borderColor: '#6366F1',
      boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.1)',
      backgroundColor: '#ffffff',
    },
    inputError: {
      border: '2px solid #ef4444',
      backgroundColor: '#FEF2F2',
    },
    errorMessage: {
      fontSize: '12px',
      color: '#EF4444',
      marginTop: '4px',
      marginLeft: '4px',
    },
    button: {
      width: '100%',
      padding: '14px',
      fontSize: '16px',
      fontWeight: '600',
      color: 'white',
      backgroundColor: isLoading ? '#9CA3AF' : '#111827',
      border: 'none',
      borderRadius: '12px',
      cursor: isLoading ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s ease-in-out',
      marginTop: '8px',
      opacity: isLoading ? 0.7 : 1,
    },
    buttonHover: {
      backgroundColor: '#1F2937',
      transform: 'translateY(-2px)',
      boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.2)',
    },

    errorContainer: {
      padding: '14px 16px',
      backgroundColor: '#FEF2F2',
      border: '1px solid #FEE2E2',
      borderRadius: '12px',
      color: '#991B1B',
      fontSize: '14px',
      marginTop: '16px',
      textAlign: 'center' as const,
    },
    rightPanel: {
      width: '60%',
      height: '100vh',
      background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
      position: 'relative' as const,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    pattern: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
      opacity: 0.6,
    },
    rightContent: {
      position: 'relative' as const,
      zIndex: 1,
      textAlign: 'center' as const,
      color: 'white',
      padding: '48px',
    },

    // Большой заголовок справа
    rightTitle: {
      fontSize: '64px',
      fontWeight: '700',
      margin: '0 0 24px 0',
      letterSpacing: '-0.02em',
      lineHeight: '1.2',
      textShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },

    // Подзаголовок справа
    rightSubtitle: {
      fontSize: '20px',
      opacity: 0.9,
      margin: 0,
      fontWeight: '400',
      lineHeight: '1.6',
    },

    // Акцентная линия
    accentLine: {
      width: '80px',
      height: '4px',
      background: 'rgba(255, 255, 255, 0.3)',
      margin: '32px auto 0',
      borderRadius: '2px',
    },

    // Футер с демо-доступом (обновленный дизайн)
    demoFooter: {
      marginTop: '32px',
      padding: '16px 0 0',
      borderTop: '1px solid #E5E7EB',
      fontSize: '14px',
      color: '#6B7280',
    },

    demoTitle: {
      fontWeight: '600',
      marginBottom: '8px',
      color: '#374151',
    },

    demoList: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '4px',
      fontSize: '13px',
    },
  };

const passwordReg = register('password', {
  required: 'Пароль обязателен',
  minLength: {
    value: 6,
    message: 'Минимум 6 символов',
  },
});


  const emailReg = register('email', {
  required: 'Email обязателен',
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: 'Некорректный email',
  },
});


  return (
    <div style={styles.container}>
      {/* Левая панель с формой */}
      <div style={styles.leftPanel}>
        <div style={styles.formContainer}>
          <h1 style={styles.formTitle}>Қош келдіңіз</h1>
          <p style={styles.formSubtitle}>
            Мектепті басқару жүйесіне кіріңіз 
          </p>

          <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
            {/* Поле Email */}
            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.label}>
                Email
              </label>
              <input
  id="email"
  type="email"
  {...emailReg}
  style={{
    ...styles.input,
    ...(errors.email ? styles.inputError : {}),
  }}
  onFocus={(e) => {
    e.currentTarget.style.borderColor = '#6366F1';
    e.currentTarget.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)';
  }}
  onBlur={(e) => {
    emailReg.onBlur(e); 
    e.currentTarget.style.borderColor = '#E5E7EB';
    e.currentTarget.style.boxShadow = 'none';
  }}
  placeholder="user@school.kz"
  disabled={isLoading}
/>

              {errors.email && (
                <div style={styles.errorMessage}>{errors.email.message}</div>
              )}
            </div>

            {/* Поле Password */}
            <div style={styles.formGroup}>
              <label htmlFor="password" style={styles.label}>
                Пароль
              </label>
              <input
  id="password"
  type="password"
  {...passwordReg}
  style={{
    ...styles.input,
    ...(errors.password ? styles.inputError : {}),
  }}
  onFocus={(e) => {
    e.currentTarget.style.borderColor = '#6366F1';
    e.currentTarget.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)';
  }}
  onBlur={(e) => {
    passwordReg.onBlur(e); // ✅ RHF onBlur
    e.currentTarget.style.borderColor = '#E5E7EB';
    e.currentTarget.style.boxShadow = 'none';
  }}
  placeholder="••••••••"
  disabled={isLoading}
/>

              {errors.password && (
                <div style={styles.errorMessage}>{errors.password.message}</div>
              )}
            </div>

            {/* Кнопка входа */}
            <button
              type="submit"
              disabled={isLoading}
              style={styles.button}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = '#1F2937';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 20px -5px rgba(0, 0, 0, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = '#111827';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {isLoading ? 'Кіру...' : 'Жүйеге кіру'}
            </button>
          </form>

          {/* Ошибка логина */}
          {loginError && (
            <div style={styles.errorContainer}>
              {loginError}
            </div>
          )}

        
        </div>
      </div>

      {/* Правая панель с градиентом */}
      <div style={styles.rightPanel}>
        <div style={styles.pattern} />
        <div style={styles.rightContent}>
          <h1 style={styles.rightTitle}>
            Smart Mektep
            <br />
          </h1>
          <p style={styles.rightSubtitle}>
            Оқу процесін басқарудың 
            <br />
            заманауи платформасы
          </p>
          <div style={styles.accentLine} />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;