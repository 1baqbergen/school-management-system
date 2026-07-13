// src/pages/NotFoundPage.tsx
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      gap: '20px'
    }}>
      <h1 style={{ fontSize: '72px', margin: 0 }}>404</h1>
      <h2>Бет табылмады</h2>
      <p>Сұралған бет жоқ</p>
      <Link to="/" style={{ color: '#007bff', textDecoration: 'none' }}>
        Артқа қайту
      </Link>
    </div>
  );
};

export default NotFoundPage;