import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { GlassModal } from '../../components/ui/GlassModal';
import { useAdmin } from '../../api/hooks/useAdmin';
import { ChevronRight, FileText, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';

export const AdminListenerRequests = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getListenerRequests, reviewListenerVerification } = useAdmin();

  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState<string | null>(null);
  const [showApprovedModal, setShowApprovedModal] = useState(false);
  const [showRejectedModal, setShowRejectedModal] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      // Native app fetches 'pending' status by default
      const res = await getListenerRequests('pending');
      setRequests(res?.submissions ?? res?.requests ?? res ?? []);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || t('Common.error', 'Error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleReview = async (id: string, status: 'verified' | 'rejected') => {
    setActioning(id);
    try {
      await reviewListenerVerification(id, { 
        status, 
        adminNotes: status === 'verified' ? 'Approved from list' : 'Rejected from list' 
      });
      
      setRequests(prev => prev.filter(req => req.id !== id));
      if (status === 'verified') setShowApprovedModal(true);
      else setShowRejectedModal(true);

      setTimeout(() => {
        setShowApprovedModal(false);
        setShowRejectedModal(false);
      }, 2500);
    } catch {
      toast.error(t('Common.error', 'Update failed'));
    } finally {
      setActioning(null);
    }
  };

  return (
    <div className="page-wrapper page-wrapper--wide animate-fade-in pb-20">
      <PageHeader 
        title={t('Admin.listenerRequests.title')} 
        centered
      />

      <div className="px-1 mt-6">
        {/* List */}
        <div className="space-y-4">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="skeleton h-48 rounded-3xl" />
            ))
          ) : requests.length > 0 ? (
            requests.map((req) => (
              <GlassCard
                key={req.id}
                padding="none"
                className="overflow-hidden border-white/10"
              >
                <div 
                  onClick={() => navigate(`/admin/listener-requests/${req.id}`)}
                  className="p-5 cursor-pointer hover:bg-white/5 transition-all"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl glass flex items-center justify-center border border-white/10 text-accent">
                      <FileText size={24} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-white truncate mb-1">
                        {req.email || req.user?.email || 'Unknown User'}
                      </h3>
                      <div className="flex items-center gap-3">
                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
                          {req.user?.gender || 'N/A'} • {req.user?.ageGroup || 'N/A'}
                        </p>
                      </div>
                    </div>

                    <ChevronRight size={18} className="text-white/20" />
                  </div>

                  <div className="flex gap-3 mt-4">
                    <Button
                      variant="glass"
                      fullWidth
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReview(req.id, 'rejected');
                      }}
                      loading={actioning === req.id}
                      className="rounded-full h-11 text-[11px] font-bold uppercase tracking-widest border-white/10"
                    >
                      {t('Admin.listenerRequests.reject')}
                    </Button>
                    <Button
                      variant="primary"
                      fullWidth
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReview(req.id, 'verified');
                      }}
                      loading={actioning === req.id}
                      className="rounded-full h-11 text-[11px] font-bold uppercase tracking-widest"
                    >
                      {t('Admin.listenerRequests.approve')}
                    </Button>
                  </div>
                </div>
              </GlassCard>
            ))
          ) : (
            <div className="text-center py-20">
               <FileText className="mx-auto text-white/10 mb-4" size={48} />
               <p className="text-white/40 font-medium">{t('Admin.listenerRequests.noRequests')}</p>
            </div>
          )}
        </div>
      </div>

      <GlassModal
        isOpen={showApprovedModal}
        onClose={() => setShowApprovedModal(false)}
        icon={<CheckCircle className="text-accent" />}
        title={t('Admin.review.approved')}
        message={t('Admin.review.approvedMessage')}
        showButtons={false}
      />

      <GlassModal
        isOpen={showRejectedModal}
        onClose={() => setShowRejectedModal(false)}
        icon={<XCircle className="text-error" />}
        title={t('Admin.review.reject', 'Rejected')}
        message={t('Admin.review.rejectionDescription')}
        showButtons={false}
      />
    </div>
  );
};
