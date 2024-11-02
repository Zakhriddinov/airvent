import CrudModule from '@/module/CrudModule';
import { fields } from './config';
import DynamicForm from '@/forms/DynamicForm';

export default function PaymentMode() {
  const entity = 'paymentmode';
  const searchConfig = {
    displayLabels: ['name'],
    searchFields: 'name',
  };

  const deleteModalLabels = ['name'];

  const Labels = {
    MODAL_TITLE: "To'lov usulini yaratish",
    DATATABLE_TITLE: "To'lov usullari",
    ADD_NEW_ENTITY: "Yangi To'lov usuli qo'shish",
    ENTITY_NAME: 'paymentmode',
    UPDATE_ENTITY: "To'lov usuli ma'lumotlarini o'zgartirish",
  };

  const configPage = {
    entity,
    ...Labels,
  };
  const config = {
    ...configPage,
    fields,
    searchConfig,
    deleteModalLabels,
  };
  return (
    <CrudModule
      createForm={<DynamicForm fields={fields} />}
      updateForm={<DynamicForm fields={fields} isUpdateForm={true} />}
      config={config}
    />
  );
}
