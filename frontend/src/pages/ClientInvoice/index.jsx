import dayjs from 'dayjs';
import { Tag } from 'antd';
import { tagColor } from '@/utilities/statusTagColor';
import { moneyFormatter } from '@/utilities/dataStructure';
import InvoiceDataTableModule from '@/module/ClientInvoiceModule/InvoiceDataTableModule';

export default function ClientInvoice() {
  const entity = 'clientinvoice';
  const searchConfig = {
    entity: 'client',
    displayLabels: ['name'],
    searchFields: 'name',
  };

  const deleteModalLabels = ['number', 'clientinvoice'];

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
        return dayjs(date).format('DD.MM.YYYY');
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
        return moneyFormatter({ amount: total, currency_code: record.currency });
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
      render: (total, record) => {
        return moneyFormatter({ amount: total, currency_code: record.currency });
      },
    },
    {
      title: 'Holat',
      dataIndex: 'status',
      render: (status) => {
        let tagStatus = tagColor(status);
        return (
          <Tag color={tagStatus.color}>
            {/* {tagStatus.icon + ' '} */}
            {tagStatus.label}
          </Tag>
        );
      },
    },
    {
      title: "To'lov",
      dataIndex: 'paymentStatus',
      render: (paymentStatus) => {
        let tagStatus = tagColor(paymentStatus);
        return <Tag color={tagStatus.color}>{tagStatus.label}</Tag>;
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
    ADD_NEW_ENTITY: "Yangi hisob faktura qo'shish",
    ENTITY_NAME: 'clientinvoice',

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
