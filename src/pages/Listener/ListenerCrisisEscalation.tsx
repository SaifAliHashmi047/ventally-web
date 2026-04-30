import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store/store';
import { endChatSession, endCall } from '../../store/slices/callSlice';
import { useChat } from '../../api/hooks/useChat';
import apiInstance from '../../api/apiInstance';
import socketService from '../../api/socketService';
import { GlassCard } from '../../components/ui/GlassCard';

type CrisisLocationState = {
  fromCall?: boolean;
  sessionId?: string;
};

type ModalStep = null | 'escalated' | 'ended';

export const ListenerCrisisEscalation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { endConversation } = useChat();

  const { fromCall, sessionId } = (location.state || {}) as CrisisLocationState;

  const activeConversationId = useSelector((state: RootState) => state.call.activeConversationId);
  const isChatActive = useSelector((state: RootState) => state.call.isChatActive);
  const isCallActive = useSelector((state: RootState) => state.call.isActive);

  const [modal, setModal] = useState<ModalStep>(null);

  const doNavigateAway = () => {
    navigate('/listener/home', { replace: true });
  };

  const handleEscalate = async () => {
    // End any active sessions
    if (isChatActive && activeConversationId) {
      try { await endConversation(activeConversationId); } catch { /* ignore */ }
      dispatch(endChatSession());
    }
    if (isCallActive || fromCall) {
      dispatch(endCall());
      try {
        if (sessionId) {
          socketService.emit('call:end', { callId: sessionId });
          await apiInstance.post(`calls/${sessionId}/end`);
        }
      } catch { /* ignore */ }
    }

    // Step 1: "Crisis Escalated"
    setModal('escalated');
    setTimeout(() => {
      // Step 2: "Session Ended"
      setModal('ended');
      setTimeout(() => {
        setModal(null);
        doNavigateAway();
      }, 2000);
    }, 2000);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-between px-6 pt-16 pb-10 animate-fade-in">

      {/* Center content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 w-full max-w-sm text-center">
        <div className="w-28 h-28 rounded-full bg-white/10 border border-white/10 flex items-center justify-center shadow-[0_0_48px_rgba(255,255,255,0.06)]">
          <span className="text-4xl font-bold text-white tracking-tight">988</span>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-white leading-snug">
            {t('ListenerCrisisEscalation.title', 'Prompt The Venter To Contact 988')}
          </h2>
          <p className="text-sm text-white/55 leading-relaxed">
            {t('ListenerCrisisEscalation.subtitle', 'Crisis services are available at 988')}
          </p>
        </div>
      </div>

      {/* Escalate button */}
      <button
        type="button"
        onClick={() => void handleEscalate()}
        disabled={modal !== null}
        className="w-full max-w-sm py-4 rounded-2xl glass border border-white/10 text-white font-semibold text-base hover:bg-white/10 transition-colors disabled:opacity-50 disabled:pointer-events-none"
      >
        {t('ListenerCrisisEscalation.escalate', 'Escalate')}
      </button>

      {/* Sequential modals */}
      {modal !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          style={{ background: 'rgba(0,0,0,0.8)' }}
        >
          <GlassCard
          style={{
            justifyContent:"center",
            alignItems:"center"
          }} 

          >
            {modal === 'escalated' ? (
              <>
                <h3 className="text-xl font-bold text-white mb-2 text-center">
                  {t('ListenerCrisisEscalation.modalEscalatedTitle', 'Crisis Escalated')}
                </h3>
                <p className="text-sm text-white/60 leading-relaxed text-center">
                  {t('ListenerCrisisEscalation.modalEscalatedSubtitle', 'Crisis protocol has been activated.')}
                </p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold text-white mb-2 text-center">
                  {t('ListenerCrisisEscalation.modalEndedTitle', 'Session Ended')}
                </h3>
                <p className="text-sm text-white/60 leading-relaxed text-center">
                  {t('ListenerCrisisEscalation.modalEndedSubtitle', 'Thank you for escalating and keeping the venter safe.')}
                </p>
              </>
            )}
          </GlassCard>
        </div>
      )}
    </div>
  );
};
