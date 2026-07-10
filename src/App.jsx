import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPackages } from "./store/slice/packageSlice";
import Loader from "./components/Loader";
import Routing from "./routing";
import "./App.css";

const App = () => {
  const { isAuth, loading } = useSelector((store) => store.authSlice);

  const dispatch = useDispatch();
  useEffect(() => {
    if (isAuth) {
      dispatch(getPackages());
    }
  }, []);

  return loading ? <Loader /> : <Routing />;
};

export default App;
