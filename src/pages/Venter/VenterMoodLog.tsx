import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { MoodSelector, type MoodType, MOOD_CONFIG } from '../../components/ui/MoodSelector';
import { useMood } from '../../api/hooks/useMood';

const CATEGORIES = ['Work', 'Family', 'Health', 'Unknown'];

export const VenterMoodLog = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { logMood, updateMood, getTodayMood } = useMood();
  const state = location.state as any;

  const [mood, setMood] = useState<MoodType | null>(state?.selectedMood ?? null);
  const [note, setNote] = useState(state?.item?.note ?? '');
  const [categories, setCategories] = useState<string[]>(state?.item?.categories ?? []);
  const [saving, setSaving] = useState(false);
  const [loadingToday, setLoadingToday] = useState(false);
  const [isEditMode, setIsEditMode] = useState(!!state?.editMode);
  const [moodId, setMoodId] = useState(state?.item?.id);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodayMood = async () => {
      // If we weren't passed editMode, check if we already logged today
      if (!state?.editMode) {
        setLoadingToday(true);
        try {
          const res = await getTodayMood();
          if (res?.mood) {
            setIsEditMode(true);
            setMoodId(res.mood.id);
            setMood(res.mood.mood_type as MoodType);
            setNote(res.mood.notes || '');
            if (res.mood.category) setCategories([res.mood.category]);
          }
        } catch {
          // ignore, no mood logged today
        } finally {
          setLoadingToday(false);
        }
      }
    };
    fetchTodayMood();
  }, []);

  const toggleCategory = (cat: string) => {
    setCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const handleSave = async () => {
    if (!mood) return;
    setSaving(true);
    setError(null);
    try {
      if (isEditMode && moodId) {
        await updateMood(moodId, { mood_type: mood, notes: note, category: categories[0] });
      } else {
        await logMood({ mood_type: mood, notes: note, category: categories[0] });
      }
      setShowSuccess(true);
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (e: any) {
      setError(e?.error || e?.message || 'Failed to save mood');
      console.error('Mood save error:', e);
    } finally {
      setSaving(false);
    }
  };

  const selectedConfig = mood ? MOOD_CONFIG[mood] : null;

  if (loadingToday) {
    return <div className="page-wrapper flex items-center justify-center min-h-screen text-gray-500">Checking today's mood...</div>;
  }

  return (
    <div className="page-wrapper animate-fade-in relative overflow-hidden">
      <PageHeader title={isEditMode ? t('VenterMoodLog.editTitle') : t('VenterMoodLog.title')} />

      {error && (
        <div className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-2xl mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Mood Indicator */}
      {selectedConfig && (
        <div className="flex items-center gap-3 py-2">
          <span className="text-5xl">{selectedConfig.emoji}</span>
          <div>
            <p className="text-xl font-bold" style={{ color: selectedConfig.text }}>{selectedConfig.label}</p>
            <p className="text-sm text-gray-500">{t('VenterMoodLog.subtitle')}</p>
          </div>
        </div>
      )}

      {/* Mood Selector */}
      <div>
        <p className="section-label mb-3">{t('VenterMoodLog.mood', 'Select Mood')}</p>
        <MoodSelector selected={mood} onSelect={setMood} />
      </div>

      {/* Categories */}
      <div>
        <p className="section-label mb-3">{t('VenterMoodLog.whatsGoingOn')}</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all ${
                categories.includes(cat)
                ? 'border text-white'
                : 'glass text-gray-400 hover:bg-white/5'
              }`}
              style={categories.includes(cat) ? {
                background: selectedConfig ? `${selectedConfig.bg}20` : 'rgba(194,174,191,0.15)',
                color: selectedConfig?.text,
                borderColor: selectedConfig?.bg,
              } : {}}
            >
              {t(`VenterMoodLog.categories.${cat.toLowerCase().replace(' ', '')}`, cat)}
            </button>
          ))}
        </div>
      </div>

      {/* Note */}
      <div>
        <p className="section-label mb-3">{t('VenterMoodLog.notes')} (optional)</p>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder={t('VenterMoodLog.notesPlaceholder')}
          className="input-field w-full h-32 resize-none"
          maxLength={500}
        />
        <p className="text-xs text-gray-600 text-right mt-1">{note.length}/500</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-6">
        <Button variant="ghost" size="lg" onClick={() => navigate(-1)} disabled={saving}>
          {t('VenterMoodLog.cancel', 'Cancel')}
        </Button>
        <Button
          variant="primary"
          size="lg"
          loading={saving}
          disabled={!mood || showSuccess}
          onClick={handleSave}
        >
          {isEditMode ? t('VenterMoodLog.updateMoodLog', 'Update') : t('VenterMoodLog.logMood', 'Save')}
        </Button>
      </div>

      {showSuccess && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in z-50">
          <GlassCard className="text-center w-full max-w-xs transform animate-scale-up border-success/30 rounded-3xl p-8">
            <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-success text-success text-4xl">
              ✓
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Mood Logged</h3>
            <p className="text-sm text-gray-400">Your reflection has been safely saved.</p>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
