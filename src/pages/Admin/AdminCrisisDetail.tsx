import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { useAdmin } from '../../api/hooks/useAdmin';
import { toast } from 'react-toastify';
import { Phone, MessageSquare, Calendar, User, Hash, Clock } from 'lucide-react';

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

export const AdminCrisisDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { getCrisisLog } = useAdmin();
  
  // Try to get log from navigation state first to avoid loading
  const [log, setLog] = useState<any>(location.state?.log || null);
  const [loading, setLoading] = useState(!location.state?.log);

  useEffect(() => {
    if (location.state?.log) return;

    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getCrisisLog({ id });
        // Since getCrisisLog usually returns a list, find the specific one or handle direct object
        const found = Array.isArray(res?.items) ? res.items.find((l: any) => l.id === id) : res;
        if (found) {
          setLog(found);
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || t('Common.error', 'Error'));
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return (
    <div className="page-wrapper animate-fade-in max-w-2xl mx-auto py-4 px-4">
      <PageHeader title={t('Admin.crisisDetail.title', 'Crisis Detail')} centered onBack={() => navigate(-1)} />
      <div className="space-y-6 mt-10">
        <div className="skeleton h-8 w-1/3 rounded-xl" />
        <div className="space-y-4 pt-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="skeleton h-5 w-1/4 rounded-lg" />
              <div className="skeleton h-5 w-[45%] rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (!log) return (
    <div className="page-wrapper py-4 px-4">
      <PageHeader title={t('Common.notFound', 'Not Found')} centered onBack={() => navigate(-1)} />
      <div className="flex flex-col items-center justify-center mt-20 opacity-40">
        <Hash size={48} className="mb-4" />
        <p className="font-medium text-white">{t('Admin.crisisDetail.noLog', 'Crisis event not found.')}</p>
      </div>
    </div>
  );

  const metadata = [
    { label: t('Admin.crisisDetail.fields.id', 'Event ID'), value: log.id || 'N/A' },
    { label: t('Admin.crisisDetail.fields.initiator', 'Call By / Chat By'), value: log.email || 'N/A' },
    { label: t('Admin.crisisDetail.fields.type', 'Event Type'), value: log.type === 'call' ? t('Admin.crisisManagement.crisisCall', 'Crisis Session') : t('Admin.crisisManagement.crisisChat', 'Crisis Chat') },
    { label: t('Admin.crisisDetail.fields.date', 'Date'), value: log.date || formatDate(log.createdAt) },
    { label: t('Admin.crisisDetail.fields.sessionId', 'Session ID'), value: log.sessionId || 'N/A' },
  ];

  return (
    <div className="page-wrapper animate-fade-in max-w-2xl mx-auto py-4 px-6">
      <PageHeader
        title={t('Admin.crisisDetail.title', 'Crisis Detail')}
        onBack={() => navigate('/admin/crisis')}
        centered
      />

      <div className="space-y-8 pb-32">
        <div className="mb-8">
          <h2 className="text-[20px] font-bold text-white tracking-tight uppercase">
            {t('Admin.crisisDetail.title', 'Crisis Detail')}
          </h2>
        </div>

        <div className="space-y-5">
          {metadata.map((item, index) => (
            <div key={index} className="flex justify-between items-start gap-4">
              <span className="text-[15px] font-normal text-white uppercase tracking-wider">{item.label} : </span>
              <span className="text-[15px] font-medium text-white/80 text-right w-[45%] break-all">
                {item.value}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 mt-[30vh]">
          {log.type === 'chat' && log.sessionId && (
            <Button
              variant="glass"
              fullWidth
              className="rounded-full h-14 font-bold uppercase tracking-widest text-xs"
              onClick={() => navigate(`/admin/chats/${log.sessionId}`)}
            >
              {t('Admin.moderation.reportDetail.viewChatDetail', 'View Chat Detail')}
            </Button>
          )}
          
          <Button
            variant="glass"
            fullWidth
            className="rounded-full h-14 font-bold uppercase tracking-widest text-xs"
            onClick={() => navigate(-1)}
          >
            {t('Common.back', 'Go Back')}
          </Button>
        </div>
      </div>
    </div>
  );
};
