import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { useAdmin } from '../../api/hooks/useAdmin';
import { toast } from 'react-toastify';

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

export const AdminReportDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getReportDetails } = useAdmin();
  
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getReportDetails(id!);
        if (res?.report) {
          setReport(res.report);
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
    <div className="page-wrapper animate-fade-in max-w-2xl mx-auto py-4">
      <PageHeader title={t('Admin.moderation.reportDetail.title', 'Report Detail')} centered onBack={() => navigate(-1)} />
      <div className="space-y-6 mt-10">
        <div className="skeleton h-8 w-1/3 rounded-xl" />
        <div className="space-y-4">
          <div className="flex justify-between"><div className="skeleton h-5 w-1/4 rounded-lg" /><div className="skeleton h-5 w-[45%] rounded-lg" /></div>
          <div className="flex justify-between"><div className="skeleton h-5 w-1/4 rounded-lg" /><div className="skeleton h-5 w-[45%] rounded-lg" /></div>
          <div className="flex justify-between"><div className="skeleton h-5 w-1/4 rounded-lg" /><div className="skeleton h-5 w-[45%] rounded-lg" /></div>
        </div>
      </div>
    </div>
  );

  if (!report) return (
    <div className="page-wrapper py-4">
      <PageHeader title={t('Common.notFound', 'Not Found')} centered onBack={() => navigate(-1)} />
    </div>
  );

  const metadata = [
    { label: t('Admin.moderation.reportDetail.reportedBy', 'Reported By'), value: report.reporter_email || 'N/A' },
    { label: t('Admin.moderation.reportDetail.reportedTo', 'Reported To'), value: report.reported_email || 'N/A' },
    { label: t('Admin.moderation.reportDetail.issue', 'Issue'), value: report.reason || 'N/A' },
    { label: t('Admin.moderation.reportDetail.date', 'Date'), value: formatDate(report.created_at) },
    { label: t('Admin.moderation.reportDetail.service', 'Service'), value: report.sessionType || 'N/A' },
  ];

  return (
    <div className="page-wrapper animate-fade-in max-w-2xl mx-auto">
      <PageHeader
        title={t('Admin.moderation.reportDetail.title', 'Report Detail')}
        onBack={() => navigate('/admin/reports')}
        centered
      />

      <div className="space-y-6 pb-24 px-1">
        <div className="flex justify-between items-center mb-2 mt-4">
          <h2 className="text-[20px] font-bold text-white uppercase tracking-tight">
            {t('Admin.moderation.reportDetail.title', 'Report Detail')}
          </h2>
        </div>

        <div className="space-y-5">
          {metadata.map((item, index) => (
            <div key={index} className="flex justify-between items-start gap-4">
              <span className="text-[15px] font-normal text-white uppercase tracking-wider">{item.label} : </span>
              <span className="text-[15px] font-medium text-white/80 text-right w-[45%] break-all">{item.value}</span>
            </div>
          ))}
          
          <div className="pt-4">
            <span className="text-[15px] font-normal text-white uppercase tracking-wider block mb-4">
              {t('Admin.moderation.reportDetail.description', 'Description')} :
            </span>
            <p className="text-[15px] font-medium text-white/80 leading-relaxed w-full whitespace-pre-wrap">
              {report.description || 'No description provided.'}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-[30vh]">
          <Button
            variant="glass"
            fullWidth
            className="rounded-full h-14 font-bold uppercase tracking-widest text-xs"
            onClick={() => navigate(`/admin/chats/${report.sessionId || report.chatSessionId || report.id}`, { state: { headerRight: false } })}
          >
            {t('Admin.moderation.reportDetail.viewChatDetail', 'View Chat Detail')}
          </Button>
          
          {report.status !== 'resolved' && (
            <Button
              variant="primary"
              fullWidth
              className="rounded-full h-14 font-bold uppercase tracking-widest text-xs"
              onClick={() => navigate(`/admin/reports/${id}/action`, { state: { report } })}
            >
              {t('Admin.moderation.reportDetail.takeAction', 'Take Action')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
