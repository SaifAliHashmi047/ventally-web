import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAdmin } from '../../api/hooks/useAdmin';
import { FileText, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { GlassModal } from '../../components/ui/GlassModal';

export const AdminReviewRequest = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getListenerVerificationDetail, reviewListenerVerification } = useAdmin();

  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState(false);
  const [showApprovedModal, setShowApprovedModal] = useState(false);
  const [showRejectedModal, setShowRejectedModal] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await getListenerVerificationDetail(id!);
        setRequest(res?.submission ?? res?.verification ?? res);
      } catch {
        toast.error(t('Common.error', 'Error loading request'));
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleAction = async (status: 'verified' | 'rejected') => {
    setActioning(true);
    try {
      await reviewListenerVerification(id!, { 
        status, 
        adminNotes: status === 'verified' ? 'Approved by admin' : 'Rejected by admin' 
      });
      
      if (status === 'verified') setShowApprovedModal(true);
      else setShowRejectedModal(true);

      setTimeout(() => {
        navigate('/admin/listener-requests');
      }, 2500);
    } catch {
      toast.error(t('Common.error', 'Update failed'));
    } finally {
      setActioning(false);
    }
  };

  if (loading) return (
    <div className="page-wrapper animate-fade-in max-w-2xl mx-auto space-y-4">
      <div className="skeleton h-10 w-48 rounded-2xl mx-auto" />
      <div className="skeleton h-24 rounded-3xl" />
      <div className="skeleton h-60 rounded-3xl" />
    </div>
  );

  if (!request) return (
    <div className="page-wrapper max-w-2xl mx-auto">
      <PageHeader title={t('Common.notFound', 'Not Found')} centered onBack={() => navigate(-1)} />
    </div>
  );

  const dateStr = request.createdAt || request.created_at;
  const genderVal = request.user?.preferences?.genderIdentity || request.user?.gender || 'N/A';

  const listenerInfo = [
    { label: t('EditProfile.gender', 'Gender'), value: genderVal },
    { label: t('Admin.subAdminProfile.email', 'Email'), value: request.user?.email || request.listener_email || 'N/A' },
    { label: t('Common.createdAt', 'Joined'), value: dateStr ? new Date(dateStr).toLocaleDateString() : 'N/A' },
  ];

  return (
    <div className="page-wrapper animate-fade-in max-w-2xl mx-auto">
      <PageHeader 
        title={t('Admin.review.title', 'Review')} 
        onBack={() => navigate(-1)}
        centered
      />

      <div className="space-y-8 pb-24 px-1">
        {/* Header Summary */}
        <div className="flex items-center gap-5 mt-4 mb-2">
          <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center text-accent p-0.5 border border-white/10">
             <div className="w-full h-full rounded-[14px] bg-accent/10 flex items-center justify-center">
                <FileText size={28} />
             </div>
          </div>
          <div>
            <h2 className="text-[18px] font-bold text-white mb-0.5">
              {request.user?.email || request.listener_email}
            </h2>
            <p className="text-[14px] text-white/50 font-medium">
              {request.user?.gender || 'N/A'} • {request.user?.ageGroup || 'N/A'}
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white uppercase tracking-wider">
            {t('Admin.userDetail.listenerInfo', 'Support Guide Info')}
          </h3>
          <div className="space-y-4">
            {listenerInfo.map((info, index) => (
              <div key={index} className="flex justify-between items-start gap-4">
                <span className="text-[15px] font-normal text-white uppercase tracking-wider">{info.label} : </span>
                <span className="text-[15px] font-medium text-white/80 text-right w-[45%] break-all">{info.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Documents */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white uppercase tracking-wider">
            {t('Admin.review.verificationDocs', 'Verification Documents')}
          </h3>
          {request.fileUrl || request.document_url ? (
            <GlassCard 
              onClick={() => window.open(request.fileUrl || request.document_url, '_blank')}
              className="flex items-center justify-between p-4 border-white/10 hover:bg-white/5 cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-accent">
                  <FileText size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white truncate">
                    {request.original_file_name || 'Verification Document'}
                  </p>
                  <p className="text-[11px] text-white/40">
                    {request.file_size_bytes ? `${Math.round(request.file_size_bytes / 1024)} KB` : ''}
                  </p>
                </div>
              </div>
              <Badge variant="default" className="uppercase text-[9px] font-bold">
                {t('Admin.listenerRequests.review', 'Review')}
              </Badge>
            </GlassCard>
          ) : (
            <p className="text-white/40 font-medium">{t('Common.noResults', 'No documents found.')}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-10">
          <Button
            variant="glass"
            fullWidth
            onClick={() => handleAction('rejected')}
            loading={actioning}
            className="rounded-full h-14 font-bold uppercase tracking-widest text-xs border-white/10"
          >
            {t('Admin.listenerRequests.reject', 'Reject')}
          </Button>
          <Button
            variant="primary"
            fullWidth
            onClick={() => handleAction('verified')}
            loading={actioning}
            className="rounded-full h-14 font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/20"
          >
            {t('Admin.listenerRequests.approve', 'Approve')}
          </Button>
        </div>
      </div>

      <GlassModal
        isOpen={showApprovedModal}
        onClose={() => setShowApprovedModal(false)}
        icon={<CheckCircle className="text-primary" />}
        title={t('Admin.review.approved', 'Approved')}
        message={t('Admin.review.approvedMessage', 'You approved the Support Guide verification request')}
        showButtons={false}
      />

      <GlassModal
        isOpen={showRejectedModal}
        onClose={() => setShowRejectedModal(false)}
        icon={<XCircle className="text-white" />}
        title={t('Admin.listenerRequests.reject', 'Rejected')}
        message={t('Admin.review.rejectionDescription', 'You rejected the Support Guide verification request')}
        showButtons={false}
      />
    </div>
  );
};
