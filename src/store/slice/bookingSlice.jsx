import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axiosInstance";

const getErrorMessage = (error) => {
  if (typeof error === "string") return error;
  return error?.response?.data?.message || error?.message || "Something went wrong";
};

export const createBooking = createAsyncThunk(
  "bookings/create",
  async (bookingData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/bookings", bookingData);
      return res.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const getMyBookings = createAsyncThunk(
  "bookings/getMy",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/bookings/my");
      return res.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const getAllBookings = createAsyncThunk(
  "bookings/getAll",
  async (status, { rejectWithValue }) => {
    try {
      const url = status && status !== "all" ? `/bookings?status=${status}` : "/bookings";
      const res = await axiosInstance.get(url);
      return res.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateBookingStatus = createAsyncThunk(
  "bookings/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/bookings/${id}/status`, { status });
      return res.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const cancelBooking = createAsyncThunk(
  "bookings/cancel",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/bookings/${id}/cancel`);
      return res.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteBooking = createAsyncThunk(
  "bookings/delete",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/bookings/${id}`);
      return res.data?.id || id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const bookingSlice = createSlice({
  name: "bookingSlice",
  initialState: {
    myBookings: [],
    allBookings: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearBookingStatus: (state) => {
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // createBooking
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.myBookings.unshift(action.payload);
        state.success = true;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // getMyBookings
      .addCase(getMyBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.myBookings = action.payload || [];
      })
      .addCase(getMyBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // getAllBookings
      .addCase(getAllBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.allBookings = action.payload || [];
      })
      .addCase(getAllBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // updateBookingStatus
      .addCase(updateBookingStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.allBookings = state.allBookings.map((b) =>
          b._id === action.payload._id ? action.payload : b
        );
        state.myBookings = state.myBookings.map((b) =>
          b._id === action.payload._id ? action.payload : b
        );
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // cancelBooking
      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.myBookings = state.myBookings.map((b) =>
          b._id === action.payload._id ? action.payload : b
        );
        state.allBookings = state.allBookings.map((b) =>
          b._id === action.payload._id ? action.payload : b
        );
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // deleteBooking
      .addCase(deleteBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload;
        state.allBookings = state.allBookings.filter((b) => b._id !== deletedId);
        state.myBookings = state.myBookings.filter((b) => b._id !== deletedId);
      })
      .addCase(deleteBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBookingStatus } = bookingSlice.actions;
export default bookingSlice.reducer;
