import dayjs from 'dayjs';
import CrudModule from '@/module/CrudModule';
import { Tag } from 'antd';

export default function SupplierInvoice() {
  const entity = 'supplierinvoice';

  const searchConfig = {
    entity: 'client',
    displayLabels: ['name'],
    searchFields: 'name',
  };

  const deleteModalLabels = ['number', 'client.name'];

  const dataTableColumns = [
    {
      title: 'Number',
      dataIndex: 'number',
    },
    {
      title: 'Client',
      dataIndex: ['client', 'name'],
    },
    {
      title: 'Date',
      dataIndex: 'date',
      //   render: (date) => {
      //     return dayjs(date).format(dateFormat);
      //   },
    },
    {
      title: 'expired Date',
      dataIndex: 'expiredDate',
      //   render: (date) => {
      //     return dayjs(date).format(dateFormat);
      //   },
    },
    {
      title: 'Total',
      dataIndex: 'total',
      onCell: () => {
        return {
          style: {
            textAlign: 'right',
            whiteSpace: 'nowrap',
            direction: 'ltr',
          },
        };
      },
      render: (total, record) => {
        return total;
      },
    },
    {
      title: 'paid',
      dataIndex: 'credit',
      onCell: () => {
        return {
          style: {
            textAlign: 'right',
            whiteSpace: 'nowrap',
            direction: 'ltr',
          },
        };
      },
      render: (total, record) => total,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => {
        return (
          <Tag>
            {/* {tagStatus.icon + ' '} */}
            {status}
          </Tag>
        );
      },
    },
    {
      title: 'Payment',
      dataIndex: 'paymentStatus',
      render: (paymentStatus) => {
        return <Tag>{paymentStatus}</Tag>;
      },
    },
    {
      title: 'Created By',
      dataIndex: ['createdBy', 'name'],
    },
  ];

  const Labels = {
    PANEL_TITLE: 'invoice',
    DATATABLE_TITLE: 'invoice_list',
    ADD_NEW_ENTITY: 'add_new_invoice',
    ENTITY_NAME: 'invoice',
  };

  const configPage = {
    entity,
    ...Labels,
  };

  const config = {
    ...configPage,
    searchConfig,
    deleteModalLabels,
    dataTableColumns,
  };

  return <CrudModule config={config} />;
}
