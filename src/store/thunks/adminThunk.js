import { createAsyncThunk } from '@reduxjs/toolkit';
import { setLoading, setUsers, setDrivers, setRequests, setAnalytics, setError } from '../slices/adminSlice';

export const fetchAllUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const response = await fetch('/api/admin/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      
      const data = await response.json();
      dispatch(setUsers(data));
      return data;
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

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