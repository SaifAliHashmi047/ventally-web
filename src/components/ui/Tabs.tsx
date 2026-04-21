import React from 'react';
import { cn } from '../../utils/cn';

interface TabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className,
}) => {
  return (
    <div className={cn('flex items-center p-1 glass rounded-2xl mb-6', className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={cn(
              'flex-1 py-2.5 text-sm font-medium rounded-xl transition-all duration-300',
              isActive 
                ? 'bg-white/10 text-white shadow-lg' 
                : 'text-white/40 hover:text-white/60'
            )}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
};
