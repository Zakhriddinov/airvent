import dayjs from 'dayjs';
import { Tag } from 'antd';
import { tagColor } from '@/utilities/statusTagColor';

import InvoiceDataTableModule from '@/module/InvoiceModule/InvoiceDataTableModule';

export default function Invoice() {
  const entity = 'invoice';

  const searchConfig = {
    entity: 'client',
    displayLabels: ['name'],
    searchFields: 'name',
  };
  const deleteModalLabels = ['number', 'client.name'];
  const dataTableColumns = [
    {
      title: 'Raqam',
      dataIndex: 'number',
    },
    {
      title: 'Mijoz',
      dataIndex: ['client', 'name'],
    },
    {
      title: 'Sana',
      dataIndex: 'date',
      render: (date) => {
        return dayjs(date).format('DD/MM/YYYY');
      },
    },
    {
      title: "Muddati o'tgan sana",
      dataIndex: 'expiredDate',
      render: (date) => {
        return dayjs(date).format('DD/MM/YYYY');
      },
    },
    {
      title: 'Jami',
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
        return total
      },
    },
    {
      title: "To'langan",
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
      render: (total, record) => total
    },
    {
      title: 'Holat',
      dataIndex: 'status',
      render: (status) => {
        let tagStatus = tagColor(status);

        return (
          <Tag color={tagStatus.color}>
            {/* {tagStatus.icon + ' '} */}
            {status && tagStatus.label}
          </Tag>
        );
      },
    },
    {
      title: "To'lov",
      dataIndex: 'paymentStatus',
      render: (paymentStatus) => {
        let tagStatus = tagColor(paymentStatus);

        return (
          <Tag color={tagStatus.color}>
            {/* {tagStatus.icon + ' '} */}
            {paymentStatus && paymentStatus}
          </Tag>
        );
      },
    },
    {
      title: 'Yaratuvchi',
      dataIndex: ['createdBy', 'name'],
    },
  ];

  const Labels = {
    PANEL_TITLE: 'invoice',
    DATATABLE_TITLE: "Hisob-fakturalar ro'yxati",
    ADD_NEW_ENTITY: 'Yangi',
    ENTITY_NAME: 'invoice',

    RECORD_ENTITY: 'record_payment',
  };

  const configPage = {
    entity,
    ...Labels,
  };
  const config = {
    ...configPage,
    dataTableColumns,
    searchConfig,
    deleteModalLabels,
  };

  return <InvoiceDataTableModule config={config} />;
}
