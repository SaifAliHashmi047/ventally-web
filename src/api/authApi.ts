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

export async function googleLogin(idToken: string, userType?: string) {
  return apiInstance.post('auth/google-login', { idToken, userType }) as Promise<ApiResponse>;
}

export async function get2FAStatus() {
  return apiInstance.get('auth/security/2fa') as Promise<ApiResponse>;
}

export async function update2FAStatus(enabled: boolean, method?: string) {
  return apiInstance.put('auth/security/2fa', { enabled, method }) as Promise<ApiResponse>;
}

export async function requestEmailChangeOtp(newEmail: string) {
  return apiInstance.post('auth/change-email/request-otp', { newEmail }) as Promise<ApiResponse>;
}

export async function verifyEmailChangeOtp(newEmail: string, otp: string) {
  return apiInstance.post('auth/change-email/verify-otp', { newEmail, otp }) as Promise<ApiResponse>;
}

export async function requestPhoneChangeOtp(newPhone: string) {
  return apiInstance.post('auth/change-phone/request-otp', { newPhone }) as Promise<ApiResponse>;
}

export async function verifyPhoneChangeOtp(newPhone: string, otp: string) {
  return apiInstance.post('auth/change-phone/verify-otp', { newPhone, otp }) as Promise<ApiResponse>;
}

export async function registerBiometrics(publicKey: string, deviceId: string) {
  return apiInstance.post('auth/biometric/register', { publicKey, deviceId }) as Promise<ApiResponse>;
}

export async function loginBiometrics(signature: string, deviceId: string) {
  return apiInstance.post('auth/biometric/login', { signature, deviceId }) as Promise<ApiResponse>;
}

export async function disableBiometrics(deviceId: string) {
  return apiInstance.post('auth/biometric/disable', { deviceId }) as Promise<ApiResponse>;
}

export async function getBiometricStatus() {
  return apiInstance.get('auth/biometric/status') as Promise<ApiResponse>;
}
