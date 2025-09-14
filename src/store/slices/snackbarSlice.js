import { createSlice } from '@reduxjs/toolkit';

const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState: {
    message: '',
    type: 'success', // 'success' or 'error'
    time: 0,
  },
  reducers: {
    showSnackbar: (state, action) => {
      state.message = action.payload.message;
      state.type = action.payload.type || 'success';
      state.time = action.payload.time
    },
    clearSnackbar: (state) => {
      state.message = '';
      state.type = 'success';
      state.time = 0
    },
  },
});

export const { showSnackbar, clearSnackbar } = snackbarSlice.actions;
export default snackbarSlice.reducer;
