import { createSlice } from '@reduxjs/toolkit';
import {
  fetchAllItems,
  createItem,
  updateItem,
  deleteItem,
  fetchAllOrders,
  fetchAllUsers,
  createUser,
  updateUser,
  assignDriver,
  createAdvertisement,
  fetchAllAdvertisements,
  updateAdvertisement,
  fetchAllTickets,
  updateTicket,
  updateOrder,
  deleteAdvertisementById,
} from '../thunks/adminThunk';

const initialState = {
  users: [],
  drivers: [],
  requests: [],
  analytics: null,
  items: [],
  orders: [],
  advertisements: [],
  allTickets: [],

  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setDrivers: (state, action) => {
      state.drivers = action.payload;
    },
    setRequests: (state, action) => {
      state.requests = action.payload;
    },
    setAnalytics: (state, action) => {
      state.analytics = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: state => {
      state.error = null;
    },
    resetAdminState: state => {
      return initialState;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAllItems.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.data || [];
      })
      .addCase(fetchAllItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(createItem.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload?.data);
      })
      .addCase(createItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(updateItem.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.loading = false;
        const updatedItem = action.payload?.data;
        const index = state.items.findIndex(item => item.id === updatedItem.id);
        if (index !== -1) {
          state.items[index] = updatedItem;
        }
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(deleteItem.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.loading = false;
        // The deleted item ID should be from the thunk meta.arg since API might not return the item
        const deletedItemId = action.meta.arg.itemId;
        state.items = state.items.filter(item => item.id !== deletedItemId);
        console.log('Item deleted from state, remaining items:', state.items.length);
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(fetchAllOrders.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload?.data || [];
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(fetchAllUsers.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action?.payload?.data || [];
        console.log('all users in admin slice', state.allUsers);
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(createUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload?.data);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(updateUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload?.data;
        const index = state.users.findIndex(user => user.id === updatedUser.id);
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(assignDriver.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignDriver.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOrder = action.payload?.data;
        const index = state.orders.findIndex(
          order => order.id === updatedOrder.id,
        );
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
      })
      .addCase(assignDriver.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(createAdvertisement.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAdvertisement.fulfilled, (state, action) => {
        state.loading = false;
        state.advertisements.push(action.payload?.data);
      })
      .addCase(createAdvertisement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(fetchAllAdvertisements.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAdvertisements.fulfilled, (state, action) => {
        state.loading = false;
        state.advertisements = action.payload?.data || [];
      })
      .addCase(fetchAllAdvertisements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(updateAdvertisement.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdvertisement.fulfilled, (state, action) => {
        state.loading = false;
        const updatedAd = action.payload?.data;
        const index = state.advertisements.findIndex(
          ad => ad.id === updatedAd.id,
        );
        if (index !== -1) {
          state.advertisements[index] = updatedAd;
        }
      })
      .addCase(updateAdvertisement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
       .addCase(deleteAdvertisementById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAdvertisementById.fulfilled, (state, action) => {
        state.loading = false;
        console.log('Advertisement deleted with id:', action.payload?.id);
        const deletedAdId = action.payload?.id;
        state.advertisements = state.advertisements.filter(ad => ad.id !== deletedAdId);
      })
      .addCase(deleteAdvertisementById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(fetchAllTickets.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.allTickets = action.payload?.data || [];
      })
      .addCase(fetchAllTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(updateTicket.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTicket.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTicket = action.payload?.data;
        const index = state.allTickets.findIndex(
          ticket => ticket.id === updatedTicket.id,
        );
        if (index !== -1) {
          state.allTickets[index] = updatedTicket;
        }
      })
      .addCase(updateTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      // Extra reducers for updating order
      .addCase(updateOrder.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOrder = action?.payload?.data || action?.payload;
        const index = state.orders.findIndex(
          order => order.id === updatedOrder.id,
        );
        
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
        console.log('Updated order in admin slice', updatedOrder);
       })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.message;
      });
  },
});

export const {
  setLoading,
  setUsers,
  setDrivers,
  setRequests,
  setAnalytics,
  setError,
  clearError,
  resetAdminState,
} = adminSlice.actions;
export default adminSlice.reducer;
