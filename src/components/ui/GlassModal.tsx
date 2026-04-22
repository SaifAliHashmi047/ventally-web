import React, { useEffect, useRef } from 'react';
import { cn } from '../../utils/cn';
import { Button } from './Button';
import { GlassCard } from './GlassCard';

interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  
  // Icon props
  icon?: React.ReactNode;
  showIcon?: boolean;

  // Content props
  title?: string;
  subtitle?: string;
  message?: string;
  
  // Custom content
  children?: React.ReactNode;

  // Button props
  showButtons?: boolean;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryPress?: () => void;
  onSecondaryPress?: () => void;
  loading?: boolean;
  showVerticalButtons?: boolean;

  // Layout props
  className?: string;
  maxWidth?: string;
}

export const GlassModal: React.FC<GlassModalProps> = ({
  isOpen,
  onClose,
  icon,
  showIcon = true,
  title,
  subtitle,
  message,
  children,
  showButtons = true,
  primaryButtonText,
  secondaryButtonText,
  onPrimaryPress,
  onSecondaryPress,
  loading = false,
  showVerticalButtons = false,
  className,
  maxWidth = 'max-w-sm',
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrimaryPress = () => {
    if (onPrimaryPress) onPrimaryPress();
    else onClose();
  };

  const handleSecondaryPress = () => {
    if (onSecondaryPress) onSecondaryPress();
    else onClose();
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in bg-black/70 backdrop-blur-md"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <GlassCard 
        bordered 
        className={cn(
          'w-full flex flex-col items-center rounded-[32px] p-8 text-center animate-slide-up relative overflow-hidden', 
          maxWidth,
          className
        )}
      >
        {/* Background Hint for Depth */}
        <div className="absolute inset-0 bg-white/[0.02] pointer-events-none" />

        {/* Icon */}
        {showIcon && icon && (
          <div className="relative z-10 flex justify-center mb-6">
            <div className="w-16 h-16 rounded-3xl glass-dark flex items-center justify-center border border-white/10 shadow-lg">
              {icon}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 w-full mb-8">
          {title && (
            <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
              {title}
            </h3>
          )}

          {subtitle && (
            <p className="text-base font-medium text-white/90 mb-2 leading-tight">
              {subtitle}
            </p>
          )}

          {message && (
            <p className="text-[14px] text-white/50 leading-relaxed max-w-[90%] mx-auto font-medium">
              {message}
            </p>
          )}
        </div>

        <div className="relative z-10 w-full">
          {children}
        </div>

        {/* Actions */}
        {showButtons && (
          <div className={cn(
            'relative z-10 w-full grid gap-3 mt-2',
            secondaryButtonText && !showVerticalButtons ? 'grid-cols-2' : 'grid-cols-1'
          )}>
            {secondaryButtonText && (
              <Button
                variant="glass"
                onClick={handleSecondaryPress}
                className="rounded-2xl h-[56px] text-white/60 font-bold border-white/5"
              >
                {secondaryButtonText}
              </Button>
            )}
            {primaryButtonText && (
              <Button
                variant="primary"
                onClick={handlePrimaryPress}
                loading={loading}
                className="rounded-2xl h-[56px] font-bold shadow-lg shadow-primary/20"
              >
                {primaryButtonText}
              </Button>
            )}
          </div>
        )}
      </GlassCard>
    </div>
  );
};
