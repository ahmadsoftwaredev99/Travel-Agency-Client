import { Button, Space, Popover } from "antd";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  AppstoreOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { logoutUser } from "../../store/slice/authSlice";
import Logo from "../Logo";
import "./header.css";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuth, user } = useSelector((store) => store.authSlice);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/user-side");
  };

  const dashboardPath = user?.role === "admin" ? "/admin-dashboard" : "/customer-dashboard";

  const content = (
    <div className="d-flex flex-column gap-1 te-popover">
      <Link to={dashboardPath}>
        <Button className="te-popover-btn" icon={<AppstoreOutlined />}>
          {user?.role === "admin" ? "Admin Console" : "My Dashboard"}
        </Button>
      </Link>
      <Button
        className="te-popover-btn te-popover-btn--logout"
        icon={<LogoutOutlined />}
        onClick={handleLogout}
      >
        Log Out
      </Button>
    </div>
  );

  return (
    <div>
      <nav className="navbar navbar-expand-lg te-navbar">
        <div className="container">
          <Link className="navbar-brand te-brand" to="/user-side">
            <span className="te-brand-text">Travel<strong>Ease</strong></span>
          </Link>

          {/* Right side items */}
          <div className="d-flex align-items-center ms-auto order-lg-2">
            {isAuth && user ? (
              <Popover
                placement="bottom"
                content={content}
                trigger="click"
                overlayClassName="te-popover-overlay"
              >
                <Button className="rounded-pill te-user-btn" icon={<UserOutlined />}>
                  {user?.name || "Account"}
                </Button>
              </Popover>
            ) : (
              <Space>
                <Link to="/auth/login">
                  <Button className="te-btn te-btn--ghost">Login</Button>
                </Link>
                <Link to="/auth/register">
                  <Button className="te-btn te-btn--solid">Register</Button>
                </Link>
              </Space>
            )}
            <button
              className="navbar-toggler ms-2 te-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>

          <div
            className="collapse navbar-collapse order-lg-1"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav mx-auto te-links">
              <li className="nav-item">
                <Link className="nav-link te-link" to="/user-side">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link te-link" to="/user-side/about">
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link te-link" to="/user-side/destinations">
                  Destinations
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Boarding-pass perforation strip */}
      <div className="te-perforation" aria-hidden="true">
        <span className="te-notch te-notch--left" />
        <span className="te-notch te-notch--right" />
      </div>
    </div>
  );
};

export default Header;