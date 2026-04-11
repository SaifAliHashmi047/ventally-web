import apiInstance from '../apiInstance';

export const useAvailability = () => {
  const getStatus = async () => {
    const res = await apiInstance.get('auth/listener/status');
    return res.data;
  };

  const goOnline = async () => {
    const res = await apiInstance.post('auth/listener/online');
    return res.data;
  };

  const goOffline = async () => {
    const res = await apiInstance.post('auth/listener/offline');
    return res.data;
  };

  return { getStatus, goOnline, goOffline };
};
