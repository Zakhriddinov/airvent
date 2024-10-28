import CrudModule from '@/module/CrudModule';
import { fields } from './config';
import DynamicForm from '@/forms/DynamicForm';

export default function Supplier() {
  const entity = 'supplier';
  const searchConfig = {
    displayLabels: ['name'],
    searchFields: 'name',
  };

  const deleteModalLabels = ['name'];

  const Labels = {
    MODAL_TITLE: 'Yetkazib beruvchini yaratish',
    DATATABLE_TITLE: 'Yetkazib beruvchilar',
    ADD_NEW_ENTITY: "Yangi Yetkazib beruvchi qo'shish",
    ENTITY_NAME: 'supplier',
    UPDATE_ENTITY: "Yetkazib beruvchini ma'lumotlarini o'zgartirish",
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
    sortBy: 'code',
    sortValue: 'asc',
    withoutDeleteBtn: true,
  };

  return (
    <CrudModule
      createForm={<DynamicForm fields={fields} />}
      updateForm={<DynamicForm fields={fields} isUpdateForm={true} />}
      config={config}
    />
  );
}
