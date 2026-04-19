import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { useMood } from '../../api/hooks/useMood';
import { MOOD_CONFIG, type MoodType } from '../../components/ui/MoodSelector';
import { toastSuccess, toastError } from '../../utils/toast';
import { Trash2, Edit2, AlertTriangle } from 'lucide-react';

interface MoodItem {
  id: string;
  mood_type: string;
  notes?: string;
  category?: string;
  logged_date?: string;
  created_at?: string;
  updated_at?: string;
}

export const VenterMoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { getMoodHistory, deleteMood } = useMood();

  const [mood, setMood] = useState<MoodItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Support passing item via location state
  const stateItem = location.state?.item as MoodItem | undefined;

  useEffect(() => {
    const fetchMood = async () => {
      if (stateItem) {
        setMood(stateItem);
        setLoading(false);
        return;
      }

      if (!id) {
        setLoading(false);
        return;
      }

      try {
        // Fetch from history and find by ID
        const res = await getMoodHistory(100, 0);
        const found = res?.moods?.find((m: MoodItem) => m.id === id);
        if (found) {
          setMood(found);
        }
      } catch (error) {
        console.error('Error fetching mood:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMood();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDelete = async () => {
    if (!mood?.id) return;
    setDeleteLoading(true);
    try {
      await deleteMood(mood.id);
      toastSuccess(t('VenterMoodHistory.deleteSuccess'));
      setShowDeleteModal(false);
      navigate(-1);
    } catch (error: any) {
      toastError(error?.error || t('Common.somethingWentWrong'));
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEdit = () => {
    if (!mood) return;

    navigate('/venter/mood/log', {
      state: {
        editMode: true,
        selectedMood: mood.mood_type?.toLowerCase(),
        item: {
          id: mood.id,
          mood: mood.mood_type,
          note: mood.notes,
          categories: mood.category ? [mood.category] : [],
        },
      },
    });
  };

  const moodKey = mood?.mood_type?.toLowerCase() as MoodType;
  const config = moodKey ? MOOD_CONFIG[moodKey] : null;
  const dateObj = mood ? new Date(mood.logged_date || mood.created_at || '') : null;

  if (loading) {
    return (
      <div className="page-wrapper animate-fade-in">
        <PageHeader title={t('VenterMoodDetails.title', 'Mood Details')} onBack={() => navigate(-1)} />
        <div className="mt-8">
          <div className="skeleton h-64 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!mood) {
    return (
      <div className="page-wrapper animate-fade-in">
        <PageHeader title={t('VenterMoodDetails.title', 'Mood Details')} onBack={() => navigate(-1)} />
        <GlassCard className="mt-8 text-center py-12">
          <AlertTriangle size={48} className="text-error mx-auto mb-4" />
          <p className="text-white text-lg">{t('VenterMoodDetails.notFound', 'Mood entry not found')}</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader
        title={t('VenterMoodDetails.title', 'Mood Details')}
        onBack={() => navigate(-1)}
        rightContent={
          <div className="flex items-center gap-2">
            <button
              onClick={handleEdit}
              className="w-10 h-10 glass rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-10 h-10 glass rounded-xl flex items-center justify-center text-error hover:bg-error/20 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        }
      />

      <div className="mt-6 space-y-4">
        {/* Mood Card */}
        <GlassCard bordered>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{config?.emoji || '😶'}</span>
              <div>
                <p className="text-lg font-semibold capitalize" style={{ color: config?.text || '#aaa' }}>
                  {mood.mood_type}
                </p>
                <p className="text-xs text-gray-500">
                  {dateObj?.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              {dateObj?.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
            </p>
          </div>

          {mood.category && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-gray-500">{t('VenterMoodLog.whatsGoingOn', 'Category')}:</span>
              <span className="text-xs bg-white/10 px-2 py-1 rounded-full text-white">{mood.category}</span>
            </div>
          )}

          {mood.notes && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-gray-500 mb-2">{t('VenterMoodDetails.note', 'Notes')}</p>
              <p className="text-sm text-white leading-relaxed">{mood.notes}</p>
            </div>
          )}
        </GlassCard>

        {/* Edit Button */}
        <Button variant="glass" fullWidth leftIcon={<Edit2 size={18} />} onClick={handleEdit}>
          {t('VenterMoodDetails.editEntry', 'Edit Entry')}
        </Button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <GlassCard className="w-full max-w-sm rounded-3xl p-6 text-center transform animate-scale-up">
            <div className="w-16 h-16 bg-error/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={28} className="text-error" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {t('VenterMoodDetails.deleteConfirmTitle', 'Delete Mood Entry?')}
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              {t('VenterMoodDetails.deleteConfirmDesc', 'This action cannot be undone. The mood entry will be permanently removed from your history.')}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors"
                disabled={deleteLoading}
              >
                {t('Common.cancel', 'Cancel')}
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="py-3 rounded-2xl bg-error text-white font-medium hover:bg-error/90 transition-colors flex items-center justify-center gap-2"
              >
                {deleteLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Trash2 size={18} />
                )}
                {t('Common.delete', 'Delete')}
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
