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
  UserOutlined,
  MailOutlined,
  MessageOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";

const { Text, Paragraph } = Typography;

const ViewModal = ({ open, setOpen ,enquiries }) => {
  
  
  return (
    <Modal
      open={open}
      onCancel={()=>setOpen(false)}
      footer={null}
      width={700}
      centered
      title={
        <Space>
          <Avatar
            size={45}
            style={{ background: "#1677ff" }}
          >
            {enquiries?.name?.charAt(0).toUpperCase()}
          </Avatar>

          <div>
            <Text strong style={{ fontSize: 18 }}>
              {enquiries?.name}
            </Text>
            <br />
            <Text type="secondary">
              Euquiry Details
            </Text>
          </div>
        </Space>
      }
    >
      <Descriptions
        column={1}
        bordered
        size="middle"
      >
        <Descriptions.Item
          label={
            <>
              <MailOutlined /> Email
            </>
          }
        >
          {enquiries?.email}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <>
              <MessageOutlined /> Subject
            </>
          }
        >
          {enquiries?.subject}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <>
              <CalendarOutlined /> Submitted
            </>
          }
        >
          {new Date(enquiries?.createdAt).toLocaleString()}
        </Descriptions.Item>

        <Descriptions.Item label="Status">
          <Tag color="processing">{enquiries?.status}</Tag>
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      <Text strong>Message</Text>

      <Paragraph
        style={{
          marginTop: 12,
          background: "#fafafa",
          padding: 16,
          borderRadius: 8,
          maxHeight: 220,
          overflowY: "auto",
          whiteSpace: "pre-wrap",
        }}
      >
        {enquiries?.message}
      </Paragraph>
    </Modal>
  );
};

export default ViewModal;