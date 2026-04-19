import type { ReactNode } from 'react';
import { MainBackground } from '../ui/MainBackground';

interface AuthLayoutProps {
  children: ReactNode;
  hideGlass?: boolean;
}

export const AuthLayout = ({ children, hideGlass = false }: AuthLayoutProps) => {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <MainBackground />
      <div 
        className="relative z-10 flex flex-col min-h-screen w-full px-4 py-8 items-center" 
      >
        {hideGlass ? (
          <div className="w-full max-w-[480px] my-auto">
            {children}
          </div>
        ) : (
          <div className="glass w-full max-w-[480px] rounded-[32px] overflow-hidden my-auto shadow-2xl">
            <div className="p-8 sm:p-10">
              {children}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
