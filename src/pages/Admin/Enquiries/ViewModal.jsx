import {
  Modal,
  Descriptions,
  Typography,
  Avatar,
  Space,
  Tag,
  Divider,
} from "antd";
import {
  MailOutlined,
  MessageOutlined,
  CalendarOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Text, Paragraph } = Typography;

const ViewModal = ({ open, setOpen, enquiries }) => {
  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      width={680}
      centered
      title={
        <Space>
          <Avatar
            size={48}
            style={{ background: "#16233b", fontFamily: "Fraunces" }}
          >
            {enquiries?.name?.charAt(0)?.toUpperCase() || "E"}
          </Avatar>

          <div>
            <Text strong style={{ fontSize: 18, fontFamily: "Fraunces" }}>
              {enquiries?.name || "Customer Enquiry"}
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12, fontFamily: "IBM Plex Mono" }}>
              Enquiry Reference · {enquiries?._id}
            </Text>
          </div>
        </Space>
      }
    >
      <Descriptions
        column={1}
        bordered
        size="middle"
        style={{ marginTop: 16 }}
      >
        <Descriptions.Item
          label={
            <>
              <MailOutlined /> Email
            </>
          }
        >
          <a href={`mailto:${enquiries?.email}`}>{enquiries?.email}</a>
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <>
              <MessageOutlined /> Subject
            </>
          }
        >
          <strong>{enquiries?.subject}</strong>
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <>
              <CalendarOutlined /> Submitted Date
            </>
          }
        >
          {enquiries?.createdAt ? new Date(enquiries.createdAt).toLocaleString() : "N/A"}
        </Descriptions.Item>

        <Descriptions.Item label="Status">
          <Tag
            color={
              enquiries?.status === "resolved"
                ? "green"
                : enquiries?.status === "rejected"
                  ? "red"
                  : enquiries?.status === "pending"
                    ? "orange"
                    : "blue"
            }
          >
            {enquiries?.status?.toUpperCase() || "NEW"}
          </Tag>
        </Descriptions.Item>
      </Descriptions>

      <Divider style={{ margin: "20px 0 16px" }} />

      <Text strong style={{ fontFamily: "IBM Plex Mono", fontSize: 12, textTransform: "uppercase" }}>
        Customer Message:
      </Text>

      <Paragraph
        style={{
          marginTop: 10,
          background: "#faf6ee",
          padding: 18,
          borderRadius: 10,
          maxHeight: 240,
          overflowY: "auto",
          whiteSpace: "pre-wrap",
          fontSize: 14,
          color: "#16233b",
          lineHeight: 1.6,
          border: "1px solid #e3d9c2",
        }}
      >
        {enquiries?.message || "No message content"}
      </Paragraph>
    </Modal>
  );
};

export default ViewModal;