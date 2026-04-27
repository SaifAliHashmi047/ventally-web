import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Mic, MicOff, PhoneOff, Plus } from 'lucide-react';
import socketService from '../../api/socketService';
import {
  useAgoraWeb,
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
  const { roomId } = useParams<{ roomId: string }>();
  const session = useSelector((s: RootState) => s.session);

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

  const { joinChannel, leaveChannel, toggleMute, isJoined } = useAgoraWeb();

  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const exitedRef = useRef(false);

  useEffect(() => {
    if (!agoraJoinParams) {
      console.warn('[ListenerActiveCall] Missing channel/token for Agora.');
      return;
    }
    void joinChannel(agoraJoinParams);
    return () => {
      void leaveChannel();
    };
  }, [agoraJoinParams, joinChannel, leaveChannel]);

  useEffect(() => {
    toggleMute(isMuted);
  }, [isMuted, toggleMute]);

  useEffect(() => {
    if (!isJoined) return;
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isJoined]);

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
    return () => {
      cancelled = true;
    };
  }, [session.sessionId, session.requestId, session.data]);

  /**
   * Ends Agora + replaces call route so the user cannot go "back" into the live call.
   * Flow: feedback (mood) → rating → home (handled by those screens).
   */
  const goToPostCallFlow = useCallback(async () => {
    if (exitedRef.current) return;
    exitedRef.current = true;
    try {
      await leaveChannel();
    } catch {
      /* ignore */
    }
    if (!sessionId) {
      navigate('/listener/home', { replace: true });
      return;
    }
    navigate(`/listener/session/${sessionId}/feedback`, {
      replace: true,
      state: { type: 'call' },
    });
  }, [leaveChannel, navigate, sessionId]);

  const handleEndCall = () => {
    setShowEndModal(true);
  };

  const confirmEndCall = async () => {
    setShowEndModal(false);
    await goToPostCallFlow();
  };

  const handleCrisisNavigation = useCallback(async () => {
    try {
      await leaveChannel();
    } catch {
      /* ignore */
    }
    navigate('/listener/crisis-escalation', {
      replace: true,
      state: {
        fromCall: true,
        sessionId: sessionId ?? undefined,
      },
    });
  }, [leaveChannel, navigate, sessionId]);

  useEffect(() => {
    if (!roomId && !sessionId) return;

    const handleCallEnded = async () => {
      console.log('[ListenerActiveCall] call:ended from socket');
      await goToPostCallFlow();
    };

    socketService.on('call:ended', handleCallEnded);
    return () => {
      socketService.off('call:ended', handleCallEnded);
    };
  }, [roomId, sessionId, goToPostCallFlow]);

  return (
    <div
      className="min-h-[100dvh] flex flex-col text-white relative overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse 120% 80% at 50% -10%, rgba(194,174,191,0.14) 0%, transparent 55%), radial-gradient(ellipse at 50% 100%, rgba(194,174,191,0.06) 0%, #000 65%)',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}
    >
      <div className="relative z-10 flex flex-col flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 min-h-0">
        <div className="pt-4 sm:pt-6 shrink-0">
          <PageHeader
            title={t('ListenerCall.voiceSession', 'Voice session')}
            subtitle={
              isJoined
                ? t('ListenerCall.statusLive', 'Connected — you’re live')
                : t('ListenerCall.connecting', 'Connecting…')
            }
            onBack={() => setShowEndModal(true)}
            className="mb-0"
          />
        </div>

        <div className="flex-1 flex flex-col min-h-0 py-4 sm:py-8">
          <div className="flex-1 flex flex-col items-center justify-center gap-4 sm:gap-6 w-full max-w-xl mx-auto">
            <div className="relative">
              <div
                className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full flex items-center justify-center text-4xl sm:text-5xl font-bold text-white border border-white/10 shadow-[0_0_60px_rgba(194,174,191,0.12)]"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              >
                V
              </div>
              {isJoined && (
                <div className="absolute inset-0 rounded-full border-2 border-[#C2AEBF]/50 animate-ping pointer-events-none" />
              )}
            </div>

            <div className="text-center space-y-1">
              <p className="text-xs sm:text-sm font-medium uppercase tracking-widest text-white/45">
                {t('ListenerCall.duration', 'Duration')}
              </p>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-light tabular-nums tracking-wider text-white">
                {formatDuration(seconds)}
              </h2>
              <div className="flex items-center justify-center gap-2 pt-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                    isJoined
                      ? 'bg-emerald-500/15 text-emerald-400/95 border border-emerald-500/25'
                      : 'bg-white/5 text-white/55 border border-white/10'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${isJoined ? 'bg-emerald-400 animate-pulse' : 'bg-white/40'}`}
                  />
                  {isJoined
                    ? t('ListenerCall.badgeLive', 'Live')
                    : t('ListenerCall.badgeConnecting', 'Connecting')}
                </span>
              </div>
            </div>
          </div>

          <div className="w-full max-w-xl lg:max-w-2xl mx-auto mt-auto pt-6 sm:pt-10 pb-6 sm:pb-8">
            <GlassCard
              bordered
              className="w-full rounded-3xl py-5 sm:py-7 px-3 sm:px-6 bg-black/35 border-white/10 backdrop-blur-xl"
            >
              <div className="flex flex-row items-center justify-around sm:justify-evenly gap-2 sm:gap-4 max-w-md mx-auto">
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="flex flex-col items-center gap-2 group min-w-[4.5rem]"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/10 flex items-center justify-center transition-all group-hover:bg-white/15 ring-1 ring-white/10">
                    {isMuted ? <MicOff size={22} className="text-red-400" /> : <Mic size={22} className="text-white" />}
                  </div>
                  <span className="text-[11px] sm:text-xs font-medium text-white/90 text-center leading-tight">
                    {isMuted ? t('ListenerCall.unmute', 'Unmute') : t('ListenerCall.mute', 'Mute')}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => void handleCrisisNavigation()}
                  className="flex flex-col items-center gap-2 group -translate-y-2 sm:-translate-y-3 min-w-[4.5rem]"
                >
                  <div className="w-[68px] h-[68px] sm:w-[72px] sm:h-[72px] rounded-full bg-red-600 flex items-center justify-center shadow-[0_0_32px_rgba(220,38,38,0.35)] transition-transform group-hover:scale-[1.02] ring-2 ring-red-500/30">
                    <Plus size={32} className="text-white sm:w-9 sm:h-9" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-semibold text-white">{t('ListenerCall.crisis', 'Crisis')}</span>
                </button>

                <button type="button" onClick={handleEndCall} className="flex flex-col items-center gap-2 group min-w-[4.5rem]">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/10 flex items-center justify-center transition-all group-hover:bg-white/15 ring-1 ring-white/10">
                    <PhoneOff size={22} className="text-white" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-medium text-white/90">{t('ListenerCall.end', 'End')}</span>
                </button>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>

      {showEndModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <GlassCard bordered className="w-full max-w-md rounded-3xl p-6 sm:p-8 text-center transform animate-scale-up border-white/10">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
              <PhoneOff size={26} className="text-white/80" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{t('ListenerCall.endSession', 'End session?')}</h3>
            <p className="text-sm text-gray-400 mb-8 max-w-sm mx-auto">
              {t(
                'ListenerCall.endSessionConfirm',
                'You’ll leave this call and go to rate the session. You won’t return to this call screen.',
              )}
            </p>
            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
              <button
                type="button"
                onClick={() => setShowEndModal(false)}
                className="py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors"
              >
                {t('Common.no', 'No')}
              </button>
              <button
                type="button"
                onClick={() => void confirmEndCall()}
                className="py-3.5 rounded-2xl bg-red-600 text-white font-medium hover:bg-red-500 transition-colors shadow-[0_0_24px_rgba(220,38,38,0.25)]"
              >
                {t('Common.yes', 'Yes, end')}
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
