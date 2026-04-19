import { useCallback } from 'react';
import apiInstance from '../apiInstance';

interface TwoFactorSettingsResponse {
  enabled: boolean;
  method?: 'app' | 'sms' | 'email';
  verified?: boolean;
}

interface UpdateTwoFactorPayload {
  enabled: boolean;
  method?: 'app' | 'sms' | 'email';
  code?: string;
}

export const useCredentialsChange = () => {
  const changeEmail = useCallback(async (newEmail: string) => {
    const res = await apiInstance.post('auth/change-email', { email: newEmail });
    return res.data;
  }, []);

  const changePhone = useCallback(async (newPhone: string) => {
    const res = await apiInstance.post('auth/change-phone', { phone: newPhone });
    return res.data;
  }, []);

  const updatePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    const res = await apiInstance.post('auth/change-password', { currentPassword, newPassword });
    return res.data;
  }, []);

  const changePassword = useCallback(async (payload: { currentPassword: string; newPassword: string }) => {
    const res = await apiInstance.post('auth/change-password', payload);
    return res.data;
  }, []);

  /**
   * Get two-factor authentication settings
   * Matches React Native: auth/security/2fa
   */
  const getTwoFactorSettings = useCallback(async (): Promise<TwoFactorSettingsResponse> => {
    const res = await apiInstance.get<TwoFactorSettingsResponse>('auth/security/2fa');
    return res.data;
  }, []);

  /**
   * Update two-factor authentication settings
   * Matches React Native: auth/security/2fa
   */
  const updateTwoFactorSettings = useCallback(async (payload: UpdateTwoFactorPayload) => {
    const res = await apiInstance.put('auth/security/2fa', payload);
    return res.data;
  }, []);

  return {
    changeEmail,
    changePhone,
    updatePassword,
    changePassword,
    getTwoFactorSettings,
    updateTwoFactorSettings,
  };
};
