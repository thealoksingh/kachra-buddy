import { createSlice } from '@reduxjs/toolkit';
import { sendOtp, verifyOtp, getAllSupportTickets } from '../thunks/authThunk';
import { completeUserProfile, getUserById, updateProfilePic, updateUser } from '../thunks/userThunk';
import { updateAdminProfile, updateAdminProfilePic } from '../thunks/adminThunk';
import { sendNotification, fetchNotifications, markNotificationAsRead, deleteNotification } from '../thunks/notificationThunk';

const initialState = {
  user: null,
  notifications: [],
  supportTickets: [],
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.notifications = [];
      state.supportTickets = [];
      state.loading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Send OTP
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.message;
      })
      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action?.payload?.data;
        console.log("user data in auth slice", state.user);
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.message;
      })
      
      // get user by id
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action?.payload?.data;
        console.log("user data in auth slice", state.user);
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.message;
      })
      // complete user profile
      .addCase(completeUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action?.payload?.data;
        console.log("user data in auth slice", state.user);
      })
      .addCase(completeUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.message;
      })
      // Update Profile Picture
      .addCase(updateProfilePic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfilePic.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action?.payload?.data;
      })
      .addCase(updateProfilePic.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.message;
      })
      // Update User
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action?.payload?.data;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.message;
      })
      // Update Admin Profile
      .addCase(updateAdminProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdminProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action?.payload?.data;
      })
      .addCase(updateAdminProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.message;
      })
      // Update Admin Profile Picture
      .addCase(updateAdminProfilePic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdminProfilePic.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action?.payload?.data;
      })
      .addCase(updateAdminProfilePic.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.message;
      })
      // Send Notification
      .addCase(sendNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendNotification.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(sendNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.message;
      })
      // Fetch Notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action?.payload?.data || [];
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.message;
      })
      // Mark Notification as Read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notificationId = action.payload.id;
        const index = state.notifications.findIndex(n => n.id === notificationId);
        if (index !== -1) {
          state.notifications[index].status = 'READ';
          state.notifications[index].readAt = new Date().toISOString();
        }
      })
      // Delete Notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const notificationId = action.payload.id;
        state.notifications = state.notifications.filter(n => n.id !== notificationId);
      })
      // Get All Support Tickets
      .addCase(getAllSupportTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllSupportTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.supportTickets = action?.payload?.data || [];
      })
      .addCase(getAllSupportTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.message;
      });
    }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;