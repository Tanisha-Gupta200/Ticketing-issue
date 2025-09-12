
import { Routes, Route, Link } from "react-router-dom";
import { Layout, Menu } from "antd";
import Dashboard from "./pages/Dashboard";
import TicketDetail from "./pages/TicketDetail";

const { Header, Content } = Layout;

export default function App() {
  return (
    <Layout className="min-h-screen">
      <Header>
        <Menu theme="dark" mode="horizontal">
          <Menu.Item key="1">
            <Link to="/">Dashboard</Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Content className="p-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/ticket/:id" element={<TicketDetail />} />
        </Routes>
      </Content>
    </Layout>
  );
}
