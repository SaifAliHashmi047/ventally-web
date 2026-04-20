import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useAdmin } from '../../api/hooks/useAdmin';
import {
  Mail, Calendar, Shield, Ban, CheckCircle, ChevronDown,
  ChevronUp, FileText, Download, Loader2
} from 'lucide-react';

const formatDate = (s: string) => {
  if (!s) return 'N/A';
  const d = new Date(s);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

const formatBytes = (bytes: number) => {
  if (!bytes) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

const formatNumber = (n?: number) =>
  n === undefined ? '0' : n.toLocaleString();

export const AdminUserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { adminGetUserDetail, toggleUserStatus, exportIntegrationsPDF } = useAdmin();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionModal, setActionModal] = useState<string | null>(null);
  const [acting, setActing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [listenerExpanded, setListenerExpanded] = useState(false);

  useEffect(() => {
    adminGetUserDetail(id!)
      .then((res: any) => setUser(res?.user ?? null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleAction = async (action: 'suspend' | 'activate' | 'ban') => {
    setActing(true);
    try {
      await toggleUserStatus(id!, action);
      setUser((prev: any) => ({ ...prev, isActive: action === 'activate' }));
      setActionModal(null);
    } catch { /* ignore */ } finally {
      setActing(false);
    }
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const blob = await exportIntegrationsPDF(undefined, undefined, undefined, 250, id!);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user_export_${id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch { /* ignore */ } finally {
      setExporting(false);
    }
  };

  if (loading) return (
    <div className="space-y-4">
      <div className="skeleton h-10 w-48 rounded-2xl" />
      <div className="skeleton h-48 rounded-3xl" />
      <div className="skeleton h-32 rounded-3xl" />
    </div>
  );

  if (!user) return (
    <div className="page-wrapper">
      <PageHeader title="User Not Found" onBack={() => navigate(-1)} />
    </div>
  );

  const stats = [
    { label: 'Total Sessions', value: formatNumber(user?.stats?.totalSessions) },
    { label: 'Total Minutes', value: formatNumber(user?.stats?.totalMinutes) },
    { label: 'Total Payout', value: `$${formatNumber(user?.stats?.totalPayout)}` },
  ];

  const listenerInfo = user?.listenerInfo ? [
    { label: 'Gender Identity', value: user.listenerInfo.genderIdentity || 'N/A' },
    { label: 'Language', value: user.listenerInfo.language || 'N/A' },
    { label: 'Ethnicity', value: user.listenerInfo.ethnicity || 'N/A' },
    { label: 'Age Group', value: user.listenerInfo.ageGroup || 'N/A' },
    { label: 'LGBTQ+ Identity', value: user.listenerInfo.lgbtqIdentity || 'N/A' },
    { label: 'Special Topics', value: user.listenerInfo.specialTopics?.join(', ') || 'N/A' },
    { label: 'Faith / Belief', value: user.listenerInfo.faithOrBelief || 'N/A' },
  ] : [];

  const accountTypeLabel =
    user.accountType === 'venter' ? 'Venter'
    : user.accountType === 'listener' ? 'Listener'
    : user.accountType === 'both' ? 'Both'
    : user.userType ?? 'User';

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title="User Detail" onBack={() => navigate('/admin/users')} />

      {/* Summary Card */}
      <GlassCard bordered className="mb-4">
        {/* Header Row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <p className="text-lg font-bold text-white truncate">{user.email || 'N/A'}</p>
            <p className="text-xs text-gray-400 mt-0.5">ID: {user.id || 'N/A'}</p>
            <p className="text-xs text-gray-500 mt-1">
              Sessions: {formatNumber(user?.stats?.totalSessions)} &nbsp;·&nbsp;
              Minutes: {formatNumber(user?.stats?.totalMinutes)}
            </p>
          </div>
          <span className="ml-3 px-3 py-1 rounded-full bg-white/20 text-xs font-medium text-white flex-shrink-0">
            {accountTypeLabel}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-0 rounded-2xl border border-white/10 overflow-hidden mb-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`p-3 ${i < stats.length - 1 ? 'border-r border-white/10' : ''}`}
            >
              <p className="text-xs text-gray-400 mb-1">{s.label}</p>
              <p className="text-xl font-bold text-white">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Export Button */}
        <Button
          variant="glass"
          fullWidth
          leftIcon={exporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          loading={exporting}
          onClick={handleExportPDF}
        >
          {exporting ? 'Exporting…' : 'Export as PDF'}
        </Button>
      </GlassCard>

      {/* Quick Info */}
      <GlassCard className="mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: Mail, label: 'Email', value: user.email },
            { icon: Calendar, label: 'Joined', value: formatDate(user.createdAt) },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl glass flex items-center justify-center text-gray-400 flex-shrink-0">
                <Icon size={14} />
              </div>
              <div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-sm font-medium text-white mt-0.5">{value}</p>
              </div>
            </div>
          ))}

          {/* Status */}
          <div className="flex items-center gap-2">
            <Badge variant={user.isActive ? 'success' : 'error'} dot>
              {user.isActive ? 'Active' : 'Suspended'}
            </Badge>
            <Badge variant={user.accountType === 'listener' ? 'accent' : 'primary'} className="capitalize">
              {accountTypeLabel}
            </Badge>
          </div>
        </div>
      </GlassCard>

      {/* Listener Info (expandable) */}
      {user?.listenerInfo && (
        <GlassCard className="mb-4" padding="none">
          <button
            className="w-full flex items-center justify-between px-4 py-3"
            onClick={() => setListenerExpanded(v => !v)}
          >
            <span className="text-sm font-semibold text-white">Listener Information</span>
            {listenerExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
          </button>

          {listenerExpanded && (
            <div className="border-t border-white/5 divide-y divide-white/5">
              {listenerInfo.map(info => (
                <div key={info.label} className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-gray-400">{info.label}</span>
                  <span className="text-sm font-medium text-white">{info.value}</span>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      )}

      {/* Verification Documents */}
      {user?.verificationDocuments?.length > 0 && (
        <div className="mb-4">
          <p className="section-label mb-2">Verification Documents</p>
          <div className="space-y-2">
            {user.verificationDocuments.map((doc: any, i: number) => (
              <GlassCard key={i} padding="sm" rounded="2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl glass flex items-center justify-center text-gray-400">
                      <FileText size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white truncate max-w-[200px]">{doc.original_file_name}</p>
                      <p className="text-xs text-gray-500">{formatBytes(doc.file_size_bytes)} · {formatDate(doc.created_at)}</p>
                    </div>
                  </div>
                  <Badge variant={doc.status === 'approved' ? 'success' : 'default'} className="capitalize">
                    {doc.status}
                  </Badge>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {user.isActive ? (
          <Button variant="danger" fullWidth leftIcon={<Ban size={16} />} onClick={() => setActionModal('suspend')}>
            Suspend User
          </Button>
        ) : (
          <Button variant="primary" fullWidth leftIcon={<CheckCircle size={16} />} onClick={() => setActionModal('activate')}>
            Activate User
          </Button>
        )}
        <Button variant="danger" size="md" leftIcon={<Shield size={16} />} onClick={() => setActionModal('ban')}>
          Ban
        </Button>
      </div>

      {/* Confirm Modal */}
      <Modal isOpen={!!actionModal} onClose={() => setActionModal(null)} title={`Confirm: ${actionModal} user`} size="sm">
        <p className="text-sm text-gray-400 mb-4">
          Are you sure you want to {actionModal} {user.email}?
        </p>
        <div className="flex gap-3">
          <Button variant="glass" fullWidth onClick={() => setActionModal(null)}>Cancel</Button>
          <Button variant="primary" fullWidth loading={acting} onClick={() => handleAction(actionModal as any)}>
            Confirm
          </Button>
        </div>
      </Modal>
    </div>
  );
};
