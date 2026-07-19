import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axiosInstance";

const getErrorMessage = (error) => {
  if (typeof error === "string") return error;
  return (
    error?.response?.data?.message || error?.message || "Something went wrong"
  );
};

export const getUser = createAsyncThunk(
  "get/user",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/users/profile");
      return res.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const getAllUser = createAsyncThunk(
  "users/get",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/users/");
      return res.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const suspendUser = createAsyncThunk(
  "users/suspend",
  async ({ _id, isSuspended }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/users/${_id}/suspend`, { isSuspended });
      return res.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const userSlice = createSlice({
  name: "userSlice",
  initialState: {
    user: [],
    USER: [],
    loading: false,
    error: null,
  },

  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUser.fulfilled, (state, action) => {
        state.loading = false;
        state.USER = action.payload;
        state.error = null;
      })
      .addCase(getAllUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(suspendUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(suspendUser.fulfilled, (state, action) => {
        state.loading = false;
        state.USER = action.payload;
        state.error = null;
      })
      .addCase(suspendUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
