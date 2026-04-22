import React from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * glass        — native GlassWrapper (gradient side borders, backdrop blur, ~transparent)
   * glass-bordered — native borderedGlassButton (solid border, backdrop blur, ~transparent)
   * primary      — filled blue
   * accent       — accent color fill
   * danger       — red tint
   * ghost        — no background
   */
  variant?: 'primary' | 'glass' | 'glass-bordered' | 'secondary' | 'accent' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}) => {
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
        fullWidth && 'w-full',
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
