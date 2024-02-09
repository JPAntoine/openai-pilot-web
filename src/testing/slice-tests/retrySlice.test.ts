import { describe, it, expect } from 'vitest';
import retryReducer, {
  setBackendUnavailable,
  setRetryAttempt,
  setRetryCountdown,
  setUserRetryCountdown,
  decrementRetryCountdown,
  decrementUserRetryCountdown,
  decrementFinalCountdown,
  resetRetryState,
  setFinalCountdown,
  initialState,
} from '@/features/chatbox/slices/retrySlice'; 
import { RetryTimes } from '@/app/constants'; 

describe('retrySlice', () => {
  it('should handle initial state', () => {
    expect(retryReducer(undefined, { type: 'unknown' })).toEqual({
      backendUnavailable: false,
      retryCountdown: 0,
      retryAttempt: 0,
      userRetryCountdown: 0,
      finalCountdown: 0,
    });
  });

  it('should handle setBackendUnavailable', () => {
    const actual = retryReducer(undefined, setBackendUnavailable(true));
    expect(actual.backendUnavailable).toEqual(true);
    expect(actual.retryCountdown).toEqual(RetryTimes.BASE_DELAY);
    expect(actual.retryAttempt).toEqual(0);
    expect(actual.userRetryCountdown).toEqual(RetryTimes.UNAVAILABLE_ERROR_WAIT_TIME);
  });

  it('should handle setRetryCountdown', () => {
    const countdownValue = 10;
    const actual = retryReducer(undefined, setRetryCountdown(countdownValue));
    expect(actual.retryCountdown).toEqual(countdownValue);
  });

  it('should handle setRetryAttempt', () => {
    const attemptValue = 3;
    const actual = retryReducer(undefined, setRetryAttempt(attemptValue));
    expect(actual.retryAttempt).toEqual(attemptValue);
  });

  it('should handle setUserRetryCountdown', () => {
    const countdownValue = 5;
    const actual = retryReducer(undefined, setUserRetryCountdown(countdownValue));
    expect(actual.userRetryCountdown).toEqual(countdownValue);
  });

  it('should handle decrementUserRetryCountdown', () => {
    const initialStateWithCountdown = { ...initialState, userRetryCountdown: 5 };
    const actual = retryReducer(initialStateWithCountdown, decrementUserRetryCountdown());
    expect(actual.userRetryCountdown).toEqual(4);
  });

  it('should handle decrementRetryCountdown', () => {
    const initialStateWithCountdown = { ...initialState, retryCountdown: 10 };
    const actual = retryReducer(initialStateWithCountdown, decrementRetryCountdown());
    expect(actual.retryCountdown).toEqual(9);
  });

  it('should handle decrementFinalCountdown', () => {
    const initialStateWithCountdown = { ...initialState, finalCountdown: 3 };
    const actual = retryReducer(initialStateWithCountdown, decrementFinalCountdown());
    expect(actual.finalCountdown).toEqual(2);
  });

  it('should handle setFinalCountdown', () => {
    const countdownValue = 7;
    const actual = retryReducer(undefined, setFinalCountdown(countdownValue));
    expect(actual.finalCountdown).toEqual(countdownValue);
  });

  it('should handle resetRetryState', () => {
    // Given an altered state
    const alteredState = {
      backendUnavailable: true,
      retryCountdown: 5,
      retryAttempt: 2,
      userRetryCountdown: 5,
      finalCountdown: 1,
    };
    // When resetRetryState is dispatched
    const actual = retryReducer(alteredState, resetRetryState());
    // Then the state should be reset to initial values
    expect(actual).toEqual({
      backendUnavailable: true,//we do not want to change backendUnavailable because it is true until the end of the final countdown
      retryCountdown: 0,
      retryAttempt: 0,
      userRetryCountdown: 0,
      finalCountdown: 1, //we do not want to change final countdown
    });
  });
});
