import apiInstance from '../apiInstance';

export interface CreditPack {
  id: string;
  name: string;
  credits?: number; // legacy
  included_minutes?: number;
  included_messages?: number;
  description?: string;
  price: number;
  currency: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
}

export interface CreditPacksResponse {
  packs: CreditPack[];
}

export interface SubscriptionPlansResponse {
  plans: SubscriptionPlan[];
}

export interface CreateCheckoutSessionPayload {
  packType: string;
  customMinutes?: number;
  customPrice?: number;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CreateCheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export interface CreateSubscriptionCheckoutPayload {
  planId: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CreateSubscriptionCheckoutResponse {
  sessionId: string;
  url: string;
}

export interface VerifyCheckoutResponse {
  status: 'complete' | 'open' | 'expired';
  customer?: string;
  subscription?: string;
  creditsAdded?: number;
}

export interface CancelSubscriptionResponse {
  success: boolean;
  message?: string;
}

/**
 * Custom hook for Payments API endpoints
 */
export const usePayments = () => {
  /**
   * Get available credit packs
   */
  const getCreditPacks = async (): Promise<CreditPacksResponse> => {
    const response = await apiInstance.get<CreditPacksResponse>('payments/credit-packs');
    return response?.data;
  };

  /**
   * Get subscription plans
   */
  const getSubscriptionPlans = async (): Promise<SubscriptionPlansResponse> => {
    const response = await apiInstance.get<SubscriptionPlansResponse>('payments/subscription-plans');
    return response?.data;
  };

  /**
   * Create checkout session for credit pack purchase
   */
  const createCheckoutSession = async (payload: CreateCheckoutSessionPayload): Promise<CreateCheckoutSessionResponse> => {
    const response = await apiInstance.post<CreateCheckoutSessionResponse>('payments/create-checkout-session', payload);
    return response?.data;
  };

  /**
   * Create checkout session for subscription
   */
  const createSubscriptionCheckout = async (payload: CreateSubscriptionCheckoutPayload): Promise<CreateSubscriptionCheckoutResponse> => {
    const response = await apiInstance.post<CreateSubscriptionCheckoutResponse>('payments/create-subscription-checkout', payload);
    return response?.data;
  };

  /**
   * Verify checkout session status
   */
  const verifyCheckout = async (sessionId: string): Promise<VerifyCheckoutResponse> => {
    const response = await apiInstance.get<VerifyCheckoutResponse>('payments/verify-checkout', {
      params: { sessionId },
    });
    return response?.data;
  };

  /**
   * Cancel active subscription
   */
  const cancelSubscription = async (): Promise<CancelSubscriptionResponse> => {
    const response = await apiInstance.post<CancelSubscriptionResponse>('payments/cancel-subscription');
    return response?.data;
  };

  return {
    getCreditPacks,
    getSubscriptionPlans,
    createCheckoutSession,
    createSubscriptionCheckout,
    verifyCheckout,
    cancelSubscription,
  };
};
