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
  ChevronRight, ChevronDown, Download, FileText, CheckCircle
} from 'lucide-react';
import { toast } from 'react-toastify';
import { GlassModal } from '../../components/ui/GlassModal';
import { cn } from '../../utils/cn';

export const AdminUserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getUserDetail, adminSuspendUser, adminDeleteUser } = useAdmin();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [suspending, setSuspending] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('support');
  const [showExportSuccess, setShowExportSuccess] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await getUserDetail(id!);
        setUser(res?.user ?? res);
      } catch (error) {
        toast.error(t('Common.error', 'Error loading details'));
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleToggleSuspend = async () => {
    setSuspending(true);
    try {
      const isCurrentlySuspended = user.status === 'suspended';
      await adminSuspendUser(id!, { suspended: !isCurrentlySuspended });
      setUser({ ...user, status: isCurrentlySuspended ? 'active' : 'suspended' });
      toast.success(isCurrentlySuspended ? t('Admin.review.userSuspended', 'User Reactivated') : t('Admin.review.userSuspended', 'User Suspended'));
    } catch (error) {
      toast.error(t('Common.error', 'Update failed'));
    } finally {
      setSuspending(false);
    }
  };

  const handleExportPDF = () => {
    setShowExportSuccess(true);
    setTimeout(() => setShowExportSuccess(false), 3000);
  };

  if (loading) return (
    <div className="page-wrapper animate-fade-in max-w-2xl mx-auto space-y-4">
      <div className="skeleton h-10 w-48 rounded-2xl mx-auto" />
      <div className="skeleton h-48 rounded-3xl" />
      <div className="skeleton h-20 rounded-3xl" />
      <div className="skeleton h-64 rounded-3xl" />
    </div>
  );

  if (!user) return (
    <div className="page-wrapper max-w-2xl mx-auto">
      <PageHeader title={t('Common.notFound', 'User Not Found')} onBack={() => navigate(-1)} />
    </div>
  );

  const stats = [
    { label: t('Admin.userDetail.stats.totalSessions', 'Sessions'), value: user.totalSessions || 0 },
    { label: t('Admin.userDetail.stats.totalMinutes', 'Minutes'), value: Math.round(user.totalMinutes || 0) },
    { label: t('Admin.userDetail.stats.totalPayout', 'Payout'), value: `$${user.totalPayout || 0}` },
  ];

  return (
    <div className="page-wrapper animate-fade-in max-w-2xl mx-auto">
      <PageHeader 
        title={t('Admin.userDetail.title', 'User Detail')} 
        onBack={() => navigate('/admin/users')}
        centered
      />

      <div className="space-y-6 pb-24 px-1">
        {/* User Summary Card */}
        <GlassCard className="py-8 bg-white/[0.02] border-white/5">
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold text-white mb-4 text-center">
              {user.email || user.displayName || 'Anonymous'}
            </h2>
            <div className="space-y-1 text-center mb-6">
              <p className="text-sm text-white font-normal uppercase tracking-wide">
                {t('Admin.subAdminProfile.id', 'ID')}: {user.id}
              </p>
              <p className="text-sm text-white/60 font-normal">
                {t('Admin.subAdminProfile.email', 'Email')}: {user.email}
              </p>
            </div>
            <Badge variant={user.role === 'listener' ? 'accent' : 'primary'} className="px-5 py-1.5 rounded-full font-bold uppercase tracking-widest text-[10px]">
              {user.role === 'listener' ? t('Admin.userDetail.listenerBadge', 'Support Guide') : t('Admin.userDetail.venterBadge', 'Venter')}
            </Badge>
          </div>
        </GlassCard>

        {/* Stats Grid - 3 Columns with Bottom Border like native */}
        <div className="grid grid-cols-3 bg-white/10 border border-white/20 rounded-2xl overflow-hidden">
          {stats.map((stat, idx) => (
            <div key={idx} className={cn("flex flex-col items-center py-4", idx < 2 && "border-r border-white/10")}>
              <span className="text-[10px] uppercase tracking-widest text-white/40 mb-1 font-bold">
                {stat.label}
              </span>
              <span className="text-lg font-bold text-white">
                {stat.value}
              </span>
            </div>
          ))}
        </div>

        {/* Expandable Sections */}
        <div className="space-y-3">
          <GlassCard padding="none" className="overflow-hidden border-white/5">
            <button 
              onClick={() => setExpandedSection(expandedSection === 'support' ? null : 'support')}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors"
            >
              <span className="text-sm font-bold text-white uppercase tracking-wider">{t('Admin.userDetail.listenerInfo', 'Support Guide info')}</span>
              {expandedSection === 'support' ? <ChevronDown size={18} className="text-white/40" /> : <ChevronRight size={18} className="text-white/40" />}
            </button>
            
            {expandedSection === 'support' && (
              <div className="px-5 pb-5 space-y-4 animate-slide-down">
                 <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/40">Gender</span>
                      <span className="text-white/90 font-medium">{user.gender || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/40">Age Group</span>
                      <span className="text-white/90 font-medium">{user.ageGroup || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/40">Joined</span>
                      <span className="text-white/90 font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                 </div>
              </div>
            )}
          </GlassCard>
        </div>

        {/* Verification Documents */}
        {user.verificationDocuments?.length > 0 && (
          <div className="space-y-4 pt-2">
            <h3 className="text-base font-bold text-white mb-4 uppercase tracking-wider">
              {t('Admin.review.verificationDocs', 'Verification Documents')}
            </h3>
            {user.verificationDocuments.map((doc: any, idx: number) => (
              <GlassCard key={idx} className="flex items-center justify-between p-4 border-white/10 hover:bg-white/5 cursor-pointer">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-accent">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">{doc.original_file_name}</p>
                    <p className="text-[11px] text-white/40">{Math.round(doc.file_size_bytes / 1024)} KB • {new Date(doc.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <Badge variant={doc.status === 'approved' ? 'success' : 'default'} className="uppercase text-[9px] font-bold">
                  {doc.status}
                </Badge>
              </GlassCard>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-6">
          <Button
            variant={user.status === 'suspended' ? 'success' : 'error'}
            fullWidth
            onClick={handleToggleSuspend}
            loading={suspending}
            className="rounded-full h-14 font-bold uppercase tracking-widest text-xs"
          >
            {user.status === 'suspended' ? t('Admin.review.suspend', 'Reactivate User') : t('Admin.review.suspend', 'Suspend User')}
          </Button>

          <Button
            variant="glass"
            fullWidth
            onClick={handleExportPDF}
            leftIcon={<Download size={18} />}
            className="rounded-full h-14 font-bold uppercase tracking-widest text-xs border-white/10"
          >
            {t('Admin.userDetail.exportPdf', 'Export PDF')}
          </Button>
        </div>
      </div>

      <GlassModal
        isOpen={showExportSuccess}
        onClose={() => setShowExportSuccess(false)}
        icon={<CheckCircle className="text-accent" />}
        title={t('Admin.userDetail.exportSuccess.title', 'Export Completed')}
        message={t('Admin.userDetail.exportSuccess.subtitle', 'Your user data has been exported successfully.')}
        showButtons={false}
      />
    </div>
  );
};
