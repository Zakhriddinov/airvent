import InvoiceForm from '@/module/InvoiceModule/Forms/InvoiceForm';
import CreateItem from './CreateItem';
import ErpLayout from '../../layout/ErpLayout';

export default function InvoiceCreate({ config }) {
  const entity = 'supplierinvoice';
  const Labels = {
    PANEL_TITLE: 'invoice',
    DATATABLE_TITLE: 'invoice_list',
    ADD_NEW_ENTITY: 'add_new_invoice',
    ENTITY_NAME: 'invoice',

    RECORD_ENTITY: 'record_payment',
  };

  const configPage = {
    entity,
    ...Labels,
  };
  return (
    <ErpLayout>
      <CreateItem config={configPage} CreateForm={InvoiceForm} />
    </ErpLayout>
  );
}
