import apiInstance from '../apiInstance';
import { useDispatch } from 'react-redux';
import { setUser, clearUser } from '../../store/slices/userSlice';

export const useAuth = () => {
  const dispatch = useDispatch();

  const getProfile = async () => {
    const res = await apiInstance.get('auth/profile');
    const { user, preferences, wallet } = res.data || {};
    if (user) {
      dispatch(setUser({
        ...user,
        // Map API field names to Redux User field names (matches native app's EditProfileScreen.fetchProfile)
        gender:            preferences?.genderIdentity      || '',
        culturalBackground:preferences?.culturalBackground  || '',
        ethnicity:         preferences?.ethnicity           || '',
        ageGroup:          preferences?.ageGroup            || '',
        lgbtqIdentity:     preferences?.lgbtqIdentity       || '',
        faithOrBelief:     preferences?.faithOrBelief       || '',
        specialTopics:     preferences?.specialTopics       || [],
        preferredLanguage: preferences?.preferredLanguage   || '',
        balance: wallet?.balanceCurrency ?? wallet?.balanceMinutes ?? 0,
        // Normalise naming
        role: user.userType || user.role || '',
        image: user.profilePictureUrl || user.image || '',
      }));
    }
    return res.data;
  };

  const updateProfile = async (data: any) => {
    const res = await apiInstance.put('auth/profile', data);
    const { user, preferences, wallet } = res.data || {};
    if (user) {
      dispatch(setUser({
        ...user,
        gender:            preferences?.genderIdentity      || '',
        culturalBackground:preferences?.culturalBackground  || '',
        ethnicity:         preferences?.ethnicity           || '',
        ageGroup:          preferences?.ageGroup            || '',
        lgbtqIdentity:     preferences?.lgbtqIdentity       || '',
        faithOrBelief:     preferences?.faithOrBelief       || '',
        specialTopics:     preferences?.specialTopics       || [],
        preferredLanguage: preferences?.preferredLanguage   || '',
        balance: wallet?.balanceCurrency ?? wallet?.balanceMinutes ?? 0,
        role: user.userType || user.role || '',
        image: user.profilePictureUrl || user.image || '',
      }));
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
