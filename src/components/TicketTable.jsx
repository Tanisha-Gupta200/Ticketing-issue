import { Table, Button, Tag, Tooltip, Card } from "antd";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

export default function TicketTable({ tickets, updateStatus, deleteTicket }) {
  const isSmallScreen = useMediaQuery({ maxWidth: 767 });

  const columns = [
    { title: "ID", dataIndex: "id", responsive: ["md"] },
    { title: "Title", dataIndex: "title", responsive: ["md"] },
    {
      title: "Priority",
      dataIndex: "priority",
      responsive: ["md"],
      render: (priority) => {
        let color =
          priority === "High"
            ? "red"
            : priority === "Medium"
            ? "orange"
            : "green";
        return <Tag color={color}>{priority}</Tag>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      responsive: ["md"],
      render: (status) => {
        const color =
          status === "Open"
            ? "blue"
            : status === "In Progress"
            ? "orange"
            : "green";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    { title: "Created", dataIndex: "createdAt", responsive: ["md"] },
    {
      title: "Actions",
      key: "actions",
      responsive: ["md"],
      render: (_, record) => (
        <div className="flex gap-2">
          <Link to={`/ticket/${record.id}`}>
            <Tooltip title="View ticket details">
              <Button type="link" size="small">
                View
              </Button>
            </Tooltip>
          </Link>
          <Tooltip title="Delete permanently">
            <Button danger size="small" onClick={() => deleteTicket(record.id)}>
              Delete
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div>
      {isSmallScreen ? (
        <div className="flex flex-col gap-3">
          {tickets.map((ticket) => (
            <Card key={ticket.id} size="small" className="shadow-md">
              <div className="mb-2">
                <div style={{ fontWeight: 600, fontSize: 16 }}>
                  <strong>Title: </strong> {ticket.title}
                </div>
                <div style={{ fontWeight: 500, fontSize: 14, color: "#444" }}>
                  <strong>ID: </strong> {ticket.id}
                </div>
              </div>

              <div className="mb-1">
                <strong>Priority: </strong>
                <Tag
                  color={
                    ticket.priority === "High"
                      ? "red"
                      : ticket.priority === "Medium"
                      ? "orange"
                      : "green"
                  }
                >
                  {ticket.priority}
                </Tag>
              </div>

              <div className="mb-1">
                <strong>Status: </strong>
                <Tag
                  color={
                    ticket.status === "Open"
                      ? "blue"
                      : ticket.status === "In Progress"
                      ? "orange"
                      : "green"
                  }
                >
                  {ticket.status}
                </Tag>
              </div>

              <div
                className="mb-2"
                style={{ fontSize: 12, color: "#666", whiteSpace: "nowrap" }}
              >
                <strong>Created: </strong> {ticket.createdAt}
              </div>

              <div className="flex gap-2 mt-2">
                <Link to={`/ticket/${ticket.id}`}>
                  <Button type="link" size="small">
                    View
                  </Button>
                </Link>
                <Button
                  danger
                  size="small"
                  onClick={() => deleteTicket(ticket.id)}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Table
          dataSource={tickets}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          size="small"
        />
      )}
    </div>
  );
}
