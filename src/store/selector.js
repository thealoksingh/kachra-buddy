import { createSelector } from '@reduxjs/toolkit';

export const selectUser = (state) => state.auth.user;  // ✅ Get user data
export const selectAuthLoader = (state) => state.auth.loading;  // ✅ Get loader data
export const selectAuthErrorMessage = (state) => state.auth.error;  // ✅ Get errorMessage data
// Memoized selector for items to prevent unnecessary rerenders
export const selectItems = createSelector(
  [(state) => state.user.items],
  (items) => items ? [...items].reverse() : []
);
export const selectCart = (state) => state.user.cart;  // ✅ Get cart data
// Memoized selector for orders to prevent unnecessary rerenders
export const selectOrders = createSelector(
  [(state) => state.user.orders],
  (orders) => orders ? [...orders].reverse() : []
);
export const selectUserLoader = (state) => state.user.loading;  // ✅ Get user loader data
export const selectUserError = (state) => state.user.error;  // ✅ Get user error data

// ✅ Memoized selector to check if item is in cart
export const selectIsItemInCart = createSelector(
  [selectCart, (state, itemId) => itemId],
  (cart, itemId) => {
    if (!cart || !cart.cartItems || !Array.isArray(cart.cartItems)) return false;
    return cart.cartItems.some(cartItem => cartItem.item.id === itemId);
  }
);

// ✅ Driver selectors

// Memoized selectors for driver data
export const selectDriverOrders = createSelector(
  [(state) => state.driver.orders],
  (orders) => orders ? [...orders].reverse() : []
);

export const selectDriverItems = createSelector(
  [(state) => state.driver.items],
  (items) => items ? [...items].reverse() : []
);
export const selectDriverLoader = (state) => state.driver.loading;  // ✅ Get driver loader data
export const selectDriverError = (state) => state.driver.error;  // ✅ Get driver error data

// Admin selectors
export const selectAdminUsers = (state) => state.admin.users ? [...state.admin.users].reverse() : [];
export const selectAdminDrivers = (state) => state.admin.drivers ? [...state.admin.drivers].reverse() : [];
export const selectAdminItems = (state) => state.admin.items ? [...state.admin.items].reverse() : [];
export const selectAdminOrders = (state) => state.admin.orders ? [...state.admin.orders].reverse() : [];
export const selectAllUsers = (state) => state.admin.users ? [...state.admin.users].reverse() : [];

// Notification selectors
export const selectNotifications = (state) => state.auth.notifications || [];

export const selectNotificationsReversed = createSelector(
  [selectNotifications],
  (notifications) => [...notifications].reverse()
);

export const selectUnreadNotifications = createSelector(
  [selectNotifications],
  (notifications) => notifications.filter(notification => notification?.status === 'UNREAD')
);

// Advertisement selectors
export const selectAdvertisements = (state) => state.admin.advertisements ? [...state.admin.advertisements].reverse() : [];