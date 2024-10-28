export const fields = {
  code: {
    required: true,
    label: 'Kod',
  },
  name: {
    required: true,
    label: 'Nomi',
  },
  currency: {
    required: true,
    label: 'Valyuta',
    type: 'currencySelect',
    disableForTable: true,
  },
  // debtStart: {
  //   label: 'Oy boshiga qarz',
  //   disableForForm: true,
  //   disableForUpdate: true,
  //   type: 'currency',
  // },
  turnover: { label: 'Aylanmasi', disableForForm: true, disableForUpdate: true, type: 'currency' },
  cash: { label: 'Naqd', disableForForm: true, disableForUpdate: true, type: 'currency' },
  click: { label: 'Click', disableForForm: true, disableForUpdate: true, type: 'currency' },
  transfers: {
    label: 'Transferlar',
    disableForForm: true,
    disableForUpdate: true,
    type: 'currency',
  },
  phone: {
    label: 'Telefon raqam',
    disableForTable: true,
  },
  // credit: {
  //   label: 'Xaqqimiz',
  //   disableForForm: true,
  //   disableForUpdate: true,
  //   type: 'currency',
  //   style: {
  //     color: 'green',
  //   },
  // },
  debt: {
    label: 'Qarzimiz',
    disableForForm: true,
    disableForUpdate: true,
    type: 'currency',
    style: {
      color: 'red',
    },
  },
  enabled: {
    type: 'boolean',
    required: true,
    label: 'Holat',
  },
};
