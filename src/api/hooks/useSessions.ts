import apiInstance from '../apiInstance';

export const useSessions = () => {
  const getSessionsHistory = async (limit = 20, offset = 0) => {
    const res = await apiInstance.get('sessions/history', { params: { limit, offset } });
    return res.data;
  };

  const getSessionDetail = async (id: string) => {
    const res = await apiInstance.get(`sessions/${id}`);
    return res.data;
  };

  const submitFeedback = async (sessionId: string, payload: {
    rating?: number;
    comment?: string;
    topics?: string[];
  }) => {
    const res = await apiInstance.post(`sessions/${sessionId}/feedback`, payload);
    return res.data;
  };

  const submitRating = async (sessionId: string, rating: number, review?: string) => {
    const res = await apiInstance.post(`sessions/${sessionId}/rating`, { rating, review });
    return res.data;
  };

  const reportSession = async (sessionId: string, reason: string, details?: string) => {
    const res = await apiInstance.post(`sessions/${sessionId}/report`, { reason, details });
    return res.data;
  };

  return { getSessionsHistory, getSessionDetail, submitFeedback, submitRating, reportSession };
};
