import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useAdmin } from '../../api/hooks/useAdmin';
import { CheckCircle, XCircle, User, Mail, Phone, Calendar } from 'lucide-react';

export const AdminReviewRequest = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getListenerRequests, reviewListenerRequest } = useAdmin();
  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionModal, setActionModal] = useState<'approve' | 'reject' | null>(null);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // In a real app, we'd have getListenerRequestById, but using list and filtering
    const fetch = async () => {
      try {
        const res = await getListenerRequests();
        const found = (res?.requests ?? []).find((r: any) => r.id === id);
        setRequest(found);
      } catch { /* ignore */ } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleAction = async () => {
    if (!actionModal || !id) return;
    setSubmitting(true);
    try {
      await reviewListenerRequest(id, actionModal, notes || undefined);
      navigate('/admin/listener-requests');
    } catch { /* ignore */ } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="space-y-4 animate-fade-in">
      <div className="skeleton h-10 w-64 rounded-2xl" />
      <div className="skeleton h-48 rounded-3xl" />
    </div>
  );

  if (!request) return (
    <div className="page-wrapper">
      <PageHeader title="Request Not Found" onBack={() => navigate(-1)} />
    </div>
  );

  const { user } = request;

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title="Review Application" onBack={() => navigate('/admin/listener-requests')} />

      {/* Applicant Info */}
      <GlassCard bordered>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full glass flex items-center justify-center text-2xl font-bold text-white">
            {(user?.firstName?.[0] || 'L').toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user?.displayName || `${user?.firstName} ${user?.lastName}`}</h2>
            <Badge
              variant={request.status === 'approved' ? 'success' : request.status === 'rejected' ? 'error' : 'warning'}
              dot
              className="mt-1"
            >
              {request.status}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: Mail, label: 'Email', value: user?.email },
            { icon: Phone, label: 'Phone', value: user?.phone || 'Not provided' },
            { icon: Calendar, label: 'Submitted', value: new Date(request.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' }) },
            { icon: User, label: 'Bio', value: user?.bio || 'No bio provided' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl glass flex items-center justify-center text-gray-400 flex-shrink-0 mt-0.5">
                <Icon size={14} />
              </div>
              <div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-sm text-white font-medium mt-0.5">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Documents Section (if applicable) */}
      {request.documents?.length > 0 && (
        <GlassCard>
          <h3 className="text-base font-semibold text-white mb-4">Submitted Documents</h3>
          <div className="space-y-2">
            {request.documents.map((doc: any, i: number) => (
              <a
                key={i}
                href={doc.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 px-4 py-3 glass rounded-2xl hover:bg-white/6 transition-colors"
              >
                <span className="text-sm text-primary font-medium">{doc.name || `Document ${i + 1}`}</span>
              </a>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Actions */}
      {request.status === 'pending' && (
        <div className="flex gap-3">
          <Button
            variant="danger"
            size="lg"
            leftIcon={<XCircle size={18} />}
            onClick={() => setActionModal('reject')}
          >
            Reject
          </Button>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            leftIcon={<CheckCircle size={18} />}
            onClick={() => setActionModal('approve')}
          >
            Approve Application
          </Button>
        </div>
      )}

      {/* Confirm Modal */}
      <Modal
        isOpen={!!actionModal}
        onClose={() => setActionModal(null)}
        title={actionModal === 'approve' ? 'Approve Application' : 'Reject Application'}
        size="sm"
      >
        <p className="text-sm text-gray-400 mb-4">
          {actionModal === 'approve'
            ? 'This will grant this user listener access to the platform.'
            : 'This will reject the listener application.'}
        </p>
        <textarea
          placeholder="Add notes (optional)..."
          value={notes}
          onChange={e => setNotes(e.target.value)}
          className="input-field w-full h-24 resize-none mb-4"
        />
        <div className="flex gap-3">
          <Button variant="glass" fullWidth onClick={() => setActionModal(null)}>Cancel</Button>
          <Button
            variant={actionModal === 'approve' ? 'primary' : 'danger'}
            fullWidth
            loading={submitting}
            onClick={handleAction}
          >
            Confirm {actionModal === 'approve' ? 'Approval' : 'Rejection'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};
