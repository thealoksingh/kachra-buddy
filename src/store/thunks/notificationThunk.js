import { createAsyncThunk } from '@reduxjs/toolkit';
import { sendNotificationAPI, fetchNotificationsAPI, markNotificationAsReadAPI, deleteNotificationAPI, sendPersonalizedNotificationAPI, sendGlobalNotificationAPI } from '../../utils/api/notificationApi';
import { handleAxiosError } from '../../utils/handleAxiosError';

export const sendNotification = createAsyncThunk(
  'notification/sendNotification',
  async (notificationData, thunkAPI) => {
    try {
      const response = await sendNotificationAPI(notificationData);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

export const fetchNotifications = createAsyncThunk(
  'notification/fetchNotifications',
  async (userId, thunkAPI) => {
    try {
      if (!userId) {
        return thunkAPI.rejectWithValue({ message: 'User ID is required' });
      }
      const response = await fetchNotificationsAPI(userId);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notification/markAsRead',
  async (notificationId, thunkAPI) => {
    try {
      const response = await markNotificationAsReadAPI(notificationId);
      return { id: notificationId, ...response?.data };
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notification/delete',
  async (notificationId, thunkAPI) => {
    try {
      const response = await deleteNotificationAPI(notificationId);
      return { id: notificationId, ...response?.data };
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);


export const sendGlobalNotification = createAsyncThunk(
  'notification/sendGlobal',
  async (notificationData, thunkAPI) => {
    try {
      const response = await sendGlobalNotificationAPI(notificationData);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

export const sendPersonalizedNotification = createAsyncThunk(
  'notification/sendPersonalized',
  async (notificationData, thunkAPI) => {
    try {
      const response = await sendPersonalizedNotificationAPI(notificationData);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);
