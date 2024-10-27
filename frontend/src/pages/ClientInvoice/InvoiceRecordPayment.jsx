
import RecordPaymentModule from '@/module/ClientInvoiceModule/RecordPaymentModule';

export default function InvoiceRecord() {
  const entity = 'clientinvoice';
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
  return <RecordPaymentModule config={configPage} />;
}
