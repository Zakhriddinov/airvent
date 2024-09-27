import ErpLayout from '@/layout/ErpLayout';
import ErpPanel from '../../ErpPanelModule';

export default function PaymentDataTableModule({ config }) {
  return (
    <ErpLayout>
      <ErpPanel config={config}></ErpPanel>
    </ErpLayout>
  );
}
