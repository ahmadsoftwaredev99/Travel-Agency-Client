import { Button, Space } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  AppstoreOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Popover } from "antd";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../store/slice/authSlice";
import "./header.css";

const Header = () => {
  const dispatch = useDispatch();
  const { isAuth } = useSelector((store) => store.authSlice);
  const user = JSON.parse(localStorage.getItem("user"));
  
  const content = (
    <div className="d-flex flex-column gap-1 te-popover">
      <Link to="/customer-dashboard">
        <Button className="te-popover-btn" icon={<AppstoreOutlined />}>
          | Dashboard
        </Button>
      </Link>
      <Button
        className="te-popover-btn te-popover-btn--logout"
        icon={<LogoutOutlined />}
        onClick={() => dispatch(logoutUser())}
      >
        | Log-out
      </Button>
    </div>
  );

  

  return (
    <div>
      <nav className="navbar navbar-expand-lg te-navbar">
        <div className="container">
          <Link className="navbar-brand te-brand" to="/user-side">
            Navbar
          </Link>

          {/* Right side items */}
          <div className="d-flex align-items-center ms-auto order-lg-2">
            {isAuth ? (
              <Popover
                placement="bottom"
                content={content}
                trigger="click"
                overlayClassName="te-popover-overlay"
              >
                <Button className="rounded-pill te-user-btn" icon={<UserOutlined />}>
                  {user.name}
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
                  Destination
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* boarding-pass perforation strip */}
      <div className="te-perforation" aria-hidden="true">
        <span className="te-notch te-notch--left" />
        <span className="te-notch te-notch--right" />
      </div>
    </div>
  );
};

export default Header;