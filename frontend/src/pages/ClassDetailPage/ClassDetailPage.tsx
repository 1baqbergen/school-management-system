/*import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { studentApi } from '../../features/students/api/studentApi';
import { classApi } from '../../features/classes/api/classApi';

interface Student {
  id: number;
  full_name: string;
  email: string;
  class_name: string;
  admission_year: string;
}

interface Class {
  id: number;
  name: string;
  class_teacher: string;
  students_count: number;
}

const ClassDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [cls, setCls] = useState<Class | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const classData = await classApi.getById(Number(id));
      setCls(classData);

      const studentsData = await studentApi.getAll({ class_id: id });
      setStudents(studentsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading) return <div>Загрузка...</div>;
  if (!cls) return <div>Класс не найден</div>;

  return (
    <div>
      <h2>{cls.name}</h2>
      <p>Классный руководитель: {cls.class_teacher || '—'}</p>
      <p>Ученики: {cls.students_count}</p>

      <h3>Список учеников</h3>
      <table>
        <thead>
          <tr>
            <th>ФИО</th>
            <th>Email</th>
            <th>Год поступления</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s.id}>
              <td>{s.full_name}</td>
              <td>{s.email}</td>
              <td>{s.admission_year}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClassDetailPage;*/