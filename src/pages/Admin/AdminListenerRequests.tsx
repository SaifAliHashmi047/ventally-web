import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Badge } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Tabs';
import { useAdmin } from '../../api/hooks/useAdmin';
import { Search, ChevronRight, FileText } from 'lucide-react';
import { toast } from 'react-toastify';

export const AdminListenerRequests = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getListenerRequests } = useAdmin();

  const TABS = [
    t('Admin.listenerRequests.pending', 'Pending'),
    t('Admin.status.active', 'Active'),
    t('Admin.listenerRequests.reject', 'Rejected')
  ];

  const STATUS_MAP: Record<string, string> = {
    [TABS[0]]: 'pending',
    [TABS[1]]: 'verified',
    [TABS[2]]: 'rejected'
  };

  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [search, setSearch] = useState('');
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const status = STATUS_MAP[activeTab];
        const res = await getListenerRequests(status);
        setRequests(res?.submissions ?? res?.requests ?? res ?? []);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || t('Common.error', 'Error'));
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [activeTab]);

  const filtered = requests.filter(req =>
    !search || (req.email || req.user?.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-wrapper page-wrapper--wide animate-fade-in pb-20">
      <PageHeader 
        title={t('Admin.listenerRequests.title', 'Support Guide Requests')} 
        centered
      />

      <div className="px-1">
        {/* Search Bar */}
        <div className="relative mb-6">
          <GlassCard padding="none" className="flex items-center px-4 h-12 border-white/10">
            <input
              type="text"
              placeholder={t('Admin.users.searchPlaceholder', 'Search users...')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder:text-white/40"
            />
            <Search size={18} className="text-white/40" />
          </GlassCard>
        </div>

        {/* Tabs */}
        <Tabs 
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          className="mb-8"
        />

        {/* List */}
        <div className="space-y-4">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="skeleton h-24 rounded-3xl" />
            ))
          ) : filtered.length > 0 ? (
            filtered.map((req) => (
              <GlassCard
                key={req.id}
                onClick={() => navigate(`/admin/listener-requests/${req.id}`)}
                className="cursor-pointer hover:bg-white/5 transition-all p-5"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl glass flex items-center justify-center border border-white/10 text-accent">
                    <FileText size={24} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-white truncate mb-1">
                      {req.email || req.user?.email || 'Unknown User'}
                    </h3>
                    <div className="flex items-center gap-3">
                      <p className="text-[10px] text-white/40 font-mono uppercase tracking-tight">
                        ID: {req.id.substring(0, 10)}...
                      </p>
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
                        {new Date(req.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={activeTab === TABS[1] ? 'success' : activeTab === TABS[2] ? 'error' : 'default'} className="uppercase text-[9px] font-bold">
                      {activeTab}
                    </Badge>
                    <ChevronRight size={18} className="text-white/20" />
                  </div>
                </div>
              </GlassCard>
            ))
          ) : (
            <div className="text-center py-20">
               <FileText className="mx-auto text-white/10 mb-4" size={48} />
               <p className="text-white/40 font-medium">{t('Admin.listenerRequests.noRequests', 'No pending requests found.')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
