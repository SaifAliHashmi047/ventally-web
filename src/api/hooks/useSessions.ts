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

  // Submit feedback/review — POST /reviews
  const submitFeedback = async (sessionId: string, payload: {
    rating: number;
    comment: string;
    topics?: string[];
    sessionType?: string;
    revieweeId?: string;
  }) => {
    // Guard: rating must be 1-5, comment must be non-empty
    if (!payload.rating || payload.rating < 1 || payload.rating > 5) {
      throw { error: 'Rating must be between 1 and 5' };
    }
    if (!payload.comment?.trim()) {
      throw { error: 'Comment is required' };
    }

    const body: Record<string, any> = {
      sessionId,
      sessionType: payload.sessionType || 'chat',
      rating: payload.rating,
      comment: payload.comment.trim(),
      revieweeId: payload.revieweeId,
    };

    const res = await apiInstance.post('reviews', body);
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
