import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useParams, useLocation, useBlocker } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store/store';
import { endCall } from '../../store/slices/callSlice';
import { GlassCard } from '../../components/ui/GlassCard';
import { Mic, MicOff, Phone, AlertTriangle } from 'lucide-react';
import socketService from '../../api/socketService';
import apiInstance from '../../api/apiInstance';
import { useAgoraContext } from '../../contexts/AgoraContext';
import {
  joinParamsFromCallPayload,
  type AgoraCallPayload,
} from '../../hooks/useAgoraWeb';

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const ListenerActiveCall = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { roomId } = useParams<{ roomId: string }>();
  const session = useSelector((s: RootState) => s.session);
  const callStartTime = useSelector((s: RootState) => s.call.startTime);

  const sessionId = useMemo(() => {
    const d = session.data as { id?: string; callId?: string } | undefined;
    return (
      session.sessionId ||
      session.requestId ||
      d?.id ||
      d?.callId ||
      roomId ||
      undefined
    );
  }, [session.sessionId, session.requestId, session.data, roomId]);

  const agoraJoinParams = useMemo(() => {
    const fromNav = (location.state as { call?: AgoraCallPayload } | undefined)?.call;
    const fromSession = session.data as AgoraCallPayload | undefined;
    return joinParamsFromCallPayload(fromNav ?? fromSession ?? undefined);
  }, [location.state, session.data]);

  const { joinChannel, leaveChannel, toggleMute, isJoined } = useAgoraContext();
  const isCallActive = useSelector((s: RootState) => s.call.isActive);
  const isCallActiveRef = useRef(isCallActive);
  isCallActiveRef.current = isCallActive;

  const [, setTick] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showCrisisModal, setShowCrisisModal] = useState(false);

  const callStatus: 'connecting' | 'connected' = isJoined ? 'connected' : 'connecting';

  // Elapsed computed from Redux startTime — survives navigation/remount
  const seconds = callStartTime ? Math.floor((Date.now() - callStartTime) / 1000) : 0;

  // Join Agora — no cleanup leaveChannel so audio persists on navigation
  useEffect(() => {
    if (!agoraJoinParams) {
      console.warn('[ListenerActiveCall] Missing channel/token for Agora.');
      return;
    }
    void joinChannel(agoraJoinParams);
    // intentionally no leaveChannel in cleanup
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    toggleMute(isMuted);
  }, [isMuted, toggleMute]);

  // Tick every second to re-render the formatted time
  useEffect(() => {
    if (!isJoined) return;
    const timer = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(timer);
  }, [isJoined]);

  // Block ALL navigation (back button, tab nav, links) while the call is active.
  // useBlocker intercepts at the router level before any component unmounts,
  // which fixes the mobile issue where history.forward() was unreliable.
  const blocker = useBlocker(() => isCallActiveRef.current);
  useEffect(() => {
    if (blocker.state === 'blocked') {
      blocker.reset();
      setShowEndModal(true);
    }
  }, [blocker.state]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await socketService.connect();
        if (cancelled) return;
        const sid =
          session.sessionId ||
          session.requestId ||
          (session.data as { id?: string; callId?: string } | undefined)?.id ||
          (session.data as { id?: string; callId?: string } | undefined)?.callId;
        if (sid) {
          socketService.emit('call:join', { callId: sid });
        }
      } catch (e) {
        console.error('[ListenerActiveCall] socket connect failed:', e);
      }
    })();
    return () => { cancelled = true; };
  }, [session.sessionId, session.requestId, session.data]);

  const handleEndCall = async () => {
    setShowEndModal(false);
    // Dispatch immediately so the global call:ended handler skips this event
    dispatch(endCall());
    try {
      if (sessionId) {
        socketService.emit('call:end', { callId: sessionId });
        await apiInstance.post(`calls/${sessionId}/end`);
      }
    } catch { /* ignore */ }
    await leaveChannel();
    if (!sessionId) {
      navigate('/listener/home', { replace: true });
      return;
    }
    navigate(`/listener/session/${sessionId}/feedback`, {
      replace: true,
      state: { type: 'call' },
    });
  };

  const handleCrisisPress = async () => {
    // Dispatch immediately so global handler skips call:ended
    dispatch(endCall());
    try {
      if (sessionId) {
        socketService.emit('call:end', { callId: sessionId });
        await apiInstance.post(`calls/${sessionId}/end`);
      }
    } catch { /* ignore */ }
    try { await leaveChannel(); } catch { /* ignore */ }
    navigate('/listener/crisis-warning', {
      replace: true,
      state: { fromCall: true, sessionId: sessionId ?? undefined },
    });
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
              ? t('ListenerCall.connecting', 'Connecting...')
              : t('ListenerCall.voiceSession', 'Voice Session')}
          </h2>
          <p className="text-sm text-white/60">
            {t('ListenerCall.subtitle', 'You are on a call with a venter')}
          </p>
          {callStatus === 'connected' && (
            <p className="text-base text-white/80 mt-2 font-medium tabular-nums">
              {formatDuration(seconds)}
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
              onClick={() => setIsMuted(!isMuted)}
              className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center transition-all hover:bg-white/20"
            >
              {isMuted ? <MicOff size={22} className="text-white" /> : <Mic size={22} className="text-white" />}
            </button>
            <span className="text-xs text-white font-medium">
              {isMuted ? t('ListenerCall.unmute', 'Unmute') : t('ListenerCall.mute', 'Mute')}
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
            <span className="text-xs text-white font-medium">{t('ListenerCall.end', 'End')}</span>
          </div>
        </div>

        {/* Crisis button */}
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => setShowCrisisModal(true)}
            className="w-14 h-14 rounded-full bg-error flex items-center justify-center transition-all hover:opacity-90"
          >
            <AlertTriangle size={22} className="text-white" />
          </button>
          <span className="text-xs text-white font-medium">{t('ListenerCall.crisis', 'Crisis')}</span>
        </div>
      </GlassCard>

      {/* Crisis confirmation modal */}
      {showCrisisModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm">
          <GlassCard className="w-full max-w-sm rounded-3xl p-7 text-center">
            <h3 className="text-xl font-bold text-white mb-4">
              {t('ListenerCrisis.confirmTitle', 'Is The Venter In Crisis')}
            </h3>
            <p className="text-sm text-white/70 leading-relaxed mb-4">
              {t('ListenerCrisis.confirmMessage1', 'If the venter mentions thoughts of self harm or suicide, please escalate this session for crisis services.')}
            </p>
            <p className="text-sm text-white/70 leading-relaxed mb-8">
              {t('ListenerCrisis.confirmMessage2', 'If the venter is in crisis and you do not escalate this session you will be permanently barred from this platform.')}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCrisisModal(false)}
                className="flex-1 py-3 rounded-2xl glass text-white font-medium text-sm hover:bg-white/10 transition-colors"
              >
                {t('Common.no', 'No')}
              </button>
              <button
                onClick={() => { setShowCrisisModal(false); void handleCrisisPress(); }}
                className="flex-1 py-3 rounded-2xl glass text-white font-bold text-sm hover:bg-white/10 transition-colors"
              >
                {t('Common.yes', 'Yes')}
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* End session confirmation modal */}
      {showEndModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm">
          <GlassCard className="w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl p-6 text-center">
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-6 sm:hidden" />
            <h3 className="text-lg font-bold text-white mb-2">{t('ListenerCall.endSession', 'End Session?')}</h3>
            <p className="text-sm text-white/70 mb-8">
              {t('ListenerCall.endSessionConfirm', 'Are you sure you want to end this session?')}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEndModal(false)}
                className="flex-1 py-3 rounded-2xl glass text-white font-medium text-sm hover:bg-white/10 transition-colors"
              >
                {t('Common.no', 'No')}
              </button>
              <button
                onClick={() => void handleEndCall()}
                className="flex-1 py-3 rounded-2xl bg-primary text-white font-medium text-sm hover:opacity-90 transition-colors"
              >
                {t('Common.yes', 'Yes, End')}
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
