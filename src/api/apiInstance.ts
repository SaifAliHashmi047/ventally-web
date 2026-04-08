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

// Socket URL derived from API base (remove /api/v1/ suffix)
export const SOCKET_URL = 'https://api.dev.ventally.co';
// export const SOCKET_URL = 'https://electric-equal-pony.ngrok-free.app';
//Live
export const BASE_URL = 'https://api.dev.ventally.co/api/v1/';
//NG
// export const BASE_URL = 'https://electric-equal-pony.ngrok-free.app/api/v1/';


const apiInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL, // Replace with your actual base URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    // Accept: 'application/json',
  },
});

// Request Interceptor
apiInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Get access token from AsyncStorage
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("interceptor request:", {
      baseURL: apiInstance.defaults.baseURL,
      url: config.url,
      method: config.method,
      headers: config.headers,
      params: config.params,
      data: config.data,
    });

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiInstance.interceptors.response.use(
  (response: AxiosResponse): any => {
    console.log("interceptor response:", {
      baseURL: apiInstance.defaults.baseURL,
      url: response.config.url,
      method: response.config.method,
      headers: response.config.headers,
      params: response.config.params,
      data: response?.data,
    });
    return {
      success: true,
      data: response.data,
      statusCode: response.status,
    };
  },
  async (error: AxiosError): Promise<any> => {
    console.log("interceptor error:", {
      error,
      message: error.message,
      response: error.response,
      request: error.request,
    });
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    console.log("Original Request:", { error, errorMessage: (error?.response?.data as any)?.message });
    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401 && (error?.response?.data as any)?.message === "No token provided" && !originalRequest._retry && !originalRequest.url?.includes('auth/login')) {
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

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await getRefreshToken();

        if (!refreshToken) {
          // No refresh token available, clear tokens and reject
          await clearTokens();
          processQueue(new Error('No refresh token available'), null);
          isRefreshing = false;

          const errorResponse: ApiResponse = {
            success: false,
            statusCode: 401,
            error: 'Authentication required. Please login again.',
          };
          return Promise.reject(errorResponse);
        }

        // Attempt to refresh the token
        const refreshResponse = await axios.post(
          `${apiInstance.defaults.baseURL}auth/refresh`,
          { refreshToken: refreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data;

        if (accessToken) {
          // Save new tokens (fallback to existing refresh token if not provided in response)
          const updatedRefreshToken = newRefreshToken || refreshToken;
          await setTokens(accessToken, updatedRefreshToken);

          // Update the original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }

          // Process queued requests
          processQueue(null, accessToken);
          isRefreshing = false;

          // Retry the original request
          return apiInstance(originalRequest);
        } else {
          throw new Error('Invalid refresh token response');
        }
      } catch (refreshError: any) {
        // Refresh failed, clear tokens and reject
        await clearTokens();
        processQueue(refreshError, null);
        isRefreshing = false;

        const errorResponse: ApiResponse = {
          success: false,
          statusCode: 401,
          error: 'Session expired. Please login again.',
        };
        return Promise.reject(errorResponse);
      }
    }

    // Handle other errors
    const errorResponse: ApiResponse = {
      success: false,
      statusCode: error.response?.status,
      error: (error.response?.data as any)?.message || error.message || 'Something went wrong',
    };

    return Promise.reject(errorResponse);
  }
);

export default apiInstance;
