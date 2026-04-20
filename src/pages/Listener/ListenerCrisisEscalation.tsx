import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store/store';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { ShieldAlert, Phone, MessageSquare } from 'lucide-react';
import { endChatSession, endCall } from '../../store/slices/callSlice';
import { useChat } from '../../api/hooks/useChat';
import { LISTENER_SESSION_FLOW_BG_STYLE } from '../../components/Listener/ListenerSessionShell';

type CrisisLocationState = {
  fromChat?: boolean;
  fromCall?: boolean;
  sessionId?: string;
};

export const ListenerCrisisEscalation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { endConversation } = useChat();

  const [showSessionEndedModal, setShowSessionEndedModal] = useState(false);
  const waitingForReturn = useRef(false);

  /** Stable ref for post–988 navigation (tab can outlive stale closure). */
  const afterExternalRef = useRef<CrisisLocationState>({});

  useEffect(() => {
    const s = (location.state || {}) as CrisisLocationState;
    afterExternalRef.current = {
      fromCall: !!s.fromCall,
      fromChat: !!s.fromChat,
      sessionId: s.sessionId,
    };
  }, [location.state]);

  const activeConversationId = useSelector((state: RootState) => state.call.activeConversationId);
  const isChatActive = useSelector((state: RootState) => state.call.isChatActive);
  const isCallActive = useSelector((state: RootState) => state.call.isActive);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible' || !waitingForReturn.current) return;
      waitingForReturn.current = false;
      setShowSessionEndedModal(true);
      const { sessionId, fromCall } = afterExternalRef.current;
      window.setTimeout(() => {
        setShowSessionEndedModal(false);
        if (sessionId) {
          navigate(`/listener/session/${sessionId}/feedback`, {
            replace: true,
            state: { type: fromCall ? 'call' : 'chat' },
          });
        } else {
          navigate('/listener/home', { replace: true });
        }
      }, 2800);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleContinue = async () => {
    if (isChatActive && activeConversationId) {
      try {
        await endConversation(activeConversationId);
      } catch (e) {
        console.log('[Crisis] End conversation error (non-blocking):', e);
      }
      dispatch(endChatSession());
    }
    if (isCallActive) {
      dispatch(endCall());
    }
  };

  const handleContact988 = () => {
    waitingForReturn.current = true;
    void handleContinue();
    window.location.href = 'tel:988';
  };

  const handleChat988 = () => {
    waitingForReturn.current = true;
    void handleContinue();
    window.location.href = 'sms:988';
  };

  return (
    <div
      className="min-h-[100dvh] flex flex-col text-white animate-fade-in"
      style={LISTENER_SESSION_FLOW_BG_STYLE}
    >
      <div className="relative z-10 flex flex-col flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 pt-6 sm:pt-8 pb-10">
        <PageHeader
          title={t('CrisisWarning.crisisSupport', 'Crisis support')}
          subtitle={t('CrisisWarning.available247', 'Available 24/7')}
          onBack={handleBack}
          className="mb-6 sm:mb-10 shrink-0"
        />

        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-xl lg:max-w-2xl mx-auto">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white/10 border border-white/10 flex items-center justify-center mb-6 sm:mb-8 shadow-[0_0_48px_rgba(194,174,191,0.12)]">
            <span className="text-3xl sm:text-4xl font-bold text-white tracking-tight">988</span>
          </div>

          <div className="text-center mb-6 sm:mb-8 space-y-1">
            <p className="text-lg sm:text-xl text-white font-semibold leading-snug">
              {t('CrisisWarning.support988TitleLine1', '988 Suicide &')}
            </p>
            <p className="text-lg sm:text-xl text-white font-semibold leading-snug">
              {t('CrisisWarning.support988TitleLine2', 'Crisis Lifeline')}
            </p>
          </div>

          <p className="text-sm sm:text-base text-white/55 text-center mb-8 sm:mb-10 max-w-md leading-relaxed px-2">
            {t('CrisisWarning.support988Subtext', 'Free, confidential support available 24/7 for people in distress')}
          </p>

          <div className="w-full max-w-md space-y-3 sm:space-y-4">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              className="min-h-[52px] rounded-2xl"
              leftIcon={<Phone size={20} />}
              onClick={handleContact988}
            >
              {t('CrisisWarning.contact988', 'Call 988')}
            </Button>

            <Button
              variant="glass"
              size="lg"
              fullWidth
              className="min-h-[52px] rounded-2xl border border-white/10"
              leftIcon={<MessageSquare size={20} />}
              onClick={handleChat988}
            >
              {t('CrisisWarning.chat988', 'Text 988')}
            </Button>
          </div>
        </div>
      </div>

      {showSessionEndedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <GlassCard bordered className="w-full max-w-md rounded-3xl p-8 sm:p-10 text-center border-white/10 bg-black/45 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center mx-auto mb-5">
              <ShieldAlert size={32} className="text-primary" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              {t('Crisis.sessionEnded', 'Session ended')}
            </h3>
            <p className="text-sm sm:text-base text-white/60 leading-relaxed">
              {t('Crisis.thanksMessage', 'Thanks for being here. You made a difference.')}
            </p>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
