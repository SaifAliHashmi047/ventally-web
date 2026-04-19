import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import type { RootState, AppDispatch } from '../../store/store';
import apiInstance from '../../api/apiInstance';
import socketService from '../../api/socketService';
import { Send, Flag, MoreVertical, AlertTriangle, ChevronLeft, PhoneOff } from 'lucide-react';
import { cn } from '../../utils/cn';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Popover, PopoverItem, PopoverSeparator } from '../../components/ui/Popover';
import { endChatSession } from '../../store/slices/callSlice';

// Format date like mobile app
const formatDateDayTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
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
      // Venter goes to warning screen with acknowledgment flow
      navigate('/venter/crisis-warning', { state: { fromChat: true } });
    } else {
      // Listener goes to 988 escalation screen
      navigate('/listener/crisis-escalation', { state: { fromChat: true } });
    }
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
    try {
      // Emit socket event to end chat for real-time notification to other party
      await socketService.connect();
      socketService.emit('chat:end', { conversationId: id });
      // Also call REST API
      await apiInstance.post(`conversations/${id}/end`);
      dispatch(endChatSession());
    } catch (error) {
      console.error('End chat error:', error);
    }
    if (currentUser?.userType === 'venter' || currentUser?.role === 'venter') {
      navigate(`/venter/session/${id}/feedback`, { replace: true, state: { chat, type: 'chat' } });
    } else {
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

    const handleChatEnded = (data: any) => {
      console.log('[Chat] Chat ended:', data);
      setIsChatActive(false);
      dispatch(endChatSession());
      // Navigate to feedback after session ends
      if (currentUser?.userType === 'venter' || currentUser?.role === 'venter') {
        navigate(`/venter/session/${id}/feedback`, { state: { chat, type: 'chat' } });
      } else {
        navigate(`/listener/session/${id}/feedback`);
      }
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
    socketService.on('chat:ended', handleChatEnded);
    init();

    return () => {
      mounted = false;
      socketService.off('chat:joined', handleJoined);
      socketService.off('chat:message', handleMessage);
      socketService.off('chat:ended', handleChatEnded);
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
    <div className="flex flex-col h-screen animate-fade-in bg-bg-deep">
      {/* Chat Header - matching mobile ChatHeader */}
      <div className="glass border-b border-white/8 px-4 py-3 flex items-center gap-3 flex-shrink-0 z-10">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 rounded-xl glass text-gray-400 hover:text-white transition-colors flex-shrink-0"
        >
          <ChevronLeft size={20} />
        </button>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{title}</p>
          <p className="text-xs text-gray-500">{t('VenterChat.subtitle', 'You are chatting with a listener')}</p>
        </div>

        {/* Crisis Button - only when chat is active */}
        {isChatActive && (
          <button 
            onClick={handleCrisisPress}
            className="p-2 rounded-xl glass text-error hover:bg-error/20 transition-colors flex-shrink-0"
            title={t('VenterChat.crisisButton', 'Crisis Support')}
          >
            <AlertTriangle size={18} />
          </button>
        )}

        {/* Options Menu - using Popover component */}
        <Popover
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
          {isChatActive && (
            <>
              <PopoverSeparator />
              <PopoverItem onClick={handleEndChatPress} danger>
                <div className="flex items-center gap-2">
                  <PhoneOff size={14} />
                  {t('Chat.endSession', 'End Session')}
                </div>
              </PopoverItem>
            </>
          )}
        </Popover>
      </div>

      {/* Messages - Keyboard avoiding layout like mobile */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-hide">
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            {t('Common.loading', 'Loading messages...')}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
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
                <div className="max-w-[75%] sm:max-w-[60%]">
                  {/* Sender name for incoming messages */}
                  {!isOwn && senderName && (
                    <p className="text-xs text-gray-500 mb-1 ml-1">{senderName}</p>
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
                      'text-xs mt-1 text-gray-500',
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
        <div className="glass border-t border-white/8 px-4 py-3 flex items-end gap-3 flex-shrink-0">
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
            <Send size={18} className={input.trim() ? 'text-primary' : 'text-gray-500'} />
          </button>
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
                variant="ghost"
                onClick={handleEndSessionNo}
              >
                {t('Common.no', 'No')}
              </Button>
              <Button 
                variant="danger"
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
