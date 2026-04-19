import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { clearTokens, getAccessToken, getRefreshToken } from '../../api/apiInstance';


export interface User {
  id: string;
  name: string;
  displayName?: string;
  email: string;
  role: 'listener' | 'venter' | 'admin' | '';
  activeRole?: string;
  availableRoles?: string[];
  userType?: string;
  isVerified?: boolean;
  phone?: string | null;
  image?: string;
  /** Venter wallet balance in dollars */
  balance?: number;
  preferredLanguage?: string;
  /** Optional onboarding / profile answers */
  gender?: string;
  ageGroup?: string;
  culturalBackground?: string;
  lgbtqIdentity?: string;
  faithOrBelief?: string;
  ethnicity?: string;
  specialTopics?: string[];
  /** Listener-specific onboarding fields */
  listenerSignature?: string;
  verificationDocumentStatus?: string;
}

interface UserState {
  user: User;
  isAuthenticated: boolean;
  isVenter: boolean;
}

const initialState: UserState = {
  user: {
    id: '',
    name: '',
    email: '',
    role: '',
    image: '',
    balance: 20,
  },
  isVenter: true,
  isAuthenticated: false,
};

/** Initialize auth state: check localStorage for tokens without API call */
export const initializeAuth = createAsyncThunk(
  'user/initializeAuth',
  async () => {
    const accessToken = await getAccessToken();
    const refreshToken = await getRefreshToken();
    // Just check if tokens exist in storage - don't call API
    const isAuthenticated = !!(accessToken && refreshToken);
    return { isAuthenticated };
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      state.user = { ...state.user, ...action.payload };
    },
    setUserRole: (state, action: PayloadAction<'listener' | 'venter' | 'admin'>) => {
      state.user.role = action.payload;
    },
    clearUser: (state) => {
      state.user = initialState.user;
      state.isAuthenticated = false;
    },
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setIsVenter: (state, action: PayloadAction<boolean>) => {
      state.isVenter = action.payload;
    },
    deductBalance: (state, action: PayloadAction<number>) => {
      const current = state.user.balance ?? 0;
      state.user.balance = Math.max(0, current - action.payload);
    },
    addBalance: (state, action: PayloadAction<number>) => {
      const current = state.user.balance ?? 0;
      state.user.balance = current + action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initializeAuth.fulfilled, (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
    });
  },
});

export const { setUser, updateUser, setUserRole, clearUser, setAuthenticated, setIsVenter, deductBalance, addBalance } = userSlice.actions;

/** Global logout: clears tokens from storage and resets user state */
export const logout = createAsyncThunk(
  'user/logout',
  async (_, { dispatch }) => {
    await clearTokens();
    dispatch(clearUser());
  }
);

export default userSlice.reducer;