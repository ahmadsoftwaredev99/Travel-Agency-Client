import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Popconfirm, message, Tag } from "antd";
import { cancelBooking } from "../../../store/slice/bookingSlice";
import "./mybooking.css";

const MyBooking = () => {
  const [filter, setFilter] = useState("all");
  const { myBookings, loading } = useSelector((store) => store.bookingSlice);
  const dispatch = useDispatch();

  const handleCancelBooking = async (id) => {
    try {
      await dispatch(cancelBooking(id)).unwrap();
      message.success("Booking cancelled successfully.");
    } catch (err) {
      message.error(typeof err === "string" ? err : err?.message || "Failed to cancel booking");
    }
  };

  const filteredBookings = (myBookings || []).filter((b) => {
    if (filter === "all") return true;
    return b.status === filter;
  });

  return (
    <div className="my-bookings-page">
      <div className="my-bookings-container">
        {/* Header */}
        <div className="my-bookings-header">
          <div>
            <span className="my-bookings-eyebrow">YOUR JOURNEYS</span>
            <h1 className="my-bookings-title">My Bookings</h1>
          </div>
          <Link to="/customer-dashboard" className="my-bookings-btn-new">
            + Book New Trip
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="my-bookings-tabs">
          {["all", "pending", "confirmed", "cancelled"].map((tab) => (
            <button
              key={tab}
              type="button"
              className={`my-bookings-tab ${filter === tab ? "is-active" : ""}`}
              onClick={() => setFilter(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              <span className="tab-count">
                {tab === "all"
                  ? myBookings?.length || 0
                  : (myBookings || []).filter((b) => b.status === tab).length}
              </span>
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {loading && myBookings?.length === 0 ? (
          <div className="my-bookings-state">Loading your bookings...</div>
        ) : filteredBookings.length > 0 ? (
          <div className="my-bookings-grid">
            {filteredBookings.map((b) => {
              const pkg = b.packageId || {};
              const imageUrl = Array.isArray(pkg.image)
                ? pkg.image[0] || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80"
                : pkg.image || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80";

              const totalPrice = (pkg.price || 0) * (b.numOfPeople || 1);

              return (
                <div key={b._id} className="booking-card">
                  <div
                    className="booking-card-media"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                  >
                    <span className={`booking-status-tag status-${b.status}`}>
                      {b.status}
                    </span>
                  </div>

                  <div className="booking-card-content">
                    <div className="booking-card-top">
                      <span className="booking-route">{pkg.route || pkg.location || "Package"}</span>
                      <span className="booking-date-booked">
                        Booked {new Date(b.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="booking-title">{pkg.title || "Tour Package"}</h3>

                    <div className="booking-details-grid">
                      <div className="detail-item">
                        <span className="label">Departure Date</span>
                        <span className="value">
                          {b.travelDate ? new Date(b.travelDate).toLocaleDateString(undefined, {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) : "N/A"}
                        </span>
                      </div>

                      <div className="detail-item">
                        <span className="label">Guests</span>
                        <span className="value">{b.numOfPeople} Passenger{b.numOfPeople > 1 ? "s" : ""}</span>
                      </div>

                      <div className="detail-item">
                        <span className="label">Duration</span>
                        <span className="value">{pkg.duration ? `${pkg.duration} Days` : "Standard"}</span>
                      </div>

                      <div className="detail-item">
                        <span className="label">Total Price</span>
                        <span className="value total-price">${totalPrice}</span>
                      </div>
                    </div>

                    <div className="booking-card-footer">
                      <span className="booking-id-tag">REF: {b._id.slice(-6).toUpperCase()}</span>

                      {b.status === "pending" ? (
                        <Popconfirm
                          title="Cancel this booking?"
                          description="Are you sure you want to cancel this pending booking?"
                          onConfirm={() => handleCancelBooking(b._id)}
                          okText="Yes, Cancel"
                          cancelText="Keep"
                        >
                          <button type="button" className="btn-cancel-booking">
                            Cancel Booking
                          </button>
                        </Popconfirm>
                      ) : b.status === "confirmed" ? (
                        <span className="confirmed-note">✓ Itinerary Confirmed</span>
                      ) : (
                        <span className="cancelled-note">Cancelled</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="my-bookings-empty">
            <div className="empty-icon">✈</div>
            <h2>No {filter !== "all" ? filter : ""} bookings found</h2>
            <p>You have no active trips in this category. Ready for your next adventure?</p>
            <Link to="/customer-dashboard" className="my-bookings-btn-new">
              Explore Packages →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBooking;
