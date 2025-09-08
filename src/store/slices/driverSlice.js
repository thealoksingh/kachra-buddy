import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: null,
  assignments: [],
  routes: [],
  isOnline: false,
  currentLocation: null,
  loading: false,
  error: null,
};

const driverSlice = createSlice({
  name: 'driver',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    setAssignments: (state, action) => {
      state.assignments = action.payload;
    },
    setRoutes: (state, action) => {
      state.routes = action.payload;
    },
    setOnlineStatus: (state, action) => {
      state.isOnline = action.payload;
    },
    setCurrentLocation: (state, action) => {
      state.currentLocation = action.payload;
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
  setProfile, 
  setAssignments, 
  setRoutes, 
  setOnlineStatus, 
  setCurrentLocation, 
  setError, 
  clearError 
} = driverSlice.actions;
export default driverSlice.reducer;