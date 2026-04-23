import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { removeRequest } from '../../store/slices/listenerSlice';
import { sessionStarted, chatSessionStarted } from '../../store/slices/callSlice';
import { setSessionInfo } from '../../store/slices/sessionSlice';
import type { RootState } from '../../store/store';
import apiInstance from '../../api/apiInstance';
import { toastError } from '../../utils/toast';
import { Phone, MessageSquare, User } from 'lucide-react';

export const ListenerRequests = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Get requests from Redux store (populated by socket)
  const requests = useSelector((state: RootState) => state.listener.requests);

  const handleAccept = async (req: (typeof requests)[number]) => {
    try {
      if (req.type === 'call') {
        const res = await apiInstance.post(`calls/${req.id}/accept`);
        const call = res.data?.call ?? res.data;
        const roomId = call?.channelName || res.data?.roomId || req.requestId || req.id;

        dispatch(removeRequest(req.id));
        dispatch(sessionStarted({ sessionId: req.requestId ?? req.id }));
        dispatch(
          setSessionInfo({
            sessionId: req.requestId ?? req.id ?? null,
            requestId: req.requestId ?? null,
            venterId: req.venterId ?? null,
            listenerId: req.listenerId ?? null,
            sessionType: 'call',
            data: { ...req, ...res.data },
          }),
        );

        navigate(`/listener/call/${roomId}`, {
          state: {
            call: {
              ...call,
              token: call?.token,
              channelName: call?.channelName,
              roomName: call?.channelName,
              uid: 1,
            },
          },
        });
        return;
      }

      // Chat request
      const res = await apiInstance.post(`conversations/${req.id}/accept`);
      const chatData = res.data;
      const conversationId =
        chatData?.conversationId || chatData?.conversation?.id || chatData?.id || req.requestId || req.id;

      dispatch(chatSessionStarted({ chatData, chatStartTime: Date.now(), conversationId }));
      dispatch(
        setSessionInfo({
          sessionId: req.requestId ?? conversationId ?? null,
          requestId: req.requestId ?? null,
          venterId: req.venterId ?? chatData?.conversation?.venterId ?? null,
          listenerId: req.listenerId ?? chatData?.listenerId ?? chatData?.listener?.id ?? null,
          sessionType: 'chat',
          data: chatData,
        }),
      );
      dispatch(removeRequest(req.id));

      navigate(`/listener/chat/${conversationId}`, { state: { chat: chatData } });
    } catch (e: any) {
      toastError(e?.error || t('Common.somethingWentWrong'));
    }
  };

  const handleDecline = async (req: (typeof requests)[number]) => {
    try {
      if (req.type === 'call') {
        await apiInstance.post(`calls/${req.id}/decline`);
      } else {
        await apiInstance.post(`conversations/${req.id}/decline`);
      }
      dispatch(removeRequest(req.id));
    } catch (e: any) {
      toastError(e?.error || t('Common.somethingWentWrong'));
    }
  };

  return (
    <div className="page-wrapper page-wrapper--wide animate-fade-in">
      <PageHeader title={t('ListenerHome.incomingRequests', 'Incoming Requests')} subtitle={t('ListenerRequests.subtitle', 'Accept or decline venter connection requests')} />

      {requests.length === 0 ? (
        <EmptyState
          title={t('ListenerHome.noRequests', 'No pending requests')}
          description={t('ListenerHome.noRequestsDesc', 'New requests will appear here when venters seek support.')}
          icon={<User size={22} />}
        />
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <GlassCard key={req.id} bordered padding="md" rounded="2xl" className="transform transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full glass flex items-center justify-center text-base font-bold text-white flex-shrink-0 shadow-inner">
                  {(req.title?.[0] || 'V').toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{req.title || 'Anonymous'}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                    {req.type === 'call' ? <Phone size={11} /> : <MessageSquare size={11} />}
                    <span className="capitalize">{req.type === 'call' ? t('ListenerHome.callSession', 'Call Session') : t('ListenerHome.chatSession', 'Chat Session')}</span>
                  </div>
                </div>
                <Badge variant="warning" dot>{t('Admin.status.pending', 'Pending')}</Badge>
              </div>


              <div className="flex gap-3 mt-4">
                <Button
                  variant="danger"
                  size="sm"
                  fullWidth
                  onClick={() => handleDecline(req)}
                >
                  {t('Common.decline', 'Cancel')}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  fullWidth
                  onClick={() => handleAccept(req)}
                >
                  {t('Common.accept', 'Begin Session')}
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};
