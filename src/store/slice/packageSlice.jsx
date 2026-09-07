import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axiosInstance";

const getErrorMessage = (error) => {
  if (typeof error === "string") return error;
  return error?.response?.data?.message || error?.message || "Something went wrong";
};

export const addPackage = createAsyncThunk(
  "add/pkg",
  async (pkgDetails, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/packages", pkgDetails);
      return res.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const getPackages = createAsyncThunk(
  "get/pkg",
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.search) queryParams.append("search", params.search);
      if (params.location) queryParams.append("location", params.location);
      if (params.category) queryParams.append("category", params.category);
      if (params.minPrice) queryParams.append("minPrice", params.minPrice);
      if (params.maxPrice) queryParams.append("maxPrice", params.maxPrice);
      if (params.page) queryParams.append("page", params.page);
      if (params.limit) queryParams.append("limit", params.limit || 50);

      const qs = queryParams.toString();
      const url = qs ? `/packages?${qs}` : "/packages?limit=50";
      const res = await axiosInstance.get(url);
      return res.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updatePackages = createAsyncThunk(
  "update/pkg",
  async ({ id, update_pkg }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/packages/${id}`, update_pkg);
      return res.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deletePackages = createAsyncThunk(
  "delete/pkg",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/packages/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const packageSlice = createSlice({
  name: "packageSlice",
  initialState: {
    tourPackage: [],
    updatePkg: null,
    total: 0,
    page: 1,
    totalPages: 1,
    isLoading: false,
    error: null,
  },
  reducers: {
    getPkg_id: (state, action) => {
      const pkg = state.tourPackage.find((doc) => doc._id === action.payload);
      state.updatePkg = pkg || null;
    },
    updates_null: (state) => {
      state.updatePkg = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // addPackage
      .addCase(addPackage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addPackage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tourPackage.unshift(action.payload);
      })
      .addCase(addPackage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // getPackages
      .addCase(getPackages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPackages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tourPackage = action.payload?.packages || [];
        state.total = action.payload?.total || (action.payload?.packages?.length || 0);
        state.page = action.payload?.page || 1;
        state.totalPages = action.payload?.totalPages || 1;
      })
      .addCase(getPackages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // updatePackages
      .addCase(updatePackages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePackages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tourPackage = state.tourPackage.map((pkg) =>
          pkg._id === action.payload._id ? action.payload : pkg
        );
      })
      .addCase(updatePackages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // deletePackages
      .addCase(deletePackages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletePackages.fulfilled, (state, action) => {
        state.isLoading = false;
        const id = action.payload;
        state.tourPackage = state.tourPackage.filter((pkg) => pkg._id !== id);
      })
      .addCase(deletePackages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { getPkg_id, updates_null } = packageSlice.actions;
export default packageSlice.reducer;
