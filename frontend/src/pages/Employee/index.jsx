import CrudModule from '@/module/CrudModule';
import { fields } from './config';
import DynamicForm from '@/forms/DynamicForm';

export default function Employee() {
  const entity = 'employee';
  const searchConfig = {
    displayLabels: ['firstname', 'lastname'],
    searchFields: 'firstname,lastname',
  };

  const deleteModalLabels = ['name'];

  const Labels = {
    MODAL_TITLE: 'Xodim yaratish',
    DATATABLE_TITLE: "Xodimlar ro'yxati",
    ADD_NEW_ENTITY: "Yangi Xodim qo'shish",
    ENTITY_NAME: 'employee',
    UPDATE_ENTITY: "Xodim ma'lumotlarini o'zgartirish",
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
