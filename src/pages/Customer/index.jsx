import React from "react";
import { Route, Routes } from "react-router-dom";
import Packages from "./Packages";
import MyEnquiries from "./MyEnquiries";
import Profile from "./Profile";
import PageNotFound from "../../components/PageNotFound";
import MyBooking from "./MyBooking";
import Contact from "./Contact";
import Header from "../../components/Header";
import SideBar from "../../components/SideBar";

const Customer = () => {
  return (
    <>
      <div className="d-flex">
        <SideBar />
        <div className="flex-grow-1 content">
          <Routes>
            <Route path="/" element={<Packages />} />
            <Route path="my-booking" element={<MyBooking />} />
            <Route path="my-enquiries" element={<MyEnquiries />} />
            <Route path="contact" element={<Contact />} />
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default Customer;
