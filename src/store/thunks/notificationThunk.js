import { createAsyncThunk } from '@reduxjs/toolkit';
import { sendNotificationAPI, fetchNotificationsAPI } from '../../utils/api/notificationApi';
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
  async (_, thunkAPI) => {
    try {
      const response = await fetchNotificationsAPI();
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);