import { createAsyncThunk } from '@reduxjs/toolkit';
import { completeProfileAPI, getUserByIdAPI, updateProfilePicAPI, updateUserAPI, fetchItemsAPI, fetchCartAPI, addItemToCartAPI, removeItemFromCartAPI, checkoutCartAPI } from '../../utils/api/userApi';
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

export const fetchItems = createAsyncThunk(
  "user/fetchItems",
  async (_, thunkAPI) => {
    try {
      const response = await fetchItemsAPI();
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

// Thunk for fetching user's cart
export const fetchCart = createAsyncThunk(
  "user/fetchCart",
  async (_, thunkAPI) => {
    try {
      const response = await fetchCartAPI();
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

// Thunk for adding item to cart
export const addItemToCart = createAsyncThunk(
  "user/addItemToCart",
  async (data, thunkAPI) => {
    try {
      const response = await addItemToCartAPI(data);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

// Thunk for removing item from cart
export const removeItemFromCart = createAsyncThunk(
  "user/removeItemFromCart",
  async (itemId, thunkAPI) => {
    try {
      const response = await removeItemFromCartAPI(itemId);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

// Thunk for checkout cart
export const checkoutCart = createAsyncThunk(
  "user/checkoutCart",
  async (_, thunkAPI) => {
    try {
      const response = await checkoutCartAPI();
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);