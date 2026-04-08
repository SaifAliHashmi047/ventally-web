import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type PreferredLanguage = 'en' | 'pt' | 'fr' | 'es' | null;

export interface CustomBackground {
  id: string;
  uri: string;
  name: string;
}

interface AppState {
  isLoading: boolean;
  user: {
    name: string;
    email: string;
  } | null;
  preferredLanguage: PreferredLanguage;
  customBackgrounds: CustomBackground[];
  selectedBackgroundId: string | null;
}

const initialState: AppState = {
  isLoading: false,
  user: null,
  preferredLanguage: null,
  customBackgrounds: [],
  selectedBackgroundId: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setUser: (state, action: PayloadAction<{ name: string; email: string } | null>) => {
      state.user = action.payload;
    },
    setPreferredLanguage: (state, action: PayloadAction<PreferredLanguage>) => {
      state.preferredLanguage = action.payload;
    },
    addCustomBackground: (state, action: PayloadAction<CustomBackground>) => {
      console.log("new bg image", action.payload);
      if (!state.customBackgrounds) {
        state.customBackgrounds = [];
      }
      state.customBackgrounds.push(action.payload);
    },
    removeCustomBackground: (state, action: PayloadAction<string>) => {
      if (!state.customBackgrounds) {
        state.customBackgrounds = [];
        return;
      }
      state.customBackgrounds = state.customBackgrounds.filter(bg => bg.id !== action.payload);
    },
    setSelectedBackgroundId: (state, action: PayloadAction<string | null>) => {
      state.selectedBackgroundId = action.payload;
    },
  },
});

export const {
  setLoading,
  setUser,
  setPreferredLanguage,
  addCustomBackground,
  removeCustomBackground,
  setSelectedBackgroundId
} = appSlice.actions;
export default appSlice.reducer;
