import React from "react";
import { Divider } from "antd";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./enquiries.css";

const Enquiries = () => {
  const { myEnquiry, loading } = useSelector((store) => store.contactSlice);

  return (
    <div className="enq-wrapper">
      <div className="enq-header">
        <div>
          <span className="enq-eyebrow">YOUR INQUIRIES</span>
          <h2 className="enq-title">My Enquiries</h2>
        </div>
        <Link to="/customer-dashboard/contact" className="enq-btn-new">
          + New Enquiry
        </Link>
      </div>

      <Divider style={{ borderColor: "#e3d9c2", margin: "16px 0 24px" }} />

      <div className="enq-card">
        {loading && (!myEnquiry || myEnquiry.length === 0) ? (
          <div className="enq-empty-state">Loading enquiries...</div>
        ) : myEnquiry && myEnquiry.length > 0 ? (
          <div className="enq-table-responsive">
            <table className="enq-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Message</th>
                  <th className="text-center">Status</th>
                  <th className="enq-align-right text-center">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {myEnquiry.map((itm) => (
                  <tr key={itm._id}>
                    <td className="enq-cell enq-cell--name">
                      <strong>{itm.subject}</strong>
                    </td>
                    <td className="enq-cell enq-cell--message">{itm.message}</td>
                    <td className="enq-cell enq-cell--status text-center">
                      <span
                        className={`status-badge ${
                          itm.status === "pending"
                            ? "status-pending"
                            : itm.status === "resolved"
                              ? "status-approved"
                              : itm.status === "rejected"
                                ? "status-rejected"
                                : "status-new"
                        }`}
                      >
                        {itm.status || "new"}
                      </span>
                    </td>

                    <td className="enq-cell enq-cell--date enq-align-right text-center">
                      {new Date(itm.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="enq-empty-state">
            <h3>No enquiries sent yet</h3>
            <p>Have questions about trips, custom dates, or group rates?</p>
            <Link to="/customer-dashboard/contact" className="enq-btn-new">
              Send an enquiry →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Enquiries;
