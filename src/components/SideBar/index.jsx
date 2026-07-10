import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { NavLink } from "react-router-dom";
import { LogoutOutlined } from "@ant-design/icons";
import { adminPaths, customerPath } from "../constants";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../store/slice/authSlice";

import "./sidebar.css";

const SideBar = () => {
  const [menu, setMenu] = useState(customerPath);
  const { user } = useSelector((store) => store.authSlice);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };


  useEffect(() => {
    if (user && user.role === "admin") {
      setMenu(adminPaths);
    }
  }, []);

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar__header">
        {user.role === "admin" ? (
          <div>
            <span className="admin-sidebar__eyebrow">Admin Access</span>
            <p className="admin-sidebar__title">Control Tower</p>
          </div>
        ) : (
          <>
            <span className="admin-sidebar__eyebrow">Customer Access</span>
          </>
        )}
        <span className="text-white short-form">TAS</span>
      </div>

      <div className="admin-sidebar__divider" />

      <nav className="admin-sidebar__nav">
        {menu.map((itm) => (
          <NavLink
            key={itm.id}
            to={itm.path}
            end={itm.end}
            className={({ isActive }) =>
              `admin-sidebar__link${isActive ? " admin-sidebar__link--active" : ""}`
            }
          >
            <span className="admin-sidebar__icon">{itm.icon}</span>
            <span className="admin-sidebar__label">{itm.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="admin-sidebar__footer">
        <div className="admin-sidebar__divider" />
        <Button
          className="admin-sidebar__logout"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
        >
          <span className="admin-sidebar__label">Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default SideBar;
