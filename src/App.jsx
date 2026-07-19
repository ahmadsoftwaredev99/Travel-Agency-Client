import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPackages } from "./store/slice/packageSlice";
import Loader from "./components/Loader";
import Routing from "./routing";
import { getAllUser, getUser } from "./store/slice/userSlice";
import "./App.css";
import { getAllEnquiries, getMyEnquiry } from "./store/slice/contactSlice";

const App = () => {
  const { isAuth, loading, user } = useSelector((store) => store.authSlice);
  const isAdmin = user?.role === "admin";

  const dispatch = useDispatch();
  useEffect(() => {
    if (!isAuth) return;

    dispatch(getPackages());
    dispatch(getUser());
    dispatch(getMyEnquiry())

    if (isAdmin) {
      dispatch(getAllUser());
      dispatch(getAllEnquiries())
    }
  }, [dispatch, isAuth, isAdmin]);

  return loading ? <Loader /> : <Routing />;
};

export default App;
