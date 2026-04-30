import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useStore } from 'react-redux';
import type { RootState } from '../../store/store';
import { endCall, endChatSession } from '../../store/slices/callSlice';
import socketService from '../socketService';
import { useAgoraContext } from '../../contexts/AgoraContext';

/**
 * Attaches global call:ended / chat:ended socket listeners so that
 * navigation to the post-session screens happens from ANY screen,
 * not just the active call/chat screen.
 *
 * Uses store.getState() (not render-cycle refs) so that a dispatch()
 * made immediately before navigate() is visible synchronously — this
 * prevents the listener's own crisis/end handler from also triggering
 * a feedback-screen redirect when the server echoes back the ended event.
 */
export function useGlobalSessionEvents(role: 'venter' | 'listener') {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const store = useStore<RootState>();
  const { leaveChannel } = useAgoraContext();

  useEffect(() => {
    const handleCallEnded = async (data: any) => {
      const state = (store.getState() as RootState).call;
      if (!state.isActive) return;
      console.log('[GlobalSessionEvents] call:ended', data);
      dispatch(endCall());
      await leaveChannel();
      const sid = state.sessionId ?? data?.callId ?? data?.id ?? data?.call?.id;
      const firstStep = role === 'listener' ? 'feedback' : 'rating';
      const target = sid ? `/${role}/session/${sid}/${firstStep}` : `/${role}/home`;
      navigate(target, { replace: true, state: { type: 'call' } });
    };

    const handleChatEnded = (data: any) => {
      const state = (store.getState() as RootState).call;
      if (!state.isChatActive) return;
      console.log('[GlobalSessionEvents] chat:ended', data);
      dispatch(endChatSession());
      const cid = state.activeConversationId ?? data?.conversationId ?? data?.id;
      const firstStep = role === 'listener' ? 'feedback' : 'rating';
      const target = cid ? `/${role}/session/${cid}/${firstStep}` : `/${role}/home`;
      navigate(target, { replace: true, state: { type: 'chat' } });
    };

    socketService.on('call:ended', handleCallEnded);
    socketService.on('chat:ended', handleChatEnded);

    return () => {
      socketService.off('call:ended', handleCallEnded);
      socketService.off('chat:ended', handleChatEnded);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);
}
