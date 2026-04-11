import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../../api/hooks/useAuth';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import type { RootState } from '../../store/store';
import { User, Mail, Phone, Calendar, ChevronRight, MapPin, Edit } from 'lucide-react';

export const ProfileScreen = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user as any);
  const role = user?.userType || 'venter';
  const basePath = `/${role}`;
  const { getProfile } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        await getProfile();
      } catch (e) {
        console.error('Failed to load profile', e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const profileFields = [
    { icon: Mail, label: 'Email', value: user?.email || 'Not set' },
    { icon: Phone, label: 'Phone', value: user?.phone || 'Not set' },
    { icon: Calendar, label: 'Member Since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Unknown' },
    { icon: MapPin, label: 'Location', value: user?.location || 'Not set' },
  ];

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader
        title="Profile"
        onBack={() => navigate(-1)}
        rightContent={
          <Button variant="glass" size="sm" leftIcon={<Edit size={14} />} onClick={() => navigate(`${basePath}/profile/edit`)}>
            Edit
          </Button>
        }
      />

      {/* Avatar + Name */}
      <div className="flex flex-col items-center text-center py-4">
        {loading ? (
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full skeleton mb-4" />
            <div className="w-32 h-6 skeleton rounded mb-2" />
            <div className="w-20 h-4 skeleton rounded" />
          </div>
        ) : (
          <>
            <div className="w-24 h-24 rounded-full glass flex items-center justify-center text-3xl font-bold text-white mb-4 border-2 border-white/20">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                (user?.firstName?.[0] || user?.displayName?.[0] || 'U').toUpperCase()
              )}
            </div>
            <h2 className="text-2xl font-bold text-white">{user?.displayName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User'}</h2>
            {user?.nickname && <p className="text-sm text-accent mt-1">@{user.nickname}</p>}
            <p className="text-sm text-gray-500 mt-0.5 capitalize">{user?.userType || 'User'}</p>
          </>
        )}
      </div>

      {/* Profile Details */}
      <GlassCard padding="none" rounded="2xl">
        {profileFields.map(({ icon: Icon, label, value }, i) => (
          <div key={label} className={`flex items-center gap-4 px-5 py-4 ${i < profileFields.length - 1 ? 'border-b border-white/5' : ''}`}>
            <div className="w-9 h-9 rounded-xl glass flex items-center justify-center text-gray-400 flex-shrink-0">
              <Icon size={15} />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">{label}</p>
              <p className="text-sm font-medium text-white mt-0.5">{value}</p>
            </div>
          </div>
        ))}
      </GlassCard>

      {/* Bio */}
      {user?.bio && (
        <GlassCard>
          <p className="text-xs text-gray-500 mb-2">Bio</p>
          <p className="text-sm text-white leading-relaxed">{user.bio}</p>
        </GlassCard>
      )}

      {/* Actions */}
      <div className="space-y-2">
        <GlassCard padding="none" rounded="2xl">
          {[
            { label: 'Sessions History', path: `${basePath}/sessions` },
            { label: 'Security Settings', path: `${basePath}/security` },
            { label: 'Legal & Policies', path: `${basePath}/legal` },
          ].map(({ label, path }, i) => (
            <div
              key={path}
              className={`settings-item cursor-pointer rounded-${i === 0 ? 't' : i === 2 ? 'b' : ''}-2xl`}
              onClick={() => navigate(path)}
            >
              <span className="text-sm text-white">{label}</span>
              <ChevronRight size={16} className="text-gray-500" />
            </div>
          ))}
        </GlassCard>
      </div>
    </div>
  );
};
