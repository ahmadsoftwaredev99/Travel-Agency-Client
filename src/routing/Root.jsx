import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Root = () => {
  const { user } = useSelector((store) => store.authSlice);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else if (user.role === "user") {
        navigate("/user-side");
      } else {
        navigate("/user-side");
      }
    } else {
      navigate("/user-side");
    }
  }, [user, navigate]);
  return null;
};
export default Root;
