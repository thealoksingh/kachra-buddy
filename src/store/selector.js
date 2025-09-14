import { createSelector } from '@reduxjs/toolkit';

export const selectUser = (state) => state.auth.user;  // ✅ Get user data
export const selectAuthLoader = (state) => state.auth.loading;  // ✅ Get loader data
export const selectAuthErrorMessage = (state) => state.auth.error;  // ✅ Get errorMessage data
const selectItemsRaw = (state) => state.user.items || [];
const selectOrdersRaw = (state) => state.user.orders || [];

export const selectItems = createSelector(
  [selectItemsRaw],
  (items) => [...items].reverse()
);

export const selectBestDealItems = createSelector(
  [selectItemsRaw],
  (items) => items.filter(item => item.tags?.includes("Best-Deals"))
);
export const selectCart = (state) => state.user.cart;  // ✅ Get cart data

export const selectOrders = createSelector(
  [selectOrdersRaw],
  (orders) => [...orders].reverse()
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
const selectDriverOrdersRaw = (state) => state.driver.orders || [];
const selectDriverItemsRaw = (state) => state.driver.items || [];

export const selectDriverOrders = createSelector(
  [selectDriverOrdersRaw],
  (orders) => [...orders].reverse()
);

export const selectDriverItems = createSelector(
  [selectDriverItemsRaw],
  (items) => [...items].reverse()
);

export const selectDriverLoader = (state) => state.driver.loading;  // ✅ Get driver loader data
export const selectDriverError = (state) => state.driver.error;  // ✅ Get driver error data

// Admin selectors
const selectAdminUsersRaw = (state) => state.admin.users || [];
const selectAdminDriversRaw = (state) => state.admin.drivers || [];
const selectAdminItemsRaw = (state) => state.admin.items || [];
const selectAdminOrdersRaw = (state) => state.admin.orders || [];
const selectAdvertisementsRaw = (state) => state.admin.advertisements || [];

export const selectAdminUsers = createSelector(
  [selectAdminUsersRaw],
  (users) => [...users].reverse()
);

export const selectAdminDrivers = createSelector(
  [selectAdminDriversRaw],
  (drivers) => [...drivers].reverse()
);

export const selectAdminItems = createSelector(
  [selectAdminItemsRaw],
  (items) => [...items].reverse()
);

export const selectAdminOrders = createSelector(
  [selectAdminOrdersRaw],
  (orders) => [...orders].reverse()
);

export const selectAllUsers = createSelector(
  [selectAdminUsersRaw],
  (users) => [...users].reverse()
);

// Notification selectors
export const selectNotifications = (state) => {
  console.log('selectNotifications - state.auth:', state.auth);
  console.log('selectNotifications - notifications:', state.auth.notifications);
  return state.auth.notifications || [];
};

export const selectNotificationsReversed = createSelector(
  [selectNotifications],
  (notifications) => [...notifications].reverse()
);

export const selectUnreadNotifications = createSelector(
  [selectNotifications],
  (notifications) => notifications.filter(notification => notification?.status === 'UNREAD')
);

// Advertisement selectors
export const selectAdvertisements = createSelector(
  [selectAdvertisementsRaw],
  (advertisements) => [...advertisements].reverse()
);

export const selectAdvertisementsByDisplayOrder = createSelector(
  [selectAdvertisementsRaw],
  (advertisements) => [...advertisements].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
);

// Support tickets selectors
const selectSupportTicketsRaw = (state) => state.auth.supportTickets || [];

export const selectSupportTickets = createSelector(
  [selectSupportTicketsRaw],
  (tickets) => [...tickets].reverse()
);

// All tickets selector for admin
const selectAllTicketsRaw = (state) => state.admin.allTickets || [];

export const selectAllTickets = createSelector(
  [selectAllTicketsRaw],
  (tickets) => [...tickets].reverse()
);