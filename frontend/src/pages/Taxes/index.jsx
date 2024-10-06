import React from 'react';

import { Switch } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import CrudModule from '@/module/CrudModule';
import TaxForm from '@/forms/TaxForm';

export default function Taxes() {
  const entity = 'taxes';
  const searchConfig = {
    displayLabels: ['taxName'],
    searchFields: 'taxName',
    outputValue: '_id',
  };
  const deleteModalLabels = ['name'];

  const readColumns = [
    {
      title: 'Nomi',
      dataIndex: 'taxName',
    },
    {
      title: 'Qiymati',
      dataIndex: 'taxValue',
    },
    {
      title: 'Standart',
      dataIndex: 'isDefault',
    },
    {
      title: 'Holat',
      dataIndex: 'enabled',
    },
  ];
  const dataTableColumns = [
    {
      title: 'Nomi',
      dataIndex: 'taxName',
    },
    {
      title: 'Qiymati',
      dataIndex: 'taxValue',
      render: (_, record) => {
        return <>{record.taxValue + '%'}</>;
      },
    },
    {
      title: 'Standart',
      dataIndex: 'isDefault',
      key: 'isDefault',
      onCell: (record, rowIndex) => {
        return {
          props: {
            style: {
              width: '60px',
            },
          },
        };
      },
      render: (_, record) => {
        return (
          <Switch
            checked={record.isDefault}
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
          />
        );
      },
    },
    {
      title: 'Holat',
      dataIndex: 'enabled',
      key: 'enabled',
      onCell: (record, rowIndex) => {
        return {
          props: {
            style: {
              width: '60px',
            },
          },
        };
      },
      render: (_, record) => {
        return (
          <Switch
            checked={record.enabled}
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
          />
        );
      },
    },
  ];

  const Labels = {
    PANEL_TITLE: 'taxes',
    DATATABLE_TITLE: "Soliqlar ro'yxati",
    ADD_NEW_ENTITY: "Yangi soliq qo'shish",
    ENTITY_NAME: 'taxes',
  };

  const configPage = {
    entity,
    ...Labels,
  };

  const config = {
    ...configPage,
    readColumns,
    dataTableColumns,
    searchConfig,
    deleteModalLabels,
  };

  return (
    <CrudModule
      createForm={<TaxForm />}
      updateForm={<TaxForm isUpdateForm={true} />}
      config={config}
    />
  );
}
