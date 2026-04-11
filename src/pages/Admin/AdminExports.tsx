import { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { useAdmin } from '../../api/hooks/useAdmin';
import { Download, FileText, Users, DollarSign, MessageSquare } from 'lucide-react';

const EXPORT_TYPES = [
  { id: 'users', label: 'User Data', description: 'All registered users with profile info', icon: Users },
  { id: 'sessions', label: 'Session Logs', description: 'All session history and metadata', icon: MessageSquare },
  { id: 'payments', label: 'Payment History', description: 'All transactions and subscription data', icon: DollarSign },
  { id: 'reports', label: 'Reports Log', description: 'All user reports and actions taken', icon: FileText },
];

export const AdminExports = () => {
  const { exportData } = useAdmin();
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const handleExport = async (type: string, format: 'csv' | 'json') => {
    setLoading(prev => ({ ...prev, [`${type}-${format}`]: true }));
    try {
      const blob = await exportData(type, format);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ventally-${type}-${new Date().toISOString().split('T')[0]}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Export failed:', e);
    } finally {
      setLoading(prev => ({ ...prev, [`${type}-${format}`]: false }));
    }
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title="Data Exports" subtitle="Download platform data in CSV or JSON format" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {EXPORT_TYPES.map(({ id, label, description, icon: Icon }) => (
          <GlassCard key={id} bordered>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-11 h-11 rounded-2xl glass flex items-center justify-center text-accent">
                <Icon size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{description}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="glass"
                size="sm"
                fullWidth
                leftIcon={<Download size={14} />}
                loading={loading[`${id}-csv`]}
                onClick={() => handleExport(id, 'csv')}
              >
                CSV
              </Button>
              <Button
                variant="glass"
                size="sm"
                fullWidth
                leftIcon={<Download size={14} />}
                loading={loading[`${id}-json`]}
                onClick={() => handleExport(id, 'json')}
              >
                JSON
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard accent className="mt-2">
        <p className="text-xs text-gray-400">
          <strong className="text-accent">Privacy note:</strong> Exported data contains personally identifiable information. Handle with care and ensure compliance with applicable data protection laws.
        </p>
      </GlassCard>
    </div>
  );
};
