import React from "react";
import ListLayout from "../../shared/layout/List";
import { Button, Dropdown, Flex, Input, Space, Switch, Table, Tag } from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { DropdownWrap, Header, MoreAction } from "./style";

const items = [
  {
    key: "1",
    label: <span>Ko'rsatish</span>,
    icon: <EyeOutlined />,
  },
  {
    key: "2",
    label: <span>Tahrirlash</span>,
    icon: <EditOutlined />,
  },
  {
    type: "divider",
  },
  {
    key: "3",
    label: <span>O'chirish</span>,
    icon: <DeleteOutlined />,
  },
];

const columns = [
  {
    title: "Nomi",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Tavsif",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Rang",
    dataIndex: "color",
    key: "color",
    render: (_, render) => (
      <>
        <Tag color={render.color}>{render.colorName}</Tag>
      </>
    ),
  },
  {
    title: "Yoqilgan",
    key: "state",
    dataIndex: "state",
    render: (_, record) => (
      <>
        <Switch
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
          defaultChecked
          checked={record.state === "A"}
        />
      </>
    ),
  },
  {
    title: "",
    key: "action",
    fixed: "right",
    width: 100,
    render: (_, record) => (
      <DropdownWrap menu={{ items }} placement="bottomRight" trigger="click">
        <MoreAction>
          <MoreOutlined className="moreAction" />
        </MoreAction>
      </DropdownWrap>
    ),
  },
];
const data = [
  {
    key: "1",
    name: "Temir",
    description: 32,
    color: "darkGreen",
    colorName: "Yashil",
    state: "A",
  },
];

const ProductCategory = () => {
  return (
    <ListLayout>
      <Header>
        <h2 className="title">Mahsulot kategoriyalari ro'yxati</h2>
        <Flex gap="small">
          <Input placeholder="Qidirish" />
          <Button icon={<ReloadOutlined />}>Yangilash</Button>
          <Button type="primary">Yangi mahsulot kategoriyasi qo'shish</Button>
        </Flex>
      </Header>
      <Table columns={columns} dataSource={data} />
    </ListLayout>
  );
};

export default ProductCategory;
