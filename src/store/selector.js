import { createSelector } from '@reduxjs/toolkit';

export const selectUser = (state) => state.auth.user;  // ✅ Get user data
export const selectAuthLoader = (state) => state.auth.loading;  // ✅ Get loader data
export const selectAuthErrorMessage = (state) => state.auth.error;  // ✅ Get errorMessage data
export const selectItems = (state) => state.user.items;  // ✅ Get items data
export const selectCart = (state) => state.user.cart;  // ✅ Get cart data
export const selectOrders = (state) => state.user.orders;  // ✅ Get orders data
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

export const selectDriverOrders = (state) => state.driver.orders;  // ✅ Get all orders data
export const selectDriverItems = (state) => state.driver.items;  // ✅ Get all items data
export const selectDriverLoader = (state) => state.driver.loading;  // ✅ Get driver loader data
export const selectDriverError = (state) => state.driver.error;  // ✅ Get driver error data

// Admin selectors
export const selectAdminUsers = (state) => state.admin.users;
export const selectAdminDrivers = (state) => state.admin.drivers;
export const selectAdminItems = (state) => state.admin.items;
export const selectAdminOrders = (state) => state.admin.orders;
export const selectAllUsers = (state) => state.admin.users;

// Notification selectors
export const selectNotifications = (state) => state.auth.notifications;

// Advertisement selectors
export const selectAdvertisements = (state) => state.admin.advertisements;