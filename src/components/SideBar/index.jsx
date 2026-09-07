import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import { LogoutOutlined } from "@ant-design/icons";
import { adminPaths, customerPath } from "../constants";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../store/slice/authSlice";

import "./sidebar.css";

const SideBar = () => {
  const { user } = useSelector((store) => store.authSlice);
  const [menu, setMenu] = useState(user?.role === "admin" ? adminPaths : customerPath);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/user-side");
  };

  useEffect(() => {
    if (user?.role === "admin") {
      setMenu(adminPaths);
    } else {
      setMenu(customerPath);
    }
  }, [user]);

  const isAdmin = user?.role === "admin";

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar__header">
        {isAdmin ? (
          <div>
            <span className="admin-sidebar__eyebrow">Admin Access</span>
            <p className="admin-sidebar__title">Control Tower</p>
          </div>
        ) : (
          <div>
            <span className="admin-sidebar__eyebrow">Traveler Portal</span>
            <p className="admin-sidebar__title">My Journey</p>
          </div>
        )}
        <span className="text-white short-form">TE</span>
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
