import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RetryState {
  backendUnavailable: boolean;
  retryAttempt: number;
  userRetryCountdown: number;
}

const initialState: RetryState = {
  backendUnavailable: false,
  retryAttempt: 0,
  userRetryCountdown: 0,
};

const retrySlice = createSlice({
  name: 'retry',
  initialState,
  reducers: {
    setBackendUnavailable: (state, action: PayloadAction<boolean>) => {
      state.backendUnavailable = action.payload;
    },
    setRetryAttempt: (state, action: PayloadAction<number>) => {
      state.backendUnavailable = true;
      state.retryAttempt = action.payload;
    },
    setUserRetryCountdown: (state, action: PayloadAction<number>) => {
      state.userRetryCountdown = action.payload;
    },
    resetRetryState: (state) => {
      state.backendUnavailable = false;
      state.retryAttempt = 0;
      state.userRetryCountdown = 0;
    },
  },
});

export const {
  setBackendUnavailable,
  setRetryAttempt,
  setUserRetryCountdown,
  resetRetryState,
} = retrySlice.actions;

export default retrySlice.reducer;
