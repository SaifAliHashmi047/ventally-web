import React from 'react';
import { Bell, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppBrandIcon } from './AppBrandIcon';

interface AdminHomeHeaderProps {
  title: string;
  subtitle?: string;
  onNotificationsClick?: () => void;
}

export const AdminHomeHeader: React.FC<AdminHomeHeaderProps> = ({
  title,
  subtitle,
  onNotificationsClick,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-8 px-1">
      <div className="flex items-center gap-3">
        <AppBrandIcon className="w-12 h-12 rounded-2xl" />
        <div className="flex flex-col">
          <h1 className="text-sm font-medium text-white/60 leading-none mb-1">
            {title}
          </h1>
          {subtitle && (
            <p className="text-base font-bold text-white leading-none">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <button 
        onClick={onNotificationsClick || (() => navigate('/admin/notifications'))}
        className="relative w-12 h-12 glass rounded-full flex items-center justify-center text-white/80 hover:bg-white/10 transition-all border border-white/10"
      >
        <Bell size={20} />
        <div className="absolute top-3 right-3.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#121212]" />
      </button>
    </div>
  );
};
