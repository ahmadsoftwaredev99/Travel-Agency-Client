import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import packageReducer from "./slice/packageSlice";
const store = configureStore({
  reducer: {
    authSlice: authReducer,
    packageSlice: packageReducer,
  },
});

export default store;
