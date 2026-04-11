import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { MoodSelector, type MoodType, MOOD_CONFIG } from '../../components/ui/MoodSelector';
import { useMood } from '../../api/hooks/useMood';

const CATEGORIES = [
  'Work', 'Family', 'Relationships', 'Health', 'Finances', 'Social', 'Personal Growth', 'Other'
];

export const VenterMoodLog = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logMood, updateMood } = useMood();
  const state = location.state as any;

  const [mood, setMood] = useState<MoodType | null>(state?.selectedMood ?? null);
  const [note, setNote] = useState(state?.item?.note ?? '');
  const [categories, setCategories] = useState<string[]>(state?.item?.categories ?? []);
  const [saving, setSaving] = useState(false);
  const editMode = !!state?.editMode;

  const toggleCategory = (cat: string) => {
    setCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const handleSave = async () => {
    if (!mood) return;
    setSaving(true);
    try {
      if (editMode && state?.item?.id) {
        await updateMood(state.item.id, { mood_type: mood, notes: note, category: categories[0] });
      } else {
        await logMood({ mood_type: mood, notes: note, category: categories[0] });
      }
      navigate(-1);
    } catch (e) {
      console.error('Mood save error:', e);
    } finally {
      setSaving(false);
    }
  };

  const selectedConfig = mood ? MOOD_CONFIG[mood] : null;

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title={editMode ? 'Edit Mood' : 'Log Your Mood'} />

      {/* Mood Indicator */}
      {selectedConfig && (
        <div className="flex items-center gap-3 py-2">
          <span className="text-5xl">{selectedConfig.emoji}</span>
          <div>
            <p className="text-xl font-bold" style={{ color: selectedConfig.text }}>{selectedConfig.label}</p>
            <p className="text-sm text-gray-500">How you're feeling</p>
          </div>
        </div>
      )}

      {/* Mood Selector */}
      <div>
        <p className="section-label mb-3">Select Mood</p>
        <MoodSelector selected={mood} onSelect={setMood} />
      </div>

      {/* Categories */}
      <div>
        <p className="section-label mb-3">What's it about? (optional)</p>
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
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Note */}
      <div>
        <p className="section-label mb-3">Add a note (optional)</p>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="What's on your mind today?"
          className="input-field w-full h-32 resize-none"
          maxLength={500}
        />
        <p className="text-xs text-gray-600 text-right mt-1">{note.length}/500</p>
      </div>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        loading={saving}
        disabled={!mood}
        onClick={handleSave}
      >
        {editMode ? 'Update Mood' : 'Save Mood'}
      </Button>
    </div>
  );
};
