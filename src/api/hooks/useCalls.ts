import { useCallback } from 'react';
import apiInstance from '../apiInstance';

export interface Call {
  id: string;
  status?: string;
  createdAt?: string;
  startedAt?: string;
  endedAt?: string;
  durationSeconds?: number;
  otherParticipant?: { anonymousName?: string };
}

export const useCalls = () => {
  const getCalls = useCallback(async (limit = 5, offset = 0) => {
    const res = await apiInstance.get('calls/history', { params: { limit, offset } });
    return res.data;
  }, []);

  const createCall = useCallback(async (payload: { listenerId: string }) => {
    const res = await apiInstance.post('calls', payload);
    return res.data;
  }, []);

  const endCall = useCallback(async (callId: string) => {
    const res = await apiInstance.post(`calls/${callId}/end`);
    return res.data;
  }, []);

  return { getCalls, createCall, endCall };
};
