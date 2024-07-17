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
  },
  price: {
    required: true,
    label: 'Narxi (so`m)',
    type: 'currency',
  },
  priceReceived: {
    required: true,
    label: 'Tan narxi (so`m)',
    type: 'currency',
  },
  quantity: {
    type: 'number',
    label: 'Miqdor',
  },
  length: {
    type: 'number',
    label: 'Uzunligi (m)',
  },
  wight: {
    type: 'number',
    label: "Og'irlik (kg)",
  },
  enabled: {
    type: 'boolean',
    required: true,
    label: 'Holat',
  },
};
