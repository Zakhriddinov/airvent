import UpdateInvoiceModule from '@/module/InvoiceModule/UpdateInvoiceModule';

export default function InvoiceUpdate() {
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
  return <UpdateInvoiceModule config={configPage} />;
}
