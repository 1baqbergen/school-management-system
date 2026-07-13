  // src/utils/roleUtils.ts (обновленная версия)
  import type { UserRole } from '../store/userStore';
  // Интерфейс для пункта меню
  export interface MenuItem {
    id: string;
    label: string;
    path: string;
    roles: UserRole[]; // какие роли видят этот пункт
  }

  // Конфигурация меню для разных ролей
  export const menuConfig: MenuItem[] = [
    // Dashboard доступен всем и ведет на /dashboard (который потом редиректит)
    {
      id: 'dashboard',
      label: 'Панель',
      path: '/dashboard', // Всегда ведем на /dashboard
      roles: ['admin', 'teacher', 'student', 'parent'],
    },

    {
    id: 'schedule',
    label: 'Сабақ кестесі',
    path: '/admin/schedule',
    roles: ['admin'],
  },
  {
    id: 'schedule-teacher',
    label: 'Сабақ кестесі',
    path: '/teacher/schedule',
    roles: ['teacher'],
  },
  {
    id: 'schedule-student',
    label: 'Сабақ кестесі',
    path: '/student/schedule',
    roles: ['student'],
  },

    // Админские пункты
    {
      id: 'teachers',
      label: 'Мұғалімдер',
      path: '/admin/teachers',
      roles: ['admin'],
    },
    {
    id: 'classes',
    label: 'Сыныптар',
    path: '/admin/classes',
    roles: ['admin'],
  },
  {
    id: 'students',
    label: 'Оқушылар',
    path: '/admin/students',
    roles: ['admin'],
  },
    {
      id: 'subjects',
      label: 'Пәндер',
      path: '/admin/subjects',
      roles: ['admin'],
    },
    {
    id: 'grades-admin',
    label: 'Бағалар',
    path: '/admin/grades',
    roles: ['admin'],
  },
    // Добавить в menuConfig для ADMIN
  {
    id: 'teacher-subjects',
    label: 'Мұғалім пәндері',
    path: '/admin/teacher-subjects',
    roles: ['admin'],
  },
    // Пункты для учителя
    {
      id: 'my-subjects',
      label: 'Менің пәндерім',
      path: '/teacher/subjects',
      roles: ['teacher'],
    },
    {
      id: 'teacher-students',
      label: 'Оқушылар',
      path: '/teacher/students',
      roles: ['teacher'],
    },
    {
      id: 'grades',
      label: 'Бағалар',
      path: '/teacher/grades',
      roles: ['teacher'],
    },
    // Пункты для ученика
    {
      id: 'my-grades',
      label: 'Менің бағаларым',
      path: '/student/grades',
      roles: ['student'],
    },
    {
    id: 'homeworks-teacher',
    label: 'Үй жұмыстары',
    path: '/teacher/homeworks',
    roles: ['teacher'],
  },
    {
    id: 'homeworks-student',
    label: 'Үй жұмыстары',
    path: '/student/homeworks',
    roles: ['student'],
  },
  {
    id: 'parents',
    label: 'Ата-аналар',
    path: '/admin/parents',
    roles: ['admin'],
  },

    {
    id: 'homeworks-admin',
    label: 'Үй жұмыстары',
    path: '/admin/homeworks',
    roles: ['admin'],
  },
    {
    id: 'ai-admin',
    label: 'AI Көмекші',
    path: '/admin/ai',
    roles: ['admin'],
  },
    {
    id: 'ai-teacher',
    label: 'AI Көмекші',
    path: '/teacher/ai',
    roles: ['teacher'],
  },
    {
    id: 'ai-student',
    label: 'AI Көмекші',
    path: '/student/ai',
    roles: ['student'],
  },
  
  {
    id: 'ai-parent',
    label: 'AI Көмекші',
    path: '/parent/ai',
    roles: ['parent'],
  }
  ];

  // Функция для получения меню по роли
  export const getMenuByRole = (role: UserRole | undefined): MenuItem[] => {
    if (!role) return [];
    return menuConfig.filter(item => item.roles.includes(role));
  };
  export const normalizeRole = (role: unknown): UserRole | undefined => {
    if (role === 'admin' || role === 'teacher' || role === 'student' || role === 'parent') return role;
    return undefined;
  };