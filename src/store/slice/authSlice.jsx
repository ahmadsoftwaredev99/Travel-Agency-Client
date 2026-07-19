import { message } from "antd";
import axiosInstance from "../axiosInstance";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const registerUser = createAsyncThunk(
  "user/reg",
  async (userDetails, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/register", userDetails);

      localStorage.setItem("token", res?.data?.token);
      localStorage.setItem("user", JSON.stringify(res?.data));

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Registration failed");
    }
  },
);

export const loignUser = createAsyncThunk(
  "user/login",
  async (userDetails, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/login", userDetails);

      localStorage.setItem("token", res?.data?.token);
      localStorage.setItem("user", JSON.stringify(res?.data));

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Login failed");
    }
  },
);
export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      localStorage.clear();
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const authSlice = createSlice({
  name: "authSlice",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    isAuth: !!localStorage.getItem("token"),
    loading: false,
    error: null,
  },

  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuth = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuth = false;
        state.user = null;
      })
      .addCase(loignUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loignUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuth = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loignUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuth = false;
        state.user = null;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuth = false;
        state.user = null;
        state.error = null;
      });
  },
});

export default authSlice.reducer;
