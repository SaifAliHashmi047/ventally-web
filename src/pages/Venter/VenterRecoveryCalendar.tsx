import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { useRecovery } from '../../api/hooks/useRecovery';
import { Calendar as CalendarIcon, Target } from 'lucide-react';
import { cn } from '../../utils/cn';

export const VenterRecoveryCalendar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getSobrietyHistory } = useRecovery();
  
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    // In a real app we would fetch by month, here we fetch top history
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getSobrietyHistory(50, 0);
        // Native uses res.events, not res.history
        setHistory(res?.events ?? res?.history ?? []);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    
    return { daysInMonth, firstDay };
  };

  const { daysInMonth, firstDay } = getDaysInMonth(currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Create a map for quick lookup
  const eventsMap = history.reduce((acc, event) => {
    // Native uses event.event_date — matches SobrietyEvent type
    const d = new Date(event.event_date || event.created_at);
    if (d.getMonth() === currentMonth.getMonth() && d.getFullYear() === currentMonth.getFullYear()) {
      acc[d.getDate()] = event;
    }
    return acc;
  }, {} as Record<number, any>);

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader 
        title={t('VenterRecovery.dashboard.journeyCalendar', 'Journey Calendar')} 
        onBack={() => navigate(-1)} 
      />

      <GlassCard className="mt-4 p-4">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-2 glass rounded-full hover:bg-white/10 transition">
            &lt;
          </button>
          <h2 className="text-lg font-bold text-white">
            {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <button onClick={nextMonth} className="p-2 glass rounded-full hover:bg-white/10 transition">
            &gt;
          </button>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs text-gray-500 font-medium">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {blanks.map(b => (
            <div key={`blank-${b}`} className="aspect-square" />
          ))}
          {loading ? (
            days.map(d => (
              <div key={d} className="aspect-square skeleton rounded-xl" />
            ))
          ) : (
            days.map(day => {
              const event = eventsMap[day];
              const isRelapse = event?.event_type === 'relapse';
              const isSuccess = event?.event_type === 'success' || (event && !isRelapse);
              
              return (
                <div 
                  key={day} 
                  onClick={() => event && navigate(`/venter/recovery/details/${event.id}`, { state: { entry: event } })}
                  className={cn(
                    "aspect-square rounded-xl flex items-center justify-center text-sm relative transition-all",
                    event ? "cursor-pointer" : "",
                    isRelapse && "bg-error/20 border border-error/30 text-white",
                    isSuccess && "bg-success/20 border border-success/30 text-white",
                    !event && "glass border border-transparent text-gray-400"
                  )}
                >
                  {day}
                </div>
              );
            })
          )}
        </div>
      </GlassCard>

      <div className="mt-6 flex flex-col gap-2">
        <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-success/50 border border-success/50" />
            <span className="text-sm text-gray-400">{t('VenterRecovery.success', 'Success')}</span>
        </div>
        <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-error/50 border border-error/50" />
            <span className="text-sm text-gray-400">{t('VenterRecovery.relapse', 'Slip')}</span>
        </div>
      </div>
    </div>
  );
};
