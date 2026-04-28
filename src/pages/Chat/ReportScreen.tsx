import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { ChevronLeft } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { GlassModal } from '../../components/ui/GlassModal';
import { useAdmin } from '../../api/hooks/useAdmin';
import { toastError } from '../../utils/toast';

// Exact same reason keys as native app
const REPORT_REASONS = [
  'reasonDisruptive',
  'reasonBullying',
  'reasonDanger',
  'reasonInappropriate',
] as const;

// Map local keys → API values (matches native reasonMap)
const REASON_MAP: Record<string, string> = {
  reasonDisruptive: 'disruptive_behavior',
  reasonBullying: 'bullying_or_harassment',
  reasonDanger: 'danger_to_self_or_others',
  reasonInappropriate: 'inappropriate_or_unsafe_response',
};

export const ReportScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isVenter = useSelector((state: RootState) => state.user.isVenter);
  const session = useSelector((state: RootState) => state.session);
  const { submitReport, blockUser } = useAdmin();

  const [selectedReason, setSelectedReason] = useState<string>('reasonDisruptive');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBlock, setIsLoadingBlock] = useState(false);

  // Modal states — same sequence as native app
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [blockUserModal, setBlockUserModal] = useState(false);
  const [wasThatUsefulModal, setWasThatUsefulModal] = useState(false);
  const [temporaryRestrictionModal, setTemporaryRestrictionModal] = useState(false);
  const [sessionEndedModal, setSessionEndedModal] = useState(false);

  const handleSubmit = async () => {
    if (!description.trim()) {
      toastError(t('ReportScreen.errorDescriptionRequired', 'Please provide a description'));
      return;
    }

    // Resolve the reported user from session state — same as native app
    const reportedUserId = isVenter ? session?.listenerId : session?.venterId;
    if (!reportedUserId) {
      toastError(t('Common.somethingWentWrong', 'Something went wrong'));
      return;
    }

    const payload = {
      reportedId: reportedUserId,
      sessionType: session?.sessionType || 'chat',
      sessionId: session?.sessionId || undefined,
      reason: REASON_MAP[selectedReason] || 'disruptive_behavior',
      description: description.trim(),
    };

    try {
      setIsLoading(true);
      const res = await submitReport(payload);
      if (res?.success || res) {
        setShowSuccessModal(true);
      }
    } catch (err: any) {
      toastError(err?.message || err?.error || t('Common.somethingWentWrong', 'An error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  // After success → open block prompt
  const handleSuccessDone = () => {
    setShowSuccessModal(false);
    setBlockUserModal(true);
  };

  // Block the reported user
  const handleBlockUser = async () => {
    const reportedUserId = isVenter ? session?.listenerId : session?.venterId;
    if (!reportedUserId) {
      toastError(t('Common.somethingWentWrong', 'User ID not found'));
      return;
    }
    try {
      setIsLoadingBlock(true);
      await blockUser(reportedUserId);
      setBlockUserModal(false);
      setWasThatUsefulModal(true);
    } catch (err: any) {
      toastError(err?.message || err?.error || t('Common.somethingWentWrong', 'Failed to block user'));
    } finally {
      setIsLoadingBlock(false);
    }
  };

  // Skip block → session ended
  const handleSkipBlock = () => {
    setBlockUserModal(false);
    setSessionEndedModal(true);
  };

  // After session ended → go home
  const handleSessionEndedDone = () => {
    setSessionEndedModal(false);
    navigate(isVenter ? '/venter/home' : '/listener/home', { replace: true });
  };

  return (
    <div className="min-h-screen animate-fade-in">
      {/* Header */}
      <div className="glass border-b border-white/8 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl glass text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold text-white">
          {t('Report.title', 'Report User')}
        </h1>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        <GlassCard bordered className="rounded-[20px]" padding="md">
          {/* Card title */}
          <p className="text-sm font-semibold text-white mb-4">
            {t('ReportScreen.reportingListener', 'Reporting a listener')}
          </p>

          {/* Radio reasons — same style as native */}
          {REPORT_REASONS.map((key) => (
            <button
              key={key}
              onClick={() => setSelectedReason(key)}
              className="w-full flex items-center gap-3 py-3 text-left"
            >
              {/* Radio circle — thicker border when selected, matching native */}
              <span
                className="flex-shrink-0 w-[22px] h-[22px] rounded-full border flex items-center justify-center transition-all"
                style={{
                  borderWidth: selectedReason === key ? 7 : 1.5,
                  borderColor: 'rgba(255,255,255,0.7)',
                }}
              />
              <span className="text-sm font-medium text-white">
                {t(`ReportScreen.${key}`, key)}
              </span>
            </button>
          ))}

          {/* Description input */}
          <div className="mt-4 glass rounded-2xl border border-white/10 overflow-hidden">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('ReportScreen.descriptionPlaceholder', 'Describe the issue...')}
              className="w-full bg-transparent text-white placeholder-white/40 px-4 py-3 resize-none outline-none text-sm"
              rows={4}
              maxLength={1000}
            />
          </div>
        </GlassCard>

        {/* Submit */}
        <Button
          variant="glass"
          fullWidth
          onClick={handleSubmit}
          loading={isLoading}
          disabled={isLoading}
        >
          {t('ReportScreen.submitButton', 'Submit Report')}
        </Button>
      </div>

      {/* ── Modals (same flow as native app) ── */}

      {/* 1. Success */}
      <GlassModal
        isOpen={showSuccessModal}
        onClose={handleSuccessDone}
        showIcon={false}
        title={t('ReportScreen.successTitle', 'Report Submitted')}
        message={t('ReportScreen.successMessage', 'Your report has been submitted and our team will review it shortly.')}
        showButtons
        primaryButtonText={t('ReportScreen.doneButton', 'Done')}
        onPrimaryPress={handleSuccessDone}
      />

      {/* 2. Block user? */}
      <GlassModal
        isOpen={blockUserModal}
        onClose={handleSkipBlock}
        showIcon={false}
        title={t('ReportScreen.blockUserTitle', 'Block this user?')}
        message={t('ReportScreen.blockUserMessage', 'Do you also want to block this user from contacting you in the future?')}
        showButtons
        primaryButtonText={t('Common.yes', 'Yes')}
        secondaryButtonText={t('Common.no', 'No')}
        onPrimaryPress={handleBlockUser}
        onSecondaryPress={handleSkipBlock}
        loading={isLoadingBlock}
      />

      {/* 3. Was that useful? */}
      <GlassModal
        isOpen={wasThatUsefulModal}
        onClose={() => { setWasThatUsefulModal(false); setTemporaryRestrictionModal(true); }}
        showIcon={false}
        title={t('ReportScreen.wasThatUseFulTitle', 'Was that useful?')}
        showButtons
        primaryButtonText={t('Common.yes', 'Yes')}
        secondaryButtonText={t('Common.no', 'No')}
        onPrimaryPress={() => { setWasThatUsefulModal(false); setTemporaryRestrictionModal(true); }}
        onSecondaryPress={() => { setWasThatUsefulModal(false); setTemporaryRestrictionModal(true); }}
      />

      {/* 4. Temporary restriction info */}
      <GlassModal
        isOpen={temporaryRestrictionModal}
        onClose={() => setTemporaryRestrictionModal(false)}
        showIcon={false}
        title={t('ReportScreen.temporaryRestrictionTitle', 'Temporary Restriction Applied')}
        message={t('ReportScreen.temporaryRestrictionMessage', 'This user has been temporarily restricted while we review your report.')}
        showButtons
        primaryButtonText={t('ReportScreen.contactSupport', 'Contact Support')}
        secondaryButtonText={t('ReportScreen.exit', 'Exit')}
        onPrimaryPress={() => setTemporaryRestrictionModal(false)}
        onSecondaryPress={() => setTemporaryRestrictionModal(false)}
        showVerticalButtons
      />

      {/* 5. Session ended */}
      <GlassModal
        isOpen={sessionEndedModal}
        onClose={handleSessionEndedDone}
        showIcon={false}
        title={t('ReportScreen.sessionEndedTitle', 'Session Ended')}
        message={t('ReportScreen.sessionEndedMessage', 'Your session has ended. Thank you for helping keep our community safe.')}
        showButtons
        primaryButtonText={t('Common.ok', 'OK')}
        onPrimaryPress={handleSessionEndedDone}
      />
    </div>
  );
};
