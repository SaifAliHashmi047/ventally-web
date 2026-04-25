import React from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'glass' | 'glass-bordered' | 'secondary' | 'accent' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  /** When true, stays w-full at all breakpoints (use inside cards/containers) */
  contained?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  // size = 'md',
  fullWidth = false,
  contained = false,
  loading = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}) => {
  const  size = 'md'
  const variantMap: Record<string, string> = {
    primary:          'btn-primary',
    glass:            'btn-glass',
    'glass-bordered': 'btn-glass-bordered',
    secondary:        'btn-secondary',
    accent:           'btn-accent',
    danger:           'btn-danger',
    ghost:            'hover:bg-white/5 text-gray-400 hover:text-white',
  };

  const sizeMap = {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
  };

  return (
    <button
      className={cn(
        'btn',
        variantMap[variant],
        sizeMap[size],
        // Width logic:
        // - contained=true  → always w-full (inside a card/container)
        // - fullWidth=true  → responsive: 100% → 70% → 50%
        fullWidth && contained
          ? 'w-full'
          : fullWidth
          ? 'w-full md:w-[70%] lg:w-1/2 mx-auto'
          : '',
        (disabled || loading) && 'opacity-50 cursor-not-allowed pointer-events-none',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : leftIcon ? (
        leftIcon
      ) : null}
      {children}
      {!loading && rightIcon}
    </button>
  );
};
