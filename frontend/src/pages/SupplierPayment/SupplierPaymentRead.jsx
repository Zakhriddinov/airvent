import ReadPaymentModule from '@/module/InvoicePaymentModule/ReadPaymentModule';

export default function SupplierPaymentRead() {
  const entity = 'supplierpayment';

  const Labels = {
    PANEL_TITLE: 'payment',
    DATATABLE_TITLE: 'payment_list',
    ADD_NEW_ENTITY: 'add_new_payment',
    ENTITY_NAME: 'payment',
  };

  const configPage = {
    entity,
    ...Labels,
  };
  return <ReadPaymentModule config={configPage} />;
}
