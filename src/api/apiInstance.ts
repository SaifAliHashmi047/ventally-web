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
    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('auth/login') && !originalRequest.url?.includes('auth/refresh')) {
      // Set _retry immediately to prevent any recursive retry loops
      originalRequest._retry = true;

      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      isRefreshing = true;

      try {
        const refreshToken = await getRefreshToken();

        if (!refreshToken) {
          await clearTokens();
          processQueue(new Error('No refresh token available'), null);
          isRefreshing = false;

          return Promise.reject({
            success: false,
            statusCode: 401,
            error: 'Authentication required. Please login again.',
          } as ApiResponse);
        }

        // Attempt to refresh the token
        const refreshResponse = await axios.post(
          `${apiInstance.defaults.baseURL}auth/refresh`,
          { refreshToken: refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );

        const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data;

        if (accessToken) {
          const updatedRefreshToken = newRefreshToken || refreshToken;
          await setTokens(accessToken, updatedRefreshToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }

          processQueue(null, accessToken);
          isRefreshing = false;

          return apiInstance(originalRequest);
        } else {
          throw new Error('Invalid refresh token response');
        }
      } catch (refreshError: any) {
        await clearTokens();
        processQueue(refreshError, null);
        isRefreshing = false;

        return Promise.reject({
          success: false,
          statusCode: 401,
          error: 'Session expired. Please login again.',
        } as ApiResponse);
      }
    }

    // Handle other errors
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
