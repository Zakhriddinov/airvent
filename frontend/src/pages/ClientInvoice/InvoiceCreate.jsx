import CreateInvoiceModule from "@/module/ClientInvoiceModule/CreateInvoiceModule";

export default function ClientInvoiceCreate() {
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
  return <CreateInvoiceModule config={configPage} />;
}
