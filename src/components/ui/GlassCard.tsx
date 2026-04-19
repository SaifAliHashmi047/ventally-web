import React from 'react';
import { cn } from '../../utils/cn';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  bordered?: boolean;
  dark?: boolean;
  accent?: boolean;
  hover?: boolean;
  onClick?: () => void;
  padding?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
  rounded?: 'xl' | '2xl' | '3xl';
  style?: React.CSSProperties;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  bordered = false,
  dark = false,
  accent = false,
  hover = false,
  onClick,
  padding = 'md',
  rounded = '3xl',
  style,
}) => {
  const paddingMap = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const roundedMap = {
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
  };

  const baseClass = accent ? 'glass-accent' : dark ? 'glass-dark' : bordered ? 'glass-bordered' : 'glass';
  const hoverClass = hover || onClick ? 'glass-hover cursor-pointer' : '';

  return (
    <div
      className={cn(
        baseClass,
        hoverClass,
        paddingMap[padding],
        roundedMap[rounded],
        'relative overflow-hidden',
        className
      )}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
