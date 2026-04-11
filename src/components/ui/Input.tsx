import React, { forwardRef, useState } from 'react';
import { cn } from '../../utils/cn';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  isPassword = false,
  containerClassName,
  className,
  type,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label className="text-sm font-medium text-gray-400">
          {label}
        </label>
      )}
      <div className="input-wrapper">
        {leftIcon && (
          <span className="input-icon-left text-gray-500">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          type={inputType}
          className={cn(
            'input-field',
            !!leftIcon && 'input-with-icon-left',
            !!(rightIcon || isPassword) && 'pr-12',
            error && 'border-red-500/50 focus:border-red-500',
            className
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className="input-icon-right p-2 text-gray-500 hover:text-white transition-colors rounded-lg"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
        {!isPassword && rightIcon && (
          <span className="input-icon-right">{rightIcon}</span>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
      {hint && !error && (
        <p className="text-xs text-gray-500">{hint}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
