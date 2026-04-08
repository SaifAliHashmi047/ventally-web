import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface SessionInfo {
    /** The session/request/conversation ID */
    sessionId: string | null;
    requestId: string | null;
    venterId: string | null;
    listenerId: string | null;
    sessionType: 'call' | 'chat' | null;
    /** Full raw data object from the socket accept event */
    data: any | null;
}

const initialState: SessionInfo = {
    sessionId: null,
    requestId: null,
    venterId: null,
    listenerId: null,
    sessionType: null,
    data: null,
};

const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        setSessionInfo: (
            state,
            action: PayloadAction<Partial<SessionInfo>>,
        ) => {
            return { ...state, ...action.payload };
        },
        clearSessionInfo: () => initialState,
    },
});

export const { setSessionInfo, clearSessionInfo } = sessionSlice.actions;
export default sessionSlice.reducer;
