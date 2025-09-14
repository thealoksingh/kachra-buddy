import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  visible: false,
  type: 'success',
  message: '',
  autoClose: true,
};

const lottieAlertSlice = createSlice({
  name: 'lottieAlert',
  initialState,
  reducers: {
    showLottieAlert: (state, action) => {
      state.visible = true;
      state.type = action.payload.type;
      state.message = action.payload.message;
      state.autoClose = action.payload.autoClose !== undefined ? action.payload.autoClose : true;
    },
    hideLottieAlert: (state) => {
      state.visible = false;
      state.type = 'success';
      state.message = '';
    },
  },
});

export const { showLottieAlert, hideLottieAlert } = lottieAlertSlice.actions;
export default lottieAlertSlice.reducer;