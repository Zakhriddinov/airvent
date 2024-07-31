import CrudModule from '@/module/CrudModule';
import { fields } from './config';
import DynamicForm from '@/forms/DynamicForm';

export default function Product() {
  const entity = 'products';
  const searchConfig = {
    displayLabels: ['name'],
    searchFields: 'name',
  };

  const deleteModalLabels = ['name'];

  const Labels = {
    MODAL_TITLE: 'Mahsulot yaratish',
    DATATABLE_TITLE: "Mahsulotlar ro'yxati",
    ADD_NEW_ENTITY: "Yangi Mahsulot qo'shish",
    ENTITY_NAME: 'products',
    UPDATE_ENTITY: "Mahsulot ma'lumotlarini o'zgartirish",
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
