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
    enabled: true,
    autoModeration: true,
    riskThreshold: 85,
    languageFilter: true,
    aiSupportEnabled: false,
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
      toast.success('AI settings updated successfully');
    } catch {
      toast.error('Failed to update AI settings');
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
        title={t('Admin.settings.options.aiSettings', 'AI Settings')} 
        onBack={() => navigate('/admin/settings')} 
      />

      <div className="space-y-6 pb-24 px-1">
        <GlassCard className="bg-white/[0.02] border-primary/10">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
              <Bot size={22} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-1">AI Oversight & Policy</h3>
              <p className="text-xs text-white/50 leading-relaxed font-medium">
                Configure how the platform uses artificial intelligence for moderation, risk detection, and automated user support.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Core Configuration */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-2">Core Configuration</h4>
          
          <GlassCard className="flex items-center justify-between py-5 border-white/5">
            <div>
              <p className="text-sm font-bold text-white">Enable AI Systems</p>
              <p className="text-xs text-white/40">Global toggle for all AI-driven features</p>
            </div>
            <Toggle 
              checked={settings.enabled} 
              onChange={(v) => setSettings({...settings, enabled: v})} 
            />
          </GlassCard>

          <GlassCard className="flex items-center justify-between py-5 border-white/5">
            <div>
              <p className="text-sm font-bold text-white">Auto-Moderation</p>
              <p className="text-xs text-white/40">Automatically flag or hide extreme content</p>
            </div>
            <Toggle 
              checked={settings.autoModeration} 
              onChange={(v) => setSettings({...settings, autoModeration: v})} 
            />
          </GlassCard>

          <GlassCard className="flex items-center justify-between py-5 border-white/5">
            <div>
              <p className="text-sm font-bold text-white">Inappropriate Language Filter</p>
              <p className="text-xs text-white/40">Real-time filtering of prohibited keywords</p>
            </div>
            <Toggle 
              checked={settings.languageFilter} 
              onChange={(v) => setSettings({...settings, languageFilter: v})} 
            />
          </GlassCard>
        </div>

        {/* Risk Management */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-2">Risk Management</h4>
          
          <GlassCard borderStyle="none" className="bg-white/[0.02] border-white/5">
            <div className="flex justify-between mb-4">
              <span className="text-sm font-bold text-white">Risk Threshold</span>
              <span className="text-sm font-bold text-primary">{settings.riskThreshold}%</span>
            </div>
            <input 
              type="range" 
              min="50" 
              max="99" 
              value={settings.riskThreshold}
              onChange={(e) => setSettings({...settings, riskThreshold: parseInt(e.target.value)})}
              className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between mt-3">
              <span className="text-[10px] text-white/20 font-bold uppercase tracking-tight">Cautious</span>
              <span className="text-[10px] text-white/20 font-bold uppercase tracking-tight">Aggressive</span>
            </div>
          </GlassCard>

          <div className="flex gap-2 p-3 bg-error/10 rounded-2xl border border-error/10">
            <AlertCircle size={16} className="text-error mt-0.5 flex-shrink-0" />
            <p className="text-[10px] text-error/80 leading-normal">
              Lowering the threshold will cause the AI to be more aggressive in flagging users, which may increase false positives.
            </p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 border-t border-white/5 bg-black/40 backdrop-blur-3xl z-20">
        <div className="max-w-2xl mx-auto flex gap-3">
          <Button 
            variant="glass" 
            fullWidth 
            onClick={() => navigate(-1)}
            className="rounded-full h-12 border-white/10"
          >
            <RotateCcw size={16} className="mr-2" />
            Reset
          </Button>
          <Button 
            variant="primary" 
            fullWidth 
            loading={saving}
            onClick={handleSave}
            className="rounded-full h-12 font-bold"
          >
            <Save size={16} className="mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};
