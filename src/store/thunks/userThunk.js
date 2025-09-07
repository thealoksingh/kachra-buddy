import { createAsyncThunk } from '@reduxjs/toolkit';
import { completeProfileAPI, getUserByIdAPI, updateProfilePicAPI, updateUserAPI } from '../../utils/api/userApi';
import { handleAxiosError } from '../../utils/handleAxiosError';

// Thunk for sending OTP
export const getUserById = createAsyncThunk(
  "auth/getUserById",
  async (data, thunkAPI) => {
    try {
      const response = await getUserByIdAPI(data);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

// Thunk for completing user profile
export const completeUserProfile = createAsyncThunk(
  "auth/completeUserProfile",
  async (data, thunkAPI) => {
    try {
      const response = await completeProfileAPI(data);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

export const updateProfilePic = createAsyncThunk(
  "user/updateProfilePic",
  async (data, thunkAPI) => {
    try {
      const response = await updateProfilePicAPI(data);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (data, thunkAPI) => {
    try {
      const response = await updateUserAPI(data);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);