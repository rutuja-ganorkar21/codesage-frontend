

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from './utils/axiosClient';

export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post('/user/register', userData);
            return response.data.user;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post('/user/login', credentials);
            return response.data.user;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const checkAuth = createAsyncThunk(
    'auth/check',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get('/user/check');
            return response.data.user;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await axiosClient.post('/user/logout');
            return null;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        isAuthenticated: false,
        isCheckingAuth: true,
        loading: false,
        error: null,
    },

    // ── Synchronous actions ──────────────────
    reducers: {
        // Profile picture update hone par Redux state turant update ho
        updateProfilePicture: (state, action) => {
            if (state.user) {
                state.user.profilePicture = action.payload;
            }
        },
    },

    // ── Async actions ────────────────────────
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = !!action.payload;
                state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Something went wrong';
                state.isAuthenticated = false;
                state.user = null;
            })

            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = !!action.payload;
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Something went wrong';
                state.isAuthenticated = false;
                state.user = null;
            })

            // Check Auth
            .addCase(checkAuth.pending, (state) => {
                state.isCheckingAuth = true;
                state.error = null;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.isCheckingAuth = false;
                state.isAuthenticated = !!action.payload;
                state.user = action.payload;
            })
            .addCase(checkAuth.rejected, (state) => {
                state.isCheckingAuth = false;
                state.isAuthenticated = false;
                state.user = null;
                state.error = null;
            })

            // Logout
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Something went wrong';
                state.isAuthenticated = false;
                state.user = null;
            })
    }
});


export const { updateProfilePicture } = authSlice.actions;
export default authSlice.reducer;