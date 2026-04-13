import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { PageHeader } from '../../components/ui/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { useAdmin } from '../../api/hooks/useAdmin';
import { AlertTriangle, Ban, UserX, CheckCircle, Eye } from 'lucide-react';

export const AdminTakeAction = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { reportId } = useParams<{ reportId: string }>();
  const { takeAction } = useAdmin();

  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const actions = [
    {
      id: 'warn',
      label: t('AdminTakeAction.warn', 'Issue Warning'),
      description: t('AdminTakeAction.warnDesc', 'Send a formal warning to the user'),
      icon: AlertTriangle,
      color: 'warning',
    },
    {
      id: 'suspend',
      label: t('AdminTakeAction.suspend', 'Suspend User'),
      description: t('AdminTakeAction.suspendDesc', 'Temporarily suspend account (7-30 days)'),
      icon: UserX,
      color: 'error',
    },
    {
      id: 'ban',
      label: t('AdminTakeAction.ban', 'Permanently Ban'),
      description: t('AdminTakeAction.banDesc', 'Permanent removal from platform'),
      icon: Ban,
      color: 'error',
    },
    {
      id: 'dismiss',
      label: t('AdminTakeAction.dismiss', 'Dismiss Report'),
      description: t('AdminTakeAction.dismissDesc', 'No action required'),
      icon: CheckCircle,
      color: 'success',
    },
    {
      id: 'review',
      label: t('AdminTakeAction.review', 'Mark for Review'),
      description: t('AdminTakeAction.reviewDesc', 'Escalate to senior admin'),
      icon: Eye,
      color: 'accent',
    },
  ];

  const handleAction = async () => {
    if (!selectedAction || !reportId) return;

    setLoading(true);
    try {
      await takeAction(reportId, selectedAction, notes);
      navigate('/admin/reports');
    } catch (error) {
      console.error('Failed to take action:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader
        title={t('AdminTakeAction.title', 'Take Action')}
        subtitle={reportId ? `${t('AdminTakeAction.reportId', 'Report')} #${reportId}` : ''}
        onBack={() => navigate(-1)}
      />

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white mb-2">
          {t('AdminTakeAction.selectAction', 'Select Action')}
        </h2>
        <p className="text-sm text-gray-400">
          {t('AdminTakeAction.selectActionDesc', 'Choose an appropriate enforcement action based on the severity of the violation.')}
        </p>
      </div>

      <div className="space-y-3 mb-6">
        {actions.map((action) => (
          <GlassCard
            key={action.id}
            hover
            onClick={() => setSelectedAction(action.id)}
            className={`cursor-pointer transition-all ${
              selectedAction === action.id ? 'border-accent/50 bg-accent/5' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                action.color === 'warning' ? 'bg-warning/15' :
                action.color === 'error' ? 'bg-error/15' :
                action.color === 'success' ? 'bg-success/15' :
                'bg-accent/15'
              }`}>
                <action.icon size={20} className={
                  action.color === 'warning' ? 'text-warning' :
                  action.color === 'error' ? 'text-error' :
                  action.color === 'success' ? 'text-success' :
                  'text-accent'
                } />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white">{action.label}</h3>
                  {selectedAction === action.id && (
                    <Badge variant="success">✓</Badge>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">{action.description}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-white mb-2">
          {t('AdminTakeAction.notes', 'Additional Notes')}
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t('AdminTakeAction.notesPlaceholder', 'Enter any additional notes or context...')}
          className="w-full h-32 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-accent/50 resize-none"
        />
      </div>

      <div className="flex gap-3">
        <Button
          variant="ghost"
          size="lg"
          className="flex-1"
          onClick={() => navigate(-1)}
        >
          {t('Common.cancel', 'Cancel')}
        </Button>
        <Button
          variant="primary"
          size="lg"
          className="flex-1"
          disabled={!selectedAction || loading}
          loading={loading}
          onClick={handleAction}
        >
          {t('AdminTakeAction.confirm', 'Confirm Action')}
        </Button>
      </div>
    </div>
  );
};
