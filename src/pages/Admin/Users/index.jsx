import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Modal, Avatar, Descriptions, Tag, Typography, message } from "antd";

import { CloseOutlined, UserOutlined } from "@ant-design/icons";

import "./users.css";
import "./userviewmodal.css";
import { getAllUser, suspendUser } from "../../../store/slice/userSlice";

const { Title, Text } = Typography;

const Users = () => {
  const [openModal, setOpenModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const { USER } = useSelector((store) => store.userSlice);
  const dispatch = useDispatch();

  const handleViewUser = (user) => {
    setCurrentUser(user);
    setOpenModal(true);
  };

  const handleSuspendUser = async (user) => {
    const confirm = window.confirm(`Are you sure you want to `);

    if (!confirm) return;

    try {
      await dispatch(
        suspendUser({ _id: user._id, isSuspended: !user.isSuspended }),
      ).unwrap();
      await dispatch(getAllUser()).unwrap();
      message.success("User Suspended Successfully");
    } catch (err) {
      message.error("Failed to Suspend this user!");
    }
  };

  return (
    <>
      <div className="users-page">
        <div className="users-card">
          <div className="users-card__header">
            <h1 className="users-card__title">Manage users</h1>
            <span className="users-card__count"></span>
          </div>

          <div className="users-table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Joined</th>
                  {/* <th>Bookings</th> */}
                  <th aria-hidden="true " className="text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {USER.length > 0 ? (
                  USER.map((user) => (
                    <tr key={user._id}>
                      <td className="users-table__name">{user.name}</td>
                      <td className="users-table__email">{user.email}</td>
                      <td className="users-table__joined">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      {/* <td className="users-table__bookings">{user.bookings}</td> */}
                      <td className="users-table__actions text-center">
                        <button
                          type="button"
                          className="users-table__action"
                          onClick={() => handleViewUser(user)}
                        >
                          View
                        </button>
                        <button
                          type="button"
                          className="users-table__action"
                          onClick={() => handleSuspendUser(user)}
                        >
                          Suspend
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      style={{ textAlign: "center", padding: "30px" }}
                    >
                      <Title level={3} style={{ margin: 0 }}>
                        No User...
                      </Title>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Modal
        className="user-modal"
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={null}
        width={640}
        centered
        closeIcon={<CloseOutlined />}
        title={null}
      >
        <div className="user-modal__header">
          <Avatar
            className="user-modal__avatar"
            size={64}
            icon={<UserOutlined />}
            style={{
              backgroundColor:
                currentUser?.role === "user" ? "#cf1322" : "#0958d9",
            }}
          >
            {currentUser?.name?.[0]?.toUpperCase()}
          </Avatar>

          <div className="user-modal__identity">
            <div className="user-modal__name-row">
              <Title level={4} className="user-modal__title">
                {currentUser?.name || "Unnamed user"}
              </Title>
              <span
                className={`user-modal__status-dot ${
                  currentUser?.isSuspended ?? "is-active"
                }`}
              />
            </div>
            <Text className="user-modal__subtitle">{currentUser?.email}</Text>
          </div>

          <Tag
            className="user-modal__role-tag"
            color={currentUser?.role === "admin" ? "red" : "blue"}
          >
            {currentUser?.role?.toUpperCase() || "N/A"}
          </Tag>
        </div>

        <div className="user-modal__grid">
          <div className="user-modal__field">
            <span className="user-modal__label">Full Name</span>
            <span className="user-modal__value">
              {currentUser?.name || "N/A"}
            </span>
          </div>

          <div className="user-modal__field">
            <span className="user-modal__label">Phone Number</span>
            <span className="user-modal__value">
              {currentUser?.phone || "N/A"}
            </span>
          </div>

          <div className="user-modal__field">
            <span className="user-modal__label">Email</span>
            <span className="user-modal__value">
              {currentUser?.email || "N/A"}
            </span>
          </div>

          <div className="user-modal__field">
            <span className="user-modal__label">Status</span>
            <span
              className={`user-modal__value user-modal__status-text ${
                currentUser?.isSuspended ? "is-suspended" : "is-active"
              }`}
            >
              {currentUser?.isSuspended ? "Suspended" : "Active"}
            </span>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default Users;
