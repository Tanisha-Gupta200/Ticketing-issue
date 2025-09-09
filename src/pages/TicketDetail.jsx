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
    <div style={{ padding: 16, background: "#f0f2f5", minHeight: "100vh" }}>
      <Title level={2} style={{ textAlign: "center", color: "#9254de" }}>
        Ticket Details
      </Title>

      <Card
        bordered={false}
        style={{
          maxWidth: 900,
          margin: "0 auto",
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
        bodyStyle={{ padding: screens.xs ? 16 : 24 }}
      >
        <Title level={4} style={{ color: "#531dab" }}>
          {ticket.title}
        </Title>

        <Descriptions
          column={screens.xs ? 1 : 2}
          layout="horizontal"
          size="middle"
          style={{ marginTop: 16 }}
        >
          <Descriptions.Item label="Description">
            {ticket.description}
          </Descriptions.Item>
          <Descriptions.Item label="Priority">
            {getPriorityTag(ticket.priority)}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            {getStatusTag(ticket.status)}
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {ticket.createdAt}
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        <Title level={5}>Update Ticket Status</Title>
        <Space
          direction={screens.xs ? "vertical" : "horizontal"}
          style={{ width: "100%", marginBottom: 16 }}
        >
          <Select
            value={status}
            onChange={setStatus}
            style={{ minWidth: 180 }}
          >
            <Option value="Open">Open</Option>
            <Option value="In Progress">In Progress</Option>
            <Option value="Resolved">Resolved</Option>
          </Select>
          <Button type="primary" onClick={updateStatus}>
            Update Status
          </Button>
        </Space>

        <Divider />

        <Title level={5}>Comments</Title>
        <List
          bordered
          dataSource={ticket.comments}
          renderItem={(item) => <List.Item>{item}</List.Item>}
          locale={{ emptyText: "No comments yet." }}
          style={{ backgroundColor: "#fafafa", borderRadius: 6 }}
        />

        <Space
          direction={screens.xs ? "vertical" : "horizontal"}
          style={{ width: "100%", marginTop: 16 }}
        >
          <Input.TextArea
            rows={2}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment"
            style={{ width: screens.xs ? "100%" : "auto", flex: 1 }}
          />
          <Button type="primary" onClick={addComment}>
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
