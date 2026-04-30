import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import i18n from '../../locales/i18n';
import type { RootState, AppDispatch } from '../../store/store';
import apiInstance from '../../api/apiInstance';
import socketService from '../../api/socketService';
import { Send, Flag, MoreVertical, AlertTriangle, ChevronLeft, PhoneOff, PhoneCall, MessageSquare } from 'lucide-react';
import { cn } from '../../utils/cn';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { MainBackground } from '../../components/ui/MainBackground';
import { Popover, PopoverItem, PopoverSeparator } from '../../components/ui/Popover';
import { endChatSession } from '../../store/slices/callSlice';

// Format date like mobile app
const formatDateDayTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString(i18n.language, { hour: 'numeric', minute: '2-digit' });
};

export const ChatScreen = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const chat = location.state?.chat;
  const currentUser = useSelector((state: RootState) => state.user.user as any);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const seenMessageIds = useRef<Set<string>>(new Set());
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showCrisisOverlay, setShowCrisisOverlay] = useState(false);
  const [showListenerCrisisModal, setShowListenerCrisisModal] = useState(false);
  const [isChatActive, setIsChatActive] = useState(true);

  // Get other participant info
  const getOtherName = () => {
    if (currentUser?.userType === 'venter' || currentUser?.role === 'venter') {
      return chat?.listener?.anonymousName || chat?.otherParticipant?.anonymousName || 'Listener';
    }
    return chat?.conversation?.venter?.anonymousName || chat?.otherParticipant?.anonymousName || 'Venter';
  };

  const handleCrisisPress = () => {
    const isVenter = currentUser?.userType === 'venter' || currentUser?.role === 'venter';
    if (isVenter) {
      setShowCrisisOverlay(true);
    } else {
      setShowListenerCrisisModal(true);
    }
  };

  const handleListenerCrisisConfirm = () => {
    setShowListenerCrisisModal(false);
    dispatch(endChatSession());
    try {
      socketService.emit('chat:end', { conversationId: id });
      apiInstance.post(`conversations/${id}/end`).catch(() => {});
    } catch { /* ignore */ }
    navigate('/listener/crisis-warning', {
      replace: true,
      state: { fromChat: true, sessionId: id },
    });
  };

  const handleVenterCrisis988 = async (mode: 'call' | 'text') => {
    setShowCrisisOverlay(false);
    dispatch(endChatSession());
    try {
      socketService.emit('chat:end', { conversationId: id });
      await apiInstance.post(`conversations/${id}/end`);
    } catch { /* ignore */ }
    window.location.href = mode === 'call' ? 'tel:988' : 'sms:988';
    setTimeout(() => navigate('/venter/home', { replace: true }), 1000);
  };

  const handleReportPress = () => {
    const otherUserId = chat?.otherParticipant?.userId || chat?.listener?.userId || chat?.conversation?.venter?.userId;
    navigate(`/${currentUser?.userType || 'venter'}/report`, {
      state: {
        chat,
        type: 'chat',
        targetUserId: otherUserId,
        conversationId: id,
      },
    });
  };

  const handleEndChatPress = () => {
    setShowEndModal(true);
  };

  const handleEndSessionNo = () => setShowEndModal(false);

  const handleEndSessionYes = async () => {
    setShowEndModal(false);
    if (!id) return;
    // Dispatch immediately so the global chat:ended handler skips the server echo
    dispatch(endChatSession());
    try {
      await socketService.connect();
      socketService.emit('chat:end', { conversationId: id });
      await apiInstance.post(`conversations/${id}/end`);
    } catch (error) {
      console.error('End chat error:', error);
    }
    if (currentUser?.userType === 'venter' || currentUser?.role === 'venter') {
      // Venter: Rating (tip) first → then Feedback
      navigate(`/venter/session/${id}/rating`, { replace: true, state: { chat, type: 'chat' } });
    } else {
      // Listener: Feedback (mood) first → then Rating (stars)
      navigate(`/listener/session/${id}/feedback`, { replace: true, state: { chat, type: 'chat' } });
    }
  };

  // Initial fetch (fallback) using the same endpoint as mobile
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await apiInstance.get(`conversations/${id}/messages`, { params: { limit: 50 } });
        if (cancelled) return;
        const initial = res.data?.messages ?? [];
        seenMessageIds.current = new Set(
          initial
            .map((m: any) => String(m?.messageId || m?.id || ''))
            .filter(Boolean),
        );
        setMessages(initial);
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // Socket: join room + real-time messages (matches mobile behavior)
  useEffect(() => {
    if (!id) return;

    let mounted = true;

    const handleJoined = (data: any) => {
      if (!mounted) return;
      if (data?.status === 'ended') {
        setIsChatActive(false);
        dispatch(endChatSession());
        return;
      }
      const history = data?.initialHistory?.messages;
      if (Array.isArray(history) && history.length > 0) {
        seenMessageIds.current = new Set(
          history
            .map((m: any) => String(m?.messageId || m?.id || ''))
            .filter(Boolean),
        );
        setMessages(history);
        setLoading(false);
      }
    };

    const handleMessage = (data: any) => {
      if (!mounted) return;
      const key = String(data?.messageId || data?.id || '');
      if (key && seenMessageIds.current.has(key)) return;
      if (key) seenMessageIds.current.add(key);
      setMessages((prev) => [...prev, data]);
    };

    const init = async () => {
      try {
        await socketService.connect();
        socketService.emit('chat:join', { conversationId: id });
      } catch {
        // ignore
      }
    };

    socketService.on('chat:joined', handleJoined);
    socketService.on('chat:message', handleMessage);
    init();

    return () => {
      mounted = false;
      socketService.off('chat:joined', handleJoined);
      socketService.off('chat:message', handleMessage);
    };
  }, [id, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || !id) return;

    const content = input.trim();
    const tempId = `tmp-${Date.now()}`;
    const optimistic = {
      messageId: tempId,
      content,
      deliveredAt: new Date().toISOString(),
      sender: { isMe: true },
      senderId: currentUser?.id,
      createdAt: new Date().toISOString(),
    };

    seenMessageIds.current.add(tempId);
    setMessages((prev) => [...prev, optimistic]);
    setInput('');
    setSending(true);

    try {
      await socketService.connect();
      console.log('[Chat] Sending message:', { conversationId: id, content });
      socketService.emit('chat:message', { conversationId: id, content });
      console.log('[Chat] Message emitted successfully');
    } catch (err) {
      console.error('[Chat] Failed to send message:', err);
    } finally {
      setSending(false);
    }
  }, [input, id, currentUser?.id]);

  const title = getOtherName();

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col w-full lg:static lg:min-h-[100dvh] lg:max-w-4xl lg:max-w-5xl lg:mx-auto animate-fade-in bg-[#0E0C15] lg:bg-transparent lg:border lg:border-white/10 lg:rounded-3xl lg:shadow-2xl lg:shadow-black/40 lg:overflow-hidden"
      style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* Mobile background layer so it matches the app */}
      <div className="lg:hidden absolute inset-0 z-0 pointer-events-none">
        <MainBackground />
      </div>

      {/* Chat Header - matching mobile ChatHeader */}
      <div className="glass overflow-visible border-b border-white/8 px-4 sm:px-5 py-3.5 pt-[max(0.875rem,env(safe-area-inset-top))] flex items-center gap-3 flex-shrink-0 z-10 relative">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl glass text-gray-400 hover:text-white transition-colors flex-shrink-0"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{title}</p>
          <p className="text-xs text-white/80">{t('VenterChat.subtitle', 'You are chatting with a listener')}</p>
        </div>

        {/* Crisis Button - only when chat is active */}
        {isChatActive && (
          <button
            onClick={() => void handleCrisisPress()}
            className="p-2 rounded-xl glass text-error hover:bg-error/20 transition-colors flex-shrink-0"
            title={t('VenterChat.crisisButton', 'Crisis Support')}
          >
            <AlertTriangle size={18} />
          </button>
        )}

        {/* Options Menu - using Popover component */}
        {isChatActive && <Popover
          trigger={
            <button className="p-2 rounded-xl glass text-gray-400 hover:text-white transition-colors flex-shrink-0">
              <MoreVertical size={18} />
            </button>
          }
          align="end"
          side="bottom"
        >
          <PopoverItem onClick={handleReportPress}>
            <div className="flex items-center gap-2">
              <Flag size={14} />
              {t('Chat.report', 'Report Chat')}
            </div>
          </PopoverItem>

          <>
            <PopoverSeparator />
            <PopoverItem onClick={handleEndChatPress} danger>
              <div className="flex items-center gap-2">
                <PhoneOff size={14} />
                {t('Chat.endSession', 'End Session')}
              </div>
            </PopoverItem>
          </>

        </Popover>}
      </div>

      {/* Messages - Keyboard avoiding layout like mobile */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 lg:py-6 space-y-4 scrollbar-hide min-h-0">
        {loading ? (
          <div className="flex items-center justify-center h-full text-white/80">
            {t('Common.loading', 'Loading messages...')}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-white/80 text-sm">
            {t('Chat.startConversation', 'Start the conversation!')}
          </div>
        ) : (
          messages.map((msg: any) => {
            const isOwn = !!msg?.sender?.isMe || msg.senderId === currentUser?.id;
            const messageKey = String(msg?.messageId || msg?.id || '');
            const ts = msg?.deliveredAt || msg?.createdAt || msg?.timestamp;
            const senderName = msg?.sender?.anonymousName;

            return (
              <div key={messageKey} className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}>
                <div className="max-w-[85%] sm:max-w-[70%] lg:max-w-[65%]">
                  {/* Sender name for incoming messages */}
                  {!isOwn && senderName && (
                    <p className="text-xs text-white/80 mb-1 ml-1">{senderName}</p>
                  )}

                  {/* Message bubble with glass styling like mobile */}
                  <GlassCard
                    padding="sm"
                    rounded="2xl"
                    className={cn(
                      'text-sm',
                      isOwn ? 'rounded-br-md bg-primary/20' : 'rounded-bl-md'
                    )}
                    style={{
                      background: isOwn
                        ? 'rgba(59, 130, 246, 0.15)'
                        : 'rgba(255, 255, 255, 0.03)',
                    }}
                  >
                    <p className="text-white leading-relaxed">{msg.content}</p>
                  </GlassCard>

                  {/* Timestamp */}
                  {ts && (
                    <p className={cn(
                      'text-xs mt-1 text-white/80',
                      isOwn ? 'text-right' : 'text-left'
                    )}>
                      {formatDateDayTime(ts)}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input - only shown when chat is active, matching mobile */}
      {isChatActive && (
        <div className="glass border-t border-white/8 px-4 sm:px-5 py-3.5 pb-[max(0.875rem,env(safe-area-inset-bottom))] flex items-end gap-3 flex-shrink-0 lg:rounded-b-3xl">
          <GlassCard
            className="flex-1"
            padding="none"
            rounded="2xl"
            style={{ background: 'rgba(255, 255, 255, 0.03)' }}
          >
            <textarea
              ref={inputRef}
              placeholder={t('VenterChat.inputPlaceholder', 'Type a message...')}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              className="w-full bg-transparent text-white placeholder-gray-500 px-4 py-3 resize-none outline-none text-sm"
              rows={1}
              style={{ minHeight: '44px', maxHeight: '120px' }}
              maxLength={500}
            />
          </GlassCard>

          <button
            onClick={sendMessage}
            disabled={!input.trim() || sending}
            className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all flex-shrink-0"
            style={{
              background: input.trim()
                ? 'rgba(59, 130, 246, 0.2)'
                : 'rgba(255, 255, 255, 0.03)',
            }}
          >
            <Send size={18} className={input.trim() ? 'text-primary' : 'text-white/80'} />
          </button>
        </div>
      )}

      {/* Venter crisis instant-help overlay */}
      {showCrisisOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="glass w-full max-w-sm rounded-3xl p-8 text-center border border-white/10">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={30} className="text-primary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              {t('Crisis.safetyTitle', 'Your safety is our priority.')}
            </h3>
            <p className="text-sm text-white/70 leading-relaxed mb-8">
              {t('Crisis.safetyMessage', 'Please contact emergency services right away.')}
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => void handleVenterCrisis988('call')}
                className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-base flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <PhoneCall size={20} />
                {t('Crisis.call988Now', 'CALL 988 NOW')}
              </button>
              <button
                onClick={() => void handleVenterCrisis988('text')}
                className="w-full py-4 rounded-2xl border border-white/20 text-white font-semibold text-base flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
              >
                <MessageSquare size={20} />
                {t('Crisis.text988', 'TEXT 988')}
              </button>
              <button
                onClick={() => setShowCrisisOverlay(false)}
                className="w-full py-3 text-white/50 text-sm hover:text-white/80 transition-colors"
              >
                {t('Crisis.backToChat', 'Back to Chat')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Listener crisis confirmation modal */}
      {showListenerCrisisModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm animate-fade-in">
          <GlassCard className="w-full max-w-sm rounded-3xl p-7 text-center">
            <h3 className="text-xl font-bold text-white mb-4">
              {t('ListenerCrisis.confirmTitle', 'Is The Venter In Crisis')}
            </h3>
            <p className="text-sm text-white/70 leading-relaxed mb-4">
              {t('ListenerCrisis.confirmMessage1', 'If the venter mentions thoughts of self harm or suicide, please escalate this session for crisis services.')}
            </p>
            <p className="text-sm text-white/70 leading-relaxed mb-8">
              {t('ListenerCrisis.confirmMessage2', 'If the venter is in crisis and you do not escalate this session you will be permanently barred from this platform.')}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowListenerCrisisModal(false)}
                className="flex-1 py-3 rounded-2xl glass text-white font-medium text-sm hover:bg-white/10 transition-colors"
              >
                {t('Common.no', 'No')}
              </button>
              <button
                onClick={handleListenerCrisisConfirm}
                className="flex-1 py-3 rounded-2xl glass text-white font-bold text-sm hover:bg-white/10 transition-colors"
              >
                {t('Common.yes', 'Yes')}
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* End Session Modal - matching mobile GlassModal */}
      {showEndModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <GlassCard className="w-full max-w-sm rounded-3xl p-6 text-center">
            <h3 className="text-xl font-bold text-white mb-2">
              {t('VenterChat.endSessionTitle', 'End Session?')}
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              {t('VenterChat.endSessionMessage', 'Are you sure you want to end this session?')}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                // variant="ghost"
                onClick={handleEndSessionNo}
              >
                {t('Common.no', 'No')}
              </Button>
              <Button
                variant="glass"
                onClick={handleEndSessionYes}
              >
                {t('Common.yes', 'Yes')}
              </Button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
