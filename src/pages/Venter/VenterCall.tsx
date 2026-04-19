import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Phone, ChevronRight } from 'lucide-react';
import { useCalls } from '../../api/hooks/useCalls';
import { useWallet } from '../../api/hooks/useWallet';
import { setSessionType, setReturnToSession } from '../../store/slices/callSlice';
import { EmptyState } from '../../components/ui/EmptyState';
import { toastError } from '../../utils/toast';

// ─── Helpers ───────────────────────────────────────────────────────────────────
const formatTimeAgo = (dateStr: string): string => {
  if (!dateStr) return '';
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const secs = Math.floor(diffMs / 1000);
  if (secs < 60) return 'Just now';
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} h ago`;
  return `${Math.floor(hrs / 24)} d ago`;
};

// ─── Start Call Card ───────────────────────────────────────────────────────────
const StartCallCard = ({
  title,
  subtitle,
  onPress,
}: {
  title: string;
  subtitle: string;
  onPress: () => void;
}) => (
  <button
    onClick={onPress}
    className="w-full text-left glass rounded-2xl px-5 py-5 flex items-center gap-4 hover:bg-white/5 transition-all duration-200 active:scale-[0.99]"
  >
    <div className="w-14 h-14 rounded-full glass flex items-center justify-center flex-shrink-0">
      <Phone size={24} className="text-white" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-lg font-semibold text-white mb-0.5">{title}</p>
      <p className="text-sm text-white/60">{subtitle}</p>
    </div>
  </button>
);

// ─── Call Entry ────────────────────────────────────────────────────────────────
const CallEntry = ({
  name,
  timeAgo,
  onPress,
}: {
  name: string;
  timeAgo: string;
  onPress: () => void;
}) => (
  <button
    onClick={onPress}
    className="w-full text-left glass-bordered rounded-2xl px-4 py-4 flex items-center gap-3 hover:bg-white/5 transition-all duration-200 mb-3"
    style={{ background: 'rgba(0,0,0,0.1)' }}
  >
    <div className="w-11 h-11 rounded-full glass border border-white/20 flex items-center justify-center flex-shrink-0">
      <Phone size={18} className="text-white" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-white truncate mb-0.5">{name}</p>
      <p className="text-sm text-white/60">{timeAgo}</p>
    </div>
    <ChevronRight size={16} className="text-white/50 flex-shrink-0" />
  </button>
);

// ─── Main screen ───────────────────────────────────────────────────────────────
export const VenterCall = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Stable refs — prevents hook functions from being stale deps that re-trigger effects
  const callsHook = useCalls();
  const walletHook = useWallet();
  const getCallsRef = useRef(callsHook.getCalls);
  const getMySubscriptionRef = useRef(walletHook.getMySubscription);

  const [recentCalls, setRecentCalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [walletDetails, setWalletDetails] = useState<any>(null);

  // Fetch ONCE on mount — empty deps, no loop
  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [callsRes, subRes] = await Promise.allSettled([
          getCallsRef.current(3, 0),
          getMySubscriptionRef.current(),
        ]);
        if (cancelled) return;
        if (callsRes.status === 'fulfilled') {
          setRecentCalls(callsRes.value?.calls ?? []);
        }
        if (subRes.status === 'fulfilled') {
          setWalletDetails(subRes.value);
        }
      } catch {
        if (!cancelled) toastError(t('Common.errors.fetchingData'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ← empty: fetch once on mount only

  const handleStartCall = () => {
    dispatch(setSessionType('call'));
    const remaining = walletDetails?.subscription?.remainingMinutes ?? 999;
    if (remaining < 1) {
      dispatch(setReturnToSession(true));
      navigate('/venter/no-credit');
    } else {
      navigate('/venter/finding-listener', { state: { type: 'call' } });
    }
  };

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Start Call Card */}
      <StartCallCard
        title={t('VenterCall.startCallCard.title')}
        subtitle={t('VenterCall.startCallCard.subtitle')}
        onPress={handleStartCall}
      />

      {/* Separator */}
      <div className="w-full h-px bg-white/20 my-1" />

      {/* Section title */}
      <p className="text-base font-medium text-white">{t('VenterCall.recentCall')}</p>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="skeleton h-16 rounded-2xl" />)}
        </div>
      ) : recentCalls.length === 0 ? (
        <EmptyState
          title={t('VenterCall.noRecentCalls')}
          description={t('VenterCall.noRecentCallsDescription')}
          icon={<Phone size={22} />}
        />
      ) : (
        <div>
          {recentCalls.map((call: any) => (
            <CallEntry
              key={call.id}
              name={call.otherParticipant?.anonymousName || t('VenterCall.callEntry.name', { defaultValue: 'Voice Session' })}
              timeAgo={formatTimeAgo(call.createdAt || call.startedAt)}
              onPress={() => {}}
            />
          ))}
        </div>
      )}

      {recentCalls.length > 0 && (
        <button
          onClick={() => navigate('/venter/all-calls')}
          className="w-full glass rounded-2xl py-3 text-sm font-medium text-white hover:bg-white/5 transition-colors"
        >
          {t('VenterCall.viewAll')}
        </button>
      )}
    </div>
  );
};
