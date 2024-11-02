import CrudModule from '@/module/CrudModule';
import { fields } from './config';
import DynamicForm from '@/forms/DynamicForm';

export default function Position() {
  const entity = 'position';
  const searchConfig = {
    displayLabels: ['name'],
    searchFields: 'name',
  };

  const deleteModalLabels = ['name'];

  const Labels = {
    MODAL_TITLE: 'Lavozim yaratish',
    DATATABLE_TITLE: 'Lavozim',
    ADD_NEW_ENTITY: "Yangi Lavozim qo'shish",
    ENTITY_NAME: 'position',
    UPDATE_ENTITY: "Lavozim ma'lumotlarini o'zgartirish",
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
