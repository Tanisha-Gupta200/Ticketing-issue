import { useState, useEffect, useRef } from "react";
import { Button, Card, Col, Row, Modal, Tag, Tooltip } from "antd";
import { Link } from "react-router-dom";
import TicketForm from "../components/TicketForm";
import FilterBar from "../components/FilterBar";
import { useMediaQuery } from "react-responsive";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  FolderOpenOutlined,
  FormOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";

import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

function TicketCard({ ticket, confirmDelete }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const cleanup = draggable({
      element: ref.current,
      getInitialData: () => ({ id: ticket.id, status: ticket.status }),
      dragHandleSelector: "*",
    });

    return () => cleanup();
  }, [ticket]);

  const statusColors = {
    Open: "orange",
    "In Progress": "blue",
    Resolved: "green",
  };

  const isSmallScreen = useMediaQuery({ maxWidth: 639 });

  return (
    <Card
      ref={ref}
      size="default"
      className="cursor-grab active:cursor-grabbing hover:shadow-md transition-transform duration-200 ease-out"
      bodyStyle={{ padding: "14px" }}
    >
      <div className="flex flex-wrap justify-between gap-2 items-start mb-2">
        <div className="font-medium text-gray-800 text-sm lg:text-[18px]">
          {ticket.title}
        </div>
        <Tag
          color="red"
          className="font-semibold text-xs flex flex-wrap items-center"
        >
          {ticket.id}
        </Tag>
      </div>

      <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
        <span
          className={`px-2 py-0.5 rounded-md font-medium text-sm ${
            ticket.priority === "High"
              ? "bg-red-100 text-red-600"
              : ticket.priority === "Medium"
              ? "bg-orange-100 text-orange-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {ticket.priority}
        </span>
        <span className="text-gray-500 text-xs">{ticket.createdAt}</span>
      </div>

      <div className="flex md:flex-wrap justify-between items-center mt-4 gap-1">
        <Tag
          color={statusColors[ticket.status]}
          className="text-xs sm:text-sm px-2 sm:px-3 py-1"
        >
          {ticket.status}
        </Tag>

        <div className="flex  gap-2">
          {isSmallScreen ? (
            <Tooltip title="View ticket">
              <Link to={`/ticket/${ticket.id}`}>
                <Button
                  type="text"
                  size="small"
                  icon={<EyeOutlined style={{ color: "blue" }} />}
                />
              </Link>
            </Tooltip>
          ) : (
            <Tooltip title="View ticket details">
              <Link to={`/ticket/${ticket.id}`}>
                <Button
                  size="small"
                  className="px-2 py-1 text-xs sm:text-xs"
                  style={{ color: "blue" }}
                >
                  View
                </Button>
              </Link>
            </Tooltip>
          )}

          {isSmallScreen ? (
            <Tooltip title="Delete ticket">
              <Button
                type="text"
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => confirmDelete(ticket)}
              />
            </Tooltip>
          ) : (
            <Tooltip title="Delete ticket">
              <Button size="small" danger onClick={() => confirmDelete(ticket)}>
                Delete
              </Button>
            </Tooltip>
          )}
        </div>
      </div>
    </Card>
  );
}

export default function Dashboard() {
  const [tickets, setTickets] = useState(() => {
    try {
      const saved = localStorage.getItem("tickets");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);

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
      id: Math.random().toString(36).substring(2, 8),
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
    setDeleteModalOpen(false);
  };

  const confirmDelete = (ticket) => {
    setTicketToDelete(ticket);
    setDeleteModalOpen(true);
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
    items.filter((t) => {
      const statusMatch =
        filters.status === "All" ? true : t.status === filters.status;
      const priorityMatch =
        filters.priority === "All" ? true : t.priority === filters.priority;
      const searchMatch = filters.search
        ? t.title.toLowerCase().includes(filters.search.toLowerCase())
        : true;
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

  useEffect(() => {
    const cleanups = Object.keys(columns).map((status) => {
      const colEl = document.getElementById(`col-${status}`);
      if (!colEl) return () => {};
      return dropTargetForElements({
        element: colEl,
        getData: () => ({ status }),
      });
    });

    const monitorCleanup = monitorForElements({
      onDrop({ source, location }) {
        if (!location.current.dropTargets.length) return;

        const target = location.current.dropTargets[0].data;
        const { id, status: fromStatus } = source.data;

        if (target.status && target.status !== fromStatus) {
          setTickets((prev) =>
            prev.map((t) => (t.id === id ? { ...t, status: target.status } : t))
          );
        }
      },
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup && cleanup());
      monitorCleanup();
    };
  }, [tickets]);

  return (
    <div className="min-h-screen relative bg-cover bg-center lg:h-full p-2 sm:p-6">
      <nav className="fixed top-0 left-0 w-full bg-black backdrop-blur-md z-20 p-4 flex flex-col sm:flex-row justify-between items-center text-white shadow-lg gap-2 sm:gap-0">
        <h1 className="text-xl sm:text-xl font-bold">
          🎫 Support Ticketing System
        </h1>
        <Tooltip title="Create a new ticket">
          <Button
            type="primary"
            className="border-none hover:opacity-90 w-50% sm:w-auto"
            onClick={() => setIsModalOpen(true)}
          >
            + Create Ticket
          </Button>
        </Tooltip>
      </nav>

      <div className="text-center mb-1 sm:mb-6 mt-7 lg:mt-0">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-black">
          Solver Desk
        </h2>
        <p className="sm:mt-3 text-sm sm:text-base md:text-lg opacity-80 text-gray-500">
          Ticket Your Issue. Let’s connect
        </p>
      </div>

      <div className="mb-6">
        <FilterBar filters={filters} setFilters={setFilters} />
      </div>

      <div className="bg-gray-50 rounded-2xl p-6 border border-white/30 overflow-x-auto mb-6">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ minHeight: 100 }}>
              <div className="flex items-center gap-3">
                <FolderOpenOutlined style={{ fontSize: 24 }} />
                <div>
                  <div className="text-sm">Total Tickets</div>
                  <div className="font-semibold text-lg">{total}</div>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ minHeight: 100 }}>
              <div className="flex items-center gap-3">
                <CheckCircleOutlined style={{ fontSize: 24, color: "green" }} />
                <div>
                  <div className="text-sm text-green-600">Resolved</div>
                  <div className="font-semibold text-lg text-green-600">
                    {resolvedPercent} %
                  </div>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ minHeight: 100 }}>
              <div className="flex items-center gap-3">
                <ExclamationCircleOutlined
                  style={{ fontSize: 24, color: "#1890ff" }}
                />
                <div>
                  <div className="text-blue-600 text-sm">New Today</div>
                  <div className="font-semibold text-lg text-blue-600">
                    {newToday}
                  </div>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ minHeight: 100 }}>
              <div className="flex items-center gap-3">
                <FormOutlined style={{ fontSize: 24, color: "#ff7a45" }} />
                <div>
                  <div className="text-orange-600 text-sm">Open Tickets</div>
                  <div className="font-semibold text-lg text-orange-600">
                    {open}
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-2">
        {Object.entries(columns).map(([columnId, column]) => (
          <div
            key={columnId}
            id={`col-${columnId}`}
            className="bg-gray-200 text-[10px] sm:text-xs rounded-lg border border-gray-200 flex flex-col min-h-[300px] p-2"
          >
            <div className="px-3 py-2 sm:px-4 sm:py-3 border-b border-gray-200 bg-white font-semibold text-gray-600 sm:text-gray-700 text-xs sm:text-sm rounded-t-md">
              {column.name} ({filteredTickets(column.items).length})
            </div>

            <div className="flex-1 p-2 sm:p-4 space-y-2 sm:space-y-4 overflow-y-auto min-h-[150px]">
              {filteredTickets(column.items).map((ticket) => (
                <div key={ticket.id} className="p-1 sm:p-2">
                  <TicketCard ticket={ticket} confirmDelete={confirmDelete} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <TicketForm
          onCreate={addTicket}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <Modal
        title="Confirm Delete"
        open={deleteModalOpen}
        onOk={() => ticketToDelete && deleteTicket(ticketToDelete.id)}
        onCancel={() => setDeleteModalOpen(false)}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <p>
          Are you sure you want to delete the ticket "{ticketToDelete?.title}"?
        </p>
      </Modal>
    </div>
  );
}