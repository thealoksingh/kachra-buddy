import { createSlice } from '@reduxjs/toolkit';
import { fetchDriverOrders, getAllOrders, updateDriverOrder, outForPickup, outForDelivery, fetchAllItems, addItemsToOrder } from '../thunks/driverThunk';

const initialState = {
  orders: [], // Added for storing all orders from getAllOrders API
  items: [], // Added for storing all items
  loading: false,
  error: null,
};

const driverSlice = createSlice({
  name: 'driver',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAllOrders: (state, action) => {
      state.allOrders = action.payload;
    },
    // Reducer for setting all orders
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    setItems: (state, action) => {
      state.items = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },

  },
  extraReducers: (builder) => {
    builder
      // Extra reducers for fetching driver orders
      .addCase(fetchDriverOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDriverOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.allOrders = action?.payload?.data || action?.payload;
      })
      .addCase(fetchDriverOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.message;
      })
      // Extra reducers for getting all orders
      .addCase(getAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        const ordersData = action?.payload?.data || action?.payload;
        console.log("getAllOrders fulfilled - Raw payload:", action?.payload);
        console.log("getAllOrders fulfilled - Orders data:", ordersData);
        console.log("getAllOrders fulfilled - Is array:", Array.isArray(ordersData));
        state.orders = Array.isArray(ordersData) ? ordersData : [];
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.message;
      })
      // Extra reducers for updating driver order
      .addCase(updateDriverOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDriverOrder.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOrder = action?.payload?.data || action?.payload;
        const index = state.orders.findIndex(order => order.id === updatedOrder.id);
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
      })
      .addCase(updateDriverOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.message;
      })
      // Extra reducers for out for pickup
      .addCase(outForPickup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(outForPickup.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOrder = action?.payload?.data || action?.payload;
        const index = state.orders.findIndex(order => order.id === updatedOrder.id);
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
      })
      .addCase(outForPickup.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.message;
      })
      // Extra reducers for out for delivery
      .addCase(outForDelivery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(outForDelivery.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOrder = action?.payload?.data || action?.payload;
        const index = state.orders.findIndex(order => order.id === updatedOrder.id);
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
      })
      .addCase(outForDelivery.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.message;
      })
      // Extra reducers for fetch all items
      .addCase(fetchAllItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action?.payload?.data || action?.payload;
      })
      .addCase(fetchAllItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.message;
      })
      // Extra reducers for add items to order
      .addCase(addItemsToOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItemsToOrder.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOrder = action?.payload?.data || action?.payload;
        const index = state.orders.findIndex(order => order.id === updatedOrder.id);
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
      })
      .addCase(addItemsToOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.message;
      });
  },
});

export const { setLoading, setAllOrders, setOrders, setItems, setError, clearError } = driverSlice.actions;
export default driverSlice.reducer;