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
    <div className={cn('relative flex items-center justify-center min-h-[4rem] mb-6 px-4', className)}>
      {hasBack && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <button
            onClick={handleBack}
            className="w-10 h-10 glass rounded-2xl flex items-center justify-center text-white/60 hover:text-white hover:bg-white/8 transition-all"
          >
            <ArrowLeft size={18} />
          </button>
        </div>
      )}
      
      <div className={cn('flex flex-col items-center text-center', centered ? 'mx-auto' : 'mr-auto')}>
        <h1 className="text-lg font-bold text-white tracking-tight uppercase">{title}</h1>
        {subtitle && (
          <p className="text-sm text-white/60 mt-0.5">{subtitle}</p>
        )}
      </div>

      {rightContent && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {rightContent}
        </div>
      )}
    </div>
  );
};
