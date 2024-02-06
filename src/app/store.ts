import userPhotoReducer from '@/features/userIcon/userPhotoSlice';
import pdfModalReducer from '@/features/pdfModal/pdfModalSlice';
import conversationReducer from '@/features/chatbox/slices/conversationSlice';
import retryReducer from '@/features/chatbox/slices/retrySlice';
import shortcutsModalReducer from '@/features/chatbox/slices/shortcutModalSlice';
import attachmentModalReducer from '@/features/chatbox/slices/attachmentModalSlice';

import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    userPhoto: userPhotoReducer,
    pdfModal: pdfModalReducer,
    conversation: conversationReducer,
    retry: retryReducer,
    shortcutsModal: shortcutsModalReducer,
    attachmentModal: attachmentModalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;