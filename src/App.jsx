import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPackages } from "./store/slice/packageSlice";
import Loader from "./components/Loader";
import Routing from "./routing";
import { getAllUser, getUser } from "./store/slice/userSlice";
import { getAllEnquiries, getMyEnquiry } from "./store/slice/contactSlice";
import { getAllBookings, getMyBookings } from "./store/slice/bookingSlice";
import "./App.css";

const App = () => {
  const { isAuth, loading, user } = useSelector((store) => store.authSlice);
  const isAdmin = user?.role === "admin";
  const dispatch = useDispatch();

  useEffect(() => {
    // Always fetch packages for landing page & customer side
    dispatch(getPackages());

    if (!isAuth) return;

    dispatch(getUser());
    dispatch(getMyEnquiry());
    dispatch(getMyBookings());

    if (isAdmin) {
      dispatch(getAllUser());
      dispatch(getAllEnquiries());
      dispatch(getAllBookings());
    }
  }, [dispatch, isAuth, isAdmin]);

  return loading ? <Loader /> : <Routing />;
};

export default App;
