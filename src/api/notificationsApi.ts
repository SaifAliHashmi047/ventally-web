import apiInstance, { type ApiResponse } from './apiInstance';

export async function getNotificationHistory(limit = 30, offset = 0) {
  return apiInstance.get('notifications/history', { params: { limit, offset } }) as Promise<ApiResponse>;
}

export async function getNotificationSettings() {
  return apiInstance.get('notifications/settings') as Promise<ApiResponse>;
}

export async function getUnreadNotificationCount() {
  return apiInstance.get('notifications/unread-count') as Promise<ApiResponse>;
}

export async function updateNotificationSettings(data: any) {
  return apiInstance.put('notifications/settings', data) as Promise<ApiResponse>;
}
