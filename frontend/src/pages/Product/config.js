export const fields = {
  code: {
    required: true,
    label: 'Kod',
  },
  name: {
    required: true,
    label: 'Nomi',
  },
  productCategory: {
    type: 'async',
    label: 'Kategoriya',
    displayLabels: ['productCategory', 'name'],
    dataIndex: ['productCategory', 'name'],
    entity: 'productcategory',
    required: true,
    redirectLabel: 'Yangi Kategoriya yaratish',
    withRedirect: true,
    urlToRedirect: '/product/category',
  },
  quantityUnit: {
    required: true,
    label: "O'lchov birligi",
    disableForForm: true,
    disableForUpdate: true,
  },
  quantity: {
    required: true,
    type: 'quantity',
    label: 'Miqdor',
  },
  price: {
    required: true,
    label: 'Narx',
    type: 'currency',
  },
  totalPrice: {
    type: 'currency',
    label: 'Umumiy narx',
    disableForForm: true,
    disableForUpdate: true,
  },
  supplier: {
    type: 'async',
    label: 'Yetkazib beruvchi',
    displayLabels: ['supplier', 'name'],
    dataIndex: ['supplier', 'name'],
    entity: 'supplier',
    redirectLabel: 'Yangi Yetkazib beruvchi yaratish',
    withRedirect: true,
    urlToRedirect: '/supplier/list',
    disableForTable: true,
  },
  enabled: {
    type: 'boolean',
    required: true,
    label: 'Holat',
  },
};
