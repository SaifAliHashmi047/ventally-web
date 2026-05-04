import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type SessionType = 'call' | 'chat';

export interface CallState {
  isConnecting: boolean;
  isActive: boolean;
  startTime: number | null;
  isMuted: boolean;
  isSpeakerOn: boolean;
  sessionId: string | null;
  /** Type of session when navigating to finding listener: call or chat */
  sessionType: SessionType | null;
  /** When true, user came from low credit and should return to finding listener after payment */
  returnToSession: boolean;
  /** Messaging session state — independent from the call state */
  isChatActive: boolean;
  chatStartTime: number | null;
  chatData: any | null;
  activeConversationId: string | null;
  /** Set to true when the user initiates a report, preventing chat:ended from navigating to ratings */
  isReporting: boolean;
}

const initialState: CallState = {
  isConnecting: false,
  isActive: false,
  startTime: null,
  isMuted: false,
  isSpeakerOn: true,
  sessionId: null,
  sessionType: null,
  returnToSession: false,
  isChatActive: false,
  chatStartTime: null,
  chatData: null,
  activeConversationId: null,
  isReporting: false,
};

const callSlice = createSlice({
  name: 'call',
  initialState,
  reducers: {
    setSessionType: (state, action: PayloadAction<SessionType | null>) => {
      state.sessionType = action.payload;
    },
    setReturnToSession: (state, action: PayloadAction<boolean>) => {
      state.returnToSession = action.payload;
    },
    setIsReporting: (state, action: PayloadAction<boolean>) => {
      state.isReporting = action.payload;
    },
    startCall: (state) => {
      state.isConnecting = true;
      state.isActive = false;
      state.startTime = null;
      state.isMuted = false;
      state.isSpeakerOn = true;
      state.sessionId = null;
    },
    sessionStarted: (state, action: PayloadAction<{ sessionId?: string } | undefined>) => {
      state.isConnecting = false;
      state.isActive = true;
      state.startTime = Date.now();
      state.sessionId = action.payload?.sessionId ?? null;
    },
    endCall: (state) => {
      state.isConnecting = false;
      state.isActive = false;
      state.startTime = null;
      state.isMuted = false;
      state.isSpeakerOn = true;
      state.sessionId = null;
      state.sessionType = null;
      state.returnToSession = false;
      state.isReporting = false;
    },
    setMuted: (state, action: PayloadAction<boolean>) => {
      state.isMuted = action.payload;
    },
    setSpeakerRedux: (state, action: PayloadAction<boolean>) => {
      state.isSpeakerOn = action.payload;
    },
    setCallSession: (state, action: PayloadAction<Partial<CallState>>) => {
      Object.assign(state, action.payload);
    },
    /** Start a messaging (chat) session */
    chatSessionStarted: (state, action: PayloadAction<{ chatData: any; chatStartTime: number; conversationId?: string }>) => {
      state.isChatActive = true;
      state.chatData = action.payload.chatData;
      state.chatStartTime = action.payload.chatStartTime;
      state.activeConversationId = action.payload.conversationId
        ?? action.payload.chatData?.conversation?.id
        ?? action.payload.chatData?.id
        ?? null;
    },
    /** End the active messaging session */
    endChatSession: (state) => {
      state.isChatActive = false;
      state.chatData = null;
      state.chatStartTime = null;
      state.activeConversationId = null;
      state.isReporting = false;
    },
  },
});

export const {
  setSessionType,
  setReturnToSession,
  setIsReporting,
  startCall,
  sessionStarted,
  endCall,
  setMuted,
  setSpeakerRedux,
  setCallSession,
  chatSessionStarted,
  endChatSession,
} = callSlice.actions;
export default callSlice.reducer;
