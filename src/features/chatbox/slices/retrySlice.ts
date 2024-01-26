import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RetryTimes } from '@/app/constants';

interface RetryState {
  backendUnavailable: boolean;
  retryCountdown: number;
  retryAttempt: number;
  userRetryCountdown: number;
  finalCountdown: number;
}

const initialState: RetryState = {
  backendUnavailable: false,
  retryCountdown: RetryTimes.BASE_DELAY,
  retryAttempt: 0,
  userRetryCountdown: 0,
  finalCountdown: RetryTimes.FINAL_WAIT_TIME,
};

const retrySlice = createSlice({
  name: 'retry',
  initialState,
  reducers: {
    setBackendUnavailable: (state, action: PayloadAction<boolean>) => {
      state.backendUnavailable = action.payload;
    },
    setRetryCountdown: (state, action: PayloadAction<number>) => {
      state.retryCountdown = action.payload;
    },
    setRetryAttempt: (state, action: PayloadAction<number>) => {
      state.retryAttempt = action.payload;
    },
    setUserRetryCountdown: (state, action: PayloadAction<number>) => {
      state.userRetryCountdown = action.payload;
    },
    resetRetryState: (state) => {
      state.backendUnavailable = false;
      state.retryCountdown = RetryTimes.BASE_DELAY;
      state.retryAttempt = 0;
      state.userRetryCountdown = 0;
    },
    setFinalCountdown: (state, action: PayloadAction<number>) => {
      state.finalCountdown = action.payload;
    },
  },
});

export const {
  setBackendUnavailable,
  setRetryCountdown,
  setRetryAttempt,
  setUserRetryCountdown,
  resetRetryState,
  setFinalCountdown,
} = retrySlice.actions;

export default retrySlice.reducer;
