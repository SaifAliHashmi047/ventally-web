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
    <div className={cn('flex items-center gap-2 min-h-[3.5rem] sm:min-h-[4rem] mb-4 sm:mb-6 px-3 sm:px-4', className)}>
      {/* Left slot — back button or invisible spacer to keep title centered */}
      <div className={cn('flex-shrink-0 flex items-center', !hasBack && rightContent ? 'invisible' : '')}>
        {hasBack ? (
          <button
            onClick={handleBack}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-white/[0.03] hover:bg-white/[0.08] text-white transition-all"
          >
            <ArrowLeft size={16} className="sm:hidden" />
            <ArrowLeft size={18} className="hidden sm:block" />
          </button>
        ) : rightContent ? (
          /* phantom spacer matching right slot width so title stays truly centred */
          <div className="w-8 h-8 sm:w-10 sm:h-10" />
        ) : null}
      </div>

      {/* Center — title */}
      <div className={cn('flex-1 min-w-0 flex flex-col', centered ? 'items-center text-center' : 'items-start')}>
        <h1 className="text-base sm:text-lg md:text-xl font-semibold text-white leading-tight truncate max-w-full">{title}</h1>
        {subtitle && (
          <p className="text-xs sm:text-sm text-white/80 mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* Right slot — rightContent or nothing */}
      {(rightContent || hasBack) && (
        <div className="flex-shrink-0 flex items-center">
          {rightContent ?? (hasBack ? <div className="w-8 h-8 sm:w-10 sm:h-10" /> : null)}
        </div>
      )}
    </div>
  );
};
