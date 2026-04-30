import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import type { RootState } from '../../store/store';
import { endCall } from '../../store/slices/callSlice';
import { Mic, MicOff, Phone, AlertTriangle } from 'lucide-react';
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
  const role = user?.userType || 'venter';

  const resolvedCallId = useResolvedCallId(roomId, location.state, session, callSessionId);
  const feedbackSessionId = resolvedCallId ?? roomId;

  const agoraJoinParams = useMemo(() => {
    const fromNav = (location.state as { call?: AgoraCallPayload } | undefined)?.call;
    const fromSession = session.data as AgoraCallPayload | undefined;
    return joinParamsFromCallPayload(fromNav ?? fromSession ?? undefined);
  }, [location.state, session.data]);

  const { joinChannel, leaveChannel, toggleMute, isJoined } = useAgoraContext();

  const [muted, setMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [showEndModal, setShowEndModal] = useState(false);
  const callStatus: 'connecting' | 'connected' | 'ended' = isJoined ? 'connected' : 'connecting';

  // Call duration timer
  useEffect(() => {
    if (!isJoined) return;
    const interval = setInterval(() => setDuration((d) => d + 1), 1000);
    return () => clearInterval(interval);
  }, [isJoined]);

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

  const handleCrisisPress = () => {
    // Mobile app navigates directly to disclaimer (skips warning) when from a call
    navigate('/venter/crisis-disclaimer', {
      state: {
        fromCall: true,
        feedbackSessionId,
      },
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
              onClick={handleCrisisPress}
              className="w-14 h-14 rounded-full bg-error flex items-center justify-center transition-all hover:opacity-90"
            >
              <AlertTriangle size={22} className="text-white" />
            </button>
            <span className="text-xs text-white font-medium">{t('ActiveCall.crisis', 'Crisis')}</span>
          </div>
        )}
      </GlassCard>

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
