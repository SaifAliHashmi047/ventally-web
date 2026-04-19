import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store/store';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { ShieldAlert, Phone, MessageSquare } from 'lucide-react';
import { endChatSession, endCall } from '../../store/slices/callSlice';
import { useChat } from '../../api/hooks/useChat';

export const ListenerCrisisEscalation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { endConversation } = useChat();

  const [showSessionEndedModal, setShowSessionEndedModal] = useState(false);
  const waitingForReturn = useRef(false);

  const activeConversationId = useSelector((state: RootState) => state.call.activeConversationId);
  const isChatActive = useSelector((state: RootState) => state.call.isChatActive);
  const isCallActive = useSelector((state: RootState) => state.call.isActive);

  // Handle browser tab visibility change (like AppState on mobile)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && waitingForReturn.current) {
        waitingForReturn.current = false;
        setShowSessionEndedModal(true);
        setTimeout(() => {
          setShowSessionEndedModal(false);
          navigate('/listener/home', { replace: true });
        }, 3000);
      }
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
    handleContinue();
    window.location.href = 'tel:988';
  };

  const handleChat988 = () => {
    waitingForReturn.current = true;
    handleContinue();
    window.location.href = 'sms:988';
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader onBack={handleBack} title="" />

      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-28 h-28 rounded-full bg-white/10 flex items-center justify-center mb-6">
          <span className="text-4xl font-bold text-white">988</span>
        </div>

        <div className="text-center mb-6">
          <p className="text-lg text-white font-medium leading-relaxed">
            {t('CrisisWarning.support988TitleLine1', '988 Suicide &')}
          </p>
          <p className="text-lg text-white font-medium leading-relaxed">
            {t('CrisisWarning.support988TitleLine2', 'Crisis Lifeline')}
          </p>
        </div>

        <p className="text-sm text-gray-400 text-center mb-8 max-w-xs">
          {t('CrisisWarning.support988Subtext', 'Free, confidential support available 24/7 for people in distress')}
        </p>

        <div className="w-full max-w-sm space-y-3">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            leftIcon={<Phone size={20} />}
            onClick={handleContact988}
          >
            {t('CrisisWarning.contact988', 'Call 988')}
          </Button>

          <Button
            variant="glass"
            size="lg"
            fullWidth
            leftIcon={<MessageSquare size={20} />}
            onClick={handleChat988}
          >
            {t('CrisisWarning.chat988', 'Text 988')}
          </Button>
        </div>
      </div>

      {/* Session Ended Modal */}
      {showSessionEndedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <GlassCard className="w-full max-w-sm rounded-3xl p-8 text-center">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldAlert size={36} className="text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {t('Crisis.sessionEnded', 'Session Ended')}
            </h3>
            <p className="text-base text-gray-400">
              {t('Crisis.thanksMessage', 'Thanks for being here. You made a difference.')}
            </p>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
