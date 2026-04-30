import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { endCall, endChatSession } from '../../store/slices/callSlice';
import socketService from '../socketService';
import { useAgoraContext } from '../../contexts/AgoraContext';

/**
 * Attaches global call:ended / chat:ended socket listeners so that
 * navigation to the post-session screens happens from ANY screen,
 * not just the active call/chat screen.
 */
export function useGlobalSessionEvents(role: 'venter' | 'listener') {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { leaveChannel } = useAgoraContext();

  const isCallActive = useSelector((s: RootState) => s.call.isActive);
  const isChatActive = useSelector((s: RootState) => s.call.isChatActive);
  const sessionId = useSelector((s: RootState) => s.call.sessionId);
  const conversationId = useSelector((s: RootState) => s.call.activeConversationId);

  // Use refs so event handlers always read current values without re-registering
  const isCallActiveRef = useRef(isCallActive);
  const isChatActiveRef = useRef(isChatActive);
  const sessionIdRef = useRef(sessionId);
  const conversationIdRef = useRef(conversationId);

  isCallActiveRef.current = isCallActive;
  isChatActiveRef.current = isChatActive;
  sessionIdRef.current = sessionId;
  conversationIdRef.current = conversationId;

  useEffect(() => {
    const handleCallEnded = async (data: any) => {
      if (!isCallActiveRef.current) return;
      console.log('[GlobalSessionEvents] call:ended', data);
      dispatch(endCall());
      await leaveChannel();
      const sid = sessionIdRef.current ?? data?.callId ?? data?.id ?? data?.call?.id;
      const firstStep = role === 'listener' ? 'feedback' : 'rating';
      const target = sid
        ? `/${role}/session/${sid}/${firstStep}`
        : `/${role}/home`;
      navigate(target, { replace: true, state: { type: 'call' } });
    };

    const handleChatEnded = (data: any) => {
      if (!isChatActiveRef.current) return;
      console.log('[GlobalSessionEvents] chat:ended', data);
      dispatch(endChatSession());
      const cid = conversationIdRef.current ?? data?.conversationId ?? data?.id;
      const firstStep = role === 'listener' ? 'feedback' : 'rating';
      const target = cid
        ? `/${role}/session/${cid}/${firstStep}`
        : `/${role}/home`;
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
