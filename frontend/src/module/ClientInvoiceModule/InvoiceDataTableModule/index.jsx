import ErpLayout from '@/layout/ErpLayout';
import ErpPanel from '@/module/ErpPanelModule';
import { CreditCardOutlined } from '@ant-design/icons';

export default function InvoiceDataTableModule({ config }) {
  return (
    <ErpLayout>
      <ErpPanel
        config={config}
        extra={[
          {
            label: "To'lovni kiritish",
            key: 'recordPayment',
            icon: <CreditCardOutlined />,
          },
        ]}
      ></ErpPanel>
    </ErpLayout>
  );
}
