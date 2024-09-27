import RecordPaymentModule from '@/module/InvoiceModule/RecordPaymentModule';

export default function InvoiceRecordPayment() {
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
  return <RecordPaymentModule config={configPage} />;
}
