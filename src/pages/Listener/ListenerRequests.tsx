import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import apiInstance from '../../api/apiInstance';
import { Phone, MessageSquare, Clock, User } from 'lucide-react';

export const ListenerRequests = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiInstance.get('sessions/requests')
      .then(res => setRequests(res.data?.requests ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAccept = async (requestId: string) => {
    try {
      const res = await apiInstance.post(`sessions/${requestId}/accept`);
      const roomId = res.data?.roomId || requestId;
      navigate(`/listener/call/${roomId}`);
    } catch { /* ignore */ }
  };

  const handleDecline = async (requestId: string) => {
    try {
      await apiInstance.post(`sessions/${requestId}/decline`);
      setRequests(prev => prev.filter(r => r.id !== requestId));
    } catch { /* ignore */ }
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title={t('ListenerHome.incomingRequests', 'Incoming Requests')} subtitle={t('ListenerRequests.subtitle', 'Accept or decline venter connection requests')} />

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}</div>
      ) : requests.length === 0 ? (
        <EmptyState
          title={t('ListenerHome.noRequests', 'No pending requests')}
          description={t('ListenerHome.noRequestsDesc', 'New requests will appear here when venters seek support.')}
          icon={<User size={22} />}
        />
      ) : (
        <div className="space-y-4">
          {requests.map((req: any) => (
            <GlassCard key={req.id} bordered padding="md" rounded="2xl" className="transform transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full glass flex items-center justify-center text-base font-bold text-white flex-shrink-0 shadow-inner">
                  {(req.venter?.firstName?.[0] || 'V').toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{req.venter?.displayName || 'Anonymous'}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                    {req.type === 'call' ? <Phone size={11} /> : <MessageSquare size={11} />}
                    <span className="capitalize">{req.type === 'call' ? t('ListenerHome.callSession', 'Call Session') : t('ListenerHome.chatSession', 'Chat Session')}</span>
                    <Clock size={11} className="ml-2" />
                    <span>{new Date(req.createdAt).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}</span>
                  </div>
                </div>
                <Badge variant="warning" dot>{t('ListenerRequests.pending')}</Badge>
              </div>

              {req.topic && (
                <p className="text-xs text-gray-500 bg-white/4 rounded-xl px-3 py-2 mb-4 border border-white/5">{req.topic}</p>
              )}

              <div className="flex gap-3 mt-4">
                <Button
                  variant="danger"
                  size="sm"
                  fullWidth
                  onClick={() => handleDecline(req.id)}
                >
                  {t('ListenerRequests.decline')}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  fullWidth
                  onClick={() => handleAccept(req.id)}
                >
                  {t('ListenerRequests.accept')}
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};
