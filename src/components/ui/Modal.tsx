import React, { useEffect, useRef } from 'react';
import { cn } from '../../utils/cn';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showClose?: boolean;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showClose = true,
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

  const sizeMap = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: 'rgba(0, 0, 0, 0.55)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        animation: 'fade-in 0.25s ease forwards',
      }}
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div
        className={cn('w-full rounded-3xl overflow-hidden', sizeMap[size], className)}
        style={{
          background: 'rgba(0, 0, 0, 0.10)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          boxShadow: `
            0 0 0 0.5px rgba(255,255,255,0.08) inset,
            inset 0 1px 0 rgba(255,255,255,0.18),
            0 24px 64px rgba(0,0,0,0.5),
            0 8px 24px rgba(0,0,0,0.3)
          `,
          animation: 'modal-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        {(title || showClose) && (
          <div
            className="flex items-center justify-between px-6 pt-6 pb-4"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
            {title && (
              <h2 className="text-[17px] font-semibold text-white tracking-tight">{title}</h2>
            )}
            {showClose && (
              <button
                onClick={onClose}
                className="ml-auto p-2 rounded-xl transition-all"
                style={{
                  color: 'rgba(255,255,255,0.4)',
                  background: 'rgba(255,255,255,0)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.07)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.9)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.4)';
                }}
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};
