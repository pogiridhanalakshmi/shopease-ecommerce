import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartAPI } from '../utils/api';

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await cartAPI.get();
    return data;
  } catch { return rejectWithValue('Failed to fetch cart'); }
});

export const addToCart = createAsyncThunk('cart/add', async ({ product_id, quantity }, { rejectWithValue }) => {
  try {
    const { data } = await cartAPI.add(product_id, quantity);
    return data;
  } catch { return rejectWithValue('Failed to add to cart'); }
});

export const updateCartItem = createAsyncThunk('cart/update', async ({ item_id, quantity }, { rejectWithValue }) => {
  try {
    const { data } = await cartAPI.updateItem(item_id, quantity);
    return data;
  } catch { return rejectWithValue('Failed to update cart'); }
});

export const removeCartItem = createAsyncThunk('cart/remove', async (item_id, { rejectWithValue }) => {
  try {
    const { data } = await cartAPI.removeItem(item_id);
    return data;
  } catch { return rejectWithValue('Failed to remove item'); }
});

export const clearCart = createAsyncThunk('cart/clear', async (_, { rejectWithValue }) => {
  try {
    const { data } = await cartAPI.clear();
    return data;
  } catch { return rejectWithValue('Failed to clear cart'); }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: { cart: null, loading: false, error: null },
  reducers: {
    resetCart: (state) => { state.cart = null; },
  },
  extraReducers: (builder) => {
    const setCart = (s, a) => { s.loading = false; s.cart = a.payload; };
    builder
      .addCase(fetchCart.pending, (s) => { s.loading = true; })
      .addCase(fetchCart.fulfilled, setCart)
      .addCase(fetchCart.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(addToCart.fulfilled, setCart)
      .addCase(updateCartItem.fulfilled, setCart)
      .addCase(removeCartItem.fulfilled, setCart)
      .addCase(clearCart.fulfilled, setCart);
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
