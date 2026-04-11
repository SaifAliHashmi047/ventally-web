import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'error' | 'warning' | 'accent' | 'default';
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className,
  dot = false,
}) => {
  const variantMap = {
    primary: 'badge-primary',
    success: 'badge-success',
    error: 'badge-error',
    warning: 'badge-warning',
    accent: 'badge-accent',
    default: 'bg-white/8 text-gray-400 border border-white/10',
  };

  const sizeMap = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span className={cn('badge', variantMap[variant], sizeMap[size], className)}>
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
      )}
      {children}
    </span>
  );
};
