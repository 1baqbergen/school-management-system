// src/components/dashboard/ChartCard.tsx
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  icon?: React.ElementType;
}

export const ChartCard = ({ title, subtitle, children, icon: Icon }: ChartCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative min-h-[250px] p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3">
              {Icon && (
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
                  <Icon className="w-5 h-5" />
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
              </div>
            </div>
          </div>
        </div>
        {children}
      </div>
    </motion.div>
  );
};