// src/components/dashboard/StatCard.tsx
import { ArrowUpRight, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  trend?: number;
  suffix?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'pink';
  delay?: number;
}

const colorConfig = {
  blue: { bg: 'bg-blue-50', icon: 'text-blue-600', gradient: 'from-blue-500 to-blue-600' },
  green: { bg: 'bg-emerald-50', icon: 'text-emerald-600', gradient: 'from-emerald-500 to-teal-600' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-600', gradient: 'from-purple-500 to-indigo-600' },
  orange: { bg: 'bg-orange-50', icon: 'text-orange-600', gradient: 'from-orange-500 to-amber-600' },
  pink: { bg: 'bg-pink-50', icon: 'text-pink-600', gradient: 'from-pink-500 to-rose-600' },
};

export const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  suffix = '',
  color = 'blue',
  delay = 0,
}: StatCardProps) => {
  const formattedValue = suffix === '%' ? value : value?.toLocaleString();
  const isPositive = trend && trend > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay / 1000 }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-3xl bg-white/60 backdrop-blur-xl border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 min-w-[240px] flex-shrink-0"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${colorConfig[color].gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
      <div className="relative p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <div className="flex items-baseline gap-1">
              <p className="text-4xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent tracking-tight">
                {formattedValue}
              </p>
              {suffix && <span className="text-sm text-gray-400">{suffix}</span>}
            </div>
          </div>
          <div className={`p-4 rounded-2xl bg-gradient-to-br ${colorConfig[color].gradient} text-white shadow-lg group-hover:scale-110 transition-all duration-300`}>
            <Icon className={`w-6 h-6 ${colorConfig[color].icon}`} />
          </div>
        </div>

        {trend !== undefined && (
          <div className="mt-4 flex items-center gap-2">
            <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full backdrop-blur-sm border ${
  isPositive
    ? 'bg-green-100/70 border-green-200'
    : 'bg-red-100/70 border-red-200'
}`}>
              {isPositive ? (
                <ArrowUpRight className="w-3 h-3 text-green-600" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-600" />
              )}
              <span className={`text-xs font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? '+' : ''}{trend}%
              </span>
            </div>
            <span className="text-xs text-gray-400">с прошлого месяца</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};