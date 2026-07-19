import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { Button, Modal, Typography, Divider} from "antd";
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
    label: "Rejected",
    value: "rejected",
    className: "rejected",
    icon: <CloseCircleOutlined />,
  },
  {
    label: "Resolved",
    value: "resolved",
    className: "resolved",
    icon: <CheckCircleOutlined />,
  },
];

const StatusModal = ({ statusOpen, setStatusOpen, enqStatus }) => {
  return (
    <Modal
      open={statusOpen}
      onCancel={() => setStatusOpen(false)}
      footer={null}
      centered
    >
      <div className="status-modal-content">
        <Typography.Title level={4} className="status-title">
          Update Enquiry Status
        </Typography.Title>

        <Typography.Text type="secondary">
          Select the new status for this enquiry.
        </Typography.Text>

        <Divider />
        <div className="status-grid">
          {statuses.map((status) => (
            <Button
              key={status.value}
              icon={status.icon}
              className={`status-btn ${status.className}`}
              onClick={() => enqStatus(status.value)}
              block
            >
              {status.label}
            </Button>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default StatusModal;
