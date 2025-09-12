import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Button,
  Input,
  Select,
  Card,
  Typography,
  Divider,
  List,
  Space,
  message,
  Tag,
  Grid,
  Descriptions,
} from "antd";
import {
  MessageOutlined,
  SendOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  FileTextOutlined,
  FlagOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";

const { Option } = Select;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("");
  const screens = useBreakpoint();

  useEffect(() => {
    const saved = localStorage.getItem("tickets");
    if (saved) {
      const tickets = JSON.parse(saved);
      const found = tickets.find((t) => t.id === id);
      if (found) {
        setTicket(found);
        setStatus(found.status);
      }
    }
  }, [id]);

  const addComment = () => {
    if (!comment.trim()) {
      message.warning("Comment cannot be empty.");
      return;
    }
    const saved = JSON.parse(localStorage.getItem("tickets"));
    const updated = saved.map((t) =>
      t.id === id ? { ...t, comments: [...t.comments, comment] } : t
    );
    localStorage.setItem("tickets", JSON.stringify(updated));
    setTicket(updated.find((t) => t.id === id));
    setComment("");
    message.success("Comment added.");
  };

  const deleteComment = (index) => {
    const saved = JSON.parse(localStorage.getItem("tickets"));
    const updated = saved.map((t) =>
      t.id === id
        ? { ...t, comments: t.comments.filter((_, i) => i !== index) }
        : t
    );
    localStorage.setItem("tickets", JSON.stringify(updated));
    setTicket(updated.find((t) => t.id === id));
    message.success("Comment deleted.");
  };

  const updateStatus = () => {
    const saved = JSON.parse(localStorage.getItem("tickets"));
    const updated = saved.map((t) => (t.id === id ? { ...t, status } : t));
    localStorage.setItem("tickets", JSON.stringify(updated));
    setTicket(updated.find((t) => t.id === id));
    message.success("Status updated.");
  };

  const getPriorityTag = (priority) => {
    const map = {
      Low: "green",
      Medium: "orange",
      High: "red",
    };
    return <Tag color={map[priority] || "default"}>{priority}</Tag>;
  };

  const getStatusTag = (status) => {
    const map = {
      Open: "blue",
      "In Progress": "orange",
      Resolved: "green",
    };
    return <Tag color={map[status] || "default"}>{status}</Tag>;
  };

  if (!ticket) return <div style={{ padding: 20 }}>Ticket not found.</div>;

  return (
    <div style={{ padding: 16, minHeight: "100vh" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
        Ticket Details
      </Title>

      <Card
        bordered={false}
        style={{
          maxWidth: 900,
          margin: "0 auto",
          borderRadius: 16,
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
        }}
        bodyStyle={{ padding: screens.xs ? 16 : 28 }}
        hoverable
      >
        <Title level={4} style={{ marginBottom: 16 }}>
          <FileTextOutlined style={{ marginRight: 8, color: "#1890ff" }} />
          {ticket.title}
        </Title>

        <Descriptions
          column={screens.xs ? 1 : 2}
          size="middle"
          style={{
            marginTop: 8,
            padding: "12px 16px",
            borderRadius: 12,
            background: "#fafafa",
          }}
        >
          <Descriptions.Item label="Description">
            {ticket.description}
          </Descriptions.Item>
          <Descriptions.Item label="Priority">
            <FlagOutlined style={{ marginRight: 6, color: "#fa8c16" }} />
            {getPriorityTag(ticket.priority)}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            {getStatusTag(ticket.status)}
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            <ClockCircleOutlined style={{ marginRight: 6, color: "#595959" }} />
            {ticket.createdAt}
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        <Title level={5} style={{ marginBottom: 12 }}>
          <SyncOutlined style={{ marginRight: 8, color: "#1890ff" }} />
          Update Ticket Status
        </Title>
        <Space
          direction={screens.xs ? "vertical" : "horizontal"}
          style={{ width: "100%", marginBottom: 20 }}
        >
          <Select
            value={status}
            onChange={setStatus}
            style={{ minWidth: 200 }}
            size="large"
          >
            <Option value="Open">Open</Option>
            <Option value="In Progress">In Progress</Option>
            <Option value="Resolved">Resolved</Option>
          </Select>
          <Button
            type="primary"
            onClick={updateStatus}
            icon={<CheckCircleOutlined />}
            size="large"
          >
            Update Status
          </Button>
        </Space>

        <Divider />
        <Title level={5}>
          <MessageOutlined style={{ marginRight: 8, color: "#1890ff" }} />
          Comments
        </Title>

        <List
          bordered
          dataSource={ticket.comments}
          renderItem={(item, index) => (
            <List.Item
              actions={[
                <DeleteOutlined
                  key="delete"
                  style={{ color: "red", cursor: "pointer" }}
                  onClick={() => deleteComment(index)}
                />,
              ]}
              style={{
                backgroundColor: index % 2 === 0 ? "#fff" : "#fafafa",
                borderRadius: 4,
              }}
            >
              <MessageOutlined style={{ marginRight: 8, color: "#595959" }} />
              {item}
            </List.Item>
          )}
          locale={{ emptyText: "No comments yet." }}
          style={{
            borderRadius: 8,
            marginBottom: 16,
            overflow: "hidden",
          }}
        />

        <Space
          direction={screens.xs ? "vertical" : "horizontal"}
          style={{ width: "100%", marginTop: 16 }}
        >
          <Input.TextArea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your comment..."
            style={{
              width: screens.xs ? "100%" : "auto",
              flex: 1,
              borderRadius: 8,
            }}
          />
          <Button
            type="primary"
            onClick={addComment}
            icon={<SendOutlined />}
            size="large"
          >
            Add Comment
          </Button>
        </Space>
        <Divider />
        <div style={{ textAlign: "right" }}>
          <Button onClick={() => navigate(-1)} type="default">
            Back to Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
}
