import { Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";

export default function FilterBar({ filters, setFilters }) {
  return (
    <div className="flex  gap-2 items-start ">
      <Select
        value={filters.status}
        onChange={(val) => setFilters({ ...filters, status: val })}
        style={{ width: 120 }}
        className="sm:w-32 w-full"
        placeholder="Status"
      >
        <Select.Option value="All">Status</Select.Option>
        <Select.Option value="Open">Open</Select.Option>
        <Select.Option value="In Progress">In Progress</Select.Option>
        <Select.Option value="Resolved">Resolved</Select.Option>
      </Select>

      <Select
        value={filters.priority}
        onChange={(val) => setFilters({ ...filters, priority: val })}
        style={{ width: 120 }}
        className="sm:w-32 w-full"
        placeholder="Priority"
      >
        <Select.Option value="All">Priority</Select.Option>
        <Select.Option value="Low">Low</Select.Option>
        <Select.Option value="Medium">Medium</Select.Option>
        <Select.Option value="High">High</Select.Option>
      </Select>

      <Input
        prefix={<SearchOutlined />}
        placeholder="Search Item"
        value={filters.search}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        style={{ width: 110 }}
        className="sm:w-20 text-xs w-full "
      />
    </div>
  );
}
