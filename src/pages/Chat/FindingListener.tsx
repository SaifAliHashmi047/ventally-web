import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { X, Phone, MessageSquare, Wallet } from 'lucide-react';
import socketService from '../../api/socketService';
import { useWallet } from '../../api/hooks/useWallet';
import { sessionStarted, chatSessionStarted, setSessionType } from '../../store/slices/callSlice';
import { setSessionInfo } from '../../store/slices/sessionSlice';

export const FindingListener = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const type = (location.state?.type || 'call') as 'call' | 'chat';
  const { getWallet } = useWallet();

  const [status, setStatus] = useState<'searching' | 'found' | 'timeout' | 'lowBalance'>('searching');
  const [dots, setDots] = useState('');
  const [timerKey, setTimerKey] = useState(0);
  const hasNavigated = useRef(false);

  const isCall = type === 'call';
  const isChat = type === 'chat';

  // Animated dots
  useEffect(() => {
    const interval = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500);
    return () => clearInterval(interval);
  }, []);

  // Check balance and broadcast request
  useEffect(() => {
    const init = async () => {
      try {
        const balanceRes = await getWallet();
        const hasBalance = balanceRes?.balance?.currency > 0 || balanceRes?.balance?.minutes > 0;

        if (!hasBalance) {
          setStatus('lowBalance');
          return;
        }

        // Store session type in Redux
        dispatch(setSessionType(type));

        // Connect socket and broadcast request
        await socketService.connect();
        socketService.emit('requests:broadcast', { type });
        console.log('[FindingListener] Broadcasted request:', type);
      } catch (error) {
        console.error('[FindingListener] Init error:', error);
      }
    };

    init();

    // Cleanup: cancel request if unmounting without match
    return () => {
      if (!hasNavigated.current && status === 'searching') {
        socketService.emit('requests:cancel', { type });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, timerKey]);

  // Listen for socket events
  useEffect(() => {
    // Insufficient balance event
    socketService.on('requests:broadcast:insufficient-balance', () => {
      console.log('[FindingListener] Insufficient balance');
      setStatus('lowBalance');
    });

    interface AcceptedData {
      id?: string;
      callId?: string;
      venterId?: string;
      listenerId?: string;
      token?: string;
      channelName?: string;
    }

    // Call accepted
    socketService.on('call:accepted', (data: AcceptedData) => {
      console.log('[FindingListener] Call accepted:', data);
      if (hasNavigated.current) return;

      dispatch(sessionStarted({ sessionId: data.id || data.callId }));
      dispatch(setSessionInfo({
        sessionId: data.id || data.callId || null,
        requestId: data.id || data.callId || null,
        venterId: data.venterId || null,
        listenerId: data.listenerId || null,
        sessionType: 'call',
        data,
      }));

      hasNavigated.current = true;
      navigate('/venter/call/active', {
        state: {
          call: {
            ...data,
            token: data?.token,
            channelName: data?.channelName,
            roomName: data?.channelName,
            uid: 0,
          },
        },
      });
    });

    interface ChatAcceptedData {
      conversationId?: string;
      conversation?: { id?: string; venterId?: string };
      listenerId?: string;
      listener?: { id?: string };
    }

    // Chat accepted
    socketService.on('chat:accepted', (data: ChatAcceptedData) => {
      console.log('[FindingListener] Chat accepted:', data);
      if (hasNavigated.current) return;

      dispatch(chatSessionStarted({
        chatData: data,
        chatStartTime: Date.now(),
        conversationId: data.conversationId || data.conversation?.id,
      }));
      dispatch(setSessionInfo({
        sessionId: data.conversationId || data.conversation?.id || null,
        requestId: data.conversationId || data.conversation?.id || null,
        venterId: data.conversation?.venterId || null,
        listenerId: data.listenerId || data.listener?.id || null,
        sessionType: 'chat',
        data,
      }));

      hasNavigated.current = true;
      const conversationId = data.conversationId || data.conversation?.id;
      navigate(`/venter/chat/${conversationId}`, { replace: true, state: { chat: data } });
    });

    return () => {
      socketService.off('requests:broadcast:insufficient-balance');
      socketService.off('call:accepted');
      socketService.off('chat:accepted');
    };
  }, [dispatch, navigate]);

  // 60-second timeout
  useEffect(() => {
    if (status !== 'searching') return;

    const timeout = setTimeout(() => {
      setStatus('timeout');
    }, 60000);

    return () => clearTimeout(timeout);
  }, [status, timerKey]);

  const handleCancel = useCallback(() => {
    socketService.emit('requests:cancel', { type });
    navigate(-1);
  }, [type, navigate]);

  const handleRetry = useCallback(() => {
    setStatus('searching');
    setTimerKey(prev => prev + 1); // Reset timer
  }, []);

  const handleAddFunds = useCallback(() => {
    navigate('/venter/wallet');
  }, [navigate]);

  const icon = isCall ? <Phone size={32} className="text-accent" /> : <MessageSquare size={32} className="text-accent" />;
  const title = isCall
    ? t('VenterFindingListener.title', 'Finding a Listener')
    : t('VenterFindingListener.chatTitle', 'Finding a Chat Listener');
  const chatTitle = t('VenterFindingListener.chatTitle', 'Finding a Chat Listener');

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-sm w-full animate-fade-in">
        {/* Animated Ring */}
        <div className="relative w-36 h-36 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border-2 border-accent/20 animate-ping" />
          <div className="absolute inset-4 rounded-full border-2 border-accent/30 animate-ping" style={{ animationDelay: '0.3s' }} />
          <div className="absolute inset-8 rounded-full border-2 border-accent/40 animate-ping" style={{ animationDelay: '0.6s' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full glass-accent flex items-center justify-center">
              {icon}
            </div>
          </div>
        </div>

        {status === 'searching' && (
          <>
            <h1 className="text-xl font-bold text-white mb-2">{isChat ? chatTitle : title}{dots}</h1>
            <p className="text-gray-500 mb-8">
              {t('VenterFindingListener.description', "We're connecting you with an available listener for your {{type}} session.", { type })}
            </p>
            <Button variant="glass" onClick={handleCancel} leftIcon={<X size={16} />}>
              {t('VenterFindingListener.buttonText', 'Cancel')}
            </Button>
          </>
        )}

        {status === 'timeout' && (
          <>
            <h1 className="text-xl font-bold text-white mb-2">
              {t('VenterFindingListener.timeoutTitle', 'No Match Found')}
            </h1>
            <p className="text-gray-500 mb-8">
              {t('VenterFindingListener.timeoutMessage', "We couldn't find an available listener at this moment. Would you like to try again?")}
            </p>
            <div className="space-y-3">
              <Button variant="primary" fullWidth onClick={handleRetry}>
                {t('Common.retry', 'Retry')}
              </Button>
              <Button variant="glass" fullWidth onClick={() => navigate(-1)}>
                {t('Common.cancel', 'Cancel')}
              </Button>
            </div>
          </>
        )}

        {status === 'lowBalance' && (
          <>
            <div className="w-20 h-20 rounded-full glass-accent flex items-center justify-center mx-auto mb-6">
              <Wallet size={32} className="text-warning" />
            </div>
            <h1 className="text-xl font-bold text-white mb-2">
              {t('VenterPaymentCheck.insufficientTitle', 'Insufficient Balance')}
            </h1>
            <p className="text-gray-500 mb-8">
              {t('VenterPaymentCheck.insufficientMessage', 'You need to add funds to start a session.')}
            </p>
            <div className="space-y-3">
              <Button variant="primary" fullWidth onClick={handleAddFunds} leftIcon={<Wallet size={16} />}>
                {t('VenterPaymentCheck.addFunds', 'Add Funds')}
              </Button>
              <Button variant="glass" fullWidth onClick={() => navigate(-1)}>
                {t('VenterFindingListener.buttonText', 'Go Back')}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
