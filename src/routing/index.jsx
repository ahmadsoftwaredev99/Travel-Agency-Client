import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import LandingPage from "../pages/Landing";
import Auth from "../pages/Auth";
import Admin from "../pages/Admin";
import Customer from "../pages/Customer";
import PrivateRouting from "./PrivateRouting";
import Root from "./Root";

const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<Root />} />
      <Route path="user-side/*" element={<LandingPage />} />
      <Route path="auth/*" element={<Auth />} />
      <Route
        path="admin-dashboard/*"
        element={
          <PrivateRouting requiredRole={["admin"]}>
            <Admin />
          </PrivateRouting>
        }
      />
      <Route
        path="customer-dashboard/*"
        element={
          <PrivateRouting requiredRole={["user"]}>
            <Customer />
          </PrivateRouting>
        }
      />
    </Routes>
  );
};

export default Routing;
