import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backPath?: string;
  onBack?: () => void;
  rightContent?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  backPath,
  onBack,
  rightContent,
  className,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) onBack();
    else if (backPath) navigate(backPath);
    else navigate(-1);
  };

  return (
    <div className={cn('flex items-center gap-4 mb-6', className)}>
      {(backPath !== undefined || onBack) && (
        <button
          onClick={handleBack}
          className="w-10 h-10 glass rounded-2xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/8 transition-all flex-shrink-0"
        >
          <ArrowLeft size={18} />
        </button>
      )}
      <div className="flex-1 min-w-0">
        <h1 className="text-xl font-bold text-white truncate">{title}</h1>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
        )}
      </div>
      {rightContent && (
        <div className="flex-shrink-0">{rightContent}</div>
      )}
    </div>
  );
};
