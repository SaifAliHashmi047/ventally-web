import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Input } from '../../components/ui/Input';
import { Search } from 'lucide-react';

const CRISIS_DATA = [
  { id: '1234567', email: 'abc@gmail.com', type: 'call', date: '12 Nov 2025' },
  { id: '1234567', email: 'abc@gmail.com', type: 'chat', date: '12 Nov 2025' },
  { id: '1234567', email: 'abc@gmail.com', type: 'chat', date: '12 Nov 2025' },
  { id: '1234567', email: 'abc@gmail.com', type: 'chat', date: '12 Nov 2025' },
];

export const AdminCrisisLog = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = CRISIS_DATA.filter(log =>
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
          {filtered.length === 0 ? (
            <div className="text-center py-20 opacity-50">
              <p className="text-white/60">{t('Common.noData', 'No data found.')}</p>
            </div>
          ) : (
            filtered.map((log, index) => (
              <GlassCard
                key={index}
                bordered
                className={`border-white/10 bg-white/[0.02] rounded-3xl transition-all ${
                  log.type === 'chat' ? 'hover:bg-white/5 cursor-pointer' : ''
                }`}
                onClick={() => {
                  if (log.type === 'chat') {
                    navigate(`/admin/crisis/${log.id}/chat`, { state: { log } });
                  }
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-medium text-white">{t('Admin.crisisManagement.id', { id: log.id })}</span>
                  <div className="px-3 py-1 bg-white/15 rounded-full">
                    <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">
                      {log.type === 'call'
                        ? t('Admin.crisisManagement.crisisCall')
                        : t('Admin.crisisManagement.crisisChat')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">
                    {log.type === 'call' ? t('Admin.crisisManagement.callBy') : t('Admin.crisisManagement.chatBy')}
                    <span className="font-medium text-white/50">{log.email}</span>
                  </span>
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
