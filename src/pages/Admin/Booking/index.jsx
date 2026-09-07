import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
} from "../../../store/slice/bookingSlice";
import { Modal, Typography, Popconfirm, message, Select, Descriptions, Tag, Divider, Space, Avatar } from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import "./booking.css";

const { Title, Text } = Typography;

const Booking = () => {
  const [filter, setFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const { allBookings, loading } = useSelector((store) => store.bookingSlice);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllBookings());
  }, [dispatch]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await dispatch(updateBookingStatus({ id, status: newStatus })).unwrap();
      message.success(`Booking status updated to ${newStatus}.`);
      setIsStatusModalOpen(false);
    } catch (err) {
      const errMsg = typeof err === "string" ? err : err?.message || "Failed to update booking status";
      message.error(errMsg);
    }
  };

  const handleDeleteBooking = async (id) => {
    try {
      await dispatch(deleteBooking(id)).unwrap();
      message.success("Booking record deleted successfully.");
    } catch (err) {
      const errMsg = typeof err === "string" ? err : err?.message || "Failed to delete booking";
      message.error(errMsg);
    }
  };

  const openViewModal = (booking) => {
    setSelectedBooking(booking);
    setIsViewModalOpen(true);
  };

  const openStatusModal = (booking) => {
    setSelectedBooking(booking);
    setIsStatusModalOpen(true);
  };

  const filteredBookings = (allBookings || []).filter((b) => {
    if (filter === "all") return true;
    return b.status === filter;
  });

  // Calculate metrics
  const totalCount = allBookings?.length || 0;
  const pendingCount = (allBookings || []).filter((b) => b.status === "pending").length;
  const confirmedCount = (allBookings || []).filter((b) => b.status === "confirmed").length;
  const cancelledCount = (allBookings || []).filter((b) => b.status === "cancelled").length;

  return (
    <div className="admin-booking-page">
      <div className="admin-booking-card">
        {/* Header */}
        <div className="admin-booking-header">
          <div>
            <span className="admin-booking-eyebrow">RESERVATIONS DESK</span>
            <h1 className="admin-booking-title">Manage Bookings</h1>
          </div>

          <div className="admin-booking-stats">
            <div className="stat-pill">
              <span className="label">Total</span>
              <span className="val">{totalCount}</span>
            </div>
            <div className="stat-pill pill-pending">
              <span className="label">Pending</span>
              <span className="val">{pendingCount}</span>
            </div>
            <div className="stat-pill pill-confirmed">
              <span className="label">Confirmed</span>
              <span className="val">{confirmedCount}</span>
            </div>
            <div className="stat-pill pill-cancelled">
              <span className="label">Cancelled</span>
              <span className="val">{cancelledCount}</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="admin-booking-tabs">
          {["all", "pending", "confirmed", "cancelled"].map((tab) => (
            <button
              key={tab}
              type="button"
              className={`admin-booking-tab ${filter === tab ? "is-active" : ""}`}
              onClick={() => setFilter(tab)}
            >
              {tab.toUpperCase()}
              <span className="tab-badge">
                {tab === "all"
                  ? totalCount
                  : (allBookings || []).filter((b) => b.status === tab).length}
              </span>
            </button>
          ))}
        </div>

        {/* Bookings Table */}
        <div className="admin-booking-table-wrapper">
          <table className="admin-booking-table">
            <thead>
              <tr>
                <th>Passenger</th>
                <th>Package & Route</th>
                <th>Departure Date</th>
                <th className="text-center">Guests</th>
                <th className="text-right">Total Price</th>
                <th className="text-center">Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (!allBookings || allBookings.length === 0) ? (
                <tr>
                  <td colSpan={7} className="admin-booking-empty">
                    <Text type="secondary">Loading bookings...</Text>
                  </td>
                </tr>
              ) : filteredBookings.length > 0 ? (
                filteredBookings.map((b) => {
                  const user = b.userId || {};
                  const pkg = b.packageId || {};
                  const totalPrice = (pkg.price || 0) * (b.numOfPeople || 1);

                  return (
                    <tr key={b._id} className="booking-row">
                      <td className="col-passenger">
                        <strong>{user.name || "Customer"}</strong>
                        <small>{user.email || "—"}</small>
                      </td>

                      <td className="col-package">
                        <span className="pkg-title">{pkg.title || "Custom Package"}</span>
                        <span className="pkg-route">{pkg.route || pkg.location || "Direct"}</span>
                      </td>

                      <td className="col-date">
                        {b.travelDate ? new Date(b.travelDate).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }) : "N/A"}
                      </td>

                      <td className="col-guests text-center">
                        <span className="guest-badge">{b.numOfPeople || 1}</span>
                      </td>

                      <td className="col-price text-right">
                        ${totalPrice}
                      </td>

                      <td className="col-status text-center">
                        <span className={`booking-status-badge status-${b.status}`}>
                          {b.status}
                        </span>
                      </td>

                      <td className="col-actions text-center">
                        <Space size={6}>
                          <button
                            type="button"
                            className="booking-action-btn action-view"
                            onClick={() => openViewModal(b)}
                          >
                            <EyeOutlined /> View
                          </button>

                          <button
                            type="button"
                            className="booking-action-btn action-status"
                            onClick={() => openStatusModal(b)}
                          >
                            Status
                          </button>

                          <Popconfirm
                            title="Delete booking record?"
                            description="Are you sure you want to delete this booking?"
                            onConfirm={() => handleDeleteBooking(b._id)}
                            okText="Delete"
                            cancelText="Cancel"
                          >
                            <button
                              type="button"
                              className="booking-action-btn action-delete"
                            >
                              <DeleteOutlined />
                            </button>
                          </Popconfirm>
                        </Space>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="admin-booking-empty">
                    <Title level={4} style={{ margin: 0, color: "#5b6980" }}>
                      No {filter !== "all" ? filter : ""} bookings found
                    </Title>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Booking Details Modal */}
      <Modal
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={null}
        width={680}
        centered
        className="booking-view-modal"
        title={
          <div className="booking-view-modal-header">
            <Avatar size={48} icon={<UserOutlined />} style={{ background: "#16233b" }} />
            <div>
              <Title level={4} style={{ margin: 0, fontFamily: "Fraunces" }}>
                {selectedBooking?.userId?.name || "Passenger Booking"}
              </Title>
              <Text type="secondary" style={{ fontFamily: "IBM Plex Mono", fontSize: 12 }}>
                Reservation ID: {selectedBooking?._id}
              </Text>
            </div>
          </div>
        }
      >
        {selectedBooking && (
          <div className="booking-modal-body">
            <Descriptions column={2} bordered size="middle" style={{ marginTop: 16 }}>
              <Descriptions.Item label="Customer Email" span={2}>
                {selectedBooking.userId?.email || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Customer Phone" span={2}>
                {selectedBooking.userId?.phone || "N/A"}
              </Descriptions.Item>

              <Descriptions.Item label="Package">
                <strong>{selectedBooking.packageId?.title || "N/A"}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Route / Location">
                {selectedBooking.packageId?.route || selectedBooking.packageId?.location || "N/A"}
              </Descriptions.Item>

              <Descriptions.Item label="Departure Date">
                {selectedBooking.travelDate
                  ? new Date(selectedBooking.travelDate).toLocaleDateString()
                  : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Number of Guests">
                {selectedBooking.numOfPeople} Passenger(s)
              </Descriptions.Item>

              <Descriptions.Item label="Price / Person">
                ${selectedBooking.packageId?.price || 0}
              </Descriptions.Item>
              <Descriptions.Item label="Total Amount">
                <strong style={{ color: "#e0693f", fontSize: 16 }}>
                  ${(selectedBooking.packageId?.price || 0) * (selectedBooking.numOfPeople || 1)}
                </strong>
              </Descriptions.Item>

              <Descriptions.Item label="Booking Status" span={2}>
                <Tag
                  color={
                    selectedBooking.status === "confirmed"
                      ? "green"
                      : selectedBooking.status === "cancelled"
                        ? "red"
                        : "orange"
                  }
                >
                  {selectedBooking.status?.toUpperCase()}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Created At" span={2}>
                {new Date(selectedBooking.createdAt).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>

            <Divider style={{ margin: "20px 0 16px" }} />

            <div className="booking-modal-status-actions">
              <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12, color: "#5b6980" }}>
                QUICK STATUS CHANGE:
              </span>
              <Space>
                <button
                  type="button"
                  className="quick-status-btn btn-confirm"
                  onClick={() => {
                    handleStatusChange(selectedBooking._id, "confirmed");
                    setIsViewModalOpen(false);
                  }}
                >
                  <CheckCircleOutlined /> Mark Confirmed
                </button>
                <button
                  type="button"
                  className="quick-status-btn btn-pending"
                  onClick={() => {
                    handleStatusChange(selectedBooking._id, "pending");
                    setIsViewModalOpen(false);
                  }}
                >
                  <ClockCircleOutlined /> Mark Pending
                </button>
                <button
                  type="button"
                  className="quick-status-btn btn-cancel"
                  onClick={() => {
                    handleStatusChange(selectedBooking._id, "cancelled");
                    setIsViewModalOpen(false);
                  }}
                >
                  <CloseCircleOutlined /> Mark Cancelled
                </button>
              </Space>
            </div>
          </div>
        )}
      </Modal>

      {/* Change Status Modal */}
      <Modal
        open={isStatusModalOpen}
        onCancel={() => setIsStatusModalOpen(false)}
        footer={null}
        width={420}
        centered
        className="booking-status-modal"
      >
        {selectedBooking && (
          <div className="status-modal-box">
            <Title level={4} style={{ fontFamily: "Fraunces", margin: "0 0 6px" }}>
              Update Booking Status
            </Title>
            <Text type="secondary" style={{ display: "block", marginBottom: 16 }}>
              Passenger: <strong>{selectedBooking.userId?.name}</strong> (
              {selectedBooking.packageId?.title})
            </Text>

            <div className="status-buttons-list">
              <button
                type="button"
                className={`status-select-btn btn-confirmed ${
                  selectedBooking.status === "confirmed" ? "is-selected" : ""
                }`}
                onClick={() => handleStatusChange(selectedBooking._id, "confirmed")}
              >
                <CheckCircleOutlined /> Confirmed {selectedBooking.status === "confirmed" ? "✓" : ""}
              </button>

              <button
                type="button"
                className={`status-select-btn btn-pending ${
                  selectedBooking.status === "pending" ? "is-selected" : ""
                }`}
                onClick={() => handleStatusChange(selectedBooking._id, "pending")}
              >
                <ClockCircleOutlined /> Pending {selectedBooking.status === "pending" ? "✓" : ""}
              </button>

              <button
                type="button"
                className={`status-select-btn btn-cancelled ${
                  selectedBooking.status === "cancelled" ? "is-selected" : ""
                }`}
                onClick={() => handleStatusChange(selectedBooking._id, "cancelled")}
              >
                <CloseCircleOutlined /> Cancelled {selectedBooking.status === "cancelled" ? "✓" : ""}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Booking;
