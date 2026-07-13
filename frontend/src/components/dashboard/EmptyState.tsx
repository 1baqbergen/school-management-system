// src/components/dashboard/EmptyState.tsx
import { motion } from 'framer-motion';

interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: React.ElementType;
}

export const EmptyState = ({ title, message, icon: Icon }: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12"
    >
      {Icon && (
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <Icon className="w-8 h-8 text-gray-400" />
        </div>
      )}
      <h4 className="text-lg font-semibold text-gray-900 mb-1">{title}</h4>
      {message && <p className="text-sm text-gray-500">{message}</p>}
    </motion.div>
  );
};