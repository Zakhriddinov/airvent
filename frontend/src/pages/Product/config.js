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
  price: {
    required: true,
    label: 'Narxi (so`m)',
    type: 'currency',
  },
  totalPrice: {
    type: 'currency',
    label: "Umumiy narxi (so'm)",
    disableForForm: true,
    disableForUpdate: true,
  },
  quantity: {
    type: 'quantity',
    label: 'Miqdor',
  },
  enabled: {
    type: 'boolean',
    required: true,
    label: 'Holat',
  },
};
