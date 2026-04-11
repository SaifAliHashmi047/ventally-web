import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Toggle } from '../../components/ui/Toggle';
import { Modal } from '../../components/ui/Modal';
import type { RootState } from '../../store/store';
import {
  Lock, Mail, Phone, Trash2, ChevronRight, Settings, Bell, Shield, Globe, Moon
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/userSlice';

export const AdminSettings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user as any);
  const [notifications, setNotifications] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);

  const handleLogout = () => {
    dispatch(logout() as any);
    navigate('/login');
  };

  const SETTING_SECTIONS = [
    {
      title: 'Account',
      items: [
        { icon: Mail, label: 'Email Address', value: user?.email, path: '/admin/security' },
        { icon: Phone, label: 'Phone Number', value: user?.phone || 'Not set', path: '/admin/security' },
        { icon: Lock, label: 'Change Password', path: '/admin/security/change-password' },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { icon: Bell, label: 'Push Notifications', toggle: true, key: 'notifications' },
        { icon: Shield, label: 'Security Settings', path: '/admin/security' },
      ]
    },
  ];

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title="Settings" />

      {/* Profile Card */}
      <GlassCard bordered>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full glass flex items-center justify-center text-2xl font-bold text-white">
            {(user?.firstName?.[0] || 'A').toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="text-lg font-bold text-white">{user?.displayName || `${user?.firstName || ''} ${user?.lastName || ''}`}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <p className="text-xs text-accent font-medium mt-1 capitalize">{user?.userType === 'sub_admin' ? 'Sub-Admin' : 'Admin'}</p>
          </div>
          <Button variant="glass" size="sm" onClick={() => navigate('/admin/profile')}>
            Edit
          </Button>
        </div>
      </GlassCard>

      {SETTING_SECTIONS.map(section => (
        <div key={section.title}>
          <p className="section-label mb-2">{section.title}</p>
          <GlassCard padding="none" rounded="2xl">
            {section.items.map((item: any, i) => (
              <div
                key={item.label}
                className={`settings-item ${item.path ? 'cursor-pointer' : ''}`}
                onClick={item.path ? () => navigate(item.path) : undefined}
                style={{ borderBottomWidth: i === section.items.length - 1 ? 0 : undefined }}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={16} className="text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-white">{item.label}</p>
                    {item.value && <p className="text-xs text-gray-500 mt-0.5">{item.value}</p>}
                  </div>
                </div>
                {item.toggle ? (
                  <Toggle checked={notifications} onChange={setNotifications} size="sm" />
                ) : (
                  <ChevronRight size={16} className="text-gray-500" />
                )}
              </div>
            ))}
          </GlassCard>
        </div>
      ))}

      {/* Danger Zone */}
      <div>
        <p className="section-label mb-2 text-error">Danger Zone</p>
        <GlassCard padding="none" rounded="2xl">
          <button
            onClick={handleLogout}
            className="settings-item w-full text-left border-b border-white/5"
          >
            <span className="text-sm font-medium text-error">Log Out</span>
            <ChevronRight size={16} className="text-error" />
          </button>
        </GlassCard>
      </div>
    </div>
  );
};
