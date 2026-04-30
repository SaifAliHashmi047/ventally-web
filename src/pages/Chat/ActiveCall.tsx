import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation, useBlocker } from 'react-router-dom';
import { useSelector, useDispatch, useStore } from 'react-redux';
import { useTranslation } from 'react-i18next';
import type { RootState } from '../../store/store';
import { endCall } from '../../store/slices/callSlice';
import { Mic, MicOff, Phone, AlertTriangle, PhoneCall, MessageSquare } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import apiInstance from '../../api/apiInstance';
import socketService from '../../api/socketService';
import {
  useAgoraContext,
} from '../../contexts/AgoraContext';
import {
  joinParamsFromCallPayload,
  type AgoraCallPayload,
} from '../../hooks/useAgoraWeb';

/** Real call id for API + feedback routes (URL param is often the placeholder `active` from FindingListener). */
function useResolvedCallId(
  roomId: string | undefined,
  locationState: unknown,
  session: RootState['session'],
  callSessionId: string | null,
): string | undefined {
  return useMemo(() => {
    const fromNav = (locationState as { call?: { id?: string; callId?: string } } | null | undefined)?.call;
    const fromSessionData = session.data as { id?: string; callId?: string } | undefined;
    const paramLooksLikeId = roomId && roomId !== 'active' ? roomId : null;

    return (
      fromNav?.callId ||
      fromNav?.id ||
      session.sessionId ||
      session.requestId ||
      fromSessionData?.callId ||
      fromSessionData?.id ||
      callSessionId ||
      paramLooksLikeId ||
      undefined
    );
  }, [locationState, roomId, session.sessionId, session.requestId, session.data, callSessionId]);
}

