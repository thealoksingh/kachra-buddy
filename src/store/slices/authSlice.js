import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      
      state.user = null;
      state.loading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Sign In
      // .addCase(signIn.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(signIn.fulfilled, (state, action) => {
      //   state.loading = false;
      //   console.log("User = ", action.payload);
      //   state.user = action?.payload?.data;
      // })
      // .addCase(signIn.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action?.payload?.message;
      // })

    
    }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;