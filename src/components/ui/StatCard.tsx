import React from 'react';
import { cn } from '../../utils/cn';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  changePositive?: boolean;
  icon?: React.ReactNode;
  iconColor?: string;
  className?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  change,
  changePositive = true,
  icon,
  iconColor = 'var(--primary)',
  className,
  onClick,
}) => {
  return (
    <div
      className={cn('stat-card', onClick && 'cursor-pointer', className)}
      onClick={onClick}
    >
      {/* Glow blob */}
      <div
        className="absolute -top-4 -right-4 w-20 h-20 rounded-full blur-2xl opacity-15 pointer-events-none"
        style={{ background: iconColor }}
      />

      <div className="flex items-start justify-between mb-4">
        {icon && (
          <div
            className="w-11 h-11 rounded-2xl glass flex items-center justify-center"
            style={{ color: iconColor }}
          >
            {icon}
          </div>
        )}
        {change && (
          <span
            className={cn(
              'flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full',
              changePositive
                ? 'bg-success/10 text-success'
                : 'bg-error/10 text-error'
            )}
          >
            {changePositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {change}
          </span>
        )}
      </div>

      <p className="text-sm text-gray-500 font-medium mb-1 whitespace-pre-line">{label}</p>
      <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
    </div>
  );
};
