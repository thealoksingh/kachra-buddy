import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import userSlice from './slices/userSlice';
import driverSlice from './slices/driverSlice';
import adminSlice from './slices/adminSlice';
import snackbarSlice from './slices/snackbarSlice';
import snackbarReducer, { showSnackbar } from "../store/slices/snackbarSlice";
import authReducer from "../store/slices/authSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userSlice,
    driver: driverSlice,
    admin: adminSlice,
    snackbar: snackbarReducer,
  },
   middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

const loadUserData = async () => {
  try {
    const user_id = await AsyncStorage.getItem("user_id");
    // const accessToken = await AsyncStorage.getItem("accessToken");
    console.log("user Id in store", user_id);
    // console.log("Access token in store", accessToken);
    // if (user_id && accessToken) {
    if (user_id) {
      await store.dispatch(getUserById(parseInt(user_id)));
    }
  } catch (error) {
    console.log("Error loading user data:", error);
    store.dispatch(
      showSnackbar({ message: error?.message || "Logged-In failed. Try again", type: "error", time: 3000 })
    );
  }
};

// loadUserData();


export default store;