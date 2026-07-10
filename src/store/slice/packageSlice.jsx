import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axiosInstance";

export const addPackage = createAsyncThunk(
  "add/pkg",
  async (pkgDetails, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/packages/", pkgDetails);
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const getPackages = createAsyncThunk(
  "get/pkg",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/packages/");
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const updatePackages = createAsyncThunk(
  "update/pkg",
  async ({ id, update_pkg }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/packages/${id}`, update_pkg);
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const deletePackages = createAsyncThunk(
  "delete/pkg",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/packages/${id}`);
      return id; // return deleted id
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  },
);

const packageSlice = createSlice({
  name: "packageSlice",
  initialState: {
    tourPackage: [],
    updatePkg: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    getPkg_id: (state, action) => {
      let pkg = state.tourPackage.filter((doc) => doc._id === action.payload);
      state.updatePkg = pkg[0] || null;
    },
    updates_null: (state) => {
      state.updatePkg = null;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(addPackage.fulfilled, (state, action) => {
      state.isLoading = false;
      state.tourPackage.push(action.payload);
    });
    builder.addCase(getPackages.fulfilled, (state, action) => {
      state.isLoading = false;
      state.tourPackage = action.payload.packages;
    });
    builder.addCase(updatePackages.fulfilled, (state, action) => {
      state.isLoading = false;
      state.tourPackage = state.tourPackage.map((pkg) =>
        pkg._id === action.payload.id ? action.payload : pkg,
      );
    });
    builder.addCase(deletePackages.fulfilled, (state, action) => {
      state.isLoading = false;
      const id = action.meta.arg;
      state.tourPackage = state.tourPackage.filter((pkg) => pkg._id !== id);
    });
  },
});
export const { getPkg_id, updates_null } = packageSlice.actions;
export default packageSlice.reducer;
