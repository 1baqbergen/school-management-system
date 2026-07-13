// src/components/dashboard/TopStudentsTable.tsx
import { Trophy, School } from 'lucide-react';
import type { Student } from '../../types/dashboard.types';

interface TopStudentsTableProps {
  students: Student[];
}

const getGradeColor = (avg: number): string => {
  if (avg >= 9) return 'from-green-500 to-emerald-600';
  if (avg >= 8) return 'from-blue-500 to-indigo-600';
  if (avg >= 7) return 'from-yellow-500 to-amber-600';
  return 'from-orange-500 to-red-600';
};

const getMedalEmoji = (index: number): string | null => {
  if (index === 0) return '🥇';
  if (index === 1) return '🥈';
  if (index === 2) return '🥉';
  return null;
};

export const TopStudentsTable = ({ students }: TopStudentsTableProps) => {
  const topFive = students.slice(0, 5);

  return (
    <div className="space-y-3">
      {topFive.map((student, idx) => {
        const gradeColor = getGradeColor(student.avg);
        const medal = getMedalEmoji(idx);

        return (
          <div
            key={student.full_name}
            className="group flex items-center justify-between p-3 rounded-xl hover:bg-gray-50/50 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradeColor} flex items-center justify-center text-white font-bold shadow-lg`}>
                  {student.full_name.charAt(0)}
                </div>
                {medal && (
                  <div className="absolute -top-1 -right-1 text-sm animate-bounce">
                    {medal}
                  </div>
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
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
                <Trophy className="w-3 h-3" />
                {Number(student.avg).toFixed(1)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};