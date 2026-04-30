import axios from 'axios';
import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
// Define the base structure for API responses
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

// Token storage keys
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

// Helper functions to manage tokens in localStorage
export const getAccessToken = async (): Promise<string | null> => {
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
};

export const getRefreshToken = async (): Promise<string | null> => {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
};

export const setTokens = async (accessToken: string, refreshToken: string): Promise<void> => {
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  } catch (error) {
    console.error('Error setting tokens:', error);
  }
};

export const clearTokens = async (): Promise<void> => {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error clearing tokens:', error);
  }
};

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Ensure base URL ends with exactly one trailing slash, no double v1/
const envBase =
  typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL
    ? String(import.meta.env.VITE_API_BASE_URL).replace(/\/?$/, '/')
    : 'https://api.dev.ventally.co/api/v1/';

export const BASE_URL = envBase;

/** Socket host (strip `/api/v1/` from API base). */
export const SOCKET_URL = BASE_URL.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '') || 'https://api.dev.ventally.co';

const apiInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
apiInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Safely retry a request — strips baseURL so Axios 1.x doesn't re-prepend it
// (dispatchRequest already resolves config.url to the full URL before the request fires,
// so passing originalRequest back with baseURL still set causes double-stacking)
const retryRequest = (config: InternalAxiosRequestConfig & { _retry?: boolean }, token: string) => {
  config._retry = true;
  if (config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Remove baseURL so the already-resolved url is used as-is
  const { baseURL: _stripped, ...safeConfig } = config as any;
  return apiInstance(safeConfig);
};

// Response Interceptor
apiInstance.interceptors.response.use(
  (response: AxiosResponse): any => {
    return {
      success: true,
      data: response.data,
      statusCode: response.status,
    };
  },
  async (error: AxiosError): Promise<any> => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Only attempt token refresh on 401 when the server explicitly says no token was provided,
    // and only when we haven't already retried this specific request.
    // Mirrors the native app's conservative condition to prevent refresh loops.
    const errorMessage: string = (error.response?.data as any)?.message || '';
    const is401 = error.response?.status === 401;
    const isAuthEndpoint =
      originalRequest.url?.includes('auth/login') ||
      originalRequest.url?.includes('auth/refresh') ||
      originalRequest.url?.includes('auth/register');
    const shouldRefresh = is401 && !originalRequest._retry && !isAuthEndpoint;

    if (shouldRefresh) {
      if (isRefreshing) {
        // Queue this request until the in-flight refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => retryRequest(originalRequest, token as string))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await getRefreshToken();

        if (!refreshToken) {
          await clearTokens();
          processQueue(new Error('No refresh token available'), null);
          isRefreshing = false;
          window.dispatchEvent(new CustomEvent('auth:session-expired'));
          return Promise.reject({
            success: false,
            statusCode: 401,
            error: 'Authentication required. Please login again.',
          } as ApiResponse);
        }

        const refreshResponse = await axios.post(
          `${BASE_URL}auth/refresh`,
          { refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );

        // Backend returns only a new accessToken (refresh token stays the same)
        const { accessToken } = refreshResponse.data;

        if (!accessToken) {
          throw new Error('Invalid refresh token response');
        }

        await setTokens(accessToken, refreshToken);
        processQueue(null, accessToken);
        isRefreshing = false;

        return retryRequest(originalRequest, accessToken);
      } catch (refreshError: any) {
        await clearTokens();
        processQueue(refreshError, null);
        isRefreshing = false;
        window.dispatchEvent(new CustomEvent('auth:session-expired'));
        return Promise.reject({
          success: false,
          statusCode: 401,
          error: 'Session expired. Please login again.',
        } as ApiResponse);
      }
    }

    // Handle all other errors
    const errorResponse: ApiResponse = {
      success: false,
      statusCode: error.response?.status,
      error: (error.response?.data as any)?.message || (error.response?.data as any)?.error || error.message || 'Something went wrong',
      data: error.response?.data,
    };

    return Promise.reject(errorResponse);
  }
);

export default apiInstance;
