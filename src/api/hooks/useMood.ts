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
    // Capitalize mood_type to match API expectations: 'happy' → 'Happy'
    const normalizedPayload = {
      ...payload,
      mood_type: payload.mood_type.charAt(0).toUpperCase() + payload.mood_type.slice(1).toLowerCase(),
    };
    const res = await apiInstance.post('mood/log', normalizedPayload);
    return res.data;
  };

  const updateMood = async (id: string, payload: {
    mood_type?: string;
    notes?: string;
    category?: string;
  }) => {
    // Capitalize mood_type if present: 'happy' → 'Happy'
    const normalizedPayload = payload.mood_type
      ? {
          ...payload,
          mood_type: payload.mood_type.charAt(0).toUpperCase() + payload.mood_type.slice(1).toLowerCase(),
        }
      : payload;
    // Note: id is not used in the url, it updates the today's mood
    const res = await apiInstance.put(`mood/today`, normalizedPayload);
    return res.data;
  };

  const getMoodHistory = async (limit = 30, offset = 0, start_date?: string, end_date?: string) => {
    const res = await apiInstance.get('mood/history', {
      params: { limit, offset, ...(start_date && { start_date }), ...(end_date && { end_date }) },
    });
    return res.data;
  };

  const getMonthlyMoods = async (year: number, month: number) => {
    const res = await apiInstance.get('mood/monthly', { params: { year, month } });
    return res.data;
  };

  const deleteMood = async (id: string) => {
    const res = await apiInstance.delete(`mood/${id}`);
    return res.data;
  };

  return {
    getTodayMood,
    getMoodStats,
    logMood,
    updateMood,
    getMoodHistory,
    getMonthlyMoods,
    deleteMood,
  };
};
