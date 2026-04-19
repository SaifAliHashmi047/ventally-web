import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  hideGlass?: boolean;
}

export const AuthLayout = ({ children, hideGlass = false }: AuthLayoutProps) => {
  return (
    <div 
      className="flex flex-col min-h-screen w-full px-4 py-8 items-center" 
      style={{ background: 'var(--bg-deep)' }}
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
  );
};
