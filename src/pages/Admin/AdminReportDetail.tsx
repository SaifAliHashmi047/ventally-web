import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useAdmin } from '../../api/hooks/useAdmin';
import { Flag, User, MessageSquare, Gavel, CheckCircle, XCircle } from 'lucide-react';

export const AdminReportDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getReportDetail, takeAction } = useAdmin();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionModal, setActionModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getReportDetail(id!);
        setReport(res?.report ?? null);
      } catch { /* ignore */ } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleAction = async () => {
    if (!selectedAction || !id) return;
    setSubmitting(true);
    try {
      await takeAction(id, selectedAction, notes);
      navigate('/admin/reports');
    } catch { /* ignore */ } finally {
      setSubmitting(false);
    }
  };

  const ACTIONS = ['warn_user', 'suspend_user', 'ban_user', 'dismiss_report', 'resolve'];

  if (loading) return <div className="space-y-4"><div className="skeleton h-10 w-48 rounded-2xl" /><div className="skeleton h-64 rounded-3xl" /></div>;
  if (!report) return <div className="page-wrapper"><PageHeader title="Not Found" onBack={() => navigate(-1)} /></div>;

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title="Report Detail" onBack={() => navigate('/admin/reports')} />

      <GlassCard bordered>
        <div className="flex items-start gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl glass flex items-center justify-center text-error">
            <Flag size={18} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{report.reason}</h2>
            <p className="text-sm text-gray-500">#{report.id?.slice(0, 8)}</p>
          </div>
          <Badge variant={report.status === 'resolved' ? 'success' : report.status === 'open' ? 'error' : 'default'} dot className="ml-auto">
            {report.status}
          </Badge>
        </div>

        {report.details && (
          <div className="bg-white/3 rounded-2xl p-4 mb-4">
            <p className="text-xs text-gray-500 mb-1">Report Details</p>
            <p className="text-sm text-white">{report.details}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><User size={11} /> Reported By</p>
            <p className="text-sm font-medium text-white">{report.reporter?.displayName || report.reporter?.email || 'Unknown'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><User size={11} /> Reported User</p>
            <p className="text-sm font-medium text-white">{report.reportedUser?.displayName || report.reportedUser?.email || 'Unknown'}</p>
          </div>
        </div>
      </GlassCard>

      {/* View Chat */}
      {report.chatSessionId && (
        <Button variant="glass" fullWidth leftIcon={<MessageSquare size={16} />} onClick={() => navigate(`/admin/chat/${report.chatSessionId}`)}>
          View Chat Transcript
        </Button>
      )}

      {/* Actions */}
      {report.status === 'open' && (
        <Button variant="primary" fullWidth leftIcon={<Gavel size={16} />} onClick={() => setActionModal(true)}>
          Take Action
        </Button>
      )}

      <Modal isOpen={actionModal} onClose={() => setActionModal(false)} title="Take Action" size="sm">
        <div className="space-y-3 mb-4">
          {ACTIONS.map(a => (
            <button
              key={a}
              onClick={() => setSelectedAction(a)}
              className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-medium capitalize transition-all ${
                selectedAction === a ? 'bg-primary/15 text-primary border border-primary/25' : 'glass text-gray-300 hover:bg-white/5'
              }`}
            >
              {a.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
        <textarea
          placeholder="Notes (optional)..."
          value={notes}
          onChange={e => setNotes(e.target.value)}
          className="input-field w-full h-20 resize-none mb-4"
        />
        <div className="flex gap-3">
          <Button variant="glass" fullWidth onClick={() => setActionModal(false)}>Cancel</Button>
          <Button variant="primary" fullWidth loading={submitting} disabled={!selectedAction} onClick={handleAction}>
            Confirm Action
          </Button>
        </div>
      </Modal>
    </div>
  );
};
