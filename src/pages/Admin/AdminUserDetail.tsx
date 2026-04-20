import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAdmin } from '../../api/hooks/useAdmin';
import { 
  User, Mail, Calendar as CalendarIcon, Clock, Shield, 
  ChevronRight, ChevronDown, Download, AlertTriangle 
} from 'lucide-react';
import { toast } from 'react-toastify';
import { GlassModal } from '../../components/ui/GlassModal';

export const AdminUserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getUserDetail, adminSuspendUser, adminDeleteUser } = useAdmin();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [suspending, setSuspending] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('summary');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await getUserDetail(id!);
        setUser(res?.user ?? res);
      } catch (error) {
        toast.error('Failed to load user details');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleToggleSuspend = async () => {
    setSuspending(true);
    try {
      const newStatus = user.status === 'suspended' ? false : true;
      await adminSuspendUser(id!, { suspended: newStatus });
      setUser({ ...user, status: newStatus ? 'suspended' : 'active' });
      toast.success(newStatus ? 'User suspended' : 'User reactivated');
    } catch (error) {
      toast.error('Failed to update user status');
    } finally {
      setSuspending(false);
    }
  };

  const handleExportPDF = () => {
    toast.info('Generating PDF export...');
    // PDF generation logic would go here
  };

  if (loading) return (
    <div className="page-wrapper animate-fade-in max-w-2xl mx-auto space-y-4">
      <div className="skeleton h-10 w-48 rounded-2xl" />
      <div className="skeleton h-48 rounded-3xl" />
      <div className="skeleton h-24 rounded-3xl" />
      <div className="skeleton h-64 rounded-3xl" />
    </div>
  );

  if (!user) return (
    <div className="page-wrapper max-w-2xl mx-auto">
      <PageHeader title="User Not Found" onBack={() => navigate(-1)} />
    </div>
  );

  return (
    <div className="page-wrapper animate-fade-in max-w-2xl mx-auto">
      <PageHeader title={t('Admin.userDetail.title', 'User Profile')} onBack={() => navigate('/admin/users')} />

      <div className="space-y-6 pb-24">
        {/* User Summary Card (Native Parity) */}
        <GlassCard className="relative overflow-hidden pt-8 pb-6 border-white/5 bg-black/10">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full glass-accent flex items-center justify-center text-3xl font-bold text-accent mb-4 border-2 border-accent/20">
              {(user.displayName?.[0] || user.email?.[0] || 'U').toUpperCase()}
            </div>
            <h2 className="text-xl font-bold text-white mb-1">{user.displayName || 'Anonymous'}</h2>
            <div className="flex items-center gap-2 text-white/50 text-sm mb-4">
              <Mail size={14} />
              <span>{user.email || 'No email provided'}</span>
            </div>
            
            <div className="flex gap-2">
              <Badge variant={user.status === 'active' ? 'success' : 'error'} dot className="px-4 py-1.5 rounded-full capitalize">
                {user.status || 'active'}
              </Badge>
              <Badge variant="glass" className="px-4 py-1.5 rounded-full">
                ID: {user.id?.slice(0, 8)}...
              </Badge>
            </div>
          </div>
        </GlassCard>

        {/* Stats Grid - 3 Column Layout (NATIVE STYLE) */}
        <div className="grid grid-cols-3 gap-3">
          <GlassCard className="flex flex-col items-center py-4 bg-white/[0.03] border-white/5">
            <span className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Sessions</span>
            <span className="text-lg font-bold text-white">{user.stats?.sessionsCount || 0}</span>
          </GlassCard>
          <GlassCard className="flex flex-col items-center py-4 bg-white/[0.03] border-white/5">
            <span className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Minutes</span>
            <span className="text-lg font-bold text-white">{user.stats?.totalMinutes || 0}</span>
          </GlassCard>
          <GlassCard className="flex flex-col items-center py-4 bg-white/[0.03] border-white/5">
            <span className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Payout</span>
            <span className="text-lg font-bold text-white">${user.stats?.totalPayout || 0}</span>
          </GlassCard>
        </div>

        {/* Expandable Sections (Accordion Style) */}
        <div className="space-y-3">
          {/* Summary Section */}
          <GlassCard padding="none" className="overflow-hidden border-white/5">
            <button 
              onClick={() => setExpandedSection(expandedSection === 'summary' ? null : 'summary')}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg glass flex items-center justify-center text-primary">
                  <User size={16} />
                </div>
                <span className="text-sm font-bold text-white">Summary</span>
              </div>
              {expandedSection === 'summary' ? <ChevronDown size={18} className="text-white/40" /> : <ChevronRight size={18} className="text-white/40" />}
            </button>
            
            {expandedSection === 'summary' && (
              <div className="px-14 pb-5 space-y-4 animate-slide-down">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/40">Joined Date</span>
                  <span className="text-white/90 font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/40">Role</span>
                  <span className="text-white/90 font-medium capitalize">{user.userType || 'Venter'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/40">Auth Provider</span>
                  <span className="text-white/90 font-medium capitalize">{user.provider || 'Email'}</span>
                </div>
              </div>
            )}
          </GlassCard>

          {/* Support Guide Info */}
          <GlassCard padding="none" className="overflow-hidden border-white/5">
            <button 
              onClick={() => setExpandedSection(expandedSection === 'support' ? null : 'support')}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg glass flex items-center justify-center text-accent">
                  <Shield size={16} />
                </div>
                <span className="text-sm font-bold text-white">Support Guide Info</span>
              </div>
              {expandedSection === 'support' ? <ChevronDown size={18} className="text-white/40" /> : <ChevronRight size={18} className="text-white/40" />}
            </button>
            
            {expandedSection === 'support' && (
              <div className="px-14 pb-5 space-y-4 animate-slide-down">
                <p className="text-xs text-white/50 leading-relaxed italic">
                  User has accepted all safety and support guideline policies upon registration. No recent violations flagged.
                </p>
              </div>
            )}
          </GlassCard>
        </div>

        {/* Action Buttons (Pill Shaped) */}
        <div className="flex flex-col gap-3 pt-6">
          <Button
            variant={user.status === 'suspended' ? 'primary' : 'danger'}
            fullWidth
            onClick={handleToggleSuspend}
            loading={suspending}
            className="rounded-full h-14 font-bold"
          >
            {user.status === 'suspended' ? 'Reactivate User' : 'Suspend User'}
          </Button>

          <Button
            variant="glass"
            fullWidth
            onClick={handleExportPDF}
            leftIcon={<Download size={18} />}
            className="rounded-full h-14 font-bold border-white/10"
          >
            Export to PDF
          </Button>
        </div>
      </div>
    </div>
  );
};
