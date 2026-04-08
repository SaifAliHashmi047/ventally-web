import apiInstance, { type ApiResponse } from './apiInstance';

export async function login(email: string, password: string) {
  return apiInstance.post('auth/login', {
    email: email.trim(),
    password: password.trim(),
  }) as Promise<ApiResponse>;
}

export async function register(payload: {
  email?: string;
  phoneNumber?: string;
  password: string;
  userType: string;
}) {
  return apiInstance.post('auth/register', payload) as Promise<ApiResponse>;
}

export async function verifyEmail(email: string, otp: string) {
  return apiInstance.post('auth/verify-email', { email: email.trim(), otp: otp.trim() }) as Promise<ApiResponse>;
}

export async function resendVerificationEmail(email: string) {
  return apiInstance.post('auth/resend-verification', { email: email.trim() }) as Promise<ApiResponse>;
}

export async function updateProfile(body: Record<string, unknown>) {
  return apiInstance.put('auth/profile', body) as Promise<ApiResponse>;
}

export async function getProfile() {
  return apiInstance.get('auth/profile') as Promise<ApiResponse>;
}

export async function requestPasswordReset(email: string) {
  return apiInstance.post('auth/request-password-reset', { email: email.trim() }) as Promise<ApiResponse>;
}

export async function resetPasswordWithOtp(payload: { email: string; otp: string; newPassword: string }) {
  return apiInstance.post('auth/reset-password', {
    email: payload.email.trim(),
    otp: payload.otp,
    newPassword: payload.newPassword,
  }) as Promise<ApiResponse>;
}

export async function logout() {
  return apiInstance.post('auth/logout', {}) as Promise<ApiResponse>;
}
