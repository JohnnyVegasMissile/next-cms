"use client";

import {
  Badge,
  Button,
  Card,
  Divider,
  Input,
  Popconfirm,
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd";
import {
  UnorderedListOutlined,
  CopyOutlined,
  FileAddOutlined,
  EditOutlined,
  DeleteOutlined,
  PicCenterOutlined,
  PicLeftOutlined,
  SearchOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const columns: ColumnsType<DataType> = [
  {
    title: "Name",
    dataIndex: "title",
    key: "title",
    render: (text) => "xxxxxxxx",
  },
  {
    title: "Url",
    dataIndex: "url",
    key: "url",
    render: (text) => "xxxxxxxx",
  },
  {
    title: "Last updated",
    dataIndex: "last_updated",
    key: "last_updated",
    render: (text) => "xxxxxxxx",
  },
  {
    title: "Status",
    dataIndex: "last_updated",
    key: "last_updated",
    render: (text) => <Badge status="success" text="xxxxxxxx" />,
  },
  {
    width: 1,
    key: "action",
    render: (_, record) => (
      <Space>
        <Tooltip title="Custom sections">
          <Button icon={<PicCenterOutlined />} size="small" type="dashed" />
        </Tooltip>
        <Tooltip title="Custom template sections">
          <Button icon={<PicLeftOutlined />} size="small" type="dashed" />
        </Tooltip>
        <Divider type="vertical" style={{ margin: 0 }} />
        <Tooltip title="Duplicate">
          <Button icon={<CopyOutlined />} size="small" />
        </Tooltip>
        <Tooltip title="See all contents">
          <Button icon={<UnorderedListOutlined />} size="small" />
        </Tooltip>
        <Tooltip title="Create new content">
          <Button icon={<FileAddOutlined />} size="small" />
        </Tooltip>
        <Tooltip title="Edit">
          <Button type="primary" icon={<EditOutlined />} size="small">
            Edit
          </Button>
        </Tooltip>
        <Popconfirm
          placement="left"
          title="Delete the task"
          description="Are you sure to delete this task?"
          // onConfirm={(e) => e?.stopPropagation()}
          // onCancel={(e) => e?.stopPropagation()}
          okText="Delete"
          cancelText="Cancel"
        >
          <Tooltip title="Delete">
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              Delete
            </Button>
          </Tooltip>
        </Popconfirm>
      </Space>
    ),
  },
];

const data: DataType[] = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"],
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
];

const Containers = () => {
  return (
    <>
      <Card size="small">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Space>
            <Input
              size="small"
              suffix={<SearchOutlined />}
              placeholder="Search"
            />
          </Space>

          <Button type="primary" icon={<PlusOutlined />} size="small">
            Create new
          </Button>
        </div>
      </Card>
      <Card size="small" style={{ height: "100%" }}>
        <Table size="small" columns={columns} dataSource={data} />
      </Card>
    </>
  );
};

export default Containers;
