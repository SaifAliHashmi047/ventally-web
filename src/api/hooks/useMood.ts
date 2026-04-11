import apiInstance from '../apiInstance';

export const useMood = () => {
  const getTodayMood = async () => {
    const res = await apiInstance.get('mood/today');
    return res.data;
  };

  const getMoodStats = async (days: number) => {
    const res = await apiInstance.get('mood/stats', { params: { days } });
    return res.data;
  };

  const logMood = async (payload: {
    mood_type: string;
    notes?: string;
    category?: string;
  }) => {
    const res = await apiInstance.post('mood', payload);
    return res.data;
  };

  const updateMood = async (id: string, payload: {
    mood_type?: string;
    notes?: string;
    category?: string;
  }) => {
    const res = await apiInstance.put(`mood/${id}`, payload);
    return res.data;
  };

  const getMoodHistory = async (limit = 30, offset = 0) => {
    const res = await apiInstance.get('mood/history', { params: { limit, offset } });
    return res.data;
  };

  const getMonthlyMoods = async (year: number, month: number) => {
    const res = await apiInstance.get('mood/monthly', { params: { year, month } });
    return res.data;
  };

  return {
    getTodayMood,
    getMoodStats,
    logMood,
    updateMood,
    getMoodHistory,
    getMonthlyMoods,
  };
};
