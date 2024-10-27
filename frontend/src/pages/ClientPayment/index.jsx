import PaymentDataTableModule from '@/module/InvoicePaymentModule/PaymentDataTableModule';
import { moneyFormatter } from '@/utilities/dataStructure';
import { Tag } from 'antd';
import { tagColor } from '@/utilities/statusTagColor';
import dayjs from 'dayjs';

export default function SuppplierPayment() {
  const searchConfig = {
    entity: 'client',
    displayLabels: ['number'],
    searchFields: 'number',
    outputValue: '_id',
  };

  const deleteModalLabels = ['number'];
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
      title: 'Summa',
      dataIndex: 'amount',
      onCell: () => {
        return {
          style: {
            textAlign: 'right',
            whiteSpace: 'nowrap',
            direction: 'ltr',
          },
        };
      },
      render: (amount, record) => {
        return moneyFormatter({ amount: amount, currency_code: record.currency });
      },
    },
    {
      title: 'Sana',
      dataIndex: 'date',
      render: (date) => {
        return dayjs(date).format('DD.MM.YYYY HH:MM');
      },
    },
    {
      title: 'Hisob faktura raqami',
      dataIndex: ['invoice', 'number'],
    },
    {
      title: 'Yil',
      dataIndex: ['invoice', 'year'],
    },
    {
      title: "To'lov turi",
      dataIndex: 'paymentMode',
      render: (paymentMode) => {
        let tagStatus = tagColor(paymentMode);
        return <Tag color={tagStatus.color}>{tagStatus.label}</Tag>;
      },
    },
  ];

  const entity = 'clientpayment';

  const Labels = {
    PANEL_TITLE: 'payment',
    DATATABLE_TITLE: "To'lovlar ro'yxati",
    ADD_NEW_ENTITY: 'add_new_payment',
    ENTITY_NAME: 'clientpayment',
  };

  const configPage = {
    entity,
    ...Labels,
  };
  const config = {
    ...configPage,
    disableAdd: true,
    dataTableColumns,
    searchConfig,
    deleteModalLabels,
  };

  return <PaymentDataTableModule config={config} />;
}
