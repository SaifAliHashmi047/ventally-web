import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store/store';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { PageHeader } from '../../components/ui/PageHeader';
import { AlertTriangle, Check } from 'lucide-react';
import { endChatSession, endCall } from '../../store/slices/callSlice';
import { useChat } from '../../api/hooks/useChat';
import socketService from '../../api/socketService';

export const VenterCrisisWarning = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { endConversation } = useChat();
  const fromChat = location.state?.fromChat || false;

  const [understood, setUnderstood] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  const activeConversationId = useSelector((state: RootState) => state.call.activeConversationId);
  const isChatActive = useSelector((state: RootState) => state.call.isChatActive);
  const isCallActive = useSelector((state: RootState) => state.call.isActive);

  const handleAgreeContinue = async () => {
    // End active chat/call if exists
    if (isChatActive && activeConversationId) {
      try {
        // Emit socket event to notify other party
        await socketService.connect();
        socketService.emit('chat:end', { conversationId: activeConversationId });
        // Call API to end
        await endConversation(activeConversationId);
      } catch (e) {
        console.log('[Crisis] End conversation error (non-blocking):', e);
      }
      dispatch(endChatSession());
    }
    if (isCallActive) {
      dispatch(endCall());
    }
    setShowEmergencyModal(true);
  };

  const handleContact988 = () => {
    setShowEmergencyModal(false);
    navigate('/venter/crisis-disclaimer', { state: { fromChat } });
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader
        title=""
        onBack={() => {

          navigate(-1);

        }}
      />

      <div className="flex-1 flex flex-col items-center justify-center px-4  ">
        {/* Disclaimer Text */}
        <div className="text-center mb-8">
          <p className="text-lg text-white font-medium leading-relaxed">
            {t('CrisisWarning.titleLine1', 'If you are having thoughts of suicide or self-harm,')}
          </p>
          <p className="text-lg text-white font-medium leading-relaxed">
            {t('CrisisWarning.titleLine2', 'please reach out to a crisis counselor immediately.')}
          </p>
          <p className="text-lg text-white font-medium leading-relaxed">
            {t('CrisisWarning.titleLine3', 'You don\'t have to go through this alone.')}
          </p>
        </div>

        {/* Checkbox */}
        <button
          onClick={() => setUnderstood(!understood)}
          className="flex items-center gap-3 mb-8 w-full max-w-sm"
        >
          <div
            className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${understood
              ? 'bg-magenta border-magenta'
              : 'border-white/30'
              }`}
          >
            {understood && <Check size={16} className="text-white" />}
          </div>
          <span className="text-sm text-white text-left flex-1">
            {t('CrisisWarning.acknowledgment', 'I understand and agree to seek immediate professional help if needed')}
          </span>
        </button>
        {/* Button at bottom */}

      </div>
      {!showEmergencyModal && (
        // <div className="absolute bottom-6 left-4 right-4">
        <Button
          variant="primary"
          fullWidth
          onClick={handleAgreeContinue}
          disabled={!understood}
        >
          {t('CrisisWarning.agreeContinue', 'Agree & Continue')}
        </Button>
        // </div>
      )}

      {/* Emergency Protocol Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <GlassCard className="w-full sm:w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl p-6 text-center">
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-6" />
            <h3 className="text-xl font-bold text-white mb-4">
              {t('CrisisWarning.emergencyProtocolTitle', '988 Suicide & Crisis Lifeline')}
            </h3>
            <p className="text-sm text-gray-400 mb-8">
              {t('CrisisWarning.emergencyProtocolMessage', 'Free, confidential support available 24/7. You will be connected to trained crisis counselors.')}
            </p>
            <Button
              variant="primary"
              fullWidth
              className='!w-full'
              onClick={handleContact988}
            >
              {t('CrisisWarning.continue', 'Continue')}
            </Button>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
