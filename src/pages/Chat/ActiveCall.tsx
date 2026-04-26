import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import type { RootState } from '../../store/store';
import { Mic, MicOff, Volume2, VolumeX, Phone } from 'lucide-react';
import apiInstance from '../../api/apiInstance';
import socketService from '../../api/socketService';
import {
  useAgoraWeb,
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

  const {
    joinChannel,
    leaveChannel,
    toggleMute,
    setSpeakerMuted,
    isJoined,
  } = useAgoraWeb();

  const [muted, setMuted] = useState(false);
  const [speakerOff, setSpeakerOff] = useState(false);
  const [duration, setDuration] = useState(0);
  const callStatus: 'connecting' | 'connected' | 'ended' = isJoined ? 'connected' : 'connecting';

  // Call duration (starts when Agora reports joined + publishing)
  useEffect(() => {
    if (!isJoined) return;
    const interval = setInterval(() => setDuration((d) => d + 1), 1000);
    return () => clearInterval(interval);
  }, [isJoined]);

  // Agora voice channel
  useEffect(() => {
    if (!agoraJoinParams) {
      console.warn('[ActiveCall] Missing channel/token for Agora — check call:accepted payload.');
      return;
    }
    void joinChannel(agoraJoinParams);
    return () => {
      void leaveChannel();
    };
  }, [agoraJoinParams, joinChannel, leaveChannel]);

  useEffect(() => {
    toggleMute(muted);
  }, [muted, toggleMute]);

  useEffect(() => {
    setSpeakerMuted(speakerOff);
  }, [speakerOff, setSpeakerMuted]);

  // Socket: connect + server call room (signaling / presence)
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
    return () => {
      cancelled = true;
    };
  }, [resolvedCallId]);

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleEndCall = async () => {
    await leaveChannel();
    try {
      if (resolvedCallId) {
        await apiInstance.post(`calls/${resolvedCallId}/end`);
      }
    } catch { /* ignore */ }
    navigate(`/${role}/session/${feedbackSessionId}/feedback`, { replace: true, state: { type: 'call' } });
  };

  // Listen for remote end via socket (when other party ends the call)
  useEffect(() => {
    if (!feedbackSessionId) return;

    const handleCallEnded = async (data: any) => {
      const endedId = data?.callId ?? data?.id ?? data?.call?.id;
      if (resolvedCallId && endedId != null && String(endedId) !== String(resolvedCallId)) {
        return;
      }
      console.log('[ActiveCall] call:ended from socket:', data);
      await leaveChannel();
      navigate(`/${role}/session/${feedbackSessionId}/feedback`, { replace: true, state: { type: 'call' } });
    };

    socketService.on('call:ended', handleCallEnded);
    return () => {
      socketService.off('call:ended', handleCallEnded);
    };
  }, [feedbackSessionId, resolvedCallId, navigate, role, leaveChannel]);

  return (
    <div
      className="h-[100dvh] min-h-0 w-full max-w-4xl lg:max-w-5xl mx-auto flex flex-col items-stretch justify-between py-8 sm:py-12 px-4 sm:px-5 bg-bg-deep lg:border lg:border-white/10 lg:rounded-3xl lg:shadow-2xl lg:shadow-black/40 lg:overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, rgba(194,174,191,0.08) 0%, #000 60%)' }}
    >
      {/* Top Bar */}
      <div className="flex justify-between items-center w-full max-w-sm mx-auto shrink-0">
        <p className="text-sm text-white/80">{t('ActiveCall.sessionCall', 'Session Call')}</p>
        <div className="badge badge-success">
          <div className="w-1.5 h-1.5 rounded-full bg-success" />
          {callStatus === 'connected' ? t('ActiveCall.connected', 'Connected') : t('ActiveCall.connectingStatus', 'Connecting...')}
        </div>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center gap-4 flex-1 justify-center min-h-0">
        <div className="relative">
          <div className="w-28 h-28 rounded-full glass-accent flex items-center justify-center text-4xl font-bold text-white">
            L
          </div>
          {callStatus === 'connected' && (
            <div className="absolute inset-0 rounded-full border-2 border-accent/40 animate-ping" />
          )}
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-white">{t('ActiveCall.yourListener', 'Your Listener')}</h2>
          <p className="text-sm text-white/80 mt-1">
            {callStatus === 'connecting' ? t('ActiveCall.connectingStatus', 'Connecting...') : formatDuration(duration)}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-6 w-full max-w-sm mx-auto shrink-0 pb-safe">
        <div className="flex justify-center gap-6">
          <button
            onClick={() => setMuted(!muted)}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
              muted ? 'bg-error/20 border border-error/40 text-error' : 'glass text-white hover:bg-white/8'
            }`}
          >
            {muted ? <MicOff size={22} /> : <Mic size={22} />}
          </button>

          <button
            onClick={handleEndCall}
            className="w-20 h-20 rounded-full bg-error flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-lg"
          >
            <Phone size={26} className="rotate-[135deg]" />
          </button>

          <button
            onClick={() => setSpeakerOff(!speakerOff)}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
              speakerOff ? 'bg-error/20 border border-error/40 text-error' : 'glass text-white hover:bg-white/8'
            }`}
          >
            {speakerOff ? <VolumeX size={22} /> : <Volume2 size={22} />}
          </button>
        </div>
      </div>
    </div>
  );
};
