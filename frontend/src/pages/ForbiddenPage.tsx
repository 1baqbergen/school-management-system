// src/pages/ForbiddenPage.tsx
import { Link } from 'react-router-dom';

const ForbiddenPage = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      gap: '20px'
    }}>
      <h1 style={{ fontSize: '72px', margin: 0 }}>403</h1>
      <h2>Доступ запрещен</h2>
      <p>У вас нет прав для просмотра этой страницы</p>
      <Link to="/" style={{ color: '#007bff', textDecoration: 'none' }}>
        Вернуться на главную
      </Link>
    </div>
  );
};

export default ForbiddenPage;