import { setHasCompletionError } from "@/features/chatbox/slices/conversationSlice";
import {
  resetRetryState,
  setBackendUnavailable,
  setRetryAttempt,
  setFinalCountdown,
  setRetryCountdown,
  decrementRetryCountdown,
  decrementUserRetryCountdown,
  decrementFinalCountdown,
} from "@/features/chatbox/slices/retrySlice";
import { AxiosResponse, AxiosError, CancelToken } from "axios";
import { baseAxiosInstance } from "./base-api";
import { RetryTimes } from "./constants";
import { AppDispatch } from "./store";

type ApiFunctionArgs<T> = {
  args: T;
  cancelToken: CancelToken;
  dispatch: AppDispatch;
  url: string;
};
export interface ErrorLog {
  e: AxiosError;
  status?: number;
  message: string;
  stack?: string;
  url: string;
  args: unknown;
  retryAttempt: number;
  timestamp: string;
}

type ApiResponse<T> = Promise<T>;

export async function executeApiRequest<T, R>({
  args,
  cancelToken,
  dispatch,
  url,
}: ApiFunctionArgs<T>): ApiResponse<R> {
  let retryAttempt = 0;
  let retryCountdown = RetryTimes.BASE_DELAY;
  let userRetryCountdown = RetryTimes.UNAVAILABLE_ERROR_WAIT_TIME;
  let retryTimer = undefined;

  type Timer = {
    stop: () => void;
    isRunning: () => boolean;
  };

  const startRetryTimer = (countFrom: number, dispatch: AppDispatch): Timer => {
    let running = true;
    const intervalId = setInterval(() => {
      if (countFrom > 0) {
        countFrom -= 1;
        retryCountdown -= 1;
        dispatch(decrementUserRetryCountdown());
      } else {
        clearInterval(intervalId);
        return;
      }
    }, 1000);
    return {
      stop: () => {
        if (running) {
          clearInterval(intervalId);
          running = false;
        }
      },
      isRunning: () => running,
    };
  };

  const startFinalCountdownTimer = (
    countFrom: number,
    dispatch: AppDispatch
  ): Timer => {
    let running = true;
    const intervalId = setInterval(() => {
      if (countFrom > 0) {
        countFrom -= 1;
        dispatch(decrementFinalCountdown());
      } else {
        clearInterval(intervalId);
        dispatch(resetRetryState());
        dispatch(setBackendUnavailable(false));
        return;
      }
    }, 1000);
    return {
      stop: () => {
        if (running) {
          clearInterval(intervalId);
          running = false;
        }
      },
      isRunning: () => running,
    };
  };

  const logError = (e: AxiosError) => {
    const errorLog: ErrorLog = {
      e: e,
      status: e.response?.status,
      message: e.message,
      stack: e.stack,
      url: url,
      args: args,
      retryAttempt: retryAttempt,
      timestamp: new Date().toISOString(),
    };

    console.error(errorLog);
  };

  const makeRequest = async (): Promise<R> => {
    try {
      const response: AxiosResponse<R> = await baseAxiosInstance.post(
        url,
        args,
        {
          cancelToken: cancelToken,
        }
      );
      dispatch(setBackendUnavailable(false));
      return response.data;
    } catch (e) {
      const status = (e as AxiosError).response?.status;
      logError(e as AxiosError);
      if (status === 503 || status === 429) {
        dispatch(setBackendUnavailable(true));
        retryTimer = startRetryTimer(userRetryCountdown, dispatch);
        userRetryCountdown -= 1;
        if (retryCountdown >= 1) {
          retryCountdown -= 1;
          dispatch(decrementRetryCountdown());
        } else {
          dispatch(setRetryAttempt(0));
          const finalRetryTime = RetryTimes.FINAL_WAIT_TIME * 60;
          dispatch(setFinalCountdown(finalRetryTime));
          startFinalCountdownTimer(finalRetryTime, dispatch);
          retryTimer.stop();
        }
        retryAttempt += 1;
        dispatch(setRetryAttempt(retryAttempt));
        const nextDelay = 2 * RetryTimes.BASE_DELAY * 2 ** retryAttempt;

        if (nextDelay <= RetryTimes.MAX_RETRY_DURATION) {
          retryCountdown = nextDelay;
          dispatch(setRetryCountdown(nextDelay));
        } else {
          //stop execution
          dispatch(resetRetryState());
          throw new Error("API request failed after retries.");
        }
        // Wait for retryDelay milliseconds before retrying
        await new Promise((resolve) => setTimeout(resolve, nextDelay * 1000));
        // Retry the request
        return makeRequest();
      } else {
        dispatch(setHasCompletionError());
        throw new Error("API request failed after retries.");
      }
    }
  };

  return makeRequest();
}
