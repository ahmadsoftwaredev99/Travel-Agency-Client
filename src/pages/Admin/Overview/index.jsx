import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Row, Col, Typography, Tag, Space, Button } from "antd";
import {
  CalendarOutlined,
  DollarOutlined,
  GiftOutlined,
  TeamOutlined,
  MessageOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import axiosInstance from "../../../store/axiosInstance";
import "./overview.css";

const { Title, Text } = Typography;

const Overview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/admin/overview");
      setData(res.data);
    } catch (err) {
      console.error("Failed to load overview data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  return (
    <div className="overview-page">
      <div className="overview-container">
        {/* Header */}
        <div className="overview-header">
          <div>
            <span className="overview-eyebrow">COMMAND CENTER</span>
            <h1 className="overview-title">Agency Overview</h1>
          </div>

          <div className="overview-header-actions">
            <Link to="/admin-dashboard/packages">
              <Button type="primary" icon={<PlusOutlined />} className="overview-btn-primary">
                Add Package
              </Button>
            </Link>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="overview-kpi-grid">
          {/* Revenue */}
          <div className="kpi-card kpi-card--revenue">
            <div className="kpi-card__top">
              <span className="kpi-card__label">Estimated Revenue</span>
              <div className="kpi-card__icon"><DollarOutlined /></div>
            </div>
            <div className="kpi-card__value">
              ${(data?.revenue || 0).toLocaleString()}
            </div>
            <div className="kpi-card__sub">From confirmed itineraries</div>
          </div>

          {/* Bookings */}
          <div className="kpi-card">
            <div className="kpi-card__top">
              <span className="kpi-card__label">Total Bookings</span>
              <div className="kpi-card__icon"><CalendarOutlined /></div>
            </div>
            <div className="kpi-card__value">{data?.totalBookings ?? 0}</div>
            <div className="kpi-card__sub">
              {data?.bookingsByStatus?.confirmed ?? 0} confirmed · {data?.bookingsByStatus?.pending ?? 0} pending
            </div>
          </div>

          {/* Packages */}
          <div className="kpi-card">
            <div className="kpi-card__top">
              <span className="kpi-card__label">Active Packages</span>
              <div className="kpi-card__icon"><GiftOutlined /></div>
            </div>
            <div className="kpi-card__value">{data?.totalPackages ?? 0}</div>
            <div className="kpi-card__sub">Curated destinations</div>
          </div>

          {/* Users */}
          <div className="kpi-card">
            <div className="kpi-card__top">
              <span className="kpi-card__label">Passengers</span>
              <div className="kpi-card__icon"><TeamOutlined /></div>
            </div>
            <div className="kpi-card__value">{data?.totalUsers ?? 0}</div>
            <div className="kpi-card__sub">Registered accounts</div>
          </div>

          {/* Enquiries */}
          <div className="kpi-card">
            <div className="kpi-card__top">
              <span className="kpi-card__label">Open Inquiries</span>
              <div className="kpi-card__icon"><MessageOutlined /></div>
            </div>
            <div className="kpi-card__value">{data?.openEnquiries ?? 0}</div>
            <div className="kpi-card__sub">Awaiting response</div>
          </div>
        </div>

        {/* Breakdown & Recent Content */}
        <div className="overview-main-grid">
          {/* Recent Bookings */}
          <div className="overview-section overview-recent-bookings">
            <div className="section-head">
              <div>
                <span className="section-eyebrow">ACTIVITY</span>
                <h2 className="section-title">Recent Bookings</h2>
              </div>
              <Link to="/admin-dashboard/booking" className="section-link">
                View All Bookings <ArrowRightOutlined />
              </Link>
            </div>

            <div className="recent-table-wrapper">
              <table className="recent-table">
                <thead>
                  <tr>
                    <th>Passenger</th>
                    <th>Package</th>
                    <th>Date</th>
                    <th className="text-right">Amount</th>
                    <th className="text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.recentBookings && data.recentBookings.length > 0 ? (
                    data.recentBookings.map((b) => {
                      const user = b.userId || {};
                      const pkg = b.packageId || {};
                      const total = (pkg.price || 0) * (b.numOfPeople || 1);

                      return (
                        <tr key={b._id}>
                          <td className="recent-passenger">
                            <strong>{user.name || "Customer"}</strong>
                            <small>{user.email || "—"}</small>
                          </td>
                          <td className="recent-pkg">
                            <span>{pkg.title || "Custom Trip"}</span>
                          </td>
                          <td className="recent-date">
                            {b.travelDate
                              ? new Date(b.travelDate).toLocaleDateString()
                              : new Date(b.createdAt).toLocaleDateString()}
                          </td>
                          <td className="recent-price text-right">${total}</td>
                          <td className="text-center">
                            <span className={`status-pill status-${b.status}`}>
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center pt-4 pb-4">
                        <Text type="secondary">No recent bookings recorded.</Text>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions & Status Summary */}
          <div className="overview-sidebar-col">
            {/* Status Breakdown */}
            <div className="overview-section status-breakdown-card">
              <span className="section-eyebrow">RESERVATIONS BY STATUS</span>
              <h3 className="status-breakdown-title">Pipeline Breakdown</h3>

              <div className="breakdown-items">
                <div className="breakdown-row row-confirmed">
                  <div className="row-left">
                    <CheckCircleOutlined className="icon-green" />
                    <span>Confirmed</span>
                  </div>
                  <strong>{data?.bookingsByStatus?.confirmed ?? 0}</strong>
                </div>

                <div className="breakdown-row row-pending">
                  <div className="row-left">
                    <ClockCircleOutlined className="icon-amber" />
                    <span>Pending Review</span>
                  </div>
                  <strong>{data?.bookingsByStatus?.pending ?? 0}</strong>
                </div>

                <div className="breakdown-row row-cancelled">
                  <div className="row-left">
                    <CloseCircleOutlined className="icon-red" />
                    <span>Cancelled</span>
                  </div>
                  <strong>{data?.bookingsByStatus?.cancelled ?? 0}</strong>
                </div>
              </div>
            </div>

            {/* Quick Navigation Cards */}
            <div className="overview-section quick-nav-card">
              <span className="section-eyebrow">NAVIGATION</span>
              <h3 className="status-breakdown-title">Quick Actions</h3>

              <div className="quick-links-list">
                <Link to="/admin-dashboard/packages" className="quick-link-item">
                  <GiftOutlined />
                  <span>Manage Packages</span>
                  <ArrowRightOutlined className="arrow" />
                </Link>

                <Link to="/admin-dashboard/booking" className="quick-link-item">
                  <CalendarOutlined />
                  <span>Manage Bookings</span>
                  <ArrowRightOutlined className="arrow" />
                </Link>

                <Link to="/admin-dashboard/enquiries" className="quick-link-item">
                  <MessageOutlined />
                  <span>View Customer Inquiries</span>
                  <ArrowRightOutlined className="arrow" />
                </Link>

                <Link to="/admin-dashboard/user" className="quick-link-item">
                  <TeamOutlined />
                  <span>Passenger Directory</span>
                  <ArrowRightOutlined className="arrow" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
