import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteEnquiries,
  getAllEnquiries,
  updateStatus,
} from "../../../store/slice/contactSlice";
import { Typography, Popconfirm, message } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import ViewModal from "./ViewModal";
import StatusModal from "./StatusModal";
import "./enquiries.css";

const { Title, Text } = Typography;

const Enquiries = () => {
  const [open, setOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [filter, setFilter] = useState("all");

  const { enquiry, loading } = useSelector((store) => store.contactSlice);
  const dispatch = useDispatch();

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteEnquiries(id)).unwrap();
      message.success("Enquiry deleted successfully.");
    } catch (err) {
      message.error(typeof err === "string" ? err : err?.message || "Failed to delete enquiry");
    }
  };

  const handleGet = (enq) => {
    setSelectedEnquiry(enq);
    setOpen(true);
  };

  const handleStatus = (enq) => {
    setSelectedEnquiry(enq);
    setStatusOpen(true);
  };

  const statusUpdate = async (status) => {
    if (!selectedEnquiry) return;
    try {
      await dispatch(
        updateStatus({
          _id: selectedEnquiry._id,
          status,
        })
      ).unwrap();
      await dispatch(getAllEnquiries()).unwrap();
      message.success(`Status updated to ${status}`);
      setStatusOpen(false);
    } catch (err) {
      message.error(typeof err === "string" ? err : err?.message || "Failed to update status");
    }
  };

  const filteredEnquiries = (enquiry || []).filter((e) => {
    if (filter === "all") return true;
    return e.status === filter;
  });

  return (
    <>
      <section className="enquiry">
        <header className="enquiry__header">
          <div>
            <span className="enquiry__eyebrow">MESSAGE DESK</span>
            <h1 className="enquiry__title">Customer Enquiries</h1>
          </div>

          <div className="enquiry__tabs">
            {["all", "new", "pending", "resolved", "rejected"].map((tab) => (
              <button
                key={tab}
                type="button"
                className={`enquiry__tab ${filter === tab ? "is-active" : ""}`}
                onClick={() => setFilter(tab)}
              >
                {tab.toUpperCase()}
                <span className="tab-count">
                  {tab === "all"
                    ? enquiry?.length || 0
                    : (enquiry || []).filter((e) => e.status === tab).length}
                </span>
              </button>
            ))}
          </div>
        </header>

        <div className="enquiry__divider" />

        <div className="enquiry__table-wrapper">
          <table className="enquiry__table">
            <thead>
              <tr>
                <th className="enquiry__th enquiry__th--title">Passenger</th>
                <th className="enquiry__th enquiry__th--email">Email</th>
                <th className="enquiry__th enquiry__th--subject">Subject</th>
                <th className="enquiry__th enquiry__th--status text-center">Status</th>
                <th className="enquiry__th enquiry__th--date text-center">Date</th>
                <th className="enquiry__th enquiry__th--action text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading && (!enquiry || enquiry.length === 0) ? (
                <tr>
                  <td colSpan={6} className="enquiry__empty">
                    <Text type="secondary">Loading customer enquiries...</Text>
                  </td>
                </tr>
              ) : filteredEnquiries.length > 0 ? (
                filteredEnquiries.map((enq) => (
                  <tr className="enquiry__row" key={enq._id}>
                    <td className="enquiry__td enquiry__td--title">
                      <strong>{enq.name}</strong>
                    </td>

                    <td className="enquiry__td enquiry__td--email">
                      {enq.email}
                    </td>

                    <td className="enquiry__td enquiry__td--subject">
                      <span className="enquiry__subject-text">{enq.subject}</span>
                    </td>

                    <td className="enquiry__td text-center">
                      <span className={`status-pill pill-${enq.status || "new"}`}>
                        {enq.status || "new"}
                      </span>
                    </td>

                    <td className="enquiry__td enquiry__td--date text-center">
                      {new Date(enq.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </td>

                    <td className="enquiry__td enquiry__td--action text-center">
                      <button
                        type="button"
                        className="enquiry__action enquiry__action--view"
                        onClick={() => handleGet(enq)}
                      >
                        <EyeOutlined /> View
                      </button>

                      <button
                        type="button"
                        className="enquiry__action enquiry__action--status"
                        onClick={() => handleStatus(enq)}
                      >
                        <EditOutlined /> Status
                      </button>

                      <Popconfirm
                        title="Delete enquiry?"
                        description="Are you sure you want to permanently delete this message?"
                        onConfirm={() => handleDelete(enq._id)}
                        okText="Delete"
                        cancelText="Cancel"
                      >
                        <button
                          type="button"
                          className="enquiry__action enquiry__action--delete"
                        >
                          <DeleteOutlined /> Delete
                        </button>
                      </Popconfirm>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="enquiry__empty">
                    <Title level={4} style={{ margin: 0, color: "#5b6980" }}>
                      No {filter !== "all" ? filter : ""} enquiries found
                    </Title>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <ViewModal open={open} setOpen={setOpen} enquiries={selectedEnquiry} />
      <StatusModal
        statusOpen={statusOpen}
        setStatusOpen={setStatusOpen}
        enqStatus={statusUpdate}
        currentStatus={selectedEnquiry?.status}
      />
    </>
  );
};

export default Enquiries;
