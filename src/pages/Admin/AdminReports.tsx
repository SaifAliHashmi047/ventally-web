import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Tabs } from '../../components/ui/Tabs';
import { useAdmin } from '../../api/hooks/useAdmin';
import { ChevronRight, Flag } from 'lucide-react';

export const AdminReports = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getReports } = useAdmin();
  
  const TABS = [
    t('Admin.review.pending', 'Pending'),
    t('Common.status.resolved', 'Resolved')
  ];

  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const LIMIT = 15;

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const offset = (page - 1) * LIMIT;
        // Map tab to status: Pending -> 'open', Resolved -> 'resolved'
        const status = activeTab === TABS[0] ? 'open' : 'resolved';
        const res = await getReports(status, LIMIT, offset);
        setReports(res?.reports ?? []);
      } catch { /* ignore */ } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [activeTab, page]);

  return (
    <div className="page-wrapper page-wrapper--wide animate-fade-in pb-20">
      <PageHeader title={t('Admin.reports.title', 'Reports')} centered />

      <div className="px-1">
        {/* Tabs */}
        <Tabs 
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          className="mb-8"
        />

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton h-32 rounded-3xl" />
            ))}
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-20">
             <Flag className="mx-auto text-white/10 mb-4" size={48} />
             <p className="text-white/40 font-medium">{t('Admin.reports.noReports', 'No reports found.')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report: any) => (
              <GlassCard 
                key={report.id} 
                onClick={() => navigate(`/admin/reports/${report.id}`)} 
                className="cursor-pointer hover:bg-white/5 transition-all p-5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-base font-bold text-white truncate">
                        ID: {report.id}
                      </h3>
                      <Badge variant={report.status === 'open' ? 'error' : 'success'} dot className="uppercase text-[9px] font-bold">
                        {report.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm font-bold text-magenda mb-1">
                      {report.reason}
                    </p>
                    
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-[11px] text-white/40 uppercase tracking-wider font-medium">
                        {new Date(report.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                      <ChevronRight size={18} className="text-white/20" />
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
