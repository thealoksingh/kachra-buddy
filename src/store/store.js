import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import userSlice from './slices/userSlice';
import driverSlice from './slices/driverSlice';
import adminSlice from './slices/adminSlice';
import snackbarSlice from './slices/snackbarSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    driver: driverSlice,
    admin: adminSlice,
    snackbar: snackbarSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;