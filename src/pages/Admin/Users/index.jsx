import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Avatar, Tag, Typography, message, Popconfirm } from "antd";
import { CloseOutlined, UserOutlined, EyeOutlined, StopOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { getAllUser, suspendUser } from "../../../store/slice/userSlice";
import "./users.css";
import "./userviewmodal.css";

const { Title, Text } = Typography;

const Users = () => {
  const [openModal, setOpenModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const { USER, loading } = useSelector((store) => store.userSlice);
  const dispatch = useDispatch();

  const handleViewUser = (user) => {
    setCurrentUser(user);
    setOpenModal(true);
  };

  const handleSuspendUser = async (user) => {
    const actionName = user.isSuspended ? "unsuspend" : "suspend";
    try {
      await dispatch(
        suspendUser({ _id: user._id, isSuspended: !user.isSuspended })
      ).unwrap();
      message.success(`User successfully ${actionName}ed.`);
    } catch (err) {
      const errMsg = typeof err === "string" ? err : err?.message || `Failed to ${actionName} user!`;
      message.error(errMsg);
    }
  };

  return (
    <>
      <div className="users-page">
        <div className="users-card">
          <div className="users-card__header">
            <div>
              <span className="users-card__eyebrow">PASSENGER DIRECTORY</span>
              <h1 className="users-card__title">Manage Users</h1>
            </div>
            <span className="users-card__count">
              Total: {USER?.length || 0} Registered User{USER?.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="users-table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Joined</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading && (!USER || USER.length === 0) ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "40px" }}>
                      <Text type="secondary">Loading user directory...</Text>
                    </td>
                  </tr>
                ) : USER && USER.length > 0 ? (
                  USER.map((user) => (
                    <tr key={user._id} className={user.isSuspended ? "row-suspended" : ""}>
                      <td className="users-table__name">
                        <strong>{user.name}</strong>
                      </td>
                      <td className="users-table__email">{user.email}</td>
                      <td className="users-table__phone">{user.phone || "—"}</td>
                      <td className="users-table__joined">
                        {new Date(user.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="text-center">
                        <span
                          className={`users-status-badge ${
                            user.isSuspended ? "is-suspended" : "is-active"
                          }`}
                        >
                          {user.isSuspended ? "Suspended" : "Active"}
                        </span>
                      </td>
                      <td className="users-table__actions text-center">
                        <button
                          type="button"
                          className="users-table__action"
                          onClick={() => handleViewUser(user)}
                        >
                          <EyeOutlined /> View
                        </button>

                        <Popconfirm
                          title={user.isSuspended ? "Unsuspend user account?" : "Suspend user account?"}
                          description={
                            user.isSuspended
                              ? "User will regain access to their account and bookings."
                              : "User will be prevented from logging in."
                          }
                          onConfirm={() => handleSuspendUser(user)}
                          okText={user.isSuspended ? "Yes, Unsuspend" : "Yes, Suspend"}
                          cancelText="Cancel"
                        >
                          <button
                            type="button"
                            className={`users-table__action ${
                              user.isSuspended ? "action-unsuspend" : "action-suspend"
                            }`}
                          >
                            {user.isSuspended ? (
                              <>
                                <CheckCircleOutlined /> Unsuspend
                              </>
                            ) : (
                              <>
                                <StopOutlined /> Suspend
                              </>
                            )}
                          </button>
                        </Popconfirm>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "40px" }}>
                      <Title level={4} style={{ margin: 0, color: "#5b6980" }}>
                        No Users Found
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
        width={600}
        centered
        closeIcon={<CloseOutlined />}
        title={null}
      >
        <div className="user-modal__header">
          <Avatar
            className="user-modal__avatar"
            size={60}
            icon={<UserOutlined />}
            style={{
              backgroundColor: currentUser?.role === "admin" ? "#16233b" : "#e0693f",
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
                  currentUser?.isSuspended ? "is-suspended" : "is-active"
                }`}
              />
            </div>
            <Text className="user-modal__subtitle">{currentUser?.email}</Text>
          </div>

          <Tag
            className="user-modal__role-tag"
            color={currentUser?.role === "admin" ? "gold" : "cyan"}
          >
            {currentUser?.role?.toUpperCase() || "USER"}
          </Tag>
        </div>

        <div className="user-modal__grid">
          <div className="user-modal__field">
            <span className="user-modal__label">Full Name</span>
            <span className="user-modal__value">{currentUser?.name || "N/A"}</span>
          </div>

          <div className="user-modal__field">
            <span className="user-modal__label">Phone Number</span>
            <span className="user-modal__value">{currentUser?.phone || "N/A"}</span>
          </div>

          <div className="user-modal__field">
            <span className="user-modal__label">Email Address</span>
            <span className="user-modal__value">{currentUser?.email || "N/A"}</span>
          </div>

          <div className="user-modal__field">
            <span className="user-modal__label">Account Status</span>
            <span
              className={`user-modal__value user-modal__status-text ${
                currentUser?.isSuspended ? "is-suspended" : "is-active"
              }`}
            >
              {currentUser?.isSuspended ? "Suspended" : "Active"}
            </span>
          </div>

          <div className="user-modal__field">
            <span className="user-modal__label">Member Since</span>
            <span className="user-modal__value">
              {currentUser?.createdAt
                ? new Date(currentUser.createdAt).toLocaleString()
                : "N/A"}
            </span>
          </div>

          <div className="user-modal__field">
            <span className="user-modal__label">User ID</span>
            <span className="user-modal__value" style={{ fontFamily: "IBM Plex Mono", fontSize: "12px" }}>
              {currentUser?._id || "N/A"}
            </span>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Users;
