import { useCallback } from 'react';
import apiInstance from '../apiInstance';

export interface ChatMessage {
  id: string;
  sender: 'venter' | 'listener';
  message: string;
  timestamp: string;
  isFlagged?: boolean;
}

export interface SessionInfo {
  venterId: string;
  listenerId: string;
  startTime: string;
  duration: string;
  status: string;
}

export interface ChatHistoryResponse {
  messages: ChatMessage[];
  sessionInfo: SessionInfo;
}

export const useChat = () => {
  /**
   * Get chat history for a specific session
   */
  const getChatHistory = useCallback(async (sessionId: string): Promise<ChatHistoryResponse> => {
    const res = await apiInstance.get(`chat/history/${sessionId}`);
    return res.data;
  }, []);

  /**
   * Get recent chats for admin review
   */
  const getRecentChats = useCallback(async (params?: { 
    limit?: number; 
    offset?: number; 
    status?: string;
    flagged?: boolean;
  }) => {
    const res = await apiInstance.get('admin/chats', { params });
    return res.data;
  }, []);

  /**
   * Flag a message for review
   */
  const flagMessage = useCallback(async (messageId: string, reason?: string) => {
    const res = await apiInstance.post(`chat/messages/${messageId}/flag`, { reason });
    return res.data;
  }, []);

  /**
   * Send admin note on a chat session
   */
  const addAdminNote = useCallback(async (sessionId: string, note: string) => {
    const res = await apiInstance.post(`admin/chats/${sessionId}/notes`, { note });
    return res.data;
  }, []);

  return {
    getChatHistory,
    getRecentChats,
    flagMessage,
    addAdminNote,
  };
};
