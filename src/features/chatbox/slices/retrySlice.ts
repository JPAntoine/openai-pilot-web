import { RetryTimes } from '@/app/constants';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RetryState {
  backendUnavailable: boolean;
  retryCountdown: number;
  retryAttempt: number;
  userRetryCountdown: number;
  finalCountdown: number;
}

export const initialState: RetryState = {
  backendUnavailable: false,
  retryCountdown: 0,
  retryAttempt: 0,
  userRetryCountdown: 0,
  finalCountdown: 0
};

const retrySlice = createSlice({
  name: 'retry',
  initialState,
  reducers: {
    setBackendUnavailable: (state, action: PayloadAction<boolean>) => {        
      if (action.payload && !state.backendUnavailable) {
        state.retryCountdown = RetryTimes.BASE_DELAY;
        state.retryAttempt = 0;
        state.userRetryCountdown = RetryTimes.UNAVAILABLE_ERROR_WAIT_TIME;
      }
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
    decrementUserRetryCountdown: (state) => {
      state.userRetryCountdown -= 1;
    },
    decrementRetryCountdown: (state) => {
      state.retryCountdown -= 1;
    },
    decrementFinalCountdown: (state) => {
      state.finalCountdown -= 1;
    },
    setFinalCountdown: (state, action: PayloadAction<number>) => {
      state.finalCountdown = action.payload;     
    },
    resetRetryState: (state) => {
      state.retryCountdown = 0;
      state.retryAttempt = 0;
      state.retryCountdown = 0;
      state.userRetryCountdown = 0;
    },
  },
});

export const {
  setBackendUnavailable,
  setRetryAttempt,
  setRetryCountdown,
  setUserRetryCountdown,
  decrementRetryCountdown,
  decrementUserRetryCountdown,
  decrementFinalCountdown,
  resetRetryState,
  setFinalCountdown,
} = retrySlice.actions;

export default retrySlice.reducer;
