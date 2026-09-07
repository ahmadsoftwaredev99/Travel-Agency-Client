import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axiosInstance";
import { updateStoredUser } from "./authSlice";

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
  }
);

export const updateMyProfile = createAsyncThunk(
  "users/updateProfile",
  async (profileData, { dispatch, rejectWithValue }) => {
    try {
      const res = await axiosInstance.put("/users/profile", profileData);
      dispatch(updateStoredUser(res.data));
      return res.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const changePassword = createAsyncThunk(
  "users/changePassword",
  async ({ oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put("/auth/change-password", {
        oldPassword,
        newPassword,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const getAllUser = createAsyncThunk(
  "users/get",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/users");
      return res.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
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
  }
);

const userSlice = createSlice({
  name: "userSlice",
  initialState: {
    user: null,
    USER: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getUser
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

      // updateMyProfile
      .addCase(updateMyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload };
        state.error = null;
      })
      .addCase(updateMyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getAllUser
      .addCase(getAllUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUser.fulfilled, (state, action) => {
        state.loading = false;
        state.USER = action.payload || [];
        state.error = null;
      })
      .addCase(getAllUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // suspendUser
      .addCase(suspendUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(suspendUser.fulfilled, (state, action) => {
        state.loading = false;
        state.USER = state.USER.map((u) =>
          u._id === action.payload._id ? { ...u, ...action.payload } : u
        );
        state.error = null;
      })
      .addCase(suspendUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;
