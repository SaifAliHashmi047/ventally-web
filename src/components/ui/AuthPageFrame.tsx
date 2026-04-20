import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { MainBackground } from './MainBackground';

/**
 * Full-viewport shell for public auth screens (login, signup, password reset, etc.).
 * Uses the same MainBackground + mesh as the main app so auth feels cohesive.
 */
export function AuthPageFrame({
  children,
  className,
  innerClassName,
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <div className={cn('relative min-h-[100dvh] w-full overflow-x-hidden flex flex-col', className)}>
      <MainBackground />
      <div
        className={cn(
          'relative z-10 flex flex-col flex-1 w-full items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16',
          innerClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
