import CrudModule from '@/module/CrudModule';
import ProductCategoryForm from '@/forms/ProductCategory';
import { fields } from './config';
export default function ProductCategory() {
  const entity = 'productcategory';
  const searchConfig = {
    displayLabels: ['name', 'code'],
    searchFields: 'name,code',
  };

  const deleteModalLabels = ['name'];

  const Labels = {
    MODAL_TITLE: 'Kategoriya yaratish',
    DATATABLE_TITLE: "Mahsulot kategoriyalari ro'yxati",
    ADD_NEW_ENTITY: "Yangi Kategoriya qo'shish",
    ENTITY_NAME: 'productcategory',
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
      createForm={<ProductCategoryForm />}
      updateForm={<ProductCategoryForm isUpdateForm={true} />}
      config={config}
    />
  );
}
