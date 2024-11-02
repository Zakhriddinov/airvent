import CrudModule from '@/module/CrudModule';
import { fields } from './config';
import DynamicForm from '@/forms/DynamicForm';

export default function Client() {
  const entity = 'client';
  const searchConfig = {
    displayLabels: ['name'],
    searchFields: 'name',
  };

  const deleteModalLabels = ['name'];

  const Labels = {
    MODAL_TITLE: 'Mijoz yaratish',
    DATATABLE_TITLE: 'Mijoz',
    ADD_NEW_ENTITY: "Yangi Mijoz qo'shish",
    ENTITY_NAME: 'client',
    UPDATE_ENTITY: "Mijoz ma'lumotlarini o'zgartirish",
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
  };
  return (
    <CrudModule
      createForm={<DynamicForm fields={fields} />}
      updateForm={<DynamicForm fields={fields} isUpdateForm={true} />}
      config={config}
    />
  );
}
