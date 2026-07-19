import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../axiosInstance";

export const sendEnquiry = createAsyncThunk(
  "send/enq",
  async (enquiries, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/enquiries/", enquiries);
      console.log("res", res);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const getAllEnquiries = createAsyncThunk(
  "get-all/enq",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/enquiries/");

      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);


export const getMyEnquiry = createAsyncThunk(
  "get-my/enq",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/enquiries/my");
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);


export const deleteEnquiries = createAsyncThunk(
  "del/enq",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/enquiries/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateStatus = createAsyncThunk(
  "update/status",
  async ({ _id, status }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(
        `/enquiries/${_id}/status`,
        { status }
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);



const contactSlice = createSlice({
  name: "contactSlice",
  initialState: {
    enquiry: [],
    myEnquiry:[],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder.addCase(sendEnquiry.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(sendEnquiry.fulfilled, (state, action) => {
      state.loading = false;
      state.enquiry.push(action.payload);
    });
    builder.addCase(sendEnquiry.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(getAllEnquiries.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllEnquiries.fulfilled, (state, action) => {
      state.loading = false;
      state.enquiry = action.payload;
    });
    builder.addCase(getAllEnquiries.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(getMyEnquiry.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getMyEnquiry.fulfilled, (state, action) => {
      state.loading = false;
      state.myEnquiry = action.payload;
    });
    builder.addCase(getMyEnquiry.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(deleteEnquiries.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteEnquiries.fulfilled, (state, action) => {
      state.loading = false;
      const id = action.meta.arg;
      state.enquiry = state.enquiry.filter((doc) => doc._id !== id);
    });
    builder.addCase(deleteEnquiries.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(updateStatus.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateStatus.fulfilled, (state, action) => {
      state.loading = false;
      state.enquiry.map((doc) =>
        doc.id === action.payload.id ? action.payload : doc,
      );
    });
    builder.addCase(updateStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default contactSlice.reducer;
