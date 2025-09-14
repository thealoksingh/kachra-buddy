import { configureStore } from '@reduxjs/toolkit';
import authSlice, { loadNotifications } from './slices/authSlice';
import userSlice from './slices/userSlice';
import driverReducer from './slices/driverSlice';
import adminSlice from './slices/adminSlice';
import snackbarSlice from './slices/snackbarSlice';
import lottieAlertReducer from './slices/lottieAlertSlice';
import snackbarReducer, { showSnackbar } from '../store/slices/snackbarSlice';
import authReducer from '../store/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserById } from '../store/thunks/userThunk';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userSlice,
    driver: driverReducer,
    admin: adminSlice,
    snackbar: snackbarReducer,
    lottieAlert: lottieAlertReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }),
});

const loadUserData = async () => {
  try {
    const user_id = await AsyncStorage.getItem('user_id');
    const storedNotifications = await AsyncStorage.getItem('notifications');

    console.log('user Id in store', user_id);
    console.log('storedNotifications in store', storedNotifications);
    if (user_id) {
      await store.dispatch(getUserById({ userId: parseInt(user_id) }));
    }

    if (storedNotifications) {
      const { loadNotifications } = require('./slices/authSlice');
      store.dispatch(loadNotifications(JSON.parse(storedNotifications)));
    }
  } catch (error) {
    console.log('Error loading user data:', error);
    store.dispatch(
      showSnackbar({
        message: error?.message || 'Logged-In failed. Try again',
        type: 'error',
        time: 3000,
      }),
    );
  }
};

loadUserData();

export default store;
