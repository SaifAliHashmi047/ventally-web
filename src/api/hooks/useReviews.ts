import apiInstance from '../apiInstance';

export const useReviews = () => {
  const getListenerReviews = async (listenerId: string, limit = 10, offset = 0) => {
    const res = await apiInstance.get(`listeners/${listenerId}/reviews`, {
      params: { limit, offset }
    });
    return res.data;
  };

  const submitReview = async (sessionId: string, rating: number, comment?: string, topics?: string[]) => {
    const res = await apiInstance.post(`sessions/${sessionId}/reviews`, { rating, comment, topics });
    return res.data;
  };

  return { getListenerReviews, submitReview };
};
