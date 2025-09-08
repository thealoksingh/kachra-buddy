import { createSlice } from '@reduxjs/toolkit';
import { fetchItems, fetchCart, addItemToCart, removeItemFromCart, checkoutCart } from '../thunks/userThunk';

const initialState = {
  items: [],
  cart: null, // Fixed: Cart is object, not array
  orders: [], // Changed to array for storing multiple checkout orders
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    setRequests: (state, action) => {
      state.requests = action.payload;
    },
    setBookings: (state, action) => {
      state.bookings = action.payload;
    },
    setItems: (state, action) => {
      state.items = action.payload;
    },
    // Reducer for setting cart data
    setCart: (state, action) => {
      state.cart = action.payload;
    },
    // Reducer for setting current order
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
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
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action?.payload?.data || action?.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.message;
      })
      // Extra reducers for cart operations
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action?.payload?.data || action?.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.message;
      })
      // Extra reducers for adding item to cart
      .addCase(addItemToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action?.payload?.data || action?.payload;
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.message;
      })
      // Extra reducers for removing item from cart
      .addCase(removeItemFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action?.payload?.data || action?.payload;
      })
      .addCase(removeItemFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.message;
      })
      // Extra reducers for checkout cart
      .addCase(checkoutCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkoutCart.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action?.payload?.data || action?.payload); // Store each order in orders array
        state.cart = null; // Clear cart after successful checkout
      })
      .addCase(checkoutCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.message;
      });
  },
});

export const { setLoading, setItems, setCart, setCurrentOrder, setError, clearError } = userSlice.actions;
export default userSlice.reducer;