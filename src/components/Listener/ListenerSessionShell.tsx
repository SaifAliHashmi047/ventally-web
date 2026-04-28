import type { CSSProperties, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../ui/PageHeader';
import { cn } from '../../utils/cn';

/** Shared background for listener session flow + crisis (matches live call / dashboard tone). */
export const LISTENER_SESSION_FLOW_BG_STYLE: CSSProperties = {
  background:
    'radial-gradient(ellipse 120% 80% at 50% -10%, rgba(194,174,191,0.14) 0%, transparent 55%), radial-gradient(ellipse at 50% 100%, rgba(194,174,191,0.06) 0%, #000 65%)',
};

type SessionKind = 'call' | 'chat';

export function SessionTypeBadge({ kind }: { kind: SessionKind }) {
  const { t } = useTranslation();
  const label =
    kind === 'call'
      ? t('ListenerSessionFlow.sessionTypeCall', 'Voice session')
      : t('ListenerSessionFlow.sessionTypeChat', 'Chat session');
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-wider border',
        kind === 'call'
          ? 'bg-emerald-500/10 text-emerald-400/95 border-emerald-500/20'
          : 'bg-sky-500/10 text-sky-300/95 border-sky-500/20',
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', kind === 'call' ? 'bg-emerald-400' : 'bg-sky-400')} />
      {label}
    </span>
  );
}

interface ListenerSessionShellProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  /** Shown under the header — e.g. call vs chat */
  badge?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Shared layout for listener post-session screens (mood feedback, rating) and aligned flows.
 */
export function ListenerSessionShell({
  title,
  subtitle,
  onBack,
  badge,
  children,
  className,
}: ListenerSessionShellProps) {
  return (
    <div
      className="min-h-[100dvh] flex flex-col text-white relative overflow-hidden animate-fade-in"
    // style={LISTENER_SESSION_FLOW_BG_STYLE}
    >
      <div className="relative z-10 flex flex-col flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 pt-6 sm:pt-8 pb-8 sm:pb-12 min-h-0">
        <div className="shrink-0 mb-6 sm:mb-8">
          <PageHeader title={title} subtitle={subtitle} onBack={onBack} className="mb-0" />
          {/* {badge ? <div className="flex justify-center sm:justify-start mt-4">{badge}</div> : null} */}
        </div>

        <div
          className={cn(
            'flex-1 flex flex-col w-full max-w-xl lg:max-w-2xl mx-auto min-h-0',
            className,
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
