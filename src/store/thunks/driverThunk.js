import { createAsyncThunk } from '@reduxjs/toolkit';
import { setLoading, setProfile, setAssignments, setRoutes, setError } from '../slices/driverSlice';

export const fetchDriverProfile = createAsyncThunk(
  'driver/fetchProfile',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const response = await fetch('/api/driver/profile');
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

export const fetchDriverAssignments = createAsyncThunk(
  'driver/fetchAssignments',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const response = await fetch('/api/driver/assignments');
      if (!response.ok) throw new Error('Failed to fetch assignments');
      
      const data = await response.json();
      dispatch(setAssignments(data));
      return data;
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(setLoading(false));
    }
  }
);