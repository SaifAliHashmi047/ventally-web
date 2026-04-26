import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backPath?: string;
  onBack?: () => void;
  showBackButton?: boolean;
  rightContent?: React.ReactNode;
  className?: string;
  centered?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  backPath,
  onBack,
  showBackButton,
  rightContent,
  className,
  centered = true,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) onBack();
    else if (backPath) navigate(backPath);
    else navigate(-1);
  };

  const hasBack = showBackButton !== false && (backPath !== undefined || onBack || showBackButton === true);

  return (
    <div className={cn('relative flex items-center justify-center min-h-[3.5rem] sm:min-h-[4rem] mb-4 sm:mb-6 px-3 sm:px-4', className)}>
      {hasBack && (
        <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2">
          <button
            onClick={handleBack}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-white/[0.03] hover:bg-white/[0.08] text-white transition-all"
          >
            <ArrowLeft size={16} className="sm:hidden" />
            <ArrowLeft size={18} className="hidden sm:block" />
          </button>
        </div>
      )}

      <div className={cn('flex flex-col items-center text-center px-12 sm:px-14 w-full', centered ? 'mx-auto' : 'mr-auto')}>
        <h1 className="text-base sm:text-lg md:text-xl font-semibold text-white text-center leading-tight">{title}</h1>
        {subtitle && (
          <p className="text-xs sm:text-sm text-white/80 mt-0.5 text-center">{subtitle}</p>
        )}
      </div>

      {rightContent && (
        <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2">
          {rightContent}
        </div>
      )}
    </div>
  );
};
