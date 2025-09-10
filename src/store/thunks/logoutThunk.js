import { createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout } from '../slices/authSlice';
import { resetUserState } from '../slices/userSlice';
import { resetDriverState } from '../slices/driverSlice';
import { resetAdminState } from '../slices/adminSlice';
import { clearSnackbar } from '../slices/snackbarSlice';

export const performLogout = createAsyncThunk(
  'auth/performLogout',
  async (_, { dispatch }) => {
    try {
      // Clear AsyncStorage
      await AsyncStorage.multiRemove([
        'access_token',
        'refresh_token', 
        'user_id',
        'user_role'
      ]);
      
      // Reset all slice states
      dispatch(logout());
      dispatch(resetUserState());
      dispatch(resetDriverState());
      dispatch(resetAdminState());
      dispatch(clearSnackbar());
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
);