import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Citation } from '../chatbox/api/chatService';

interface PdfModalState {
  isModalOpen: boolean;
  pdf: Citation | null;
}

const initialState: PdfModalState = {
  isModalOpen: false,
  pdf: null,
};

const pdfModalSlice = createSlice({
  name: 'pdfModal',
  initialState,
  reducers: {
    openModal: (state) => {
      state.isModalOpen = true;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
    },
    setPdf: (state, action: PayloadAction<Citation>) => {
      state.pdf = action.payload;
    },
    clearPdf: (state) => {
      state.pdf = null;
    },
  },
});

export const { openModal, closeModal, setPdf, clearPdf } = pdfModalSlice.actions;

export default pdfModalSlice.reducer;
