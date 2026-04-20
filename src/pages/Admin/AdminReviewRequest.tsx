import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAdmin } from '../../api/hooks/useAdmin';
import { FileText, User, Mail, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

export const AdminReviewRequest = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getListenerVerificationDetail, reviewListenerVerification } = useAdmin();

  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await getListenerVerificationDetail(id!);
        setRequest(res?.verification ?? res);
      } catch {
        toast.error('Failed to load request details');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleAction = async (status: 'verified' | 'rejected') => {
    setActioning(true);
    try {
      await reviewListenerVerification(id!, { status, adminNotes: notes });
      toast.success(`Request ${status} successfully`);
      navigate('/admin/listener-requests');
    } catch {
      toast.error(`Failed to ${status === 'verified' ? 'approve' : 'reject'} request`);
    } finally {
      setActioning(false);
    }
  };

  if (loading) return (
    <div className="page-wrapper animate-fade-in max-w-2xl mx-auto space-y-4">
      <div className="skeleton h-10 w-48 rounded-2xl" />
      <div className="skeleton h-64 rounded-3xl" />
      <div className="skeleton h-32 rounded-3xl" />
    </div>
  );

  if (!request) return (
    <div className="page-wrapper max-w-2xl mx-auto">
      <PageHeader title="Request Not Found" onBack={() => navigate(-1)} />
    </div>
  );

  return (
    <div className="page-wrapper animate-fade-in max-w-2xl mx-auto">
      <PageHeader title="Review Request" onBack={() => navigate(-1)} />

      <div className="space-y-6 pb-24">
        {/* User Profile Card */}
        <GlassCard className="border-white/5 bg-black/10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full glass flex items-center justify-center text-2xl font-bold text-white border border-white/10">
              {(request.user?.email?.[0] || 'L').toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-0.5">{request.user?.displayName || 'Listener Candidate'}</h2>
              <p className="text-sm text-white/50">{request.user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-wider text-white/30">Applied On</p>
              <p className="text-sm font-medium text-white">{new Date(request.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-wider text-white/30">Status</p>
              <Badge variant="warning" className="capitalize px-3 py-0.5 rounded-full text-[10px] font-bold">
                {request.status || 'Pending'}
              </Badge>
            </div>
          </div>
        </GlassCard>

        {/* Verification Details */}
        <GlassCard bordered className="border-white/5 overflow-hidden" padding="none">
           <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
            <FileText size={16} className="text-accent" />
            <span className="text-sm font-bold text-white">Application Details</span>
          </div>
          <div className="p-5 space-y-6">
            <div>
              <p className="text-xs font-bold text-white/40 mb-2 uppercase tracking-wide">Motivation</p>
              <p className="text-sm text-white/80 leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">
                {request.motivation || 'No motivation provided.'}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-white/40 mb-2 uppercase tracking-wide">Experience</p>
              <p className="text-sm text-white/80 leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">
                {request.experience || 'No experience details provided.'}
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Review Action */}
        <div className="space-y-4">
          <div className="space-y-2 px-1">
            <label className="text-xs font-bold text-white/40 uppercase tracking-wide ml-1">Admin Notes (Internal)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add review feedback or reason for rejection..."
              className="w-full bg-white/5 border border-white/10 rounded-3xl p-4 text-sm text-white outline-none focus:border-accent min-h-[100px] transition-all"
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant="danger"
              fullWidth
              onClick={() => handleAction('rejected')}
              loading={actioning}
              leftIcon={<XCircle size={18} />}
              className="rounded-full h-12"
            >
              Reject
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={() => handleAction('verified')}
              loading={actioning}
              leftIcon={<CheckCircle size={18} />}
              className="rounded-full h-12"
            >
              Approve
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
