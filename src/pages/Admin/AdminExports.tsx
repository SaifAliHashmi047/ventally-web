import { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { useAdmin } from '../../api/hooks/useAdmin';
import { 
  Download, FileSpreadsheet, Users, MessageSquare, 
  Wallet, ShieldAlert, ChevronRight, CheckCircle2 
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

export const AdminExports = () => {
  const { t } = useTranslation();
  const { exportData } = useAdmin();
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExport = async (type: string, filename: string) => {
    setExporting(type);
    try {
      const data = await exportData(type);
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(`${filename} exported successfully`);
    } catch (error) {
      toast.error(`Failed to export ${filename}`);
    } finally {
      setExporting(null);
    }
  };

  const EXPORT_OPTIONS = [
    { 
      id: 'users', 
      title: 'User Data', 
      desc: 'All venters and listeners with basic account info', 
      icon: Users, 
      color: 'text-primary' 
    },
    { 
      id: 'sessions', 
      title: 'Chat Sessions', 
      desc: 'Full history of completed and active chat sessions', 
      icon: MessageSquare, 
      color: 'text-accent' 
    },
    { 
      id: 'financials', 
      title: 'Financial Reports', 
      desc: 'Payouts, earnings, and transaction history', 
      icon: Wallet, 
      color: 'text-success' 
    },
    { 
      id: 'reports', 
      title: 'Moderation Reports', 
      desc: 'Detailed log of user reports and actions taken', 
      icon: ShieldAlert, 
      color: 'text-error' 
    },
  ];

  return (
    <div className="page-wrapper animate-fade-in max-w-3xl mx-auto">
      <PageHeader title={t('Admin.settings.options.exportsIntegrations', 'Exports & Integrations')} />

      <div className="grid gap-4 pb-20">
        <GlassCard className="mb-2 bg-primary/5 border-primary/10">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Data Backup & Analysis</h3>
              <p className="text-xs text-white/50 leading-relaxed">
                Generate CSV exports of your platform data for offline analysis, auditing, or custom reporting. All exports are generated in real-time.
              </p>
            </div>
          </div>
        </GlassCard>

        {EXPORT_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          return (
            <GlassCard 
              key={opt.id} 
              padding="none" 
              className="overflow-hidden group hover:bg-white/[0.04] transition-all border-white/5"
            >
              <div className="flex items-center p-5">
                <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${opt.color} flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <Icon size={24} />
                </div>
                
                <div className="flex-1 ml-5 mr-4 min-w-0">
                  <h4 className="text-base font-bold text-white mb-0.5">{opt.title}</h4>
                  <p className="text-xs text-white/40 truncate">{opt.desc}</p>
                </div>

                <Button
                  variant="glass"
                  size="sm"
                  loading={exporting === opt.id}
                  onClick={() => handleExport(opt.id, opt.title)}
                  className="rounded-full px-5 border-white/10 group-hover:border-primary/30 group-hover:bg-primary/5"
                >
                  <Download size={16} className="mr-2" />
                  Export
                </Button>
              </div>
            </GlassCard>
          );
        })}

        <div className="mt-8">
          <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest ml-1 mb-4">Past Exports</h3>
          <GlassCard className="text-center py-10 opacity-50 grayscale border-dashed border-white/10">
            <CheckCircle2 size={32} className="mx-auto mb-3 text-white/20" />
            <p className="text-sm text-white/40">No recent export history found.</p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
