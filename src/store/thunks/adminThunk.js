import { createAsyncThunk } from '@reduxjs/toolkit';
import { setLoading, setUsers, setDrivers, setRequests, setAnalytics, setError } from '../slices/adminSlice';
import { updateAdminProfileAPI, updateAdminProfilePicAPI, fetchAllItemsAPI, createItemAPI, updateItemAPI, fetchAllOrdersAPI, fetchAllUsersAPI, createUserAPI, updateUserAPI, assignDriverAPI, createAdvertisementAPI, fetchAllAdvertisementsAPI, updateAdvertisementAPI, fetchAllTicketsAPI, updateTicketAPI } from '../../utils/api/adminApi';
import { handleAxiosError } from '../../utils/handleAxiosError';


export const fetchAllDrivers = createAsyncThunk(
  'admin/fetchDrivers',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const response = await fetch('/api/admin/drivers');
      if (!response.ok) throw new Error('Failed to fetch drivers');
      
      const data = await response.json();
      dispatch(setDrivers(data));
      return data;
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const fetchAnalytics = createAsyncThunk(
  'admin/fetchAnalytics',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const response = await fetch('/api/admin/analytics');
      if (!response.ok) throw new Error('Failed to fetch analytics');
      
      const data = await response.json();
      dispatch(setAnalytics(data));
      return data;
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Thunk for updating admin profile
export const updateAdminProfile = createAsyncThunk(
  'admin/updateProfile',
  async (profileData, thunkAPI) => {
    try {
      const response = await updateAdminProfileAPI(profileData);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

// Thunk for updating admin profile picture
export const updateAdminProfilePic = createAsyncThunk(
  'admin/updateProfilePic',
  async (imageData, thunkAPI) => {
    try {
      const response = await updateAdminProfilePicAPI(imageData);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

export const fetchAllItems = createAsyncThunk(
  'admin/fetchAllItems',
  async (_, thunkAPI) => {
    try {
      const response = await fetchAllItemsAPI();
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

export const createItem = createAsyncThunk(
  'admin/createItem',
  async ({ itemData, file }, thunkAPI) => {
    try {
      const response = await createItemAPI(itemData, file);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

export const updateItem = createAsyncThunk(
  'admin/updateItem',
  async ({ itemId, itemData, file }, thunkAPI) => {
    try {
      const response = await updateItemAPI(itemId, itemData, file);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

export const fetchAllOrders = createAsyncThunk(
  'admin/fetchAllOrders',
  async (_, thunkAPI) => {
    try {
      const response = await fetchAllOrdersAPI();
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  'admin/fetchAllUsers',
  async (_, thunkAPI) => {
    try {
      const response = await fetchAllUsersAPI();
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

export const createUser = createAsyncThunk(
  'admin/createUser',
  async (userData, thunkAPI) => {
    try {
      const response = await createUserAPI(userData);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

export const updateUser = createAsyncThunk(
  'admin/updateUser',
  async ({ userId, userData }, thunkAPI) => {
    try {
      const response = await updateUserAPI(userId, userData);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

export const assignDriver = createAsyncThunk(
  'admin/assignDriver',
  async ({ orderId, driverId }, thunkAPI) => {
    try {
      const response = await assignDriverAPI(orderId, driverId);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

export const createAdvertisement = createAsyncThunk(
  'admin/createAdvertisement',
  async ({ advertisementData, file }, thunkAPI) => {
    try {
      const response = await createAdvertisementAPI(advertisementData, file);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

export const fetchAllAdvertisements = createAsyncThunk(
  'admin/fetchAllAdvertisements',
  async (_, thunkAPI) => {
    try {
      const response = await fetchAllAdvertisementsAPI();
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

export const updateAdvertisement = createAsyncThunk(
  'admin/updateAdvertisement',
  async ({ advertisementId, advertisementData, file }, thunkAPI) => {
    try {
      const response = await updateAdvertisementAPI(advertisementId, advertisementData, file);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);


export const fetchAllTickets = createAsyncThunk(
  'admin/fetchAllTickets',
  async (_, thunkAPI) => {
    try {
      const response = await fetchAllTicketsAPI();
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

export const updateTicket = createAsyncThunk(
  'admin/updateTicket',
  async ({ ticketId, ticketData }, thunkAPI) => {
    try {
      const response = await updateTicketAPI(ticketId, ticketData);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);