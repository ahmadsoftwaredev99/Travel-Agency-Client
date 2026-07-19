import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import packageReducer from "./slice/packageSlice";
import userReducer from "./slice/userSlice";
import contactReducer from "./slice/contactSlice";
const store = configureStore({
  reducer: {
    authSlice: authReducer,
    packageSlice: packageReducer,
    userSlice: userReducer,
    contactSlice: contactReducer,
  },
});

export default store;
