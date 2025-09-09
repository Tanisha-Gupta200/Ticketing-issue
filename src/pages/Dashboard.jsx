import { useState, useEffect } from "react";
import { Button, Select, Input, Modal, Row, Col, Card, Badge, Tooltip } from "antd";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Link } from "react-router-dom";
import TicketForm from "../components/TicketForm";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";

const { Option } = Select;

export default function Dashboard() {
  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem("tickets");
    return saved ? JSON.parse(saved) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    localStorage.setItem("tickets", JSON.stringify(tickets));
  }, [tickets]);

  const addTicket = (ticket) => {
    const newTicket = {
      id: Date.now().toString(),
      createdAt: new Date().toLocaleString(),
      status: "Open",
      comments: [],
      ...ticket,
    };
    setTickets((prev) => [...prev, newTicket]);
    setIsModalOpen(false);
  };

  const deleteTicket = (id) => {
    setTickets((prev) => prev.filter((t) => t.id !== id));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId !== destination.droppableId) {
      setTickets((prev) =>
        prev.map((t) =>
          t.id === result.draggableId ? { ...t, status: destination.droppableId } : t
        )
      );
    }
  };

  const columns = {
    Open: { name: "Open", items: tickets.filter((t) => t.status === "Open") },
    "In Progress": {
      name: "In Progress",
      items: tickets.filter((t) => t.status === "In Progress"),
    },
    Resolved: {
      name: "Resolved",
      items: tickets.filter((t) => t.status === "Resolved"),
    },
  };

  const filteredTickets = (items) =>
    items.filter(
      (t) =>
        (statusFilter ? t.status === statusFilter : true) &&
        (priorityFilter ? t.priority === priorityFilter : true) &&
        (searchTerm ? t.title.toLowerCase().includes(searchTerm.toLowerCase()) : true)
    );

  // Metrics
  const total = tickets.length;
  const resolved = tickets.filter((t) => t.status === "Resolved").length;
  const open = tickets.filter((t) => t.status === "Open").length;
  const newToday = tickets.filter((t) => {
    const createdDate = new Date(t.createdAt);
    const today = new Date();
    return (
      createdDate.getDate() === today.getDate() &&
      createdDate.getMonth() === today.getMonth() &&
      createdDate.getFullYear() === today.getFullYear()
    );
  }).length;
  const resolvedPercent = total > 0 ? Math.round((resolved / total) * 100) : 0;

  return (
    <div className="min-h-screen relative bg-cover bg-center lg:h-full">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-black backdrop-blur-md z-20 p-4 flex flex-col sm:flex-row justify-between items-center text-white shadow-lg gap-2 sm:gap-0">
        <h1 className="text-xl sm:text-xl font-bold">🎫 Support Ticketing System</h1>
        <Tooltip title="Create a new ticket">
          <Button
            type="primary"
            className="border-none shadow-lg hover:opacity-90 w-full sm:w-auto"
            onClick={() => setIsModalOpen(true)}
          >
            + Create Ticket
          </Button>
        </Tooltip>
      </nav>

      {/* Header */}
      <div className="text-center mb-6 sm:mb-8 text-white drop-shadow-lg mt-12">
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-purple-300">
          Ticketing System
        </h2>
        <p className="mt-1 sm:mt-2 text-sm sm:text-base md:text-lg opacity-80 text-pink-300">
          Manage your support tickets and let's Connect
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-3 bg-white p-4 rounded-lg shadow-sm mb-6">
        <Select
          placeholder="Status"
          allowClear
          value={statusFilter}
          onChange={(v) => setStatusFilter(v)}
          style={{ minWidth: 160 }}
          showSearch={false}
        >
          <Option value="Open">Open</Option>
          <Option value="In Progress">In Progress</Option>
          <Option value="Resolved">Resolved</Option>
        </Select>

        <Select
          placeholder="Priority"
          allowClear
          value={priorityFilter}
          onChange={(v) => setPriorityFilter(v)}
          style={{ minWidth: 160 }}
          showSearch={false}
        >
          <Option value="Low">Low</Option>
          <Option value="Medium">Medium</Option>
          <Option value="High">High</Option>
        </Select>

        <Input
          placeholder="Search title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 220 }}
        />
      </div>

      {/* Metrics Section */}
      <div className="bg-white/20 backdrop-blur-2xl rounded-2xl shadow-2xl p-6 border border-white/30 overflow-x-auto">
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} md={6}>
            <Card style={{ minHeight: 100 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <FolderOpenOutlined style={{ fontSize: 24 }} />
                <div>
                  <div style={{ fontSize: 14, color: "#888" }}>Total Tickets</div>
                  <div style={{ fontSize: 20, fontWeight: 600 }}>{total}</div>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card style={{ minHeight: 100 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <CheckCircleOutlined style={{ fontSize: 24, color: "green" }} />
                <div>
                  <div style={{ fontSize: 14, color: "#888" }}>Resolved</div>
                  <div style={{ fontSize: 20, fontWeight: 600, color: "green" }}>
                    {resolvedPercent} %
                  </div>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card style={{ minHeight: 100 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <ExclamationCircleOutlined style={{ fontSize: 24, color: "#1890ff" }} />
                <div>
                  <div style={{ fontSize: 14, color: "#888" }}>New Today</div>
                  <div style={{ fontSize: 20, fontWeight: 600, color: "#1890ff" }}>
                    {newToday}
                  </div>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card style={{ minHeight: 100 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Badge color="#fa8c16" />
                <div>
                  <div style={{ fontSize: 14, color: "#888" }}>Open Tickets</div>
                  <div style={{ fontSize: 20, fontWeight: 600, color: "#fa8c16" }}>
                    {open}
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Drag & Drop Board */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(columns).map(([columnId, column]) => (
              <Droppable droppableId={columnId} key={columnId}>
                {(provided) => (
                  <div
                    className="bg-white rounded-lg shadow-sm border border-gray-200"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {/* Column Header */}
                    <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">
                      {column.name} ({filteredTickets(column.items).length})
                    </div>

                    {/* Tickets */}
                    <div className="p-4 space-y-3">
                      {filteredTickets(column.items).map((ticket, index) => (
                        <Draggable key={ticket.id} draggableId={ticket.id} index={index}>
                          {(provided) => (
                            <div
                              className="bg-white border border-gray-200 rounded-lg shadow-sm p-3 hover:shadow-md transition cursor-grab active:cursor-grabbing"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              {/* Title */}
                              <div className="font-medium text-gray-800 mb-1">
                                {ticket.title}
                              </div>

                              {/* Meta Info */}
                              <div className="flex items-center justify-between text-xs mb-2">
                                <span
                                  className={`px-2 py-0.5 rounded-md font-medium ${
                                    ticket.priority === "High"
                                      ? "bg-red-100 text-red-600"
                                      : ticket.priority === "Medium"
                                      ? "bg-orange-100 text-orange-600"
                                      : "bg-green-100 text-green-600"
                                  }`}
                                >
                                  {ticket.priority}
                                </span>
                                <span className="text-gray-500">{ticket.createdAt}</span>
                              </div>

                              {/* Actions */}
                              <div className="flex justify-end gap-3 text-sm">
                                <Link
                                  to={`/ticket/${ticket.id}`}
                                  className="text-blue-600 hover:underline"
                                >
                                  View
                                </Link>
                                <button
                                  onClick={() => deleteTicket(ticket.id)}
                                  className="text-red-600 hover:underline"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* Create Ticket Modal */}
      <Modal
        title="Create Ticket"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <TicketForm onCreate={addTicket} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
