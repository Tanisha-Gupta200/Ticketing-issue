import { Input, Select } from "antd";

export default function FilterBar({ filters, setFilters }) {
  return (
    <div className="flex flex-row sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0  ">
      <Select
        value={filters.status}
        onChange={(val) => setFilters({ ...filters, status: val })}
        className="w-1/3 sm:w-1/3 "
        placeholder="Select Status"
      >
        <Select.Option value="All">Status</Select.Option>
        <Select.Option value="Open">Open</Select.Option>
        <Select.Option value="In Progress">In Progress</Select.Option>
        <Select.Option value="Resolved">Resolved</Select.Option>
      </Select>

      <Select
        value={filters.priority}
        onChange={(val) => setFilters({ ...filters, priority: val })}
        className="w-1/3 sm:w-1/3"
        placeholder="Select Priority"
      >
        <Select.Option value="All">Priority</Select.Option>
        <Select.Option value="Low">Low</Select.Option>
        <Select.Option value="Medium">Medium</Select.Option>
        <Select.Option value="High">High</Select.Option>
      </Select>

      <Input
        placeholder="Search title..."
        value={filters.search}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        className="w-1/3 sm:w-1/3"
      />
    </div>
  );
}
