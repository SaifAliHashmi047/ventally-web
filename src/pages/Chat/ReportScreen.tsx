import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { ChevronLeft, Flag, AlertTriangle } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { useAdmin } from '../../api/hooks/useAdmin';

// Match mobile app reason keys
const REPORT_REASONS = [
  { id: 'reasonDisruptive', label: 'Inappropriate Behavior' },
  { id: 'reasonBullying', label: 'Harassment or Bullying' },
  { id: 'reasonDanger', label: 'Spam or Scam' },
  { id: 'reasonInappropriate', label: 'Fake Identity' },
  { id: 'other', label: 'Other' },
];

// Map UI reasons to API values like mobile app
const REASON_MAP: Record<string, string> = {
  'reasonDisruptive': 'disruptive_behavior',
  'reasonBullying': 'bullying_or_harassment',
  'reasonDanger': 'danger_to_self_or_others',
  'reasonInappropriate': 'inappropriate_or_unsafe_response',
  'other': 'other',
};

export const ReportScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useSelector((state: RootState) => state.user.user as any);
  const { submitReport } = useAdmin();

  const { chat, type = 'chat', callId, conversationId, targetUserId } = location.state || {};

  const [selectedReason, setSelectedReason] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const getTargetUserId = useCallback(() => {
    if (targetUserId) return targetUserId;
    if (chat?.otherParticipant?.userId) return chat.otherParticipant.userId;
    if (chat?.listener?.userId) return chat.listener.userId;
    if (chat?.conversation?.venter?.userId) return chat.conversation.venter.userId;
    return '';
  }, [chat, targetUserId]);

  const getConversationId = useCallback(() => {
    if (conversationId) return conversationId;
    if (chat?.conversationId) return chat.conversationId;
    if (chat?.conversation?.conversationId) return chat.conversation.conversationId;
    return '';
  }, [chat, conversationId]);

  const getCallId = useCallback(() => {
    if (callId) return callId;
    if (chat?.callId) return chat.callId;
    return '';
  }, [callId, chat]);

  const handleSubmit = async () => {
    if (!selectedReason) return;

    // Description is required in mobile API
    if (!description.trim()) {
      setShowError(true);
      return;
    }

    const targetId = getTargetUserId();
    if (!targetId) {
      setShowError(true);
      return;
    }

    // Get session ID from call or conversation
    const sessionId = getCallId() || getConversationId() || '';

    setSubmitting(true);
    try {
      // Match mobile app payload structure
      await submitReport({
        reportedId: targetId,
        sessionType: type || 'chat',
        sessionId: sessionId || undefined,
        reason: REASON_MAP[selectedReason] || selectedReason,
        description: description.trim(),
      });
      setShowSuccess(true);
    } catch (error) {
      console.error('Report submission error:', error);
      setShowError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSuccessOk = () => {
    setShowSuccess(false);
    navigate(-1);
  };

  const handleErrorOk = () => {
    setShowError(false);
  };

  return (
    <div className="min-h-screen bg-bg-deep animate-fade-in">
      {/* Header */}
      <div className="glass border-b border-white/8 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={handleBack}
          className="p-2 rounded-xl glass text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
          <Flag size={18} className="text-error" />
          <h1 className="text-lg font-semibold text-white">
            {t('Report.title', 'Report User')}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Info Card */}
        <GlassCard className="rounded-2xl" padding="md">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-warning flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-400">
              {t(
                'Report.info',
                'Your report will be reviewed by our team. False reports may result in account suspension.'
              )}
            </p>
          </div>
        </GlassCard>

        {/* Reason Selection */}
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-white">
            {t('Report.selectReason', 'Select a reason')} *
          </h2>
          <div className="space-y-2">
            {REPORT_REASONS.map((reason) => (
              <button
                key={reason.id}
                onClick={() => setSelectedReason(reason.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  selectedReason === reason.id
                    ? 'border-primary bg-primary/10'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <p className="text-sm text-white">{reason.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-white">
            {t('Report.description', 'Description')} *
          </h2>
          <GlassCard className="rounded-2xl" padding="none">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('Report.descriptionPlaceholder', 'Please provide more details...')}
              className="w-full bg-transparent text-white placeholder-gray-500 px-4 py-3 resize-none outline-none text-sm"
              rows={4}
              maxLength={500}
            />
          </GlassCard>
          <p className="text-xs text-gray-500 text-right">
            {description.length}/500
          </p>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            variant="danger"
            onClick={handleSubmit}
            disabled={!selectedReason || submitting}
            className="w-full"
          >
            {submitting
              ? t('Report.submitting', 'Submitting...')
              : t('Report.submit', 'Submit Report')}
          </Button>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <GlassCard className="w-full max-w-sm rounded-3xl p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
              <Flag size={24} className="text-success" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {t('Report.successTitle', 'Report Submitted')}
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              {t(
                'Report.successMessage',
                'Thank you for your report. Our team will review it shortly.'
              )}
            </p>
            <Button variant="primary" onClick={handleSuccessOk} className="w-full">
              {t('Common.ok', 'OK')}
            </Button>
          </GlassCard>
        </div>
      )}

      {/* Error Modal */}
      {showError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <GlassCard className="w-full max-w-sm rounded-3xl p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-error/20 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} className="text-error" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {t('Report.errorTitle', 'Error')}
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              {t(
                'Report.errorMessage',
                'Failed to submit report. Please try again.'
              )}
            </p>
            <Button variant="primary" onClick={handleErrorOk} className="w-full">
              {t('Common.ok', 'OK')}
            </Button>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
