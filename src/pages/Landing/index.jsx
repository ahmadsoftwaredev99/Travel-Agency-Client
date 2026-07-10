import React from "react";
import { Route, Routes } from "react-router-dom";
import Header from "../../components/Header";
import Destinations from "../../components/Destinations";
import About from "../../components/About";
import PageNotFound from "../../components/PageNotFound";
import Home from "../../components/Home";

const LandingPage = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

export default LandingPage;
