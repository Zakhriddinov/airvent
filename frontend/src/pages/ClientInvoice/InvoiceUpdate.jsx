import UpdateInvoiceModule from '@/module/ClientInvoiceModule/UpdateInvoiceModule';

export default function InvoiceUpdate() {
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
  return <UpdateInvoiceModule config={configPage} />;
}
