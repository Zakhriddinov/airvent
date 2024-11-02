import React, { useCallback, useEffect } from 'react';
import ListLayout from '../../shared/layout/List';
import { Button, Dropdown, Image, Input, Switch, Table } from 'antd';
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
  RedoOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { selectListItems } from '@/redux/crud/selectors';
import { crud } from '@/redux/crud/actions';
import { generate as uniqueId } from 'shortid';
import { PageHeader } from '@ant-design/pro-layout';
import DeleteModal from '../../components/DeleteModal';
import { useCrudContext } from '@/context/crud';

const items = [
  {
    key: 'view',
    label: <span>Ko'rsatish</span>,
    icon: <EyeOutlined />,
  },
  {
    key: 'edit',
    label: <span>Tahrirlash</span>,
    icon: <EditOutlined />,
  },
  {
    type: 'divider',
  },
  {
    key: 'delete',
    label: <span>O'chirish</span>,
    icon: <DeleteOutlined />,
    danger: true,
  },
];

const ProductCategory = () => {
  const { state, crudContextAction } = useCrudContext();
  const { modal } = crudContextAction;

  const handleRead = (record) => {
    dispatch(crud.currentItem({ data: record }));
  };

  function handleEdit(record) {
    dispatch(crud.currentItem({ data: record }));
    dispatch(crud.currentAction({ actionType: 'update', data: record }));
  }

  function handleDelete(record) {
    dispatch(crud.currentAction({ actionType: 'delete', data: record }));
    modal.open();
  }

  const columns = [
    {
      title: 'Rasm',
      dataIndex: 'photo',
      key: 'photo',
      width: 60,
      render: (_, record) => (
        <Image
          width={50}
          height={50}
          src={
            record?.photo ??
            'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
          }
        />
      ),
    },
    {
      title: 'Kod',
      dataIndex: 'code',
      key: 'code',
      width: 60,
    },
    {
      title: 'Nomi',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Tavsif',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Yoqilgan',
      key: 'enabled',
      dataIndex: 'enabled',
      width: 50,
      render: (_, record) => (
        <>
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            defaultChecked
            checked={record?.enabled}
          />
        </>
      ),
    },
    {
      title: '',
      key: 'action',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <Dropdown
          menu={{
            items,
            onClick: ({ key }) => {
              switch (key) {
                case 'read':
                  handleRead(record);
                  break;
                case 'edit':
                  handleEdit(record);
                  break;
                case 'delete':
                  handleDelete(record);
                  break;
                default:
                  break;
              }
            },
          }}
          placement="bottomRight"
          trigger={['click']}
        >
          <EllipsisOutlined
            style={{ cursor: 'pointer', fontSize: '24px' }}
            onClick={(e) => e.preventDefault()}
          />
          {/* <MoreAction>
            <MoreOutlined className="moreAction" />
          </MoreAction> */}
        </Dropdown>
      ),
    },
  ];
  const entity = 'productcategory';
  const { result: listResult, isLoading: listIsLoading } = useSelector(selectListItems);
  const { pagination, items: dataSource } = listResult;
  const dispatch = useDispatch();

  const handelDataTableLoad = useCallback((pagination) => {
    const options = { page: pagination.current || 1, items: pagination.pageSize || 10 };
    dispatch(crud.list({ entity, options }));
  }, []);

  const searchConfig = {
    displayLabels: ['name'],
    searchFields: 'name,code,description',
  };

  const filterTable = (e) => {
    const value = e.target.value;
    const options = { q: value, fields: searchConfig?.searchFields || '' };
    dispatch(crud.list({ entity, options }));
  };

  const dispatcher = () => {
    dispatch(crud.list({ entity }));
  };

  useEffect(() => {
    const controller = new AbortController();
    dispatcher();
    return () => {
      controller.abort();
    };
  }, []);
  
  return (
    <ListLayout>
      <PageHeader
        onBack={() => window.history.back()}
        title={"Mahsulot kategoriyalari ro'yxati"}
        ghost={false}
        extra={[
          <Input
            key={`searchFilterDataTable}`}
            onChange={filterTable}
            placeholder={'Qidirish'}
            allowClear
          />,
          <Button onClick={handelDataTableLoad} key={`${uniqueId()}`} icon={<RedoOutlined />}>
            Yangilash
          </Button>,
          <Button type="primary">Kategoriya qo'shish</Button>,
        ]}
        style={{
          padding: '20px 0px',
        }}
      ></PageHeader>

      <Table
        columns={columns}
        rowKey={(item) => item._id}
        dataSource={dataSource}
        pagination={pagination}
        loading={listIsLoading}
        scroll={{ x: true }}
      />
      {state?.isModalOpen && (
        <DeleteModal config={{ entity: entity, modalTitle: "O'chirishni tasdiqlash" }} />
      )}
    </ListLayout>
  );
};

export default ProductCategory;
