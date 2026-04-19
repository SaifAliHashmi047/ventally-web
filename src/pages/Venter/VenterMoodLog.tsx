import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { MoodSelector, type MoodType, MOOD_CONFIG } from '../../components/ui/MoodSelector';
import { useMood } from '../../api/hooks/useMood';
import { toastSuccess, toastError } from '../../utils/toast';

// Category options — exact match with RN app keys
const CATEGORY_OPTIONS = [
  { id: 'work',    labelKey: 'VenterMoodLog.categories.work' },
  { id: 'family',  labelKey: 'VenterMoodLog.categories.family' },
  { id: 'health',  labelKey: 'VenterMoodLog.categories.health' },
  { id: 'unknown', labelKey: 'VenterMoodLog.categories.unknown' },
];

export const VenterMoodLog = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { getTodayMood, logMood, updateMood } = useMood();
  const submittingRef = useRef(false);

  const state = location.state as any;

  // ── State ──────────────────────────────────────────────────────────────────
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(
    (state?.selectedMood as MoodType) ?? null
  );
  // Single-select category — matches RN behaviour
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    state?.item?.categories?.[0] ?? null
  );
  const [notes, setNotes] = useState<string>(state?.item?.note ?? '');
  const [isEditMode, setIsEditMode] = useState<boolean>(!!state?.editMode);
  const [loading, setLoading] = useState(false);

  // ── Sync edit item into state (mirrors native app's second useEffect) ─────────
  useEffect(() => {
    if (!state?.editMode || !state?.item) return;

    const editItem = state.item;

    // Pre-fill mood if passed
    if (editItem?.mood && !state?.selectedMood) {
      setSelectedMood(editItem.mood.toLowerCase() as MoodType);
    }

    // Pre-fill category — always lowercase to match option IDs
    if (editItem?.categories && Array.isArray(editItem.categories) && editItem.categories.length > 0) {
      setSelectedCategory(editItem.categories[0]?.toLowerCase() ?? null);
    }

    // Pre-fill notes
    if (typeof editItem?.note === 'string') {
      setNotes(editItem.note);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── On mount: check if mood already logged today ───────────────────────────
  useEffect(() => {
    // If we were already told it's edit mode from the dashboard, skip the check
    if (state?.editMode) return;

    const checkTodayMood = async () => {
      setLoading(true);
      try {
        const res = await getTodayMood();
        if (res?.mood) {
          // Mood already logged → switch to edit mode silently
          setIsEditMode(true);
          // Only pre-fill mood if none was passed via navigation state
          if (!state?.selectedMood) {
            setSelectedMood(res.mood.mood_type?.toLowerCase() as MoodType);
          }
          setNotes(res.mood.notes || '');
          if (res.mood.category) {
            setSelectedCategory(res.mood.category.toLowerCase());
          }
        }
      } catch {
        // No mood logged today — stay in log mode
      } finally {
        setLoading(false);
      }
    };

    checkTodayMood();
  }, []);

  // ── Category toggle (single-select, same as RN) ────────────────────────────
  const handleCategorySelect = (id: string) => {
    setSelectedCategory(prev => (prev === id ? null : id));
  };

  // ── Save / Update ──────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!selectedMood) {
      toastError(t('VenterMoodLog.errors.selectMoodAndCategory'));
      return;
    }
    if (submittingRef.current) return;
    submittingRef.current = true;

    const category = selectedCategory || 'unknown';

    // Capitalise first letter to match API expectation: 'happy' → 'Happy'
    const capitalize = (s: string) =>
      s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

    const payload = {
      mood_type: capitalize(selectedMood),
      category:  capitalize(category),
      notes:     notes.trim(),
    };

    try {
      if (isEditMode) {
        // PUT mood/today
        await updateMood('today', payload);
        toastSuccess(t('VenterMoodLog.success.updated'));
      } else {
        try {
          // POST mood/log
          await logMood(payload);
          toastSuccess(t('VenterMoodLog.success.logged'));
        } catch (logErr: any) {
          // 409 = already logged today → auto-switch to update
          if (logErr?.statusCode === 409) {
            await updateMood('today', payload);
            toastSuccess(t('VenterMoodLog.success.updated'));
          } else {
            throw logErr;
          }
        }
      }

      // Navigate back after a short delay so the toast is visible
      setTimeout(() => navigate(-1), 1200);
    } catch (err: any) {
      const statusCode = err?.statusCode;
      if (statusCode === 403) {
        toastError(t('Common.somethingWentWrong'));
      } else {
        toastError(err?.error || err?.message || t('Common.somethingWentWrong'));
      }
    } finally {
      submittingRef.current = false;
    }
  };

  // ── Derived ────────────────────────────────────────────────────────────────
  const moodConfig = selectedMood ? MOOD_CONFIG[selectedMood] : null;

  const title = isEditMode
    ? t('VenterMoodLog.editTitle')
    : t('VenterMoodLog.title');

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title={title} onBack={() => navigate(-1)} />

      {/* Mood indicator */}
      {moodConfig && (
        <div className="flex items-center gap-3 py-1 mb-2">
          <img
            src={moodConfig.icon}
            alt={moodConfig.label}
            className="w-12 h-12 object-contain"
            style={{
              filter: `brightness(0) saturate(100%) ${
                selectedMood === 'happy'   ? 'invert(72%) sepia(18%) saturate(600%) hue-rotate(115deg) brightness(95%) contrast(90%)' :
                selectedMood === 'neutral' ? 'invert(75%) sepia(30%) saturate(500%) hue-rotate(185deg) brightness(105%) contrast(95%)' :
                selectedMood === 'sad'     ? 'invert(70%) sepia(20%) saturate(500%) hue-rotate(200deg) brightness(105%) contrast(90%)' :
                selectedMood === 'anxious' ? 'invert(85%) sepia(50%) saturate(600%) hue-rotate(10deg) brightness(105%) contrast(95%)' :
                                             'invert(60%) sepia(30%) saturate(500%) hue-rotate(320deg) brightness(105%) contrast(90%)'
              }`,
            }}
          />
          <div>
            <p className="text-xl font-bold" style={{ color: moodConfig.text }}>{t(moodConfig.labelKey, moodConfig.label)}</p>
            <p className="text-sm text-gray-500">{t('VenterMoodLog.subtitle')}</p>
          </div>
        </div>
      )}

      {/* ── Mood selector ──────────────────────────────────────────────────── */}
      <MoodSelector
        selected={selectedMood}
        onSelect={setMood => setSelectedMood(setMood)}
        disabled={loading}
      />

      {/* ── What's going on + categories + notes ──────────────────────────── */}
      <GlassCard bordered>
        {/* What's going on */}
        <p className="text-sm font-medium text-white text-center mb-4">
          {t('VenterMoodLog.whatsGoingOn')}
        </p>

        {/* Categories — single-select, matches RN */}
        <div className="flex flex-wrap gap-2 mb-5">
          {CATEGORY_OPTIONS.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  isSelected
                    ? 'text-white'
                    : 'glass text-gray-400 border-white/10 hover:bg-white/5'
                }`}
                style={
                  isSelected
                    ? {
                        background: 'rgba(209,242,226,0.15)',
                        borderColor: '#68BDA1',
                        color: '#68BDA1',
                      }
                    : {}
                }
              >
                {t(cat.labelKey)}
              </button>
            );
          })}
        </div>

        {/* Notes textarea */}
        <div
          className="rounded-2xl border border-white/10 overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        >
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder={t('VenterMoodLog.notesPlaceholder')}
            className="w-full h-28 resize-none bg-transparent px-4 py-3 text-sm text-white placeholder-gray-500 outline-none"
            maxLength={500}
          />
        </div>
        <p className="text-xs text-gray-600 text-right mt-1">{notes.length}/500</p>
      </GlassCard>

      {/* ── Action buttons ─────────────────────────────────────────────────── */}
      <Button
        variant="primary"
        size="lg"
        fullWidth
        loading={loading}
        disabled={!selectedMood || loading}
        onClick={handleSave}
      >
        {isEditMode
          ? t('VenterMoodLog.updateMoodLog')
          : t('VenterMoodLog.logMood')}
      </Button>

      <Button
        variant="glass"
        size="lg"
        fullWidth
        disabled={loading}
        onClick={() => navigate(-1)}
        className="mt-2"
      >
        {t('VenterMoodLog.cancel')}
      </Button>
    </div>
  );
};
