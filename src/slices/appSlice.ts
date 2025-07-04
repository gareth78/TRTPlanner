import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  message: string;
}

const initialState: AppState = {
  message: 'Welcome to MediTrack',
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setMessage(state, action: PayloadAction<string>) {
      state.message = action.payload;
    },
  },
});

export const { setMessage } = appSlice.actions;
export default appSlice.reducer;
