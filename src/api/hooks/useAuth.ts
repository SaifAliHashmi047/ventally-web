import apiInstance from '../apiInstance';
import { useDispatch } from 'react-redux';
import { setUser, clearUser } from '../../store/slices/userSlice';

export const useAuth = () => {
  const dispatch = useDispatch();

  const getProfile = async () => {
    const res = await apiInstance.get('auth/profile');
    if (res.data?.user) {
      dispatch(setUser(res.data.user));
    }
    return res.data;
  };

  const updateProfile = async (data: any) => {
    const res = await apiInstance.put('auth/profile', data);
    if (res.data?.user) {
      dispatch(setUser(res.data.user));
    }
    return res.data;
  };

  const deleteAccount = async (password: string) => {
    const res = await apiInstance.delete('auth/account', { data: { password } });
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    dispatch(clearUser());
    return res.data;
  };

  return { getProfile, updateProfile, deleteAccount };
};
