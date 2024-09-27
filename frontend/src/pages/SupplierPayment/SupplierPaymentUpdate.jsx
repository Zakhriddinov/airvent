import UpdatePaymentModule from "@/module/InvoicePaymentModule/UpdatePaymentModule";

export default function SupplierPaymentUpdate() {
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
  return <UpdatePaymentModule config={configPage} />;
}
