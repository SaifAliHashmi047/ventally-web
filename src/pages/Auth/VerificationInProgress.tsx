import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AuthLayout } from '../../components/Layout/AuthLayout';
import { Clock } from 'lucide-react';
import { logout, updateUser } from '../../store/slices/userSlice';
import type { AppDispatch } from '../../store/store';
import apiInstance from '../../api/apiInstance';

export const VerificationInProgress = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    let intervalId: any;

    const checkVerificationStatus = async () => {
      try {
        const response = await apiInstance.get('auth/profile');
        const user = response.data?.user || response.data?.data?.user;
        
        if (user) {
          dispatch(updateUser(user));
          if (user.verificationDocumentStatus === 'verified' || user.isVerified === true) {
            navigate('/signup/verification-verified', { replace: true });
          }
        }
      } catch (error) {
        console.error('Error checking verification status:', error);
      }
    };

    // Poll every 15 seconds
    intervalId = setInterval(checkVerificationStatus, 15000);
    // Also check immediately on mount
    checkVerificationStatus();

    return () => {
       if (intervalId) clearInterval(intervalId);
    };
  }, [navigate, dispatch]);

  const handleLogOut = async () => {
    await dispatch(logout());
    navigate('/login', { replace: true });
  };

  return (
    <AuthLayout>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 0' }}>
        
        <div style={{ marginBottom: '40px' }}>
          <Clock size={80} color="white" strokeWidth={1.5} />
        </div>
        
        <h1 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-pure)', marginBottom: '12px', textAlign: 'center' }}>
          {t('VerificationInProgress.title')}
        </h1>
        
        <p style={{ color: 'var(--text-dim)', fontSize: '14px', lineHeight: '1.6', textAlign: 'center', opacity: 0.9 }}>
          {t('VerificationInProgress.description')}
        </p>

        <div style={{ position: 'absolute', bottom: '40px', width: '100%', left: 0, padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <button 
            onClick={handleLogOut}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', fontSize: '14px', cursor: 'pointer', padding: '12px', textAlign: 'center' }}
          >
            {t('VerificationInProgress.logOut')}
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};
