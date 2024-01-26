import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AttachmentModalState {
  isModalOpen: boolean;
}

const initialState: AttachmentModalState = {
  isModalOpen: false,
};

const attachmentModalSlice = createSlice({
  name: 'attachmentModal',
  initialState,
  reducers: {
    setIsModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isModalOpen = action.payload;
    },
  },
});

export const { setIsModalOpen } = attachmentModalSlice.actions;
export default attachmentModalSlice.reducer;
