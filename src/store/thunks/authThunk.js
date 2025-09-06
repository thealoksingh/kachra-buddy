import { createAsyncThunk } from '@reduxjs/toolkit';
import { sendOtpAPI, verifyOtpAPI } from '../../utils/api/authApi';
import { handleAxiosError } from '../../utils/handleAxiosError';


// Thunk for sending OTP
export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async (data, thunkAPI) => {
    try {
      const response = await sendOtpAPI(data);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

// Thunk for verifying OTP
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (data, thunkAPI) => {
    try {
      const response = await verifyOtpAPI(data);
      return response?.data;
    } catch (error) {
      console.log(error.response);
      return handleAxiosError(error, thunkAPI);
    }
  }
);

// Thunk for pinging the server
export const pingServer = createAsyncThunk(
  "auth/pingServer",
  async (_, thunkAPI) => {
    try {
      const response = await pingServerAPI();
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

