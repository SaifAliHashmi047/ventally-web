import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { MOOD_CONFIG, type MoodType } from '../../components/ui/MoodSelector';
import { useMood } from '../../api/hooks/useMood';
import { Plus, ChevronRight } from 'lucide-react';

export const VenterMoods = () => {
  const navigate = useNavigate();
  const { getMoodHistory } = useMood();
  const [moods, setMoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getMoodHistory(30, 0);
        setMoods(res?.moods ?? []);
      } catch { /* ignore */ } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader
        title="Mood History"
        rightContent={
          <Button variant="primary" size="sm" leftIcon={<Plus size={16} />} onClick={() => navigate('/venter/mood/log')}>
            Log Mood
          </Button>
        }
      />

      <div className="flex gap-2 flex-wrap">
        <button onClick={() => navigate('/venter/mood/trends')} className="px-4 py-2 glass rounded-2xl text-sm text-gray-400 hover:text-white transition-colors">
          📈 Trends
        </button>
        <button onClick={() => navigate('/venter/mood/history')} className="px-4 py-2 glass rounded-2xl text-sm text-gray-400 hover:text-white transition-colors">
          📅 Calendar View
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>
      ) : moods.length === 0 ? (
        <EmptyState
          title="No mood logs yet"
          description="Start tracking how you feel each day."
          action={<Button variant="accent" size="sm" onClick={() => navigate('/venter/mood/log')}>Log First Mood</Button>}
        />
      ) : (
        <div className="space-y-3">
          {moods.map((m: any) => {
            const moodKey = m.mood_type?.toLowerCase() as MoodType;
            const config = MOOD_CONFIG[moodKey] || { emoji: '😶', label: m.mood_type, bg: '#333', text: '#aaa' };
            return (
              <GlassCard
                key={m.id}
                hover
                onClick={() => navigate('/venter/mood/log', { state: { editMode: true, selectedMood: moodKey, item: m } })}
                padding="md"
                rounded="2xl"
                className="cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: `${config.bg}30` }}>
                    {config.emoji}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: config.text }}>{config.label}</p>
                    {m.notes && <p className="text-xs text-gray-500 mt-0.5 truncate">{m.notes}</p>}
                    <p className="text-xs text-gray-600 mt-1">
                      {new Date(m.updated_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-gray-500" />
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
};
