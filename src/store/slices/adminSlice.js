import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  drivers: [],
  requests: [],
  analytics: null,
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setDrivers: (state, action) => {
      state.drivers = action.payload;
    },
    setRequests: (state, action) => {
      state.requests = action.payload;
    },
    setAnalytics: (state, action) => {
      state.analytics = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { 
  setLoading, 
  setUsers, 
  setDrivers, 
  setRequests, 
  setAnalytics, 
  setError, 
  clearError 
} = adminSlice.actions;
export default adminSlice.reducer;