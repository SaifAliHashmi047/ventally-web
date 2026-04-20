import type { ReactNode } from 'react';
import { MainBackground } from '../ui/MainBackground';

interface AuthLayoutProps {
  children: ReactNode;
  hideGlass?: boolean;
}

export const AuthLayout = ({ children, hideGlass = false }: AuthLayoutProps) => {
  return (
    <div className="relative min-h-[100dvh] w-full overflow-x-hidden flex flex-col">
      <MainBackground />
      <div className="relative z-10 flex flex-col flex-1 min-h-0 w-full px-4 sm:px-6 lg:px-10 py-8 sm:py-12 items-center justify-center">
        {hideGlass ? (
          <div className="w-full max-w-lg xl:max-w-xl my-auto">{children}</div>
        ) : (
          <div className="glass-bordered w-full max-w-lg xl:max-w-xl rounded-[28px] sm:rounded-[32px] overflow-hidden my-auto shadow-2xl">
            <div className="p-6 sm:p-9 lg:p-10">{children}</div>
          </div>
        )}
      </div>
    </div>
  );
};
