import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { useAdmin } from '../../api/hooks/useAdmin';
import { 
  Download, Search, Filter, 
  CheckCircle2, FileText, ChevronRight 
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { Input } from '../../components/ui/Input';

export const AdminExports = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getIntegrations, updateExportStatus, exportIntegrationsPDF } = useAdmin();

  const [search, setSearch] = useState('');
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [exportingId, setExportingId] = useState<string | null>(null);

  const fetchIntegrations = async () => {
    setLoading(true);
    try {
      const res = await getIntegrations({ search });
      setIntegrations(res?.items || []);
    } catch {
      // Mock data for parity demo if API fails
      setIntegrations([
        { 
          id: '1234567', email: 'v.smith@example.com', accountType: 'Venter', 
          exportStatus: 'pending', 
          stats: { totalSessions: 12, totalMinutes: 450, totalPayout: 0 } 
        },
        { 
          id: 'l882731', email: 'l.johnson@ventally.co', accountType: 'Listener', 
          exportStatus: 'exported', 
          stats: { totalSessions: 145, totalMinutes: 3200, totalPayout: 850.50 } 
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const handleToggleExport = async (item: any) => {
    const isExported = item.exportStatus === 'exported';
    setExportingId(item.id);
    
    try {
      if (!isExported) {
        await updateExportStatus(item.id, { exported: true });
        toast.success(t('Admin.exportsIntegrations.exportSuccess', 'Marked as exported'));
        fetchIntegrations();
      } else {
        // Download PDF
        const data = await exportIntegrationsPDF({ userId: item.id });
        const url = window.URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `export-${item.id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success('PDF generated successfully');
      }
    } catch (error) {
      toast.error('Export failed');
    } finally {
      setExportingId(null);
    }
  };

  return (
    <div className="page-wrapper animate-fade-in pb-20">
      <PageHeader 
        title={t('Admin.exportsIntegrations.title', 'Exports & Integrations')} 
        onBack={() => navigate('/admin/settings')}
      />

      <div className="px-1">
        <Input
          placeholder={t('Admin.exportsIntegrations.searchPlaceholder', 'Search integrations...')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search size={18} className="text-white/40" />}
          className="mb-6 h-12"
        />

        <div className="space-y-6">
          {loading ? (
            [...Array(2)].map((_, i) => (
              <GlassCard key={i} className="animate-pulse h-64 bg-white/[0.02]" />
            ))
          ) : integrations.length === 0 ? (
            <div className="text-center py-20 opacity-50">
              <p>{t('Common.noData', 'No data found.')}</p>
            </div>
          ) : (
            integrations.map((item) => {
              const isExported = item.exportStatus === 'exported';
              return (
                <GlassCard key={item.id} bordered className="bg-white/[0.02] border-white/10 overflow-hidden" padding="none">
                  {/* Card Header Info */}
                  <div className="p-5 pb-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-lg font-bold text-white truncate max-w-[70%]">{item.email}</h3>
                      <div className="px-3 py-0.5 bg-white/10 rounded-full">
                        <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{item.accountType}</span>
                      </div>
                    </div>
                    <p className="text-sm text-white/40 mb-3 underline decoration-white/10">ID: {item.id}</p>
                    
                    <div className="flex gap-6 mt-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-tighter text-white/30 font-bold mb-1">Sessions</span>
                        <span className="text-sm font-medium text-white/80">{item.stats?.totalSessions || 0}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-tighter text-white/30 font-bold mb-1">Minutes</span>
                        <span className="text-sm font-medium text-white/80">{item.stats?.totalMinutes || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-0 border-y border-white/5 bg-white/[0.02]">
                    <div className="p-4 border-r border-white/5 flex flex-col gap-1">
                      <span className="text-[10px] text-white/30 leading-none">Total Sessions</span>
                      <span className="text-lg font-bold text-white">{item.stats?.totalSessions?.toLocaleString() || 0}</span>
                    </div>
                    <div className="p-4 border-r border-white/5 flex flex-col gap-1">
                      <span className="text-[10px] text-white/30 leading-none">Total Minutes</span>
                      <span className="text-lg font-bold text-white">{item.stats?.totalMinutes?.toLocaleString() || 0}</span>
                    </div>
                    <div className="p-4 flex flex-col gap-1">
                      <span className="text-[10px] text-white/30 leading-none">Total Payout</span>
                      <span className="text-lg font-bold text-white">${item.stats?.totalPayout?.toLocaleString() || 0}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="p-5 bg-white/[0.01]">
                    <Button
                      variant={isExported ? "glass" : "primary"}
                      fullWidth
                      className="rounded-full h-12 font-bold border-white/10"
                      loading={exportingId === item.id}
                      onClick={() => handleToggleExport(item)}
                    >
                      {isExported 
                        ? t('Admin.exportsIntegrations.exported', 'Exported') 
                        : t('Admin.exportsIntegrations.export', 'Export')}
                    </Button>
                  </div>
                </GlassCard>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
