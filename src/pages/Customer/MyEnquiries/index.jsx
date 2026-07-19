import React from "react";
import { Divider } from "antd";
import { useSelector } from "react-redux";
import "./enquiries.css";

const Enquiries = () => {
  const { myEnquiry } = useSelector((store) => store.contactSlice);

  return (
    <div className="enq-wrapper">
      <div className="enq-header">
        <h2 className="enq-title">Enquiries</h2>
      </div>

      <Divider />

      <div className="enq-card">
        <table className="enq-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Message</th>
              <th className="text-center">Status</th>
              <th className="enq-align-right text-center">Date</th>
            </tr>
          </thead>
          <tbody>
            {myEnquiry.map((itm) => (
              <tr key={itm._id}>
                <td className="enq-cell enq-cell--name">{itm.name}</td>
                <td className="enq-cell enq-cell--email">{itm.email}</td>
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
                            : "status-default"
                    }`}
                  >
                    {itm.status}
                  </span>
                </td>

                <td className="enq-cell enq-cell--date enq-align-right text-center">
                  {new Date(itm.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Enquiries;
