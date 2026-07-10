import React from "react";
import { Route, Routes } from "react-router-dom";
import Booking from "./Booking";
import Enquiries from "./Enquiries";
import Users from "./Users";
import Packages from "./Packages";
import Overview from "./Overview";
import PageNotFound from "../../components/PageNotFound";
import SideBar from "../../components/SideBar";

const Admin = () => {
  return (
    <div className="d-flex">
      <SideBar />
      <div className="flex-grow-1 content">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="booking" element={<Booking />} />
          <Route path="packages" element={<Packages />} />
          <Route path="user" element={<Users />} />
          <Route path="enquiries" element={<Enquiries />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </div>
  );
};

export default Admin;
