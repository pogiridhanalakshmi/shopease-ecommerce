import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../utils/api';

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await authAPI.login(credentials);
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    return data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await authAPI.register(userData);
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    return data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data || 'Registration failed');
  }
});

export const fetchProfile = createAsyncThunk('auth/profile', async (_, { rejectWithValue }) => {
  try {
    const { data } = await authAPI.profile();
    return data;
  } catch {
    return rejectWithValue('Not authenticated');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, loading: false, error: null, initialized: false },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(loginUser.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; })
      .addCase(loginUser.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(registerUser.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(registerUser.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; })
      .addCase(registerUser.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchProfile.fulfilled, (s, a) => { s.user = a.payload; s.initialized = true; })
      .addCase(fetchProfile.rejected, (s) => { s.initialized = true; });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
