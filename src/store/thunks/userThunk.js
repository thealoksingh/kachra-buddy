import { createAsyncThunk } from '@reduxjs/toolkit';
import { setLoading, setProfile, setRequests, setBookings, setError } from '../slices/userSlice';

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      // Replace with actual API call
      const response = await fetch('/api/user/profile');
      if (!response.ok) throw new Error('Failed to fetch profile');
      
      const data = await response.json();
      dispatch(setProfile(data));
      return data;
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const fetchUserRequests = createAsyncThunk(
  'user/fetchRequests',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const response = await fetch('/api/user/requests');
      if (!response.ok) throw new Error('Failed to fetch requests');
      
      const data = await response.json();
      dispatch(setRequests(data));
      return data;
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(setLoading(false));
    }
  }
);