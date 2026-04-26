import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { ChevronLeft, Flag, AlertTriangle } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { useAdmin } from '../../api/hooks/useAdmin';
import { toastSuccess, toastError } from '../../utils/toast';

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

    if (!description.trim()) {
      toastError(t('Common.fillRequiredFields'));
      return;
    }

    const targetId = getTargetUserId();
    if (!targetId) {
      toastError(t('Common.somethingWentWrong'));
      return;
    }

    // Get session ID from call or conversation
    const sessionId = getCallId() || getConversationId() || '';

    setSubmitting(true);
    try {
      await submitReport({
        reportedId: targetId,
        sessionType: type || 'chat',
        sessionId: sessionId || undefined,
        reason: REASON_MAP[selectedReason] || selectedReason,
        description: description.trim(),
      });
      toastSuccess(t('ReportScreen.successMessage'));
      navigate(-1);
    } catch (error: any) {
      toastError(error?.error || t('Common.somethingWentWrong'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
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
          <p className="text-xs text-white/80 text-right">
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
    </div>
  );
};
