import { useCallback, useEffect } from 'react';

import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  RedoOutlined,
} from '@ant-design/icons';
import { Dropdown, Table, Button, Input } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';

import { useSelector, useDispatch } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { selectListItems } from '@/redux/crud/selectors';
import { dataForTable } from '@/utilities/dataStructure';

import { generate as uniqueId } from 'shortid';

import { useCrudContext } from '@/context/crud';

function AddNewItem({ config }) {
  const { crudContextAction } = useCrudContext();
  const { advancedBox } = crudContextAction;
  const { ADD_NEW_ENTITY } = config;

  const handelClick = () => {
    advancedBox.open();
  };

  return (
    <Button onClick={handelClick} type="primary">
      {ADD_NEW_ENTITY}
    </Button>
  );
}

export default function DataTable({ config, extra = [] }) {
  let {
    entity,
    dataTableColumns,
    DATATABLE_TITLE,
    fields,
    searchConfig,
    sortBy,
    sortValue,
    withoutDeleteBtn = false,
  } = config;

  const sort = sortBy && sortValue ? { sortBy, sortValue } : {};

  const { crudContextAction } = useCrudContext();
  const { modal, editBox, readBox } = crudContextAction;

  const items = [
    {
      label: "Ko'rsatish",
      key: 'read',
      icon: <EyeOutlined />,
    },
    {
      label: 'Tahrirlash',
      key: 'edit',
      icon: <EditOutlined />,
    },
    ...extra,
    !withoutDeleteBtn &&
      ({
        type: 'divider',
      },
      {
        label: "O'chirish",
        key: 'delete',
        icon: <DeleteOutlined />,
      }),
  ];

  const handleRead = (record) => {
    // dispatch(crud.currentItem({ data: record }));
    // readBox.open();
  };
  function handleEdit(record) {
    dispatch(crud.currentItem({ data: record }));
    dispatch(crud.currentAction({ actionType: 'update', data: record }));
    editBox.open();
  }
  function handleDelete(record) {
    dispatch(crud.currentAction({ actionType: 'delete', data: record }));
    modal.open();
  }
  function handleUpdatePassword(record) {}

  let dispatchColumns = [];
  if (fields) {
    dispatchColumns = [...dataForTable({ fields })];
  } else {
    dispatchColumns = [...dataTableColumns];
  }

  dataTableColumns = [
    ...dispatchColumns,
    {
      title: '',
      key: 'action',
      fixed: 'right',
      width: 70,
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
                case 'updatePassword':
                  handleUpdatePassword(record);
                  break;

                default:
                  break;
              }
            },
          }}
          trigger={['click']}
        >
          <EllipsisOutlined
            style={{ cursor: 'pointer', fontSize: '24px' }}
            onClick={(e) => e.preventDefault()}
          />
        </Dropdown>
      ),
    },
  ];

  const { result: listResult, isLoading: listIsLoading } = useSelector(selectListItems);

  const { pagination, items: dataSource } = listResult;

  const dispatch = useDispatch();

  const handelDataTableLoad = useCallback((pagination) => {
    const options = {
      page: pagination.current || 1,
      items: pagination.pageSize || 10,
      ...sort,
    };
    dispatch(crud.list({ entity, options }));
  }, []);

  const filterTable = (e) => {
    const value = e.target.value;
    const options = { q: value, fields: searchConfig?.searchFields || '' };
    dispatch(crud.list({ entity, options }));
  };

  const dispatcher = () => {
    dispatch(crud.list({ entity, options: { page: 1, items: 10, ...sort } }));
  };

  useEffect(() => {
    const controller = new AbortController();
    dispatcher();
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <>
      <PageHeader
        onBack={() => window.history.back()}
        title={DATATABLE_TITLE}
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

          <AddNewItem key={`${uniqueId()}`} config={config} />,
        ]}
        style={{
          padding: '20px 0px',
        }}
      ></PageHeader>

      <Table
        columns={dataTableColumns}
        rowKey={(item) => item._id}
        dataSource={dataSource}
        pagination={pagination}
        loading={listIsLoading}
        onChange={handelDataTableLoad}
        scroll={{ x: true }}
      />
    </>
  );
}
