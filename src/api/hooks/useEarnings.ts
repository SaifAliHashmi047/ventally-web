import apiInstance from '../apiInstance';

export const useEarnings = () => {
  const getEarningsSummary = async () => {
    const res = await apiInstance.get('earnings/summary');
    return res.data;
  };

  const getEarningsHistory = async (limit = 20, offset = 0) => {
    const res = await apiInstance.get('earnings/history', { params: { limit, offset } });
    return res.data;
  };

  const requestPayout = async (amount: number) => {
    const res = await apiInstance.post('earnings/payout', { amount });
    return res.data;
  };

  return { getEarningsSummary, getEarningsHistory, requestPayout };
};
