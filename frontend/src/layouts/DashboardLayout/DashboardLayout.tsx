  // src/layouts/DashboardLayout/DashboardLayout.tsx
  import { useEffect, useState } from 'react';
  import { Outlet, useLocation } from 'react-router-dom';
  import Sidebar from './components/Sidebar';
  import Header from './components/Header';
  import { userStore } from '../../store/userStore';

  // Маппинг путей к названиям страниц
  const pageTitles: Record<string, string> = {
    '/dashboard': 'Панель',
    '/admin/schedule': 'Сабақ кестесі',
    '/student/schedule': 'Сабақ кестесі',
    '/teacher/schedule': 'Сабақ кестесі',
    '/admin/teachers': 'Мұғалімдерді басқару',
    '/admin/students': 'Оқушыларды басқару',
    '/admin/subjects': 'Пәндерді басқару',
    '/teacher/subjects': 'Менің пәндерім',
    '/teacher/students': 'Менің оқушыларым',
    '/teacher/grades': 'Бағалар',
    '/student/grades': 'Менің бағаларым',
    '/admin/grades': 'Бағалар',
    '/admin/classes': 'Сыныптар',
    '/admin/teacher-subjects': 'Мұғалімді пәнге бекіту',
    '/admin/parents': 'Ата-аналар',
    '/admin/homeworks': 'Үй жұмыстары',
    '/teacher/homeworks': 'Үй жұмыстары',
    '/student/homeworks': 'Үй жұмыстары',
    '/ai': 'AI Көмекші',
    '/admin/ai': 'AI Көмекші',
    '/teacher/ai': 'AI Көмекші',
    '/student/ai': 'AI Көмекші',
    '/parent/ai': 'AI Көмекші',
    '/parent': 'Менің балаларым',
  };

  const DashboardLayout = () => {
    const location = useLocation();
    const user = userStore((state) => state.user);
    const [pageTitle, setPageTitle] = useState('Панель');

    // Обновляем заголовок при смене маршрута
    useEffect(() => {
      // Ищем точное совпадение или частичное
      const path = location.pathname;
      let title = pageTitles[path];
      
      if (!title) {
        // Если точного совпадения нет, пробуем найти по началу пути
        const matchingPath = Object.keys(pageTitles).find(key => 
          path.startsWith(key) && key !== '/'
        );
        title = matchingPath ? pageTitles[matchingPath] : 'Панель';
      }
      
      setPageTitle(title);
    }, [location.pathname]);

    // Если пользователь не загружен, показываем заглушку
    if (!user) {
      return null;
    }

    const styles = {
      layout: {
        //display: 'flex',
        minHeight: '100vh',

        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        
      },
      mainContent: {
        flex: 1,
        marginLeft: '240px', // ширина sidebar
        width: 'calc(100% - 240px)', 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column' as const,
      },
      contentArea: {
        padding: '32px',
        flex: 1,
      },
    };

    return (
      <div style={styles.layout}>
        {/* Sidebar - фиксированный слева */}
        <Sidebar />
        
        {/* Основной контент */}
        <main style={styles.mainContent}>
          <Header pageTitle={pageTitle} />
          <div style={styles.contentArea}>
            <Outlet />
          </div>
        </main>
      </div>
    );
  };

  export default DashboardLayout;