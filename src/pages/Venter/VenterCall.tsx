import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Phone, ChevronRight } from 'lucide-react';
import { useCalls } from '../../api/hooks/useCalls';
import { useWallet } from '../../api/hooks/useWallet';
import { setSessionType, setReturnToSession } from '../../store/slices/callSlice';
import { EmptyState } from '../../components/ui/EmptyState';
import { GlassCard } from '../../components/ui/GlassCard';
import { toastError } from '../../utils/toast';

// ─── Helpers (aligned with VenterMessages / chat time strings) ───────────────
const formatTimeAgo = (dateStr: string, t: (key: string, options?: any) => string) => {
  if (!dateStr) return '';
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return t('Common.time.justNow');
  if (mins < 60) return t('VenterMessages.chatEntry.minutesAgo', { minutes: mins });
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return t('VenterMessages.chatEntry.hoursAgo', { hours: hrs });
  return new Date(dateStr).toLocaleDateString();
};

// ─── Start Voice Card (matches StartChatCard) ──────────────────────────────
const StartCallCard = ({
  title,
  subtitle,
  onPress,
}: {
  title: string;
  subtitle: string;
  onPress: () => void;
}) => (
  <GlassCard
    bordered
    hover
    onClick={onPress}
    padding="lg"
    rounded="2xl"
    className="w-full text-left cursor-pointer active:scale-[0.99] transition-transform shadow-lg shadow-black/10"
  >
    <div className="flex items-center gap-4 lg:gap-5">
      <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center flex-shrink-0 border border-white/10">
        <Phone size={24} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-base lg:text-lg font-semibold text-white mb-0.5">{title}</p>
        <p className="text-sm text-white/60 leading-snug">{subtitle}</p>
      </div>
    </div>
  </GlassCard>
);

// ─── Call entry row (matches ChatEntry list-row pattern) ─────────────────────
const CallEntry = ({
  name,
  timeAgo,
  secondaryLine,
  isLast,
  onPress,
}: {
  name: string;
  timeAgo: string;
  secondaryLine: string;
  isLast?: boolean;
  onPress: () => void;
}) => (
  <button
    type="button"
    onClick={onPress}
    className={`w-full text-left flex items-center gap-3 px-4 sm:px-5 py-4 transition-colors hover:bg-white/[0.04] ${
      isLast !== true ? 'border-b border-white/8' : ''
    }`}
  >
    <div className="w-11 h-11 rounded-xl glass border border-white/10 flex items-center justify-center flex-shrink-0">
      <Phone size={18} className="text-white" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-2 mb-0.5">
        <p className="text-sm font-medium text-white truncate">{name}</p>
        <span className="text-xs text-white/60 flex-shrink-0 tabular-nums">{timeAgo}</span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-white/70 truncate">{secondaryLine}</p>
        <ChevronRight size={16} className="text-white flex-shrink-0" />
      </div>
    </div>
  </button>
);

// ─── Main screen ─────────────────────────────────────────────────────────────
export const VenterCall = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const callsHook = useCalls();
  const walletHook = useWallet();
  const getCallsRef = useRef(callsHook.getCalls);
  const getWalletRef = useRef(walletHook.getWallet);

  const [recentCalls, setRecentCalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [walletDetails, setWalletDetails] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [callsRes, walletRes] = await Promise.allSettled([
          getCallsRef.current(3, 0),
          getWalletRef.current(),
        ]);
        if (cancelled) return;
        if (callsRes.status === 'fulfilled') {
          setRecentCalls(callsRes.value?.calls ?? []);
        }
        if (walletRes.status === 'fulfilled') {
          setWalletDetails(walletRes.value);
        }
      } catch {
        if (!cancelled) toastError(t('Common.errors.fetchingData'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStartCall = () => {
    dispatch(setSessionType('call'));
    const minutes = walletDetails?.balance?.minutes ?? 0;
    const currency = walletDetails?.balance?.currency ?? 0;
    const SESSION_COST = 10;
    
    // Check if they have enough minutes OR enough generic currency
    if (minutes < SESSION_COST && currency < SESSION_COST) {
      dispatch(setReturnToSession(true));
      navigate('/venter/no-credit');
    } else {
      navigate('/venter/finding-listener', { state: { type: 'call' } });
    }
  };

  const handleCallRowPress = (call: any) => {
    if (call?.id) {
      navigate(`/venter/chat/${call.id}`, { state: { call } });
    } else {
      navigate('/venter/all-calls');
    }
  };

  return (
    <div className="page-wrapper page-wrapper--wide animate-fade-in">
      <div className="w-full lg:max-w-3xl xl:max-w-4xl lg:mx-auto">
        <header className="mb-6 text-center lg:text-left lg:mb-8">
          <h1 className="text-lg font-semibold text-white tracking-tight lg:text-2xl lg:font-bold">
            {t('Navigation.tabs.call', 'Voice')}
          </h1>
          <p className="mt-1.5 text-sm text-white/80 max-w-md mx-auto lg:mx-0">
            {t('VenterCall.subtitle')}
          </p>
        </header>

        <div className="space-y-6 lg:space-y-8">
          <StartCallCard
            title={t('VenterCall.startCallCard.title')}
            subtitle={t('VenterCall.startCallCard.subtitle')}
            onPress={handleStartCall}
          />

          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-white/80 mb-3">
              {t('VenterCall.recentCall')}
            </h2>

            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="skeleton h-[4.5rem] rounded-2xl" />
                ))}
              </div>
            ) : recentCalls.length === 0 ? (
              <GlassCard bordered rounded="2xl" className="py-2">
                <EmptyState
                  title={t('VenterCall.noRecentCalls')}
                  description={t('VenterCall.noRecentCallsDescription')}
                  icon={<Phone size={22} />}
                />
              </GlassCard>
            ) : (
              <GlassCard padding="none" rounded="2xl" className="overflow-hidden">
                {recentCalls.map((call: any, index: number) => (
                  <CallEntry
                    key={call.id ?? index}
                    name={call.otherParticipant?.anonymousName || t('VenterCall.callEntry.name')}
                    timeAgo={formatTimeAgo(call.createdAt || call.startedAt, t)}
                    secondaryLine={t('VenterCall.callEntry.lastCall')}
                    isLast={index === recentCalls.length - 1}
                    onPress={() => handleCallRowPress(call)}
                  />
                ))}
              </GlassCard>
            )}
          </section>

          {recentCalls.length > 0 && (
            <button
              type="button"
              onClick={() => navigate('/venter/all-calls')}
              className="w-full max-w-sm mx-auto lg:max-w-none glass rounded-2xl py-3.5 text-sm font-medium text-white border border-white/10 hover:bg-white/5 transition-colors"
            >
              {t('VenterCall.viewAll')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
