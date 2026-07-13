// src/App.tsx
import { useEffect } from 'react';
import { useAuth } from './features/auth/hooks/useAuth';
import AppRouter from './routes/AppRouter';
import { useAuthLoading } from './store/userStore';
import { Toaster } from 'react-hot-toast';
function App() {
  const { checkAuth, isLoading } = useAuth();
  const globalLoading = useAuthLoading();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  if (isLoading || globalLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div>Қолданба жүктелуде...</div>
        <div style={{ fontSize: '14px', color: '#666' }}>
          Авторизацияны тексеру
        </div>
        <Toaster position="top-right" />
      </div>
    );
  }

  return(
  <>
    <AppRouter />
    <Toaster position="top-right" />
  </> );
}

export default App;