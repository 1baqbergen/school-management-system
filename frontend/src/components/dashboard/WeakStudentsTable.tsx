// src/components/dashboard/WeakStudentsTable.tsx
import { AlertCircle, School } from 'lucide-react';
import type { Student } from '../../types/dashboard.types';

interface WeakStudentsTableProps {
  students: Student[];
}

const getGradeColor = (avg: number): string => {
  if (avg <= 3) return 'from-red-500 to-rose-600';
  if (avg <= 4) return 'from-orange-500 to-amber-600';
  return 'from-yellow-500 to-amber-600';
};

export const WeakStudentsTable = ({ students }: WeakStudentsTableProps) => {
  const weakFive = students.slice(0, 5);

  return (
    <div className="space-y-3 min-h-[200px]">
      {weakFive.map((student, idx) => {
        const gradeColor = getGradeColor(student.avg);

        return (
          <div
            key={idx}
            className="group flex items-center justify-between p-3 rounded-xl hover:bg-gray-50/50 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradeColor} flex items-center justify-center text-white font-bold shadow-lg`}>
                {student.full_name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                  {student.full_name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                    <School className="w-3 h-3 mr-1" />
                    {student.class}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r ${gradeColor} text-white font-bold text-sm shadow-md`}>
                <AlertCircle className="w-3 h-3" />
                {Number(student.avg).toFixed(1)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};