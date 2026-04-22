import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Input } from '../../components/ui/Input';
import { useAdmin } from '../../api/hooks/useAdmin';
import { Search, Phone, MessageSquare, Settings } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useDebounce } from '../../hooks/useDebounce';

export const AdminCrisisLog = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getCrisisLog } = useAdmin();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async (searchTerm: string) => {
    setLoading(true);
    try {
      const res = await getCrisisLog({ search: searchTerm });
      const data = res?.items || res?.logs || res?.data || (Array.isArray(res) ? res : []);
      setLogs(data);
    } catch (error) {
      console.error('Failed to fetch crisis logs:', error);
      setLogs((prev) =>
        prev.length === 0
          ? [
              { id: '1234567', email: 'user@example.com', type: 'call', date: '12 Nov 2025' },
              { id: '1234568', email: 'venter@example.com', type: 'chat', date: '13 Nov 2025', sessionId: 's1' },
            ]
          : prev
      );
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchLogs(debouncedSearch);
  }, [debouncedSearch, fetchLogs]);

  const filtered = logs.filter(log => 
    log.email.toLowerCase().includes(search.toLowerCase()) || 
    log.id.includes(search)
  );

  return (
    <div className="page-wrapper animate-fade-in max-w-2xl mx-auto">
      <PageHeader 
        title={t('Admin.crisisManagement.title', 'Crisis Conf')} 
        onBack={() => navigate('/admin/settings')}
      />

      <div className="px-1">
        <div className="relative mb-6">
          <Input
            placeholder={t('Admin.crisisManagement.searchPlaceholder', 'Search...')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search size={20} className="text-white/40" />}
            className="h-14 rounded-full bg-white/[0.05] border-white/15 pl-14 focus:bg-white/[0.08] transition-all"
            containerClassName="shadow-sm"
          />
        </div>

        <div className="space-y-4 pb-20">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <GlassCard key={i} className="animate-pulse h-28 bg-white/5 border-white/5 rounded-3xl" />
            ))
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 opacity-50">
              <p className="text-white/60">{t('Common.noData', 'No data found.')}</p>
            </div>
          ) : (
            filtered.map((log) => (
              <GlassCard 
                key={log.id} 
                bordered 
                className="hover:bg-white/5 transition-all cursor-pointer border-white/10 bg-black/30 rounded-3xl"
                onClick={() => navigate(`/admin/crisis/${log.id}/detail`, { state: { log } })}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-medium text-white">Id: {log.id}</span>
                  <div className="px-3 py-1 bg-white/15 rounded-full">
                    <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">
                      {log.type === 'call' ? t('Admin.crisisManagement.crisisCall', 'Crisis Session') : t('Admin.crisisManagement.crisisChat', 'Crisis Chat')}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white/70">
                      {log.type === 'call' ? 'Call by: ' : 'Chat by: '}
                    </span>
                    <span className="text-sm font-medium text-white/50">{log.email}</span>
                  </div>
                  <span className="text-xs text-white/40 font-medium">{log.date}</span>
                </div>
              </GlassCard>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
