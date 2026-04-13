import apiInstance from '../apiInstance';

export const useCredentialsChange = () => {
  const changeEmail = async (newEmail: string) => {
    const res = await apiInstance.post('auth/change-email', { email: newEmail });
    return res.data;
  };

  const changePhone = async (newPhone: string) => {
    const res = await apiInstance.post('auth/change-phone', { phone: newPhone });
    return res.data;
  };

  const updatePassword = async (current: string, newPass: string) => {
    const res = await apiInstance.put('auth/password', { currentPassword: current, newPassword: newPass });
    return res.data;
  };

  return { changeEmail, changePhone, updatePassword };
};
