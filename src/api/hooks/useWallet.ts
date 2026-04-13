import apiInstance from '../apiInstance';

export const useWallet = () => {
  const getWallet = async () => {
    const res = await apiInstance.get('wallet/balance');
    return res.data;
  };

  const addFunds = async (amount: number) => {
    const res = await apiInstance.post('payments/create-intent', { amount });
    return res.data;
  };

  const getTransactions = async (limit = 20, offset = 0) => {
    const res = await apiInstance.get('wallet/transactions', { params: { limit, offset } });
    return res.data;
  };

  const getSubscriptionPlans = async () => {
    const res = await apiInstance.get('payments/subscription-plans');
    return res.data;
  };

  const createSubscription = async (planId: string) => {
    const res = await apiInstance.post('payments/create-subscription-checkout', { planId });
    return res.data;
  };

  const getMySubscription = async () => {
    const res = await apiInstance.get('wallet/subscription');
    return res.data;
  };

  const updateAutoRecharge = async (payload: { enabled: boolean; amount?: number }) => {
    const res = await apiInstance.put('wallet/auto-recharge', payload);
    return res.data;
  };

  return {
    getWallet,
    addFunds,
    getTransactions,
    getSubscriptionPlans,
    createSubscription,
    getMySubscription,
    updateAutoRecharge,
  };
};
