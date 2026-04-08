import apiInstance, { type ApiResponse } from './apiInstance';

export async function getWalletBalance() {
  return apiInstance.get('wallet/balance') as Promise<ApiResponse>;
}

export async function getWalletTransactions(limit = 20, offset = 0) {
  return apiInstance.get('wallet/transactions', { params: { limit, offset } }) as Promise<ApiResponse>;
}
