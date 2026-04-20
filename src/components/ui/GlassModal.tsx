import React, { useEffect, useRef } from 'react';
import { cn } from '../../utils/cn';
import { Button } from './Button';
import { GlassCard } from './GlassCard';

interface ModalAction {
  label: string;
  onClick: () => void;
  loading?: boolean;
}

interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  /** Custom body when you need more than title/description (e.g. success animation). */
  children?: React.ReactNode;
  primaryAction?: ModalAction;
  secondaryAction?: ModalAction;
  className?: string;
}

export const GlassModal: React.FC<GlassModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  icon,
  children,
  primaryAction,
  secondaryAction,
  className,
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

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <GlassCard 
        bordered 
        className={cn('w-full max-w-sm rounded-[32px] p-8 text-center animate-slide-up', className)}
      >
        {icon && (
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-3xl glass-dark flex items-center justify-center">
              {icon}
            </div>
          </div>
        )}

        {title && (
          <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
            {title}
          </h3>
        )}

        {description && (
          <p className="text-[15px] text-white/70 mb-8 leading-relaxed">
            {description}
          </p>
        )}

        {children}

        {(primaryAction || secondaryAction) && (
          <div className={cn('grid gap-3', secondaryAction ? 'grid-cols-2' : 'grid-cols-1')}>
            {secondaryAction && (
              <Button
                variant="ghost"
                onClick={secondaryAction.onClick}
                className="rounded-2xl h-[56px] text-white/60 hover:text-white"
              >
                {secondaryAction.label}
              </Button>
            )}
            {primaryAction && (
              <Button
                variant="primary"
                onClick={primaryAction.onClick}
                loading={primaryAction.loading}
                className="rounded-2xl h-[56px] font-bold"
              >
                {primaryAction.label}
              </Button>
            )}
          </div>
        )}
      </GlassCard>
    </div>
  );
};
