import  ErpLayout  from '@/layout/ErpLayout';
import CreateItem from '@/module/ClientErpPanelModule/CreateItem';
import InvoiceForm from '@/module/ClientInvoiceModule/Forms/InvoiceForm';

export default function CreateInvoiceModule({ config }) {
  return (
    <ErpLayout>
      <CreateItem config={config} CreateForm={InvoiceForm} />
    </ErpLayout>
  );
}
