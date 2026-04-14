import apiInstance from '../apiInstance';

export interface Payout {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  createdAt: string;
  processedAt?: string;
}

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

  const getPayouts = async (limit = 20, offset = 0): Promise<{
    payouts: Payout[];
    pagination?: { hasMore: boolean; total: number; };
  }> => {
    const res = await apiInstance.get('earnings/payouts', { params: { limit, offset } });
    return res.data;
  };

  return { getEarningsSummary, getEarningsHistory, requestPayout, getPayouts };
};
