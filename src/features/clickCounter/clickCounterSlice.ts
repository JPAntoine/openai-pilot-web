import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { checkPermissionAPI } from './clickCounterApi';

export interface ClickCounterState {    
    value: number;
    status: 'idle' | 'loading' | 'failed';
}

const initialState: ClickCounterState = {
    value: 0,
    status: 'idle',
};

export const checkPermission = createAsyncThunk(
    'counter/checkPermission',
    async () => {
      const response = await checkPermissionAPI();
      return response;
    }
);

export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
      reset: (state) => {
        state.value = 0;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(checkPermission.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(checkPermission.fulfilled, (state) => {
          state.value += 1;
          state.status = 'idle';
        })
        .addCase(checkPermission.rejected, (state) => {
          state.status = 'failed';
        });
    },
});

export const { reset } = counterSlice.actions;
export default counterSlice.reducer;