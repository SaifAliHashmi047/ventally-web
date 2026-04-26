import React, { useCallback } from 'react';
import { cn } from '../../utils/cn';

interface ToggleProps {
  checked: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  color?: 'accent' | 'primary' | 'success';
  size?: 'sm' | 'md';
  className?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  disabled = false,
  label,
  description,
  color = 'accent',
  size = 'md',
  className,
}) => {
  const colorMap = {
    accent: 'bg-accent',
    primary: 'bg-primary',
    success: 'bg-success',
  };

  const sizeConfig = {
    sm: { track: 'w-9 h-5', thumb: 'w-3.5 h-3.5', translate: 'translate-x-4' },
    md: { track: 'w-12 h-6', thumb: 'w-4 h-4', translate: 'translate-x-6' },
  };

  const config = sizeConfig[size];

  const handleClick = useCallback(() => {
    if (!disabled) onChange(!checked);
  }, [checked, disabled, onChange]);

  return (
    <div className={cn('flex items-center gap-3 cursor-pointer', disabled && 'opacity-50 cursor-not-allowed', className)} onClick={handleClick}>
      <div
        role="switch"
        aria-checked={checked}
        className={cn(
          config.track,
          'relative rounded-full transition-colors duration-200 flex-shrink-0',
          checked ? colorMap[color] : 'bg-white/15'
        )}
      >
        <span
          className={cn(
            config.thumb,
            'absolute top-1 left-1 rounded-full bg-white shadow-sm transition-transform duration-200',
            checked && config.translate
          )}
        />
      </div>
      {(label || description) && (
        <div>
          {label && <p className="text-base font-medium text-white">{label}</p>}
          {description && <p className="text-sm text-white/80">{description}</p>}
        </div>
      )}
    </div>
  );
};
