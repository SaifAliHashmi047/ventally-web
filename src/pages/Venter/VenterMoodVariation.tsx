import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '../../locales/i18n';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { MoodBarChart } from '../../components/charts/MoodBarChart';
import { useMood } from '../../api/hooks/useMood';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ── Mood emoji map — matches native icon assets ──────────────────────────────
const MOOD_EMOJI: Record<string, string> = {
  happy:   '😊',
  neutral: '😐',
  sad:     '😢',
  anxious: '😰',
  mad:     '😠',
};

const MOOD_COLORS: Record<string, string> = {
  happy:   '#68BDA1',
  neutral: '#75BFFF',
  sad:     '#85AFFF',
  anxious: '#FFD746',
  mad:     '#EA7B7B',
};

const parseMoodDistribution = (res: any) => {
  if (!res?.mood_distribution) return [];
  const moods = ['happy', 'neutral', 'sad', 'anxious', 'mad'];
  const map: Record<string, number> = {};
  res.mood_distribution.forEach((d: any) => {
    if (d.mood_type) map[d.mood_type.toLowerCase()] = parseInt(d.count, 10) || 0;
  });
  return moods.map(m => ({ label: m, value: map[m] || 0 }));
};

const pad = (n: number) => n.toString().padStart(2, '0');

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const VenterMoodVariation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getMoodStats, getMoodHistory } = useMood();

  const today = new Date();
  const [loading, setLoading] = useState(true);
  const [moodData, setMoodData] = useState<{ label: string; value: number }[]>([]);
  // Map of day → mood string for current calendar month
  const [historyMap, setHistoryMap] = useState<Record<number, string>>({});
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed

  // ── Fetch 30-day stats for the bar chart (matches native fetchStats(30)) ───
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getMoodStats(30);
        setMoodData(parseMoodDistribution(res));
      } catch { /* ignore */ } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // ── Fetch mood history per calendar month (matches native fetchHistory) ─────
  const fetchHistory = useCallback(async (month: number, year: number) => {
    try {
      const start = `${year}-${pad(month + 1)}-01`;
      const lastDay = new Date(year, month + 1, 0).getDate();
      const end = `${year}-${pad(month + 1)}-${pad(lastDay)}`;

      const res = await getMoodHistory(100, 0, start, end);
      const moods: any[] = res?.moods ?? res?.data ?? [];

      const map: Record<number, string> = {};
      moods.forEach((mood: any) => {
        const raw = mood.logged_date || mood.updated_at || mood.created_at || '';
        const dateOnly = raw.substring(0, 10); // 'YYYY-MM-DD'
        const [y, m, d] = dateOnly.split('-').map(Number);
        const date = new Date(y, m - 1, d);
        if (date.getMonth() === month && date.getFullYear() === year) {
          map[date.getDate()] = (mood.mood_type || '').toLowerCase();
        }
      });
      setHistoryMap(map);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    fetchHistory(currentMonth, currentYear);
  }, [currentMonth, currentYear, fetchHistory]);

  // ── Month navigation ─────────────────────────────────────────────────────────
  const goPrevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };
  const goNextMonth = () => {
    const next = new Date(currentYear, currentMonth + 1, 1);
    if (next > today) return;
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };
  const isNextDisabled = useMemo(() =>
    currentYear > today.getFullYear() ||
    (currentYear === today.getFullYear() && currentMonth >= today.getMonth()),
  [currentYear, currentMonth, today]);

  // ── Calendar grid ────────────────────────────────────────────────────────────
  const calendarCells = useMemo(() => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  }, [currentYear, currentMonth]);

  const monthLabel = new Date(currentYear, currentMonth, 1).toLocaleString(i18n.language, {
    month: 'long', year: 'numeric',
  });

  // variation is always 'Moderate' in native (not returned from API)
  const variation = t('VenterJourney.moodVariation.moderate', 'Moderate');

  return (
    <div className="page-wrapper page-wrapper--wide animate-fade-in pb-10">
      <PageHeader
        title={t('VenterJourney.moodVariation.title', 'Mood Variation')}
        onBack={() => navigate(-1)}
      />

      {/* ── Variation label — matches native headerSection ── */}
      <div className="mb-6">
        <p className="text-base font-semibold text-white">
          {t('VenterJourney.moodVariation.variationLevel', 'Variation Level:')}
        </p>
        <p className="text-sm text-white/60 mt-1">{variation}</p>
      </div>

      {/* ── Mood chart (30 days) — matches native MoodChart ── */}
      <div className="mb-8">
        {loading ? (
          <div className="skeleton rounded-3xl h-52" />
        ) : (
          <GlassCard style={{ background: 'rgba(0,0,0,0.15)' }}>
            <p className="text-sm font-medium text-white mb-6">
              {t('VenterJourney.moodTrends.moodOverTime', 'Mood Over Time')}
            </p>
            <MoodBarChart data={moodData} />
          </GlassCard>
        )}
      </div>

      {/* ── Mood calendar — matches native GlassView bordered calendarCard ── */}
      <GlassCard bordered style={{ background: 'rgba(0,0,0,0.15)' }}>
        {/* Calendar header */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm font-medium text-white">{monthLabel}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={goPrevMonth}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
            >
              <ChevronLeft size={18} className="text-white" />
            </button>
            <button
              onClick={goNextMonth}
              disabled={isNextDisabled}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors disabled:opacity-30"
            >
              <ChevronRight size={18} className="text-white" />
            </button>
          </div>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-7 mb-4">
          {DAY_LABELS.map(d => (
            <div key={d} className="text-center text-xs text-white/40 font-medium">{d}</div>
          ))}
        </div>

        {/* Days grid — each cell: emoji icon (if mood) + day number */}
        <div className="grid grid-cols-7 gap-y-2">
          {calendarCells.map((day, idx) => {
            const moodKey = day ? historyMap[day] : undefined;
            const emoji = moodKey ? MOOD_EMOJI[moodKey] : undefined;
            const color = moodKey ? MOOD_COLORS[moodKey] : undefined;
            const isFuture = day ? new Date(currentYear, currentMonth, day) > today : false;

            return (
              <div
                key={idx}
                className="flex flex-col items-center"
                style={{ opacity: isFuture ? 0.3 : 1 }}
              >
                {/* Icon wrapper — matches native iconWrapper */}
                <div
                  className="w-7 h-7 flex items-center justify-center rounded-sm mb-0.5 text-base"
                  style={
                    emoji
                      ? { background: (color ?? '#ffffff') + '1a' }
                      : { background: 'rgba(255,255,255,0.06)' }
                  }
                >
                  {emoji && <span style={{ fontSize: 15 }}>{emoji}</span>}
                </div>
                {/* Day number */}
                <span className="text-xs text-white/80">{day ?? ''}</span>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
};
