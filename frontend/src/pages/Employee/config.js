export const fields = {
  firstname: {
    required: true,
    label: 'Ism',
  },
  lastname: {
    required: true,
    label: 'Familiya',
  },
  position: {
    type: 'async',
    label: 'Lavozim',
    displayLabels: ['position', 'name'],
    dataIndex: ['position', 'name'],
    entity: 'position',
    required: true,
    searchFields: 'name',
    redirectLabel: 'Yangi lavozim yaratish',
    withRedirect: true,
    urlToRedirect: '/employee/position',
  },
  phone: {
    required: true,
    label: 'Telefon raqam',
  },
  dailyWage: {
    required: true,
    label: 'Kunlik maosh',
    type: 'currency',
  },
  enabled: {
    type: 'boolean',
    required: true,
    label: 'Holat',
  },
};
