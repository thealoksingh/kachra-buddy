import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: null,
  requests: [],
  bookings: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    setRequests: (state, action) => {
      state.requests = action.payload;
    },
    setBookings: (state, action) => {
      state.bookings = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setLoading, setProfile, setRequests, setBookings, setError, clearError } = userSlice.actions;
export default userSlice.reducer;