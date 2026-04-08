import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface RequestItem {
    id: string;
    type: 'call' | 'message';
    title: string;
    timeAgo?: string;
    roomName?: string;
    /** ID of the requester (venter) */
    venterId: string | null;
    /** ID of the assigned listener */
    listenerId: string | null;
    /** The raw requestId from the server (same as id for now) */
    requestId: string | null;
    /** Session type from the server payload */
    requestType: string | null;
    /** Rate per minute for this session */
    ratePerMinute?: number | null;
}

interface ListenerState {
    requests: RequestItem[];
}

const initialState: ListenerState = {
    requests: [],
};

const listenerSlice = createSlice({
    name: 'listener',
    initialState,
    reducers: {
        setRequests: (state, action: PayloadAction<RequestItem[]>) => {
            state.requests = action.payload;
        },
        removeRequest: (state, action: PayloadAction<string>) => {
            state.requests = state.requests.filter(req => req.id !== action.payload);
        },
        clearRequests: (state) => {
            state.requests = [];
        },
    },
});

export const { setRequests, removeRequest, clearRequests } = listenerSlice.actions;
export default listenerSlice.reducer;
