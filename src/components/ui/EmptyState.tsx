import React from 'react';
import { cn } from '../../utils/cn';
import { Box } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  className,
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-6 text-center', className)}>
      <div className="w-14 h-14 rounded-3xl glass flex items-center justify-center mb-4 text-white/80">
        {icon || <Box size={24} />}
      </div>
      <p className="text-base font-semibold text-white mb-1">{title}</p>
      {description && (
        <p className="text-sm text-white/80 max-w-xs">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
