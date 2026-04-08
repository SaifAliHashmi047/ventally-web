import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="flex-center" style={{ minHeight: '100vh', width: '100%', padding: '20px', background: 'var(--bg-deep)' }}>
      <div className="glass" style={{ width: '100%', maxWidth: '480px', borderRadius: '32px', overflow: 'hidden' }}>
        <div style={{ padding: '40px 32px' }}>
          {children}
        </div>
      </div>
    </div>
  );
};
