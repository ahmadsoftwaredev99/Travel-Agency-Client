import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axiosInstance";

const getErrorMessage = (error) => {
  if (typeof error === "string") return error;
  return (
    error?.response?.data?.message || error?.message || "Authentication failed"
  );
};

export const registerUser = createAsyncThunk(
  "user/reg",
  async (userDetails, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/register", userDetails);

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
      }
      localStorage.setItem("user", JSON.stringify(res.data));

      return res.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (userDetails, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/login", userDetails);

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
      }
      localStorage.setItem("user", JSON.stringify(res.data));

      return res.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Keep backwards-compatible alias for any existing imports
export const loignUser = loginUser;

export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      localStorage.clear();
      return null;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const getInitialUser = () => {
  try {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const authSlice = createSlice({
  name: "authSlice",
  initialState: {
    user: getInitialUser(),
    isAuth: !!localStorage.getItem("token"),
    loading: false,
    error: null,
  },
  reducers: {
    updateStoredUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // register
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
      // login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuth = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuth = false;
        state.user = null;
      })
      // logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuth = false;
        state.user = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loading = false;
        state.isAuth = false;
        state.user = null;
      });
  },
});

export const { updateStoredUser, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
