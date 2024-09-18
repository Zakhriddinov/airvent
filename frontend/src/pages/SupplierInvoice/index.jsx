import { Tag } from 'antd';
import DataTable from './DataTable';
import ErpLayout from '@/layout/ErpLayout';
import { moneyFormatter } from '@/utilities/dataStructure';
import { tagColor } from '@/utilities/statusTagColor';

export default function SupplierInvoice() {
  const entity = 'supplierinvoice';

  const searchConfig = {
    entity: 'supplierinvoice',
    displayLabels: ['name'],
    searchFields: 'name',
  };

  const deleteModalLabels = ['number', 'supplierinvoice'];

  const dataTableColumns = [
    {
      title: 'Raqam',
      dataIndex: 'number',
    },
    {
      title: 'Yetkazib beruvchi',
      dataIndex: ['supplier', 'name'],
    },
    {
      title: 'Sana',
      dataIndex: 'date',
    },
    {
      title: "Muddati o'tgan sana",
      dataIndex: 'expiredDate',
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
    PANEL_TITLE: "Hisob-fakturalar ro'yxati",
    DATATABLE_TITLE: "Hisob-fakturalar ro'yxati",
    ADD_NEW_ENTITY: "Yangi hisob fatura qo'shish",
    ENTITY_NAME: 'supplierinvoice',
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

  return (
    <ErpLayout>
      <DataTable config={config} />
    </ErpLayout>
  );
}
