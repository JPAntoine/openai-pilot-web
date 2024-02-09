import userPhotoReducer from '@/features/userIcon/userPhotoSlice';
import conversationReducer from '@/features/chatbox/slices/conversationSlice';
import retryReducer from '@/features/chatbox/slices/retrySlice';

import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    userPhoto: userPhotoReducer,
    conversation: conversationReducer,
    retry: retryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;