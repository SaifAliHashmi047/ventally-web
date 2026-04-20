import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassModal } from '../../components/ui/GlassModal';
import { useAdmin } from '../../api/hooks/useAdmin';
import { toast } from 'react-toastify';
import { Check } from 'lucide-react';

export const AdminTakeAction = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const { adminSuspendUser, adminBulkDeleteUsers, updateReportStatus } = useAdmin();

  const report = location.state?.report;

  const [notes, setNotes] = useState('');
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        handleSuccessClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessModal]);

  const actions = [
    { id: 'warning', label: t('Admin.moderation.action.warning', 'Warning') },
    { id: 'tempSuspend', label: t('Admin.moderation.action.tempSuspend', 'Temporary Suspend') },
    { id: 'deleteUser', label: t('Admin.moderation.action.deleteUser', 'Delete User') },
    { id: 'noAction', label: t('Admin.moderation.action.noAction', 'No Action') },
  ];

  const handleCloseIssue = async () => {
    if (!selectedAction || !report) {
       toast.error(t('Common.error', 'Error: Report data missing'));
       return;
    }

    setIsSubmitting(true);
    try {
      // 1. Take action against the reported user if necessary
      if (selectedAction === 'tempSuspend') {
        await adminSuspendUser(report.reportedId, { suspended: true });
      } else if (selectedAction === 'deleteUser') {
        await adminBulkDeleteUsers({ userIds: [report.reportedId] });
      }

      // 2. Resolve the report issue with admin notes
      await updateReportStatus(report.id, {
        status: 'resolved',
        adminNotes: notes,
      });

      setShowSuccessModal(true);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || t('Common.error', 'Error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigate('/admin/reports');
  };

  return (
    <div className="page-wrapper animate-fade-in max-w-2xl mx-auto">
      <PageHeader
        title={t('Admin.moderation.action.title', 'Take Action')}
        onBack={() => navigate(-1)}
      />

      <div className="space-y-6 pb-24">
        <p className="text-sm text-white/70">
          {t('Admin.moderation.action.description', 'Select an action to resolve this report.')}
        </p>

        <div>
          <label className="block text-sm font-semibold text-white mb-2 ml-1">
            {t('Admin.moderation.action.adminNotes', 'Admin Notes')}
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full h-32 px-4 py-3 rounded-2xl bg-black/10 border border-white/10 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-white/30 resize-none transition-all"
            placeholder={t('Admin.moderation.action.adminNotesPlaceholder', 'Enter notes here...')}
          />
        </div>

        <div>
           <label className="block text-sm font-semibold text-white mb-3 ml-1">
            {t('Admin.moderation.action.selectAction', 'Select Action')}
          </label>
          <div className="space-y-2">
            {actions.map((action) => (
              <div
                key={action.id}
                onClick={() => setSelectedAction(action.id)}
                className={`px-6 py-4 rounded-full transition-all cursor-pointer border ${
                  selectedAction === action.id 
                    ? 'bg-white/20 border-white/40' 
                    : 'bg-white/5 border-transparent hover:bg-white/10'
                }`}
              >
                <p className="text-sm font-medium text-white text-center">{action.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            disabled={!selectedAction || isSubmitting}
            loading={isSubmitting}
            onClick={handleCloseIssue}
          >
            {t('Admin.moderation.action.closeIssue', 'Close Issue')}
          </Button>
        </div>
      </div>

      <GlassModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        title={t('Admin.success.issueClosed', 'Issue Closed')}
        description={t('Admin.success.issueClosedMessage', 'The report has been resolved successfully')}
        icon={<Check className="text-white" size={32} />}
      />
    </div>
  );
};
