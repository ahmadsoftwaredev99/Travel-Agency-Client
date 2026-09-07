import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { Button, Modal, Typography, Divider } from "antd";
import "./statusModal.css";

const statuses = [
  {
    label: "New",
    value: "new",
    className: "new",
    icon: <PlusCircleOutlined />,
  },
  {
    label: "Pending",
    value: "pending",
    className: "pending",
    icon: <ClockCircleOutlined />,
  },
  {
    label: "Resolved",
    value: "resolved",
    className: "resolved",
    icon: <CheckCircleOutlined />,
  },
  {
    label: "Rejected",
    value: "rejected",
    className: "rejected",
    icon: <CloseCircleOutlined />,
  },
];

const StatusModal = ({ statusOpen, setStatusOpen, enqStatus, currentStatus }) => {
  return (
    <Modal
      open={statusOpen}
      onCancel={() => setStatusOpen(false)}
      footer={null}
      centered
      className="status-modal"
      width={440}
    >
      <div className="status-modal-content">
        <Typography.Title level={4} className="status-title">
          Update Enquiry Status
        </Typography.Title>

        <Typography.Text type="secondary">
          Current status: <strong style={{ textTransform: "capitalize" }}>{currentStatus || "new"}</strong>
        </Typography.Text>

        <Divider style={{ margin: "16px 0" }} />

        <div className="status-grid">
          {statuses.map((status) => (
            <Button
              key={status.value}
              icon={status.icon}
              className={`status-btn ${status.className} ${
                currentStatus === status.value ? "is-current" : ""
              }`}
              onClick={() => enqStatus(status.value)}
              block
            >
              {status.label} {currentStatus === status.value ? "✓" : ""}
            </Button>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default StatusModal;
