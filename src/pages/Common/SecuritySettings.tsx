import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import apiInstance from '../../api/apiInstance';
import { Lock, Fingerprint, Shield, ChevronRight, KeyRound } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';

export const SecuritySettings = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user as any);
  const role = user?.userType || 'venter';
  const basePath = `/${role}`;

  const actions = [
    { icon: Lock, label: 'Change Password', path: `${basePath}/security/change-password` },
    { icon: KeyRound, label: 'Update Email', path: null, action: 'email' },
    { icon: KeyRound, label: 'Update Phone', path: null, action: 'phone' },
    { icon: Shield, label: 'Two-Factor Authentication', path: null, action: 'tfa' },
  ];

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title="Security Settings" onBack={() => navigate(-1)} />

      <GlassCard padding="none" rounded="2xl">
        {actions.map(({ icon: Icon, label, path, action }, i) => (
          <div
            key={label}
            className="settings-item cursor-pointer"
            onClick={() => path ? navigate(path) : undefined}
            style={{ borderBottomWidth: i === actions.length - 1 ? 0 : undefined }}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl glass flex items-center justify-center text-gray-400">
                <Icon size={15} />
              </div>
              <span className="text-sm font-medium text-white">{label}</span>
            </div>
            <ChevronRight size={16} className="text-gray-500" />
          </div>
        ))}
      </GlassCard>

      <GlassCard accent>
        <div className="flex items-start gap-3">
          <Shield size={18} className="text-accent flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-400">
            Keep your account secure by using a strong, unique password and enabling two-factor authentication.
          </p>
        </div>
      </GlassCard>
    </div>
  );
};
