import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ShortcutsModalState {
  isModalOpen: boolean;
}

const initialState: ShortcutsModalState = {
  isModalOpen: false,
};

const shortcutsModalSlice = createSlice({
  name: 'shortcutsModal',
  initialState,
  reducers: {
    setIsModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isModalOpen = action.payload;
    },
  },
});

export const { setIsModalOpen } = shortcutsModalSlice.actions;
export default shortcutsModalSlice.reducer;
