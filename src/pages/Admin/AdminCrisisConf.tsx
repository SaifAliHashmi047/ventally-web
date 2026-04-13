import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { PageHeader } from '../../components/ui/PageHeader';
import { Toggle } from '../../components/ui/Toggle';
import { useAdmin } from '../../api/hooks/useAdmin';
import { AlertTriangle, Phone, Globe, Save, RotateCcw } from 'lucide-react';

interface CrisisResource {
  id: string;
  name: string;
  phone: string;
  text?: string;
  website?: string;
  enabled: boolean;
  priority: number;
}

interface CrisisConfig {
  enabled: boolean;
  showWarning: boolean;
  resources: CrisisResource[];
  customMessage?: string;
}

export const AdminCrisisConf = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getCrisisConfig, updateCrisisConfig } = useAdmin();

  const [config, setConfig] = useState<CrisisConfig>({
    enabled: true,
    showWarning: true,
    resources: [
      { id: '988', name: '988 Suicide & Crisis Lifeline', phone: '988', text: '988', enabled: true, priority: 1 },
      { id: '741741', name: 'Crisis Text Line', text: '741741', phone: '', enabled: true, priority: 2 },
      { id: '211', name: '211 Connecticut', phone: '211', enabled: true, priority: 3 },
    ],
    customMessage: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await getCrisisConfig();
        if (data?.config) {
          setConfig(data.config);
        }
      } catch (error) {
        console.error('Failed to fetch crisis config:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateCrisisConfig(config);
    } catch (error) {
      console.error('Failed to save crisis config:', error);
    } finally {
      setSaving(false);
    }
  };

  const toggleResource = (id: string) => {
    setConfig(prev => ({
      ...prev,
      resources: prev.resources.map(r =>
        r.id === id ? { ...r, enabled: !r.enabled } : r
      ),
    }));
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader
        title={t('Admin.crisisConfig', 'Crisis Configuration')}
        onBack={() => navigate(-1)}
      />

      {/* General Settings */}
      <GlassCard className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          {t('AdminCrisisConf.generalSettings', 'General Settings')}
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">
                {t('AdminCrisisConf.enableCrisis', 'Enable Crisis Support')}
              </p>
              <p className="text-xs text-gray-500">
                {t('AdminCrisisConf.enableCrisisDesc', 'Show crisis support options to users')}
              </p>
            </div>
            <Toggle
              checked={config.enabled}
              onChange={(checked) => setConfig(prev => ({ ...prev, enabled: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">
                {t('AdminCrisisConf.showWarning', 'Show Danger Warning')}
              </p>
              <p className="text-xs text-gray-500">
                {t('AdminCrisisConf.showWarningDesc', 'Ask users if they are in immediate danger')}
              </p>
            </div>
            <Toggle
              checked={config.showWarning}
              onChange={(checked) => setConfig(prev => ({ ...prev, showWarning: checked }))}
            />
          </div>
        </div>
      </GlassCard>

      {/* Crisis Resources */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">
          {t('AdminCrisisConf.resources', 'Crisis Resources')}
        </h3>
        <p className="text-sm text-gray-400">
          {t('AdminCrisisConf.resourcesDesc', 'Configure which resources are available to users')}
        </p>
      </div>

      <div className="space-y-3 mb-6">
        {config.resources.map((resource) => (
          <GlassCard key={resource.id}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle size={20} className="text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{resource.name}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    {resource.phone && (
                      <span className="flex items-center gap-1">
                        <Phone size={12} />
                        {resource.phone}
                      </span>
                    )}
                    {resource.text && (
                      <span className="flex items-center gap-1">
                        Text: {resource.text}
                      </span>
                    )}
                    {resource.website && (
                      <span className="flex items-center gap-1">
                        <Globe size={12} />
                        {resource.website}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Toggle
                checked={resource.enabled}
                onChange={() => toggleResource(resource.id)}
              />
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="ghost"
          size="lg"
          className="flex-1"
          leftIcon={<RotateCcw size={18} />}
          onClick={() => navigate(-1)}
        >
          {t('Common.cancel', 'Cancel')}
        </Button>
        <Button
          variant="primary"
          size="lg"
          className="flex-1"
          leftIcon={<Save size={18} />}
          loading={saving}
          onClick={handleSave}
        >
          {t('Common.save', 'Save Changes')}
        </Button>
      </div>
    </div>
  );
};
