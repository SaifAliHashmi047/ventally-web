import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { useMood } from '../../api/hooks/useMood';
import { MOOD_CONFIG, type MoodType } from '../../components/ui/MoodSelector';

// Simple monthly calendar-style mood display
export const VenterMoodHistory = () => {
  const navigate = useNavigate();
  const { getMoodHistory } = useMood();
  const [moods, setMoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await getMoodHistory(60, 0);
        setMoods(res?.moods ?? []);
      } catch { /* ignore */ } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Group by month
  const grouped: Record<string, any[]> = {};
  moods.forEach(m => {
    const date = new Date(m.updated_at);
    const key = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(m);
  });

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title="Mood History" subtitle="Your complete mood log" />

      {loading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-32 rounded-3xl" />)}</div>
      ) : moods.length === 0 ? (
        <EmptyState title="No mood logs" description="Start tracking your moods!" action={<Button variant="accent" size="sm" onClick={() => navigate('/venter/mood/log')}>Log Mood</Button>} />
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([month, entries]) => (
            <div key={month}>
              <p className="section-label mb-3">{month}</p>
              <div className="space-y-2">
                {entries.map((m: any) => {
                  const moodKey = m.mood_type?.toLowerCase() as MoodType;
                  const config = MOOD_CONFIG[moodKey] || { emoji: '😶', label: m.mood_type, bg: '#333', text: '#aaa' };
                  return (
                    <GlassCard
                      key={m.id}
                      hover
                      padding="sm"
                      rounded="2xl"
                      onClick={() => navigate('/venter/mood/log', { state: { editMode: true, selectedMood: moodKey, item: m } })}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{config.emoji}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold capitalize" style={{ color: config.text }}>{config.label}</p>
                            {m.category && (
                              <span className="text-xs text-gray-600 bg-white/5 px-2 py-0.5 rounded-full">{m.category}</span>
                            )}
                          </div>
                          {m.notes && <p className="text-xs text-gray-500 truncate mt-0.5">{m.notes}</p>}
                        </div>
                        <p className="text-xs text-gray-600 flex-shrink-0">
                          {new Date(m.updated_at).toLocaleDateString('en-US', { day: 'numeric', weekday: 'short' })}
                        </p>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
