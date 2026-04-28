import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store/store';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { PageHeader } from '../../components/ui/PageHeader';
import { Phone, MessageSquare, ArrowRight, Clock } from 'lucide-react';
import { endChatSession, endCall } from '../../store/slices/callSlice';
import apiInstance from '../../api/apiInstance';
import socketService from '../../api/socketService';

export const VenterCrisisImmediateHelp = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const activeConversationId = useSelector((state: RootState) => state.call.activeConversationId);
  const isChatActive = useSelector((state: RootState) => state.call.isChatActive);
  const fromChat = location.state?.fromChat || false;
  const fromCall = location.state?.fromCall || false;
  const feedbackSessionId = location.state?.feedbackSessionId;

  const endSessionIfActive = async () => {
    // End chat via socket if coming from chat
    if (isChatActive && activeConversationId) {
      try {
        await socketService.connect();
        socketService.emit('chat:end', { conversationId: activeConversationId });
      } catch (e) {
        console.log('[Crisis] End chat socket error (non-blocking):', e);
      }
      dispatch(endChatSession());
    }
    // End call if coming from call
    if (fromCall && feedbackSessionId) {
      try {
        await socketService.connect();
        socketService.emit('call:end', { callId: feedbackSessionId });
        await apiInstance.post(`calls/${feedbackSessionId}/end`);
      } catch (e) {
        console.log('[Crisis] End call error (non-blocking):', e);
      }
      dispatch(endCall());
    }
  };

  const navigateAfterCrisis = () => {
    if (fromCall && feedbackSessionId) {
      navigate(`/venter/session/${feedbackSessionId}/rating`, {
        replace: true,
        state: { type: 'call' },
      });
    } else if (fromChat) {
      navigate('/venter/home', { replace: true });
    } else {
      navigate('/venter/home', { replace: true });
    }
  };

  const handleCall988 = async () => {
    await endSessionIfActive();
    window.location.href = 'tel:988';
    // Give a short delay to allow the phone call to initiate then navigate
    setTimeout(() => navigateAfterCrisis(), 1000);
  };

  const handleText988 = async () => {
    await endSessionIfActive();
    window.location.href = 'sms:988';
    setTimeout(() => navigateAfterCrisis(), 1000);
  };

  const resources = [
    {
      icon: Phone,
      title: t('Crisis.call988', 'Call 988'),
      description: t('Crisis.call988Desc', '24/7 Suicide & Crisis Lifeline'),
      action: handleCall988,
      variant: 'primary' as const,
    },
    {
      icon: MessageSquare,
      title: t('Crisis.text988', 'Text 988'),
      description: t('Crisis.text988Desc', 'Text HELLO to 988 for chat support'),
      action: handleText988,
      variant: 'glass' as const,
    },
  ];

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader
        title={t('Crisis.title', 'Crisis Support')}
        onBack={() => {

          navigate(-1);

        }}
      />

      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center mb-6">
          <Clock size={40} className="text-primary" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">
          {t('Crisis.immediateHelp', 'Immediate Help Available')}
        </h2>

        <p className="text-gray-400 max-w-md mb-8">
          {t('Crisis.immediateHelpDesc', 'Connect with trained crisis counselors 24/7. Free, confidential support is just a call or text away.')}
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {resources.map((resource, index) => (
          <GlassCard
            key={index}
            hover
            onClick={resource.action}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${resource.variant === 'primary' ? 'bg-primary/15' : 'glass'
                }`}>
                <resource.icon size={24} className={resource.variant === 'primary' ? 'text-primary' : 'text-accent'} />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-white">{resource.title}</h3>
                <p className="text-sm text-gray-400">{resource.description}</p>
              </div>
              <ArrowRight size={20} className="text-white" />
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="bg-white/[0.02] mb-6">
        <p className="text-sm text-gray-300 text-center">
          {t('Crisis.notAlone', 'You are not alone. Reach out for support — it is a sign of strength.')}
        </p>
      </GlassCard>

      <Button
        variant="ghost"
        size="lg"
        fullWidth
        onClick={() => navigate('/venter/crisis-988-support')}
      >
        {t('Crisis.moreResources', 'More Crisis Resources')}
      </Button>
    </div>
  );
};
