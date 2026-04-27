import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Toggle } from '../../components/ui/Toggle';
import { Button } from '../../components/ui/Button';
import { useAdmin } from '../../api/hooks/useAdmin';
import { Bot, Save, RotateCcw, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

export const AdminAISettings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getAdminAISettings, updateAdminAISettings } = useAdmin();

  const [settings, setSettings] = useState<any>({
    ai_enabled: true,
    ai_crisis_detection_enabled: true,
    ai_crisis_sensitivity: 0.85,
    ai_auto_escalation_enabled: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await getAdminAISettings();
        if (res?.settings) setSettings(res.settings);
      } catch { /* ignore and use defaults */ }
      finally { setLoading(false); }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateAdminAISettings(settings);
      toast.success(t('Admin.aiSettings.success'));
    } catch {
      toast.error(t('Admin.aiSettings.error'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="page-wrapper flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="page-wrapper animate-fade-in max-w-2xl mx-auto">
      <PageHeader
        title={t('Admin.aiSettings.title')}
        onBack={() => navigate('/admin/settings')}
      />

      <div className="space-y-6 pb-4 px-1">
        <GlassCard className="bg-white/[0.02] border-primary/10">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
              <Bot size={22} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-1">{t('Admin.aiSettings.oversight')}</h3>
              <p className="text-xs text-white/50 leading-relaxed font-medium">
                {t('Admin.aiSettings.description')}
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Core Configuration */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-2">{t('Admin.aiSettings.coreConfig')}</h4>

          <GlassCard className="flex items-center justify-between py-5 border-white/5">
            <div>
              <p className="text-sm font-bold text-white">{t('Admin.aiSettings.enableAI')}</p>
              <p className="text-xs text-white/40">{t('Admin.aiSettings.enableAIDesc')}</p>
            </div>
            <Toggle
              checked={settings.ai_enabled}
              onChange={(v) => setSettings({ ...settings, ai_enabled: v })}
            />
          </GlassCard>

          <GlassCard className="flex items-center justify-between py-5 border-white/5">
            <div>
              <p className="text-sm font-bold text-white">{t('Admin.aiSettings.autoModeration')}</p>
              <p className="text-xs text-white/40">{t('Admin.aiSettings.autoModerationDesc')}</p>
            </div>
            <Toggle
              checked={settings.ai_crisis_detection_enabled}
              onChange={(v) => setSettings({ ...settings, ai_crisis_detection_enabled: v })}
            />
          </GlassCard>

          <GlassCard className="flex items-center justify-between py-5 border-white/5">
            <div>
              <p className="text-sm font-bold text-white">{t('Admin.aiSettings.languageFilter')}</p>
              <p className="text-xs text-white/40">{t('Admin.aiSettings.languageFilterDesc')}</p>
            </div>
            <Toggle
              checked={settings.ai_auto_escalation_enabled}
              onChange={(v) => setSettings({ ...settings, ai_auto_escalation_enabled: v })}
            />
          </GlassCard>
        </div>

        {/* Risk Management */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-2">{t('Admin.aiSettings.riskManagement')}</h4>

          <GlassCard className="bg-white/[0.02] border border-white/5">
            <div className="flex justify-between mb-4">
              <span className="text-sm font-bold text-white">{t('Admin.aiSettings.riskThreshold')}</span>
              <span className="text-sm font-bold text-primary">{Math.round((settings.ai_crisis_sensitivity || 0.85) * 100)}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="99"
              value={Math.round((settings.ai_crisis_sensitivity || 0.85) * 100)}
              onChange={(e) => setSettings({ ...settings, ai_crisis_sensitivity: parseInt(e.target.value) / 100 })}
              className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between mt-3">
              <span className="text-[10px] text-white/20 font-bold uppercase tracking-tight">{t('Admin.aiSettings.cautious')}</span>
              <span className="text-[10px] text-white/20 font-bold uppercase tracking-tight">{t('Admin.aiSettings.aggressive')}</span>
            </div>
          </GlassCard>

        </div>
      </div>

      <div className="flex gap-3 px-1 pt-2 pb-6">
        <Button
          variant="secondary"
          onClick={() => navigate(-1)}
          className="h-12 flex-1"
          leftIcon={<RotateCcw size={16} />}
        >
          {t('Admin.aiSettings.reset')}
        </Button>
        <Button
          variant="primary"
          loading={saving}
          onClick={handleSave}
          className="h-12 flex-1 font-bold"
          leftIcon={<Save size={16} />}
        >
          {t('Admin.aiSettings.saveChanges')}
        </Button>
      </div>
    </div>
  );
};
