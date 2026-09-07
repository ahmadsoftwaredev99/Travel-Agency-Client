import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../axiosInstance";

const getErrorMessage = (error) => {
  if (typeof error === "string") return error;
  return (
    error?.response?.data?.message || error?.message || "Something went wrong"
  );
};

export const sendEnquiry = createAsyncThunk(
  "send/enq",
  async (enquiryData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/enquiries", enquiryData);
      return res.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const getAllEnquiries = createAsyncThunk(
  "get-all/enq",
  async (status, { rejectWithValue }) => {
    try {
      const url = status && status !== "all" ? `/enquiries?status=${status}` : "/enquiries";
      const res = await axiosInstance.get(url);
      return res.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const getMyEnquiry = createAsyncThunk(
  "get-my/enq",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/enquiries/my");
      return res.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteEnquiries = createAsyncThunk(
  "del/enq",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/enquiries/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateStatus = createAsyncThunk(
  "update/status",
  async ({ _id, status }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/enquiries/${_id}/status`, { status });
      return res.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const contactSlice = createSlice({
  name: "contactSlice",
  initialState: {
    enquiry: [],
    myEnquiry: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearContactError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // sendEnquiry
      .addCase(sendEnquiry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendEnquiry.fulfilled, (state, action) => {
        state.loading = false;
        state.enquiry.unshift(action.payload);
        state.myEnquiry.unshift(action.payload);
      })
      .addCase(sendEnquiry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getAllEnquiries
      .addCase(getAllEnquiries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllEnquiries.fulfilled, (state, action) => {
        state.loading = false;
        state.enquiry = action.payload || [];
      })
      .addCase(getAllEnquiries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getMyEnquiry
      .addCase(getMyEnquiry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyEnquiry.fulfilled, (state, action) => {
        state.loading = false;
        state.myEnquiry = action.payload || [];
      })
      .addCase(getMyEnquiry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // deleteEnquiries
      .addCase(deleteEnquiries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEnquiries.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload;
        state.enquiry = state.enquiry.filter((doc) => doc._id !== id);
        state.myEnquiry = state.myEnquiry.filter((doc) => doc._id !== id);
      })
      .addCase(deleteEnquiries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // updateStatus
      .addCase(updateStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.enquiry = state.enquiry.map((doc) =>
          doc._id === action.payload._id ? action.payload : doc
        );
        state.myEnquiry = state.myEnquiry.map((doc) =>
          doc._id === action.payload._id ? action.payload : doc
        );
      })
      .addCase(updateStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearContactError } = contactSlice.actions;
export default contactSlice.reducer;
