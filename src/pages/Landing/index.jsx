import React from "react";
import { Route, Routes } from "react-router-dom";
import Header from "../../components/Header";
import Destinations from "../../components/Destination";
import About from "../../components/About/index";
import PageNotFound from "../../components/PageNotFound";
import Home from "../../components/Home/Home";
import Footer from "../../components/Footer";

const LandingPage = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="destinations" element={<Destinations />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </>
  );
};

export default LandingPage;
