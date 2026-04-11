import apiInstance from '../apiInstance';

export const useRecovery = () => {
  const getDashboard = async () => {
    const res = await apiInstance.get('recovery/dashboard');
    return res.data;
  };

  const logProgress = async (payload: {
    date: string;
    status: string;
    notes?: string;
    milestone?: string;
  }) => {
    const res = await apiInstance.post('recovery/progress', payload);
    return res.data;
  };

  const getProgressHistory = async (limit = 30, offset = 0) => {
    const res = await apiInstance.get('recovery/history', { params: { limit, offset } });
    return res.data;
  };

  const updateProgress = async (id: string, payload: any) => {
    const res = await apiInstance.put(`recovery/progress/${id}`, payload);
    return res.data;
  };

  const getSummary = async (period: 'week' | 'month' | 'year' = 'month') => {
    const res = await apiInstance.get('recovery/summary', { params: { period } });
    return res.data;
  };

  return { getDashboard, logProgress, getProgressHistory, updateProgress, getSummary };
};