export const ActiveCall = () => {
  const { t } = useTranslation();
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user as any);
  const session = useSelector((state: RootState) => state.session);
  const callSessionId = useSelector((state: RootState) => state.call.sessionId);
  const callStartTime = useSelector((state: RootState) => state.call.startTime);
  const role = user?.userType || 'venter';

  const resolvedCallId = useResolvedCallId(roomId, location.state, session, callSessionId);
  const feedbackSessionId = resolvedCallId ?? roomId;

  const agoraJoinParams = useMemo(() => {
    const fromNav = (location.state as { call?: AgoraCallPayload } | undefined)?.call;
    const fromSession = session.data as AgoraCallPayload | undefined;
    return joinParamsFromCallPayload(fromNav ?? fromSession ?? undefined);
  }, [location.state, session.data]);

  const { joinChannel, leaveChannel, toggleMute, isJoined } = useAgoraContext();
  const store = useStore<RootState>();

  const [muted, setMuted] = useState(false);
  const [, setTick] = useState(0);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showCrisisOverlay, setShowCrisisOverlay] = useState(false);
  const callStatus: 'connecting' | 'connected' | 'ended' = isJoined ? 'connected' : 'connecting';

  // Elapsed time computed from Redux startTime so it survives navigation/remount
  const effectiveStart = callStartTime ?? null;
  const duration = effectiveStart ? Math.floor((Date.now() - effectiveStart) / 1000) : 0;

  // Tick every second to re-render the formatted time
  useEffect(() => {
    if (!isJoined) return;
    const interval = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(interval);
  }, [isJoined]);

  // Block navigation while the call is active.
  // Read directly from the store so dispatch(endCall()) from useGlobalSessionEvents
  // is visible synchronously and won't trigger the modal for the other participant.
  const blocker = useBlocker(() => (store.getState() as RootState).call.isActive);
  useEffect(() => {
    if (blocker.state === 'blocked') {
      blocker.reset();
      setShowEndModal(true);
    }
  }, [blocker.state]);

  // Join Agora — no cleanup leaveChannel so audio persists on navigation
  useEffect(() => {
    if (!agoraJoinParams) {
      console.warn('[ActiveCall] Missing channel/token for Agora — check call:accepted payload.');
      return;
    }
    void joinChannel(agoraJoinParams);
    // intentionally no leaveChannel in cleanup
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    toggleMute(muted);
  }, [muted, toggleMute]);

  // Socket: join call room for signaling
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await socketService.connect();
        if (cancelled) return;
        if (resolvedCallId) {
          socketService.emit('call:join', { callId: resolvedCallId });
        }
      } catch (e) {
        console.error('[ActiveCall] socket connect failed:', e);
      }
    })();
    return () => { cancelled = true; };
  }, [resolvedCallId]);

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleEndCall = async () => {
    setShowEndModal(false);
    // Dispatch immediately so the global call:ended handler skips this event
    dispatch(endCall());
    await leaveChannel();
    try {
      if (resolvedCallId) {
        await apiInstance.post(`calls/${resolvedCallId}/end`);
      }
    } catch { /* ignore */ }
    const firstStep = role === 'listener' ? 'feedback' : 'rating';
    navigate(`/${role}/session/${feedbackSessionId}/${firstStep}`, { replace: true, state: { type: 'call' } });
  };

  const handleCrisis988 = async (mode: 'call' | 'text') => {
    setShowCrisisOverlay(false);
    dispatch(endCall());
    await leaveChannel();
    try {
      if (resolvedCallId) await apiInstance.post(`calls/${resolvedCallId}/end`);
    } catch { /* ignore */ }
    window.location.href = mode === 'call' ? 'tel:988' : 'sms:988';
    setTimeout(() => navigate('/venter/home', { replace: true }), 1000);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-between px-5 pt-12 pb-10 relative">

      {/* Center — icon + title + status */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4 w-full border-b border-white/10 pb-8">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
            <Phone size={36} className="text-white" />
          </div>
          {callStatus === 'connected' && (
            <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping" />
          )}
        </div>

        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-1">
            {callStatus === 'connecting'
              ? t('ActiveCall.connecting', 'Connecting...')
              : t('ActiveCall.outgoingCall', 'Outgoing Call')}
          </h2>
          <p className="text-sm text-white/60">
            {t('ActiveCall.subtitle', 'You are on a call with a listener')}
          </p>
          {callStatus === 'connected' && (
            <p className="text-base text-white/80 mt-2 font-medium tabular-nums">
              {formatDuration(duration)}
            </p>
          )}
        </div>
      </div>

      {/* Bottom controls card */}
      <GlassCard className="w-full max-w-sm mt-8" rounded="2xl" padding="lg">
        {/* Mute + End row */}
        <div className="flex justify-around items-center mb-6">
          {/* Mute */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => setMuted(!muted)}
              className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center transition-all hover:bg-white/20"
            >
              {muted ? <MicOff size={22} className="text-white" /> : <Mic size={22} className="text-white" />}
            </button>
            <span className="text-xs text-white font-medium">
              {muted ? t('ActiveCall.muted', 'Muted') : t('ActiveCall.mute', 'Mute')}
            </span>
          </div>

          {/* End */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => setShowEndModal(true)}
              className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center transition-all hover:bg-white/20"
            >
              <Phone size={22} className="text-white rotate-[135deg]" />
            </button>
            <span className="text-xs text-white font-medium">{t('ActiveCall.end', 'End')}</span>
          </div>
        </div>

        {/* Crisis button — venter only */}
        {role === 'venter' && (
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => setShowCrisisOverlay(true)}
              className="w-14 h-14 rounded-full bg-primary flex items-center justify-center transition-all hover:opacity-90"
            >
              <AlertTriangle size={22} className="text-white" />
            </button>
            <span className="text-xs text-white font-medium">{t('ActiveCall.crisis', 'Crisis')}</span>
          </div>
        )}
      </GlassCard>

      {/* Crisis instant-help overlay */}
      {showCrisisOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="glass w-full max-w-sm rounded-3xl p-8 text-center border border-white/10">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={30} className="text-primary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              {t('Crisis.safetyTitle', 'Your safety is our priority.')}
            </h3>
            <p className="text-sm text-white/70 leading-relaxed mb-8">
              {t('Crisis.safetyMessage', 'Please contact emergency services right away.')}
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => void handleCrisis988('call')}
                className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-base flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <PhoneCall size={20} />
                {t('Crisis.call988Now', 'CALL 988 NOW')}
              </button>
              <button
                onClick={() => void handleCrisis988('text')}
                className="w-full py-4 rounded-2xl border border-white/20 text-white font-semibold text-base flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
              >
                <MessageSquare size={20} />
                {t('Crisis.text988', 'TEXT 988')}
              </button>
              <button
                onClick={() => setShowCrisisOverlay(false)}
                className="w-full py-3 text-white/50 text-sm hover:text-white/80 transition-colors"
              >
                {t('Crisis.backToCall', 'Back to Call')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* End session confirmation modal */}
      {showEndModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm">
          <GlassCard className="w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl p-6 text-center">
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-6 sm:hidden" />
            <h3 className="text-lg font-bold text-white mb-2">{t('VenterChat.endSessionTitle', 'End Session?')}</h3>
            <p className="text-sm text-white/70 mb-8">{t('VenterChat.endSessionMessage', 'Are you sure you want to end this session?')}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEndModal(false)}
                className="flex-1 py-3 rounded-2xl glass text-white font-medium text-sm hover:bg-white/10 transition-colors"
              >
                {t('VenterChat.endSessionNo', 'No')}
              </button>
              <button
                onClick={handleEndCall}
                className="flex-1 py-3 rounded-2xl bg-primary text-white font-medium text-sm hover:opacity-90 transition-colors"
              >
                {t('VenterChat.endSessionYes', 'Yes, End')}
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
