import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, UserCheck } from 'lucide-react';
import { useAdmin } from '../../api/hooks/useAdmin';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Tabs } from '../../components/ui/Tabs';
import { Badge } from '../../components/ui/Badge';
import { toast } from 'react-toastify';

export const AdminUsers = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { adminListUsers } = useAdmin();

  const TABS = [
    t('Admin.users.tabs.venters', 'Venters'),
    t('Admin.users.tabs.listeners', 'Support Guides')
  ];

  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const role = activeTab === TABS[1] ? 'listener' : 'venter';
        const res = await adminListUsers(search, role, 100, 0);
        if (res?.users) {
          setUsers(res.users);
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || t('Common.error', 'Error'));
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [activeTab]);

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(search.toLowerCase()) || 
    user.displayName?.toLowerCase().includes(search.toLowerCase()) ||
    user.id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-wrapper animate-fade-in pb-20">
      <PageHeader 
        title={t('Admin.users.title', 'Users')} 
        centered
        rightContent={
          <button 
            onClick={() => navigate('/admin/requests')}
            className="w-10 h-10 glass rounded-2xl flex items-center justify-center text-white/80 hover:bg-white/10"
          >
            <UserCheck size={20} />
          </button>
        }
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
        />

        {/* Users List */}
        <div className="space-y-4">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="skeleton h-32 rounded-3xl" />
            ))
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <GlassCard
                key={user.id}
                onClick={() => navigate(`/admin/users/${user.id}`)}
                className="cursor-pointer hover:bg-white/5 transition-all p-5"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-white truncate mb-1">
                      {user.email || user.displayName || 'Unknown User'}
                    </h3>
                    <p className="text-[11px] text-white/40 uppercase tracking-wider font-medium">
                      {t('Admin.subAdminProfile.id', 'ID')}: {user.id.substring(0, 12)}...
                    </p>
                  </div>
                  {user.isVenter && user.isListener && (
                    <Badge className="bg-magenda/20 text-magenda border-magenda/20">
                      {t('Admin.users.card.both', 'Both')}
                    </Badge>
                  )}
                  {user.status === 'suspended' && (
                    <Badge variant="error" dot>
                      Suspended
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-10 border-t border-white/5 pt-4 mt-1">
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1 font-semibold">
                      {t('Admin.users.card.sessions', 'Sessions')}
                    </p>
                    <p className="text-base font-bold text-white leading-none">
                      {user.totalSessions || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1 font-semibold">
                      {t('Admin.users.card.minutes', 'Minutes')}
                    </p>
                    <p className="text-base font-bold text-white leading-none">
                      {Math.round(user.totalMinutes || 0)}
                    </p>
                  </div>
                </div>
              </GlassCard>
            ))
          ) : (
            <div className="text-center py-20">
              <p className="text-white/40 font-medium">{t('Common.noResults', 'No users found.')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
