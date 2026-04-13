import apiInstance from '../apiInstance';

export interface Call {
  id: string;
  status: string;
  createdAt: string;
  otherParticipant?: {
    anonymousName?: string;
    displayName?: string;
  };
  duration?: number;
}

export interface CallsResponse {
  calls: Call[];
  pagination?: {
    has_more: boolean;
    total: number;
  };
}

export interface CallDetailsResponse {
  call: Call;
}

export interface CreateCallPayload {
  venterId?: string;
  listenerId?: string;
  type: 'voice' | 'video';
}

export interface CreateCallResponse {
  call: Call;
  token?: string;
}

export interface AcceptCallResponse {
  success: boolean;
  roomId?: string;
}

export interface DeclineCallResponse {
  success: boolean;
}

export interface CancelCallResponse {
  success: boolean;
}

export interface EndCallResponse {
  success: boolean;
  duration?: number;
}

export interface CallTokenResponse {
  token: string;
}

export interface ActiveCallResponse {
  call?: Call;
}

/**
 * Custom hook for Calls API endpoints
 */
export const useCalls = () => {
  /**
   * Create voice/video call
   */
  const createCall = async (payload: CreateCallPayload): Promise<CreateCallResponse> => {
    const response = await apiInstance.post<CreateCallResponse>('calls', payload);
    return response?.data;
  };

  /**
   * Get call history
   */
  const getCalls = async (limit: number = 20, offset: number = 0): Promise<CallsResponse> => {
    const response = await apiInstance.get<CallsResponse>('calls/history', {
      params: { limit, offset },
    });
    return response?.data;
  };

  /**
   * Get call details
   */
  const getCallDetails = async (callId: string): Promise<CallDetailsResponse> => {
    const response = await apiInstance.get<CallDetailsResponse>(`calls/${callId}`);
    return response?.data;
  };

  /**
   * Accept call request (listener)
   */
  const acceptCall = async (callId: string): Promise<AcceptCallResponse> => {
    const response = await apiInstance.post<AcceptCallResponse>(`calls/${callId}/accept`);
    return response?.data;
  };

  /**
   * Decline call request (listener)
   */
  const declineCall = async (callId: string): Promise<DeclineCallResponse> => {
    const response = await apiInstance.post<DeclineCallResponse>(`calls/${callId}/decline`);
    return response?.data;
  };

  /**
   * Cancel call request (venter)
   */
  const cancelCall = async (callId: string): Promise<CancelCallResponse> => {
    const response = await apiInstance.post<CancelCallResponse>(`calls/${callId}/cancel`);
    return response?.data;
  };

  /**
   * End voice/video call
   */
  const endCall = async (callId: string): Promise<EndCallResponse> => {
    const response = await apiInstance.post<EndCallResponse>(`calls/${callId}/end`);
    return response?.data;
  };

  /**
   * Get Twilio/access token for call
   */
  const getCallToken = async (callId: string): Promise<CallTokenResponse> => {
    const response = await apiInstance.get<CallTokenResponse>(`calls/${callId}/token`);
    return response?.data;
  };

  /**
   * Get active call (if any)
   */
  const getActiveCall = async (): Promise<ActiveCallResponse> => {
    const response = await apiInstance.get<ActiveCallResponse>('calls/active');
    return response?.data;
  };

  return {
    createCall,
    getCalls,
    getCallDetails,
    acceptCall,
    declineCall,
    cancelCall,
    endCall,
    getCallToken,
    getActiveCall,
  };
};
