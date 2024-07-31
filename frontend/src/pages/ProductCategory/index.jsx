import CrudModule from '@/module/CrudModule';
import { fields } from './config';
import DynamicForm from '@/forms/DynamicForm';

export default function ProductCategory() {
  const entity = 'productcategory';
  const searchConfig = {
    displayLabels: ['name'],
    searchFields: 'name',
  };

  const deleteModalLabels = ['name'];

  const Labels = {
    MODAL_TITLE: 'Kategoriya yaratish',
    DATATABLE_TITLE: "Mahsulot kategoriyalari ro'yxati",
    ADD_NEW_ENTITY: "Yangi Kategoriya qo'shish",
    ENTITY_NAME: 'productcategory',
    UPDATE_ENTITY: "Kategoriya ma'lumotlarini o'zgartirish",
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
      isUpdateForm={true}
    />
  );
}
