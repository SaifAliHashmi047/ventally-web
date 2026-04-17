import { useCallback } from 'react';
import apiInstance from '../apiInstance';

// Response type definitions
interface AvailabilityStatus {
  isOnline: boolean;
  lastSeen?: string;
}

interface AvailabilityStatusResponse {
  status: AvailabilityStatus;
}

interface GoOnlineResponse {
  success: boolean;
  message?: string;
}

interface GoOfflineResponse {
  success: boolean;
  message?: string;
}

// Module-level request tracking for cross-component deduplication
let globalStatusPromise: Promise<{ data: AvailabilityStatusResponse }> | null = null;

export const useAvailability = () => {

  /**
   * Get current availability status
   * Uses global promise deduplication to prevent multiple simultaneous requests
   */
  const getStatus = useCallback(async (): Promise<AvailabilityStatusResponse> => {
    // If a request is already in flight, return the same promise
    if (globalStatusPromise) {
      const res = await globalStatusPromise;
      return res.data;
    }

    // Create new request and store in global variable
    globalStatusPromise = apiInstance.get<AvailabilityStatusResponse>('availability/status');

    try {
      const res = await globalStatusPromise;
      return res.data;
    } finally {
      // Clear the global promise after a short delay to allow for StrictMode remounts
      setTimeout(() => {
        globalStatusPromise = null;
      }, 100);
    }
  }, []);

  /**
   * Go online as listener
   */
  const goOnline = useCallback(async (): Promise<GoOnlineResponse> => {
    const res = await apiInstance.post<GoOnlineResponse>('availability/online');
    return res.data;
  }, []);

  /**
   * Go offline as listener
   */
  const goOffline = useCallback(async (): Promise<GoOfflineResponse> => {
    const res = await apiInstance.post<GoOfflineResponse>('availability/offline');
    return res.data;
  }, []);

  return { getStatus, goOnline, goOffline };
};
