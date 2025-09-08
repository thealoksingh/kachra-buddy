import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginStart, loginSuccess, loginFailure } from '../slices/authSlice';

// Get User By Token (protected, use refresh)
export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async (data, thunkAPI) => {
    return withRefreshTokenRetry(
      async () => {
        try {
          const response = await loginAPI(data);
         
            return response?.data;
         
        } catch (error) {
          return handleAxiosError(error, thunkAPI);
        }
      },
      thunkAPI
    );
  }
);

