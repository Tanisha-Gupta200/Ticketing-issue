import { useState, useEffect } from "react";
import { Button, Modal, Tooltip, Card, Row, Col, Badge } from "antd";
import TicketForm from "../components/TicketForm";
import TicketTable from "../components/TicketTable";
import FilterBar from "../components/FilterBar";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";

export default function Dashboard() {
  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem("tickets");
    return saved ? JSON.parse(saved) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "All",
    priority: "All",
    search: "",
  });

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

  const updateStatus = (id, newStatus) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
  };

  const deleteTicket = (id) => {
    setTickets((prev) => prev.filter((t) => t.id !== id));
  };

  const filteredTickets = tickets.filter((t) => {
    const statusMatch = filters.status === "All" || t.status === filters.status;
    const priorityMatch =
      filters.priority === "All" || t.priority === filters.priority;
    const searchMatch = t.title
      .toLowerCase()
      .includes(filters.search.toLowerCase());
    return statusMatch && priorityMatch && searchMatch;
  });

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
      <nav className="fixed top-0 left-0 w-full bg-black backdrop-blur-md z-20 p-4 flex flex-col sm:flex-row justify-between items-center text-white shadow-lg gap-2 sm:gap-0">
        <h1 className="text-xl sm:text-xl font-bold">
          🎫 Support Ticketing System
        </h1>
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

      <div className="relative z-10 pt-28 sm:pt-24 p-4 sm:p-6 md:p-8">
        <div className="text-center mb-6 sm:mb-8 text-white drop-shadow-lg">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-purple-300">
            Ticketing System
          </h2>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base md:text-lg opacity-80 text-pink-300">
            Manage your support tickets and let's Connect
          </p>
        </div>

        <div className="bg-white/20 backdrop-blur-2xl rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 border border-white/30 overflow-x-auto">
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} sm={12} md={6}>
              <Card style={{ minHeight: 100 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <FolderOpenOutlined style={{ fontSize: 24 }} />
                  <div>
                    <div style={{ fontSize: 14, color: "#888" }}>
                      Total Tickets
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 600 }}>{total}</div>
                  </div>
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Card style={{ minHeight: 100 }}>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <CheckCircleOutlined
                      style={{ fontSize: 24, color: "green" }}
                    />
                    <div>
                      <div style={{ fontSize: 14, color: "#888" }}>
                        Resolved
                      </div>
                      <div
                        style={{
                          fontSize: 20,
                          fontWeight: 600,
                          color: "green",
                        }}
                      >
                        {resolvedPercent} %
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Card style={{ minHeight: 100 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <ExclamationCircleOutlined
                    style={{ fontSize: 24, color: "#1890ff" }}
                  />
                  <div>
                    <div style={{ fontSize: 14, color: "#888" }}>New Today</div>
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 600,
                        color: "#1890ff",
                      }}
                    >
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
                    <div style={{ fontSize: 14, color: "#888" }}>
                      Open Tickets
                    </div>
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 600,
                        color: "#fa8c16",
                      }}
                    >
                      {open}
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2 sm:gap-0">
            <FilterBar filters={filters} setFilters={setFilters} />
          </div>

          <TicketTable
            tickets={filteredTickets}
            updateStatus={updateStatus}
            deleteTicket={deleteTicket}
          />

          <Modal
            open={isModalOpen}
            footer={null}
            onCancel={() => setIsModalOpen(false)}
            className="custom-modal"
          >
            <TicketForm addTicket={addTicket} />
          </Modal>
        </div>
      </div>
    </div>
  );
}
