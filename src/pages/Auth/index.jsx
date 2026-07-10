import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./Lgoin";
import Register from "./Regsiter";

const Auth = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default Auth;
