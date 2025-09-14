import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchDriverOrdersAPI, getAllOrdersAPI, updateDriverOrderAPI, outForPickupAPI, outForDeliveryAPI, getAllItemsAPI, addItemsToOrderAPI } from '../../utils/api/driverApi';
import { handleAxiosError } from '../../utils/handleAxiosError';

// Thunk for fetching all driver orders
export const fetchDriverOrders = createAsyncThunk(
  "driver/fetchDriverOrders",
  async (_, thunkAPI) => {
    try {
      const response = await fetchDriverOrdersAPI();
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

// Thunk for getting all orders
export const getAllOrders = createAsyncThunk(
  "driver/getAllOrders",
  async (_, thunkAPI) => {
    try {
      const response = await getAllOrdersAPI();
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

// Thunk for updating driver order
export const updateDriverOrder = createAsyncThunk(
  "driver/updateDriverOrder",
  async (data, thunkAPI) => {
    try {
      const response = await updateDriverOrderAPI(data);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

// Thunk for marking order as out for pickup
export const outForPickup = createAsyncThunk(
  "driver/outForPickup",
  async (orderId, thunkAPI) => {
    try {
      const response = await outForPickupAPI(orderId);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

// Thunk for marking order as out for delivery
export const outForDelivery = createAsyncThunk(
  "driver/outForDelivery",
  async (orderId, thunkAPI) => {
    try {
      const response = await outForDeliveryAPI(orderId);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

// Thunk for fetching all items
export const fetchAllItems = createAsyncThunk(
  "driver/fetchAllItems",
  async (_, thunkAPI) => {
    try {
      const response = await getAllItemsAPI();
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

// Thunk for adding items to order
export const addItemsToOrder = createAsyncThunk(
  "driver/addItemsToOrder",
  async ({ orderId, items }, thunkAPI) => {
    try {
      const response = await addItemsToOrderAPI(orderId, items);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);