import ReadInvoiceModule from '@/module/InvoiceModule/ReadInvoiceModule';

export default function InvoiceRead() {
  const entity = 'supplierinvoice';

  const Labels = {
    PANEL_TITLE: 'Hisob faktura',
    DATATABLE_TITLE: 'invoice_list',
    ADD_NEW_ENTITY: 'add_new_invoice',
    ENTITY_NAME: 'Hisob faktura',

    RECORD_ENTITY: 'record_payment',
  };

  const configPage = {
    entity,
    ...Labels,
  };
  return <ReadInvoiceModule config={configPage} />;
}
