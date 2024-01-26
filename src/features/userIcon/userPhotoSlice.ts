// userPhotoSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import getPhoto from './userIconApi';

interface UserPhotoState {
  userPhoto: string;
  attemptedRetrieval: boolean;
}

const initialState: UserPhotoState = {
  userPhoto: '',
  attemptedRetrieval: false,
};

export const fetchUserPhoto = createAsyncThunk(
  'userPhoto/fetchUserPhoto',
  async (token: string, { rejectWithValue }) => {
    try {
      const photo = await getPhoto(token);
      return photo;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const userPhotoSlice = createSlice({
  name: 'userPhoto',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUserPhoto.fulfilled, (state, action) => {
      state.userPhoto = action.payload;
      state.attemptedRetrieval = true;
    });
  },
});

export default userPhotoSlice.reducer;
