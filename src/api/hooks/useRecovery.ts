import apiInstance from '../apiInstance';

export const useRecovery = () => {
  const getSobrietyStatus = async () => {
    const res = await apiInstance.get('sobriety/status');
    return res.data;
  };

  const startSobriety = async (payload: {
    sobriety_date?: string;
    restart_date?: string;
    addiction_type?: string;
    notes?: string;
    note?: string;
  }) => {
    const res = await apiInstance.post('sobriety/start', payload);
    return res.data;
  };

  const logRelapse = async (payload: {
    relapse_date: string;
    trigger?: string;
    notes?: string;
    note?: string;
  }) => {
    const res = await apiInstance.post('sobriety/relapse', payload);
    return res.data;
  };

  const getSobrietyHistory = async (limit = 30, offset = 0) => {
    const res = await apiInstance.get('sobriety/history', { params: { limit, offset } });
    return res.data;
  };

  // We are missing `getVenterHomeSummary` in `useRecovery.ts` native side it actually comes from useHomeSummary, 
  // but if needed we can add it here or somewhere else, for now we match sobriety APIs.
  const getVenterHomeSummary = async () => {
    const res = await apiInstance.get('home/summary');
    return res.data;
  };

  const getProgressHistory = async (limit = 30, offset = 0) => {
    const res = await apiInstance.get('sobriety/history', { params: { limit, offset } });
    return res.data;
  };

  const getSummary = async (period: string = 'month') => {
    const res = await apiInstance.get('sobriety/summary', { params: { period } });
    return res.data;
  };

  return { getSobrietyStatus, startSobriety, logRelapse, getSobrietyHistory, getVenterHomeSummary, getProgressHistory, getSummary };
};
